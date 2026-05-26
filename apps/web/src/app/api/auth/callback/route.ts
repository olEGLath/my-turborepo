import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import {signInWithGitHub} from "@/http/sign-in-with-github";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    const code = searchParams.get("code");

    if (!code) {
        return NextResponse.json({ message: "GitHub OAuth code was not found." }, { status: 400 });
    }

    const redirectUrl = request.nextUrl.clone();

    redirectUrl.pathname = "/";
    redirectUrl.search = "";

    return NextResponse.redirect(redirectUrl)
}