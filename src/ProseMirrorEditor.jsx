// TODO: [X] fix the headers (not working)
// TOOD: [X] fix the selection changing when you click on buttons
// TODO: [X] fix some keymaps to buttons (like bold, italic, etc)
// TODO: [ ] styling for lists & others
// TODO: [ ] image insertion
// TODO: [ ] handle save, cancel, and delete, etc.

import { EditorState } from "prosemirror-state";
import { schema } from "prosemirror-schema-basic";
import React, { useEffect, useState } from "react";
import { ProseMirror } from "@nytimes/react-prosemirror";
import { BoldButton, ItalicButton, CodeButton, LinkButton, HorizontalRuleButton, HeaderButton,
    CodeBlockButton, UndoButton, RedoButton, BulletListButton, OrderedListButton, 
    BlockquoteButton, LiftButton } from "./ProseMirrorButtons.jsx";
import { defaultMarkdownParser, defaultMarkdownSerializer } from "prosemirror-markdown"
import { undo, redo, history } from "prosemirror-history"
import { keymap } from "prosemirror-keymap"
import { baseKeymap, toggleMark, setBlockType, wrapIn, lift, chainCommands } from "prosemirror-commands"
import { dropCursor } from "prosemirror-dropcursor"
import { gapCursor } from "prosemirror-gapcursor"
import { buildKeymap } from "prosemirror-example-setup";

const customKeymaps = {
  "Mod-z": undo, 
  "Mod-y": redo, 
  "Mod-Shift-z": redo, 
  "Mod-b": toggleMark(schema.marks.strong),
  "Mod-i": toggleMark(schema.marks.em),
  "Mod-`": toggleMark(schema.marks.code),
}

export function ProseMirrorEditor({
    content
}) {
  const [mount, setMount] = useState();
  const [editorState, setEditorState] = useState(
    EditorState.create({
        schema: schema,
        plugins: [
            history(),
            keymap(baseKeymap),
            keymap(customKeymaps),
            dropCursor(),
            gapCursor(),
          ],
        doc: defaultMarkdownParser.parse(content)
      })
    );

  useEffect(() => {
    if(mount){
        setEditorState(EditorState.create({
            schema: schema,
            plugins: [
                history(),
                keymap(customKeymaps),
                keymap(baseKeymap),
                dropCursor(),
                gapCursor(),
              ],
            doc: defaultMarkdownParser.parse(content)
        }))
    }
  }, [mount, content]);

  console.log(content)

  console.log('rendering')

  return (
    <ProseMirror
      mount={mount}
      state={editorState}
      dispatchTransaction={(tr) => {
        setEditorState((s) => s.apply(tr));
      }}
    >
        <BoldButton />
        <ItalicButton />
        <CodeButton />
        <LinkButton />
        <HorizontalRuleButton />
        <HeaderButton level={1} />
        <HeaderButton level={2} />
        <HeaderButton level={3} />
        <HeaderButton level={4} />
        <HeaderButton level={5} />
        <HeaderButton level={6} />
        <CodeBlockButton />
        <UndoButton />
        <RedoButton />
        <BulletListButton />
        <OrderedListButton />
        <BlockquoteButton />
        <LiftButton /> 
      <div ref={setMount} />
    </ProseMirror>
  );
}

