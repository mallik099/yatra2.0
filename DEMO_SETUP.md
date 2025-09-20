# 🚍 Yatra Demo Setup

## Quick Start (No Backend Required)

The app is configured to work immediately with demo data. No API keys or backend setup needed!

### What's Working:

✅ **Live Bus Tracking** - Sample TSRTC buses with real-time simulation  
✅ **Interactive Map** - Click buses to see details  
✅ **Route Search** - Search between Hyderabad locations  
✅ **Real-time Updates** - Bus locations update every 10 seconds  
✅ **Mobile Responsive** - Works on all devices  

### Demo Data Includes:

- **100K**: Secunderabad ↔ Koti
- **156**: Mehdipatnam ↔ KPHB  
- **290U**: LB Nagar ↔ Gachibowli
- **218**: Ameerpet ↔ Uppal

### To Use Real API:

1. Set `REACT_APP_USE_MOCK_API=false` in `.env.local`
2. Set `REACT_APP_BACKEND_AVAILABLE=true` 
3. Update `REACT_APP_API_URL` to your backend URL

### Free API Alternatives:

- **MockAPI**: https://mockapi.io/ (Free tier: 100 requests/day)
- **JSONBin**: https://jsonbin.io/ (Free tier: 10K requests/month)
- **Reqres**: https://reqres.in/ (Free testing API)

### Current Configuration:

```env
REACT_APP_USE_MOCK_API=true
REACT_APP_BACKEND_AVAILABLE=false
```

The app automatically falls back to demo mode if backend is unavailable.