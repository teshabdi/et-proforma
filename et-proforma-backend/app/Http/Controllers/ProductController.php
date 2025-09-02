<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    // Supplier creates product
    public function store(Request $request)
    {
        $user = Auth::user();

        if ($user->role !== 'supplier') {
            return response()->json(['error' => 'Only suppliers can add products'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'category' => 'required|string|max:255', // Added category validation
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $imageName = null;
        if ($request->hasFile('image')) {
            $imageName = time() . '_' . uniqid() . '.' . $request->image->extension();
            $request->image->storeAs('products', $imageName, 'public');
        }

        $product = Product::create([
            'supplier_id' => $user->supplier->id,
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'price' => $validated['price'],
            'stock' => $validated['stock'],
            'category' => $validated['category'],
            'image' => $imageName,
        ]);

        return response()->json($product->load('supplier.user'), 201);
    }

    // Supplier updates product
    public function update(Request $request, Product $product)
    {
        $user = Auth::user();

        if ($user->role !== 'supplier' || $product->supplier_id !== $user->supplier->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'stock' => 'sometimes|integer|min:0',
            'category' => 'sometimes|string|max:255',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($product->image && Storage::disk('public')->exists('products/' . $product->image)) {
                Storage::disk('public')->delete('products/' . $product->image);
            }

            $imageName = time() . '_' . uniqid() . '.' . $request->image->extension();
            $request->image->storeAs('products', $imageName, 'public');
            $validated['image'] = $imageName;
        }

        $product->update($validated);

        return response()->json($product->load('supplier.user'));
    }

    // Supplier deletes product
    public function destroy(Product $product)
    {
        $user = Auth::user();

        if ($user->role !== 'supplier' || $product->supplier_id !== $user->supplier->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if ($product->image && Storage::disk('public')->exists('products/' . $product->image)) {
            Storage::disk('public')->delete('products/' . $product->image);
        }

        $product->delete();
        return response()->json(['message' => 'Product deleted']);
    }

    // Public: Customers can browse products
    public function index()
    {
        return response()->json(Product::with('supplier.user')->get());
    }

    // Public: Show product details
    public function show(Product $product)
    {
        return response()->json($product->load('supplier.user'));
    }
    public function available()
{
    $products = Product::where('stock', '>', 0)->with('supplier')->get();
    return response()->json(['data' => $products]);
}
}