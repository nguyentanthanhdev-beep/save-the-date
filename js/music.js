/*
 * Nhạc nền tự tổng hợp bằng Web Audio API — không cần file mp3, không dính bản quyền.
 *
 * Giai điệu: "Canon in D" (Pachelbel, thuộc phạm vi công cộng) với âm sắc hộp nhạc / piano nhẹ,
 * có hồi âm (reverb). Cấu trúc: bè bass + hợp âm rải + giai điệu, đổi biến tấu mỗi 8 hợp âm
 * (nốt dài → nốt đen → nốt móc đơn → nốt dài cao → chỉ còn hợp âm rải) rồi lặp lại.
 *
 *   const m = SynthMusic.create({ volume: 0.5 });
 *   m.play();  m.pause();  m.isPlaying();
 */
(function (root) {
  'use strict';

  var BPM = 64;
  var EIGHTH = 60 / BPM / 2;           // độ dài 1 nốt móc đơn (giây)
  var STEPS_PER_CYCLE = 32;            // 8 hợp âm × 4 nốt móc đơn
  var LEVEL = 2.4;                     // hệ số âm lượng (volume 0.5 → mức nhạc nền êm, đỉnh ≈ -5 dBFS)

  function mtof(m) { return 440 * Math.pow(2, (m - 69) / 12); }

  // Hợp âm: D  A  Bm  F#m  G  D  G  A
  var BASS = [50, 45, 47, 42, 43, 38, 43, 45];
  var BED = [
    [62, 66, 69], [61, 64, 69], [62, 66, 71], [61, 66, 69],
    [62, 67, 71], [62, 66, 69], [62, 67, 71], [61, 64, 69]
  ];
  var ARP = [0, 1, 2, 1];

  var MELODY_HALF = [78, 76, 74, 73, 71, 69, 71, 73];
  var MELODY_QUARTER = [[78, 74], [76, 73], [74, 71], [73, 69], [71, 74], [69, 74], [71, 67], [73, 76]];
  var MELODY_EIGHTH = [
    [78, 76, 74, 78], [76, 73, 76, 81], [74, 71, 74, 78], [73, 69, 73, 76],
    [71, 74, 79, 74], [69, 74, 78, 74], [71, 67, 71, 74], [73, 76, 81, 76]
  ];
  // 'half' | 'quarter' | 'eighth' | 'high' | 'bed'
  var SECTIONS = ['half', 'quarter', 'eighth', 'high', 'bed'];

  /* ---------- Âm sắc ---------- */
  // [bội tần, biên độ, hệ số thời gian tắt]
  var PARTIALS = [[1, 1, 1], [2, 0.32, 0.55], [3, 0.12, 0.35], [5.02, 0.05, 0.18]];

  function pluck(ctx, out, when, midi, o) {
    var f = mtof(midi);
    var env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, when);
    env.gain.exponentialRampToValueAtTime(o.gain, when + 0.008);
    env.gain.exponentialRampToValueAtTime(0.0001, when + o.decay);
    env.connect(out);
    for (var i = 0; i < PARTIALS.length; i++) {
      var p = PARTIALS[i];
      var osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = f * p[0];
      var g = ctx.createGain();
      g.gain.setValueAtTime(p[1] * (p[0] === 1 ? 1 : o.bright), when);
      g.gain.exponentialRampToValueAtTime(0.0001, when + Math.max(0.15, o.decay * p[2]));
      osc.connect(g);
      g.connect(env);
      osc.start(when);
      osc.stop(when + o.decay + 0.05);
    }
  }

  /* ---------- Phối khí cho 1 nốt móc đơn ---------- */
  function scheduleStep(ctx, out, when, step) {
    var c = step % STEPS_PER_CYCLE;
    var section = SECTIONS[Math.floor(step / STEPS_PER_CYCLE) % SECTIONS.length];
    var chord = c >> 2;
    var within = c & 3;

    if (within === 0) pluck(ctx, out, when, BASS[chord], { gain: 0.2, decay: 2.4, bright: 0.6 });
    pluck(ctx, out, when, BED[chord][ARP[within]], { gain: 0.065, decay: 1.4, bright: 0.6 });

    if (section === 'half' && within === 0) {
      pluck(ctx, out, when, MELODY_HALF[chord], { gain: 0.2, decay: 2.6, bright: 1 });
    } else if (section === 'quarter' && (within & 1) === 0) {
      pluck(ctx, out, when, MELODY_QUARTER[chord][within >> 1], { gain: 0.18, decay: 1.8, bright: 1 });
    } else if (section === 'eighth') {
      pluck(ctx, out, when, MELODY_EIGHTH[chord][within], { gain: 0.15, decay: 1.4, bright: 1 });
    } else if (section === 'high' && within === 0) {
      pluck(ctx, out, when, MELODY_HALF[chord] + 12, { gain: 0.12, decay: 2.8, bright: 1.2 });
      pluck(ctx, out, when, MELODY_HALF[chord], { gain: 0.1, decay: 2.4, bright: 0.8 });
    }
  }

  /* ---------- Đồ thị âm thanh: lọc → (khô + hồi âm) → master → compressor ---------- */
  function makeImpulse(ctx, seconds, power) {
    var rate = ctx.sampleRate;
    var len = Math.floor(rate * seconds);
    var buf = ctx.createBuffer(2, len, rate);
    for (var ch = 0; ch < 2; ch++) {
      var d = buf.getChannelData(ch);
      for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, power);
    }
    return buf;
  }

  function buildGraph(ctx, volume) {
    var input = ctx.createGain();
    var tone = ctx.createBiquadFilter();
    tone.type = 'lowpass';
    tone.frequency.value = 4200;
    tone.Q.value = 0.5;
    input.connect(tone);

    var master = ctx.createGain();
    master.gain.value = Math.max(volume * LEVEL, 0.0001);

    var dry = ctx.createGain();
    dry.gain.value = 0.78;
    tone.connect(dry);
    dry.connect(master);

    var verb = ctx.createConvolver();
    verb.buffer = makeImpulse(ctx, 2.8, 2.6);
    var wet = ctx.createGain();
    wet.gain.value = 0.38;
    tone.connect(verb);
    verb.connect(wet);
    wet.connect(master);

    var comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.knee.value = 18;
    comp.ratio.value = 4;
    comp.attack.value = 0.01;
    comp.release.value = 0.25;
    master.connect(comp);
    comp.connect(ctx.destination);

    return { input: input, master: master };
  }

  /* ---------- Bộ phát thời gian thực ---------- */
  function create(opts) {
    var volume = (opts && opts.volume) != null ? opts.volume : 0.5;
    var ctx = null;
    var graph = null;
    var timer = null;
    var step = 0;
    var nextTime = 0;
    var playing = false;

    function schedule() {
      var horizon = ctx.currentTime + 0.6;
      while (nextTime < horizon) {
        scheduleStep(ctx, graph.input, nextTime, step);
        nextTime += EIGHTH;
        step++;
      }
    }

    function play() {
      if (playing) return Promise.resolve();
      var AC = root.AudioContext || root.webkitAudioContext;
      if (!AC) return Promise.reject(new Error('Web Audio không được hỗ trợ'));
      if (!ctx) {
        ctx = new AC();
        graph = buildGraph(ctx, 0.0001);
        nextTime = ctx.currentTime + 0.12;
      }
      var resumed = ctx.resume();           // gọi đồng bộ trong thao tác bấm của người dùng
      playing = true;
      var t = ctx.currentTime;
      graph.master.gain.cancelScheduledValues(t);
      graph.master.gain.setValueAtTime(Math.max(graph.master.gain.value, 0.0001), t);
      graph.master.gain.linearRampToValueAtTime(volume * LEVEL, t + 2.5);   // vào nhạc nhẹ nhàng
      if (nextTime < t) nextTime = t + 0.1;
      schedule();
      clearInterval(timer);
      timer = setInterval(schedule, 120);
      return resumed;
    }

    function pause() {
      if (!playing) return;
      playing = false;
      clearInterval(timer);
      var t = ctx.currentTime;
      graph.master.gain.cancelScheduledValues(t);
      graph.master.gain.setValueAtTime(Math.max(graph.master.gain.value, 0.0001), t);
      graph.master.gain.linearRampToValueAtTime(0.0001, t + 0.6);  // tắt dần
      setTimeout(function () { if (!playing && ctx) ctx.suspend(); }, 700);
    }

    return { play: play, pause: pause, isPlaying: function () { return playing; } };
  }

  /* Dựng sẵn N giây nhạc (dùng để kiểm thử hoặc xuất file) */
  function renderOffline(seconds, volume) {
    var OAC = root.OfflineAudioContext || root.webkitOfflineAudioContext;
    var rate = 44100;
    var ctx = new OAC(2, Math.floor(rate * seconds), rate);
    var graph = buildGraph(ctx, volume != null ? volume : 0.5);
    var t = 0.05;
    for (var s = 0; t < seconds; s++) {
      scheduleStep(ctx, graph.input, t, s);
      t += EIGHTH;
    }
    return ctx.startRendering();
  }

  root.SynthMusic = {
    create: create,
    renderOffline: renderOffline,
    cycleSeconds: STEPS_PER_CYCLE * EIGHTH * SECTIONS.length
  };
})(typeof window !== 'undefined' ? window : globalThis);
