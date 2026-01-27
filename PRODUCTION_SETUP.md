# Production Deployment Guide

## Issues Fixed:
1. **JWT_SECRET** - Now checks if environment variable is set before using
2. **Static Auth** - Uses environment variables instead of hardcoded values
3. **PORT** - Added fallback to port 5000 if PORT env var not set
4. **Static Files** - Added middleware to serve public folder

## Production Setup Steps:

### 1. Environment Configuration
Create a `.env` file with the following variables:

```env
NODE_ENV=production
PORT=5000

# Database Configuration
DB_HOST=your_host
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database

# JWT Secret - Use a strong random string
JWT_SECRET=your_long_random_secret_key_here_change_this

# Static Auth - Use strong random strings
STATIC_AUTH_SECRET_KEY=your_production_secret_key
STATIC_AUTH_TOKEN=195
```

### 2. Critical Changes Made:

**auth.js:**
- Added validation for JWT_SECRET environment variable
- Returns 500 error if JWT_SECRET not configured
- Added error logging for debugging

**staticAuth.js:**
- Uses environment variables for SECRET_KEY and EXPECTED_TOKEN
- Falls back to default values if not set
- Added error logging for debugging

**index.js:**
- PORT now defaults to 5000 if not set
- Added static file serving for public folder
- Ensures uploads folder is accessible

### 3. Deployment Checklist:

- [ ] Set `NODE_ENV=production`
- [ ] Set `PORT` to your production port
- [ ] Set `JWT_SECRET` to a strong random string (minimum 32 characters)
- [ ] Set `STATIC_AUTH_SECRET_KEY` to a strong random string
- [ ] Ensure database credentials are correct
- [ ] Create uploads folder with proper permissions
- [ ] Test endpoints before going live

### 4. Troubleshooting:

If middleware still fails in production:

1. **Check logs**: Look for "JWT_SECRET is not configured" message
2. **Verify environment variables**: Run `echo $JWT_SECRET` to confirm
3. **Check permissions**: Ensure uploads and public folders have read permissions
4. **Test locally with production config**: Run with NODE_ENV=production locally first

### 5. Generating Secure Keys:

```bash
# Generate JWT Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate Static Auth Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Testing:

Before deployment, test with these commands:

```bash
NODE_ENV=production JWT_SECRET=test node index.js
```

Then test endpoints with curl or Postman to verify middleware is working.
