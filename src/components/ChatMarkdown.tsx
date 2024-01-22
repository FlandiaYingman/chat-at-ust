import { Typography, TypographyProps } from "@mui/material";
import { DetailedHTMLProps, HTMLAttributes, memo, type ReactElement } from "react";
import Markdown, { type Options as MarkdownOptions } from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import "highlight.js/styles/github.css";
import "katex/dist/katex.min.css";
import "./ChatMarkdown.css";


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
      }}
    />
  );
});
