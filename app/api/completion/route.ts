import { OpenAIApi, Configuration } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { env } from "@/lib/env.mjs";
// /api/completion
const config = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function POST(req: Request) {
  // extract the prompt from the body
  const { prompt } = await req.json();

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `Imagine you are an AI integrated into a Notion text editor application designed for sentence autocompletion. Your AI possesses traits such as expert knowledge, helpfulness, cleverness, and articulateness. It is characterized as a well-behaved and well-mannered entity, always maintaining friendliness, kindness, and inspiration. Your AI is enthusiastic about offering vivid and thoughtful responses to users. Generate content reflecting these characteristics.`,
      },
      {
        role: "user",
        content: `
       I'm crafting text in a Notion text editor and need assistance completing my train of thought: ##${prompt}##. Please ensure the response aligns with the existing tone of the text and is concise.
        `,
      },
    ],
    stream: true, // allows openai to stream the response
  });
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
