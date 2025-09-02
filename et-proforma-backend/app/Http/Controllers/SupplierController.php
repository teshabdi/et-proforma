<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\RFQ;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;

class SupplierController extends Controller
{
    public function myProducts(Request $request)
    {
        $user = Auth::user();
        $supplierId = $user->supplier ? $user->supplier->id : null;

        if (!$supplierId) {
            return response()->json(['data' => []]);
        }

        $products = Product::where('supplier_id', $supplierId)
            ->latest()
            ->get();

        return response()->json([
            'data' => $products
        ]);
    }

    public function myRFQs(Request $request)
    {
        // Adjusted to show all available RFQs, assuming 'available' means all open RFQs not filtered by supplier
        $rfqs = RFQ::latest()
            ->get();

        return response()->json([
            'data' => $rfqs
        ]);
    }

    public function myOrders(Request $request)
    {
        $user = Auth::user();
        $supplierId = $user->supplier ? $user->supplier->id : null;

        if (!$supplierId) {
            return response()->json(['data' => []]);
        }

        $orders = Order::where('supplier_id', $supplierId)
            ->latest()
            ->get();

        return response()->json([
            'data' => $orders
        ]);
    }
    
}
