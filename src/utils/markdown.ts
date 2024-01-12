import { marked } from "marked";

export function isMarkdown(value: string): boolean {
  const tokenTypes: string[] = [];

  // https://marked.js.org/using_pro#tokenizer
  marked(value, {
    walkTokens: (token) => {
      tokenTypes.push(token.type);
    },
  });

  return [
    // 'space',
    "code",
    "fences",
    "heading",
    "hr",
    "link",
    "blockquote",
    "list",
    "html",
    "def",
    "table",
    "lheading",
    "escape",
    "tag",
    "reflink",
    "strong",
    "codespan",
    "url",
  ].some((tokenType) => tokenTypes.includes(tokenType));
}
