/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import { StarterKit } from '@tiptap/starter-kit';
import { Image } from '@tiptap/extension-image';
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
    // Bold/Italic/Underline/Link đã có sẵn trong StarterKit v3, chỉ cần
    // chỉnh riêng heading (giới hạn H1-H3 thay vì H1-H6 mặc định).
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Image,
    ],
    editorProps: {
      attributes: {
        class: 'richtext-input',
      },
    },
    // Tránh mismatch hydration SSR (Next.js) - editor chỉ render nội dung
    // thật ở client, giống khuyến nghị chính thức Tiptap v3 cho App Router.
    immediatelyRender: false,
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
