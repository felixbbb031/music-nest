/*!
 * Music Nest Card for Home Assistant — version 0.1.1
 * One file, no libraries, no tracking. Works with any media_player (Chromecast, Music Assistant ...).
 * Online services used only from the tablet's browser: Radio Browser (radio list),
 * iTunes / Deezer search (only when a cover is missing or too small).
 */
const MN_VERSION = "0.1.1";
const MN_KEY = "music-nest-card.entity";
const MN_KEY_COVERS = "music-nest-card.covers";
const MN_KEY_RECENT = "music-nest-card.radio-recent";
const MN_KEY_STATION = "music-nest-card.radio-now";
const MN_KEY_COUNTRY = "music-nest-card.radio-country";
const MN_RB_SERVERS = ["de1", "de2", "fi1", "nl1", "at1"].map((s) => "https://" + s + ".api.radio-browser.info");
const MN_GENRES = ["pop", "rock", "jazz", "classical", "dance", "chillout", "news", "sport"];
const MN_PLATFORMS = { music_assistant: "Music Assistant", mass: "Music Assistant", cast: "Chromecast", plex: "Plex", dlna_dmr: "DLNA", sonos: "Sonos", spotify: "Spotify", androidtv: "Android TV", androidtv_remote: "Android TV", squeezebox: "Squeezebox", kodi: "Kodi", jellyfin: "Jellyfin" };

const MN_ICONS = {
  play: "M8 5v14l11-7z",
  pause: "M6 19h4V5H6v14zm8-14v14h4V5h-4z",
  next: "M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z",
  prev: "M6 6h2v12H6zm3.5 6l8.5 6V6z",
  shuffle: "M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z",
  repeat: "M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z",
  vol: "M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z",
  mute: "M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.8 8.8 0 0021 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 003.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z",
  cast: "M1 18v3h3c0-1.66-1.34-3-3-3zm0-4v2c2.76 0 5 2.24 5 5h2c0-3.87-3.13-7-7-7zm0-4v2c4.97 0 9 4.03 9 9h2c0-6.08-4.93-11-11-11zm20-7H3c-1.1 0-2 .9-2 2v3h2V5h18v14h-7v2h7c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z",
  back: "M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z",
  folder: "M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z",
  note: "M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z",
  radio: "M3.24 6.15C2.51 6.43 2 7.17 2 8v12c0 1.1.89 2 2 2h16c1.11 0 2-.9 2-2V8c0-1.11-.89-2-2-2H8.3l8.26-3.34L15.88 1 3.24 6.15zM7 20c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm13-8h-2v-2h-2v2H4V8h16v4z",
  close: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
  check: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
  playlist: "M3 10h11v2H3zm0-4h11v2H3zm0 8h7v2H3zm13-1v8l6-4z",
  artist: "M11 14c1 0 2.05.16 3.2.44-.81.87-1.2 1.89-1.2 3.06 0 .89.25 1.73.78 2.5H3v-2c0-1.19.91-2.15 2.74-2.88C7.57 14.38 9.33 14 11 14m0-2c-1.08 0-2-.39-2.82-1.17C7.38 10.05 7 9.11 7 8c0-1.08.38-2 1.18-2.82C9 4.38 9.92 4 11 4c1.11 0 2.05.38 2.83 1.18C14.61 6 15 6.92 15 8c0 1.11-.39 2.05-1.17 2.83C13.05 11.61 12.11 12 11 12m7.5-2H22v2h-2v5.5a2.5 2.5 0 01-2.5 2.5 2.5 2.5 0 01-2.5-2.5 2.5 2.5 0 012.5-2.5c.36 0 .69.07 1 .21V10z",
  album: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z",
  search: "M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z",
  recent: "M13 3a9 9 0 00-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0013 21a9 9 0 000-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"
};
const mnIcon = (n, s = 24) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="currentColor"><path d="${MN_ICONS[n]}"/></svg>`;
const mnEsc = (t) => String(t == null ? "" : t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const mnTime = (s) => { s = Math.max(0, Math.round(s || 0)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
const mnNorm = (t) => String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/g, " ").trim();
const mnLoad = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
const mnSave = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
/* An <img> on top of a fallback icon: if the picture can't load, it removes itself and the icon stays. */
const mnImg = (u) => u ? `<img class="ph" loading="lazy" referrerpolicy="no-referrer" src="${mnEsc(u)}" onerror="this.remove()">` : "";

let mnJsonpN = 0;
function mnJsonp(url, cbParam, timeout = 7000) {
  return new Promise((resolve, reject) => {
    const name = "__musicNestCb" + (++mnJsonpN) + "_" + Date.now();
    const s = document.createElement("script");
    let t;
    const done = (v, err) => { clearTimeout(t); window[name] = () => {}; s.remove(); err ? reject(err) : resolve(v); };
    t = setTimeout(() => done(null, new Error("timeout")), timeout);
    window[name] = (d) => done(d);
    s.onerror = () => done(null, new Error("network"));
    s.src = url + (url.includes("?") ? "&" : "?") + cbParam + "=" + name;
    document.head.appendChild(s);
  });
}

const MN_CSS = `
:host { display:block; height:100%; container-type:inline-size; color:#fff; font-family:var(--paper-font-body1_-_font-family, Roboto, system-ui, sans-serif); }
* { box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
button { font:inherit; color:inherit; border:0; background:none; cursor:pointer; padding:0; }
.card { position:relative; overflow:hidden; border-radius:22px; background:#0f0c14; height:100%; min-height:520px; display:flex; flex-direction:column; }
.card.fixed { position:fixed; inset:0; z-index:99999; border-radius:0; min-height:0; }
.bg { position:absolute; inset:-40px; background-size:cover; background-position:center; filter:blur(46px) brightness(.38) saturate(1.3); transition:background-image .6s; }
.bg.none { background:radial-gradient(circle at 30% 20%, #6a2d0a, #1a0f1f 60%, #0f0c14); filter:none; }
.in { position:relative; z-index:1; display:flex; flex-direction:column; height:100%; padding:14px 18px 18px; gap:10px; min-height:0; }
.top { display:flex; align-items:center; gap:8px; flex:0 0 auto; }
.tab { padding:10px 16px; border-radius:22px; font-weight:600; font-size:15px; opacity:.75; background:rgba(255,255,255,.07); white-space:nowrap; }
.tab.on { opacity:1; background:#ff8a2a; color:#1b0e00; }
.sp { flex:1; }
.chip { display:flex; align-items:center; gap:8px; padding:9px 14px; border-radius:22px; background:rgba(255,255,255,.1); font-size:14px; max-width:42%; }
.chip span { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.xbtn { width:42px; height:42px; border-radius:50%; background:rgba(255,255,255,.12); display:grid; place-items:center; flex:0 0 auto; }
.main { flex:1 1 auto; min-height:0; display:flex; }
img.ph { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
/* now playing */
.now { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; min-height:0; width:100%; }
.cover { position:relative; overflow:hidden; width:min(100%, 46vh, 420px); aspect-ratio:1; border-radius:22px; background:#241a2e; box-shadow:0 18px 50px rgba(0,0,0,.55); display:grid; place-items:center; color:rgba(255,255,255,.35); flex:0 1 auto; min-height:0; }
.meta { text-align:center; width:100%; min-width:0; }
.title { font-size:26px; font-weight:700; line-height:1.15; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.artist { font-size:17px; opacity:.72; margin-top:4px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.side { display:flex; flex-direction:column; gap:14px; width:100%; max-width:560px; }
.prog { display:flex; align-items:center; gap:10px; font-size:13px; opacity:.85; font-variant-numeric:tabular-nums; }
.track { flex:1; height:6px; border-radius:3px; background:rgba(255,255,255,.2); overflow:hidden; }
.bar { height:100%; width:0; background:#ff8a2a; border-radius:3px; }
.ctrl { display:flex; align-items:center; justify-content:center; gap:14px; }
.cb { width:58px; height:58px; border-radius:50%; display:grid; place-items:center; background:rgba(255,255,255,.09); }
.cb.big { width:84px; height:84px; background:#ff8a2a; color:#1b0e00; box-shadow:0 8px 24px rgba(255,138,42,.4); }
.cb.on { color:#ff8a2a; background:rgba(255,138,42,.18); }
.rep1 { position:relative; } .rep1 b { position:absolute; font-size:11px; right:15px; top:15px; }
.vol { display:flex; align-items:center; gap:12px; }
.vol input { flex:1; accent-color:#ff8a2a; height:34px; }
.vol button { width:44px; height:44px; display:grid; place-items:center; }
/* library home */
.home { flex:1; overflow:auto; width:100%; display:flex; flex-direction:column; justify-content:center; gap:18px; }
.hgrid { display:grid; grid-template-columns:repeat(auto-fill, minmax(150px, 1fr)); gap:16px; }
.ht { position:relative; border-radius:24px; aspect-ratio:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; font-size:20px; font-weight:700;
  background:linear-gradient(150deg, rgba(255,138,42,.34), rgba(255,255,255,.05) 70%); box-shadow:inset 0 0 0 1px rgba(255,255,255,.08); }
.ht:nth-child(2) { background:linear-gradient(150deg, rgba(255,92,70,.32), rgba(255,255,255,.05) 70%); }
.ht:nth-child(3) { background:linear-gradient(150deg, rgba(255,176,60,.32), rgba(255,255,255,.05) 70%); }
.ht:nth-child(4) { background:linear-gradient(150deg, rgba(230,110,140,.30), rgba(255,255,255,.05) 70%); }
.ht:nth-child(5) { background:linear-gradient(150deg, rgba(160,110,255,.30), rgba(255,255,255,.05) 70%); }
.ht svg { opacity:.95; }
.ht.off { opacity:.3; }
.hnote { opacity:.8; line-height:1.45; font-size:14px; text-align:center; max-width:560px; margin:0 auto; }
.hbtns { display:flex; gap:10px; justify-content:center; flex-wrap:wrap; }
/* browse */
.browse { flex:1; display:flex; flex-direction:column; gap:10px; min-height:0; width:100%; }
.crumb { display:flex; align-items:center; gap:10px; flex:0 0 auto; }
.crumb .t { font-size:19px; font-weight:700; flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.pill { padding:9px 16px; border-radius:20px; background:rgba(255,255,255,.12); font-weight:600; font-size:14px; display:flex; align-items:center; gap:6px; white-space:nowrap; flex:0 0 auto; }
.pill.acc, .pill.on { background:#ff8a2a; color:#1b0e00; }
.grid { flex:1; overflow:auto; display:grid; grid-template-columns:repeat(auto-fill, minmax(140px, 1fr)); gap:12px; align-content:start; padding-bottom:8px; }
.tile { position:relative; text-align:left; border-radius:16px; background:rgba(255,255,255,.07); overflow:hidden; display:flex; flex-direction:column; }
.tile > button:first-child { display:block; width:100%; text-align:left; }
.tile .im { position:relative; overflow:hidden; aspect-ratio:1; background:rgba(255,255,255,.06); display:grid; place-items:center; color:rgba(255,255,255,.45); }
.tile.round .im { border-radius:50%; margin:10px 10px 0; }
.tile .tx { padding:8px 10px 10px; font-size:14px; font-weight:600; line-height:1.2; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; min-height:46px; }
.tile .pl { position:absolute; right:8px; top:8px; width:38px; height:38px; border-radius:50%; background:#ff8a2a; color:#1b0e00; display:grid; place-items:center; box-shadow:0 4px 12px rgba(0,0,0,.4); z-index:2; }
.list { flex:1; overflow:auto; display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:8px; align-content:start; padding-bottom:8px; }
.lrow { display:flex; align-items:center; gap:12px; padding:8px 12px 8px 8px; border-radius:14px; background:rgba(255,255,255,.07); text-align:left; min-width:0; }
.lrow.sel { outline:2px solid #ff8a2a; }
.lrow .th { position:relative; overflow:hidden; width:54px; height:54px; border-radius:10px; background:rgba(255,255,255,.08); display:grid; place-items:center; flex:0 0 auto; color:rgba(255,255,255,.5); }
.lrow .tt { flex:1; min-width:0; }
.lrow .a { font-weight:600; font-size:15px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.lrow .b { font-size:12px; opacity:.65; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; margin-top:2px; }
.msg { margin:auto; text-align:center; opacity:.8; max-width:460px; line-height:1.45; padding:20px; }
/* radio */
.rbar { display:flex; gap:8px; align-items:center; flex-wrap:wrap; flex:0 0 auto; }
.q { flex:1 1 220px; min-width:0; padding:11px 16px; border-radius:22px; border:0; outline:0; background:rgba(255,255,255,.12); color:#fff; font-size:16px; font-family:inherit; }
.q::placeholder { color:rgba(255,255,255,.55); }
select.sel { padding:10px 12px; border-radius:20px; border:0; background:#2c2233; color:#fff; font-size:14px; font-family:inherit; max-width:200px; }
.chips { display:flex; gap:8px; overflow-x:auto; flex:0 0 auto; padding-bottom:2px; scrollbar-width:none; }
.chips::-webkit-scrollbar { display:none; }
/* pick */
.pick { flex:1; overflow:auto; width:100%; max-width:680px; margin:0 auto; display:flex; flex-direction:column; gap:10px; }
.pick h2 { margin:6px 0 2px; font-size:22px; } .pick p { margin:0 0 6px; opacity:.75; font-size:14px; }
.row { display:flex; align-items:center; gap:14px; padding:14px 16px; border-radius:16px; background:rgba(255,255,255,.08); text-align:left; }
.row.sel { outline:2px solid #ff8a2a; } .row .n { flex:1; font-weight:600; min-width:0; } .row .s { font-size:12px; opacity:.65; font-weight:400; margin-top:2px; }
.badge { display:inline-block; font-size:11px; padding:3px 8px; border-radius:10px; background:rgba(255,255,255,.15); margin-left:8px; font-weight:700; vertical-align:2px; }
.badge.ma { background:#ff8a2a; color:#1b0e00; }
/* compact */
.mini { display:flex; align-items:center; gap:12px; padding:10px 12px; position:relative; z-index:1; }
.mini .c { position:relative; overflow:hidden; width:60px; height:60px; border-radius:12px; background:#241a2e; flex:0 0 auto; display:grid; place-items:center; color:rgba(255,255,255,.4); }
.mini .m { flex:1; min-width:0; text-align:left; }
.mini .m .title { font-size:17px; } .mini .m .artist { font-size:13px; }
.mini .cb { width:46px; height:46px; } .mini .cb.big { width:54px; height:54px; box-shadow:none; }
.card.mincard { min-height:0; height:auto; }
/* wide layout (tablet landscape / panel) */
@media (orientation:landscape) { @container (min-width:700px) {
  .now { flex-direction:row; gap:36px; justify-content:center; }
  .cover { width:min(44cqw, 56vh, 460px); flex:0 0 auto; }
  .now .rt { flex:1; max-width:520px; display:flex; flex-direction:column; gap:22px; }
  .now .meta { text-align:left; } .title { font-size:32px; white-space:normal; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; }
  .hgrid { grid-template-columns:repeat(5, minmax(0, 1fr)); max-width:1200px; width:100%; margin:0 auto; }
  .ht { aspect-ratio:auto; height:min(34vh, 230px); }
}
}
.now .rt { display:contents; }
@media (orientation:landscape) { @container (min-width:700px) { .now .rt { display:flex; } } }
`;

class MusicNestCard extends HTMLElement {
  constructor() {
    super();
    this._root = this.attachShadow({ mode: "open" });
    this._view = "now"; this._tab = "now"; this._stack = []; this._items = []; this._node = null; this._origin = "lib";
    this._loading = false; this._err = ""; this._sig = ""; this._open = false; this._volHold = 0;
    this._lib = null;                       // library home: { eid, state, map, err }
    this._signed = {};                      // signed thumbnail paths
    this._radio = { mode: "", key: "", items: [], loading: false, err: "" };
    this._rq = ""; this._countries = null; this._rbBase = 0;
    this._cover = { key: "", url: "", pic: "", picOk: null };
  }
  static getStubConfig() { return { type: "custom:music-nest-card" }; }
  setConfig(config) {
    this._config = Object.assign({ mode: "full", cover_lookup: true }, config || {});
    this._sig = ""; if (this._hass) this._update();
  }
  getCardSize() { return this._config && this._config.mode === "compact" ? 2 : 8; }
  set hass(h) { this._hass = h; this._update(); }
  connectedCallback() { this._timer = setInterval(() => this._tick(), 1000); this._sig = ""; if (this._hass) this._update(); }
  disconnectedCallback() { clearInterval(this._timer); }

  /* ------------------------------ helpers ------------------------------ */
  _entityId() {
    let v = "";
    try { v = localStorage.getItem(MN_KEY) || ""; } catch (e) {}
    return v || (this._config && this._config.entity) || "";   // the tablet's own choice wins; YAML entity is the default
  }
  _platform(id) {
    const e = this._hass && this._hass.entities && this._hass.entities[id];
    return (e && e.platform) || "";
  }
  _platformName(id) {
    const p = this._platform(id);
    return MN_PLATFORMS[p] || (p ? p.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase()) : "");
  }
  _isMA(id) { const p = this._platform(id); return p === "music_assistant" || p === "mass"; }
  _players() {
    const st = (this._hass && this._hass.states) || {};
    const nm = (k) => st[k].attributes.friendly_name || k;
    return Object.keys(st).filter((k) => k.startsWith("media_player.")).sort((a, b) =>
      (this._isMA(b) - this._isMA(a)) || nm(a).localeCompare(nm(b)));
  }
  _st() { const id = this._entityId(); return id && this._hass && this._hass.states[id] ? this._hass.states[id] : null; }
  _url(u) { if (!u) return ""; return this._hass && this._hass.hassUrl && u.startsWith("/") ? this._hass.hassUrl(u) : u; }
  /* Browse thumbnails served by Home Assistant (/api/...) need a signed path, like HA's own media browser does. */
  _thumb(u) {
    if (!u) return "";
    if (!u.startsWith("/") || /[?&](token|authSig)=/.test(u)) return this._url(u);
    const s = this._signed[u];
    if (s) return s === "x" ? "" : this._url(s);
    if (s === undefined) {
      this._signed[u] = null;
      this._hass.callWS({ type: "auth/sign_path", path: u, expires: 86400 })
        .then((r) => { this._signed[u] = r.path; }).catch(() => { this._signed[u] = "x"; })
        .then(() => { clearTimeout(this._st2); this._st2 = setTimeout(() => this._refresh(), 60); });
    }
    return "";
  }
  _call(service, data) {
    return this._hass.callService("media_player", service, Object.assign({ entity_id: this._entityId() }, data || {}));
  }
  _pos(st) {
    const a = st.attributes; if (a.media_position == null) return null;
    let p = a.media_position;
    if (st.state === "playing" && a.media_position_updated_at) p += (Date.now() - new Date(a.media_position_updated_at).getTime()) / 1000;
    return Math.min(p, a.media_duration || p);
  }
  /* Which player is asked for lists: browse_entity if it exists, otherwise the chosen speaker. */
  _browseId() {
    const be = this._config.browse_entity;
    if (be && this._hass.states[be]) return be;
    return this._entityId();
  }
  _friendly(id) { const s = this._hass.states[id]; return (s && s.attributes.friendly_name) || id; }

  /* ---------------------- now playing text + cover ---------------------- */
  _station() { return mnLoad(MN_KEY_STATION, null); }
  _stationMatch(a) {
    const s = this._station(); if (!s) return null;
    const cid = a.media_content_id || "";
    if (cid && (cid === s.url || cid === s.url_resolved)) return s;
    const n = mnNorm(s.name);
    if (n && (mnNorm(a.media_title) === n || mnNorm(a.media_artist) === n || mnNorm(a.media_album_name) === n || mnNorm(a.media_channel) === n)) return s;
    return null;
  }
  _meta(st) {
    const a = st ? st.attributes : {};
    let title = a.media_title || "", artist = a.media_artist || "";
    const station = st ? this._stationMatch(a) : null;
    if (station && mnNorm(artist) === mnNorm(station.name)) artist = "";
    if (!artist && / [-–] /.test(title)) { const i = title.search(/ [-–] /); artist = title.slice(0, i).trim(); title = title.slice(i + 3).trim(); }
    return { title, artist, station, album: a.media_album_name || "" };
  }
  _coverKey(m) {
    if (!m.title || !m.artist) return "";
    if (m.station && (mnNorm(m.title) === mnNorm(m.station.name))) return "";
    return mnNorm(m.artist) + "|" + mnNorm(m.title.replace(/\s*[\(\[].*?[\)\]]\s*/g, " "));
  }
  _checkCover(st, pic) {
    if (!this._config.cover_lookup) return;
    const m = this._meta(st), key = this._coverKey(m), c = this._cover;
    if (c.pic !== pic) {                    // new picture from the speaker: is it big enough?
      c.pic = pic; c.picOk = pic ? null : false;
      if (pic) {
        const im = new Image();
        im.onload = () => { if (c.pic === pic) { c.picOk = im.naturalWidth >= 300; this._checkCover(this._st(), pic); this._refresh(); } };
        im.onerror = () => { if (c.pic === pic) { c.picOk = false; this._checkCover(this._st(), pic); this._refresh(); } };
        im.src = pic;
      }
    }
    if (c.key !== key) { c.key = key; c.url = ""; c.busy = false; }
    if (!key || c.picOk !== false || c.url || c.busy) return;
    const cache = mnLoad(MN_KEY_COVERS, {}), hit = cache[key];
    if (hit && (hit[0] || Date.now() - hit[1] < 3 * 864e5)) { c.url = hit[0]; return; }
    c.busy = true;
    this._lookupCover(m).then((u) => {
      const all = mnLoad(MN_KEY_COVERS, {}); all[key] = [u || "", Date.now()];
      const ks = Object.keys(all); if (ks.length > 400) ks.sort((x, y) => all[x][1] - all[y][1]).slice(0, ks.length - 400).forEach((k) => delete all[k]);
      mnSave(MN_KEY_COVERS, all);
      if (this._cover.key === key) { this._cover.url = u || ""; this._cover.busy = false; this._refresh(); }
    });
  }
  async _lookupCover(m) {
    const ar = mnNorm(m.artist), title = m.title.replace(/\s*[\(\[].*?[\)\]]\s*/g, " ").replace(/\s+feat\..*$/i, "").trim();
    const ok = (name) => { const n = mnNorm(name); return n && (n.includes(ar) || ar.includes(n)); };
    try {
      const r = await mnJsonp("https://itunes.apple.com/search?media=music&entity=song&limit=10&term=" + encodeURIComponent(m.artist + " " + title), "callback");
      const hit = ((r && r.results) || []).find((x) => ok(x.artistName) && x.artworkUrl100);
      if (hit) return hit.artworkUrl100.replace(/\/\d+x\d+bb\./, "/600x600bb.");
    } catch (e) {}
    try {
      const r = await mnJsonp("https://api.deezer.com/search?output=jsonp&limit=10&q=" + encodeURIComponent(`artist:"${m.artist}" track:"${title}"`), "callback");
      const hit = ((r && r.data) || []).find((x) => x.artist && ok(x.artist.name) && x.album && (x.album.cover_xl || x.album.cover_big));
      if (hit) return hit.album.cover_xl || hit.album.cover_big;
    } catch (e) {}
    return "";
  }
  _pic(st) {
    const a = st ? st.attributes : {};
    const pic = this._url(a.entity_picture_local || a.entity_picture);
    const c = this._cover;
    if (c.url && c.picOk === false) return c.url;
    if (pic) return pic;
    const s = st && this._stationMatch(a);
    return (s && s.favicon) || "";
  }

  /* ------------------------------- update ------------------------------- */
  _update() {
    if (!this._hass || !this._config) return;
    const st = this._st(), a = st ? st.attributes : {};
    const raw = this._url(a.entity_picture_local || a.entity_picture);
    if (st) this._checkCover(st, raw);
    const sig = [this._entityId(), st && st.state, a.media_title, a.media_artist, raw, a.media_content_id, a.shuffle, a.repeat,
      a.is_volume_muted, Math.round((a.volume_level || 0) * 100), this._view, this._open, this._cover.url, this._cover.picOk,
      this._view === "pick" ? this._players().map((k) => k + this._hass.states[k].state).join() : "", a.friendly_name].join("|");
    if (sig === this._sig) return;
    if (Date.now() - this._volHold < 700) { clearTimeout(this._rt); this._rt = setTimeout(() => this._update(), 750); return; }
    this._sig = sig; this._render();
  }
  _tick() {
    const st = this._st(); if (!st) return;
    const bar = this._root.querySelector(".bar"), tc = this._root.querySelector(".tc"), td = this._root.querySelector(".td");
    if (!bar) return;
    const p = this._pos(st), d = st.attributes.media_duration;
    if (p != null && d) { bar.style.width = Math.min(100, (p / d) * 100) + "%"; if (tc) tc.textContent = mnTime(p); if (td) td.textContent = mnTime(d); }
  }

  /* -------------------------------- render ------------------------------- */
  _render() {
    const compact = this._config.mode === "compact";
    const st = this._st();
    const pic = this._pic(st);
    const bg = pic ? `<div class="bg" style="background-image:url(&quot;${mnEsc(pic)}&quot;)"></div>` : `<div class="bg none"></div>`;
    let html;
    if (compact && !this._open) {
      html = `<div class="card mincard">${bg}${this._miniHTML(st, pic)}</div>`;
    } else {
      html = `<div class="card ${compact ? "fixed" : ""}" style="${!compact && this._config.height ? "height:" + mnEsc(this._config.height) + "px" : ""}">${bg}<div class="in">${this._topHTML(st, compact)}<div class="main">${this._viewHTML(st, pic)}</div></div></div>`;
    }
    // keep typing focus (radio search) across re-renders
    const ae = this._root.activeElement;
    const keep = ae && ae.id ? { id: ae.id, s: ae.selectionStart, e: ae.selectionEnd } : null;
    const scr = {}; this._root.querySelectorAll("[data-scroll]").forEach((el) => { scr[el.getAttribute("data-scroll")] = el.scrollTop; });
    this._root.innerHTML = `<style>${MN_CSS}</style>${html}`;
    this._root.querySelectorAll("[data-scroll]").forEach((el) => { const v = scr[el.getAttribute("data-scroll")]; if (v) el.scrollTop = v; });
    if (keep) { const el = this._root.getElementById(keep.id); if (el) { el.focus(); try { el.setSelectionRange(keep.s, keep.e); } catch (e) {} } }
    this._bind();
    this._tick();
  }
  _miniHTML(st, pic) {
    if (!st) return `<div class="mini"><button class="m" data-a="open"><div class="title">Music Nest</div><div class="artist">Tap to choose a speaker</div></button></div>`;
    const m = this._meta(st), playing = st.state === "playing";
    const title = m.title || (m.station && m.station.name) || (playing ? "Playing" : "Nothing playing");
    return `<div class="mini"><button class="c" data-a="open">${mnIcon("note", 28)}${mnImg(pic)}</button>
      <button class="m" data-a="open"><div class="title">${mnEsc(title)}</div><div class="artist">${mnEsc(m.artist || (m.station && m.title ? m.station.name : "") || st.attributes.friendly_name || "")}</div></button>
      <button class="cb" data-a="prev">${mnIcon("prev")}</button><button class="cb big" data-a="pp">${mnIcon(playing ? "pause" : "play", 28)}</button><button class="cb" data-a="next">${mnIcon("next")}</button></div>`;
  }
  _topHTML(st, overlay) {
    const name = st ? (st.attributes.friendly_name || this._entityId()) : "Choose speaker";
    const shortcuts = this._config.shortcuts || [];
    const t = this._view === "pick" ? "" : this._tab;
    const tabs = `<button class="tab ${t === "now" ? "on" : ""}" data-a="tab-now">Now playing</button>
      <button class="tab ${t === "lib" ? "on" : ""}" data-a="tab-lib">Library</button>
      <button class="tab ${t === "radio" ? "on" : ""}" data-a="tab-radio">Radio</button>` +
      shortcuts.map((s, i) => `<button class="tab ${t === "sc" + i ? "on" : ""}" data-a="sc:${i}">${mnEsc(s.name)}</button>`).join("");
    return `<div class="top">${tabs}<div class="sp"></div><button class="chip" data-a="pick">${mnIcon("cast", 20)}<span>${mnEsc(name)}</span></button>${overlay ? `<button class="xbtn" data-a="close">${mnIcon("close")}</button>` : ""}</div>`;
  }
  _viewHTML(st, pic) {
    if (this._view === "pick" || !st) return this._pickHTML();
    if (this._view === "lib") return this._libHTML();
    if (this._view === "radio") return this._radioHTML();
    if (this._view === "browse") return this._browseHTML();
    const a = st.attributes, playing = st.state === "playing";
    const unavailable = st.state === "unavailable";
    const vol = Math.round((a.volume_level || 0) * 100), rep = a.repeat || "off";
    const m = this._meta(st);
    const title = unavailable ? "Speaker unavailable" : (m.title || (m.station && m.station.name) || "Nothing playing");
    const sub = (!m.title && !m.station) ? "Open Library or Radio to start" : (m.artist || (m.station && m.title ? m.station.name : "") || m.album || "");
    return `<div class="now"><div class="cover">${mnIcon(m.station ? "radio" : "note", 90)}${mnImg(pic)}</div>
      <div class="rt"><div class="meta"><div class="title">${mnEsc(title)}</div><div class="artist">${mnEsc(sub)}</div></div>
      <div class="side"><div class="prog" style="${a.media_duration ? "" : "visibility:hidden"}"><span class="tc">0:00</span><div class="track"><div class="bar"></div></div><span class="td">0:00</span></div>
      <div class="ctrl"><button class="cb ${a.shuffle ? "on" : ""}" data-a="shuffle">${mnIcon("shuffle")}</button><button class="cb" data-a="prev">${mnIcon("prev", 28)}</button>
      <button class="cb big" data-a="pp">${mnIcon(playing ? "pause" : "play", 42)}</button><button class="cb" data-a="next">${mnIcon("next", 28)}</button>
      <button class="cb rep1 ${rep !== "off" ? "on" : ""}" data-a="repeat">${mnIcon("repeat")}${rep === "one" ? "<b>1</b>" : ""}</button></div>
      <div class="vol"><button data-a="mute">${mnIcon(a.is_volume_muted ? "mute" : "vol")}</button><input type="range" min="0" max="100" value="${vol}" data-a="vol"></div></div></div></div>`;
  }
  _pickHTML() {
    const st = (this._hass && this._hass.states) || {}, cur = this._entityId();
    const ps = this._players();
    const anyMA = ps.some((id) => this._isMA(id));
    const rows = ps.map((id) => {
      const pn = this._platformName(id), ma = this._isMA(id);
      return `<button class="row ${id === cur ? "sel" : ""}" data-a="choose:${mnEsc(id)}">${mnIcon("cast", 26)}<div class="n">${mnEsc(st[id].attributes.friendly_name || id)}${pn ? `<span class="badge ${ma ? "ma" : ""}">${mnEsc(pn)}</span>` : ""}<div class="s">${mnEsc(id)} · ${mnEsc(st[id].state)}</div></div>${id === cur ? mnIcon("check") : ""}</button>`;
    }).join("");
    const tip = anyMA ? "Speakers marked <b>Music Assistant</b> show your music library (Plex and more)." : "Pick the Chromecast (or any speaker).";
    return `<div class="pick" data-scroll="pick"><h2>Where should the music play?</h2><p>${tip} The choice is remembered on this tablet.</p>${rows || '<div class="msg">No media players found in Home Assistant.<br>Add your Chromecast first (Settings → Devices &amp; services).</div>'}</div>`;
  }

  /* ----------------------------- library home ---------------------------- */
  _libHTML() {
    const L = this._lib;
    if (!L || L.state === "loading") return `<div class="home"><div class="msg">Loading…</div></div>`;
    const tiles = [["playlists", "Playlists", "playlist"], ["artists", "Artists", "artist"], ["albums", "Albums", "album"], ["tracks", "Songs", "note"]]
      .map(([k, label, ic]) => `<button class="ht ${L.map[k] ? "" : "off"}" data-a="lib:${k}">${mnIcon(ic, 64)}<span>${label}</span></button>`).join("")
      + `<button class="ht" data-a="tab-radio">${mnIcon("radio", 64)}<span>Radio</span></button>`;
    let note = "";
    if (L.state === "err") note = `<div class="hnote">${mnEsc(L.err)}</div>`;
    else if (!Object.keys(L.map).length) note = `<div class="hnote">This speaker does not show a music library. Choose a speaker marked <b>Music Assistant</b> to see your Plex music here.</div>`;
    const btns = (L.state === "err" || !Object.keys(L.map).length)
      ? `<div class="hbtns"><button class="pill acc" data-a="pick">${mnIcon("cast", 18)} Choose speaker</button><button class="pill" data-a="lib:all">${mnIcon("folder", 18)} Browse all sources</button></div>` : "";
    return `<div class="home"><div class="hgrid">${tiles}</div>${note}${btns}</div>`;
  }
  async _libLoad() {
    const eid = this._browseId();
    if (this._lib && this._lib.eid === eid && this._lib.state === "ok") return;
    this._lib = { eid, state: "loading", map: {}, err: "" }; this._refresh();
    const L = this._lib;
    const KEYS = { playlists: /^playlists?$/, artists: /^artists?$/, albums: /^albums?$/, tracks: /^(tracks?|songs?)$/ };
    const scan = (children) => (children || []).forEach((c) => {
      const cand = [mnNorm(String(c.media_content_id || "").split(/[/:]/).pop()), mnNorm(c.title)];
      for (const k in KEYS) if (!L.map[k] && cand.some((x) => KEYS[k].test(x))) L.map[k] = { id: c.media_content_id, type: c.media_content_type, title: c.title };
    });
    try {
      const root = await this._ws(eid, null);
      scan(root.children);
      if (!Object.keys(L.map).length) {          // the library may sit one level deeper ("Music Assistant" folder)
        const ma = (root.children || []).find((c) => /music assistant/i.test(c.title || "") && c.can_expand);
        if (ma) scan((await this._ws(eid, { id: ma.media_content_id, type: ma.media_content_type })).children);
      }
      L.state = "ok";
    } catch (e) { L.state = "err"; L.err = this._errText(eid, e); }
    if (this._lib === L) this._refresh();
  }
  _ws(eid, node) {
    const msg = { type: "media_player/browse_media", entity_id: eid };
    if (node && node.id) msg.media_content_id = node.id;
    if (node && node.type) msg.media_content_type = node.type;
    return this._hass.callWS(msg);
  }
  _errText(eid, e) {
    const be = this._config.browse_entity;
    let t = `Could not open the list on “${this._friendly(eid)}” (${eid}): ${(e && e.message) || "this speaker does not support browsing"}.`;
    if (be && !this._hass.states[be]) t += ` The card setting browse_entity points to ${be}, which does not exist, so the chosen speaker was used instead.`;
    if (!this._isMA(eid)) t += " Tip: choose a speaker marked “Music Assistant”.";
    return t;
  }

  /* -------------------------------- browse -------------------------------- */
  _browseHTML() {
    const n = this._node, crumbs = this._stack;
    const head = `<div class="crumb"><button class="xbtn" data-a="back">${mnIcon("back")}</button><div class="t">${mnEsc((n && n.title) || (crumbs.length ? crumbs[crumbs.length - 1].title : ""))}</div>${n && n.can_play ? `<button class="pill acc" data-a="playall">${mnIcon("play", 20)} Play</button>` : ""}</div>`;
    let body;
    if (this._loading) body = `<div class="msg">Loading…</div>`;
    else if (this._err) body = `<div class="msg">${mnEsc(this._err)}</div>`;
    else if (!this._items.length) body = `<div class="msg">Nothing here.</div>`;
    else {
      const tracks = this._items.filter((it) => it.media_class === "track" || (!it.can_expand && it.can_play)).length;
      const asList = tracks > this._items.length / 2;
      const key = "b" + crumbs.length;
      if (asList) {
        body = `<div class="list" data-scroll="${key}">${this._items.map((it, i) => {
          const th = this._thumb(it.thumbnail);
          const ic = it.can_expand ? "folder" : (/radio|channel/.test(it.media_class || "") ? "radio" : "note");
          return `<button class="lrow" data-a="tile:${i}"><div class="th">${mnIcon(ic, 26)}${mnImg(th)}</div><div class="tt"><div class="a">${mnEsc(it.title)}</div></div>${it.can_play ? mnIcon("play", 22) : ""}</button>`;
        }).join("")}</div>`;
      } else {
        body = `<div class="grid" data-scroll="${key}">${this._items.map((it, i) => {
          const th = this._thumb(it.thumbnail);
          const mc = it.media_class || "";
          const ic = mc === "artist" ? "artist" : mc === "album" ? "album" : mc === "playlist" ? "playlist" : /radio|channel/.test(mc) ? "radio" : it.can_expand ? "folder" : "note";
          return `<div class="tile ${mc === "artist" ? "round" : ""}"><button data-a="tile:${i}"><div class="im">${mnIcon(ic, 44)}${mnImg(th)}</div><div class="tx">${mnEsc(it.title)}</div></button>${it.can_play && it.can_expand ? `<button class="pl" data-a="tileplay:${i}">${mnIcon("play", 22)}</button>` : ""}</div>`;
        }).join("")}</div>`;
      }
    }
    return `<div class="browse">${head}${body}</div>`;
  }

  /* --------------------------------- radio -------------------------------- */
  _country() {
    if (this._radioCountry !== undefined) return this._radioCountry;
    let c = mnLoad(MN_KEY_COUNTRY, "") || this._config.radio_country || "";
    if (!c) { const m = /[-_]([A-Za-z]{2})$/.exec(navigator.language || ""); c = m ? m[1] : ""; }
    this._radioCountry = c.toUpperCase();
    return this._radioCountry;
  }
  _radioHTML() {
    const R = this._radio, c = this._country();
    const cs = this._countries || [];
    const opts = `<option value="">Country…</option>` + cs.map((x) => `<option value="${mnEsc(x.code)}" ${x.code === c ? "selected" : ""}>${mnEsc(x.name)}</option>`).join("")
      + (c && !cs.some((x) => x.code === c) ? `<option value="${mnEsc(c)}" selected>${mnEsc(c)}</option>` : "");
    const chip = (a, label, on, ic) => `<button class="pill ${on ? "on" : ""}" data-a="${a}">${ic ? mnIcon(ic, 18) : ""}${mnEsc(label)}</button>`;
    const chips = chip("rmode:popular", "Popular", R.mode === "popular") +
      (c ? chip("rmode:country", (cs.find((x) => x.code === c) || { name: c }).name, R.mode === "country") : "") +
      chip("rmode:recent", "Recent", R.mode === "recent", "recent") +
      MN_GENRES.map((g) => chip("rtag:" + g, g[0].toUpperCase() + g.slice(1), R.mode === "tag" && R.key === g)).join("");
    const bar = `<div class="rbar"><input id="rq" class="q" type="search" enterkeyhint="search" placeholder="Search radio stations" value="${mnEsc(this._rq)}" data-a="rq"><button class="pill acc" data-a="rsearch">${mnIcon("search", 18)} Search</button><select class="sel" data-a="rc">${opts}</select></div><div class="chips">${chips}</div>`;
    let body;
    if (R.loading) body = `<div class="msg">Loading stations…</div>`;
    else if (R.err) body = `<div class="msg">${mnEsc(R.err)}</div>`;
    else if (!R.items.length) body = `<div class="msg">${R.mode === "recent" ? "No recent stations yet." : "No stations found."}</div>`;
    else {
      const cur = this._station(), st = this._st(), playingId = cur && st && this._stationMatch(st.attributes) ? cur.stationuuid : "";
      body = `<div class="list" data-scroll="radio">${R.items.map((s, i) => {
        const tags = String(s.tags || "").split(",").filter(Boolean).slice(0, 3).join(", ");
        const info = [s.country, tags, s.bitrate ? s.bitrate + " kbps" : ""].filter(Boolean).join(" · ");
        return `<button class="lrow ${s.stationuuid && s.stationuuid === playingId ? "sel" : ""}" data-a="rplay:${i}"><div class="th">${mnIcon("radio", 26)}${mnImg(s.favicon)}</div><div class="tt"><div class="a">${mnEsc(String(s.name || "").trim())}</div><div class="b">${mnEsc(info)}</div></div>${mnIcon("play", 22)}</button>`;
      }).join("")}</div>`;
    }
    return `<div class="browse">${bar}${body}</div>`;
  }
  async _rb(path) {
    let last;
    for (let n = 0; n < MN_RB_SERVERS.length; n++) {
      const i = (this._rbBase + n) % MN_RB_SERVERS.length;
      const ctl = typeof AbortController !== "undefined" ? new AbortController() : null;
      const t = setTimeout(() => ctl && ctl.abort(), 8000);
      try {
        const r = await fetch(MN_RB_SERVERS[i] + path, { signal: ctl ? ctl.signal : undefined });
        clearTimeout(t);
        if (!r.ok) throw new Error("HTTP " + r.status);
        this._rbBase = i;
        return await r.json();
      } catch (e) { clearTimeout(t); last = e; }
    }
    throw last || new Error("offline");
  }
  _radioOpen() {
    if (!this._countries) {
      this._countries = [];
      this._rb("/json/countries?hidebroken=true").then((list) => {
        const m = {};
        (list || []).forEach((x) => { const code = (x.iso_3166_1 || "").toUpperCase(); if (code && x.stationcount >= 10) m[code] = { code, name: x.name, n: (m[code] ? m[code].n : 0) + x.stationcount }; });
        this._countries = Object.values(m).sort((a, b) => a.name.localeCompare(b.name));
        if (this._view === "radio") this._refresh();
      }).catch(() => { this._countries = null; });
    }
    if (!this._radio.mode) return this._radioLoad(this._country() ? "country" : "popular", "");
    this._refresh();
  }
  async _radioLoad(mode, key) {
    const R = this._radio; R.mode = mode; R.key = key; R.err = ""; R.items = [];
    if (mode === "recent") { R.items = mnLoad(MN_KEY_RECENT, []); R.loading = false; return this._refresh(); }
    const base = "/json/stations/search?hidebroken=true&order=clickcount&reverse=true&limit=80";
    let q = "";
    if (mode === "country") q = "&countrycode=" + encodeURIComponent(this._country());
    else if (mode === "tag") q = "&tag=" + encodeURIComponent(key);
    else if (mode === "search") q = "&name=" + encodeURIComponent(key);
    R.loading = true; this._refresh();
    const ticket = (this._rTicket = (this._rTicket || 0) + 1);
    try {
      const items = await this._rb(base + q);
      if (ticket !== this._rTicket) return;
      const seen = {};
      R.items = (items || []).filter((s) => (s.url_resolved || s.url) && !seen[mnNorm(s.name)] && (seen[mnNorm(s.name)] = 1));
    } catch (e) {
      if (ticket !== this._rTicket) return;
      R.err = "Could not reach Radio Browser (" + ((e && e.message) || "network") + "). Check the tablet's internet connection and try again.";
    }
    R.loading = false; this._refresh();
  }
  _radioPlay(s) {
    if (!s) return;
    const url = s.url_resolved || s.url;
    const station = { stationuuid: s.stationuuid, name: String(s.name || "").trim(), favicon: s.favicon || "", url: url, url_resolved: s.url_resolved || "", country: s.country || "", tags: s.tags || "", bitrate: s.bitrate || 0, codec: s.codec || "" };
    mnSave(MN_KEY_STATION, station);
    const rec = mnLoad(MN_KEY_RECENT, []).filter((x) => x.stationuuid !== station.stationuuid);
    rec.unshift(station); mnSave(MN_KEY_RECENT, rec.slice(0, 30));
    if (s.stationuuid) this._rb("/json/url/" + encodeURIComponent(s.stationuuid)).catch(() => {});   // counts the click, as Radio Browser asks
    let type = "music";
    if (this._platform(this._entityId()) === "cast") {
      const c = String(s.codec || "").toUpperCase();
      type = c === "MP3" ? "audio/mpeg" : /AAC/.test(c) ? "audio/aac" : c === "OGG" ? "audio/ogg" : "music";
    }
    this._call("play_media", { media_content_id: url, media_content_type: type });
    this._tab = "now"; this._view = "now"; this._refresh();
  }

  /* ------------------------------ events -------------------------------- */
  _bind() {
    const r = this._root;
    r.querySelectorAll("[data-a]").forEach((el) => {
      const a = el.getAttribute("data-a");
      if (a === "vol") {
        el.addEventListener("input", () => { this._volHold = Date.now(); clearTimeout(this._vt); this._vt = setTimeout(() => this._call("volume_set", { volume_level: el.value / 100 }), 120); });
        return;
      }
      if (a === "rq") {
        el.addEventListener("input", () => { this._rq = el.value; });
        el.addEventListener("keydown", (ev) => { if (ev.key === "Enter") { ev.preventDefault(); el.blur(); this._act("rsearch"); } });
        return;
      }
      if (a === "rc") {
        el.addEventListener("change", () => { this._radioCountry = el.value.toUpperCase(); mnSave(MN_KEY_COUNTRY, this._radioCountry); this._radioLoad(this._radioCountry ? "country" : "popular", ""); });
        return;
      }
      el.addEventListener("click", (ev) => { ev.stopPropagation(); this._act(a); });
    });
  }
  _act(a) {
    const st = this._st();
    if (a === "pp") return this._call("media_play_pause");
    if (a === "next") return this._call("media_next_track");
    if (a === "prev") return this._call("media_previous_track");
    if (a === "shuffle") return this._call("shuffle_set", { shuffle: !(st && st.attributes.shuffle) });
    if (a === "repeat") { const c = (st && st.attributes.repeat) || "off"; return this._call("repeat_set", { repeat: c === "off" ? "all" : c === "all" ? "one" : "off" }); }
    if (a === "mute") return this._call("volume_mute", { is_volume_muted: !(st && st.attributes.is_volume_muted) });
    if (a === "open") { this._open = true; this._view = this._entityId() ? "now" : "pick"; this._tab = "now"; return this._refresh(); }
    if (a === "close") { this._open = false; return this._refresh(); }
    if (a === "tab-now") { this._view = "now"; this._tab = "now"; return this._refresh(); }
    if (a === "pick") { this._view = "pick"; return this._refresh(); }
    if (a === "tab-lib") { this._view = "lib"; this._tab = "lib"; this._libLoad(); return this._refresh(); }
    if (a === "tab-radio") { this._view = "radio"; this._tab = "radio"; return this._radioOpen(); }
    if (a === "lib:all") { this._origin = "lib"; return this._startBrowse({ title: "All sources" }); }
    if (a.startsWith("lib:")) {
      const t = this._lib && this._lib.map[a.slice(4)];
      if (!t) return;
      this._origin = "lib"; return this._startBrowse({ id: t.id, type: t.type, title: { tracks: "Songs" }[a.slice(4)] || t.title });
    }
    if (a.startsWith("sc:")) { const i = +a.slice(3), s = (this._config.shortcuts || [])[i]; if (!s) return; this._tab = "sc" + i; this._origin = "now"; return this._startBrowse({ id: s.media_content_id, type: s.media_content_type || undefined, title: s.name }); }
    if (a.startsWith("choose:")) {
      const id = a.slice(7);
      try { localStorage.setItem(MN_KEY, id); } catch (e) {}
      this._lib = null; this._view = "now"; this._tab = "now"; return this._refresh();
    }
    if (a === "back") {
      if (this._stack.length <= 1) { this._view = this._origin; this._tab = this._origin === "lib" ? "lib" : "now"; if (this._origin === "lib") this._libLoad(); return this._refresh(); }
      this._stack.pop(); const t = this._stack.pop(); return this._browse(t);
    }
    if (a === "playall") return this._play(this._node);
    if (a.startsWith("tile:")) { const it = this._items[+a.slice(5)]; if (!it) return; if (it.can_expand) return this._browse({ id: it.media_content_id, type: it.media_content_type, title: it.title }); return this._play(it); }
    if (a.startsWith("tileplay:")) return this._play(this._items[+a.slice(9)]);
    if (a === "rsearch") { const q = this._rq.trim(); return q ? this._radioLoad("search", q) : this._radioLoad("popular", ""); }
    if (a.startsWith("rmode:")) return this._radioLoad(a.slice(6), "");
    if (a.startsWith("rtag:")) return this._radioLoad("tag", a.slice(5));
    if (a.startsWith("rplay:")) return this._radioPlay(this._radio.items[+a.slice(6)]);
  }
  _refresh() { this._volHold = 0; this._sig = ""; this._update(); }
  _startBrowse(root) { this._stack = []; this._view = "browse"; return this._browse(root); }
  async _browse(node) {
    this._view = "browse"; this._loading = true; this._err = ""; this._items = []; this._node = null; this._refresh();
    this._stack.push({ id: node.id, type: node.type, title: node.title });
    const eid = this._browseId();
    try {
      const res = await this._ws(eid, node);
      this._node = Object.assign({}, res, { title: node.title || res.title }); this._items = res.children || [];
    } catch (e) {
      this._node = null; this._err = this._errText(eid, e);
    }
    this._loading = false; this._refresh();
  }
  _play(item) {
    if (!item) return;
    this._call("play_media", { media_content_id: item.media_content_id, media_content_type: item.media_content_type || "music" });
    this._view = "now"; this._tab = "now"; this._refresh();
  }
}
if (!customElements.get("music-nest-card")) customElements.define("music-nest-card", MusicNestCard);
window.customCards = window.customCards || [];
window.customCards.push({ type: "music-nest-card", name: "Music Nest", description: "Music and radio player for wall tablets (Chromecast, Music Assistant, Plex, Radio Browser)", preview: false });
console.info("%c MUSIC NEST CARD %c v" + MN_VERSION, "background:#ff8a2a;color:#000;font-weight:700", "background:#222;color:#fff");
