import 'server-only';
import mammoth from 'mammoth';
// pdf-parse exposes a function that operates on a Buffer.
// Import via require to avoid its index.js test-mode side effect — `import 'pdf-parse'`
// crashes in Alpine production (UAE18 known gotcha).
const pdfParse: (buf: Buffer) => Promise<{ text: string }> =
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('pdf-parse/lib/pdf-parse.js');

export interface ParsedFile {
  text: string;
  warning?: string;
}

export async function parseUploadedFile(
  buffer: Buffer,
  fileName: string,
): Promise<ParsedFile> {
  const lower = fileName.toLowerCase();
  try {
    if (lower.endsWith('.docx')) {
      const r = await mammoth.extractRawText({ buffer });
      return { text: (r.value ?? '').trim() };
    }
    if (lower.endsWith('.pdf')) {
      const r = await pdfParse(buffer);
      return { text: (r.text ?? '').trim() };
    }
    if (lower.endsWith('.txt') || lower.endsWith('.md')) {
      return { text: buffer.toString('utf8').trim() };
    }
  } catch (e) {
    return {
      text: '',
      warning: `Không đọc được nội dung file (${(e as Error).message}). Bạn có thể nhập tóm tắt thủ công.`,
    };
  }
  return {
    text: '',
    warning: `Định dạng file chưa hỗ trợ trích xuất text: ${fileName}`,
  };
}

/** Cap lại text trước khi lưu Firestore (tránh document > 1MB). */
export function capContentText(text: string, maxChars = 50_000): string {
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars) + '\n\n[... cắt bớt do vượt giới hạn ...]';
}
