<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Categories;
use App\Models\ProductsState;
use App\Models\User;


class AdsChat extends Model
{

    use HasFactory;
    protected $table = 'ads_chats'; 


    protected $fillable = ['ad_id', 'buyer_id', 'seller_id'];


    public $timestamps = false;


    public function messages()
    {
        return $this->hasMany(AdsMessages::class, 'chat_id');
    }

    public function ad()
    {
        return $this->belongsTo(Ads::class, 'ad_id');
    }

    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }
}

