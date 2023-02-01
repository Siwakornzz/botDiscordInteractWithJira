// @ts-nocheck
require("dotenv").config();
const { Client } = require("discord.js");
const client = new Client();
const config = process.env;
const app = require("./app");

client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  const guild = client.guilds.cache.first();

  guild.members.fetch().then((members) => {
    const memberId = guild.members.cache.filter((member) => !member.user.bot);
    for (const iterator of memberId) {
      // console.log(JSON.stringify(iterator, null, 2));
      // console.log("userId : ", iterator[0]);
      user = client.users.cache.get(iterator[0]);
      if (user) {
        // console.log(user);
        user.createDM().then((dmChannel) => {
          dmChannel.send(":)");
        });
      } else {
        console.log("not found");
      }
    }
  });
});

// client.on("message", (message) => {
//   // You can add any conditions or checks here to determine if a direct message should be sent
//   if (message.content) {
//     // console.log(message);
//     // message.author.createDM().then((dmChannel) => {
//     //   dmChannel.send("Hello, this is a direct message!");
//     // });
//     message.react("✅");
//   }
// });

client.on("message", async (message) => {
  if (message) {
    if (message.content.includes("!register")) {
      // !register username
      const username_jira = message.content.replace("!register", "").trim();
      const Id_Discord = message.guildId;
      await fs.readFile("./data.json", "utf8", async (err, dataUser) => {
        if (err) {
          console.log("File read failed:", err);
          return;
        }
        console.log("File data:", dataUser);
        const dataUserParse = await JSON.parse(dataUser);
        dataUserParse[username_jira] = Id_Discord;
        await fs.writeFile(
          "./data.json",
          JSON.stringify(dataUserParse, null, 2),
          (err) => {
            if (err) {
              console.log("Error writing file", err);
            } else {
              console.log("Successfully wrote file");
            }
          }
        );
      });
    } else if (message.content.includes("!updateuser")) {
      // !updateuser old_user => new_user
      const username_jira = message.content
        .replace("!updateuser", "")
        .trim()
        .split("=>");
      const old_username_jira = username_jira[0].trim();
      const new_username_jira = username_jira[1].trim();
      const Id_Discord = message.guildId;
      await fs.readFile("./data.json", "utf8", async (err, dataUser) => {
        if (err) {
          console.log("File read failed:", err);
          return;
        }
        console.log("File data:", dataUser);
        const dataUserParse = await JSON.parse(dataUser);
        delete dataUserParse[old_username_jira];
        dataUserParse[new_username_jira] = Id_Discord;
        await fs.writeFile(
          "./data.json",
          JSON.stringify(dataUserParse, null, 2),
          (err) => {
            if (err) {
              console.log("Error writing file", err);
            } else {
              console.log("Successfully wrote file");
            }
          }
        );
      });
    }
  }
});

client.login(config.botToken);
