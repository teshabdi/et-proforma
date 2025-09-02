<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AboutUsController extends Controller
{
    public function index()
    {
        return response()->json([
            'about_us' => 'We are a leading company in eCommerce...'
        ]);
    }
}
