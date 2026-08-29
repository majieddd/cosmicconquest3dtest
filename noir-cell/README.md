# NOIR CELL (Comic Inker) - Style Document

Style: NOIR CELL. This is a comic-book inker over the painted tower defense.

## Thesis

A comic-book inker paints in a few flat tones and lets the INK carry the
drawing. Heavy spot-black lines, THICK outlines, three flat light bands, no
grain, no halftone, minimal texture, punchy contrast. Dark but still legible.

The v1.0 picture was a soft painterly quilt: four gradient bands, visible
canvas tooth and grain, warm ambient haze, wide soft rim light. It read as
painted pastel, not inked. NOIR CELL strips the texture, crushes the palette
to three flat bands, and pushes the ink pass hard so every silhouette and
facet edge gets a dark outline.

## Final values (js/05-render.js, ART block)

    bands: 3.0
    rampGamma: 1.05
    facetJitter: 0.30
    shadowLift: 0.26
    ambient: 0.24
    specStrength: 0.10
    specPower: 60.0
    rimStrength: 0.70
    rimPower: 3.0
    toothScale: 0.42
    toothStrength: 0.18
    fogDensity: 0.0040
    bloomThreshold: 0.70
    bloomStrength: 0.55
    bandCap: 0.72
    decorBandCap: 0.78
    exposure: 0.96
    saturation: 1.05
    contrast: 1.22
    vignette: 0.45
    grain: 0.015
    halftone: 0.0
    canvas: 0.10
    inkStrength: 1.25
    inkNormalThreshold: 0.35
    inkDepthThreshold: 0.55

Ink pass (js/05-render.js inkPass): uThickness = Math.max(1.0, H / 720) * 1.6

Ink colour (js/04-paint.js derive): ink = U.hsl2rgb([shadowHue, 0.75, 0.018])

## What changed and why

### Flat bands
- bands 4.0 -> 3.0: three flat light bands, the comic-ink look, instead of the
  painterly four-band quilt.
- rampGamma 1.24 -> 1.05, facetJitter 0.19 -> 0.30: wider, more broken
  terminator so the shadow mass reads across whole faces and the facets break
  into distinct flat tones rather than a smooth gradient.
- shadowLift 0.24 -> 0.26: keeps a little albedo life in the darkest band.

### De-hazing the shadows
- ambient 0.26 -> 0.24, rimStrength 0.85 -> 0.70, rimPower 3.4 -> 3.0,
  specStrength 0.20 -> 0.10, specPower 90 -> 60: kill the atmospheric wash and
  wide specular / rim glow that made the scene feel foggy. Ink shadows need a
  clean dark, not a haze.

### No texture
- toothStrength 0.46 -> 0.18, grain 0.042 -> 0.015, halftone 0.62 -> 0.0,
  canvas 0.20 -> 0.10: strip the surface noise and halftone so the sheet reads
  as flat ink on paper.

### Ink (the point of the style)
- inkStrength 0.95 -> 1.25, inkNormalThreshold 0.55 -> 0.35,
  inkDepthThreshold 0.85 -> 0.55: more edges caught, more of them pushed.
- uThickness x1.6: THICK outlines.
- ink colour lightness 0.035 -> 0.018: true spot-black ink, darker than the
  shadow masses it sits over.

### Grade
- exposure 0.88 -> 0.96, saturation 1.24 -> 1.05, contrast 1.10 -> 1.22,
  vignette 0.54 -> 0.45: lower saturation (the source hexes are already vivid;
  over-saturating the output clips channels) and higher contrast to make the
  ink pop against the dark plate.
- bloomThreshold 0.60 -> 0.70, bloomStrength 0.95 -> 0.55: rein in the bloom
  so the whole scene does not glow; an inked page is not a neon sign. Punches
  up contrast.
- bandCap 0.70 -> 0.66 -> 0.72, decorBandCap 0.80 -> 0.78: the ground must stay
  off the lit band so the plate reads dark. The first pass landed at 0.66 and
  the harness V.3 gate measured ground median luminance at exactly 45, one
  point shy of the required > 45. bandCap is the documented main lever (moves
  the ground median about 12 points where ambient moves 4), so it was raised to
  0.72 to pull the plate above the threshold. 0.72 is a 9% move, inside the
  allowed 10% nudge.

Gate verification after the balance pass: verify 79/79, adversarial 48/48, all
green. The V.1 (lane brighter than ground, ratio over 1.25), V.2 (no clipping)
and V.3 (ground median luminance > 45) checks all pass.

## Verdict

NOIR CELL is achieved. The picture reads as a dark, flat, heavily-inked comic
sheet: three flat bands per face, thick dark outlines on every silhouette and
facet edge, deep monotone shadow masses, no grain or halftone, and enough
exposure and contrast to keep the plate and lane legible. The gate is fully
green at 79/79 verify and 48/48 adversarial.
