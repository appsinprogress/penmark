import { Octokit } from "octokit";
import { getAccessToken } from "./helpers/userAccessHelpers.js";
import React, { useState, useEffect } from "react";
import { createRoot } from 'react-dom/client';
import { Modal } from "./components/Modal.jsx";

var postFilePathInGithub;
var accessToken;

function EditPostComponent(){
  const [showModalBoolean, setShowModalBoolean] = useState(false);
  const [editingDraft, setEditingDraft] = useState(null);

  console.log(postFilePathInGithub)

  function handleEdit(){
    setShowModalBoolean(true);

    //adjust height
    document.body.style.height = "100vh";
    document.body.style.overflow = "hidden";

    //add editor path to the navigation history
    history.pushState({page: "editor"}, "editor", "/editor");

    //set back button to close the modal
    window.onpopstate = function(event) {
        setShowModalBoolean(false);

        //adjust height
        document.body.style.height = "auto";
        document.body.style.overflow = "auto";
    }
  }

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

    const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner: 'thomasgauvin',
        repo: 'blog',
        path: postFilePathInGithub
    });

    const content = response.data.content;
    setEditingDraft(response.data);
  }


  //function that sets show modal boolean and sets the height of the body to 100vh when toggled
  //and removes it 
  function setShowModalWithBodyHeightAdjusted(){
    const newIsModalOpen = !showModalBoolean;
    setShowModalBoolean(newIsModalOpen);

    if(newIsModalOpen){
        //adjust height
        document.body.style.height = "100vh";
        document.body.style.overflow = "hidden";

        //add editor path to the navigation history
        history.pushState({page: "editor"}, "editor", "/editor");

        //set back button to close the modal
        window.onpopstate = function(event) {
            setShowModalBoolean(false);

            //adjust height
            document.body.style.height = "auto";
            document.body.style.overflow = "auto";
        }
    }
    else{
        //adjust height
        document.body.style.height = "auto";
        document.body.style.overflow = "auto";

        //remove editor path from the navigation history
        history.back();
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
                  setShowModalBoolean={setShowModalWithBodyHeightAdjusted} 
                  draft={editingDraft} 
                  loadDrafts={() => {}}
                  isDraft={false}
                /> : null
          }
    </div>
  )
}

function setupReact(){
  const root = createRoot(document.getElementById('react'));
  root.render(<EditPostComponent />);
}

export async function initPostEditor(postFilePath){
  postFilePathInGithub = postFilePath;

  accessToken = await getAccessToken();
  // setupDrafts();
  // listDrafts();
  setupReact();
}


