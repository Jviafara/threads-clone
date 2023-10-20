import PostThread from '@/components/forms/PostThread';
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default async function Page() {
    const user = await currentUser(); // Get user from clerk
    if (!user) return null; //Check if user is logged in
    const userInfo = await fetchUser(user.id); //Fetch user info from database
    if (!userInfo.onboarded) redirect('/onboarding'); //Check for onboarded status

    return (
        <>
            <h1 className="head-text">Create Thread</h1>
            <PostThread userId={userInfo._id.toString()} />
        </>
    );
}
