import ThreadCard from '@/components/cards/ThreadCard';
import Comment from '@/components/form/Comment';
import { fetchThreadById } from '@/lib/actions/thread.actions';
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function Thread({ params }: { params: { id: string } }) {
    const { id } = await params;
    if (!id) return null;

    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect('/onboarding');

    const thread = await fetchThreadById(id);

    return (
        <section className='relative'>
            <div>
                <ThreadCard
                    id={thread._id}
                    currentUserId={userInfo.id}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={thread.author}
                    community={thread.community}
                    createdAt={thread.createdAt}
                    comments={thread.children}
                />
            </div>
            <div className='mt-7'>
                <Comment
                    threadId={id}
                    currentUserImg={userInfo.image}
                    currentUserId={userInfo._id}
                />
            </div>
            <div className='mt-10'>
                {thread.children.map((child: any) => (
                    <ThreadCard
                        key={child._id}
                        id={child._id}
                        currentUserId={userInfo.id}
                        parentId={child.parentId}
                        content={child.text}
                        author={child.author}
                        community={child.community}
                        createdAt={child.createdAt}
                        comments={child.children}
                        isComment={true}
                    />
                ))}
            </div>
        </section>
    );
}