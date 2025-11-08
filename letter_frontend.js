const BIRTHDAY_MONTH = 10; 
const BIRTHDAY_DAY = 8;
const FRAME_SIZE = 150; 
let letterBounds = null; 
let musicStarted = false; 

function startMusicWithFadeIn() {
    if (musicStarted) return;
    musicStarted = true;

    const audio = document.getElementById('background-music');
    const targetVolume = 0.5; 
    const fadeDuration = 8000; 
    const fadeSteps = 50;
    const fadeInterval = fadeDuration / fadeSteps;
    const volumeIncrement = targetVolume / fadeSteps;
    
    audio.volume = 0;
    audio.play().catch(error => {
        console.error("Music play failed after user interaction:", error);
    });

    let currentVolume = 0;
    const fadeIntervalId = setInterval(() => {
        currentVolume += volumeIncrement;
        if (currentVolume >= targetVolume) {
            audio.volume = targetVolume;
            clearInterval(fadeIntervalId);
        } else {
            audio.volume = currentVolume;
        }
    }, fadeInterval);
}

function updateCountdown() {
    const now = new Date();
    const currentYear = now.getFullYear();

    let targetBirthday = new Date(currentYear, BIRTHDAY_MONTH, BIRTHDAY_DAY);
    
    if (now > targetBirthday) {
        targetBirthday = new Date(currentYear + 1, BIRTHDAY_MONTH, BIRTHDAY_DAY);
    }
    
    const countdownElement = document.getElementById('birthday-countdown');
    let distance = targetBirthday - now;
    
    const isToday = now.getMonth() === BIRTHDAY_MONTH && now.getDate() === BIRTHDAY_DAY;
    
    const prefix = "还有，你的每一次生日我都要为你庆祝：<br>距离鱼鱼酱下次生日：";

    if (isToday) {
        countdownElement.innerHTML = 
            `${prefix} 🎉 **生日快乐！** 今天就是鱼鱼的生日啦！快去许愿吧！🎂`;
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdownElement.innerHTML = 
        `${prefix} ${days} 天 ${hours} 小时 ${minutes} 分 ${seconds} 秒 ✨`;
}

function getLetterBounds() {
    const letter = document.getElementById('letter-content');
    const rect = letter.getBoundingClientRect();
    
    const SAFE_PADDING = 20; 

    letterBounds = {
        left: rect.left - FRAME_SIZE - SAFE_PADDING, 
        right: rect.right + SAFE_PADDING, 
        top: rect.top - FRAME_SIZE - SAFE_PADDING, 
        bottom: rect.bottom + SAFE_PADDING, 
    };
}

const allPhotos = [
    'images/photo1.jpg', 'images/photo2.jpg', 'images/photo3.jpg', 
    'images/photo4.jpg', 'images/photo5.jpg', 'images/photo6.jpg', 
    'images/photo7.jpg', 'images/photo8.jpg', 'images/photo9.jpg'
];

let availablePhotos = [...allPhotos];
let photoStreamInterval = null;
const photoStream = document.getElementById('photo-stream');

function getRandomPhoto() {
    if (availablePhotos.length === 0) {
        availablePhotos = [...allPhotos]; 
        if (availablePhotos.length === 0) return null;
    }
    const randomIndex = Math.floor(Math.random() * availablePhotos.length);
    const photoPath = availablePhotos[randomIndex];
    availablePhotos.splice(randomIndex, 1);
    return photoPath;
}

function createAndAnimatePhoto() {
    if (!letterBounds) return;

    const photoPath = getRandomPhoto();
    if (!photoPath) return;

    const frame = document.createElement('div');
    frame.className = 'photo-frame';
    
    const img = document.createElement('img');
    img.src = photoPath;
    img.alt = 'A memory photo';
    
    img.onerror = function() {
        console.error("Failed to load image at path: " + photoPath + ".");
        frame.remove();
    };
    
    frame.appendChild(img);
    photoStream.appendChild(frame);

    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    
    const minY = 0;
    const maxY = containerHeight - FRAME_SIZE;
    
    let midY;
    
    const topAvailableHeight = letterBounds.top; 
    const bottomAvailableHeight = containerHeight - letterBounds.bottom; 
    
    const totalAvailableHeight = topAvailableHeight + bottomAvailableHeight;

    if (totalAvailableHeight <= 0 || letterBounds.left <= 0 || letterBounds.right >= containerWidth) {
        midY = minY + Math.random() * (maxY - minY);
    } else if (Math.random() * totalAvailableHeight < topAvailableHeight) {
        midY = minY + Math.random() * topAvailableHeight;
    } else {
        midY = letterBounds.bottom + Math.random() * bottomAvailableHeight;
    }
    
    midY = Math.max(minY, Math.min(midY, maxY));


    const direction = Math.random() < 0.5 ? 0 : 1; 
    
    let startX, midX, endX;

    if (direction === 0) { 
        startX = -FRAME_SIZE; 
        midX = Math.random() * letterBounds.left;
        endX = containerWidth; 
        
    } else { 
        startX = containerWidth; 
        midX = letterBounds.right + Math.random() * (containerWidth - letterBounds.right - FRAME_SIZE);
        endX = -FRAME_SIZE; 
    }
    
    let startY = midY;
    let endY = midY;
    
    frame.style.setProperty('--x-start', `${startX}px`);
    frame.style.setProperty('--y-start', `${startY}px`);
    frame.style.setProperty('--x-mid', `${midX}px`);
    frame.style.setProperty('--y-mid', `${midY}px`);
    frame.style.setProperty('--x-end', `${endX}px`);
    frame.style.setProperty('--y-end', `${endY}px`);

    const duration = 15000 + Math.random() * 5000; 
    frame.style.animation = `flyAndFade ${duration}ms linear forwards`;

    frame.addEventListener('animationend', () => {
        frame.remove();
    });
}

function startPhotoStream() {
    if (photoStreamInterval) clearInterval(photoStreamInterval);
    createAndAnimatePhoto(); 
    const interval = 5000; 
    photoStreamInterval = setInterval(createAndAnimatePhoto, interval);
}

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const autoplayGuard = document.getElementById('autoplay-guard');
    const letterContainer = document.getElementById('letter-container');
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
    getLetterBounds(); 

    startButton.addEventListener('click', () => {
        startMusicWithFadeIn();
        
        autoplayGuard.classList.add('hidden');

        setTimeout(() => {
            letterContainer.classList.add('visible');
        }, 500); 

        startPhotoStream();
    }, { once: true }); 

    window.addEventListener('resize', () => {
        getLetterBounds();
        if(letterContainer.classList.contains('visible')) {
            document.querySelectorAll('.photo-frame').forEach(frame => frame.remove());
            startPhotoStream();
        }
    });
    
    window.addEventListener('beforeunload', () => {
        if (photoStreamInterval) clearInterval(photoStreamInterval);
    });
});