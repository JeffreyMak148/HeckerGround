import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $wrapNodeInElement, mergeRegister } from '@lexical/utils';
import {
  $createParagraphNode,
  $createRangeSelection,
  $getSelection,
  $insertNodes,
  $isNodeSelection,
  $isRootOrShadowRoot,
  $setSelection,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  DRAGOVER_COMMAND,
  DRAGSTART_COMMAND,
  DROP_COMMAND,
  createCommand
} from 'lexical';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { CAN_USE_DOM } from '../utils/canUseDOM';

import { useLoading } from '../../Context/LoadingProvider';
import { useModal } from '../../Context/ModalProvider';
import { useUser } from '../../Context/UserProvider';
import fetchUtil from '../../util/fetchUtil';
import {
  $createImageNode,
  $isImageNode,
  ImageNode
} from '../nodes/ImageNode';
import Button from '../ui/Button';
import FileInput from '../ui/FileInput';
import TextInput from '../ui/TextInput';

const getDOMSelection = (targetWindow) =>
  CAN_USE_DOM ? (targetWindow || window).getSelection() : null;

export const INSERT_IMAGE_COMMAND =
  createCommand('INSERT_IMAGE_COMMAND');

export function InsertImageDialog({
  activeEditor,
  handleClose
}) {

  const ACCEPTABLE_IMAGE_TYPES = [
    'image/',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/heic',
    'image/heif',
    'image/gif',
    'image/webp',
  ];

  const [tempUrlSrc, setTempUrlSrc] = useState('');
  const [urlSrc, setUrlSrc] = useState(null);
  const [uploadSrc, setUploadSrc] = useState(null);
  const [imageBlobUrl, setImageBlobUrl] = useState(null);
  const [validUploadInput, setValidUploadInput] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [show, setShow] = useState(true);
  const loading = useLoading();
  const modal = useModal();
  const user = useUser();

  function uploadImage(imageFile) {
    let formData = new FormData();
    formData.append("file", imageFile);

    loading.setBackgroundLoading(true);
    fetchUtil(`/api/file`, formData, "POST", true)
    .then(({status, currentUser, data}) => {
      user.setCurrentUser(currentUser);
      if(!!imageBlobUrl) {
        URL.revokeObjectURL(imageBlobUrl);
      }
      const filename = data;
      setUploadSrc(filename);
    })
    .catch(error => {
      modal.showErrorPopup(error.status, error.data?.errorMessage);
    })
    .finally(() => {
      loading.setBackgroundLoading(false);
    })
  }

  const loadImage = (files) => {

    if(!files) {
      setImageBlobUrl(null);
      setImageFile(null);
      setUploadSrc(null);
      setValidUploadInput(false);
    } else if(files.length > 0 && !ACCEPTABLE_IMAGE_TYPES.includes(files[0]?.type)) {
      modal.showPopup("Error", "Accepts only image file types");
      setValidUploadInput(false);
      return false;
    }
    
    const imageFile = files[0];
    const blobUrl = URL.createObjectURL(imageFile);
    setImageBlobUrl(blobUrl);
    setImageFile(files[0]);
    setValidUploadInput(true);
  };

  const hasModifier = useRef(false);

  useEffect(() => {
    hasModifier.current = false;
    const handler = (e) => {
      hasModifier.current = e.altKey;
    };
    document.addEventListener('keydown', handler);
    return () => {
      document.removeEventListener('keydown', handler);
    };
  }, [activeEditor]);

  const onClick = () => {
    // validate input
    if(!(!!tempUrlSrc || validUploadInput)) {
      modal.showPopup("Error", "Please enter image url or upload image");
      return false;
    }
    if(!!imageFile) {
      // If both image url and image file is provided, upload image file
      uploadImage(imageFile);
    } else {
      setUrlSrc(tempUrlSrc);
    }

  };

  useEffect(() => {
    if(!!uploadSrc) {
      const payload = {
        altText: imageFile.name,
        src: uploadSrc
      };
      setShow(false);
      handleClose();
      activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
      return;
    }

    if(!!urlSrc) {
      let checkedUrlSrc = urlSrc;
      if(!(checkedUrlSrc.startsWith("https://") || checkedUrlSrc.startsWith("http://"))) {
        checkedUrlSrc = "https://" + checkedUrlSrc;
      }

      const payload = {
        altText: "Online Image",
        src: checkedUrlSrc
      };
      setShow(false);
      handleClose();
      activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
      return;
    }
  }, [uploadSrc, urlSrc]);

  return (
    <>
      {show && <div className="insert-image-wrapper">
        <div>
          <TextInput
            label="Image URL"
            placeholder="https://source.unsplash.com/random"
            onChange={setTempUrlSrc}
            value={tempUrlSrc}
            data-test-id="image-modal-url-input"
            labelClassName="insert-image-label"
            inputClassName="insert-image-input"
            disabled={validUploadInput}
          />
        </div>
        <div>
          <FileInput
            label="Image Upload"
            labelClassName="insert-image-label"
            inputClassName="insert-image-input"
            inputImage={imageBlobUrl}
            onChange={loadImage}
            accept="image/*"
            data-test-id="image-modal-file-upload"
          />
        </div>
        <div className="flex-display">
          <Button
              data-test-id="image-modal-confirm-btn"
              className="image-confirm-button"
              onClick={() => onClick()}>
              Confirm
          </Button>
          <Button 
              data-test-id="image-modal-clear-btn" 
              className="image-clear-button"
              onClick={() => loadImage(null)}>
                Clear
          </Button>
        </div>
      </div>}
    </>
  );
}

export default function ImagesPlugin({
  captionsEnabled,
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error('ImagesPlugin: ImageNode not registered on editor');
    }

    return mergeRegister(
      editor.registerCommand(
        INSERT_IMAGE_COMMAND,
        (payload) => {
          const imageNode = $createImageNode(payload);
          $insertNodes([imageNode]);
          if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
            $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
          }

          return true;

        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand(
        DRAGSTART_COMMAND,
        (event) => {
          return onDragStart(event);
        },
        COMMAND_PRIORITY_HIGH,
      ),
      editor.registerCommand(
        DRAGOVER_COMMAND,
        (event) => {
          return onDragover(event);
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        DROP_COMMAND,
        (event) => {
          return onDrop(event, editor);
        },
        COMMAND_PRIORITY_HIGH,
      ),
    );
  }, [captionsEnabled, editor]);

  return null;
}

const TRANSPARENT_IMAGE =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
const img = document.createElement('img');
img.src = TRANSPARENT_IMAGE;

function onDragStart(event) {
  
  const node = getImageNodeInSelection();
  if (!node) {
    return false;
  }
  const dataTransfer = event.dataTransfer;
  if (!dataTransfer) {
    return false;
  }
  dataTransfer.setData('text/plain', '_');
  dataTransfer.setDragImage(img, 0, 0);
  dataTransfer.setData(
    'application/x-lexical-drag',
    JSON.stringify({
      data: {
        altText: node.__altText,
        caption: node.__caption,
        height: node.__height,
        key: node.getKey(),
        maxWidth: node.__maxWidth,
        showCaption: node.__showCaption,
        src: node.__src,
        width: node.__width,
      },
      type: 'image',
    }),
  );

  return true;
}

function onDragover(event) {
  
  const node = getImageNodeInSelection();
  if (!node) {
    return false;
  }
  if (!canDropImage(event)) {
    event.preventDefault();
  }
  return true;
}

function onDrop(event, editor) {
  
  const node = getImageNodeInSelection();
  if (!node) {
    return false;
  }
  const data = getDragImageData(event);
  if (!data) {
    return false;
  }
  event.preventDefault();
  if (canDropImage(event)) {
    const range = getDragSelection(event);
    node.remove();
    const rangeSelection = $createRangeSelection();
    if (range !== null && range !== undefined) {
      rangeSelection.applyDOMRange(range);
    }
    $setSelection(rangeSelection);
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, data);
  }
  return true;
}

function getImageNodeInSelection() {
  const selection = $getSelection();
  if (!$isNodeSelection(selection)) {
    return null;
  }
  const nodes = selection.getNodes();
  const node = nodes[0];
  return $isImageNode(node) ? node : null;
}

function getDragImageData(event) {
  
  const dragData = event.dataTransfer?.getData('application/x-lexical-drag');
  if (!dragData) {
    return null;
  }
  const {type, data} = JSON.parse(dragData);
  if (type !== 'image') {
    return null;
  }

  return data;
}

function canDropImage(event) {
  
  const target = event.target;
  return !!(
    target &&
    target instanceof HTMLElement &&
    !target.closest('code, span.editor-image') &&
    target.parentElement &&
    target.parentElement.closest('div.ContentEditable__root')
  );
}

function getDragSelection(event) {
  let range;
  const target = event.target;
  const targetWindow =
    target == null
      ? null
      : target.nodeType === 9
      ? target.defaultView
      : target.ownerDocument.defaultView;
  const domSelection = getDOMSelection(targetWindow);
  if (document.caretRangeFromPoint) {
    range = document.caretRangeFromPoint(event.clientX, event.clientY);
  } else if (event.rangeParent && domSelection !== null) {
    domSelection.collapse(event.rangeParent, event.rangeOffset || 0);
    range = domSelection.getRangeAt(0);
  } else {
    throw Error(`Cannot get the selection when dragging`);
  }

  return range;
}