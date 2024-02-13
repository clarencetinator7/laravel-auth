"use client";
import { resetNewPassword } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState } from "react-dom";

export default function NewPasswordPage() {
  const [state, formAction] = useFormState(resetNewPassword, null);

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <Card className="w-full sm:max-w-[400px]">
        <CardHeader>
          <CardTitle>Create New Password</CardTitle>
        </CardHeader>
        <CardContent className="py-4">
          {state?.success === false && (
            <p className="text-red-500 text-sm mb-2">
              {state?.message || "An error occurred"}
            </p>
          )}
          <form action={formAction}>
            <div>
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
            <Button type="submit"> Reset Password </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
