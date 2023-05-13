// TODO: [X] fix the headers (not working)
// TOOD: [X] fix the selection changing when you click on buttons
// TODO: [X] fix some keymaps to buttons (like bold, italic, etc)
// TODO: [X] HR not being inserted
// TODO: [X] styling for lists & others
// TODO: [X] image insertion :(
// TODO: [X] fix date & filename
// TODO: [X] handle save, cancel, and delete, etc.
// TODO: [X] handle publish
// TODO: [ ] improve the editing experience
  // TODO: [X] pressing enter in a bullet list should create a new bullet (same for numbers)
  // TODO: [ ] show the buttons conditionally based on whether they can be acted upon
  // TODO: [ ] switch the markdown and wysiwyg button
// TODO: [ ] improvements to modal & editing
  // TODO: [ ] saving modal to indicate progress of saving to github
  // TODO: [ ] loading modal to indicate that we are pulling the assets
  // TODO: [ ] fix image to avoid conflicts in repo (check before trying to save)


import { EditorState } from "prosemirror-state";
// import { schema } from "prosemirror-schema-basic";
import { splitListItem } from "prosemirror-schema-list";
import React, { useEffect, useState } from "react";
import { ProseMirror } from "@nytimes/react-prosemirror";
import { BoldButton, ItalicButton, ImageInsertButton, CodeButton, LinkButton, HorizontalRuleButton, HeaderButton,
    CodeBlockButton, UndoButton, RedoButton, BulletListButton, OrderedListButton, 
    BlockquoteButton, LiftButton, ParagraphButton, InsertImage, base64ToBlobUrl } from "./CustomButtons.jsx";
import { schema, defaultMarkdownParser, defaultMarkdownSerializer, MarkdownSerializerState } from "prosemirror-markdown"
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

const customKeymaps2 = {
  "Enter": splitListItem(schema.nodes.list_item),
}

const customKeymaps = buildKeymap(schema, {});

const plugins = [
  history(),
  keymap(customKeymaps2),
  keymap(customKeymaps),
  keymap(baseKeymap),
  dropCursor(),
  gapCursor(),
]

// //create a serializer with tight lists
// const serializer = defaultMarkdownSerializer.configure({
//   tightLists: true
// })

// const serializer = defaultMarkdownSerializer.from(serializerState);

export function ProseMirrorEditor({
    content,
    setContentRefValue//need to avoid rerenders for prosemirror
}) {
  const [mount, setMount] = useState();
  const [editorState, setEditorState] = useState(
    EditorState.create({
        schema: schema,
        plugins: plugins,
        doc: defaultMarkdownParser.parse(content, {
          tightLists: true
        })
      })
    );

  // //create value for Virtual Viewport
  // const { width, height, visualViewportHeight, visualViewportWidth } = useWindowDimensions();
  
  // useEffect(() => { console.log(height, visualViewportHeight ) }, [height, visualViewportHeight]);

  useEffect(() => {
    console.log('updated the value of the text')
    if(mount){
      //set content ref value to a markdown serializer with tightlists

      const serializedValue = defaultMarkdownSerializer.serialize(editorState.doc, {
        tightLists: true
      })

      console.log(serializedValue)

      setContentRefValue(serializedValue)
    }
  }, [mount, editorState, setContentRefValue])

  useEffect(() => {
    if(mount){
        setEditorState(EditorState.create({
            schema: schema,
            plugins: plugins,
            doc: defaultMarkdownParser.parse(content)
        }))
    }
  }, [mount, content]);

  console.log(content)

  console.log('rendering')


  const isImagePasted = (transaction) => {
    for (let i = 0; i < transaction.steps.length; i++) {
      const step = transaction.steps[i];
      
      if (step.slice) {
        // Check if the slice's content is a Fragment
        const content = step.slice.content.content;
        const nodes = Array.isArray(content) ? content : [];

        if (nodes.length > 0) {
          //iterate through nodes and return the value of the content
          let hasImage = false;
          let nodeToReturn = null;
          for(let node of nodes){
            if(node.type.name === 'image' && node.attrs.src.startsWith('data')){
              hasImage = true;
              nodeToReturn = node;
              break
            }
          }

          if (hasImage) {
            return [hasImage, nodeToReturn]; // Image paste detected
          }
        }
      }
    }
    return [false, ]; // No image paste detected
  };

  return (
    <ProseMirror
      mount={mount}
      state={editorState}
      dispatchTransaction={(tr) => {
        const [hasImage, node] = isImagePasted(tr);
        if(hasImage){
          console.log('image pasted')
          console.log(node)

          const url = base64ToBlobUrl(node.attrs.src.split(',')[1]);

          //insert image by changing the node.attrs.src to the blob url
          tr.steps[0].slice.content.content[0].attrs.src = url;
          setEditorState((s) => s.apply(tr));
        }
        else{
          console.log('no image pasted')
          setEditorState((s) => s.apply(tr));

        }
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
              <ImageInsertButton />
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
                  <MenubarItem><CodeBlockButton /></MenubarItem>
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

