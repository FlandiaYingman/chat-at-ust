import { NewChatPanel } from "@/components/NewChat.tsx";
import { Box, Container, Typography } from "@mui/material";
import { type ReactElement } from "react";

function Spacer(props: { spacing?: number }): ReactElement {
  const { spacing = 2 } = props;
  return <Box sx={{ mb: spacing }} />;
}

const HKUST_API_DEVELOPER_PORTAL = "https://hkust.developer.azure-api.net/";

const HKUST_API_KEY_GUIDE =
  "https://itsc.hkust.edu.hk/services/it-infrastructure/azure-openai-api-service#subscription";

function HomePage(): ReactElement {
  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Typography variant="h3" gutterBottom>
        Getting Started
      </Typography>
      <Typography variant="h4" gutterBottom>
        Setting Up
      </Typography>
      <Typography gutterBottom>
        In order to access the HKUST ChatGPT API, a key is required. Obtain your API key from the{" "}
        <a href={HKUST_API_DEVELOPER_PORTAL}>HKUST API Developer Portal</a>. You may follow{" "}
        <a href={HKUST_API_KEY_GUIDE}>this instruction</a> to obtain your API key. Enter your API key in <i>Settings</i>{" "}
        (at bottom right corner of the page).
      </Typography>

      <Typography variant="h4" gutterBottom>
        Quick Start
      </Typography>
      <Typography component='div' gutterBottom>
        <NewChatPanel />
      </Typography>
      <Spacer />

      <Typography variant="h3" gutterBottom>
        About Chat @ UST
      </Typography>
      <Typography gutterBottom>
        ChatGPT @ HKUST (the website) is an improved version of the{" "}
        <a href="https://chatgpt.ust.hk">HKUST ChatGPT Platform</a>.
      </Typography>
      <Typography gutterBottom>
        The website is an independent and unofficial website authored by its students. It is not affiliated with or
        maintained by HKUST official. However, it is guaranteed that all information will be either saved locally on
        users&apos; machine or transferred securely to the official HKUST ChatGPT API.
      </Typography>
    </Container>
  );
}

export default HomePage;
