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
const fullScreenMode = toggleButton => {
    const isInFullScreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;

    const toggleButtonVisibility = (bool) => {
        if (toggleButton) {
            if (bool) {
                toggleButton.querySelector(".fullscreen_off").classList.remove("hidden");
                toggleButton.querySelector(".fullscreen_on").classList.add("hidden");
            } else {
                toggleButton.querySelector(".fullscreen_off").classList.add("hidden");
                toggleButton.querySelector(".fullscreen_on").classList.remove("hidden");
            }
        }
    };

    if (!isInFullScreen) {
        const requestFullscreen = document.documentElement.requestFullscreen || document.documentElement.mozRequestFullScreen || document.documentElement.webkitRequestFullScreen || document.documentElement.msRequestFullscreen;

        if (requestFullscreen) {
            requestFullscreen.call(document.documentElement);
            toggleButtonVisibility(true);
        }
    } else {
        const exitFullscreen = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;

        if (exitFullscreen) {
            exitFullscreen.call(document);
            toggleButtonVisibility(false);
        }
    }
};


let isLoaded = false;
setTimeout(() => {
    if (!isLoaded) {
        isLoaded = true;

        const elementApp = document.getElementById('app');
        const elementLoaders = document.getElementById('loaders');

        elementLoaders.remove();
        elementApp.classList.remove('invisible');

        getURLParams(window.location.search, document.getElementById('text_kepada'));

        loadScript('https://cdn.jsdelivr.net/npm/@glidejs/glide').then(() => {
            const glideBullets = document.querySelector('.glide__bullets');


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
                if (glide.index === 0) {
                    document.body.classList.add('glide_first');
                } else {
                    document.body.classList.remove('glide_first');
                }
            });

            let glideControl = '';
            document.querySelectorAll('.glide__slide').forEach((element, index) => {
                glideControl += `<div class="glide__bullet ${index == 0 ? 'hidden' : ''} relative mx-1 h-1 w-full cursor-pointer overflow-hidden rounded-md first:ml-0 last:mr-0" data-glide-dir="=${index}"></div>`
            });
            glideBullets.innerHTML = glideControl;


            // Cover
            const slideCover = document.querySelector('.layout_cover');
            if (slideCover) {
                const buttonSwipe = slideCover.querySelector('#button_swipe');
                if (buttonSwipe) {
                    buttonSwipe.addEventListener('click', (event) => {
                        event.preventDefault();

                        glide.enable();
                        glide.go('>');

                        glideBullets.classList.remove('invisible');

                        playMusic(document.getElementById('music') ? document.getElementById('music') : null, {
                            playMusic: true,
                        });

                        fullScreenMode(document.querySelector('#button_toggle_fullscreen'));
                    })
                }
            };

            // Date
            const slideDate = document.querySelector('.layout_date');
            if (slideDate) {
                const countdownWrapper = slideDate.querySelector('.countdown_wrapper');
                if (countdownWrapper) {
                    const countDownDate = new Date(countdownWrapper.dataset.datetime).getTime();
                    const countDownElements = {
                        days: countdownWrapper.querySelector('.countdown .day .number'),
                        hours: countdownWrapper.querySelector('.countdown .hour .number'),
                        minutes: countdownWrapper.querySelector('.countdown .minute .number'),
                        seconds: countdownWrapper.querySelector('.countdown .second .number'),
                    };

                    // Update the count down every 1 second
                    let interval = setInterval(() => {
                        const now = new Date().getTime();
                        const distance = countDownDate - now;
                        if (distance < 0) {
                            clearInterval(interval);
                            for (const element in countDownElements) {
                                countDownElements[element].innerHTML = '00';
                            }
                        } else {
                            const timeRemaining = {
                                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                                seconds: Math.floor((distance % (1000 * 60)) / 1000),
                            };

                            for (const element in countDownElements) {
                                countDownElements[element].innerHTML = timeRemaining[element];
                            }
                        }
                    }, 1000)
                }
            };

            // Gallery
            const slideGallery = document.querySelector('.layout_gallery');
            if (slideGallery) {
                loadScript('https://cdn.jsdelivr.net/npm/medium-zoom@1.0.6/dist/medium-zoom.min.js').then(() => {
                    let imageList = slideGallery.querySelector('#image_list').textContent.split(/\s*,\s*/);
                    imageList.forEach((element, index) => {
                        imageList[index] = `<img data-zoomable class='rounded-md mb-3 animate_animated animate_fadeIn animate_slower w-full' src='${element}' />`
                    });

                    slideGallery.querySelector('#image_list').innerHTML = imageList.toString().replace(/\,/g, '');

                    mediumZoom('[data-zoomable]');
                })
            };

            // Gift
            const slideGift = document.querySelector('.layout_gift');
            if (slideGift) {
                const copyToClipboard = (text) => {
                    if (!navigator.clipboard) {
                        return new Promise((resolve, reject) => {
                            let textarea = document.createElement('textarea');
                            textarea.textContent = text;
                            textarea.className = 'sr-only';
                            document.body.appendChild(textarea);

                            let selection = document.getSelection();
                            let range = document.createRange();
                            range.selectNode(textarea);
                            selection.removeAllRanges();
                            selection.addRange(range);

                            const success = document.execCommand('copy');
                            selection.removeAllRanges();
                            document.body.removeChild(textarea);

                            success ? resolve() : reject();
                        });
                    } else {
                        return navigator.clipboard.writeText(text);
                    }
                };

                const buttonHadiah = slideGift.querySelector('#button_hadiah');
                if (buttonHadiah) {
                    buttonHadiah.addEventListener('click', (event) => {
                        event.preventDefault();

                        slideGift.querySelector('.container_hadiah').classList.remove('hidden');
                        slideGift.querySelector('.container_kado').classList.add('hidden');
                    });
                };

                const buttonKado = slideGift.querySelector('#button_kado');
                if (buttonKado) {
                    buttonKado.addEventListener('click', (event) => {
                        event.preventDefault();

                        slideGift.querySelector('.container_kado').classList.remove('hidden');
                        slideGift.querySelector('.container_hadiah').classList.add('hidden');
                    });
                };

                const buttonCopyRekening = slideGift.querySelector('#button_salin_rekening');
                if (buttonCopyRekening) {
                    buttonCopyRekening.addEventListener('click', (event) => {
                        event.preventDefault();
                        const rekening = slideGift.querySelector('#nomor_rekening').textContent.replace(/\s/g, '').replace('-', '').trim();

                        copyToClipboard(rekening).then(() => {
                            buttonCopyRekening.innerHTML = 'Berhasil Disalin';
                        }).catch(() => {
                            buttonCopyRekening.remove();
                        });
                    })
                }
            };

            // FAB
            const fab = document.querySelector('.fab');
            if (fab) {
                const buttonFullScreen = fab.querySelector('#button_toggle_fullscreen');
                if (buttonFullScreen) {
                    buttonFullScreen.addEventListener('click', (event) => {
                        event.preventDefault();

                        fullScreenMode(buttonFullScreen);
                    });
                };

                const buttonAudio = fab.querySelector('#button_toggle_audio');
                if (buttonAudio) {
                    buttonAudio.addEventListener('click', function (event) {
                        event.preventDefault();

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
                }
            }
        })
    }
}, 2000)