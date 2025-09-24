// mongo_setup.js
// Initializes MongoDB collections for activity feed and user preferences

const { MongoClient } = require('mongodb');

/**
 * Initializes the ActivityFeed collection
 * Stores user activity events for timeline generation
 */
async function initializeActivityFeed(db) {
  const collection = db.collection('ActivityFeed');
  await collection.deleteMany({}); // idempotent clear

  const activities = [
    {
      user_id: 1,
      activity_type: 'post_created',
      reference_id: 1,
      timestamp: new Date(),
      metadata: { content_preview: 'Hello world! This is my first post.' }
    },
    {
      user_id: 2,
      activity_type: 'post_liked',
      reference_id: 1,
      timestamp: new Date(),
      metadata: { liked_user_id: 1 }
    },
    {
      user_id: 2,
      activity_type: 'post_created',
      reference_id: 2,
      timestamp: new Date(),
      metadata: { content_preview: 'Welcome to my social media profile.' }
    }
  ];
  await collection.insertMany(activities);
  await collection.createIndex({ user_id: 1, timestamp: -1 });
  await collection.createIndex({ activity_type: 1 });

  console.log(`📝 ActivityFeed initialized with ${activities.length} documents`);
}

/**
 * Initializes the UserPreferences collection
 * Stores user settings and preferences
 */
async function initializeUserPreferences(db) {
  const collection = db.collection('UserPreferences');
  await collection.deleteMany({});

  const preferences = [
    {
      user_id: 1,
      preferences: {
        theme: 'dark',
        language: 'en',
        notifications: { likes: true, comments: true, follows: false },
        privacy: { profile_visibility: 'public', activity_visibility: 'friends' }
      },
      updated_at: new Date()
    },
    {
      user_id: 2,
      preferences: {
        theme: 'light',
        language: 'es',
        notifications: { likes: false, comments: true, follows: true },
        privacy: { profile_visibility: 'private', activity_visibility: 'private' }
      },
      updated_at: new Date()
    }
  ];
  await collection.insertMany(preferences);
  await collection.createIndex({ 'preferences.theme': 'text', 'preferences.language': 'text' });
  await collection.createIndex({ user_id: 1 });

  console.log(`⚙️ UserPreferences initialized with ${preferences.length} documents`);
}

/**
 * Main initialization function for MongoDB collections
 */
async function main() {
  const host = process.env.MONGO_HOST || 'localhost';
  const user = process.env.MONGO_INITDB_ROOT_USERNAME;
  const pass = process.env.MONGO_INITDB_ROOT_PASSWORD;
  const uri =
    `mongodb://${encodeURIComponent(user)}:${encodeURIComponent(pass)}` +
    `@${host}:27017/?authSource=admin`;

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  try {
    console.log('🔌 Connecting to MongoDB with auth...');
    await client.connect();

    const db = client.db('social_hybrid');

    // Initialize collections
    await initializeActivityFeed(db);
    await initializeUserPreferences(db);

    console.log('✅ MongoDB initialization completed successfully');
  } catch (error) {
    console.error('❌ MongoDB initialization failed:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

// Execute initialization
main();
