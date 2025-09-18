"use client";

import { useState, useEffect, useRef, useCallback } from "react"; // Import useCallback
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { resendVerifyCode, verifyCode } from "@/actions/requestApi";
import { useRouter } from "next/navigation";

interface OtpVerificationModalForLoginProps {
    isOpen: boolean;
    onClose: () => void;
    email: string;
}

const otpFormSchema = z.object({
    otp: z
        .string()
        .min(6, { message: "Mã OTP phải có đủ 6 chữ số." })
        .max(6, { message: "Mã OTP phải có đủ 6 chữ số." }),
});

type OtpFormValues = z.infer<typeof otpFormSchema>;

const RESEND_COOLDOWN_SECONDS = 65;

export function OtpVerificationModalForLogin({
    isOpen,
    onClose,
    email,
}: OtpVerificationModalForLoginProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [cooldown, setCooldown] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const hasInitializedRef = useRef(false);

    const form = useForm<OtpFormValues>({
        resolver: zodResolver(otpFormSchema),
        defaultValues: {
            otp: "",
        },
    });

    // Bọc handleResendOtp trong useCallback
    const handleResendOtp = useCallback(async () => {
        if (isResending) return;

        setIsResending(true);
        setApiError(null);

        const res = await resendVerifyCode(email);

        if (!res.ok) {
            setApiError(res.data?.message || "Gửi lại OTP thất bại.");
            toast.error(res.data?.message || "Gửi lại OTP thất bại.");
            setIsResending(false);
            return;
        }

        toast.success(res.data.message || "Đã gửi lại OTP!");
        setCooldown(RESEND_COOLDOWN_SECONDS);
        setIsResending(false);
    }, [email, isResending]); // email và isResending là các dependencies của hàm này

    // Effect to manage cooldown and initialization when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            if (!hasInitializedRef.current) {
                form.reset();
                setApiError(null);
                handleResendOtp(); // Gọi hàm ổn định đã được bọc trong useCallback
                hasInitializedRef.current = true;
            }
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            setCooldown(0);
            hasInitializedRef.current = false;
            setIsResending(false);
            setIsLoading(false);
        }
    }, [isOpen, form, handleResendOtp]); // Thêm handleResendOtp vào dependency array

    // Effect to manage the countdown timer
    useEffect(() => {
        if (cooldown > 0 && isOpen) {
            timerRef.current = setInterval(() => {
                setCooldown((prev) => {
                    if (prev <= 1) {
                        if (timerRef.current) {
                            clearInterval(timerRef.current);
                            timerRef.current = null;
                        }
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        // Cleanup function for the interval
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [cooldown, isOpen]);

    const onSubmit = async (values: OtpFormValues) => {
        setIsLoading(true);
        setApiError(null);

        const res = await verifyCode(email, values.otp);

        if (!res.ok) {
            setApiError(res.data?.message || "Xác thực OTP thất bại.");
            toast.error(res.data?.message || "Xác thực OTP thất bại.");
            setIsLoading(false);
            return;
        }

        toast.success(
            res.data.message ||
                "Xác thực tài khoản thành công! Vui lòng đăng nhập lại."
        );
        onClose();
        router.push("/login");
        setIsLoading(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Xác minh Tài khoản</DialogTitle>
                    <DialogDescription>
                        Tài khoản của bạn chưa được kích hoạt. Một mã xác minh
                        gồm 6 chữ số đã được gửi đến email{" "}
                        <strong>{email}</strong> của bạn. Vui lòng nhập mã vào
                        dưới đây để kích hoạt tài khoản.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="otp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-center w-full block">
                                        Mã OTP
                                    </FormLabel>
                                    <FormControl>
                                        <InputOTP
                                            maxLength={6}
                                            {...field}
                                            onChange={(value) => {
                                                field.onChange(value);
                                                if (apiError) {
                                                    setApiError(null);
                                                }
                                            }}
                                        >
                                            <InputOTPGroup className="flex justify-center w-full">
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={2} />
                                                <InputOTPSlot index={3} />
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormMessage className="text-center" />
                                </FormItem>
                            )}
                        />
                        {apiError && (
                            <p className="text-sm font-medium text-destructive text-center">
                                {apiError}
                            </p>
                        )}
                        <div className="flex justify-center gap-4">
                            <DialogFooter className="flex gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleResendOtp}
                                    disabled={
                                        isLoading || isResending || cooldown > 0
                                    }
                                >
                                    {isResending
                                        ? "Đang gửi..."
                                        : cooldown > 0
                                        ? `Gửi lại (${cooldown}s)`
                                        : "Gửi lại OTP"}
                                </Button>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading
                                        ? "Đang xác thực..."
                                        : "Xác thực"}
                                </Button>
                            </DialogFooter>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
