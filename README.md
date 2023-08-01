# 🖊️ Penmark

A lightweight CMS you can embed directly into your Markdown-based, Github-backed website/blog. No need to switch between multiple websites, your website is all you need.

* Open source 🙌
* No tracking/ads 📡🚫
* WYSIWYG or Markdown support ✍
* Own your data: drafts are stored in your repo 📝

<img width="3047" alt="penmark-story" src="https://github.com/penmark-cms/penmark/assets/35609369/7fbc08f4-56fe-42d0-a364-3f26c1d42203">

This package is a set of 3 components that you can add to your own website to enable this CMS experience:
* Login: used to login to get GitHub credentials
* Drafts: used to create & edit drafts (stored in your own GitHub repo)
* Edit: used to edit existing blog posts

## Why use Penmark?

Static site generators are great, but they can be tedious to use. Editing Markdown files requires the use of an external editor, and any changes must be manually saved to the repository with Git. So, editing is limited to your computer, making editing on the go is difficult. 

With Penmark, you can edit whenever inspiration strikes, directly from your website, and while keeping your GitHub repository as the single source of truth for your content. 

## Getting started 

Adding Penmark to your site consists of adding the GitHub app to your repository, and then adding the 3 components to your site. The CMS experience will only be visible to logged in users, and won't affect your users. You may refer to [docs](https://penmark.appsinprogress.com/docs) for framework-specific configurations of Penmark.

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
  
## Examples

Penmark can be added to any website or static site generator. Here are examples for popular SSGs:
* [NextJS with Penmark](https://github.com/penmark-cms/penmark-nextjs-example)
* [Hugo with Penmark](https://github.com/penmark-cms/penmark-hugo-example)
* [Jekyll with Penmark](https://github.com/penmark-cms/penmark-jekyll-example)

## For additional details, refer to [docs](https://penmark.appsinprogress.com/docs)
Docs specify how to configure Penmark for Jekyll, Hugo and NextJS static site generators, along with generic steps for all other static site generators.

Inspired by [utterances](https://github.com/utterance/utterances).
