#!/bin/bash
# Quick Start Script for Event Management Project
# Run this to set up and start the project locally

echo "🚀 Event Management Project - Quick Start"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo -e "${BLUE}✓ Node.js version:$(node -v)${NC}"
echo ""

# Step 1: Server Setup
echo -e "${YELLOW}Step 1: Setting up Server...${NC}"
cd server

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
else
    echo "✓ Dependencies already installed"
fi

# Check for .env file
if [ ! -f ".env" ]; then
    echo ""
    echo -e "${YELLOW}⚠️  .env file not found in server/ directory${NC}"
    echo "Please create server/.env with the following variables:"
    echo ""
    cat > .env.example << 'EOF'
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/event_management
JWT_ACCESS_SECRET=your_strong_random_secret_32_chars_min
JWT_REFRESH_SECRET=your_strong_random_secret_32_chars_min
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
GOOGLE_CLIENT_ID=your_google_client_id
EOF
    echo "Created server/.env.example as reference"
    echo "Copy and edit it to create your .env file:"
    echo "  cp server/.env.example server/.env"
    echo "  nano server/.env  # Edit with your values"
    exit 1
fi

# Build server
echo "Building server..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Server build failed"
    exit 1
fi

echo -e "${GREEN}✓ Server setup complete${NC}"
echo ""

# Step 2: Client Setup
echo -e "${YELLOW}Step 2: Setting up Client...${NC}"
cd ../client

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
else
    echo "✓ Dependencies already installed"
fi

# Check for .env file
if [ ! -f ".env" ]; then
    echo ""
    echo -e "${YELLOW}⚠️  .env file not found in client/ directory${NC}"
    echo "Please create client/.env with the following variables:"
    echo ""
    cat > .env.example << 'EOF'
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_GOOGLE_CLIENT_ID=your_google_client_id
EOF
    echo "Created client/.env.example as reference"
    echo "Copy and edit it to create your .env file:"
    echo "  cp client/.env.example client/.env"
    echo "  nano client/.env  # Edit with your values"
    exit 1
fi

# Build client
echo "Building client..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Client build failed"
    exit 1
fi

echo -e "${GREEN}✓ Client setup complete${NC}"
echo ""

# Step 3: Display next steps
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo ""
echo -e "${BLUE}To start the project, run these commands in separate terminals:${NC}"
echo ""
echo -e "${YELLOW}Terminal 1 (Server):${NC}"
echo "  cd server"
echo "  npm run dev"
echo ""
echo -e "${YELLOW}Terminal 2 (Client):${NC}"
echo "  cd client"
echo "  npm run dev"
echo ""
echo -e "${BLUE}Then open your browser to:${NC}"
echo "  http://localhost:5173"
echo ""
echo -e "${BLUE}API Server will run on:${NC}"
echo "  http://localhost:5000"
echo ""
echo -e "${YELLOW}Test Accounts:${NC}"
echo "  Email: test@example.com"
echo "  Password: password123"
echo ""
echo -e "${GREEN}Happy coding! 🎉${NC}"
