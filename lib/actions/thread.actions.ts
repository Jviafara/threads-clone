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

        const createThread = await Thread.create({
            text,
            author,
            communityId,
        });

        // Update user model
        await User.findByIdAndUpdate(author, {
            $push: { threads: createThread._id },
        });

        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Faild to create/update Post: ${error.message}`);
    }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
    try {
        connectToDB();

        // Calculate number of posts to skip
        const skip = (pageNumber - 1) * pageSize;

        // Fetch Posts
        const postQuery = Thread.find({
            parentId: { $in: [null, undefined] },
        })
            .sort({ createdAt: 'desc' })
            .skip(skip)
            .limit(pageSize)
            .populate({ path: 'author', model: User })
            .populate({
                path: 'children',
                populate: {
                    path: 'author',
                    model: User,
                    select: '_id name parentID image',
                },
            });

        const totalPostCount = await Thread.countDocuments({
            parentId: { $in: [null, undefined] },
        });

        const posts = await postQuery.exec();

        const isNext = totalPostCount > skip + posts.length;

        return { posts, isNext };
    } catch (error: any) {
        throw new Error(`Faild to Fetch Posts: ${error.message}`);
    }
}

export async function fetchPostDetails(id: string) {
    try {
        connectToDB();

        // Fetch Post
        const postQuery = Thread.findById(id)
            .populate({
                path: 'author',
                model: User,
                select: '_id id name image',
            })
            .populate({
                path: 'children',
                populate: [
                    {
                        path: 'author',
                        model: User,
                        select: '_id name parentID image',
                    },
                    {
                        path: 'children',
                        model: Thread,
                        populate: {
                            path: 'author',
                            model: User,
                            select: '_id id name image',
                        },
                    },
                ],
            });

        const post = await postQuery.exec();

        return post;
    } catch (error: any) {
        throw new Error(`Faild to Fetch Post: ${error.message}`);
    }
}

export async function addCommentToThread(
    threadId: string,
    commentText: string,
    userId: string,
    path: string
) {
    try {
        connectToDB();

        // Fetch original Thread
        const originalThread = await Thread.findById(threadId);
        if (!originalThread) {
            throw new Error('Thread not Found');
        }

        // Create new Thread comment
        const commentThread = new Thread({
            text: commentText,
            author: userId,
            parentId: threadId,
        });

        const commentSaved = await commentThread.save();

        originalThread.children.push(commentSaved._id);
        if (!originalThread?.isComment) originalThread.isComment = true;
        await originalThread.save();

        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Error Adding new Comment: ${error.message}`);
    }
}
