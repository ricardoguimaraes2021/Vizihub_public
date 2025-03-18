<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Categories;
use App\Models\ProductsState;
use App\Models\User;


class Ads extends Model
{
    use HasFactory;

    protected $table = 'ads'; 

    protected $fillable = [
        'title',
        'description',
        'state_product_id',
        'price',
        'category_id',
        'status_id',
        'created_by',
        'created_at',
    ];


    public $timestamps = false;


    public function category()
    {
        return $this->belongsTo(Categories::class, 'category_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function state()
    {
        return $this->belongsTo(ProductsState::class, 'state_product_id');
    }

    public function status()
    {
        return $this->belongsTo(AdsStatus::class, 'status_id');
    }
}
