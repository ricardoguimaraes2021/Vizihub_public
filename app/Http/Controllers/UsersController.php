<?php

namespace App\Http\Controllers;
use App\Http\Requests\UsersRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;


class UsersController extends Controller
{
    public function getAllUsers(Request $request)
    {
        $users = User::all();

        return response()->json([
            'user' => $users,
        ], 200);
    }

    public function getAllUsersActive(Request $request)
    {
        $users = User::where('active', 1)->get();

        return response()->json([
            'user' => $users,
        ], 200);
    }

    
    public function addUser(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|string|email|max:100|unique:users',
            'password' => 'required|string|min:6',
            'dob' => 'nullable|date',
            'house_number' => 'nullable|string|max:10',
            'nif' => 'nullable|integer',
            'role' => 'nullable|integer',
        ]);
    
        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['nif']),
            'dob' => $request->dob,
            'house_number' => $request->house_number,
            'nif' => $request->nif,
            'role' => $request->role ?? 2,
            'token_pass' => null,
            'active' => 1,
            'last_login' => null,
        ]);
    
        return response()->json([
            'message' => 'Utilizador adicionado com sucesso!',
            'user' => $user
        ], 201);
    }
    
    public function editUser(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'Utilizador não encontrado.'
            ], 404);
        }

        $validatedData = $request->validate([
            'name' => 'sometimes|string|max:100',
            'email' => 'sometimes|string|email|max:100|unique:users,email,' . $id,
            'password' => 'nullable|string|min:6',
            'dob' => 'nullable|date',
            'house_number' => 'nullable|string|max:10',
            'nif' => 'nullable|integer',
            'role' => 'nullable|integer',
            'active' => 'nullable|boolean',
        ]);

        $user->update([
            'name' => $validatedData['name'] ?? $user->name,
            'email' => $validatedData['email'] ?? $user->email,
            'password' => isset($validatedData['password']) ? Hash::make($validatedData['password']) : $user->password,
            'dob' => $validatedData['dob'] ?? $user->dob,
            'house_number' => $validatedData['house_number'] ?? $user->house_number,
            'nif' => $validatedData['nif'] ?? $user->nif,
            'role' => $validatedData['role'] ?? $user->role,
            'active' => $validatedData['active'] ?? $user->active,
        ]);

        return response()->json([
            'message' => 'Utilizador atualizado com sucesso!',
            'user' => $user
        ], 200);
    }


}
