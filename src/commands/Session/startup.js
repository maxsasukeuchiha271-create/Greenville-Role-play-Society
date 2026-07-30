import { SlashCommandBuilder } from '@discordjs/builders';
import { EmbedBuilder, PermissionsBitField } from 'discord.js';

const STAFF_TEAM_ROLE_ID = '1502772079953711275';

export default {
  data: new SlashCommandBuilder()
    .setName('startup')
    .setDescription('Start a roleplay session')
    .addIntegerOption((opt) => opt.setName('required_reactions').setDescription('Number of reactions needed to start the session').setRequired(true)),

  async execute(interaction) {
    const client = interaction.client;

    // Ensure in guild
    if (!interaction.guild) {
      await interaction.reply({ content: 'This command must be used in a server.', ephemeral: true });
      return;
    }

    // Resolve member (prefer cached, otherwise fetch)
    let member;
    try {
      member = interaction.member ?? (await interaction.guild.members.fetch(interaction.user.id));
    } catch (err) {
      member = null;
    }

    if (!member) {
      await interaction.reply({ content: 'Could not verify your membership. Try again in a moment.', ephemeral: true });
      return;
    }

    // Read configured staff role id safely
    let configuredStaffRoleId = null;
    try {
      configuredStaffRoleId = client.config?.roles?.staff_team ?? null;
      if (configuredStaffRoleId) configuredStaffRoleId = String(configuredStaffRoleId);
    } catch (err) {
      configuredStaffRoleId = null;
    }

    const allowedRoleIds = new Set([STAFF_TEAM_ROLE_ID]);
    if (configuredStaffRoleId) allowedRoleIds.add(configuredStaffRoleId);

    const userRoleIds = new Set(member.roles.cache.map((r) => String(r.id)));

    const hasRole = Array.from(allowedRoleIds).some((rid) => userRoleIds.has(rid));
    const isAdmin = member.permissions?.has?.(PermissionsBitField.Flags.Administrator);

    if (!hasRole && !isAdmin) {
      await interaction.reply({ content: 'Only staff team members can use this command.', ephemeral: true });
      return;
    }

    // Channel guard if configured
    const channelsCfg = client.config?.channels ?? {};
    const id1 = channelsCfg.session_commands_channel_id;
    const id2 = channelsCfg.session_commands_channel_id_2;
    if ((id1 || id2) && ![String(id1), String(id2)].includes(String(interaction.channelId))) {
      await interaction.reply({ content: `This command can only be used in <#${id1}> or <#${id2}>.`, ephemeral: true });
      return;
    }

    const requiredReactions = interaction.options.getInteger('required_reactions');

    // Build embed from config
    const ecfg = client.config?.embeds?.startup ?? {};
    const title = ecfg.title ?? '_Greenville Roleplay Legacy_ - ___Session Startup___';
    let description = '';
    try {
      if (typeof ecfg.description === 'string') {
        description = ecfg.description.replace('{user}', `<@${interaction.user.id}>`).replace('{required}', String(requiredReactions));
      }
    } catch (err) {
      description = '';
    }

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setColor(ecfg.color ? Number(ecfg.color) : 0xADCF8B);

    if (ecfg.image_url) {
      try { embed.setImage(ecfg.image_url); } catch {}
    }

    const footerText = client.config?.bot?.footer_text;
    const footerIcon = client.config?.bot?.footer_icon;
    if (footerText || footerIcon) {
      try { embed.setFooter({ text: footerText ?? '', iconURL: footerIcon ?? undefined }); } catch {}
    }

    // Acknowledge interaction
    try {
      await interaction.reply({ content: 'Startup initiated.', ephemeral: true });
    } catch (err) {
      try { await interaction.followUp({ content: 'Startup initiated.', ephemeral: true }); } catch {}
    }

    // Post session message to channel
    const channel = interaction.channel;
    if (!channel || typeof channel.send !== 'function') {
      try { await interaction.followUp({ content: 'Unable to post session message in this channel.', ephemeral: true }); } catch {}
      return;
    }

    let message;
    try {
      message = await channel.send({ content: '@everyone', embeds: [embed], allowedMentions: { parse: ['everyone'] } });
      await message.react('<:pinkcheckmark:1502780778449342494>');
    } catch (err) {
      try { await interaction.followUp({ content: 'Failed to post session message. Check bot permissions.', ephemeral: true }); } catch {}
      return;
    }

    // Ensure client session maps exist
    if (!client.session_states) client.session_states = new Map();
    if (!client.pending_sessions) client.pending_sessions = new Map();

    client.session_states.set(String(interaction.channelId), {
      message_id: String(message.id),
      time: Date.now(),
      completed: false,
      reactors: new Set(),
    });

    client.pending_sessions.set(String(message.id), {
      type: 'startup',
      required: Number(requiredReactions),
      user: `<@${interaction.user.id}>`,
    });
  },
};
