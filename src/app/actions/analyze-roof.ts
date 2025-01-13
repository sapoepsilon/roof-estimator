"use server";

import { OpenAI } from "openai";

export interface RoofMeasurements {
  area: number; 
  perimeter: number;
  pitch: number;
  confidence: number;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeRoofImage(
  imageBase64: string
): Promise<{ measurements: RoofMeasurements; error?: string }> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this satellite image of a roof and provide the following measurements in a JSON format: area (in square feet), perimeter (in feet), pitch (in degrees), and confidence level (0-1). Only respond with the JSON object.",
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
      max_tokens: 300,
      temperature: 0,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      measurements: {
        area: result.area || 0,
        perimeter: result.perimeter || 0,
        pitch: result.pitch || 0,
        confidence: result.confidence || 0,
      },
    };
  } catch (error) {
    console.error("Error analyzing roof image:", error);
    return {
      measurements: {
        area: 0,
        perimeter: 0,
        pitch: 0,
        confidence: 0,
      },
      error:
        error instanceof Error ? error.message : "Failed to analyze roof image",
    };
  }
}
