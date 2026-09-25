/* ==================================================
   基础元素
================================================== */

const loader = document.getElementById("loader");
const loaderProgress = document.getElementById("loader-progress");
const loaderStatus = document.getElementById("loader-status");

const menuButton = document.getElementById("menu-button");
const menu = document.getElementById("menu");

const musicButton = document.getElementById("music-button");
const musicIcon = document.getElementById("music-icon");

const audio = document.getElementById("audio");

const timeoutNotice =
    document.getElementById("timeout-notice");


/* ==================================================
   音乐列表
================================================== */

/*
    以后把音乐文件放进：

    musics/

    文件名：

    music1.mp3
    music2.mp3
    music3.mp3
    music4.mp3
    music5.mp3

    这里暂时全部预留。

    当前默认播放 music1.mp3。
*/

const playlist = [

    {
        name: "Music 01",
        src: "musics/music1.mp3"
    },

    {
        name: "Music 02",
        src: "musics/music2.mp3"
    },

    {
        name: "Music 03",
        src: "musics/music3.mp3"
    },

    {
        name: "Music 04",
        src: "musics/music4.mp3"
    },

    {
        name: "Music 05",
        src: "musics/music5.mp3"
    }

];


/*
    当前音乐

    0 = music1
    1 = music2
    2 = music3
    ...
*/

let currentMusic = 0;


/* ==================================================
   音乐初始化
================================================== */

function loadMusic(index) {

    if (!playlist[index]) {
        return;
    }

    audio.src = playlist[index].src;

    audio.load();
}


/*
    默认加载 music1

    注意：
    不自动播放。
*/

loadMusic(currentMusic);


/* ==================================================
   播放 / 暂停
================================================== */

musicButton.addEventListener(
    "click",
    async () => {

        /*
            如果正在播放
            → 暂停
        */

        if (!audio.paused) {

            audio.pause();

            musicButton.classList.remove(
                "playing"
            );

            musicIcon.textContent = "♪";

            return;
        }


        /*
            如果暂停
            → 播放
        */

        try {

            await audio.play();

            musicButton.classList.add(
                "playing"
            );

            musicIcon.textContent = "Ⅱ";

        } catch (error) {

            console.log(
                "音乐播放失败：",
                error
            );

        }

    }
);


/*
    音乐结束之后：

    不自动播放下一首。
*/

audio.addEventListener(
    "ended",
    () => {

        musicButton.classList.remove(
            "playing"
        );

        musicIcon.textContent = "♪";

    }
);


/* ==================================================
   导航
================================================== */

menuButton.addEventListener(
    "click",
    () => {

        menuButton.classList.toggle(
            "active"
        );

        menu.classList.toggle(
            "active"
        );

    }
);


/*
    点击导航项目后自动关闭菜单
*/

document
    .querySelectorAll(".menu-link")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                menuButton.classList.remove(
                    "active"
                );

                menu.classList.remove(
                    "active"
                );

            }
        );

    });


/* ==================================================
   Loading
================================================== */

const startTime = Date.now();

const MIN_LOAD_TIME = 3000;
const MAX_LOAD_TIME = 10000;

let pageReady = false;
let timeoutTriggered = false;


/*
    检查图片是否加载完成
*/

const images =
    Array.from(
        document.images
    );


function checkImages() {

    return images.every(
        image => image.complete
    );

}


/*
    更新加载进度
*/

function updateLoading() {

    const elapsed =
        Date.now() - startTime;


    /*
        根据时间产生平滑进度
    */

    let progress =
        Math.min(
            elapsed / MIN_LOAD_TIME,
            1
        );


    /*
        如果资源加载完成
        并且至少经过 3 秒
        → 进入页面
    */

    if (
        checkImages() &&
        elapsed >= MIN_LOAD_TIME
    ) {

        finishLoading();

        return;

    }


    /*
        10 秒强制结束
    */

    if (
        elapsed >= MAX_LOAD_TIME
    ) {

        timeoutTriggered = true;

        finishLoading();

        return;

    }


    loaderProgress.style.width =
        `${progress * 100}%`;


    if (progress < .35) {

        loaderStatus.textContent =
            "INITIALIZING...";

    } else if (progress < .7) {

        loaderStatus.textContent =
            "LOADING ASSETS...";

    } else {

        loaderStatus.textContent =
            "ENTERING...";

    }


    requestAnimationFrame(
        updateLoading
    );

}


/*
    完成 Loading
*/

function finishLoading() {

    if (pageReady) {
        return;
    }

    pageReady = true;

    loaderProgress.style.width =
        "100%";

    loaderStatus.textContent =
        timeoutTriggered
            ? "TIMEOUT — CONTINUING..."
            : "READY";


    setTimeout(
        () => {

            loader.classList.add(
                "hide"
            );


            /*
                如果是超时进入
                显示提示
            */

            if (timeoutTriggered) {

                setTimeout(
                    () => {

                        timeoutNotice.classList.add(
                            "show"
                        );


                        setTimeout(
                            () => {

                                timeoutNotice.classList.remove(
                                    "show"
                                );

                            },
                            3500
                        );

                    },
                    500
                );

            }

        },
        400
    );

}


/*
    开始 Loading
*/

requestAnimationFrame(
    updateLoading
);


/* ==================================================
   Scroll Reveal
================================================== */

const revealElements =
    document.querySelectorAll(
        ".content-section, .contact-section"
    );


const revealObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(
                entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "visible"
                        );

                    }

                }
            );

        },
        {
            threshold: .15
        }
    );


revealElements.forEach(
    element => {

        element.style.opacity = "0";

        element.style.transform =
            "translateY(40px) scale(.98)";

        element.style.filter =
            "blur(8px)";

        element.style.transition =
            "opacity 1s ease, transform 1s ease, filter 1s ease";

        revealObserver.observe(
            element
        );

    }
);


/*
    visible 状态
*/

const revealStyle =
    document.createElement("style");

revealStyle.textContent = `

    .content-section.visible,
    .contact-section.visible {

        opacity: 1 !important;

        transform:
            translateY(0)
            scale(1) !important;

        filter:
            blur(0) !important;

    }

`;

document.head.appendChild(
    revealStyle
);


/* ==================================================
   外部链接确认
================================================== */

const externalModal =
    document.getElementById(
        "external-modal"
    );

const cancelLink =
    document.getElementById(
        "cancel-link"
    );

const confirmLink =
    document.getElementById(
        "confirm-link"
    );

let pendingLink = null;


/*
    外部链接点击
*/

document
    .querySelectorAll(
        ".external-link"
    )
    .forEach(link => {

        link.addEventListener(
            "click",
            event => {

                /*
                    如果是 #
                    不处理
                */

                if (
                    link.getAttribute("href") === "#"
                ) {

                    event.preventDefault();

                    return;

                }


                event.preventDefault();

                pendingLink =
                    link.href;

                externalModal.classList.add(
                    "active"
                );

            }
        );

    });


/*
    取消
*/

cancelLink.addEventListener(
    "click",
    () => {

        pendingLink = null;

        externalModal.classList.remove(
            "active"
        );

    }
);


/*
    确认
*/

confirmLink.addEventListener(
    "click",
    () => {

        if (pendingLink) {

            window.open(
                pendingLink,
                "_blank",
                "noopener,noreferrer"
            );

        }

        pendingLink = null;

        externalModal.classList.remove(
            "active"
        );

    }
);


/* ==================================================
   背景粒子
================================================== */

const canvas =
    document.getElementById(
        "particles"
    );

const ctx =
    canvas.getContext("2d");


let particles = [];


function resizeCanvas() {

    canvas.width =
        window.innerWidth;

    canvas.height =
        window.innerHeight;

}


window.addEventListener(
    "resize",
    resizeCanvas
);


resizeCanvas();


/*
    创建粒子
*/

function createParticles() {

    particles = [];

    const count =
        Math.min(
            90,
            Math.floor(
                window.innerWidth / 16
            )
        );


    for (
        let i = 0;
        i < count;
        i++
    ) {

        particles.push({

            x:
                Math.random()
                * canvas.width,

            y:
                Math.random()
                * canvas.height,

            size:
                Math.random()
                * 1.4
                + .3,

            speed:
                Math.random()
                * .12
                + .025,

            drift:
                Math.random()
                * .08
                - .04,

            opacity:
                Math.random()
                * .35
                + .08

        });

    }

}


createParticles();


/*
    绘制粒子

    注意：

    不再使用高频率透明度闪烁。
    这样可以解决之前背景
    "一直闪"的问题。
*/

function drawParticles() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    particles.forEach(
        particle => {

            particle.y -=
                particle.speed;

            particle.x +=
                particle.drift;


            if (
                particle.y < -10
            ) {

                particle.y =
                    canvas.height + 10;

            }


            if (
                particle.x < -10
            ) {

                particle.x =
                    canvas.width + 10;

            }


            if (
                particle.x >
                canvas.width + 10
            ) {

                particle.x = -10;

            }


            ctx.beginPath();

            ctx.arc(
                particle.x,
                particle.y,
                particle.size,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                `rgba(
                    220,
                    225,
                    230,
                    ${particle.opacity}
                )`;

            ctx.fill();

        }
    );


    requestAnimationFrame(
        drawParticles
    );

}


drawParticles();


/* ==================================================
   鼠标轻微光晕
================================================== */

let mouseX =
    window.innerWidth / 2;

let mouseY =
    window.innerHeight / 2;


window.addEventListener(
    "mousemove",
    event => {

        mouseX = event.clientX;
        mouseY = event.clientY;

        /*
            不做强烈跟随效果，
            防止背景产生闪烁。
        */

        document.documentElement
            .style.setProperty(
                "--mouse-x",
                `${mouseX}px`
            );

        document.documentElement
            .style.setProperty(
                "--mouse-y",
                `${mouseY}px`
            );

    }
);