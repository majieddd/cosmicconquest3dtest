# DAYBREAK PASTEL

Style tag: soft daylight toy. A clean toy diorama under morning light: a pastel
plate in light lavender-navy, airy even light, soft posterised bands, low
contrast, a gentle vignette, very little noise, and soft shadows. Readable and
cheerful. This is the deliberate opposite of the dark painted plate that ships
as the default look: instead of a near-black ground carrying deep shadow, the
board itself is the bright thing, and the actors sit on top of it.

## Thesis

Morning light on a clean toy diorama. The picture reads as a bright plastic
playset on a pastel table, not as a night scene. The three levers that get it
there are exposure, ambient, and the band caps: expose the board up, lift the
shadow floor so there is no deep black mass, and let the ground carry a little
more of the lit band than the dark plate did. The grade is leaned, not shoved:
the faction hexes and the tower silhouettes stay vivid, so saturation and
contrast fall toward neutral to protect the patchwork and avoid clipping.

## Picture constants (js/05-render.js, R.ART)

Final values after the pass:

| constant | shipping | DAYBREAK PASTEL |
| --- | --- | --- |
| bands | 4.0 | 3.0 |
| rampGamma | 1.24 | 1.05 |
| facetJitter | 0.19 | 0.12 |
| shadowLift | 0.24 | 0.34 |
| ambient | 0.26 | 0.34 |
| specStrength | 0.20 | 0.16 |
| specPower | 90 | 70 |
| rimStrength | 0.85 | 0.65 |
| rimPower | 3.4 | 3.0 |
| toothStrength | 0.46 | 0.30 |
| fogDensity | 0.0040 | 0.0028 |
| bloomThreshold | 0.60 | 0.68 |
| bloomStrength | 0.95 | 0.80 |
| bandCap | 0.70 | 0.85 |
| decorBandCap | 0.80 | 0.90 |
| exposure | 0.88 | 1.05 |
| saturation | 1.24 | 1.08 |
| contrast | 1.10 | 0.92 |
| vignette | 0.54 | 0.28 |
| grain | 0.042 | 0.015 |
| halftone | 0.62 | 0.0 |
| canvas | 0.20 | 0.10 |

Untouched constants: toothScale 0.42, inkStrength 0.95, inkNormalThreshold
0.55, inkDepthThreshold 0.85, debugMode 0.

## Board palette (js/08-data.js, THE COIL board)

The coil board now carries a light lavender-navy plate instead of the near-black
reactor floor:

groundCols: #4a5f86 #54688f #465a80 #5d7099 #506390 #586d95 #41567c #5f749d
pathCols:   #9db8d8 #b0c8e4 #8fb0d2 #bdd4ee
spireCols:  #2a3450 #323d5c

The path sits a clear band above the ground so the lane still reads as a lane
(V.1 ratio), and the spires stay darker than the plate so they silhouette rather
than compete with the towers.

## What changed and why

- exposure 0.88 to 1.05: the biggest single brightener. The plate moves into
  daylight rather than staying at night levels.
- ambient 0.26 to 0.34 and shadowLift 0.24 to 0.34: lift the shadow floor so a
  shadowed facet is a soft graded fall instead of a black mass. This is what
  removes the night plate feel.
- bands 4.0 to 3.0 and rampGamma 1.24 to 1.05: fewer, wider posterised bands
  with a gentler terminator, so the shadow is a soft band across a face rather
  than a hard snap. This is the toy look.
- contrast 0.92 and saturation 1.08: lean the grade instead of shoving it. The
  source is already vivid, and a lower contrast keeps neighbouring facets from
  merging while still reading clean and cheerful.
- vignette 0.54 to 0.28, grain 0.042 to 0.015, halftone 0.62 to 0.0, canvas
  0.20 to 0.10: quiet every bit of texture and noise. A pastel toy plate is
  clean, not distressed.
- bandCap 0.70 to 0.85 and decorBandCap 0.80 to 0.90: let the board carry a
  little more lit band without letting the table compete with the actors.
- spec 0.20/90 to 0.16/70 and rim 0.85/3.4 to 0.65/3.0: keep the highlight
  gentle so the toy reads as polished plastic, not brushed metal.
- bloomThreshold 0.60 to 0.68 and bloomStrength 0.95 to 0.80: softer bloom so
  the light sources glow gently rather than blowing out the pastel plate.
- fogDensity 0.0040 to 0.0028 and toothStrength 0.46 to 0.30: less haze and
  less tooth, so the air stays clear and the plate stays smooth.

## Scope and guards

Gameplay was not touched. No changes to js/12-sim.js, no changes to tower,
denizen, or wave logic in js/08-data.js, and no changes to the index.html
layout. The faction palettes in js/04-paint.js FACTIONS are locked and
unchanged: the hues are identity. The coil board palette is the style, not a
gameplay rule, so it is free to move.

## Verification

- js syntax: node --check on js/05-render.js and js/08-data.js, both clean.
- Gate (tools/gate.js): 79/79 verify, 48/48 adversarial, no em dash, shaders,
  winding, beam geometry, css braces, and build all green.
- V.3 ground luminance (board's own geometry, 0..255): the harness board samples
  ground median 99, lane median 156. The coil board (the pastel target, board
  index 3) samples ground median 114, lane median 189. Both sit comfortably
  above the V.3 floor of 45, so the pastel plate is clearly exposed and not
  underexposed.
- V.1 lane vs ground ratio 1.66 on the coil board (189 vs 114), comfortably
  above the 1.25 floor, so the lane still reads as a lane.
- V.2 no clipping: lane 189 and ground 114 are both under the clip ceilings
  (235 / 200).
- Screenshots in tools/out/pastel-day: 00-board, 01-action, 02-action-late,
  03-lineup, 04-back. The board reads as a soft pastel plate, shadows are soft,
  the vignette is gentle, and the towers keep distinct faction colour on top of
  it.

## Verdict

The picture now reads as DAYBREAK PASTEL. The plate is a clean light lavender-
navy board under airy even light, with soft bands, low contrast, a gentle
vignette, and very little noise. It is visible, cheerful, and readable: the lane
still reads as a lane, and the faction-tinted towers sit clearly on top of the
pastel table. The dark painted plate is gone.
