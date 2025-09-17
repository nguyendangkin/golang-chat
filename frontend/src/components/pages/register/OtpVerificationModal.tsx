"use client";

import { useState, useEffect, useRef } from "react";
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

interface OtpVerificationModalProps {
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

export function OtpVerificationModal({
    isOpen,
    onClose,
    email,
}: OtpVerificationModalProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [cooldown, setCooldown] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const hasInitializedRef = useRef(false); // Thêm ref để track việc khởi tạo

    const form = useForm<OtpFormValues>({
        resolver: zodResolver(otpFormSchema),
        defaultValues: {
            otp: "",
        },
    });

    // Effect để khởi tạo trạng thái khi modal mở/đóng
    useEffect(() => {
        if (isOpen) {
            // Chỉ reset và khởi tạo cooldown lần đầu mở modal
            if (!hasInitializedRef.current) {
                form.reset();
                setApiError(null);
                setCooldown(RESEND_COOLDOWN_SECONDS);
                hasInitializedRef.current = true;
            }
        } else {
            // Khi modal đóng, reset tất cả
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            setCooldown(0);
            hasInitializedRef.current = false; // Reset flag
        }
    }, [isOpen, form]); // Loại bỏ cooldown khỏi dependency array

    // Effect để quản lý bộ đếm ngược
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

        // Cleanup function
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
            setIsLoading(false);
            return;
        }

        toast.success(res.data.message || "Xác thực OTP thành công!");
        onClose();
        router.push("/login");
        setIsLoading(false);
    };

    const handleResendOtp = async () => {
        if (cooldown > 0) return;

        setIsResending(true);
        setApiError(null);

        const res = await resendVerifyCode(email);

        if (!res.ok) {
            setApiError(res.data?.message || "Gửi lại OTP thất bại.");
            setIsResending(false);
            return;
        }

        toast.success(res.data.message || "Đã gửi lại OTP!");
        setCooldown(RESEND_COOLDOWN_SECONDS);
        setIsResending(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Xác minh OTP</DialogTitle>
                    <DialogDescription>
                        Một mã xác minh gồm 6 chữ số đã được gửi đến email{" "}
                        <strong>{email}</strong> của bạn. Vui lòng nhập mã vào
                        dưới đây để hoàn tất đăng ký.
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
                                                // Xóa lỗi API khi người dùng bắt đầu nhập lại
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
