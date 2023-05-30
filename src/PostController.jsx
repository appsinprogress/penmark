import { Octokit } from "octokit";
import { getAccessToken } from "./helpers/userAccessHelpers.js";
import React, { useState, useEffect } from "react";
import { createRoot } from 'react-dom/client';
import { Modal } from "./components/Modal.jsx";
import { setBodyToFixedHeight, addEditorToNavigationHistoryWithBackHandler } from "./helpers/windowHelpers.js";

var postFilePathInGithub;
var accessToken;

function EditPostComponent({
  postFilePath,
  draftsFolder,
  postsFolder,
  imagesFolder,
  githubUsername,
  githubRepoName
}){
  console.log(githubRepoName)
  const [showModalBoolean, setShowModalBoolean] = useState(false);
  const [editingDraft, setEditingDraft] = useState(null);

  function handleEdit(){
    setShowModalBoolean(true);
    setBodyToFixedHeight();
    addEditorToNavigationHistoryWithBackHandler(setShowModalBoolean);
  }

  //load post on mount
  useEffect(() => {
      const fetchData = async () => {
          await loadPost();
      };
      fetchData();
  }, []);

  //function to load post from github based on postFilePathInGithub
  async function loadPost(){
    var octokit = new Octokit({
        auth: accessToken
    });;

    console.log(githubRepoName)

    let response;
    try{
      response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner: githubUsername,
        repo: githubRepoName,
        path: postFilePath
      });
    }
    catch(e){
      console.log(e)
    }

    const content = response.data.content;
    setEditingDraft(response.data);

    console.log(content)
  }

  //function that sets show modal boolean and sets the height of the body to 100vh when toggled
  //and removes it 
  function setShowModalWithBodyHeightAdjusted(){
    const newIsModalOpen = !showModalBoolean;
    setShowModalBoolean(newIsModalOpen);

    if(newIsModalOpen){
        setBodyToFixedHeight();
        addEditorToNavigationHistoryWithBackHandler();
    }
    else{
        //adjust height
        document.body.style.height = "auto";
        document.body.style.overflow = "auto";

        //remove editor path from the navigation history
        history.pushState({ page: "home" }, null, "/");
    } 
  }

  return (
    <div>
        <div id="cms-buttons">
            <button id="edit-button" className="blog-cms--button-outline"
                onClick={handleEdit}
            >
                <i className="fa fa-pencil-square-o" style={{
                  paddingRight: 4
                }}></i>
                Edit
            </button>
        </div> 
          {
              showModalBoolean ? 
                <Modal 
                  draftsFolder={draftsFolder}
                  postsFolder={postsFolder}
                  imagesFolder={imagesFolder}
                  githubUsername={githubUsername}
                  githubRepoName={githubRepoName}
                  setShowModalBoolean={setShowModalWithBodyHeightAdjusted} 
                  draft={editingDraft} 
                  loadDrafts={() => {}}
                  isDraft={false}
                /> : null
          }
    </div>
  )
}

export async function initPostEditor(postFilePath, draftsFolder, postsFolder, imagesFolder, githubUsername, githubRepoName){
  console.log(postFilePath)
  postFilePathInGithub = postFilePath;

  accessToken = await getAccessToken();
  setupReact(postFilePath, draftsFolder, postsFolder, imagesFolder, githubUsername, githubRepoName);
}

function setupReact(postFilePath, draftsFolder, postsFolder, imagesFolder, githubUsername, githubRepoName){
  const root = createRoot(document.getElementById('react'));
  root.render(<EditPostComponent 
    postFilePath={postFilePath}
    draftsFolder={draftsFolder}
    postsFolder={postsFolder}
    imagesFolder={imagesFolder}
    githubUsername={githubUsername}
    githubRepoName={githubRepoName}
  />);
}
