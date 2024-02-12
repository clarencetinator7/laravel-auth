import LogoutButton from "@/components/ui/LogoutButton";
import { authenticateUser, logoutUser } from "./actions";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";

export default async function Home() {
  const user = await authenticateUser();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="min-w-[800px] p-10">
        <header className="w-full flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">TODO</h1>
          </div>
          <div className="flex gap-2 items-center">
            <p>
              Hi!, <b>{user?.name} </b>
            </p>
            <LogoutButton />
          </div>
        </header>
        <hr className="my-3" />
        <TodoForm />
        <TodoList />
      </div>
    </main>
  );
}
