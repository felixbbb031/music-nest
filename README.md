# Music Nest Card (0.1.1)

Music and radio player card for Home Assistant, designed for wall tablets (Fully Kiosk).
Big cover art, large touch buttons, speaker picker, Library home (Playlists, Artists, Albums, Songs, Radio) and a Radio Browser search.
No tracking, one JavaScript file.

## Install (Marketplace, Home Assistant 2026.11 and newer)
1. Settings → **Marketplace** → **Add from link** → paste this repository's URL.
2. Open "Music Nest Card" → **Install**, then refresh the browser (Ctrl+F5).
3. Edit a dashboard → **Add card** → **Music Nest** (or **Manual** with the YAML below).

## Install (manual)
Copy `dist/music-nest-card.js` to `/config/www/`, then Settings → Dashboards → ⋮ → Resources → add `/local/music-nest-card.js` as **JavaScript module**.

## Use
```yaml
type: custom:music-nest-card
```
On first start the card asks which speaker to use and remembers it on that tablet.
For your music library choose a speaker marked **Music Assistant** (add Plex as a provider in Music Assistant).
Full-screen on a wall tablet: set the dashboard view type to **Panel (single card)**.

Options (all optional):
```yaml
type: custom:music-nest-card
entity: media_player.living_room      # default speaker (the tablet's own choice wins)
browse_entity: media_player.xyz       # list the library through this player (ignored if it does not exist)
mode: compact                         # small bar; tap opens the full player
height: 600                           # pixels (ignored in panel view)
radio_country: HR                     # first country shown in Radio (default: tablet language)
cover_lookup: false                   # turn off the iTunes/Deezer cover search
shortcuts:                            # extra tabs that open a media folder
  - name: My media
    media_content_id: media-source://media_source
```

## Online services
Only the tablet's browser talks to these, nothing goes through a cloud of ours:
- **Radio Browser** (radio-browser.info): the station list and search.
- **iTunes / Deezer search**: only when the speaker gives no cover or a too small one (for example on radio). Results are remembered on the tablet.
