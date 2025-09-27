"use server";

import { signIn, signOut } from "@/auth";
import decodeJwt from "@/utils/decodeJwt";
import { auth } from "@/auth";

interface JwtPayload {
    id: string | number;
    email: string;
    role: string;
}

function getBackendBaseUrl(): string {
    const BACKEND_API_BASE_URL = process.env.BACKEND_API_URL;
    if (!BACKEND_API_BASE_URL) {
        throw new Error(
            "BACKEND_API_URL is not defined in environment variables."
        );
    }
    return BACKEND_API_BASE_URL;
}
async function makeAuthenticatedRequest(
    endpoint: string,
    options: RequestInit = {}
) {
    try {
        const session = await auth();

        if (!session?.user.token) {
            return {
                ok: false,
                status: 401,
                data: { message: "Không tìm thấy token trong session" },
            };
        }

        const url = `${getBackendBaseUrl()}${endpoint}`;

        // Thực hiện request đầu tiên
        const response = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.user.token}`,
                ...options.headers,
            },
        });

        const data = await response.json();

        return {
            ok: response.ok,
            status: response.status,
            data,
        };
    } catch (error) {
        console.error(error);
        return {
            ok: false,
            status: 500,
            data: { message: "Không thể kết nối đến server" },
        };
    }
}

async function makePublicRequest(endpoint: string, options: RequestInit = {}) {
    try {
        const url = `${getBackendBaseUrl()}${endpoint}`;

        const response = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
        });

        const data = await response.json();
        return {
            ok: response.ok,
            status: response.status,
            data,
        };
    } catch {
        return {
            ok: false,
            status: 500,
            data: { message: "Không thể kết nối đến server" },
        };
    }
}

export async function registerUser(
    email: string,
    password: string,
    confirmPassword: string
) {
    return makePublicRequest("/api/v1/register", {
        method: "POST",
        body: JSON.stringify({ email, password, confirmPassword }),
    });
}

export async function verifyCode(email: string, code: string) {
    return makePublicRequest("/api/v1/verify-code", {
        method: "POST",
        body: JSON.stringify({ email, code }),
    });
}

export async function resendVerifyCode(email: string) {
    return makePublicRequest("/api/v1/resend-verify-code", {
        method: "POST",
        body: JSON.stringify({ email }),
    });
}

export async function login(email: string, password: string) {
    return makePublicRequest("/api/v1/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });
}

export async function logout() {
    await signOut({ redirectTo: "/login" });
}

export async function authenticate(email: string, password: string) {
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

        const { token } = res.data;

        // Decode JWT để lấy user info
        const payload = decodeJwt(token) as JwtPayload;

        const user = {
            id: payload.id.toString(),
            email: payload.email,
            role: payload.role,
            token,
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

//  AUTHENTICATED API
export async function getProfile() {
    return makeAuthenticatedRequest("/api/v1/profile", {
        method: "GET",
    });
}

export async function getRefreshToken() {
    return makeAuthenticatedRequest("/api/v1/refresh-token", {
        method: "GET",
    });
}
