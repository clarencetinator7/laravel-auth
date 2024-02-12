"use client";

import { Button } from "@/components/ui/button";

type TodoActionsProps = {
  todoId: string;
};

export default function TodoActions({ todoId }: TodoActionsProps) {
  return (
    <div>
      <Button variant="destructive">Delete</Button>
    </div>
  );
}
