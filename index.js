// const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const LINKS = require("./data");

const TelegramBot = require("node-telegram-bot-api");
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const sendMessage = (val, chatId) => {
  const link = LINKS.find((item) => item.name == val);
  bot.sendMessage(chatId, link.title, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: link.text,
            url: link.url,
          },
        ],
      ],
    },
  });
};

// Use CORS middleware
app.use(cors());

app.use(bodyParser.json());

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  // Send the landing page content with the bot menu
  bot.sendMessage(chatId, landingPageContent);

  app.post("/get_chat_id", (req, res) => {
    res.status(200).send(chatId);
  });

  app.post("/data_received", (req, res) => {
    const val = req.body.val;
    const chatIdReceived = req.body.chatId;
    console.log(chatIdReceived);
    if (chatIdReceived == chatId) {
      sendMessage(val, chatId);
    }

    res.status(200).send("Data received");
  });
});

app.listen(process.env.PORT || 8000, () => {
  console.log("Server started on port 8000");
});
