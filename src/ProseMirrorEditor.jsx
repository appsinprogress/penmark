import { EditorState } from "prosemirror-state";
import { ProseMirror } from "@nytimes/react-prosemirror";
import {schema, defaultMarkdownParser,
        defaultMarkdownSerializer} from "prosemirror-markdown"
import { exampleSetup } from "prosemirror-example-setup";
import {undo, redo, history} from "prosemirror-history"
import {baseKeymap, toggleMark, setBlockType, wrapIn, lift} from "prosemirror-commands"
import {keymap} from "prosemirror-keymap"
import {dropCursor} from "prosemirror-dropcursor"
import {gapCursor} from "prosemirror-gapcursor"
import {wrapInList} from "prosemirror-schema-list"

import React, { useState, useEffect } from "react";

export function ProseMirrorEditor({
    content
}) {
  // It's important that mount is stored as state,
  // rather than a ref, so that the ProseMirror component
  // is re-rendered when it's set
  const [isMarkdown, setIsMarkdown] = useState(false);
  const [mount, setMount] = useState();
  const [editorState, setEditorState] = useState(
    EditorState.create({ 
      schema: schema,
      doc: defaultMarkdownParser.parse(content)
   })
  );

  const [editedContent, setEditedContent] = useState(content);

  function getContent() {
    return defaultMarkdownSerializer.serialize(editorState.doc);
  }

  useEffect(() => {
    if (mount) {
      console.log(editorState)
    }
    console.log(getContent())
    setEditedContent(getContent())
  }, [mount, editorState])

  useEffect(()=> {
    setEditedContent(content)
  },[content]);

  useEffect(() => {
    if (mount) {
      setEditorState(
        EditorState.create({
          schema: schema,
          plugins: [
            history(),
            keymap({"Mod-z": undo, "Mod-y": redo}),
            keymap(baseKeymap),
            dropCursor(),
            gapCursor(),
          ],
          doc: defaultMarkdownParser.parse(editedContent)
        })
      );
    }
  }, [mount, editedContent, isMarkdown]) //we rerun when ismarkdown changes to capture changes made in textarea markdown

  function makeBold() {
    toggleMark(schema.marks.strong)(editorState, (tr) => {
      setEditorState((s) => s.apply(tr));
    })
  }

  function makeItalic(){
    toggleMark(schema.marks.em)(editorState, (tr) => {
      setEditorState((s) => s.apply(tr));
    })
  }

  function makeCode(){
    toggleMark(schema.marks.code)(editorState, (tr) => {
      setEditorState((s) => s.apply(tr));
    })
  }

  //function to insert a link in the text
  function insertLink(){
    const link = prompt("Enter the link URL");
    if(!link) return;
    toggleMark(schema.marks.link, {href: link})(editorState, (tr) => {
      setEditorState((s) => s.apply(tr));
    })
  }

  //function to insert horizontal rule
  function insertHorizontalRule(){
    const hr = schema.nodes.horizontal_rule.create();
    const tr = editorState.tr.replaceSelectionWith(hr);
    setEditorState((s) => s.apply(tr));
  }

  //function to make block type header 1
  function makeHeader(level){
    console.log('making header')
    //setBlockType
    const cmd = setBlockType(schema.nodes.heading, {level: 1});
    console.log(cmd)

    const test = cmd(editorState, (tr) => {
      setEditorState((s) => s.apply(tr));
    })
    console.log(test)
    console.log(editorState)
    console.log(getContent())
    setEditorState(editorState);
  }

  //function make code block
  function makeCodeBlock(){
    const cmd = setBlockType(schema.nodes.code_block);
    const test = cmd(editorState, (tr) => {
      setEditorState((s) => s.apply(tr));
    });

    console.log(test)
  }

  //function to undo item
  function undoItem(){
    const cmd = undo;
    const test = cmd(editorState, (tr) => {
      setEditorState((s) => s.apply(tr));
    });    
  }

  //function to redo item
  function redoItem(){
    const cmd = redo;
    const test = cmd(editorState, (tr) => {
      setEditorState((s) => s.apply(tr));
    });
  }

  function wrapInBulletList(){
    const cmd = wrapInList(schema.nodes.bullet_list);
    const test = cmd(editorState, (tr) => {
      setEditorState((s) => s.apply(tr));
    })
  }

  function wrapInOrderedList(){
    const cmd = wrapInList(schema.nodes.ordered_list);
    const test = cmd(editorState, (tr) => {
      setEditorState((s) => s.apply(tr));
    })
  }

  function wrapInBlockquote(){
    const cmd = wrapIn(schema.nodes.blockquote);
    const test = cmd(editorState, (tr) => {
      setEditorState((s) => s.apply(tr));
    })
  }

  function liftItem(){
    const test = lift(editorState, (tr) => {
      setEditorState((s) => s.apply(tr));
    })

  }

  return (
    <>
      { isMarkdown ?
        <button onClick={() => {
          setIsMarkdown(false);
          console.log(editedContent);
        }}
        className="ecfw-bg-slate-600 hover:ecfw-bg-slate-700 ecfw-text-white ecfw-font-bold ecfw-py-2 ecfw-px-4 ecfw-rounded"
        >
          Markdown
        </button>
        :
        <button onClick={() => {
          setIsMarkdown(true);
        }}
        className="ecfw-bg-slate-600 hover:ecfw-bg-slate-700 ecfw-text-white ecfw-font-bold ecfw-py-2 ecfw-px-4 ecfw-rounded"
        >
          ProseMirror
        </button>
    }
    <button onClick={() => {
        makeBold();
      }}
      className="ecfw-bg-slate-600 hover:ecfw-bg-slate-700 ecfw-text-white ecfw-font-bold ecfw-py-2 ecfw-px-4 ecfw-rounded"
    >
      Bold
    </button>
    <button onClick={() => {
        makeItalic();
      }}
      className="ecfw-bg-slate-600 hover:ecfw-bg-slate-700 ecfw-text-white ecfw-font-bold ecfw-py-2 ecfw-px-4 ecfw-rounded"
    >
      Italic
    </button>
    <button onClick={() => {  
        makeCode();
      }}
      className="ecfw-bg-slate-600 hover:ecfw-bg-slate-700 ecfw-text-white ecfw-font-bold ecfw-py-2 ecfw-px-4 ecfw-rounded"
    >
      Code
    </button>
    <button onClick={() => {
        insertLink();
      }}
      className="ecfw-bg-slate-600 hover:ecfw-bg-slate-700 ecfw-text-white ecfw-font-bold ecfw-py-2 ecfw-px-4 ecfw-rounded"
    >
      Link
    </button>
    <button onClick={() => {
        insertHorizontalRule();
      }}
      className="ecfw-bg-slate-600 hover:ecfw-bg-slate-700 ecfw-text-white ecfw-font-bold ecfw-py-2 ecfw-px-4 ecfw-rounded"
    >
      Horizontal Rule
    </button>
    <button onClick={() => {
        makeHeader(1);
      }}
      className="ecfw-bg-slate-600 hover:ecfw-bg-slate-700 ecfw-text-white ecfw-font-bold ecfw-py-2 ecfw-px-4 ecfw-rounded"
    >
      H1
    </button>
    <button onClick={() => {
        makeHeader(2);
      }}
      className="ecfw-bg-slate-600 hover:ecfw-bg-slate-700 ecfw-text-white ecfw-font-bold ecfw-py-2 ecfw-px-4 ecfw-rounded"
    >
      H2
    </button>
    <button onClick={() => {
        makeHeader(3);
      }}
      className="ecfw-bg-slate-600 hover:ecfw-bg-slate-700 ecfw-text-white ecfw-font-bold ecfw-py-2 ecfw-px-4 ecfw-rounded"
    >
      H3
    </button>
    <button onClick={() => {
        makeHeader(4);
      }}
      className="ecfw-bg-slate-600 hover:ecfw-bg-slate-700 ecfw-text-white ecfw-font-bold ecfw-py-2 ecfw-px-4 ecfw-rounded">
      H4
    </button>
    <button onClick={() => {
        makeHeader(5);
      }}
      className="ecfw-bg-slate-600 hover:ecfw-bg-slate-700 ecfw-text-white ecfw-font-bold ecfw-py-2 ecfw-px-4 ecfw-rounded">
      H5
    </button>
    <button onClick={() => {
        makeHeader(6);
      }}
      className="ecfw-bg-slate-600 hover:ecfw-bg-slate-700 ecfw-text-white ecfw-font-bold ecfw-py-2 ecfw-px-4 ecfw-rounded">
      H6
    </button>
    <button onClick={() => {
        makeCodeBlock();
      }}
      className="ecfw-bg-slate-600 hover:ecfw-bg-slate-700 ecfw-text-white ecfw-font-bold ecfw-py-2 ecfw-px-4 ecfw-rounded">
      Code Block
    </button>
    <button onClick={() => {
        undoItem();
      }}
      className="ecfw-bg-slate-600 hover:ecfw-bg-slate-700 ecfw-text-white ecfw-font-bold ecfw-py-2 ecfw-px-4 ecfw-rounded">
      Undo
    </button>
    <button onClick={() => {
      redoItem();
    }}
    className="ecfw-bg-slate-600 hover:ecfw-bg-slate-700 ecfw-text-white ecfw-font-bold ecfw-py-2 ecfw-px-4 ecfw-rounded">
      Redo
    </button>
    <button onClick={()=>{
        wrapInBulletList();
      }}
      className="ecfw-bg-slate-600 hover:ecfw-bg-slate-700 ecfw-text-white ecfw-font-bold ecfw-py-2 ecfw-px-4 ecfw-rounded">
      Bullet
    </button>
    <button onClick={()=> {
      wrapInOrderedList();
    }}
    className="ecfw-bg-slate-600 hover:ecfw-bg-slate-700 ecfw-text-white ecfw-font-bold ecfw-py-2 ecfw-px-4 ecfw-rounded">
      Numbers
    </button>
    <button onClick={()=>{
      wrapInBlockquote();
    }}
    className="ecfw-bg-slate-600 hover:ecfw-bg-slate-700 ecfw-text-white ecfw-font-bold ecfw-py-2 ecfw-px-4 ecfw-rounded">
      Blockquote
    </button>
    <button onClick={()=>{
      liftItem();
    }}
    className="ecfw-bg-slate-600 hover:ecfw-bg-slate-700 ecfw-text-white ecfw-font-bold ecfw-py-2 ecfw-px-4 ecfw-rounded">
      Lift
    </button>
    {
      isMarkdown ?
      <textarea value={editedContent} onChange={(e)=> setEditedContent(e.target.value)} />
      :
      <ProseMirror 
        mount={mount} 
        state={editorState}
        dispatchTransaction={(tr) => {
          setEditorState((s) => s.apply(tr));
        }}
      >
        <div ref={setMount} />
      </ProseMirror>
    }
    </>

  );
}