import { auth } from "@/auth";
import Home from "@/components/pages/home/page";

export default async function HomePage() {
    const session = await auth();

    return <Home user={session?.user} />;
}
