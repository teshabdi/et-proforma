<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Supplier extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'company_name', 'business_type',
        'contact_number', 'document_path'
    ];

  public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
public function products()
{
    return $this->hasMany(Product::class);
}
}
