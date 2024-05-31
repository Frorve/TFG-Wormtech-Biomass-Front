const API_KEY = "sk-proj-F0yOkVYZLIunlGdZ6o8IT3BlbkFJMgqMkKBMoOmwqmIuVHtS";
const API_URL = "https://api.openai.com/v1/chat/completions";

async function sendMessage(msg) {
  const apiRequestBody = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: msg }],
    max_tokens: 150,
    temperature: 0.7,
  };

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(apiRequestBody),
  });

  const data = await response.json();
  if (response.ok) {
    return data.choices[0]?.message?.content.trim();
  } else {
    throw new Error(data.error?.message || "Error fetching from OpenAI API");
  }
}

module.exports = { sendMessage };
