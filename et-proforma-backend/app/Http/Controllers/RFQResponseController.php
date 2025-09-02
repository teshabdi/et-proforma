<?php

namespace App\Http\Controllers;

use App\Models\RFQ;
use App\Models\RFQResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RFQResponseController extends Controller
{
    // Supplier responds to RFQ
    public function store(Request $request, RFQ $rfq)
    {
        $user = Auth::user();
        if ($user->role !== 'supplier') {
            return response()->json(['error' => 'Only suppliers can respond to RFQs'], 403);
        }

        if ($rfq->status !== 'open') {
            return response()->json(['error' => 'RFQ is closed'], 400);
        }

        $validated = $request->validate([
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:1',
            'message' => 'nullable|string',
        ]);

        $response = RFQResponse::create([
            'rfq_id' => $rfq->id,
            'supplier_id' => $user->supplier->id,
            'price' => $validated['price'],
            'quantity' => $validated['quantity'],
            'message' => $validated['message'] ?? null,
        ]);

        return response()->json($response, 201);
    }
}

