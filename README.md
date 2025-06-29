# LoomClone Setup Instructions

A professional screen recording web application built with Next.js, Clerk, and modern web technologies.

## Features

✅ **Screen Recording** - Record your screen with professional quality  
✅ **Camera Overlay** - Add a draggable circular camera feed  
✅ **Real-time Drawing** - Draw annotations while recording  
✅ **Multi-platform Upload** - Save to Google Drive, iCloud, or locally  
✅ **Authentication** - Secure login with Clerk  
✅ **Modern UI** - Beautiful interface with Shadcn components  
✅ **Responsive Design** - Works on all devices

## Quick Start

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Clerk Authentication (Required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key_here

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Google Drive API (Optional - for cloud uploads)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# iCloud API (Placeholder - iCloud doesn't have public API)
ICLOUD_API_KEY=your_icloud_api_key
```

### 2. Get Clerk Keys

1. Sign up at [Clerk.com](https://clerk.com)
2. Create a new application
3. Copy your Publishable Key and Secret Key
4. Add them to your `.env.local` file

### 3. Google Drive Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google Drive API
4. Create OAuth 2.0 credentials
5. Add `http://localhost:3000/api/auth/google-drive/callback` as redirect URI
6. Copy Client ID and Secret to `.env.local`

### 4. Install and Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

### Recording Screen

1. **Sign in** with Clerk authentication
2. **Click "Start Recording"** to begin screen capture
3. **Grant permissions** for screen and camera access
4. **Use the control panel** to pause/resume recording

### Camera Controls

- **Toggle camera** on/off with camera button
- **Drag the circular camera** anywhere on screen while recording
- **Toggle microphone** on/off with mic button

### Drawing Tools

1. **Click the palette icon** to enable drawing mode
2. **Choose color** with color picker
3. **Adjust brush size** with slider
4. **Draw on screen** while recording
5. **Clear drawings** with reset button

### Saving & Uploading

1. **Stop recording** to save video
2. **Download locally** or **upload to cloud**
3. **Configure storage** in settings panel
4. **Connect Google Drive** for cloud uploads

## Browser Support

- **Chrome/Edge** - Full support (recommended)
- **Firefox** - Screen recording supported
- **Safari** - Limited screen recording support

## Technical Details

### Built With

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI components
- **Clerk** - Authentication
- **Lucide React** - Icons
- **MediaRecorder API** - Screen recording
- **getUserMedia API** - Camera access

### Browser APIs Used

- `navigator.mediaDevices.getDisplayMedia()` - Screen capture
- `navigator.mediaDevices.getUserMedia()` - Camera/mic access
- `MediaRecorder` - Video recording
- `Canvas API` - Drawing functionality
- `File System Access API` - Local file saving

## Troubleshooting

### Screen Recording Not Working

- Ensure you're using HTTPS or localhost
- Grant screen sharing permissions
- Try Chrome/Edge browsers

### Camera Not Showing

- Allow camera permissions
- Check if camera is being used by other apps
- Refresh page and try again

### Upload Issues

- Check API keys in `.env.local`
- Ensure Google Drive API is enabled
- Verify redirect URLs are correct

### Drawing Not Working

- Click palette icon to enable drawing mode
- Ensure you're in recording mode
- Try refreshing the page

## Development

### Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   │   ├── auth/       # Authentication endpoints
│   │   └── upload/     # File upload endpoints
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── ui/            # Shadcn UI components
│   ├── cloud-storage.tsx
│   └── screen-recorder.tsx
└── lib/
    └── utils.ts       # Utility functions
```

### Key Components

- **ScreenRecorder** - Main recording interface
- **CloudStorage** - Upload management
- **Button** - Reusable UI component

## Security & Privacy

- **Local Processing** - Videos processed in browser
- **Secure Authentication** - Clerk handles user auth
- **Optional Cloud Upload** - User controls data sharing
- **No Server Storage** - Videos not stored on our servers

## Support

For issues or questions:

1. Check browser console for errors
2. Verify environment variables
3. Test in Chrome/Edge browsers
4. Check network connectivity for uploads

## License

Built with ❤️ using modern web technologies.
