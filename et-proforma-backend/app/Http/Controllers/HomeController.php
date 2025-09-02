<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {
        return response()->json([
            'message' => 'Welcome to our homepage!',
            'featured_products' => []  // Add featured products logic
        ]);
    }
}
