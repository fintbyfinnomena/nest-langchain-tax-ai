// import { BaseMessage } from "@langchain/core/messages";
// import { END, StateGraphArgs } from "@langchain/langgraph";
import { START, END, StateGraph } from "@langchain/langgraph";

// import {
//   HumanMessage,
//   // AIMessage,
//   // MessageContent,
// } from '@langchain/core/messages';

import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";

import { JsonOutputToolsParser } from "langchain/output_parsers";

import { 
	createAnthropicModel,
	createOpenAIModel,
	createAnthropicAgent,
	generatorAgentNode,
	AgentStateChannelsInterface,
	agentStateChannels,
} from 'src/langchain-chat/agents/init'
import { Runnable } from "@langchain/core/runnables";

import {
  suggestPortProfileAllocationTool,
  fundInformationTool,
  taxSavingFundTool,
  completeOrEscalate,
} from 'src/langchain-chat/tools/customTools';

import { portfolioAllocationWithoutHistoryPrompt } from 'src/prompts/tax-saving-fund/portfolioAllocationWithoutHistory.prompts';
import { fundInfoPrompt } from 'src/prompts/fundInfo.prompts';
import { recommendPrompt } from 'src/prompts/tax-saving-fund/recommend.prompts';
import { knowledgePrompt } from 'src/prompts/tax-saving-fund/knowledge.prompts';
import { supervisorRolePrompt, supervisorConditionPrompt } from 'src/prompts/supervisor.prompts';

export async function initSupervisorAgent() : Promise<Runnable> {

	const members = ["port_profile_allocation","fund_information","tax_saving_fund","knowledge"];
	const options = [END, ...members];
	// Define the routing function
	const functionDef = {
	  name: "route",
	  description: "Select the next role.",
	  parameters: {
	    title: "routeSchema",
	    type: "object",
	    properties: {
	      next: {
	        title: "Next",
	        anyOf: [
	          { enum: options },
	        ],
	      },
	    },
	    required: ["next"],
	  },
	};

	const toolDef = {
	  type: "function",
	  function: functionDef,
	} as const;

	const prompt = ChatPromptTemplate.fromMessages([
	  ["system", supervisorRolePrompt],
	  new MessagesPlaceholder("messages"),
	  [ "system", supervisorConditionPrompt],
	]);

	const formattedPrompt = await prompt.partial({
	  options: options.join(", "),
	  members: members.join(", "),
	});

	const llm = await createOpenAIModel()

	const supervisorChain = formattedPrompt
	  .pipe(llm.bindTools(
	    [toolDef],
	    {
	      tool_choice: { type: "function", function: { name: "route" } },
	      // not working on anthropic ai
	    },
	  ))
	  .pipe(new JsonOutputToolsParser())
	  // select the first one
	  .pipe((x) => (x[0].args));

	const llmAnthropic = await createAnthropicModel()

	const portAgentNode = await generatorAgentNode(llmAnthropic,[suggestPortProfileAllocationTool,completeOrEscalate],portfolioAllocationWithoutHistoryPrompt)
	const fundInfoAgentNode = await generatorAgentNode(llmAnthropic,[fundInformationTool,completeOrEscalate],fundInfoPrompt)
	const taxSavingAgentNode = await generatorAgentNode(llmAnthropic,[taxSavingFundTool,completeOrEscalate],recommendPrompt)
	const knowledgeAgentNode = await generatorAgentNode(llmAnthropic,[completeOrEscalate],knowledgePrompt)

	const workflow = new StateGraph<AgentStateChannelsInterface, unknown, string>({
	  channels: agentStateChannels,
	})
	  .addNode("port_profile_allocation", portAgentNode)
	  .addNode("fund_information", fundInfoAgentNode)
	  .addNode("tax_saving_fund", taxSavingAgentNode)
	  .addNode("knowledge", knowledgeAgentNode)
	  .addNode("supervisor", supervisorChain);
	
	members.forEach((member) => {
	  workflow.addEdge(member, "supervisor");
	});

	workflow.addConditionalEdges(
	  "supervisor",
	  (x: AgentStateChannelsInterface) => x.next,
	);

	workflow.addEdge(START, "supervisor");

	return workflow.compile();

}