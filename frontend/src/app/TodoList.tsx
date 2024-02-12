import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function TodoList() {
  return (
    <div>
      <ul>
        <li className="flex items-center gap-2 border-b p-5">
          <Checkbox />
          <Label className="text-lg">Buy groceries</Label>
        </li>
      </ul>
    </div>
  );
}
