"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Profile() {
    return (
        <div className="max-w-2xl mx-auto py-6 px-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold">Nguyễn Đặng Kin</h1>
                    <p className="text-sm text-gray-500">nguyendangkin</p>
                    <p className="text-sm text-gray-500">
                        facebook.com/nguyendangkin
                    </p>
                </div>
                <Avatar className="h-16 w-16">
                    <AvatarImage src="/profile.jpg" alt="avatar" />
                    <AvatarFallback>NK</AvatarFallback>
                </Avatar>
            </div>

            <div className="mt-4">
                <Button variant="outline" className="w-full">
                    Chỉnh sửa trang cá nhân
                </Button>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="thread" className="mt-6">
                <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="thread">Thread</TabsTrigger>
                    <TabsTrigger value="reply">Thread trả lời</TabsTrigger>
                    <TabsTrigger value="media">File phương tiện</TabsTrigger>
                    <TabsTrigger value="repost">Bài đăng lại</TabsTrigger>
                </TabsList>

                <TabsContent value="thread" className="mt-4">
                    {/* Form post */}
                    <div className="flex gap-2">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src="/profile.jpg" alt="avatar" />
                            <AvatarFallback>NK</AvatarFallback>
                        </Avatar>
                        <Input placeholder="Có gì mới?" />
                        <Button>Đăng</Button>
                    </div>

                    {/* Cards hoàn tất */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center text-center py-6">
                                <p className="font-medium">Tạo thread</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Cho mọi người biết bạn đang nghĩ gì hoặc
                                    chia sẻ điều gì đó.
                                </p>
                                <Button className="mt-3 w-full">Tạo</Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="flex flex-col items-center justify-center text-center py-6">
                                <p className="font-medium">
                                    Theo dõi 10 trang cá nhân
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Lấp đầy bảng feed bằng những thread bạn quan
                                    tâm.
                                </p>
                                <Button className="mt-3 w-full">
                                    Xem trang cá nhân
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="flex flex-col items-center justify-center text-center py-6">
                                <p className="font-medium">Thêm tiểu sử</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Giới thiệu về bản thân và cho mọi người biết
                                    bạn thích gì.
                                </p>
                                <Button className="mt-3 w-full">Thêm</Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
