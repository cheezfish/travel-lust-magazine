// functions/api/auth.js

export async function onRequest(context) {
    const { env, request } = context;
    const client_id = env.GITHUB_CLIENT_ID;

    // IMPORTANT: Make sure GITHUB_CLIENT_ID is set in your Cloudflare Pages environment variables
    if (!client_id) {
        return new Response("GITHUB_CLIENT_ID not set", { status: 500 });
    }

    try {
        const url = new URL(request.url);
        const redirectUrl = new URL('https://github.com/login/oauth/authorize');
        redirectUrl.searchParams.set('client_id', client_id);
        // This callback MUST match the one you set in your GitHub OAuth App
        redirectUrl.searchParams.set('redirect_uri', `${url.origin}/api/callback`);
        redirectUrl.searchParams.set('scope', 'repo user');
        redirectUrl.searchParams.set('state', crypto.randomUUID()); // Use a secure random state

        return Response.redirect(redirectUrl.href, 302); // Use 302 for temporary redirect

    } catch (error) {
        console.error(error);
        return new Response(error.message, { status: 500 });
    }
}