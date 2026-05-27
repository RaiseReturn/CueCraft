'use server';
/**
 * @fileOverview Image generation flow using Replicate's Flux Schnell.
 *
 * - generateImage - A function to generate images based on a prompt.
 * - GenerateImageInput - The input type for the generateImage function.
 * - GenerateImageOutput - The return type for the generateImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImageInputSchema = z.object({
  prompt: z.string().describe('The prompt to generate an image from.'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

const GenerateImageOutputSchema = z.object({
  imageUrl: z.string().describe('The URL of the generated image.'),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

export async function generateImage(input: GenerateImageInput): Promise<GenerateImageOutput> {
  return generateImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateImagePrompt',
  input: {schema: GenerateImageInputSchema},
  output: {schema: GenerateImageOutputSchema},
  prompt: `Generate an image based on the following prompt: {{{prompt}}}`,
});

const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async input => {
    // Placeholder for Replicate Flux Schnell API call
    // Replace with actual Replicate API call
    const {media} = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: input.prompt,
    });
    if (!media?.url) {
      throw new Error('No image URL returned from Replicate.');
    }
    return {imageUrl: media.url};
  }
);
