# Google OAuth Deployment Fix

## Problem Summary
Google OAuth returns **Error 400: invalid_request** because:
1. ❌ Backend `.env` has `BACKEND_URL=http://localhost:3000` (used for OAuth callback)
2. ❌ Google expects callback at `http://head2code.duckdns.org/api/oauth/google/callback`
3. ❌ URL mismatch causes Google to reject the OAuth request
4. ❌ CORS only allows localhost origins

## Solution Overview
The OAuth flow should work like this:
```
1. User clicks "Continue with Google" button
2. Frontend redirects → /api/oauth/google
3. Nginx proxies → http://localhost:3000/oauth/google
4. Backend Passport redirects → Google Auth
5. Google redirects back → http://head2code.duckdns.org/api/oauth/google/callback
6. Nginx proxies → http://localhost:3000/oauth/google/callback
7. Backend processes callback, sets JWT cookie
8. Redirects to → http://head2code.duckdns.org/
```

---

## Fixed Files
✅ **backend/.env.production** - Created with production URLs  
✅ **backend/src/index.js** - Updated CORS to allow `head2code.duckdns.org`

---

## Deployment Steps

### Step 1: Update Google Cloud Console

Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials):

1. **Select your project**
2. **Click on your OAuth 2.0 Client ID**
3. **Update Authorized JavaScript origins** to include:
   ```
   http://localhost:5173
   http://localhost:3000
   http://head2code.duckdns.org
   ```

4. **Update Authorized redirect URIs** to include:
   ```
   http://localhost:3000/oauth/google/callback
   http://head2code.duckdns.org/api/oauth/google/callback
   ```
   
   **⚠️ CRITICAL:** The production redirect URI **MUST** be:
   ```
   http://head2code.duckdns.org/api/oauth/google/callback
   ```
   Note the `/api` prefix - this is required because Nginx proxies all backend requests through `/api/`.

5. **Click SAVE**

### Step 2: Deploy Backend Changes to EC2

SSH into your EC2 server:
```bash
ssh -i your-key.pem ubuntu@<your-ec2-ip>
```

Navigate to your backend directory:
```bash
cd ~/Head-2-Code-New/14Dev/backend
```

**Option A: Pull from Git** (recommended)
```bash
# Ensure you've committed the changes
git pull origin main
```

**Option B: Manual Update**
```bash
# Update the .env file
nano .env
```

Update these lines:
```env
BACKEND_URL=http://head2code.duckdns.org/api
FRONTEND_URL=http://head2code.duckdns.org
```

Or copy the `.env.production` file:
```bash
# From your local machine, upload the file
scp -i your-key.pem backend/.env.production ubuntu@<your-ec2-ip>:~/Head-2-Code-New/14Dev/backend/.env
```

Update `src/index.js` CORS configuration to include your domain (already done if you pulled from Git):
```javascript
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5175',
        'http://head2code.duckdns.org',
        'http://www.head2code.duckdns.org'
    ],
    credentials: true
}));
```

### Step 3: Restart Backend Server

If using PM2:
```bash
pm2 restart all
# Or restart specific app
pm2 restart head2code-backend
```

If running manually:
```bash
# Kill existing process
pkill -f "node.*index.js"

# Start backend
NODE_ENV=production node src/index.js &
```

### Step 4: Verify Frontend Build

Ensure frontend was built with production config:
```bash
cd ~/Head-2-Code-New/14Dev/frontend

# Check .env.production exists
cat .env.production
# Should show: VITE_API_URL=/api

# If needed, rebuild
npm run build
```

### Step 5: Verify Nginx Configuration

Ensure Nginx is configured correctly:
```bash
sudo nano /etc/nginx/sites-available/my-app
```

**Required configuration:**
```nginx
server {
    listen 80;
    server_name head2code.duckdns.org;

    # Serve frontend
    location / {
        root /home/ubuntu/Head-2-Code-New/14Dev/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests (including OAuth)
    location /api/ {
        proxy_pass http://localhost:3000/;  # Trailing slash strips /api
        proxy_http_version 1.1;
        
        # WebSocket support
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Standard proxy headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Test and reload Nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## Testing

### 1. Test Backend Directly
```bash
# On EC2 server
curl http://localhost:3000/oauth/google
# Should see redirect to Google
```

### 2. Test Through Nginx
```bash
# On EC2 server
curl http://localhost/api/oauth/google
# Should see redirect to Google
```

### 3. Test in Browser

1. **Open** `http://head2code.duckdns.org/login`
2. **Click** "Continue with Google"
3. **Should redirect to** Google login page
4. **After login**, should redirect back to your app homepage with cookie set

### 4. Check Browser DevTools

**Network Tab:**
- Initial request: `http://head2code.duckdns.org/api/oauth/google` → 302 redirect to Google
- Callback: `http://head2code.duckdns.org/api/oauth/google/callback` → 302 redirect to homepage
- Should see `Set-Cookie: token=...`

**Console Tab:**
- Should have no CORS errors
- Should have no 400/403 errors

---

## Troubleshooting

### Still Getting "Error 400: invalid_request"?

**1. Verify callback URL in backend logs:**
```bash
pm2 logs
# or
journalctl -u your-backend-service -f
```

Print the callback URL to verify:
Add this to `backend/src/config/passport.js` temporarily:
```javascript
const backendBase = getCallbackBase();
console.log('OAuth Callback URL:', `${backendBase}/oauth/google/callback`);
```

**Expected output:** `OAuth Callback URL: http://head2code.duckdns.org/api/oauth/google/callback`

**2. Double-check Google Console:**
- Go to Google Cloud Console → APIs & Services → Credentials
- Click on your OAuth 2.0 Client ID
- Verify redirect URI **exactly matches**: `http://head2code.duckdns.org/api/oauth/google/callback`
- URI must include `/api` prefix
- No trailing slashes

**3. Check environment variables:**
```bash
# On EC2
cd ~/Head-2-Code-New/14Dev/backend
cat .env | grep URL
```

Should show:
```
BACKEND_URL=http://head2code.duckdns.org/api
FRONTEND_URL=http://head2code.duckdns.org
```

### CORS Errors?

**Check backend is running with updated CORS:**
```bash
pm2 logs
# Should not see CORS errors
```

**Verify CORS in code:**
```bash
cat src/index.js | grep -A 10 "cors"
```

Should include `head2code.duckdns.org` in origins array.

### Redirects to localhost after OAuth?

**Issue:** `FRONTEND_URL` still set to localhost

**Fix:**
```bash
# Update .env
nano .env
# Change: FRONTEND_URL=http://head2code.duckdns.org
# Restart: pm2 restart all
```

### Getting 502 Bad Gateway?

**Backend not running:**
```bash
ps aux | grep node
# If not running:
cd ~/Head-2-Code-New/14Dev/backend
node src/index.js &
```

---

## Key Takeaways

### Why `/api` prefix is required:

Your Nginx is configured to proxy all backend requests through `/api/`:
```nginx
location /api/ {
    proxy_pass http://localhost:3000/;  # Strips /api, forwards rest
}
```

So:
- Frontend calls `/api/user/login` → Backend receives `/user/login` ✅
- Frontend calls `/api/oauth/google` → Backend receives `/oauth/google` ✅
- Google redirects to `/api/oauth/google/callback` → Backend receives `/oauth/google/callback` ✅

### OAuth Callback URL Must Match Exactly:

| Configuration | URL |
|--------------|-----|
| Google Console Redirect URI | `http://head2code.duckdns.org/api/oauth/google/callback` |
| Backend BACKEND_URL env var | `http://head2code.duckdns.org/api` |
| Passport callbackURL | `${BACKEND_URL}/oauth/google/callback` |
| **Resulting callback** | `http://head2code.duckdns.org/api/oauth/google/callback` ✅ |

Any mismatch causes Google to reject with 400 error.

### Environment Variables:

**Development (.env):**
```env
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
```

**Production (.env.production or .env on server):**
```env
BACKEND_URL=http://head2code.duckdns.org/api
FRONTEND_URL=http://head2code.duckdns.org
```

---

## Quick Fix Checklist

- [ ] Google Console redirect URI: `http://head2code.duckdns.org/api/oauth/google/callback`
- [ ] Backend `.env`: `BACKEND_URL=http://head2code.duckdns.org/api`
- [ ] Backend `.env`: `FRONTEND_URL=http://head2code.duckdns.org`
- [ ] Backend CORS includes `head2code.duckdns.org`
- [ ] Frontend `.env.production`: `VITE_API_URL=/api`
- [ ] Nginx `proxy_pass http://localhost:3000/;` (with trailing slash)
- [ ] Backend restarted after changes
- [ ] Frontend rebuilt with production config

---

## Summary

✅ Created `.env.production` with correct URLs  
✅ Updated CORS to allow production domain  
✅ Documented Google Console setup  
✅ Provided complete deployment guide  

**The OAuth flow will now work correctly! 🚀**
