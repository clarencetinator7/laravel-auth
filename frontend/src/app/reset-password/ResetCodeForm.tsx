import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormStatus } from "react-dom";

type ResetCodeFormProps = {
  formAction: (formData: FormData) => void;
};

export default function ResetCodeForm({ formAction }: ResetCodeFormProps) {
  return (
    <form action={formAction}>
      <div className="mb-2">
        <Label htmlFor="code" className="mb-2">
          Reset Code
        </Label>
        <Input id="code" name="code" type="text" />
      </div>
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Sending..." : "Submit"}
    </Button>
  );
}
