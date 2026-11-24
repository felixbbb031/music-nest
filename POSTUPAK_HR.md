# Music Nest Card za Home Assistant: uputa (HR)

## Prije početka (jednom)
1. **Chromecast** mora biti dodan u HA (Postavke → Uređaji i usluge; HA ga obično sam pronađe).
2. **Radio:** Postavke → Uređaji i usluge → Dodaj integraciju → **Radio Browser**.
3. **Plex:** Dodaj integraciju → **Plex**, prijavi se. OneDrive glazbu sinkroniziraj OneDrive aplikacijom na računalu s Plexom i dodaj tu mapu kao Plex biblioteku.
4. (Preporučeno) **Music Assistant** dodatak: bolji popis biblioteke. Pogledaj "browse_entity" dolje.

## Instalacija kartice (HACS, najlakše)
1. Postavi ovaj folder na svoj GitHub (repozitorij, npr. `music-nest-card`).
2. HA → HACS → tri točkice → **Custom repositories** → zalijepi adresu repozitorija, vrsta **Dashboard** → Add.
3. Pronađi "Music Nest Card" → **Download** → osvježi preglednik (Ctrl+F5).

## Instalacija bez HACS-a
1. Datoteku `dist/music-nest-card.js` kopiraj u `/config/www/` (dodatak "File editor" ili Samba).
2. Postavke → Nadzorne ploče → tri točkice → **Resursi** → Dodaj `/local/music-nest-card.js`, vrsta **JavaScript modul**.

## Postavljanje zidnog tableta
1. Nova nadzorna ploča, novi prikaz, vrsta **Panel (1 kartica)**.
2. Dodaj karticu **Music Nest** (ili YAML: `type: custom:music-nest-card`).
3. Prvi put kartica pita koji zvučnik koristiš: dodirni Chromecast. Pamti se na tom tabletu.
4. U Fully Kiosku postavi **Start URL** na tu nadzornu ploču.

## Naredni koraci i problemi
- Ako **Library** javi grešku: dodaj `browse_entity` (npr. Music Assistant player) u karticu.
- Ako nema glazbe u Radiju: provjeri je li Radio Browser dodan.
- Kartica nije testirana na pravom HA-u: pošalji screenshot i/ili poruku greške iz Library/Radio.
- Mala traka za ploču kuće: `mode: compact`.
