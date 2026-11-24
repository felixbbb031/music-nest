# Music Nest Card (0.1.0)

Music and radio player card for Home Assistant, designed for wall tablets (Fully Kiosk).
Big cover art, large touch buttons, speaker picker (Chromecast or any media player), Library and Radio browsing.
No cloud, no tracking, one JavaScript file.

## Install (HACS)
1. HACS → three dots → **Custom repositories** → paste this repository's URL → type **Dashboard** → Add.
2. Search "Music Nest Card" → **Download**. (HACS adds the resource itself; refresh the browser.)
3. Edit dashboard → Add card → **Custom: Music Nest** (or YAML below).

## Install (manual)
Copy `dist/music-nest-card.js` to `/config/www/`, then Settings → Dashboards → ⋮ → Resources → add `/local/music-nest-card.js` as **JavaScript module**.

## Use
```yaml
type: custom:music-nest-card
```
On first start the card asks which speaker to use and remembers it on that tablet. Full-screen on a wall tablet: set the dashboard view to **Panel (1 card)**.

Options (all optional):
```yaml
type: custom:music-nest-card
entity: media_player.living_room      # default speaker (the tablet's own choice wins)
browse_entity: media_player.music_assistant_player   # browse Plex/library through this player, play on the speaker
mode: compact                         # small bar; tap opens the full player
height: 600                           # pixels (ignored in panel view)
shortcuts:                            # extra tabs
  - name: Radio
    media_content_id: media-source://radio_browser
```

## Notes
Browsing depends on what your player exposes (Chromecast shows Media Sources such as Radio Browser; Plex and Music Assistant appear if their integrations are installed).
