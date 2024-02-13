"use client";
import { logoutUser } from "@/app/actions";
import { Button } from "./button";

export default function LogoutButton() {
  return (
    <Button
      type="button"
      variant={"link"}
      className="text-gray-500 hover:text-red-700"
      onClick={() => {
        logoutUser();
      }}
    >
      Logout
    </Button>
  );
}
