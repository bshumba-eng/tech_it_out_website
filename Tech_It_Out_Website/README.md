# Tech It Out Website

**Tech It Out — We Make Technology Easy.**

This project is a complete website foundation for Tech It Out, including:

- Responsive public website
- Tech It Out branding and logo path
- Free IT support messaging
- Free product-choice guidance for laptops, PlayStation, Xbox and other electronics
- Repairs and troubleshooting enquiry form
- Education / Tech It Out STEM section
- FAQ
- Contact form
- Admin login/dashboard
- Supabase database structure for enquiries
- Email notification architecture using Resend
- Stripe Checkout integration point
- Privacy Policy and Terms & Conditions pages
- Easy-to-update service configuration
- Mobile navigation
- Accessible form labels and status messages

## Important: what is and is not live

The website files are ready. **Email, database, admin authentication and payments cannot become live merely by putting HTML on GitHub Pages.** They require server-side credentials and hosted services.

This project is therefore deliberately structured so the public website can be deployed while the secure backend is connected separately.

### Production stack

- Frontend: HTML + CSS + JavaScript
- Hosting/API: Node.js on a serverless/Node host such as Vercel or another Node-compatible host
- Database: Supabase
- Email: Resend
- Payments: Stripe Checkout
- Admin: protected API + dashboard

## Folder structure

```text
Tech_It_Out_Website/
├── index.html
├── admin.html
├── payment-success.html
├── privacy.html
├── terms.html
├── style.css
├── script.js
├── server.js
├── package.json
├── .env.example
├── .gitignore
├── README.md
├── images/
│   └── Tech_It_Out_Profile_Picture_V2.png   <-- put your logo here
└── supabase/
    └── schema.sql
```

## 1. Add your logo

Place your existing file here:

```text
images/Tech_It_Out_Profile_Picture_V2.png
```

The website already references that exact filename.

You can add future photos to the same `images` folder.

## 2. Test the front end

You can open `index.html` locally to inspect the design.

For the forms and admin dashboard, run the Node server instead:

```bash
npm install
node server.js
```

The website will run at:

```text
http://localhost:3000
```

The forms will show a connection error until `.env` is configured.

## 3. Set up Supabase

Create a Supabase project.

Open the SQL editor and run:

```text
supabase/schema.sql
```

Then copy your project URL and service-role key into `.env`.

**Never put the Supabase service-role key in `script.js`, HTML or any public GitHub repository.**

## 4. Configure the admin account

Copy `.env.example` to `.env`.

Set:

```text
ADMIN_EMAIL=techitout2026@gmail.com
ADMIN_PASSWORD=your-long-random-password
ADMIN_SESSION_SECRET=your-long-random-secret
```

The dashboard is:

```text
/admin.html
```

The supplied dashboard is intentionally backed by the server API rather than putting database credentials into the browser.

## 5. Email notifications

Create a Resend account and verify the sending domain.

Then configure:

```text
RESEND_API_KEY=...
EMAIL_FROM=Tech It Out <notifications@your-verified-domain.com>
NOTIFICATION_EMAIL=techitout2026@gmail.com
```

Every successful enquiry inserted into Supabase can then trigger an email notification to:

**techitout2026@gmail.com**

The sender address must be from a domain verified with your email provider.

## 6. Stripe payments

Create a Stripe account.

Create your products/prices in Stripe.

The API endpoint:

```text
POST /api/create-checkout-session
```

accepts a Stripe Price ID and returns a Stripe Checkout URL.

The secret key stays on the server:

```text
STRIPE_SECRET_KEY=sk_test_...
```

When your actual service prices are decided, create the Stripe prices and connect their IDs to the relevant service buttons.

### No prices have been invented

The public site intentionally does not display made-up prices.

This means you can finalise your Tech It Out pricing later without redesigning the website.

## 7. GitHub

If you want the code in your GitHub repository:

```bash
git init
git add .
git commit -m "Build Tech It Out website"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

**Do not commit `.env`.**

The `.gitignore` file prevents this.

## 8. Deployment

A simple production arrangement is:

```text
Customer
   |
   v
Tech It Out website
   |
   +--> /api/contact
   |       |
   |       +--> Supabase enquiries table
   |       +--> Resend email -> techitout2026@gmail.com
   |
   +--> /api/admin/*
   |       |
   |       +--> Admin dashboard
   |
   +--> /api/create-checkout-session
           |
           +--> Stripe Checkout
```

Deploy the Node project to a host that supports Node/serverless API routes. Add the same environment variables in the host's project settings.

## 9. Adding prices later

When prices are ready, do not hard-code card details all over the website.

Use Stripe Price IDs and a central service configuration.

Recommended fields:

```text
service
description
price
stripePriceId
availability
```

This keeps the website easy to maintain.

## 10. Adding images later

Add images to:

```text
images/
```

Use meaningful filenames, for example:

```text
wifi-support.jpg
repair-laptop.jpg
retro-gaming.jpg
smart-mirror.jpg
tech-products.jpg
education.jpg
```

Then add the relevant image cards to `index.html` or a future gallery configuration.

## 11. Security checklist before going live

- [ ] `.env` is NOT in GitHub
- [ ] Supabase service-role key is server-only
- [ ] Admin password is long and unique
- [ ] Admin session secret is long and random
- [ ] Resend sending domain is verified
- [ ] Stripe live keys are added only in production environment
- [ ] Stripe webhook/payment fulfilment is implemented before treating a payment as a completed order
- [ ] Privacy Policy and Terms are reviewed for the actual business
- [ ] Test contact form
- [ ] Test admin login
- [ ] Test email notification
- [ ] Test Stripe in test mode
- [ ] Test mobile layout
- [ ] Test all links
- [ ] Add final prices before enabling paid checkout

## 12. What to customise later

The site has deliberately been built so you can add:

- Prices
- More services
- Product listings
- Repair categories
- More images
- Social links
- Booking/calendar functionality
- Customer accounts
- Order history
- More admin controls
- AI technology support
- Tech It Out STEM resources
- Online tutoring content
- Future electronics buy/sell sections

### Brand

Current main brand colour:

```text
#52C2E1
```

Current background:

```text
#F7FEFF
```

The main slogan is:

**We Make Technology Easy.**

