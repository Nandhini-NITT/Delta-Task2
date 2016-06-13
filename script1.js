var myGamePiece,myObstacles=[],currentx,currenty,jump,aud;
var Trex=[[34.015,3.0236,30.992,17.007],[34.015,20.031,26.834,7.937],[18.141,57.071,23.055,15.874],[18.898,26.079,35.906,12.850],[18.141,38.929,26.834,18.142],[1,24.945,13.984,24.189]];
var Cactus=[[13.984,0,9.827,18.9],[1.889,18.898,38.173,29.102],[13.984,48,9.827,26.079]];
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
var j=0;
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
			ctx.drawImage(this.img,this.startpos,0,68,72,this.x,this.y,this.width,this.height);
		else
			ctx.drawImage(this.img,0,0,38,75,this.x,this.y,this.width,this.height);
	}
	this.crashWith = function(otherobj) 
	{
        var crash=[],crashed=false ;
		for(var i=0;i<6;i++)
		{
			for(var k=0;k<2;k++)
				crash[k]=true;
			for(var j=0;j<2;j++)
			{
			var myleft=this.x+Trex[i][0];
			var mytop=this.y+Trex[i][1];
			var myright=Trex[i][2]+myleft;
			var mybottom=Trex[i][3]+mytop;
			var otherleft=otherobj.x+Cactus[j][0];
			var othertop=otherobj.y+Cactus[j][1];
			var otherright=otherleft+Cactus[j][2];
			var otherbottom=othertop+((otherobj.height/75)*Cactus[j][3]);
			if ((mybottom < othertop) ||
               (mytop > otherbottom) ||
               (myright < otherleft) ||
               (myleft > otherright)) 
			{
           crash[j] = false;
			}
			}
			for(var k=0;k<2;k++)
			{
			if(crash[k])
				{
				crashed=true;
				break;
				}
			}
		}
		
		return crashed;
	}
}
var x=180;var obstaclePos=0;
function addObstacle()
{	
	var minGap=250,maxGap=300,minHeight=20,maxHeight=60;
	var gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
	var height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
	x=x+gap;
	if(x>myGamePiece.x+myGamePiece.width+20)
	{
	myObstacles[obstaclePos++]=new component(x,350-height,38, height,"obstacle");
	myObstacles[obstaclePos-1].update();
	}
}
function startGame()
{
	aud=document.getElementById("audio1");
	aud.load();
	aud.play();
	myGamePiece=new component(0,302,50,50,"object");
	myGameArea.start();
	document.getElementById("text-panel").innerHTML="<p>Press arrow up to start the Game</p>";
	updateGame();
	
}
var pause=0;
function pause_game()
{
	pause=1;
	aud.pause();
	if(!myGamePiece.iscrash)
	document.getElementById("buttons").innerHTML="<button id='play' onClick='play()'>Play <span class='glyphicon glyphicon-play'></span></button>";
}
function play()
{
	pause=0;
	document.getElementById("buttons").innerHTML="<button id='pause' onClick='pause_game()'>Pause <span class='glyphicon glyphicon-pause'></span></button>";
	aud.play();
}	

var frame,sprite,obstaclehit;
function updateGame()
{	
	
	frame=requestAnimationFrame(updateGame);
	
if(pause==0 && myGamePiece.x==0 && !myGamePiece.iswaiting &&!myGamePiece.iscrash)
		{
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
				aud=document.getElementById("audio1");
				aud.src="oops.mp3";
				aud.loop=false;
				aud.load();
				aud.play();
				myGamePiece.isrunning=false;
				myGamePiece.iscrash=true;
				myGamePiece.iswaiting=false;
				document.getElementById("text-panel").innerHTML="<p>Oops! CRASH</p>";
				var ctx=myGameArea.context;
				cancelAnimationFrame(frame);
				}
		}
	
	for(var i=0;(i<myObstacles.length && !myGamePiece.iswaiting);i++)
		{	
			if(pause==0)
				myObstacles[i].x-=2;
			myObstacles[i].update();
		}
	
	if(myGamePiece.iscrash)
		{
			myGamePiece.startpos=350;
			myGamePiece.update();
			return;
		}
	if(!myGamePiece.iswaiting && pause==0 && !myGamePiece.iscrash)
	{
	myGamePiece.x+=1+myGamePiece.speedX;
	document.getElementById("text-panel").innerHTML="<p>Run!!Run!!Run..</p>";
	document.getElementById("score").innerHTML=1+parseInt(document.getElementById("score").innerHTML);
	}
	currentx=myGamePiece.x;
	currenty=myGamePiece.y;
	if (myGameArea.key && myGameArea.key == 38 && pause==0) {
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
		
		if(myGamePiece.isrunning && pause==0)
	{
	sprite=setInterval(function()
	{
	if(myGamePiece.startpos==140 && pause==0)
		myGamePiece.startpos=210;
	else if(myGamePiece.startpos==210 && pause==0)
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