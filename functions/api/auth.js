// functions/api/auth.js - THE CORRECTED VERSION

export async function onRequest(context) {
    const { env } = context; // We don't need the request URL anymore
    const client_id = env.GITHUB_CLIENT_ID;

    if (!client_id) {
        return new Response("GITHUB_CLIENT_ID not set", { status: 500 });
    }

    try {
        const redirectUrl = new URL('https://github.com/login/oauth/authorize');
        redirectUrl.searchParams.set('client_id', client_id);

        // --- THIS IS THE FIX ---
        // We hardcode the production callback URL so it ALWAYS matches what's in GitHub.
        redirectUrl.searchParams.set('redirect_uri', 'https://travellustmagazine.com/api/callback');
        // --- END OF FIX ---

        redirectUrl.searchParams.set('scope', 'repo user');
        redirectUrl.searchParams.set('state', crypto.randomUUID());

        return Response.redirect(redirectUrl.href, 302);

    } catch (error) {
        console.error(error);
        return new Response(error.message, { status: 500 });
    }
}