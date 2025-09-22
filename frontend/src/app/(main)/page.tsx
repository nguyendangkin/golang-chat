// import { auth } from "@/auth";
import Home from "@/components/pages/home/home";

export default async function HomePage() {
    // const session = await auth();

    return (
        <>
            {/* <Home user={session?.user} /> */}
            <Home />
        </>
    );
}
