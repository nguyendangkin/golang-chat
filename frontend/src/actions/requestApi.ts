"use server";

export async function registerUser(
    email: string,
    password: string,
    confirmPassword: string
) {
    const BACKEND_API_BASE_URL = process.env.BACKEND_API_URL;
    if (!BACKEND_API_BASE_URL) {
        throw new Error(
            "BACKEND_API_URL is not defined in environment variables."
        );
    }

    const REGISTER_ENDPOINT = `${BACKEND_API_BASE_URL}/api/v1/register`;

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
}
