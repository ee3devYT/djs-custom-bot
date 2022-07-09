const client = require("../index");

client.on("ready", () => {
  console.log(`${client.user.username} Is Online`);
  client.user.setActivity({
    name: `/help`,
    type: "PLAYING",
  });
});
