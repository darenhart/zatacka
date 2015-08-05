function Player(p) {

	this.name = p.name;
	this.color = p.color;
	
	// line size
	var radius = 3;
	
	// random position and angle
	var x;
	var y;
	var angle;
	
	var speed = 1.2; // 1.2
	var angleSpeed = 1.6; // 1.6

	var collisionTolerance = 24; // from 0 to 70;

	var startTime = 40;

	this.dead = false;
	var dying = false;
	var afterDieTime = 1;
	var afterDieCount = 0;

	var hole = false;
	var holeRate = 450; //450
	var holeRateRnd = 150; //150
	var holeSize = 15;
	var holeSizeRnd = 3;
	var nextHole;
	var nextHoleSize;
	var holeCounter = 0;

	this.score = 0;

	var counter = 0;
		
	this.init = function() {
		counter = 0;
		holeCounter = 0;
		afterDieCount = 0;
		dying = false;
		this.dead = false;
		x = (game.width-100) * Math.random() +50;
		y = (game.height-100) * Math.random() +50;
		angle = Math.random()*360;
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
			game.score.add(this.name);
			game.players.checkRoundOver();
		} else {

			if (dying) {
				afterDieCount++;
			}

			// get speed according to fps
			if (game.fps.val && game.fps.val > 10) {
				var s = speed * (60/game.fps.val);
			} else {
				var s = speed;
			}

			// get angle according to fps
			if (game.fps.val && game.fps.val > 25) {
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


			if (false){
				this.context.beginPath();
				this.context.fillStyle = 'white';
				this.context.strokeStyle = 'white';
				this.context.arc(x1,y1,0.5,0,2*Math.PI);
				this.context.fill();
				this.context.stroke();
				this.context.beginPath();
				this.context.fillStyle = 'white';
				this.context.strokeStyle = 'white';
				this.context.arc(x2,y2,0.5,0,2*Math.PI);
				this.context.fill();
				this.context.stroke();
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
		var rcol = radius+2;
		var rad1 = (angle+collisionTolerance) * Math.PI/180;
		var y1 = Math.round(y + rcol*(Math.cos(rad1)));
		var x1 = Math.round(x + rcol*(Math.sin(rad1)));
		var p1 = this.context.getImageData(x1, y1, 1, 1).data; 
		var rad2 = (angle-collisionTolerance) * Math.PI/180;
		var y2 = Math.round(y + rcol*(Math.cos(rad2)));
		var x2 = Math.round(x + rcol*(Math.sin(rad2)));
		var p2 = this.context.getImageData(x2, y2, 1, 1).data; 
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
	
	this.players = [
		{name: 'blue',  color: '#0404EE', right: 'right', left: 'left'},
		{name: 'green', color: '#04EE04', right: 's', left: 'a'},
		{name: 'red',   color: '#EE0404', right: 'b', left: 'v'},
		{name: 'yellow',color: '#EEEE04', right: '2', left: '1'},
		{name: 'cyan',  color: '#04EEEE', right: '0', left: '9'}
	];

	this.pool = [];

	this.animate = function() {
		if (this.running) {
			for (var i = 0; i < this.pool.length; i++) {
				if (!this.pool[i].dead) {
					this.pool[i].draw();
				}
			}
		} else {
			if (KEY_STATUS.space && this.roundCount <= this.maxRounds) {
				game.newRound();
			}
		}
	};
	
	this.newPlayer = function(i) {
		var p = new Player(this.players[i]);
		this.pool.push(p);
	}
	
	this.createPlayers = function() {
		for (var i = 0; i < this.players.length; i++) {
			var p = this.players[i];
			if (p.ready) {
				this.newPlayer(i);
			}
		}
	};
	
	this.start = function() {
		this.running = true;
		this.context.clearRect(0, 0, game.width, game.height);
		for (var i = 0; i < this.pool.length; i++) {
			this.pool[i].init();
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
			}
		}		
	};
	
}
