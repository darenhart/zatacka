'use strict';

function Fps() {

	// fps
	var fpsRate = 50;
	var fpsCount = 0;

	this.val;
	var lastCalledTime = Date.now();

	this.update = function() {
		var delta = (new Date().getTime() - lastCalledTime)/1000;
		lastCalledTime = Date.now();
		this.val = Math.round(1/delta);

		if (game.advanced.active && game.started) {
			this.drawFps();
		}
	};

	this.drawFps = function() {
		fpsCount++;
		if (fpsCount > fpsRate) {
			var fpsText = {
				x: game.width - 35,
				y: game.height - 10
			};
			fpsCount = 0;
			this.context.textAlign="left"; 
			this.context.font="9px Verdana";
			this.context.fillStyle="#888";
			this.context.clearRect(fpsText.x-2, fpsText.y-10, 40, 15);
			this.context.fillText('fps:'+this.val,fpsText.x,fpsText.y);
		}
	};	
	
}



function FPS() {
}

