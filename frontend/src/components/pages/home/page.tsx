"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Heart,
    MessageCircle,
    Repeat2,
    Send,
    MoreHorizontal,
    Camera,
    Smile,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Post = {
    id: number;
    user: {
        name: string;
        username: string;
        avatar: string;
        verified?: boolean;
    };
    content: string;
    images?: string[];
    likes: number;
    replies: number;
    reposts: number;
    shares: number;
    timestamp: string;
};

const mockPosts: Post[] = [
    {
        id: 1,
        user: {
            name: "ttt_th8",
            username: "ttt_th8",
            avatar: "https://i.pravatar.cc/100?img=1",
        },
        content: "t không lười makeup, lười tẩy trang",
        images: [
            "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=400&fit=crop",
        ],
        likes: 1600,
        replies: 13,
        reposts: 33,
        shares: 4,
        timestamp: "13 giờ",
    },
    {
        id: 2,
        user: {
            name: "quynhquin",
            username: "quynhquin",
            avatar: "https://i.pravatar.cc/100?img=2",
        },
        content: "Ngày đó mẹ viết cho ba thì biết mẹ yêu ba nhiều cỡ nào 🔒",
        images: [
            "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=400&fit=crop",
        ],
        likes: 515,
        replies: 2,
        reposts: 24,
        shares: 2,
        timestamp: "10 giờ",
    },
    {
        id: 3,
        user: {
            name: "_hongtrakcheese_",
            username: "hongtrakcheese",
            avatar: "https://i.pravatar.cc/100?img=3",
        },
        content: "1 tim bố m nghỉ việc",
        images: [],
        likes: 721,
        replies: 17,
        reposts: 43,
        shares: 2,
        timestamp: "13 giờ",
    },
    {
        id: 4,
        user: {
            name: "satamaki_horse",
            username: "satamaki_horse",
            avatar: "https://i.pravatar.cc/100?img=4",
        },
        content: "mood hôm nay",
        images: [
            "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=600&fit=crop",
        ],
        likes: 234,
        replies: 8,
        reposts: 12,
        shares: 1,
        timestamp: "14 giờ",
    },
];

const formatNumber = (num: number) => {
    if (num >= 1000) {
        return Math.floor(num / 1000) + "K";
    }
    return num.toString();
};

export default function Feed() {
    return (
        <div className="max-w-xl mx-auto bg-white border rounded-2xl">
            {/* Create Thread */}
            <div className=" border-b  px-4 py-3">
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src="https://i.pravatar.cc/100?img=11" />
                        <AvatarFallback className="bg-gray-200 text-gray-600">
                            U
                        </AvatarFallback>
                    </Avatar>

                    <textarea
                        placeholder="Có gì mới?"
                        className="flex-1 text-sm placeholder-gray-400 resize-none border-none outline-none bg-transparent"
                        rows={1}
                    />

                    <Button
                        size="sm"
                        variant="outline"
                        className="px-4 py-1 rounded-md text-sm font-medium"
                    >
                        Đăng
                    </Button>
                </div>
            </div>

            {/* Posts */}
            {mockPosts.map((post, index) => (
                <div
                    key={post.id}
                    className={`px-4 py-4 ${
                        index !== mockPosts.length - 1
                            ? "border-b border-gray-100"
                            : ""
                    } hover:bg-gray-50/50 transition-colors cursor-pointer`}
                >
                    <div className="flex gap-3">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={post.user.avatar} />
                            <AvatarFallback className="bg-gray-200 text-gray-600 text-sm">
                                {post.user.name[0]}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-1">
                                    <span className="font-semibold text-gray-900 text-sm">
                                        {post.user.name}
                                    </span>
                                    {post.user.verified && (
                                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                            <svg
                                                className="w-2.5 h-2.5 text-white"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    )}
                                    <span className="text-gray-500 text-sm">
                                        {post.timestamp}
                                    </span>
                                </div>
                                <MoreHorizontal className="h-4 w-4 text-gray-400" />
                            </div>

                            <div className="text-gray-900 text-[15px] leading-normal mb-3">
                                {post.content}
                            </div>

                            {/* Images */}
                            {post.images && post.images.length > 0 && (
                                <div className="mb-3">
                                    <div
                                        className={`grid gap-1 rounded-xl overflow-hidden ${
                                            post.images.length === 1
                                                ? "grid-cols-1"
                                                : post.images.length === 2
                                                ? "grid-cols-2"
                                                : "grid-cols-3"
                                        }`}
                                    >
                                        {post.images.map((img, i) => (
                                            <img
                                                key={i}
                                                src={img}
                                                alt=""
                                                className="w-full h-auto object-cover bg-gray-100"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center gap-4 text-gray-500">
                                <button className="flex items-center gap-2 hover:text-red-500 transition-colors">
                                    <Heart className="h-5 w-5" />
                                    <span className="text-sm">
                                        {formatNumber(post.likes)}
                                    </span>
                                </button>

                                <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
                                    <MessageCircle className="h-5 w-5" />
                                    <span className="text-sm">
                                        {post.replies}
                                    </span>
                                </button>

                                <button className="flex items-center gap-2 hover:text-green-500 transition-colors">
                                    <Repeat2 className="h-5 w-5" />
                                    <span className="text-sm">
                                        {post.reposts}
                                    </span>
                                </button>

                                <button className="hover:text-purple-500 transition-colors">
                                    <Send className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
