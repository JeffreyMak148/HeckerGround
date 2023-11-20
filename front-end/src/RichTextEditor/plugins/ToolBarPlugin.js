import {
    $createCodeNode
} from "@lexical/code";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
    $isListNode,
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    ListNode,
    REMOVE_LIST_COMMAND
} from "@lexical/list";
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    $createQuoteNode,
    $isHeadingNode
} from "@lexical/rich-text";
import {
    $getSelectionStyleValueForProperty,
    $isAtNodeEnd,
    $patchStyleText,
    $wrapNodes
} from "@lexical/selection";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import {
    $createParagraphNode,
    $getSelection,
    $isRangeSelection,
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    DEPRECATED_$isGridSelection,
    FORMAT_ELEMENT_COMMAND,
    FORMAT_TEXT_COMMAND,
    REDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    UNDO_COMMAND
} from 'lexical';
import React, { useCallback, useEffect, useState } from 'react';
import { AiOutlineAlignCenter, AiOutlineAlignLeft, AiOutlineAlignRight, AiOutlineBold, AiOutlineItalic, AiOutlineOrderedList, AiOutlineRedo, AiOutlineStrikethrough, AiOutlineUnderline, AiOutlineUndo, AiOutlineUnorderedList } from 'react-icons/ai';
import { BsCodeSlash } from 'react-icons/bs';
import { GoQuote } from 'react-icons/go';
import { Tooltip } from 'react-tooltip';
import DropDown, { DropDownItem } from "../ui/DropDown";
import "../ui/DropDown.css";
import DropdownColorPicker from "../ui/DropDownColorPicker";
import { InsertImageDialog } from "./ImagePlugin";
import "./plugin.css";

const FONT_SIZE_OPTIONS = [
    ['10px', '10px'],
    ['12px', '12px'],
    ['14px', '14px'],
    ['16px', '16px'],
    ['18px', '18px'],
    ['20px', '20px'],
    ['22px', '22px'],
    ['24px', '24px'],
    ['26px', '26px'],
    ['28px', '28px'],
    ['30px', '30px'],
];

function FontDropDown({
    editor,
    value,
    style,
    disabled = false,
  }) {
    const handleClick = useCallback(
      (option) => {
        editor.update(() => {
          const selection = $getSelection();
          if (
            $isRangeSelection(selection) ||
            DEPRECATED_$isGridSelection(selection)
          ) {
            $patchStyleText(selection, {
              [style]: option,
            });
          }
        });
      },
      [editor, style],
    );
  
    return (
      <DropDown
        disabled={disabled}
        buttonClassName={'toolbar-item auto ' + style}
        buttonLabel={value}
        buttonIconClassName={''}
        buttonAriaLabel={'Formatting options for font size'}>
        {(FONT_SIZE_OPTIONS).map(
          ([option, text]) => (
            <DropDownItem
              className={`item ${dropDownActiveClass(value === option)} ${
                style === 'font-size' ? 'fontsize-item' : ''
              }`}
              onClick={() => handleClick(option)}
              key={option}>
              <span className="text">{text}</span>
            </DropDownItem>
          ),
        )}
      </DropDown>
    );
}

function dropDownActiveClass(active) {
    if (active) return 'active dropdown-item-active';
    else return '';
}

const ToolBarPlugin = () => {

    const LowPriority = 1;

    const [editor] = useLexicalComposerContext();
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [fontSize, setFontSize] = useState("16px");
    const [fontColor, setFontColor] = useState("#e8e8e8");
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);
    const [isLink, setIsLink] = useState(false);
    const [blockType, setBlockType] = useState("paragraph");

    const updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if($isRangeSelection(selection)) {
            const anchorNode = selection.anchor.getNode();
            const element = 
                anchorNode.getKey() === "root"
                    ? anchorNode
                    : anchorNode.getTopLevelElementOrThrow();
            const elementKey = element.getKey();
            const elementDOM = editor.getElementByKey(elementKey);
            if(elementDOM !== null) {
                if($isListNode(element)) {
                    const parentList = $getNearestNodeOfType(anchorNode, ListNode);
                    const type = parentList ? parentList.getTag() : element.getTag();
                    setBlockType(type);
                } else {
                    const type = $isHeadingNode(element)
                        ? element.getTag()
                        : element.getType();
                    setBlockType(type);
                }
            }

            setFontSize(
                $getSelectionStyleValueForProperty(selection, 'font-size', '16px'),
            );
            setFontColor(
                $getSelectionStyleValueForProperty(selection, 'color', '#e8e8e8'),
            );
            setIsBold(selection.hasFormat("bold"));
            setIsItalic(selection.hasFormat("italic"));
            setIsUnderline(selection.hasFormat("underline"));
            setIsStrikethrough(selection.hasFormat("strikethrough"));

            const node = getSelectedNode(selection);
            const parent = node.getParent();
            if ($isLinkNode(parent) || $isLinkNode(node)) {
                setIsLink(true);
            } else {
                setIsLink(false);
            }
        }
    }, [editor]);

    function getSelectedNode(selection) {
        const anchor = selection.anchor;
        const focus = selection.focus;
        const anchorNode = selection.anchor.getNode();
        const focusNode = selection.focus.getNode();
        if (anchorNode === focusNode) {
            return anchorNode;
        }
        const isBackward = selection.isBackward();
        if (isBackward) {
            return $isAtNodeEnd(focus) ? anchorNode : focusNode;
        } else {
            return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
        }
    }

    const applyStyleText = useCallback(
        (styles) => {
          editor.update(() => {
            const selection = $getSelection();
            if (
              $isRangeSelection(selection) ||
              DEPRECATED_$isGridSelection(selection)
            ) {
              $patchStyleText(selection, styles);
            }
          });
        },
        [editor],
    );

    const onFontColorSelect = useCallback(
        (value) => {
          applyStyleText({color: value});
        },
        [applyStyleText],
    );

    const formatParagraph = () => {
        if (blockType !== "paragraph") {
          editor.update(() => {
            const selection = $getSelection();
    
            if ($isRangeSelection(selection)) {
              $wrapNodes(selection, () => $createParagraphNode());
            }
          });
        }
    };

    const formatOrderedList = () => {
        if(blockType !== "ol") {
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND);
        } else {
            editor.dispatchCommand(REMOVE_LIST_COMMAND);
        }
    }

    const formatUnorderedList = () => {
        if(blockType !== "ul") {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND);
        } else {
            editor.dispatchCommand(REMOVE_LIST_COMMAND);
        }
    }

    const formatQuote = () => {
        if (blockType !== "quote") {
          editor.update(() => {
            const selection = $getSelection();
    
            if ($isRangeSelection(selection)) {
              $wrapNodes(selection, () => $createQuoteNode());
            }
          });
        } else {
            formatParagraph();
        }
    };

    const formatCode = () => {
        if (blockType !== "code") {
          editor.update(() => {
            const selection = $getSelection();
    
            if ($isRangeSelection(selection)) {
              $wrapNodes(selection, () => $createCodeNode());
            }
          });
        } else {
            formatParagraph();
        }
    };

    const insertLink = useCallback(() => {
        if(!isLink) {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
        } else {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
        }
    }, [editor, isLink]);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    updateToolbar();
                });
            }),
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                (_payload, newEditor) => {
                    updateToolbar();
                    return false;
                },
                LowPriority
            ),
            editor.registerCommand(
                CAN_UNDO_COMMAND,
                (payload) => {
                    setCanUndo(payload);
                    return false;
                },
                LowPriority
            ),
            editor.registerCommand(
                CAN_REDO_COMMAND,
                (payload) => {
                    setCanRedo(payload);
                    return false;
                },
                LowPriority
            )
        );
    }, [editor, updateToolbar]);

    return (
        <div className="toolbar">
            <div className="toolbar-buttons">
                <button 
                    data-tooltip-id="toolbar-tooltip" 
                    data-tooltip-content="Undo" 
                    data-tooltip-place="top" 
                    title="Undo" 
                    className={`toolbar-item single ${!canUndo ? 'disabled' : ''}`} 
                    disabled={!canUndo} 
                    onClick={() => editor.dispatchCommand(UNDO_COMMAND)}>
                    <AiOutlineUndo />
                </button>
                <button 
                    data-tooltip-id="toolbar-tooltip" 
                    data-tooltip-content="Redo" 
                    data-tooltip-place="top" 
                    title="Redo" 
                    className={`toolbar-item single ${!canRedo ? 'disabled' : ''}`} 
                    disabled={!canRedo} 
                    onClick={() => editor.dispatchCommand(REDO_COMMAND)}>
                    <AiOutlineRedo />
                </button>
                <FontDropDown
                    style={'font-size'}
                    value={fontSize}
                    editor={editor}
                />
                <DropdownColorPicker
                    buttonClassName="toolbar-item auto"
                    buttonAriaLabel="Formatting text color"
                    buttonIconClassName="icon font-color"
                    color={fontColor}
                    onChange={onFontColorSelect}
                    title="text color"
                />
                <button 
                    data-tooltip-id="toolbar-tooltip" 
                    data-tooltip-content="Bold" 
                    data-tooltip-place="top" 
                    title="Bold" 
                    className={`toolbar-item single ${isBold ? 'active' : ''}`} 
                    onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}>
                    <AiOutlineBold />
                </button>
                <button 
                    data-tooltip-id="toolbar-tooltip" 
                    data-tooltip-content="Italic" 
                    data-tooltip-place="top" 
                    title="Italic" 
                    className={`toolbar-item single ${isItalic ? 'active' : ''}`} 
                    onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}>
                    <AiOutlineItalic />
                </button>
                <button 
                    data-tooltip-id="toolbar-tooltip" 
                    data-tooltip-content="Underline" 
                    data-tooltip-place="top" 
                    title="Underline" 
                    className={`toolbar-item single ${isUnderline ? 'active' : ''}`} 
                    onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}>
                    <AiOutlineUnderline />
                </button>
                <button 
                    data-tooltip-id="toolbar-tooltip" 
                    data-tooltip-content="Strikethrough" 
                    data-tooltip-place="top" 
                    title="Strikethrough" 
                    className={`toolbar-item single ${isStrikethrough ? 'active' : ''}`} 
                    onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")}>
                    <AiOutlineStrikethrough />
                </button>
                <DropDown
                    buttonClassName="toolbar-item single"
                    buttonAriaLabel="Insert Image"
                    buttonIconClassName="icon insert-image"
                    dropDownWrapperClassName="insert-image-dropdown"
                    stopCloseOnClickSelf={true}>
                    <InsertImageDialog activeEditor={editor}/>
                    {/* <InsertImageUploadedDialogBody /> */}
                    {/* <DropDownItem
                        onClick={() => {
                            showModal('Insert Image', (onClose) => (
                            <InsertImageDialog
                                onClose={onClose}
                            />
                            ));
                        }}
                        className="item">
                        <i className="icon image" />
                        <span className="text">Image</span>
                    </DropDownItem> */}
                </DropDown>
                <button 
                    data-tooltip-id="toolbar-tooltip" 
                    data-tooltip-content="Ordered list" 
                    data-tooltip-place="top" 
                    title="Ordered list" 
                    className={`toolbar-item single ${blockType === "ol" ? 'active' : ''}`} 
                    onClick={formatOrderedList}>
                    <AiOutlineOrderedList />
                </button>
                <button 
                    data-tooltip-id="toolbar-tooltip" 
                    data-tooltip-content="Unordered list" 
                    data-tooltip-place="top" 
                    title="Unordered list" 
                    className={`toolbar-item single ${blockType === "ul" ? 'active': ''}`} 
                    onClick={formatUnorderedList}>
                    <AiOutlineUnorderedList />
                </button>
                <button 
                    data-tooltip-id="toolbar-tooltip" 
                    data-tooltip-content="Quote" 
                    data-tooltip-place="top" 
                    title="Quote" 
                    className={`toolbar-item single ${blockType === "quote" ? 'active': ''}`} 
                    onClick={formatQuote}>
                    <GoQuote size="1.1em" />
                </button>
                <button 
                    data-tooltip-id="toolbar-tooltip" 
                    data-tooltip-content="Code" 
                    data-tooltip-place="top" 
                    title="Code" 
                    className={`toolbar-item single ${blockType === "code" ? 'active': ''}`} 
                    onClick={formatCode}>
                    <BsCodeSlash />
                </button>
                <button 
                    data-tooltip-id="toolbar-tooltip" 
                    data-tooltip-content="Left align" 
                    data-tooltip-place="top" 
                    title="Left align" 
                    className="toolbar-item single" 
                    onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")}>
                    <AiOutlineAlignLeft />
                </button>
                <button 
                    data-tooltip-id="toolbar-tooltip" 
                    data-tooltip-content="Center align" 
                    data-tooltip-place="top" 
                    title="Center align" 
                    className="toolbar-item single" 
                    onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")}>
                    <AiOutlineAlignCenter />
                </button>
                <button 
                    data-tooltip-id="toolbar-tooltip" 
                    data-tooltip-content="Right align" 
                    data-tooltip-place="top" 
                    title="Right align" 
                    className="toolbar-item single" 
                    onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")}>
                    <AiOutlineAlignRight />
                </button>
            </div>
            <Tooltip id="toolbar-tooltip" className="toolbar-tooltip" />
        </div>
    );
};

export default ToolBarPlugin;