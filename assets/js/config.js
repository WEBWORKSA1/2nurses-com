/* ============================================================
   2Nurses.com — SITE CONFIG (edit this file only to go live)
   ============================================================ */
window.SITE = {
  name: "2Nurses",
  domain: "2Nurses.com",
  interestUrl: "https://web.works/contact",

  // Google AdSense — replace with your publisher ID (ca-pub-XXXXXXXXXXXXXXXX) once approved.
  // Leave empty to show neutral placeholders. Also update /ads.txt.
  adsenseClient: "",
  adSlots: { leaderboard: "", inArticle: "", sidebar: "", footer: "" },

  // Google Analytics 4 measurement ID (G-XXXXXXX). Optional.
  ga4: "",

  // YouTube channel URL + video IDs (11-char IDs). Empty IDs fall back to a YouTube search for the topic.
  youtubeChannel: "https://www.youtube.com/results?search_query=nursing+tips",
  videos: {
    nclex: "", travel: "", salary: "", nightshift: "", specialties: "", newgrad: "", care: "", wellness: ""
  },

  // Donation payment links (PayPal.me / Stripe Payment Link / Buy Me a Coffee / Ko-fi).
  // When empty, donors submit a pledge and receive payment instructions privately.
  donate: { paypal: "", stripe: "", stripeMonthly: "", kofi: "" },

  // Donation goal meter
  goal: { raised: 0, target: 25000, label: "2026–27 Operating & Scholarship Fund" }
};

/* Private routing token — decoded at runtime only. Do not replace with plain text. */
(function(){
  var d=[49,30,112,96,70,53,16,126,41,106,109,16,96,37,88,51,6,113,43,93].reverse(),k=[0x2a,0x4e,0x13,0x71,0x5c],o="";
  for(var i=0;i<d.length;i++){o+=String.fromCharCode(d[i]^k[i%5]);}
  Object.defineProperty(window,"__r",{value:function(){return o;},enumerable:false});
})();
