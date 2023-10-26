import ThreadCard from '@/components/cards/ThreadCard';
import Comment from '@/components/forms/Comment';
import { fetchPostDetails } from '@/lib/actions/thread.actions';
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

async function Page({ params }: { params: { id: string } }) {
    if (!params.id) return null;

    const user = await currentUser();
    if (!user) return null;
    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect('/onboarding');

    const thread = await fetchPostDetails(params.id);

    return (
        <section className="relative">
            <div>
                <ThreadCard
                    currentUserId={user?.id || ''}
                    thread={thread}
                    author={thread.author}
                />
            </div>
            <div className="mt-7">
                <Comment
                    threadId={thread.id}
                    currentUserImg={userInfo.image}
                    currentUserId={JSON.stringify(userInfo._id)}
                />
            </div>
            <div className="mt-10">
                {thread.children.map((child: Thread) => (
                    <ThreadCard
                        key={child._id}
                        currentUserId={userInfo._id}
                        thread={child}
                        author={child.author}
                    />
                ))}
            </div>
        </section>
    );
}

export default Page;
