const { MessageEmbed } = require("discord.js");
const client = require("..");
const decorator = require("../Data/decorator");
const { cooldown } = require("../handlers/functions");

client.on("interactionCreate", async (interaction) => {
  // Slash Command Handling
  if (interaction.isCommand()) {
    await interaction
      .deferReply({
        ephemeral: false,
      })
      .catch((e) => {});
    let prefix = "/";
    const cmd = client.commands.get(interaction.commandName);
    if (!cmd) return interaction.followUp({ content: "An error has occured " });

    const args = [];

    for (let option of interaction.options.data) {
      if (option.type === "SUB_COMMAND") {
        if (option.name) args.push(option.name);
        option.options?.forEach((x) => {
          if (x.value) args.push(x.value);
        });
      } else if (option.value) args.push(option.value);
    }
    interaction.member = interaction.guild.members.cache.get(
      interaction.user.id
    );
    if (cmd) {

      const userPermEmbed  = new MessageEmbed()
      .setTitle(`${decorator.defaultEmojis.error} | ERROR`)
      .setDescription(`You Don't Have \`${cmd.userPermissions}\` Permission to Use \`${cmd.name}\` Command!!`)
      .setColor(decorator.colours.error)
      .setFooter({ text: decorator.embed.footerText, iconURL: decorator.embed.icon } )

      const botPermEmbed  = new MessageEmbed()
      .setTitle(`${decorator.defaultEmojis.error} | ERROR`)
      .setDescription(`I Don't Have \`${cmd.botPermissions}\` Permission to Use \`${cmd.name}\` Command!!`)
      .setColor(decorator.colours.error)
      .setFooter({ text: decorator.embed.footerText, iconURL: decorator.embed.icon } )

     

     
      // checking user perms
      if (!interaction.member.permissions.has(cmd.userPermissions || [])) {
        return interaction.followUp({ embeds: [userPermEmbed], ephemeral:true}) 
      } else if (
        !interaction.guild.me.permissions.has(cmd.botPermissions || [])
      ) {
        return interaction.followUp({ embeds: [botPermEmbed], ephemeral:true})
      } else if (cooldown(interaction, cmd)) {

        const cdEmbed  = new MessageEmbed()
        .setTitle(`${decorator.defaultEmojis.warning} | COOLDOWN`)
        .setDescription(`You are On Cooldown , wait \`${cooldown(
          interaction,
          cmd
        ).toFixed()}\` Seconds`)
        .setColor(decorator.colours.warning)
        .setFooter({ text: decorator.embed.footerText, iconURL: decorator.embed.icon } )
        
        return interaction.followUp ({ embeds: [cdEmbed], ephemeral:true})
      } else {
        cmd.run({ client, interaction, args, prefix });
      }
    }
  }

  // Context Menu Handling
  if (interaction.isContextMenu()) {
    await interaction.deferReply({ ephemeral: false });
    const command = client.commands.get(interaction.commandName);
    if (command) command.run(client, interaction);
  }
});
