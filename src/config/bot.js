import { logger } from '../utils/logger.js';


export const botConfig = {
  // =========================
  // BOT PRESENCE (what users see under the bot name)
  // =========================
  presence: {
    status: "online",
    activities: [
      {
        // Short, safe activity string to avoid accidental truncation
        name: "Greenville Roleplay Legacy | /help",
        type: 4,
      },
    ],
  },

  // =========================
  // COMMAND BEHAVIOR
  // =========================
  commands: {
    owners: process.env.OWNER_IDS?.split(",") || [],
    defaultCooldown: 30,
    deleteCommands: false,
    testGuildId: process.env.TEST_GUILD_ID,
  },

  // Roles configuration (team/staff IDs)
  roles: {
    staff_team: "1502772079953711275",
  },

  // =========================
  // APPLICATIONS SYSTEM
  // =========================
  applications: {
    defaultQuestions: [
      { question: "What is your name?", required: true },
      { question: "How old are you?", required: true },
      { question: "Why do you want to join?", required: true },
    ],
    statusColors: {
      pending: "#FFB700",
      approved: "#57F287",
      denied: "#ED4245",
    },
    applicationCooldown: 24,
    deleteDeniedAfter: 7,
    deleteApprovedAfter: 30,
    managerRoles: [1502772079953711275],
  },

  // =========================
  // EMBED COLORS & BRANDING
  // =========================
  embeds: {
    colors: {
      primary: "#8D021F",
      secondary: "#DC143C",
      success: "#57F287",
      error: "#ED4245",
      warning: "#FFB700",
      info: "#5865F2",
      light: "#FFFFFF",
      dark: "#2C2F33",
      gray: "#99AAB5",
      blurple: "#5865F2",
      green: "#57F287",
      yellow: "#FEE75C",
      fuchsia: "#EB459E",
      red: "#ED4245",
      black: "#000000",
      giveaway: { active: "#57F287", ended: "#ED4245" },
      ticket: {
        open: "#5865F2",
        claimed: "#FFB700",
        closed: "#ED4245",
        pending: "#FEE75C",
      },
      economy: "#FFB700",
      birthday: "#EB459E",
      moderation: "#ED4245",
      priority: {
        none: "#99AAB5",
        low: "#57F287",
        medium: "#FFB700",
        high: "#ED4245",
        urgent: "#EB459E",
      },
    },
    footer: { text: "Titan Bot", icon: null },
    thumbnail: null,
    author: { name: null, icon: null, url: null },
  },

  // =========================
  // ECONOMY SETTINGS
  // =========================
  economy: {
    currency: { name: "coins", namePlural: "coins", symbol: "$" },
    startingBalance: 5000,
    baseBankCapacity: 900000,
    dailyAmount: 1000,
    workMin: 10,
    workMax: 100,
    begMin: 5,
    begMax: 50,
    robSuccessRate: 0.4,
    robFailJailTime: 3600000,
  },

  giveall: {
    batchSize: 10,
    allowedRoles: [1502786282793861180],
    continueOnError: true,
    maxAmountPerMember: 0,
  },

  shop: {},

  tickets: {
    defaultCategory: 1474582957334204607,
    supportRoles: [1474582829248544779],
    priorities: {
      none: { emoji: "⚪", color: "#95A5A6", label: "None" },
      low: { emoji: "🟢", color: "#2ECC71", label: "Low" },
      medium: { emoji: "🟡", color: "#F1C40F", label: "Medium" },
      high: { emoji: "🔴", color: "#E74C3C", label: "High" },
      urgent: { emoji: "🚨", color: "#E91E63", label: "Urgent" },
    },
    defaultPriority: "none",
    archiveCategory: null,
    logChannel: 1502684126841409620,
  },

  giveaways: {
    defaultDuration: 86400000,
    minimumWinners: 1,
    maximumWinners: 10,
    minimumDuration: 300000,
    maximumDuration: 2592000000,
    allowedRoles: [1502772079953711275],
    bypassRoles: [],
  },

  birthday: { defaultRole: null, announcementChannel: null, timezone: "CST" },

  verification: {
    defaultMessage: "Click the button below to verify yourself and gain access to the server!",
    defaultButtonText: "Verify",
    autoVerify: {
      defaultCriteria: "none",
      defaultAccountAgeDays: 7,
      serverSizeThreshold: 1000,
      minAccountAge: 1,
      maxAccountAge: 365,
      sendDMNotification: true,
      criteria: { account_age: "Account must be older than specified days", server_size: "All users if server has less than 1000 members", none: "All users immediately" },
    },
    verificationCooldown: 5000,
    maxVerificationAttempts: 3,
    attemptWindow: 60000,
    maxCooldownEntries: 10000,
    maxAttemptEntries: 10000,
    cooldownCleanupInterval: 300000,
    maxAuditMetadataBytes: 4096,
    maxInMemoryAuditEntries: 1000,
    logAllVerifications: true,
    keepAuditTrail: true,
  },

  welcome: { defaultWelcomeMessage: "Welcome {user} to {server}! We now have {memberCount} members!", defaultGoodbyeMessage: "{user} has left the server. We now have {memberCount} members.", defaultWelcomeChannel: 1474582967107190906, defaultGoodbyeChannel: null },

  counters: {
    defaults: { name: "{name} Counter", description: "Server {name} counter", type: "voice", channelName: "{name}-{count}" },
    permissions: { deny: ["VIEW_CHANNEL"], allow: ["VIEW_CHANNEL", "CONNECT", "SPEAK"] },
    messages: { created: "✅ Created counter **{name}**", deleted: "🗑️ Deleted counter **{name}**", updated: "🔄 Updated counter **{name}**" },
    types: {
      members: { name: "👥 Members", description: "Total members in the server", getCount: (guild) => guild.memberCount.toString() },
      bots: { name: "🤖 Bots", description: "Total bot accounts in the server", getCount: (guild) => guild.members.cache.filter((m) => m.user.bot).size.toString() },
      members_only: { name: "👤 Humans", description: "Total human members (non-bots)", getCount: (guild) => guild.members.cache.filter((m) => !m.user.bot).size.toString() },
    },
  },

  messages: {
    noPermission: "You do not have permission to use this command.",
    cooldownActive: "Please wait {time} before using this command again.",
    errorOccurred: "An error occurred while executing this command.",
    missingPermissions: "I am missing required permissions to perform this action.",
    commandDisabled: "This command has been disabled.",
    maintenanceMode: "The bot is currently in maintenance mode.",
  },

  features: {
    economy: true,
    leveling: true,
    moderation: true,
    logging: true,
    welcome: true,
    tickets: true,
    giveaways: true,
    birthday: true,
    counter: true,
    verification: true,
    reactionRoles: true,
    joinToCreate: true,
    voice: true,
    search: true,
    tools: true,
    utility: true,
    community: true,
    fun: true,
  },
};


export function validateConfig(config) {
  const errors = [];

  if (process.env.NODE_ENV !== 'production') {
    logger.debug('Environment variables check:');
    logger.debug('DISCORD_TOKEN exists:', !!process.env.DISCORD_TOKEN);
    logger.debug('TOKEN exists:', !!process.env.TOKEN);
    logger.debug('CLIENT_ID exists:', !!process.env.CLIENT_ID);
    logger.debug('GUILD_ID exists:', !!process.env.GUILD_ID);
    logger.debug('POSTGRES_HOST exists:', !!process.env.POSTGRES_HOST);
    logger.debug('NODE_ENV:', process.env.NODE_ENV);
  }

  if (!process.env.DISCORD_TOKEN && !process.env.TOKEN) {
    errors.push("Bot token is required (DISCORD_TOKEN or TOKEN environment variable)");
  }

  if (!process.env.CLIENT_ID) {
    errors.push("Client ID is required (CLIENT_ID environment variable)");
  }

  if (process.env.NODE_ENV === 'production') {
    if (!process.env.POSTGRES_HOST) {
      errors.push("PostgreSQL host is required in production (POSTGRES_HOST environment variable)");
    }
    if (!process.env.POSTGRES_USER) {
      errors.push("PostgreSQL user is required in production (POSTGRES_USER environment variable)");
    }
    if (!process.env.POSTGRES_PASSWORD) {
      errors.push("PostgreSQL password is required in production (POSTGRES_PASSWORD environment variable)");
    }
  }

  return errors;
}


const configErrors = validateConfig(botConfig);
if (configErrors.length > 0) {
  logger.error("Bot configuration errors:", configErrors.join("\n"));
  if (process.env.NODE_ENV === "production") {
    process.exit(1);
  }
}


export const BotConfig = botConfig;

export function getColor(path, fallback = "#99AAB5") {
  if (typeof path === "number") return path;
  if (typeof path === "string" && path.startsWith("#")) {
    return parseInt(path.replace("#", ""), 16);
  }
  const result = path
    .split(".")
    .reduce(
      (obj, key) => (obj && obj[key] !== undefined ? obj[key] : fallback),
      botConfig.embeds.colors,
    );

  if (typeof result === "string" && result.startsWith("#")) {
    return parseInt(result.replace("#", ""), 16);
  }
  return result;
}

export function getRandomColor() {
  const colors = Object.values(botConfig.embeds.colors).flatMap((color) =>
    typeof color === "string" ? color : Object.values(color),
  );
  return colors[Math.floor(Math.random() * colors.length)];
}

export default botConfig;
