# Social Media Hybrid Platform

> A Node.js demonstration application showcasing hybrid database architecture combining MySQL (relational) and MongoDB (document-based) for modern social media platform operations.

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green.svg)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue.svg)](https://docs.docker.com/compose/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌟 Overview

This project demonstrates a **hybrid database architecture** that leverages the strengths of both relational (MySQL) and document-based (MongoDB) databases in a social media context. It showcases real-world patterns for:

- **Relational Data**: User profiles, relationships, and structured content (MySQL)
- **Document Data**: Activity feeds, user preferences, and flexible schemas (MongoDB)  
- **Hybrid Queries**: Cross-database operations and data aggregation

## 🏗️ Architecture
 
| Node.js App | MySQL (Relational) | MongoDB (Document) |  
|-------------|--------------------|--------------------|  
| Timeline    | Users              | Activity           |  
| Engagement  | Posts              | Preferences        |  
| Hybrid Ops  | Likes              | Analytics          |  

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Ports 3306 (MySQL) and 27017 (MongoDB) available

### Installation

1. **Clone the repository**  
git clone https://github.com/yourusername/social-media-hybrid-platform.git  
cd social-media-hybrid-platform  

2. **Set up environment variables**  
cp .env.example .env  
Edit .env with your preferred settings  

3. **Launch the platform**  
docker-compose up --build  

4. **View the results**  
Watch the console output for database operations and results displayed in table format.  

## 📊 What It Demonstrates

### MySQL Operations
- **User Timeline**: Follower-based post retrieval with JOINs
- **Engagement Metrics**: Aggregated like counts and statistics
- **Relational Integrity**: Foreign key constraints and referential integrity

### MongoDB Operations  
- **Activity Feed**: Time-based activity aggregation pipelines
- **User Preferences**: Flexible schema for user settings
- **Text Search**: Full-text search capabilities on preferences

### Hybrid Operations
- **Cross-Database Queries**: Combining relational posts with document activities
- **Data Synchronization**: Maintaining consistency across databases
- **Performance Optimization**: Using each database for its strengths

## 📁 Project Structure

├── app.js # Main application with hybrid queries  
├── mysql_setup.sql # MySQL schema and sample data  
├── mongo_setup.js # MongoDB initialization script  
├── package.json # Node.js dependencies and scripts  
├── Dockerfile # Container configuration  
├── docker-compose.yml # Service orchestration  
├── .env # Environment variables  
└── README.md # Documentation  

## 💻 Sample Output

The application demonstrates various query patterns:

### User Timeline (MySQL)
| ID | Content | Created At | Author |
|----|---------|------------|--------|
| 1 | Hello world! This is my first post. | 2024-01-15 10:30:00 | Ana Perez |
| 2 | Welcome to my social media profile. | 2024-01-15 09:15:00 | Luis Gomez |


### User Activity Feed (MongoDB)
| User ID | Activity Type | Reference ID | Timestamp |
|---------|---------------|--------------|-----------|
| 1 | post_created | 1 | 2024-01-15 10:30:00 |
| 2 | post_liked | 1 | 2024-01-15 10:35:00 |


### Post Engagement Metrics (MySQL)
| Post ID | Content Preview | Total Likes | Author |
|---------|-----------------|-------------|--------|
| 1 | Hello world! This is... | 1 | Ana Perez |
| 2 | Welcome to my social... | 0 | Luis Gomez |


### Hybrid Feed (Combined Data)
| Post ID | Content | Activity Count | Activity Types |
|---------|---------|----------------|----------------|
| 1 | Hello world! This is... | 2 | post_created, post_liked |
| 2 | Welcome to my social... | 1 | post_created |

## 🛠️ Available Scripts

1. **Start the application**  
npm start  

2. **Initialize databases separately**  
npm run init-mysql  
npm run init-mongo  

3. **Set up both databases**  
npm run setup  

4. **Development mode with auto-reload**  
npm run dev  

## 🔧 Configuration

### Database Connections

The application uses environment variables for database configuration:

MYSQL_HOST=mysql  
MYSQL_ROOT_PASSWORD=SecurePassword123!  
MONGO_HOST=mongo  

### Docker Services

- **MySQL**: Port 3306, persistent volume for data  
- **MongoDB**: Port 27017, persistent volume for data  
- **App**: Node.js application with database clients  

## 📈 Use Cases

This hybrid architecture is ideal for:

- **Social Media Platforms**: User profiles (MySQL) + activity streams (MongoDB)
- **E-commerce**: Product catalog (MySQL) + user behavior (MongoDB)
- **Content Management**: Structured content (MySQL) + metadata (MongoDB)
- **Analytics Platforms**: Transactional data (MySQL) + events (MongoDB)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- [Node.js](https://nodejs.org/) for the runtime environment
- [MySQL](https://www.mysql.com/) for relational database capabilities
- [MongoDB](https://www.mongodb.com/) for document database flexibility
- [Docker](https://www.docker.com/) for containerization

---

**Made with ❤️ for the developer community**
