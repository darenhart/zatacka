function Score() {

	var players = game.players.pool;
	var totalPlayers = game.players.players.length;

	this.draw = function() {
	
		this.context.clearRect(0, 0, 300, 1000);

		this.context.fillStyle='#3c3c3c';
		this.context.rect(0,0,this.width,game.height);
		this.context.fill();

		this.context.font="italic 75px Sans-Serif";
		this.context.textAlign="right"; 
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
		this.draw();
	};
	
}
Score.prototype.width = 150;


