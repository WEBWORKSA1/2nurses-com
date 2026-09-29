# 2Nurses.com — Nurse to Nurse

Static, responsive, monetization-ready website for **2Nurses.com**: lead-gen funnels (schools, travel/jobs, employers), salary explorer, NCLEX practice, nurse tools, guides, video hub, community (mentor match, Nurse of the Month), contests, careers, donations, scholarships and an advertiser page.

- **Live (GitHub Pages):** https://webworksa1.github.io/2nurses-com/
- **Business plan & phase-wise build prompt:** [BUILD-PROMPT.md](BUILD-PROMPT.md)

## Edit & rebuild
1. Edit page fragments in `_src/pages/`, shared funnel in `_src/partials/`, header/footer in `_src/build.py`.
2. Run `python3 _src/build.py` — finished pages are written to the repo root.
3. Commit and push (both `main` and `gh-pages`).

## Go-live checklist
- `assets/js/config.js`: AdSense `ca-pub` ID + slot IDs, GA4 ID, YouTube video IDs, PayPal/Stripe/Ko-fi links, donation goal.
- `ads.txt`: add your publisher line.
- Forms deliver through FormSubmit to the site owner's private inbox (address is encoded, never shown). The **first** submission triggers a one-time activation email — confirm it.
- Custom domain: add a `CNAME` file with `2nurses.com`, then set DNS A records to GitHub Pages IPs and enable HTTPS in *Settings → Pages*. Update `BASE_URL` in `_src/build.py` and rebuild.

© 2026 2Nurses.com — All rights reserved. See `legal.html` for trademark & copyright notices.
