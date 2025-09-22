"use client";

import { Home, Search, Edit, Heart, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HeaderUi() {
    const pathname = usePathname();

    const navItems = [
        { href: "/", icon: Home },
        { href: "/search", icon: Search },
        { href: "/create", icon: Edit },
        { href: "/notifications", icon: Heart },
        { href: "/profile", icon: User },
    ];

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAFA] border-gray-200">
                <div className="flex items-center justify-between h-16 px-4">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link
                            href="/"
                            className="px-2 py-1 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        >
                            <span className="text-xl font-bold tracking-tight">
                                Chin
                            </span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex items-center space-x-8">
                        {navItems.map(({ href, icon: Icon }) => {
                            const isActive = pathname === href;
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`flex flex-col items-center p-3 rounded-lg transition-colors duration-200 ${
                                        isActive
                                            ? "text-black bg-gray-200"
                                            : "text-gray-500 hover:text-black hover:bg-gray-100"
                                    }`}
                                >
                                    <Icon className="w-6 h-6" />
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Menu */}
                    <div className="flex items-center">
                        <button className="p-3 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* Spacer */}
            <div className="h-16"></div>
        </>
    );
}
