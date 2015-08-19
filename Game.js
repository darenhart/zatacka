'use strict';

var imageRepository = new function() {

	// Set images src
	var imgs = {
		splash: "img/achtung-small.png",
		end:    "img/achtung-konec-hry.png",
		red:    "img/red.png",
		yellow: "img/yellow.png",
		orange: "img/orange.png",
		green:  "img/green.png",
		pink:   "img/pink.png",
		blue:   "img/blue.png"
	};

	var numImages = 0;
	for (var key in imgs) {
		numImages++;
		this[key] = new Image();
		this[key].src = imgs[key];
		this[key].onload = function() {
			imageLoaded();
		};
	}

	// Ensure all images have loaded before starting the game
	var numLoaded = 0;
	function imageLoaded() {
		numLoaded++;
		if (numLoaded === numImages) {
			game.init();
		}
	}
}


function Background() {
	this.draw = function() {
		this.context.beginPath();
		this.context.rect(0,0, game.width - score.width, game.height);
		this.context.lineWidth="10";
		this.context.strokeStyle="#CCCC55";
		this.context.stroke();
	};
	this.clear = function() {
		this.context.clearRect(0,0, game.width, game.height);
	};
}

function SplashScreen() {

	this.active = true;
	var timeout = 100;
	var counter = 0;

	this.draw = function() {
		this.active = true;
		var x = game.width/2  - imageRepository.splash.width/2; 
		var y = game.height/2 - imageRepository.splash.height/2;
		this.context.drawImage(imageRepository.splash, x, y);
	};
	this.listen = function() {
		counter++;
		if (KEY_STATUS.mouse1 || KEY_STATUS.space || counter > timeout) {
			this.clear();
			game.selectScreen();
		}
	};
	this.clear = function() {
		this.active = false;
		counter = 0;
		this.context.clearRect(0, 0, game.width, game.height);
	};
}

function EndScreen() {

	this.active = false;
	var counter = 0;
	var waitTime = 100;

	this.draw = function() {
		this.active = true;
		counter = 0;
		// KONEC HRY
		var x = game.width/2 - imageRepository.end.width/2; 
		var y = game.height*5/6 - imageRepository.end.height;
		this.context.drawImage(imageRepository.end, x, y);
		
		// Score
		var players = game.players.pool;
		var totalPlayers = game.players.playerTemplates.length;
		this.context.font="bold 30px Sans-Serif";
		this.context.textAlign="right"; 
		for (var i = 0; i < players.length; i++) {
			var p = players[i];
			var x = game.width/2;
			var y = (game.height*4/6)*i / totalPlayers + 80;

			this.context.fillStyle=p.color;
			this.context.fillText(p.score,x,y);
		}
	};

	this.listen = function() {
		counter++;
		if (KEY_STATUS.space && counter > waitTime) {
			this.clear();
			game.selectScreen();
		}
	};
	this.clear = function() {
		this.active = false;
		this.context.clearRect(0, 0, game.width, game.height);
	};
}



function Game() {

	this.started = false;
	this.layers;

	this.init = function() {

		this.layers = {
			'main':{},
			'texts':{},
			'screens':{},
			'score':{}
		};

		for (var key in this.layers) {
			// check if canvas exists
			if (document.getElementById(key)) {
				this.layers[key].element = document.getElementById(key);
			} else {
				this.layers[key].element = document.createElement('canvas');
				//document.body.appendChild(this.layers[key].element);
				document.getElementById('game').appendChild(this.layers[key].element);
				this.layers[key].element.id = key;
			}
			this.layers[key].context = this.layers[key].element.getContext('2d');
		}

		this.calculateSize();

		Player.prototype.context       = this.layers.main.context;
		Players.prototype.context      = this.layers.main.context;
		Background.prototype.context   = this.layers.main.context;
		SplashScreen.prototype.context = this.layers.screens.context;
		EndScreen.prototype.context    = this.layers.screens.context;
		SelectPlayers.prototype.context= this.layers.screens.context;
		Fps.prototype.context          = this.layers.texts.context;
		Score.prototype.context        = this.layers.score.context;

		this.background = new Background();
		this.splash = new SplashScreen();
		this.end = new EndScreen();
		this.players = new Players();
		this.score = new Score();
		this.fps = new Fps();
		this.selectPlayers = new SelectPlayers();
		this.advanced = new Advanced();

		this.splashScreen();
		animate();
	};

	this.onSizeChange = function() {
		this.calculateSize();

		if (game.started) {
			this.background.draw();
			this.score.draw();
		} else if (game.splash.active) {
			game.splashScreen();
		} else if (game.selectPlayers.active) {
			this.selectPlayers.show();
		} else {
			game.end.draw();
		}
	};

	this.calculateSize = function() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		for (var key in this.layers) {
			this.layers[key].element.width = this.width;
			this.layers[key].element.height = this.height;
		}
		this.layers.score.element.style.left = this.width - Score.prototype.width+'px';
		this.layers.score.element.width = Score.prototype.width;
	};

	this.splashScreen = function() {
		document.body.style.cursor = 'initial';
		this.started = false;
		this.selectPlayers.clear();
		this.splash.draw();
	};

	this.selectScreen = function() {
		this.started = false;
		this.splash.clear();
		this.advanced.show();
		this.selectPlayers.show();
		document.getElementById('github').style.display = 'block';
	}

	this.start = function() {
		document.body.style.cursor = 'none';
		this.started = true;
		this.advanced.hide();
		var confs = this.advanced.getConfs();
		this.players.init(confs);
		this.selectPlayers.clear();
		this.score.draw();
		this.newRound();
		document.getElementById('github').style.display = 'none';
	};

	this.newRound = function() {
		this.players.startRound();
		this.background.draw();
	};

	this.finish = function() {
		document.body.style.cursor = 'initial';
		game.background.clear();
		game.score.clear();
		game.end.draw();
		this.started = false;
	};

}


function animate() {
	requestAnimFrame( animate );

	game.fps.update();

	if (game.started) {
		game.players.animate();
	} else if (game.splash.active) {
		game.splash.listen();
	} else if (game.selectPlayers.active) {
		game.selectPlayers.listen();
	} else {
		game.end.listen();
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

