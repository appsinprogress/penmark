# Penmark 📝🐧

A CMS you can embed directly into you Markdown-based, Github-backed website/blog. No need to switch between multiple websites, your website/blog is the only place you need.

* Open source. 🙌
* No tracking/ads. 📡🚫
* Markdown or WYSIWYG support. M⬇✍
* Own your data: drafts are stored in your repo. 📝

This package is a set of 3 components that allow you to enable this CMS experience:
* Login: used to login to get GitHub credentials
* Drafts: used to create & edit drafts (stored in your own GitHub under folder _drafts)
* Edit: used to edit existing blog posts

## Getting started 

Here is how to import these 3 components:
1. Login Component: 
   1. Add a hidden page of your blog (for instance, `/login`). This is intended to be only used by the editor of the blog, not readers of the blog, but anybody accessing this page will see the login buttons.
   2.  Add the following script to the body: 
        ```html 
        <script type="module" src="https://cdn.jsdelivr.net/npm/edit-blog-from-site@0.0.9/dist/LoginClient.js"></script>
        ```
2. Drafts Component:
   1. In your home page of your website, add the following script: 
        ```html 
        <script type="module" src="https://cdn.jsdelivr.net/npm/edit-blog-from-site@0.0.9/dist/DraftsClient.js"></script>
        ```
    2. This will only be visible when you are logged in, and only GitHub users who have contributor access to the underlying repository will be able to see the drafts.
3. Edit Component:
   1. In each page of your individual blog post, add the following script:
        ```html 
        <script type="module" src="https://cdn.jsdelivr.net/npm/edit-blog-from-site@0.0.9/dist/PostClient.js"></script>
        ```
    2. This will add an edit button only for logged in users.

Inspired by [utterances](https://github.com/utterance/utterances).
