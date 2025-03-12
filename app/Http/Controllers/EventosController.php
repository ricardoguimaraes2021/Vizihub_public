<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Eventos;



class EventosController extends Controller
{
   
    public function getAllActive()
    {
        $eventos = Eventos::where('active', 1)->get();

        if ($eventos->isEmpty()) {
            return response()->json(['message' => 'Nenhum evento ativo encontrado'], 404);
        }

        return response()->json($eventos, 200);
    }


    public function createEvento(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'event_type_id' => 'required|integer',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'maximum_qty' => 'nullable|integer|min:1',
            'location' => 'required|string|max:255',
            'event_date' => 'required|date|after:today',
            'deadline_date' => 'required|date|before_or_equal:event_date',
            'created_by' => 'required|integer|exists:users,id',
            'active' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $evento = Eventos::create($request->all());

        return response()->json(['message' => 'Evento criado com sucesso!', 'evento' => $evento], 201);
    }
    
}
