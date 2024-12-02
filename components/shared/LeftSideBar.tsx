'use client';
import { sidebarLinks } from '@/constants';
import { SignedIn, SignOutButton } from '@clerk/clerk-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
export default function LeftSideBar() {
    const router = useRouter();
    const pathName = usePathname();

    return (
        <section className='custom-scrollbar leftsidebar'>
            <div className='flex w-full flex-1 flex-col gap-6 px-6'>
                {sidebarLinks.map((link) => {
                    const isActive =
                        (pathName.includes(link.route) &&
                            link.route.length > 1) ||
                        pathName === link.route;

                    return (
                        <Link
                            key={link.label}
                            href={link.route}
                            className={`leftsidebar_link ${
                                isActive && 'bg-primary-500'
                            }`}>
                            <Image
                                src={link.imgURL}
                                alt='link'
                                width={24}
                                height={24}
                            />
                            <p className='text-light-1 max-lg:hidden'>
                                {link.label}
                            </p>
                        </Link>
                    );
                })}
            </div>
            <div className='mt-10 px-6'>
                <SignedIn>
                    <SignOutButton redirectUrl='/sign-in'>
                        <div className='flex cursor-pointer gap-4 p-4'>
                            <Image
                                src='/assets/logout.svg'
                                alt='sign-out'
                                width={24}
                                height={24}
                            />
                            <p className='text-light-2 max-lg:hidden'>LogOut</p>
                        </div>
                    </SignOutButton>
                </SignedIn>
            </div>
        </section>
    );
}
