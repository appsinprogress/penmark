// TODO: [X] fix the headers (not working)
// TOOD: [X] fix the selection changing when you click on buttons
// TODO: [X] fix some keymaps to buttons (like bold, italic, etc)
// TODO: [X] HR not being inserted
// TODO: [X] styling for lists & others
// TODO: [X] image insertion
// TODO: [X] fix date & filename
// TODO: [X] handle save, cancel, and delete, etc.
// TODO: [X] handle publish
// TODO: [X] improve the editing experience
// TODO: [X] pressing enter in a bullet list should create a new bullet (same for numbers)
// TODO: [X] show the buttons conditionally based on whether they can be acted upon
// TODO: [X] switch the markdown and wysiwyg button
// TODO: [X] improvements to modal & editing
// TODO: [X] saving modal to indicate progress of saving to github
// TODO: [X] loading modal to indicate that we are pulling the assets
// TODO: [X] fix image to avoid conflicts in repo (check before trying to save)
// TODO: [X] show confirmation when user deletes 
// TODO: [X] do not show confirmation when the user leaves but there have been no changes
// TODO: [X] handle back for new posts
// TODO: [X] hijack the backbutton
// TODO: [X] templates (for jekyll for instance)
// TODO: [X] investigate why publish is not working
// TODO: [X] add to edit existing drafts

// TODO: [X] cleanup
// TODO: [ ] deploy & package the npm package

// TODO: [ ] testing
// TODO: [ ] parametrize and make usable by all
// TODO: [ ] create repos & landing page


// TODO: [ ] Post launch
// TODO: [ ] Add react router to load the modal to handle back and forward with proper navigation history
// TODO: [ ] improve 

import { EditorState } from "prosemirror-state";
import { splitListItem } from "prosemirror-schema-list";
import React, { useEffect, useState, useRef } from "react";
import { ProseMirror } from "@nytimes/react-prosemirror";
import {
  BoldButton, ItalicButton, ImageInsertButton, CodeButton, LinkButton, HorizontalRuleButton, HeaderButton,
  CodeBlockButton, UndoButton, RedoButton, BulletListButton, OrderedListButton,
  BlockquoteButton, LiftButton, ParagraphButton, HeadingTriggerButton
} from "../buttons/CustomEditorButtons.jsx";
import { schema, defaultMarkdownParser, defaultMarkdownSerializer } from "prosemirror-markdown"
import { undo, redo, history } from "prosemirror-history"
import { keymap } from "prosemirror-keymap"
import { baseKeymap } from "prosemirror-commands"
import { dropCursor } from "prosemirror-dropcursor"
import { gapCursor } from "prosemirror-gapcursor"
import { buildKeymap } from "prosemirror-example-setup";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
} from "../../lib/ui/MenuBar.jsx"
import { Heading } from "lucide-react";
import { base64ToBlobUrl } from "../../helpers/imageParsingHelpers.js";

const defaultMarkdownKeymap = buildKeymap(schema, {});
const customKeymap = {
  "Enter": splitListItem(schema.nodes.list_item),
}

const plugins = [
  history(),
  keymap(customKeymap),
  keymap(defaultMarkdownKeymap),
  keymap(baseKeymap),
  dropCursor(),
  gapCursor(),
]

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


  const { keyboardHeight, virtualKeyboardSupported } = useKeyboardDimensions();

  //when the value of the editor changes, update the content ref (ref prevents rerendering)
  //content ref value is used to update the content in the parent component (used to pass the content to markdown editor)
  useEffect(() => {
    if (mount) {
      //set content ref value to a markdown serializer with tightlists
      const serializedValue = defaultMarkdownSerializer.serialize(editorState.doc, {
        tightLists: true
      })

      setContentRefValue(serializedValue)
    }
  }, [mount, editorState, setContentRefValue])

  //when the component mounts or the content changes, update the editor state
  useEffect(() => {
    if (mount) {
      setEditorState(EditorState.create({
        schema: schema,
        plugins: plugins,
        doc: defaultMarkdownParser.parse(content)
      }))
    }
  }, [mount, content]);

  function isImagePasted(transaction) {
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
          for (let node of nodes) {
            if (node.type.name === 'image' && node.attrs.src.startsWith('data')) {
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
    return [false,]; // No image paste detected
  };

  function handleDispatchTransaction(tr) {
    const [hasImage, node] = isImagePasted(tr);
    if (hasImage) { 
      //when an image is pasted into the text editor, prosemirror converts the image to base64
      //to properly handle this image as a separate file, we convert the base64 to a blob url
      //we must then replace the base64 references with the blob url
      const url = base64ToBlobUrl(node.attrs.src.split(',')[1]);

      //insert image by changing the node.attrs.src to the blob url
      tr.steps[0].slice.content.content[0].attrs.src = url;
      setEditorState((s) => s.apply(tr));
    }
    else {
      setEditorState((s) => s.apply(tr));

    }
  }

  return (
    <ProseMirror
      mount={mount}
      state={editorState}
      dispatchTransaction={handleDispatchTransaction}
    >
      <div
        className="ecfw-w-full"
        style={virtualKeyboardSupported ?{
          position: 'fixed',
          bottom: keyboardHeight,
          maxWidth: 1040,
          paddingRight: '1em'
        } : {}}
      >
        <div className="ecfw-overflow-auto ecfw-rounded-md
          ecfw-border-slate-300 ecfw-bg-white ecfw-border ecfw-m-4">
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>
                <HeadingTriggerButton />
              </MenubarTrigger>
              <MenubarContent>
                <MenubarSub>
                  <MenubarSubTrigger>Heading</MenubarSubTrigger>
                  <MenubarSubContent>
                    <HeaderButton level={1} />
                    <HeaderButton level={2} />
                    <HeaderButton level={3} />
                    <HeaderButton level={4} />
                    <HeaderButton level={5} />
                    <HeaderButton level={6} />
                  </MenubarSubContent>
                </MenubarSub>
                <ParagraphButton />
                <CodeBlockButton />
              </MenubarContent>
              <BoldButton />
              <ItalicButton />
              <CodeButton />
              <LinkButton />
              <ImageInsertButton />
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
        data-testid="prosemirror-editor"
        style={{
          minHeight: '70vh',
          paddingBottom: virtualKeyboardSupported ? keyboardHeight + 100 : 0,
        }} />
    </ProseMirror>
  );
}


const useKeyboardDimensions = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  let virtualKeyboardSupported = true;

  if (!('virtualKeyboard' in navigator)) {
    virtualKeyboardSupported = false;
    return { keyboardHeight, virtualKeyboardSupported };
  }

  navigator.virtualKeyboard.overlaysContent = true;

  useEffect(() => {
    const handleResize = () => {
      setKeyboardHeight(navigator.virtualKeyboard.boundingRect.height);
    };

    navigator.virtualKeyboard.addEventListener('geometrychange', handleResize);

    return () => {
      navigator.virtualKeyboard.removeEventListener('geometrychange', handleResize);
    };
  }, []);

  return { keyboardHeight, virtualKeyboardSupported };
};
