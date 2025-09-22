"use client";

import { Home, Search, Edit, Heart, User } from "lucide-react";

export default function HeaderUi() {
    return (
        <>
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAFA] border-gray-200">
                <div className="flex items-center justify-between h-16 px-4">
                    {/* Logo - Left aligned, no container constraints */}
                    <div className="flex items-center">
                        {/* Threads Logo */}
                        <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors duration-200">
                            <svg
                                viewBox="0 0 24 24"
                                className="w-6 h-6"
                                fill="currentColor"
                            >
                                <path d="M12.156 2.004c-1.95 0-3.57.78-4.65 2.24-.98 1.32-1.5 3.1-1.5 5.1 0 .36.02.71.06 1.04-.5.2-.97.47-1.4.8-1.32 1-2.08 2.42-2.08 3.92 0 1.5.76 2.92 2.08 3.92 1.32 1 3.08 1.56 4.92 1.56s3.6-.56 4.92-1.56c1.32-1 2.08-2.42 2.08-3.92 0-1.5-.76-2.92-2.08-3.92-.43-.33-.9-.6-1.4-.8.04-.33.06-.68.06-1.04 0-2-0.52-3.78-1.5-5.1-1.08-1.46-2.7-2.24-4.65-2.24zm0 1.5c1.45 0 2.67.58 3.5 1.66.83 1.08 1.25 2.54 1.25 4.18 0 .28-.01.56-.04.83-.41-.06-.84-.09-1.29-.09-1.95 0-3.57.78-4.65 2.24-.53.72-.88 1.58-1.02 2.54-.43.15-.83.35-1.19.6-.97.73-1.53 1.78-1.53 2.88 0 1.1.56 2.15 1.53 2.88.97.73 2.26 1.16 3.62 1.16s2.65-.43 3.62-1.16c.97-.73 1.53-1.78 1.53-2.88 0-1.1-.56-2.15-1.53-2.88-.36-.25-.76-.45-1.19-.6-.14-.96-.49-1.82-1.02-2.54-1.08-1.46-2.7-2.24-4.65-2.24-.45 0-.88.03-1.29.09-.03-.27-.04-.55-.04-.83 0-1.64.42-3.1 1.25-4.18.83-1.08 2.05-1.66 3.5-1.66z" />
                            </svg>
                        </button>
                    </div>

                    {/* Center Navigation - Tab style như Threads */}
                    <nav className="flex items-center space-x-8">
                        <button className="flex flex-col items-center p-3 border-black rounded-lg hover:bg-gray-100 transition-colors duration-200">
                            <Home className="w-6 h-6" />
                        </button>
                        <button className="flex flex-col items-center p-3 text-gray-500 hover:text-black rounded-lg hover:bg-gray-100 transition-colors duration-200">
                            <Search className="w-6 h-6" />
                        </button>
                        <button className="flex flex-col items-center p-3 text-gray-500 hover:text-black rounded-lg hover:bg-gray-100 transition-colors duration-200">
                            <Edit className="w-6 h-6" />
                        </button>
                        <button className="flex flex-col items-center p-3 text-gray-500 hover:text-black rounded-lg hover:bg-gray-100 transition-colors duration-200">
                            <Heart className="w-6 h-6" />
                        </button>
                        <button className="flex flex-col items-center p-3 text-gray-500 hover:text-black rounded-lg hover:bg-gray-100 transition-colors duration-200">
                            <User className="w-6 h-6" />
                        </button>
                    </nav>

                    {/* Right side - Menu */}
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

            {/* Spacer để tránh content bị che bởi fixed header */}
            <div className="h-16"></div>
        </>
    );
}
