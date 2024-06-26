import { ChatMistralAI } from "@langchain/mistralai";
import { AIMessage } from "@langchain/core/messages";
import { HumanMessage } from "@langchain/core/messages";
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import dotenv from 'dotenv';

dotenv.config();



const apiKey = process.env.MISTRAL_API_KEY
// const organization = process.env.OPENAI_ORGANIZATION_ID;

if (!apiKey) {
  console.error('Erreur : OPENAI_API_KEY n\'est pas définie');
  process.exit(1);
}

const model = new ChatMistralAI({
  model: "mistral-large-latest",
  temperature: 0,
  // apiKey:apiKey
});
const response = await model.invoke([
  new HumanMessage({ content: "Hi! I'm Bob" }),
  new AIMessage({ content: "Hello Bob! How can I assist you today?" }),
  new HumanMessage({ content: "What's my name?" }),
]);
console.log(response)

const messageHistories= {};
const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a helpful assistant who remembers all details the user shares with you.`,
  ],
  ["placeholder", "{chat_history}"],
  ["human", "{input}"],
]);

const chain = prompt.pipe(model);

const withMessageHistory = new RunnableWithMessageHistory({
  runnable: chain,
  getMessageHistory: async (sessionId) => {
    if (messageHistories[sessionId] === undefined) {
      messageHistories[sessionId] = new InMemoryChatMessageHistory();
    }
    return messageHistories[sessionId];
  },
  inputMessagesKey: "input",
  historyMessagesKey: "chat_history",
});