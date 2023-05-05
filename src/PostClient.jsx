//this file contains the script that is imported by the target blog for the post editor feature
//it's responsibility is to inject the necessary styles, HTML content, and scripts 
//to the target blog needed to provide the CMS functionality to edit a current blog post

//this file must be added to the HTML where the desired buttons are to be placed

import { getAccessToken, dynamicallyLoadScript } from './shared.js';
import { initPostEditor } from './PostController.jsx';

try{
    //this function will throw an error if the user is not logged in,
    //ensuring that code is not unnecessarily executed/imported
    await getAccessToken();

    var script = document.querySelector(`script[src="${__JS_PACKAGE_HOST__}/PostClient.js"]`); //TODO: make this dynamic
    var postFilePath = script.getAttribute("postfilepath");

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

        <div>
            <div id="cms-buttons">
                <button id="edit-button" class="blog-cms--button-outline">
                    <i class="fa fa-pencil-square-o" style="padding-right: 4px;"></i>Edit
                </button>
            </div> 
            <div id="modalParent">
            </div>
        </div>
    `);

    //insert script for prosemirror into html
    dynamicallyLoadScript(script, `${__JS_PACKAGE_HOST__}/prosemirror.js`);

    initPostEditor(postFilePath);
}
catch(e){
    //do nothing, user is not logged in
}
