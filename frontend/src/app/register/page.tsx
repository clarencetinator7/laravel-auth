"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { registerUser } from "../actions";
import { useFormState, useFormStatus } from "react-dom";
import { act } from "react-dom/test-utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const initialState = {
  name: "",
  email: "",
  password: "",
  confirm_password: "",
};

export default function Register() {
  const [state, formAction] = useFormState(registerUser, initialState);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center">
      <Card className="w-full sm:max-w-[400px]">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Enter your credentials to register</CardDescription>
        </CardHeader>
        <CardContent className="py-4">
          {state?.success && (
            <Alert className="mb-3 border-green-500">
              <AlertTitle className="text-green-800">
                Register Success
              </AlertTitle>
              <AlertDescription className="text-green-800">
                You have been registered successfully
              </AlertDescription>
            </Alert>
          )}

          <form action={formAction}>
            <div>
              <Label htmlFor="name" className="mb-2">
                Full Name
              </Label>
              <Input id="name" name="name" type="text" />
              {state?.errors && state?.errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {state.errors.name[0]}
                </p>
              )}
            </div>
            <div className="py-2">
              <Label htmlFor="email" className="mb-2">
                Email
              </Label>
              <Input id="email" name="email" type="email" />
              {state?.errors && state?.errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {state.errors.email[0]}
                </p>
              )}{" "}
            </div>
            <div className="py-2">
              <Label htmlFor="password" className="mb-2">
                Password
              </Label>
              <Input id="password" name="password" type="password" />
              {state?.errors && state?.errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {state.errors.password[0]}
                </p>
              )}
            </div>
            <div className="py-2">
              <Label htmlFor="password_confirmation" className="mb-2">
                Confirm Password
              </Label>
              <Input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
              />
              {state?.errors && state?.errors.password_confirmation && (
                <p className="text-red-500 text-sm mt-1">
                  {state.errors.password_confirmation[0]}
                </p>
              )}
            </div>
            <SubmitButton />
          </form>
          <Link
            href={"/login"}
            className="text-sm underline underline-offset-2"
          >
            Already have an account?
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full mt-4" disabled={pending}>
      Register
    </Button>
  );
}
