import { Octokit } from "octokit";
import { getAccessToken } from "./shared.js";
import "./Modal.jsx";

var postFilePathInGithub;
var accessToken;

function openModal(){
  const modalParent = document.getElementById("modalParent");
  const modal = document.createElement("modal-component");
  modal.addEventListener("close", () => {
    modalParent.removeChild(modal);
  })
  modal.fileName = postFilePathInGithub;
  modal.filePath = postFilePathInGithub;
  modalParent.appendChild(modal);
}
 
function addButtonEventHandler(){
  const editButton = document.getElementById("edit-button");
  editButton.addEventListener("click", () => {
    openModal();
  });
}

export async function initPostEditor(postFilePath){
  postFilePathInGithub = postFilePath;

  accessToken = await getAccessToken();
  addButtonEventHandler();
}

