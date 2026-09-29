/* Salary Explorer — estimated RN annual mean wages by state.
   Figures are rounded estimates compiled from public BLS OEWS releases; verify at bls.gov/oes.
   col = approximate regional price parity index (100 = U.S. average). */
(function () {
  var D = [
    ["Alabama","AL",69900,87],["Alaska","AK",106300,104],["Arizona","AZ",91500,100],["Arkansas","AR",71700,86],["California","CA",137700,112],
    ["Colorado","CO",91300,103],["Connecticut","CT",100400,104],["Delaware","DE",88400,99],["District of Columbia","DC",107200,110],["Florida","FL",82900,101],
    ["Georgia","GA",87400,94],["Hawaii","HI",129600,111],["Idaho","ID",83200,94],["Illinois","IL",88900,99],["Indiana","IN",78500,91],
    ["Iowa","IA",72200,89],["Kansas","KS",74500,90],["Kentucky","KY",77200,88],["Louisiana","LA",79900,90],["Maine","ME",86200,96],
    ["Maryland","MD",94500,104],["Massachusetts","MA",118500,108],["Michigan","MI",85300,93],["Minnesota","MN",97000,97],["Mississippi","MS",69900,85],
    ["Missouri","MO",76400,90],["Montana","MT",83500,95],["Nebraska","NE",78900,91],["Nevada","NV",102200,97],["New Hampshire","NH",90500,104],
    ["New Jersey","NJ",105300,108],["New Mexico","NM",88700,92],["New York","NY",106400,108],["North Carolina","NC",82100,93],["North Dakota","ND",76600,90],
    ["Ohio","OH",81300,91],["Oklahoma","OK",76300,88],["Oregon","OR",113400,101],["Pennsylvania","PA",84300,96],["Rhode Island","RI",96300,100],
    ["South Carolina","SC",78300,92],["South Dakota","SD",69900,89],["Tennessee","TN",75900,91],["Texas","TX",89600,97],["Utah","UT",84400,97],
    ["Vermont","VT",86300,99],["Virginia","VA",86600,101],["Washington","WA",108300,108],["West Virginia","WV",76400,86],["Wisconsin","WI",86900,93],["Wyoming","WY",80400,93]
  ];
  var CRED = { RN: 1, LPN: 0.6, CNA: 0.43, NP: 1.39, CRNA: 2.3 };
  window.SALARY_DATA = D; window.SALARY_CRED = CRED;
  var body = document.getElementById("sal-body"); if (!body) return;
  var sortKey = 2, asc = false, q = "", cred = "RN", adj = false;
  var money = function (n) { return "$" + Math.round(n).toLocaleString(); };
  function render() {
    var m = CRED[cred];
    var rows = D.map(function (r) { var a = r[2] * m; return { n: r[0], c: r[1], a: a, h: a / 2080, col: r[3], adj: a / (r[3] / 100) }; })
      .filter(function (r) { return !q || r.n.toLowerCase().indexOf(q) > -1 || r.c.toLowerCase() === q; });
    var key = ["n", "c", adj ? "adj" : "a", "h", "col"][sortKey];
    rows.sort(function (x, y) { var v = x[key] > y[key] ? 1 : x[key] < y[key] ? -1 : 0; return asc ? v : -v; });
    var max = Math.max.apply(null, rows.map(function (r) { return adj ? r.adj : r.a; }).concat([1]));
    body.innerHTML = rows.map(function (r, i) {
      var v = adj ? r.adj : r.a;
      return "<tr><td>" + (i + 1) + ". " + r.n + "</td><td>" + r.c + '</td><td class="num"><b>' + money(v) + '</b></td><td class="num">' + money(r.h) + '/hr</td><td class="num">' + r.col + '</td><td style="width:28%"><div class="bar" style="width:' + (v / max * 100).toFixed(1) + '%"></div></td></tr>';
    }).join("");
    var nat = D.reduce(function (s, r) { return s + r[2]; }, 0) / D.length * m;
    document.getElementById("sal-nat").textContent = money(nat);
    var top = D.slice().sort(function (a, b) { return b[2] - a[2]; });
    document.getElementById("sal-top").textContent = top[0][0] + " · " + money(top[0][2] * m);
    var topAdj = D.slice().sort(function (a, b) { return b[2] / b[3] - a[2] / a[3]; });
    document.getElementById("sal-adj").textContent = topAdj[0][0] + " · " + money(topAdj[0][2] * m / (topAdj[0][3] / 100));
  }
  document.getElementById("sal-q").addEventListener("input", function (e) { q = e.target.value.trim().toLowerCase(); render(); });
  document.getElementById("sal-cred").addEventListener("change", function (e) { cred = e.target.value; render(); });
  document.getElementById("sal-adjust").addEventListener("change", function (e) { adj = e.target.checked; render(); });
  Array.prototype.forEach.call(document.querySelectorAll("#sal-table th[data-k]"), function (th) {
    th.addEventListener("click", function () { var k = +th.getAttribute("data-k"); if (k === sortKey) asc = !asc; else { sortKey = k; asc = k < 2; } render(); });
  });
  // Offer comparison
  var f = document.getElementById("offer-form");
  if (f) f.addEventListener("input", function () {
    var st = f.state.value, rate = parseFloat(f.rate.value) || 0, hrs = parseFloat(f.hours.value) || 36;
    var r = D.filter(function (x) { return x[1] === st; })[0]; if (!r || !rate) return;
    var mkt = r[2] / 2080, diff = (rate - mkt) / mkt * 100, annual = rate * hrs * 52;
    document.getElementById("offer-out").innerHTML = "<p>Your offer: <b>" + money(annual) + "/yr</b> (" + money(rate) + "/hr × " + hrs + " hrs × 52 wks)</p><p>Estimated " + r[0] + " RN average: <b>" + money(mkt) + "/hr</b></p><p class='kpi' style='color:" + (diff >= 0 ? "var(--ok)" : "var(--coral)") + "'>" + (diff >= 0 ? "+" : "") + diff.toFixed(1) + "% vs. market</p>" + (diff < -5 ? "<p>That is below the estimated state average. <a href='match.html#travel'>See higher-paying options →</a></p>" : "<p>Solid offer. Compare contracts anyway — <a href='match.html#travel'>get matched</a>.</p>");
  });
  if (f) { f.state.innerHTML = D.map(function (r) { return '<option value="' + r[1] + '">' + r[0] + "</option>"; }).join(""); f.state.value = "TX"; }
  render();
})();
