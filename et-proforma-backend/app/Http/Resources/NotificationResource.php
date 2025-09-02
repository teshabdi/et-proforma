<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->data['type'] ?? null,
            'message' => $this->data['message'] ?? null,
            'meta' => $this->data, // full JSON payload for flexibility
            'read_at' => $this->read_at,
            'created_at' => $this->created_at,
        ];
    }
}
