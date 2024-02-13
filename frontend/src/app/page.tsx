import LogoutButton from "@/components/ui/LogoutButton";
import { authenticateUser } from "./actions";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import Header from "./Header";

export default async function Home() {
  const user = await authenticateUser();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="min-w-[800px] p-10">
        <Header user={user} />
        <hr className="my-3" />
        <TodoForm />
        <TodoList />
      </div>
    </main>
  );
}
