'use server';

import { FilterQuery, SortOrder } from 'mongoose';
import { revalidatePath } from 'next/cache';
import { TypeOf } from 'zod';
import Thread from '../models/thread.model';
import User from '../models/user.model';
import { connectToDB } from '../mongoose';

interface Params {
    userId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
    path: string;
}

export async function updateUser({
    userId,
    username,
    name,
    bio,
    image,
    path,
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

        if (path === '/profile/edit') {
            revalidatePath(path);
        }
    } catch (error: any) {
        throw new Error(`Faild to create/update user: ${error.message}`);
    }
}

export async function fetchUser(userId: string) {
    try {
        connectToDB();

        return await User.findOne({ id: userId });
        // .populate({
        //     path: 'Communities',
        //     model: Community,
        // });
    } catch (error: any) {
        throw new Error(`Faild to create/update user: ${error.message}`);
    }
}

export async function fetchUserPosts(userId: string) {
    try {
        connectToDB();

        const user = await User.findOne({ id: userId }).populate({
            path: 'threads',
            model: Thread,
            populate: {
                path: 'children',
                model: Thread,
                populate: {
                    path: 'author',
                    model: User,
                    select: '_id id name username',
                },
            },
        });

        // .populate({
        //     path: 'Communities',
        //     model: Community,
        // });
        return user;
    } catch (error: any) {
        throw new Error(`Faild to create/update user: ${error.message}`);
    }
}

export async function fetchUsers({
    userId,
    searchString = '',
    pageNumber = 1,
    pageSize = 20,
    sortBy = 'desc',
}: {
    userId: string;
    searchString?: string;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: SortOrder;
}) {
    try {
        connectToDB();

        // pagination
        const skipAmount = (pageNumber - 1) * pageSize;
        const regex = new RegExp(searchString, 'i');

        const query: FilterQuery<typeof User> = {
            id: { $ne: userId },
        };

        if (searchString.trim() !== '') {
            query.$or = [
                { userName: { $regex: regex } },
                { name: { $regex: regex } },
            ];
        }

        const sortOptions = { createdAt: sortBy };

        const userQuery = User.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize);

        const totalUsersCount = await User.countDocuments(query);
        const users = await userQuery.exec();

        const isNext = totalUsersCount > skipAmount + users.length;

        return { users, isNext };
    } catch (error: any) {
        throw new Error(`Faild to fetch users: ${error.message}`);
    }
}

export async function getActivity(userId: string) {
    try {
        connectToDB();

        // Find all user's threads
        const userThreads = await Thread.find({ author: userId });

        // Collect all the child threads ids
        const childThreadIds = userThreads.reduce((acc, userThread) => {
            return acc.concat(userThread.children);
        }, []);

        const replies = await Thread.find({
            _id: { $in: childThreadIds },
            author: { $ne: userId },
        }).populate({
            path: 'author',
            model: User,
            select: 'name image _id',
        });

        return replies;
    } catch (error: any) {
        throw new Error(`Faild to get user activity: ${error.message}`);
    }
}
