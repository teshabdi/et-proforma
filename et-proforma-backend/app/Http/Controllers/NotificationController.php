<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\NotificationResource;

class NotificationController extends Controller
{
public function index(Request $request)
    {
        return NotificationResource::collection(
            $request->user()->notifications()->latest()->get()
        );
    }

    public function unread(Request $request)
    {
        return NotificationResource::collection(
            $request->user()->unreadNotifications()->latest()->get()
        );
    }

    public function markRead(Request $request, $id)
    {
        $notification = $request->user()->notifications()->findOrFail($id);
        $notification->markAsRead();

        return response()->json([
            'message' => 'Marked as read',
            'notification' => new NotificationResource($notification)
        ]);
    }
}
