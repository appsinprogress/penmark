//this file provides some helper functions needed by other scripts

//the following code will be executed on a blog post page

import { Octokit } from "octokit";

export async function getAccessToken() {
    var editBlogContentFromSiteSession = localStorage.getItem("edit-blog-content-from-site-session");
    if (editBlogContentFromSiteSession) {
        //retrieve github access token from azure function

        var response = await fetch("https://penmark-oauth.appsinprogress.com/api/getAccessToken?" + new URLSearchParams({
            session: editBlogContentFromSiteSession
        }));
        var data = await response.json();

        return data.token;
    }
    else {
        throw new Error("You are not logged in.")
        return null;
    }
}

export async function getUser(accessToken) {
    var octokit = new Octokit({
        auth: accessToken
    });;

    const response = await octokit.request('GET /user', {})

    let user = response.data;

    const response2 = await octokit.request('GET /user/emails', {})

    const userEmail = response2.data.find(email => email.primary)

    user.email = userEmail.email;

    return user;
}

export function dynamicallyLoadScript(script, url, typeIsModule) {
    var scriptToInsert = document.createElement("script");

    if (typeIsModule) scriptToInsert.type = "module";
    scriptToInsert.src = url;

    script.parentElement.appendChild(scriptToInsert);
}
