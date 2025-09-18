"use client";

import { IUser } from "../../../auth";

type HomeProps = {
    user: IUser;
};

export default function Home({ user }: HomeProps) {
    console.log(user.email);
    return <div>Home nè</div>;
}
