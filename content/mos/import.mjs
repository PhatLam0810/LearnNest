// Usage: API=https://<be>/ TOKEN=<admin jwt> node content/mos/import.mjs [file.json]
// Tạo bài học (Library, type Text) rồi gắn quiz. Thay URL video thật trong trang admin sau khi quay.
import { readFileSync } from 'node:fs';

const { API, TOKEN } = process.env;
if (!API || !TOKEN) throw new Error('Thiếu biến môi trường API hoặc TOKEN');
const file =
  process.argv[2] ?? new URL('./excel-quizzes.json', import.meta.url);
const post = async (path, body) => {
  const res = await fetch(new URL(path, API), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${path} ${res.status}: ${await res.text()}`);
  return res.json();
};

for (const { title, description, note, questions } of JSON.parse(
  readFileSync(file, 'utf8'),
)) {
  const lib = await post('library', {
    title,
    description,
    note,
    type: 'Text',
    category: 'MOS Excel',
  });
  const libraryId = String(lib.data?._id ?? lib._id);
  await post('quiz', {
    title: `${title} - Trắc nghiệm`,
    libraryId,
    questions,
    passThresholdPercent: 70,
    shuffleQuestions: true,
  });
  console.log('OK', title);
}
