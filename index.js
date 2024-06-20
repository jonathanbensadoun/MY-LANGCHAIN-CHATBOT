import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error('Erreur : OPENAI_API_KEY n\'est pas définie');
  process.exit(1);
}

const model = new ChatOpenAI({
  model: "gpt-3.5-turbo",
  apiKey: apiKey
});
console.log(apiKey)

(async () => {
  try {
    const response = await model.invoke([new HumanMessage({ content: "Hi! I'm Jo" })]);
    console.log(response);
  } catch (error) {
    if (error.message.includes('429')) {
      console.error('Erreur : Vous avez dépassé votre quota. Veuillez vérifier votre plan et vos détails de facturation.');
    } else {
      console.error('Erreur lors de l\'appel au modèle :', error);
    }
  }
})();
