//this file contains the script that is imported by the target blog for the drafts feature
//it's responsibility is to inject the necessary styles, HTML content, and scripts 
//to the target blog needed to provide the CMS functionality

import { getAccessToken, dynamicallyLoadScript } from './shared.js';
import { initDrafts } from './DraftsController.js';

try{
    await getAccessToken();

    var script = document.querySelector('script[src="http://localhost:9000/DraftsClient.js"]');//TODO: make this dynamic
    
    //insert styles into html
    script.insertAdjacentHTML('afterend', /*html*/`
        <style>
            #cms-drafts{
                background-color: #fff;
                padding: 0.2em;
                box-shadow: 0px 0px 20px -10px lightgrey;
                margin: 1em 0;
                border: 1px solid #e1e4e8;
                border-radius: 6px;
            }
    
            /*css for ios scroll bar with rounded borders for cms-drafts-draftlist id div*/
            #cms-drafts-draftlist::-webkit-scrollbar {
                width: 10px;
                height: 10px;
            }
    
            #cms-drafts-draftlist::-webkit-scrollbar-track {
                background: #FFF;
                border-radius: 10px;
            }
            
            #cms-drafts-draftlist::-webkit-scrollbar-thumb {
                background: #CCC;
                border-radius: 10px;
            }
    
            #cms-drafts-draftlist::-webkit-scrollbar-thumb:hover {
                background: #CCC;
            }
    
            #cms-drafts-draftlist {
                align-items: center;
                overflow-x: scroll;
                max-height: 320px;
                overflow-y: scroll;
            }
    
            .draft-element {
                background-color: #ffffff;
                padding: 0.7em;
                min-width: 150px;
                margin-left: 0.6em;
                text-overflow: ellipsis;
                cursor: pointer;
                border-bottom: 1px solid #e1e4e8;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
    
            .draft-element--file {
                font-weight: 600;
                text-overflow: ellipsis;
                overflow: hidden;
            }
                
            .blog-cms--button-outline:hover {
                cursor: pointer;
            }
    
            .blog-cms--button-outline {
                background-color: #282828;
                border: 2px solid #282828;
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
    
            .loadersmall {
                border: 5px solid #f3f3f3;
                -webkit-animation: spin 1s linear infinite;
                animation: spin 1s linear infinite;
                border-top: 5px solid #555;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                margin: 1em;
            }
    
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
    
            button.draft-toggle{
                display: block;
                background-color: white;
                border: none;
                font-size: 0.8em;
                text-align: center;
            }
        </style>
    `);
    
    //insert div & links for cms into html
    script.insertAdjacentHTML('afterend', /*html*/`
        <link rel="preconnect" href="https://api.github.com" />
        <link rel="preconnect" href="https://cdn.skypack.dev" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <div id="cms-drafts" style="display: none;"></div>
    `);
    
    //insert script for prosemirror into html
    dynamicallyLoadScript(script, 'http://localhost:9000/prosemirror.js'); //TODO: make this dynamic
    
    initDrafts();
}
catch(e){
    //do nothing, user is not signed in
}