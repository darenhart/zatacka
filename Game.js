
var imageRepository = new function() {

	// Set images src
	var imgs = {
		splash: "img/achtung.png",
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
}

function SplashScreen() {

	this.active = true;
	var timeout = 1000;
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

function Game() {

	this.started = false;
	this.layers;

	this.init = function() {

		this.layers = {
			'main':{},
			'texts':{},
			'select':{},
			'score':{}
		};
		
		for (key in this.layers) {
			// check if canvas exists
			if (document.getElementById(key)) {
				this.layers[key].element = document.getElementById(key);
			} else {
				this.layers[key].element = document.createElement('canvas');
				document.body.appendChild(this.layers[key].element);
				this.layers[key].element.id = key;
			}
			this.layers[key].context = this.layers[key].element.getContext('2d');
		}

		this.calculateSize();

		Player.prototype.context       = this.layers.main.context;
		Players.prototype.context      = this.layers.main.context;
		Background.prototype.context   = this.layers.main.context;
		SplashScreen.prototype.context = this.layers.select.context;
		SelectPlayers.prototype.context= this.layers.select.context;
		Fps.prototype.context          = this.layers.texts.context;
		Score.prototype.context        = this.layers.score.context;

		this.background = new Background();
		this.splash = new SplashScreen();
		this.fps = new Fps();
		this.players = new Players();
		this.score = new Score();
		this.selectPlayers = new SelectPlayers();
		
		this.splashScreen();
	};
	
	this.onSizeChange = function() {
		this.calculateSize();
		
		if (game.started) {
			this.background.draw();
			this.score.draw();
		} else {
			if (game.splash.active) {
				game.splashScreen();
			} else {
				this.selectPlayers.show();
			}
		}
	};
	
	this.calculateSize = function() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		for (key in this.layers) {
			this.layers[key].element.width = this.width;
			this.layers[key].element.height = this.height;
		}
		this.layers.score.element.style.left = this.width - Score.prototype.width+'px';
		this.layers.score.element.width = Score.prototype.width;
	};
	
	this.splashScreen = function() {
		document.body.style.cursor = 'initial'
		this.started = false;
		this.selectPlayers.clear();
		this.splash.draw();
		animate();
	};
	
	this.selectScreen = function() {
		this.started = false;
		this.splash.clear();
		this.selectPlayers.show();
	}

	this.start = function() {
		this.selectPlayers.clear();
		// hide cursor
		document.body.style.cursor = 'none'
		this.started = true;
		this.players.createPlayers();
		this.players.maxRounds = 15;
		this.score.draw();
		this.newRound();
	};
	
	this.newRound = function() {
		this.players.start();
		this.background.draw();
	};

}


function animate() {
	requestAnimFrame( animate );

	if (game.started) {
		game.players.animate();
		game.fps.update();
	} else {
		if (game.splash.active) {
			game.splash.listen();
		} else {
			game.selectPlayers.listen();
		}
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

