function Fps() {

	// fps
	var fpsRate = 50;
	var fpsCount = 0;
	var fpsText = {
		x: game.width - 40,
		y: 20
	};

	this.val;
	var lastCalledTime = Date.now();

	this.update = function() {

		var delta = (new Date().getTime() - lastCalledTime)/1000;
		lastCalledTime = Date.now();
		this.val = Math.round(1/delta);
		
		//this.drawFps();
	};

	this.drawFps = function() {
		fpsCount++;
		if (fpsCount > fpsRate) {
			fpsCount = 0;
			this.context.textAlign="left"; 
			this.context.font="9px Verdana";
			this.context.fillStyle="blue";
			this.context.clearRect(fpsText.x-2, fpsText.y-10, 32, 15);
			this.context.fillText('fps:'+this.val,fpsText.x,fpsText.y);
		}
	};	
	
}



function FPS() {
}

