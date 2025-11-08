var canvas = document.getElementById('canvas');
var envelopeButton = document.getElementById('envelopeButton');
var birthdayMsg = document.getElementById('birthdayMsg');
var bdayAudio = document.getElementById('bdayAudio');

var startOverlay = document.getElementById('start-overlay');
var startButton = document.getElementById('start-button');

var heartPoints = [];
var isRunning = false;
var currentIndex = 0;
var totalPoints = 90; 

var sentences = [
    '愿你无忧无虑', '今天是你的生日', '祝你生日快乐', '愿你美梦成真',
    '葱葱永远在你身边', '希望你天天开心', '愿你心想事成', '祝你前程似锦',
    '每天都充满欢笑', '愿你健康平安', '和我永远在一起！', '希望你每天都有话说！',
    '愿你青春永相伴', '学业有成！', '希望你幸福！', '愿你梦想成真',
    '祝你一切顺利', '没有烦恼', '愿你生活甜蜜', '祝你好运连连',
    '大学生活顺利', '愿你爱情甜蜜', '祝你身体健康', '希望你心情愉快',
    '愿你拥有美好', '过着自己喜欢的生活！', 'CHEERRRRR!!!', '实现梦想',
    '祝你开心每一天', '希望你被爱包围', '愿你健康成长', '祝你永远年轻',
    '希望你越来越好', '愿你幸运常在', '祝你心情美丽', '希望你快乐成长',
    '每一天都不一样幸福！', '快乐永相随', '情商超高', '为你点赞', '心想事成',
    '幸福一生', '充满ENERGY!!!', '美好！LOVEEE!', '一切安好', '笑对人生'
];

var gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)',
    'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
    'linear-gradient(135deg, #f77062 0%, #fe5196 100%)',
    'linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)',
    'linear-gradient(135deg, #48c6ef 0%, #6f86d6 100%)',
    'linear-gradient(135deg, #feada6 0%, #f5efef 100%)'
];

function generateHeartPoints(count) {
    var points = [];
    var canvasWidth = window.innerWidth;
    var canvasHeight = window.innerHeight;
    var centerX = canvasWidth / 2;
    var centerY = canvasHeight / 2;
    
    var baseScale = Math.min(canvasWidth, canvasHeight) / 45; 
    
    for (var i = 0; i < count; i++) {
        var t = (i / count) * Math.PI * 2;
        
        var x = 16 * Math.pow(Math.sin(t), 3);
        
        var y = -(
            13 * Math.cos(t) 
            - 5 * Math.cos(2 * t) 
            - 2 * Math.cos(3 * t) 
            - Math.cos(4 * t)
        );
        
        points.push({ 
            x: x * baseScale + centerX, 
            y: y * baseScale + centerY
        });
    }
    
    return points;
}

function updateHeartPoints() {
    heartPoints = generateHeartPoints(totalPoints);
}

updateHeartPoints();

function addHeartWord() {
    if (currentIndex >= totalPoints) {
        showBirthdayMessage();
        return;
    }
    
    var text = sentences[Math.floor(Math.random() * sentences.length)];
    var word = document.createElement('div');
    word.className = 'word-box';
    word.textContent = text;
    var gradient = gradients[Math.floor(Math.random() * gradients.length)];
    word.style.background = gradient;
    
    word.style.position = 'absolute'; 
    word.style.visibility = 'hidden';
    canvas.appendChild(word); 
    
    var targetPoint = heartPoints[currentIndex];
    var finalX = targetPoint.x;
    var finalY = targetPoint.y;

    var direction;
    var nonPeakOffset = 0; 
    
    if (currentIndex >= 35 && currentIndex <= 55) {
        var centerX = window.innerWidth / 2;
        var distanceFromCenter = Math.abs(finalX - centerX);
        var pushOut = 10 * (distanceFromCenter / (window.innerWidth / 2));
        
        if (finalX < centerX) {
            finalX -= pushOut;
        } else {
            finalX += pushOut;
        }
        finalY -= 5; 
    }
    
    finalX += (Math.random() * nonPeakOffset) - (nonPeakOffset / 2);
    finalY += (Math.random() * nonPeakOffset) - (nonPeakOffset / 2);
    direction = Math.floor(Math.random() * 4); 

    word.style.visibility = '';

    word.style.setProperty('--final-x', finalX + 'px');
    word.style.setProperty('--final-y', finalY + 'px');

    var animationName;

    switch (direction) {
        case 1: animationName = 'slideFromLeft'; break;
        case 2: animationName = 'slideFromTop'; break;
        case 3: animationName = 'slideFromBottom'; break;
        case 0: default: animationName = 'slideFromRight'; break;
    }

    var duration = 700 + Math.random() * 300;
    word.style.animation = `${animationName} ${duration}ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards`;
    
    currentIndex++;
    
    return true;
}

var randomWordInterval = null;

function addRandomWord() {
    var text = sentences[Math.floor(Math.random() * sentences.length)];
    var word = document.createElement('div');
    word.className = 'word-box random-word-box';
    word.textContent = text;

    var gradient = gradients[Math.floor(Math.random() * gradients.length)];
    word.style.background = gradient;
    
    var startX, startY;
    var edge = Math.floor(Math.random() * 4); 

    switch (edge) {
        case 1: startX = -50; startY = Math.random() * window.innerHeight; break;
        case 2: startX = Math.random() * window.innerWidth; startY = -50; break;
        case 3: startX = Math.random() * window.innerWidth; startY = window.innerHeight + 50; break;
        case 0: default: startX = window.innerWidth + 50; startY = Math.random() * window.innerHeight; break;
    }

    var endX = (Math.random() * window.innerWidth * 0.5) + window.innerWidth * 0.25;
    var endY = (Math.random() * window.innerHeight * 0.5) + window.innerHeight * 0.25;

    var duration = 3000 + Math.random() * 2000;
    var delay = Math.random() * 100;

    word.style.setProperty('--rand-start-x', startX + 'px');
    word.style.setProperty('--rand-start-y', startY + 'px');
    word.style.setProperty('--rand-end-x', endX + 'px');
    word.style.setProperty('--rand-end-y', endY + 'px');
    word.style.setProperty('--rand-start-rot', (Math.random() * 90 - 45) + 'deg');
    word.style.setProperty('--rand-end-rot', (Math.random() * 90 - 45) + 'deg');
    
    word.style.animation = `randomFlyAndFade ${duration}ms ease-out ${delay}ms forwards`;

    canvas.appendChild(word);

    setTimeout(() => {
        word.remove();
    }, duration + 500);
}

function startRandomWords() {
    if (randomWordInterval) clearInterval(randomWordInterval);
    randomWordInterval = setInterval(addRandomWord, 200); 
}

function stopRandomWords() {
    if (randomWordInterval) clearInterval(randomWordInterval);
}

function showBirthdayMessage() {
    isRunning = false;
    stopRandomWords(); 
    
    setTimeout(function() {
        birthdayMsg.classList.add('show');
        
        setTimeout(function() {
            envelopeButton.classList.add('show');
        }, 1000);
    }, 500);
}

function startAnimation() {
    if (isRunning) return;
    isRunning = true;
    
    startRandomWords(); 

    function scheduleNextHeartWord() {
        if (!isRunning || currentIndex >= totalPoints) {
            if (currentIndex >= totalPoints) {
                showBirthdayMessage();
            }
            return;
        }
        addHeartWord();
        
        var delay = 200 + Math.random() * 200; 
        
        setTimeout(scheduleNextHeartWord, delay);
    }
    
    scheduleNextHeartWord();
}

startButton.addEventListener('click', function() {
    if (bdayAudio) {
        bdayAudio.muted = false;
        bdayAudio.volume = 0.5;
        bdayAudio.play().catch(error => {
            console.log("Audio play failed after click:", error);
        });
    }

    startOverlay.classList.add('hidden');

    setTimeout(function() {
        startAnimation();
    }, 100);
});


envelopeButton.addEventListener('click', function() {
    
    var nextWebsiteUrl = 'letter_page.html'; 
    
    setTimeout(() => {
        if (bdayAudio) {
             bdayAudio.pause();
        }
        window.location.href = nextWebsiteUrl;
    }, 1000);
});

window.addEventListener('resize', function() {
    updateHeartPoints();
    currentIndex = 0;
    
    var heartWords = document.querySelectorAll('.word-box:not(.random-word-box)');
    heartWords.forEach(word => word.remove());

    if (!isRunning && !startOverlay.classList.contains('hidden')) {
    } else if (!isRunning) {
         startAnimation();
    }
});

window.addEventListener('load', function() {
    if (bdayAudio) {
        bdayAudio.play().catch(error => {
            console.log("Silent audio playback prevented, error:", error);
        });
    }
});