function SelectPlayers() {

	var players = game.players.players;

	this.show = function() {
		this.context.font="bold 20px Courier";
		this.context.textAlign="left"; 
		for (var i = 0; i < players.length; i++) {
			var p = players[i];
			var x = game.width/4;
			var y = (game.height*0.7/players.length)*i + 80;
			this.context.fillStyle=p.color;
			this.context.fillText('('+p.left+' '+p.right+')',x,y);
		}
		
		this.showInstructions();
	};

	this.listen = function() {
		for (var i = 0; i < players.length; i++) {
			var p = players[i];
			var x = game.width/2;
			var y = (game.height*0.7/players.length)*i + 80 - imageRepository[p.name].height;
			if (KEY_STATUS[p.left]) {
				p.ready = true;
				this.context.drawImage(imageRepository[p.name], x, y);
			} else if (KEY_STATUS[p.right]) {
				p.ready = false;
				this.context.clearRect(x, y-40, 300, 60);
			}
		}
		
		if (KEY_STATUS.space) {
			// start game if there is a ready player
			for (var i = 0; i < players.length; i++) {
				var p = players[i];
				if (players[i].ready) {
					game.start();
					break;
				}
			}
		}

	};	

	this.showInstructions = function() {
		this.context.fillStyle="white";
		this.context.textAlign="center"; 
		this.context.fillText('Press space to start',game.width/2,game.height*7/8);
	};
	
	this.clear = function() {
		this.context.clearRect(0, 0, game.width, game.height);
	};
	
}


