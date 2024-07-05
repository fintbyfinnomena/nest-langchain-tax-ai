/**
 * Enum for Anthropic configuration parameters.
 *
 * This enum stores specific configuration values related to Anthropic usage in the
 * application, helping in maintaining consistency and ease of updates.
 *
 * @enum openAI
 *
 * @member CLAUDE_3_SONNET_20240229 - Identifier for the specific Anthropic model version used.
 * @member BASIC_CHAT_ANTHROPIC_TEMPERATURE - Controls the randomness in the model's responses,
 *                                         with a higher value resulting in more random responses.
 */
export enum anthropic {
  CLAUDE_3_SONNET_20240229 = 'claude-3-sonnet-20240229',
  BASIC_CHAT_ANTHROPIC_TEMPERATURE = 0.8,
}

export enum vercelRolesAnthropic {
  user = 'user',
  assistant = 'assistant',
}
