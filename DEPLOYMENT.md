# Cloudflare Pages Deployment Guide

## Quick Deploy (Recommended)

### Option 1: Via Cloudflare Dashboard (Easiest)

1. **Go to Cloudflare Dashboard**: https://dash.cloudflare.com/
2. **Navigate to**: Workers & Pages → Create application → Pages tab
3. **Connect to GitHub**: Click "Connect to Git"
4. **Select Repository**: `navin1976/prost-health`
5. **Configure Build Settings**:
   ```
   Build command: npm run build
   Build output directory: dist
   Root directory: /
   Node version: 24
   ```
6. **Environment Variables**: (none required for static site)
7. **Click**: "Save and Deploy"

Your site will be live at: `https://prost-health.pages.dev`

### Option 2: Via Wrangler CLI

```bash
# Install Wrangler globally
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
npm run build
wrangler pages deploy dist --project-name=prost-health
```

## Build Configuration

- **Framework**: Astro (Static Site)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: 24.8.0 (specified in .nvmrc)
- **Package Manager**: pnpm

## Automatic Deployments

Once connected via GitHub:
- **Main branch**: Automatically deploys to production
- **Pull requests**: Automatically create preview deployments
- **Instant rollbacks**: Available in Cloudflare dashboard

## Custom Domain

To use `prost.health` or your own domain:

1. **In Cloudflare Dashboard**: Go to your Pages project
2. **Click**: "Custom domains" tab
3. **Click**: "Set up a custom domain"
4. **Enter**: `prost.health` (or your domain)
5. **Follow**: DNS configuration instructions

Cloudflare will automatically:
- Provision SSL certificate (free)
- Configure CDN
- Enable HTTP/3 and Brotli compression

## Performance Features (Enabled by Default)

✅ Global CDN (330+ locations)
✅ Automatic HTTPS/SSL
✅ HTTP/3 & QUIC
✅ Brotli compression
✅ DDoS protection
✅ Zero cold starts (static site)
✅ Unlimited bandwidth (Free plan: 500 builds/month)

## Preview Deployments

Every PR automatically gets a unique URL:
```
https://[commit-hash].prost-health.pages.dev
```

## Monitoring

View deployments at:
```
https://dash.cloudflare.com/ → Workers & Pages → prost-health
```

Shows:
- Deployment status
- Build logs
- Analytics (visits, bandwidth)
- Web Vitals

## Troubleshooting

### Build Fails
- Check build logs in Cloudflare Dashboard
- Ensure Node version is 24.x
- Run `npm run build` locally first

### Assets Not Loading
- Verify `dist` folder contains all files
- Check `astro.config.mjs` site URL

### Domain Issues
- Wait 5-10 minutes for DNS propagation
- Use Cloudflare nameservers for fastest setup

## Local Preview

Test production build locally:
```bash
npm run build
npm run preview
```

## Repository
- **GitHub**: https://github.com/navin1976/prost-health
- **Cloudflare Pages**: Will be at `https://prost-health.pages.dev`
