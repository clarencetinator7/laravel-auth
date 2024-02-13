<?php

namespace App\Http\Controllers;

use App\Http\Resources\AuthResource;
use App\Mail\MailNotify;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

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

    public function resetPasswordRequest(Request $request)
    {
        $validatedData = $request->validate([
            'email' => 'email|required'
        ]);

        $user = User::where('email', $validatedData['email'])->first();

        if (!$user) {
            return response(['success' => false, 'message' => 'User not found'], 404);
        }

        // Generate a random 6 digit code
        $code = rand(100000, 999999);

        // Generate expiry time for the code: 5 minutes
        $expiry = now()->addMinutes(5);

        // Save the code to the user
        $user->reset_code = $code;
        $user->reset_code_expiry = $expiry;
        $user->save();

        // Send the code to the user
        Mail::to($user->email)->send(new MailNotify($code));

        return response(['success' => true, 'message' => 'Code sent to email'], 200);
    }

    public function resetPassword(Request $request)
    {
        $validatedData = $request->validate([
            'email' => 'email|required',
            'code' => 'required',
            'password' => 'required|confirmed'
        ]);

        $user = User::where('email', $validatedData['email'])->first();

        if (!$user) {
            return response(['success' => false, 'message' => 'User not found'], 404);
        }

        if ($user->reset_code !== $validatedData['code']) {
            return response(['success' => false, 'message' => 'Invalid code'], 400);
        }

        if ($user->reset_code_expiry < now()) {
            return response(['success' => false, 'message' => 'Code expired'], 400);
        }

        $user->password = bcrypt($validatedData['password']);
        $user->reset_code = null;
        $user->reset_code_expiry = null;
        $user->save();

        return response(['success' => true, 'message' => 'Password reset successfully']);
    }


}
