<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    /**
     * Get the authenticated user's inbox (list of users they have conversations with).
     */
    public function inbox()
    {
        $user = Auth::user();

        // Get unique users the authenticated user has messaged or received messages from
        $conversations = Message::where('sender_id', $user->id)
            ->orWhere('receiver_id', $user->id)
            ->with(['sender', 'receiver'])
            ->get()
            ->groupBy(function ($message) use ($user) {
                // Group by the other user's ID (sender or receiver, excluding self)
                return $message->sender_id === $user->id ? $message->receiver_id : $message->sender_id;
            })
            ->map(function ($messages, $userId) use ($user) {
                $otherUser = User::find($userId);
                $latestMessage = $messages->sortByDesc('created_at')->first();
                $unreadCount = $messages->where('receiver_id', $user->id)
                                       ->where('is_read', false)
                                       ->count();

                return [
                    'user_id' => $userId,
                    'user_name' => $otherUser->name ?? 'Unknown',
                    'latest_message' => [
                        'content' => $latestMessage->content,
                        'created_at' => $latestMessage->created_at,
                        'is_read' => $latestMessage->is_read,
                        'sent_by_me' => $latestMessage->sender_id === $user->id,
                    ],
                    'unread_count' => $unreadCount,
                ];
            })
            ->values();

        return response()->json($conversations);
    }

    /**
     * Get the conversation between the authenticated user and another user.
     */
    public function conversation($userId)
    {
        $currentUser = Auth::id();

        // Validate that the other user exists and has a different role
        $otherUser = User::find($userId);
        if (!$otherUser) {
            return response()->json(['error' => 'User not found'], 404);
        }
        if ($otherUser->role === Auth::user()->role) {
            return response()->json(['error' => 'Messaging allowed only between customer and supplier'], 403);
        }

        // Fetch messages between the two users
        $messages = Message::where(function ($query) use ($currentUser, $userId) {
            $query->where('sender_id', $currentUser)
                  ->where('receiver_id', $userId);
        })->orWhere(function ($query) use ($currentUser, $userId) {
            $query->where('sender_id', $userId)
                  ->where('receiver_id', $currentUser);
        })->with(['sender', 'receiver'])
          ->orderBy('created_at', 'asc')
          ->get();

        // Mark messages as read (only those sent to the current user)
        Message::where('receiver_id', $currentUser)
               ->where('sender_id', $userId)
               ->where('is_read', false)
               ->update(['is_read' => true]);

        return response()->json($messages);
    }

    /**
     * Store a new message.
     */
   public function store(Request $request)
{
    $validated = $request->validate([
        'receiver_id' => 'required|exists:users,id',
        'content' => 'required|string|max:1000',
    ]);

    $sender = Auth::user();
    $receiver = User::find($validated['receiver_id']);

    if ($sender->role === $receiver->role) {
        return response()->json(['error' => 'Messaging allowed only between customer and supplier'], 403);
    }

    $message = Message::create([
        'sender_id' => $sender->id,
        'receiver_id' => $validated['receiver_id'],
        'content' => $validated['content'],
        'is_read' => false,
    ]);

    $message->load('sender', 'receiver');

    // Comment out broadcasting temporarily
    // broadcast(new MessageSent($message))->toOthers();

    return response()->json($message, 201);
}

    /**
     * Mark a specific message as read.
     */
    public function markAsRead(Message $message)
    {
        $user = Auth::user();

        // Ensure the user is the receiver of the message
        if ($message->receiver_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if (!$message->is_read) {
            $message->update(['is_read' => true]);
        }

        return response()->json(['message' => 'Message marked as read']);
    }
}