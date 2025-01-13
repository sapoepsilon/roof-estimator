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
    console.log("Starting roof analysis...");
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "You are a roof measurement expert. Analyze this satellite image of a roof and provide measurements in a JSON format with the following fields:\n\n" +
                "- area_sq_ft: number (roof area in square feet)\n" +
                "- perimeter_ft: number (roof perimeter in feet)\n" +
                "- pitch_degrees: number (roof pitch in degrees)\n" +
                "- confidence_level: number (between 0 and 1)\n\n" +
                "The measurements should be realistic for a residential roof. Return ONLY a JSON object with these exact field names.",
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
                detail: "high"
              },
            },
          ],
        },
      ],
      max_tokens: 300,
      temperature: 0,
      response_format: { type: "json_object" },
    });

    console.log("OpenAI response received:", response.choices[0].message);

    if (!response.choices?.[0]?.message?.content) {
      throw new Error("Invalid response from OpenAI");
    }

    const content = response.choices[0].message.content;
    console.log("OpenAI response content:", content);

    const result = JSON.parse(content);

    // Validate the result has all required fields
    if (
      !result.area_sq_ft ||
      !result.perimeter_ft ||
      !result.pitch_degrees ||
      result.confidence_level === undefined
    ) {
      throw new Error("Invalid measurements in OpenAI response");
    }

    // Ensure values are reasonable
    if (
      result.area_sq_ft <= 0 ||
      result.perimeter_ft <= 0 ||
      result.pitch_degrees < 0 ||
      result.confidence_level < 0 ||
      result.confidence_level > 1
    ) {
      throw new Error("Invalid measurement values in OpenAI response");
    }

    return {
      measurements: {
        area: result.area_sq_ft,
        perimeter: result.perimeter_ft,
        pitch: result.pitch_degrees,
        confidence: result.confidence_level,
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
