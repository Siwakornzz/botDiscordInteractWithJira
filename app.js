const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const config = process.env;

const app = express();
app.use(bodyParser.json());
app.post("/webhook", async (req, res) => {
  const issueEventTypeName = await req.body["issue_event_type_name"];
  console.log(Object.keys(req.body));
  if (issueEventTypeName == "issue_assigned") {
    console.log(JSON.stringify(req.body, null, 2));
    console.log(issueEventTypeName);
  }
  res.send("OK");
});

app.listen(config.port, () => {
  console.log(`Jira App Listening on port ${config.port}`);
});
