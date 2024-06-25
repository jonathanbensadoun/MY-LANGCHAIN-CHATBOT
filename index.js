import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
const organization = process.env.OPENAI_ORGANIZATION_ID;

if (!apiKey) {
  console.error('Erreur : OPENAI_API_KEY n\'est pas définie');
  process.exit(1);
}

const model = new ChatOpenAI({
  model: "babbage-002",
  apiKey: apiKey,
  organization: organization, // Add the organization parameter
});

(async () => {
  try {
    const response = await model.invoke([new HumanMessage({ content: "Hi! I'm Jo" })]);
    console.log(response);
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.error('Erreur : Vous avez dépassé votre quota. Veuillez vérifier votre plan et vos détails de facturation.');
    } else if (error.response) {
      console.error(`Erreur lors de l'appel au modèle : ${error.response.status} ${error.response.statusText}`);
    } else {
      console.error('Erreur lors de l\'appel au modèle :', error.message);
    }
  }
})();
