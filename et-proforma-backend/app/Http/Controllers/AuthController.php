<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Customer;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'role' => 'required|in:customer,supplier',
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $data['role'],
        ]);

        if ($user->role === 'customer') {
            Customer::create([
                'user_id' => $user->id,
                'industry' => $request->industry ?? null,
                'contact_number' => $request->contact_number ?? null,
            ]);
        }

        if ($user->role === 'supplier') {
            $request->validate([
                'company_name' => 'required',
            ]);
            Supplier::create([
                'user_id' => $user->id,
                'company_name' => $request->company_name,
                'business_type' => $request->business_type ?? null,
                'contact_number' => $request->contact_number ?? null,
                'document_path' => $request->document_path ?? null,
            ]);
        }

        $token = $user->createToken('api_token')->plainTextToken;

        return response()->json(['user' => $user->load($user->role), 'token' => $token], 201);
    }

    public function login(Request $request)
{
    $credentials = $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    // Use the 'web' guard for attempt()
    if (!Auth::guard('web')->attempt($credentials)) {
        return response()->json(['error' => 'Invalid credentials'], 401);
    }

    /** @var \App\Models\User $user */
    $user = Auth::guard('web')->user();

    // Create Sanctum token
    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'token' => $token,
        'user'  => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role, // return role
        ],
        'redirect_to' => $user->role === 'supplier'
            ? '/supplier/dashboard'
            : '/customer/dashboard', // frontend can redirect based on role
    ]);
}
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }
}
