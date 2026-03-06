/* eslint-disable no-console */
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const mongoose = require('mongoose');
const User = require('../src/models/user');

async function run() {
    const mongoUri = process.env.DB_CONNECT_STRING || process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
        throw new Error('Missing DB_CONNECT_STRING (or MONGO_URI / MONGODB_URI) in backend env');
    }

    await mongoose.connect(mongoUri);
    const db = mongoose.connection.db;

    console.log('✅ Connected to MongoDB');

    // 1) Clean existing bad values that cause E11000 with a unique index
    console.log('Cleaning empty-string githubId/linkedinId...');
    await User.updateMany({ githubId: '' }, { $set: { githubId: null } });
    await User.updateMany({ linkedinId: '' }, { $set: { linkedinId: null } });

    // 2) Drop the problematic unique index if it exists
    // Your error shows: index: githubId_1
    const users = db.collection('users');
    const indexes = await users.indexes();
    const githubIdx = indexes.find((i) => i.name === 'githubId_1');
    if (githubIdx) {
        console.log('Dropping index githubId_1 ...');
        await users.dropIndex('githubId_1');
    } else {
        console.log('Index githubId_1 not found; nothing to drop.');
    }

    // Optional: create a non-unique index for faster profile lookup
    await users.createIndex({ githubId: 1 }, { name: 'githubId_1_nonunique' });

    console.log('✅ Done. You can restart the backend now.');
    await mongoose.disconnect();
}

run().catch(async (err) => {
    console.error('❌ Migration failed:', err);
    try {
        await mongoose.disconnect();
    } catch (_) {}
    process.exit(1);
});

