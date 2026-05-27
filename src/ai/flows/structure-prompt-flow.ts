'use server';
/**
 * @fileOverview A flow for analyzing a simple prompt and breaking it down into a structured format for UI-based refinement.
 *
 * - structurePrompt - A function that handles the prompt analysis process.
 * - StructurePromptInput - The input type for the structurePrompt function.
 * - StructurePromptOutput - The return type for the structurePrompt function.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StructurePromptInputSchema = z.object({
  simplePrompt: z.string().describe("The user's simple, natural language prompt."),
  model: z.string().describe('The target AI model for which to structure the prompt.'),
});
export type StructurePromptInput = z.infer<typeof StructurePromptInputSchema>;

const ElementSchema = z.object({
    label: z.string().describe("A descriptive label for the UI element, e.g., 'Main Character'."),
    value: z.string().or(z.array(z.string())).describe("The extracted value(s), e.g., 'A clever crow' or ['Funny', 'Comedic']."),
    description: z.string().optional().describe("A short hint for the user about this element."),
    type: z.enum(['input', 'textarea', 'select']).optional().describe("A hint for the UI on how to render this element."),
});

const StructurePromptOutputSchema = z.object({
  promptElements: z.array(ElementSchema).describe('An array of core elements extracted from the prompt.'),
  technicalParams: z.array(ElementSchema).describe('An array of technical parameters relevant to the selected model.'),
});
export type StructurePromptOutput = z.infer<typeof StructurePromptOutputSchema>;


export async function structurePrompt(input: StructurePromptInput): Promise<StructurePromptOutput> {
  return structurePromptFlow(input);
}


const structurePromptFlow = ai.defineFlow(
  {
    name: 'structurePromptFlow',
    inputSchema: StructurePromptInputSchema,
    outputSchema: StructurePromptOutputSchema,
  },
  async (input) => {
    const prompt = ai.definePrompt({
        name: 'structurePromptInternalPrompt',
        input: {schema: StructurePromptInputSchema},
        output: {schema: StructurePromptOutputSchema},
        prompt: `You are an expert prompt engineer. Analyze the user's simple prompt for the target AI model '{{{model}}}'.
        Break it down into structured elements and technical parameters that a user can refine in a UI.

        User's simple prompt: "{{{simplePrompt}}}"

        1.  **Analyze the prompt's intent.** Is it for video, image, text, code?
        2.  **Extract key entities and concepts.** These will become 'promptElements'. Use descriptive labels.
        3.  **Determine relevant technical parameters** for the '{{{model}}}' model. These become 'technicalParams'. For video models (Sora), include 'Aspect Ratio', 'Duration', 'Style'. For image models (Midjourney), include 'Aspect Ratio', 'Style', 'Artist Influence'. For text models (GPT-4), include 'Format', 'Tone', 'Audience'.
        4.  **Provide suggested values.** If a value is a suggestion from a list of options (e.g., aspect ratio), provide an array of strings. If it's an extracted value, provide a single string.
        5.  **Suggest a UI type.** For each element, suggest 'input' for single lines, 'textarea' for multi-line text, or 'select' for a list of options.
        6.  **Return a JSON object** that conforms to the required output schema.

        Example for a video prompt:
        Prompt: "make a funny video where crow teaching people not to spit on public place"
        Model: "sora"
        Expected Output:
        {
            "promptElements": [
                { "label": "Main Character", "value": "A clever crow", "type": "input", "description": "The protagonist of the story." },
                { "label": "Core Action", "value": "Teaching people not to spit in a funny way", "type": "textarea", "description": "What is the main event or action?" },
                { "label": "Setting", "value": "A busy public park or square", "type": "input", "description": "Where does the story take place?" },
                { "label": "Tone", "value": ["Funny", "Comedic", "Light-hearted"], "type": "select", "description": "The emotional mood of the video." }
            ],
            "technicalParams": [
                { "label": "Aspect Ratio", "value": ["16:9", "9:16", "1:1"], "type": "select" },
                { "label": "Duration", "value": ["10 seconds", "30 seconds", "1 minute"], "type": "select" },
                { "label": "Video Style", "value": ["Cinematic", "Documentary-style", "Animated"], "type": "select" }
            ]
        }
        `,
    });

    const {output} = await prompt(input);
    return output!;
  }
);
