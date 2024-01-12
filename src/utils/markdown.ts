import { marked } from "marked";
import markedKatex from "marked-katex-extension";

export function isMarkdown(value: string): boolean {
  const tokenTypes: string[] = [];

  marked.use(markedKatex());

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

    "inlineKatex",
    "blockKatex"
  ].some((tokenType) => tokenTypes.includes(tokenType));
}
