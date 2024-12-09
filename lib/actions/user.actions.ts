'use server';

import { revalidatePath } from 'next/cache';
import Thread from '../models/thread.model';
import User from '../models/user.model';
import { connectToDB } from '../mongoose';

interface Params {
    userId: string;
    username: string;
    name: string;
    image: string;
    bio: string;
    path: string;
}

export async function fetchUser(userId: string) {
    try {
        connectToDB();
        return JSON.parse(JSON.stringify(await User.findOne({ id: userId })));
        // .populate({
        //     path: 'communities',
        //     model: Community,
        // });
    } catch (error: any) {
        throw new Error(`Failed to fetch user: ${error.message}`);
    }
}

export async function fetchUserThreads(userId: string) {
    try {
        connectToDB();

        const user = await User.findOne({ id: userId });
        if (!user) throw new Error('User not found');

        return JSON.parse(
            JSON.stringify(
                await Thread.find({ author: user._id })
                    .populate({
                        path: 'author',
                        model: User,
                        select: 'name image id',
                    })
                    .populate({
                        path: 'children',
                        model: Thread,
                        populate: {
                            path: 'author',
                            model: User,
                            select: 'name image id',
                        },
                    })
            )
        );
    } catch (error: any) {
        throw new Error(`Failed to fetch users threads: ${error.message}`);
    }
}

export async function updateUser({
    userId,
    username,
    bio,
    name,
    path,
    image,
}: Params): Promise<void> {
    try {
        connectToDB();

        await User.findOneAndUpdate(
            { id: userId },
            {
                username: username.toLowerCase(),
                name,
                bio,
                image,
                onboarded: true,
            },
            { upsert: true }
        );
        const user = await User.findOne({ id: userId });

        if (path === '/profile/edit') {
            revalidatePath(path);
        }
    } catch (error: any) {
        throw new Error(`Failed to create/update user: ${error.message}`);
    }
}
