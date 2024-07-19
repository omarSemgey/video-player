const container = document.querySelector(".container"),
mainVideo = container.querySelector("video"),
videoTimeline = container.querySelector(".video-timeline"),
progressBar = container.querySelector(".progress-bar"),
volumeBtn = container.querySelector(".volume i"),
volumeSlider = container.querySelector(".left input"),
wrapper = container.querySelector('.wrapper'),
currentVidTime = container.querySelector(".current-time"),
videoDuration = container.querySelector(".video-duration"),
skipBackward = container.querySelector(".skip-backward i"),
skipForward = container.querySelector(".skip-forward i"),
playPauseBtn = container.querySelector(".play-pause i"),
speedBtn = container.querySelector(".playback-speed span"),
speedOptions = container.querySelector(".speed-options"),
pipBtn = container.querySelector(".pic-in-pic span"),
fullScreenBtn = container.querySelector(".fullscreen i");



videoTimeline.addEventListener('click', e => {
    let timelineWidth = e.target.clientWidth;
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
});

videoTimeline.addEventListener('mousedown', () => {
    videoTimeline.addEventListener('mousemove',draggableProgressBar);
    const progressArea= videoTimeline.querySelector('.progress-area');
    progressArea.style.height='7px'
});

document.addEventListener('mouseup', () => {
    videoTimeline.removeEventListener('mousemove',draggableProgressBar);
    const progressArea= videoTimeline.querySelector('.progress-area');
    progressArea.style.height='4px'
});

videoTimeline.addEventListener('mousemove', e =>{
    const progressTime= videoTimeline.querySelector('span');
    let offsetX = e.offsetX;
    progressTime.style.left = `${offsetX}px`;
    let timelineWidth = videoTimeline.clientWidth;
    let percent = (e.offsetX / timelineWidth) * mainVideo.duration;
    progressTime.innerText = formatTime(percent)
});

mainVideo.addEventListener('timeupdate',e => {
    let {currentTime,duration} = e.target;
    let percent= (currentTime / duration) * 100;
    progressBar.style.width = `${percent}%`;
    currentVidTime.innerText = formatTime(currentTime);
    if(formatTime(currentTime) == formatTime(mainVideo.duration)){
        
    }
});

mainVideo.addEventListener('loadeddata',e => {
    videoDuration.innerText = formatTime(e.target.duration);
    volumeSlider.value =mainVideo.volume;
});

volumeBtn.addEventListener('click',() => {
    if(!volumeBtn.classList.contains('fa-volume-high')){
        mainVideo.volume = 0.5;
        volumeBtn.classList.replace('fa-volume-xmark','fa-volume-high');
        volumeSlider.value=0.5;
    }else{
        mainVideo.volume = 0;
        volumeBtn.classList.replace('fa-volume-high','fa-volume-xmark');
        volumeSlider.value=0;
    }
});

volumeSlider.addEventListener('input',e =>{
    mainVideo.volume = e.target.value;
    if(mainVideo.volume === 0){
        volumeBtn.classList.replace('fa-volume-high','fa-volume-xmark');
    }else{
        volumeBtn.classList.replace('fa-volume-xmark','fa-volume-high');
    }
})

speedBtn.addEventListener('click',()=>{
    speedOptions.classList.toggle('show');
});

speedOptions.querySelectorAll('li').forEach(option =>{
    option.addEventListener('click',() =>{
        mainVideo.playbackRate = option.dataset.speed;
        speedOptions.querySelector('.active').classList.remove('active');
        option.classList.add('active')
    });
});

document.addEventListener('click', e =>{
    if(e.target.className !== 'material-symbols-rounded'){
        speedOptions.classList.remove('show');
    }
});

pipBtn.addEventListener('click',()=>{
    mainVideo.requestPictureInPicture();
});

fullScreenBtn.addEventListener('click',()=>{
    if(document.fullscreenElement){
        fullScreenBtn.classList.replace('fa-compress','fa-expand');
        return document.exitFullscreen();
    }
    fullScreenBtn.classList.replace('fa-expand','fa-compress');
    container.requestFullscreen();
    controlFullscreen();
});


skipBackward.addEventListener('click',() => {
    mainVideo.currentTime -=5;
});

skipForward.addEventListener('click',() => {
    mainVideo.currentTime +=5;
});


playPauseBtn.addEventListener('click',() => {
    if(formatTime(mainVideo.currentTime) == formatTime(mainVideo.duration)){
        mainVideo.currentTime = 0;
    } else if(mainVideo.paused){
        mainVideo.play();
    }else{
        mainVideo.pause();
    }
});


mainVideo.addEventListener('play',() => {
    playPauseBtn.classList.replace('fa-play','fa-pause');
});

mainVideo.addEventListener('pause',() => {
    playPauseBtn.classList.replace('fa-pause','fa-play');
});

container.addEventListener('mousedown', e => {
    if(e.target.tagName == 'VIDEO'){
        if(mainVideo.paused){
            mainVideo.play();
        }else{
            mainVideo.pause();
        }
    }
})

document.addEventListener('keydown',e => {
    e = e || window.event;
    if (e.keyCode === 38) {
        if(mainVideo.volume < 1){
            mainVideo.volume +=0.1;
            volumeSlider.value=mainVideo.volume;
        }
    } else if (e.keyCode === 40) {
        if(mainVideo.volume > 0){
            mainVideo.volume -=0.1;
            volumeSlider.value = mainVideo.volume;
        }
    } else if (e.keyCode === 37) {
        mainVideo.currentTime -=5;
    } else if (e.keyCode === 39) {
        mainVideo.currentTime +=5;
    } else if (e.keyCode == 32){
        if(mainVideo.paused){
            mainVideo.play();
        }else{
            mainVideo.pause();
        }
    } else if(e.keyCode == 70){
        if(document.fullscreenElement){
            fullScreenBtn.classList.replace('fa-compress','fa-expand');
            wrapper.classList.remove('invisible');
            return document.exitFullscreen();
        }
        fullScreenBtn.classList.replace('fa-expand','fa-compress');
        container.requestFullscreen();
        controlFullscreen();
        container.addEventListener('mouseover', () => {
        });
    }
})

function controlFullscreen(){
    let timeout;
    document.addEventListener('mousemove',()=>{
        clearTimeout(timeout);
        if (document.body.style.cursor !== 'default') {
        document.body.style.cursor = 'default';  
        }
        wrapper.classList.remove('invisible');
        
        
        timeout = setTimeout(()=>{
            if (document.body.style.cursor !== 'none') {
                document.body.style.cursor = 'none';  
            }
            wrapper.classList.add('invisible');
        }, 2000);
    });

    document.addEventListener('mousedown',() => {
        clearTimeout(timeout);
        if (document.body.style.cursor !== 'default') {
            document.body.style.cursor = 'default';  
        }
        wrapper.classList.remove('invisible');
        
        timeout = setTimeout(()=>{
                if (document.body.style.cursor !== 'none') {
                    document.body.style.cursor = 'none';  
                }
                wrapper.classList.add('invisible');
        }, 2000);
    })
}

function  formatTime(time){
    let seconds = Math.floor(time % 60),
    minutes = Math.floor(time / 60) % 60,
    hours = Math.floor(time / 3600);
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    hours = hours < 10 ? `0${hours}` : hours;
    if(hours == 0) {
        return `${minutes}:${seconds}`
    }
    return `${hours}:${minutes}:${seconds}`;
}

function draggableProgressBar(e){
    let timelineWidth = e.target.clientWidth;
    progressBar.style.width = `${e.offsetX}px`;
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
    currentVidTime.innerText = formatTime(mainVideo.currentTime);
}