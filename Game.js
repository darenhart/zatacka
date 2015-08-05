
function Background() {
	this.draw = function() {
		this.context.beginPath();
		this.context.rect(0,0, game.width, game.height);
		this.context.lineWidth="10";
		this.context.strokeStyle="#CCCC22";
		this.context.stroke();
	};
}


function Game() {

	this.started = false;

	this.init = function() {

		this.width = window.innerWidth - Score.prototype.width;
		this.height = window.innerHeight;

		var main = document.createElement('canvas');
		main.id     = 'main';
		main.height = this.height;
		main.width  = this.width;
		document.body.appendChild(main);

		var texts = document.createElement('canvas');
		texts.id     = 'texts';
		texts.height = this.height;
		texts.width  = this.width;
		document.body.appendChild(texts);

		var score = document.createElement('canvas');
		score.id     = 'score';
		score.height = this.height;
		score.width  = Score.prototype.width;
		score.style.left = this.width+'px';
		document.body.appendChild(score);

		var select = document.createElement('canvas');
		select.id     = 'select';
		select.height = this.height;
		select.width  = this.width+Score.prototype.width;
		document.body.appendChild(select);
		
		// Test to see if canvas is supported
		if (!main.getContext) {
			return false;
		} else {
		
			this.mainContext   = main.getContext('2d');
			this.textsContext  = texts.getContext('2d');
			this.scoreContext  = score.getContext('2d');
			this.selectContext = select.getContext('2d');

			Player.prototype.context     = this.mainContext;
			Players.prototype.context     = this.mainContext;
			Background.prototype.context = this.mainContext;
			Fps.prototype.context        = this.textsContext;
			Score.prototype.context      = this.scoreContext;
			SelectPlayers.prototype.context = this.selectContext;

			this.background = new Background();
			this.fps = new Fps();
			this.players = new Players();
			this.score = new Score();
			this.selectPlayers = new SelectPlayers();
			
			return true;
		}
	};
	
	this.selectScreen = function() {
		game.selectPlayers.show();
		document.getElementById('select').style.display = 'block';
		document.getElementById('main').style.display = 'none';
		document.getElementById('texts').style.display = 'none';
		document.getElementById('score').style.display = 'none';
		animate();
	}

	this.newRound = function() {
		this.players.start();
		this.background.draw();
	};

	this.start = function() {
		this.started = true;
		document.getElementById('select').style.display = 'none';
		document.getElementById('main').style.display = 'block';
		document.getElementById('texts').style.display = 'block';
		document.getElementById('score').style.display = 'block';
		this.players.createPlayers();
		this.players.maxRounds = 15;
		this.score.print();
		this.newRound();
	};
}


function animate() {
	requestAnimFrame( animate );

	if (game.started) {
		game.players.animate();
		game.fps.update();
	} else {
		game.selectPlayers.listen();
	}
}

window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame   ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			window.oRequestAnimationFrame      ||
			window.msRequestAnimationFrame     ||
			function(/* function */ callback, /* DOMElement */ element){
				window.setTimeout(callback, 1000 / 60);
			};
})();

var game = new Game();
function init() {
	if (game.init()) {
		game.selectScreen();
	}
}

init();
