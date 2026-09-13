document.addEventListener('DOMContentLoaded', () => {
    const imgElement = document.getElementById('tupilakImg');
    const wordContainer = document.getElementById('wordContainer');
    const keyboardDiv = document.getElementById('keyboard');
    const messageDiv = document.getElementById('message');
    
    let wordsList = [];
    let currentWordObj = null;
    let currentWord = '';
    let currentTranslation = '';
    let guessedLetters = new Set();
    let revealedPositions = new Set();
    let wrongGuesses = 0;
    let gameActive = true;
    let winFlag = false;
    let selectedCellIndex = -1;
    
    // SLI latin symbols
    const latinLetters = ['A', 'E', 'F', 'G', 'H', 'I', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'Y', 'Z'];
    
    let winAudio = null;
    let breakAudio = null;
    let clickAudio = null;
    let cellSelectAudio = null;
    let soundsReady = false;
    
    function initSounds() {
        if (soundsReady) return;
        winAudio = new Audio('sound/win.mp3');
        breakAudio = new Audio('sound/break.mp3');
        clickAudio = new Audio('sound/click.mp3');
        cellSelectAudio = new Audio('sound/cell-select.mp3');
        
        winAudio.preload = 'auto';
        breakAudio.preload = 'auto';
        clickAudio.preload = 'auto';
        cellSelectAudio.preload = 'auto';
        
        soundsReady = true;
    }
    
    function playWinSound() {
        if (!soundsReady) initSounds();
        if (winAudio) {
            winAudio.currentTime = 0;
            winAudio.play().catch(e => console.log('audio error:', e));
        }
    }
    
    function playBreakSound() {
        if (!soundsReady) initSounds();
        if (breakAudio) {
            breakAudio.currentTime = 0;
            breakAudio.play().catch(e => console.log('audio error:', e));
        }
    }
    
    function playClickSound() {
        if (!soundsReady) initSounds();
        if (clickAudio) {
            clickAudio.currentTime = 0;
            clickAudio.play().catch(e => console.log('audio error:', e));
        }
    }
    
    function playCellSelectSound() {
        if (!soundsReady) initSounds();
        if (cellSelectAudio) {
            cellSelectAudio.currentTime = 0;
            cellSelectAudio.play().catch(e => console.log('audio error:', e));
        }
    }
    
    async function loadWords() {
        try {
            const response = await fetch('data.json');
            wordsList = await response.json();
            startNewGame();
        } catch(e) {
            console.error('Error loading words', e);
            messageDiv.innerText = 'Error loading words!';
        }
    }
    
    function addRandomHints(word, guessedSet, revealedPosSet) {
        const letters = word.split('');
        const possibleIndices = [];
        for (let i = 1; i < letters.length - 1; i++) {
            possibleIndices.push(i);
        }
        for (let i = possibleIndices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [possibleIndices[i], possibleIndices[j]] = [possibleIndices[j], possibleIndices[i]];
        }
        const hintsCount = Math.min(3, Math.max(2, Math.floor(letters.length / 3)));
        for (let i = 0; i < hintsCount && i < possibleIndices.length; i++) {
            const idx = possibleIndices[i];
            const letter = letters[idx];
            guessedSet.add(letter);
            revealedPosSet.add(idx);
        }
    }
    
    function startNewGame() {
        if (!wordsList.length) return;
        const randomIndex = Math.floor(Math.random() * wordsList.length);
        currentWordObj = wordsList[randomIndex];
        currentWord = currentWordObj.word;
        currentTranslation = currentWordObj.translation;
        
        guessedLetters.clear();
        revealedPositions.clear();
        wrongGuesses = 0;
        gameActive = true;
        winFlag = false;
        selectedCellIndex = -1;
        
        addRandomHints(currentWord, guessedLetters, revealedPositions);
        
        updateImage();
        renderWord();
        renderKeyboard();
        messageDiv.innerText = 'Tap the "?" cell, then tap any letter';
        
        const blackDiv = document.querySelector('.blackout');
        if(blackDiv) blackDiv.remove();
        imgElement.style.opacity = '1';
    }
    
    function updateImage() {
        if (winFlag) {
            imgElement.src = 'img/typWin.png';
            return;
        }
        if (wrongGuesses >= 6) {
            imgElement.src = 'img/typ00.png';
        } else {
            imgElement.src = `img/typ${wrongGuesses}.png`;
        }
        imgElement.style.transform = 'scale(0.97)';
        setTimeout(() => { imgElement.style.transform = 'scale(1)'; }, 120);
    }
    
    function renderWord() {
        wordContainer.innerHTML = '';
        const letters = currentWord.split('');
        const baseSize = Math.min(60, Math.max(36, 380 / letters.length));
        
        letters.forEach((letter, idx) => {
            const cell = document.createElement('div');
            cell.classList.add('letter-cell');
            
            const isRevealed = revealedPositions.has(idx);
            if (isRevealed) {
                cell.textContent = letter;
                cell.classList.add('filled');
            } else {
                cell.textContent = '?';
            }
            
            if (selectedCellIndex === idx) {
                cell.classList.add('selected');
            }
            
            cell.style.minWidth = `${baseSize}px`;
            cell.style.fontSize = `${Math.min(1.8, baseSize / 28)}rem`;
            
            cell.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!gameActive || winFlag) return;
                if (revealedPositions.has(idx)) return;
                
                playCellSelectSound();
                
                selectedCellIndex = idx;
                renderWord();
                messageDiv.innerText = `Cell ${idx+1} selected, tap the letter`;
            });
            
            wordContainer.appendChild(cell);
        });
    }
    
    function placeLetter(letter) {
        if (!gameActive || winFlag) return false;
        
        playClickSound();
        
        if (selectedCellIndex === -1) {
            messageDiv.innerText = 'Tap the "?" cell first :)';
            return false;
        }
        if (revealedPositions.has(selectedCellIndex)) {
            messageDiv.innerText = 'This cell is already open!';
            selectedCellIndex = -1;
            renderWord();
            return false;
        }
        
        const correctLetter = currentWord[selectedCellIndex];
        if (letter !== correctLetter) {
            wrongGuesses++;
            updateImage();
            messageDiv.innerText = `Oops, "${letter}" is wrong! Mistakes: ${wrongGuesses}/6`;
            selectedCellIndex = -1;
            renderWord();
            
            if (wrongGuesses >= 6) {
                loseGame();
            }
            return false;
        }
        
        revealedPositions.add(selectedCellIndex);
        guessedLetters.add(letter);
        selectedCellIndex = -1;
        renderWord();
        
        if (checkWin()) {
            winGame();
        } else {
            messageDiv.innerText = 'Congrats! Select the next cell';
        }
        return true;
    }
    
    function checkWin() {
        for (let i = 0; i < currentWord.length; i++) {
            if (!revealedPositions.has(i)) return false;
        }
        return true;
    }
    
    function winGame() {
        if (winFlag) return;
        winFlag = true;
        gameActive = false;
        playWinSound();
        updateImage();
        
        const cells = document.querySelectorAll('.letter-cell');
        cells.forEach(cell => {
            cell.classList.add('fade-out');
        });
        
        setTimeout(() => {
            wordContainer.innerHTML = '';
            const transDiv = document.createElement('div');
            transDiv.textContent = currentTranslation;
            transDiv.classList.add('translation');
            wordContainer.appendChild(transDiv);
            messageDiv.innerText = 'You won! Tap the picture to start a new game';
        }, 400);
    }
    
    function loseGame() {
        gameActive = false;
        playBreakSound();
        updateImage();
        
        const cells = document.querySelectorAll('.letter-cell');
        const lettersArr = currentWord.split('');
        cells.forEach((cell, idx) => {
            cell.textContent = lettersArr[idx];
            cell.classList.add('filled');
        });
        
        setTimeout(() => {
            const blackScreen = document.createElement('div');
            blackScreen.classList.add('blackout');
            document.body.appendChild(blackScreen);
            setTimeout(() => {
                startNewGame();
            }, 800);
        }, 500);
    }
    
    function renderKeyboard() {
        keyboardDiv.innerHTML = '';
        
        latinLetters.forEach(letter => {
            const btn = document.createElement('button');
            btn.textContent = letter;
            btn.classList.add('key');
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!gameActive || winFlag) return;
                if (wrongGuesses >= 6) return;
                placeLetter(letter.toLowerCase());
            });
            keyboardDiv.appendChild(btn);
        });
    }
    
    // restart on image click
    imgElement.addEventListener('click', () => {
        startNewGame();
    });
    
    document.body.addEventListener('touchstart', () => {
        initSounds();
    }, { once: true });
    
    // THEME TOGGLE 
    const themeToggle = document.getElementById('themeToggle');
    let isDarkTheme = true;
    
    const savedTheme = localStorage.getItem('tupilak_theme');
    if (savedTheme === 'light') {
        isDarkTheme = false;
        document.body.classList.add('light-theme');
    }
    
    themeToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        
        themeToggle.style.transform = 'translateX(-50%) scale(0.7)';
        setTimeout(() => {
            themeToggle.style.transform = 'translateX(-50%) scale(1)';
        }, 150);
        
        if (isDarkTheme) {
            document.body.classList.add('light-theme');
            isDarkTheme = false;
            localStorage.setItem('tupilak_theme', 'light');
        } else {
            document.body.classList.remove('light-theme');
            isDarkTheme = true;
            localStorage.setItem('tupilak_theme', 'dark');
        }
        
        document.body.style.transition = 'background 0.4s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 400);
    });
    
    loadWords();
});
