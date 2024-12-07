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
