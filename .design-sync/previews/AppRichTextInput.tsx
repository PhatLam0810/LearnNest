import { AppRichTextInput } from 'webapp';

export const Default = () => (
  <div style={{ width: 480 }}>
    <AppRichTextInput
      value="<p>Nội dung <strong>bài học</strong> ở đây, có thể gồm <em>định dạng</em> và liên kết.</p>"
    />
  </div>
);
