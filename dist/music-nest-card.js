/*!
 * Music Nest Card for Home Assistant — version 0.1.0
 * One file, no libraries, no cloud. Works with any media_player (e.g. Chromecast).
 */
const MN_VERSION = "0.1.0";
const MN_KEY = "music-nest-card.entity";

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
  check: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
};
const mnIcon = (n, s = 24) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="currentColor"><path d="${MN_ICONS[n]}"/></svg>`;
const mnEsc = (t) => String(t == null ? "" : t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const mnTime = (s) => { s = Math.max(0, Math.round(s || 0)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };

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
.tab { padding:10px 16px; border-radius:22px; font-weight:600; font-size:15px; opacity:.75; background:rgba(255,255,255,.07); }
.tab.on { opacity:1; background:#ff8a2a; color:#1b0e00; }
.sp { flex:1; }
.chip { display:flex; align-items:center; gap:8px; padding:9px 14px; border-radius:22px; background:rgba(255,255,255,.1); font-size:14px; max-width:42%; }
.chip span { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.xbtn { width:42px; height:42px; border-radius:50%; background:rgba(255,255,255,.12); display:grid; place-items:center; }
.main { flex:1 1 auto; min-height:0; display:flex; }
/* now playing */
.now { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; min-height:0; width:100%; }
.cover { width:min(100%, 46vh, 420px); aspect-ratio:1; border-radius:22px; background:#241a2e center/cover; box-shadow:0 18px 50px rgba(0,0,0,.55); display:grid; place-items:center; color:rgba(255,255,255,.35); flex:0 1 auto; min-height:0; }
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
.cb.dim { opacity:.35; }
.rep1 { position:relative; } .rep1 b { position:absolute; font-size:11px; right:15px; top:15px; }
.vol { display:flex; align-items:center; gap:12px; }
.vol input { flex:1; accent-color:#ff8a2a; height:34px; }
.vol button { width:44px; height:44px; display:grid; place-items:center; }
/* browse */
.browse { flex:1; display:flex; flex-direction:column; gap:10px; min-height:0; width:100%; }
.crumb { display:flex; align-items:center; gap:10px; flex:0 0 auto; }
.crumb .t { font-size:19px; font-weight:700; flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.pill { padding:9px 16px; border-radius:20px; background:rgba(255,255,255,.12); font-weight:600; font-size:14px; display:flex; align-items:center; gap:6px; }
.pill.acc { background:#ff8a2a; color:#1b0e00; }
.grid { flex:1; overflow:auto; display:grid; grid-template-columns:repeat(auto-fill, minmax(132px, 1fr)); gap:12px; align-content:start; padding-bottom:8px; }
.tile { position:relative; text-align:left; border-radius:16px; background:rgba(255,255,255,.07); overflow:hidden; display:flex; flex-direction:column; }
.tile .im { aspect-ratio:1; background:rgba(255,255,255,.06) center/cover; display:grid; place-items:center; color:rgba(255,255,255,.45); }
.tile .tx { padding:8px 10px 10px; font-size:14px; font-weight:600; line-height:1.2; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; min-height:46px; }
.tile .pl { position:absolute; right:8px; top:8px; width:38px; height:38px; border-radius:50%; background:#ff8a2a; color:#1b0e00; display:grid; place-items:center; box-shadow:0 4px 12px rgba(0,0,0,.4); }
.msg { margin:auto; text-align:center; opacity:.8; max-width:420px; line-height:1.45; padding:20px; }
/* pick */
.pick { flex:1; overflow:auto; width:100%; max-width:640px; margin:0 auto; display:flex; flex-direction:column; gap:10px; }
.pick h2 { margin:6px 0 2px; font-size:22px; } .pick p { margin:0 0 6px; opacity:.75; font-size:14px; }
.row { display:flex; align-items:center; gap:14px; padding:14px 16px; border-radius:16px; background:rgba(255,255,255,.08); text-align:left; }
.row.sel { outline:2px solid #ff8a2a; } .row .n { flex:1; font-weight:600; } .row .s { font-size:12px; opacity:.65; }
/* compact */
.mini { display:flex; align-items:center; gap:12px; padding:10px 12px; position:relative; z-index:1; }
.mini .c { width:60px; height:60px; border-radius:12px; background:#241a2e center/cover; flex:0 0 auto; display:grid; place-items:center; color:rgba(255,255,255,.4); }
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
}
}
.now .rt { display:contents; }
@media (orientation:landscape) { @container (min-width:700px) { .now .rt { display:flex; } } }
`;

class MusicNestCard extends HTMLElement {
  constructor() {
    super();
    this._root = this.attachShadow({ mode: "open" });
    this._view = "now"; this._stack = []; this._items = []; this._node = null;
    this._loading = false; this._err = ""; this._sig = ""; this._open = false; this._volHold = 0;
  }
  static getStubConfig() { return { type: "custom:music-nest-card" }; }
  setConfig(config) {
    this._config = Object.assign({ mode: "full" }, config || {});
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
  _players() {
    const st = (this._hass && this._hass.states) || {};
    return Object.keys(st).filter((k) => k.startsWith("media_player.")).sort((a, b) =>
      (st[a].attributes.friendly_name || a).localeCompare(st[b].attributes.friendly_name || b));
  }
  _st() { const id = this._entityId(); return id && this._hass && this._hass.states[id] ? this._hass.states[id] : null; }
  _url(u) { if (!u) return ""; return this._hass && this._hass.hassUrl && u.startsWith("/") ? this._hass.hassUrl(u) : u; }
  _call(service, data) {
    return this._hass.callService("media_player", service, Object.assign({ entity_id: this._entityId() }, data || {}));
  }
  _pos(st) {
    const a = st.attributes; if (a.media_position == null) return null;
    let p = a.media_position;
    if (st.state === "playing" && a.media_position_updated_at) p += (Date.now() - new Date(a.media_position_updated_at).getTime()) / 1000;
    return Math.min(p, a.media_duration || p);
  }

  /* ------------------------------- update ------------------------------- */
  _update() {
    if (!this._hass || !this._config) return;
    const st = this._st(), a = st ? st.attributes : {};
    const sig = [this._entityId(), st && st.state, a.media_title, a.media_artist, a.entity_picture, a.shuffle, a.repeat,
      a.is_volume_muted, Math.round((a.volume_level || 0) * 100), this._view, this._open, this._loading, this._err,
      this._node && this._node.media_content_id, this._view === "pick" ? this._players().join() : "", a.friendly_name].join("|");
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
    const a = st ? st.attributes : {};
    const pic = this._url(a.entity_picture_local || a.entity_picture);
    const bg = pic ? `<div class="bg" style="background-image:url(&quot;${mnEsc(pic)}&quot;)"></div>` : `<div class="bg none"></div>`;
    let html;
    if (compact && !this._open) {
      html = `<div class="card mincard">${bg}${this._miniHTML(st, pic)}</div>`;
    } else {
      html = `<div class="card ${compact ? "fixed" : ""}" style="${!compact && this._config.height ? "height:" + mnEsc(this._config.height) + "px" : ""}">${bg}<div class="in">${this._topHTML(st, compact)}<div class="main">${this._viewHTML(st, pic)}</div></div></div>`;
    }
    this._root.innerHTML = `<style>${MN_CSS}</style>${html}`;
    this._bind();
    this._tick();
  }
  _miniHTML(st, pic) {
    if (!st) return `<div class="mini"><button class="m" data-a="open"><div class="title">Music Nest</div><div class="artist">Tap to choose a speaker</div></button></div>`;
    const a = st.attributes, playing = st.state === "playing";
    return `<div class="mini"><button class="c" data-a="open" style="${pic ? "background-image:url(&quot;" + mnEsc(pic) + "&quot;)" : ""}">${pic ? "" : mnIcon("note", 28)}</button>
      <button class="m" data-a="open"><div class="title">${mnEsc(a.media_title || (playing ? "Playing" : "Nothing playing"))}</div><div class="artist">${mnEsc(a.media_artist || a.friendly_name || "")}</div></button>
      <button class="cb" data-a="prev">${mnIcon("prev")}</button><button class="cb big" data-a="pp">${mnIcon(playing ? "pause" : "play", 28)}</button><button class="cb" data-a="next">${mnIcon("next")}</button></div>`;
  }
  _topHTML(st, overlay) {
    const name = st ? (st.attributes.friendly_name || this._entityId()) : "Choose speaker";
    const shortcuts = this._shortcuts();
    const tabs = `<button class="tab ${this._view === "now" ? "on" : ""}" data-a="tab-now">Now playing</button>
      <button class="tab ${this._view === "browse" && this._tab === "lib" ? "on" : ""}" data-a="tab-lib">Library</button>` +
      shortcuts.map((s, i) => `<button class="tab ${this._view === "browse" && this._tab === "sc" + i ? "on" : ""}" data-a="sc:${i}">${mnEsc(s.name)}</button>`).join("");
    return `<div class="top">${tabs}<div class="sp"></div><button class="chip" data-a="pick">${mnIcon("cast", 20)}<span>${mnEsc(name)}</span></button>${overlay ? `<button class="xbtn" data-a="close">${mnIcon("close")}</button>` : ""}</div>`;
  }
  _shortcuts() {
    const d = [{ name: "Radio", media_content_id: "media-source://radio_browser", media_content_type: "" }];
    return (this._config.shortcuts && this._config.shortcuts.length) ? this._config.shortcuts : d;
  }
  _viewHTML(st, pic) {
    if (this._view === "pick" || !st) return this._pickHTML();
    if (this._view === "browse") return this._browseHTML();
    const a = st.attributes, playing = st.state === "playing";
    const unavailable = st.state === "unavailable";
    const vol = Math.round((a.volume_level || 0) * 100), rep = a.repeat || "off";
    const idle = !a.media_title;
    return `<div class="now"><div class="cover" style="${pic ? "background-image:url(&quot;" + mnEsc(pic) + "&quot;)" : ""}">${pic ? "" : mnIcon("note", 90)}</div>
      <div class="rt"><div class="meta"><div class="title">${mnEsc(unavailable ? "Speaker unavailable" : (a.media_title || "Nothing playing"))}</div><div class="artist">${mnEsc(idle ? "Open Library or Radio to start" : (a.media_artist || a.media_album_name || ""))}</div></div>
      <div class="side"><div class="prog"><span class="tc">0:00</span><div class="track"><div class="bar"></div></div><span class="td">0:00</span></div>
      <div class="ctrl"><button class="cb ${a.shuffle ? "on" : ""}" data-a="shuffle">${mnIcon("shuffle")}</button><button class="cb" data-a="prev">${mnIcon("prev", 28)}</button>
      <button class="cb big" data-a="pp">${mnIcon(playing ? "pause" : "play", 42)}</button><button class="cb" data-a="next">${mnIcon("next", 28)}</button>
      <button class="cb rep1 ${rep !== "off" ? "on" : ""}" data-a="repeat">${mnIcon("repeat")}${rep === "one" ? "<b>1</b>" : ""}</button></div>
      <div class="vol"><button data-a="mute">${mnIcon(a.is_volume_muted ? "mute" : "vol")}</button><input type="range" min="0" max="100" value="${vol}" data-a="vol"></div></div></div></div>`;
  }
  _pickHTML() {
    const st = (this._hass && this._hass.states) || {}, cur = this._entityId();
    const ps = this._players();
    const rows = ps.map((id) => `<button class="row ${id === cur ? "sel" : ""}" data-a="choose:${mnEsc(id)}">${mnIcon("cast", 26)}<div class="n">${mnEsc(st[id].attributes.friendly_name || id)}<div class="s">${mnEsc(id)} · ${mnEsc(st[id].state)}</div></div>${id === cur ? mnIcon("check") : ""}</button>`).join("");
    return `<div class="pick"><h2>Where should the music play?</h2><p>Pick the Chromecast (or any speaker). The choice is remembered on this tablet.</p>${rows || '<div class="msg">No media players found in Home Assistant.<br>Add your Chromecast first (Settings → Devices &amp; services).</div>'}</div>`;
  }
  _browseHTML() {
    const n = this._node, crumbs = this._stack;
    const head = `<div class="crumb">${crumbs.length > 1 ? `<button class="xbtn" data-a="back">${mnIcon("back")}</button>` : ""}<div class="t">${mnEsc((n && n.title) || (crumbs.length ? crumbs[crumbs.length - 1].title : ""))}</div>${n && n.can_play ? `<button class="pill acc" data-a="playall">${mnIcon("play", 20)} Play</button>` : ""}</div>`;
    let body;
    if (this._loading) body = `<div class="msg">Loading…</div>`;
    else if (this._err) body = `<div class="msg">${mnEsc(this._err)}</div>`;
    else if (!this._items.length) body = `<div class="msg">Nothing here.</div>`;
    else body = `<div class="grid">${this._items.map((it, i) => {
      const th = this._url(it.thumbnail);
      const ic = it.media_class === "directory" || it.can_expand ? "folder" : (/radio|channel|app/.test(it.media_class || "") ? "radio" : "note");
      return `<div class="tile"><button data-a="tile:${i}"><div class="im" style="${th ? "background-image:url(&quot;" + mnEsc(th) + "&quot;)" : ""}">${th ? "" : mnIcon(ic, 44)}</div><div class="tx">${mnEsc(it.title)}</div></button>${it.can_play && it.can_expand ? `<button class="pl" data-a="tileplay:${i}">${mnIcon("play", 22)}</button>` : ""}</div>`;
    }).join("")}</div>`;
    return `<div class="browse">${head}${body}</div>`;
  }

  /* ------------------------------ events -------------------------------- */
  _bind() {
    const r = this._root;
    r.querySelectorAll("[data-a]").forEach((el) => {
      if (el.tagName === "INPUT") {
        el.addEventListener("input", () => { this._volHold = Date.now(); clearTimeout(this._vt); this._vt = setTimeout(() => this._call("volume_set", { volume_level: el.value / 100 }), 120); });
        return;
      }
      el.addEventListener("click", (ev) => { ev.stopPropagation(); this._act(el.getAttribute("data-a")); });
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
    if (a === "open") { this._open = true; this._view = this._entityId() ? "now" : "pick"; return this._refresh(); }
    if (a === "close") { this._open = false; return this._refresh(); }
    if (a === "tab-now") { this._view = "now"; return this._refresh(); }
    if (a === "pick") { this._view = "pick"; return this._refresh(); }
    if (a === "tab-lib") { this._tab = "lib"; return this._startBrowse({ id: undefined, type: undefined, title: "Library" }); }
    if (a.startsWith("sc:")) { const i = +a.slice(3), s = this._shortcuts()[i]; this._tab = "sc" + i; return this._startBrowse({ id: s.media_content_id, type: s.media_content_type || undefined, title: s.name }); }
    if (a.startsWith("choose:")) {
      const id = a.slice(7);
      try { localStorage.setItem(MN_KEY, id); } catch (e) {}
      this._view = "now"; return this._refresh();
    }
    if (a === "back") { this._stack.pop(); const t = this._stack[this._stack.length - 1]; this._stack.pop(); return this._browse(t); }
    if (a === "playall") return this._play(this._node);
    if (a.startsWith("tile:")) { const it = this._items[+a.slice(5)]; if (it.can_expand) return this._browse({ id: it.media_content_id, type: it.media_content_type, title: it.title }); return this._play(it); }
    if (a.startsWith("tileplay:")) return this._play(this._items[+a.slice(9)]);
  }
  _refresh() { this._volHold = 0; this._sig = ""; this._update(); }
  _startBrowse(root) { this._stack = []; this._view = "browse"; return this._browse(root); }
  async _browse(node) {
    this._view = "browse"; this._loading = true; this._err = ""; this._items = []; this._refresh();
    this._stack.push({ id: node.id, type: node.type, title: node.title });
    const msg = { type: "media_player/browse_media", entity_id: this._config.browse_entity || this._entityId() };
    if (node.id) msg.media_content_id = node.id;
    if (node.type) msg.media_content_type = node.type;
    try {
      const res = await this._hass.callWS(msg);
      this._node = res; this._items = res.children || [];
      if (!this._items.length && !res.can_play) this._err = "";
    } catch (e) {
      this._node = null; this._err = "Could not open this list: " + ((e && e.message) || "this speaker does not support browsing") + ". Tip: set browse_entity to a Music Assistant player in the card settings.";
    }
    this._loading = false; this._refresh();
  }
  _play(item) {
    if (!item) return;
    this._call("play_media", { media_content_id: item.media_content_id, media_content_type: item.media_content_type || "music" });
    this._view = "now"; this._refresh();
  }
}
if (!customElements.get("music-nest-card")) customElements.define("music-nest-card", MusicNestCard);
window.customCards = window.customCards || [];
window.customCards.push({ type: "music-nest-card", name: "Music Nest", description: "Music and radio player for wall tablets (Chromecast, Plex, radio)", preview: false });
console.info("%c MUSIC NEST CARD %c v" + MN_VERSION, "background:#ff8a2a;color:#000;font-weight:700", "background:#222;color:#fff");
