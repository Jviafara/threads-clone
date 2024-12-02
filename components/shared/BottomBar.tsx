'use client';
import { sidebarLinks } from '@/constants';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomBar() {
    const pathName = usePathname();

    return (
        <section className='bottombar'>
            <div className='bottombar_container'>
                {sidebarLinks.map((link) => {
                    const isActive =
                        (pathName.includes(link.route) &&
                            link.route.length > 1) ||
                        pathName === link.route;

                    return (
                        <Link
                            key={link.label}
                            href={link.route}
                            className={`bottombar_link ${
                                isActive && 'bg-primary-500'
                            }`}>
                            <Image
                                src={link.imgURL}
                                alt='link'
                                width={24}
                                height={24}
                            />
                            <p className='text-light-1 text-subtle-medium max-sm:hidden'>
                                {link.label.split(/\s+/)[0]}
                            </p>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
