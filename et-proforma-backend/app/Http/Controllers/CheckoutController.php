<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Product;
use Chapa\Chapa\Facades\Chapa as Chapa;

class CheckoutController extends Controller
{
    public function checkout(Request $r)
    {
        $u = $r->user();
        abort_unless($u->role === 'customer', 403);

        $data = $r->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'shipping' => 'required|array',
            'shipping.fullName' => 'required|string',
            'shipping.email' => 'required|email',
            'shipping.phone' => 'required|string',
            'shipping.address' => 'required|string',
            'shipping.city' => 'required|string',
            'shipping.region' => 'required|string',
            'shipping.shippingCost' => 'required|numeric|min:0',
        ]);

        $subtotal = 0;
        $itemsData = [];
        $supplierId = null;

        foreach ($data['items'] as $it) {
            $product = Product::findOrFail($it['product_id']);

            if ($product->stock < $it['quantity']) {
                return response()->json(['message' => 'Insufficient stock for product ' . $product->name], 400);
            }

            if (!$supplierId) {
                $supplierId = $product->supplier_id;
            } elseif ($supplierId !== $product->supplier_id) {
                return response()->json(['message' => 'All products must be from the same supplier'], 400);
            }

            $lineTotal = $product->price * $it['quantity'];

            $itemsData[] = [
                'product_id' => $product->id,
                'quantity'   => $it['quantity'],
                'unit_price' => $product->price,
                'line_total' => $lineTotal,
                'supplier_id'=> $product->supplier_id,
            ];

            $subtotal += $lineTotal;
        }

        $tax = $subtotal * 0.15;
        $shippingCost = $data['shipping']['shippingCost'];
        $total = $subtotal + $tax + $shippingCost;

        // ✅ Create the order
        $order = Order::create([
            'customer_id' => $u->customer->id,
            'supplier_id' => $supplierId,
            'subtotal'    => $subtotal,
            'tax'         => $tax,
            'shipping_cost' => $shippingCost,
            'shipping_info' => $data['shipping'],
            'total'       => $total,
            'status'      => 'pending',
        ]);

        foreach ($itemsData as $item) {
            $item['order_id'] = $order->id;
            OrderItem::create($item);
        }

        // Decrement stock after order creation
        foreach ($data['items'] as $it) {
            $product = Product::findOrFail($it['product_id']);
            $product->decrement('stock', $it['quantity']);
        }

        // ✅ Initiate Chapa payment
        $tx_ref = 'b2b_' . Str::uuid();

        $first_name = explode(' ', $data['shipping']['fullName'])[0] ?? 'Customer';
        $last_name = explode(' ', $data['shipping']['fullName'])[1] ?? 'User';

        $chapaData = [
            'amount' => $order->total,
            'currency' => 'ETB',
            'email' => $data['shipping']['email'],
            'first_name' => $first_name,
            'last_name' => $last_name,
            'tx_ref' => $tx_ref,
            'callback_url' => route('payment.callback'),
            'return_url' => config('app.url') . '/payment/success',
            'customization' => [
                'title' => 'Order Payment',
                'description' => 'Payment for Order ' . $order->id,
            ]
        ];

        try {
            $response = Chapa::initializePayment($chapaData);

            if ($response['status'] === 'success') {
                // 🔹 Store initiated payment
                $payment = Payment::create([
                    'order_id' => $order->id,
                    'provider' => 'chapa',
                    'tx_ref' => $tx_ref,
                    'checkout_url' => $response['data']['checkout_url'],
                    'status' => 'initiated',
                    'payload' => $response
                ]);

                return response()->json([
                    'order' => $order,
                    'checkout_url' => $response['data']['checkout_url'],
                    'tx_ref' => $tx_ref,
                ]);
            }

            return response()->json([
                'message' => 'Payment initiation failed',
                'details' => $response
            ], 400);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Payment error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $order = Order::create([
            'customer_id' => auth()->id(),
            'status' => 'pending',
            'total' => 0,
        ]);

        $total = 0;

        foreach ($request->items as $item) {
            $product = Product::findOrFail($item['product_id']);
            $lineTotal = $product->price * $item['quantity'];
            $total += $lineTotal;

            $order->items()->create([
                'product_id' => $product->id,
                'quantity' => $item['quantity'],
                'unit_price' => $product->price,
                'line_total' => $lineTotal,
                'supplier_id' => $product->supplier_id ?? null,
            ]);
        }

        $order->update(['total' => $total]);

        return response()->json(['order' => $order], 201);
    }
}