'use server'

import { redirect } from "next/navigation";

export async function signInWithGitHub() {
    const githubSignInUrl = new URL('login/oauth/authorize', 'https://github.com');

    githubSignInUrl.searchParams.set('client_id', 'YOUR_CLIENT_ID');
    githubSignInUrl.searchParams.set('redirect_uri', 'YOUR_REDIRECT_URI');
    githubSignInUrl.searchParams.set('scope', 'user');

    redirect(githubSignInUrl.toString());
}