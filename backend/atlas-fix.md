# MongoDB Atlas Setup Instructions

## Step 1: Whitelist IP Address
1. Go to https://cloud.mongodb.com
2. Select your project/cluster
3. Click "Network Access" in left sidebar
4. Click "Add IP Address"
5. Choose "Allow Access from Anywhere" (0.0.0.0/0)
6. Click "Confirm"

## Step 2: Verify Database User
1. Go to "Database Access" 
2. Ensure user "karnamabhinaya8_db_user" exists
3. Password should be "Password123"
4. Role should be "Atlas Admin" or "Read and write to any database"

## Step 3: Test Connection
Run: `node test-connection.js`

## Current Connection String:
mongodb+srv://karnamabhinaya8_db_user:Password123@cluster0.bsrbeww.mongodb.net/smartcommute?retryWrites=true&w=majority&appName=Cluster0