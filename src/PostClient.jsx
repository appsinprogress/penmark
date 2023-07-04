//this file contains the script that is imported by the target blog for the post editor feature
//it's responsibility is to inject the necessary styles, HTML content, and scripts 
//to the target blog needed to provide the CMS functionality to edit a current blog post

//this file must be added to the HTML where the desired buttons are to be placed

import { getAccessToken, dynamicallyLoadScript } from './helpers/userAccessHelpers.js';
import { initPostEditor } from './PostController.jsx';

window.penmarkPostInit = async function penmarkPostInit(){
    try{
        //this function will throw an error if the user is not logged in,
        //ensuring that code is not unnecessarily executed/imported
        await getAccessToken();

        var script = document.querySelector(`script[src="${__JS_PACKAGE_HOST__}/PostClient.js"]`); //TODO: make this dynamic
        var postFilePath = script.getAttribute("postfilepath");

        //the script looks like this
        // <script 
        //     type="module" 
        //     src="http://localhost:9000/DraftsClient.js"
        //     draftsFolder="drafts"
        //     postsFolder="content/posts"
        //     imagesFolder="static/images"
        //     githubUsername="username>"
        //     githubRepoName="blog"
        // ></script>


        //extract the information from the script tag
        //default are jekyll values

        //get the draft folder name
        var draftsFolder = script.getAttribute('draftsFolder');
        if(!draftsFolder) draftsFolder = '_drafts';

        //get the posts folder name
        var postsFolder = script.getAttribute('postsFolder');
        if(!postsFolder) postsFolder = '_posts';

        //get the images folder name
        var imagesFolder = script.getAttribute('imagesFolder');
        if(!imagesFolder) imagesFolder = 'uploads';

        //get the github username
        var githubUsername = script.getAttribute('githubUsername');

        //get the github repo name
        var githubRepoName = script.getAttribute('githubRepoName');

        console.log(githubRepoName)

        //insert styles and divs into html
        script.insertAdjacentHTML('afterend', /*html*/`
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

            <style>
                .blog-cms--button-outline {
                    background-color: #282828;
                    border: none;
                    color: white;
                    padding: 0.6em 0.8em;
                    font-weight: 600;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    font-size: 16px;
                    border-radius: 5px;
                    margin: 0.5em 0.2em;
                    font-size: 0.9em;
                }
            </style>

            <div id="react">
            </div>
        `);

        initPostEditor(postFilePath, draftsFolder, postsFolder, imagesFolder, githubUsername, githubRepoName);
    }
    catch(e){
        //do nothing, user is not logged in
    }
}

penmarkPostInit();