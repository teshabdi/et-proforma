<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Notifications\OrderUpdated;

class OrderController extends Controller
{
    public function index(Request $r) {
        $u = $r->user();

        if ($u->role === 'customer') {
            return Order::where('customer_id', $u->customer->id)
                ->with(['items.product','supplier.user'])
                ->latest()->get();
        }

        if ($u->role === 'supplier') {
            return Order::where('supplier_id', $u->supplier->id)
                ->with(['items.product','customer.user'])
                ->latest()->get();
        }

        abort(403);
    }

    // Customer creates an order
    public function store(Request $r) {
        $u = $r->user();
        abort_unless($u->role === 'customer', 403);

        $data = $r->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1'
        ]);

        $subtotal = 0;
        $itemsData = [];

        foreach ($data['items'] as $it) {
            $product = Product::findOrFail($it['product_id']);
            $lineTotal = $product->price * $it['quantity'];

            $itemsData[] = [
                'product_id' => $product->id,
                'quantity' => $it['quantity'],
                'unit_price' => $product->price,
                'line_total' => $lineTotal
            ];

            $subtotal += $lineTotal;

            // Decrease stock
            $product->decrement('stock', $it['quantity']);
        }

        $order = Order::create([
            'customer_id' => $u->customer->id,
            'supplier_id' => $data['supplier_id'],
            'subtotal' => $subtotal,
            'total' => $subtotal,
            'status' => 'pending'
        ]);

        foreach ($itemsData as $item) {
            $item['order_id'] = $order->id;
            OrderItem::create($item);
        }

        return $order->load(['items.product','supplier.user']);
    }

    // Update order status
    public function updateStatus(Request $request, Order $order) {
    $request->validate(['status' => 'required|in:approved,shipped,delivered,cancelled']);
    $user = $request->user();

    // Check if the user is a supplier and is authorized to update the order
    if ($user->role === 'supplier' && $order->supplier_id === $user->supplier->id) {
        $order->update(['status' => $request->status]);
        // Notify customer about the order status update
        $order->customer->user->notify(new OrderUpdated($order));
        return response()->json($order);
    }

    // Check if the user is a customer and is canceling the order
    if ($user->role === 'customer' && $order->customer_id === $user->customer->id && $request->status === 'cancelled') {
        $order->update(['status' => 'cancelled']);
        // Notify customer about the order cancellation
        $order->customer->user->notify(new OrderUpdated($order));
        return response()->json($order);
    }

    // If the user is not authorized, abort with a 403 status
    abort(403, 'Unauthorized action.');
}
}
