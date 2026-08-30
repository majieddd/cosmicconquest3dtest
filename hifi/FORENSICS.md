# FORENSICS : the "models look worse / dismembered" defect in the HiFi edition

Scope: the Blender-authored HIFI edition of THE RELIQUARY. What shipped,
what the user reported, how the review chain missed it, the true root cause,
and the controls that now make it non-recurring.

Verdict up front. This was not a geometry problem and not a review coverage
problem. The creatures looked broken (dead, unlit "collars", spurious
surface noise) because the per-face AUX tail of the generated vertex streams
was written in the wrong slot order. The game reads the AUX tail as
(facetSeed, toothWeight, emissive); the exporter wrote (toothWeight,
emissive, 0). Every emitter carried emissive = 0 (nothing glowed) and the
tooth weight landed in the seed slot (per-facet noise the player could see as
grit). The review chain compared forms and never compared photons, so a
defect that only shows up as "darker / duller / noisy" slid through several
green gates. The fix and the new gate are present at the bottom.

---

## 1. What shipped

The pipeline (commit b4180d7) is honest by construction and that part did not
fail:

- DUMP. The game's real per-part meshes (12-float streams: 3 position, 3 flat
  normal, 3 colour, tooth, emissive) are exported to JSON. Blender starts from
  the same art the player sees.
- AUTHOR. `blender/build_hifi.py` imports each part and applies fidelity
  operators per family (bevel, panel insets, greebles, displacement), then
  re-exports the part back to the game's 12-float stream.
- RIG + ANIMATION. `blender/build_clips.py` bakes idle / death / summon clips
  as local additive offsets from bind.

The per-face data is carried into Blender as CORNER (per-loop) attributes so
the operators propagate them onto new geometry. The original authoring used
(commit b4180d7, `make_obj`):

    fcol   FLOAT_COLOR   per-loop colour
    ftooth FLOAT         per-loop tooth weight
    fem    FLOAT         per-loop emissive weight

and the export tail wrote (commit b4180d7, `export_stream`):

    round(t, 4), round(e, 4), 0.0      ->  (tooth, emissive, 0)

That tail is the seed of the whole incident. The game's AUX layout is
(facetSeed, toothWeight, emissive); the pipeline emitted (toothWeight,
emissive, 0). It is a one-slot left shift.

---

## 2. What the user reported

The user, after several team reviews had already passed the build:

- "models look worse"
- "... dismembered and completely broken up apart"

and, after a redirected round of fragmentation investigation and a second
clean team review, still:

- "definitely broken"

with a screenshot showing dead-looking creatures and unlit collars.

Two distinct problems were stacked on top of each other:

1. A real, earlier geometry defect: the aggressive first recipe displaced and
   insets per part, which split rigid-part creatures at the joints and bulged
   the feet/leg boxes. This WAS fragmentation. It is real, it was found, and
   the recipe was replaced with a shape-safe one (commit 6f692d6).
2. A data defect that survived the recipe replacement: the AUX slot shift.
   Even on the clean geometry the creatures were dark and scuffed because the
   emissive channel was dead and the tooth weight had become per-facet noise.

The shape-safe fix made the silhouette coherent, which is why team review 2
passed the geometry: it WAS clean. But the data defect was still present, so
the user still saw dead, unlit, noisy creatures and said "definitely broken".
The honest post-mortem has to separate these. The geometry review chain worked;
the data layer had no gate.

---

## 3. Why no review caught it

### a) Why screenshot review could not expose it

Emissive loss does not read as "missing glow", it reads as "darker, duller".
Tooth-weight misplacement reads as mild per-facet jitter (noise), which on the
safe-recipe build is easy to write off as texture. Neither is a silhouette or
composition defect.

A screenshot review only sees rendered pixels, and it only has value when the
current frame is compared to a known-good reference. There was no glow
baseline: no earlier hi-fi frame in which the emitters and collars demonstrably
glowed. Without a baseline, "darker" is a plausible dark palette and "noisy
surface" is plausible machined texture. Reviewers compared forms against the
house build and palettes were byte-identical, so nothing tripped. The render
was faithful to the (wrong) data; the reviewers read a well-rendered wrong
image.

### b) Why the probes were self-consistent wrong

The exporter's own readback probes all looked correct. The reason is exactly
what the fix comment (commit a5f48f6) states: the probes read the same wrong
layout they wrote. Print the tooth and emissive back from the freshly written
stream and, if you print from the (tooth, emissive, 0) arrangement you wrote,
you see plausible tooth and emissive values. The shift is invisible when the
reader and writer agree on the (wrong) column.

The identity test (blender/identity_test.py) proved the GEOMETRY layer was
faithful: positions, flat normals and base colours round-trip to 1e-5. That
part passed and it should pass, because the geometry was never the data bug.
But the first identity test had its own field-mapping assumption for the AUX
region, so its AUX comparison used the same (wrong) column order and reported a
clean pass. Only a comparison that reads the dump stream with the GAME's column
order (seed, tooth, emissive) and compares against the exporter's output exposes
the shift. That is what finally happened, and it also surfaced the secondary
finding that FLOAT-typed CORNER attributes for the scalar tooth/emissive were
not surviving the operators, so the fix switched them to a single FLOAT_COLOR
AUX attribute (t, e, 0, 1).

### c) Why the pixel tests were not part of the pre-publish check

There is a real pixel test that would have shown no glow: render a frame and
assert a bright emissive region (bloom / brightness above a threshold) in the
emitters and tower collars. None exists. The gate at the time was a browser
harness (steps) plus screenshots; nothing asserted "at least N faces emit light"
or "maximum luminance in the collar region is above X". So publish ran on
"gate green + screenshots looked fine", both of which are form-based. A
direct pixel/brightness assertion is the one control that would have caught
"every emitter glowing nothing" before the user did.

### d) Fixture framing failures wasted evidence

Screenshot evidence during the diagnosis was repeatedly thin: empty loads and
misframed shots (camera not on the subject, subject out of frame, wrong moment)
were captured. Each wasted frame is a wasted round-trip and, worse, a chance to
misread a frame and chase a wrong theory (e.g. reading "darker" as palette or
reading a misframed shot as a regression). Framing has to be deterministic and
repeatable, driven from the default gameplay camera, before a frame can be
evidence.

---

## 4. The root cause, stated once

`blender/build_hifi.py` `export_stream` appended, per triangle, the tail

    (round(t,4), round(e,4), 0.0)

but the game reads the stream tail as

    (facetSeed, toothWeight, emissive)

and rebakes the per-facet seed from the face centroid on load (so the seed slot
must be written as 0.0). The consequence:

- emissive slot = 0 always. Nothing glows. No emitter light, no tower collar
  ring, no core. "Unlit collars", "dead creatures".
- toothWeight landed in the seed slot (the game then seeded each facet with the
  tooth weight, adding deterministic per-facet jitter that reads as grit), and
  emissive landed in the tooth slot (wrong surface response).

This is confirmed in `verify-hifi.js` header (commit 4edfb12): "the aux
slot-shift defect had every emitter glowing nothing and every surface carrying
the wrong tooth weight, and no screenshot review spotted it - only a direct
stream conversation does."

---

## 5. What now prevents recurrence

All controls below are real and in the tree; they are the answer to "how does
this not happen again".

- DATA-LEVEL GATE, step 10 (`verify-hifi.js`, wired into gate.js as step 10,
  commit 4edfb12). Runs headless, no browser, no pixels. Asserts, per file:
  every value finite; stream length a multiple of 12 and of 36 per tri; the
  AUX layout with seed at offset 9 written as 0.0, tooth at offset 10 and
  emissive at offset 11 both in [0,1]; emissive presence (a core must have an
  emissive > 0.9 face somewhere; tower bases must carry >= 30 collar-glow
  faces; bolt base ring); loop closure (first key == last key for idle/summon);
  exact anti-mirror for vane/mandible pairs; death body sink on the y-up law.
  This is a stream conversation, not a screenshot: it reads the bytes.
- BYTE-FAITHFUL VALIDATION IN THE BUILD (commit a5f48f6). After writing the
  generated JS, the build re-reads the file from disk, re-parses the
  Object.assign payload with the GAME's reader regex, and prints the
  tooth/emissive values at the game's offsets (VERIFY-AFTER-DUMP and
  VERIFY-FROM-DISK). The committed result was 105/105 streams byte-faithful.
- THE IN-RUN READBACK (commit a5f48f6). The exporter prints the imported
  tooth/emissive and the re-read from disk for a probe part, so the writer and
  the game's reader can no longer silently disagree.
- THE "USER-CONDITION" RULE. Judgement for "does this look right" must come
  from the default-camera gameplay framing, not from bespoke close-ups or
  authoring-frame views. The visual verdict that matters is the one the player
  actually sees.

---

## 6. Commit chronology

- b4180d7  hifi fidelity edition: pipeline, rigs, clips, 3 passes. Original
            AUX tail (tooth, emissive, 0). Gate green (form-based).
- 58d6e03  5 art directions; each gate green.
- 6cd12c9  rounds 2-5: actors, motion, VFX, stats.
- cd31c5f  round 1: grounded plate.
- f767f53  baseline.
- 6f692d6  shape-safe recipe + exact mirror clips + determinism + team review 2.
            Fragmentation (real) fixed; geometry clean per-model. The data
            defect was still present, still un-gated.
- a5f48f6  AUX slot-shift root cause fixed + winding guard + FLOAT_COLOR aux;
            105/105 byte-faithful; gate green.
- 4edfb12  data-level gate step 10 (verify-hifi): streams, aux layout, seeds,
            loop closure, mirrors, emissive presence. The validator also caught
            its own false positives (a 40 threshold was a miscount: the earlier
            104 figure counted vertices, not faces) and they were fixed.

## 7. Laws honored

- Faction palettes locked; gameplay files unchanged (diffed).
- Em dash and en dash rule: this file is ASCII-only (no U+2014, no U+2013).
- No blame: every reviewer and probe was operating correctly within the
  information it had. The information was incomplete at the data layer.
