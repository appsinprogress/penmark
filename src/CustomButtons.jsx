import React, { useEffect, useState } from "react";
import { useEditorEventCallback } from "@nytimes/react-prosemirror";
import { ProseMirror } from "@nytimes/react-prosemirror";
import { undo, redo, history } from "prosemirror-history"
import { baseKeymap, toggleMark, setBlockType, wrapIn, lift, canExecute } from "prosemirror-commands"
import { wrapInList } from "prosemirror-schema-list"
import {
  schema, defaultMarkdownParser,
  defaultMarkdownSerializer
} from "prosemirror-markdown"
import { Check, ChevronRight, Circle, Bold, Italic, CodeIcon, Link, Undo, Redo, ListOrdered, List, Quote, Outdent, FileType, FileSignature, Image } from "lucide-react"
import { splitListItem } from "prosemirror-schema-list";
import { useEditorState } from "@nytimes/react-prosemirror";
import { cn } from "./lib/utils"


export function CustomButton({
  onClick,
  children,
  disabled = false,
}) {
  return <button
    onClick={onClick}
    className={
      cn(
        //conditionally apply transparency on disabled buttons
        disabled ? "ecfw-opacity-30" : "",
        "ecfw-flex ecfw-cursor-pointer ecfw-select-none ecfw-items-center ecfw-rounded-sm ecfw-px-3 ecfw-py-1.5 ecfw-text-sm ecfw-font-medium ecfw-outline-none focus:ecfw-bg-accent focus:ecfw-text-accent-foreground data-[state=open]:ecfw-bg-accent data-[state=open]:ecfw-text-accent-foreground"
      )
    }
  >
    {children}
  </button>
}

export function BoldButton() {

  const editorState = useEditorState();
  const toggleBoldMarkCmd = toggleMark(schema.marks.strong);
  const canExecuteCommand = toggleBoldMarkCmd(editorState)

  const onClick = useEditorEventCallback((view) => {
    toggleBoldMarkCmd(view.state, view.dispatch, view);
    view.focus();
  });

  return <CustomButton onClick={onClick} disabled={!canExecuteCommand}>
    <Bold />
  </CustomButton>;
}

//italic button
export function ItalicButton() {
  const editorState = useEditorState();
  const toggleItalicMarkCmd = toggleMark(schema.marks.em);
  const canExecuteCommand = toggleItalicMarkCmd(editorState)

  const onClick = useEditorEventCallback((view) => {
    toggleItalicMarkCmd(view.state, view.dispatch, view);
    view.focus();
  });

  return <CustomButton onClick={onClick} disabled={!canExecuteCommand}>
    <Italic />

  </CustomButton>;
}

//make code button
export function CodeButton() {
  const editorState = useEditorState();
  const toggleCodeMarkCmd = toggleMark(schema.marks.code);
  const canExecuteCommand = toggleCodeMarkCmd(editorState)

  const onClick = useEditorEventCallback((view) => {
    toggleCodeMarkCmd(view.state, view.dispatch, view);
    view.focus();
  });

  return <CustomButton onClick={onClick} disabled={!canExecuteCommand}>
    <CodeIcon />
  </CustomButton>;
}

//button for link
export function LinkButton() {

  const editorState = useEditorState();
  const toggleLinkMarkCmd = toggleMark(schema.marks.link);
  const canExecuteCommand = toggleLinkMarkCmd(editorState)

  const onClick = useEditorEventCallback((view) => {
    const link = prompt("Enter the link URL");
    if (!link) return;
    const toggleLinkMark = toggleMark(view.state.schema.marks.link, { href: link });
    toggleLinkMark(view.state, view.dispatch, view);
    view.focus();
  })

  return <CustomButton onClick={onClick} disabled={!canExecuteCommand}>
    <Link />

  </CustomButton>;
}

export function HorizontalRuleButton() {

  const onClick = useEditorEventCallback((view) => {
    const hr = view.state.schema.nodes.horizontal_rule.create();
    const tr = view.state.tr.replaceSelectionWith(hr);

    view.dispatch(tr);
    view.focus();
  })

  return <CustomButton onClick={onClick}>HR</CustomButton>;
}

export function HeaderButton({ level }) {

  const editorState = useEditorState();
  const setHeaderCmd = setBlockType(schema.nodes.heading, { level });
  const canExecuteCommand = setHeaderCmd(editorState)

  const onClick = useEditorEventCallback((view) => {
    setHeaderCmd(view.state, view.dispatch, view);
    view.focus();
  })

  return <div onClick={onClick}
    className={canExecuteCommand ? '' : 'ecfw-opacity-30'}
  >Heading {level}</div>;
}

export function CodeBlockButton() {

  const editorState = useEditorState();
  const setCodeBlockCmd = setBlockType(schema.nodes.code_block);
  const canExecuteCommand = setCodeBlockCmd(editorState)

  const onClick = useEditorEventCallback((view) => {
    setCodeBlockCmd(view.state, view.dispatch, view);
    view.focus();
  });

  return <div onClick={onClick}
    className={canExecuteCommand ? '' : 'ecfw-opacity-30'}
  >
    Code block

  </div>;
}

export function UndoButton() {

  const editorState = useEditorState();
  const canExecuteCommand = undo(editorState)

  const onClick = useEditorEventCallback((view) => {
    undo(view.state, view.dispatch, view);
    view.focus();
  })

  return <CustomButton onClick={onClick} disabled={!canExecuteCommand}>
    <Undo />
  </CustomButton>;
}

export function RedoButton() {

  const editorState = useEditorState();
  const canExecuteCommand = redo(editorState)

  const onClick = useEditorEventCallback((view) => {
    redo(view.state, view.dispatch, view);
    view.focus();
  })

  return <CustomButton onClick={onClick} disabled={!canExecuteCommand}>
    <Redo />
  </CustomButton>;
}

export function BulletListButton() {

  const editorState = useEditorState();
  const wrapInBulletListCmd = wrapInList(schema.nodes.bullet_list, {
    tight: true,
  });
  const canExecuteCommand = wrapInBulletListCmd(editorState)

  const onClick = useEditorEventCallback((view) => {
    wrapInBulletListCmd(view.state, view.dispatch, view);
    view.focus();
  })

  return <CustomButton onClick={onClick} disabled={!canExecuteCommand}><List />

  </CustomButton>;
}

export function OrderedListButton() {

  const editorState = useEditorState();
  const wrapInOrderedListCmd = wrapInList(schema.nodes.ordered_list, {
    tight: true,
  });
  const canExecuteCommand = wrapInOrderedListCmd(editorState)

  const onClick = useEditorEventCallback((view) => {
    wrapInOrderedListCmd(view.state, view.dispatch, view);
    view.focus();
  })

  return <CustomButton onClick={onClick} disabled={!canExecuteCommand}><ListOrdered />

  </CustomButton>;
}

export function BlockquoteButton() {

  const editorState = useEditorState();
  const wrapInBlockquoteCmd = wrapInList(schema.nodes.blockquote);
  const canExecuteCommand = wrapInBlockquoteCmd(editorState)

  const onClick = useEditorEventCallback((view) => {
    wrapInBlockquoteCmd(view.state, view.dispatch, view);
    view.focus();
  })

  return <CustomButton onClick={onClick} disabled={!canExecuteCommand}><Quote />

  </CustomButton>;
}

export function LiftButton() {

  const editorState = useEditorState();
  const canExecuteCommand = lift(editorState)

  const onClick = useEditorEventCallback((view) => {
    lift(view.state, view.dispatch, view);
    view.focus();
  })

  return <CustomButton onClick={onClick} disabled={!canExecuteCommand}><Outdent />

  </CustomButton>;
}

export function ParagraphButton() {

  const editorState = useEditorState();
  const setParagraphCmd = setBlockType(schema.nodes.paragraph);
  const canExecuteCommand = setParagraphCmd(editorState)

  const onClick = useEditorEventCallback((view) => {
    setParagraphCmd(view.state, view.dispatch, view);
    view.focus();
  })

  return <div onClick={onClick}
    className={canExecuteCommand ? '' : 'ecfw-opacity-30'}
  >Paragraph

  </div>;
}

export function MarkdownToggleButton({
  isMarkdown,
  setIsMarkdown
}) {
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
        <FileSignature />
        :
        <FileType />
    }
  </button>
}

export function InsertImage(view) {
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
export function ImageInsertButton() {
  const onClick = useEditorEventCallback((view) => {
    InsertImage(view);
  })

  return <CustomButton onClick={onClick}><Image /></CustomButton>;
}