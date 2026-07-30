# Join Bonus (50,000) — Integration Notes

Files added on branch `add-join-bonus-economy`:

- `utils/economy.js` — simple JSON-backed economy helper. Functions: `getBalance`, `addBalance`, `giveJoinBonusOnce`, `resetJoinGivenFlag`.
- `events/guildMemberAdd.js` — `guildMemberAdd` event handler that gives 50,000 coins once per user per guild, attempts to DM the user, and posts a welcome message in the server if possible.

How to enable in your bot

1. Ensure the bot has the "Server Members Intent" enabled in the Discord Developer Portal.
2. Register the event handler in your main bot file (example for discord.js v14):

```javascript
// index.js (or your main file)
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const guildMemberAddHandler = require('./events/guildMemberAdd');

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('guildMemberAdd', (member) => guildMemberAddHandler(client, member));

client.login(process.env.DISCORD_TOKEN);
```

3. Test by inviting the bot to a test server and creating a new user (or using an alternate account). The first time a user joins they will receive 50,000 coins. Rejoins will not give the bonus again unless you call `resetJoinGivenFlag` on that user.

Notes and recommendations

- This implementation uses a file-based JSON store at `data/balances.json`. It's fine for testing or small servers but not ideal for production because of concurrency risks. Consider migrating to SQLite, Postgres, or Redis for a production bot.
- If you want users to receive the bonus again when they rejoin, add a `guildMemberRemove` handler that calls `resetJoinGivenFlag(guildId, userId)`.
- If you already have an economy system in the repo, integrate the logic from `utils/economy.js` into your existing database instead of using the JSON file.

If you want me to open a Pull Request with these changes or convert the store to SQLite before merging, tell me and I will proceed.
