<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RFQ extends Model
{
    use HasFactory;
    protected $table = 'rfqs';
    protected $fillable = ['customer_id', 'title', 'description', 'status'];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function responses()
    {
        return $this->hasMany(RFQResponse::class, 'rfq_id');
    }
    
}
