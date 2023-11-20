import { $isLinkNode, AutoLinkNode, LinkNode } from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodeToNearestRoot, mergeRegister } from '@lexical/utils';
import { $getNodeByKey, $getSelection, COMMAND_PRIORITY_EDITOR, createCommand } from 'lexical';
import { useCallback, useEffect } from 'react';

import { $createTweetNode, TweetNode } from '../nodes/TweetNode';

export const INSERT_TWEET_COMMAND = createCommand(
  'INSERT_TWEET_COMMAND',
);

export default function TwitterPlugin() {
  const [editor] = useLexicalComposerContext();

  const parse = (text) => {
    const match =
      /^https:\/\/(twitter|x)\.com\/(#!\/)?(\w+)\/status(es)*\/(\d+)/.exec(
        text,
      );

    if (match != null) {
      return {
        id: match[5],
        url: match[1],
      };
    }

    return null;
  }

  useEffect(() => {
    if (!editor.hasNodes([TweetNode])) {
      throw new Error('TwitterPlugin: TweetNode not registered on editor');
    }

    return editor.registerCommand(
      INSERT_TWEET_COMMAND,
      (payload) => {
        const tweetNode = $createTweetNode(payload);
        $insertNodeToNearestRoot(tweetNode);

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  const embedIfLinkNodeIsTwitterLink = useCallback(key => {
    editor.getEditorState().read(async () => {
      const linkNode = $getNodeByKey(key);

      if ($isLinkNode(linkNode)) {
        const result = parse(linkNode.__url);
        if(result != null) {
            editor.update(() => {
                if(!$getSelection()) {
                    linkNode.selectEnd();
                }

                editor.dispatchCommand(INSERT_TWEET_COMMAND, result.id);
            })
        }
      }
    });
  }, [editor]);

  useEffect(() => {
    const listener = (nodeMutations, {
      updateTags,
      dirtyLeaves
    }) => {
      for (const [key, mutation] of nodeMutations) {
        if (mutation === 'created' && updateTags.has('paste') && dirtyLeaves.size <= 3) {
          embedIfLinkNodeIsTwitterLink(key);
        }
      }
    };

    return mergeRegister(...[LinkNode, AutoLinkNode].map(Klass => editor.registerMutationListener(Klass, (...args) => listener(...args))));
  }, [editor]);

  return null;
}