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
function component(x,y,color,width,height)
{
	this.x=x;
	this.y=y;
	this.color=color;
	this.width=width;
	this.height=height;
	this.speedX=0;
	this.update= function()
	{	
		ctx=myGameArea.context;
		ctx.fillStyle=color;
		ctx.fillRect(this.x,this.y,this.width,this.height);
	}
	this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
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
var x=80;var obstaclePos=0;
function addObstacle()
{	
	var minGap=100,maxGap=300,minHeight=20,maxHeight=60;
	var gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
	var height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
	x=x+gap;
	//if(x>screen.width-myGamePiece.width)
		//x=80;
	if(x>myGamePiece.x+myGamePiece.width)
	{
	myObstacles[obstaclePos++]=new component(x,350-height, "green",10, height);
	myObstacles[obstaclePos-1].update();
	}
}
function startGame()
{
	myGamePiece=new component(0,310,"red",40,40);
	myGameArea.start();
	updateGame();
}
var frame;
function updateGame()
{	
	frame=requestAnimationFrame(updateGame);
	if(myGamePiece.x==0)
		{
		myObstacles=[];
		obstaclePos=0;
		myGameArea.frameno=0;
		myGamePiece.speedX+=1;
		}
	myGameArea.clear();
	if(myGameArea.frameno==1||everyInterval(300))
	{	
		addObstacle();
	}
	for(var i=0;i<myObstacles.length;i++)
		{
			if(myGamePiece.crashWith(myObstacles[i]))
				{
				alert("Crashed");
				cancelAnimationFrame(frame);
				}
		}
	
	for(var i=0;i<myObstacles.length;i++)
		{	
		
			myObstacles[i].update();
		}
	
	myGamePiece.x+=1+myGamePiece.speedX;
	currentx=myGamePiece.x;
	currenty=myGamePiece.y;
	if (myGameArea.key && myGameArea.key == 38) {
		jump = {
        start: {
            x: currentx,
            y: 310
        },
        control: {
            x: currentx + 30,
            y: currenty - 280
        },
        end: {
            x: currentx + 80 ,
            y: 310
        },
		t:0
		};
		}
		if (jump) {

			var pos = getQuadraticBezierXY(jump.start, jump.control, jump.end, jump.t / 100);
			myGamePiece.x = pos.x;
			myGamePiece.y = pos.y;
			jump.t += 4;
			if (jump.t > 100) {
				jump = null;
				
		}

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
