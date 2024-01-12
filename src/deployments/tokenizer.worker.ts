import { encodingForModel, TiktokenModel } from "js-tiktoken";

self.onmessage = (
  e: MessageEvent<{
    model: string;
    text: string;
  }>,
) => {
  const encoder = encodingForModel(e.data.model as TiktokenModel);
  const tokens = encoder.encode(e.data.text);
  self.postMessage(tokens.length);
};
