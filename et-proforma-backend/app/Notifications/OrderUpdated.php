<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Broadcasting\PrivateChannel;

class OrderUpdated extends Notification implements ShouldBroadcast
{
    use Queueable;

    protected $order;

    public function __construct($order)
    {
        $this->order = $order;
    }

    public function via($notifiable)
    {
        return ['database', 'broadcast'];
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'order',
            'message' => "Your order #{$this->order->id} status changed to {$this->order->status}.",
            'order_id' => $this->order->id,
            'status' => $this->order->status,
        ];
    }

    public function broadcastOn()
    {
        return new PrivateChannel('notifications.' . $this->order->customer->user_id);
    }

    public function broadcastAs()
    {
        return 'notification.received';
    }
}
