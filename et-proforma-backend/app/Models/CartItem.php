<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Product;
use App\Models\User;

class CartItem extends Model
{
    use HasFactory;
     protected $fillable = [
        'user_id', // User who owns the cart
        'product_id', // Product added to the cart
        'quantity', // Quantity of the product
    ];

    // Define the relationship between CartItem and Product
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // Define the relationship between CartItem and User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
