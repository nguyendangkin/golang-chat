import HeaderUi from "@/components/layout/HeaderUi";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <HeaderUi />
            {children}
        </>
    );
}
