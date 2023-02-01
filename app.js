const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const config = process.env;

const app = express();
app.use(bodyParser.json());

// @ts-ignore
app.get("/", async (req, res) => {
  res.status(201).end();
});

// app.post("/webhook", async (req, res) => {
//   const issueEventTypeName = await req.body["issue_event_type_name"];
//   console.log(Object.keys(req.body));
//   if (issueEventTypeName == "issue_assigned") {
//     console.log(JSON.stringify(req.body, null, 2));
//     console.log(issueEventTypeName);
//   }
//   res.send("OK");
// });

app.post("/webhook", async (req, res) => {
  // console.log(JSON.stringify(req.body,null,2))
  const issue_event_type_name = await req.body["issue_event_type_name"];
  if (issue_event_type_name == "issue_assigned") {
    // @ts-ignore
    jiraName = await req.body.changelog.items[0].toString;
    // @ts-ignore
    workName = await req.body.issue.fields.summary;
    // @ts-ignore
    projectName = await req.body.issue.fields.project.name;
    // @ts-ignore
    projectDescription = await req.body.issue.fields.description;
    // console.log("jiraName : ", jiraName);
    // console.log("workName : ", workName);
    // console.log("projectName : ", projectName);
    // console.log("projectDescription :", projectDescription);
    // @ts-ignore
    fs.readFile("./data.json", "utf8", async (err, dataUser) => {
      if (err) {
        console.log("File read failed:", err);
        return;
      }
      // @ts-ignore
      dataUserParse = await JSON.parse(dataUser);
      // @ts-ignore
      if (dataUserParse[jiraName]) {
        // @ts-ignore
        const guild = client.guilds.cache.first();
        // @ts-ignore
        guild.members.fetch().then((members) => {
          guild.members.cache.filter((member) => !member.user.bot);
          // @ts-ignore
          const user = client.users.cache.get(dataUserParse[jiraName]);
          if (user) {
            user.createDM().then(async (dmChannel) => {
              // @ts-ignore
              const exampleEmbed = new EmbedBuilder()
                .setColor(0x0099ff)
                // @ts-ignore
                .setTitle(`${projectName}`)
                .setDescription("ได้รับมอบหมายงาน")
                .addFields({
                  // @ts-ignore
                  name: `${workName}`,
                  // @ts-ignore
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

app.listen(config.port, () => {
  console.log(`Jira App Listening on port ${config.port}`);
});
