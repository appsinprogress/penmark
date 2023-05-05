import React, { useEffect, useState } from "react";
import "./styles.css";
import "./basestyles.scss";
import { ChevronDown, ChevronLeft, ChevronUp, Send, Trash, Save } from "lucide-react"
import {Root, Separator} from "@radix-ui/react-separator"
import { Octokit } from "octokit";
import { getAccessToken, getUser } from "./shared.js";
import { Base64 } from 'js-base64';
import { ProseMirrorEditor } from "./ProseMirrorEditor.jsx";

const accessToken = await getAccessToken();

export function Modal({
    show, setShowModalBoolean, draft
}){
    var octokit = new Octokit({
        auth: accessToken
    });

    const [title, setTitle] = useState('New blog post');
    const [showDropdown, setShowDropdown] = useState(false);
    const [fileContent, setFileContent] = useState('');
    const [fileSha, setFileSha] = useState('');

    useEffect(() => {
        console.log(draft)


    }, [draft]);

    useEffect(() => {
        console.log(draft)

        const fetchData = async () => {
            await loadFileContent();
        };
        fetchData();
    }, [draft]);

    
  async function loadFileContent(){
    var response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner: 'thomasgauvin',
      repo: 'blog',
      path: `${draft.path}`,
    });

    const fileContent = Base64.decode(response.data.content);

    setFileSha(response.data.sha);
    setFileContent(fileContent);

    // this.fixMarkdownToBypassProsemirrorBug();
  }

    return(<>
        <div id="modal-container" className="modal-container" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: 'calc(100vw - (100vw - 100%))',
            height: '100vh',
            backgroundColor: 'white',
            zIndex: 1000
        }}>
            <div id="modal" style={{

            }}>
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
                    data-dropdown-toggle="dropdown" 
                    className="ecfw-pr-16 ecfw-flex ecfw-h-10 ecfw-rounded-l-md ecfw-py-2 ecfw-px-4 ecfw-bg-primary ecfw-text-primary-foreground hover:ecfw-bg-primary/90" 
                    type="button">
                    <Save className="mr-2 h-4 w-4 ecfw-pr-2 ecfw-py-1"/>
                    Save
                </button>
                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="ecfw-flex ecfw-h-10 ecfw-rounded-r-md ecfw-py-2 ecfw-border-l-2 ecfw-border-slate-200 ecfw-px-3 ecfw-bg-primary ecfw-text-primary-foreground hover:ecfw-bg-primary/90"                                     >
                    {
                        showDropdown?
                        <ChevronUp className="mr-2 h-4 w-4"  />
                        :
                        <ChevronDown className="mr-2 h-4 w-4"  />
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
                    <ProseMirrorEditor content={fileContent} />
                </div>
            </div>

        </div>
    </>)
}