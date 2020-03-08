const cvs = document.querySelector('canvas');
const c = cvs.getContext('2d');

function rotateAbout(point_x, point_y, x_center, y_center, angle) {
    let x_new = x_center + (point_x - x_center) * Math.cos(angle) - (point_y - y_center) * Math.sin(angle);
    let y_new = y_center + (point_x - x_center) * Math.sin(angle) + (point_y - y_center) * Math.cos(angle);
    return([x_new, y_new]);
}

var LENGTH = 60
var X_NUM = Math.floor(cvs.width/LENGTH);
var Y_NUM = Math.floor(cvs.height/LENGTH);
var X_OFFSET = (cvs.width - LENGTH * X_NUM)/2;
var Y_OFFSET = (cvs.height - LENGTH * Y_NUM)/2;

var my_squares = [];

class Square{
    constructor(x_center, y_center, length) {
        this.x_center = x_center;
        this.y_center = y_center;
        this.x_0 = x_center - length/2;
        this.y_0 = y_center - length/2;
        this.length = length;
        this.l2 = length/2;
        this.corners = [[this.x_0, this.y_0], 
                        [this.x_0 + this.length, this.y_0],
                        [this.x_0 + this.length, this.y_0 + this.length],
                        [this.x_0, this.y_0 + this.length]];
        this.angle = 0;
        this.mutaion_vector = [(Math.random()-0.5)*Math.PI/2, (Math.random()-0.5)*this.l2, (Math.random()-0.5)*this.l2];
    }

    reset(){
        this.corners = [[this.x_0, this.y_0], 
                        [this.x_0 + this.length, this.y_0],
                        [this.x_0 + this.length, this.y_0 + this.length],
                        [this.x_0, this.y_0 + this.length]];
    }

    draw(c){
        c.beginPath();
        c.moveTo(this.corners[0][0], this.corners[0][1]);
        for(let i = 1; i < 4; i ++){
            c.lineTo(this.corners[i][0], this.corners[i][1]);
        }
        c.closePath();
        c.lineWidth = 2;
        c.strokeStyle = 'white';
        c.stroke();   
    }

    rotate(angle){
        this.angle = angle;
        for(let i = 0; i < 4; i ++){
            this.corners[i] = rotateAbout(this.corners[i][0], this.corners[i][1], this.x_center, this.y_center, angle);
        }
    }

    translate(x, y) {
        for(let i = 0; i < 4; i++) {
            this.corners[i][0] += x;
            this.corners[i][1] += y;
        }
    }

    mutate(amount){
        this.rotate(this.mutaion_vector[0]*amount);
        this.translate(this.mutaion_vector[1]*amount, this.mutaion_vector[2]*amount);
    }

    update(){
        this.reset();
        let closeness = (1-Math.abs(((this.x_center - mouse.x)**2+(this.y_center - mouse.y)**2)/((window.innerWidth)**2+(window.innerHeight)**2)));
        this.mutate(closeness**8);
    }
}

function restart(){
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;

    LENGTH = 50
    X_NUM = Math.floor(cvs.width/LENGTH);
    Y_NUM = Math.floor(cvs.height/LENGTH);
    X_OFFSET = (cvs.width - LENGTH * X_NUM)/2
    Y_OFFSET = (cvs.height - LENGTH * Y_NUM)/2


    for(let y = 0; y < Y_NUM; y++) {
        my_squares[y] = [];
        for(let x = 0; x < X_NUM; x++ ) {
            my_squares[y][x] = new Square(LENGTH*x + X_OFFSET + LENGTH/2, LENGTH*y +Y_OFFSET + LENGTH/2, LENGTH-5);
            console.log(my_squares[y][x]);
            my_squares[y][x].mutate(y/Y_NUM);
            my_squares[y][x].draw(c);
        }
    }
    animate()
}

var mouse = {
    x: undefined,
    y: undefined
};

window.addEventListener('mousemove', function (e) {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('touchmove', function(e){
    mouse.x = event.touches[0].clientX;
    mouse.y = event.touches[0].clientY;
})



cvs.addEventListener('click', function (e) {
    document.documentElement.webkitRequestFullScreen();
});

cvs.onclick = function(){
    restart();
}
window.addEventListener('resize', function () {
    restart();
});



function animate() {

    c.clearRect(0, 0, canvas.width, canvas.height);
    for(let y = 0; y < Y_NUM; y++) {
        for(let x = 0; x < X_NUM; x++ ){
              my_squares[y][x].update();
              my_squares[y][x].draw(c);
        }
    }
  
      requestAnimationFrame(animate);
};

restart();

function exportsvg() {
    var ctx = new C2S(cvs.width,cvs.height);
    for(let y = 0; y < Y_NUM; y++) {
        for(let x = 0; x < X_NUM; x++ ){
              my_squares[y][x].draw(ctx);
        }
    }
    var toSave = ctx.getSerializedSvg(true);
    Download.save(toSave,"out.svg");
}

document.addEventListener('keypress', function (e) {
    if(e.key === 'd'){
        exportsvg();
    }
});


