"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormState, useFormStatus } from "react-dom";
import { addTodo } from "./actions";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

export default function TodoForm() {
  const [state, formAction] = useFormState(addTodo, null);

  return (
    <div>
      {state?.success && (
        <Alert className="w-full mb-2 border-green-500">
          <AlertTitle className="text-green-700">
            Todo Added successfully
          </AlertTitle>
        </Alert>
      )}
      <form action={formAction} className="flex flex-row items-center gap-2">
        <Input
          type="text"
          name="todo"
          id="todo"
          placeholder="What do you want to do today?"
          className="grow"
        />
        <AddTodoButton />
      </form>
    </div>
  );
}

function AddTodoButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full max-w-[110px]" disabled={pending}>
      Add Todo
    </Button>
  );
}
