<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class DashboardController extends Controller
{
    public function index()
    {
        if (!Auth::check()) {
            return response()->json(['error' => 'Não autenticado'], 401);
        }

        return response()->json([
            'user' => Auth::user()
        ]);    
    }
}
