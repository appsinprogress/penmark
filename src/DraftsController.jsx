//this script takes care of the actual logic to fetch the CMS content and
//enable the editing functionality
//it is written with React, and is injected into the target blog's HTML

import { Octokit } from "octokit";
import { getAccessToken, getUser } from "./helpers/userAccessHelpers.js";
import React, { useEffect, useState } from "react";
import { createRoot } from 'react-dom/client';
import { Modal } from "./components/Modal.jsx";
import { decodeFilename } from "./helpers/filenameEncoding.jsx";
import { setBodyToFixedHeight, addEditorToNavigationHistoryWithBackHandler } from "./helpers/windowHelpers.js";

var accessToken;

function DraftLine({ draft, setShowModalBoolean, setEditingDraft }) {

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

function DraftsComponent({
  draftsFolder,
  postsFolder,
  imagesFolder,
  githubUsername,
  githubRepoName
}) {
  const [isDraftsVisible, setIsDraftsVisible] = useState(true);
  const [drafts, setDrafts] = useState([]);
  const [draftsLoaded, setDraftsLoaded] = useState(false);
  const [showModalBoolean, setShowModalBoolean] = useState(false);
  const [editingDraft, setEditingDraft] = useState(null);

  //function that toggles show modal boolean and sets the height of the body to 100vh when toggled
  //and removes it 
  function setShowModalWithBodyHeightAdjusted(showModal) {
    if(showModal === undefined) showModal = !showModalBoolean; //support toggling
    setShowModalBoolean(showModal);

    if (showModal) {
      setBodyToFixedHeight();
      addEditorToNavigationHistoryWithBackHandler(setShowModalBoolean);
    }
    else {
      //adjust height
      document.body.style.height = "auto";
      document.body.style.overflow = "auto";

      //remove editor path from the navigation history
      history.pushState({ page: "home" }, null, "/");
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await loadDrafts();
    };
    fetchData();
  }, []);

  const toggleDrafts = () => {
    console.log("toggle drafts")
    console.log("draft is visible ", isDraftsVisible)
    setIsDraftsVisible(!isDraftsVisible);
  };

  async function loadDrafts() {
    var octokit = new Octokit({
      auth: accessToken
    });;

    let user = await getUser(accessToken);

    let response;

    try{
      response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner: githubUsername,
        repo: githubRepoName,
        path: draftsFolder,
        headers: {
          'If-None-Match': '' //allows fresh data to be fetched, https://github.com/octokit/octokit.js/issues/890
        }
      });
    }
    catch(e){
      setDraftsLoaded(true);
      setDrafts([]);
      return;
    }

    //keep only the files with .md file extension to filter out images
    response.data = response.data.filter((file) => {
      return file.name.endsWith(".md") && file.name !== "template.md";
    })

    setDrafts(response.data);
    setDraftsLoaded(true);
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
          <button id="show-drafts" className="draft-toggle ecfw-cursor-pointer" style={{ display: isDraftsVisible ? 'none' : 'block' }} onClick={toggleDrafts}>
            [+]
          </button>
          <button id="hide-drafts" className="draft-toggle ecfw-cursor-pointer" style={{ display: isDraftsVisible ? 'block' : 'none' }} onClick={toggleDrafts}>
            [-]
          </button>
        </div>
      </div>
      <div className="button-container" id="create-draft" onClick={() => {
        // const draftContainer = document.getElementById("cms-drafts");
        // showModal(null, draftContainer);
        setShowModalWithBodyHeightAdjusted();
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
      draftsLoaded && isDraftsVisible &&
        <div id="cms-drafts-draftlist">
          {drafts.map((draft, i) => <>
            <DraftLine
              draft={draft}
              setShowModalBoolean={setShowModalWithBodyHeightAdjusted}
              setEditingDraft={setEditingDraft}
            />
          </>)}
        </div>
    } 
    {
      draftsLoaded && isDraftsVisible && drafts.length === 0 &&
        <div style={{ padding: '1em', textAlign: 'center' }}>
          <div style={{ fontSize: '1.2em', fontWeight: 600, paddingBottom: '0.5em' }}>No drafts found</div>
          <div style={{ fontSize: '0.9em', paddingBottom: '0.5em' }}>Create a new draft by clicking the pencil icon above</div>
        </div>
    }
    {
      !draftsLoaded && isDraftsVisible &&
        <div style={{ margin: 'auto', width: 'fit-content' }}>
          <div id="loadersmall" className="loadersmall"></div>
        </div>
    }
    {
      showModalBoolean ?
        <Modal
          setShowModalBoolean={setShowModalWithBodyHeightAdjusted}
          draft={editingDraft}
          loadDrafts={loadDrafts}
          isDraft={true}
          draftsFolder={draftsFolder}
          postsFolder={postsFolder}
          imagesFolder={imagesFolder}
          githubUsername={githubUsername}
          githubRepoName={githubRepoName}
        />
        :
        null
    }
  </div>
  );
}

function setupReact(draftsFolder, postsFolder, imagesFolder, githubUsername, githubRepoName) {
  const root = createRoot(document.getElementById('react'));
  root.render(<DraftsComponent 
    draftsFolder={draftsFolder}
    postsFolder={postsFolder}
    imagesFolder={imagesFolder}
    githubUsername={githubUsername}
    githubRepoName={githubRepoName}
  />);
}

export async function initDrafts(draftsFolder, postsFolder, imagesFolder, githubUsername, githubRepoName) {
  accessToken = await getAccessToken();
  setupReact(draftsFolder, postsFolder, imagesFolder, githubUsername, githubRepoName);
}
