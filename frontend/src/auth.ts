import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export interface IUser {
    id: string;
    email: string;
    role: string;
    access_token: string;
    expire: string;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                id: {},
                email: {},
                role: {},
                access_token: {},
                expire: {},
            },
            authorize: async (credentials) => {
                if (!credentials?.email) return null;

                // trả user trực tiếp → sẽ được gắn vào JWT và session
                return {
                    id: credentials.id as string,
                    email: credentials.email as string,
                    role: credentials.role as string,
                    access_token: credentials.access_token as string,
                    expire: credentials.expire as string,
                };
            },
        }),
    ],
    callbacks: {
        jwt({ token, user }) {
            if (user) token.user = user as IUser;
            return token;
        },
        session({ session, token }) {
            session.user = token.user as IUser;
            return session;
        },
    },
    pages: { signIn: "/login" },
});
