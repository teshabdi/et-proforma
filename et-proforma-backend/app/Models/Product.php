<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'supplier_id',
        'name',
        'description',
        'price',
        'stock',
        'category',
        'image',
    ];

    protected $appends = ['image_url'];

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    // Accessor to return full image URL
    public function getImageUrlAttribute()
    {
        if ($this->image && Storage::disk('public')->exists("products/{$this->image}")) {
            return asset("storage/products/{$this->image}");
        }
        return null;
    }
}