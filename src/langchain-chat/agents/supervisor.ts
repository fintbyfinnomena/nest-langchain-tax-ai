import { START, END, StateGraph } from '@langchain/langgraph';

import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';

import { JsonOutputToolsParser } from 'langchain/output_parsers';
import {
  createOpenAIModel,
  generatorAgentNode,
  AgentStateChannelsInterface,
  agentStateChannels,
} from 'src/langchain-chat/agents/init';
import { Runnable } from '@langchain/core/runnables';

import {
  suggestPortProfileAllocationTool,
  fundInformationTool,
  fundNameFussySearch,
  taxSavingFundSuggestedListTool,
  finnomenaKnowledgeTool,
  ltfKnowledgeTool,
  eventAndPromotionTool,
  completeOrEscalate,
} from 'src/langchain-chat/tools/customTools';

import { portfolioAllocationPrompt } from 'src/prompts/tax-saving-fund/portfolioAllocation.prompts';
import { fundInfoPrompt } from 'src/prompts/fundInfo.prompts';
import { suggestedListPrompt } from 'src/prompts/tax-saving-fund/suggestedList.prompts';
import { knowledgePrompt } from 'src/prompts/tax-saving-fund/knowledge.prompts';
import {
  supervisorRolePrompt,
  supervisorConditionPrompt,
} from 'src/prompts/supervisor.prompts';
import { AIMessage } from '@langchain/core/messages';
export async function initSupervisorAgent(): Promise<Runnable> {
  const members = [
    'tax_saving_fund_allocation',
    'fund_information',
    'tax_saving_fund_suggested_list',
    'tax_saving_fund_knowledge',
  ];
  const options = [END, ...members];
  // Define the routing function
  const functionDef = {
    name: 'route',
    description: 'Select the next role.',
    parameters: {
      title: 'routeSchema',
      type: 'object',
      properties: {
        reasoning: {
          title: 'Reasoning',
          type: 'string',
        },
        next: {
          title: 'Next',
          anyOf: [{ enum: options }],
        },
      },
      required: ['reasoning', 'next'],
      // required: ["next"],
    },
  };

  const toolDef = {
    type: 'function',
    function: functionDef,
  } as const;

  const prompt = ChatPromptTemplate.fromMessages([
    ['system', supervisorRolePrompt],
    new MessagesPlaceholder('messages'),
    ['system', supervisorConditionPrompt],
  ]);

  const formattedPrompt = await prompt.partial({
    options: options.join(', '),
    members: members.join(', '),
  });

  const llmModle = await createOpenAIModel();

  const supervisorChain = formattedPrompt
    .pipe(
      llmModle.bindTools([toolDef], {
        tool_choice: { type: 'function', function: { name: 'route' } },
        // not working on anthropic ai
      }),
    )
    .pipe(new JsonOutputToolsParser())
    // select the first one
    .pipe((x) => x[0].args);

  // const combinedPrompt = "\nWork autonomously according to your specialty, using the tools available to you. Do not ask for clarification. You are chosen for a reason!"
  const taxSAvingFundAllocationAgentNode = await generatorAgentNode({
    name: 'tax_saving_fund_allocation',
    llm: llmModle,
    tools: [suggestPortProfileAllocationTool, completeOrEscalate],
    // systemPrompt: portfolioAllocationPrompt
    systemPrompt: portfolioAllocationPrompt,
  });
  const fundInfoAgentNode = await generatorAgentNode({
    name: 'fund_information',
    llm: llmModle,
    tools: [fundInformationTool, fundNameFussySearch, completeOrEscalate],
    systemPrompt: fundInfoPrompt,
  });
  const tsfFundSuggestedListAgentNode = await generatorAgentNode({
    name: 'tax_saving_fund_suggested_list',
    llm: llmModle,
    tools: [taxSavingFundSuggestedListTool, completeOrEscalate],
    systemPrompt: suggestedListPrompt,
  });
  const tsfKnowledgeAgentNode = await generatorAgentNode({
    name: 'tax_saving_fund_knowledge',
    llm: llmModle,
    tools: [
      completeOrEscalate,
      finnomenaKnowledgeTool,
      ltfKnowledgeTool,
      eventAndPromotionTool,
    ],
    systemPrompt: knowledgePrompt,
  });

  const workflow = new StateGraph<AgentStateChannelsInterface, unknown, string>(
    {
      channels: agentStateChannels,
    },
  )
    .addNode('tax_saving_fund_allocation', taxSAvingFundAllocationAgentNode)
    .addNode('fund_information', fundInfoAgentNode)
    .addNode('tax_saving_fund_suggested_list', tsfFundSuggestedListAgentNode)
    .addNode('tax_saving_fund_knowledge', tsfKnowledgeAgentNode)
    .addNode('supervisor', supervisorChain);

  members.forEach((member) => {
    workflow.addEdge(member, 'supervisor');
  });

  const routeMessage = (state) => {
    const { messages } = state;
    const lastMessage = messages[messages.length - 1];

    if (lastMessage instanceof AIMessage) {
      return END;
    }
    // Otherwise if there is, we continue and call the tools
    return state.next;
  };

  workflow.addConditionalEdges('supervisor', routeMessage);
  // workflow.addConditionalEdges(
  //   'supervisor',
  //   (x: AgentStateChannelsInterface) => x.next,
  // );
  workflow.addEdge(START, 'supervisor');

  return workflow.compile();
}
