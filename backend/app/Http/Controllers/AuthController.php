<?php

namespace App\Http\Controllers;

use App\Http\Resources\AuthResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|max:55',
            'email' => 'email|required|unique:users',
            'password' => 'required|confirmed'
        ]);

        // $validatedData['password'] = bcrypt($request->password);
        return new AuthResource(User::create($validatedData));
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'email|required',
            'password' => 'required'
        ]);

        if (Auth::attempt($credentials)) {
            /** @var \App\Models\User $user **/
            $user = Auth::user();

            $token = $user->createToken('auth-token');

            return response([
                'success' => true,
                'data' => [
                    'user' => auth()->user(), 'access_token' => $token->plainTextToken
                ]
            ]);
        }

        return response(['success' => false, 'message' => 'Invalid credentials'], 401);
    }

    public function logout(Request $request)
    {

        $request->user()->tokens()->delete();

        return response(['success' => true, 'message' => 'Logged out']);
    }

    public function validateToken(Request $request)
    {
        return response(['success' => true, 'message' => 'Token is valid']);
    }
}
