"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ResetRequestForm from "./ResetRequestForm";
import ResetCodeForm from "./ResetCodeForm";
import { request } from "http";
import { useFormState } from "react-dom";
import {
  requestVerification,
  resetPassword,
  validateResetCode,
} from "../actions";
export default function ResetPassword() {
  const [requestState, requestAction] = useFormState(resetPassword, null);
  const [sendCodeState, sendCodeAction] = useFormState(validateResetCode, null);
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <Card className="w-full sm:max-w-[400px]">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
        </CardHeader>
        <CardContent className="py-4">
          {!requestState?.success ? (
            <ResetRequestForm formAction={requestAction} />
          ) : (
            <ResetCodeForm formAction={sendCodeAction} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
