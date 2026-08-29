# DECK WASH (cold service bay)

A style token for Cosmic Conquest: The Coil. Thesis: a clean cold engineering
space, desaturated slate blue-grey plate, crisp banded light on NEUTRAL cool
shadows (not violet), minimal grain and halftone, subtle bloom, calm rim. It
reads like a maintenance bay from a science-fantasy book cover: tidy, precise,
low-key. It does not touch gameplay (js/12-sim.js, tower/denizen data in
js/08-data.js, tabs/denizens/waves logic, index.html layout).

## Final values (exact)

### R.ART (js/05-render.js)

| Key | Value | Note |
| --- | --- | --- |
| bands | 4.0 | unchanged |
| rampGamma | 1.18 | was 1.24, wider terminator |
| facetJitter | 0.13 | was 0.19, calmer facets |
| shadowLift | 0.24 | unchanged |
| ambient | 0.30 | was 0.26, helps cold plate |
| specStrength | 0.28 | was 0.20 |
| specPower | 64.0 | was 90.0, tighter crisp sheen |
| rimStrength | 0.55 | was 0.85, calm rim |
| rimPower | 3.2 | was 3.4 |
| toothScale | 0.42 | unchanged |
| toothStrength | 0.35 | was 0.46 |
| fogDensity | 0.0032 | was 0.0040, clean air |
| bloomThreshold | 0.70 | was 0.60 |
| bloomStrength | 0.65 | was 0.95, subtle bloom |
| bandCap | 0.74 | was 0.70 |
| decorBandCap | 0.84 | was 0.80 |
| exposure | 1.02 | was 0.88 |
| saturation | 0.82 | was 1.24, washed grade |
| contrast | 1.05 | was 1.10 |
| vignette | 0.42 | was 0.54 |
| grain | 0.02 | was 0.042, minimal |
| halftone | 0.18 | was 0.62, whisper |
| canvas | 0.16 | was 0.20 |

### Coil board palette (js/08-data.js BOARDS.coil)

- groundCols `['#232c38', '#29343f', '#1f2731', '#2f3a47', '#26303a', '#2c3742', '#1c232c', '#333e4a']`
- pathCols `['#5a6b7d', '#68798c', '#536476', '#74859a']`
- spireCols `['#10161d', '#161e26']`

The coil core, pipe, coolant and casing hexes are unchanged.

### Derived shadow (js/04-paint.js derive())

`shadow: U.hsl2rgb([shadowHue, 0.35, 0.075])` (saturation dropped from 0.62 to
0.35 so the shadow reads as a NEUTRAL cool grey rather than a violet tint. Hue
kept; this is a washed stylistic choice, not a faction colour change. Faction
key/accent hexes in FACTIONS are untouched, as are the other derived entries
(light, rim, ambientSky, ambientGround, skyTop, skyBottom, nebulaA, nebulaB,
ink, fog).

## Changes

1. js/05-render.js: rewrote the R.ART block to the DECK WASH numbers with an
   updated dash-free decision comment.
2. js/04-paint.js: dropped the derived shadow saturation 0.62 to 0.35.
3. js/08-data.js: recoloured the coil board ground/path/spire arrays to the
   desaturated slate blue-grey set.

## Gate

Ran from the deck-clinical copy against the running server.

```
CHROME_PATH=... node tools/gate.js http://127.0.0.1:8805
```

Result: GATE PASSED. parse ok (16 modules), no em dash clean, shaders link,
mesh winding 15/15, beam geometry ok, css braces balanced, build bundle wrote
cosmic-reliquary.html 456.0 KB, verify 79/79, adversarial 48/48.

Adversarial detail for the visual checks: V.1 lane 139 vs ground 70 (ratio
1.97), V.2 lane 139 ground 70 (no clip), V.3 ground 70 (must be above 45).

```
node --check js/05-render.js  OK
node --check js/04-paint.js   OK
node --check js/08-data.js    OK
```

## Verdict

The style reads as DECK WASH on every capture (00-board, 01-action,
02-action-late, 03-lineup, 04-back). Measured plate pixel means are a
desaturated cool slate blue: ground center (107, 119, 158) and shadow-side
(113, 117, 149), hue B > G > R with chroma around 0.32, so the plate is
neutral-cool blue and not violet. Sky stays deep and dark. Grain, halftone and
canvas are a whisper; bloom is subtle; the rim separates silhouettes without
lighting the board. The plate is tidy and precise, the light bands are crisp,
and the whole frame is calm and low-key. No balance pass was required; the
values shipped as written.
