<?php

namespace App\Http\Controllers\backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    public function login(Request $req)
    {
        $credentials = $req->only('email', 'password');

        if (Auth::guard('admin')->attempt($credentials, $req->filled('remember'))) {
            return redirect()->route('dashboard'); // send to dashboard
        }

        return back()->with('status', 'Invalid email or password.');
    }

    public function logout(Request $req)
    {
        Auth::guard('admin')->logout();
        $req->session()->invalidate();
        $req->session()->regenerateToken();

        return redirect()->route('admin.login');
    }
}
