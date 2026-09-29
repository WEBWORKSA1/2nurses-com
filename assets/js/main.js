/* 2Nurses.com — core interactions (vanilla JS, no dependencies) */
(function () {
  "use strict";
  var S = window.SITE || {};
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- Theme ---------- */
  var root = document.documentElement;
  var saved = store.get("2n-theme");
  if (saved) root.setAttribute("data-theme", saved);
  else if (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches) root.setAttribute("data-theme", "dark");
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-theme-toggle]");
    if (!t) return;
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next); store.set("2n-theme", next);
  });

  /* ---------- Mobile menu ---------- */
  var burger = $(".burger"), menu = $(".menu");
  if (burger && menu) burger.addEventListener("click", function () {
    var open = menu.classList.toggle("open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });

  /* ---------- Current page highlight ---------- */
  var here = location.pathname.split("/").pop() || "index.html";
  $$(".menu a").forEach(function (a) { if (a.getAttribute("href") === here) a.setAttribute("aria-current", "page"); });

  /* ---------- Reveal on scroll ---------- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    $$(".reveal").forEach(function (el) { io.observe(el); });
  } else $$(".reveal").forEach(function (el) { el.classList.add("in"); });
  setTimeout(function () { $$(".reveal").forEach(function (el) { el.classList.add("in"); }); }, 2500);

  /* ---------- Counters ---------- */
  $$("[data-count]").forEach(function (el) {
    var end = parseFloat(el.getAttribute("data-count")), suf = el.getAttribute("data-suffix") || "", t0 = null;
    function step(ts) { if (!t0) t0 = ts; var p = Math.min((ts - t0) / 1400, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString() + suf; if (p < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  });

  /* ---------- Back to top ---------- */
  var tt = $(".to-top");
  if (tt) { window.addEventListener("scroll", function () { tt.classList.toggle("show", scrollY > 700); }, { passive: true });
    tt.addEventListener("click", function () { scrollTo({ top: 0, behavior: "smooth" }); }); }

  /* ---------- Cookie / consent ---------- */
  var ck = $(".cookie");
  if (ck && !store.get("2n-consent")) ck.classList.add("show");
  $$("[data-consent]").forEach(function (b) { b.addEventListener("click", function () {
    store.set("2n-consent", b.getAttribute("data-consent")); ck && ck.classList.remove("show"); }); });

  /* ---------- AdSense ---------- */
  if (S.adsenseClient) {
    var sc = document.createElement("script"); sc.async = true; sc.crossOrigin = "anonymous";
    sc.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + S.adsenseClient;
    document.head.appendChild(sc);
    $$(".ad-slot").forEach(function (slot) {
      var key = slot.getAttribute("data-ad") || "leaderboard";
      var ins = document.createElement("ins"); ins.className = "adsbygoogle"; ins.style.display = "block";
      ins.setAttribute("data-ad-client", S.adsenseClient);
      if (S.adSlots && S.adSlots[key]) ins.setAttribute("data-ad-slot", S.adSlots[key]);
      ins.setAttribute("data-ad-format", key === "inArticle" ? "fluid" : "auto");
      if (key === "inArticle") ins.setAttribute("data-ad-layout", "in-article");
      ins.setAttribute("data-full-width-responsive", "true");
      slot.innerHTML = ""; slot.classList.add("filled"); slot.appendChild(ins);
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
    });
  }
  /* ---------- GA4 ---------- */
  if (S.ga4) {
    var g = document.createElement("script"); g.async = true; g.src = "https://www.googletagmanager.com/gtag/js?id=" + S.ga4; document.head.appendChild(g);
    window.dataLayer = window.dataLayer || []; window.gtag = function () { dataLayer.push(arguments); };
    gtag("js", new Date()); gtag("config", S.ga4);
  }
  function track(name, params) { if (window.gtag) gtag("event", name, params || {}); }

  /* ---------- YouTube lite embeds ---------- */
  $$(".video[data-topic]").forEach(function (v) {
    var id = (S.videos || {})[v.getAttribute("data-topic")] || v.getAttribute("data-id") || "";
    var q = v.getAttribute("data-q") || "nursing";
    if (id) v.style.backgroundImage = "url(https://i.ytimg.com/vi/" + id + "/hqdefault.jpg)";
    v.setAttribute("role", "button"); v.setAttribute("tabindex", "0");
    function go() {
      if (id) { v.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0" title="' + (v.getAttribute("data-title") || "Video") + '" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>'; }
      else window.open("https://www.youtube.com/results?search_query=" + encodeURIComponent(q), "_blank", "noopener");
      track("video_play", { topic: v.getAttribute("data-topic") });
    }
    v.addEventListener("click", go);
    v.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
  });

  /* ---------- Private mail links (address never rendered) ---------- */
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-mail]");
    if (!a || !window.__r) return;
    e.preventDefault();
    location.href = "mailto:" + window.__r() + "?subject=" + encodeURIComponent(a.getAttribute("data-mail") || "2Nurses.com inquiry");
  });

  /* ---------- Form engine ---------- */
  function collect(form) {
    var data = {}, fd = new FormData(form);
    fd.forEach(function (val, key) {
      if (key === "_gotcha") return;
      if (data[key]) data[key] += ", " + val; else data[key] = val;
    });
    return data;
  }
  function showMsg(form, ok, html) {
    var m = form.querySelector(".form-msg") || form.parentNode.querySelector(".form-msg");
    if (!m) { m = document.createElement("div"); m.className = "form-msg"; form.appendChild(m); }
    m.className = "form-msg " + (ok ? "ok" : "err"); m.innerHTML = html; m.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
  function send(form, extra) {
    var hp = form.querySelector('[name="_gotcha"]');
    if (hp && hp.value) return Promise.resolve(true);
    var data = collect(form); Object.assign(data, extra || {});
    var kind = form.getAttribute("data-form") || "general";
    data._subject = "[2Nurses.com] " + (form.getAttribute("data-subject") || kind) + " — new submission";
    data._template = "table"; data._captcha = "false";
    data.form_type = kind; data.page = location.href; data.submitted_at = new Date().toISOString();
    var btn = form.querySelector('[type="submit"]'); var txt = btn ? btn.innerHTML : "";
    if (btn) { btn.disabled = true; btn.innerHTML = "Sending…"; }
    return fetch("https://formsubmit.co/ajax/" + window.__r(), {
      method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data)
    }).then(function (r) { return r.json(); }).then(function (j) {
      if (j && (j.success === "true" || j.success === true)) return true; throw new Error("fail");
    }).catch(function () {
      // Fallback: open the visitor's own email app with the details prefilled.
      var body = Object.keys(data).filter(function (k) { return k.charAt(0) !== "_"; }).map(function (k) { return k + ": " + data[k]; }).join("\n");
      form._fallback = "mailto:" + window.__r() + "?subject=" + encodeURIComponent(data._subject) + "&body=" + encodeURIComponent(body);
      return false;
    }).finally(function () { if (btn) { btn.disabled = false; btn.innerHTML = txt; } });
  }
  window.TwoNurses = { send: send, showMsg: showMsg, track: track };

  $$("form[data-form]").forEach(function (form) {
    if (form.hasAttribute("data-funnel")) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      send(form).then(function (ok) {
        track("generate_lead", { form: form.getAttribute("data-form") });
        if (ok) { showMsg(form, true, form.getAttribute("data-success") || "Thank you! Your message was received. We’ll be in touch shortly."); form.reset(); }
        else showMsg(form, false, 'We couldn’t reach our secure inbox right now. <a href="#" class="mail-fb">Tap here to send it with your email app</a> — your answers are pre-filled.');
      });
    });
  });
  document.addEventListener("click", function (e) {
    var a = e.target.closest(".mail-fb"); if (!a) return; e.preventDefault();
    var f = a.closest("form") || document.querySelector("form"); if (f && f._fallback) location.href = f._fallback;
  });

  /* ---------- Multi-step lead funnels ---------- */
  $$("[data-funnel]").forEach(function (form) {
    var steps = $$(".step", form), i = 0, bar = $(".progress i", form), meta = $(".step-cur", form), tot = $(".step-tot", form);
    if (tot) tot.textContent = steps.length;
    function show(n) {
      steps.forEach(function (s, k) { s.classList.toggle("active", k === n); });
      if (bar) bar.style.width = Math.round(((n + 1) / steps.length) * 100) + "%";
      if (meta) meta.textContent = n + 1; i = n;
      var pv = $("[data-prev]", form), nx = $("[data-next]", form), sb = $('[type="submit"]', form), last = n === steps.length - 1;
      if (pv) pv.style.visibility = n === 0 ? "hidden" : "visible";
      if (nx) nx.style.display = last ? "none" : "";
      if (sb) sb.style.display = last ? "" : "none";
    }
    function valid(step) {
      var ok = true;
      $$("input,select,textarea", step).forEach(function (el) { if (!el.checkValidity()) { if (ok) el.reportValidity(); ok = false; } });
      var groups = {}; $$('input[type="radio"][data-req]', step).forEach(function (r) { groups[r.name] = groups[r.name] || r.form.querySelector('[name="' + r.name + '"]:checked'); });
      for (var g in groups) if (!groups[g]) { ok = false; alert("Please choose an option to continue."); break; }
      return ok;
    }
    form.addEventListener("click", function (e) {
      if (e.target.closest("[data-next]")) { e.preventDefault(); if (valid(steps[i])) { show(Math.min(i + 1, steps.length - 1)); track("funnel_step", { form: form.getAttribute("data-form"), step: i + 1 }); } }
      if (e.target.closest("[data-prev]")) { e.preventDefault(); show(Math.max(i - 1, 0)); }
    });
    $$('.choices input[type="radio"]', form).forEach(function (r) {
      r.addEventListener("change", function () { var s = r.closest(".step"); if (s && s.hasAttribute("data-auto") && i < steps.length - 1) setTimeout(function () { show(i + 1); }, 220); });
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault(); if (!valid(steps[i])) return;
      send(form).then(function (ok) {
        track("generate_lead", { form: form.getAttribute("data-form") });
        var done = $(".funnel-done", form.parentNode);
        if (ok && done) { form.style.display = "none"; done.style.display = "block"; }
        else if (ok) showMsg(form, true, "You’re matched! A 2Nurses coordinator will follow up within 1 business day.");
        else showMsg(form, false, 'Our secure inbox is busy. <a href="#" class="mail-fb">Tap here to send your request with your email app</a> — everything is pre-filled.');
      });
    });
    show(0);
  });

  /* ---------- Tabs (funnel selector etc.) ---------- */
  $$("[data-tabs]").forEach(function (wrap) {
    var btns = $$("[role=tab]", wrap);
    btns.forEach(function (b) { b.addEventListener("click", function () {
      btns.forEach(function (x) { x.setAttribute("aria-selected", x === b ? "true" : "false"); var p = document.getElementById(x.getAttribute("aria-controls")); if (p) p.hidden = x !== b; });
    }); });
    var hash = location.hash.replace("#", "");
    var pre = btns.filter(function (b) { return b.getAttribute("data-key") === hash; })[0];
    if (pre) pre.click();
  });

  /* ---------- Countdown ---------- */
  $$("[data-deadline]").forEach(function (el) {
    var end = new Date(el.getAttribute("data-deadline")).getTime();
    function tick() { var d = Math.max(0, end - Date.now()), s = Math.floor(d / 1000);
      el.innerHTML = [["Days", Math.floor(s / 86400)], ["Hrs", Math.floor(s % 86400 / 3600)], ["Min", Math.floor(s % 3600 / 60)], ["Sec", s % 60]]
        .map(function (p) { return "<div><b>" + p[1] + "</b><span>" + p[0] + "</span></div>"; }).join(""); }
    tick(); setInterval(tick, 1000);
  });

  /* ---------- Donation goal meter ---------- */
  $$("[data-goal]").forEach(function (el) {
    var g = S.goal || { raised: 0, target: 1 }; var pct = Math.min(100, Math.round((g.raised / g.target) * 100));
    el.innerHTML = '<div class="meter"><i style="width:' + Math.max(pct, 2) + '%"></i></div><p class="fine" style="margin-top:6px"><b>$' + g.raised.toLocaleString() + "</b> raised of $" + g.target.toLocaleString() + " goal · " + g.label + "</p>";
  });

  /* ---------- Year ---------- */
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
