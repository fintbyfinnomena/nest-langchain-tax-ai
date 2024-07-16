import { AgentExecutor, createOpenAIToolsAgent, createToolCallingAgent } from "langchain/agents";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { Runnable, RunnableConfig } from "@langchain/core/runnables";

import { openAI, vercelRoles } from 'src/utils/constants/openAI.constants';
import { anthropic } from 'src/utils/constants/anthropic.constants';

import {
  HumanMessage,
  // AIMessage,
  // MessageContent,
} from '@langchain/core/messages';

import { BaseMessage } from "@langchain/core/messages";
import { END, StateGraphArgs } from "@langchain/langgraph";

export interface AgentStateChannelsInterface {
  messages: BaseMessage[];
  // The agent node that last performed work
  next: string;
}

// This defines the object that is passed between each node
// in the graph. We will create different nodes for each agent and tool
export const agentStateChannels: StateGraphArgs<AgentStateChannelsInterface>["channels"] = {
  messages: {
    value: (x?: BaseMessage[], y?: BaseMessage[]) => (x ?? []).concat(y ?? []),
    default: () => [],
  },
  next: {
    value: (x?: string, y?: string) => y ?? x ?? END,
    default: () => END,
  },
};

export async function createOpenAIModel(): Promise<ChatOpenAI> {
  return new ChatOpenAI({
    temperature: +openAI.BASIC_CHAT_OPENAI_TEMPERATURE,
    modelName: openAI.GPT_3_5_TURBO_1106.toString(),
  });
}

export async function createOpenAIAgent(
  llm: ChatOpenAI,
  tools: any[],
  systemPrompt: string,
  chatHistory?: boolean,
): Promise<Runnable> {
  const prompt = await promptMessageSequenceGenerate(systemPrompt, chatHistory)
  const agent = await createOpenAIToolsAgent({ llm, tools, prompt });
  return new AgentExecutor({ agent, tools });
  // return new AgentExecutor({ agent, tools, verbose: true });
}

export async function createAnthropicModel(): Promise<ChatAnthropic> {
  return new ChatAnthropic({
    modelName: anthropic.CLAUDE_3_5_SONNET_20240229.toString(),
    temperature: +anthropic.BASIC_CHAT_ANTHROPIC_TEMPERATURE
  });
}

export async function createAnthropicAgent(
  llm: ChatAnthropic,
  tools: any[],
  systemPrompt: string,
  chatHistory?: boolean,
): Promise<Runnable> {

  const prompt = await promptMessageSequenceGenerate(systemPrompt, chatHistory)
  const agent = await createToolCallingAgent({ llm, tools, prompt });
  return new AgentExecutor({ agent, tools });
  // return new AgentExecutor({ agent, tools, verbose: true });
}

export async function loadAgentExecutor(
  tools: any[],
  systemPrompt: string,
) : Promise<Runnable> {
  const llm = await createAnthropicModel()
  return await createAnthropicAgent(llm, tools, systemPrompt, true)
}

export async function generatorAgentNode(
  llm: ChatAnthropic,
  tools: any[],
  systemPrompt: string,
): Promise<Object> {

  const agent = await createAnthropicAgent(
    llm,
    tools,
    systemPrompt,
  );

  const agentNode = async (
    state: AgentStateChannelsInterface,
    config?: RunnableConfig,
  ) => {
    const result = await agent.invoke(state, config);
    return {
      messages: [
        new HumanMessage({ content: result.output, name: "Port" }),
      ],
    };
  };

  return agentNode

}

async function promptMessageSequenceGenerate(systemPrompt: string, chatHistory?: boolean): Promise<any>{
  let prompt :any
  if (chatHistory) {
     prompt = ChatPromptTemplate.fromMessages([
      ['system', systemPrompt],
      new MessagesPlaceholder({ variableName: 'chat_history' }),
      ['user', '{input}'],
      new MessagesPlaceholder({ variableName: 'agent_scratchpad' }),
    ]);
  }else{
    prompt = ChatPromptTemplate.fromMessages([
      ['system', systemPrompt],
      new MessagesPlaceholder({ variableName: 'messages' }),
      new MessagesPlaceholder({ variableName: 'agent_scratchpad' }),
    ]);
  }
  return prompt
}