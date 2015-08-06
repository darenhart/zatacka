'use strict';

function Player(p) {

	var radius = 3;
	var speed = 1.6; // 1.2 / 1.6 
	var angleSpeed = 2; // 1.6 / 3
	var collisionTolerance = 30; // from 0 to 70;
	var startTime = 40;
	var afterDieTime = 0;
	var afterDieCount = 0;
	var holeRate = 450; //450
	var holeRateRnd = 200; //200
	var holeSize = 13; // 13
	var holeSizeRnd = 3;
	var holeCounter = 0;

	var x;
	var y;
	var angle;
	var dying = false;
	var counter = 0;
	var hole = false;
	var nextHole;
	var nextHoleSize;
	this.dead = false;
	this.score = 0;
	this.name = p.name;
	this.color = p.color;
	this.playerCount = p.count;

	this.init = function() {
		counter = 0;
		holeCounter = 0;
		afterDieCount = 0;
		dying = false;
		hole = false;
		this.dead = false;

		var startOnCenter = false;
		if (startOnCenter) {
			x = (game.width-score.width)/2;
			y = game.height/2;
			angle = 360*this.playerCount/game.players.pool.length;
		} else {
			x = (game.width-score.width-100) * Math.random() +50;
			y = (game.height-100) * Math.random() +50;
			angle = Math.random()*360;
		}
		this.getNextHole();
		this.getNextHoleSize();
	};

	this.getNextHole = function() {
		nextHole = holeRate + (Math.random()*2-1)*holeRateRnd;
	};
	this.getNextHoleSize = function() {
		nextHoleSize = holeSize + (Math.random()*2-1)*holeSizeRnd;
	};
	
	this.draw = function() {

		counter++;
		if (counter < startTime && counter > 2) {
			return;
		}

		if (dying && afterDieCount > afterDieTime) {
			this.dead = true;
			if (game.players.running) {
				game.score.add(this.name);
				game.players.checkRoundOver();
			}
		} else {

			if (dying) {
				afterDieCount++;
			}

			// get speed according to fps
			if (game.fps.val && game.fps.val > 20) {
				var s = speed * (60/game.fps.val);
			} else {
				var s = speed;
			}

			// get angle according to fps
			if (game.fps.val && game.fps.val > 20) {
				var angSpeed = angleSpeed * (60/game.fps.val);
			} else {
				var angSpeed = angleSpeed;
			}

			// get controls
			if (KEY_STATUS[p.left]) {
				angle += angSpeed;
			} else if (KEY_STATUS[p.right]) {
				angle -= angSpeed;
			}

			var angleRad = angle * Math.PI/180;
			y += s*(Math.cos(angleRad));
			x += s*(Math.sin(angleRad));

			this.createHole();

			if (!hole) {
				if (this.isColliding()) {
					dying = true;
				}

				this.drawStroke();
			}

		}

	};


	this.drawStroke = function() {
		this.context.beginPath();
		this.context.fillStyle = p.color;
		this.context.arc(x,y,radius,0,2*Math.PI);
		this.context.fill();
	};

	this.createHole = function() {
		holeCounter++;
		if (holeCounter > nextHole || hole) {
			hole = true;
			if (holeCounter > nextHole + nextHoleSize) {
				this.getNextHole();
				this.getNextHoleSize();
				hole = false;
				holeCounter = 0;
			}
		}
	};

	this.isColliding = function() {

		if (x < 0 || x > game.width-game.score.width ||
			y < 0 || y > game.height) {
			return true;
		}

		var rcol = radius+2;
		var rad1 = (angle+collisionTolerance) * Math.PI/180;
		var y1 = Math.round(y + rcol*(Math.cos(rad1)));
		var x1 = Math.round(x + rcol*(Math.sin(rad1)));
		var p1 = this.context.getImageData(x1, y1, 1, 1).data; 
		var rad2 = (angle-collisionTolerance) * Math.PI/180;
		var y2 = Math.round(y + rcol*(Math.cos(rad2)));
		var x2 = Math.round(x + rcol*(Math.sin(rad2)));
		var p2 = this.context.getImageData(x2, y2, 1, 1).data; 

		// draw the check points
		if (false){
			this.context.beginPath();
			this.context.fillStyle = 'white';
			this.context.arc(x1,y1,0.8,0,2*Math.PI);
			this.context.fill();
			this.context.beginPath();
			this.context.fillStyle = 'white';
			this.context.arc(x2,y2,0.8,0,2*Math.PI);
			this.context.fill();
			return false;
		}
		
		if (p1[0] != 0 || p2[0] != 0) {
			return true;
		} else {
			return false;
		}
	};

}

function Players() {

	this.running = false;
	this.roundCount = 0;
	this.maxRounds;

	this.playerTemplates = [
		{ready: false, count: 1,name: 'red',   color: '#f82801', left: '1',     right: 'q'},
		{ready: false, count: 2,name: 'yellow',color: '#c0c001', left: 'Shift', right: 'Ctrl'},
		{ready: false, count: 3,name: 'orange',color: '#f87801', left: 'n',     right: 'm'},
		{ready: false, count: 4,name: 'green', color: '#01c801', left: 'left',  right: 'down'},
		{ready: false, count: 5,name: 'pink',  color: '#d850b0', left: 'o',     right: 'p'},
		{ready: false, count: 6,name: 'blue',  color: '#02a0c8', left: 'mouse1',right: 'mouse2'}
	];

	this.init = function() {
		this.roundCount = 0;
		this.pool = [];
		for (var i = 0; i < this.playerTemplates.length; i++) {
			var p = this.playerTemplates[i];
			if (p.ready) {
				var p = new Player(this.playerTemplates[i]);
				this.pool.push(p);
			}
		}
	};

	this.startRound = function() {
		this.running = true;
		this.context.clearRect(0, 0, game.width, game.height);
		for (var i = 0; i < this.pool.length; i++) {
			this.pool[i].init();
		}
	};

	this.animate = function() {
		if (this.running) {
			for (var i = 0; i < this.pool.length; i++) {
				if (!this.pool[i].dead) {
					this.pool[i].draw();
				}
			}
		} else {
			if (KEY_STATUS.space) {
				if (this.roundCount < this.maxRounds) {
					game.newRound();
				} else {
					this.running = false;
					game.finish();
				}
			}
		}
	};

	this.checkRoundOver = function() {
		var deadCount = 0;
		for (var i = 0; i < this.pool.length; i++) {
			if (this.pool[i].dead) {
				deadCount++;
			}
			if (deadCount >= this.pool.length-1) {
				this.running = false;
				this.roundCount++;
				break;
			}
		}
	};

	this.init();

}
