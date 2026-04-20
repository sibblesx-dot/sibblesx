# Deployment Guide - sibblesX Portfolio

## Quick Deploy to Netlify

### Step 1: Push to GitHub

```bash
# Add your GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/sibblesX.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### Step 2: Deploy on Netlify

1. **Go to netlify.com** and sign up or log in with GitHub
2. **Click "Add new site"** → **"Import an existing project"**
3. **Select GitHub** and authorize Netlify
4. **Choose the `sibblesX` repository**
5. **Build settings:**
   - Build command: (leave empty or use `echo 'No build'`)
   - Publish directory: `.` (root)
6. **Click "Deploy site"**

### Step 3: Set Custom Domain

1. After deployment, go to **Site settings**
2. Click **"Domain management"**
3. Click **"Add custom domain"**
4. Enter: `sibblesX.com` (or your preferred domain)
5. Follow DNS setup instructions
6. Update your domain registrar's nameservers

### Step 4: Enable HTTPS

Netlify auto-enables HTTPS once domain is set up.

---

## Important Notes

⚠️ **Backend API**: The Flask backend.py is currently configured to run locally on `http://localhost:5000`. For production:

**Option A: Disable API Features** (Recommended for now)
- The chatbot works with built-in responses
- No backend dependency needed

**Option B: Deploy Backend Separately**
- Use Heroku, Render, Railway, or similar services
- Update `CHATBOT_CONFIG.apiUrl` in chatbot.js

---

## File Structure

```
sibblesX/
├── index.html              # Main portfolio page
├── style.css               # Styling
├── script.js               # Page interactions
├── chatbot.js              # AI chatbot (works without backend)
├── sibblesx-logo.png       # Your logo
├── backend.py              # Flask API (for local use only)
├── requirements.txt        # Python dependencies
├── netlify.toml            # Netlify configuration
├── .gitignore              # Git ignore rules
└── README.md               # Documentation
```

---

## Testing Before Deploy

```bash
# Test locally
python3 -m http.server 8000

# Visit http://localhost:8000
```

---

## Support

- **Email**: sibblesx@gmail.com
- **Phone**: +91 8791012083
- **Instagram**: @sibblesx
