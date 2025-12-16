'use server';

/**
 * @fileOverview A GenAI powered prompt to guide new users on providing relevant inputs for accurate crop recommendations.
 *
 * - initialRecommendationPrompt - A function that generates a guide for new users.
 * - InitialRecommendationInput - The input type for the initialRecommendationPrompt function.
 * - InitialRecommendationOutput - The return type for the initialRecommendationPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InitialRecommendationInputSchema = z.object({
  /* No Input Required */
});

export type InitialRecommendationInput = z.infer<typeof InitialRecommendationInputSchema>;

const InitialRecommendationOutputSchema = z.object({
  recommendationGuide: z.string().describe('A guide for new users on providing relevant inputs for crop recommendations.'),
});

export type InitialRecommendationOutput = z.infer<typeof InitialRecommendationOutputSchema>;

export async function initialRecommendationPrompt(
  input: InitialRecommendationInput
): Promise<InitialRecommendationOutput> {
  return initialRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'initialRecommendationPrompt',
  input: {schema: InitialRecommendationInputSchema},
  output: {schema: InitialRecommendationOutputSchema},
  prompt: `You are an AI assistant designed to guide new users on how to effectively use a crop recommendation application.

  Provide a clear and concise guide explaining which inputs are most relevant for generating accurate crop recommendations.
  Focus on the importance of parameters such as N (Nitrogen), P (Phosphorus), K (Potassium), Temperature, Humidity, pH, and Rainfall.
  Explain how each parameter influences the recommendation and suggest optimal ways to measure or estimate these values.
  The output must be easily understandable for users with limited agricultural knowledge.

  Output should be friendly and encouraging, guiding users to provide accurate data.
  `,
});

const initialRecommendationFlow = ai.defineFlow(
  {
    name: 'initialRecommendationFlow',
    inputSchema: InitialRecommendationInputSchema,
    outputSchema: InitialRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
