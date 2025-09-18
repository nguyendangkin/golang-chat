"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod"; // Loại bỏ zodResolver
import * as z from "zod"; // Vẫn giữ để định nghĩa type, nhưng không dùng để resolve
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

type LoginFormValues = z.infer<
    z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
    }>
>;

export default function Login() {
    const [apiError, setApiError] = useState<ApiResponseError | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isOtpModalOpen, setIsOtpModalOpen] = useState(false); // State to manage OTP modal
    const [userEmailForOtp, setUserEmailForOtp] = useState(""); // To pass email to OTP modal
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
        setApiError(null); // Clear previous API errors

        const res = await authenticate(values.email, values.password);

        switch (res.code) {
            case 0: // login fail chung
            case 1: // login fail 401
                setApiError({ code: res.code, message: res.error });
                form.clearErrors("email");
                form.clearErrors("password");
                setIsLoading(false);
                return;
            case 2: // user inactive 423
                setUserEmailForOtp(values.email);
                setIsOtpModalOpen(true);
                setIsLoading(false);
                return;
            case 3: // success
                console.log("Đăng nhập thành công:", res.data);
                toast.success("Đăng nhập thành công!");
                router.push("/");
                setIsLoading(false);
                return;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                    Đăng Nhập Tài Khoản
                </h2>

                {apiError && (
                    <Alert variant="destructive">
                        <ExclamationTriangleIcon className="h-4 w-4" />
                        <AlertTitle>Lỗi đăng nhập!</AlertTitle>
                        <AlertDescription>
                            <p>{apiError.message}</p>
                            {"errors" in apiError &&
                                apiError.errors?.length > 0 && (
                                    <ul className="list-disc list-inside mt-2 space-y-1">
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
                                            type="text"
                                        />
                                    </FormControl>
                                    <FormMessage />{" "}
                                    {/* Hiển thị lỗi validate email */}
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
                                    <FormMessage />{" "}
                                    {/* Hiển thị lỗi validate password */}
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? "Đang xử lý..." : "Đăng Nhập"}
                        </Button>
                    </form>
                </Form>

                <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                    Chưa có tài khoản?{" "}
                    <Link
                        href="/register"
                        className="font-medium text-blue-600 hover:underline"
                    >
                        Đăng ký
                    </Link>
                </p>
            </div>

            {/* OTP Verification Modal for Login */}
            <OtpVerificationModalForLogin
                isOpen={isOtpModalOpen}
                onClose={() => setIsOtpModalOpen(false)}
                email={userEmailForOtp}
            />
        </div>
    );
}
