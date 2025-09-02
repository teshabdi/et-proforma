<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\Payment;
use App\Models\Order;
use Chapa\Chapa\Facades\Chapa as Chapa;
use Illuminate\Support\Facades\Http;

class PaymentController extends Controller
{
    // Initiate payment
    public function pay(Request $request)
{
    $data = [
        'amount' => $request->amount,
        'email' => $request->email,
        'first_name' => $request->first_name,
        'last_name' => $request->last_name,
        'tx_ref' => 'tx-' . Str::random(12),
        'currency' => 'ETB',
        'callback_url' => route('payment.callback'),
        'return_url' => url('/payment/success'),
        'customization' => [
            'title' => 'Order Payment',
            'description' => 'Payment for order #' . $request->order_id,
        ],
    ];

    $response = Http::withHeaders([
        'Authorization' => 'Bearer ' . env('CHAPA_SECRET_KEY'),
    ])->post('https://api.chapa.co/v1/transaction/initialize', $data);

    if ($response->successful()) {
        return response()->json([
            'checkout_url' => $response['data']['checkout_url']
        ]);
    }

    return response()->json(['message' => 'Payment initialization failed'], 500);
}

    /**
     * Callback from Chapa
     */
    public function callback(Request $request)
    {
        $tx_ref = $request->get('tx_ref');

        if (!$tx_ref) {
            return response()->json(['message' => 'Missing tx_ref'], 400);
        }

        $result = Chapa::verifyTransaction($tx_ref);

        $payment = Payment::where('tx_ref', $tx_ref)->first();

        if ($result['status'] === 'success') {
            // ✅ Update payment record
            if ($payment) {
                $payment->update([
                    'status' => 'success',
                    'payload' => $result
                ]);
            }

            // ✅ Update order status
            if ($payment && $payment->order) {
                $payment->order->update(['status' => 'paid']);
            }

            return response()->json(['message' => 'Payment verified successfully']);
        }

        // Mark as failed
        if ($payment) {
            $payment->update([
                'status' => 'failed',
                'payload' => $result
            ]);
        }

        return response()->json(['message' => 'Payment verification failed'], 400);
    }
}
