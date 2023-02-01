// @ts-nocheck
require("dotenv").config();
const { Client } = require("discord.js");
const client = new Client();
const config = process.env;

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

client.on("message", (message) => {
  // You can add any conditions or checks here to determine if a direct message should be sent
  if (message.content) {
    // console.log(message);
    // message.author.createDM().then((dmChannel) => {
    //   dmChannel.send("Hello, this is a direct message!");
    // });
    message.react("✅");
  }
});

client.login(config.botToken);
