import React, { useEffect, useState, useRef } from "react";
import "../styles/styles.css";
import "../styles/basestyles.scss";
import { Send, Trash, Save } from "lucide-react"
import { Octokit } from "octokit";
import { getAccessToken } from "../helpers/userAccessHelpers.js";
import { Base64 } from 'js-base64';
import { ProseMirrorEditor } from "./editors/ProseMirrorEditor.jsx";
import { Title } from "./Title.jsx";
import { MarkdownEditor } from "./editors/MarkdownEditor.jsx";
import { encodeFilename, decodeFilename } from "../helpers/filenameEncoding.jsx";
import { Skeleton } from "../lib/ui/Skeleton.jsx";
import { ModalActionButtons } from "./buttons/ModalActionButtons.jsx";
import { BackButton } from "./buttons/ModalBackButton.jsx";
import { Spinner } from "./Spinner.jsx";
import { blobToBase64, loadImagesForContentAsBlobs, extractImageInfoFromMarkdown } from "../helpers/imageParsingHelpers.js";

const accessToken = await getAccessToken();

export function Modal({
    setShowModalBoolean, draft, loadDrafts, isDraft,
    postsFolder, draftsFolder, imagesFolder, githubUsername, githubRepoName
}) {
    var octokit = new Octokit({
        auth: accessToken
    });

    const draftDate = draft ? decodeFilename(draft.name).articleDate : new Date().toISOString().split('T')[0];

    const [date, setDate] = useState(draftDate);
    const [title, setTitle] = useState(null);
    const [originalFileContentWithImagesReplacedWithBlobs, setOriginalFileContentWithImagesReplacedWithBlobs] = useState('');//this is kept to compare with the current file content to see if there are any changes to warn when leaving without saving
    const [fileContent, setFileContent] = useState('');
    const [fileSha, setFileSha] = useState('');
    const [isMarkdown, setIsMarkdown] = useState(false);
    const fileContentRef = useRef('')
    const [isLoading, setIsLoading] = useState(false);
    const [isSavingToGithub, setIsSavingToGithub] = useState(false);

    //set warning when the page is reloaded without saving
    useEffect(() => {
        const handleBeforeUnload = (event) => {
          event.preventDefault(); // Cancel the event
          event.returnValue = ''; // Chrome requires assigning a value to event.returnValue
          if(fileContentRef.current !== originalFileContentWithImagesReplacedWithBlobs){
            return "You have unsaved changes. Are you sure you want to leave?";
          }
        };
    
        window.addEventListener('beforeunload', handleBeforeUnload);
    
        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
        };
      }, []);

    useEffect(() => {
        if(draft){
            const fetchData = async () => {
                await loadFileContent();
            };
            fetchData();
        }
        //if no draft, fetch the template file from the repo
        else{
            const fetchData = async () => {
                await loadTemplate();
            }
            fetchData();
        }

    }, [draft]);

    //async function to fetch default template file from github
    async function loadTemplate(){
        const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
            owner: githubUsername,
            repo: githubRepoName,
            path: `${draftsFolder}/template.md`,
        });

        const fileContent = Base64.decode(response.data.content);
        setFileContent(fileContent);

        //set filecontentref
        fileContentRef.current = fileContent;
        setOriginalFileContentWithImagesReplacedWithBlobs(fileContent);
    }

    async function loadFileContent() {
        setIsLoading(true);
        var response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
            owner: githubUsername,
            repo: githubRepoName,
            path: `${draft.path}`,
        });
        setFileSha(response.data.sha);

        const fileContent = Base64.decode(response.data.content);
        let fileContentWithImages = fileContent;
        try{
            fileContentWithImages = await loadImagesForContentAsBlobs(fileContent, octokit);
        }
        catch(e){
            console.log('images missing')
        }

        setFileContent(fileContentWithImages);

        const { articleDate, articleTitle } = decodeFilename(draft.name)
        setDate(articleDate);
        setTitle(articleTitle);

        //set filecontentref
        fileContentRef.current = fileContentWithImages;
        setOriginalFileContentWithImagesReplacedWithBlobs(fileContentWithImages);
        setIsLoading(false);
    }

    function handlePublishPress(){
        //confirm if they want to publish
        if(confirm('Are you sure you want to publish this draft?')){
            publishDraft();
        }
    }

    function handleDeletePress(){
        //confirm if they want to delete
        if(confirm('Are you sure you want to delete this draft?')){
            deleteDraft();
        }
    }

    async function deleteDraft(){
        setIsSavingToGithub(true);
        console.log('deleting draft')
        console.log(draft)
        await octokit.rest.repos.deleteFile({
            owner: githubUsername,
            repo: githubRepoName,
            path: `${draft.path}`,
            message: 'delete draft [skip ci]',
            sha: fileSha
        })
        loadDrafts();

        setIsSavingToGithub(false);
        setShowModalBoolean(false);
    }

    //publish draft by saving the markdown content to the _posts folder and the images to the uploads folder
    function publishDraft(){
        //save the draft content to the _posts folder
        saveDraft('_posts', 'uploads', false);
    }

    function syncContentAcrossProsemirrorAndTextarea(){
        let contentToSave = !isMarkdown ? fileContentRef.current : fileContent;

        if(!isMarkdown){
            setFileContent(contentToSave)
        }
        else{
            setFileContentRef(contentToSave)
        }

        return contentToSave;
    }

    //function to save the draft back to the _drafts folder overwriting the content
    //and also creating the needed image files
    //this is parametrized to support publish, which can save new files to a new folder and delete files from the previous folder
    //if just saving drafts, then markdownFolder, imageFolder, previousMarkdownFolder and previousImageFolder should all be the same
    async function saveDraft(publishMarkdownFolder, publishImageFolder, skipCi) {
        console.log('saving draft')
        setIsSavingToGithub(true);

        if(!publishMarkdownFolder) publishMarkdownFolder = draftsFolder;
        if(!publishImageFolder) publishImageFolder = draftsFolder;
    
        const defaultDraftImageFolder = draftsFolder;

        let contentToSave = syncContentAcrossProsemirrorAndTextarea();

        const images = contentToSave.match(/!\[.*?\]\(blob.*?\)/g);

        if (images) {
            console.log('some images to save')
            console.log(images)
            //for each image
            contentToSave = await saveImagesToGithub(images, defaultDraftImageFolder, publishImageFolder, contentToSave);
        }

        //if the draft exists, save it in the same path
        //otherwise, create a new file with the path name being the date and the title encoded to be a filename
        if(draft !== null){
            //if the date is different than the one in the draft, rename the draft & delete the old one
            // or if we are publishing
            const newFileName = encodeFilename(title, date);
            if(draft.path !== `${publishMarkdownFolder}/${newFileName}`){
                await saveExistingDraftThatHasBeenRenamedToGithub(newFileName, publishMarkdownFolder, draft, skipCi, contentToSave, fileSha);
            }
            else{
                await saveExistingDraftToGithub(draft, skipCi, contentToSave, fileSha);
            }
        }
        else{
            await saveNewFileToGithub(title, date, publishMarkdownFolder, contentToSave, skipCi);
        }

        setIsSavingToGithub(false);
        loadDrafts();
        setShowModalBoolean(false);
    }

    async function saveImagesToGithub(images, defaultDraftImageFolder, publishImageFolder, contentToSave) {
        for (let i = 0; i < images.length; i++) {
            try {
                console.log("saving image");
                //get the image url from ![](blob:http://127.0.0.1:4000/89136718-69f2-41ef-ba7d-866da819d417 "pexels-pixabay-45201.jpg")
                
                const { description, url, filename } = extractImageInfoFromMarkdown(images[i]);
                
                // const imageUrl = images[i].match(/(blob:[^\s)]+)/g)[0];
                const imageUrl = url;
                console.log(imageUrl);

                console.log(images[i]);

                //strip quotes from file name
                let fileName = imageUrl; //this is going to be the filename
                const imageSrcFromMarkdownFormat = images[i].match(/\((.*?)\)/g)[0];
                const imageDescription = description;

                if(!filename){
                    fileName = encodeURIComponent(imageDescription);
                }
                else{
                    fileName = filename;
                }
                
                //get the image data from the url
                const blob = await fetch(imageUrl).then(r => r.blob());
                const imageData = await blobToBase64(blob);
                const imageDataOnlyBase64 = imageData.split(',')[1];

                //try to get the image from drafts
                let originalImage = null;
                try {
                    //get image from repo
                    originalImage = await octokit.request('GET /repos/{owner}/{repos}/contents/{path}', {
                        owner: githubUsername,
                        repo: githubRepoName,
                        path: `${defaultDraftImageFolder}/${fileName}`,
                    });
                }
                catch (e) {
                    //there was no original image
                }

                //save the file if it is new, if it is not new, then we don't save the file
                //I acknowledge this means that the content of the image cannot be changed if the filepath is not changed
                if (!originalImage || `${defaultDraftImageFolder}/${originalImage.name}` !== `${publishImageFolder}/${fileName}`) {
                    //try create the image file in github repository
                    console.log('trying to save file in a new filepath', `${publishImageFolder}/${fileName}`);
                    try {
                        await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
                            owner: githubUsername,
                            repo: githubRepoName,
                            path: `${publishImageFolder}/${fileName}`,
                            message: 'create image [skip ci]',
                            content: imageDataOnlyBase64
                        });
                    }
                    catch (e) {
                        //there was a file conflict. we still need to update the markdown to refer to the file rather than the blob (below)
                    }

                    //if there was an original image, this means that we've renamed the image. therefore, we
                    //delete the image from the default draft folder 
                    if (originalImage) {
                        try {
                            await octokit.request('DELETE /repos/{owner}/{repo}/contents/{path}', {
                                owner: githubUsername,
                                repo: githubRepoName,
                                path: `${defaultDraftImageFolder}/${fileName}`,
                                message: 'delete image [skip ci]',
                                sha: originalImage.data.sha
                            });
                        }
                        catch (e) {
                            //there was an error deleting the file
                        }
                    }
                }

                //replace the reference to the image in the file to take into account the new name
                if (defaultDraftImageFolder != publishImageFolder) { //update the reference to the publish image location
                    contentToSave = contentToSave.replace(images[i], `![${imageDescription}](../${publishImageFolder}/${fileName})`);
                }
                else {
                    contentToSave = contentToSave.replace(images[i], `![${imageDescription}](./${fileName})`);
                }
                console.log('new content to save ', contentToSave);
            }
            catch (e) {
                console.log("There was some error in saving to github. Not saving changes.");
            }
        }

        return contentToSave;
    }

    async function saveExistingDraftThatHasBeenRenamedToGithub(newFileName, publishMarkdownFolder, draft, skipCi, contentToSave, fileSha) {
        console.log("Renaming draft");
        const updateMessage = skipCi ? `update draft [skip ci]` : `update draft`;
        //rename the draft
        await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
            owner: githubUsername,
            repo: githubRepoName,
            path: `${publishMarkdownFolder}/${newFileName}`,
            message: updateMessage,
            content: Base64.encode(contentToSave),
        });

        //delete the old draft
        await octokit.rest.repos.deleteFile({
            owner: githubUsername,
            repo: githubRepoName,
            path: `${draft.path}`,
            message: 'delete draft [skip ci]',
            sha: fileSha
        });
    }

    async function saveExistingDraftToGithub(draft, skipCi, contentToSave, fileSha) {
        console.log("Saving changes to file (no changes to filename)");
        //save the draft
        const message = skipCi ? `update draft [skip ci]` : `update draft`;
        await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
            owner: githubUsername,
            repo: githubRepoName,
            path: `${draft.path}`,
            message: message,
            content: Base64.encode(contentToSave),
            sha: fileSha,
        });
    }

    async function saveNewFileToGithub(title, date, publishMarkdownFolder, contentToSave, skipCi){
        if(!title){
            alert('Please enter a title');
            setIsSavingToGithub(false);
            return;
        }
        console.log("Saving new file")
        //save the draft with a new name
        const message = skipCi? `create draft [skip ci]` : `create draft`
        await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
            owner: githubUsername,
            repo: githubRepoName,
            path: `${publishMarkdownFolder}/${encodeFilename(title, date)}`,
            message: message,
            content: Base64.encode(contentToSave),
        })
    }

    //set filecontentref function
    function setFileContentRef(content) {
        fileContentRef.current = content;
    }
    
    //if we are switching to markdown, we need to set the fileContentRef (prosemirror's state) to the fileContent React state
    function handleSetMarkdown(isMarkdown){
        setIsMarkdown(isMarkdown);
        if(!isMarkdown){ 
            setFileContentRef(fileContent);
        }
        else{
            setFileContent(fileContentRef.current);
        }
    }

    function returnModalActions() {
        let returnModalActions = [
            {
                title: 'Publish',
                icon: <Send className="mr-2 h-4 w-4 ecfw-pr-2 ecfw-py-1" />,
                action: handlePublishPress
            },
            {
                title: 'Delete',
                icon: <Trash className="mr-2 h-4 w-4 ecfw-pr-2 ecfw-py-1" />,
                action: handleDeletePress,
                className: 'ecfw-text-red-500 hover:ecfw-text-red-500/90'
            }
        ];
        if(isDraft){
            //add save to beginning of array
            returnModalActions.unshift({
                title: 'Save',
                icon: <Save className="mr-2 h-4 w-4 ecfw-pr-2 ecfw-py-1" />,
                action: saveDraft
            })
        }

        return returnModalActions;
    }

    return (<>
        <div id="modal-container" className="modal-container" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: 'calc(100vw - (100vw - 100%))',
            height: '100lvh',
            backgroundColor: 'white',
            overflowY: 'scroll',
            paddingBottom: '4em',
            zIndex: 1
        }}>
            {
                isSavingToGithub && //dark grey overlay with spinner in the middle
                <div id="overlay"
                    className="ecfw-z-50 ecfw-fixed ecfw-top-0 ecfw-left-0 ecfw-w-screen ecfw-h-screen ecfw-bg-black ecfw-opacity-70">
                        <div className="ecfw-flex ecfw-justify-center ecfw-items-center ecfw-h-full ecfw-pb-16">
                            <Spinner className="ecfw-h-10 ecfw-w-10 ecfw-text-white" />
                        </div>
                </div>
            }
            {
                isLoading &&
                <div id="modal" className="ecfw-max-w-screen-lg ecfw-mx-auto ecfw-m-2 ecfw-h-full">
                    <div id="topbar" className="ecfw-py-2 ecfw-px-4 ecfw-flex ecfw-justify-between">
                        <BackButton 
                            setShowModalBoolean={setShowModalBoolean}
                            originalFileContentWithImagesReplacedWithBlobs={originalFileContentWithImagesReplacedWithBlobs}
                            syncContentAcrossProsemirrorAndTextarea={syncContentAcrossProsemirrorAndTextarea}
                        />
                        <Skeleton className="ecfw-h-10 ecfw-w-44 ecfw-rounded-md" />
                    </div>
                    <div id="content" className="ecfw-px-4 ecfw-pt-4 ecfw-pb-2 ecfw-h-full">
                        <div className="ecfw-flex ecfw-justify-between ecfw-h-10">
                            <Skeleton className="ecfw-h-6 ecfw-w-52 ecfw-rounded-md" />
                            <Skeleton className="ecfw-h-8 ecfw-w-10 ecfw-rounded-md" />
                        </div>
                        <Skeleton className="ecfw-h-10 ecfw-w-1/2 ecfw-rounded-md" />
                        <Skeleton className="ecfw-h-5/6 ecfw-w-full ecfw-rounded-md ecfw-my-4" />
                    </div>
                </div>            
            }
            {
                !isLoading &&
                <div id="modal" className="ecfw-max-w-screen-lg ecfw-mx-auto ecfw-m-2  ecfw-pb-4">
                    <div id="topbar" className="ecfw-py-2 ecfw-px-4 ecfw-flex ecfw-justify-between">
                        <BackButton 
                            setShowModalBoolean={setShowModalBoolean}
                            originalFileContentWithImagesReplacedWithBlobs={originalFileContentWithImagesReplacedWithBlobs}
                            syncContentAcrossProsemirrorAndTextarea={syncContentAcrossProsemirrorAndTextarea}
                        />
                        <ModalActionButtons actions={returnModalActions()} />
                    </div>
                    <div id="content">
                        <Title value={title} setValue={setTitle} date={date} setDate={setDate} isMarkdown={isMarkdown} setIsMarkdown={handleSetMarkdown} />
                        {
                            isMarkdown ?
                                <MarkdownEditor content={fileContent} setContent={setFileContent} />
                                :
                                <ProseMirrorEditor content={fileContentRef.current} setContentRefValue={setFileContentRef} />
                        }
                    </div>
                </div>
            }
        </div>
    </>)
}

