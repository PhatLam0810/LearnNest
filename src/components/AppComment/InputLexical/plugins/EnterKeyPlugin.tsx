import React, { useEffect, useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, COMMAND_PRIORITY_HIGH, KEY_ENTER_COMMAND } from 'lexical';
import Image from 'next/image';
import './styles.css';

interface IEnterKeyPlugin {
  handleSendComment: () => void;
}

function EnterKeyPlugin({ handleSendComment }: IEnterKeyPlugin) {
  const [editor] = useLexicalComposerContext();

  const onClearComment = useCallback(() => {
    editor.update(() => {
      const root = $getRoot();

      root.clear();
      editor.focus();
    });
  }, [editor]);

  useEffect(() => {
    const removeCommand = editor.registerCommand(
      KEY_ENTER_COMMAND,
      event => {
        if (event.shiftKey) {
          // Allow Shift + Enter to create a line break
          return false; // Indicate that the command was not handled
        } else {
          // Prevent the default behavior of the Enter key
          event.preventDefault();
          editor.update(() => {
            const root = $getRoot();
            handleSendComment();

            root.clear();
          });

          editor.focus();
          return true; // Indicate that the command was handled
        }
      },
      COMMAND_PRIORITY_HIGH,
    );

    return () => {
      removeCommand();
    };
  }, [editor, handleSendComment]);

  return (
    <div
      className="send-comment-wrapper"
      onClick={() => {
        handleSendComment();
        onClearComment();
      }}>
      <span className="send-icon">Send</span>
    </div>
  );
}

export default EnterKeyPlugin;
