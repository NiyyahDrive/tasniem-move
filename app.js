/* Tasniem Move — 7-minuten bodyweight PWA. Vanilla JS, local-first. */
(() => {
  'use strict';

  // ===================== Gegevens =====================
  const STORE_KEY = 'tasniem-move:v1';
  const CORRUPT_KEY = 'tasniem-move:corrupt-backup';

  const GOALS = { conditie: 'Conditie', kracht: 'Spierkracht', balans: 'Gebalanceerd' };
  const LEVELS = {
    beginner: { label: 'Beginner', prep: 10, work: 25, rest: 10 },
    gemiddeld: { label: 'Gemiddeld', prep: 7, work: 28, rest: 7 },
    gevorderd: { label: 'Gevorderd', prep: 5, work: 30, rest: 5 },
  };
  const EFFORTS = { licht: 'Licht', goed: 'Goed', zwaar: 'Zwaar' };
  const SAFETY = 'Geen medisch advies. Stop bij pijn, duizeligheid of benauwdheid.';

  // n = naam, c = instructie, low = low-impact alternatief, easy = lichtere variant voor beginners
  const WORKOUTS = [
    {
      id: 'full', name: 'Full Body 7', tag: 'Gebalanceerd', focus: 'Hele lichaam', kind: 'intensief',
      blurb: 'Afwisselend hartslag omhoog en kracht voor benen, romp en bovenlichaam.',
      exercises: [
        { n: 'Jumping jacks', c: 'Spring benen en armen tegelijk open en dicht. Land zacht.',
          low: { n: 'Step jacks', c: 'Stap om en om opzij en zwaai je armen boven je hoofd. Geen sprong.' } },
        { n: 'Wall sit', c: 'Rug tegen de muur, knieën in 90 graden. Blijf rustig ademen.',
          easy: { n: 'Wall sit hoog', c: 'Rug tegen de muur, zak tot halverwege. Blijf rustig ademen.' } },
        { n: 'Push-ups', c: 'Lichaam in één rechte lijn. Borst naar de vloer, duw krachtig uit.',
          easy: { n: 'Push-ups op knieën', c: 'Knieën op de vloer, heupen gestrekt. Borst omlaag en duw uit.' } },
        { n: 'Crunches', c: 'Onderrug op de vloer. Krul je schouders los, kin van de borst.' },
        { n: 'Squats', c: 'Voeten op heupbreedte. Heupen naar achteren, borst op, duw door je hielen.' },
        { n: 'Schoudertaps', c: 'Hoge plank. Tik om en om je schouder aan, heupen blijven stil.',
          easy: { n: 'Schoudertaps op knieën', c: 'Plank op knieën. Tik om en om je schouder aan, heupen stil.' } },
        { n: 'Uitvalspas achteruit', c: 'Stap om en om naar achteren en zak recht omlaag. Voorste knie boven de enkel.' },
        { n: 'Plank', c: 'Ellebogen onder de schouders. Buik en billen aan, niet doorzakken.',
          easy: { n: 'Plank op knieën', c: 'Ellebogen onder de schouders, knieën op de vloer. Buik aan.' } },
        { n: 'Hoge knieën', c: 'Loop op de plaats en trek je knieën tot heuphoogte. Armen doen mee.',
          low: { n: 'Marcheren', c: 'Marcheer stevig op de plaats en til je knieën hoog. Eén voet blijft op de vloer.' } },
        { n: 'Glute bridge', c: 'Lig op je rug, voeten plat. Duw je heupen omhoog en knijp je billen aan.' },
        { n: 'Superman', c: 'Lig op je buik. Til armen en benen licht op, houd twee tellen vast en zak rustig.' },
        { n: 'Zijplank', c: 'Steun op je onderarm, heupen hoog. Wissel halverwege van kant.',
          easy: { n: 'Zijplank op knie', c: 'Steun op onderarm en onderste knie, heupen hoog. Wissel halverwege.' } },
      ],
    },
    {
      id: 'cardio', name: 'Cardio 7', tag: 'Conditie', focus: 'Hart en longen', kind: 'intensief',
      blurb: 'Tempo en adem. Elke sprong heeft een rustig alternatief zonder impact.',
      exercises: [
        { n: 'Jumping jacks', c: 'Spring benen en armen tegelijk open en dicht. Land zacht.',
          low: { n: 'Step jacks', c: 'Stap om en om opzij en zwaai je armen boven je hoofd. Geen sprong.' } },
        { n: 'Hoge knieën', c: 'Loop op de plaats en trek je knieën tot heuphoogte.',
          low: { n: 'Marcheren', c: 'Marcheer stevig op de plaats en til je knieën hoog.' } },
        { n: 'Skaters', c: 'Spring zijwaarts van voet naar voet en land zacht, als een schaatser.',
          low: { n: 'Zijwaartse tik', c: 'Stap breed opzij en tik met je andere voet achter je aan. Geen sprong.' } },
        { n: 'Mountain climbers', c: 'Hoge plank. Trek om en om snel je knieën naar je borst.',
          low: { n: 'Rustige climbers', c: 'Hoge plank. Stap om en om een voet naar voren en weer terug.' } },
        { n: 'Squat jumps', c: 'Zak in een squat en spring explosief omhoog. Land zacht door je knieën.',
          low: { n: 'Squat met tenenstand', c: 'Zak in een squat, kom omhoog en eindig op je tenen. Geen sprong.' } },
        { n: 'Schaduwboksen', c: 'Lichte voeten, handen hoog. Stoot om en om recht vooruit, draai je romp mee.' },
        { n: 'Hakken-billen', c: 'Jog op de plaats en trap je hakken tegen je billen.',
          low: { n: 'Hakstap', c: 'Stap op de plaats en breng om en om je hak naar je bil. Geen sprong.' } },
        { n: 'Burpees', c: 'Handen op de vloer, spring naar plank, spring terug en spring op.',
          low: { n: 'Stap-burpee', c: 'Handen op de vloer, stap naar plank, stap terug en kom rechtop. Geen sprong.' } },
        { n: 'Zijwaartse shuffle', c: 'Laag blijven, drie snelle passen naar links en weer naar rechts.',
          low: { n: 'Zijwaartse passen', c: 'Licht gebogen knieën. Stap rustig drie passen opzij en terug.' } },
        { n: 'Plank jacks', c: 'Hoge plank. Spring je voeten open en dicht, heupen laag.',
          low: { n: 'Plank met voettik', c: 'Hoge plank. Tik om en om een voet opzij en zet hem terug.' } },
        { n: 'Snelle voeten', c: 'Kleine snelle pasjes op de plaats, blijf laag en licht.',
          low: { n: 'Snel marcheren', c: 'Marcheer zo vlot als comfortabel is, armen doen actief mee.' } },
        { n: 'Stersprong', c: 'Zak licht door je knieën en spring open als een ster.',
          low: { n: 'Squat met reik', c: 'Zak in een squat en reik bij het opkomen met beide armen omhoog.' } },
      ],
    },
    {
      id: 'strength', name: 'Strength 7', tag: 'Spierkracht', focus: 'Kracht en controle', kind: 'intensief',
      blurb: 'Langzaam en beheerst. Drie tellen zakken, één tel omhoog. Geen sprongen.',
      exercises: [
        { n: 'Tempo squats', c: 'Drie tellen zakken, kort vasthouden, krachtig omhoog. Hielen op de vloer.' },
        { n: 'Push-ups', c: 'Drie tellen zakken, borst naar de vloer, duw krachtig uit.',
          easy: { n: 'Push-ups op knieën', c: 'Knieën op de vloer. Drie tellen zakken, duw krachtig uit.' } },
        { n: 'Uitvalspas achteruit', c: 'Stap om en om naar achteren en zak recht omlaag. Romp rechtop.' },
        { n: 'Plank', c: 'Ellebogen onder de schouders. Buik en billen aan, niet doorzakken.',
          easy: { n: 'Plank op knieën', c: 'Ellebogen onder de schouders, knieën op de vloer. Buik aan.' } },
        { n: 'Glute bridge', c: 'Duw je heupen omhoog, twee tellen aanspannen, rustig zakken.' },
        { n: 'Pike push-ups', c: 'Heupen hoog in een omgekeerde V. Buig je armen, hoofd richting vloer.',
          easy: { n: 'Plank naar pike', c: 'Hoge plank. Duw je heupen omhoog naar een omgekeerde V en kom terug.' } },
        { n: 'Wall sit', c: 'Rug tegen de muur, knieën in 90 graden. Blijf rustig ademen.',
          easy: { n: 'Wall sit hoog', c: 'Rug tegen de muur, zak tot halverwege. Blijf rustig ademen.' } },
        { n: 'Superman', c: 'Lig op je buik. Til armen en benen licht op, houd twee tellen vast.' },
        { n: 'Zijplank links', c: 'Steun op je linker onderarm, heupen hoog, lichaam in één lijn.',
          easy: { n: 'Zijplank links op knie', c: 'Steun op linker onderarm en knie, heupen hoog.' } },
        { n: 'Zijplank rechts', c: 'Steun op je rechter onderarm, heupen hoog, lichaam in één lijn.',
          easy: { n: 'Zijplank rechts op knie', c: 'Steun op rechter onderarm en knie, heupen hoog.' } },
        { n: 'Kuitheffen', c: 'Kom langzaam op je tenen, houd kort vast, zak beheerst. Steun licht aan de muur.' },
        { n: 'Hollow hold', c: 'Lig op je rug, onderrug in de vloer. Til schouders en benen licht op.',
          easy: { n: 'Dead bug', c: 'Lig op je rug. Strek om en om arm en tegenovergesteld been, onderrug blijft plat.' } },
      ],
    },
    {
      id: 'herstel', name: 'Herstel 6', tag: 'Herstel', focus: 'Mobiliteit en ontspanning', kind: 'herstel',
      blurb: 'Rustig bewegen en rekken. Geen training op intensiteit: dit is herstel.',
      timing: { prep: 5, work: 40, rest: 5 },
      exercises: [
        { n: 'Kat-koe', c: 'Op handen en knieën. Maak je rug om en om bol en hol, op je adem.' },
        { n: 'Kindhouding', c: 'Billen naar je hielen, armen lang voor je. Adem naar je rug.' },
        { n: 'Draad door de naald', c: 'Op handen en knieën. Schuif een arm onder je door en draai mee. Wissel halverwege.' },
        { n: 'Heupbuiger-stretch', c: 'Halve kniezit, duw je heup rustig naar voren. Wissel halverwege.' },
        { n: 'Knie naar borst', c: 'Lig op je rug en trek om en om een knie rustig naar je borst.' },
        { n: 'Liggende rotatie', c: 'Op je rug, knieën samen naar één kant, schouders op de vloer. Wissel halverwege.' },
        { n: 'Borstopener', c: 'Sta rechtop, handen achter je rug in elkaar. Schouders laag, borst open.' },
        { n: 'Voorwaartse buiging', c: 'Knieën licht gebogen, laat je bovenlichaam zwaar hangen. Adem rustig uit.' },
      ],
    },
  ];
  const WORKOUT_IDS = WORKOUTS.map(w => w.id);
  const byId = id => WORKOUTS.find(w => w.id === id);

  const ROTATION = {
    conditie: ['cardio', 'full', 'cardio', 'strength'],
    kracht: ['strength', 'full', 'strength', 'cardio'],
    balans: ['full', 'cardio', 'strength'],
  };

  const ACHIEVEMENTS = [
    { id: 'first', name: 'Eerste stap', desc: 'Je eerste workout voltooid', test: st => st.total >= 1 },
    { id: 'trio', name: 'Allrounder', desc: 'Full Body, Cardio en Strength gedaan', test: st => ['full', 'cardio', 'strength'].every(id => st.ids.has(id)) },
    { id: 'week', name: 'Weekdoel gehaald', desc: 'Een week lang je weekdoel gehaald', test: (st, goal) => st.bestWeek >= goal },
    { id: 'streak3', name: 'Drie op rij', desc: '3 dagen achter elkaar actief', test: st => st.bestStreak >= 3 },
    { id: 'streak7', name: 'Volle week', desc: '7 dagen achter elkaar actief', test: st => st.bestStreak >= 7 },
    { id: 'ten', name: 'Tien keer', desc: '10 workouts voltooid', test: st => st.total >= 10 },
    { id: 'hour', name: 'Een uur bewogen', desc: '60 minuten in totaal', test: st => st.minutes >= 60 },
    { id: 'twentyfive', name: 'Vaste gewoonte', desc: '25 workouts voltooid', test: st => st.total >= 25 },
  ];

  // ===================== Hulpfuncties =====================
  const $ = id => document.getElementById(id);

  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (v == null || v === false) continue;
        if (k === 'class') el.className = v;
        else if (k === 'text') el.textContent = v;
        else el.setAttribute(k, v === true ? '' : v);
      }
    }
    for (const kid of kids.flat()) {
      if (kid == null || kid === false) continue;
      el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
    }
    return el;
  }

  const pad = n => String(n).padStart(2, '0');
  const dayKey = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  function parseKey(k) { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d, 12); }
  function addDays(d, n) { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12); x.setDate(x.getDate() + n); return x; }
  const weekStart = d => addDays(d, -((d.getDay() + 6) % 7)); // maandag
  const diffDays = (a, b) => Math.round((parseKey(b) - parseKey(a)) / 864e5);
  const fmtClock = sec => `${Math.floor(sec / 60)}:${pad(sec % 60)}`;
  const fmtDate = (k, opts) => parseKey(k).toLocaleDateString('nl-NL', opts);
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  function isValidKey(k) {
    if (typeof k !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(k)) return false;
    return dayKey(parseKey(k)) === k;
  }

  // ===================== State & opslag =====================
  const defaults = () => ({
    v: 1,
    prefs: { onboarded: false, goal: 'balans', level: 'beginner', lowImpact: false, sound: true, vibrate: true, weeklyGoal: 3 },
    sessions: [],
  });

  // Maakt van willekeurige (mogelijk corrupte) invoer altijd een geldige state.
  function sanitize(raw) {
    const d = defaults();
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return d;
    const p = raw.prefs && typeof raw.prefs === 'object' ? raw.prefs : {};
    d.prefs.onboarded = p.onboarded === true;
    if (Object.hasOwn(GOALS, p.goal)) d.prefs.goal = p.goal;
    if (Object.hasOwn(LEVELS, p.level)) d.prefs.level = p.level;
    d.prefs.lowImpact = p.lowImpact === true;
    d.prefs.sound = p.sound !== false;
    d.prefs.vibrate = p.vibrate !== false;
    if (Number.isInteger(p.weeklyGoal) && p.weeklyGoal >= 1 && p.weeklyGoal <= 7) d.prefs.weeklyGoal = p.weeklyGoal;
    if (Array.isArray(raw.sessions)) {
      const seen = new Set();
      for (const s of raw.sessions) {
        if (!s || typeof s !== 'object') continue;
        if (!WORKOUT_IDS.includes(s.workoutId) || !isValidKey(s.date)) continue;
        const dur = Number(s.durationSec);
        if (!Number.isFinite(dur) || dur < 0 || dur > 3600) continue;
        let id = typeof s.id === 'string' && s.id ? s.id.slice(0, 40) : newId();
        if (seen.has(id)) id = newId();
        seen.add(id);
        d.sessions.push({
          id,
          workoutId: s.workoutId,
          date: s.date,
          ts: Number.isFinite(Number(s.ts)) ? Number(s.ts) : parseKey(s.date).getTime(),
          durationSec: Math.round(dur),
          level: Object.hasOwn(LEVELS, s.level) ? s.level : 'beginner',
          lowImpact: s.lowImpact === true,
          effort: Object.hasOwn(EFFORTS, s.effort) ? s.effort : null,
          note: typeof s.note === 'string' ? s.note.slice(0, 280) : '',
        });
      }
      d.sessions.sort((a, b) => a.ts - b.ts);
    }
    return d;
  }

  function newId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }

  const store = {
    get(key) { try { return localStorage.getItem(key); } catch (e) { return null; } },
    set(key, val) { try { localStorage.setItem(key, val); return true; } catch (e) { return false; } },
    remove(key) { try { localStorage.removeItem(key); } catch (e) { /* opslag niet beschikbaar */ } },
  };

  let S = defaults();
  let saveWarned = false;

  function load() {
    const raw = store.get(STORE_KEY);
    if (raw == null) { S = defaults(); return; }
    try {
      S = sanitize(JSON.parse(raw));
    } catch (e) {
      store.set(CORRUPT_KEY, raw); // bewaar onleesbare data zodat niets stil verdwijnt
      S = defaults();
    }
  }

  function save() {
    if (!store.set(STORE_KEY, JSON.stringify(S)) && !saveWarned) {
      saveWarned = true;
      toast('Opslaan lukt niet in deze browser. Voortgang blijft alleen tijdens deze sessie bewaard.');
    }
  }

  // ===================== Statistieken =====================
  function computeStats() {
    const days = [...new Set(S.sessions.map(s => s.date))].sort();
    let bestStreak = 0, run = 0, prev = null;
    for (const k of days) {
      run = prev && diffDays(prev, k) === 1 ? run + 1 : 1;
      if (run > bestStreak) bestStreak = run;
      prev = k;
    }
    const now = new Date();
    const today = dayKey(now), yesterday = dayKey(addDays(now, -1));
    const last = days[days.length - 1];
    const streak = last === today || last === yesterday ? run : 0;

    const weeks = new Map();
    for (const k of days) {
      const wk = dayKey(weekStart(parseKey(k)));
      weeks.set(wk, (weeks.get(wk) || 0) + 1);
    }
    const thisWeekKey = dayKey(weekStart(now));
    return {
      total: S.sessions.length,
      minutes: Math.round(S.sessions.reduce((a, s) => a + s.durationSec, 0) / 60),
      streak, bestStreak,
      thisWeek: weeks.get(thisWeekKey) || 0,
      bestWeek: Math.max(0, ...weeks.values()),
      weeks, days: new Set(days), thisWeekKey,
      ids: new Set(S.sessions.map(s => s.workoutId)),
    };
  }

  const earnedIds = st => ACHIEVEMENTS.filter(a => a.test(st, S.prefs.weeklyGoal)).map(a => a.id);

  // ===================== Workoutopbouw =====================
  const timingFor = (w, level) => w.timing || LEVELS[level] || LEVELS.beginner;

  function variantFor(ex, level, low) {
    if (low && ex.low) return { n: ex.low.n, c: ex.low.c, isLow: true };
    if (level === 'beginner' && ex.easy) return { n: ex.easy.n, c: ex.easy.c, isLow: false };
    return { n: ex.n, c: ex.c, isLow: false };
  }

  function buildTimeline(w, level) {
    const t = timingFor(w, level);
    const segs = [{ type: 'prep', dur: t.prep, ex: 0 }];
    w.exercises.forEach((_, i) => {
      if (i > 0) segs.push({ type: 'rest', dur: t.rest, ex: i });
      segs.push({ type: 'work', dur: t.work, ex: i });
    });
    return segs;
  }

  const totalSeconds = (w, level) => buildTimeline(w, level).reduce((a, s) => a + s.dur, 0);
  const minutesLabel = (w, level) => `${Math.round(totalSeconds(w, level) / 60)} min`;

  function recommended() {
    const today = dayKey(new Date());
    const intensive = S.sessions.filter(s => s.workoutId !== 'herstel');
    if (intensive.some(s => s.date === today)) {
      return { w: byId('herstel'), reason: 'Vandaag al getraind', line: 'Je hebt vandaag al getraind. Rustig herstellen is ook vooruitgang.' };
    }
    const rot = ROTATION[S.prefs.goal] || ROTATION.balans;
    const w = byId(rot[intensive.length % rot.length]);
    return { w, reason: 'Aanbevolen voor vandaag', line: w.blurb };
  }

  // ===================== Schermen & navigatie =====================
  const SCREENS = ['app', 'onboarding', 'player', 'result'];
  const TABS = ['home', 'library', 'progress', 'settings'];
  let currentView = 'home';
  let detailId = null;

  function setScreen(name) {
    for (const s of SCREENS) $(s).hidden = s !== name;
    window.scrollTo(0, 0);
  }

  function nav(view, opts = {}) {
    currentView = view;
    for (const v of [...TABS, 'detail']) $('view-' + v).hidden = v !== view;
    const activeTab = view === 'detail' ? 'library' : view;
    document.querySelectorAll('.tab').forEach(t => {
      if (t.dataset.nav === activeTab) t.setAttribute('aria-current', 'page');
      else t.removeAttribute('aria-current');
    });
    renderView(view);
    window.scrollTo(0, 0);
    if (opts.focus !== false) {
      const title = $('view-' + view).querySelector('h1');
      if (title) title.focus({ preventScroll: true });
    }
  }

  function renderView(view) {
    if (view === 'home') renderHome();
    else if (view === 'library') renderLibrary();
    else if (view === 'detail') renderDetail();
    else if (view === 'progress') renderProgress();
    else if (view === 'settings') renderSettings();
  }

  function metaChips(w) {
    const level = S.prefs.level;
    const items = [
      minutesLabel(w, level),
      w.focus,
      w.kind === 'herstel' ? 'Rustig tempo' : LEVELS[level].label,
      'Uitrusting: geen',
      `${w.exercises.length} oefeningen`,
    ];
    if (S.prefs.lowImpact && w.exercises.some(e => e.low)) items.push('Low impact');
    return h('ul', { class: 'chips', 'aria-label': 'Kenmerken' }, items.map(t => h('li', { text: t })));
  }

  // ---------- Vandaag ----------
  function renderHome() {
    const root = $('view-home');
    const st = computeStats();
    const rec = recommended();
    const w = rec.w;
    const now = new Date();
    const todayKey = dayKey(now);

    const hero = h('article', { class: 'hero' + (w.kind === 'herstel' ? ' recovery' : ''), 'aria-labelledby': 'hero-name' },
      h('p', { class: 'eyebrow', text: rec.reason }),
      h('h2', { id: 'hero-name', text: w.name }),
      h('p', { text: rec.line }),
      metaChips(w),
      h('button', { type: 'button', class: 'btn ink big', 'data-action': 'start', 'data-id': w.id, text: 'Start workout' }),
      h('button', { type: 'button', class: 'btn outline-ink', 'data-action': 'detail', 'data-id': w.id, text: 'Bekijk de oefeningen' }),
      h('p', { class: 'fine', text: SAFETY }),
    );

    const monday = weekStart(now);
    const dayNames = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];
    const week = h('ol', { class: 'week' }, dayNames.map((name, i) => {
      const k = dayKey(addDays(monday, i));
      const done = st.days.has(k), isToday = k === todayKey;
      const label = `${fmtDate(k, { weekday: 'long' })}${isToday ? ' (vandaag)' : ''}: ${done ? 'actief' : 'nog niet actief'}`;
      return h('li', { class: [done && 'done', isToday && 'today'].filter(Boolean).join(' '), 'aria-label': label },
        h('span', { class: 'dot', 'aria-hidden': 'true' }), h('span', { 'aria-hidden': 'true', text: name }));
    }));
    const goal = S.prefs.weeklyGoal;
    const weekLine = st.thisWeek >= goal
      ? `Weekdoel gehaald: ${st.thisWeek} van ${goal} actieve dagen.`
      : `${st.thisWeek} van ${goal} actieve dagen deze week.`;

    const weekCard = h('section', { class: 'card', 'aria-labelledby': 'week-title' },
      h('h2', { id: 'week-title', text: 'Deze week' }),
      week,
      h('p', { class: 'muted', text: weekLine }),
      h('div', { class: 'tiles' },
        tile(st.streak, st.streak === 1 ? 'dag op rij' : 'dagen op rij'),
        tile(st.total, st.total === 1 ? 'workout' : 'workouts'),
        tile(st.minutes, 'minuten'),
      ),
    );

    const recent = [...S.sessions].reverse().slice(0, 3);
    const recentCard = h('section', { class: 'card', 'aria-labelledby': 'recent-title' },
      h('h2', { id: 'recent-title', text: 'Recent' }),
      recent.length
        ? h('ul', { class: 'list' }, recent.map(sessionItem))
        : h('p', { class: 'empty', text: 'Nog geen workouts. Je eerste zeven minuten staan hierboven klaar.' }),
    );

    root.replaceChildren(
      h('p', { class: 'eyebrow', text: cap(now.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })) }),
      h('h1', { id: 'home-title', tabindex: '-1', text: 'Vandaag' }),
      hero, weekCard, recentCard,
    );
  }

  const tile = (value, label) => h('div', { class: 'tile' }, h('b', { text: value }), h('span', { text: label }));

  function sessionItem(s) {
    const w = byId(s.workoutId);
    const bits = [cap(fmtDate(s.date, { weekday: 'short', day: 'numeric', month: 'short' })), fmtClock(s.durationSec) + ' min'];
    if (s.lowImpact && w.exercises.some(e => e.low)) bits.push('low impact');
    return h('li', null,
      h('div', { class: 'row' },
        h('strong', { text: w.name }),
        s.effort ? h('span', { class: 'tag accent', text: EFFORTS[s.effort] }) : null),
      h('span', { class: 'fine', text: bits.join(' · ') }),
      s.note ? h('span', { class: 'note', text: s.note }) : null,
    );
  }

  // ---------- Bibliotheek ----------
  function renderLibrary() {
    const cards = WORKOUTS.map(w => h('button', {
      type: 'button', class: 'wcard' + (w.kind === 'herstel' ? ' recovery' : ''), 'data-action': 'detail', 'data-id': w.id,
    },
      h('div', { class: 'row' },
        h('span', { class: 'tag' + (w.kind === 'herstel' ? '' : ' accent'), text: w.tag }),
        h('span', { class: 'tag', text: `${minutesLabel(w, S.prefs.level)} · ${w.exercises.length} oefeningen` })),
      h('h2', { text: w.name }),
      h('p', { text: w.blurb }),
    ));
    $('view-library').replaceChildren(
      h('h1', { id: 'library-title', tabindex: '-1', text: 'Workouts' }),
      h('p', { class: 'lead', text: 'Drie circuits van zeven minuten en één rustige herstelsessie. Geen uitrusting nodig.' }),
      ...cards,
    );
  }

  // ---------- Detail ----------
  function renderDetail() {
    const w = byId(detailId) || WORKOUTS[0];
    const level = S.prefs.level, low = S.prefs.lowImpact;
    const t = timingFor(w, level);
    const steps = h('ol', { class: 'steps' }, w.exercises.map(ex => {
      const v = variantFor(ex, level, low);
      const alt = !low && ex.low ? h('span', { class: 'alt' }, h('b', { text: 'Low impact: ' }), ex.low.n) : null;
      return h('li', null, h('strong', { text: v.n }), h('span', { text: v.c }), alt);
    }));
    $('view-detail').replaceChildren(
      h('button', { type: 'button', class: 'link-btn', 'data-nav': 'library', text: 'Alle workouts' }),
      h('p', { class: 'eyebrow', text: w.tag }),
      h('h1', { id: 'detail-title', tabindex: '-1', text: w.name }),
      h('p', { class: 'lead', text: w.blurb }),
      metaChips(w),
      h('p', { class: 'muted', text: `${t.work} seconden ${w.kind === 'herstel' ? 'per houding' : 'werk'}, ${t.rest} seconden ${w.kind === 'herstel' ? 'wisselen' : 'rust'}. Totaal ${fmtClock(totalSeconds(w, level))}.` }),
      h('section', { class: 'card', 'aria-label': 'Oefeningen' }, steps),
      h('p', { class: 'fine', text: SAFETY + ' Twijfel je? Overleg eerst met je arts.' }),
      h('button', { type: 'button', class: 'btn primary big sticky-cta', 'data-action': 'start', 'data-id': w.id, text: 'Start workout' }),
    );
  }

  // ---------- Voortgang ----------
  function renderProgress() {
    const st = computeStats();
    const goal = S.prefs.weeklyGoal;

    const monday = weekStart(new Date());
    const cols = [];
    for (let i = 7; i >= 0; i--) {
      const wkDate = addDays(monday, -7 * i);
      const count = st.weeks.get(dayKey(wkDate)) || 0;
      const label = `${wkDate.getDate()}/${wkDate.getMonth() + 1}`;
      cols.push(h('div', { class: 'col' + (count >= goal ? ' hit' : ''), role: 'listitem', 'aria-label': `Week van ${label}: ${count} actieve dagen` },
        h('div', { class: 'track', 'aria-hidden': 'true' }, h('div', { class: 'fill', style: `height:${Math.round(count / 7 * 100)}%` })),
        h('span', { 'aria-hidden': 'true', text: label })));
    }

    const earned = new Set(earnedIds(st));
    const badges = h('ul', { class: 'badges' }, ACHIEVEMENTS.map(a => h('li', { class: earned.has(a.id) ? 'earned' : '' },
      h('strong', { text: a.name }),
      h('span', { text: a.desc }),
      h('span', { class: 'sr-only', text: earned.has(a.id) ? ' (behaald)' : ' (nog niet behaald)' }))));

    const history = [...S.sessions].reverse().slice(0, 60);

    $('view-progress').replaceChildren(
      h('h1', { id: 'progress-title', tabindex: '-1', text: 'Voortgang' }),
      h('div', { class: 'tiles' },
        tile(st.total, st.total === 1 ? 'workout' : 'workouts'),
        tile(st.minutes, 'minuten totaal'),
        tile(st.streak, 'huidige reeks (dagen)'),
        tile(st.bestStreak, 'langste reeks (dagen)'),
        tile(`${st.thisWeek}/${goal}`, 'deze week'),
        tile(st.bestWeek, 'beste week (dagen)'),
      ),
      h('section', { class: 'card', 'aria-labelledby': 'chart-title' },
        h('h2', { id: 'chart-title', text: 'Actieve dagen per week' }),
        h('div', { class: 'chart', role: 'list' }, cols),
        h('p', { class: 'fine', text: `Laatste acht weken. Groen betekent weekdoel (${goal} ${goal === 1 ? 'dag' : 'dagen'}) gehaald.` })),
      h('section', { class: 'card', 'aria-labelledby': 'badge-title' },
        h('h2', { id: 'badge-title', text: 'Mijlpalen' }),
        badges),
      h('section', { class: 'card', 'aria-labelledby': 'history-title' },
        h('h2', { id: 'history-title', text: 'Historie' }),
        history.length
          ? h('ul', { class: 'list' }, history.map(sessionItem))
          : h('p', { class: 'empty', text: 'Hier verschijnt elke voltooide workout, met je inspanning en notitie.' })),
    );
  }

  // ---------- Instellingen ----------
  function renderSettings() {
    const p = S.prefs;
    $('prefs-summary').replaceChildren(
      h('dt', { text: 'Hoofddoel' }), h('dd', { text: GOALS[p.goal] }),
      h('dt', { text: 'Niveau' }), h('dd', { text: LEVELS[p.level].label }),
      h('dt', { text: 'Low impact' }), h('dd', { text: p.lowImpact ? 'Aan' : 'Uit' }),
    );
    $('goal-value').textContent = `${p.weeklyGoal} ${p.weeklyGoal === 1 ? 'dag' : 'dagen'}`;
    $('pref-sound').checked = p.sound;
    $('pref-vibrate').checked = p.vibrate;
    const notes = [];
    if (!('vibrate' in navigator)) notes.push('Trillen wordt op dit toestel niet ondersteund.');
    if (!('wakeLock' in navigator)) notes.push('Scherm wakker houden wordt hier niet ondersteund: zet automatische vergrendeling zo nodig tijdelijk uit.');
    notes.push('Geluid volgt de stille modus van je toestel.');
    $('signal-note').textContent = notes.join(' ');
    $('data-status').textContent = `${S.sessions.length} ${S.sessions.length === 1 ? 'workout' : 'workouts'} lokaal opgeslagen.`;
  }

  // ===================== Onboarding =====================
  function openOnboarding(first) {
    const f = $('onboarding-form');
    f.elements.goal.value = S.prefs.goal;
    f.elements.level.value = S.prefs.level;
    f.elements.lowImpact.checked = S.prefs.lowImpact;
    $('ob-cancel').hidden = first;
    setScreen('onboarding');
    if (!first) $('ob-title').focus({ preventScroll: true });
  }

  function submitOnboarding(e) {
    e.preventDefault();
    const f = e.currentTarget;
    const goal = f.elements.goal.value, level = f.elements.level.value;
    if (Object.hasOwn(GOALS, goal)) S.prefs.goal = goal;
    if (Object.hasOwn(LEVELS, level)) S.prefs.level = level;
    S.prefs.lowImpact = f.elements.lowImpact.checked;
    const first = !S.prefs.onboarded;
    S.prefs.onboarded = true;
    save();
    setScreen('app');
    nav(first ? 'home' : 'settings');
    toast(first ? 'Je plan staat klaar.' : 'Voorkeuren bijgewerkt.');
  }

  // ===================== Signalen =====================
  let audioCtx = null;

  function initAudio() {
    if (!S.prefs.sound) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      audioCtx = audioCtx || new Ctx();
      if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
    } catch (e) { audioCtx = null; }
  }

  function tone(freq, dur = 0.14, delay = 0, gain = 0.22) {
    if (!audioCtx || !S.prefs.sound) return;
    try {
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      const t = audioCtx.currentTime + delay;
      o.type = 'sine';
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(gain, t + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g);
      g.connect(audioCtx.destination);
      o.start(t);
      o.stop(t + dur + 0.03);
    } catch (e) { /* geluid is optioneel */ }
  }

  function buzz(pattern) {
    if (!S.prefs.vibrate || typeof navigator.vibrate !== 'function') return;
    try { navigator.vibrate(pattern); } catch (e) { /* trillen is optioneel */ }
  }

  function cue(kind) {
    if (kind === 'tick') tone(660, 0.09);
    else if (kind === 'work') { tone(880, 0.16); tone(1175, 0.24, 0.17); buzz(220); }
    else if (kind === 'rest') { tone(520, 0.28); buzz([90, 70, 90]); }
    else if (kind === 'done') { tone(660, 0.16); tone(880, 0.16, 0.18); tone(1320, 0.4, 0.36); buzz([160, 90, 160, 90, 320]); }
  }

  let wakeLock = null;
  async function acquireWake() {
    if (!('wakeLock' in navigator) || wakeLock) return;
    try {
      const lock = await navigator.wakeLock.request('screen');
      lock.addEventListener('release', () => { if (wakeLock === lock) wakeLock = null; });
      if (P && !P.paused) wakeLock = lock; else lock.release().catch(() => {});
    } catch (e) { /* geweigerd of niet zichtbaar: de workout loopt gewoon door */ }
  }
  function releaseWake() {
    if (!wakeLock) return;
    const lock = wakeLock;
    wakeLock = null;
    lock.release().catch(() => {});
  }

  function announce(text) {
    const el = $('sr-live');
    el.textContent = '';
    requestAnimationFrame(() => { el.textContent = text; });
  }

  // ===================== Begeleide workout =====================
  // De timer rekent met een eindtijdstip (endsAt). De interval ververst alleen het scherm,
  // dus throttling of een tab op de achtergrond laat de tijd niet achterlopen.
  const TICK_MS = 200;
  const PHASE_LABEL = { prep: 'Maak je klaar', work: 'Werk', rest: 'Rust' };
  let P = null;

  function startWorkout(id) {
    const w = byId(id);
    if (!w || P) return;
    const level = S.prefs.level;
    const segs = buildTimeline(w, level);
    const now = Date.now();
    P = {
      w, level, low: S.prefs.lowImpact, segs, idx: 0,
      endsAt: now + segs[0].dur * 1000, remainingMs: segs[0].dur * 1000,
      paused: false, activeMs: 0, resumedAt: now, lastSec: null, timer: null,
      planned: segs.reduce((a, s) => a + s.dur, 0),
    };
    initAudio();
    clearTimeout(toastTimer);
    $('toast').classList.remove('show'); // geen melding over de timer heen
    $('p-workout').textContent = w.name;
    const hasLow = w.exercises.some(e => e.low);
    $('p-low').hidden = !hasLow;
    $('p-steps').replaceChildren(...w.exercises.map(() => h('li')));
    setScreen('player');
    renderPauseState();
    renderSegment();
    renderClock();
    P.timer = setInterval(tick, TICK_MS);
    acquireWake();
    $('p-toggle').focus({ preventScroll: true });
  }

  const remainingMs = () => (P.paused ? P.remainingMs : Math.max(0, P.endsAt - Date.now()));

  function tick() {
    if (!P || P.paused) return;
    const now = Date.now();
    let entered = false;
    while (now >= P.endsAt) {
      if (P.idx >= P.segs.length - 1) { finishWorkout(); return; }
      P.idx++;
      P.endsAt += P.segs[P.idx].dur * 1000;
      entered = true;
    }
    if (entered) {
      P.lastSec = null;
      renderSegment();
      cue(P.segs[P.idx].type === 'work' ? 'work' : 'rest');
    }
    renderClock();
  }

  function renderSegment() {
    const seg = P.segs[P.idx];
    const exs = P.w.exercises;
    const v = variantFor(exs[seg.ex], P.level, P.low);
    const recovery = P.w.kind === 'herstel';
    $('player').dataset.phase = seg.type;
    $('p-phase').textContent = seg.type === 'rest' ? (recovery ? 'Wissel' : 'Rust') : seg.type === 'work' && recovery ? 'Houd vast' : PHASE_LABEL[seg.type];
    $('p-name').textContent = v.n;
    $('p-cue').textContent = v.c;

    const pos = `Oefening ${seg.ex + 1} van ${exs.length}`;
    let nextText;
    if (seg.type === 'prep') nextText = `Eerste oefening · ${SAFETY}`;
    else if (seg.type === 'rest') nextText = `Hierna · ${pos}`;
    else if (seg.ex + 1 < exs.length) nextText = `Hierna: ${variantFor(exs[seg.ex + 1], P.level, P.low).n}`;
    else nextText = 'Laatste oefening. Bijna klaar.';
    $('p-next').textContent = nextText;

    $('p-low').setAttribute('aria-pressed', String(P.low));
    $('p-low').textContent = P.low ? 'Low impact aan' : 'Low impact uit';

    [...$('p-steps').children].forEach((li, i) => {
      li.className = i < seg.ex ? 'done' : i === seg.ex && seg.type === 'work' ? 'now' : '';
    });

    const spoken = seg.type === 'work' ? `${v.n}. ${seg.dur} seconden.`
      : seg.type === 'rest' ? `Rust. Hierna: ${v.n}.`
      : `Maak je klaar. Eerste oefening: ${v.n}.`;
    announce(spoken);
  }

  function renderClock() {
    const seg = P.segs[P.idx];
    const ms = remainingMs();
    const sec = Math.max(0, Math.ceil(ms / 1000));
    $('p-bar-fill').style.transform = `scaleX(${Math.min(1, Math.max(0, ms / (seg.dur * 1000)))})`;
    if (sec === P.lastSec) return;
    const prevSec = P.lastSec;
    P.lastSec = sec;
    $('p-time').textContent = sec;
    let rest = 0;
    for (let i = P.idx + 1; i < P.segs.length; i++) rest += P.segs[i].dur;
    $('p-total').textContent = `Nog ${fmtClock(rest + sec)}`;
    if (!P.paused && prevSec !== null && sec >= 1 && sec <= 3) cue('tick');
  }

  function renderPauseState() {
    $('player').dataset.paused = String(P.paused);
    $('p-toggle').setAttribute('aria-label', P.paused ? 'Hervatten' : 'Pauzeren');
    $('p-toggle-label').textContent = P.paused ? 'Hervat' : 'Pauze';
  }

  function pauseWorkout() {
    if (!P || P.paused) return;
    const now = Date.now();
    P.remainingMs = Math.max(0, P.endsAt - now);
    P.activeMs += now - P.resumedAt;
    P.paused = true;
    releaseWake();
    renderPauseState();
    renderClock();
    announce('Gepauzeerd.');
  }

  function resumeWorkout() {
    if (!P || !P.paused) return;
    const now = Date.now();
    P.endsAt = now + P.remainingMs;
    P.resumedAt = now;
    P.paused = false;
    initAudio();
    acquireWake();
    renderPauseState();
    renderClock();
    announce('Hervat.');
  }

  function jumpTo(idx) {
    const ms = P.segs[idx].dur * 1000;
    P.idx = idx;
    P.remainingMs = ms;
    P.endsAt = Date.now() + ms;
    P.lastSec = null;
    renderSegment();
    renderClock();
  }

  const workIndex = ex => P.segs.findIndex(s => s.type === 'work' && s.ex === ex);

  function nextExercise() {
    if (!P) return;
    const seg = P.segs[P.idx];
    // Vanuit voorbereiding of rust: direct naar de oefening die klaarstaat.
    const target = seg.type === 'work' ? seg.ex + 1 : seg.ex;
    if (target >= P.w.exercises.length) { finishWorkout(); return; }
    jumpTo(workIndex(target));
  }

  function prevExercise() {
    if (!P) return;
    const seg = P.segs[P.idx];
    const elapsed = seg.dur * 1000 - remainingMs();
    if (seg.type === 'work' && elapsed > 3000) { jumpTo(P.idx); return; }
    const target = seg.ex - 1;
    jumpTo(target < 0 ? (seg.type === 'work' ? P.idx : 0) : workIndex(target));
  }

  function teardownPlayer() {
    clearInterval(P.timer);
    releaseWake();
    P = null;
  }

  async function stopWorkout() {
    if (!P) return;
    const wasPaused = P.paused;
    pauseWorkout();
    const ok = await confirmDialog({
      title: 'Workout stoppen?',
      body: 'Een afgebroken workout wordt niet opgeslagen in je voortgang.',
      ok: 'Stoppen', cancel: 'Doorgaan', danger: true,
    });
    if (!P) return;
    if (ok) {
      teardownPlayer();
      setScreen('app');
      nav(currentView);
    } else if (!wasPaused) {
      resumeWorkout();
    }
  }

  let pendingSessionId = null;

  function finishWorkout() {
    const now = Date.now();
    if (!P.paused) P.activeMs += now - P.resumedAt;
    const before = new Set(earnedIds(computeStats()));
    const session = {
      id: newId(), workoutId: P.w.id, date: dayKey(new Date()), ts: now,
      durationSec: Math.min(P.planned, Math.max(0, Math.round(P.activeMs / 1000))),
      level: P.level, lowImpact: P.low, effort: null, note: '',
    };
    teardownPlayer();
    S.sessions.push(session); // direct bewaren: ook als het resultaatscherm wordt weggeklikt telt de workout
    save();
    cue('done');

    const st = computeStats();
    const fresh = ACHIEVEMENTS.filter(a => !before.has(a.id) && a.test(st, S.prefs.weeklyGoal));
    const w = byId(session.workoutId);
    pendingSessionId = session.id;
    $('result-form').reset();
    $('r-title').textContent = w.kind === 'herstel' ? 'Mooi hersteld.' : 'Klaar. Goed gedaan.';
    $('r-summary').textContent = `${w.name} voltooid in ${fmtClock(session.durationSec)} minuten.`;
    $('r-tiles').replaceChildren(
      tile(`${st.thisWeek}/${S.prefs.weeklyGoal}`, 'deze week'),
      tile(st.streak, st.streak === 1 ? 'dag op rij' : 'dagen op rij'),
      tile(st.total, st.total === 1 ? 'workout totaal' : 'workouts totaal'),
    );
    $('r-badges').replaceChildren(...fresh.map(a => h('p', { class: 'new-badge' },
      h('strong', { text: `Nieuwe mijlpaal: ${a.name}` }), h('br'), a.desc)));
    setScreen('result');
    $('r-title').focus({ preventScroll: true });
    announce(`Workout voltooid. ${w.name}.`);
  }

  function submitResult(e) {
    e.preventDefault();
    const f = e.currentTarget;
    const s = S.sessions.find(x => x.id === pendingSessionId);
    if (s) {
      const effort = f.elements.effort.value;
      s.effort = Object.hasOwn(EFFORTS, effort) ? effort : null;
      s.note = f.elements.note.value.trim().slice(0, 280);
      save();
    }
    pendingSessionId = null;
    setScreen('app');
    nav('home');
    toast('Opgeslagen in je voortgang.');
  }

  // ===================== Dialoog & toast =====================
  function confirmDialog({ title, body, ok = 'OK', cancel = 'Annuleren', danger = false }) {
    const dlg = $('confirm');
    if (typeof dlg.showModal !== 'function') return Promise.resolve(window.confirm(`${title}\n\n${body}`));
    $('confirm-title').textContent = title;
    $('confirm-body').textContent = body;
    $('confirm-ok').textContent = ok;
    $('confirm-cancel').textContent = cancel;
    $('confirm-ok').classList.toggle('is-danger', danger);
    dlg.returnValue = '';
    return new Promise(resolve => {
      dlg.addEventListener('close', () => resolve(dlg.returnValue === 'ok'), { once: true });
      dlg.showModal();
      $('confirm-cancel').focus();
    });
  }

  let toastTimer = null;
  function toast(msg) {
    const t = $('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
  }

  // ===================== Back-up, import, wissen =====================
  function downloadJson(filename, payload) {
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
    const a = h('a', { href: url, download: filename });
    document.body.append(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1000);
  }

  function exportData() {
    downloadJson(`tasniem-move-backup-${dayKey(new Date())}.json`,
      { app: 'tasniem-move', version: 1, exportedAt: new Date().toISOString(), data: S });
    toast('Back-up gedownload.');
  }

  async function importData(file) {
    let parsed;
    try {
      parsed = JSON.parse(await file.text());
    } catch (e) {
      toast('Dit bestand is geen geldige back-up.');
      return;
    }
    if (!parsed || parsed.app !== 'tasniem-move' || !parsed.data || typeof parsed.data !== 'object') {
      toast('Dit is geen Tasniem Move-back-up.');
      return;
    }
    const incoming = sanitize(parsed.data);
    const skipped = (Array.isArray(parsed.data.sessions) ? parsed.data.sessions.length : 0) - incoming.sessions.length;
    const ok = await confirmDialog({
      title: 'Back-up terugzetten?',
      body: `Dit vervangt je huidige gegevens (${S.sessions.length} workouts) door de back-up (${incoming.sessions.length} workouts${skipped > 0 ? `, ${skipped} ongeldige overgeslagen` : ''}).`,
      ok: 'Terugzetten',
    });
    if (!ok) return;
    incoming.prefs.onboarded = true;
    S = incoming;
    save();
    renderSettings();
    toast('Back-up teruggezet.');
  }

  async function wipeData() {
    const ok = await confirmDialog({
      title: 'Alles wissen?',
      body: `Je voorkeuren en ${S.sessions.length} opgeslagen workouts worden definitief van dit toestel verwijderd. Dit kan niet ongedaan worden gemaakt.`,
      ok: 'Definitief wissen', danger: true,
    });
    if (!ok) return;
    store.remove(STORE_KEY);
    store.remove(CORRUPT_KEY);
    S = defaults();
    openOnboarding(true);
    toast('Gegevens gewist.');
  }

  function changeGoal(delta) {
    S.prefs.weeklyGoal = Math.min(7, Math.max(1, S.prefs.weeklyGoal + delta));
    save();
    renderSettings();
  }

  // ===================== Events =====================
  const ACTIONS = {
    'start': el => startWorkout(el.dataset.id),
    'detail': el => { detailId = el.dataset.id; nav('detail'); },
    'open-onboarding': () => openOnboarding(false),
    'close-onboarding': () => { setScreen('app'); nav('settings'); },
    'player-toggle': () => (P && P.paused ? resumeWorkout() : pauseWorkout()),
    'player-next': nextExercise,
    'player-prev': prevExercise,
    'player-stop': stopWorkout,
    'player-low': () => { if (P) { P.low = !P.low; renderSegment(); } },
    'goal-up': () => changeGoal(1),
    'goal-down': () => changeGoal(-1),
    'export': exportData,
    'import': () => $('import-file').click(),
    'wipe': wipeData,
  };

  function bindEvents() {
    document.addEventListener('click', e => {
      const navEl = e.target.closest('[data-nav]');
      if (navEl) { nav(navEl.dataset.nav); return; }
      const actEl = e.target.closest('[data-action]');
      if (actEl && ACTIONS[actEl.dataset.action]) ACTIONS[actEl.dataset.action](actEl);
    });

    $('onboarding-form').addEventListener('submit', submitOnboarding);
    $('result-form').addEventListener('submit', submitResult);

    $('pref-sound').addEventListener('change', e => { S.prefs.sound = e.target.checked; save(); if (e.target.checked) { initAudio(); cue('tick'); } });
    $('pref-vibrate').addEventListener('change', e => { S.prefs.vibrate = e.target.checked; save(); if (e.target.checked) buzz(80); });
    $('import-file').addEventListener('change', e => {
      const file = e.target.files && e.target.files[0];
      e.target.value = '';
      if (file) importData(file);
    });

    document.addEventListener('keydown', e => {
      if (!P || $('confirm').open || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === ' ' || e.key === 'k') {
        if (e.key === ' ' && e.target.closest('button')) return; // de knop handelt spatie zelf af
        e.preventDefault();
        ACTIONS['player-toggle']();
      } else if (e.key === 'ArrowRight') { e.preventDefault(); nextExercise(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prevExercise(); }
      else if (e.key === 'Escape') { e.preventDefault(); stopWorkout(); }
    });

    // Terug op de voorgrond: direct bijwerken en wake lock opnieuw aanvragen.
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState !== 'visible') return;
      if (P && !P.paused) { tick(); acquireWake(); }
      else if (!P && !$('app').hidden) renderView(currentView); // datum kan gewisseld zijn
    });
  }

  // ===================== Start =====================
  function init() {
    load();
    bindEvents();
    if (S.prefs.onboarded) { setScreen('app'); nav('home', { focus: false }); }
    else openOnboarding(true);

    if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
      window.addEventListener('load', () => { navigator.serviceWorker.register('./sw.js').catch(() => {}); });
    }
  }

  init();
})();
