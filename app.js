/**
 * Extracted from https://github.com/videojs/video.js
 */
const getFullscreenApi = () => {
    const FullscreenApi = {
        prefixed: true
    };
    
    // browser API methods
    const apiMap = [
    [
        'requestFullscreen',
        'exitFullscreen',
        'fullscreenElement',
        'fullscreenEnabled',
        'fullscreenchange',
        'fullscreenerror',
        'fullscreen'
    ],
    // WebKit
    [
        'webkitRequestFullscreen',
        'webkitExitFullscreen',
        'webkitFullscreenElement',
        'webkitFullscreenEnabled',
        'webkitfullscreenchange',
        'webkitfullscreenerror',
        '-webkit-full-screen'
    ],
    // Mozilla
    [
        'mozRequestFullScreen',
        'mozCancelFullScreen',
        'mozFullScreenElement',
        'mozFullScreenEnabled',
        'mozfullscreenchange',
        'mozfullscreenerror',
        '-moz-full-screen'
    ],
    // Microsoft
    [
        'msRequestFullscreen',
        'msExitFullscreen',
        'msFullscreenElement',
        'msFullscreenEnabled',
        'MSFullscreenChange',
        'MSFullscreenError',
        '-ms-fullscreen'
    ]
    ];
    
    const specApi = apiMap[0];
    let browserApi;
    
    // determine the supported set of functions
    for (let i = 0; i < apiMap.length; i++) {
        // check for exitFullscreen function
        if (apiMap[i][1] in document) {
            browserApi = apiMap[i];
            break;
        }
    }
    
    // map the browser API names to the spec API names
    if (browserApi) {
        for (let i = 0; i < browserApi.length; i++) {
            FullscreenApi[specApi[i]] = browserApi[i];
        }
    
        FullscreenApi.prefixed = browserApi[0] !== specApi[0];
    }

    return FullscreenApi;
};

const prettyPrintDuration = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    let output = "";
    if (hours > 0) {
        output += "" + hours + ":" + (mins < 10 ? "0" : "");
    }

    output += "" + minutes + ":" + (seconds < 10 ? "0" : "");
    output += "" + seconds;

    return output;
};

const FullscreenApi = getFullscreenApi();
const wrapper = document.querySelector('.interactive-video-wrapper');
const video = wrapper.querySelector('video');

const controls = wrapper.querySelector('.video-controls');
const slider = controls.querySelector('.control-slider');
const playBtn = controls.querySelector('.control-play');
const speedBtn = controls.querySelector('.control-speed');

const panel = wrapper.querySelector('.video-panel');
const panelSpeedBtns = panel.querySelectorAll('.panel-speed');

video.addEventListener('canplaythrough', function (el, evt) {
    video.removeAttribute('controls');
    controls.style.visibility = 'visible';

    controls.querySelector('.timer-total').innerHTML = `/ ${prettyPrintDuration(video.duration)}`;
    slider.setAttribute('max', video.duration);
});

video.addEventListener('timeupdate', function () {
    controls.querySelector('.timer-current').innerHTML = prettyPrintDuration(video.currentTime);
    // slider.setAttribute('value', video.currentTime);
    slider.value = video.currentTime;
});

slider.addEventListener('change', function () {
    video.currentTime = slider.value;
});

playBtn.addEventListener('click', function (el, evt) {
    if (video.paused) {
        return video.play();
    }

    return video.pause();
});

speedBtn.addEventListener('click', function () {
    panel.classList.toggle('active');
});

panelSpeedBtns.forEach((panelSpeedBtn) => {
    const playbackRate = panelSpeedBtn.dataset.playbackrate;

    panelSpeedBtn.addEventListener('click', function () {
        video.playbackRate = playbackRate;

        panel.querySelectorAll('.panel-speed.selected').forEach((selectedBtn) => {
            selectedBtn.classList.toggle('selected');
        });

        panel.classList.toggle('active');
        panelSpeedBtn.classList.toggle('selected');
    });
});

video.addEventListener('click', function () {
    if (video.paused) {
        return video.play();
    }

    return video.pause();
});


// console.log(FullscreenApi);s