import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

type ResetRequestFormProps = {
  formAction: (formData: FormData) => void;
};

export default function ResetRequestForm({
  formAction,
}: ResetRequestFormProps) {
  return (
    <form action={formAction}>
      <div className="mb-2">
        <Label htmlFor="email" className="mb-2">
          Email
        </Label>
        <Input id="email" name="email" type="email" />
      </div>
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Sending..." : "Submit Reset Code"}
    </Button>
  );
}
