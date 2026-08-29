# COMPARISON : FIVE STYLES VS THE CURRENT VERSION

All five are COMPLETE standalone copies of the v1.0 game (tag
v1.0-published; live at https://majieddd.github.io/cosmicconquest3dtest/).
Same gameplay, same boards, same faction palette law. Different painters.
Every one: gate green (verify 79/79, adversarial 48/48) on its final tree.

Servers (dev machine): 8801 noir-ink, 8802 glass-neon, 8803 pastel-day,
8804 print-shop, 8805 deck-clinical. Each style builds its own
single-file bundle via `node build.js` in its reliquary dir.

## The gallery

| style | dir | one-sentence verdict |
|---|---|---|
| v1.0 CURRENT | ~/cosmic-reliquary-dev/reliquary | the grounded painted plate: dark navy, warm lit lane, neon cyan plant; the house style |
| NOIR CELL | styles/noir-ink | comic inker: 3 flat tones, heavy spot-black, no grain; bold and graphic |
| NEON COKE | styles/glass-neon | wet night chrome: glossy spec, hot rims, deep blacks, big magenta-cyan bloom |
| DAYBREAK PASTEL | styles/pastel-day | morning toy: pale lavender plate, soft bands, airy contrast, very clean |
| SCREEN PRINT | styles/print-shop | printed poster: coarser halftone dot screen in the darks, canvas weave, bold inks |
| DECK WASH | styles/deck-clinical | cold service bay: desaturated slate, neutral cool shadows, calm low-key light |

## What changed per style (the exact knobs; see each STYLE.md for the full
story and rationale)

- NOIR CELL: bands 3, rampGamma 1.05, facetJitter 0.30, exposure 0.96,
  saturation 1.05, halftone 0, grain 0.015, inkStrength 1.25 with 1.6x
  thickness, thresholds lowered (normal 0.35, depth 0.55), ink darkened.
- NEON COKE: spec 0.42 / power 45, rim 1.25 / 2.6, exposure 0.84,
  ambient 0.20, bloom 1.35 @ threshold 0.52, saturation 1.32,
  contrast 1.16, vignette 0.62.
- DAYBREAK PASTEL: exposure 1.05, ambient 0.34, bands 3, gamma 1.05,
  shadowLift 0.34, saturation 1.16, contrast 0.92, vignette 0.28,
  halftone 0, board recolored pastel (ground/path/spire arrays).
- SCREEN PRINT: halftone 0.95 with 5.2px dot cells and a wider shadow
  mask (0.12-0.72), canvas 0.50, grain 0.07, ink 1.15 @ 1.5x thickness,
  contrast 1.25, exposure 1.00.
- DECK WASH: saturation 0.82, neutral-cool derived shadows (saturation
  of the shadow hue dropped 0.62 to 0.35, hue and faction keys untouched),
  exposure 1.02, spec 0.28/64, halo and vignette down, board recolored
  slate.

## Law checks

- Faction palettes (js/04-paint FACTIONS): LOCKED in all five (they are
  identity, per ART-BIBLE).
- Gameplay (js/12-sim.js, tower/denizen/wave data, index.html layout):
  untouched in all five. Only light, colour and print.
- Gates: 79/79 verify + 48/48 adversarial on every style's final tree,
  including the V.1 lane/ground ratio and V.3 ground brightness rules.
- The em dash law: every style tree passes the source scan.

## How the user picks

Open each dir's build (or the served URL at 127.0.0.1:880x on the dev
machine) and play the same wave. The moment of truth is four waves in,
at 4x speed: which one can you read fastest?
