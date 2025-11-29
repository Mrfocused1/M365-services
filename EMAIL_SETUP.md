# Email Setup Instructions

The contact form on your website now sends email notifications to **info@m365itservices.com** when someone submits the form.

## Setup Steps

### 1. Create a Resend Account
1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

### 2. Get Your API Key
1. Log in to your Resend dashboard
2. Go to **API Keys** section
3. Click **Create API Key**
4. Give it a name (e.g., "M365 Production")
5. Copy the API key (it starts with `re_`)

### 3. Add API Key to Environment Variables

#### For Local Development:
1. Open `.env.local` file in your project
2. Replace `your_resend_api_key_here` with your actual API key:
   ```
   RESEND_API_KEY=re_your_actual_key_here
   ```

#### For Vercel Deployment:
1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name**: `RESEND_API_KEY`
   - **Value**: `re_your_actual_key_here`
4. Click **Save**
5. Redeploy your site

### 4. Verify Your Domain (Optional but Recommended)

By default, emails are sent from `onboarding@resend.dev`. To use your own domain:

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `m365itservices.com`)
4. Add the DNS records shown to your domain provider
5. Wait for verification
6. Update the `from` field in `app/api/send-email/route.ts`:
   ```typescript
   from: 'M365 IT Services <noreply@m365itservices.com>',
   ```

## How It Works

When someone fills out the contact form:

1. ✅ Form data is saved to Supabase database (`form_submissions` table)
2. ✅ An email is sent to **info@m365itservices.com** with:
   - Contact's name
   - Contact's email address
   - Contact's phone number (if provided)
   - Contact's company (if provided)
   - Their message
3. ✅ User sees a "Thank You" message

## Troubleshooting

- **Emails not being sent?**
  - Check that `RESEND_API_KEY` is set in Vercel environment variables
  - Check the API route logs in Vercel dashboard
  - Verify your Resend API key is valid

- **Form submits but no email?**
  - The form will still save to database even if email fails
  - Check browser console for errors
  - Verify the API route is accessible at `/api/send-email`

## Free Tier Limits

Resend free tier includes:
- **3,000 emails per month**
- **100 emails per day**

This should be more than enough for contact form submissions.
