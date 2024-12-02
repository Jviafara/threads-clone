import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/']);

export default clerkMiddleware(async (auth, req) => {
    PublicRoutes: ['/', '/api/webhook/clerk'];
    ignoredRoutes: ['/api/webhook/clerk'];

    if (!isPublicRoute(req)) {
        await auth.protect();
    }
});

export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
