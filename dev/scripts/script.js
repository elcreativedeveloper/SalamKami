// Create Element
const createElement = (tag, options) => {
    let element = document.createElement(tag);
    for (let attributes in options) {
        if (attributes == 'class') {
            // If Has Class Attribute
            element.classList.add.apply(element.classList, options[attributes]);
        } else if (attributes == 'content') {
            // If Has Contents
            element.innerHTML = options[attributes];
        } else {
            element[attributes] = options[attributes];
        }
    }

    return element;
}

// Load Script Promise
const loadScript = (source) => {
    return new Promise((resolve, reject) => {
        let element = createElement('script', {
            src: source,
            async: true,
            defer: true,
        });
        let boolean = false;

        element.onload = element.onreadystatechange = function () {
            if (!boolean && (!this.readyState || this.readyState == 'complete')) {
                boolean = true;
                resolve();
            }
            // console.log(this.readyState);
        };

        element.onerror = function () {
            reject(element, source);
        };

        const elementScript = document.getElementsByTagName('script')[0];
        elementScript.parentNode.insertBefore(element, elementScript);
    });
}

// Get URL Parameter (For Invitation Receipent)
const getURLParams = (params, element) => {
    const urlParams = new URLSearchParams(params);

    if (urlParams.get('kepada') != null || urlParams.get('to') != null) {
        element.innerText = urlParams.get('kepada') || urlParams.get('to');
    };
};

// Play Music
let musicIsPlaying = false;
const playMusic = (selector, options) => {
    if (selector) {
        if (options.playMusic) {
            selector.play();
            musicIsPlaying = true;
        } else {
            if (musicIsPlaying) {
                selector.pause();
                musicIsPlaying = false;
            } else {
                selector.play();
                musicIsPlaying = true;
            }
        }

        selector.onplaying = function () {
            musicIsPlaying = true;
        };
        selector.onpause = function () {
            musicIsPlaying = false;
        };
    }
};

// Full Screen
const fullScreenMode = (toggleButton) => {
    const isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) || (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) || (document.mozFullScreenElement && document.mozFullScreenElement !== null) || (document.msFullscreenElement && document.msFullscreenElement !== null);

    const toggles = () => {
        if (toggleButton != null) {
            toggleButton.querySelector('.fullscreen_off').classList.add('hidden');
            toggleButton.querySelector('.fullscreen_on').classList.remove('hidden');
        }
    }

    if (!isInFullScreen) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
            if (toggleButton != null) {
                toggleButton.querySelector('.fullscreen_off').classList.remove('hidden');
                toggleButton.querySelector('.fullscreen_on').classList.add('hidden');
            }
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
            if (toggleButton != null) {
                toggleButton.querySelector('.fullscreen_off').classList.remove('hidden');
                toggleButton.querySelector('.fullscreen_on').classList.add('hidden');
            }
        } else if (document.documentElement.webkitRequestFullScreen) {
            document.documentElement.webkitRequestFullScreen();
            if (toggleButton != null) {
                toggleButton.querySelector('.fullscreen_off').classList.remove('hidden');
                toggleButton.querySelector('.fullscreen_on').classList.add('hidden');
            }
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
            if (toggleButton != null) {
                toggleButton.querySelector('.fullscreen_off').classList.remove('hidden');
                toggleButton.querySelector('.fullscreen_on').classList.add('hidden');
            }
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            toggles();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
            toggles();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
            toggles();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
            toggles();
        }
    }
};

// Countdown
const countdown = (target) => {
    const countDownDate = new Date(target.dataset.datetime).getTime();
    const countDownDays = target.querySelector('.countdown > .day > .number');
    const countDownHours = target.querySelector('.countdown > .hour > .number');
    const countDownMinutes = target.querySelector('.countdown > .minute > .number');
    const countDownSeconds = target.querySelector('.countdown > .second > .number');

    // Update the count down every 1 second
    let interval = setInterval(function () {
        // Get today's date and time
        const now = new Date().getTime();

        // Find the distance between now and the count down date
        const distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countDownDays.innerHTML = days;
        countDownHours.innerHTML = hours;
        countDownMinutes.innerHTML = minutes;
        countDownSeconds.innerHTML = seconds;

        // If the count down is over, write some text
        if (distance < 0) {
            clearInterval(interval);
            countDownDays.innerHTML = '00';
            countDownHours.innerHTML = '00';
            countDownMinutes.innerHTML = '00';
            countDownSeconds.innerHTML = '00';
        }
    }, 1000);
};

Defer(() => {
    const elementApp = document.getElementById('app');
    const elementLoaders = document.getElementById('loaders');

    elementLoaders.remove();
    elementApp.classList.remove('invisible');

    getURLParams(window.location.search, document.getElementById('text_kepada'));

    loadScript('https://cdn.jsdelivr.net/npm/@glidejs/glide').then(() => {
        const glide = new Glide('.glide', {
            autoplay: 8000,
            animationDuration: 600,
            animationTimingFunc: 'cubic-bezier(0.165, 0.840, 0.440, 1.000)',
            hoverpause: true,
            gap: 0,
            rewind: false,
            type: 'slider',
        }).mount();

        glide.disable();
        glide.on('move.after', () => {
            if (glide.index == 0) {
                document.body.classList.add('glide_first');
            } else {
                document.body.classList.remove('glide_first');
            }
        });

        let glideControl = '';
        document.querySelectorAll('.glide__slide').forEach((value, index) => {
            glideControl += `<div class="glide__bullet ${index == 0 ? 'hidden' : ''} relative mx-1 h-1 w-full cursor-pointer overflow-hidden rounded-lg first:ml-0 last:mr-0" data-glide-dir="=${index}"></div>`
        });
        document.getElementById('glide__bullets').innerHTML = glideControl;

        // Slide Cover
        document.getElementById('button_swipe') && document.getElementById('button_swipe').addEventListener('click', (event) => {
            event.preventDefault();

            glide.enable();
            glide.go('>');

            document.querySelector('.glide__bullets').classList.remove('invisible');

            playMusic(document.getElementById('music') ? document.getElementById('music') : null, {
                playMusic: true,
            });
            // fullScreenMode(null);
        });

        // Button Toggle Audio
        document.getElementById('button_toggle_audio') && document.getElementById('button_toggle_audio').addEventListener('click', function (event) {
            if (musicIsPlaying) {
                this.querySelector('.audio_on').classList.add('hidden');
                this.querySelector('.audio_off').classList.remove('hidden');

                playMusic(document.getElementById('music') ? document.getElementById('music') : null, {
                    playMusic: false,
                });
            } else {
                this.querySelector('.audio_on').classList.remove('hidden');
                this.querySelector('.audio_off').classList.add('hidden');

                playMusic(document.getElementById('music') ? document.getElementById('music') : null, {
                    playMusic: true,
                });
            }
        });

        document.getElementById('button_hadiah') && document.getElementById('button_hadiah').addEventListener('click', function (event) {
            event.preventDefault();

            document.querySelector('.container_hadiah').classList.remove('hidden');
            document.querySelector('.container_kado').classList.add('hidden');
        });

        document.getElementById('button_kado') && document.getElementById('button_kado').addEventListener('click', function (event) {
            event.preventDefault();

            document.querySelector('.container_kado').classList.remove('hidden');
            document.querySelector('.container_hadiah').classList.add('hidden');
        });

        document.getElementById('button_salin_rekening') && document.getElementById('button_salin_rekening').addEventListener('click', function (event) {
            event.preventDefault();

            const rekening = document.getElementById('nomor_rekening').textContent.replace(/\s/g, '').replace('-', '').trim();
            if (!navigator.clipboard) {
                let textarea = document.createElement('textarea');
                textarea.textContent = rekening;
                textarea.className = 'sr-only';
                document.body.appendChild(textarea);

                let selection = document.getSelection();
                let range = document.createRange();
                //  range.selectNodeContents(textarea);
                range.selectNode(textarea);
                selection.removeAllRanges();
                selection.addRange(range);

                document.execCommand('copy')
                document.getElementById('button_salin_rekening').innerHTML = 'Berhasil Disalin';
                selection.removeAllRanges();

                document.body.removeChild(textarea);
            } else {
                navigator.clipboard
                    .writeText(rekening)
                    .then(function () {
                        document.getElementById('button_salin_rekening').innerHTML = 'Berhasil Disalin';
                    })
                    .catch(function () {
                        document.getElementById('button_salin_rekening').remove();
                    });
            }
        })

        document.getElementById('button_toggle_fullscreen') && document.getElementById('button_toggle_fullscreen').addEventListener('click', function (event) {
            event.preventDefault();
            this.querySelector('.fullscreen_off').classList.remove('hidden');
            fullScreenMode(this);
        });

        const images = document.querySelector('.layout_gallery');
        if (images) {
            loadScript('https://cdn.jsdelivr.net/npm/medium-zoom@1.0.6/dist/medium-zoom.min.js').then(() => {
                let imageList = images.querySelector('#image_list').textContent.split(/\s*,\s*/);
                for (let index = 0; index < imageList.length; index++) {
                    imageList[index] = `<img data-zoomable class='rounded-md mb-3 animate_animated animate_fadeIn animate_slower w-full' src='${imageList[index]}' />`
                };

                images.querySelector('#image_list').innerHTML = imageList.toString().replace(/\,/g, '');

                mediumZoom('[data-zoomable]');
            })
        }

        // countdown
        const countdownElement = document.getElementsByClassName('countdown_wrapper');
        for (let index = 0; index < countdownElement.length; index++) {
            this.countdown(countdownElement[index]);
        }
    })
}, 2000);