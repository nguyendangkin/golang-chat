"use client";

import { useState } from "react";
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
import { OtpVerificationModal } from "@/components/pages/register/OtpVerificationModal";

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

export function Register() {
    const [apiError, setApiError] = useState<ApiResponseError | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isOtpModalOpen, setIsOtpModalOpen] = useState(false); // State để quản lý modal OTP
    const [registeredEmail, setRegisteredEmail] = useState(""); // Lưu email đã đăng ký thành công

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

        const res = await registerUser(
            values.email,
            values.password,
            values.confirmPassword
        );

        if (!res.ok) {
            const errorRes = res.data as ApiResponseError;

            if (
                errorRes &&
                "errors" in errorRes &&
                Array.isArray(errorRes.errors)
            ) {
                errorRes.errors.forEach((err) => {
                    form.setError(err.field as keyof RegisterFormValues, {
                        type: "manual",
                        message: err.message,
                    });
                });
            } else {
                setApiError(errorRes);
            }
            setIsLoading(false);
            return;
        }

        // Thành công
        console.log("Đăng ký thành công:", res.data);
        toast.success(res.data.message);

        setRegisteredEmail(values.email); // Lưu email để truyền vào modal OTP
        setIsOtpModalOpen(true); // Mở modal OTP

        setIsLoading(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800">
                <h2 className="text-center text-2xl font-semibold text-gray-900 dark:text-white">
                    Đăng ký tài khoản
                </h2>

                {apiError && (
                    <Alert variant="destructive" className="mt-4">
                        <ExclamationTriangleIcon className="h-4 w-4" />
                        <AlertTitle>Lỗi đăng ký</AlertTitle>
                        <AlertDescription>
                            <p>{apiError.message}</p>
                            {"errors" in apiError &&
                                apiError.errors?.length > 0 && (
                                    <ul className="mt-2 list-disc list-inside space-y-1">
                                        {apiError.errors.map((err, idx) => (
                                            <li key={idx}>{err.message}</li>
                                        ))}
                                    </ul>
                                )}
                        </AlertDescription>
                    </Alert>
                )}

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="mt-6 space-y-5"
                    >
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="vd: user@example.com"
                                            {...field}
                                            type="email"
                                            className="h-11 rounded-lg"
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
                                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Mật khẩu
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="••••••••"
                                            {...field}
                                            type="password"
                                            className="h-11 rounded-lg"
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
                                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Xác nhận mật khẩu
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="••••••••"
                                            {...field}
                                            type="password"
                                            className="h-11 rounded-lg"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            variant="outline"
                            disabled={isLoading}
                            className="w-full rounded-md px-4 py-2 text-sm font-medium hover:cursor-pointer"
                        >
                            {isLoading ? "Đang xử lý..." : "Đăng ký"}
                        </Button>
                    </form>
                </Form>

                <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    Đã có tài khoản?{" "}
                    <Link
                        href="/login"
                        className="font-medium text-blue-600 hover:underline"
                    >
                        Đăng nhập
                    </Link>
                </p>
            </div>

            {/* Modal OTP */}
            <OtpVerificationModal
                isOpen={isOtpModalOpen}
                onClose={() => setIsOtpModalOpen(false)}
                email={registeredEmail}
            />
        </div>
    );
}
