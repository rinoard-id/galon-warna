/* 
  Color Sort - Pour & Solve | Complete Game Logic & UI State Machine
*/

class SoundManager {
    constructor() {
        this.audioCtx = null;
        this.enabled = true;
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
        if (!this.enabled) return;
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
        if (!this.enabled) return;
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

class ColorSortGame {
    constructor() {
        this.currentLevelIndex = 0;
        this.maxCapacity = 4;
        this.soundManager = new SoundManager();
        this.playerData = {
            coins: 250,
            unlockedLevel: 0,
            stars: {} // levelIndex: starCount
        };

        this.state = {
            gallons: [],
            selectedGallon: null,
            moves: 0,
            history: [],
            timeLeft: 0,
            timerInterval: null,
            isTimerRunning: false,
            undoCount: 3,
            hintCount: 1,
            addSlotCount: 1
        };

        this.loadProgress();
        this.initDOM();
        this.bindEvents();
    }

    loadProgress() {
        const saved = localStorage.getItem('colorsort_player');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.playerData = { ...this.playerData, ...data };
            } catch (e) {}
        }
    }

    saveProgress() {
        localStorage.setItem('colorsort_player', JSON.stringify(this.playerData));
    }

    initDOM() {
        // Screens
        this.homeScreen = document.getElementById('home-screen');
        this.gameplayScreen = document.getElementById('gameplay-screen');

        // Game UI
        this.boardEl = document.getElementById('gallon-board');
        this.levelTitleEl = document.getElementById('level-title');
        this.timerDisplayEl = document.getElementById('timer-display');
        this.coinCountEl = document.getElementById('coin-count');

        // Powerup counts
        this.undoCountEl = document.querySelector('#btn-undo .powerup-count');
        this.hintCountEl = document.querySelector('#btn-hint .powerup-count');
        this.addSlotCountEl = document.querySelector('#btn-add-slot .powerup-count');

        // Modals
        this.levelModal = document.getElementById('level-modal');
        this.winModal = document.getElementById('win-modal');
        this.pauseModal = document.getElementById('pause-modal');
        this.tutorialModal = document.getElementById('tutorial-modal');
        this.settingsModal = document.getElementById('settings-modal');
        this.dailyModal = document.getElementById('daily-modal');
        this.achievementsModal = document.getElementById('achievements-modal');

        this.levelGrid = document.getElementById('level-grid');
        this.totalStarsEl = document.getElementById('total-stars');

        this.updateCoinDisplay();
        this.renderLevelGrid();
    }

    switchScreen(screenName) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        if (screenName === 'home') {
            this.homeScreen.classList.add('active');
            this.stopTimer();
        } else if (screenName === 'gameplay') {
            this.gameplayScreen.classList.add('active');
        }
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
        this.state.undoCount = 3;
        this.state.hintCount = 1;
        this.state.addSlotCount = 1;

        this.levelTitleEl.textContent = `Level ${levelData.level}`;
        this.updatePowerupDisplays();
        this.updateTimerDisplay();

        this.renderBoard();
        this.switchScreen('gameplay');
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

    updateCoinDisplay() {
        this.coinCountEl.textContent = this.playerData.coins;
    }

    updatePowerupDisplays() {
        if (this.undoCountEl) this.undoCountEl.textContent = this.state.undoCount;
        if (this.hintCountEl) this.hintCountEl.textContent = this.state.hintCount;
        if (this.addSlotCountEl) this.addSlotCountEl.textContent = this.state.addSlotCount;
    }

    renderBoard() {
        this.boardEl.innerHTML = '';
        const numGallons = this.state.gallons.length;

        let cols = 3;
        if (numGallons > 6 && numGallons <= 9) cols = 3;
        else if (numGallons > 9 && numGallons <= 12) cols = 4;

        this.boardEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

        let gallonWidth = 76;
        let gallonHeight = 116;
        if (numGallons > 8 && numGallons <= 12) {
            gallonWidth = 66;
            gallonHeight = 102;
        } else if (numGallons > 12) {
            gallonWidth = 58;
            gallonHeight = 90;
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
      --- CLASSIC WATER SORT POURING RULES ---
      Rule 1: Can only pour the top contiguous block of identical color from source.
      Rule 2: Destination must have capacity available.
      Rule 3: Destination must either be empty OR have its top color matching the pouring color.
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
        if (fromIdx === toIdx) return false;
        if (toGallon.length >= this.maxCapacity) return false;

        const topColor = fromGallon[fromGallon.length - 1];

        // If destination is not empty, its top color must match
        if (toGallon.length > 0) {
            const destTopColor = toGallon[toGallon.length - 1];
            if (destTopColor !== topColor) return false;
        }

        return true;
    }

    pourWater(fromIdx, toIdx) {
        const fromGallon = this.state.gallons[fromIdx];
        const toGallon = this.state.gallons[toIdx];
        const topColor = fromGallon[fromGallon.length - 1];

        // Count how many consecutive layers of topColor are at the top of fromGallon
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
        if (this.state.history.length === 0 || this.state.undoCount <= 0) return;
        this.soundManager.playClick();
        this.state.undoCount--;
        const prev = this.state.history.pop();
        this.state.gallons = prev.gallons;
        this.state.moves = prev.moves;
        this.state.timeLeft = prev.timeLeft;
        this.state.selectedGallon = null;
        this.updatePowerupDisplays();
        this.renderBoard();
    }

    addExtraSlot() {
        if (this.state.addSlotCount <= 0) return;
        this.soundManager.playClick();
        this.state.addSlotCount--;
        this.state.gallons.push([]);
        this.updatePowerupDisplays();
        this.renderBoard();
    }

    restart() {
        this.soundManager.playClick();
        this.loadLevel(this.currentLevelIndex);
    }

    triggerWin() {
        const levelNum = this.currentLevelIndex + 1;
        const stars = 3; // 3 stars for victory
        this.playerData.stars[this.currentLevelIndex] = stars;
        if (this.currentLevelIndex + 1 > this.playerData.unlockedLevel) {
            this.playerData.unlockedLevel = this.currentLevelIndex + 1;
        }
        this.playerData.coins += 50;
        this.saveProgress();
        this.updateCoinDisplay();

        document.getElementById('win-time').textContent = this.timerDisplayEl.textContent;
        document.getElementById('win-score').textContent = (4000 + this.state.timeLeft * 15).toLocaleString();
        this.winModal.style.display = 'flex';
    }

    triggerGameOver() {
        alert('Waktu Habis! Coba lagi.');
        this.restart();
    }

    renderLevelGrid() {
        this.levelGrid.innerHTML = '';
        let totalStarsSum = 0;

        levels.forEach((lvl, idx) => {
            const isLocked = idx > this.playerData.unlockedLevel;
            const starsEarned = this.playerData.stars[idx] || 0;
            if (starsEarned > 0) totalStarsSum += starsEarned;

            const card = document.createElement('div');
            card.className = `level-card ${isLocked ? 'locked' : ''} ${idx === this.currentLevelIndex ? 'active-card' : ''}`;
            
            card.innerHTML = `
                <span class="level-card-num">${lvl.level}</span>
                <span class="level-card-stars">${isLocked ? '🔒' : ('⭐'.repeat(starsEarned) || '☆☆☆')}</span>
            `;

            if (!isLocked) {
                card.addEventListener('click', () => {
                    this.soundManager.playClick();
                    this.loadLevel(idx);
                    this.levelModal.style.display = 'none';
                });
            }

            this.levelGrid.appendChild(card);
        });

        if (this.totalStarsEl) {
            this.totalStarsEl.textContent = totalStarsSum;
        }
    }

    bindEvents() {
        // Home Screen Play Button
        document.getElementById('btn-play-hero').addEventListener('click', () => {
            this.soundManager.playClick();
            this.loadLevel(this.currentLevelIndex);
        });

        // Dock Nav Modals
        document.querySelectorAll('.dock-nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.soundManager.playClick();
                const modalId = btn.getAttribute('data-modal');
                const modal = document.getElementById(modalId);
                if (modal) {
                    if (modalId === 'level-modal') this.renderLevelGrid();
                    modal.style.display = 'flex';
                }
            });
        });

        // Close Modals
        document.querySelectorAll('.close-modal-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.soundManager.playClick();
                document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none');
            });
        });

        // Gameplay Powerups
        document.getElementById('btn-undo').addEventListener('click', () => this.undo());
        document.getElementById('btn-add-slot').addEventListener('click', () => this.addExtraSlot());
        document.getElementById('btn-hint').addEventListener('click', () => {
            alert('Tip: Pindahkan warna yang sama ke botol kosong atau botol dengan warna atas yang cocok!');
        });

        // Pause Modal
        document.getElementById('btn-pause').addEventListener('click', () => {
            this.soundManager.playClick();
            this.stopTimer();
            this.pauseModal.style.display = 'flex';
        });

        document.getElementById('btn-resume').addEventListener('click', () => {
            this.soundManager.playClick();
            this.pauseModal.style.display = 'none';
            this.startTimer();
        });

        document.getElementById('btn-pause-retry').addEventListener('click', () => {
            this.pauseModal.style.display = 'none';
            this.restart();
        });

        document.getElementById('btn-pause-levels').addEventListener('click', () => {
            this.pauseModal.style.display = 'none';
            this.renderLevelGrid();
            this.levelModal.style.display = 'flex';
        });

        document.getElementById('btn-exit-home').addEventListener('click', () => {
            this.pauseModal.style.display = 'none';
            this.switchScreen('home');
        });

        // Win Modal
        document.getElementById('btn-next-modal').addEventListener('click', () => {
            this.soundManager.playClick();
            this.winModal.style.display = 'none';
            if (this.currentLevelIndex < levels.length - 1) {
                this.loadLevel(this.currentLevelIndex + 1);
            } else {
                this.switchScreen('home');
                alert('Selamat! Kamu telah menyelesaikan semua level!');
            }
        });

        document.getElementById('btn-win-retry').addEventListener('click', () => {
            this.winModal.style.display = 'none';
            this.restart();
        });

        document.getElementById('btn-win-levels').addEventListener('click', () => {
            this.winModal.style.display = 'none';
            this.renderLevelGrid();
            this.levelModal.style.display = 'flex';
        });

        // Settings toggles
        const sfxToggle = document.getElementById('setting-sfx');
        if (sfxToggle) {
            sfxToggle.addEventListener('change', (e) => {
                this.soundManager.enabled = e.target.checked;
            });
        }

        document.getElementById('btn-reset-progress').addEventListener('click', () => {
            if (confirm('Reset semua progres game?')) {
                localStorage.removeItem('colorsort_player');
                this.playerData = { coins: 250, unlockedLevel: 0, stars: {} };
                this.updateCoinDisplay();
                this.renderLevelGrid();
                this.settingsModal.style.display = 'none';
            }
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.game = new ColorSortGame();
});
