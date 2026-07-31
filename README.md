# Criska — Business Consulting Website

Marketing website for **Criska Business Consulting Pvt. Ltd.** — built with
Next.js 16 (App Router), TypeScript, and Tailwind CSS v4.

## Stack

- **Next.js 16** (App Router, Turbopack) · **React 19**
- **Tailwind CSS v4** with CSS-variable design tokens (`src/app/globals.css`)
- **Fonts:** EB Garamond (serif headings) + Switzer (body, via Fontshare) + Inter (fallback)
- **motion** (animations) · **next-themes** (light/dark)

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build (type-check + lint + prerender)
npm run start    # serve the production build
```

## Editing content

All copy lives in one typed file: **`src/content/site.ts`** (the single source of
truth for hero, 15 services, industries, why-choose, security, leadership/board,
events, blog posts, contact, quality, FAQ, and footer). Edit values there and the
site updates — no component changes needed.

- **Board photos:** put an image in `public/team/…` and set `leadership.members[].image`.
- **Event photos:** put an image in `public/events/…` and set `events.items[].image`.

## Pages

`/` · `/blog` + `/blog/[slug]` · `/events` · `/careers` · `/case-studies` ·
`/leadership` · `/quality` · `/faq` · `/contact`

## Deploy to Vercel

Standard Next.js app — no extra config or environment variables required.

1. Push this repo to GitHub (see below).
2. Go to [vercel.com/new](https://vercel.com/new), **Import** the repo.
3. Framework preset auto-detects **Next.js**. Keep defaults and **Deploy**.

```bash
# push to a new GitHub repo (after `gh auth login`)
gh repo create criska-website --private --source=. --remote=origin --push
```

Or with the Vercel CLI:

```bash
npm i -g vercel
vercel        # first run links/creates the project
vercel --prod # production deployment
```

> The contact form and Careers "apply" are front-end only today (submit shows a
> confirmation / opens an email client). Wire them to an email service (e.g. Resend)
> before relying on them for live inquiries.
