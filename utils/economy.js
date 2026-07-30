const fs = require('fs');
const path = require('path');

const DB_DIR = path.join(__dirname, '..', 'data');
const DB_PATH = path.join(DB_DIR, 'balances.json');

function ensureDb() {
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify({}));
}

function loadDb() {
  ensureDb();
  const raw = fs.readFileSync(DB_PATH, 'utf8');
  try {
    return JSON.parse(raw || '{}');
  } catch (e) {
    // if file corrupted, back it up and start fresh
    fs.renameSync(DB_PATH, DB_PATH + '.bak.' + Date.now());
    fs.writeFileSync(DB_PATH, JSON.stringify({}));
    return {};
  }
}

function saveDb(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function keyFor(guildId, userId) {
  return `${guildId}-${userId}`;
}

module.exports = {
  // Return current balance (number)
  getBalance(guildId, userId) {
    const db = loadDb();
    const key = keyFor(guildId, userId);
    return (db[key] && db[key].balance) || 0;
  },

  // Add amount to balance (always applies). Returns new balance.
  addBalance(guildId, userId, amount) {
    const db = loadDb();
    const key = keyFor(guildId, userId);
    if (!db[key]) db[key] = { balance: 0, joinedGiven: false };
    db[key].balance = (db[key].balance || 0) + Number(amount || 0);
    saveDb(db);
    return db[key].balance;
  },

  // Give the join bonus only if not given yet. Returns true if given, false if already given.
  giveJoinBonusOnce(guildId, userId, amount) {
    const db = loadDb();
    const key = keyFor(guildId, userId);
    if (!db[key]) db[key] = { balance: 0, joinedGiven: false };
    if (db[key].joinedGiven) {
      return false;
    }
    db[key].balance = (db[key].balance || 0) + Number(amount || 0);
    db[key].joinedGiven = true;
    saveDb(db);
    return true;
  },

  // (Optional) Reset flag if you want to allow re-giving on rejoin
  resetJoinGivenFlag(guildId, userId) {
    const db = loadDb();
    const key = keyFor(guildId, userId);
    if (!db[key]) return false;
    db[key].joinedGiven = false;
    saveDb(db);
    return true;
  },
};
