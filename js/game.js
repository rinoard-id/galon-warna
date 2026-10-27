/* 
  Water Sort Puzzle - Game Logic (Custom Rule Edition: Pour anywhere as long as capacity permits)
*/

class SoundManager {
    constructor() {
        this.audioCtx = null;
    }

    init() {
        if (!this.audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.audioCtx = new AudioContext();
            }
        }
        if (this.audioCtx && this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    playClick() {
        try {
            this.init();
            if (!this.audioCtx) return;
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(580, this.audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(320, this.audioCtx.currentTime + 0.08);

            gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.08);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            osc.start();
            osc.stop(this.audioCtx.currentTime + 0.08);
        } catch (e) {}
    }

    playPour() {
        try {
            this.init();
            if (!this.audioCtx) return;
            
            const bufferSize = this.audioCtx.sampleRate * 0.25;
            const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noise = this.audioCtx.createBufferSource();
            noise.buffer = buffer;

            const filter = this.audioCtx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(800, this.audioCtx.currentTime);
            filter.frequency.linearRampToValueAtTime(300, this.audioCtx.currentTime + 0.25);
            filter.Q.setValueAtTime(3, this.audioCtx.currentTime);

            const gain = this.audioCtx.createGain();
            gain.gain.setValueAtTime(0.18, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.25);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.audioCtx.destination);

            noise.start();
            noise.stop(this.audioCtx.currentTime + 0.25);
        } catch (e) {}
    }
}

class WaterSortGame {
    constructor() {
        this.currentLevelIndex = 0;
        this.maxCapacity = 4;
        this.soundManager = new SoundManager();
        this.state = {
            gallons: [],
            selectedGallon: null,
            moves: 0,
            history: [],
            timeLeft: 0,
            timerInterval: null,
            isTimerRunning: false
        };

        this.initDOM();
        this.loadLevel(this.currentLevelIndex);
        this.bindEvents();
    }

    initDOM() {
        this.boardEl = document.getElementById('gallon-board');
        this.levelTitleEl = document.getElementById('level-title');
        this.moveCountEl = document.getElementById('move-count');
        this.timerDisplayEl = document.getElementById('timer-display');
        
        this.btnRestart = document.getElementById('btn-restart');
        this.btnUndo = document.getElementById('btn-undo');
        this.btnNext = document.getElementById('btn-next');
        
        // Modals
        this.levelSelectBtn = document.getElementById('level-select-btn');
        this.levelModal = document.getElementById('level-modal');
        this.closeLevelModal = document.getElementById('close-level-modal');
        this.levelGrid = document.getElementById('level-grid');
        
        this.winModal = document.getElementById('win-modal');
        this.winStats = document.getElementById('win-stats');
        this.btnNextModal = document.getElementById('btn-next-modal');

        this.gameoverModal = document.getElementById('gameover-modal');
        this.btnRetryModal = document.getElementById('btn-retry-modal');

        this.renderLevelGrid();
    }

    loadLevel(index) {
        if (index < 0 || index >= levels.length) return;
        this.stopTimer();
        this.currentLevelIndex = index;
        const levelData = levels[index];

        this.state.gallons = levelData.bottles.map(b => [...b]);
        this.state.selectedGallon = null;
        this.state.moves = 0;
        this.state.history = [];
        this.state.timeLeft = levelData.timeLimit || 120;

        this.levelTitleEl.textContent = `Level ${levelData.level}`;
        this.updateMovesDisplay();
        this.updateTimerDisplay();
        this.btnNext.style.display = 'none';

        this.renderBoard();
        this.startTimer();
    }

    startTimer() {
        this.stopTimer();
        this.state.isTimerRunning = true;
        this.state.timerInterval = setInterval(() => {
            this.state.timeLeft--;
            this.updateTimerDisplay();
            if (this.state.timeLeft <= 0) {
                this.stopTimer();
                this.triggerGameOver();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.state.timerInterval) {
            clearInterval(this.state.timerInterval);
            this.state.timerInterval = null;
        }
        this.state.isTimerRunning = false;
    }

    updateTimerDisplay() {
        const mins = Math.floor(this.state.timeLeft / 60);
        const secs = this.state.timeLeft % 60;
        this.timerDisplayEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    /* 
      --- DYNAMIC SCALING (ZERO SCROLL) ---
    */
    renderBoard() {
        this.boardEl.innerHTML = '';
        const numGallons = this.state.gallons.length;

        let cols = 3;
        if (numGallons > 6 && numGallons <= 9) cols = 3;
        else if (numGallons > 9 && numGallons <= 12) cols = 4;
        else if (numGallons > 12) cols = 4;

        this.boardEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

        let gallonWidth = 82;
        let gallonHeight = 125;
        if (numGallons > 8 && numGallons <= 12) {
            gallonWidth = 70;
            gallonHeight = 110;
        } else if (numGallons > 12) {
            gallonWidth = 60;
            gallonHeight = 98;
        }

        this.boardEl.style.setProperty('--gallon-w', `${gallonWidth}px`);
        this.boardEl.style.setProperty('--gallon-h', `${gallonHeight}px`);

        this.state.gallons.forEach((gallon, index) => {
            const gallonEl = document.createElement('div');
            gallonEl.className = 'gallon';
            if (this.state.selectedGallon === index) {
                gallonEl.classList.add('selected');
            }
            if (this.isGallonCompleted(gallon)) {
                gallonEl.classList.add('completed');
            }

            gallon.forEach(color => {
                const layerEl = document.createElement('div');
                layerEl.className = `liquid-layer color-${color}`;
                gallonEl.appendChild(layerEl);
            });

            gallonEl.addEventListener('click', () => this.handleGallonClick(index));
            this.boardEl.appendChild(gallonEl);
        });
    }

    /* 
      --- CUSTOM RULE CLICK & POUR STATE MACHINE ---
      Rule: Can pour into ANY container as long as capacity permits (no color restriction).
    */
    handleGallonClick(index) {
        const { selectedGallon, gallons } = this.state;

        if (selectedGallon === null) {
            if (gallons[index].length === 0) return;
            if (this.isGallonCompleted(gallons[index])) return;

            this.state.selectedGallon = index;
            this.soundManager.playClick();
            this.renderBoard();
        } else {
            if (selectedGallon === index) {
                this.state.selectedGallon = null;
                this.soundManager.playClick();
                this.renderBoard();
            } else {
                if (this.isValidPour(selectedGallon, index)) {
                    this.saveHistory();
                    this.pourWater(selectedGallon, index);
                    this.soundManager.playPour();
                    this.state.moves++;
                    this.updateMovesDisplay();
                    this.state.selectedGallon = null;

                    if (this.checkWin()) {
                        this.stopTimer();
                        this.triggerWin();
                    }
                    this.renderBoard();
                } else {
                    this.state.selectedGallon = null;
                    this.soundManager.playClick();
                    this.renderBoard();
                }
            }
        }
    }

    isValidPour(fromIdx, toIdx) {
        const fromGallon = this.state.gallons[fromIdx];
        const toGallon = this.state.gallons[toIdx];

        if (fromGallon.length === 0) return false;
        if (toGallon.length >= this.maxCapacity) return false;
        if (fromIdx === toIdx) return false;

        // Custom rule: Can pour into ANY container regardless of color!
        return true;
    }

    pourWater(fromIdx, toIdx) {
        const fromGallon = this.state.gallons[fromIdx];
        const toGallon = this.state.gallons[toIdx];
        const topColor = fromGallon[fromGallon.length - 1];

        // Transfer consecutive matching top layers of that color that can fit
        let transferCount = 0;
        for (let i = fromGallon.length - 1; i >= 0; i--) {
            if (fromGallon[i] === topColor) transferCount++;
            else break;
        }

        const spaceAvailable = this.maxCapacity - toGallon.length;
        const actualTransfer = Math.min(transferCount, spaceAvailable);

        for (let i = 0; i < actualTransfer; i++) {
            toGallon.push(fromGallon.pop());
        }
    }

    checkWin() {
        for (let gallon of this.state.gallons) {
            if (gallon.length === 0) continue;
            if (gallon.length < this.maxCapacity) return false;
            const firstColor = gallon[0];
            if (!gallon.every(c => c === firstColor)) return false;
        }
        return true;
    }

    isGallonCompleted(gallon) {
        if (gallon.length !== this.maxCapacity) return false;
        return gallon.every(c => c === gallon[0]);
    }

    saveHistory() {
        this.state.history.push({
            gallons: this.state.gallons.map(b => [...b]),
            moves: this.state.moves,
            timeLeft: this.state.timeLeft
        });
    }

    undo() {
        if (this.state.history.length === 0) return;
        this.soundManager.playClick();
        const prev = this.state.history.pop();
        this.state.gallons = prev.gallons;
        this.state.moves = prev.moves;
        this.state.timeLeft = prev.timeLeft;
        this.state.selectedGallon = null;
        this.updateMovesDisplay();
        this.updateTimerDisplay();
        this.renderBoard();
    }

    restart() {
        this.soundManager.playClick();
        this.loadLevel(this.currentLevelIndex);
    }

    updateMovesDisplay() {
        this.moveCountEl.textContent = this.state.moves;
    }

    triggerWin() {
        const levelNum = this.currentLevelIndex + 1;
        this.winStats.textContent = `Hebat! Menyelesaikan Level ${levelNum} dalam ${this.state.moves} gerakan.`;
        this.winModal.style.display = 'flex';
        this.btnNext.style.display = 'flex';
    }

    triggerGameOver() {
        this.gameoverModal.style.display = 'flex';
    }

    renderLevelGrid() {
        this.levelGrid.innerHTML = '';
        levels.forEach((lvl, idx) => {
            const btn = document.createElement('button');
            btn.className = `level-btn ${idx === this.currentLevelIndex ? 'active' : ''}`;
            btn.textContent = lvl.level;
            btn.addEventListener('click', () => {
                this.soundManager.playClick();
                this.loadLevel(idx);
                this.levelModal.style.display = 'none';
            });
            this.levelGrid.appendChild(btn);
        });
    }

    bindEvents() {
        this.btnRestart.addEventListener('click', () => this.restart());
        this.btnUndo.addEventListener('click', () => this.undo());

        this.btnNext.addEventListener('click', () => {
            this.soundManager.playClick();
            if (this.currentLevelIndex < levels.length - 1) {
                this.loadLevel(this.currentLevelIndex + 1);
                this.renderLevelGrid();
            }
        });

        this.btnNextModal.addEventListener('click', () => {
            this.soundManager.playClick();
            this.winModal.style.display = 'none';
            if (this.currentLevelIndex < levels.length - 1) {
                this.loadLevel(this.currentLevelIndex + 1);
                this.renderLevelGrid();
            } else {
                alert('Selamat! Kamu telah menamatkan semua 10 level Water Sort Puzzle!');
            }
        });

        this.btnRetryModal.addEventListener('click', () => {
            this.soundManager.playClick();
            this.gameoverModal.style.display = 'none';
            this.restart();
        });

        this.levelSelectBtn.addEventListener('click', () => {
            this.soundManager.playClick();
            this.renderLevelGrid();
            this.levelModal.style.display = 'flex';
        });

        this.closeLevelModal.addEventListener('click', () => {
            this.soundManager.playClick();
            this.levelModal.style.display = 'none';
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.game = new WaterSortGame();
});
