<?php

namespace App\Http\Controllers;

use App\Http\Resources\AuthResource;
use App\Mail\MailNotify;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use OCILob;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|max:55',
            'email' => 'email|required|unique:users',
            'password' => 'required|confirmed|min:8|regex:/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-=])[A-Za-z\d!@#$%^&*()-=]{8,}$/'
        ], [
            'password.regex' => 'Password must contain at least one uppercase letter, one number and one special character'
        ]);

        return new AuthResource(User::create($validatedData));
    }

    public function verifyRequest(Request $request)
    {
        $request->user()->sendEmailVerificationNotification();

        return response(['success' => true, 'message' => 'Email verification link sent']);
    }

    public function verifyEmail(Request $request)
    {

        // User find with id
        $user = User::find($request->id);

        if (!$user) {
            return response(['success' => false, 'message' => 'User not found'], 404);
        }

        if ($user->email_verified_at !== null) {
            return response(['success' => true, 'message' => 'Email already verified'], 200);
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        // Better to use env('FRONTEND_URL') instead of hardcoding the URL        
        return redirect('http://localhost:3000/');
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

        $tokenRow = DB::table('password_reset_tokens')->where('email', $validatedData['email'])->orderBy('created_at', 'desc')->first();

        if (!$user) {
            return response(['success' => false, 'message' => 'User not found'], 404);
        }

        // Check if token row was created in less than 1 minute ago
        if ($tokenRow && $tokenRow->created_at > now()->subMinutes(1)) {
            return response(['success' => false, 'message' => 'Please wait a minute before requesting another code'], 400);
        } else if ($tokenRow && $tokenRow->created_at < now()->subMinutes(1)) {
            // Delete the token
            DB::table('password_reset_tokens')->where('email', $validatedData['email'])->delete();
        }

        // Generate a random 6 digit code
        $code = rand(100000, 999999);

        DB::table('password_reset_tokens')->insert([
            'email' => $user->email,
            'token' => $code,
            'created_at' => now(),
        ]);

        // Send the code to the user
        Mail::to($user->email)->send(new MailNotify($code));

        return response(['success' => true, 'message' => 'Code sent to email'], 200);
    }

    public function validateResetPasswordCode(Request $request)
    {
        $validatedData = $request->validate([
            'email' => 'email|required',
            'code' => 'required'
        ]);

        $user = User::where('email', $validatedData['email'])->first();
        $tokenRow = DB::table('password_reset_tokens')->where('email', $validatedData['email'])->orderBy('created_at', 'desc')->first();

        if (!$user || !$tokenRow) {
            return response(['success' => false, 'message' => 'User not found'], 404);
        }

        if ($tokenRow->token != $validatedData['code']) {
            return response(['success' => false, 'message' => 'Invalid code'], 400);
        }

        if ($tokenRow->created_at < now()->subMinutes(5)) {
            return response(['success' => false, 'message' => 'Code expired'], 400);
        }

        return response(['success' => true, 'message' => 'Code is valid'], 200);
    }

    public function resetPassword(Request $request)
    {
        $validatedData = $request->validate([
            'email' => 'email|required',
            'code' => 'required',
            'password' => 'required|confirmed|min:8|regex:/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-=])[A-Za-z\d!@#$%^&*()-=]{8,}$/'
        ], [
            'password.regex' => 'Password must contain at least one uppercase letter, one number and one special character'
        ]);

        $user = User::where('email', $validatedData['email'])->first();
        $tokenRow = DB::table('password_reset_tokens')->where('email', $validatedData['email'])->orderBy('created_at', 'desc')->first();

        // Check if the token / code exists
        if (!$tokenRow) {
            return response(['success' => false, 'message' => 'Request not found'], 404);
        }

        // Check if the token / code is the same as the one in the database
        if ($tokenRow->token != $validatedData['code']) {
            return response(['success' => false, 'message' => 'Invalid code'], 400);
        }

        // Check if the token / code has expired        
        if ($tokenRow->created_at < now()->subMinutes(5)) {
            // Delete the token
            DB::table('password_reset_tokens')->where('email', $validatedData['email'])->delete();
            return response(['success' => false, 'message' => 'Code expired please try again'], 400);
        }

        // Check if the password is the same as the old password
        if (password_verify($validatedData['password'], $user->password)) {
            return response(['success' => false, 'message' => 'New password cannot be the same as the old password'], 400);
        }

        $user->password = bcrypt($validatedData['password']);
        $user->save();

        // Clear the reset code and expiry
        DB::table('password_reset_tokens')->where('email', $validatedData['email'])->delete();

        return response(['success' => true, 'message' => 'Password reset successfully']);
    }
}
