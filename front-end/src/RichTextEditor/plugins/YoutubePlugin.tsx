import { $isLinkNode, AutoLinkNode, LinkNode } from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodeToNearestRoot, mergeRegister } from '@lexical/utils';
import { $getNodeByKey, $getSelection, COMMAND_PRIORITY_EDITOR, LexicalCommand, MutationListener, NodeKey, createCommand } from 'lexical';
import { useCallback, useEffect } from 'react';

import { $createYouTubeNode, YouTubeNode } from '../nodes/YoutubeNode';

export const INSERT_YOUTUBE_COMMAND: LexicalCommand<string> = createCommand(
  'INSERT_YOUTUBE_COMMAND',
);

export default function TwitterPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  const parse = (url: string) => {
    const match =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/.exec(url);

    const id = match ? (match?.[2].length === 11 ? match[2] : null) : null;

    if (id != null) {
      return {
        id,
        url,
      };
    }

    return null;
  }

  useEffect(() => {
    if (!editor.hasNodes([YouTubeNode])) {
      throw new Error('YouTubePlugin: YouTubeNode not registered on editor');
    }

    return editor.registerCommand<string>(
      INSERT_YOUTUBE_COMMAND,
      (payload) => {
        const youTubeNode = $createYouTubeNode(payload);
        $insertNodeToNearestRoot(youTubeNode);

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  const embedIfLinkNodeIsYoutubeLink = useCallback((key: NodeKey) => {
    editor.getEditorState().read(async () => {
      const linkNode = $getNodeByKey(key);

      if ($isLinkNode(linkNode)) {
        const result = parse(linkNode.__url);
        if(result != null) {
            editor.update(() => {
                if(!$getSelection()) {
                    linkNode.selectEnd();
                }

                editor.dispatchCommand(INSERT_YOUTUBE_COMMAND, result.id);
            })
        }
      }
    });
  }, [editor]);

  useEffect(() => {
    const listener: MutationListener = (nodeMutations, {
      updateTags,
      dirtyLeaves
    }) => {
      for (const [key, mutation] of nodeMutations) {
        if (mutation === 'created' && updateTags.has('paste') && dirtyLeaves.size <= 3) {
            embedIfLinkNodeIsYoutubeLink(key);
        }
      }
    };

    return mergeRegister(...[LinkNode, AutoLinkNode].map(Klass => editor.registerMutationListener(Klass, (...args) => listener(...args))));
  }, [editor]);

  return null;
}