/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useState } from 'react';
import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Image } from '@tiptap/extension-image';
import { Bold } from '@tiptap/extension-bold';
import { Italic } from '@tiptap/extension-italic';
import { Underline } from '@tiptap/extension-underline';
import { Heading } from '@tiptap/extension-heading';
import { Link } from '@tiptap/extension-link';
import Toolbar from './Toolbar';
import './styles.css';
const AppRichTextInput = ({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (value: string) => void;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Bold,
      Italic,
      Underline,
      Heading.configure({ levels: [1, 2, 3] }),
      Link,
    ],
    editorProps: {
      attributes: {
        class: 'richtext-input',
      },
    },
    content: value,
    onUpdate: ({ editor }) => {
      onChange && onChange(editor.getHTML());
    },
  });
  return (
    <>
      <EditorContent editor={editor} />
      <BubbleMenu editor={editor}>
        <Toolbar editor={editor} content={value} />
      </BubbleMenu>
    </>
  );
};

export default AppRichTextInput;
