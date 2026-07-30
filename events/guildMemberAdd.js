const { giveJoinBonusOnce } = require('../utils/economy');

const GIVE_AMOUNT = 50000;

module.exports = async (client, member) => {
  try {
    // Give the join bonus only once per user per guild
    const given = giveJoinBonusOnce(member.guild.id, member.id, GIVE_AMOUNT);

    if (given) {
      // Try to DM the user
      try {
        await member.send(
          `Welcome to ${member.guild.name}! You have been awarded ${GIVE_AMOUNT.toLocaleString()} coins as a join bonus. 🎉`
        );
      } catch (dmErr) {
        // DM could fail if the user has DMs off — that's okay.
      }

      // Optionally announce in the server's system channel or a channel named 'welcome'
      const welcomeMessage = `Welcome ${member.toString()}! They've been given ${GIVE_AMOUNT.toLocaleString()} coins.`;
      // Try system channel first
      if (
        member.guild.systemChannel &&
        member.guild.systemChannel.permissionsFor(client.user) &&
        member.guild.systemChannel.permissionsFor(client.user).has('SendMessages')
      ) {
        member.guild.systemChannel.send(welcomeMessage).catch(() => {});
      } else {
        // Fallback: try a channel named 'welcome'
        const channel = member.guild.channels.cache.find(
          (c) => c.name && c.name.toLowerCase().includes('welcome') && c.isText()
        );
        if (channel && channel.permissionsFor(client.user) && channel.permissionsFor(client.user).has('SendMessages')) {
          channel.send(welcomeMessage).catch(() => {});
        }
      }
    } else {
      // Already given before — do nothing (or send a small welcome)
    }
  } catch (err) {
    console.error('Error in guildMemberAdd handler:', err);
  }
};
