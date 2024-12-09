import { fetchUser, fetchUserThreads } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import ThreadCard from '../cards/ThreadCard';

interface Props {
    currentUserId: string;
    accountId: string;
    accountType: string;
}

export default async function ThreadsTab({
    currentUserId,
    accountId,
    accountType,
}: Props) {
    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect('/onboarding');

    const threads = await fetchUserThreads(accountId);
    if (!threads) redirect('/');

    return (
        <section className='mt-9 flex flex-col gap-10'>
            {threads.map((thread) => (
                <ThreadCard
                    key={thread._id}
                    id={thread._id}
                    currentUserId={userInfo.id}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={thread.author}
                    community={thread.community}
                    createdAt={thread.createdAt}
                    comments={thread.children}
                />
            ))}
        </section>
    );
}
