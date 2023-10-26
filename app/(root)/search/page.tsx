import UserCard from '@/components/cards/UserCard';
import { fetchUser, fetchUsers } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

async function Page() {
    const user = await currentUser(); // Get user from clerk
    if (!user) return null; //Check if user is logged in

    const userInfo = await fetchUser(user.id); //Fetch user info from database
    if (!userInfo.onboarded) redirect('/onboarding'); //Check for onboarded status

    // Fetch Users
    const result = await fetchUsers({
        userId: user.id,
        searchString: '',
        pageNumber: 1,
        pageSize: 25,
    });

    return (
        <section>
            <h1 className="head-text mb-10">Search</h1>

            {/* Search Bar */}
            {/* Search Bar */}

            {/* User List */}
            <div className="mt-14 flex flex-col gap-9">
                {result.users.length === 0 ? (
                    <p className="no-result">No Users</p>
                ) : (
                    <>
                        {result.users.map((user) => (
                            <UserCard
                                key={user.id}
                                id={user.id}
                                name={user.name}
                                username={user.username}
                                imageUrl={user.image}
                                personType="User"
                            />
                        ))}
                    </>
                )}
            </div>
            {/* User List */}
        </section>
    );
}

export default Page;
