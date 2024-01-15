export interface ChatParams {
  readonly name: string;
  readonly systemPrompt: string;
  readonly userTemplatePrompt: string;

  readonly deployment: string;
  readonly temperature: number;
  readonly maxTokens: number;
  readonly maxMessages: number;

  readonly messages?: Message[];
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

export interface ChatData extends ChatParams {
  readonly id: string;
}

export class Chat implements ChatData {
  readonly id: string;
  readonly name: string;
  readonly systemPrompt: string;
  readonly userTemplatePrompt: string;

  readonly deployment: string;
  readonly temperature: number;
  readonly maxTokens: number;
  readonly maxMessages: number;

  readonly messages: Message[];
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: ChatData) {
    this.id = props.id;
    this.name = props.name;
    this.systemPrompt = props.systemPrompt;
    this.userTemplatePrompt = props.userTemplatePrompt;

    this.deployment = props.deployment;
    this.temperature = props.temperature;
    this.maxTokens = props.maxTokens;
    this.maxMessages = props.maxMessages;

    this.messages = props.messages ?? [];
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  newMessage(role: MessageRole, content: string): Chat {
    const message: Message = {
      role,
      content,
    };

    return new Chat({
      ...this,
      messages: [...this.messages, message],
      updatedAt: new Date(),
    });
  }

  hashtag(): string {
    // Compute hash code from string
    // https://stackoverflow.com/questions/6122571/simple-non-secure-hash-function-for-javascript
    let hash = 0;
    for (let i = 0, len = this.id.length; i < len; i++) {
      const chr = this.id.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32-bit integer
    }
    // hash >>> 0: convert to unsigned integer
    return "#" + ((hash >>> 0) % 10000).toString().padStart(4, "0");
  }

  fullName(): string {
    return `${this.name}${this.hashtag()}`
  }
}

export function compareChat(a: Chat, b: Chat): number {
  return -(a.updatedAt.valueOf() - b.updatedAt.valueOf());
}

export type MessageRole = "system" | "user" | "assistant" | "error";

export interface Message {
  readonly role: MessageRole;
  readonly content: string;
}
