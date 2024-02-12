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
import { useFormState, useFormStatus } from "react-dom";
import { loginUser } from "../actions";

export default function Login() {
  const [state, formAction] = useFormState(loginUser, null);

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <Card className="w-full sm:max-w-[400px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials to login</CardDescription>
        </CardHeader>
        <CardContent className="py-4">
          <form action={formAction}>
            <div>
              <Label htmlFor="email" className="mb-2">
                Email
              </Label>
              <Input id="email" name="email" type="email" />
              {state?.errors && state?.errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {state.errors.email[0]}
                </p>
              )}
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
            <SubmitButton />
          </form>
          <div className="flex justify-center items-center my-2 w-full">
            <hr className="w-full" />
            <p className="px-2 text-gray-400">or</p>
            <hr className="w-full" />
          </div>
          <Link
            className={buttonVariants({
              variant: "secondary",
              size: "lg",
              className: "w-full",
            })}
            href={"/register"}
          >
            Create an account
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
      Login
    </Button>
  );
}
