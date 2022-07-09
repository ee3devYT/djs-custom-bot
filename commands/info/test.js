const { Command } = require("../../utils/command/command");
const { MessageEmbed } = require("discord.js");
const decorator = require("../../Data/decorator");
module.exports = new Command({
  // options
  name: "test",
  description: `Test Command`,
  userPermissions: ["SEND_MESSAGES"],
  botPermissions: ["SEND_MESSAGES"],
  category: "Info",
  cooldown: 10,
  // command start
  run: async ({ interaction}) => {
    const embed = new MessageEmbed()
    .setColor(decorator.colours.default)
    .setDescription(`Hi`)
    .setFooter({ text: decorator.embed.footerText, iconURL: decorator.embed.icon })

    interaction.followUp({ embeds: [embed] });
  },
});
