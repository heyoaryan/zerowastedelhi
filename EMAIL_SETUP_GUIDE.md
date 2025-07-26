# Email Configuration Guide for Zero Waste Delhi

## Email Setup Complete ✅

Your email has been configured to use: **zerowastedelhi86@gmail.com**

All system emails will now be sent from and received at this address.

## Gmail App Password Setup Required

To enable email functionality, you need to set up a Gmail App Password:

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Navigate to Security
3. Enable 2-Step Verification if not already enabled

### Step 2: Generate App Password
1. Go to Google Account → Security → 2-Step Verification
2. Scroll down to "App passwords"
3. Select "Mail" and "Windows Computer" (or Other)
4. Generate the password
5. Copy the 16-character password (without spaces)

### Step 3: Update Backend Configuration
1. Open `backend/.env` file
2. Replace `your-gmail-app-password-here` with your actual app password:
   ```
   EMAIL_PASSWORD=your-16-character-app-password
   ```

## Email Features Configured

### For Users:
- ✅ Welcome email on registration
- ✅ Waste collection confirmation emails
- ✅ Account notifications

### For Admin (zerowastedelhi86@gmail.com):
- ✅ New user registration notifications
- ✅ Waste entry notifications
- ✅ System alerts and updates

## Testing Email Functionality

After setting up the app password, restart the backend and test:

1. Register a new user → Should receive welcome email
2. Submit waste entry → Should receive confirmation email
3. Check zerowastedelhi86@gmail.com for admin notifications

## Troubleshooting

If emails aren't working:
1. Verify app password is correct in `.env` file
2. Check Gmail security settings
3. Ensure 2FA is enabled
4. Check backend console for error messages

## Backend Status

Your backend is running on port 5000. Use `restart-backend.bat` to restart if needed.