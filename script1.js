var myGamePiece,myObstacles=[],currentx,currenty,jump;
var myGameArea=
{
	canvas: document.createElement("canvas"),
	start:	function(){
				this.canvas.width=screen.width;
				this.canvas.height=350;
				this.context=this.canvas.getContext("2d");
				document.body.insertBefore(this.canvas,document.body.childNodes[0]);
				this.frameno=0;
				//this.interval=setInterval(updateGame,5);
				window.addEventListener('keydown', function (e) {
						myGameArea.key = e.keyCode;
						})
				window.addEventListener('keyup', function (e) {
						myGameArea.key = e.keycode;
						})
				},
	clear: function()
	{	
		this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
	},
    stop : function() {
        clearInterval(this.interval);
    }
};
function component(x,y,width,height,type)
{	
	this.score=0;
	this.iswaiting=true;
	this.isrunning=false;
	this.isjumping=false;
	this.iscrash=false;
	this.startpos=0;
	this.type=type;
	this.x=x;
	this.y=y;
	this.width=width;
	this.height=height;
	this.img=new Image();
	this.img.onload=function()
	{
		document.body.appendChild(this.img);
	}
	if(this.type=="object")
	this.img.src="images.png";
	else if(this.type=="obstacle")
	this.img.src="obstacle.png";
	this.speedX=0;
	this.update= function()
	{	
		ctx=myGameArea.context;
		if(this.type=="object")
			ctx.drawImage(this.img,this.startpos,0,70,77,this.x,this.y,this.width,this.height);
		else
			ctx.drawImage(this.img,0,0,35,80,this.x,this.y,this.width,this.height);
	}
	this.crashWith = function(otherobj) {
        var myleft = this.x+2;
        var myright = this.x+1+ (this.width);
        var mytop = this.y;
        var mybottom = this.y+1 + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}
var x=180;var obstaclePos=0;
function addObstacle()
{	
	var minGap=250,maxGap=300,minHeight=20,maxHeight=60;
	var gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
	var height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
	x=x+gap;
	//if(x>screen.width-myGamePiece.width)
		//x=80;
	if(x>myGamePiece.x+myGamePiece.width+20)
	{
	myObstacles[obstaclePos++]=new component(x,350-height,30, height,"obstacle");
	myObstacles[obstaclePos-1].update();
	}
}
function startGame()
{
	var aud=document.getElementById("audio1");
	aud.load();
	aud.play();
	myGamePiece=new component(0,302,50,50,"object");
	myGameArea.start();
	document.getElementById("text-panel").innerHTML="<p>Press arrow up to start the Game</p>";
	updateGame();
}
var frame,sprite;
function updateGame()
{	
	
	frame=requestAnimationFrame(updateGame);
	
if(myGamePiece.x==0 && !myGamePiece.iswaiting)
		{
		//clearInterval(sprite);
		myObstacles=[];
		obstaclePos=0;
		myGameArea.frameno=0;
		myGamePiece.speedX+=0.2;
		}
	myGameArea.clear();
	if(myGameArea.frameno==1||everyInterval(150) && !myGamePiece.iswaiting)
	{	
		addObstacle();
	}
	for(var i=0;i<myObstacles.length;i++)
		{
			if(myGamePiece.crashWith(myObstacles[i]))
				{
				var aud=document.getElementById("audio1");
				aud.src="oops.mp3";
				aud.loop=false;
				aud.load();
				aud.play();
				myGamePiece.isrunning=false;
				myGamePiece.iscrash=true;
				myGamePiece.iswaiting=false;
				document.getElementById("text-panel").innerHTML="<p>Oops! CRASH</p>";
				
				cancelAnimationFrame(frame);
				}
		}
	
	for(var i=0;(i<myObstacles.length && !myGamePiece.iswaiting);i++)
		{	
			myObstacles[i].x-=2;
			myObstacles[i].update();
		}
	
	if(myGamePiece.iscrash)
		{
			myGamePiece.startpos=350;
			myGamePiece.update();
			return;
		}
	if(!myGamePiece.iswaiting)
	{
	myGamePiece.x+=1+myGamePiece.speedX;
	document.getElementById("text-panel").innerHTML="<p>Run!!Run!!Run..</p>";
	document.getElementById("score").innerHTML=1+parseInt(document.getElementById("score").innerHTML);
	}
	currentx=myGamePiece.x;
	currenty=myGamePiece.y;
	if (myGameArea.key && myGameArea.key == 38) {
		myGamePiece.iswaiting=false;
		jump = {
        start: {
            x: currentx,
            y: 302
        },
        control: {
            x: currentx + 50,
            y: currenty - 280
        },
        end: {
            x: currentx + 130 ,
            y: 302
        },
		t:0
		};
		}
		if (jump) {
				myGamePiece.isjumping=true;
				//myGamePiece.isrunning=false;
				myGamePiece.startpos=0;
			var pos = getQuadraticBezierXY(jump.start, jump.control, jump.end, jump.t / 100);
			myGamePiece.x = pos.x;
			myGamePiece.y = pos.y;
			jump.t += 4;
			if (jump.t > 100) {
				jump = null;
				myGamePiece.isrunning=true;
				myGamePiece.startpos=140;
			}
				}
		
		if(myGamePiece.isrunning)
	{
	sprite=setInterval(function()
	{
	if(myGamePiece.startpos==140)
		myGamePiece.startpos=210;
	else if(myGamePiece.startpos==210)
		myGamePiece.startpos=140;
	},250);
	}
	if (myGamePiece.x>=screen.width-myGamePiece.width)
			{
			myGamePiece.x=0;
			x=80;
			}
	myGamePiece.update();
	myGameArea.frameno++;
	
}
function everyInterval(n) {
		if ((myGameArea.frameno / n) % 1 == 0) {return true;}
		return false;
	}
function getQuadraticBezierXY(startPt, controlPt, endPt, T) {
    var x = Math.pow(1 - T, 2) * startPt.x + 2 * (1 - T) * T * controlPt.x + Math.pow(T, 2) * endPt.x;
    var y = Math.pow(1 - T, 2) * startPt.y + 2 * (1 - T) * T * controlPt.y + Math.pow(T, 2) * endPt.y;
    return ({
        x: x,
        y: y
    });
}