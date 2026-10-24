import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Support base64 image payloads up to 25MB
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Shared server-side Gemini client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Health and capability check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    models: {
      generate: 'gemini-3-pro-image-preview',
      edit: 'gemini-nano-banana-2.1',
    },
  });
});

/**
 * Image Generation with model: gemini-3-pro-image-preview
 * Supports resolution affordance: 1K, 2K, 4K
 */
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt, imageSize = '1K', aspectRatio = '1:1' } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'A prompt string is required.' });
    }

    const validSizes = ['1K', '2K', '4K'];
    const chosenSize = validSizes.includes(imageSize) ? imageSize : '1K';
    const validAspectRatios = ['1:1', '3:4', '4:3', '16:9', '9:16'];
    const chosenAspectRatio = validAspectRatios.includes(aspectRatio) ? aspectRatio : '1:1';

    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: chosenAspectRatio,
          imageSize: chosenSize,
        },
      },
    });

    let imageUrl: string | null = null;
    let mimeType = 'image/png';
    let textFeedback = '';

    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData?.data) {
          mimeType = part.inlineData.mimeType || 'image/png';
          imageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
          break;
        } else if (part.text) {
          textFeedback += part.text;
        }
      }
    }

    if (!imageUrl) {
      return res.status(502).json({
        error: 'The model responded without an image.',
        details: textFeedback || 'No image part found in model response.',
      });
    }

    return res.json({
      imageUrl,
      mimeType,
      imageSize: chosenSize,
      aspectRatio: chosenAspectRatio,
      modelUsed: 'gemini-3-pro-image-preview',
    });
  } catch (error: any) {
    console.error('Error generating image:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate image with gemini-3-pro-image-preview',
    });
  }
});

/**
 * Image Edit & Text-to-Image with model: gemini-nano-banana-2.1
 * Supports resolution affordance: 1K, 2K, 4K
 */
app.post('/api/edit-image', async (req, res) => {
  try {
    const { prompt, imageBase64, mimeType = 'image/png', imageSize = '1K', aspectRatio = '1:1' } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'A prompt string is required.' });
    }

    const validSizes = ['1K', '2K', '4K'];
    const chosenSize = validSizes.includes(imageSize) ? imageSize : '1K';
    const validAspectRatios = ['1:1', '3:4', '4:3', '16:9', '9:16'];
    const chosenAspectRatio = validAspectRatios.includes(aspectRatio) ? aspectRatio : '1:1';

    const ai = getGeminiClient();

    const parts: any[] = [];

    // If source image is provided, strip data URI prefix if present
    if (imageBase64 && typeof imageBase64 === 'string') {
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
      parts.push({
        inlineData: {
          data: cleanBase64,
          mimeType,
        },
      });
    }

    parts.push({
      text: prompt,
    });

    const response = await ai.models.generateContent({
      model: 'gemini-nano-banana-2.1',
      contents: {
        parts,
      },
      config: {
        imageConfig: {
          aspectRatio: chosenAspectRatio,
          imageSize: chosenSize,
        },
      },
    });

    let imageUrl: string | null = null;
    let returnedMime = mimeType;
    let textFeedback = '';

    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData?.data) {
          returnedMime = part.inlineData.mimeType || mimeType;
          imageUrl = `data:${returnedMime};base64,${part.inlineData.data}`;
          break;
        } else if (part.text) {
          textFeedback += part.text;
        }
      }
    }

    if (!imageUrl) {
      return res.status(502).json({
        error: 'The model responded without an image.',
        details: textFeedback || 'No image part found in model response.',
      });
    }

    return res.json({
      imageUrl,
      mimeType: returnedMime,
      imageSize: chosenSize,
      aspectRatio: chosenAspectRatio,
      modelUsed: 'gemini-nano-banana-2.1',
    });
  } catch (error: any) {
    console.error('Error editing image:', error);
    return res.status(500).json({
      error: error.message || 'Failed to edit image with gemini-nano-banana-2.1',
    });
  }
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  const portNumber = Number(process.env.PORT) || 3000;
  app.listen(portNumber, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${portNumber}`);
  });
}

startServer();
