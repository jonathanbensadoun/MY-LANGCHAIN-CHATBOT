const axios = require('axios');

async function sendMessageWithRetry(message, retries = 3, delay = 1000) {
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: "You are a helpful assistant." }, { role: "user", content: message }]
    }, {
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 429 && retries > 0) {
      console.log(`Rate limit exceeded. Retrying in ${delay} ms...`);
      await new Promise(res => setTimeout(res, delay));
      return sendMessageWithRetry(message, retries - 1, delay * 2);
    } else {
      throw error;
    }
  }
}

sendMessageWithRetry("Hi! I'm Bob.")
  .then(response => console.log(response))
  .catch(error => console.error(error));
