//this script takes care of the actual logic to fetch the CMS content and
//enable the editing functionality
//it is written with React, and is injected into the target blog's HTML

import { Octokit } from "octokit";
import { getAccessToken, getUser } from "./shared.js";
import "./Modal.jsx";
import React, { useEffect, useState } from "react";
import { createRoot } from 'react-dom/client';
import { Modal } from "./Modal2.jsx";

var accessToken;

function DraftLine({draft, showModal, setShowModalBoolean, setEditingDraft}) {
    return (
      <div
        id={draft.name}
        className="draft-element"
        onClick={() => {
        //   const draftContainer = document.getElementById("cms-drafts");
        //   showModal(draft, draftContainer);
            setShowModalBoolean(true);
            setEditingDraft(draft);
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <i
            className="fa fa-file-text"
            style={{ paddingRight: 6, color: "#2e2e2e" }}
          ></i>
          <div className="draft-element--file">{draft.name}</div>
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

        setDrafts(response.data);
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
            const draftContainer = document.getElementById("cms-drafts");
            showModal(null, draftContainer);
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
                    setShowModalBoolean={setShowModalBoolean}
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
            showModalBoolean ? <Modal setShowModalBoolean={setShowModalBoolean} draft={editingDraft}/> : null
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


function setupDrafts() {
    const draftRef = document.getElementById("cms-drafts");
    draftRef.innerHTML = /*html*/`
    <script>

        let showCmsDraftslist = true;

        function toggleDrafts(){
            if(showCmsDraftslist){
                showCmsDraftslist = false;
            }
            else{
                showCmsDraftslist = true;
            }
        }

    </script>
    <div style="display: flex; justify-content: space-between; padding: 0.2em 0.6em 0.2em 0em;
    margin-left: 0.6em; border-bottom: 1px solid #e2e2e2;
        align-items: center;">
        <div style="font-size: 1.6em; font-weight: 600; display: flex; align-items: center;">
            Drafts
            <div style="font-size: 0.8em; padding-left: 0.5em; cursor: pointer; display: block;">
            <button id="show-drafts" class="draft-toggle" style='display: none;'  onclick="toggleDrafts()">
                [+]
            </button>
            <button id="hide-drafts" class="draft-toggle" style='display: block;'  onclick="toggleDrafts()">
                [-]
            </button>
            </div>
        </div>
        <style>
            .button-container {
                padding: 6px 6px 6px 12px;
                margin: 2px;
                border-radius: 20px;
            }
            .button-container:hover {
                background-color: #e1e4e8;
            }
        </style>
        <div class="button-container">
            <i class="fa fa-pencil-square-o" id="cms-drafts-create" style="padding-right: 4px; cursor: pointer; transform: scale(1.3);"></i>
        </div>
        </div>
        <div style="margin: auto; width: fit-content;">
        <div id="loadersmall" class="loadersmall"></div>

        </div>
        <div id="cms-drafts-draftlist"></div>
    `;

    draftRef.style.display = 'block';

    // //add on click to show-drafts and hide-drafts which will show and hide the drafts
    // document.getElementById("show-drafts").addEventListener("click", () => {
    //     document.getElementById("cms-drafts-draftlist").style.display = "block";
    //     document.getElementById("show-drafts").style.display = "none";
    //     document.getElementById("hide-drafts").style.display = "block";
    // })
    //add on click to show-drafts and hide-drafts which will show and hide the drafts
    // document.getElementById("hide-drafts").addEventListener("click", () => {
    //     document.getElementById("cms-drafts-draftlist").style.display = "none";
    //     document.getElementById("show-drafts").style.display = "block";
    //     document.getElementById("hide-drafts").style.display = "none";
    // })

    document.getElementById("cms-drafts-create").onclick = () => {
        const draftContainer = document.getElementById("cms-drafts");

        showModal(null, draftContainer);
    };
}

async function listDrafts(){
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

    document.getElementById("loadersmall").style.display = 'none';

    document.getElementById("cms-drafts-draftlist").innerHTML = '';

    for(let draft of response.data){
        var draftDiv = document.createElement("div");
        draftDiv.innerHTML = `
        <div style="display: flex; align-items: center; ">
        <i class="fa fa-file-text" style="padding-right: 6px; color: #2e2e2e;"></i>

        <div class="draft-element--file">
            ${draft.name}
        </div>
        </div>
            `;
        draftDiv.id = draft.name;
        draftDiv.className = "draft-element"
        draftDiv.onclick = () => {
            const draftContainer = document.getElementById("cms-drafts");
            showModal(draft, draftContainer);
        }
        document.getElementById("cms-drafts-draftlist").appendChild(draftDiv);
    }
}
