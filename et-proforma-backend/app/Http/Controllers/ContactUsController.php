<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ContactMessage;

class ContactUsController extends Controller
{
    public function store(Request $request)
    {
        // Validate the request data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string|min:10',
        ]);

        // Create a new contact message entry in the database
        $contactMessage = ContactMessage::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'message' => $validated['message'],
        ]);

        return response()->json([
            'message' => 'Thank you for contacting us! We will get back to you shortly.',
            'data' => $contactMessage,
        ]);
    }

    // View all contact messages (admin only)
    public function index()
    {
        $contactMessages = ContactMessage::all();
        return response()->json($contactMessages);
    }
}
