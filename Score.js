function Score() {

	this.context.font="italic 75px Sans-Serif";
	this.context.textAlign="right"; 
	var players = game.players.pool;
	var totalPlayers = game.players.players.length;

	this.print = function() {
	
		this.context.clearRect(0, 0, 300, 1000);

		for (var i = 0; i < players.length; i++) {
			var p = players[i];
			var x = this.width*3/4 - 10;
			var y = game.height*0.9 * i/totalPlayers + 80;

			this.context.fillStyle=p.color;
			this.context.fillText(p.score,x,y);
		}
	};
	
	this.add = function(name) {
		for (var i = 0; i < players.length; i++) {
			var p = players[i];
			if (p.name != name && !p.dead) {
				p.score++;
			}			
		}
		this.print();
	};
	
}
Score.prototype.width = 150;


