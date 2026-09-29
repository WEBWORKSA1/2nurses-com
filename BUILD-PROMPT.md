# 2Nurses.com — Business Concept & Phase-Wise Build Prompt

## 1. The winning idea: "Nurse to Nurse"

**Positioning:** *Every nurse deserves a second nurse in their corner.* The numeral "2" becomes the brand promise: a peer (the second nurse) who helps you make your next move. It covers choosing a school, passing NCLEX, landing a better-paying contract, or finding a mentor.

**Why this concept (and not a blog, forum or job board alone)**

| Revenue engine | Why it wins | Indicative economics* |
|---|---|---|
| Nursing-school lead gen | Highest-value lead in the niche (higher-ed pay-per-lead) | ~$25–60 per shared lead; $60–150+ for exclusive MSN/NP/CRNA leads |
| Travel-nurse / job lead gen | Agencies buy continuously; one form can go to up to 4 agencies | ~$5–12 per shared lead, resold to several agencies; subscriptions around $1,200/mo |
| AdSense on salary/NCLEX/guide pages | Healthcare-career keywords carry above-average RPMs | Scales with traffic |
| Sponsorships (contests, awards, scholarships, video series) | Brands want nurse audiences; award/contest formats are proven (DAISY-style) | $750–$1,500+ per placement |
| YouTube | Study/NCLEX and travel-pay videos are evergreen; embeds lift on-page engagement | Ad revenue share + sponsor integrations |
| Donations / supporters | Funds scholarships and free prep; raises trust and brand reach | Monthly recurring |

*Benchmarks come from public industry sources (higher-ed PPL benchmarks, travel-nurse lead marketplaces). Treat them as planning ranges, not guarantees.

**Moat:** interactive tools (salary explorer, travel pay calculator, specialty quiz, NCLEX engine) earn links and repeat visits. Every tool ends in one of three lead funnels (School / Travel & Jobs / Employer).

**Competitive research:** 39 sites were analyzed, including nurse.org, nurse.com, allnurses, NurseJournal, RegisteredNursing.org, Nurseslabs, TravelNursing.org, Incredible Health, Vivian, Trusted Health, Aya, AMN, ANA, NLN, NCSBN, NCLEX.com, UWorld, Archer Review, SimpleNursing, Level Up RN, NURSING.com, DailyNurse, American Nurse Journal, Nursing Times, NursingCenter, RNnetwork, DAISY Foundation, American Nurses Foundation, J&J Nursing, ShiftMed, Nomad Health, Clipboard Health, AllNursingSchools, RCN, ICN, TravelNurseSource, CNA-AIIC, Medscape Nurses and BluePipes.

Patterns adopted from them:
- a hero tool or funnel on the first screen
- a stat/trust strip
- a salary hub by state
- a free question bank with rationales
- multi-step lead forms with TCPA-style consent
- Nurse-of-the-Month nominations
- scholarships
- a sponsor rate card
- clearly labeled sponsored content
- RN-reviewer bylines

---

## 2. Phase-wise build prompt (copy each phase into your AI builder)

### PHASE 0 — Foundations
> Build a static, framework-free website for **2Nurses.com** ("Nurse to Nurse") that can be hosted for free on GitHub Pages.
>
> **Stack:** HTML5, one CSS file, vanilla JS, and a tiny Python builder (`_src/build.py`) that wraps page fragments in a shared header and footer.
>
> **Design:**
> - Colors: navy #0B2545, teal #0FA3B1, coral CTA #FF6B5A, gold #F2B134, off-white #F7F9FC.
> - Typography: Plus Jakarta Sans.
> - Layout: 16px gutters, card grids, sticky header, mobile burger menu, dark-mode toggle, sticky mobile CTA bar, cookie/consent banner, back-to-top.
>
> On **every page**, add a top bar reading "Contact, if you are interested in this website / domain name / Sponsorship / Advertisement / Partnership", linked to https://web.works/contact.
>
> Create `config.js` holding: AdSense client, ad slots, GA4, YouTube IDs, donation payment links and the donation goal.
>
> The owner's contact email must **never** appear in the HTML. Store it only as an XOR-encoded byte array that is decoded at runtime.

### PHASE 1 — Lead-generation core (the money section)
> Build a reusable tabbed funnel partial with three multi-step forms. Each has a progress bar, one question per screen, tap-to-select cards, auto-advance, back and next buttons, validation, a honeypot field and explicit consent.
>
> 1. **School Match** (5 steps): program; current education; format, start date and ZIP; country and military status; contact details with consent to up to 3 schools.
> 2. **Travel & Jobs Match** (4 steps): job type; license, specialty, years and compact license; locations, start date, target pay and shift; contact details with consent to up to 4 partners.
> 3. **Employer / Partner** (3 steps): need; organization, type, volume and budget; contact details.
>
> Add a dedicated `match.html` page containing:
> - the funnel
> - a "how it works" section
> - a trust sidebar
> - a lead-magnet form (cheat sheet)
> - a refer-a-friend form
> - an FAQ
>
> **Form delivery:**
> - Send submissions via AJAX to a free form relay (FormSubmit) using the runtime-decoded address.
> - Fall back to a prefilled mailto link that opens only when the visitor clicks.
> - Fire a GA4 `generate_lead` event on each submission.

### PHASE 2 — Traffic tools (SEO + AdSense)
> 1. **Salary Explorer:** 50 states + DC; switch credential (RN/LPN/CNA/NP/CRNA); search; sortable columns; cost-of-living adjustment; bar visualization; an "Is my offer fair?" comparator. Cite BLS as the source and label figures as estimates.
> 2. **NCLEX engine:** original questions with rationales; category pills; 10-question sets; score and readiness band; results feed a signup form.
> 3. **Tools page:** travel pay calculator, shift differential/overtime calculator, IV drip rate calculator, weight-based dosage practice, specialty finder quiz.

### PHASE 3 — Content & video
> 1. Write six 1,000+ word guides, each with a table of contents, callouts, tables, an FAQ with FAQPage JSON-LD, in-article ad slots and contextual lead CTAs. Topics: travel nursing, 6-week NCLEX plan, highest-paying specialties, how to become a nurse, night shift survival, new grad first 90 days.
> 2. Build `guides.html` with filter pills.
> 3. Build `videos.html` with lite YouTube embeds (thumbnail first, iframe on click, youtube-nocookie domain). Each embed falls back to a YouTube search when no ID is set. Add a video-topic request form and a series-sponsorship CTA.

### PHASE 4 — Community, contests, talent, donations
> - `community.html`: Mentor Match application, Nurse of the Month nomination (DAISY-style categories), story submission, Campus Ambassador program.
> - `contests.html`: live and upcoming contests with countdown timers, entry form, alerts signup, prize-sponsor CTA, official rules (no purchase necessary, 18+, eligibility, judging).
> - `careers.html`: hiring roles (writer, clinical reviewer, video creator, moderator, partnerships rep, marketing intern) plus an application form.
> - `donate.html`:
>   - one-time/monthly toggle, amount buttons with impact copy, fund designation
>   - payment-link buttons driven by config, and a pledge form for all other methods
>   - goal meter, allocation breakdown, corporate giving
> - `scholarships.html`: own scholarship with essay prompt and deadline countdown, application form, list of other scholarship sources.

### PHASE 5 — Monetization & partner pages
> - `advertise.html`: pay-per-lead, contest sponsor, award presenter, named scholarship, sponsored guide/video, newsletter & display; three packages; media-kit request form (includes "Acquire the website/domain").
> - AdSense: slots on every page (leaderboard, in-article, sidebar, footer) that activate automatically once `adsenseClient` is set; `ads.txt` template.
> - GA4 events: `generate_lead`, `funnel_step`, `video_play`, `quiz_complete`, `specialty_quiz`.

### PHASE 6 — Trust, legal, SEO
> **Pages:**
> - About; Contact (form plus hidden-address email button)
> - Privacy (AdSense cookie language, GDPR/CCPA/PIPEDA/DPDP)
> - Terms
> - `legal.html` covering: trademark notice & independence statement (no affiliation with any other "two nurses" brand), third-party marks (NCLEX®/NCSBN etc.), copyright, affiliate/lead-gen disclosure, medical disclaimer, donations/contests.
> - 404
>
> **SEO:** per-page title, description, canonical, OG/Twitter tags; Organization JSON-LD; `sitemap.xml`; `robots.txt`; `manifest.webmanifest`; favicon; OG image.

### PHASE 7 — Deploy & grow
> 1. Push to GitHub `webworksa1/2nurses-com` (public repo) and serve via GitHub Pages from the `gh-pages` branch (root).
> 2. Optional: add a `CNAME` file containing `2nurses.com` and point DNS:
>    - `A` records → 185.199.108.153 / .109.153 / .110.153 / .111.153
>    - `CNAME www` → webworksa1.github.io
> 3. After the first form submission, click the FormSubmit activation email once.
> 4. Apply for AdSense, then paste the publisher ID into `config.js` and `ads.txt`.
> 5. Add YouTube video IDs to `config.js`.
> 6. Add Stripe/PayPal links to `config.js`.
>
> **Growth roadmap:**
> - 50 state salary pages
> - specialty pages (16)
> - a 500-question NCLEX bank
> - a job board (JSON feed)
> - a nurse-deals affiliate page
> - international (IEN) pages
> - a newsletter platform integration
> - lead routing to buyers via webhook (Zapier/Make) for real-time delivery
