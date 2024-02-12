"use client";
import { logoutUser } from "@/app/actions";
import { Button } from "./button";

export default function LogoutButton() {
  return (
    <Button
      type="button"
      onClick={() => {
        logoutUser();
      }}
    >
      Logout
    </Button>
  );
}
