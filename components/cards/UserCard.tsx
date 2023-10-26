'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';

interface Props {
    id: string;
    name: string;
    username: string;
    imageUrl: string;
    personType: string;
}

const UserCard = ({ id, name, username, imageUrl, personType }: Props) => {
    const router = useRouter();
    return (
        <article className="user-card">
            <div className="user-card_avatar">
                <Image
                    src={imageUrl}
                    alt="logo"
                    width={48}
                    height={48}
                    className="rounded-full"
                />
                <div className="flex-1 text-ellipsis">
                    <h4 className="text-base-medium text-light-1">{name}</h4>
                    <p className="text-small-medium text-gray-1">@{username}</p>
                </div>
            </div>

            <Button
                onClick={() => router.push(`/profile/${id}`)}
                className="user-card_btn">
                View
            </Button>
        </article>
    );
};

export default UserCard;
