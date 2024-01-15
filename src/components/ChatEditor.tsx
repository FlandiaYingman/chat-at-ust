import { ChatParams } from "@/chats";
import { DefaultDeployment, DeploymentMap, DeploymentNames } from "@/deployments";
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

export type Props = { onSubmit: (params: ChatParams) => void } & ChatParams;

export default function ChatEditor(props: Props) {
  const [deployment, setDeployment] = useState(props.deployment);
  const deploymentObj = DeploymentMap[deployment] ?? DefaultDeployment;

  const [temperature, setTemperature] = useState(props.temperature);
  const [maxTokens, setMaxTokens] = useState(props.maxTokens);
  const [maxMessages, setMaxMessages] = useState(props.maxMessages);

  const [name, setName] = useState(props.name);
  const [systemPrompt, setSystemPrompt] = useState(props.systemPrompt);
  const [userTemplatePrompt, setUserTemplatePrompt] = useState(props.userTemplatePrompt);

  const { tokens: systemTokens, price: systemPrice } = useTokenizer(deploymentObj, systemPrompt);
  const { tokens: userTemplateTokens, price: userTemplatePrice } = useTokenizer(deploymentObj, userTemplatePrompt);

  return (
    <>
      <Stack spacing={2} sx={{ my: 2 }}>
        <Autocomplete
          renderInput={(params) => <TextField {...params} label="Model" />}
          options={DeploymentNames}
          value={deployment}
          onChange={(_e, v) => setDeployment(v)}
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
          value={maxTokens}
          onChange={setMaxTokens}
          min={0}
          max={deploymentObj.maxTokens}
          step={256}
          label="Max Tokens"
          icon={<AbcIcon />}
          sliderProps={{
            valueLabelDisplay: "auto",
            marks: [
              { value: 0, label: "0" },
              { value: deploymentObj.maxTokens, label: `${deploymentObj.maxTokens}` },
            ],
          }}
        />
        <FormSlider
          value={maxMessages}
          onChange={setMaxMessages}
          min={0}
          max={40}
          step={1}
          label="Max Messages"
          icon={<HistoryIcon />}
          sliderProps={{
            valueLabelDisplay: "auto",
            marks: [
              { value: 0, label: "0" },
              { value: 40, label: "40" },
            ],
          }}
        />
        <TextField label="Chat Name" fullWidth value={name} onChange={(e) => setName(e.target.value)} />
        <TextField
          label="System Prompt"
          fullWidth
          multiline
          minRows={8}
          placeholder="You are a helpful assistant."
          value={systemPrompt}
          onChange={(e) => {
            setSystemPrompt(e.target.value);
          }}
        />
        <Typography variant="caption">
          You have entered {systemPrompt.length} characters for system prompt, which is approximately {systemTokens}{" "}
          tokens and costs {formatUSD(systemPrice)}.
        </Typography>
        <TextField
          label="User Template Prompt"
          fullWidth
          multiline
          minRows={4}
          value={userTemplatePrompt}
          onChange={(e) => {
            setUserTemplatePrompt(e.target.value);
          }}
        />
        <Typography variant="caption">
          You have entered {userTemplatePrompt.length} characters for user prompt template, which is approximately{" "}
          {userTemplateTokens} tokens and costs {formatUSD(userTemplatePrice)}.
        </Typography>
      </Stack>
      <Button
        variant="contained"
        endIcon={<SendIcon />}
        onClick={() =>
          props.onSubmit({
            name,
            deployment,
            systemPrompt,
            userTemplatePrompt,
            temperature,
            maxTokens,
            maxMessages,
          })
        }
      >
        Done!
      </Button>
    </>
  );
}
