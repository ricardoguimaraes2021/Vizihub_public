<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Ads;


class AdsFavorite extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'user_id', 
        'ad_id',
        'active',
    ];

    public $timestamps = false; 

    public function ad()
    {
        return $this->belongsTo(Ads::class, 'ad_id');
    }
}
