import { ChatMarkdown } from "@/components/ChatMarkdown.tsx";
import { filterPresets, Preset, presets } from "@/presets";
import { useChatStore } from "@/stores";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Container,
  InputAdornment,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { type ReactElement, useState } from "react";
import { useNavigate } from "react-router";
import { VList } from "virtua";

function PresetCard({ preset }: { preset: Preset }): ReactElement {
  const navigate = useNavigate();
  const chatStore = useChatStore();
  const createChatFromPreset = () => {
    console.log("createChatFromPreset", preset);
    const id = chatStore.newChat({
      name: preset.name,
      deployment: "gpt-4",
      systemPrompt: preset.systemPrompt,
      userPromptTemplate: preset.userPromptTemplate ?? "",
      temperature: 0.5,
      maxResponseTokens: 2048,
      maxHistoryChats: 20,
    });
    navigate(`/chats/${id}`);
  };

  return (
    <Card>
      <CardActionArea onClick={createChatFromPreset}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            {preset.name}
          </Typography>
          <ChatMarkdown variant="body2" color="text.secondary" noGutter>
            {preset.systemPrompt}
          </ChatMarkdown>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default function PresetStartPage(): ReactElement {
  const [tabValue, setTabValue] = useState(Object.keys(presets)[0]);
  const [search, setSearch] = useState("");

  return (
    <Container maxWidth="md" sx={{ pt: 8, height: "100vh", display: "flex", flexDirection: "column" }}>
      <Typography variant="h3" gutterBottom>
        Create New Chat from Pre-sets
      </Typography>
      <Typography gutterBottom>
        Feel free to choose a pre-sets to start your work. You can always customize your chat later.
      </Typography>
      <Tabs
        value={tabValue}
        onChange={(_e, v) => {
          setTabValue(v);
        }}
      >
        {Object.keys(presets).map((key) => (
          <Tab label={key} value={key} key={key} />
        ))}
      </Tabs>
      <Stack spacing={2} sx={{ flexGrow: 1 }}>
        <TextField
          label="Search"
          variant="filled"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Box sx={{ flexGrow: 1 }}>
          <VList style={{ height: "100%" }}>
            {filterPresets(presets[tabValue], search).map((preset, i) => (
              <Box key={i} sx={{ m: 1 }}>
                <PresetCard preset={preset} />
              </Box>
            ))}
          </VList>
        </Box>
      </Stack>
    </Container>
  );
}
