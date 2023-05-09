// TODO: [X] fix the headers (not working)
// TOOD: [ ] fix the selection changing when you click on buttons
// TODO: [ ] fix some keymaps to buttons (like bold, italic, etc)
// TODO: [ ] styling for lists & others
// TODO: [ ] image insertion
// TODO: [ ] handle save, cancel, and delete, etc.

import { EditorState } from "prosemirror-state";
import { ProseMirror, useEditorEventCallback } from "@nytimes/react-prosemirror";
import {
  schema, defaultMarkdownParser,
  defaultMarkdownSerializer
} from "prosemirror-markdown"
import { exampleSetup } from "prosemirror-example-setup";
import { undo, redo, history } from "prosemirror-history"
import { baseKeymap, toggleMark, setBlockType, wrapIn, lift } from "prosemirror-commands"
import { keymap } from "prosemirror-keymap"
import { dropCursor } from "prosemirror-dropcursor"
import { gapCursor } from "prosemirror-gapcursor"
import { wrapInList } from "prosemirror-schema-list"


import React, { useState, useEffect } from "react";

let count = 0;

export function ProseMirrorEditorArchive({
  content
}) {
  // It's important that mount is stored as state,
  // rather than a ref, so that the ProseMirror component
  // is re-rendered when it's set
  const [isMarkdown, setIsMarkdown] = useState(false);
  const [mount, setMount] = useState();
  const [editedContent, setEditedContent] = useState(content);
  const [editorState, setEditorState] = useState(
    EditorState.create({
      schema: schema,
      doc: defaultMarkdownParser.parse(editedContent)
    })
  );


  function getContent() {
    return defaultMarkdownSerializer.serialize(editorState.doc);
  }

  useEffect(() => { //binds content (props) to edited content (state)
    console.log(content)
    setEditedContent(content)
  }, [content]);

  useEffect(() => {
    console.log(editorState)
  }, [editorState]  )


  // useEffect(() => { //binds editor state to editedContent
  //   setEditedContent(defaultMarkdownSerializer.serialize(editorState.doc));
  // }, [mount, editorState]);

  useEffect(() => { //binds edited content to editor state (changes in plaintext will get transferred to prosemirror)
    if (mount) {
      setEditorState(
        EditorState.create({
          schema: schema,
          plugins: [
            history(),
            keymap({ "Mod-z": undo, "Mod-y": redo }),
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
    // return useEditorEventCallback((view) => {
    //   const toggleBoldMark = toggleMark(view.state.schema.marks.bold);
    //   toggleBoldMark(view.state, view.dispatch, view);
    // })
    toggleMark(schema.marks.strong)(editorState, (tr) => {
      setEditorState((s) => s.apply(tr));
    })
  }

  function makeItalic() {
    toggleMark(schema.marks.em)(editorState, (tr) => {
      setEditorState((s) => s.apply(tr));
    })
  }

  function makeCode() {
    toggleMark(schema.marks.code)(editorState, (tr) => {
      setEditorState((s) => s.apply(tr));
    })
  }

  //function to insert a link in the text
  function insertLink() {
    const link = prompt("Enter the link URL");
    if (!link) return;
    toggleMark(schema.marks.link, { href: link })(editorState, (tr) => {
      setEditorState((s) => s.apply(tr));
    })
  }

  //function to insert horizontal rule
  function insertHorizontalRule() {
    const hr = schema.nodes.horizontal_rule.create();
    const tr = editorState.tr.replaceSelectionWith(hr);
    setEditorState((s) => s.apply(tr));
  }

  //function to make block type header 1
  function makeHeader(level) {
    console.log('making header')
    //setBlockType
    const cmd = setBlockType(schema.nodes.heading, { level });
    console.log(cmd)

    const test = cmd(editorState, (tr) => {
      setEditorState((s) => s.apply(tr));
    })
  }

  //function make code block
  function makeCodeBlock() {
    const cmd = setBlockType(schema.nodes.code_block);
    const test = cmd(editorState, (tr) => {
      setEditorState((s) => s.apply(tr));
    });

    console.log(test)
  }

  //function to undo item
  function undoItem() {
    const cmd = undo;
    const test = cmd(editorState, (tr) => {
      setEditorState((s) => s.apply(tr));
    });
    console.log(test);
  }

  //function to redo item
  function redoItem() {
    const cmd = redo;
    const test = cmd(editorState, (tr) => {
      setEditorState((s) => s.apply(tr));
    });
  }

  function wrapInBulletList() {
    const cmd = wrapInList(schema.nodes.bullet_list);
    const test = cmd(editorState, (tr) => {
      setEditorState((s) => s.apply(tr));
    })
  }

  function wrapInOrderedList() {
    const cmd = wrapInList(schema.nodes.ordered_list);
    const test = cmd(editorState, (tr) => {
      setEditorState((s) => s.apply(tr));
    })
  }

  function wrapInBlockquote() {
    const cmd = wrapIn(schema.nodes.blockquote);
    const test = cmd(editorState, (tr) => {
      setEditorState((s) => s.apply(tr));
    })
  }

  function liftItem() {
    const test = lift(editorState, (tr) => {
      setEditorState((s) => s.apply(tr));
    })
  }

  function handleMarkdownToggle(){
    if(!isMarkdown){ 
      //if prosemirror is active, we need to save the edited content from prosemirror to state so that plain text can make changes
      setEditedContent(getContent()); 
    }

    setIsMarkdown(!isMarkdown);
  }

  console.log("rerendered")
  console.log(count++)

  return (
    <>
      {isMarkdown ?
        <button onClick={handleMarkdownToggle}
          className="ecfw-bg-slate-600 hover:ecfw-bg-slate-700 ecfw-text-white ecfw-font-bold ecfw-py-2 ecfw-px-4 ecfw-rounded"
        >
          ProseMirror
        </button>
        :
        <button onClick={handleMarkdownToggle}
          className="ecfw-bg-slate-600 hover:ecfw-bg-slate-700 ecfw-text-white ecfw-font-bold ecfw-py-2 ecfw-px-4 ecfw-rounded"
        >
          Markdown
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
      <button onClick={() => {
        wrapInBulletList();
      }}
        className="ecfw-bg-slate-600 hover:ecfw-bg-slate-700 ecfw-text-white ecfw-font-bold ecfw-py-2 ecfw-px-4 ecfw-rounded">
        Bullet
      </button>
      <button onClick={() => {
        wrapInOrderedList();
      }}
        className="ecfw-bg-slate-600 hover:ecfw-bg-slate-700 ecfw-text-white ecfw-font-bold ecfw-py-2 ecfw-px-4 ecfw-rounded">
        Numbers
      </button>
      <button onClick={() => {
        wrapInBlockquote();
      }}
        className="ecfw-bg-slate-600 hover:ecfw-bg-slate-700 ecfw-text-white ecfw-font-bold ecfw-py-2 ecfw-px-4 ecfw-rounded">
        Blockquote
      </button>
      <button onClick={() => {
        liftItem();
      }}
        className="ecfw-bg-slate-600 hover:ecfw-bg-slate-700 ecfw-text-white ecfw-font-bold ecfw-py-2 ecfw-px-4 ecfw-rounded">
        Lift
      </button>
      {
        isMarkdown ?
          <textarea value={editedContent} onChange={(e) => setEditedContent(e.target.value)} />
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
