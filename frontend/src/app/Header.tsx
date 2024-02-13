"use client";
import LogoutButton from "@/components/ui/LogoutButton";
import { Button } from "@/components/ui/button";
import { requestVerification } from "./actions";
import { useState } from "react";

export default function Header({ user }: { user: any }) {
  const [verifyLoading, setVerifyIsLoading] = useState(false);
  const onVerifyEmailHandler = async () => {
    setVerifyIsLoading(true);
    const verifyReq = await requestVerification();
    setVerifyIsLoading(false);

    if (verifyReq.success) {
      alert("Verification email sent");
    } else {
      alert("Failed to send verification email");
    }
  };

  console.log(user);

  return (
    <header className="w-full flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">TODO</h1>
      </div>
      <div className="flex gap-2 items-center">
        <p>
          Hi!, <b>{user?.name} </b>
        </p>
        {user.email_verified_at === null && (
          <Button
            type="button"
            onClick={onVerifyEmailHandler}
            disabled={verifyLoading}
          >
            {verifyLoading ? "Sending..." : "Verify Email"}
          </Button>
        )}
        <LogoutButton />
      </div>
    </header>
  );
}
