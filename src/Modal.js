//this file contains the structure of the modal that allows editing of the blog content
//it uses some web component concepts, providing getters & setters that can be used to set 
//some attributes of the modal
//it also emits events that can be listened to by the parent component (ex: close event)

import { Octokit } from "octokit";
import { getAccessToken, getUser } from "./shared.js";
import { Base64 } from 'js-base64';

const modalTemplate = document.createElement('template');
modalTemplate.innerHTML = /*html*/ `
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

    <style>
    /* The Modal (background) */
    .modal {
      display: block; /* Hidden by default */
      position: fixed; /* Stay in place */
      z-index: 1; /* Sit on top */
      left: 0;
      top: 0;
      width: 100%; /* Full width */
      height: 100%; /* Full height */
      overflow: auto; /* Enable scroll if needed */
      background-color: rgb(0,0,0); /* Fallback color */
      background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
    }

    /* Modal Content/Box */
    .modal-content {
        background-color: #fefefe;
        height: calc(100% - 2em);
        width: calc(100% - 2em);
        position: relative;
        overflow: auto;
        padding: 1em;
    }

  </style>
  <style>
    .ProseMirror { height: 100%; overflow-y: auto; box-sizing: border-box; -moz-box-sizing: border-box }
    textarea { width: 100%; height: 100%; border: 1px solid silver; box-sizing: border-box; -moz-box-sizing: border-box; padding: 3px 10px;
               border: none; outline: none; font-family: inherit; font-size: inherit }
    .ProseMirror-menubar-wrapper, #markdown textarea { display: block; margin-bottom: 4px; height: 100%; }
    .ProseMirror {
    position: relative;
  }
  
  .ProseMirror {
    word-wrap: break-word;
    white-space: pre-wrap;
    white-space: break-spaces;
    -webkit-font-variant-ligatures: none;
    font-variant-ligatures: none;
    font-feature-settings: "liga" 0; /* the above doesn't seem to work in Edge */
  }
  
  .ProseMirror pre {
    white-space: pre-wrap;
  }
  
  .ProseMirror li {
    position: relative;
  }
  
  .ProseMirror-hideselection *::selection { background: transparent; }
  .ProseMirror-hideselection *::-moz-selection { background: transparent; }
  .ProseMirror-hideselection { caret-color: transparent; }
  
  .ProseMirror-selectednode {
    outline: 2px solid #8cf;
  }
  
  /* Make sure li selections wrap around markers */
  
  li.ProseMirror-selectednode {
    outline: none;
  }
  
  li.ProseMirror-selectednode:after {
    content: "";
    position: absolute;
    left: -32px;
    right: -2px; top: -2px; bottom: -2px;
    border: 2px solid #8cf;
    pointer-events: none;
  }
  
  /* Protect against generic img rules */
  
  img.ProseMirror-separator {
    display: inline !important;
    border: none !important;
    margin: 0 !important;
  }
  .ProseMirror-textblock-dropdown {
    min-width: 3em;
  }
  
  .ProseMirror-menu {
    margin: 0 -4px;
    line-height: 1;
  }
  
  .ProseMirror-tooltip .ProseMirror-menu {
    width: -webkit-fit-content;
    width: fit-content;
    white-space: pre;
  }
  
  .ProseMirror-menuitem {
    margin-right: 3px;
    display: inline-block;
  }
  
  .ProseMirror-menuseparator {
    border-right: 1px solid #ddd;
    margin-right: 3px;
  }
  
  .ProseMirror-menu-dropdown, .ProseMirror-menu-dropdown-menu {
    font-size: 90%;
    white-space: nowrap;
  }
  
  .ProseMirror-menu-dropdown {
    vertical-align: 1px;
    cursor: pointer;
    position: relative;
    padding-right: 15px;
  }
  
  .ProseMirror-menu-dropdown-wrap {
    padding: 1px 0 1px 4px;
    display: inline-block;
    position: relative;
  }
  
  .ProseMirror-menu-dropdown:after {
    content: "";
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid currentColor;
    opacity: .6;
    position: absolute;
    right: 4px;
    top: calc(50% - 2px);
  }
  
  .ProseMirror-menu-dropdown-menu, .ProseMirror-menu-submenu {
    position: absolute;
    background: white;
    color: #666;
    border: 1px solid #aaa;
    padding: 2px;
  }
  
  .ProseMirror-menu-dropdown-menu {
    z-index: 15;
    min-width: 6em;
  }
  
  .ProseMirror-menu-dropdown-item {
    cursor: pointer;
    padding: 2px 8px 2px 4px;
  }
  
  .ProseMirror-menu-dropdown-item:hover {
    background: #f2f2f2;
  }
  
  .ProseMirror-menu-submenu-wrap {
    position: relative;
    margin-right: -4px;
  }
  
  .ProseMirror-menu-submenu-label:after {
    content: "";
    border-top: 4px solid transparent;
    border-bottom: 4px solid transparent;
    border-left: 4px solid currentColor;
    opacity: .6;
    position: absolute;
    right: 4px;
    top: calc(50% - 4px);
  }
  
  .ProseMirror-menu-submenu {
    display: none;
    min-width: 4em;
    left: 100%;
    top: -3px;
  }
  
  .ProseMirror-menu-active {
    background: #eee;
    border-radius: 4px;
  }
  
  .ProseMirror-menu-disabled {
    opacity: .3;
  }
  
  .ProseMirror-menu-submenu-wrap:hover .ProseMirror-menu-submenu, .ProseMirror-menu-submenu-wrap-active .ProseMirror-menu-submenu {
    display: block;
  }
  
  .ProseMirror-menubar {
    min-width: fit-content;

    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
    position: relative;
    min-height: 1em;
    color: #666;
    padding: 1px 6px;
    top: 0; left: 0; right: 0;
    border-bottom: 1px solid silver;
    background: white;
    z-index: 10;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    overflow: visible;
  }
  
  .ProseMirror-icon {
    display: inline-block;
    line-height: .8;
    vertical-align: -2px; /* Compensate for padding */
    padding: 2px 8px;
    cursor: pointer;
  }
  
  .ProseMirror-menu-disabled.ProseMirror-icon {
    cursor: default;
  }
  
  .ProseMirror-icon svg {
    fill: currentColor;
    height: 1em;
  }
  
  .ProseMirror-icon span {
    vertical-align: text-top;
  }
  .ProseMirror-gapcursor {
    display: none;
    pointer-events: none;
    position: absolute;
  }
  
  .ProseMirror-gapcursor:after {
    content: "";
    display: block;
    position: absolute;
    top: -2px;
    width: 20px;
    border-top: 1px solid black;
    animation: ProseMirror-cursor-blink 1.1s steps(2, start) infinite;
  }
  
  @keyframes ProseMirror-cursor-blink {
    to {
      visibility: hidden;
    }
  }
  
  .ProseMirror-focused .ProseMirror-gapcursor {
    display: block;
  }
  /* Add space around the hr to make clicking it easier */
  
  .ProseMirror-example-setup-style hr {
    padding: 2px 10px;
    border: none;
    margin: 1em 0;
  }
  
  .ProseMirror-example-setup-style hr:after {
    content: "";
    display: block;
    height: 1px;
    background-color: silver;
    line-height: 2px;
  }
  
  .ProseMirror ul, .ProseMirror ol {
    padding-left: 30px;
  }
  
  .ProseMirror blockquote {
    padding-left: 1em;
    border-left: 3px solid #eee;
    margin-left: 0; margin-right: 0;
  }
  
  .ProseMirror-example-setup-style img {
    cursor: default;
  }
  
  .ProseMirror-prompt {
    background: white;
    padding: 5px 10px 5px 15px;
    border: 1px solid silver;
    position: fixed;
    border-radius: 3px;
    z-index: 11;
    box-shadow: -.5px 2px 5px rgba(0, 0, 0, .2);
  }
  
  .ProseMirror-prompt h5 {
    margin: 0;
    font-weight: normal;
    font-size: 100%;
    color: #444;
  }
  
  .ProseMirror-prompt input[type="text"],
  .ProseMirror-prompt textarea {
    background: #eee;
    border: none;
    outline: none;
  }
  
  .ProseMirror-prompt input[type="text"] {
    padding: 0 4px;
  }
  
  .ProseMirror-prompt-close {
    position: absolute;
    left: 2px; top: 1px;
    color: #666;
    border: none; background: transparent; padding: 0;
  }
  
  .ProseMirror-prompt-close:after {
    content: "âœ•";
    font-size: 12px;
  }
  
  .ProseMirror-invalid {
    background: #ffc;
    border: 1px solid #cc7;
    border-radius: 4px;
    padding: 5px 10px;
    position: absolute;
    min-width: 10em;
  }
  
  .ProseMirror-prompt-buttons {
    margin-top: 5px;
    display: none;
  }

  #prosemirror {
    height: 91%;
  }

  #editor-container {
    height: 100%;
    max-width: 58rem;
    margin: auto;
  }

  #top-bar-container {
    display: flex;
    align-items: center;
  }

  #editor, .editor {
    height: 100%;

    background: white;
    color: black;
    background-clip: padding-box;
    border-radius: 4px;
    border: 2px solid rgba(0, 0, 0, 0.2);
    padding: 5px 0;
    margin-bottom: 23px;
  }
  
  .ProseMirror p:first-child,
  .ProseMirror h1:first-child,
  .ProseMirror h2:first-child,
  .ProseMirror h3:first-child,
  .ProseMirror h4:first-child,
  .ProseMirror h5:first-child,
  .ProseMirror h6:first-child {
    margin-top: 10px;
  }
  
  .ProseMirror {
    padding: 4px 8px 4px 14px;
    line-height: 1.2;
    outline: none;
    overflow-y: scroll;
    outline: none;
    height: calc(100% - 52px);
  }
  
  .ProseMirror p { margin-bottom: 1em }

  .blog-cms--button-container{
    display: flex;
    justify-content: space-between;
  }

  button.blog-cms--button--delete{
    border: 2px solid #d90404;
    color: #d90404;
    background-color: white;
  }

  button.blog-cms--button--outline{
    border: 2px solid #282828;
    color: #282828;
    background-color: white;
  }

  .blog-cms--button {
    display: flex;
    background-color: #282828;
    border: 2px solid #282828;
    color: white;
    padding: 6px 10px;
    font-weight: 600;
    text-align: center;
    text-decoration: none;
    font-size: 16px;
    border-radius: 8px;
    margin: 0.5em 0.2em;
  }

  .button-text {
    margin-left: 4px;
  }

  .background-color-hover:hover {
    background-color: #dfdfdf;
  }

  @media only screen and (max-width: 600px) {
    .button-text {
      display: none;
    }
  }

  .text-style-selector-container {
    text-align: center;
    background-color: lightgray;
    border-radius: 14px;
    margin-bottom: 0.4em;
    display: flex;
    justify-content: space-around;
    padding: 0.2em 2.8em;
    font-weight: 600;
  }

  #editor-style-buttons {
    text-align: center;
    background-color: #ffffff;
    border: 2px solid #282828;
    border-radius: 18px;
    margin: 0.5em 0.2em;
  }


  #editor-style-buttons input[type="radio"]:checked+label{
    background-color: #282828;
    transition: background-color .18s ease-out;
    color: white;
  }


  #editor-style-buttons input[type="radio"] {
    display: none;
    }

    #editor-style-buttons label {
        display: inline-block;
        padding: 2px 4px;
        font-family: Arial;
        font-size: 16px;
        cursor: pointer;

        min-width: 2.5em;
        border-radius: 15px;
        margin: 1px 0;
        font-weight: 600;
        color: black;
      }

    #file-path {
      margin-left: 0.4em;
      font-size: 1.4em;
      font-weight: 600;
      overflow: scroll;
      width: 80%;
      border: 0;
      background-color: white;
    }

    .edit-blog-from-site--black {
      color: #111;
    }

    #wysiradio:checked + label {
      display: none;
    }

    #mdradio:checked + label {
      display: none;
    }

    .back-button {
      margin-bottom: 8px;
      cursor: pointer;
    }

    #back-container {
      padding: 2px 8px;
      border-radius: 20px;
    }

    .ProseMirror-menubar {
      display: flex;
      flex-wrap: wrap;
    }
  </style>

  <div id="modal" class="modal">
    <div class="modal-content">
      <div id="editor-container">
        <div id="top-bar-container">
          <div id="back-container" class="background-color-hover">
            <i id="save" class="back-button fa fa-arrow-left edit-blog-from-site--black" aria-hidden="true"></i>
          </div>
          <input type="text" id="file-path" disabled />
          <div style="text-align: center" id="editor-style-buttons" class="background-color-hover">
              <input type="radio" name="inputformat" value="markdown" id="mdradio" checked="">
              <label class="background-color-hover" for="mdradio">M<i class="fa fa-arrow-down" aria-hidden="true"></i></label>

              <input type="radio" name="inputformat" id="wysiradio" value="prosemirror"> 
              <label class="background-color-hover" for="wysiradio"><i class="fa fa-header" aria-hidden="true" style="margin-right: -2px;"></i>
              <i class="fa fa-indent" aria-hidden="true"></i>
              </label>
          </div>
          <button class="blog-cms--button blog-cms--button--delete background-color-hover" id="delete"><i class="fa fa-trash" aria-hidden="true"></i>
          <span class="button-text">Delete</span></button>
          <button class="blog-cms--button blog-cms--button--outline background-color-hover" id="publish"><i class="fa fa-paper-plane" aria-hidden="true"></i>
          <span class="button-text">Publish</span></button>
        </div>
        <div id="prosemirror">
            <div style="display: flex; justify-content: space-between;">

            </div>

            <div id="editor" style="margin-bottom: 0"></div>

        </div>
      </div>
    </div>
  </div>
`;

class ModalComponent extends HTMLElement {      

  _fileName = "";
  _filePath = "";

  octokit = null;

  constructor(){
    super();

    //can't use shadow dom since incompatible with prosemirror
  }

  closeEvent = new CustomEvent("close", {
    bubbles: true,
    cancelable: false,
    composed: true
  })

  set fileSha(sha){
    this._fileSha = sha;
  }
  get fileSha(){
    return this._fileSha;
  }

  set fileContent(content){
    this._fileContent = content;
  }
  get fileContent(){
    return this._fileContent;
  }

  set isNewFile(isNew){
    this._isNewFile = isNew;
  }
  get isNewFile() {
    return this._isNewFile;
  }

  set fileName(name){
    this._fileName = name;
  }
  get fileName() {
    return this._fileName;
  }

  set filePath(path){
    this._filePath = path;
  }
  get filePath() {
    return this._filePath;
  }

  async loadOctokit(){
    if(!this._octokit){
      const accessToken = await getAccessToken();
      const user = await getUser(accessToken);
      const octokit = await new Octokit({
        auth: accessToken
      });

      this._octokit = octokit;
    }

    return this._octokit;
  }

  async loadUser(){
    if(!this._user){
        const accessToken = await getAccessToken();
        const user = await getUser(accessToken);
        this._user = user;
    }
    return this._user;
  }

  async loadFileContent(){
    const octokit = await this.loadOctokit();

    var response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner: 'thomasgauvin',
      repo: 'blog',
      path: `${this.filePath}`,
    });

    const fileContent = Base64.decode(response.data.content);

    this.fileSha = response.data.sha;
    this.fileContent = fileContent;

    document.getElementById("editor").children[0].value = fileContent;

    this.fixMarkdownToBypassProsemirrorBug();
  }

  cancelRun = async(octokit) => {
      const datetimeOfRequest = new Date();
      const runsResponse = await octokit.request('GET /repos/{owner}/{repo}/actions/runs', {
          owner: 'thomasgauvin',
          repo: 'blog',
          headers: { //need to get fresh data when we want to cancel the most recent run
            'If-None-Match': '' //allows fresh data to be fetched, https://github.com/octokit/octokit.js/issues/890
          }
      });

      const datetimeOfGHAction = new Date(runsResponse.data.workflow_runs[0].created_at);

      if((datetimeOfGHAction - datetimeOfRequest) < 5000){//if gh action created in the last 10s
          console.log("Cancelling run")
          
          Date.UTC(runsResponse.data.workflow_runs[0].created_at)

          const runCancelResponse = await octokit.request(`POST /repos/{owner}/{repo}/actions/runs/{run_id}/cancel`, {
              owner: 'thomasgauvin',
              repo: 'blog',
              run_id: runsResponse.data.workflow_runs[0].id
          });
      }
  }

  //publish handler function that handles the event when the publish button is clicked
  //publishes the file to the blog by moving the files from the _drafts folder to the _posts folder
  async publishHandler(){
    const octokit = await this.loadOctokit();
    const user = await this.loadUser();

    const fileContent = document.getElementById("editor").children[0].value;

    //get date and create filename with post data
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const fileName = `${year}-${month}-${day}-${this.fileName}.md`;

    const response = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: 'thomasgauvin',
      repo: 'blog',
      path: `_posts/${fileName}`,
      message: `Publishing ${fileName}`,
      content: Base64.encode(fileContent),
    });
    
    //if response unsuccessful, throw error
    if(response.status != 201){
      throw new Error("Error publishing file");
    }

    const deleteResponse = await octokit.request('DELETE /repos/{owner}/{repo}/contents/{path}', {
      owner: 'thomasgauvin',
      repo: 'blog',
      path: this.filePath,
      message: `Deleting ${this.fileName}`,
      sha: this.fileSha
    });

    this.closeHandler();
  }

  async closeHandler(){
    document.body.style.height = '100%';
    this.dispatchEvent(this.closeEvent); 
  }

  async saveHandler() {
    await document.querySelector("#mdradio").click(); //convert to markdown for saving

    //avoid saving if no changes made
    if(this.fileContent == document.getElementById("editor").children[0].value){
      document.body.style.height = '100%';
      this.dispatchEvent(this.closeEvent);
      console.log("No changes made, closing modal")
      return;
    }

    const octokit = await this.loadOctokit();
    const user = await this.loadUser();

    let config;
    if(this.isNewFile){
      config = {
        owner: 'thomasgauvin',
        repo: 'blog',
        path: `_drafts/${document.getElementById("file-path").value}`,
        message: "Updated content with edit-blog-from-site",
        committer: {
          name: user.name,
          email: user.email
        },
        content: Base64.encode(document.getElementById("editor").children[0].value),
        sha: this.fileSha
      }
    }
    else{
      config = {
        owner: 'thomasgauvin',
        repo: 'blog',
        path: this.filePath,
        message: "Updated content with edit-blog-from-site",
        committer: {
          name: user.name,
          email: user.email
        },
        content: Base64.encode(document.getElementById("editor").children[0].value),
        sha: this.fileSha
      }
    }

    const response = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', config);

    //need timeout since gh action does not start right away
    setTimeout(async () => {
      this.cancelRun(octokit);
    }, 2000);

    this.closeHandler();
  }

  async deleteHandler() {
    const octokit = await this.loadOctokit();
    const user = await this.loadUser();

    const config = {
      owner: 'thomasgauvin',
      repo: 'blog',
      path: this.filePath,
      message: "Delete content with edit-blog-from-site",
      committer: {
        name: user.name,
        email: user.email
      },
      sha: this.fileSha
    }

    const response = await octokit.request('DELETE /repos/{owner}/{repo}/contents/{path}', config);

    setTimeout(async () => {
      this.cancelRun(octokit);
    }, 2000);

    this.closeHandler();
  }

  //lifecycle function that is called when the component is added to the DOM
  connectedCallback(){
    this.innerHTML = modalTemplate.innerHTML;
    //hide _drafts/ from path for style reasons
    document.getElementById("file-path").value = this.filePath.replace("_drafts/", ""); 

    if(this.isNewFile){
      document.getElementById("delete").style.visibility = 'hidden';
      document.getElementById("file-path").disabled = false;
      document.getElementById("file-path").placeholder = "Enter file path of draft";
    }

    document.body.style.height = '100vh';

    //delete handler
    document.getElementById("delete").onclick = () => {
      console.log("Deleting");
      this.deleteHandler();
    }

    // save handler
    document.getElementById("save").onclick = () => {
        console.log("Save");
        this.saveHandler();
    }

    //publish handler
    document.getElementById("publish").onclick = () => {
      console.log("Publish");
      this.publishHandler();
    }

    this.setupProsemirror();

    if(!this.isNewFile){
      this.loadFileContent();
    }
  }

  setupProsemirror(){
    console.log("called setup pm")
    window.prosemirror.setup(document.getElementById("editor"), document.querySelectorAll("input[type=radio]"));
  }

  //this function is needed because markdown syntax conflicts with jekyll info at top of file
  //https://www.markdownguide.org/basic-syntax/#alternate-syntax
  fixMarkdownToBypassProsemirrorBug(){
    console.log('fixing')
    function insert(str, index, value) {
      return str.substr(0, index) + value + str.substr(index);
    }

    let text = document.getElementById("editor").children[0].value;
    let matches = [...text.matchAll(/\n+-+/g)];
    console.log(matches)
    for(let i = 0; i<matches.length; i++){ //replace instances of \n--- with \n\n---, while not touching the ones that have more \n than one
      let matchesMultipleNewlineCharacters = matches[i][0].match(/\n\n+-+/g); //returns match or null if only one newline character
      if(!matchesMultipleNewlineCharacters){
        console.log("adjusted text")
        text=insert(text, matches[i].index, '\n')
      }
      matches = [...text.matchAll(/\n+-+/g)];
    }

    document.getElementById("editor").children[0].value = text;
  }

  render(){}
}

customElements.define("modal-component", ModalComponent); //defines a modal-component HTML element (accessible anywhere imported)
