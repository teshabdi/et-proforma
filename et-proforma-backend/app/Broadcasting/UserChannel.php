<?php

namespace App\Broadcasting;

use App\Models\User;

class UserChannel
{
    /**
     * Create a new channel instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Authorize the user to join the channel.
     *
     * @param  \App\Models\User  $user
     * @param  string  $id
     * @return bool
     */
    public function join(User $user, $id)
    {
        return $user->id === (int) $id;
    }
}