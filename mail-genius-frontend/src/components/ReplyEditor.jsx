import React, { useState, useEffect, useCallback } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode, ListNode, ListItemNode
} from '@lexical/list';
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND, // For alignment
  KEY_DOWN_COMMAND,
  COMMAND_PRIORITY_LOW,
  $getRoot,
  $createParagraphNode,
  $createTextNode,
} from 'lexical';
import '@/styles/editor.scss';
import { Button } from './ui/button';
// Import new icons
import { Send, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Sparkles, SpellCheck } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

// Toolbar Plugin as an arrow function
const ToolbarPlugin = ({ onMagicReply, onRefineClick }) => {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  // Add state for list types
  const [isUl, setIsUl] = useState(false);
  const [isOl, setIsOl] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Text formatting
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));

      // List formatting
      const anchorNode = selection.anchor.getNode();
      const parent = anchorNode.getParent();
      const listNode = $isListNode(parent) ? parent : ($isListNode(anchorNode) ? anchorNode : null);

      if (listNode) {
        setIsUl(listNode.getTag() === 'ul');
        setIsOl(listNode.getTag() === 'ol');
      } else {
        setIsUl(false);
        setIsOl(false);
      }
    }
  }, [editor]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  const formatBulletList = () => {
    if (isUl) {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    }
  };

  const formatNumberedList = () => {
    if (isOl) {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    }
  };

  return (
    <div className="toolbar">
      {/* --- Text Format Buttons --- */}
      <button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')} className={isBold ? 'active' : ''} aria-label="Format Bold">
        <b>B</b>
      </button>
      <button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')} className={isItalic ? 'active' : ''} aria-label="Format Italic">
        <i>I</i>
      </button>
      <span className="divider" />
      {/* --- List Buttons --- */}
      <button onClick={formatBulletList} className={isUl ? 'active' : ''} aria-label="Bulleted List">
        <List className="h-4 w-4" />
      </button>
      <button onClick={formatNumberedList} className={isOl ? 'active' : ''} aria-label="Numbered List">
        <ListOrdered className="h-4 w-4" />
      </button>
      <span className="divider" />
      {/* --- Alignment Buttons --- */}
      <button onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')} aria-label="Align Left">
        <AlignLeft className="h-4 w-4" />
      </button>
      <button onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')} aria-label="Align Center">
        <AlignCenter className="h-4 w-4" />
      </button>
      <button onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')} aria-label="Align Right">
        <AlignRight className="h-4 w-4" />
      </button>
      <span className="divider" />
      {/* --- Other Buttons --- */}

      <Button variant="secondary" size="sm" onClick={() => onMagicReply(editor)} className="">
        <Sparkles className="h-4 w-4 mr-1" />
        <span className='bg-gradient-to-l from-indigo-500 via-red-500 to-blue-500 text-transparent bg-clip-text'>Magic Reply</span>
      </Button>
      <Button variant="outline" size="sm" onClick={() => onRefineClick(editor)} className="">
        <SpellCheck className="h-4 w-4 mr-1" />
        <span className='bg-gradient-to-l from-indigo-500 via-red-500 to-blue-500 text-transparent bg-clip-text'>AI Refine</span>
      </Button>
    </div>
  );
};

// Keybind Plugin (no changes needed)
const SendWithKeybindPlugin = ({ onSend }) => {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerCommand(
      KEY_DOWN_COMMAND,
      (event) => {
        if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
          event.preventDefault();
          onSend(editor.getEditorState());
          return true;
        }
        return false;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [editor, onSend]);
  return null;
};

// Actions Plugin (no changes needed)
const ActionsPlugin = ({ onSend, onCancel, hasContent }) => {
  const [editor] = useLexicalComposerContext();
  const handleSendClick = () => {
    onSend(editor.getEditorState());
  };
  return (
    <div className="editor-footer">
      <div className="tip">Tip: Use Ctrl+Enter (or Cmd+Enter) to send quickly</div>
      <div className="actions">
        <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
        <Button size="sm" onClick={handleSendClick} disabled={!hasContent} className="hover:bg-blue-700">
          <Send className="h-4 w-4 mr-1" />
          Send
        </Button>
      </div>
    </div>
  );
};

// Plugin to set initial content
const SetInitialContentPlugin = ({ initialContent }) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (initialContent) {
      editor.update(() => {
        const root = $getRoot();
        root.clear();
        const paragraph = $createParagraphNode();
        paragraph.append($createTextNode(initialContent));
        root.append(paragraph);
      });
    }
  }, [editor, initialContent]);

  return null;
};

// Main Editor Component
const RichTextEditor = ({ onSend, onCancel, onMagicReply, onRefineClick, initialContent, isGenerating }) => {
  const [hasContent, setHasContent] = useState(false);
  const initialConfig = {
    namespace: 'MyRichTextEditor',
    onError: (error) => { throw error; },
    // Register the list nodes
    nodes: [ListNode, ListItemNode],
  };

  const handleSend = (editorState) => {
    if (hasContent) {
      console.log("Sending content...");
      onSend(editorState);
    }
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-shell">
        <ToolbarPlugin onMagicReply={onMagicReply} onRefineClick={onRefineClick} />
        <div className="editor-container overflow-y-auto max-h-40">
          {isGenerating ? (
            <div className="p-4">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <RichTextPlugin
              contentEditable={<ContentEditable className="editor-input" />}
              placeholder={<div className="editor-placeholder">Type your reply...</div>}
            />
          )}
          <HistoryPlugin />
          {/* Add the ListPlugin */}
          <ListPlugin />
          <OnChangePlugin onChange={(editorState) => {
            editorState.read(() => {
              const root = $getRoot();
              const textContent = root.getTextContent();
              setHasContent(textContent.trim() !== '');
            });
          }} />
          <SendWithKeybindPlugin onSend={handleSend} />
          <SetInitialContentPlugin initialContent={initialContent} />
        </div>
        <ActionsPlugin onSend={handleSend} onCancel={onCancel} hasContent={hasContent} />
      </div>
    </LexicalComposer>
  );
};

export default RichTextEditor;
