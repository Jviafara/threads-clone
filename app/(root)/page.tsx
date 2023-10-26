import ThreadCard from '@/components/cards/ThreadCard';
import { fetchPosts } from '@/lib/actions/thread.actions';
import { currentUser } from '@clerk/nextjs';

export default async function Home() {
    const user = await currentUser();

    const result = await fetchPosts(1, 30);

    return (
        <>
            <h1 className="head-text text-left">Home</h1>
            <section className="mt-9 flex flex-col gap-10 ">
                {result.posts.length === 0 ? (
                    <p className="no-result">No Threads Found</p>
                ) : (
                    <>
                        {result.posts.map((post) => {
                            const thread: Omit<
                                Omit<Thread, never>,
                                never
                            > = post;
                            return (
                                <ThreadCard
                                    key={post._id}
                                    currentUserId={user?.id || ''}
                                    thread={thread}
                                    author={thread.author}
                                />
                            );
                        })}
                    </>
                )}
            </section>
        </>
    );
}
