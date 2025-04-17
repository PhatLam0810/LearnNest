import React, { memo, useState } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { realTimeCommentService } from '@services/signalR'; // Giả sử bạn có dịch vụ này
import { Button } from 'antd';
import { EditorState } from 'lexical';

interface EditorProps {
  placeholder?: string;
  onChange?: (editorState: EditorState) => void;
  showToolbar?: boolean;
  className?: string;
  value?: string;
  readOnly?: boolean;
  appendText?: string;
  onClearText?: () => void;
  handleFocus?: (flag: boolean) => void;
  isEditable?: boolean;
  maxLength?: number;
  postId: string; // Truyền postId
  userId: string; // Truyền userId
}

const Editor = ({
  placeholder,
  onChange,
  showToolbar = false,
  className,
  value,
  readOnly = false,
  appendText = '',
  onClearText = () => {},
  handleFocus,
  isEditable = false,
  postId,
  userId,
  maxLength,
}: EditorProps) => {
  const [editorState, setEditorState] = useState<EditorState | null>(null);

  const handleOnChange = (editorState: EditorState) => {
    setEditorState(editorState);
    onChange?.(editorState);
  };

  const handleCommentSend = () => {
    if (editorState) {
      const commentText = editorState.getText(); // Lấy nội dung từ Lexical editor

      if (commentText.trim()) {
        // Gửi comment với postId và userId
        realTimeCommentService.sendComment({
          postId: postId, // Truyền postId vào đây
          commentText: commentText,
          type: 'Lesson',
          userId: userId, // Truyền userId vào đây
        });

        // Reset lại sau khi gửi
        setEditorState(null); // Hoặc xóa nội dung trong editor nếu cần
      }
    }
  };

  const editorConfig = {
    theme: {}, // Thêm theme của bạn tại đây nếu cần
    namespace: 'editor',
    editable: !readOnly,
    onError(error) {
      throw error;
    },
    editorState:
      value ?? '{"root":{"children":[{"children":[],"type":"paragraph"}]}}',
  };

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className={`editor-container ${className || ''}`}>
        <div className="editor-inner">
          <div
            className="input-container"
            onFocus={() => handleFocus?.(true)}
            onBlur={() => handleFocus?.(false)}>
            {isEditable ? (
              <RichTextPlugin
                contentEditable={<ContentEditable className="editor-input" />}
                placeholder={
                  !readOnly ? (
                    <div className="editor-placeholder">
                      {placeholder || 'Write a comment...'}
                    </div>
                  ) : (
                    <></>
                  )
                }
                ErrorBoundary={LexicalErrorBoundary}
              />
            ) : (
              <PlainTextPlugin
                contentEditable={<ContentEditable className="editor-input" />}
                placeholder={
                  !readOnly ? (
                    <div className="editor-placeholder">
                      {placeholder || 'Write a comment...'}
                    </div>
                  ) : (
                    <></>
                  )
                }
                ErrorBoundary={LexicalErrorBoundary}
              />
            )}
          </div>
          <HistoryPlugin />
          <AutoFocusPlugin />
          {/* Thêm Button Gửi */}
          <Button
            type="primary"
            onClick={handleCommentSend}
            disabled={editorState?.getText().trim().length === 0} // Disable nếu không có nội dung
          >
            Gửi
          </Button>
        </div>
      </div>
    </LexicalComposer>
  );
};

export default memo(Editor);
