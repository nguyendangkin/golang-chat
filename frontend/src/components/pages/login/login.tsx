"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import { OtpVerificationModalForLogin } from "@/components/pages/login/OtpVerificationModalForLogin";
import { authenticate } from "@/actions/requestApi";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

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

const formSchema = z.object({
    email: z
        .string()
        .min(1, "Email không được để trống")
        .email("Email không hợp lệ"),
    password: z.string().min(1, "Mật khẩu không được để trống"),
});

type LoginFormValues = z.infer<typeof formSchema>;

export default function Login() {
    const [apiError, setApiError] = useState<ApiResponseError | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
    const [userEmailForOtp, setUserEmailForOtp] = useState("");
    const router = useRouter();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: LoginFormValues) => {
        setIsLoading(true);
        setApiError(null);

        const res = await authenticate(values.email, values.password);

        switch (res.code) {
            case 0:
            case 1:
                setApiError({ code: res.code, message: res.error });
                form.clearErrors("email");
                form.clearErrors("password");
                setIsLoading(false);
                return;
            case 2:
                setUserEmailForOtp(values.email);
                setIsOtpModalOpen(true);
                setIsLoading(false);
                return;
            case 3:
                console.log("Đăng nhập thành công:", res.data);
                router.push("/");
                setIsLoading(false);
                return;
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800">
                <h2 className="text-center text-2xl font-semibold text-gray-900 dark:text-white">
                    Đăng nhập tài khoản
                </h2>

                {apiError && (
                    <Alert variant="destructive" className="mt-4">
                        <ExclamationTriangleIcon className="h-4 w-4" />
                        <AlertTitle>Lỗi đăng nhập!</AlertTitle>
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

                        <Button
                            type="submit"
                            variant="outline"
                            disabled={isLoading}
                            className="w-full rounded-md px-4 py-2 text-sm font-medium hover:cursor-pointer"
                        >
                            {isLoading ? "Đang xử lý..." : "Đăng nhập"}
                        </Button>
                    </form>
                </Form>

                <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    Chưa có tài khoản?{" "}
                    <Link
                        href="/register"
                        className="font-medium text-blue-600 hover:underline"
                    >
                        Đăng ký
                    </Link>
                </p>
            </div>

            {/* OTP Verification Modal */}
            <OtpVerificationModalForLogin
                isOpen={isOtpModalOpen}
                onClose={() => setIsOtpModalOpen(false)}
                email={userEmailForOtp}
            />
        </div>
    );
}
