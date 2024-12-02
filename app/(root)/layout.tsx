import BottomBar from '@/components/shared/BottomBar';
import LeftSideBar from '@/components/shared/LeftSideBar';
import TopBar from '@/components/shared/TopBar';
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import RightSideBar from '../../components/shared/RightSideBar';
import '../globals.css';

export const metadata = {
    title: 'Threads',
    description: 'A Next.js 15 Threads aplicattion clone',
};
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider afterSignOutUrl={'/'}>
            <html lang='en'>
                <body className={`antialiased`}>
                    <TopBar />
                    <main className='flex flex-row'>
                        <LeftSideBar />
                        <section className='main-container'>
                            <div className='w-full max-w-4xl'>{children}</div>
                        </section>
                        <RightSideBar />
                    </main>
                    <BottomBar />
                </body>
            </html>
        </ClerkProvider>
    );
}
