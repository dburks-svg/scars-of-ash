// ============================================================
// SCARS OF ASH - GAME DATA & SYSTEMS
// This file contains all data, audio, sprites, and utility
// systems that don't require React/JSX.
// Loaded as a regular <script> before the Babel-transpiled
// game engine. All declarations use 'var' for global scope.
// ============================================================

// ============= TOUCH DEVICE DETECTION =============
var isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// ============= MUSIC SYSTEM =============

class MusicManager {
  constructor() {
    this.initialized = false;
    this.currentTrack = null;
    this.muted = false;
    this.masterGain = null;
    this.tracks = {};
    this.activeNodes = [];
  }

  async init() {
    if (this.initialized) return;
    await Tone.start();

    this.masterGain = new Tone.Gain(0.3).toDestination();

    // Create reverb for atmosphere
    this.reverb = new Tone.Reverb({ decay: 4, wet: 0.5 }).connect(this.masterGain);
    await this.reverb.generate();

    this.delay = new Tone.FeedbackDelay({ delayTime: '8n', feedback: 0.3, wet: 0.2 }).connect(this.reverb);

    this.initialized = true;
  }

  stopAllTracks() {
    this.activeNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.dispose) node.dispose();
      } catch (e) {}
    });
    this.activeNodes = [];
    Tone.Transport.stop();
    Tone.Transport.cancel();
  }

  async switchTrack(trackName) {
    if (!this.initialized) await this.init();
    if (this.currentTrack === trackName) return;

    this.stopAllTracks();
    this.currentTrack = trackName;

    if (this.muted) return;

    switch (trackName) {
      case 'exploration':
        this.playExploration();
        break;
      case 'bonfire':
        this.playBonfire();
        break;
      case 'battle':
        this.playBattle();
        break;
      case 'bossPhase2':
        this.playBossPhase2();
        break;
      case 'victory':
        this.playVictory();
        break;
      case 'gameOver':
        this.playGameOver();
        break;
    }
  }

  playExploration() {
    // Chiptune exploration - Lavender Town meets Firelink Shrine
    // Am - Em - F - G progression, 70 BPM, melancholic but musical

    // Lead melody - square wave, lonely and ancient
    const lead = new Tone.Synth({
      oscillator: { type: 'square', width: 0.5 },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.2 }
    }).connect(new Tone.Gain(0.15).connect(this.masterGain));

    // Harmony - triangle wave for softer texture
    const harmony = new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0.4, release: 0.3 }
    }).connect(new Tone.Gain(0.1).connect(this.masterGain));

    // Bass - triangle wave, arpeggiated
    const bass = new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.01, decay: 0.15, sustain: 0.3, release: 0.1 }
    }).connect(new Tone.Gain(0.2).connect(this.masterGain));

    this.activeNodes.push(lead, harmony, bass);

    // Melancholic melody - 8 bar phrase that loops
    const melodyNotes = [
      // Bar 1-2 (Am)
      'E4', 'D4', 'C4', 'B3', 'A3', null, 'C4', 'E4',
      // Bar 3-4 (Em)
      'G4', 'E4', 'D4', 'B3', 'E4', null, 'G4', 'F#4',
      // Bar 5-6 (F)
      'A4', 'G4', 'F4', 'E4', 'F4', null, 'A4', 'C5',
      // Bar 7-8 (G -> Am)
      'B4', 'G4', 'D4', 'B3', 'C4', 'E4', 'A4', null
    ];

    const melodySeq = new Tone.Sequence((time, note) => {
      if (note) lead.triggerAttackRelease(note, '8n', time);
    }, melodyNotes, '8n');

    // Counter melody / harmony (plays on off-beats, lower)
    const harmonyNotes = [
      // Am
      null, 'A3', null, 'E3', null, 'C4', null, 'A3',
      // Em
      null, 'E3', null, 'B3', null, 'G3', null, 'E3',
      // F
      null, 'F3', null, 'C4', null, 'A3', null, 'F3',
      // G
      null, 'G3', null, 'D4', null, 'B3', null, null
    ];

    const harmonySeq = new Tone.Sequence((time, note) => {
      if (note) harmony.triggerAttackRelease(note, '8n', time);
    }, harmonyNotes, '8n');

    // Arpeggiated bass line
    const bassPattern = [
      // Am
      'A2', 'E2', 'A2', 'C3', 'A2', 'E2', 'A2', 'E2',
      // Em
      'E2', 'B2', 'E2', 'G2', 'E2', 'B2', 'E2', 'B2',
      // F
      'F2', 'C3', 'F2', 'A2', 'F2', 'C3', 'F2', 'C3',
      // G
      'G2', 'D3', 'G2', 'B2', 'G2', 'D3', 'E2', 'A2'
    ];

    const bassSeq = new Tone.Sequence((time, note) => {
      if (note) bass.triggerAttackRelease(note, '16n', time);
    }, bassPattern, '8n');

    this.activeNodes.push(melodySeq, harmonySeq, bassSeq);

    Tone.Transport.bpm.value = 70;
    melodySeq.start(0);
    harmonySeq.start(0);
    bassSeq.start(0);
    Tone.Transport.start();
  }

  playBonfire() {
    // Gentle rest theme - peaceful arpeggios, the safest place
    // Soft triangle waves, slower tempo, warm feeling

    const arp = new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.02, decay: 0.3, sustain: 0.2, release: 0.5 }
    }).connect(new Tone.Gain(0.12).connect(this.delay));

    const pad = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.3, decay: 0.5, sustain: 0.4, release: 1 }
    }).connect(new Tone.Gain(0.08).connect(this.reverb));

    const bass = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.1, decay: 0.3, sustain: 0.5, release: 0.5 }
    }).connect(new Tone.Gain(0.15).connect(this.masterGain));

    this.activeNodes.push(arp, pad, bass);

    // Gentle ascending/descending arpeggios
    const arpNotes = [
      // Am (peaceful)
      'A3', 'C4', 'E4', 'A4', 'E4', 'C4', 'A3', 'E3',
      // F (warmth)
      'F3', 'A3', 'C4', 'F4', 'C4', 'A3', 'F3', 'C3',
      // C (hope)
      'C3', 'E3', 'G3', 'C4', 'G3', 'E3', 'C3', 'G2',
      // E (resolution to Am)
      'E3', 'G#3', 'B3', 'E4', 'B3', 'G#3', 'E3', 'B2'
    ];

    const arpSeq = new Tone.Sequence((time, note) => {
      if (note) arp.triggerAttackRelease(note, '4n', time);
    }, arpNotes, '8n');

    // Soft pad chords, one per measure
    const padChords = [
      ['A3', 'C4', 'E4'],
      ['F3', 'A3', 'C4'],
      ['C3', 'E3', 'G3'],
      ['E3', 'G#3', 'B3']
    ];
    let padIndex = 0;

    const padLoop = new Tone.Loop(time => {
      pad.triggerAttackRelease(padChords[padIndex % padChords.length], '1m', time);
      padIndex++;
    }, '1m');

    // Simple bass notes
    const bassNotes = ['A2', 'F2', 'C2', 'E2'];
    let bassIndex = 0;

    const bassLoop = new Tone.Loop(time => {
      bass.triggerAttackRelease(bassNotes[bassIndex % bassNotes.length], '2n', time);
      bassIndex++;
    }, '1m');

    this.activeNodes.push(arpSeq, padLoop, bassLoop);

    Tone.Transport.bpm.value = 55;
    arpSeq.start(0);
    padLoop.start(0);
    bassLoop.start(0);
    Tone.Transport.start();
  }

  playBattle() {
    // Tense battle theme - driving rhythm, minor key, stakes are high
    // Square wave lead, triangle bass, pulse wave rhythm

    const lead = new Tone.Synth({
      oscillator: { type: 'square', width: 0.25 },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.1 }
    }).connect(new Tone.Gain(0.12).connect(this.masterGain));

    const bass = new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0.4, release: 0.1 }
    }).connect(new Tone.Gain(0.2).connect(this.masterGain));

    const pulse = new Tone.Synth({
      oscillator: { type: 'pulse', width: 0.125 },
      envelope: { attack: 0.005, decay: 0.05, sustain: 0.1, release: 0.05 }
    }).connect(new Tone.Gain(0.1).connect(this.masterGain));

    // Noise for percussion
    const snare = new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: { attack: 0.005, decay: 0.1, sustain: 0, release: 0.1 }
    }).connect(new Tone.Gain(0.08).connect(this.masterGain));

    this.activeNodes.push(lead, bass, pulse, snare);

    // Urgent, driving melody in C minor
    const melodyNotes = [
      // Phrase 1
      'C4', 'C4', 'Eb4', 'G4', 'F4', 'Eb4', 'D4', 'C4',
      'Bb3', 'C4', 'D4', 'Eb4', 'D4', 'C4', 'Bb3', 'G3',
      // Phrase 2 (higher tension)
      'G4', 'G4', 'Ab4', 'G4', 'F4', 'Eb4', 'F4', 'G4',
      'Ab4', 'G4', 'F4', 'Eb4', 'D4', 'C4', 'D4', 'Eb4'
    ];

    const melodySeq = new Tone.Sequence((time, note) => {
      if (note) lead.triggerAttackRelease(note, '16n', time);
    }, melodyNotes, '8n');

    // Driving bass pattern
    const bassNotes = [
      'C2', null, 'C2', 'C2', null, 'C2', 'G2', null,
      'Ab2', null, 'Ab2', 'Ab2', null, 'G2', 'F2', null,
      'Eb2', null, 'Eb2', 'Eb2', null, 'F2', 'G2', null,
      'Ab2', null, 'Bb2', null, 'G2', 'G2', 'G2', null
    ];

    const bassSeq = new Tone.Sequence((time, note) => {
      if (note) bass.triggerAttackRelease(note, '16n', time);
    }, bassNotes, '8n');

    // Rhythmic pulse on the beat
    const pulsePattern = [1, 0, 1, 0, 1, 0, 1, 0];
    const pulseSeq = new Tone.Sequence((time, hit) => {
      if (hit) pulse.triggerAttackRelease('C5', '32n', time);
    }, pulsePattern, '8n');

    // Snare on 2 and 4
    const snarePattern = [0, 0, 1, 0, 0, 0, 1, 0];
    const snareSeq = new Tone.Sequence((time, hit) => {
      if (hit) snare.triggerAttackRelease('16n', time);
    }, snarePattern, '8n');

    this.activeNodes.push(melodySeq, bassSeq, pulseSeq, snareSeq);

    Tone.Transport.bpm.value = 140;
    melodySeq.start(0);
    bassSeq.start(0);
    pulseSeq.start(0);
    snareSeq.start(0);
    Tone.Transport.start();
  }

  playBossPhase2() {
    // Desperate boss theme - faster, chromatic tension, the hound transforms
    // Still musical but with dissonant intervals and frantic energy

    const lead = new Tone.Synth({
      oscillator: { type: 'square', width: 0.5 },
      envelope: { attack: 0.005, decay: 0.1, sustain: 0.2, release: 0.1 }
    }).connect(new Tone.Gain(0.12).connect(this.masterGain));

    const lead2 = new Tone.Synth({
      oscillator: { type: 'sawtooth' },
      envelope: { attack: 0.005, decay: 0.1, sustain: 0.2, release: 0.1 }
    }).connect(new Tone.Gain(0.08).connect(this.masterGain));

    const bass = new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.005, decay: 0.1, sustain: 0.4, release: 0.05 }
    }).connect(new Tone.Gain(0.22).connect(this.masterGain));

    const snare = new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: { attack: 0.002, decay: 0.08, sustain: 0, release: 0.08 }
    }).connect(new Tone.Gain(0.1).connect(this.masterGain));

    this.activeNodes.push(lead, lead2, bass, snare);

    // Frantic chromatic melody with tritones
    const melodyNotes = [
      // Chromatic descent with tension
      'E5', 'Eb5', 'D5', 'Db5', 'C5', 'B4', 'Bb4', 'A4',
      'Ab4', 'G4', 'Gb4', 'F4', 'E4', 'Eb4', 'D4', 'Db4',
      // Rising panic
      'C4', 'D4', 'Eb4', 'F4', 'Gb4', 'G4', 'Ab4', 'A4',
      'Bb4', 'B4', 'C5', 'Db5', 'D5', 'Eb5', 'E5', 'F5'
    ];

    const melodySeq = new Tone.Sequence((time, note) => {
      if (note) lead.triggerAttackRelease(note, '16n', time);
    }, melodyNotes, '16n');

    // Harmony a tritone apart for dissonance
    const harmonyNotes = melodyNotes.map(note => {
      if (!note) return null;
      // Transpose down a tritone (6 semitones) for dissonance
      const noteMap = {'C': 'Gb', 'Db': 'G', 'D': 'Ab', 'Eb': 'A', 'E': 'Bb', 'F': 'B', 'Gb': 'C', 'G': 'Db', 'Ab': 'D', 'A': 'Eb', 'Bb': 'E', 'B': 'F'};
      const noteName = note.slice(0, -1);
      const octave = parseInt(note.slice(-1)) - 1;
      const base = noteName.replace('#', 'b');
      return (noteMap[base] || base) + octave;
    });

    const harmonySeq = new Tone.Sequence((time, note) => {
      if (note) lead2.triggerAttackRelease(note, '16n', time);
    }, harmonyNotes, '16n');

    // Pounding bass
    const bassNotes = [
      'C2', 'C2', 'C2', 'C2', 'Db2', 'Db2', 'D2', 'D2',
      'Eb2', 'Eb2', 'E2', 'E2', 'F2', 'F2', 'Gb2', 'G2',
      'Ab2', 'Ab2', 'A2', 'A2', 'Bb2', 'Bb2', 'B2', 'B2',
      'C3', 'B2', 'Bb2', 'A2', 'Ab2', 'G2', 'Gb2', 'F2'
    ];

    const bassSeq = new Tone.Sequence((time, note) => {
      if (note) bass.triggerAttackRelease(note, '16n', time);
    }, bassNotes, '16n');

    // Fast snare hits
    const snarePattern = [1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1];
    const snareSeq = new Tone.Sequence((time, hit) => {
      if (hit) snare.triggerAttackRelease('32n', time);
    }, snarePattern, '16n');

    this.activeNodes.push(melodySeq, harmonySeq, bassSeq, snareSeq);

    Tone.Transport.bpm.value = 170;
    melodySeq.start(0);
    harmonySeq.start(0);
    bassSeq.start(0);
    snareSeq.start(0);
    Tone.Transport.start();
  }

  playVictory() {
    // Somber but triumphant - you survived, barely
    const lead = new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.1, decay: 0.3, sustain: 0.4, release: 0.5 }
    }).connect(new Tone.Gain(0.15).connect(this.reverb));

    const bass = new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.1, decay: 0.2, sustain: 0.5, release: 0.3 }
    }).connect(new Tone.Gain(0.12).connect(this.masterGain));

    this.activeNodes.push(lead, bass);

    // Simple ascending resolution melody
    const melodyNotes = [
      'A3', null, 'C4', null, 'E4', null, 'A4', null,
      'G4', null, 'E4', null, 'C4', null, 'E4', null,
      'F4', null, 'A4', null, 'C5', null, 'A4', null,
      'G4', null, 'B4', null, 'A4', null, null, null
    ];

    const melodySeq = new Tone.Sequence((time, note) => {
      if (note) lead.triggerAttackRelease(note, '4n', time);
    }, melodyNotes, '8n');

    const bassNotes = ['A2', 'A2', 'C3', 'C3', 'F2', 'F2', 'E2', 'A2'];
    const bassSeq = new Tone.Sequence((time, note) => {
      if (note) bass.triggerAttackRelease(note, '4n', time);
    }, bassNotes, '2n');

    this.activeNodes.push(melodySeq, bassSeq);

    Tone.Transport.bpm.value = 60;
    melodySeq.start(0);
    bassSeq.start(0);
    Tone.Transport.start();
  }

  playGameOver() {
    // YOU DIED - descending minor phrase
    const lead = new Tone.Synth({
      oscillator: { type: 'square', width: 0.5 },
      envelope: { attack: 0.1, decay: 0.5, sustain: 0.3, release: 1 }
    }).connect(new Tone.Gain(0.12).connect(this.reverb));

    const bass = new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.2, decay: 0.5, sustain: 0.5, release: 1 }
    }).connect(new Tone.Gain(0.15).connect(this.masterGain));

    this.activeNodes.push(lead, bass);

    // Descending death melody
    const deathMelody = ['E4', 'D4', 'C4', 'B3', 'A3', null, null, null];
    const deathSeq = new Tone.Sequence((time, note) => {
      if (note) {
        lead.triggerAttackRelease(note, '2n', time);
        bass.triggerAttackRelease(Tone.Frequency(note).transpose(-12).toNote(), '2n', time);
      }
    }, deathMelody, '2n');

    this.activeNodes.push(deathSeq);

    Tone.Transport.bpm.value = 50;
    deathSeq.start(0);
    deathSeq.loop = false;
    Tone.Transport.start();
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) {
      this.stopAllTracks();
    } else if (this.currentTrack) {
      const track = this.currentTrack;
      this.currentTrack = null;
      this.switchTrack(track);
    }
    return this.muted;
  }

  setMuted(muted) {
    if (this.muted !== muted) {
      this.toggleMute();
    }
  }
}

var musicManager = new MusicManager();

// ============= SOUND EFFECTS SYSTEM =============
class SfxManager {
  constructor() {
    this.initialized = false;
    this.muted = false;
    this.masterGain = null;
  }

  async init() {
    if (this.initialized) return;
    await Tone.start();
    this.masterGain = new Tone.Gain(0.4).toDestination();
    this.initialized = true;
  }

  setMuted(muted) {
    this.muted = muted;
  }

  async play(type, options = {}) {
    if (this.muted) return;
    if (!this.initialized) await this.init();

    switch (type) {
      case 'hitLight':
        this.playHitLight();
        break;
      case 'hitMedium':
        this.playHitMedium();
        break;
      case 'hitHeavy':
        this.playHitHeavy();
        break;
      case 'critical':
        this.playCritical();
        break;
      case 'faint':
        this.playFaint();
        break;
      case 'bindAttempt':
        this.playBindAttempt();
        break;
      case 'captureSuccess':
        this.playCaptureSuccess();
        break;
      case 'captureFail':
        this.playCaptureFail();
        break;
      case 'soulsGained':
        this.playSoulsGained();
        break;
      case 'menuClick':
        this.playMenuClick();
        break;
      case 'bonfireRest':
        this.playBonfireRest();
        break;
      case 'death':
        this.playDeath();
        break;
      case 'victory':
        this.playVictory();
        break;
      case 'poison':
        this.playPoison();
        break;
      case 'chill':
        this.playChill();
        break;
      case 'burn':
        this.playBurn();
        break;
    }
  }

  playHitLight() {
    const synth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 }
    }).connect(this.masterGain);
    synth.triggerAttackRelease('C5', '16n');
    setTimeout(() => synth.dispose(), 200);
  }

  playHitMedium() {
    const synth = new Tone.Synth({
      oscillator: { type: 'square' },
      envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.1 }
    }).connect(this.masterGain);
    synth.triggerAttackRelease('G3', '8n');
    setTimeout(() => synth.dispose(), 300);
  }

  playHitHeavy() {
    const synth = new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.001, decay: 0.2, sustain: 0.1, release: 0.2 }
    }).connect(this.masterGain);
    const noise = new Tone.NoiseSynth({
      noise: { type: 'brown' },
      envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.1 }
    }).connect(new Tone.Gain(0.3).connect(this.masterGain));
    synth.triggerAttackRelease('C2', '8n');
    noise.triggerAttackRelease('16n');
    setTimeout(() => { synth.dispose(); noise.dispose(); }, 400);
  }

  playCritical() {
    const synth = new Tone.Synth({
      oscillator: { type: 'square' },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0.2, release: 0.1 }
    }).connect(this.masterGain);
    const now = Tone.now();
    synth.triggerAttackRelease('C5', '16n', now);
    synth.triggerAttackRelease('E5', '16n', now + 0.08);
    synth.triggerAttackRelease('G5', '16n', now + 0.16);
    setTimeout(() => synth.dispose(), 500);
  }

  playFaint() {
    const synth = new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.01, decay: 0.3, sustain: 0.2, release: 0.5 }
    }).connect(this.masterGain);
    const now = Tone.now();
    synth.triggerAttackRelease('E4', '8n', now);
    synth.triggerAttackRelease('C4', '8n', now + 0.2);
    synth.triggerAttackRelease('A3', '4n', now + 0.4);
    setTimeout(() => synth.dispose(), 1200);
  }

  playBindAttempt() {
    const synth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.1, decay: 0.3, sustain: 0.1, release: 0.3 }
    }).connect(this.masterGain);
    synth.frequency.rampTo('C6', 0.5);
    synth.triggerAttackRelease('C4', '4n');
    setTimeout(() => synth.dispose(), 800);
  }

  playCaptureSuccess() {
    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'square' },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.2 }
    }).connect(this.masterGain);
    const now = Tone.now();
    synth.triggerAttackRelease(['C4', 'E4', 'G4'], '8n', now);
    synth.triggerAttackRelease(['C5', 'E5', 'G5'], '4n', now + 0.15);
    setTimeout(() => synth.dispose(), 800);
  }

  playCaptureFail() {
    const synth = new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.2 }
    }).connect(this.masterGain);
    const noise = new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.1 }
    }).connect(new Tone.Gain(0.2).connect(this.masterGain));
    synth.triggerAttackRelease('Eb3', '8n');
    noise.triggerAttackRelease('16n');
    setTimeout(() => { synth.dispose(); noise.dispose(); }, 400);
  }

  playSoulsGained() {
    const synth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 }
    }).connect(this.masterGain);
    const now = Tone.now();
    synth.triggerAttackRelease('E6', '32n', now);
    synth.triggerAttackRelease('G6', '32n', now + 0.05);
    setTimeout(() => synth.dispose(), 200);
  }

  playMenuClick() {
    const synth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.05 }
    }).connect(new Tone.Gain(0.3).connect(this.masterGain));
    synth.triggerAttackRelease('A5', '64n');
    setTimeout(() => synth.dispose(), 100);
  }

  playBonfireRest() {
    const noise = new Tone.NoiseSynth({
      noise: { type: 'brown' },
      envelope: { attack: 0.3, decay: 0.5, sustain: 0.3, release: 0.5 }
    }).connect(new Tone.Filter(800, 'lowpass').connect(new Tone.Gain(0.15).connect(this.masterGain)));
    const synth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.2, decay: 0.3, sustain: 0.4, release: 0.5 }
    }).connect(this.masterGain);
    noise.triggerAttackRelease('1n');
    synth.triggerAttackRelease('C4', '2n');
    setTimeout(() => { noise.dispose(); synth.dispose(); }, 2000);
  }

  playDeath() {
    const synth = new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.1, decay: 0.5, sustain: 0.2, release: 1 }
    }).connect(this.masterGain);
    const now = Tone.now();
    synth.triggerAttackRelease('D4', '4n', now);
    synth.triggerAttackRelease('Bb3', '4n', now + 0.3);
    synth.triggerAttackRelease('G3', '4n', now + 0.6);
    synth.triggerAttackRelease('D3', '2n', now + 0.9);
    setTimeout(() => synth.dispose(), 2500);
  }

  playVictory() {
    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'square' },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.2 }
    }).connect(this.masterGain);
    const now = Tone.now();
    synth.triggerAttackRelease(['C4', 'E4'], '8n', now);
    synth.triggerAttackRelease(['D4', 'F4'], '8n', now + 0.15);
    synth.triggerAttackRelease(['E4', 'G4'], '8n', now + 0.3);
    synth.triggerAttackRelease(['G4', 'C5', 'E5'], '4n', now + 0.45);
    setTimeout(() => synth.dispose(), 1200);
  }

  playPoison() {
    const synth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.05, decay: 0.2, sustain: 0.1, release: 0.2 }
    }).connect(this.masterGain);
    const now = Tone.now();
    synth.triggerAttackRelease('G3', '16n', now);
    synth.triggerAttackRelease('Bb3', '16n', now + 0.08);
    synth.triggerAttackRelease('G3', '16n', now + 0.16);
    setTimeout(() => synth.dispose(), 400);
  }

  playChill() {
    const synth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.1, decay: 0.3, sustain: 0.1, release: 0.3 }
    }).connect(this.masterGain);
    const now = Tone.now();
    synth.triggerAttackRelease('E5', '8n', now);
    synth.triggerAttackRelease('B4', '8n', now + 0.15);
    setTimeout(() => synth.dispose(), 500);
  }

  playBurn() {
    const noise = new Tone.NoiseSynth({
      noise: { type: 'pink' },
      envelope: { attack: 0.01, decay: 0.15, sustain: 0.05, release: 0.1 }
    }).connect(new Tone.Filter(2000, 'highpass').connect(new Tone.Gain(0.2).connect(this.masterGain)));
    const synth = new Tone.Synth({
      oscillator: { type: 'sawtooth' },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.1 }
    }).connect(new Tone.Gain(0.3).connect(this.masterGain));
    noise.triggerAttackRelease('8n');
    synth.triggerAttackRelease('C4', '16n');
    setTimeout(() => { noise.dispose(); synth.dispose(); }, 300);
  }
}

var sfxManager = new SfxManager();

// Helper function for playing sound effects
var playSfx = (type, options) => sfxManager.play(type, options);

// ============= SPRITE SYSTEM =============

// Sprite manifest for PNG sprite loading with SVG fallbacks
// Now supports animation frames as arrays
var SPRITE_MANIFEST = {
  creatures: {
    fire: {
      base: {
        idle: [
          'assets/sprites/creatures/cindrath/base_idle_0.png',
          'assets/sprites/creatures/cindrath/base_idle_1.png',
          'assets/sprites/creatures/cindrath/base_idle_2.png',
          'assets/sprites/creatures/cindrath/base_idle_3.png'
        ]
      },
      hollowed: {
        idle: [
          'assets/sprites/creatures/cindrath/hollowed_idle_0.png',
          'assets/sprites/creatures/cindrath/hollowed_idle_1.png',
          'assets/sprites/creatures/cindrath/hollowed_idle_2.png',
          'assets/sprites/creatures/cindrath/hollowed_idle_3.png'
        ]
      }
    },
    water: {
      base: {
        idle: [
          'assets/sprites/creatures/marshveil/base_idle_0.png',
          'assets/sprites/creatures/marshveil/base_idle_1.png',
          'assets/sprites/creatures/marshveil/base_idle_2.png',
          'assets/sprites/creatures/marshveil/base_idle_3.png'
        ]
      },
      hollowed: {
        idle: [
          'assets/sprites/creatures/marshveil/hollowed_idle_0.png',
          'assets/sprites/creatures/marshveil/hollowed_idle_1.png',
          'assets/sprites/creatures/marshveil/hollowed_idle_2.png',
          'assets/sprites/creatures/marshveil/hollowed_idle_3.png'
        ]
      }
    },
    grass: {
      base: {
        idle: [
          'assets/sprites/creatures/thornwick/base_idle_0.png',
          'assets/sprites/creatures/thornwick/base_idle_1.png',
          'assets/sprites/creatures/thornwick/base_idle_2.png',
          'assets/sprites/creatures/thornwick/base_idle_3.png'
        ]
      },
      hollowed: {
        idle: [
          'assets/sprites/creatures/thornwick/hollowed_idle_0.png',
          'assets/sprites/creatures/thornwick/hollowed_idle_1.png',
          'assets/sprites/creatures/thornwick/hollowed_idle_2.png',
          'assets/sprites/creatures/thornwick/hollowed_idle_3.png'
        ]
      }
    },
    dark: {
      base: {
        idle: [
          'assets/sprites/creatures/umbravine/base_idle_0.png',
          'assets/sprites/creatures/umbravine/base_idle_1.png',
          'assets/sprites/creatures/umbravine/base_idle_2.png',
          'assets/sprites/creatures/umbravine/base_idle_3.png'
        ]
      },
      hollowed: {
        idle: [
          'assets/sprites/creatures/umbravine/hollowed_idle_0.png',
          'assets/sprites/creatures/umbravine/hollowed_idle_1.png',
          'assets/sprites/creatures/umbravine/hollowed_idle_2.png',
          'assets/sprites/creatures/umbravine/hollowed_idle_3.png'
        ]
      }
    },
    light: {
      base: {
        idle: [
          'assets/sprites/creatures/solrath/base_idle_0.png',
          'assets/sprites/creatures/solrath/base_idle_1.png',
          'assets/sprites/creatures/solrath/base_idle_2.png',
          'assets/sprites/creatures/solrath/base_idle_3.png'
        ]
      },
      hollowed: {
        idle: [
          'assets/sprites/creatures/solrath/hollowed_idle_0.png',
          'assets/sprites/creatures/solrath/hollowed_idle_1.png',
          'assets/sprites/creatures/solrath/hollowed_idle_2.png',
          'assets/sprites/creatures/solrath/hollowed_idle_3.png'
        ]
      }
    },
    boss: {
      phase1: {
        idle: [
          'assets/sprites/bosses/obsidian-hound/phase1_idle_0.png',
          'assets/sprites/bosses/obsidian-hound/phase1_idle_1.png',
          'assets/sprites/bosses/obsidian-hound/phase1_idle_2.png',
          'assets/sprites/bosses/obsidian-hound/phase1_idle_3.png'
        ]
      },
      phase2: {
        idle: [
          'assets/sprites/bosses/obsidian-hound/phase2_idle_0.png',
          'assets/sprites/bosses/obsidian-hound/phase2_idle_1.png',
          'assets/sprites/bosses/obsidian-hound/phase2_idle_2.png',
          'assets/sprites/bosses/obsidian-hound/phase2_idle_3.png'
        ]
      }
    },
    hollowWarden: {
      phase1: {
        idle: [
          'assets/sprites/bosses/hollow-warden/phase1_idle_0.png',
          'assets/sprites/bosses/hollow-warden/phase1_idle_1.png',
          'assets/sprites/bosses/hollow-warden/phase1_idle_2.png',
          'assets/sprites/bosses/hollow-warden/phase1_idle_3.png'
        ]
      },
      phase2: {
        idle: [
          'assets/sprites/bosses/hollow-warden/phase2_idle_0.png',
          'assets/sprites/bosses/hollow-warden/phase2_idle_1.png',
          'assets/sprites/bosses/hollow-warden/phase2_idle_2.png',
          'assets/sprites/bosses/hollow-warden/phase2_idle_3.png'
        ]
      }
    }
  },
  player: {
    male: {
      down: {
        idle: ['assets/sprites/player/male/down_idle_0.png', 'assets/sprites/player/male/down_idle_1.png'],
        walk: ['assets/sprites/player/male/down_walk_0.png', 'assets/sprites/player/male/down_walk_1.png', 'assets/sprites/player/male/down_walk_2.png', 'assets/sprites/player/male/down_walk_3.png']
      },
      up: {
        idle: ['assets/sprites/player/male/up_idle_0.png', 'assets/sprites/player/male/up_idle_1.png'],
        walk: ['assets/sprites/player/male/up_walk_0.png', 'assets/sprites/player/male/up_walk_1.png', 'assets/sprites/player/male/up_walk_2.png', 'assets/sprites/player/male/up_walk_3.png']
      },
      left: {
        idle: ['assets/sprites/player/male/left_idle_0.png', 'assets/sprites/player/male/left_idle_1.png'],
        walk: ['assets/sprites/player/male/left_walk_0.png', 'assets/sprites/player/male/left_walk_1.png', 'assets/sprites/player/male/left_walk_2.png', 'assets/sprites/player/male/left_walk_3.png']
      },
      right: {
        idle: ['assets/sprites/player/male/right_idle_0.png', 'assets/sprites/player/male/right_idle_1.png'],
        walk: ['assets/sprites/player/male/right_walk_0.png', 'assets/sprites/player/male/right_walk_1.png', 'assets/sprites/player/male/right_walk_2.png', 'assets/sprites/player/male/right_walk_3.png']
      }
    },
    female: {
      down: {
        idle: ['assets/sprites/player/female/down_idle_0.png', 'assets/sprites/player/female/down_idle_1.png'],
        walk: ['assets/sprites/player/female/down_walk_0.png', 'assets/sprites/player/female/down_walk_1.png', 'assets/sprites/player/female/down_walk_2.png', 'assets/sprites/player/female/down_walk_3.png']
      },
      up: {
        idle: ['assets/sprites/player/female/up_idle_0.png', 'assets/sprites/player/female/up_idle_1.png'],
        walk: ['assets/sprites/player/female/up_walk_0.png', 'assets/sprites/player/female/up_walk_1.png', 'assets/sprites/player/female/up_walk_2.png', 'assets/sprites/player/female/up_walk_3.png']
      },
      left: {
        idle: ['assets/sprites/player/female/left_idle_0.png', 'assets/sprites/player/female/left_idle_1.png'],
        walk: ['assets/sprites/player/female/left_walk_0.png', 'assets/sprites/player/female/left_walk_1.png', 'assets/sprites/player/female/left_walk_2.png', 'assets/sprites/player/female/left_walk_3.png']
      },
      right: {
        idle: ['assets/sprites/player/female/right_idle_0.png', 'assets/sprites/player/female/right_idle_1.png'],
        walk: ['assets/sprites/player/female/right_walk_0.png', 'assets/sprites/player/female/right_walk_1.png', 'assets/sprites/player/female/right_walk_2.png', 'assets/sprites/player/female/right_walk_3.png']
      }
    },
    other: {
      down: {
        idle: ['assets/sprites/player/other/down_idle_0.png', 'assets/sprites/player/other/down_idle_1.png'],
        walk: ['assets/sprites/player/other/down_walk_0.png', 'assets/sprites/player/other/down_walk_1.png', 'assets/sprites/player/other/down_walk_2.png', 'assets/sprites/player/other/down_walk_3.png']
      },
      up: {
        idle: ['assets/sprites/player/other/up_idle_0.png', 'assets/sprites/player/other/up_idle_1.png'],
        walk: ['assets/sprites/player/other/up_walk_0.png', 'assets/sprites/player/other/up_walk_1.png', 'assets/sprites/player/other/up_walk_2.png', 'assets/sprites/player/other/up_walk_3.png']
      },
      left: {
        idle: ['assets/sprites/player/other/left_idle_0.png', 'assets/sprites/player/other/left_idle_1.png'],
        walk: ['assets/sprites/player/other/left_walk_0.png', 'assets/sprites/player/other/left_walk_1.png', 'assets/sprites/player/other/left_walk_2.png', 'assets/sprites/player/other/left_walk_3.png']
      },
      right: {
        idle: ['assets/sprites/player/other/right_idle_0.png', 'assets/sprites/player/other/right_idle_1.png'],
        walk: ['assets/sprites/player/other/right_walk_0.png', 'assets/sprites/player/other/right_walk_1.png', 'assets/sprites/player/other/right_walk_2.png', 'assets/sprites/player/other/right_walk_3.png']
      }
    }
  }
};

// Cache for preloaded sprite images (now stores arrays of frames)
var preloadedSprites = {
  creatures: {},
  player: { male: {}, female: {}, other: {} },
  loaded: false
};

// Preload all sprites and track which ones are available
var preloadSprites = () => {
  return new Promise((resolve) => {
    const loadImage = (src) => {
      return new Promise((imgResolve) => {
        const img = new Image();
        img.onload = () => imgResolve({ src, loaded: true, img });
        img.onerror = () => imgResolve({ src, loaded: false, img: null });
        img.src = src;
      });
    };

    // Load an array of frames, returns array of Image objects (null for failed loads)
    const loadFrameArray = async (srcArray) => {
      const results = await Promise.all(srcArray.map(src => loadImage(src)));
      const loadedFrames = results.filter(r => r.loaded).map(r => r.img);
      // Return array only if at least first frame loaded
      return loadedFrames.length > 0 ? loadedFrames : null;
    };

    const promises = [];

    // Load creature sprites (now with frame arrays)
    Object.entries(SPRITE_MANIFEST.creatures).forEach(([type, variants]) => {
      preloadedSprites.creatures[type] = {};
      Object.entries(variants).forEach(([variant, animations]) => {
        preloadedSprites.creatures[type][variant] = {};
        Object.entries(animations).forEach(([animType, srcArray]) => {
          promises.push(
            loadFrameArray(srcArray).then(frames => {
              preloadedSprites.creatures[type][variant][animType] = frames;
            })
          );
        });
      });
    });

    // Load player sprites (by appearance, direction, then animation type)
    Object.entries(SPRITE_MANIFEST.player).forEach(([appearance, directions]) => {
      preloadedSprites.player[appearance] = {};
      Object.entries(directions).forEach(([direction, animations]) => {
        preloadedSprites.player[appearance][direction] = {};
        Object.entries(animations).forEach(([animType, srcArray]) => {
          promises.push(
            loadFrameArray(srcArray).then(frames => {
              preloadedSprites.player[appearance][direction][animType] = frames;
            })
          );
        });
      });
    });

    Promise.all(promises).then(() => {
      preloadedSprites.loaded = true;
      console.log('Sprites preloaded:', {
        creatures: Object.keys(preloadedSprites.creatures).filter(t =>
          Object.values(preloadedSprites.creatures[t]).some(v =>
            v && Object.values(v).some(frames => frames !== null)
          )
        ),
        player: Object.keys(preloadedSprites.player).filter(appearance =>
          Object.values(preloadedSprites.player[appearance] || {}).some(dir =>
            dir && Object.values(dir).some(frames => frames !== null)
          )
        )
      });
      resolve();
    });
  });
};

// Check if a sprite animation is available
var hasSpriteLoaded = (category, type, variant = 'base', animType = 'idle') => {
  if (category === 'creature') {
    const frames = preloadedSprites.creatures[type]?.[variant]?.[animType];
    return frames !== null && frames !== undefined && frames.length > 0;
  }
  if (category === 'player') {
    // type = appearance, variant = direction, animType = 'idle' or 'walk'
    const frames = preloadedSprites.player[type]?.[variant]?.[animType];
    return frames !== null && frames !== undefined && frames.length > 0;
  }
  return false;
};

// Scar threshold constants for sprite selection
var SCAR_THRESHOLD_HOLLOWED = 5;

// ============= GAME DATA =============

var STARTERS = {
  cindrath: {
    id: 'cindrath',
    name: 'Cindrath',
    type: 'fire',
    maxHp: 45,
    maxStamina: 20,
    moves: [
      { name: 'Ember Slash', cost: 6, damage: 12, priority: false, effect: 'burn', effectChance: 20 },
      { name: 'Quick Strike', cost: 3, damage: 5, priority: true },
      { name: 'Guard', cost: 2, damage: 0, effect: 'guard' },
      { name: 'Rest', cost: 0, damage: 0, effect: 'rest' }
    ]
  },
  marshveil: {
    id: 'marshveil',
    name: 'Marshveil',
    type: 'water',
    maxHp: 50,
    maxStamina: 18,
    moves: [
      { name: 'Tide Crash', cost: 7, damage: 14, priority: false, effect: 'chill', effectChance: 20 },
      { name: 'Quick Strike', cost: 3, damage: 5, priority: true },
      { name: 'Guard', cost: 2, damage: 0, effect: 'guard' },
      { name: 'Rest', cost: 0, damage: 0, effect: 'rest' }
    ]
  },
  thornwick: {
    id: 'thornwick',
    name: 'Thornwick',
    type: 'grass',
    maxHp: 40,
    maxStamina: 24,
    moves: [
      { name: 'Vine Lash', cost: 5, damage: 10, priority: false, effect: 'poison', effectChance: 20 },
      { name: 'Quick Strike', cost: 3, damage: 5, priority: true },
      { name: 'Guard', cost: 2, damage: 0, effect: 'guard' },
      { name: 'Rest', cost: 0, damage: 0, effect: 'rest' }
    ]
  },
  umbravine: {
    id: 'umbravine',
    name: 'Umbravine',
    type: 'dark',
    maxHp: 42,
    maxStamina: 22,
    lore: 'Vines that grew in places the light forgot',
    moves: [
      { name: 'Shadow Lash', cost: 6, damage: 12, priority: false },
      { name: 'Void Drain', cost: 8, damage: 8, effect: 'drain', drainHp: 4, drainStamina: 4 },
      { name: 'Guard', cost: 2, damage: 0, effect: 'guard' },
      { name: 'Rest', cost: 0, damage: 0, effect: 'rest' }
    ]
  },
  solrath: {
    id: 'solrath',
    name: 'Solrath',
    type: 'light',
    maxHp: 48,
    maxStamina: 18,
    lore: 'Ember of the last dawn, before the ash',
    moves: [
      { name: 'Radiant Burst', cost: 5, damage: 11, priority: false },
      { name: 'Purifying Light', cost: 7, damage: 0, effect: 'purify', healAmount: 10 },
      { name: 'Guard', cost: 2, damage: 0, effect: 'guard' },
      { name: 'Rest', cost: 0, damage: 0, effect: 'rest' }
    ]
  }
};

var WILD_CREATURES = {
  wildCindrath: {
    id: 'wildCindrath',
    name: 'Wild Cindrath',
    type: 'fire',
    maxHp: 30,
    maxStamina: 15,
    souls: 12,
    moves: [
      { name: 'Ember Slash', cost: 6, damage: 9, priority: false },
      { name: 'Quick Strike', cost: 3, damage: 4, priority: true },
      { name: 'Rest', cost: 0, damage: 0, effect: 'rest' }
    ]
  },
  wildMarshveil: {
    id: 'wildMarshveil',
    name: 'Wild Marshveil',
    type: 'water',
    maxHp: 30,
    maxStamina: 15,
    souls: 12,
    moves: [
      { name: 'Tide Crash', cost: 7, damage: 10, priority: false },
      { name: 'Quick Strike', cost: 3, damage: 4, priority: true },
      { name: 'Rest', cost: 0, damage: 0, effect: 'rest' }
    ]
  },
  wildThornwick: {
    id: 'wildThornwick',
    name: 'Wild Thornwick',
    type: 'grass',
    maxHp: 30,
    maxStamina: 15,
    souls: 12,
    moves: [
      { name: 'Vine Lash', cost: 5, damage: 8, priority: false },
      { name: 'Quick Strike', cost: 3, damage: 4, priority: true },
      { name: 'Rest', cost: 0, damage: 0, effect: 'rest' }
    ]
  },
  wildUmbravine: {
    id: 'wildUmbravine',
    name: 'Wild Umbravine',
    type: 'dark',
    maxHp: 35,
    maxStamina: 18,
    souls: 18,
    moves: [
      { name: 'Shadow Lash', cost: 6, damage: 10, priority: false },
      { name: 'Quick Strike', cost: 3, damage: 4, priority: true },
      { name: 'Rest', cost: 0, damage: 0, effect: 'rest' }
    ]
  },
  wildSolrath: {
    id: 'wildSolrath',
    name: 'Wild Solrath',
    type: 'light',
    maxHp: 38,
    maxStamina: 16,
    souls: 20,
    moves: [
      { name: 'Radiant Burst', cost: 5, damage: 9, priority: false },
      { name: 'Quick Strike', cost: 3, damage: 4, priority: true },
      { name: 'Rest', cost: 0, damage: 0, effect: 'rest' }
    ]
  }
};

var BOSS = {
  obsidianHound: {
    id: 'obsidianHound',
    name: 'Obsidian Hound',
    type: 'fire',
    maxHp: 60,
    maxStamina: 22,
    souls: 100,
    moves: [
      { name: 'Ember Slash', cost: 6, damage: 12, priority: false },
      { name: 'Flame Wall', cost: 8, damage: 10, effect: 'burn' },
      { name: 'Guard', cost: 2, damage: 0, effect: 'guard' }
    ],
    phase2Moves: [
      { name: 'Ember Slash', cost: 6, damage: 12, priority: false },
      { name: 'Flame Wall', cost: 8, damage: 10, effect: 'burn' },
      { name: 'Desperation Fang', cost: 10, damage: 20, effect: 'recoil', recoilDamage: 5 },
      { name: 'Guard', cost: 2, damage: 0, effect: 'guard' }
    ]
  },
  hollowWarden: {
    id: 'hollowWarden',
    name: 'Hollow Warden',
    type: 'dark', // Phase 1: Dark type
    maxHp: 70,
    maxStamina: 24,
    souls: 200,
    moves: [
      { name: 'Shadow Lash', cost: 6, damage: 12, priority: false },
      { name: 'Void Grasp', cost: 5, damage: 8, effect: 'drainStamina', drainAmount: 4 },
      { name: 'Guard', cost: 2, damage: 0, effect: 'guard' }
    ],
    phase2Moves: [
      { name: 'Shattered Light', cost: 7, damage: 14, priority: false }, // Super effective vs Fire and Grass
      { name: 'Desperate Void', cost: 8, damage: 18, effect: 'recoil', recoilDamage: 6 },
      { name: 'Void Grasp', cost: 5, damage: 8, effect: 'drainStamina', drainAmount: 4 },
      { name: 'Guard', cost: 2, damage: 0, effect: 'guard' }
    ],
    phase2Type: 'darklight' // Dual type in phase 2
  }
};

var TYPE_CHART = {
  fire: { fire: 1.0, water: 0.5, grass: 1.5, dark: 1.0, light: 0.5, darklight: 0.75 },
  water: { fire: 1.5, water: 1.0, grass: 0.5, dark: 1.0, light: 1.0, darklight: 1.0 },
  grass: { fire: 0.5, water: 1.5, grass: 1.0, dark: 0.5, light: 1.0, darklight: 0.75 },
  dark: { fire: 1.0, water: 1.0, grass: 1.5, dark: 1.0, light: 1.5, darklight: 1.25 },
  light: { fire: 1.5, water: 1.0, grass: 1.0, dark: 0.5, light: 1.0, darklight: 1.25 },
  darklight: { fire: 1.25, water: 1.0, grass: 1.25, dark: 0.75, light: 0.75, darklight: 1.0 }
};

var SCAR_TYPES = [
  { id: 'fractured', name: 'Fractured', effect: 'maxHp', value: -5, description: '-5 max HP' },
  { id: 'hesitant', name: 'Hesitant', effect: 'maxStamina', value: -2, description: '-2 max Stamina' },
  { id: 'flinching', name: 'Flinching', effect: 'noPriority', description: 'Quick Strike no longer goes first' }
];

var TITLES = [
  { id: 'ashen_seeker', name: 'Ashen Seeker', description: 'Found the hidden chamber' },
  { id: 'unscarred', name: 'Unscarred', description: 'Completed a run with zero scars' },
  { id: 'first_flame', name: 'First Flame', description: 'Played during the demo period' }
];

// ASHEN PATH - 6 wide × 8 tall - Tutorial area, desolate wasteland
// B = Bonfire (spawn), G = Grass (encounters), P = Path, W = Wall, X = Gate to Fallen Keep
var ASHEN_PATH = [
  ['W', 'W', 'W', 'W', 'W', 'W'],
  ['W', 'B', 'P', 'P', 'G', 'W'],
  ['W', 'P', 'W', 'P', 'P', 'W'],
  ['W', 'G', 'P', 'P', 'W', 'W'],
  ['W', 'P', 'W', 'G', 'P', 'W'],
  ['W', 'P', 'P', 'P', 'P', 'W'],
  ['W', 'W', 'P', 'W', 'W', 'W'],
  ['W', 'W', 'X', 'W', 'W', 'W']
];

// FALLEN KEEP - 8 wide × 12 tall - Dungeon with Keeper Varek
// B = Bonfire, E = Exit to Ashen Path, K = Boss (Keeper Varek), P = Path
// T = Torch (wall decoration), W = Wall
var FALLEN_KEEP = [
  ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
  ['W', 'T', 'P', 'P', 'P', 'P', 'T', 'W'],
  ['W', 'P', 'P', 'W', 'W', 'P', 'P', 'W'],
  ['W', 'P', 'W', 'W', 'W', 'W', 'P', 'W'],
  ['W', 'P', 'P', 'P', 'P', 'P', 'P', 'W'],
  ['W', 'W', 'W', 'P', 'P', 'W', 'W', 'W'],
  ['W', 'T', 'P', 'P', 'P', 'P', 'T', 'W'],
  ['W', 'P', 'P', 'B', 'P', 'P', 'P', 'W'],
  ['W', 'P', 'W', 'W', 'W', 'W', 'P', 'W'],
  ['W', 'P', 'P', 'P', 'K', 'P', 'P', 'W'],
  ['W', 'W', 'W', 'P', 'P', 'W', 'W', 'W'],
  ['W', 'W', 'W', 'E', 'W', 'W', 'W', 'W']
];

// THE HOLLOW DEEP - 10 wide × 16 tall - Post-game void dungeon
// E = Entrance (from Fallen Keep), G = Grass (Dark/Light encounters only)
// B = Bonfire, K = Boss (Hollow Warden), P = Path, W = Wall, X = Exit to Labyrinth
var HOLLOW_DEEP = [
  ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
  ['W', 'P', 'P', 'P', 'G', 'G', 'P', 'P', 'P', 'W'],
  ['W', 'P', 'W', 'W', 'W', 'W', 'W', 'W', 'P', 'W'],
  ['W', 'P', 'W', 'P', 'P', 'P', 'P', 'W', 'P', 'W'],
  ['W', 'G', 'W', 'P', 'W', 'W', 'P', 'W', 'P', 'W'],
  ['W', 'P', 'P', 'P', 'W', 'W', 'P', 'P', 'G', 'W'],
  ['W', 'W', 'W', 'P', 'W', 'W', 'W', 'W', 'P', 'W'],
  ['W', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'W'],
  ['W', 'P', 'W', 'W', 'B', 'W', 'W', 'W', 'P', 'W'],
  ['W', 'P', 'W', 'P', 'P', 'P', 'W', 'G', 'P', 'W'],
  ['W', 'P', 'W', 'P', 'W', 'P', 'W', 'P', 'P', 'W'],
  ['W', 'G', 'P', 'P', 'W', 'P', 'P', 'P', 'W', 'W'],
  ['W', 'W', 'W', 'P', 'W', 'W', 'W', 'P', 'W', 'W'],
  ['W', 'P', 'P', 'P', 'P', 'K', 'P', 'P', 'P', 'W'],
  ['W', 'W', 'W', 'W', 'P', 'P', 'W', 'W', 'X', 'W'],
  ['W', 'W', 'W', 'W', 'E', 'W', 'W', 'W', 'W', 'W']
];

// ============= THE LABYRINTH (Post-Hollow Deep) =============
// 20x20 maze - Entry from Hollow Deep at bottom, Ashen Gate at top
// Tile codes: W=Wall, P=Path, E=Entry, B=Bonfire, A=AshenGate, S=SecretDoor, L=LoreObject, G=Grass
var LABYRINTH = [
  ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'A', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
  ['W', 'P', 'P', 'P', 'P', 'W', 'P', 'P', 'P', 'P', 'P', 'W', 'P', 'P', 'P', 'P', 'L', 'P', 'P', 'W'],
  ['W', 'P', 'W', 'W', 'P', 'W', 'P', 'W', 'W', 'W', 'P', 'W', 'P', 'W', 'W', 'W', 'W', 'W', 'P', 'W'],
  ['W', 'P', 'W', 'P', 'P', 'P', 'P', 'P', 'W', 'P', 'P', 'P', 'P', 'P', 'W', 'P', 'P', 'P', 'P', 'W'],
  ['W', 'P', 'W', 'W', 'W', 'W', 'W', 'P', 'W', 'P', 'W', 'W', 'W', 'P', 'W', 'P', 'W', 'W', 'P', 'W'],
  ['W', 'P', 'P', 'P', 'G', 'P', 'P', 'P', 'W', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'W', 'P', 'P', 'W'],
  ['W', 'W', 'W', 'P', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'P', 'W', 'W', 'W', 'W', 'P', 'W', 'W'],
  ['W', 'L', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'W'],
  ['W', 'W', 'W', 'W', 'W', 'P', 'W', 'W', 'W', 'W', 'W', 'P', 'W', 'W', 'W', 'W', 'W', 'W', 'P', 'W'],
  ['W', 'P', 'P', 'P', 'P', 'P', 'W', 'P', 'P', 'P', 'P', 'P', 'W', 'P', 'P', 'S', 'W', 'P', 'P', 'W'],
  ['W', 'P', 'W', 'W', 'W', 'W', 'W', 'P', 'W', 'W', 'W', 'W', 'W', 'P', 'W', 'W', 'W', 'P', 'W', 'W'],
  ['W', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'B', 'P', 'P', 'P', 'P', 'P', 'W', 'P', 'P', 'P', 'P', 'W'],
  ['W', 'W', 'W', 'W', 'W', 'P', 'W', 'W', 'W', 'W', 'W', 'P', 'W', 'W', 'W', 'P', 'W', 'W', 'P', 'W'],
  ['W', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'G', 'P', 'P', 'W', 'P', 'P', 'W'],
  ['W', 'P', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'P', 'W', 'W', 'W', 'W', 'W', 'P', 'W'],
  ['W', 'P', 'P', 'P', 'L', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'W'],
  ['W', 'P', 'W', 'W', 'W', 'W', 'W', 'P', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'P', 'W'],
  ['W', 'G', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'L', 'P', 'W'],
  ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'E', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
  ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W']
];


// ============= GBC COLOR PALETTE =============
var GBC = {
  bg: '#0f0f1a',
  bgLight: '#1a1a2e',
  bgPanel: '#16213e',
  border: '#4a5568',
  borderLight: '#718096',
  text: '#e8e8e8',
  textDim: '#a0aec0',
  gold: '#f6e05e',
  red: '#fc8181',
  green: '#68d391',
  blue: '#63b3ed',
  fire: '#f6ad55',
  water: '#4299e1',
  grass: '#48bb78',
  dark: '#9f7aea',
  light: '#faf089',
  // Tile colors (default/Ashen Path)
  wallDark: '#1a1a2e',
  wallMid: '#2d3748',
  wallLight: '#4a5568',
  pathDark: '#744210',
  pathMid: '#975a16',
  pathLight: '#b7791f',
  grassDark: '#276749',
  grassMid: '#38a169',
  grassLight: '#48bb78',
};

// Area-specific tile palettes
var AREA_PALETTES = {
  // Ashen Path - desolate, burned, gray-brown tones
  ashenPath: {
    wallDark: '#1f1a15',
    wallMid: '#3d3530',
    wallLight: '#5a5048',
    pathDark: '#4a4035',
    pathMid: '#6b5d50',
    pathLight: '#8c7a6a',
    grassDark: '#3d4a35',
    grassMid: '#526b45',
    grassLight: '#688c58',
    accent: '#8b7355',
    glow: 'rgba(139, 115, 85, 0.3)'
  },
  // Fallen Keep - dark stone, torchlit oranges
  fallenKeep: {
    wallDark: '#1a1520',
    wallMid: '#2e2535',
    wallLight: '#453850',
    pathDark: '#3a2a25',
    pathMid: '#5c4035',
    pathLight: '#7a5545',
    grassDark: '#3d3530',
    grassMid: '#524540',
    grassLight: '#6b5850',
    accent: '#ed8936',
    glow: 'rgba(237, 137, 54, 0.4)',
    torch: '#f6ad55'
  },
  // Hollow Deep - void purples, sickly greens
  hollowDeep: {
    wallDark: '#0d0a14',
    wallMid: '#1a1528',
    wallLight: '#2d2540',
    pathDark: '#1a1a25',
    pathMid: '#252535',
    pathLight: '#353548',
    grassDark: '#1a2a20',
    grassMid: '#253830',
    grassLight: '#354840',
    accent: '#9f7aea',
    glow: 'rgba(159, 122, 234, 0.5)',
    void: '#6b46c1'
  },
  // The Labyrinth - ancient gold, mysterious blues
  labyrinth: {
    wallDark: '#151a25',
    wallMid: '#202838',
    wallLight: '#303a50',
    pathDark: '#252520',
    pathMid: '#3a3830',
    pathLight: '#504a40',
    grassDark: '#2a3530',
    grassMid: '#3a4a40',
    grassLight: '#4a5a50',
    accent: '#d69e2e',
    glow: 'rgba(214, 158, 46, 0.3)',
    ancient: '#c9a227',
    mystery: '#4a6fa5'
  }
};


var PLAYER_PALETTES = {
  male: {
    skin: '#f6d5a8',
    hair: '#4a3728',        // Brown short hair
    cloak: '#2b6cb0',       // Blue/teal cloak
    cloakLight: '#4fd1c5',  // Teal accent
    pants: '#2d3748',
    outline: '#1a1a2e'
  },
  female: {
    skin: '#f6d5a8',
    hair: '#9b2c2c',        // Auburn/reddish hair
    cloak: '#c53030',       // Red/maroon cloak
    cloakLight: '#feb2b2',  // Light red accent
    pants: '#2d3748',
    outline: '#1a1a2e'
  },
  other: {
    skin: '#4a5568',        // Shadowed face (hood)
    hair: '#4a5568',        // Hood color (gray)
    cloak: '#805ad5',       // Purple cloak
    cloakLight: '#b794f4',  // Light purple accent
    pants: '#2d3748',
    outline: '#1a1a2e'
  }
};

// ============= UI STYLES =============
var styles = {
  container: {
    fontFamily: '"Press Start 2P", monospace',
    fontSize: 'var(--font-base)',
    backgroundColor: GBC.bg,
    color: GBC.text,
    minHeight: '100vh',
    padding: 'var(--spacing-sm)',
    boxSizing: 'border-box',
    imageRendering: 'pixelated'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 'var(--spacing-sm) var(--spacing-md)',
    backgroundColor: GBC.bgPanel,
    border: `3px solid ${GBC.border}`,
    borderRadius: '0',
    marginBottom: 'var(--spacing-sm)',
    boxShadow: `inset -2px -2px 0 ${GBC.borderLight}, inset 2px 2px 0 #0a0a14`
  },
  souls: {
    color: GBC.gold,
    textShadow: '1px 1px 0 #744210',
    fontSize: 'var(--font-base)'
  },
  mapContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 'var(--spacing-sm)'
  },
  grid: {
    display: 'grid',
    gap: '0px',
    backgroundColor: GBC.wallDark,
    padding: 'var(--spacing-xs)',
    border: `4px solid ${GBC.border}`,
    boxShadow: `inset -2px -2px 0 ${GBC.borderLight}, inset 2px 2px 0 #0a0a14, 0 4px 8px rgba(0,0,0,0.5)`
  },
  tile: {
    width: 'var(--tile-size)',
    height: 'var(--tile-size)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden'
  },
  teamStatus: {
    backgroundColor: GBC.bgPanel,
    padding: 'var(--spacing-sm)',
    border: `3px solid ${GBC.border}`,
    boxShadow: `inset -2px -2px 0 ${GBC.borderLight}, inset 2px 2px 0 #0a0a14`
  },
  creatureStatus: {
    marginBottom: 'var(--spacing-xs)',
    padding: 'var(--spacing-xs)',
    backgroundColor: GBC.bgLight,
    border: `2px solid ${GBC.border}`,
    fontSize: 'var(--font-sm)'
  },
  hpBar: {
    height: 'var(--spacing-sm)',
    backgroundColor: GBC.wallDark,
    marginTop: 'var(--spacing-xs)',
    position: 'relative',
    border: `2px solid ${GBC.border}`,
    boxShadow: 'inset 1px 1px 0 #0a0a14'
  },
  hpFill: {
    height: '100%',
    transition: 'width 0.2s',
    imageRendering: 'pixelated'
  },
  staminaBar: {
    height: 'var(--spacing-sm)',
    backgroundColor: GBC.wallDark,
    marginTop: 'var(--spacing-xs)',
    border: `2px solid ${GBC.border}`,
    boxShadow: 'inset 1px 1px 0 #0a0a14'
  },
  staminaFill: {
    height: '100%',
    backgroundColor: GBC.blue,
    transition: 'width 0.2s'
  },
  battleContainer: {
    padding: 'var(--spacing-sm)',
    backgroundColor: GBC.bg
  },
  battleCreature: {
    padding: 'var(--spacing-md)',
    backgroundColor: GBC.bgPanel,
    border: `3px solid ${GBC.border}`,
    marginBottom: 'var(--spacing-sm)',
    boxShadow: `inset -2px -2px 0 ${GBC.borderLight}, inset 2px 2px 0 #0a0a14`,
    fontSize: 'var(--font-sm)'
  },
  battleAnimation: {
    height: 'var(--battle-height)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GBC.bgLight,
    margin: 'var(--spacing-sm) 0',
    border: `3px solid ${GBC.border}`,
    fontSize: 'var(--font-sm)',
    textAlign: 'center',
    padding: 'var(--spacing-sm)',
    boxShadow: `inset -2px -2px 0 ${GBC.borderLight}, inset 2px 2px 0 #0a0a14`
  },
  moveButtons: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'var(--spacing-sm)',
    marginTop: 'var(--spacing-sm)'
  },
  moveButton: {
    padding: 'var(--spacing-md) var(--spacing-sm)',
    backgroundColor: GBC.bgPanel,
    border: `3px solid ${GBC.border}`,
    color: GBC.text,
    cursor: 'pointer',
    fontFamily: '"Press Start 2P", monospace',
    fontSize: 'var(--font-sm)',
    textAlign: 'left',
    boxShadow: `inset -2px -2px 0 ${GBC.borderLight}, inset 2px 2px 0 #0a0a14`,
    transition: 'transform 0.1s',
    minHeight: '48px'
  },
  moveButtonDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed'
  },
  starterSelect: {
    textAlign: 'center',
    padding: 'var(--spacing-xl) var(--spacing-lg)'
  },
  starterCard: {
    display: 'inline-block',
    width: 'clamp(150px, 25vw, 220px)',
    padding: 'var(--spacing-lg) var(--spacing-md)',
    margin: 'var(--spacing-sm)',
    backgroundColor: GBC.bgPanel,
    border: `4px solid ${GBC.border}`,
    cursor: 'pointer',
    verticalAlign: 'top',
    boxShadow: `inset -2px -2px 0 ${GBC.borderLight}, inset 2px 2px 0 #0a0a14`,
    transition: 'transform 0.1s'
  },
  scar: {
    display: 'inline-block',
    padding: '2px 4px',
    backgroundColor: '#3d1515',
    color: GBC.red,
    fontSize: 'var(--font-xs)',
    marginLeft: '3px',
    border: '2px solid #5a2020'
  },
  status: {
    display: 'inline-block',
    padding: '2px 4px',
    fontSize: 'var(--font-xs)',
    marginLeft: '3px'
  },
  winded: {
    backgroundColor: '#3d3215',
    color: GBC.gold,
    border: '2px solid #5a4a20'
  },
  burn: {
    backgroundColor: '#3d2015',
    color: '#f6ad55',
    border: '2px solid #5a3020'
  },
  victory: {
    textAlign: 'center',
    padding: 'var(--spacing-xl) var(--spacing-lg)',
    backgroundColor: '#0a1a0a',
    border: `4px solid ${GBC.green}`,
    margin: 'var(--spacing-lg)',
    boxShadow: `inset -3px -3px 0 #1a3a1a, inset 3px 3px 0 #051005`
  },
  gameOver: {
    textAlign: 'center',
    padding: 'var(--spacing-xl) var(--spacing-lg)',
    backgroundColor: '#1a0a0a',
    border: `4px solid ${GBC.red}`,
    margin: 'var(--spacing-lg)',
    boxShadow: `inset -3px -3px 0 #3a1a1a, inset 3px 3px 0 #100505`
  },
  button: {
    padding: 'var(--spacing-md) var(--spacing-xl)',
    backgroundColor: GBC.bgPanel,
    border: `4px solid ${GBC.border}`,
    color: GBC.text,
    cursor: 'pointer',
    fontFamily: '"Press Start 2P", monospace',
    fontSize: 'var(--font-base)',
    marginTop: 'var(--spacing-lg)',
    boxShadow: `inset -2px -2px 0 ${GBC.borderLight}, inset 2px 2px 0 #0a0a14`,
    outline: 'none'
  },
  typeIcon: {
    fontSize: 'var(--font-xl)'
  },
  log: {
    backgroundColor: GBC.bgLight,
    padding: 'var(--spacing-sm)',
    marginTop: 'var(--spacing-sm)',
    border: `3px solid ${GBC.border}`,
    maxHeight: 'clamp(70px, 10vh, 120px)',
    overflowY: 'auto',
    fontSize: 'var(--font-sm)',
    boxShadow: `inset 2px 2px 0 #0a0a14`
  },
  muteButton: {
    position: 'fixed',
    top: 'var(--spacing-sm)',
    right: 'var(--spacing-sm)',
    width: 'var(--button-size)',
    height: 'var(--button-size)',
    backgroundColor: GBC.bgPanel,
    border: `3px solid ${GBC.border}`,
    borderRadius: '0',
    color: GBC.textDim,
    cursor: 'pointer',
    fontFamily: '"Press Start 2P", monospace',
    fontSize: 'var(--font-lg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    boxShadow: `inset -2px -2px 0 ${GBC.borderLight}, inset 2px 2px 0 #0a0a14`
  },
  creatureSprite: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 'var(--spacing-sm)',
    transform: 'scale(var(--sprite-scale))'
  },
  battleSpriteArea: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 'var(--spacing-md)',
    backgroundColor: GBC.grassDark,
    border: `3px solid ${GBC.border}`,
    marginBottom: 'var(--spacing-sm)',
    minHeight: 'var(--battle-height)'
  },
  bindButton: {
    padding: 'var(--spacing-md) var(--spacing-sm)',
    backgroundColor: '#2a1a3a',
    border: `3px solid #6b46c1`,
    color: '#d6bcfa',
    cursor: 'pointer',
    fontFamily: '"Press Start 2P", monospace',
    fontSize: 'var(--font-sm)',
    textAlign: 'center',
    boxShadow: `inset -2px -2px 0 #805ad5, inset 2px 2px 0 #1a0a2e`,
    gridColumn: 'span 2',
    minHeight: '48px'
  },
  bindButtonDisabled: {
    backgroundColor: '#1a1a2a',
    borderColor: '#4a4a6a',
    color: '#6a6a8a',
    cursor: 'not-allowed'
  },
  bonfireMenu: {
    backgroundColor: GBC.bgPanel,
    border: `3px solid ${GBC.border}`,
    padding: 'var(--spacing-md)',
    marginTop: 'var(--spacing-sm)'
  },
  bonfireOption: {
    padding: 'var(--spacing-sm)',
    marginBottom: 'var(--spacing-xs)',
    backgroundColor: GBC.bgLight,
    border: `2px solid ${GBC.border}`,
    cursor: 'pointer',
    fontSize: 'var(--font-sm)',
    minHeight: '48px',
    display: 'flex',
    alignItems: 'center'
  },
  helpButton: {
    position: 'fixed',
    top: 'var(--spacing-sm)',
    right: 'calc(var(--button-size) + var(--spacing-lg))',
    width: 'var(--button-size)',
    height: 'var(--button-size)',
    backgroundColor: GBC.bgPanel,
    border: `3px solid ${GBC.border}`,
    borderRadius: '0',
    color: GBC.textDim,
    cursor: 'pointer',
    fontFamily: '"Press Start 2P", monospace',
    fontSize: 'var(--font-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    boxShadow: `inset -2px -2px 0 ${GBC.borderLight}, inset 2px 2px 0 #0a0a14`
  },
  helpOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 10, 20, 0.95)',
    zIndex: 2000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--spacing-lg)'
  },
  helpContent: {
    backgroundColor: GBC.bgPanel,
    border: `4px solid ${GBC.border}`,
    padding: 'var(--spacing-lg)',
    maxWidth: 'clamp(400px, 50vw, 600px)',
    maxHeight: '90vh',
    overflowY: 'auto',
    fontFamily: '"Press Start 2P", monospace',
    boxShadow: `inset -3px -3px 0 ${GBC.borderLight}, inset 3px 3px 0 #0a0a14, 0 0 40px rgba(0,0,0,0.8)`
  },
  helpTitle: {
    color: GBC.red,
    fontSize: 'var(--font-md)',
    textAlign: 'center',
    marginBottom: 'var(--spacing-lg)',
    textShadow: '2px 2px 0 #3d1515'
  },
  helpSection: {
    marginBottom: 'var(--spacing-md)'
  },
  helpSectionTitle: {
    color: GBC.gold,
    fontSize: 'var(--font-sm)',
    marginBottom: 'var(--spacing-xs)'
  },
  helpText: {
    color: GBC.textDim,
    fontSize: 'var(--font-xs)',
    lineHeight: '1.6'
  },
  helpClose: {
    display: 'block',
    width: '100%',
    padding: 'var(--spacing-md)',
    marginTop: 'var(--spacing-lg)',
    backgroundColor: GBC.bgLight,
    border: `3px solid ${GBC.border}`,
    color: GBC.text,
    cursor: 'pointer',
    fontFamily: '"Press Start 2P", monospace',
    fontSize: 'var(--font-sm)',
    textAlign: 'center',
    boxShadow: `inset -2px -2px 0 ${GBC.borderLight}, inset 2px 2px 0 #0a0a14`
  },
  helpQuote: {
    color: GBC.textDim,
    fontSize: 'var(--font-xs)',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 'var(--spacing-md)'
  },
  prologue: {
    textAlign: 'center',
    padding: 'var(--spacing-xl) var(--spacing-lg)',
    backgroundColor: GBC.bg,
    minHeight: 'clamp(400px, 50vh, 600px)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  prologueLine: {
    color: GBC.textDim,
    fontSize: 'var(--font-sm)',
    marginBottom: 'var(--spacing-md)',
    lineHeight: '1.8'
  },
  prologueHighlight: {
    color: GBC.gold,
    fontSize: 'var(--font-sm)',
    marginBottom: 'var(--spacing-md)',
    lineHeight: '1.8'
  },
  examineOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 10, 20, 0.9)',
    zIndex: 1500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--spacing-lg)'
  },
  examineContent: {
    backgroundColor: GBC.bgPanel,
    border: `4px solid ${GBC.border}`,
    padding: 'var(--spacing-lg)',
    maxWidth: 'clamp(350px, 40vw, 500px)',
    fontFamily: '"Press Start 2P", monospace',
    boxShadow: `inset -3px -3px 0 ${GBC.borderLight}, inset 3px 3px 0 #0a0a14, 0 0 40px rgba(0,0,0,0.8)`
  },
  examineTitle: {
    color: GBC.gold,
    fontSize: 'var(--font-sm)',
    marginBottom: 'var(--spacing-md)',
    textAlign: 'center'
  },
  examineLine: {
    color: GBC.textDim,
    fontSize: 'var(--font-xs)',
    lineHeight: '1.8',
    marginBottom: 'var(--spacing-xs)'
  },
  examinePrompt: {
    color: GBC.border,
    fontSize: 'var(--font-xs)',
    textAlign: 'center',
    marginTop: 'var(--spacing-lg)'
  },
  credits: {
    textAlign: 'center',
    padding: 'var(--spacing-xl) var(--spacing-lg)',
    backgroundColor: GBC.bg,
    minHeight: 'clamp(400px, 50vh, 600px)'
  },
  creditsTitle: {
    color: GBC.red,
    fontSize: 'var(--font-lg)',
    marginBottom: 'var(--spacing-xl)',
    textShadow: '2px 2px 0 #3d1515'
  },
  creditsSection: {
    marginBottom: 'var(--spacing-lg)'
  },
  creditsLabel: {
    color: GBC.textDim,
    fontSize: 'var(--font-xs)',
    marginBottom: 'var(--spacing-xs)'
  },
  creditsValue: {
    color: GBC.text,
    fontSize: 'var(--font-sm)'
  },
  creditsQuote: {
    color: GBC.gold,
    fontSize: 'var(--font-xs)',
    fontStyle: 'italic',
    marginTop: 'var(--spacing-xl)',
    marginBottom: 'var(--spacing-sm)',
    lineHeight: '1.6'
  },
  victoryDialogue: {
    color: GBC.textDim,
    fontSize: 'var(--font-xs)',
    fontStyle: 'italic',
    marginBottom: 'var(--spacing-xs)',
    lineHeight: '1.6'
  },
  victoryTitle: {
    fontSize: 'var(--font-lg)',
    color: GBC.gold,
    marginBottom: 'var(--spacing-lg)',
    textShadow: '2px 2px 0 #744210'
  },
  victorySubtitle: {
    fontSize: 'var(--font-sm)',
    color: GBC.textDim,
    marginBottom: 'var(--spacing-lg)',
    fontStyle: 'italic'
  },
  pauseOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 10, 20, 0.95)',
    zIndex: 2000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  pauseMenu: {
    backgroundColor: GBC.bgPanel,
    border: `4px solid ${GBC.border}`,
    padding: 'var(--spacing-xl)',
    minWidth: 'clamp(280px, 30vw, 400px)',
    fontFamily: '"Press Start 2P", monospace',
    boxShadow: `inset -3px -3px 0 ${GBC.borderLight}, inset 3px 3px 0 #0a0a14, 0 0 60px rgba(0,0,0,0.9)`
  },
  pauseTitle: {
    color: GBC.textDim,
    fontSize: 'var(--font-base)',
    textAlign: 'center',
    marginBottom: 'var(--spacing-lg)',
    letterSpacing: '2px'
  },
  pauseOption: {
    padding: 'var(--spacing-md) var(--spacing-lg)',
    marginBottom: 'var(--spacing-sm)',
    backgroundColor: GBC.bgLight,
    border: `3px solid ${GBC.border}`,
    color: GBC.text,
    cursor: 'pointer',
    fontSize: 'var(--font-sm)',
    textAlign: 'center',
    transition: 'border-color 0.1s'
  },
  pauseOptionDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed'
  },
  gearButton: {
    position: 'fixed',
    top: 'var(--spacing-sm)',
    right: 'calc(var(--button-size) * 2 + var(--spacing-xl))',
    width: 'var(--button-size)',
    height: 'var(--button-size)',
    backgroundColor: GBC.bgPanel,
    border: `3px solid ${GBC.border}`,
    borderRadius: '0',
    color: GBC.textDim,
    cursor: 'pointer',
    fontFamily: '"Press Start 2P", monospace',
    fontSize: 'var(--font-lg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    boxShadow: `inset -2px -2px 0 ${GBC.borderLight}, inset 2px 2px 0 #0a0a14`
  },
  confirmOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 10, 20, 0.95)',
    zIndex: 2500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  confirmDialog: {
    backgroundColor: GBC.bgPanel,
    border: `4px solid ${GBC.red}`,
    padding: 'var(--spacing-xl)',
    maxWidth: 'clamp(320px, 35vw, 450px)',
    fontFamily: '"Press Start 2P", monospace',
    boxShadow: `inset -3px -3px 0 #5a2020, inset 3px 3px 0 #0a0a14, 0 0 40px rgba(0,0,0,0.8)`
  },
  confirmText: {
    color: GBC.text,
    fontSize: 'var(--font-sm)',
    textAlign: 'center',
    marginBottom: 'var(--spacing-lg)',
    lineHeight: '1.6'
  },
  confirmButtons: {
    display: 'flex',
    gap: 'var(--spacing-md)',
    justifyContent: 'center'
  },
  confirmButton: {
    padding: 'var(--spacing-md) var(--spacing-lg)',
    backgroundColor: GBC.bgLight,
    border: `3px solid ${GBC.border}`,
    color: GBC.text,
    cursor: 'pointer',
    fontFamily: '"Press Start 2P", monospace',
    fontSize: 'var(--font-sm)'
  },
  confirmButtonDanger: {
    borderColor: GBC.red,
    color: GBC.red
  },
  loadScreen: {
    textAlign: 'center',
    padding: 'var(--spacing-xl) var(--spacing-lg)',
    backgroundColor: GBC.bg
  },
  loadTitle: {
    color: GBC.textDim,
    fontSize: 'var(--font-md)',
    marginBottom: 'var(--spacing-xl)'
  },
  saveSlot: {
    backgroundColor: GBC.bgPanel,
    border: `3px solid ${GBC.border}`,
    padding: 'var(--spacing-lg)',
    marginBottom: 'var(--spacing-lg)',
    textAlign: 'left'
  },
  saveSlotTitle: {
    color: GBC.gold,
    fontSize: 'var(--font-sm)',
    marginBottom: 'var(--spacing-md)'
  },
  saveSlotStat: {
    color: GBC.textDim,
    fontSize: 'var(--font-xs)',
    marginBottom: 'var(--spacing-xs)'
  },
  saveNotification: {
    position: 'fixed',
    bottom: 'var(--spacing-lg)',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: GBC.bgPanel,
    border: `3px solid ${GBC.gold}`,
    padding: 'var(--spacing-md) var(--spacing-xl)',
    color: GBC.gold,
    fontSize: 'var(--font-sm)',
    fontFamily: '"Press Start 2P", monospace',
    zIndex: 1500,
    boxShadow: `0 0 20px rgba(246, 224, 94, 0.3)`
  },
  difficultySelect: {
    textAlign: 'center',
    padding: 'var(--spacing-lg)'
  },
  difficultyTitle: {
    color: GBC.textDim,
    fontSize: 'var(--font-lg)',
    marginBottom: 'var(--spacing-xl)',
    letterSpacing: '2px'
  },
  difficultyCard: {
    display: 'block',
    width: '100%',
    maxWidth: 'clamp(300px, 50vw, 500px)',
    margin: '0 auto var(--spacing-md)',
    padding: 'var(--spacing-lg)',
    backgroundColor: GBC.bgPanel,
    border: `3px solid ${GBC.border}`,
    cursor: 'pointer',
    textAlign: 'left',
    boxShadow: `inset -2px -2px 0 ${GBC.borderLight}, inset 2px 2px 0 #0a0a14`,
    transition: 'border-color 0.1s'
  },
  difficultyHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 'var(--spacing-sm)'
  },
  difficultyIcon: {
    fontSize: 'var(--font-xl)',
    marginRight: 'var(--spacing-sm)'
  },
  difficultyName: {
    color: GBC.text,
    fontSize: 'var(--font-base)',
    marginRight: 'var(--spacing-sm)'
  },
  difficultySubtitle: {
    color: GBC.textDim,
    fontSize: 'var(--font-xs)'
  },
  difficultyDesc: {
    color: GBC.textDim,
    fontSize: 'var(--font-xs)',
    fontStyle: 'italic',
    marginBottom: 'var(--spacing-sm)'
  },
  difficultyDetails: {
    color: GBC.textDim,
    fontSize: 'var(--font-xs)',
    lineHeight: '1.6'
  },
  difficultyIndicator: {
    position: 'fixed',
    top: 'var(--spacing-sm)',
    left: 'var(--spacing-sm)',
    backgroundColor: GBC.bgPanel,
    border: `2px solid ${GBC.border}`,
    padding: 'var(--spacing-xs) var(--spacing-md)',
    fontSize: 'var(--font-base)',
    fontFamily: '"Press Start 2P", monospace',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-xs)'
  },
  difficultyIndicatorName: {
    fontSize: 'var(--font-xs)',
    color: GBC.textDim
  }
};

var getTypeColor = (type) => {
  switch (type) {
    case 'fire': return GBC.fire;
    case 'water': return GBC.water;
    case 'grass': return GBC.grass;
    case 'dark': return GBC.dark;
    case 'light': return GBC.light;
    case 'darklight': return '#9f7aea'; // Purple blend of dark and light
    default: return GBC.textDim;
  }
};

var getTypeIcon = (type) => {
  switch (type) {
    case 'fire': return '🔥';
    case 'water': return '💧';
    case 'grass': return '🌿';
    case 'dark': return '🌑';
    case 'light': return '✨';
    case 'darklight': return '🌓';
    default: return '⚪';
  }
};

var calculateDamage = (move, attacker, defender, attackerCreature, defenderCreature, difficultyMult = 1.0) => {
  if (move.damage === 0) return 0;
  let damage = move.damage;
  const effectiveness = TYPE_CHART[attackerCreature.type]?.[defenderCreature.type] ?? 1.0;
  damage = Math.floor(damage * effectiveness);

  if (defender.isGuarding) {
    damage = Math.floor(damage * 0.5);
  }

  if (attacker.winded) {
    damage = Math.floor(damage * 1.25);
  }

  if (attacker.scars && attacker.scars.length >= 3) {
    damage = Math.floor(damage * 0.75);
  }

  // Apply difficulty multiplier for enemy attacks
  damage = Math.floor(damage * difficultyMult);

  return Math.max(1, damage);
};

var MAX_TEAM_SIZE = 5;
var BIND_COST = 20;

var getRandomWild = () => {
  const wilds = Object.values(WILD_CREATURES);
  const baseCreature = wilds[Math.floor(Math.random() * wilds.length)];

  // Add stat variance: +/- 5 HP, +/- 2 stamina
  const hpVariance = Math.floor(Math.random() * 11) - 5; // -5 to +5
  const staminaVariance = Math.floor(Math.random() * 5) - 2; // -2 to +2

  const creature = {
    ...baseCreature,
    maxHp: Math.max(20, baseCreature.maxHp + hpVariance),
    maxStamina: Math.max(10, baseCreature.maxStamina + staminaVariance),
    scars: []
  };

  // 10% chance of pre-scarred creature
  if (Math.random() < 0.1) {
    const scar = getRandomScar();
    creature.scars = [scar];
    creature.preScarred = true;
  }

  return creature;
};

// Get random creature for The Hollow Deep (Dark/Light types)
var getRandomDeepWild = () => {
  // 60% Umbravine (Dark), 40% Solrath (Light)
  const typeRoll = Math.random();
  const isUmbravine = typeRoll < 0.6;

  const baseCreature = isUmbravine ? {
    id: 'wildUmbravine',
    name: 'Wild Umbravine',
    type: 'dark',
    maxHp: STARTERS.umbravine.maxHp + 5, // +5 HP for Deep creatures
    maxStamina: STARTERS.umbravine.maxStamina + 2, // +2 Stamina
    souls: 25, // More souls from Hollow Deep creatures
    moves: STARTERS.umbravine.moves
  } : {
    id: 'wildSolrath',
    name: 'Wild Solrath',
    type: 'light',
    maxHp: STARTERS.solrath.maxHp + 5,
    maxStamina: STARTERS.solrath.maxStamina + 2,
    souls: 28, // Light creatures give slightly more
    moves: STARTERS.solrath.moves
  };

  // Add stat variance
  const hpVariance = Math.floor(Math.random() * 11) - 5;
  const staminaVariance = Math.floor(Math.random() * 5) - 2;

  const creature = {
    ...baseCreature,
    maxHp: Math.max(25, baseCreature.maxHp + hpVariance),
    maxStamina: Math.max(12, baseCreature.maxStamina + staminaVariance),
    scars: []
  };

  // 20% chance of pre-scarred (higher than surface)
  if (Math.random() < 0.2) {
    const scar = getRandomScar();
    creature.scars = [scar];
    creature.preScarred = true;
  }

  return creature;
};

var getCaptureChance = (currentHp, maxHp, captureBonus = 0) => {
  const hpPercent = (currentHp / (maxHp || 1)) * 100;
  let chance;
  if (hpPercent < 10) chance = 90;
  else if (hpPercent < 25) chance = 60;
  else if (hpPercent <= 50) chance = 30;
  else chance = 10;
  // Apply difficulty capture bonus (capped at 5-95%)
  return Math.max(5, Math.min(95, chance + captureBonus));
};

var getRandomScar = (difficulty) => {
  const baseScar = SCAR_TYPES[Math.floor(Math.random() * SCAR_TYPES.length)];
  // Apply difficulty-specific penalties
  if (difficulty && difficulty.scarPenalties) {
    if (baseScar.effect === 'maxHp') {
      return { ...baseScar, value: difficulty.scarPenalties.hp, description: `${difficulty.scarPenalties.hp} max HP` };
    }
    if (baseScar.effect === 'maxStamina') {
      return { ...baseScar, value: difficulty.scarPenalties.stamina, description: `${difficulty.scarPenalties.stamina} max Stamina` };
    }
  }
  return baseScar;
};

var applyScars = (creature, baseData, hollowedThreshold = 3) => {
  let maxHp = baseData.maxHp;
  let maxStamina = baseData.maxStamina;
  let hasFlinching = false;

  if (creature.scars) {
    creature.scars.forEach(scar => {
      if (scar.effect === 'maxHp') maxHp += scar.value;
      if (scar.effect === 'maxStamina') maxStamina += scar.value;
      if (scar.effect === 'noPriority') hasFlinching = true;
    });
  }

  if (creature.scars && creature.scars.length >= hollowedThreshold) {
    maxHp = Math.floor(maxHp * 0.75);
    maxStamina = Math.floor(maxStamina * 0.75);
  }

  return { maxHp: Math.max(1, maxHp), maxStamina: Math.max(1, maxStamina), hasFlinching };
};

// ============= LORE DATA =============
var TILE_LORE = {
  ashenPath: {
    // Old signpost near start (3,1)
    '3,1': {
      name: 'Old Signpost',
      lines: [
        '"Cinder\'s Edge - 3 leagues east"',
        '',
        'The wood is burned. The arrow points to nothing but wall.'
      ]
    },
    // Collapsed statue in corner (6,1)
    '6,1': {
      name: 'Collapsed Statue',
      lines: [
        'A Healer\'s Sanctuary sign, half-buried.',
        '',
        'The red roof is faded to gray.'
      ]
    },
    // Near the gate
    '4,4': {
      name: 'Faded Marks',
      lines: [
        'Scratches in the stone. Tally marks.',
        '',
        'Dozens of them. Then nothing.'
      ]
    },
    // Abandoned Pack
    '2,3': {
      name: 'Abandoned Pack',
      lines: [
        'Scattered belongings. Someone left in a hurry.',
        '',
        'Or didn\'t leave at all.'
      ]
    },
    // Scorched Tree
    '5,2': {
      name: 'Scorched Tree',
      lines: [
        'The bark is burned clean through.',
        '',
        'Whatever did this wasn\'t trying to destroy—it was trying to purify.'
      ]
    }
  },
  fallenKeep: {
    // Scratched message near entrance (2,7)
    '2,7': {
      name: 'Scratched Message',
      lines: [
        '"V. guards what remains. Do not wake him.',
        '',
        'He only wants it to end."'
      ]
    },
    // Broken soul spheres scattered (4,1)
    '4,1': {
      name: 'Broken Shells',
      lines: [
        'Empty shells. Dozens of them.',
        '',
        'Whatever was inside left long ago. Or never survived.'
      ]
    },
    // Near boss room (1,5)
    '3,5': {
      name: 'Old Banner',
      lines: [
        'A tattered gym banner. The emblem is unreadable.',
        '',
        'Someone was proud here, once.'
      ]
    },
    // Boss room entrance warning
    '3,6': {
      name: 'Charred Ground',
      lines: [
        'The stone is blackened. Still warm.',
        '',
        'Something burns eternal beyond this door.'
      ]
    },
    // Keeper's Quarters
    '4,3': {
      name: 'Keeper\'s Quarters',
      lines: [
        'A bedroll, long cold.',
        '',
        'The keeper hasn\'t slept in years.'
      ]
    },
    // Trophy Wall
    '2,5': {
      name: 'Trophy Wall',
      lines: [
        'Scratches in the stone. Names? Warnings?',
        '',
        'Each one ends mid-stroke.'
      ]
    }
  },
  hollowDeep: {
    // Shattered Altar
    '2,2': {
      name: 'Shattered Altar',
      lines: [
        'The light faded here first.',
        '',
        'Something older took its place.'
      ]
    },
    // Hollow Roots
    '5,3': {
      name: 'Hollow Roots',
      lines: [
        'Even the stone bleeds where the dark vines grew.',
        '',
        'They drink what light remains.'
      ]
    },
    // Keeper's Echo
    '3,5': {
      name: 'Keeper\'s Echo',
      lines: [
        'Varek was not the first.',
        '',
        'Nor the last.'
      ]
    },
    // The Final Gate
    '1,6': {
      name: 'The Final Gate',
      lines: [
        'Beyond this, only ending.',
        '',
        'Or beginning.'
      ]
    }
  },
  labyrinth: {
    // Ashen Gate (9,0)
    '9,0': {
      name: 'The Ashen Gate',
      lines: [
        'Beyond lies the world that was.',
        '',
        'This door opens when the full flame is ready.',
        '',
        '- BBADAHS Games'
      ]
    },
    // Secret Door (15,9) - cracked wall
    '15,9': {
      name: 'Cracked Wall',
      lines: [
        'The stone here is weathered differently.',
        '',
        'Faint marks suggest this wall was not always solid.'
      ]
    },
    // Clue 1 (16,1) - Statue pointing
    '16,1': {
      name: 'Stone Sentinel',
      lines: [
        'A worn statue stands watch, arm extended.',
        '',
        'Its gaze and gesture fix upon the eastern corridors below.'
      ]
    },
    // Clue 2 (1,7) - Journal/inscription
    '1,7': {
      name: 'Faded Inscription',
      lines: [
        '"Where the labyrinth breathes, stone yields."',
        '',
        'The text trails off, as if the writer fled mid-thought.'
      ]
    },
    // Clue 3 (4,15) - Bones arranged
    '4,15': {
      name: 'Scattered Remains',
      lines: [
        'Ancient bones lie in deliberate arrangement.',
        '',
        'The longest one points east, toward the outer wall.'
      ]
    },
    // Clue 4 (17,17) - Flickering torch
    '17,17': {
      name: 'Restless Flame',
      lines: [
        'A torch flickers without wind.',
        '',
        'It burns strongest when facing north, as if drawn to something hidden.'
      ]
    }
  }
};

// Boss dialogue collections
var BOSS_DIALOGUE = {
  intro: [
    '"Another walks the ash. Another seeks the flame beyond."',
    '"I was a guardian once. Now I am a door."'
  ],
  phase2: [
    '"You fight like the ones before... but you haven\'t broken yet."',
    '"Fine. Let me show you why they stopped coming."'
  ],
  playerDeath: [
    '"Rest now. The bonfire remembers you."',
    '"Return when you\'re ready to fail again."'
  ],
  victory: [
    '"So. One finally passes."',
    '"Beyond this door... another keeper waits. Another path. Another fire."',
    '"The cycle doesn\'t end. It never ends."',
    '"But you, {name}... you carry scars and still stand."',
    '"Perhaps that is enough."'
  ]
};

// Hollow Warden dialogue (post-game boss)
var HOLLOW_WARDEN_DIALOGUE = {
  intro: [
    '"You carry his flame. But flames die in the deep."',
    '"I was light once. Now I am the absence of it."'
  ],
  phase2: [
    '"Light and dark... two sides of the same void."',
    '"Let me show you what happens when they merge."'
  ],
  playerDeath: [
    '"The deep remembers all who fall."',
    '"Return... if you can find the way back."'
  ],
  victory: [
    '"The cycle continues. Another keeper rises. Another falls."',
    '"You have walked through shadow and emerged."',
    '"But the flame still burns. It always will."',
    '"Go now. The surface remembers you."'
  ]
};


// ============= DIFFICULTY SYSTEM =============
var DIFFICULTIES = {
  ashen: {
    id: 'ashen',
    name: 'ASHEN',
    icon: '🔥',
    subtitle: 'Easy',
    description: 'For those who wish to explore.',
    wildDamageMult: 0.5,
    bossDamageMult: 0.75,
    scarsHealAtBonfire: true,
    soulDropPercent: 0.5,
    dropBankedSouls: false,
    captureBonus: 20,
    bossHpMult: 1.0,
    hollowedThreshold: 3,
    bonfireHeals: true,
    permadeath: false,
    bossPhaseTransition: true,
    scarPenalties: { hp: -5, stamina: -2 }
  },
  scarred: {
    id: 'scarred',
    name: 'SCARRED',
    icon: '💀',
    subtitle: 'Normal',
    description: 'The path as intended.',
    wildDamageMult: 0.75,
    bossDamageMult: 1.0,
    scarsHealAtBonfire: false,
    soulDropPercent: 1.0,
    dropBankedSouls: false,
    captureBonus: 0,
    bossHpMult: 1.0,
    hollowedThreshold: 3,
    bonfireHeals: true,
    permadeath: false,
    bossPhaseTransition: true,
    scarPenalties: { hp: -5, stamina: -2 }
  },
  hollowed: {
    id: 'hollowed',
    name: 'HOLLOWED',
    icon: '👁',
    subtitle: 'Hard',
    description: 'For those who seek true suffering.',
    wildDamageMult: 1.0,
    bossDamageMult: 1.0,
    scarsHealAtBonfire: false,
    soulDropPercent: 1.0,
    dropBankedSouls: true,
    captureBonus: -20,
    bossHpMult: 1.25,
    hollowedThreshold: 3,
    bonfireHeals: true,
    permadeath: false,
    bossPhaseTransition: true,
    scarPenalties: { hp: -7, stamina: -3 }
  },
  broken: {
    id: 'broken',
    name: 'BROKEN',
    icon: '☠',
    subtitle: 'Nightmare',
    description: 'You will not survive.',
    wildDamageMult: 1.0,
    bossDamageMult: 1.0,
    scarsHealAtBonfire: false,
    soulDropPercent: 1.0,
    dropBankedSouls: true,
    captureBonus: -20,
    bossHpMult: 1.25,
    hollowedThreshold: 1,
    bonfireHeals: false,
    permadeath: true,
    bossPhaseTransition: false,
    scarPenalties: { hp: -7, stamina: -3 }
  }
};

var getDifficulty = (state) => {
  return DIFFICULTIES[state.difficulty] || DIFFICULTIES.scarred;
};


// ============= SAVE SYSTEM =============
var SAVE_KEY = 'scarsOfAshSaveData';

var getSaveData = (state) => {
  return {
    currentMap: state.currentMap,
    playerPos: state.playerPos,
    playerDir: state.playerDir,
    playerName: state.playerName,
    playerAppearance: state.playerAppearance,
    team: state.team,
    activeCreatureIndex: state.activeCreatureIndex,
    souls: state.souls,
    bankedSouls: state.bankedSouls,
    droppedSouls: state.droppedSouls,
    bossDefeated: state.bossDefeated,
    hollowWardenDefeated: state.hollowWardenDefeated,
    shortcutUnlocked: state.shortcutUnlocked,
    grassEncounters: state.grassEncounters,
    lastBonfire: state.lastBonfire,
    hasSeenPrologue: state.hasSeenPrologue,
    playTime: state.playTime,
    difficulty: state.difficulty,
    titles: state.titles,
    activeTitle: state.activeTitle,
    cluesFound: state.cluesFound,
    secretDoorRevealed: state.secretDoorRevealed,
    savedAt: Date.now()
  };
};

var saveGame = (state) => {
  try {
    const saveData = getSaveData(state);
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    return true;
  } catch (e) {
    return false;
  }
};

var loadSaveData = () => {
  try {
    const data = localStorage.getItem(SAVE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    // Silent fail - return null
  }
  return null;
};

var deleteSaveData = () => {
  try {
    localStorage.removeItem(SAVE_KEY);
    return true;
  } catch (e) {
    return false;
  }
};

// Run statistics storage
var STATS_KEY = 'scarsOfAshStats';

var getDefaultStats = () => ({
  totalRuns: 0,
  completedRuns: { ashen: 0, scarred: 0, hollowed: 0, broken: 0 },
  fastestClear: { ashen: null, scarred: null, hollowed: null, broken: null },
  lowestScars: { ashen: null, scarred: null, hollowed: null, broken: null },
  totalCreaturesCaptured: 0,
  totalDeaths: 0,
  totalScarsEarned: 0,
  hollowWardenDefeated: false,
  creaturesCollected: []
});

var loadStats = () => {
  try {
    const data = localStorage.getItem(STATS_KEY);
    if (data) {
      const stats = JSON.parse(data);
      // Merge with defaults in case new fields were added
      return { ...getDefaultStats(), ...stats };
    }
  } catch (e) {
    // Silent fail - return defaults
  }
  return getDefaultStats();
};

var saveStats = (stats) => {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    return true;
  } catch (e) {
    return false;
  }
};

var updateStats = (updates) => {
  const stats = loadStats();
  const newStats = { ...stats, ...updates };
  saveStats(newStats);
  return newStats;
};

var recordRunStart = () => {
  const stats = loadStats();
  stats.totalRuns++;
  saveStats(stats);
};

var recordDeath = () => {
  const stats = loadStats();
  stats.totalDeaths++;
  saveStats(stats);
};

var recordScar = () => {
  const stats = loadStats();
  stats.totalScarsEarned++;
  saveStats(stats);
};

var recordCapture = (creatureId) => {
  const stats = loadStats();
  stats.totalCreaturesCaptured++;
  if (!stats.creaturesCollected.includes(creatureId)) {
    stats.creaturesCollected.push(creatureId);
  }
  saveStats(stats);
};

var recordVictory = (difficulty, playTime, totalScars, isHollowWarden = false) => {
  const stats = loadStats();
  stats.completedRuns[difficulty]++;

  // Track fastest clear
  if (stats.fastestClear[difficulty] === null || playTime < stats.fastestClear[difficulty]) {
    stats.fastestClear[difficulty] = playTime;
  }

  // Track lowest scars
  if (stats.lowestScars[difficulty] === null || totalScars < stats.lowestScars[difficulty]) {
    stats.lowestScars[difficulty] = totalScars;
  }

  if (isHollowWarden) {
    stats.hollowWardenDefeated = true;
  }

  saveStats(stats);
};

// Ghost marker storage (last death location)
var GHOST_KEY = 'scarsOfAshLastDeath';

var loadGhost = () => {
  try {
    const data = localStorage.getItem(GHOST_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {}
  return null;
};

var saveGhost = (ghostData) => {
  try {
    localStorage.setItem(GHOST_KEY, JSON.stringify(ghostData));
  } catch (e) {}
};

var recordGhost = (state) => {
  const difficulty = getDifficulty(state);
  if (difficulty.permadeath) return; // Don't record on permadeath
  saveGhost({
    name: state.playerName,
    map: state.currentMap,
    pos: { ...state.playerPos },
    appearance: state.playerAppearance
  });
};

// Hall of the Fallen storage (permadeath memorial)
var FALLEN_KEY = 'scarsOfAshFallenMemorial';

var loadFallen = () => {
  try {
    const data = localStorage.getItem(FALLEN_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {}
  return [];
};

var saveFallen = (fallen) => {
  try {
    localStorage.setItem(FALLEN_KEY, JSON.stringify(fallen));
  } catch (e) {}
};

var recordFallen = (state) => {
  if (state.difficulty !== 'broken') return; // Only Broken difficulty

  const fallen = loadFallen();
  fallen.unshift({
    id: Date.now(),
    playerName: state.playerName,
    playerAppearance: state.playerAppearance,
    playTime: state.playTime,
    finalMap: state.currentMap,
    totalScars: state.team.reduce((sum, c) => sum + (c.scars?.length || 0), 0),
    team: state.team.map(c => ({ name: c.nickname || c.name, scars: c.scars?.length || 0 }))
  });
  saveFallen(fallen.slice(0, 20)); // Keep last 20
};

var formatPlayTime = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m ${seconds}s`;
};

var initialState = {
  screen: 'characterCreate',
  difficulty: 'scarred',
  playerName: '',
  playerAppearance: '',
  currentMap: 'ashenPath',
  playerPos: { x: 4, y: 1 },
  playerDir: 'down',
  team: [],
  activeCreatureIndex: 0,
  souls: 0,
  bankedSouls: 0,
  droppedSouls: null,
  enemy: null,
  enemyCreature: null,
  battleLog: [],
  turnPhase: 'player',
  shortcutUnlocked: false,
  bossDefeated: false,
  bossPhase: 1,
  arenaEffect: null,
  grassEncounters: [
    // Ashen Path encounters (expanded 8x12 map)
    { x: 1, y: 1, map: 'ashenPath', active: true },
    { x: 6, y: 1, map: 'ashenPath', active: true },
    { x: 7, y: 1, map: 'ashenPath', active: true },
    { x: 10, y: 1, map: 'ashenPath', active: true },
    { x: 7, y: 2, map: 'ashenPath', active: true },
    { x: 2, y: 3, map: 'ashenPath', active: true },
    { x: 9, y: 5, map: 'ashenPath', active: true },
    // Hollow Deep encounters (Dark/Light creatures)
    { x: 4, y: 1, map: 'hollowDeep', active: true },
    { x: 6, y: 4, map: 'hollowDeep', active: true },
    // Labyrinth encounters
    { x: 4, y: 5, map: 'labyrinth', active: true },
    { x: 13, y: 13, map: 'labyrinth', active: true },
    { x: 1, y: 17, map: 'labyrinth', active: true }
  ],
  lastBonfire: { map: 'ashenPath', pos: { x: 4, y: 1 } },
  bonfireMenuOpen: false,
  withdrawMenuOpen: false,
  depositMenuOpen: false,
  hasSeenPrologue: false,
  examineText: null,
  playTime: 0,
  saveNotification: null,
  hollowWardenDefeated: false,
  isHollowWardenFight: false,
  isBossFight: false,
  currentEncounter: null,
  pendingEncounter: null,
  pendingCreature: null,
  pendingCapture: null,
  releaseMenuOpen: false,
  titles: [],
  activeTitle: null,
  cluesFound: [],
  secretDoorRevealed: false
};

