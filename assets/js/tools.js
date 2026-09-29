/* 2Nurses interactive tools */
(function () {
  var money = function (n) { return "$" + (Math.round(n * 100) / 100).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 }); };
  function bind(id, fn) { var f = document.getElementById(id); if (!f) return; f.addEventListener("input", function () { fn(f); }); fn(f); }

  // Travel pay
  bind("f-travel", function (f) {
    var h = +f.hours.value || 0, base = +f.base.value || 0, house = +f.housing.value || 0, meals = +f.meals.value || 0, tax = (+f.tax.value || 0) / 100, ot = +f.ot.value || 0;
    var taxable = h * base + ot * base * 1.5, net = taxable * (1 - tax) + house + meals, gross = taxable + house + meals;
    var blended = gross / Math.max(h + ot, 1);
    document.getElementById("o-travel").innerHTML =
      '<div class="grid g2"><div><p class="muted">Weekly gross</p><div class="kpi">' + money(gross) + '</div></div><div><p class="muted">Est. weekly take-home</p><div class="kpi" style="color:var(--ok)">' + money(net) + "</div></div></div>" +
      "<p>Blended rate: <b>" + money(blended) + "/hr</b> · 13-week contract gross: <b>" + money(gross * 13) + "</b> · take-home ≈ <b>" + money(net * 13) + "</b></p>" +
      '<p class="fine">Stipends are tax-free only if you keep a qualifying tax home and do not exceed GSA limits. Consult a tax professional.</p>';
  });
  // Shift pay
  bind("f-shift", function (f) {
    var base = +f.base.value || 0, shifts = +f.shifts.value || 0, len = +f.len.value || 12, night = +f.night.value || 0, wknd = +f.wknd.value || 0, nights = +f.nights.value || 0, wk = +f.wkshifts.value || 0;
    var hrs = shifts * len, reg = Math.min(hrs, 40), ot = Math.max(hrs - 40, 0);
    var pay = reg * base + ot * base * 1.5 + nights * len * night + wk * len * wknd;
    document.getElementById("o-shift").innerHTML = '<div class="kpi">' + money(pay) + '<small style="font-size:1rem;color:var(--muted)"> / week</small></div><p>' + hrs + " hrs (" + ot + " OT) · differentials add <b>" + money(nights * len * night + wk * len * wknd) + "</b> · annualized ≈ <b>" + money(pay * 52) + "</b></p>";
  });
  // Drip rate
  bind("f-drip", function (f) {
    var vol = +f.vol.value || 0, mins = (+f.hrs.value || 0) * 60 + (+f.min.value || 0), df = +f.df.value || 15;
    if (!mins) return;
    var mlhr = vol / (mins / 60), gtt = vol * df / mins;
    document.getElementById("o-drip").innerHTML = '<div class="grid g2"><div><p class="muted">Pump rate</p><div class="kpi">' + mlhr.toFixed(1) + ' mL/hr</div></div><div><p class="muted">Gravity</p><div class="kpi">' + Math.round(gtt) + " gtt/min</div></div></div><p class='fine'>Formula: (" + vol + " mL × " + df + " gtt/mL) ÷ " + mins + " min = " + gtt.toFixed(2) + " → round to " + Math.round(gtt) + " gtt/min.</p>";
  });
  // Weight-based dose
  bind("f-dose", function (f) {
    var w = +f.wt.value || 0, unit = f.unit.value, dose = +f.dose.value || 0, conc = +f.conc.value || 0;
    var kg = unit === "lb" ? w / 2.2 : w, mg = kg * dose, ml = conc ? mg / conc : 0;
    document.getElementById("o-dose").innerHTML = "<p>Weight: <b>" + kg.toFixed(1) + " kg</b></p><div class='kpi'>" + mg.toFixed(2) + " mg</div>" + (ml ? "<p>Volume to give: <b>" + ml.toFixed(2) + " mL</b></p>" : "") + "<p class='fine'>Practice only. Always verify with your facility's protocols, a pharmacist and an independent double-check.</p>";
  });

  // Specialty quiz
  var Qs = [
    ["When things get chaotic, you…", [["Thrive — bring on the adrenaline", "er"], ["Want one or two patients to focus on deeply", "icu"], ["Prefer calm, predictable routines", "clinic"], ["Want to talk people through it", "psych"]]],
    ["Your favorite patients are…", [["Babies and families", "ld"], ["Kids", "peds"], ["Critically ill adults", "icu"], ["Anyone — variety keeps me going", "er"]]],
    ["Which do you enjoy most?", [["Technology, monitors and drips", "icu"], ["Procedures and teamwork in a sterile field", "or"], ["Long-term relationships and education", "clinic"], ["Building trust and de-escalating", "psych"]]],
    ["Ideal schedule?", [["Nights and weekends are fine", "er"], ["Monday to Friday, no holidays", "clinic"], ["Scheduled cases, occasional call", "or"], ["12s so I get more days off", "icu"]]],
    ["How do you handle emotional moments?", [["I stay steady and supportive", "ld"], ["I compartmentalize well", "or"], ["I'm a natural listener", "psych"], ["I use humor", "peds"]]],
    ["Pick a superpower:", [["Instant triage", "er"], ["Reading a monitor like a book", "icu"], ["Making scared kids laugh", "peds"], ["Calming a room in seconds", "psych"]]],
    ["Your long-term goal:", [["CRNA or acute-care NP", "icu"], ["Nurse practitioner in primary care", "clinic"], ["Surgical first assist", "or"], ["Midwife or lactation consultant", "ld"]]],
    ["Your friends describe you as…", [["Fast and decisive", "er"], ["Detail-obsessed", "or"], ["Nurturing", "ld"], ["Playful", "peds"]]]
  ];
  var R = {
    er: ["Emergency Nursing", "Fast-paced triage and variety. Consider the CEN certification.", "emergency"],
    icu: ["Critical Care (ICU)", "Deep assessment, titrating drips, and a path to CRNA. Consider CCRN.", "icu"],
    or: ["Perioperative (OR)", "Precision, teamwork and procedures. Consider CNOR.", "or"],
    ld: ["Labor & Delivery / Women’s Health", "High-joy, high-stakes family care. Consider RNC-OB.", "ld"],
    peds: ["Pediatrics", "Care for kids and families. Consider CPN.", "peds"],
    psych: ["Psychiatric / Behavioral Health", "Therapeutic communication at its best. Consider PMH-BC or PMHNP.", "psych"],
    clinic: ["Ambulatory / Primary Care", "Predictable hours, education and continuity. A great fit for an FNP path.", "clinic"]
  };
  var qz = document.getElementById("spec-quiz");
  if (qz) {
    var n = 0, tally = {};
    var draw = function () {
      if (n >= Qs.length) {
        var best = Object.keys(tally).sort(function (a, b) { return tally[b] - tally[a]; })[0], r = R[best];
        qz.innerHTML = '<p class="muted">Your best-fit specialty</p><h3 style="font-size:1.8rem;color:var(--teal)">' + r[0] + "</h3><p>" + r[1] + '</p><div style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn btn-primary" href="match.html#travel">See ' + r[0].split(" ")[0] + ' jobs →</a><a class="btn btn-ghost" href="guide-highest-paying-specialties.html">Specialty pay guide</a><button class="btn btn-teal" id="sq-re">Retake</button></div>';
        if (window.TwoNurses) TwoNurses.track("specialty_quiz", { result: best }); return;
      }
      var q = Qs[n];
      qz.innerHTML = '<div class="progress"><i style="width:' + (n / Qs.length * 100) + '%"></i></div><p class="step-meta">Question ' + (n + 1) + " of " + Qs.length + "</p><h3>" + q[0] + "</h3>" + q[1].map(function (o) { return '<button class="quiz-opt" data-v="' + o[1] + '">' + o[0] + "</button>"; }).join("");
    };
    qz.addEventListener("click", function (e) {
      var b = e.target.closest(".quiz-opt"); if (b) { var v = b.getAttribute("data-v"); tally[v] = (tally[v] || 0) + 1; n++; draw(); }
      if (e.target.id === "sq-re") { n = 0; tally = {}; draw(); }
    });
    draw();
  }
})();
