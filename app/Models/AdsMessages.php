<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdsMessages extends Model
{
    use HasFactory;

    protected $table = 'ads_messages'; 

    protected $fillable = [
        'chat_id',   
        'sent_by', 
        'message',  
        'date_time', 
        'read',     
    ];

    public $timestamps = false; 

    public function chat()
    {
        return $this->belongsTo(Chat::class, 'chat_id');
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'sent_by');
    }
}
