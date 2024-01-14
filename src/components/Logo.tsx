import chatAtUst from "@/assets/chat-at-ust.svg";
import { Box, Card, CardActionArea, CardActionAreaProps, type CardProps } from "@mui/material";
import { type ReactElement } from "react";
import { useNavigate } from "react-router";

export default function Logo(props: CardProps & { ActionAreaProps?: CardActionAreaProps }): ReactElement {
  const { ActionAreaProps = {} } = props;
  const CardProps = { ...props };
  delete CardProps.ActionAreaProps;

  const navigate = useNavigate();
  return (
    <Card {...CardProps} elevation={0}>
      <CardActionArea
        {...ActionAreaProps}
        onClick={() => {
          navigate("/");
        }}
      >
        <Box sx={{ p: 1 }} component="img" src={chatAtUst} />
      </CardActionArea>
    </Card>
  );
}
