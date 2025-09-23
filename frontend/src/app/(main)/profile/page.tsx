import { getProfile } from "@/actions/requestApi";
import Profile from "@/components/pages/profile/profile";

export default async function ProfilePage() {
    const result = await getProfile();
    console.log(result);

    return <Profile />;
}
