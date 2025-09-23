// import { auth } from "@/auth";
// const session = await auth();
// <Home user={session?.user} />

import Home from "@/components/pages/home/home";

export default async function HomePage() {
    return (
        <>
            <Home />
        </>
    );
}
