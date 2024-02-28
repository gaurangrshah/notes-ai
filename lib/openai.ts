import { Configuration, OpenAIApi } from "openai-edge";
import { uploadFileFromUrlToPublicRepo } from "@/lib/git";
import { slugify } from "./utils";
import { env } from "./env.mjs";

const config = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function generateImagePrompt(name: string) {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Generate visually appealing and minimalistic thumbnail images for digital notebooks with a focus on decorative aesthetics. The images should be attractive and suitable for various topics. Incorporate subtle design elements, textures, or patterns that enhance the overall aesthetic combined with the usage of a harmonious color palette. Ensure the images maintain a clean and simple look while conveying a sense of sophistication.",
        },
        {
          role: "user",
          content: `Please generate a thumbnail description for my notebook titles ${name}`,
        },
      ],
    });
    const data = await response.json();
    const image_description = data.choices[0].message.content;
    return image_description as string;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function generateImage(image_description: string, name: string) {
  try {
    const response = await openai.createImage({
      // calling the DALL-E api
      prompt: image_description,
      n: 1,
      size: "256x256",
    });
    const data = await response.json();
    const image_url = data.data[0].url;
    console.log("uploading image from", image_url);
    const timestamp = new Date().toISOString().replace(/:/g, "-");

    const result = uploadFileFromUrlToPublicRepo({
      repoOwner: "gaurangrshah",
      imageUrl: image_url,
      fileName: slugify(name) + "-" + timestamp + ".jpg",
    });

    const cdnlink = await result;
    console.log("🚀 | cdnlink:", cdnlink);
    return cdnlink;
    // return image_url as string;
  } catch (error) {
    console.error(error);
  }
}
