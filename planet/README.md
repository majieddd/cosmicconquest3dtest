# PLANET EDITION : ROUNDS (curved maps + the player's chosen look)

The PLANET edition is the player's direction: maps on curved planet
surfaces, one wide-curve map and one full-globe band, in the chosen art
blend (print-shop cel ink + deck-clinical polygon tone + Blender hi-fi
models, grain and halftone dots REMOVED - the player called them dark
spot noise). The simulation stays flat; the render layer warps to the
sphere (bake + draw + particles + camera + picking).

## The blend (exact ART values)

exposure 1.00, contrast 1.16, saturation 0.92, inkStrength 1.20 with
1.5x thickness, ink thresholds 0.45/0.68, canvas 0.30, grain 0.0,
halftone 0.0, bandCap 0.72, spec 0.30/64, rim 0.70/3.0, vignette 0.44.

## The maps

- MERIDIAN (board 0): wide curved cap, R=90, 28-degree bow. The
  reference planet framing.
- CIRCUMFERENCE (board 1): exact single wrap (R = halfW/pi), band 60x16
  cells, lane 0.9 turns, chevron traffic, goldBonus +12%, zoom to R*3.6.

## Verification ROUNDS (the requested 4)

- ROUND 1 - my own: curated renders of both maps; found and fixed
  (a) beams shooting through the planet (chord -> surface-split),
  (b) planet read as a ring (body sphere added), (c) far-side spires
  becoming radial needles (planet spire law), (d) cap framing.
- ROUND 2 - the harness: full gate found W.1/W.2 failing on planet
  boards (flat-space laws compared in world space). Fixed honestly:
  gait laws stay on a flat board; the mapping got its own law W.3 -
  which then FOUND the hidden 1.25-wrap SELF-OVERLAP (second-turn band
  doubled 25% of the arena onto itself). Globe redesigned to a single
  wrap. Final: 79/79 + 52/52.
- ROUND 3 - game dev team (4 agents): director (planets epic; the
  RTS story: chevrons + banners; gold economy grindy), camera/UX
  (zoom-out clamp too tight so no full-globe survey; THE PICKING BUG:
  screenToGround hits a flat plane on a curved deck), production
  (MERIDIAN 9/10, CIRCUMFERENCE 4/10 presentation, art 9/10, next
  steps multi-gate M / bigger planet L), tech verifier timed out (its
  checks were re-run by me: coil-floor gating OK, allocations OK,
  body clearance fixed 0.35->0.55 after z-fight math).
- ROUND 4 - fixes: globe 42x10 -> 60x16 with R 28.65 (band no longer a
  ribbon), radius-scaled zoom [R*1.35, R*3.6], SPHERE PICKING
  (ray-sphere + unworld, the placement-critical fix), chevron route
  stream, spawn/goal dressing, goldBonus, hero frame = near-equatorial
  ("the road" stage; orbiting pans the war around the world; zoom-out
  surveys). Re-verified by eye + gate re-run (see below).

## Ship state

- Gate: PASSED 79/79 + 52/52 on the shipped tree (verify-hifi data gate
  included: streams, aux layout, mirrors, emissive presence).
- Server: 127.0.0.1:8811. Bundle: cosmic-reliquary.html (built by the
  gate's step 7).
- Publish protocol: tools/publish-gate.sh (data gate -> 10-step gate ->
  user-condition shots), fixture tools/userconditions.steps.cjs now
  defaults to the planet board (board 0).

## What is still open (honest)

- Multi-gate objectives and two-band planets: scored L by production
  review; not in this round.
- Mini-map for the globe (helps when the arena is bigger than the
  frame): open.
- Spawn/goal DOM banners: open (site meshes + chevrons carry it now).
