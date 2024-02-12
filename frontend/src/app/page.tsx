import LogoutButton from "@/components/ui/LogoutButton";
import { authenticateUser, logoutUser } from "./actions";

export default async function Home() {
  const user = await authenticateUser();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Home Page
      <p>Welcome, {user?.name}</p>
      <LogoutButton />
    </main>
  );
}
