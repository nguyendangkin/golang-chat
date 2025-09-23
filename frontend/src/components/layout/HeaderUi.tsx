"use client";

import { Home, Search, Edit, Heart, User, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Import các thành phần từ shadcn/ui DropdownMenu
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/actions/requestApi";

export default function HeaderUi() {
    const pathname = usePathname();

    const navItems = [
        { href: "/", icon: Home },
        { href: "/search", icon: Search },
        { href: "/create", icon: Edit },
        { href: "/notifications", icon: Heart },
        { href: "/profile", icon: User },
    ];

    const handleLogout = () => {
        logout();
    };

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAFA] border-b border-gray-200">
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

                    {/* Menu Dropdown sử dụng shadcn/ui */}
                    <div className="flex items-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="p-3 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                                    <Menu className="w-6 h-6" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {" "}
                                {/* Đặt menu xổ xuống ở cuối (phải) */}
                                <DropdownMenuLabel>Cài đặt</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Link
                                        href="/settings"
                                        className="w-full h-full block"
                                    >
                                        Settings
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link
                                        href="/profile"
                                        className="w-full h-full block"
                                    >
                                        Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link
                                        href="/help"
                                        className="w-full h-full block"
                                    >
                                        Help
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <button
                                        type="submit"
                                        onClick={handleLogout}
                                        className="w-full h-full text-red-600 text-left"
                                    >
                                        Đăng xuất
                                    </button>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            {/* Spacer */}
            <div className="h-16"></div>
        </>
    );
}
