// TODO: [X] fix the headers (not working)
// TOOD: [X] fix the selection changing when you click on buttons
// TODO: [X] fix some keymaps to buttons (like bold, italic, etc)
// TODO: [X] HR not being inserted
// TODO: [ ] styling for lists & others
// TODO: [ ] image insertion :(
// TODO: [ ] handle save, cancel, and delete, etc.
// TODO: [ ] pressing enter in a bullet list should create a new bullet (same for numbers)
// TODO: [ ] show the buttons conditionally based on whether they can be acted upon

import { EditorState } from "prosemirror-state";
import { schema } from "prosemirror-schema-basic";
import React, { useEffect, useState } from "react";
import { ProseMirror } from "@nytimes/react-prosemirror";
import { BoldButton, ItalicButton, CodeButton, LinkButton, HorizontalRuleButton, HeaderButton,
    CodeBlockButton, UndoButton, RedoButton, BulletListButton, OrderedListButton, 
    BlockquoteButton, LiftButton, ParagraphButton } from "./ProseMirrorButtons.jsx";
import { defaultMarkdownParser, defaultMarkdownSerializer } from "prosemirror-markdown"
import { undo, redo, history } from "prosemirror-history"
import { keymap } from "prosemirror-keymap"
import { baseKeymap, toggleMark, setBlockType, wrapIn, lift, chainCommands } from "prosemirror-commands"
import { dropCursor } from "prosemirror-dropcursor"
import { gapCursor } from "prosemirror-gapcursor"
import { buildKeymap } from "prosemirror-example-setup";
import { useWindowDimensions } from "./hooks/useWindowDimensions.jsx";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
} from "./components/ui/MenuBar.jsx"

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

  //create value for Virtual Viewport
  const { width, height, visualViewportHeight, visualViewportWidth } = useWindowDimensions();
  
  useEffect(() => { console.log(height, visualViewportHeight ) }, [height, visualViewportHeight]);


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
      <div
        className="sm:ecfw-relative
        ecfw-w-full"
      >

        <div className="ecfw-overflow-auto ecfw-rounded-md
          ecfw-border-slate-300 ecfw-border ecfw-m-4
          
        ">
          <Menubar>
            <MenubarMenu>
              <BoldButton />
              <ItalicButton />
              <CodeButton />
              <LinkButton />
              <MenubarTrigger>Type...</MenubarTrigger>
              <MenubarContent>
                <MenubarSub>
                  <MenubarSubTrigger>Heading</MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarItem><HeaderButton level={1} /></MenubarItem>
                    <MenubarItem><HeaderButton level={2} /></MenubarItem>
                    <MenubarItem><HeaderButton level={3} /></MenubarItem>
                    <MenubarItem><HeaderButton level={4} /></MenubarItem>
                    <MenubarItem><HeaderButton level={5} /></MenubarItem>
                    <MenubarItem><HeaderButton level={6} /></MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
                  <MenubarItem><ParagraphButton /></MenubarItem>
                  <MenubarItem>Code block</MenubarItem>
              </MenubarContent>
              <UndoButton />
              <RedoButton />
              <HorizontalRuleButton />
              <BulletListButton />
              <OrderedListButton />
              <BlockquoteButton />
              <LiftButton /> 
            </MenubarMenu>
          </Menubar>
        </div>
      </div>

      <div ref={setMount} className="ecfw-prosemirror ecfw-h-full ecfw-m-4 ecfw-outline-none"
      style={{
        minHeight: '70vh'
      }} />
    </ProseMirror>
  );
}

