import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection } from 'lexical';

export default function AppendTextPlugin({ newText = '', onClear = () => {} }) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    editor.update(() => {
      const selection = $getSelection();
      selection?.insertText(newText);
      onClear?.();
    });
  }, [editor, newText]);
  return null;
}
