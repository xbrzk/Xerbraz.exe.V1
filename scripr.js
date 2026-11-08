/* =========================================================
   XERBRAZ.EXE — PEMBENTUK ALAMAT FOTO
   Menggunakan lokasi website GitHub Pages secara otomatis.
   Tidak mengubah nama atau isi foto.
   ========================================================= */

function xerbrazImageUrl(filename) {
  const name = String(filename || "")
    .replace(/\\/g, "/")
    .split("/")
    .pop();

  const siteRoot = new URL(".", document.baseURI);

  return new URL(
    encodeURIComponent(name),
    siteRoot
  ).href;
}
/* =====================================================================
   LOADING SCREEN — GAMBAR ASLI
   ===================================================================== */

(function () {
  const files = {
    wire: "Bygron_laoding scren .jpeg",
    photo: "Bygron_laoding scren1.jpeg"
  };

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("img[data-role]").forEach(function (img) {
      const file = files[img.getAttribute("data-role")];

      if (!file) {
        img.remove();
        return;
      }

      img.onerror = function () {
        this.remove();
      };

      img.src = xerbrazImageUrl(file);
    });
  });
})();


document.addEventListener("DOMContentLoaded", () => {

  /* ===== 00. LOADING SCREEN ===== */

  const loader = document.getElementById("loader");

  if (loader) {
    const MIN_TIME = 2200;
    const SEKALI_PER_SESI = false;

    const root = document.documentElement;
    const fill = document.getElementById("ldFill");
    const startAt = Date.now();

    let pct = 0;
    let finished = false;
    let skip = false;

    if (SEKALI_PER_SESI) {
      try {
        skip = sessionStorage.getItem("loaderSeen") === "1";
        sessionStorage.setItem("loaderSeen", "1");
      } catch (e) {}
    }

    const setPct = v => {
      pct = v;
      if (fill) fill.style.width = pct.toFixed(1) + "%";
    };

    const tick = setInterval(() => {
      if (pct < 90) {
        setPct(pct + (90 - pct) * 0.06 + 0.2);
      }
    }, 60);

    const finish = () => {
      if (finished) return;

      finished = true;
      clearInterval(tick);
      setPct(100);

      setTimeout(() => {
        loader.classList.add("done");
        root.classList.remove("is-loading");

        setTimeout(() => loader.remove(), 1100);
      }, skip ? 0 : 450);
    };

    const onReady = () => {
      setTimeout(
        finish,
        skip ? 0 : Math.max(0, MIN_TIME - (Date.now() - startAt))
      );
    };

    if (document.readyState === "complete") {
      onReady();
    } else {
      window.addEventListener("load", onReady);
    }

    setTimeout(finish, 7000);
  }


  /* ===== 0. FOTO WEBSITE =====
     Semua foto berada di ROOT repository.
     Foto dipanggil dari file asli di GitHub.
     Tidak memakai fetch("images/").
  */

  const FOTO = {
    hero: [
      "hero.png",
      "Rumah Modern A1 di Senja Hari-1.png",
      "Rumah Modern Tipe 36 di Senja Basah-2.png"
    ],

    unit: [
      "Rumah Modern Tipe 36 Saat Senja-5.png",
      "Rumah Modern Hangat Saat Senja-6.png",
      "Vila Modern Nomor 36 di Senja hari-3.png"
    ],

    kpr: "Rumah Modern Tipe 36 Saat Senja-4.png",

    kontak: "Rumah Modern A1 di Senja Hari-1.png",

    strip: "Rumah Modern Hangat Saat Senja-6.png"
  };


  /* ===== 0A. LOGO DAN FOTO HTML ===== */

  document.querySelectorAll('img[src^="images/"]').forEach(img => {
    const file = img.getAttribute("src").split("/").pop();

    img.onerror = function () {
      this.style.display = "none";
    };

    img.style.display = "";
    img.src = xerbrazImageUrl(file);
  });


  /* ===== 0B. MEMASANG FOTO WEBSITE ===== */

  const photosReady = Promise.resolve().then(() => {

    window.__imgList = Object.values(FOTO)
      .flat()
      .filter(Boolean)
      .map(xerbrazImageUrl);

    const setImg = (selector, filename) => {
      const el = document.querySelector(selector);

      if (!el || !filename) return;

      el.onerror = function () {
        this.onerror = null;
        this.removeAttribute("src");
      };

      el.src = xerbrazImageUrl(filename);
    };

    FOTO.unit.forEach((filename, i) => {
      setImg(
        ".cards .card:nth-child(" + (i + 1) + ") .thumb img",
        filename
      );
    });

    setImg(".kpr-visual > img", FOTO.kpr);
    setImg(".cta-img", FOTO.kontak);
    setImg(".lk-strip > img", FOTO.strip);

    return {
      hero: FOTO.hero.map(xerbrazImageUrl),
      unit: FOTO.unit.map(xerbrazImageUrl),
      kpr: xerbrazImageUrl(FOTO.kpr),
      kontak: xerbrazImageUrl(FOTO.kontak)
    };
  });


  /* ===== 1. NAVBAR & MENU MOBILE ===== */

  const navbar = document.getElementById("navbar");
  const nav = document.getElementById("nav");

  document.getElementById("menuToggle").addEventListener("click", () => {
    nav.classList.toggle("open");
  });

  nav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      nav.classList.remove("open");
    });
  });

  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  });


  /* ===== 2. HERO SLIDER ===== */

  const slidesBox = document.querySelector(".slides");
  const curSlide = document.getElementById("curSlide");
  const totSlide = document.getElementById("totSlide");
  const progress = document.getElementById("progress");
  const arrows = document.querySelector(".arrows");

  const DURATION = 5000;

  let slides = [];
  let index = 0;
  let timer;

  function startProgress() {
    if (!progress) return;

    progress.style.transition = "none";
    progress.style.width = "0";

    void progress.offsetWidth;

    progress.style.transition = "width " + DURATION + "ms linear";
    progress.style.width = "100%";
  }

  function show(i) {
    if (!slides.length) return;

    index = (i + slides.length) % slides.length;

    slides.forEach((s, n) => {
      s.classList.toggle("active", n === index);
    });

    if (curSlide) {
      curSlide.textContent = String(index + 1).padStart(2, "0");
    }

    document.querySelectorAll("#heroDots .dot").forEach((d, n) => {
      d.classList.toggle("on", n === index);
    });

    startProgress();
  }

  function auto() {
    clearInterval(timer);

    if (slides.length > 1) {
      timer = setInterval(() => show(index + 1), DURATION);
    }
  }

  function loadImg(src) {
    return new Promise(res => {
      const im = new Image();

      im.onload = () => res(src);
      im.onerror = () => res(null);

      im.src = src;
    });
  }

  document.getElementById("nextBtn").addEventListener("click", () => {
    show(index + 1);
    auto();
  });

  document.getElementById("prevBtn").addEventListener("click", () => {
    show(index - 1);
    auto();
  });

  photosReady
    .then(ph => Promise.all(ph.hero.map(loadImg)))
    .then(list => {

      const ok = list.filter(Boolean);

      if (!ok.length) {
        ok.push(xerbrazImageUrl("hero.png"));
      }

      slidesBox.innerHTML = ok.map((s, i) =>
        '<img class="slide' +
        (i === 0 ? " active" : "") +
        '" src="' + s +
        '" alt="Foto hunian ' + (i + 1) + '">'
      ).join("");

      slides = Array.from(slidesBox.querySelectorAll(".slide"));

      if (totSlide) {
        totSlide.textContent = String(slides.length).padStart(2, "0");
      }

      if (slides.length < 2 && arrows) {
        arrows.style.display = "none";
      }

      const heroDots = document.getElementById("heroDots");

      heroDots.innerHTML = Array.from(slides).map((_, n) =>
        '<button type="button" class="dot' +
        (n === 0 ? " on" : "") +
        '" aria-label="Slide ' + (n + 1) + '"></button>'
      ).join("");

      heroDots.querySelectorAll(".dot").forEach((d, n) => {
        d.addEventListener("click", () => {
          show(n);
          auto();
        });
      });

      show(0);
      auto();
    });


  /* ===== 3. SIMULASI KPR ===== */

  const BUNGA = 5;

  const harga = document.getElementById("harga");
  const dpPersen = document.getElementById("dpPersen");
  const dpNominal = document.getElementById("dpNominal");
  const hasil = document.getElementById("hasil");

  const tenorBtns = document.querySelectorAll("#tenor button");

  let tenor = 10;

  const angka = v =>
    parseInt(String(v).replace(/\D/g, ""), 10) || 0;

  const rupiah = n =>
    Math.round(n).toLocaleString("id-ID");

  function hitung() {
    const h = angka(harga.value);

    const dp = h * (parseInt(dpPersen.value, 10) / 100);

    const pokok = h - dp;

    const r = BUNGA / 100 / 12;

    const n = tenor * 12;

    const cicilan = pokok > 0
      ? (pokok * r) / (1 - Math.pow(1 + r, -n))
      : 0;

    dpNominal.value = rupiah(dp);
    hasil.textContent = rupiah(cicilan);
  }

  harga.addEventListener("input", () => {
    const n = angka(harga.value);

    harga.value = n ? rupiah(n) : "";

    hitung();
  });

  dpPersen.addEventListener("change", hitung);

  tenorBtns.forEach(b => {
    b.addEventListener("click", () => {
      tenorBtns.forEach(x => x.classList.remove("on"));

      b.classList.add("on");

      tenor = parseInt(b.dataset.t, 10);

      hitung();
    });
  });

  document.getElementById("hitung").addEventListener("click", hitung);

  document.querySelectorAll(".mini").forEach(a => {
    a.addEventListener("click", () => {
      harga.value = rupiah(parseInt(a.dataset.price, 10));
      hitung();
    });
  });

  hitung();


  /* ===== 4. ANIMASI MUNCUL SAAT SCROLL ===== */

  const items = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("show");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });

    items.forEach(el => io.observe(el));

  } else {
    items.forEach(el => el.classList.add("show"));
  }


  /* ===== 5. MENU AKTIF + PILL GESER HALUS ===== */

  const links = document.querySelectorAll(".nav a");
  const tabLinks = document.querySelectorAll(".tabbar a");
  const pill = document.getElementById("pill");

  const sections = [
    "beranda",
    "unit",
    "kpr",
    "lokasi",
    "kontak"
  ].map(id => document.getElementById(id));

  let lock = false;
  let lockTimer;

  function movePill() {
    const a = nav.querySelector("a.active");

    if (!a || !pill) return;

    pill.style.width = a.offsetWidth + "px";
    pill.style.transform = "translateX(" + a.offsetLeft + "px)";
  }

  function setActive(id) {

    links.forEach(a => {
      a.classList.toggle(
        "active",
        a.getAttribute("href") === "#" + id
      );
    });

    const tabId = id === "kpr" ? "unit" : id;

    tabLinks.forEach(a => {
      a.classList.toggle(
        "active",
        a.getAttribute("href") === "#" + tabId
      );
    });

    movePill();
  }

  [...links, ...tabLinks].forEach(a => {
    a.addEventListener("click", () => {

      setActive(a.getAttribute("href").slice(1));

      lock = true;

      clearTimeout(lockTimer);

      lockTimer = setTimeout(() => {
        lock = false;
      }, 1000);
    });
  });

  window.addEventListener("scroll", () => {

    if (lock) return;

    let current = "beranda";

    sections.forEach(s => {
      if (s && window.scrollY + 160 >= s.offsetTop) {
        current = s.id;
      }
    });

    if (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 4
    ) {
      current = "kontak";
    }

    setActive(current);
  });

  window.addEventListener("resize", movePill);
  window.addEventListener("load", movePill);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(movePill);
  }

  movePill();


  /* ===== 6. TOMBOL KE ATAS ===== */

  document.getElementById("toTop").addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });


  /* ===== 7. FOOTER YEAR ===== */

  document.getElementById("year").textContent =
    new Date().getFullYear();


  /* ===== 8. VIDEO BUTTON ===== */

  const VIDEO_URL = "";

  const modal = document.getElementById("modal");
  const videoWrap = document.getElementById("videoWrap");

  function closeVideo() {
    modal.classList.remove("open");
    videoWrap.innerHTML = "";
  }

  document.getElementById("videoBtn").addEventListener("click", () => {

    videoWrap.innerHTML = VIDEO_URL
      ? '<iframe src="' + VIDEO_URL +
        '" allow="autoplay; fullscreen" allowfullscreen></iframe>'
      : "<p>Silakan tambahkan URL video promosi pada variabel VIDEO_URL di file scripr.js.</p>";

    modal.classList.add("open");
  });

  document.getElementById("closeModal").addEventListener("click", closeVideo);

  modal.addEventListener("click", e => {
    if (e.target === modal) closeVideo();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeVideo();
  });


  /* ===== 9. BAHASA (ID / EN) ===== */

  const langEl = document.getElementById("lang");
  const langLabel = document.getElementById("langLabel");
  const langItems = document.querySelectorAll("#langMenu li");
  const translatable = document.querySelectorAll("[data-en]");

  translatable.forEach(el => {
    el.dataset.id = el.innerHTML;
  });

  function setLang(l) {

    translatable.forEach(el => {
      el.innerHTML = l === "en" ? el.dataset.en : el.dataset.id;
    });

    document.documentElement.lang = l;

    langLabel.textContent = l.toUpperCase();

    langItems.forEach(li => {
      li.classList.toggle("on", li.dataset.lang === l);
    });

    movePill();

    try {
      localStorage.setItem("lang", l);
    } catch (e) {}
  }

  document.getElementById("langBtn").addEventListener("click", e => {
    e.stopPropagation();
    langEl.classList.toggle("open");
  });

  langItems.forEach(li => {
    li.addEventListener("click", () => {
      setLang(li.dataset.lang);
      langEl.classList.remove("open");
    });
  });

  document.addEventListener("click", () => {
    langEl.classList.remove("open");
  });

  let saved = "id";

  try {
    saved = localStorage.getItem("lang") || "id";
  } catch (e) {}

  setLang(saved);


  /* ===== 9A. MOBILE: PILIHAN BAHASA MASUK KE DALAM MENU ===== */

  const mqMobile = window.matchMedia("(max-width: 640px)");

  const navRight = document.querySelector(".nav-right");

  function placeLang() {
    if (mqMobile.matches) {
      nav.appendChild(langEl);
    } else {
      navRight.insertBefore(langEl, navRight.firstChild);
    }
  }

  if (mqMobile.addEventListener) {
    mqMobile.addEventListener("change", placeLang);
  } else {
    mqMobile.addListener(placeLang);
  }

  placeLang();


  /* ===== 9B. MOBILE: TITIK PENUNJUK CAROUSEL UNIT ===== */

  const cardsBox = document.querySelector(".cards");
  const cardDots = document.getElementById("cardDots");

  if (cardsBox && cardDots) {

    const cardList = Array.from(
      cardsBox.querySelectorAll(".card")
    );

    cardDots.innerHTML = cardList.map((_, n) =>
      '<button type="button" class="dot' +
      (n === 0 ? " on" : "") +
      '" aria-label="Unit ' + (n + 1) + '"></button>'
    ).join("");

    const dotList = Array.from(cardDots.querySelectorAll(".dot"));

    const cardPos = n =>
      cardList[n].offsetLeft - cardList[0].offsetLeft;

    function syncCardDots() {

      let best = 0;

      cardList.forEach((_, n) => {
        if (
          Math.abs(cardPos(n) - cardsBox.scrollLeft) <
          Math.abs(cardPos(best) - cardsBox.scrollLeft)
        ) {
          best = n;
        }
      });

      dotList.forEach((d, n) => {
        d.classList.toggle("on", n === best);
      });
    }

    cardsBox.addEventListener(
      "scroll",
      () => requestAnimationFrame(syncCardDots),
      { passive: true }
    );

    dotList.forEach((d, n) => {
      d.addEventListener("click", () => {
        cardsBox.scrollTo({
          left: cardPos(n),
          behavior: "smooth"
        });
      });
    });
  }


  /* ===== 10. PARTIKEL EMAS MELAYANG ===== */

  const SHOW_PARTIKEL = true;

  if (
    SHOW_PARTIKEL &&
    !(window.matchMedia &&
      matchMedia("(prefers-reduced-motion: reduce)").matches)
  ) {

    const cv = document.createElement("canvas");

    cv.id = "fx";

    cv.style.cssText =
      "position:fixed;top:0;left:0;width:100%;height:100%;z-index:2;pointer-events:none";

    document.body.appendChild(cv);

    const cx = cv.getContext("2d");

    let W, H, parts = [];

    function size() {

      const d = Math.min(window.devicePixelRatio || 1, 2);

      W = window.innerWidth;
      H = window.innerHeight;

      cv.width = W * d;
      cv.height = H * d;

      cx.setTransform(d, 0, 0, d, 0, 0);
    }

    function mk(init) {

      return {
        x: Math.random() * W,
        y: init ? Math.random() * H : H + 10,
        r: Math.random() * 1.6 + 0.5,
        v: Math.random() * 0.35 + 0.12,
        p: Math.random() * 6.28,
        s: Math.random() * 0.02 + 0.008,
        a: Math.random() * 0.5 + 0.25
      };
    }

    size();

    const N = W < 700 ? 22 : 50;

    for (let i = 0; i < N; i++) {
      parts.push(mk(true));
    }

    window.addEventListener("resize", size);

    (function loop() {

      if (!document.hidden) {

        cx.clearRect(0, 0, W, H);

        parts.forEach((q, i) => {

          q.y -= q.v;
          q.p += q.s;
          q.x += Math.sin(q.p) * 0.3;

          if (q.y < -10) {
            parts[i] = mk(false);
            return;
          }

          const al = q.a * (0.5 + 0.5 * Math.sin(q.p * 2));

          cx.fillStyle = "rgba(240,185,90," + al * 0.25 + ")";
          cx.beginPath();
          cx.arc(q.x, q.y, q.r * 3.2, 0, 6.28);
          cx.fill();

          cx.fillStyle = "rgba(255,225,160," + al + ")";
          cx.beginPath();
          cx.arc(q.x, q.y, q.r, 0, 6.28);
          cx.fill();
        });
      }

      requestAnimationFrame(loop);

    })();
  }


  /* ===== 11. LOKASI: PETA INTERAKTIF ===== */

  const mapEl = document.getElementById("lkMap");

  if (mapEl) {

    const HOME = {
      lat: -1.636663,
      lng: 103.616338,
      name: "Xerbraz Residence"
    };

    // Koordinat, jarak, dan waktu masih perkiraan/contoh.
    const POI = {

      school: {
        icon: "i-school",
        color: "#2f7df6",
        name: "SMP Negeri 5 Jambi",
        badge: "Sekolah Terdekat",
        lat: -1.6235,
        lng: 103.6105,
        min: 5,
        km: "1,8"
      },

      hospital: {
        icon: "i-med",
        color: "#e5483f",
        name: "RSUD Raden Mattaher",
        badge: "Rumah Sakit Terdekat",
        lat: -1.6125,
        lng: 103.6075,
        min: 7,
        km: "2,9"
      },

      city: {
        icon: "i-building",
        color: "#22a35a",
        name: "Pusat Kota Jambi",
        badge: "Pusat Kota",
        lat: -1.6101,
        lng: 103.6131,
        min: 10,
        km: "4,5"
      },

      terminal: {
        icon: "i-bus",
        color: "#e08a1e",
        name: "Terminal Jambi",
        badge: "Terminal Terdekat",
        lat: -1.6560,
        lng: 103.5880,
        min: 15,
        km: "6,2"
      }
    };


    const $ = id => document.getElementById(id);

    const chips = document.querySelectorAll("#lkChips button");
    const cats = document.querySelectorAll("#lkCats button");

    Object.keys(POI).forEach(k => {
      POI[k].key = k;
    });

    cats.forEach(b => {
      const small = b.querySelector("small");

      if (small && POI[b.dataset.poi]) {
        small.textContent = POI[b.dataset.poi].min + " Menit";
      }
    });


    const gmRoute = p =>
      "https://www.google.com/maps/dir/?api=1&origin=" +
      HOME.lat + "," + HOME.lng +
      "&destination=" + p.lat + "," + p.lng +
      "&travelmode=driving";


    const hasLeaflet = typeof L !== "undefined";

    const map = hasLeaflet
      ? L.map(mapEl, {
          zoomControl: false,
          attributionControl: false,
          scrollWheelZoom: false,
          dragging: !L.Browser.mobile,
          tap: false
        }).setView([HOME.lat, HOME.lng], 16)
      : null;


    const markers = {};

    const routeLayer = map
      ? L.layerGroup().addTo(map)
      : null;

    const routeCache = {};

    let token = 0;
    let sel = "all";


    function pinHtml(color, icon, title, sub, cls) {

      return '<div class="mk ' + (cls || "") + '" style="--c:' + color + '">' +
        '<span class="mk-pin"><svg class="ic"><use href="#' + icon + '"/></svg></span>' +
        '<span class="mk-lbl"><b>' + title + '</b>' +
        (sub ? '<small>' + sub + '</small>' : '') +
        '</span></div>';
    }


    if (map) {

      // Citra satelit Esri
      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          maxZoom: 19,
          attribution: "Tiles &copy; Esri"
        }
      ).addTo(map);

      L.control.attribution({
        position: "bottomleft",
        prefix: false
      }).addTo(map);

      L.control.zoom({
        position: "bottomright"
      }).addTo(map);


      Object.keys(POI).forEach(k => {

        const p = POI[k];

        markers[k] = L.marker([p.lat, p.lng], {

          keyboard: false,

          icon: L.divIcon({
            className: "mk-wrap",
            iconSize: [0, 0],
            html: pinHtml(
              p.color,
              p.icon,
              p.name,
              p.min + " mnt • " + p.km + " km"
            )
          })

        }).addTo(map);
      });


      L.marker([HOME.lat, HOME.lng], {

        keyboard: false,
        zIndexOffset: 1000,

        icon: L.divIcon({
          className: "mk-wrap",
          iconSize: [0, 0],
          html: pinHtml(
            "#c8923a",
            "i-home",
            HOME.name,
            "",
            "mk-home"
          )
        })

      }).addTo(map);


      map.on("click focus", () => map.scrollWheelZoom.enable());
      map.on("mouseout", () => map.scrollWheelZoom.disable());

    } else {

      mapEl.innerHTML =
        '<iframe title="Peta Lokasi" loading="lazy" style="width:100%;height:100%;border:0" src="https://maps.google.com/maps?q=' +
        HOME.lat + ',' + HOME.lng +
        '&z=17&output=embed"></iframe>';

      $("lkChips").style.display = "none";
      $("lkNorth").style.display = "none";
    }


    function drawRoute(p) {

      if (!map) return;

      const t = ++token;

      const paint = (pts, dashed) => {

        if (t !== token) return;

        routeLayer.clearLayers();

        if (!dashed) {
          L.polyline(pts, {
            color: "#fff",
            weight: 9,
            opacity: 0.85,
            lineCap: "round",
            lineJoin: "round",
            interactive: false
          }).addTo(routeLayer);
        }

        L.polyline(pts, {
          color: "#2f7df6",
          weight: 5,
          opacity: 1,
          lineCap: "round",
          lineJoin: "round",
          dashArray: dashed ? "1 10" : null,
          interactive: false
        }).addTo(routeLayer);


        const mid = pts[Math.floor(pts.length / 2)];

        L.marker(mid, {

          interactive: false,
          keyboard: false,

          icon: L.divIcon({
            className: "mk-wrap",
            iconSize: [0, 0],

            html:
              '<div class="rt"><svg class="ic"><use href="#i-car"/></svg>' +
              '<span><b>' + p.min + ' Menit</b>' +
              '<small>' + p.km + ' km</small></span></div>'
          })

        }).addTo(routeLayer);
      };


      if (routeCache[p.key]) {
        paint(routeCache[p.key], false);
        return;
      }

      paint([[HOME.lat, HOME.lng], [p.lat, p.lng]], true);

      // Rute jalan dari OSRM.
      fetch(
        "https://router.project-osrm.org/route/v1/driving/" +
        HOME.lng + "," + HOME.lat + ";" +
        p.lng + "," + p.lat +
        "?overview=full&geometries=geojson"
      )
        .then(r => r.json())
        .then(d => {

          const c =
            d.routes &&
            d.routes[0] &&
            d.routes[0].geometry.coordinates;

          if (!c) return;

          const pts = c.map(x => [x[1], x[0]]);

          routeCache[p.key] = pts;

          paint(pts, false);
        })
        .catch(() => {});
    }


    function updateCard(p) {

      $("lkBadge").textContent = p.badge;
      $("lkName").textContent = p.name;
      $("lkDist").textContent = "± " + p.km + " km dari Perumahan";
      $("lkTime").textContent = p.min + " Menit Perjalanan";

      $("lkRoute").href = gmRoute(p);

      $("lkBarText").textContent =
        "Rute dari " + HOME.name + " ke " + p.name;

      $("lkBarGo").href = gmRoute(p);

      $("lkPhotoIc").setAttribute("href", "#" + p.icon);

      const img = $("lkImg");

      img.style.display = "none";

      img.onload = () => {
        img.style.display = "block";
      };

      img.onerror = () => {
        img.style.display = "none";
      };

      // Foto lokasi belum terdapat dalam daftar file repository.
      // Pertahankan ikon bawaan agar tidak menghasilkan 404.
      img.removeAttribute("src");
    }


    function fit() {

      if (!map) return;

      const pts = [[HOME.lat, HOME.lng]];

      if (sel === "all") {
        Object.keys(POI).forEach(k => {
          pts.push([POI[k].lat, POI[k].lng]);
        });
      } else {
        pts.push([POI[sel].lat, POI[sel].lng]);
      }

      map.fitBounds(pts, {
        paddingTopLeft: [60, 60],
        paddingBottomRight: [60, 90],
        maxZoom: 17
      });
    }


    function showPoi(key) {

      sel = key;

      const p = key === "all" ? POI.school : POI[key];

      chips.forEach(b => {
        b.classList.toggle("on", b.dataset.poi === key);
      });

      cats.forEach(b => {
        b.classList.toggle("on", b.dataset.poi === p.key);
      });

      updateCard(p);

      if (!map) return;

      Object.keys(markers).forEach(k => {

        const vis = key === "all" || k === key;

        if (vis && !map.hasLayer(markers[k])) {
          markers[k].addTo(map);
        }

        if (!vis && map.hasLayer(markers[k])) {
          map.removeLayer(markers[k]);
        }
      });

      drawRoute(p);
      fit();
    }


    chips.forEach(b => {
      b.addEventListener("click", () => showPoi(b.dataset.poi));
    });

    cats.forEach(b => {
      b.addEventListener("click", () => showPoi(b.dataset.poi));
    });

    $("lkNorth").addEventListener("click", fit);

    showPoi("all");


    if (map) {

      setTimeout(() => {
        map.invalidateSize();
        fit();
      }, 500);

      window.addEventListener("load", () => {
        map.invalidateSize();
        fit();
      });

      if (window.ResizeObserver) {
        new ResizeObserver(() => map.invalidateSize()).observe(mapEl);
      }
    }


    /* salin koordinat */

    const copyBtn = $("copyCoord");

    if (copyBtn) {

      copyBtn.addEventListener("click", () => {

        const teks = HOME.lat + ", " + HOME.lng;

        const selesai = () => {
          copyBtn.textContent = "Tersalin ✓";

          setTimeout(() => {
            copyBtn.textContent = "Salin koordinat";
          }, 1500);
        };

        if (navigator.clipboard) {
          navigator.clipboard.writeText(teks)
            .then(selesai)
            .catch(selesai);
        } else {
          selesai();
        }
      });
    }
  }

});
