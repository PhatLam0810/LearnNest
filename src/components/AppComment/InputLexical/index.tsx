import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import AutoLinkPlugin from './plugins/AutoLinkPlugin';
import EnterKeyPlugin from './plugins/EnterKeyPlugin';
import { $getRoot, EditorState } from 'lexical';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import exampleTheme from './theme/ExampleTheme';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import {
  BeautifulMentionNode,
  createBeautifulMentionNode,
} from 'lexical-beautiful-mentions';
import CustomMentionComponent from './nodes/CustomMentionNode';
import './styles.css';

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error) {
  console.error(error);
}

interface EditorProps {
  onChange?: (editorState: EditorState) => void;
  handleSendComment: () => void;
}

function Editor({ onChange, handleSendComment }: EditorProps) {
  const initialConfig = {
    namespace: 'MyEditor',
    theme: exampleTheme,
    onError,
    nodes: [CodeNode, CodeHighlightNode, AutoLinkNode, LinkNode],
  };
  const handleOnChange = (editorState: EditorState) => onChange?.(editorState);
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={<ContentEditable className="editor-container" />}
        placeholder={
          <div className="editor-placeholder">Nhập bình luận...</div>
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <LinkPlugin />
      <AutoLinkPlugin />
      <AutoFocusPlugin />
      <OnChangePlugin
        onChange={handleOnChange}
        ignoreHistoryMergeTagChange
        ignoreSelectionChange
      />
      <EnterKeyPlugin handleSendComment={handleSendComment} />
    </LexicalComposer>
  );
}

export default Editor;
