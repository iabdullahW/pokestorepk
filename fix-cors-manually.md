# Manual Firebase Storage CORS Fix

Since `gsutil` is not available on your system, you need to fix the CORS issue manually through the Google Cloud Console.

## Step-by-Step Instructions:

### 1. Go to Google Cloud Console
- Visit: https://console.cloud.google.com/
- Make sure you're logged in with the same account as your Firebase project

### 2. Select Your Project
- In the top navigation, select your project: `pokemonstore-af18a`

### 3. Navigate to Cloud Storage
- In the left sidebar, click on **"Cloud Storage"** > **"Browser"**

### 4. Select Your Bucket
- Click on your bucket: `pokemonstore-af18a.appspot.com`

### 5. Go to Permissions Tab
- Click on the **"Permissions"** tab at the top

### 6. Add CORS Configuration
- Look for **"CORS configuration"** section
- Click **"Add CORS configuration"** or **"Edit CORS configuration"**

### 7. Add the Following Configuration
Replace any existing CORS configuration with this:

```json
[
  {
    "origin": [
      "http://localhost:3000",
      "http://localhost:3001", 
      "https://pokemonstorepk.vercel.app/",
      "https://pokemonstore-af18a.firebaseapp.com"
    ],
    "method": [
      "GET",
      "POST", 
      "PUT",
      "DELETE",
      "HEAD"
    ],
    "maxAgeSeconds": 3600,
    "responseHeader": [
      "Content-Type",
      "Authorization",
      "Content-Length", 
      "User-Agent",
      "x-goog-resumable"
    ]
  }
]
```

### 8. Save the Configuration
- Click **"Save"** or **"Update"**

### 9. Wait for Changes to Propagate
- Changes may take 5-10 minutes to take effect
- You may need to restart your development server

## Alternative: Use Firebase CLI

If you want to install Firebase CLI:

```bash
npm install -g firebase-tools
firebase login
firebase init
```

Then you can use:
```bash
gsutil cors set firebase-storage-cors.json gs://pokemonstore-af18a.appspot.com
```

## Test the Fix

After applying the CORS configuration:
1. Restart your development server
2. Try uploading an image again
3. Check the browser console - the CORS error should be gone

## Current Workaround

Until you fix the CORS issue, the updated code will automatically fall back to storing images locally in the browser's localStorage. This allows you to continue testing while the CORS issue is being resolved. 