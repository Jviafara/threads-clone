'use client';

interface Props {
    user: {
        id: string;
        objectId: string;
        username: string;
        name: string;
        bio: string;
        image: string;
    };
    btnTitle: string;
}

export default function Accountprofile({ user, btnTitle }: Props) {
    return <div>Accountprofile</div>;
}
