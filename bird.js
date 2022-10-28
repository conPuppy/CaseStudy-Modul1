let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

//tạo tiếng game:
let congdiem = new Audio();
congdiem.src = "audio/soundflappybird.mp3";
let die = new Audio();
die.src = "audio/die.wav";
let hit = new Audio();
hit.src = "audio/hit.mp3";
let bay = new Audio();
bay.src = "audio/bay.mp3";

// tạo background:
let sprite = new Image();
sprite.src = "img/abc.png";
let newsprite = new Image();
newsprite.src = "img/newbg.jpeg";
let verynewsprite = new Image();
verynewsprite.src = "img/test.png";


//nền canvas:
// sX,Y: toạ độ cắt; cX,Y: toạ độ vẽ trên canvas
let bg = {
    //thuộc tính
    sX: 147,
    sY: 0,
    w: 140,
    h: 255,
    cX: 0,
    cY: 0,
    cW: 140,
    cH: 255,
    //hàm cắt ảnh bg sprite
    draw: function () {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.cX, this.cY + this.h, this.cW, this.cH) //sử dụng phương pháp vẽ hình ảnh
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.cX + this.w, this.cY + this.h, this.cW, this.cH) // cộng thêm chiều rộng vào trục x để cho hình nền đẩy đủ
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.cX + this.w + this.w, this.cY + this.h, this.cW, this.cH)
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.cX + this.w + this.w + this.w, this.cY + this.h, this.cW, this.cH)
    }
}
//khởi tạo biến mới và gán nó bằng bg
// để sau khi restart chơi lại game thì màn hình ban đầu sẽ được hiển thị lại
let temp1 = bg;

//nền canvas nếu lớn hơn 10 điểm:
let nbg = {
    //thuộc tính
    sX: 0,
    sY: 0,
    w: 500,
    h: 325,
    cX: 0,
    cY: 0,
    cW: 500,
    cH: 500,
    //hàm cắt ảnh bg sprite
    draw: function () {
        ctx.drawImage(newsprite, this.sX, this.sY, this.w, this.h, this.cX, this.cY, this.cW, this.cH) //sử dụng phương pháp vẽ hình ảnh
    }
}
let temp2 = nbg;
//nền canvas nếu lớn hơn 20 điểm:
let vnbg = {
    sX: 0,
    sY: 1000,
    w: 500,
    h: 500,
    cX: 0,
    cY: 0,
    cW: 500,
    cH: 500,
    //hàm cắt ảnh bg sprite
    draw: function () {
        ctx.drawImage(verynewsprite, this.sX, this.sY, this.w, this.h, this.cX, this.cY, this.cW, this.cH) //sử dụng phương pháp vẽ hình ảnh
    }
}

// màn hình bắt đầu:
let game = 'start';
//tạo biến đếm khung hình:
let dem = 0;
// tạo màn hình bắt đầu:
let start = {
    draw: function () {
        ctx.drawImage(sprite, 348, 92, 92, 25, canvas.width / 2 - 85, 25, 184, 50)
        ctx.drawImage(sprite, 293, 58, 97, 28, canvas.width / 2 - 90, 150, 194, 56)
        ctx.drawImage(sprite, 290, 89, 60, 52, canvas.width / 2 - 60, 280, 120, 104)
    }
}
//tạo màn hình end:
let end = {
    draw: function () {
        ctx.drawImage(sprite, 393, 58, 99, 23, canvas.width / 2 - 100, 150, 198, 46)
        ctx.drawImage(sprite, 2, 257, 116, 61, canvas.width / 2 - 116, 200, 232, 122)
        ctx.drawImage(sprite, 352, 116, 55, 32, canvas.width / 2 - 110, 350, 110, 64)
        ctx.drawImage(sprite, 413, 116, 55, 32, canvas.width / 2, 350, 110, 64)
    }
}

//nền đất: tạo class nền đất
class Ground {
    cX;
    cY;
    sX;
    sY;
    sW;
    sH;
    cW;
    cH;

    constructor(cX, cY) {
        this.cX = cX;
        this.cY = cY;
        this.sX = 292;
        this.sY = 0;
        this.sW = 170;
        this.sH = 57;
        this.cW = 170;
        this.cH = 114;
        this.dx = -2;
    }

    draw() {
        ctx.drawImage(sprite, this.sX, this.sY, this.sW, this.sH, this.cX, this.cY, this.cW, this.cH)
    }
}

// khởi tạo
let arrGround = [];
// dùng vòng lặp for để vẽ ít nhất 3 lần nền cho vừa độ rộng canvas
for (let i = 0; i < 4; i++) {
    let ground = new Ground(168 * i, 500);
    arrGround.push(ground);
}

//hàm vẽ đất
function drawArrGround() {
    arrGround.forEach(ground => ground.draw());
}

function dichuyenGround() {
    arrGround.forEach(ground => {
        ground.cX += ground.dx;
    })
//    tạo thêm để các nền đất được vẽ liên tục
//    bằng cách lấy ra phần tử đầu tiên của mảng đất và gán vị trí mới cho phần tử đó
    if (arrGround[0].cX <= -170) {
        let ground = arrGround.shift();
        ground.cX = arrGround[arrGround.length - 1].cX + 168;
        arrGround.push(ground);
    }
}

//tạo class ống:
class Pipes {
    cX;
    cY;
    cW;
    cH;
    space;
    sXt;
    sYt;
    sXd;
    sYd;
    sW;
    sH;
    dx;

    constructor(cX, cY, space) {
        this.cX = cX;
        this.cY = cY;
        this.cW = 27 * 2;
        this.cH = 161 * 3;
        this.space = space;
        this.sXt = 55;
        this.sYt = 323;
        this.sXd = 83;
        this.sYd = 322;
        this.sW = 27;
        this.sH = 161;
        this.dx = -2;
    }

    draw() {
        ctx.drawImage(sprite, this.sXt, this.sYt, this.sW, this.sH, this.cX, this.cY, this.cW, this.cH);
        ctx.drawImage(sprite, this.sXd, this.sYd, this.sW, this.sH, this.cX, this.cY + this.cH + this.space, this.cW, this.cH);
    }
}

//tạo function random
function random(min, max) {
    return Math.ceil(Math.random() * (max - min) + min)
}

let arrPipes = [];
for (let i = 1; i < 4; i++) {
    let pipe = new Pipes(random(500, 510) * i, random(-500, -120), 150);
    arrPipes.push(pipe);
}

// tạo hàm ống mới khi restart lại game
function newPipes() {
    for (let i = 1; i < 4; i++) {
        let pipe = new Pipes(random(500, 510) * i, random(-500, -120), 150);
        arrPipes.push(pipe);
    }
}

function drawArrPipe() {
    arrPipes.forEach(pipe => pipe.draw());
}

function dichuyenOng() {
    arrPipes.forEach(pipe => {
        pipe.cX += pipe.dx;
    })
//    tạo thêm để các ống được vẽ liên tục dùng splice;

    if (arrPipes[0].cX <= -54) {
        arrPipes.splice(0, 1);
        let pipe = new Pipes(arrPipes[arrPipes.length - 1].cX + random(300, 350), random(-500, -120), 150)
        arrPipes.push(pipe);
    }
}

//tạo class core:
let arrNumber = [
    {name: 0, sX: 495, sY: 59, sW: 13, sH: 19, cW: 26, cH: 38},
    {name: 1, sX: 134, sY: 454, sW: 13, sH: 19, cW: 26, cH: 38},
    {name: 2, sX: 291, sY: 159, sW: 13, sH: 19, cW: 26, cH: 38},
    {name: 3, sX: 305, sY: 159, sW: 13, sH: 19, cW: 26, cH: 38},
    {name: 4, sX: 319, sY: 159, sW: 13, sH: 19, cW: 26, cH: 38},
    {name: 5, sX: 333, sY: 159, sW: 13, sH: 19, cW: 26, cH: 38},
    {name: 6, sX: 291, sY: 183, sW: 13, sH: 19, cW: 26, cH: 38},
    {name: 7, sX: 305, sY: 183, sW: 13, sH: 19, cW: 26, cH: 38},
    {name: 8, sX: 319, sY: 183, sW: 13, sH: 19, cW: 26, cH: 38},
    {name: 9, sX: 333, sY: 183, sW: 13, sH: 19, cW: 26, cH: 38},
]

class Score {
    value;
    cX;
    cY;

    constructor(value, cX, cY) {
        this.value = value;
        this.cX = cX;
        this.cY = cY;
    }

    draw() {
        //dùng kết hợp toString và split để vẽ điểm
        if (this.value >= 10) {
            this.split = (this.value.toString()).split('');
            arrNumber.forEach(number => {
                if (this.split[0] == number.name) {
                    ctx.drawImage(sprite, number.sX, number.sY, number.sW, number.sH, canvas.width / 2 - 26, 80, number.cW, number.cH);
                }
                if (this.split[1] == number.name) {
                    ctx.drawImage(sprite, number.sX, number.sY, number.sW, number.sH, canvas.width / 2, 80, number.cW, number.cH);
                }
            })
        } else {
            this.split = this.value.toString();
            arrNumber.forEach(number => {
                if (this.split[0] == number.name) {
                    ctx.drawImage(sprite, number.sX, number.sY, number.sW, number.sH, canvas.width / 2 - 13, 80, number.cW, number.cH);
                }
            })
        }
    }

    drawSmall() {
        //    thêm method vẽ điểm khi màn hình end game
        if (this.value >= 10) {
            this.split = (this.value.toString()).split('');
            arrNumber.forEach(number => {
                if (this.split[0] == number.name) {
                    ctx.drawImage(sprite, number.sX, number.sY, number.sW, number.sH, this.cX + 206, this.cY + 158, number.cW / 2, number.cH / 2);
                }
                if (this.split[1] == number.name) {
                    ctx.drawImage(sprite, number.sX, number.sY, number.sW, number.sH, this.cX + 218, this.cY + 158, number.cW / 2, number.cH / 2);
                }
            })
        } else {
            this.split = this.value.toString();
            arrNumber.forEach(number => {
                if (this.split[0] == number.name) {
                    ctx.drawImage(sprite, number.sX, number.sY, number.sW, number.sH, this.cX + 210, this.cY + 158, number.cW / 2, number.cH / 2);
                }
            })
        }
    }
}

let score = new Score(0, 100, 80);
// cập nhật điểm cao nhất:
let maxScore = new Score(0, 100, 120);

//tạo class Bird:
class Bird {
    constructor(cX, cY) {
        this.cX = cX;
        this.cY = cY;
        this.chim = [
            {sX: 114, sY: 380},
            {sX: 114, sY: 406},
            {sX: 114, sY: 432}
        ]
        this.sW = 18;
        this.sH = 13;
        this.cW = 18 * 2.5;
        this.cH = 13 * 2.5;
        this.i = 0;
        //    tạo thêm thuộc tính để chim di chuyển:
        this.v = 0;
        this.a = 0.2;
        //    this.i là mảng i trong mảng 2 chiều this.chim
    }

    draw() {
        if (game == "start") {
            if (dem % 35 == 0) {
                this.i++;
                if (this.i > 2) {
                    this.i = 0
                }
            }
        }
        if (game == "play") {
            if (dem % 15 == 0) {
                this.i++;
                if (this.i > 2) {
                    this.i = 0
                }
            }
        }
        ctx.drawImage(sprite, this.chim[this.i].sX, this.chim[this.i].sY, this.sW, this.sH, this.cX, this.cY, this.cW, this.cH)
    }

    dichuyen() {
        if (game == "play" || game == "end") {
            this.v += this.a;
            this.cY += this.v;

            //   kiểm tra va chạm với nền đất
            if (this.cY + this.cH + this.v >= 500) {
                hit.play();
                die.play();
                game = "end";
                this.v = 0;
                this.cY = 470;
            }
            //    kiểm tra va chạm chim với đường ống
            if (
                bird.cX + bird.cW > arrPipes[0].cX &&
                bird.cX < arrPipes[0].cX + arrPipes[0].cW &&
                (
                    bird.cY < arrPipes[0].cY + arrPipes[0].cH ||
                    bird.cY + bird.cH > arrPipes[0].cY + arrPipes[0].cH + arrPipes[0].space
                )
            ) {
                hit.play();
                die.play();
                game = "end";
            }
            //    kiểm tra TH cộng điểm:
            //    chú ý tốc độ nền dx=-2;
            if (bird.cX == arrPipes[0].cX + arrPipes[0].cW || bird.cX == arrPipes[0].cX + arrPipes[0].cW - 1) {
                score.value++;
                congdiem.play();
                maxScore.value = Math.max(score.value, maxScore.value)
            }
        }
    }
}

//khởi tạo đối tượng Bird:
let bird = new Bird(canvas.width / 2 - 150, 295);

// tạo class huy chương:
class Medal {
    constructor(i) {
        this.sX = 110;
        this.sY = [512, 452, 476];
        this.sW = 24;
        this.sH = 24;
        this.cX = 157;
        this.cY = 243;
        this.cW = 48;
        this.cH = 48;
        this.i = i;
        // 0 là ko co gi, 1 là bac, 2 là vang
    }

    draw() {
        ctx.drawImage(sprite, this.sX, this.sY[this.i], this.sW, this.sH, this.cX, this.cY, this.cW, this.cH)
    }

    huychuong() {
        if (score.value == 0) {
            this.i = 0;
        }
        if (score.value >= maxScore.value) {
            this.i = 2;
        } else if (score.value >= maxScore.value / 2 && score.value < maxScore.value) {
            this.i = 1;
        } else {
            this.i = 0;
        }
    }
}

let medal = new Medal(0);

canvas.addEventListener('click', function (event) {
    switch (game) {
        case "start":
            game = "play";
            break;
        case "play":
            bay.play();
            console.log('choigame');
            bird.v = -4;
            break;
        case "end":

            console.log('endgame');
            if (
                event.offsetX > canvas.width / 2 - 110 &&
                event.offsetX < canvas.width / 2 &&
                event.offsetY > 350 &&
                event.offsetY < 414
            ) {
                score.value = 0;
                arrPipes = [];
                newPipes();
                bird.v = 0;
                bird.cY = 295;
                game = "start";
                bg = temp1;
                nbg = temp2;
            }
            break;
    }
})

//hàm vẽ
function draw() {
    if (score.value >= 5) {
        bg = nbg;
    }
    if (score.value >= 10) {
        nbg = vnbg;
    }
    bg.draw();
    //hình nền start có 3 khối ban đầu khi game ở trạng thái start, nếu không thì
    if (game == "start") {
        start.draw();
    }
    drawArrPipe();
    drawArrGround();
    if (game == "play") {
        score.draw();
    }
    bird.draw();

    if (game == "end") {
        end.draw();
        score.drawSmall();
        maxScore.drawSmall();
        medal.draw();
    }
}

//định nghĩa hàm di chuyển
function dichuyen() {
    if (game == "play") {
        dichuyenOng();
        dichuyenGround();
    }
    bird.dichuyen();
    medal.huychuong();
}

//hàm để vẽ lại
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dem++;
    draw();
    dichuyen();
}

animate();