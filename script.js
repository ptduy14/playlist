const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

/** 
 * Tast musk be done
 * 
 * 1. render listsong --> done
 * 2. scroll effect --> done
 * 3. play / pause / seek --> done
 * 4. cd rotate --> done
 * 5. next / prev --> done
 * 6. random --> done
 * 7. next / repeat when end --> done
 * 8. active song  ---> done
 * 9. scroll active song into view ---> done
 * 10. play song when click
 */

var cd = $('.cd');
const header = $('.dashboard header h2');
const cdImg = $('.cd-img');
const audio = $('#audio');
const btnPlay = $('.btn-toggle-play');
const mainApp = $('.main-app');
const progress =$('#progress');
const nextBtn = $('.btn-next i');
const prevBtn = $('.btn-prev i');
const mixBtn = $('.btn-mix i');
const repeatBtn = $('.btn-repeat i');
const nameSong = $('.dashboard header h2');
const playlist = $('.playlist');

const app = {
    isPlaying: false,
    currentIndex: 0,
    isMixSong: false,
    isRepeat: false,
    songs: [
        {
            name: '7 Rings',
            singer: 'Hawak remix',
            path: './assets/song/song1.mp3',
            image: './assets/img-song/img-song1.jpg',
        },
        {
            name: 'Ngục Tù Tình Yêu ',
            singer: 'Vlux Remix',
            path: './assets/song/song2.mp3',
            image: './assets/img-song/img-song2.jpg',
        },
        {
            name: 'Giá như chưa từng quen',
            singer: 'Hiếu Béo Remix',
            path: './assets/song/song3.mp3',
            image: './assets/img-song/img-song3.jpg',
        },
        {
            name: 'Tình Đầu',
            singer: 'Hoàng Châu Ft Sơn Rambo Remix',
            path: './assets/song/song4.mp3',
            image: './assets/img-song/img-song4.jpg',
        },
        {
            name: 'QUY TẦM',
            singer: 'Rexs ft. Tou & Hor Fyy',
            path: './assets/song/song5.mp3',
            image: './assets/img-song/img-song5.jpg',
        },
        {
            name: 'Khi Phải Quên Đi',
            singer: 'Xi Măng Phố Vol 4',
            path: './assets/song/song6.mp3',
            image: './assets/img-song/img-song6.jpg',
        },
        {
            name: 'Unknow',
            singer: 'Unknow',
            path: './assets/song/song7.mp3',
            image: './assets/img-song/img-song7.jpg',
        },
        {
            name: 'Ông Bà Già Tao Lo hết',
            singer: 'TD Remix',
            path: './assets/song/song8.mp3',
            image: './assets/img-song/img-song8.jpg',
        },
        {
            name: 'Vỡ Tan - Trình Thăng Bình',
            singer: 'LVT Remix',
            path: './assets/song/song9.mp3',
            image: './assets/img-song/img-song9.jpg',
        },
        {
            name: 'Nụ Hồng Mong Manh',
            singer: 'Vanupi Remix',
            path: './assets/song/song10.mp3',
            image: './assets/img-song/img-song10.jpg',
        }
    ],
    render: function () {
        var htmls = this.songs.map(function (song, index) {
            return `
                <div class="song ${index === 0 ? 'active' : ''}" data-index="${index}" >
                    <div class="thump" style="background-image: url('${song.image}');"></div>
                    <div class="body">
                        <div class="name-song">${song.name}</div>
                        <div class="singer">${song.singer}</div>
                    </div>
                    <div class="option">
                        <i class="fa-solid fa-heart"></i>
                    </div>
                </div>
            `;
        });

       playlist.innerHTML = htmls.join(' ');
        
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        });
    },
    handleEvenet: function () {

        // cài đặt animation cho cái đĩa
        var cdImgAnimate = cdImg.animate([
            { transform: 'rotate(360deg)'},
        ],{
            duration: 7000,
            iterations: Infinity
        });

        // cài đặt animation cho cái name song
        cdImgAnimate.pause();

        var currentHeight = cd.offsetWidth;

        // scroll xuống thu nhỏ cd
        document.onscroll = function () {
            // because cd element is restangle so width == height
            var scrollValue = window.scrollY;
            var newHeight = currentHeight - scrollValue;
            
            cd.style.width = newHeight < 0 ? 0 : newHeight + 'px';
            cd.style.opacity = newHeight / currentHeight;
            
        }

        // phát nhạc khi nhấn nút play
        btnPlay.onclick = function () {
            if (app.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        // xử lí sự kiện khi audio được play
        audio.onplay = function () {
            mainApp.classList.add('playing');
            app.isPlaying = true;
            cdImgAnimate.play();
        }
        
        // xử lí sự kiện khi pause
        audio.onpause = function () {
            mainApp.classList.remove('playing');
            app.isPlaying = false;
            cdImgAnimate.pause();
        }

    
        // khi audio bắt đầu được play
        audio.ontimeupdate = function () {
            // duration trả về thời lượng của audio (dv: s)
            // currentTime set giá trị tiến trình của bài hát
            // muốn currentTime vào progress phải đổi nó thành %
            if (audio.duration) {
                var currentProgress = (audio.currentTime / audio.duration) * 100;
                progress.value = currentProgress.toFixed(2);
            }
        } 
        
        // onchange progress khi người dùng tua bài hát
        progress.oninput = function () {
            var timeChange = progress.value;
            audio.currentTime = (audio.duration / 100) * timeChange;
        }

        // next bài hát
        nextBtn.onclick = function () {
            if (app.isMixSong) {
                app.mixSong();
            } else {
                app.nextSong();
            }
            audio.play();
            app.activeSong();
            app.scrollToView();
        }

        // prev bài hát
        prevBtn.onclick = function () {
            if (app.isMixSong) {
                app.mixSong();
            } else {
                app.prevSong();
            }
            audio.play();
            app.activeSong();
            app.scrollToView();
        }

        // bật / tắt mix song
        mixBtn.onclick = function () {
            app.isMixSong = !app.isMixSong;
            mixBtn.classList.toggle('active', app.isMixSong);
            app.isRepeat = false;
            repeatBtn.classList.remove('active');
        }

        // bật tắt repeat
        repeatBtn.onclick = function () {
            app.isRepeat = !app.isRepeat;
            repeatBtn.classList.toggle('active', app.isRepeat);
            app.isMixSong = false;
            mixBtn.classList.remove('active');
        }

        // khi end audio
        audio.onended = function () {
            if (app.isMixSong) {
                app.mixSong();
            } else if (app.isRepeat){
                app.repeatSong();
            } else {
                app.nextSong();
            }
            audio.play();
        }

        // khi click vào playlist thì sẽ trả về target
        playlist.onclick = function (e) {
            var nodeSong = e.target.closest('.song:not(.active)')
            var optionNode = e.target.closest('.option i'); 
            if ( nodeSong || optionNode) {
                if (nodeSong) {
                    app.currentIndex = nodeSong.dataset.index;
                    app.loadCurrentSong();
                    app.activeSong();
                    audio.play();
                }
                
                if (optionNode) {
                    console.log('123')
                }   
            }
        }
       
    },
    loadCurrentSong: function () {
        header.innerText = this.currentSong.name;
        cdImg.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path;
    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex > this.songs.length - 1) {
            app.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            app.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    mixSong: function () {
        let newCurrentIndex
        do {
            newCurrentIndex = Math.floor(Math.random() * this.songs.length);
        } while (newCurrentIndex === this.currentIndex);
        app.currentIndex = newCurrentIndex;
        this.loadCurrentSong();
        app.activeSong();
    },

    repeatSong: function () {
        this.currentIndex;
        this.loadCurrentSong();
    },
    scrollToView: function () {
        setTimeout(() => {
            if (app.currentIndex > 2) {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                })
            } else {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'end',
                })
            }
        },500)
    },
    activeSong: function () {
        var songActived = $('.song.active');
        if (songActived) {
            songActived.classList.remove('active');
        }
        $$('.song')[this.currentIndex].classList.add('active');
    },
    start: function () {
        // định nghĩa phương thức mặc định của oject app
        this.defineProperties();

        // tải bài hát hiện tại lên UI sau khi start 
        this.loadCurrentSong();

        // lắng nghe cách sự kiện liên quan đến DOM Event
        this.handleEvenet();

        // render song ra playlist
        this.render();
    }
}


app.start();