<?php

namespace App\Http\Controllers;

use App\Models\RFQ;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RFQController extends Controller
{
    // Customer submits RFQ
    public function store(Request $request)
{
    $user = Auth::user();

    if ($user->role !== 'customer') {
        return response()->json(['error' => 'Only customers can create RFQs'], 403);
    }

    if (! $user->customer) {
    return response()->json(['error' => 'Customer profile not found'], 400);
}

    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'nullable|string',
    ]);

    $rfq = RFQ::create([
        'customer_id' => $user->customer->id,
        'title' => $validated['title'],
        'description' => $validated['description'] ?? null,
    ]);

    return response()->json($rfq, 201);
}

    // View all RFQs (suppliers can browse open RFQs)
    public function index()
    {
        return response()->json(RFQ::with('customer')->where('status', 'open')->get());
    }

    // View a single RFQ
    public function show(RFQ $rfq)
    {
        return response()->json($rfq->load(['customer', 'responses.supplier']));
    }

    // Customer closes RFQ
    public function close(RFQ $rfq)
    {
        $user = Auth::user();
        if ($user->role !== 'customer' || $rfq->customer_id !== $user->customer->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $rfq->update(['status' => 'closed']);
        return response()->json(['message' => 'RFQ closed']);
    }
}

