<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;


class Eventos extends Model
{
    use HasFactory;

    protected $table = 'events';

    protected $fillable = [
        'event_type_id',
        'title',
        'description',
        'maximum_qty',
        'location',
        'event_date',
        'deadline_date',
        'created_by',
        'active',
        'created_at'
    ];

    public $timestamps = false;


    /*public function eventType()
    {
        return $this->belongsTo(EventType::class, 'event_type_id');
    }*/


    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
