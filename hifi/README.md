# HIFI : BLENDER AUTHORSHIP ROUNDS

The HIFIBILITY edition: a separate copy of THE COIL in which the bodies,
creatures and towers are authored in **Blender 5.2.1** (geometry + rigs +
animation clips) instead of being built procedurally. Everything else is
the same game, gated green throughout.

## The pipeline (why it is honest)

1. DUMP. The game's real per-part meshes (vertex streams with faceted
   flat normals, per-face palette colours, tooth/emissive weights) are
   exported from the running build to JSON. The Blender work therefore
   starts from the SAME art the player sees, not from new ideas of it.
2. AUTHOR IN BLENDER. `blender/build_hifi.py` imports each part, applies
   the fidelity operator set per family:
   - hull / body: chamfer bevel (0.03 x scale), 6 panel insets with depth
     (0.05), 4 greeble studs, organic displacement (0.012),
   - limbs: mid-crease joint ring + bulge,
   - heads: brow cut subdivision,
   - decor (vanes, halos, wings): surface subdivision + curated pinch,
   - the re-export rebuilds the game's 12-float stream and REBAKES the
     per-facet band jitter seed on load, so the brushwork survives.
3. RIG + ANIMATION. `blender/build_clips.py` builds one armature per
   locomotion rig (bone per part at its bind) and bakes three clips as
   LOCAL offsets from bind: idle (breathing, head lag, follow-through),
   death (crumple, head drop, leg buckle), summon (chimney pulse). The
   game plays them ADDITIVELY on top of its procedural gait/IK, because
   the planted-feet law (gate W.1) is the rig's strongest feature.

## Creation passes (me)

- PASS 1: pipeline proof. One creature (chitling) through the loop,
  378 -> 1122 tris; fixed bmesh API bugs, corner-attribute colour
  transport, deterministic seeds (fnv1a not Python hash). Full run:
  10 creatures 246-2131 tris, 42 towers, 4 rigs x 3 clips. Gate
  PASSED (79/79 + 48/48, 20 modules, 10.9 MB single file).
- PASS 2: fidelity critique. Closeups reviewed: panels/chamfers read as
  crafted, no artifacts; tuned bevel 0.02->0.03, insets 4->6 faces and
  depth 0.03->0.05, greebles 3->4, added decor subdivision (tither was
  unchanged by the first pass). Re-baked den + tw, re-shot closeups:
  broodmother reads as machined armour.
- PASS 3: performance. Real GPU (Apple M5) with a 57-creature horde at
  4x speed: 236 fps, 4.23 ms/frame, 640 draws, 214 shadow draws, scale
  1.0. The added geometry is not a cost on modern Apple Silicon.

## Team review

Four parallel DeepSeek reviewers: character art, rig/animation,
harness/integration audit, game-feel side-by-side.

What they caught (all real, all fixed):

1. [AUDITOR - CRITICAL] The towers generated file carried an EMPTY
   denizens object, clobbering the creatures file: hi-fi denizen geometry
   was dead and the game silently used procedural bodies. Fixed by making
   each generated file carry only its own kind; verified at data level
   (tw file keys: version/kind/towers only) and in game (MODELS.denizen
   now returns the hi-fi tri counts, 1.2k-2.1k).
2. [ANIMATOR - HIGH] Breathing was baking on the FORWARD axis (game space
   is y-up), reading as a lunge; death collapsed forward instead of down;
   vanes were not anti-mirrored; idle channels used non-integer cycles and
   never baked the closing key (13-degree head pop at every loop wrap).
   Fixed: axis swap, anti-mirrored sides, integer cycle counts, closing
   key sampled (first==last verified for every rig).
3. [ARTIST - HIGH] Panel insets were gated to up-facing faces only, and
   displacement wobble (0.012) crumpled the machined read. Fixed: panels
   on the six largest faces of ANY orientation with deeper recesses
   (0.075), displacement halved (0.006). Hivelord flanks now read as
   layered plates.
4. [GAMEFEEL] Judgement was taken on the CLOBBERED build (procedural
   creatures + quieter moment): towers read mushroomy and the palette
   washed. Re-checked after the fixes: towers keep their angular identity,
   palette laws hold, no degradation. Verdict on fixed build: KEEP.

## Refinement passes (measured, revert-ready)

- PASS 1 - Integrity and animation truth. Per-kind payloads, axis swap,
  seamless loop, anti-mirror. Probes: py amplitude 0.10 (was ~0.008 on
  the wrong axis), first==last TRUE everywhere, death py -0.28. Gate
  PASSED (79/79 + 48/48) at 10.95 MB. NO degradation.
- PASS 2 - Machined armour. Side-facing panels with deeper recesses,
  halved displacement. Closeups: hivelord/broodmother flanks layered,
  silhouettes crisp. Gate re-run green. NO degradation.
- PASS 3 - Game-feel rebalance. Action frames reviewed: towers angular,
  combat energy intact, nothing regressed vs house build. No reverts
  needed; no change applied.

## Laws held

- Faction palettes: LOCKED (diffed against the house build).
- Gameplay files (sim, tower/denizen data, UI): UNCHANGED (diffed).
- Em dash rule: the gate scans and passes.
- Fallback: if the generated data files are absent, the game boots and
  runs the procedural builders (verified).
