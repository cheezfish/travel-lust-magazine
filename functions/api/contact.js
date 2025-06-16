// functions/api/contact.js

export async function onRequestPost(context) {
  try {
    // 1. Get the form data from the request
    const formData = await context.request.formData();
    const data = Object.fromEntries(formData); // { name: "...", email: "...", message: "..." }

    // 2. Send the email using the Resend API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        // Get the API key from the environment variables
        Authorization: `Bearer ${context.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "submissions@travellustmagazine.com", // <-- ★★★ REPLACE WITH A 'from' ADDRESS ON YOUR VERIFIED DOMAIN ★★★
        to: "themankymoo@gmail.com",     // <-- ★★★ REPLACE WITH THE EMAIL ADDRESS YOU WANT TO RECEIVE MESSAGES AT ★★★
        subject: `New submission from ${data.name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
          <p><strong>Message:</strong></p>
          <p>${data.message.replace(/\n/g, '<br>')}</p>
        `,
        // Set the reply-to field to the user's email to make it easy to reply
        reply_to: data.email, 
      }),
    });

    // Check if the email was sent successfully
    if (!response.ok) {
      // Log the error from Resend for debugging
      const error = await response.json();
      console.error("Resend API Error:", error);
      throw new Error("Failed to send email.");
    }

    // 3. Redirect to a "thank you" page on success
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/thank-you/",
      },
    });

  } catch (error) {
    // 4. If something goes wrong, return an error message
    console.error(error);
    return new Response("Form submission failed.", { status: 500 });
  }
}