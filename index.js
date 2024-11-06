const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const LINKS = require("./data");

const TelegramBot = require("node-telegram-bot-api");
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token);

// Middleware to parse incoming requests
app.use(cors());
app.use(bodyParser.json());

// Set the bot to use a webhook instead of polling
const url = process.env.APP_URL;
const port = process.env.PORT || 8000;

// Set the webhook with Telegram
bot.setWebHook(`${url}/bot${token}`);

// Define the landing page content
const landingPageContent = `
*Welcome to Polyverse!*

Explore the different sections of our website:
`;

// Define the /start command handler
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  console.log("0", chatId);
  bot.sendMessage(chatId, landingPageContent);
});

// Listen for new members in the channel
bot.on("message", (msg) => {
  if (msg.new_chat_members) {
    msg.new_chat_members.forEach((newMember) => {
      const chatId = msg.chat.id;
      const welcomeMessage = `Welcome ${
        newMember.first_name || "User"
      } to the channel! 🎉`;
      bot.sendMessage(chatId, welcomeMessage);

      const instructionsMessage = `
       Hi ${
         newMember.first_name || "there"
       }! 🎉\nPlease start the bot by clicking below button to begin interacting.
       `;

      const keyboard = {
        inline_keyboard: [
          [
            {
              text: "Start Chatting",
              url: `https://t.me/polyverse_support_bot?start=start`,
            },
          ],
        ],
      };

      bot.sendMessage(chatId, instructionsMessage, {
        reply_markup: keyboard,
      });
    });
  }
});

// Webhook endpoint to receive updates from Telegram
app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body); // Process incoming updates
  res.sendStatus(200);
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
