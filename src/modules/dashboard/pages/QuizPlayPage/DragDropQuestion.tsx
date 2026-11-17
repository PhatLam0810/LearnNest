'use client';
import React, { useState } from 'react';
import { Text, View } from 'react-native-web';
import type {
  PlayAnswer,
  QuestionReview,
} from '~mdDashboard/redux/RTKQuery/types';
import styles from './styles';

interface Props {
  text: string;
  answers: PlayAnswer[];
  // blank number -> answer index
  value: Record<string, number>;
  onChange: (next: Record<string, number>) => void;
  review?: QuestionReview;
}

// Hai cách thao tác cho cùng 1 kết quả: kéo chip thả vào ô (máy tính) hoặc bấm
// chip rồi bấm ô (điện thoại / bàn phím - HTML5 drag không chạy bằng cảm ứng).
const DragDropQuestion: React.FC<Props> = ({
  text,
  answers,
  value,
  onChange,
  review,
}) => {
  const [picked, setPicked] = useState<number | null>(null);
  const locked = !!review;
  const used = new Set(Object.values(value));
  const textOf = (idx: number) =>
    answers.find(a => a.index === idx)?.text ?? '';

  const place = (blank: string, answerIndex: number) => {
    const next = { ...value };
    // Mỗi đáp án chỉ ở 1 ô: bỏ chỗ cũ trước khi thả vào ô mới.
    for (const k of Object.keys(next))
      if (next[k] === answerIndex) delete next[k];
    next[blank] = answerIndex;
    onChange(next);
    setPicked(null);
  };
  const clear = (blank: string) => {
    const next = { ...value };
    delete next[blank];
    onChange(next);
  };

  const onBlankClick = (blank: string) => {
    if (locked) return;
    if (picked !== null) place(blank, picked);
    else if (value[blank] !== undefined) clear(blank);
  };

  const parts = text.split(/(\{\{\s*\d+\s*\}\})/g);

  return (
    <View style={{ gap: 12 }}>
      <View style={styles.sentence}>
        {parts.map((part, i) => {
          const m = part.match(/^\{\{\s*(\d+)\s*\}\}$/);
          if (!m) {
            return part ? (
              <Text key={i} style={styles.sentenceText}>
                {part}
              </Text>
            ) : null;
          }
          const blank = m[1];
          const filled = value[blank];
          const ok = review?.correctPlacements?.[blank] === filled;
          return (
            <button
              key={i}
              type="button"
              disabled={locked}
              aria-label={`Ô trống ${blank}${filled !== undefined ? `: ${textOf(filled)}` : ''}`}
              onClick={() => onBlankClick(blank)}
              onDragOver={e => e.preventDefault()}
              onDrop={e => {
                e.preventDefault();
                const idx = Number(e.dataTransfer.getData('text/plain'));
                if (!locked && Number.isInteger(idx)) place(blank, idx);
              }}
              style={
                {
                  ...styles.blank,
                  ...(filled !== undefined ? styles.blankFilled : null),
                  ...(review
                    ? ok
                      ? styles.blankCorrect
                      : styles.blankWrong
                    : null),
                } as React.CSSProperties
              }>
              {filled !== undefined ? textOf(filled) : `Ô ${blank}`}
            </button>
          );
        })}
      </View>
      {!locked && (
        <View style={styles.pool}>
          {answers.map(a => {
            const isUsed = used.has(a.index);
            return (
              <button
                key={a.index}
                type="button"
                draggable={!isUsed}
                disabled={isUsed}
                aria-pressed={picked === a.index}
                onDragStart={e =>
                  e.dataTransfer.setData('text/plain', String(a.index))
                }
                onClick={() => setPicked(p => (p === a.index ? null : a.index))}
                style={
                  {
                    ...styles.chip,
                    ...(picked === a.index ? styles.chipSelected : null),
                    ...(isUsed ? styles.chipUsed : null),
                  } as React.CSSProperties
                }>
                {a.text}
              </button>
            );
          })}
        </View>
      )}
      {!locked && (
        <Text style={styles.qHint}>
          Kéo đáp án vào ô trống, hoặc bấm đáp án rồi bấm ô trống. Bấm ô đã điền
          để bỏ ra.
        </Text>
      )}
    </View>
  );
};

export default DragDropQuestion;
