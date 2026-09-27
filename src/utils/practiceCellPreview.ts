// Đọc file .xlsx NGAY TRÊN TRÌNH DUYỆT (SheetJS) để lấy vùng ô thật quanh 1
// tiêu chí chấm điểm, hoặc danh sách tên sheet thật của file đề gốc. Không
// gửi file cho bên thứ ba — chỉ parse tại chỗ. Dùng chung cho:
// - PracticeTaskContent: khung xem vùng ô của bài nộp học viên.
// - PracticeTaskEditorDrawer: danh sách sheet thật để chọn khi tạo tiêu chí.
import * as XLSX from 'xlsx';

export interface GridCellData {
  address: string;
  value: string;
  formula?: string;
  align: 'left' | 'right' | 'center';
}

export interface CellWindowResult {
  visibleCols: string[];
  visibleRows: number[];
  cellMap: Record<string, GridCellData>;
  targetCell?: string;
  ySplit?: number;
  activeCellAddr: string;
  activeCellFormula: string;
  rangeWin: string;
}

export const readWorkbook = async (blob: Blob): Promise<XLSX.WorkBook> => {
  const buf = await blob.arrayBuffer();
  return XLSX.read(buf, { type: 'array', cellFormula: true });
};

export const getSheetNames = (workbook: XLSX.WorkBook): string[] =>
  workbook.SheetNames;

// A -> 0, B -> 1 ... Z -> 25, AA -> 26 — không giới hạn ở A-G như bản cũ
// (bài thi thật có thể tham chiếu tới cột xa hơn G).
const colLetterToIndex = (letters: string): number =>
  letters
    .toUpperCase()
    .split('')
    .reduce((acc, ch) => acc * 26 + (ch.charCodeAt(0) - 64), 0) - 1;

const colIndexToLetter = (idx: number): string => {
  let n = idx + 1;
  let s = '';
  while (n > 0) {
    const rem = (n - 1) % 26;
    s = String.fromCharCode(65 + rem) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
};

const parseCellAddress = (
  addr: string,
): { col: string; row: number } | null => {
  const m = addr.match(/^([A-Za-z]+)(\d+)$/);
  if (!m) return null;
  return { col: m[1].toUpperCase(), row: parseInt(m[2], 10) };
};

// Đọc đúng vùng 4 cột x 4 hàng quanh ô đang chấm (targetCell) từ sheet thật —
// không vẽ nguyên trang tính, tránh nặng máy với file lớn. Trả về null nếu
// không tìm thấy sheet trong workbook (tên sheet ở tiêu chí không khớp file
// thật đã nộp).
export const buildCellWindow = (
  workbook: XLSX.WorkBook,
  sheetName: string,
  targetCell: string | undefined,
  ySplit: number | undefined,
  selectedAddr: string | undefined,
): CellWindowResult | null => {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) return null;

  const target = targetCell ? parseCellAddress(targetCell) : null;
  const targetColIdx = target ? colLetterToIndex(target.col) : 0;
  const targetRow = target?.row ?? 5;

  const startColIdx = Math.max(0, targetColIdx - 2);
  const visibleCols = [0, 1, 2, 3].map(i => colIndexToLetter(startColIdx + i));
  const startRow = Math.max(1, targetRow - 2);
  const visibleRows = [0, 1, 2, 3].map(i => startRow + i);

  const cellMap: Record<string, GridCellData> = {};
  visibleRows.forEach(r => {
    visibleCols.forEach(col => {
      const addr = `${col}${r}`;
      const cell = sheet[addr];
      const rawValue = cell ? (cell.w ?? cell.v ?? '') : '';
      cellMap[addr] = {
        address: addr,
        value:
          rawValue === undefined || rawValue === null ? '' : String(rawValue),
        formula: cell?.f ? `=${cell.f}` : undefined,
        align: typeof cell?.v === 'number' ? 'right' : 'left',
      };
    });
  });

  const activeCellAddr =
    selectedAddr || targetCell || `${visibleCols[0]}${visibleRows[0]}`;
  const activeCellData = cellMap[activeCellAddr];

  return {
    visibleCols,
    visibleRows,
    cellMap,
    targetCell,
    ySplit,
    activeCellAddr,
    activeCellFormula: activeCellData?.formula || activeCellData?.value || '',
    rangeWin: `${visibleCols[0]}${visibleRows[0]}:${visibleCols[visibleCols.length - 1]}${visibleRows[visibleRows.length - 1]}`,
  };
};
