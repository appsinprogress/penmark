import React, { useEffect, useState } from "react";
import { useEditorEventCallback } from "@nytimes/react-prosemirror";
import { ProseMirror } from "@nytimes/react-prosemirror";
import { undo, redo, history } from "prosemirror-history"
import { baseKeymap, toggleMark, setBlockType, wrapIn, lift } from "prosemirror-commands"
import { wrapInList } from "prosemirror-schema-list"
import {
  schema, defaultMarkdownParser,
  defaultMarkdownSerializer
} from "prosemirror-markdown"
import { Check, ChevronRight, Circle, Bold, Italic, CodeIcon, Link, Undo, Redo, ListOrdered, List, Quote, Outdent, FileType, FileSignature, Image } from "lucide-react"
import { splitListItem } from "prosemirror-schema-list";

export function CustomButton({
    onClick,
    children
}){
    return <button
        onClick={onClick}
        className="ecfw-flex ecfw-cursor-pointer ecfw-select-none ecfw-items-center ecfw-rounded-sm ecfw-px-3 ecfw-py-1.5 ecfw-text-sm ecfw-font-medium ecfw-outline-none focus:ecfw-bg-accent focus:ecfw-text-accent-foreground data-[state=open]:ecfw-bg-accent data-[state=open]:ecfw-text-accent-foreground"
        // className="ecfw-bg-slate-600 hover:ecfw-bg-slate-700 ecfw-text-white ecfw-py-2 ecfw-px-4 ecfw-rounded"
    >
        {children}
    </button>
}

export function BoldButton() {
  const onClick = useEditorEventCallback((view) => {
    const toggleBoldMark = toggleMark(view.state.schema.marks.strong);
    toggleBoldMark(view.state, view.dispatch, view);
    view.focus();
  });

  return <CustomButton onClick={onClick}><Bold /></CustomButton>;
}

//italic button
export function ItalicButton(){
  const onClick = useEditorEventCallback((view) => {
    const toggleItalicMark = toggleMark(view.state.schema.marks.em);
    toggleItalicMark(view.state, view.dispatch, view);
    view.focus();
  })

  return <CustomButton onClick={onClick}><Italic /></CustomButton>;
}

//make code button
export function CodeButton(){
  const onClick = useEditorEventCallback((view) => {
    const toggleCodeMark = toggleMark(view.state.schema.marks.code);
    toggleCodeMark(view.state, view.dispatch, view);
    view.focus();
  })

  return <CustomButton onClick={onClick}><CodeIcon /></CustomButton>;
}

//button for link
export function LinkButton(){
  const onClick = useEditorEventCallback((view) => {
    const link = prompt("Enter the link URL");
    if (!link) return;
    const toggleLinkMark = toggleMark(view.state.schema.marks.link, { href: link });
    toggleLinkMark(view.state, view.dispatch, view);
    view.focus();
  })

  return <CustomButton onClick={onClick}><Link /></CustomButton>;
}

export function HorizontalRuleButton(){
  const onClick = useEditorEventCallback((view) => {
    const hr = view.state.schema.nodes.horizontal_rule.create();
    const tr = view.state.tr.replaceSelectionWith(hr);

    view.dispatch(tr);
    // tr();
    view.focus();
    // view.state.apply(tr);
  })

  return <CustomButton onClick={onClick}>HR</CustomButton>;
}

export function HeaderButton({level}){
  const onClick = useEditorEventCallback((view) => {
    console.log("HeaderButton level", level)

    const setHeaderCmd = setBlockType(view.state.schema.nodes.heading, { level });
    setHeaderCmd(view.state, view.dispatch, view);
    view.focus();
  })

  return <div onClick={onClick}>Heading {level}</div>;
}

export function CodeBlockButton(){
  const onClick = useEditorEventCallback((view) => {
    console.log("logging code block")
    const setCodeBlockCmd = setBlockType(view.state.schema.nodes.code_block);
    setCodeBlockCmd(view.state, view.dispatch, view);
    view.focus();
  });

  return <div onClick={onClick}>Code block</div>;
}

export function UndoButton(){
  const onClick = useEditorEventCallback((view) => {
    undo(view.state, view.dispatch, view);
    view.focus();
  })

  return <CustomButton onClick={onClick}><Undo /></CustomButton>;
}

export function RedoButton(){
  const onClick = useEditorEventCallback((view) => {
    redo(view.state, view.dispatch, view);
    view.focus();
  })

  return <CustomButton onClick={onClick}><Redo /></CustomButton>;
}

export function BulletListButton(){
  const onClick = useEditorEventCallback((view) => {
    const cmd = wrapInList(view.state.schema.nodes.bullet_list, {
      tight: true,
    });
    cmd(view.state, view.dispatch, view);
    view.focus();
  })

  return <CustomButton onClick={onClick}><List /></CustomButton>;
}

export function OrderedListButton(){
  const onClick = useEditorEventCallback((view) => {
    const cmd = wrapInList(view.state.schema.nodes.ordered_list, {
      tight: true,
    });
    cmd(view.state, view.dispatch, view);
    view.focus();
  })

  return <CustomButton onClick={onClick}><ListOrdered /></CustomButton>;
}

export function BlockquoteButton(){
  const onClick = useEditorEventCallback((view) => {
    const cmd = wrapInList(view.state.schema.nodes.blockquote);
    cmd(view.state, view.dispatch, view);
    view.focus();
  })

  return <CustomButton onClick={onClick}><Quote /></CustomButton>;
}

export function LiftButton(){
  const onClick = useEditorEventCallback((view) => {
    const cmd = lift;
    cmd(view.state, view.dispatch, view);
    view.focus();
  })

  return <CustomButton onClick={onClick}><Outdent /></CustomButton>;
}

export function ParagraphButton(){
  const onClick = useEditorEventCallback((view) => {
    const cmd = setBlockType(view.state.schema.nodes.paragraph);
    cmd(view.state, view.dispatch, view);
    view.focus();
  })

  return <div onClick={onClick}>Paragraph</div>;
}

export function MarkdownToggleButton({
  isMarkdown,
  setIsMarkdown
}){
  const onClick = ((view) => {
    setIsMarkdown(!isMarkdown)
    view.focus();
  }, [])

  return <button 
    onClick={() => setIsMarkdown(!isMarkdown)}
    className='ecfw-ml-2 ecfw-bg-transparent ecfw-outline-none ecfw-text-md ecfw-font-semibold  ecfw-p-2
      ecfw-border-slate-300 ecfw-border ecfw-rounded-lg
    '
  >
    {
      isMarkdown ?
        <FileType />
        :
        <FileSignature />
    }
  </button>
}

export function InsertImage(view){
    //select image from file system
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      if (!input.files) return;
      const file = input.files[0];

      //create a blob url for the image
      const src = URL.createObjectURL(file);

      //insert the image into the editor
      const node = view.state.schema.nodes.image.create({
        src,
        title: file.name
      });
      const transaction = view.state.tr.replaceSelectionWith(node);
      view.dispatch(transaction);
      view.focus();
    };
    input.click();
}

export function base64ToBlobUrl(base64String, contentType) {
  console.log(base64String)
  const byteCharacters = atob(base64String);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  const blobUrl = URL.createObjectURL(blob);
  return blobUrl;
}

//function for image insert button
export function ImageInsertButton(){
  const onClick = useEditorEventCallback((view) => {
    InsertImage(view);
  })

  return <CustomButton onClick={onClick}><Image /></CustomButton>;
}