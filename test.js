import { config } from "dotenv";
import { ChatMistralAI } from "@langchain/mistralai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
config();


const chatModel = new ChatMistralAI({
  model: "mistral-large-latest",
  temperature: 0,
  // apiKey:apiKey
});
const outputParser = new StringOutputParser();

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a world class documentation assistant only. Do not answer any other questions asides on documentation.`,
  ],
  ["placeholder", "{chat_history}"],
  ["human", "{input}"],
]);



const chain = await prompt.pipe(chatModel).pipe(outputParser);

const result = await chain.invoke({
  input: "bonjour dit moi plus sur  mistral ai",
  chat_history: [],
})


console.log(result);