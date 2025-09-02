<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RFQResponse extends Model
{
    use HasFactory;
     protected $table = 'rfq_responses';
    protected $fillable = ['rfq_id', 'supplier_id', 'price', 'quantity', 'message'];

     public function rfq()
    {
        return $this->belongsTo(RFQ::class, 'rfq_id');
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }
}
