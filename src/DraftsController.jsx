//this script takes care of the actual logic to fetch the CMS content and
//enable the editing functionality
//it is written with React, and is injected into the target blog's HTML

import { Octokit } from "octokit";
import { getAccessToken, getUser } from "./helpers/userAccessHelpers.js";
import React, { useEffect, useState } from "react";
import { createRoot } from 'react-dom/client';
import { Modal } from "./components/Modal.jsx";
import { decodeFilename } from "./helpers/filenameEncoding.jsx";

var accessToken;

function DraftLine({draft, showModal, setShowModalBoolean, setEditingDraft}) {

    const title = decodeFilename(draft.name).articleTitle;

    return (
      <div
        id={draft.name}
        className="draft-element"
        onClick={() => {
            setShowModalBoolean(true);
            setEditingDraft(draft);
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <i
            className="fa fa-file-text"
            style={{ paddingRight: 6, color: "#2e2e2e" }}
          ></i>
          <div className="draft-element--file">{title}</div>
        </div>
      </div>
    );
  }

function DraftsComponent() {
    const [isDraftsVisible, setIsDraftsVisible] = useState(false);
    const [drafts, setDrafts] = useState([]);
    const [draftsLoaded, setDraftsLoaded] = useState(false);
    const [showModalBoolean, setShowModalBoolean] = useState(false);
    const [editingDraft, setEditingDraft] = useState(null);

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

    useEffect(() => {
        const fetchData = async () => {
            await loadDrafts();
        };
        fetchData();
    }, []);

    const toggleDrafts = () => {
      setIsDraftsVisible(!isDraftsVisible);
    };



    async function loadDrafts(){
        var octokit = new Octokit({
            auth: accessToken
        });;
    
        let user = await getUser(accessToken);
    
        var response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
            owner: 'thomasgauvin',
            repo: 'blog',
            path: `_drafts`,
            headers: {
                'If-None-Match': '' //allows fresh data to be fetched, https://github.com/octokit/octokit.js/issues/890
            }
        });

        //keep only the files with .md file extension to filter out images
        response.data = response.data.filter((file) => {
            return file.name.endsWith(".md") && file.name !== "template.md";
        })

        setDrafts(response.data);
        console.log(response.data)
        setDraftsLoaded(true);
    }

    function showModal(draft, draftContainer){
        const modal = document.createElement("modal-component");
        modal.addEventListener("close", () => {
            draftContainer.removeChild(modal);
            loadDrafts(); //refresh in case a new file was created
        })
    
        if(draft == null){
            modal.fileName = "";
            modal.isNewFile = true;
        }
        else{
            modal.fileName = draft.name;
            modal.filePath = draft.path;
        }

        draftContainer.appendChild(modal);
    }
    
    return (<div id="cms-drafts">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0.2em 0.6em 0.2em 0em',
          marginLeft: '0.6em',
          borderBottom: '1px solid #e2e2e2',
          alignItems: 'center',
        }}
      >
        <div style={{ fontSize: '1.6em', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
          Drafts
          <div style={{ fontSize: '0.8em', paddingLeft: '0.5em', cursor: 'pointer', display: 'block' }}>
            <button id="show-drafts" class="draft-toggle" style={{ display: isDraftsVisible ? 'none' : 'block' }} onClick={toggleDrafts}>
              [+]
            </button>
            <button id="hide-drafts" class="draft-toggle" style={{ display: isDraftsVisible ? 'block' : 'none' }} onClick={toggleDrafts}>
              [-]
            </button>
          </div>
        </div>
        <div className="button-container" id="create-draft" onClick={()=>{
            // const draftContainer = document.getElementById("cms-drafts");
            // showModal(null, draftContainer);
            setShowModalWithBodyHeightAdjusted(true);
            setEditingDraft(null);

        }}>
          <i
            className="fa fa-pencil-square-o"
            id="cms-drafts-create"
            style={{ paddingRight: 4, cursor: 'pointer', transform: 'scale(1.3)' }}
          ></i>
        </div>
      </div>
      {
        draftsLoaded ?
        <div id="cms-drafts-draftlist">
            {drafts.map((draft, i) => <>
                <DraftLine 
                    showModal={showModal} 
                    draft={draft} 
                    setShowModalBoolean={setShowModalWithBodyHeightAdjusted}
                    setEditingDraft={setEditingDraft}    
                />
            </>)}
        </div> 
        :
        <div style={{ margin: 'auto', width: 'fit-content' }}>
            <div id="loadersmall" className="loadersmall"></div>
        </div>
      }
        {
            showModalBoolean ? <Modal 
                setShowModalBoolean={setShowModalWithBodyHeightAdjusted} 
                draft={editingDraft} 
                loadDrafts={loadDrafts}
                isDraft={true}
                /> : null
        }
    </div>
    );
  }

function setupReact(){
    const root = createRoot(document.getElementById('react'));
    root.render(<DraftsComponent />);
}

export async function initDrafts(){
    accessToken = await getAccessToken();
    // setupDrafts();
    // listDrafts();
    setupReact();
}
