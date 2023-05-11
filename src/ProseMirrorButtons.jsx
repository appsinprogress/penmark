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
import { Check, ChevronRight, Circle, Bold, Italic, CodeIcon, Link, Undo, Redo, ListOrdered, List, Quote, Outdent } from "lucide-react"

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
    const setHeaderCmd = setBlockType(view.state.schema.nodes.heading, { level });
    setHeaderCmd(view.state, view.dispatch, view);
    view.focus();
  })

  return <div onClick={onClick}>Heading {level}</div>;
}

export function CodeBlockButton(){
  const onClick = useEditorEventCallback((view) => {
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
    const cmd = wrapInList(view.state.schema.nodes.bullet_list);
    cmd(view.state, view.dispatch, view);
    view.focus();
  })

  return <CustomButton onClick={onClick}><List /></CustomButton>;
}

export function OrderedListButton(){
  const onClick = useEditorEventCallback((view) => {
    const cmd = wrapInList(view.state.schema.nodes.ordered_list);
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
