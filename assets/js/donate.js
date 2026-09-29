(function () {
  var S = window.SITE || {}, amt = 25, freq = "one-time";
  var impact = { 10: "$10 prints 50 NCLEX cheat sheets for a study group.", 25: "$25 gives a nursing student 1 month of premium NCLEX practice.", 50: "$50 funds a Nurse of the Month thank-you gift.", 100: "$100 pays a nurse creator for a new free guide or video." };
  var $ = function (id) { return document.getElementById(id); };
  function sync() {
    $("dn-amount").value = amt; $("dn-freq").value = freq; $("dn-fund-h").value = $("dn-fund").value;
    $("dn-submit").textContent = "Pledge $" + amt + (freq === "monthly" ? "/month" : "") + " →";
    $("impact").textContent = impact[amt] || ("$" + amt + " keeps 2Nurses free and growing — thank you.");
    var d = S.donate || {}, h = "";
    if (freq === "monthly" && d.stripeMonthly) h += '<a class="btn btn-primary" target="_blank" rel="noopener" href="' + d.stripeMonthly + '">Give $' + amt + '/mo by card</a>';
    if (freq === "one-time" && d.stripe) h += '<a class="btn btn-primary" target="_blank" rel="noopener" href="' + d.stripe + '">Give by card</a>';
    if (d.paypal) h += '<a class="btn btn-teal" target="_blank" rel="noopener" href="' + d.paypal.replace(/\/$/, "") + "/" + amt + '">PayPal $' + amt + "</a>";
    if (d.kofi) h += '<a class="btn btn-ghost" target="_blank" rel="noopener" href="' + d.kofi + '">Ko-fi</a>';
    $("pay-btns").innerHTML = h;
  }
  $("amts").addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return;
    this.querySelectorAll("button").forEach(function (x) { x.classList.toggle("on", x === b); }); amt = +b.getAttribute("data-a"); $("dn-c").value = ""; sync(); });
  $("dn-c").addEventListener("input", function () { var v = Math.max(1, Math.round(+this.value || 0)); if (this.value) { amt = v; $("amts").querySelectorAll("button").forEach(function (x) { x.classList.remove("on"); }); sync(); } });
  $("freq").addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return;
    this.querySelectorAll("button").forEach(function (x) { x.classList.toggle("on", x === b); }); freq = b.getAttribute("data-f"); sync(); });
  $("dn-fund").addEventListener("change", sync);
  sync();
})();
