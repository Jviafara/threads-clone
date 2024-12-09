'use server';

import { revalidatePath } from 'next/cache';
import Thread from '../models/thread.model';
import User from '../models/user.model';
import { connectToDB } from '../mongoose';

interface Params {
    text: string;
    author: string;
    communityId: string | null;
    path: string;
}
export async function createThread({
    text,
    author,
    communityId,
    path,
}: Params) {
    try {
        connectToDB();
        const newThread = await Thread.create({
            text,
            author,
            community: null,
        });

        //  Update UserModel
        await User.findByIdAndUpdate(author, {
            $push: { threads: newThread._id },
        });

        revalidatePath(path);
    } catch (err: any) {
        throw new Error(`Error creating thread: ${err.message}`);
    }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
    try {
        connectToDB();

        // Calculate post slip for pagination
        const skipNumber = (pageNumber - 1) * pageSize;

        // Fetch posts that have no parents (Top-level threads)
        const postQuery = Thread.find({
            parentId: { $in: [null, undefined] },
        })
            .sort({ createdAt: 'desc' })
            .skip(skipNumber)
            .limit(pageSize)
            .populate({ path: 'author', model: User })
            .populate({
                path: 'children',
                populate: {
                    path: 'author',
                    model: User,
                    select: '_id name paraentId image',
                },
            });

        const totalPosts = await Thread.countDocuments({
            parentId: { $in: [null, undefined] },
        });

        const posts = await postQuery.exec();
        const isNext = totalPosts > skipNumber + posts.length;

        return { posts, isNext };
    } catch (error) {
        throw new Error(`Error fetching posts: ${error}`);
    }
}
