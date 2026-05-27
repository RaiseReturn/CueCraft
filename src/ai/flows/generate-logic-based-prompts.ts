'use server';
/**
 * @fileOverview A flow for generating a final, structured prompt from refined UI inputs.
 *
 * - generateLogicBasedPrompt - A function that handles the final prompt generation process.
 * - GenerateLogicBasedPromptInput - The input type for the generateLogicBasedPrompt function.
 * - GenerateLogicBasedPromptOutput - The return type for the generateLogicBasedPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLogicBasedPromptInputSchema = z.object({
  prompt: z.string().describe('A JSON string representing the refined prompt details from the UI.'),
  model: z.string().describe('The target AI model for which to generate the structured prompt.'),
});
export type GenerateLogicBasedPromptInput = z.infer<typeof GenerateLogicBasedPromptInputSchema>;

const GenerateLogicBasedPromptOutputSchema = z.object({
  generatedPrompt: z.string().describe('The final, structured prompt ready to be used with the target AI model.'),
});
export type GenerateLogicBasedPromptOutput = z.infer<typeof GenerateLogicBasedPromptOutputSchema>;

export async function generateLogicBasedPrompt(input: GenerateLogicBasedPromptInput): Promise<GenerateLogicBasedPromptOutput> {
  return generateLogicBasedPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLogicBasedPromptPrompt',
  input: {schema: GenerateLogicBasedPromptInputSchema},
  output: {schema: GenerateLogicBasedPromptOutputSchema},
  prompt: `You are a world-class prompt engineer. Your task is to synthesize a set of structured details into a single, cohesive, and highly effective prompt for the target AI model '{{{model}}}'.

The user has provided the following details in JSON format:
\'\'\'json
{{{prompt}}}
\'\'\'

Based on these details, construct the best possible prompt.
- The prompt must be optimized for the specific capabilities and syntax of the '{{{model}}}' model.
- For example, if the model is Midjourney, use parameters like '--ar' for aspect ratio. If it's a text model, structure it with clear sections like "Role", "Task", "Format", "Constraints".
- Combine all the elements into a coherent and fluent narrative or set of instructions.
- Do NOT output any explanation or commentary. Only output the final prompt text.

Final prompt for {{{model}}}:`,
});

const generateLogicBasedPromptFlow = ai.defineFlow(
  {
    name: 'generateLogicBasedPromptFlow',
    inputSchema: GenerateLogicBasedPromptInputSchema,
    outputSchema: GenerateLogicBasedPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
