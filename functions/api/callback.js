// functions/api/callback.js

// This helper function creates the HTML that passes the token to the CMS UI
function renderBody(status, content) {
    return `
    <script>
      const receiveMessage = (message) => {
        window.opener.postMessage(
          'authorization:github:${status}:${JSON.stringify(content)}',
          message.origin
        );
        window.removeEventListener("message", receiveMessage, false);
      }
      window.addEventListener("message", receiveMessage, false);
      window.opener.postMessage("authorizing:github", "*");
    </script>
    `;
}

export async function onRequest(context) {
    const { env, request } = context;
    const client_id = env.GITHUB_CLIENT_ID;
    const client_secret = env.GITHUB_CLIENT_SECRET;

    // IMPORTANT: Make sure these are set in your Cloudflare Pages environment variables
    if (!client_id || !client_secret) {
        return new Response("GitHub client ID or secret not set", { status: 500 });
    }
    
    try {
        const url = new URL(request.url);
        const code = url.searchParams.get('code');

        const response = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json',
            },
            body: JSON.stringify({ client_id, client_secret, code }),
        });
        
        const result = await response.json();

        if (result.error) {
            console.error("GitHub Auth Error:", result.error_description);
            return new Response(renderBody('error', result), {
                status: 401,
                headers: { 'Content-Type': 'text/html' },
            });
        }

        const token = result.access_token;
        const provider = 'github';
        const responseBody = renderBody('success', { token, provider });
        
        return new Response(responseBody, {
            status: 200,
            headers: { 'Content-Type': 'text/html' },
        });

    } catch (error) {
        console.error(error);
        return new Response(error.message, { status: 500 });
    }
}