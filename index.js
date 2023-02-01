// @ts-nocheck
require("dotenv").config();
const { Client, MessageEmbed } = require("discord.js");
const client = new Client();
const config = process.env;
const fs = require("fs");

require("./app");

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
        // const exampleEmbed = new MessageEmbed()
        //   .setColor("#0099ff")
        //   .setTitle("Custom Template")
        //   .setDescription(
        //     "This is a custom message template created using Discord.js"
        //   )
        //   .setThumbnail("https://i.imgur.com/wSTFkRM.png")
        //   .addFields(
        //     { name: "Regular field title", value: "Some value here" },
        //     { name: "\u200B", value: "\u200B" },
        //     {
        //       name: "Inline field title",
        //       value: "Some value here",
        //       inline: true,
        //     },
        //     {
        //       name: "Inline field title",
        //       value: "Some value here",
        //       inline: true,
        //     }
        //   )
        //   .setImage("https://i.imgur.com/wSTFkRM.png")
        //   .setTimestamp()
        //   .setFooter(
        //     "Custom Template Footer Text",
        //     "https://i.imgur.com/wSTFkRM.png"
        //   );
        // // console.log(user);
        // user.createDM().then((dmChannel) => {
        //   dmChannel.send(exampleEmbed);
        // });
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

// client.on("message", async (message) => {
//   if (message) {
//     if (message.content.includes("!register")) {
//       // !register username
//       const username_jira = message.content.replace("!register", "").trim();
//       const Id_Discord = message.guildId;
//       await fs.readFile("./data.json", "utf8", async (err, dataUser) => {
//         if (err) {
//           console.log("File read failed:", err);
//           return;
//         }
//         console.log("File data:", dataUser);
//         const dataUserParse = await JSON.parse(dataUser);
//         dataUserParse[username_jira] = Id_Discord;
//         await fs.writeFile(
//           "./data.json",
//           JSON.stringify(dataUserParse, null, 2),
//           (err) => {
//             if (err) {
//               console.log("Error writing file", err);
//             } else {
//               console.log("Successfully wrote file");
//             }
//           }
//         );
//       });
//     } else if (message.content.includes("!updateuser")) {
//       // !updateuser old_user => new_user
//       const username_jira = message.content
//         .replace("!updateuser", "")
//         .trim()
//         .split("=>");
//       const old_username_jira = username_jira[0].trim();
//       const new_username_jira = username_jira[1].trim();
//       const Id_Discord = message.guildId;
//       await fs.readFile("./data.json", "utf8", async (err, dataUser) => {
//         if (err) {
//           console.log("File read failed:", err);
//           return;
//         }
//         console.log("File data:", dataUser);
//         const dataUserParse = await JSON.parse(dataUser);
//         delete dataUserParse[old_username_jira];
//         dataUserParse[new_username_jira] = Id_Discord;
//         await fs.writeFile(
//           "./data.json",
//           JSON.stringify(dataUserParse, null, 2),
//           (err) => {
//             if (err) {
//               console.log("Error writing file", err);
//             } else {
//               console.log("Successfully wrote file");
//             }
//           }
//         );
//       });
//     }
//   }
// });

client.on("message", async (message) => {
  if (message) {
    if (message.content.includes("!register")) {
      // !register username
      username_jira = message.content.replace("!register", "").trim();
      Id_Discord = message.author.id;
      fs.readFile("./data.json", "utf8", async (err, dataUser) => {
        if (err) {
          console.log("File read failed:", err);
          return;
        }
        console.log("File data:", dataUser);
        dataUserParse = await JSON.parse(dataUser);
        dataUserParse[username_jira] = Id_Discord;
        fs.writeFile(
          "./data.json",
          JSON.stringify(dataUserParse, null, 2),
          (err) => {
            if (err) {
              console.log("Error writing file", err);
              message.react("❌");
            } else {
              console.log("Successfully wrote file");
              message.react("✅");
            }
          }
        );
      });
    } else if (message.content.includes("!updateuser")) {
      // !updateuser old_user => new_user
      username_jira = message.content
        .replace("!updateuser", "")
        .trim()
        .split("=>");
      old_username_jira = username_jira[0].trim();
      new_username_jira = username_jira[1].trim();
      Id_Discord = message.author.id;
      fs.readFile("./data.json", "utf8", async (err, dataUser) => {
        if (err) {
          console.log("File read failed:", err);
          return;
        }
        dataUserParse = await JSON.parse(dataUser);
        old_id = dataUserParse[old_username_jira];
        delete dataUserParse[old_username_jira];
        dataUserParse[new_username_jira] = old_id;
        fs.writeFile(
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
    } else if (message.content.includes("!deleteuser")) {
      // !updateuser old_user => new_user
      username_jira = await message.content.replace("!deleteuser", "").trim();
      Id_Discord = await message.author.id;
      fs.readFile("./data.json", "utf8", async (err, dataUser) => {
        if (err) {
          console.log("File read failed:", err);
          return;
        }
        dataUserParse = await JSON.parse(dataUser);
        delete dataUserParse[username_jira];
        fs.writeFile(
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
