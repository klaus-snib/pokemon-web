// Retro sound effects using Web Audio API — no external files needed
class GameAudio {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.volume = 0.3;
    }

    init() {
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            this.enabled = false;
        }
    }

    ensure() {
        if (!this.ctx) this.init();
        if (this.ctx?.state === 'suspended') this.ctx.resume();
    }

    // Play a tone sequence (retro chip-tune style)
    play(notes) {
        if (!this.enabled) return;
        this.ensure();
        if (!this.ctx) return;

        let time = this.ctx.currentTime;
        notes.forEach(([freq, duration, type = 'square']) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type;
            osc.frequency.value = freq;
            gain.gain.value = this.volume;
            gain.gain.exponentialRampToValueAtTime(0.01, time + duration);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(time);
            osc.stop(time + duration);
            time += duration * 0.9;
        });
    }

    // === Sound Effects ===

    attack() {
        this.play([[300, 0.05], [200, 0.05], [150, 0.08]]);
    }

    superEffective() {
        this.play([[400, 0.08], [600, 0.08], [800, 0.12]]);
    }

    notEffective() {
        this.play([[200, 0.1], [150, 0.15]]);
    }

    crit() {
        this.play([[500, 0.05], [700, 0.05], [900, 0.05], [1100, 0.1]]);
    }

    faint() {
        this.play([[400, 0.1], [300, 0.1], [200, 0.1], [100, 0.2]]);
    }

    levelUp() {
        this.play([
            [523, 0.1], [587, 0.1], [659, 0.1], [698, 0.1],
            [784, 0.1], [880, 0.15], [784, 0.08], [880, 0.2]
        ]);
    }

    catch() {
        this.play([[300, 0.1], [400, 0.1], [500, 0.1], [600, 0.15]]);
    }

    catchFail() {
        this.play([[400, 0.1], [350, 0.1], [300, 0.15]]);
    }

    badgeEarned() {
        this.play([
            [523, 0.12], [659, 0.12], [784, 0.12],
            [1047, 0.2], [784, 0.08], [1047, 0.3, 'sine']
        ]);
    }

    heal() {
        this.play([
            [440, 0.08, 'sine'], [523, 0.08, 'sine'], [659, 0.08, 'sine'],
            [784, 0.08, 'sine'], [880, 0.12, 'sine']
        ]);
    }

    shopBuy() {
        this.play([[600, 0.05], [800, 0.08]]);
    }

    menuSelect() {
        this.play([[800, 0.03]]);
    }

    gameOver() {
        this.play([
            [400, 0.15], [350, 0.15], [300, 0.15],
            [250, 0.15], [200, 0.3]
        ]);
    }

    victory() {
        this.play([
            [523, 0.1], [659, 0.1], [784, 0.1], [1047, 0.15],
            [784, 0.08], [1047, 0.1], [1319, 0.2],
            [1047, 0.08], [1319, 0.3, 'sine']
        ]);
    }

    wildEncounter() {
        this.play([[200, 0.05], [400, 0.05], [200, 0.05], [400, 0.08]]);
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
}

const gameAudio = new GameAudio();
