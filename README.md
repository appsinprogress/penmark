# 🖊️ Penmark

A lightweight CMS you can embed directly into your Markdown-based, Github-backed website/blog. No need to switch between multiple websites, your website is all you need.

* Open source 🙌
* No tracking/ads 📡🚫
* WYSIWYG or Markdown support M⬇✍
* Own your data: drafts are stored in your repo 📝

![penmark-components](https://github.com/penmark-cms/penmark/assets/35609369/c96f0fc9-60c2-4e59-bea1-027fa6c9bf48)

This package is a set of 3 components that you can add to your own website to enable this CMS experience:
* Login: used to login to get GitHub credentials
* Drafts: used to create & edit drafts (stored in your own GitHub repo)
* Edit: used to edit existing blog posts

## Getting started 

1. Ensure you have the [Penmark-CMS GitHub App](https://github.com/apps/penmark-cms) installed on your repository. 
1. Login Component: 
   1. Add a hidden page of your blog (for instance, `/login`). This is intended to be only used by the editor of the blog, not readers of the blog. Anybody accessing this page will see the login buttons.
   2.  Add the following script to the body: 
        ```html 
        <script type="module" src="https://penmark.appsinprogress.com/dist/LoginClient.js"></script>
        ```
2. Drafts Component:
   1. In your home page of your website, add the following script: 
        ```html 
        <script type="module" src="https://penmark.appsinprogress.com/dist/DraftsClient.js"></script>
        ```
    2. This will only be visible when you are logged in, and only GitHub users who have contributor access to the underlying repository will be able to see the drafts.
3. Edit Component:
   1. In each page of your individual blog post, add the following script:
        ```html 
        <script type="module" src="https://penmark.appsinprogress.com/dist/PostClient.js"></script>
        ```
    2. This will add an edit button only for logged in users.

## For additional details, refer to [docs](https://penmark.appsinprogress.com/docs)

Inspired by [utterances](https://github.com/utterance/utterances).
