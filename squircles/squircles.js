const cvs = document.querySelector('canvas');
const c = cvs.getContext('2d');

const squircleWidth = 50;
const squirclemargin = 14;

const mouseRadius = 50;

var n_lr = 0;
var n_tb = 0;
var margin_tb = 0;
var margin_lr = 0;

cvs.width = window.innerWidth;
cvs.height = window.innerHeight;

let squircleArray =[];
squircleArray[0] = [];


let mouse = {
  x: undefined,
  y: undefined
};

cvs.addEventListener('click', function (e) {
    document.documentElement.webkitRequestFullScreen();
});

window.addEventListener('mousemove', function (e) {
  mouse.x = event.x;
  mouse.y = event.y;
});

window.addEventListener('touchmove', function(e){
    mouse.x = event.touches[0].clientX;
    mouse.y = event.touches[0].clientY;
})

window.addEventListener('touchmove', (e) => {
    e.preventDefault();
});


class Squircle {
  constructor(x, y, l, r) {
    this.x = x;
    this.y = y;
    this.l = l;
    this.r = r;
  };
  
  draw = (c) => {
    let innerLen = this.l-2*this.r;
    c.lineWidth = "1";
    // inner square
    c.fillRect(this.x-innerLen/2, this.y-innerLen/2, innerLen, innerLen);
    //outer rects
    c.beginPath();
    c.rect(this.x-innerLen/2, this.y-this.l/2, innerLen, this.r);
    c.rect(this.x+innerLen/2, this.y-innerLen/2, this.r, innerLen);
    c.rect(this.x-innerLen/2, this.y+innerLen/2, innerLen, this.r);
    c.rect(this.x-this.l/2, this.y-innerLen/2, this.r, innerLen);
    // arcs for corners
    c.arc(this.x-innerLen/2, this.y-innerLen/2, this.r, 0, 2*Math.PI);
    c.arc(this.x+innerLen/2, this.y-innerLen/2, this.r, 0, 2*Math.PI);
    c.arc(this.x-innerLen/2, this.y+innerLen/2, this.r, 0, 2*Math.PI);
    c.arc(this.x+innerLen/2, this.y+innerLen/2, this.r, 0, 2*Math.PI);
    c.fill();
    c.stroke();
  };
  
  update = (c) => {
    // this is where we control movement and interactivity
    this.draw(c);
  };

  mouseOver = () => {
      return (((mouse.x-this.x)**2 +(mouse.y-this.y)**2) < mouseRadius**2)
    };
};

class ConstAreaSquircle{
    constructor(x, y, s, rmax) {
        this.x = x;
        this.y = y;
        this.s = s;
        this.rmax = rmax;
        this.r = this.rmax*this.s
        this.l = Math.sqrt(4*this.r**2 - Math.PI*(this.r**2 - this.rmax**2));
        this.squircle = new Squircle(this.x,this.y,this.l,this.r);
        this.growing = false;
    }

    draw = (c) => {
        this.squircle.draw(c);
    }

    refresh = (c) => {
        c.clearRect(this.x-this.rmax-1, this.y-this.rmax-1, this.rmax*2+2, this.rmax*2+2);
        this.r = this.rmax*this.s
        this.l = Math.sqrt(4*this.r**2 - Math.PI*(this.r**2 - this.rmax**2));
        this.squircle.r = this.r
        this.squircle.l = this.l
        this.draw(c);
    }

    update = (c) => {
        if (this.squircle.mouseOver() || Math.floor(Math.random() * 1000) ==1){
            this.growing = true;
        }
        if (this.growing){
            this.s = Math.min(this.s+0.05, 1);
            this.refresh(c)
            this.growing = !(this.s==1)
        }
        else if(this.s!=0) {
            this.s = Math.max(this.s-0.005,0);
            this.refresh(c)
        }
    }
}

function animate() {

  /* this is where we call our animation methods, such as  
  Shape.draw() */
  for(i=0; i < n_tb; i +=1){
    for(j=0; j < n_lr; j+=1){
            squircleArray[i][j].update(c);
        }
    }

    requestAnimationFrame(animate);
};

function restart(){
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
    c.clearRect(0, 0, cvs.width, cvs.height);
    n_lr = Math.floor(cvs.width/squircleWidth);
    n_tb = Math.floor(cvs.height/squircleWidth);
    margin_rl = (cvs.width - n_lr*squircleWidth)/2;
    margin_tb = (cvs.height - n_tb*squircleWidth)/2;

    for(i=0; i < n_tb; i +=1){
        squircleArray[i] = [];
        for(j=0; j < n_lr; j+=1){
            squircleArray[i][j] = new ConstAreaSquircle( margin_rl + squircleWidth*(j+1/2) ,
                                                         margin_tb + squircleWidth*(i+1/2), 0, 
                                                        squircleWidth-2*squirclemargin);
            squircleArray[i][j].draw(c);
        }
    }
}

window.addEventListener('resize', function () {
    restart();
});


function exportsvg() {
    var ctx = new C2S(cvs.width,cvs.height);
    for(i=0; i < n_tb; i +=1){
        for(j=0; j < n_lr; j+=1){
                squircleArray[i][j].draw(ctx);
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

  
restart();
animate();