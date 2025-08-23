# Fix Firebase Storage CORS Issue

The CORS error you're seeing is preventing image uploads to Firebase Storage. Here's how to fix it:

## Option 1: Using Firebase CLI (Recommended)

1. **Install Firebase CLI** (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Set CORS configuration**:
   ```bash
   gsutil cors set firebase-storage-cors.json gs://pokemonstore-af18a.appspot.com
   ```

## Option 2: Using Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: `pokemonstore-af18a`
3. Go to **Cloud Storage** > **Browser**
4. Click on your bucket: `pokemonstore-af18a.appspot.com`
5. Go to **Permissions** tab
6. Click **Add CORS configuration**
7. Add the following configuration:
   ```json
   [
     {
       "origin": ["http://localhost:3000", "http://localhost:3001", "https://pokemonstore-af18a.vercel.app/", "https://pokemonstore-af18a.firebaseapp.com",],
       "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
       "maxAgeSeconds": 3600,
       "responseHeader": ["Content-Type", "Authorization", "Content-Length", "User-Agent", "x-goog-resumable"]
     }
   ]
   ```

## Option 3: Using gsutil directly

If you have gsutil installed:
```bash
gsutil cors set firebase-storage-cors.json gs://pokemonstorepk-af18a.appspot.com
```

## Verify the fix

After applying the CORS configuration:
1. Restart your development server
2. Try uploading an image again
3. Check the browser console - the CORS error should be gone

## Fallback Solution

If you can't fix the CORS issue immediately, the updated code now includes a base64 fallback that will store images locally in the browser's localStorage. This allows you to continue testing while the CORS issue is being resolved.

## Notes

- The CORS configuration allows requests from localhost (development) and your Firebase hosting domains
- The configuration includes all necessary HTTP methods for image uploads
- The `x-goog-resumable` header is required for Firebase Storage uploads
- Changes may take a few minutes to propagate 