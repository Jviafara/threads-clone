import AccountProfile from '@/components/forms/AccountProfile';
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default async function Page() {
    const user = await currentUser();
    if (!user) redirect('/sign-in');

    const userInfo = await fetchUser(user.id);

    const userData = {
        id: user?.id,
        objectId: userInfo?.id,
        username: user?.username || userInfo?.username,
        name: user?.firstName + ' ' + user?.lastName || userInfo?.name || '',
        bio: userInfo?.bio || '',
        image: user?.imageUrl || userInfo?.image || '',
    };

    return (
        <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
            <h1 className="head-text">On Boarding</h1>
            <p className="mt-3 text-base-regular text-light-2">
                Complete your profile now to use Threads
            </p>

            <section className="mt-9 bg-dark-2 p-10">
                <AccountProfile user={userData} btnTitle="Continue" />
            </section>
        </main>
    );
}
