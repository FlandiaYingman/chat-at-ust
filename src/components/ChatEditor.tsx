import { DefaultDeployment, Deployment, DeploymentMap, DeploymentNames } from "@/deployments";
import { useTokenizer } from "@/deployments/tokenizer.ts";
import { formatUSD } from "@/utils/currency.ts";
import AbcIcon from "@mui/icons-material/Abc";
import HistoryIcon from "@mui/icons-material/History";
import SendIcon from "@mui/icons-material/Send";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import {
  Autocomplete,
  Box,
  Button,
  Input,
  InputProps,
  Slider,
  SliderProps,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { ReactElement, useState } from "react";

function FormSlider(props: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  label: string;
  icon: ReactElement;
  sliderProps?: SliderProps;
  inputProps?: InputProps;
}): ReactElement {
  return (
    <Box>
      <Typography color="text.secondary" gutterBottom>
        {props.label}
      </Typography>
      <Grid container spacing={4} justifyContent="center" alignItems="center">
        <Grid alignSelf="start">{props.icon}</Grid>
        <Grid xs>
          <Slider
            min={props.min}
            max={props.max}
            step={props.step}
            value={props.value}
            onChange={(_, v) => props.onChange(v as number)}
            {...props.sliderProps}
          />
        </Grid>
        <Grid>
          <Input
            value={props.value}
            onChange={(e) => props.onChange(parseFloat(e.target.value))}
            size="small"
            inputProps={{
              min: props.min,
              max: props.max,
              step: props.step,
              type: "number",
            }}
            {...props.inputProps}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export type ChatParams = {
  deployment: Deployment;
  temperature: number;
  maxResponseTokens: number;
  messageHistoryLimit: number;
  chatName: string;
  systemPrompt: string;
  userPromptTemplate: string;
};

export type Props = ChatParams & {
  onSubmit: (params: ChatParams) => void;
};

export default function ChatEditor(props: Props) {
  const [deploymentName, setDeploymentName] = useState(props.deployment.deployment);
  const deployment = DeploymentMap[deploymentName] ?? DefaultDeployment;

  const [temperature, setTemperature] = useState(props.temperature);
  const [maxResponseTokens, setMaxResponseTokens] = useState(props.maxResponseTokens);
  const [messageHistoryLimit, setMessageHistoryLimit] = useState(props.messageHistoryLimit);

  const [chatName, setChatName] = useState(props.chatName);
  const [systemPrompt, setSystemPrompt] = useState(props.systemPrompt);
  const [userPromptTemplate, setUserPromptTemplate] = useState(props.userPromptTemplate);

  const { tokens: systemPromptTokens, price: systemPromptPrice } = useTokenizer(deployment, systemPrompt);
  const { tokens: userPromptTemplateTokens, price: userPromptTemplatePrice } = useTokenizer(
    deployment,
    userPromptTemplate,
  );

  return (
    <>
      <Stack spacing={2} sx={{ my: 2 }}>
        <Autocomplete
          renderInput={(params) => <TextField {...params} label="Model" />}
          options={DeploymentNames}
          value={deploymentName}
          onChange={(_e, v) => {
            setDeploymentName(v);
          }}
          disableClearable
        />
        <FormSlider
          value={temperature}
          onChange={setTemperature}
          min={0}
          max={2}
          step={0.01}
          label="Temperature"
          icon={<ThermostatIcon />}
          sliderProps={{
            valueLabelDisplay: "auto",
            marks: [
              { value: 0, label: "0.0" },
              { value: 1, label: "1.0" },
              { value: 2, label: "2.0" },
            ],
          }}
        />
        <FormSlider
          value={maxResponseTokens}
          onChange={setMaxResponseTokens}
          min={0}
          max={deployment.maxTokens}
          step={256}
          label="Max Response Tokens"
          icon={<AbcIcon />}
          sliderProps={{
            valueLabelDisplay: "auto",
            marks: [
              { value: 0, label: "0" },
              { value: deployment.maxTokens, label: `${deployment.maxTokens}` },
            ],
          }}
        />
        <FormSlider
          value={messageHistoryLimit}
          onChange={setMessageHistoryLimit}
          min={0}
          max={40}
          step={1}
          label="Message History Limit"
          icon={<HistoryIcon />}
          sliderProps={{
            valueLabelDisplay: "auto",
            marks: [
              { value: 0, label: "0" },
              { value: 40, label: "40" },
            ],
          }}
        />
        <TextField
          label="Chat Name"
          fullWidth
          value={chatName}
          onChange={(e) => {
            setChatName(e.target.value);
          }}
        />
        <TextField
          label="System Prompt"
          fullWidth
          multiline
          rows={8}
          placeholder="You are a helpful assistant."
          value={systemPrompt}
          onChange={(e) => {
            setSystemPrompt(e.target.value);
          }}
        />
        <Typography variant="caption">
          You have entered {systemPrompt.length} characters for system prompt, which is approximately{" "}
          {systemPromptTokens} tokens and costs {formatUSD(systemPromptPrice)}.
        </Typography>
        <TextField
          label="User Prompt Template"
          fullWidth
          multiline
          rows={4}
          value={userPromptTemplate}
          onChange={(e) => {
            setUserPromptTemplate(e.target.value);
          }}
        />
        <Typography variant="caption">
          You have entered {userPromptTemplate.length} characters for user prompt template, which is approximately{" "}
          {userPromptTemplateTokens} tokens and costs {formatUSD(userPromptTemplatePrice)}.
        </Typography>
      </Stack>
      <Button
        variant="contained"
        endIcon={<SendIcon />}
        onClick={() =>
          props.onSubmit({
            chatName,
            deployment,
            systemPrompt,
            userPromptTemplate,
            temperature,
            maxResponseTokens,
            messageHistoryLimit,
          })
        }
      >
        Done!
      </Button>
    </>
  );
}
