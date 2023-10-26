import { fetchUserPosts } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import ThreadCard from '../cards/ThreadCard';

interface Props {
    currentUserId: string;
    accountId: string;
    accountType: string;
}

async function ThreadsTab({ currentUserId, accountId, accountType }: Props) {
    const result = await fetchUserPosts(accountId);

    if (!result) redirect('/');

    return (
        <section className="mt-9 flex flex-col gap-10">
            {result.threads.map((thread: Thread) => {
                const author = {
                    name: result.name,
                    id: result.id,
                    image: result.image,
                };
                return (
                    <ThreadCard
                        key={thread._id}
                        currentUserId={currentUserId}
                        thread={thread}
                        author={author}
                    />
                    // <div>1</div>
                );
            })}
        </section>
    );
}

export default ThreadsTab;
