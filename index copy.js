// const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const LINKS = require("./data");

const TelegramBot = require("node-telegram-bot-api");
const token =
  process.env.BOT_TOKEN || "8024562595:AAGAS5sxe-TWkmCbYMetYOTEkmfjYWVKLPM";
const bot = new TelegramBot(token, { polling: true });

const landingPageContent = `
*Welcome to Polyverse!*

Explore the different sections of our website:

`;

// const sendMessage = (val, chatId) => {
//   const link = LINKS.find((item) => item.name == val);
//   bot.sendMessage(chatId, link.title, {
//     reply_markup: {
//       inline_keyboard: [
//         [
//           {
//             text: link.text,
//             url: link.url,
//           },
//         ],
//       ],
//     },
//   });
// };

// Use CORS middleware
app.use(cors());

app.use(bodyParser.json());

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  console.log("0", chatId);
  // Send the landing page content with the bot menu
  bot.sendMessage(chatId, landingPageContent);

  // app.post("/get_chat_id", (req, res) => {
  //   res.status(200).send(chatId);
  // });

  // app.post("/data_received", (req, res) => {
  //   console.log("1", chatId);
  //   const val = req.body.val;
  //   // const chatIdReceived = req.body.chatId;
  //   // console.log(chatIdReceived);
  //   // if (chatIdReceived == chatId) {
  //   //   sendMessage(val, chatId);
  //   // }

  //   sendMessage(val, chatId);

  //   res.status(200).send("Data received");
  // });
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
      // Ask the new member to click /start or interact with the bot
      const instructionsMessage = `
       Hi ${
         newMember.first_name || "there"
       }! 🎉\nPlease start the bot by clicking below button to begin interacting.
       `;
      console.log(bot.username);

      // Create inline keyboard with a button to encourage user to start interacting
      const keyboard = {
        inline_keyboard: [
          [
            {
              text: "Start Chatting",
              url: `https://t.me/polyverse_support_bot?start=start`, // This URL will prompt the user to open the bot with a /start command
            },
          ],
        ],
      };

      // Send a message to the new user with an inline button
      bot.sendMessage(chatId, instructionsMessage, {
        reply_markup: keyboard,
      });
    });
  }
});

app.get("/", (req, res) => {
  res.status(200).json({
    env:
      process.env.BOT_TOKEN || "8024562595:AAGAS5sxe-TWkmCbYMetYOTEkmfjYWVKLPM",
  });
});

app.listen(process.env.PORT || 8000, () => {
  console.log("Server started on port 8000");
});
