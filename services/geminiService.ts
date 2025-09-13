
import { GoogleGenAI, Modality } from "@google/genai";
import { StyleOption } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const getPromptForStyle = (style: StyleOption): string => {
  switch (style) {
    case StyleOption.PENCIL:
      return 'Transform this image into a detailed, high-contrast black and white pencil drawing.';
    case StyleOption.OIL:
      return 'Convert this photo into an oil painting with thick, visible brushstrokes and rich colors.';
    case StyleOption.ANIME:
      return 'Redraw this image in a vibrant, modern anime style with clean lines and cell shading.';
    case StyleOption.VINTAGE:
      return 'Make this image look like a faded, sepia-toned vintage photograph from the early 20th century.';
    case StyleOption.CUBIST:
      return 'Reimagine this image in the style of a Cubist painting, with fragmented objects and abstract forms.';
    case StyleOption.POP_ART:
      return 'Transform this image into a bold, colorful Pop Art piece, reminiscent of Andy Warhol\'s work.';
    default:
      return 'Transform this image.';
  }
};

const base64ToGenerativePart = (imageData: string, mimeType: string) => {
  return {
    inlineData: {
      data: imageData.split(',')[1],
      mimeType,
    },
  };
};

export const applyStyleTransfer = async (base64Image: string, mimeType: string, style: StyleOption): Promise<string> => {
  try {
    const imagePart = base64ToGenerativePart(base64Image, mimeType);
    const textPart = { text: getPromptForStyle(style) };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [imagePart, textPart],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData && part.inlineData.data) {
        const newMimeType = part.inlineData.mimeType;
        const newImageData = part.inlineData.data;
        return `data:${newMimeType};base64,${newImageData}`;
      }
    }
    
    // Fallback if no image is found in parts, check text for error
    for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          throw new Error(`API returned text instead of image: ${part.text}`);
        }
    }

    throw new Error('No image data found in the API response.');
  } catch (error) {
    console.error('Error applying style transfer:', error);
    if (error instanceof Error) {
        return Promise.reject(error);
    }
    return Promise.reject(new Error('An unknown error occurred during style transfer.'));
  }
};
