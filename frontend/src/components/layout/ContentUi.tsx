export default function ContentUi({ children }: { children: React.ReactNode }) {
    return (
        <div className="max-w-xl mx-auto bg-white border rounded-2xl mt-2">
            {children}
        </div>
    );
}
