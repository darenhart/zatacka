'use strict';

function SelectPlayers() {

	var players;
	this.active = false;

	this.show = function() {
		this.active = true;
		this.context.font="bold 20px Courier";
		this.context.textAlign="left"; 
		for (var i = 0; i < players.length; i++) {
			var p = players[i];
			var x = game.width/5;
			var y = (game.height*0.6/players.length)*i + 80;
			this.context.fillStyle=p.color;
			this.context.fillText('('+p.left+' '+p.right+')',x,y);
		}
		
		this.showInstructions();
	};

	this.listen = function() {
		players = game.players.playerTemplates;
		for (var i = 0; i < players.length; i++) {
			var p = players[i];
			var x = (game.width/5) + 220;
			var y = (game.height*0.6/players.length)*i + 80 - imageRepository[p.name].height;
			if (KEY_STATUS[p.left]) {
				p.ready = true;
				this.context.drawImage(imageRepository[p.name], x, y);
			} else if (KEY_STATUS[p.right]) {
				p.ready = false;
				this.context.clearRect(x,y, imageRepository[p.name].width, imageRepository[p.name].height);
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
		players = game.players.playerTemplates;
		for (var i = 0; i < players.length; i++) {
			players[i].ready = false;
		}
		this.active = false;
		this.context.clearRect(0, 0, game.width, game.height);
	};
	
}


