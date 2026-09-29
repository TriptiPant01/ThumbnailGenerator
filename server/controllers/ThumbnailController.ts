import { Request, Response } from "express";
import Thumbnail from "../models/Thumbnail.js";
import { GenerateContentConfig, HarmBlockThreshold, HarmCategory } from "@google/genai";
import ai from "../config/ai.js";
import path from "node:path";
import fs from "node:fs";
import {v2 as cloudinary} from 'cloudinary'

const stylePrompts = {
    'Bold & Graphic': 'eye-catching thumbnail, bold typography, vibrant colors, expressive facial reaction, dramatic lighting, high contrast, click-worthy composition, professional style',
    'Tech/Futuristic': 'futuristic thumbnail, sleek modern design, digital UI elements, glowing accents, holographic effects, cyber-tech aesthetic, sharp lighting, high-tech atmosphere',
    'Minimalist': 'minimalist thumbnail, clean layout, simple shapes, limited color palette, plenty of negative space, modern flat design, clear focal point',
    'Photorealistic': 'photorealistic thumbnail, ultra-realistic lighting, natural skin tones, candid moment, DSLR-style photography, lifestyle realism, shallow depth of field',
    'Illustrated': 'illustrated thumbnail, custom digital illustration, stylized characters, bold outlines, vibrant colors, creative cartoon or vector art style',
}
const colorSchemeDescriptions = {
    vibrant: 'vibrant and energetic colors, high saturation, bold contrasts, eye-catching palette',
    sunset: 'warm sunset tones, orange pink and purple hues, soft gradients, cinematic glow',
    forest: 'natural green tones, earthy colors, calm and organic palette, fresh atmosphere',
    neon: 'neon glow effects, electric blues and pinks, cyberpunk lighting, high contrast glow',
    purple: 'purple-dominant color palette, magenta and violet tones, modern and stylish mood',
    monochrome: 'black and white color scheme, high contrast, dramatic lighting, timeless aesthetic',
    ocean: 'cool blue and teal tones, aquatic color palette, fresh and clean atmosphere',
    pastel: 'soft pastel colors, low saturation, gentle tones, calm and friendly aesthetic',
}

export const generateThumbnail = async (req: Request, res: Response) => {
  try {
    const { userId } = req.session;
    const { title, prompt: user_prompt, style, aspect_ratio, color_scheme, text_overlay } = req.body;
    const ratio = aspect_ratio || "16:9";

    const thumbnail = new Thumbnail({
      userId,
      title,
      prompt_used: user_prompt,
      user_prompt,
      style,
      aspect_ratio: ratio,
      color_scheme,
      text_overlay,
      isGenerating: true,
    });

    // Build prompt
    let prompt = `Create a ${stylePrompts[style as keyof typeof stylePrompts]} for "${title}". `;
    if (color_scheme) {
      prompt += `Use a ${colorSchemeDescriptions[color_scheme as keyof typeof colorSchemeDescriptions]} color scheme. `;
    }
    if (user_prompt) {
      prompt += `Additional details: ${user_prompt}. `;
    }
    if (text_overlay) {
      prompt += `Include the text "${text_overlay}" in bold, highly readable lettering. `;
    }
    prompt += `The thumbnail should be ${ratio}, visually stunning, and designed to maximize click-through rate. Make it bold, professional, and impossible to ignore.`;

    // Call Gemini via OpenRouter
    const model = process.env.OPENROUTER_IMAGE_MODEL || "google/gemini-2.5-flash-image";

    const orRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        modalities: ["image", "text"],
        image_config: { aspect_ratio: ratio },
      }),
    });

    if (!orRes.ok) {
      throw new Error(`OpenRouter ${orRes.status}: ${await orRes.text()}`);
    }

    const data: any = await orRes.json();
    const imageDataUrl: string | undefined = data?.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageDataUrl) {
      console.log("OpenRouter response:", JSON.stringify(data, null, 2));
      throw new Error("No image returned from model");
    }

    // Upload directly to Cloudinary (it accepts the base64 data URL)
    const uploadResult = await cloudinary.uploader.upload(imageDataUrl, { resource_type: "image" });

    thumbnail.prompt_used = prompt;
    thumbnail.image_url = uploadResult.secure_url;
    thumbnail.isGenerating = false;
    await thumbnail.save();

    res.json({ message: "Thumbnail Generated", thumbnail });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// controllers for Thumnail Deletion
export const deleteThumnail = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userId } = req.session
        await Thumbnail.findByIdAndDelete({ _id: id, userId })
        res.json({message: 'Thumbnail deleted successfully'})

    }
    catch (err:any) {
        console.log(err)
        res.status(500).json({message: err.message})
    }
}