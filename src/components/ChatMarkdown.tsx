import { Card, CardActionArea, Fade, Snackbar, Typography, TypographyProps } from "@mui/material";
import { DetailedHTMLProps, HTMLAttributes, memo, useState, type ReactElement } from "react";
import Markdown, { type Options as MarkdownOptions } from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import "highlight.js/styles/github.css";
import "katex/dist/katex.min.css";
import "./ChatMarkdown.css";
import { ContentCopy } from "@mui/icons-material";


function header(
  h: "h1" | "h2" | "h3" | "h4" | "h5" | "h6",
  typographyProps: TypographyProps = {},
): (props: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) => ReactElement {
  // eslint-disable-next-line react/display-name
  return (props) => {
    // eslint-disable-next-line react/prop-types
    const { children, className } = props;
    return (
      <Typography variant={h} gutterBottom className={className} {...typographyProps}>
        {children}
      </Typography>
    );
  };
}

function paragraph(
  base: "body1" | "body2",
  component: "p" | "ul" | "ol" | "table",
  typographyProps: TypographyProps = {},
): (props: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) => ReactElement {
  // eslint-disable-next-line react/display-name
  return (props) => {
    // eslint-disable-next-line react/prop-types
    const { children, className } = props;
    return (
      <Typography variant={base} component={component} gutterBottom className={className} {...typographyProps}>
        {children}
      </Typography>
    );
  };
}

function pre(): (props: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) => ReactElement {
  const textOf = (node: unknown): string => {
    if (!node) return "";
    if (typeof node === "string") return node;
    if (typeof node === "number") return node.toString();
    if (typeof node === "boolean") return "";
    if (typeof node === "object") {
      if (node instanceof Array) return node.map(textOf).join("");
      if ("props" in node) {
        // @ts-expect-error: it should have children props.
        // If it doesn't have, it will pass a falsy value which returns empty string.
        return textOf(node.props.children);
      }
    }
    console.warn("Unresolved `node` of type:", typeof node, node);
    return "";
  };
  // eslint-disable-next-line react/display-name
  return (props) => {
    // eslint-disable-next-line react/prop-types
    const { children, className } = props;
    const [showCopyButton, setShowCopyButton] = useState(false);
    const [showCopiedSnackbar, setShowCopiedSnackbar] = useState(false);
    return (
      <pre
        className={className}
        style={{ position: "relative" }}
        onMouseEnter={() => setShowCopyButton(true)}
        onMouseLeave={() => setShowCopyButton(false)}
      >
        {children}
        <Fade in={showCopyButton}>
          <Card sx={{ position: "absolute", top: 8, right: 8 }}>
            <CardActionArea
              sx={{ height: 28, width: 28, display: "flex", justifyContent: "center", alignItems: "center" }}
              onClick={() => navigator.clipboard.writeText(textOf(children)).then(() => setShowCopiedSnackbar(true))}
            >
              <ContentCopy sx={{ color: "text.secondary", width: 20, height: 20 }} />
            </CardActionArea>
          </Card>
        </Fade>
        <Snackbar
          open={showCopiedSnackbar}
          onClose={() => setShowCopiedSnackbar(false)}
          autoHideDuration={3000}
          message="Copied the content of code block to clipboard! "
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        />
      </pre>
    );
  };
}

type ChatMarkdownProps = {
  noGutter?: boolean;
  base?: "body1" | "body2";
};

export const ChatMarkdown = memo(function ChatMarkdown(
  props: MarkdownOptions & ChatMarkdownProps & TypographyProps,
): ReactElement {
  const { base = "body1" } = props;
  return (
    <Markdown
      className="chat-markdown"
      {...props}
      remarkPlugins={[remarkMath, remarkGfm]}
      rehypePlugins={[
        [rehypeKatex, {}],
        [rehypeHighlight, { detect: true }]
      ]}
      components={{
        h1: header("h1", props),
        h2: header("h2", props),
        h3: header("h3", props),
        h4: header("h4", props),
        h5: header("h5", props),
        h6: header("h6", props),
        p: paragraph(base, "p", props),
        ul: paragraph(base, "ul", props),
        ol: paragraph(base, "ol", props),
        table: paragraph(base, "table", props),
        pre: pre()
      }}
    />
  );
});
