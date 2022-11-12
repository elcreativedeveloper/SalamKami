// Create Element
function functionCreateElement(tag, options) {
    var element = document.createElement(tag);
    for (var attributes in options) {
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
function functionLoadScript(source) {
    return new Promise(function (resolve, reject) {
        var element = functionCreateElement('script', {
            src: source,
            async: true,
            defer: true,
        });
        var boolean = false;

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

        var elementScript = document.getElementsByTagName('script')[0];
        elementScript.parentNode.insertBefore(element, elementScript);
    });
}

Defer(function () {
    const elementApp = document.getElementById('app');
    const elementLoaders = document.getElementById('loaders');
    elementLoaders.remove();
    elementApp.classList.remove('invisible');

    functionRunInvitation();
}, 2000);

function functionRunInvitation() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if (urlParams.get('kepada') != null || urlParams.get('to') != null) {
        document.getElementById('text_kepada').innerText = urlParams.get('kepada') || urlParams.get('to');
    } else {
        document.getElementById('text_kepada').innerText = 'Tamu Undangan';
    }

    let musicIsPlaying = false;
    functionPlayMusic = function (selector, options) {
        if (options.playMusic) {
            if (selector) {
                selector.play();
            }
        } else {
            if (selector) {
                if (musicIsPlaying) {
                    selector.pause();
                } else {
                    selector.play();
                }
            }
        }

        if (selector) {
            selector.onplaying = function () {
                musicIsPlaying = true;
            };
            selector.onpause = function () {
                musicIsPlaying = false;
            };
        }
    };

    functionFullScreen = function (toggleButton) {
        const isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) || (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) || (document.mozFullScreenElement && document.mozFullScreenElement !== null) || (document.msFullscreenElement && document.msFullscreenElement !== null);
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
                if (toggleButton != null) {
                    toggleButton.querySelector('.fullscreen_off').classList.add('hidden');
                    toggleButton.querySelector('.fullscreen_on').classList.remove('hidden');
                }
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
                if (toggleButton != null) {
                    toggleButton.querySelector('.fullscreen_off').classList.add('hidden');
                    toggleButton.querySelector('.fullscreen_on').classList.remove('hidden');
                }
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
                if (toggleButton != null) {
                    toggleButton.querySelector('.fullscreen_off').classList.add('hidden');
                    toggleButton.querySelector('.fullscreen_on').classList.remove('hidden');
                }
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
                if (toggleButton != null) {
                    toggleButton.querySelector('.fullscreen_off').classList.add('hidden');
                    toggleButton.querySelector('.fullscreen_on').classList.remove('hidden');
                }
            }
        }
    };

    functionCountdown = function (target) {
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

    let glideControl = '';
    document.querySelectorAll('.glide__slide').forEach(function (value, index) {
        glideControl += `<div class="glide__bullet ${index == 0 ? 'hidden' : ''} relative mx-1 h-1 w-full cursor-pointer overflow-hidden rounded-lg first:ml-0 last:mr-0" data-glide-dir="=${index}"></div>`
    });

    functionLoadScript('https://cdn.jsdelivr.net/npm/@glidejs/glide').then(function () {
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
        glide.on('move.after', function () {
            if (glide.index == 0) {
                document.body.classList.add('glide_first');
            } else {
                document.body.classList.remove('glide_first');
            }
        });


        document.getElementById('glide__bullets').innerHTML = glideControl;

        document.getElementById('button_swipe') && document.getElementById('button_swipe').addEventListener('click', function (event) {
            event.preventDefault();

            glide.enable();
            glide.go('>');

            document.querySelector('.glide__bullets').classList.remove('invisible');

            functionPlayMusic(document.getElementById('music') ? document.getElementById('music') : null, {
                playMusic: true,
            });
            // functionFullScreen(null);
        });

        document.getElementById('button_toggle_audio') && document.getElementById('button_toggle_audio').addEventListener('click', function (event) {
            if (musicIsPlaying) {
                this.querySelector('.audio_on').classList.add('hidden');
                this.querySelector('.audio_off').classList.remove('hidden');

                functionPlayMusic(document.getElementById('music') ? document.getElementById('music') : null, {
                    playMusic: false,
                });
            } else {
                this.querySelector('.audio_on').classList.remove('hidden');
                this.querySelector('.audio_off').classList.add('hidden');

                functionPlayMusic(document.getElementById('music') ? document.getElementById('music') : null, {
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
                        document.getElementById('button_salin_rekening').innerHTML = 'Gagal Disalin';
                    });
            }
        })

        document.getElementById('button_toggle_fullscreen') && document.getElementById('button_toggle_fullscreen').addEventListener('click', function (event) {
            event.preventDefault();
            this.querySelector('.fullscreen_off').classList.remove('hidden');
            functionFullScreen(this);
        });

        const images = document.querySelector('.layout_gallery');
        if (images) {
            functionLoadScript('https://cdn.jsdelivr.net/npm/medium-zoom@1.0.6/dist/medium-zoom.min.js').then(() => {
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
            this.functionCountdown(countdownElement[index]);
        }
    });
}

const pathName = window.location.pathname.split('/').pop();