<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\CartItem;
use App\Models\User;

class CartController extends Controller
{
     public function index()
     {
         /** @var User $user */
         $user = Auth::user();
         if (!$user) {
             return response()->json(['error' => 'Unauthorized'], 401);
         }
         $cartItems = $user->cartItems()->with('product')->get();
         return response()->json($cartItems);
     }

    // Add an item to the cart
    public function store(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Validate the request
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        // Check if the item already exists in the cart
        $cartItem = CartItem::where('user_id', Auth::id())
                            ->where('product_id', $validated['product_id'])
                            ->first();

        if ($cartItem) {
            // If the product is already in the cart, update the quantity
            $cartItem->quantity += $validated['quantity'];
            $cartItem->save();
        } else {
            // If the product isn't in the cart, create a new cart item
            CartItem::create([
                'user_id' => Auth::id(),
                'product_id' => $validated['product_id'],
                'quantity' => $validated['quantity'],
            ]);
        }

        return response()->json(['message' => 'Item added to cart']);
    }

    // Remove an item from the cart
    public function destroy($id)
    {
        if (!Auth::check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $cartItem = CartItem::where('user_id', Auth::id())->findOrFail($id);
        $cartItem->delete();

        return response()->json(['message' => 'Item removed from cart']);
    }

    // Update the quantity of an item in the cart
   
    public function update(Request $request, $id)
{
    if (!Auth::check()) {
        return response()->json(['error' => 'Unauthorized'], 401);
    }

    $validated = $request->validate([
        'quantity' => 'required|integer|min:1',
    ]);

    $cartItem = CartItem::where('user_id', Auth::id())->findOrFail($id);
    $product = $cartItem->product;

    if ($validated['quantity'] > $product->stock) {
        return response()->json(['message' => 'Quantity exceeds available stock'], 400);
    }

    $cartItem->quantity = $validated['quantity'];
    $cartItem->save();

    return response()->json(['message' => 'Cart item updated']);
}
}
