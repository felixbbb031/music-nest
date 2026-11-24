# Music Nest Card za Home Assistant: uputa (HR), verzija 0.1.1

Sve se radi iz preglednika (računalo ili mobitel u kućnoj mreži). Fizički pristup HA računalu ne treba.

## Prije početka (jednom)
1. **Chromecast** mora biti u HA (Settings → Devices & services; HA ga obično sam pronađe).
2. **Music Assistant** s dodanim **Plexom** (Music Assistant → Settings → Providers → Add → Plex). Tako Library vidi vašu glazbu.
3. Radio ne treba ništa dodatno: kartica sama koristi Radio Browser (tablet mora imati internet).

## Instalacija ili nadogradnja (Marketplace, HA 2026.11 i noviji)
**Nadogradnja s 0.1.0:**
1. Na GitHubu otvorite repozitorij `music-nest` (glavna stranica) → **Add file → Upload files** → povucite **sadržaj** nove mape `music-nest-card` (`dist`, `hacs.json`, `README.md`, `POSTUPAK_HR.md`) → **Commit changes**. Datoteke istog imena GitHub sam zamijeni novima.
2. U HA: Settings → **Marketplace** → Installed → Music Nest Card. Ako ne nudi nadogradnju odmah, tri točkice → **Update information** (osvježi), pa **Update** / **Install**.
3. Osvježite preglednik (Ctrl+F5). U Fully Kiosku: Settings → Advanced Web Settings → **Clear Cache**, pa ponovno učitajte.

**Prva instalacija:**
1. Sadržaj mape `music-nest-card` (ne samu mapu) prenesite u GitHub repozitorij: **uploading an existing file** → povucite `dist`, `hacs.json`, `README.md`, `POSTUPAK_HR.md` → **Commit changes**.
2. HA → Settings → **Marketplace** → **Add from link** → `https://github.com/felixbbb031/music-nest` → Music Nest Card → **Install** → Ctrl+F5.

## Postavljanje ploče (Dashboard)
1. Settings → Dashboards → **Add dashboard** → **New dashboard from scratch** → naziv npr. "Music Nest".
2. Otvorite je → olovka → olovka kod imena prikaza → **View type: Panel (single card)** → Save.
3. **Add card** → **Manual** → `type: custom:music-nest-card` → Save → Done.
4. Dodirnite izbor zvučnika gore desno i odaberite zvučnik s oznakom **Music Assistant**.
5. Fully Kiosk: **Start URL** = adresa te ploče.

## Što je novo u 0.1.1
- **Library**: početna stranica s pet pločica (Playlists, Artists, Albums, Songs, Radio). Kamere, slike i slično su skriveni.
- Prave slike izvođača i albuma u popisima; pjesme se prikazuju kao popis.
- **Radio**: Radio Browser s pretragom po imenu, državi i žanru, te "Recent" (zadnje slušane stanice).
- **Omoti**: ako zvučnik ne pošalje sliku ili je premala (npr. radio), kartica potraži omot na iTunesu, pa na Deezeru.
- Izbor zvučnika pokazuje integraciju (Music Assistant, Chromecast...); Music Assistant zvučnici su na vrhu.
- Bolja poruka o grešci; ako `browse_entity` ne postoji, kartica koristi odabrani zvučnik.

## Problemi
- **Library** su sive pločice: odabran je zvučnik koji nije Music Assistant. Dodirnite "Choose speaker".
- **Radio** javlja da ne može doći do Radio Browsera: provjerite internet na tabletu.
- Kartica izgleda kao stara verzija: Ctrl+F5 / Clear Cache u Fully Kiosku.
- Pošaljite screenshot i/ili tekst greške.
