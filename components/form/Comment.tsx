'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { commentThread, createThread } from '@/lib/actions/thread.actions';
import { ThreadValidation } from '@/lib/validations/thread';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import * as z from 'zod';
import { Input } from '../ui/input';

interface Props {
    threadId: string;
    currentUserImg: string;
    currentUserId: string;
}

export default function Comment({
    threadId,
    currentUserId,
    currentUserImg,
}: Props) {
    const pathname = usePathname();
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(ThreadValidation),
        defaultValues: {
            thread: '',
            accountId: currentUserId,
        },
    });

    const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
        await commentThread({
            text: values.thread,
            author: currentUserId,
            communityId: null,
            path: pathname,
            parentId: threadId,
        });
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='comment-form'>
                <FormField
                    control={form.control}
                    name='thread'
                    render={({ field }) => (
                        <FormItem className='flex w-full items-center gap-3'>
                            <FormLabel>
                                <Image
                                    src={currentUserImg}
                                    alt='profile image'
                                    width={48}
                                    height={48}
                                    className='rounded-full object-cover'
                                />
                            </FormLabel>
                            <FormControl className='no-focus border-none bg-transparent text-light-1'>
                                <Input
                                    type='text'
                                    placeholder='Comment'
                                    className='no-focus text-light-1 outline-none'
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type='submit' className='comment-form_btn'>
                    Reply
                </Button>
            </form>
        </Form>
    );
}
