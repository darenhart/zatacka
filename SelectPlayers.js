function SelectPlayers() {

	this.context.font="50px Sans-Serif";
	var players = game.players.players;

	this.show = function() {
		for (var i = 0; i < players.length; i++) {
			var p = players[i];
			var x = game.width/4;
			var y = (game.height*0.7/players.length)*i + 100;
			this.context.textAlign="center"; 
			this.context.fillStyle=p.color;
			this.context.fillText(p.left+' - '+p.right,x,y);
		}
		
		this.showInstructions();
	};

	this.listen = function() {
		for (var i = 0; i < players.length; i++) {
			var p = players[i];
			var x = game.width*2/4;
			var y = (game.height*0.7/players.length)*i + 100;
			if (KEY_STATUS[p.right]) {
				p.ready = true;
				this.context.textAlign="left"; 
				this.context.fillStyle=p.color;
				this.context.fillText('ready',x,y);
			} else if (KEY_STATUS[p.left]) {
				p.ready = false;
				this.context.clearRect(x, y-40, 300, 60);
			}
		}
		
		if (KEY_STATUS.space) {
			game.start();
		}

	};	

	this.showInstructions = function() {
		this.context.fillStyle="white";
		this.context.fillText('Press space to start',game.width/2,game.height*7/8);
	};
	
}


