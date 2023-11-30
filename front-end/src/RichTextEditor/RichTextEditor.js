import { $generateHtmlFromNodes } from '@lexical/html';
import { $getRoot, $nodesOfType } from 'lexical';
import { useEffect } from 'react';
import "./RichTextEditor.css";
import "./ui/DropDown.css";

import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import {
  $isRootTextContentEmpty
} from "@lexical/text";
import LexicalTheme from './LexicalTheme';
import { ImageNode } from './nodes/ImageNode';
import { TweetNode } from './nodes/TweetNode';
import { YouTubeNode } from './nodes/YoutubeNode';
import { AutoLinkPlugin } from './plugins/AutoLinkPlugin';
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin';
import DragDropPaste from './plugins/DragDropPastePlugin';
import ImagesPlugin from './plugins/ImagePlugin';
import LinkPlugin from './plugins/LinkPlugin';
import ToolBarPlugin from './plugins/ToolBarPlugin';
import TwitterPlugin from './plugins/TwitterPlugin';
import YouTubePlugin from './plugins/YoutubePlugin';

const theme = {
  // Theme styling goes here
  // ...
}

// When the editor changes, you can get notified via the
// LexicalOnChangePlugin!
// function onChange(editorState) {
//   editorState.read(() => {
//     // Read the contents of the EditorState here.
//     const root = $getRoot();
//     const selection = $getSelection();

//     console.log(root, selection);
//   });
// }

// Lexical React plugins are React components, which makes them
// highly composable. Furthermore, you can lazy load plugins if
// desired, so you don't pay the cost for plugins until you
// actually use them.
function MyCustomAutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Focus the editor when the effect fires!
    editor.focus();
  }, [editor]);

  return null;
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error) {
  console.error(error);
}

function RichTextEditor({ 
  setHTML = () => {},
  setText = () => {},
  setImageSrcs = () => {},
  setEmpty = () => {}
  }) {
  const lexicalConfig = {
    namespace: 'MyEditor',
    theme: LexicalTheme,
    onError,
    nodes: [
        HeadingNode,
        ListNode,
        ListItemNode,
        QuoteNode,
        CodeNode,
        CodeHighlightNode,
        TableNode,
        TableCellNode,
        TableRowNode,
        YouTubeNode,
        TweetNode,
        ImageNode,
        {
          replace: AutoLinkNode,
          with: (node) => {
            return new AutoLinkNode(
              node.getURL(),
              { target: "_blank"},
              undefined
            );
          }
        },
        {
          replace: LinkNode,
          with: (node) => {
            return new LinkNode(
              node.getURL(),
              { target: "_blank"},
              undefined
            );
          }
        }
    ]
  };

  const extractImageNodeSrc = (imageNodes) => {
    return imageNodes.map(node => node.__src);
  }

  const onChange = (editorState, editor) => {
    editor.update(() => {
      editorState.read(() => {
            const root = $getRoot();
            setText(root.__cachedText.replace(/(\r\n|\n|\r)/gm, " "));
      });
      const rawHTML = $generateHtmlFromNodes(editor, null);
      setHTML(rawHTML);
      
      setImageSrcs(extractImageNodeSrc($nodesOfType(ImageNode)));
      setEmpty($isRootTextContentEmpty() && extractImageNodeSrc($nodesOfType(ImageNode))?.length <= 0);
    });
  }

  return (
    <LexicalComposer initialConfig={lexicalConfig}>
        <div className="editor-container">
            <ToolBarPlugin />
            <div className="editor-inner">
                <RichTextPlugin
                    contentEditable={<ContentEditable className="editor-input"/>}
                    ErrorBoundary={LexicalErrorBoundary}
                />
                <OnChangePlugin onChange={onChange} />
                <HistoryPlugin />
                <ListPlugin />
                <LinkPlugin />
                <AutoLinkPlugin />
                <YouTubePlugin />
                <TwitterPlugin />
                <ImagesPlugin captionsEnabled={false} />
                <DragDropPaste />
                <CodeHighlightPlugin />
                <MyCustomAutoFocusPlugin />
            </div>
        </div>
    </LexicalComposer>
  );
}

export default RichTextEditor;