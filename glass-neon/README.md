# NEON COKE (glossy night)

Style pass for Cosmic Conquest: The Coil. Logged in the style dir so the exact
numbers, the reasoning, and the gate verdict survive the next art pass.

## Thesis

Wet dark chrome in a neon night. The plate reads as if it was just polished and
rained on: a heavy glossy specular, hot bright rims on every silhouette, generous
bloom so the light sources read as neon, very deep blacks, gem-faceted surfaces.
The magenta-cyan tint is carried by the existing vaporwave key (the faction
palettes in 04-paint FACTIONS) so the hue identity is untouched; the look is built
entirely from how the light is shaped, not from new colours.

## Exact final ART values (js/05-render.js)

```
bands:            4.0
rampGamma:        1.30
facetJitter:      0.16
shadowLift:       0.28
ambient:          0.20
specStrength:     0.42
specPower:        45.0
rimStrength:      1.25
rimPower:         2.6
toothScale:       0.42
toothStrength:    0.25
fogDensity:       0.0040
bloomThreshold:   0.52
bloomStrength:    1.35
bandCap:          0.70
decorBandCap:     0.78
exposure:         0.84
saturation:       1.32
contrast:         1.16
vignette:         0.62
grain:            0.03
halftone:         0.25
canvas:           0.12
inkStrength:      0.95
inkNormalThresh:  0.55
inkDepthThresh:   0.85
```

## Changes from v1.0 baseline

| value         | from  | to    | why                                                        |
|---------------|-------|-------|------------------------------------------------------------|
| specStrength  | 0.20  | 0.42  | wet chrome lobe, doubled so the plate reads glossy         |
| specPower     | 90.0  | 45.0  | wide generous lobe, not a single hairline glint            |
| rimStrength   | 0.85  | 1.25  | hot rim, brighter silhouette separation                    |
| rimPower      | 3.4   | 2.6   | wraps the form wide instead of a tight outline             |
| exposure      | 0.88  | 0.84  | sink the plate toward black                                |
| ambient       | 0.26  | 0.20  | starve the unlit side for a heavy shadow mass              |
| rampGamma     | 1.24  | 1.30  | darker mid, the plate tends to the deep stop               |
| facetJitter   | 0.19  | 0.16  | cleaner, more gem-like facets                              |
| bloomStrength | 0.95  | 1.35  | generous neon glow                                          |
| bloomThreshold| 0.60  | 0.52  | more of the bright detail bleeds into bloom                |
| saturation    | 1.24  | 1.32  | extreme chroma, the point of a neon night                  |
| contrast      | 1.10  | 1.16  | deep blacks against the hot rims                           |
| vignette      | 0.54  | 0.62  | frame sinks harder to black                                |
| grain         | 0.042 | 0.03  | cleaner surface, less film scratch                         |
| halftone      | 0.62  | 0.25  | lighter shadow dot screen, so the blacks stay clean        |
| canvas        | 0.20  | 0.12  | subtler weave on a glossy plate                            |
| toothStrength | 0.46  | 0.25  | smoother facets so the wet highlight reads as chrome       |
| shadowLift    | 0.24  | 0.28  | a little more colour life inside the shadows               |
| decorBandCap  | 0.80  | 0.78  | scenery sits a hair lower                                   |

## The one forced deviation: bandCap

The NEON COKE adoption set bandCap to 0.66, but the V.3 gate law says the ground
median luminance must read above 45 on a 0..255 scale, and my measurement showed
0.66 and 0.68 both landing the ground median at 44, a single point below the floor
(V.3 then fails). The smallest nudge that clears the law is bandCap 0.70, which
unlocks the third band for the board and reads the ground median at 49. Raising
ambient instead would haze the blacks (the look needs ambient low), and raising
exposure only clears the floor barely at 45.4, which drifts. So bandCap stays at
the baseline 0.70 while every other value moves to the adoption target.

## V.3 report and gate verdict

Measured on a live frame with the shipped ART, sampling pixels off the board's own
geometry:

- V.1 lane reads brighter than ground: PASS, lane 122 vs ground 49, ratio 2.48
- V.2 the lit board does not clip: PASS, lane 122 (< 235) and ground 49 (< 200)
- V.3 the board is not underexposed: PASS, ground median 49 (> 45)

Gate: 79/79 verify, 48/48 adversarial, all other steps ok. The plate is very dark
(the deep blacks are real) but the pavement still reads. Scene mean RGB on the
board crop moved from baseline 154 blue to 165 blue, and the lineup crop from 94.4
to 103.8 luminance, confirming the grade leans harder and the wet catch-lights and
rims are brighter than the flat baseline.

## Verdict

Reads as NEON COKE. The board is a near-black faceted plate with slick specular
catch-lights, the towers carry hot magenta-cyan rims against the gloom, the beam
and the dome bloom generously, and the whole frame sits in the vaporwave key.
No gameplay files were touched (12-sim.js, 08-data.js tower/denizen/wave logic, and
index.html layout are unchanged). Only the ART block in js/05-render.js changed;
no shader edits were needed because every value is already wired to a uniform.
