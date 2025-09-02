<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory; // 👈 add this
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use App\Models\CartItem;

/**
 * @property \Illuminate\Notifications\DatabaseNotificationCollection $notifications
 * @property \Illuminate\Notifications\DatabaseNotificationCollection $unreadNotifications
 * @method void notify(\Illuminate\Notifications\Notification $instance)
 * @method \Laravel\Sanctum\NewAccessToken createToken(string $name, array $abilities = [])
 */
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable; // 👈 add HasFactory here

    protected $fillable = ['name', 'email', 'password', 'role'];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function customer()
    {
        return $this->hasOne(Customer::class, 'user_id');
    }

    public function supplier()
    {
        return $this->hasOne(Supplier::class, 'user_id');
    }
     public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    // app/Models/User.php
public function sentMessages() {
    return $this->hasMany(Message::class, 'sender_id');
}

public function receivedMessages() {
    return $this->hasMany(Message::class, 'receiver_id');
}
  public function join(User $user, $id)
    {
        return $user->id === (int) $id;
    }
}
