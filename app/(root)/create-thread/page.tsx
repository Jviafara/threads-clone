import PostThread from '@/components/form/PostThread';
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function CreateThread() {
    const user = await currentUser();
    if (!user) return null;

    const userInfo = JSON.parse(JSON.stringify(await fetchUser(user.id)));
    if (!userInfo?.onboarded) redirect('/');

    return (
        <>
            <h1 className='head-text text-left'>Create Thread</h1>
            <PostThread userId={userInfo._id} />
        </>
    );
}
