import { SlashCommandBuilder } from 'discord.js';
import { createEmbed } from '../../utils/embeds.js';
import { PermissionsBitField } from 'discord.js';

/**
 * /startup required_reactions: int
 * Checks staff role from guild config, enforces allowed channels from guild config,
 * posts the startup embed, pings everyone and stores session state/pending sessions on the client.
 */
export default {
  slashOnly: true,
  data: new SlashCommandBuilder()
    .setName('startup')
    .setDescription('Start a roleplay session')
    .addIntegerOption((opt) =>
      opt
        .setName('required_reactions')
        .setDescription('Number of reactions needed to start the session')
        .setRequired(true)
        .setMinValue(1),
    ),

  category: 'Session',

  async execute(interaction, guildConfig = {}, client) {
    const required = interaction.options.getInteger('required_reactions');

    // Resolve staff role ID from multiple fallbacks
    const staffRoleId = String(
      guildConfig?.roles?.staff_team ||
        // appConfig.bot spreads botConfig into client.config.bot
        client?.config?.bot?.roles?.staff_team ||
        client?.config?.roles?.staff_team ||
        process.env.STAFF_ROLE_ID ||
        ''
    );

    // If no staff role configured, inform admins how to configure it
    if (!staffRoleId) {
      // Allow Administrator users to run if no staff role is configured
      const isAdmin = interaction.member?.permissions?.has?.(PermissionsBitField.Flags.Administrator);
      if (!isAdmin) {
        await interaction.reply({ content: 'Only staff team members can use this command. No staff role is configured for this server. Ask an administrator to set `roles.staff_team` in server config or set STAFF_ROLE_ID in the bot config.', ephemeral: true });
        return;
      }
    }

    // Ensure we have an up-to-date GuildMember (handles partial/cached members)
    let member = interaction.member;
    try {
      if (!member || !member.roles) {
        member = await interaction.guild.members.fetch(interaction.user.id);
      } else if (member.fetch) {
        // refresh to ensure roles cache is current
        member = await member.fetch().catch(() => member);
      }
    } catch (err) {
      // If fetch fails, keep the original member (may be partial)
    }

    // If staffRoleId is set, verify the member has the role
    if (staffRoleId) {
      const hasStaff = Boolean(member && member.roles && member.roles.cache && member.roles.cache.has(staffRoleId));
      const isAdmin = member?.permissions?.has?.(PermissionsBitField.Flags.Administrator);

      if (!hasStaff && !isAdmin) {
        await interaction.reply({ content: `Only staff team members can use this command. You need the staff role <@&${staffRoleId}> to run this command.`, ephemeral: true });
        return;
      }
    }

    // Enforce allowed channels from guild config: channels.session_commands_channel_id / _2
    const channels = guildConfig?.channels || {};
    const allowed1 = String(channels.session_commands_channel_id || '');
    const allowed2 = String(channels.session_commands_channel_id_2 || '');

    if (allowed1 && allowed2 && ![String(interaction.channelId), String(allowed1), String(allowed2)].includes(String(interaction.channelId))) {
      await interaction.reply({
        content: `This command can only be used in <#${allowed1}> or <#${allowed2}>.`,
        ephemeral: true,
      });
      return;
    }

    // Build embed from guild embed config (keys: embeds.startup)
    const ecfg = (guildConfig?.embeds && guildConfig.embeds.startup) || {};
    const title = ecfg.title || '_Greenville Roleplay Legacy_ - ___Session Startup___';
    // replace placeholders {user} and {required} if present
    let description = ecfg.description || '';
    description = description.replace(/\{user\}/g, interaction.user?.toString() || '')
                             .replace(/\{required\}/g, String(required));
    const embed = createEmbed({
      title,
      description,
      color: 'success',
    });
    if (ecfg.image_url) embed.setImage(ecfg.image_url);
    embed.setFooter({ text: guildConfig?.bot?.footer_text || '', iconURL: guildConfig?.bot?.footer_icon || '' });

    // Reply to invoker, then post the announcement (ping everyone)
    await interaction.reply({ content: 'Startup initiated.', ephemeral: true });

    const channel = interaction.channel;
    const announcement = await channel.send({
      content: '@everyone',
      embeds: [embed],
      allowedMentions: { parse: ['everyone'] },
    });

    // Add reaction (custom emoji string works: <:name:id>)
    const targetEmoji = '<:pinkcheckmark:1502780778449342494>';
    try {
      await announcement.react(targetEmoji);
    } catch (err) {
      // ignore reaction errors
    }

    // Ensure client-side stores exist
    if (!client.sessionStates) client.sessionStates = new Map();
    if (!client.pendingSessions) client.pendingSessions = new Map();

    // Save session state and pending session entry
    client.sessionStates.set(String(channel.id), {
      messageId: announcement.id,
      time: Math.floor(Date.now() / 1000),
      completed: true,
      reactors: new Set(),
    });

    client.pendingSessions.set(String(announcement.id), {
      type: 'startup',
      required,
      user: interaction.user?.toString() || interaction.user?.tag || 'unknown',
    });
  },
};
