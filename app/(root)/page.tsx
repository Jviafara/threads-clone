import ThreadCard from '@/components/cards/ThreadCard';
import { fetchPosts } from '@/lib/actions/thread.actions';
import { currentUser } from '@clerk/nextjs/server';

export default async function Home() {
    const user = await currentUser();
    if (!user) return null;

    const res = JSON.parse(JSON.stringify(await fetchPosts(1, 30)));

    return (
        <>
            <h1 className='head-text text-left'>Home</h1>
            <section className='mt-9 flex flex-col gap-10'>
                {res.posts.length === 0 ? (
                    <p className='no-result'>No threads found</p>
                ) : (
                    <>
                        {res.posts.map((post: any) => (
                            <ThreadCard
                                key={post._id}
                                id={post._id}
                                currentUserId={user.id}
                                parentId={post.parentId}
                                content={post.text}
                                author={post.author}
                                community={post.community}
                                createdAt={post.createdAt}
                                comments={post.children}
                            />
                        ))}
                    </>
                )}
            </section>
        </>
    );
}
