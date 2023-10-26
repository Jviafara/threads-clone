import { fetchUser, getActivity } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

async function Page() {
    const user = await currentUser(); // Get user from clerk
    if (!user) return null; //Check if user is logged in

    const userInfo = await fetchUser(user.id); //Fetch user info from database
    if (!userInfo.onboarded) redirect('/onboarding'); //Check for onboarded status

    const activities = await getActivity(userInfo._id);

    return (
        <section>
            <h1 className="head-text mb-10">Activity</h1>

            <section className="mt-10 flex flex-col gap-5">
                {activities.length > 0 ? (
                    <>
                        {activities.map((activity) => (
                            <Link
                                key={activity._id}
                                href={`/thread/${activity.parentId}`}>
                                <article className="activity-card">
                                    <Image
                                        src={activity.author.image}
                                        alt="profile pic"
                                        width={20}
                                        height={20}
                                        className="rounded-full"
                                    />
                                    <p className="!text-small-regular text-light-1">
                                        <span className="mr-1 text-primary-500">
                                            {activity.author.name}
                                        </span>{' '}
                                        replied to your thread
                                    </p>
                                </article>
                            </Link>
                        ))}
                    </>
                ) : (
                    <p className="!text-base-regular text-gray-1">
                        No Activity Yet
                    </p>
                )}
            </section>
        </section>
    );
}

export default Page;
