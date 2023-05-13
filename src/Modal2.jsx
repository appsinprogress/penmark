import React, { useEffect, useState, useRef } from "react";
import "./styles.css";
import "./basestyles.scss";
import { ChevronDown, ChevronLeft, ChevronUp, Send, Trash, Save } from "lucide-react"
import { Root, Separator } from "@radix-ui/react-separator"
import { Octokit } from "octokit";
import { getAccessToken, getUser } from "./shared.js";
import { Base64 } from 'js-base64';
import { ProseMirrorEditorArchive } from "./ProseMirrorEditor_archive.jsx";
import { ProseMirrorEditor } from "./ProseMirrorEditor.jsx";
import { Title } from "./components/Title.jsx";
import { MarkdownEditor } from "./MarkdownEditor.jsx";
import { encodeFilename, decodeFilename } from "./helpers/filenameEncoding.jsx";

const accessToken = await getAccessToken();

export function Modal({
    show, setShowModalBoolean, draft, loadDrafts
}) {
    var octokit = new Octokit({
        auth: accessToken
    });

    const draftDate = draft ? decodeFilename(draft.name).articleDate : new Date().toISOString().split('T')[0];
    console.log(draftDate)

    const [date, setDate] = useState(draftDate);
    const [title, setTitle] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [fileContent, setFileContent] = useState('');
    const [fileSha, setFileSha] = useState('');
    const [isMarkdown, setIsMarkdown] = useState(false);
    const fileContentRef = useRef('')

    useEffect(() => {
        console.log(date)
    }, [date])

    useEffect(() => {
        console.log(draft)

        const fetchData = async () => {
            await loadFileContent();
        };
        fetchData();
    }, [draft]);


    async function loadFileContent() {
        var response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
            owner: 'thomasgauvin',
            repo: 'blog',
            path: `${draft.path}`,
        });
        setFileSha(response.data.sha);

        const fileContent = Base64.decode(response.data.content);
        let fileContentWithImages = fileContent;
        try{
            fileContentWithImages = await loadImagesForContentAsBlobs(fileContent);
        }
        catch(e){
            console.log('images missing')
        }

        console.log(fileContentWithImages)

        setFileContent(fileContentWithImages);

        const { articleDate, articleTitle } = decodeFilename(draft.name)
        setDate(articleDate);
        setTitle(articleTitle);

        //set filecontentref
        fileContentRef.current = fileContentWithImages;
    }

    async function loadImagesForContentAsBlobs(fileContent){
        //regex to find all the images
        const images = fileContent.match(/!\[.*?\]\(.*?\)/g);

        //if there are images
        if (images) {  
            //iterate through all of the images
            for (let i = 0; i < images.length; i++) {

                //get image filename
                const imageFilepath = images[i].match(/\((.*?)\)/)[1];
                const imageFilename = imageFilepath.split('/').pop();

                //fetch the image from the github
                const response = await octokit.rest.repos.getContent({
                    owner: 'thomasgauvin',
                    repo: 'blog',
                    path: `_drafts/${imageFilename}`,
                })

                //get the image blob
                console.log(response.data)
                //convert response.data.content to blob

                //get data type from url
                const fileExtension = response.data.name.split('.').pop();

                //convert fileExtension to base64 datatype
                function getFileDataType(extension) {
                    // Convert the extension to lowercase for case-insensitive comparison
                    extension = extension.toLowerCase();
                  
                    // Define the mapping of file extensions to Base64 image data types
                    const extensionToDataType = {
                      'png': 'image/png',
                      'jpg': 'image/jpeg',
                      'jpeg': 'image/jpeg',
                      'gif': 'image/gif',
                      'svg': 'image/svg+xml',
                      'webp': 'image/webp'
                      // Add more mappings as needed
                    };
                  
                    // Check if the extension exists in the mapping
                    if (extension in extensionToDataType) {
                      return extensionToDataType[extension];
                    }
                  
                    // Return a default data type if the extension is not found
                    return 'image/png'; // You can change the default data type if desired
                }
                  
                const base64DataType = getFileDataType(fileExtension);

                const base64Url = `data:${base64DataType};base64,${response.data.content}`;

                console.log(base64Url)

                console.log('creating a blob for base64')
                const imageBlob = await fetch(base64Url).then(r => r.blob());
                // const imageBlob = await fetch(response.data.download_url).then(r => r.blob());


                //get image blob url
                const imageBlobUrl = URL.createObjectURL(imageBlob);
                console.log(imageBlobUrl)

                console.log('replacing content')
                console.log('searching for ', imageFilepath)
                console.log('in ', fileContent)
                //replace the image url with the blob url
                console.log(imageFilepath, imageBlobUrl, imageFilename)
                fileContent = fileContent.replace(imageFilepath, `${imageBlobUrl} "${imageFilename}"`);
                console.log('result ', fileContent)
            }
        }

        return fileContent;
    }

    async function deleteDraft(){
        console.log('deleting draft')
        console.log(draft)
        await octokit.rest.repos.deleteFile({
            owner: 'thomasgauvin',
            repo: 'blog',
            path: `${draft.path}`,
            message: 'delete draft [skip ci]',
            sha: fileSha
        })
        loadDrafts();

        setShowModalBoolean(false);
    }

    function blobToBase64(blob) {
        return new Promise((resolve, _) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      }

    //publish draft by saving the markdown content to the _posts folder and the images to the uploads folder
    function publishDraft(){
        //save the draft content to the _posts folder
        saveDraft('_posts', 'uploads', false);
    }

    //function to save the draft back to the _drafts folder overwriting the content
    //and also creating the needed image files
    //this is parametrized to support publish, which can save new files to a new folder and delete files from the previous folder
    //if just saving drafts, then markdownFolder, imageFolder, previousMarkdownFolder and previousImageFolder should all be the same
    async function saveDraft(publishMarkdownFolder, publishImageFolder, skipCi) {
        //create the image files
        //get the images from the fileContent

        if(!publishMarkdownFolder) publishMarkdownFolder = '_drafts';
        if(!publishImageFolder) publishImageFolder = '_drafts'
    
        const defaultDraftImageFolder = '_drafts';

        let contentToSave = !isMarkdown ? fileContentRef.current : fileContent;

        if(!isMarkdown){
            setFileContent(contentToSave)
        }
        else{
            setFileContentRef(contentToSave)
        }
        

        const images = contentToSave.match(/!\[.*?\]\(blob.*?\)/g);
        //if there are images
        if (images) {
            console.log('some images to save')
            console.log(images)
            //for each image
            for (let i = 0; i < images.length; i++) {
                try{
                    console.log("saving image")
                    //get the image url from ![](blob:http://127.0.0.1:4000/89136718-69f2-41ef-ba7d-866da819d417 "pexels-pixabay-45201.jpg")
                    const imageUrl = images[i].match(/(blob:[^\s)]+)/g)[0];
                    console.log(imageUrl)
    
                    console.log(images[i])

                    //strip quotes from file name
                    let fileName = imageUrl; //this is going to be the filename
                    const imageSrcFromMarkdownFormat = images[i].match(/\((.*?)\)/g)[0]
                    if(imageSrcFromMarkdownFormat.includes(' ')){ //we can get the name of the file from the example image url above
                        const imageFilenameFromMarkdownFormat = imageSrcFromMarkdownFormat.split(' ')[1]
                        fileName = imageFilenameFromMarkdownFormat.substring(1, imageFilenameFromMarkdownFormat.length-2)
                    }
                    else{//if there is no image name, we url encode the image description
                        fileName = encodeURIComponent(images[i].match(/!\[(.*?)\]/g)[0])
                    }

                    //get the image description 
                    const imageDescription = images[i].match(/!\[(.*?)\]/g)[0].substring(2, images[i].match(/!\[(.*?)\]/g)[0].length-1);
    
                    //get the image data from the url
                    const blob = await fetch(imageUrl).then(r => r.blob());
                    const imageData = await blobToBase64(blob);
    
                    const imageDataOnlyBase64 = imageData.split(',')[1];
                    console.log(imageDataOnlyBase64)

                    //try to get the image from drafts
                    let originalImage = null;
                    try{
                        //get image from repo
                        originalImage = await octokit.request('GET /repos/{owner}/{repos}/contents/{path}', {
                            owner: 'thomasgauvin',
                            repo: 'blog',
                            path: `${defaultDraftImageFolder}/${fileName}`,
                        });
                    }
                    catch(e){
                        //there was no original image
                    }

                    console.log(originalImage)


                    //save the file if it is new, if it is not new, then we don't unnecessarily save the file
                    //this means that the content of the image cannot be saved if the filepath is not changed
                    if(!originalImage || `${defaultDraftImageFolder}/${originalImage.name}` !== `${publishImageFolder}/${fileName}`){
                        //try create the image file in github repository
                        console.log('trying to save file in a new filepath', `${publishImageFolder}/${fileName}`)
                        try{
                            await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
                                owner: 'thomasgauvin',
                                repo: 'blog',
                                path: `${publishImageFolder}/${fileName}`,
                                message: 'create image [skip ci]',
                                content: imageDataOnlyBase64
                            });
                        }
                        catch(e){
                            //there was a file conflict. we still need to update the markdown to refer to the file rather than the blob (below)
                        }
                    }

                    //delete the image from the default draft folder
                    if(originalImage){
                        try{
                            await octokit.request('DELETE /repos/{owner}/{repo}/contents/{path}', {
                                owner: 'thomasgauvin',
                                repo: 'blog',
                                path: `${defaultDraftImageFolder}/${fileName}`,
                                message: 'delete image [skip ci]',
                                sha: originalImage.data.sha
                            });
                        }
                        catch(e){
                            //there was an error deleting the file
                        }
                    }


                    //replace the reference to the image in the file to take into account the new name
                    console.log('replacing content')
                    console.log('searching for ', images[i])
                    console.log('in ', contentToSave)

                    if(defaultDraftImageFolder != publishImageFolder){//update the reference to the publish image location
                        contentToSave = contentToSave.replace(images[i], `![${imageDescription}](../${publishImageFolder}/${fileName})`)
                    }
                    else{
                        contentToSave = contentToSave.replace(images[i], `![${imageDescription}](./${fileName})`);
                    }
                    console.log('new content to save ', contentToSave)
    

                }
                catch(e){
                    console.log("There was some error in saving to github. Not saving changes.")
                }
            }
        }

        //if the draft exists, save it in the same path
        //otherwise, create a new file with the path name being the date and the title encoded to be a filename
        if(draft !== null){
            //if the date is different than the one in the draft, rename the draft & delete the old one
            // or if we are publishing
            const newFileName = encodeFilename(title, date);
            if(draft.path !== `${publishMarkdownFolder}/${newFileName}`){
                console.log("Renaming draft")
                const updateMessage = skipCi? `update draft [skip ci]` : `update draft`
                //rename the draft
                await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
                    owner: 'thomasgauvin',
                    repo: 'blog',
                    path: `${publishMarkdownFolder}/${newFileName}`,
                    message: updateMessage,
                    content: Base64.encode(contentToSave),
                });

                //delete the old draft
                await octokit.rest.repos.deleteFile({
                    owner: 'thomasgauvin',
                    repo: 'blog',
                    path: `${draft.path}`,
                    message: 'delete draft [skip ci]',
                    sha: fileSha
                })
            }
            else{
                console.log("Saving changes to file (no changes to filename)")
                //save the draft
                const message = skipCi? `update draft [skip ci]` : `update draft`
                await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
                    owner: 'thomasgauvin',
                    repo: 'blog',
                    path: `${draft.path}`,
                    message: message,
                    content: Base64.encode(contentToSave),
                    sha: fileSha,
                });
            }
        }
        else{
            console.log("Saving new file")
            //save the draft with a new name
            const message = skipCi? `create draft [skip ci]` : `create draft`
            await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
                owner: 'thomasgauvin',
                repo: 'blog',
                path: `${publishMarkdownFolder}/${encodeFilename(title, date)}`,
                message: message,
                content: Base64.encode(contentToSave),
            })
        }


        //close the modal
        loadDrafts();
        setShowModalBoolean(false);
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

    return (<>
        <div id="modal-container" className="modal-container" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: 'calc(100vw - (100vw - 100%))',
            height: '100svh',
            backgroundColor: 'white',
            overflowY: 'scroll',
        }}>
            <div id="modal" className="ecfw-max-w-screen-lg ecfw-mx-auto">
                <div id="topbar" className="ecfw-py-2 ecfw-px-4 ecfw-flex ecfw-justify-between">
                    <button
                        className="ecfw-text-bg-primary hover:ecfw-text-bg-primary/90 ecfw-rounded-md ecfw-py-2 ecfw-h-10 "
                        onClick={() => setShowModalBoolean(false)}>
                        <ChevronLeft className="mr-2 h-4 w-4" />

                    </button>
                    <div
                        className="ecfw-flex ecfw-relative"
                    >
                        <button id="dropdownDefaultButton"
                            onClick={() => saveDraft()}
                            data-dropdown-toggle="dropdown"
                            className="ecfw-pr-16 ecfw-flex ecfw-h-10 ecfw-rounded-l-md ecfw-py-2 ecfw-px-4 ecfw-bg-primary ecfw-text-primary-foreground hover:ecfw-bg-primary/90"
                            type="button">
                            <Save className="mr-2 h-4 w-4 ecfw-pr-2 ecfw-py-1" />
                            Save
                        </button>
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="ecfw-flex ecfw-h-10 ecfw-rounded-r-md ecfw-py-2 ecfw-border-l-2 ecfw-border-slate-200 ecfw-px-3 ecfw-bg-primary ecfw-text-primary-foreground hover:ecfw-bg-primary/90"                                     >
                            {
                                showDropdown ?
                                    <ChevronUp className="mr-2 h-4 w-4" />
                                    :
                                    <ChevronDown className="mr-2 h-4 w-4" />
                            }
                        </button>
                        {
                            showDropdown && (
                                <div id="dropdown"
                                    className="ecfw-absolute ecfw-top-10 ecfw-w-full"
                                >
                                    <div
                                        className="ecfw-border-slate-100 ecfw-z-50 ecfw-min-w-[8rem] ecfw-overflow-hidden ecfw-rounded-md ecfw-border ecfw-bg-popover ecfw-p-1 ecfw-text-popover-foreground ecfw-shadow-md ecfw-animate-in data-[side=bottom]:ecfw-slide-in-from-top-2 data-[side=left]:ecfw-slide-in-from-right-2 data-[side=right]:ecfw-slide-in-from-left-2 data-[side=top]:ecfw-slide-in-from-bottom-2"
                                    >
                                        <div
                                            className="ecfw-cursor-pointer hover:ecfw-bg-secondary/90 ecfw-flex ecfw-relative ecfw-select-none ecfw-items-center ecfw-rounded-sm ecfw-px-2 ecfw-py-2 ecfw-outline-none ecfw-transition-colors focus:ecfw-bg-accent focus:ecfw-text-accent-foreground data-[disabled]:ecfw-pointer-events-none data-[disabled]:ecfw-opacity-50"
                                            onClick={() => publishDraft()}
                                        >
                                            <Send className="ml-2 h-4 w-4 ecfw-pr-2" />
                                            Publish
                                        </div>
                                        <Separator
                                            className="ecfw-shrink-0 ecfw-border-slate-100"
                                            style={{
                                                borderWidth: '0 0 0.1px 0',
                                            }}
                                        />
                                        <div
                                            className="ecfw-text-red-500  ecfw-cursor-pointer hover:ecfw-bg-secondary/90 ecfw-flex ecfw-relative ecfw-select-none ecfw-items-center ecfw-rounded-sm ecfw-px-2 ecfw-py-2 ecfw-outline-none ecfw-transition-colors focus:ecfw-bg-accent focus:ecfw-text-accent-foreground data-[disabled]:ecfw-pointer-events-none data-[disabled]:ecfw-opacity-50"
                                            onClick={() => deleteDraft()}
                                        >
                                            <Trash className="ml-2 h-4 w-4 ecfw-pr-2" />
                                            Delete
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
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
        </div>
    </>)
}