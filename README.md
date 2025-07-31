# Squeelie

A self-hosted PostgreSQL dashboard for executing SQL queries and visualizing data. Like Umami, but for database management - just clone, run docker-compose, and start querying your data.

## 🚀 Self-Hosting Options

### Option 1: Docker Compose (Recommended)
```bash
# Download the docker-compose.yml
curl -O https://raw.githubusercontent.com/petermazzocco/psqueelie/main/docker-compose.yml
curl -O https://raw.githubusercontent.com/petermazzocco/psqueelie/main/.env.example

# Set up environment variables
cp .env.example .env
# Edit .env with your values

# Start the stack
docker-compose up -d
```

### Option 2: Clone and Docker Build
```bash
git clone https://github.com/petermazzocco/psqueelie.git
cd psqueelie

# Set environment variables
cp .env.example .env
# Edit .env with your values

docker-compose up -d
```

### Option 3: Deploy to Vercel
```bash
# Clone the repository
git clone https://github.com/petermazzocco/psqueelie.git
cd psqueelie

# Deploy to Vercel (requires Vercel CLI)
vercel --prod

# Or connect your GitHub repo to Vercel dashboard
# Set environment variables in Vercel dashboard
# Connect to your external PostgreSQL database
```

3. **Access the application**
   - Open [http://localhost:3000](http://localhost:3000)
   - Create your first account when prompted
   - Start querying your PostgreSQL database

The Docker setup includes:
- PostgreSQL 16 database
- Next.js application
- Automatic database migrations via better-auth

## 🛠️ Local Development

1. **Prerequisites**
   - Node.js 18+
   - PostgreSQL database

2. **Setup**
   ```bash
   # Install dependencies
   npm install
   
   # Copy environment variables
   cp .env.example .env.local
   
   # Update .env.local with your database credentials
   # Start your PostgreSQL database
   
   # Run development server
   npm run dev
   ```

3. **Environment Variables**
   ```env
   # Database
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   POSTGRES_DATABASE=squeelie
   POSTGRES_USER=your_username
   POSTGRES_PASSWORD=your_password
   
   # Authentication
   BETTER_AUTH_SECRET=your-secret-key
   BETTER_AUTH_URL=http://localhost:3000
   ```

## ✨ Features

- **Secure Authentication** - Email/password login with better-auth
- **SQL Query Execution** - Execute PostgreSQL queries with syntax highlighting
- **Query History** - Automatic saving of query history
- **Results Visualization** - Clean tabular display of query results
- **Connection Management** - Built-in database connection testing
- **Dark/Light Theme** - Toggle between themes
- **Self-Hosted** - Complete control over your data

## 🏗️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Authentication**: better-auth
- **Database**: PostgreSQL with pg driver
- **Deployment**: Docker & Docker Compose

## 📚 Usage

1. **First Run**: Create an admin account on first visit
2. **Connect Database**: The app connects to the configured PostgreSQL instance
3. **Execute Queries**: Use the "New Query" button to run SQL commands
4. **View History**: Access previous queries via the History panel
5. **Export Results**: Copy or save query results as needed

## 🔒 Security

- Secure session management with better-auth
- Environment-based configuration
- No hardcoded credentials
- SQL injection protection via parameterized queries

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run build`
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details
