const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

require("dotenv").config();

const config = process.env;

// bot discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  // console.log(`Logged in as ${JSON.stringify(client, null, 2)}!`);
});

client.on("messageCreate", async (message) => {
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
            } else {
              message.react("✅");
              console.log("Successfully wrote file");
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
              message.react("✅");
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
              message.react("✅");
              console.log("Successfully wrote file");
            }
          }
        );
      });
    }
  }
});

// jira webhook
const app = express();
app.use(bodyParser.json());
app.post("/webhook", async (req, res) => {
  // console.log(JSON.stringify(req.body,null,2))
  const issue_event_type_name = await req.body["issue_event_type_name"];
  if (issue_event_type_name == "issue_assigned") {
    jiraName = await req.body.changelog.items[0].toString;
    workName = await req.body.issue.fields.summary;
    projectName = await req.body.issue.fields.project.name;
    projectDescription = await req.body.issue.fields.description;
    console.log("jiraName : ", jiraName);
    console.log("workName : ", workName);
    console.log("projectName : ", projectName);
    console.log("projectDescription :", projectDescription);
    fs.readFile("./data.json", "utf8", async (err, dataUser) => {
      if (err) {
        console.log("File read failed:", err);
        return;
      }
      dataUserParse = await JSON.parse(dataUser);
      if (dataUserParse[jiraName]) {
        const guild = client.guilds.cache.first();
        console.log("guild", JSON.stringify(guild.members));
        guild.members.fetch().then((members) => {
          guild.members.cache.filter((member) => !member.user.bot);
          const user = client.users.cache.get(dataUserParse[jiraName]);
          if (user) {
            user.createDM().then(async (dmChannel) => {
              const exampleEmbed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle(`${projectName}`)
                .setDescription("ได้รับมอบหมายงาน")
                .addFields({
                  name: `${workName}`,
                  value: ` \nรายละเอียดงาน : ${projectDescription}`,
                })
                .setTimestamp();
              // dmChannel.send(`${jiraName} ได้รับมอบหมายงาน ${workName} ใน JIRA`);
              await dmChannel.send({ embeds: [exampleEmbed] });
            });
          } else {
            console.log("not found");
          }
        });
      }
    });
  }
  res.send("OK");
});

app.listen(config.PORT_JIRA_WEBHOOK, () => {
  console.log(`Jira App Listening on port ${config.PORT_JIRA_WEBHOOK}`);
});
client.login(config.TOKEN_DISCORD);
