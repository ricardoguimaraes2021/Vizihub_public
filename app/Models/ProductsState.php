<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductsState extends Model
{
    use HasFactory;

    protected $table = 'products_state';

    protected $fillable = ['name'];
}

