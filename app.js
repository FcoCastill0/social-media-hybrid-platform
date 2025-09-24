// app.js
// Main application demonstrating hybrid MySQL + MongoDB operations

const mysql = require('mysql2/promise');
const { MongoClient } = require('mongodb');

/**
 * Database connection configurations
 */
const CONFIG = {
  mysql: {
    host: process.env.MYSQL_HOST || 'mysql',
    port: 3306,
    user: 'root',
    password: process.env.MYSQL_ROOT_PASSWORD || 'secret',
    database: 'social_hybrid'
  },
  mongodb: {
    host: process.env.MONGO_HOST || 'mongo',
    port: 27017,
    user: process.env.MONGO_INITDB_ROOT_USERNAME,
    pass: process.env.MONGO_INITDB_ROOT_PASSWORD,
    database: 'social_hybrid',
    authSource: 'admin'
  }
};

/**
 * Main application execution function
 */
async function runApplication() {
  let mysqlConnection = null;
  let mongoClient = null;

  try {
    // Establish database connections
    const { mysql: mysqlConn, mongo: mongoDbClient } = await initializeDatabases();
    mysqlConnection = mysqlConn;
    mongoClient = mongoDbClient;

    // Execute hybrid database operations
    const mongoDb = mongoClient.db(CONFIG.mongodb.database);
    await executeHybridQueries(mysqlConnection, mongoDb);

  } catch (error) {
    console.error('❌ Application error:', error);
    throw error;

  } finally {
    // Ensure proper cleanup
    await closeDatabaseConnections(mysqlConnection, mongoClient);
  }
}

/**
 * Initialize connections to both MySQL and MongoDB
 */
async function initializeDatabases() {
  // MySQL Connection
  const mysqlConn = await mysql.createConnection(CONFIG.mysql);
  console.log('✅ MySQL connected successfully');

  // MongoDB Connection with authentication
  const m = CONFIG.mongodb;
  const mongoUri =
    `mongodb://${encodeURIComponent(m.user)}:${encodeURIComponent(m.pass)}` +
    `@${m.host}:${m.port}/${m.database}?authSource=${m.authSource}`;

  const mongoClient = new MongoClient(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  await mongoClient.connect();
  console.log('✅ MongoDB connected successfully');

  return {
    mysql: mysqlConn,
    mongo: mongoClient
  };
}

/**
 * Execute various hybrid database operations
 */
async function executeHybridQueries(mysqlConn, mongoDb) {
  console.log('\n🔍 Executing hybrid database queries...\n');

  await getUserTimeline(mysqlConn);
  await getPostEngagementMetrics(mysqlConn);
  await getUserActivityFeed(mongoDb);
  await searchUserPreferences(mongoDb);
  await getHybridUserFeed(mysqlConn, mongoDb);
}

/**
 * Get user timeline from MySQL with follower posts
 */
async function getUserTimeline(mysqlConn) {
  const query = `
    SELECT p.id, p.content, p.created_at, u.name AS author_name
    FROM Post p
    JOIN User u ON p.user_id = u.id
    WHERE p.user_id IN (
      SELECT followee_id FROM Follow WHERE follower_id = ?
      UNION SELECT ?
    )
    ORDER BY p.created_at DESC
    LIMIT 20;
  `;
  const [timeline] = await mysqlConn.execute(query, [1, 1]);
  console.log('📜 User Timeline (MySQL):');
  console.table(timeline);
}

/**
 * Get post engagement metrics from MySQL
 */
async function getPostEngagementMetrics(mysqlConn) {
  const query = `
    SELECT p.id AS post_id, p.content, COUNT(pl.post_id) AS total_likes, u.name AS author_name
    FROM Post p
    LEFT JOIN PostLike pl ON p.id = pl.post_id
    JOIN User u ON p.user_id = u.id
    GROUP BY p.id, p.content, u.name
    ORDER BY total_likes DESC;
  `;
  const [metrics] = await mysqlConn.execute(query);
  console.log('👍 Post Engagement Metrics (MySQL):');
  console.table(metrics);
}

/**
 * Get user activity feed from MongoDB
 */
async function getUserActivityFeed(mongoDb) {
  const pipeline = [
    { $match: { user_id: { $in: [1, 2] } } },
    { $sort: { timestamp: -1 } },
    { $limit: 20 },
    {
      $project: {
        user_id: 1,
        activity_type: 1,
        reference_id: 1,
        timestamp: { $dateToString: { format: '%Y-%m-%d %H:%M:%S', date: '$timestamp' } },
        'metadata.content_preview': 1
      }
    }
  ];
  const activities = await mongoDb.collection('ActivityFeed').aggregate(pipeline).toArray();
  console.log('📱 User Activity Feed (MongoDB):');
  console.table(activities);
}

/**
 * Search user preferences in MongoDB using text search
 */
async function searchUserPreferences(mongoDb) {
  const darkThemeUsers = await mongoDb.collection('UserPreferences')
    .find({ 'preferences.theme': 'dark' })
    .project({
      user_id: 1,
      'preferences.theme': 1,
      'preferences.language': 1,
      'preferences.notifications': 1
    })
    .toArray();
  console.log('🎨 Users with Dark Theme Preference (MongoDB):');
  console.table(darkThemeUsers);
}

/**
 * Hybrid query combining MySQL posts with MongoDB activity data
 */
async function getHybridUserFeed(mysqlConn, mongoDb) {
  const [posts] = await mysqlConn.execute(`
    SELECT id, content, user_id, created_at
    FROM Post
    ORDER BY created_at DESC
    LIMIT 5;
  `);
  const postIds = posts.map(post => post.id);
  const activities = await mongoDb.collection('ActivityFeed')
    .find({ reference_id: { $in: postIds } })
    .toArray();
  const hybridFeed = posts.map(post => {
    const relatedActivities = activities.filter(a => a.reference_id === post.id);
    return {
      post_id: post.id,
      content: post.content.substring(0, 50) + '...',
      created_at: post.created_at,
      activity_count: relatedActivities.length,
      activity_types: relatedActivities.map(a => a.activity_type).join(', ')
    };
  });
  console.log('🔄 Hybrid Feed (MySQL + MongoDB):');
  console.table(hybridFeed);
}

/**
 * Properly close database connections
 */
async function closeDatabaseConnections(mysqlConn, mongoClient) {
  if (mysqlConn) {
    await mysqlConn.end();
    console.log('🔌 MySQL connection closed');
  }
  if (mongoClient) {
    await mongoClient.close();
    console.log('🔌 MongoDB connection closed');
  }
  console.log('🏁 Application finished successfully');
}

// Application entry point
runApplication().catch(err => {
  console.error('💥 Fatal application error:', err);
  process.exit(1);
});
