<?php

namespace App\Http\Controllers\backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Admin;

class AdminRegisterController extends Controller
{
    public function showRegisterForm()
    {
        return view('admin.register'); // Blade view for registration
    }

    public function register(Request $req)
    {
        $req->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:admins',
            'password' => 'required|string|min:6|confirmed',
        ]);

        Admin::create([
            'name'     => $req->name,
            'email'    => $req->email,
            'password' => Hash::make($req->password),
        ]);

        return redirect()->route('admin.login')->with('status', 'Admin registered successfully. Please log in.');
    }
}
