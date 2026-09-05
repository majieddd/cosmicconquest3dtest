/* Run in a loaded planet/index.html browser tab. Uses the game's existing
   __RQ inspection interface; changes only this test run, never saved data.
   Returns JSON-friendly evidence and throws on a failed invariant. */
(function () {
  'use strict';
  var checks = [];
  function check(name, ok, detail) {
    checks.push({ name: name, ok: !!ok, detail: detail });
    if (!ok) throw new Error(name + ': ' + JSON.stringify(detail));
  }
  __RQ.start({ board: 1, difficulty: 1 });
  __RQ.closeScreens();
  GAME.speed = 0;
  var board = GAME.state.board, surf = board.surf;
  var report = __RQ.terrainReport();
  check('closed globe has no inner shell or degenerate triangles',
    report.triangles === 81920 && report.degenerate === 0 && !report.hasInnerBody, report);

  var vertices = board.groundData.verts, edges = new Map();
  var inward = 0, minHeight = Infinity, maxHeight = -Infinity;
  function key(i) {
    return [vertices[i], vertices[i + 1], vertices[i + 2]].map(function (v) {
      return Math.round(v * 10000);
    }).join(',');
  }
  for (var i = 0; i < vertices.length; i += 36) {
    var a = Array.from(vertices.slice(i, i + 3));
    var b = Array.from(vertices.slice(i + 12, i + 15));
    var c = Array.from(vertices.slice(i + 24, i + 27));
    var normal = U.V.cross(U.V.sub(b, a), U.V.sub(c, a));
    if (U.V.dot(normal, a) <= 0) inward++;
    var keys = [key(i), key(i + 12), key(i + 24)];
    for (var j = 0; j < 3; j++) {
      var edge = [keys[j], keys[(j + 1) % 3]].sort().join('|');
      edges.set(edge, (edges.get(edge) || 0) + 1);
      var h = Math.hypot(vertices[i + j * 12], vertices[i + j * 12 + 1], vertices[i + j * 12 + 2]) - surf.radius;
      minHeight = Math.min(minHeight, h); maxHeight = Math.max(maxHeight, h);
    }
  }
  var openEdges = Array.from(edges.values()).filter(function (n) { return n !== 2; }).length;
  check('every edge has exactly two adjacent faces', openEdges === 0, openEdges);
  check('all terrain faces point outward', inward === 0, inward);
  check('route is recessed below raised terrain', minHeight < -1.2 && maxHeight > 3.4,
    { min: minHeight, max: maxHeight, depth: maxHeight - minHeight });
  var seamError = 0, floorMax = -Infinity;
  for (var s = 0; s <= 200; s++) {
    var z = -board.halfH + s / 200 * board.halfH * 2;
    seamError = Math.max(seamError, Math.abs(board.heightAt(-board.halfW, z) - board.heightAt(board.halfW, z)));
    var point = board.pathAt(s / 200 * board.path.length).pos;
    floorMax = Math.max(floorMax, board.heightAt(point[0], point[2]));
  }
  check('longitude seam heights agree', seamError < 0.0001, seamError);
  check('entire route stays on the canyon floor', floorMax < -1.05, floorMax);

  var picks = 0, maxPickError = 0;
  for (var orbit = 0; orbit < 8; orbit++) {
    var yaw = orbit * Math.PI / 4;
    __RQ.camera({ yaw: yaw, pitch: 0.18, dist: GAME.cam.fitDist });
    GAME.renderOnce(0); GAME.renderOnce(0);
    for (var n = 0; n < board.plots.length; n++) {
      var plot = board.plots[n];
      var wp = surf.world(plot.x, plot.y, plot.z);
      // Near-facing points avoid legitimate occlusion by an intervening ridge.
      if (U.V.dot(U.V.norm(wp), U.V.norm(R.cam.pos)) < 0.85) continue;
      var pixel = R.project(wp), hit = R.screenToGround(pixel.x, pixel.y);
      var err = hit ? U.V.len(U.V.sub(surf.world(hit[0], hit[1], hit[2]), wp)) : Infinity;
      maxPickError = Math.max(maxPickError, err); picks++;
    }
  }
  check('raised terrain selection follows eight camera orbits', picks > 20 && maxPickError < 0.02,
    { samples: picks, maxWorldError: maxPickError });
  check('selection misses empty sky', R.screenToGround(1, 1) === null);

  var built = __RQ.buildAll(999999);
  check('all fourteen tower types can be placed', built.length === 14, built);
  GAME.state.towers.forEach(function (tower) { tower.buildT = 1; });
  for (var d = 0; d < 100; d++) {
    var unit = SIM.spawnDenizen('stockman', { dist: d * board.path.length / 100 });
    unit.speed = 0; unit.summonT = 0; unit.hp = unit.maxHp = 999999;
  }
  __RQ.step(1 / 120);
  check('ground units track canyon elevation', GAME.state.denizens.every(function (unit) {
    return Math.abs(unit.pos[1] - board.heightAt(unit.pos[0], unit.pos[2])) < 0.01;
  }));
  GAME.renderOnce(0); GAME.renderOnce(0);
  check('frame counters include submitted work', R.stats().draws > 100 && R.stats().tris > 81920, R.stats().draws);
  FX.clear();
  var changedPixels = 0, gl = R.gl;
  for (var view = 0; view < 12; view++) {
    __RQ.camera({ yaw: view * Math.PI / 6, pitch: view > 9 ? 1.35 : 0.18, dist: view % 2 ? 90 : 155 });
    R.quality.globeCulling = false;
    GAME.renderOnce(0); GAME.renderOnce(0);
    var before = new Uint8Array(R.W * R.H * 4), after = new Uint8Array(before.length);
    gl.readPixels(0, 0, R.W, R.H, gl.RGBA, gl.UNSIGNED_BYTE, before);
    R.quality.globeCulling = true;
    GAME.renderOnce(0); GAME.renderOnce(0);
    gl.readPixels(0, 0, R.W, R.H, gl.RGBA, gl.UNSIGNED_BYTE, after);
    for (var pixel = 0; pixel < before.length; pixel += 4) {
      if (Math.max(Math.abs(before[pixel] - after[pixel]), Math.abs(before[pixel + 1] - after[pixel + 1]),
        Math.abs(before[pixel + 2] - after[pixel + 2])) > 2) changedPixels++;
    }
  }
  check('occlusion culling preserves the image in twelve near/far/pole views', changedPixels === 0, changedPixels);
  var errors = __RQ.errors();
  check('no shader, renderer, simulation, game or audio errors', Object.keys(errors).every(function (k) {
    return errors[k].length === 0;
  }), errors);
  return { passed: checks.length, checks: checks };
})();
