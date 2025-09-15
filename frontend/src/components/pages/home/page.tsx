"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { registerUser } from "@/actions/requestApi";

interface ApiFieldError {
    field: string;
    message: string;
}

interface ApiErrorDetails {
    code: number;
    errors: ApiFieldError[];
    message: string;
}

interface ApiErrorDefault {
    code: number;
    message: string;
}

type ApiResponseError = ApiErrorDetails | ApiErrorDefault;

const formSchema = z
    .object({
        email: z
            .string()
            .email({ message: "Email không đúng định dạng email." }),
        password: z
            .string()
            .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự." }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Xác nhận mật khẩu không khớp.",
        path: ["confirmPassword"],
    });

type RegisterFormValues = z.infer<typeof formSchema>;

export function HomePage() {
    const router = useRouter();
    const [apiError, setApiError] = useState<ApiResponseError | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (values: RegisterFormValues) => {
        setIsLoading(true);
        setApiError(null);

        try {
            const res = await registerUser(
                values.email,
                values.password,
                values.confirmPassword
            );

            if (!res.ok) {
                const apiErrorResponse = res.data as ApiResponseError;

                // map lỗi field vào form
                if (res.status === 400 && "errors" in apiErrorResponse) {
                    (apiErrorResponse as ApiErrorDetails).errors.forEach(
                        (err) => {
                            if (err.field === "Email") {
                                form.setError("email", {
                                    type: "manual",
                                    message: err.message,
                                });
                            } else if (err.field === "Mật khẩu") {
                                form.setError("password", {
                                    type: "manual",
                                    message: err.message,
                                });
                            }
                        }
                    );
                }

                // lưu full error để render
                setApiError(apiErrorResponse);
                return;
            }

            // Thành công
            console.log("Đăng ký thành công:", res.data);
            toast.success(res.data.message);
        } catch (err) {
            console.error("Unexpected error:", err);
            setApiError({
                code: 500,
                message: "Không thể kết nối đến server. Vui lòng thử lại sau.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                    Đăng Ký Tài Khoản
                </h2>

                {apiError && (
                    <Alert variant="destructive">
                        <ExclamationTriangleIcon className="h-4 w-4" />
                        <AlertTitle>Lỗi đăng ký!</AlertTitle>
                        <AlertDescription>
                            <p>{apiError.message}</p>
                            {"errors" in apiError &&
                                apiError.errors?.length > 0 && (
                                    <ul className="list-disc list-inside mt-2 space-y-1">
                                        {apiError.errors.map((err, idx) => (
                                            <li key={idx}>
                                                <strong>{err.field}:</strong>{" "}
                                                {err.message}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                        </AlertDescription>
                    </Alert>
                )}

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="vd: user@example.com"
                                            {...field}
                                            type="email"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mật khẩu</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="••••••••"
                                            {...field}
                                            type="password"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Xác nhận mật khẩu</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="••••••••"
                                            {...field}
                                            type="password"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? "Đang xử lý..." : "Đăng Ký"}
                        </Button>
                    </form>
                </Form>

                <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                    Đã có tài khoản?{" "}
                    <Link
                        href="/login"
                        className="font-medium text-blue-600 hover:underline"
                    >
                        Đăng nhập
                    </Link>
                </p>
            </div>
        </div>
    );
}
