import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { fetchTodos } from "./actions";

export default async function TodoList() {
  const todos = await fetchTodos();

  return (
    <div>
      <ul>
        {todos.map((todo: any) => (
          <li key={todo.id} className="flex items-center gap-2 border-b p-5">
            <Checkbox checked={todo.completed} />
            <Label className="text-lg">{todo.title}</Label>
          </li>
        ))}
      </ul>
    </div>
  );
}
