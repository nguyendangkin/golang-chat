"use server";

import { signIn } from "@/auth";
import decodeJwt from "@/utils/decodeJwt";

function getBackendBaseUrl(): string {
    const BACKEND_API_BASE_URL = process.env.BACKEND_API_URL;
    if (!BACKEND_API_BASE_URL) {
        throw new Error(
            "BACKEND_API_URL is not defined in environment variables."
        );
    }
    return BACKEND_API_BASE_URL;
}

export async function registerUser(
    email: string,
    password: string,
    confirmPassword: string
) {
    try {
        const REGISTER_ENDPOINT = `${getBackendBaseUrl()}/api/v1/register`;

        const response = await fetch(REGISTER_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password, confirmPassword }),
        });

        const data = await response.json();
        return {
            ok: response.ok,
            status: response.status,
            data,
        };
    } catch (error) {
        console.error("Fetch error:", error);
        return {
            ok: false,
            status: 500,
            data: { message: "Không thể kết nối đến server" },
        };
    }
}

export async function verifyCode(email: string, code: string) {
    try {
        const VERIFY_ENDPOINT = `${getBackendBaseUrl()}/api/v1/verify-code`;

        const response = await fetch(VERIFY_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, code }),
        });

        const data = await response.json();
        return {
            ok: response.ok,
            status: response.status,
            data,
        };
    } catch (error) {
        console.error("Fetch error:", error);
        return {
            ok: false,
            status: 500,
            data: { message: "Không thể kết nối đến server" },
        };
    }
}

export async function resendVerifyCode(email: string) {
    try {
        const RESEND_ENDPOINT = `${getBackendBaseUrl()}/api/v1/resend-verify-code`;

        const response = await fetch(RESEND_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();
        return {
            ok: response.ok,
            status: response.status,
            data,
        };
    } catch (error) {
        console.error("Fetch error:", error);
        return {
            ok: false,
            status: 500,
            data: { message: "Không thể kết nối đến server" },
        };
    }
}

export async function login(email: string, password: string) {
    try {
        const LOGIN_ENDPOINT = `${getBackendBaseUrl()}/api/v1/login`;

        const response = await fetch(LOGIN_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        return {
            ok: response.ok,
            status: response.status,
            data,
        };
    } catch (error) {
        console.error("Fetch error:", error);
        return {
            ok: false,
            status: 500,
            data: { message: "Không thể kết nối đến server" },
        };
    }
}

export async function authenticate(email: string, password: string) {
    interface JwtPayload {
        id: string | number;
        email: string;
        role: string;
        exp?: number; // thời điểm hết hạn (epoch), optional cũng được
        orig_iat?: number; // issued at, optional
    }

    try {
        const res = await login(email, password);

        if (!res.ok) {
            const errorRes = res.data;
            if (errorRes.code === 401) {
                return {
                    code: 1,
                    error: errorRes.message || "Đăng nhập thất bại",
                };
            }
            if (errorRes.code === 423) {
                return {
                    code: 2,
                    error: errorRes.message || "Tài khoản chưa được kích hoạt",
                };
            }
            return { code: 0, error: errorRes.message || "Đăng nhập thất bại" };
        }

        const { token, expire } = res.data;

        // 👇 Decode JWT để lấy user info
        const payload = decodeJwt(token) as JwtPayload;

        const user = {
            id: payload.id.toString(),
            email: payload.email,
            role: payload.role,
            access_token: token,
            expire,
        };

        // Tạo session NextAuth
        const authResult = await signIn("credentials", {
            ...user,
            redirect: false,
        });

        if (authResult?.error) {
            return { code: 0, error: "Không tạo được session" };
        }

        return { code: 3, data: user };
    } catch {
        return { code: 0, error: "Có lỗi xảy ra" };
    }
}
