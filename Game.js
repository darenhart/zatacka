
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
			window.init();
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

	this.init = function() {

		this.width = window.innerWidth;
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
		score.style.left = this.width-score.width+'px';
		document.body.appendChild(score);

		var select = document.createElement('canvas');
		select.id     = 'select';
		select.height = this.height;
		select.width  = this.width;
		document.body.appendChild(select);
		
		// Test to see if canvas is supported
		if (!main.getContext) {
			return false;
		} else {
		
			this.mainContext   = main.getContext('2d');
			this.textsContext  = texts.getContext('2d');
			this.scoreContext  = score.getContext('2d');
			this.selectContext = select.getContext('2d');

			Player.prototype.context      = this.mainContext;
			Players.prototype.context     = this.mainContext;
			Background.prototype.context  = this.mainContext;
			SplashScreen.prototype.context= this.selectContext;
			Fps.prototype.context         = this.textsContext;
			Score.prototype.context       = this.scoreContext;
			SelectPlayers.prototype.context = this.selectContext;

			this.background = new Background();
			this.splash = new SplashScreen();
			this.fps = new Fps();
			this.players = new Players();
			this.score = new Score();
			this.selectPlayers = new SelectPlayers();
			
			return true;
		}
	};
	
	this.calculateCanvasSizes = function() {
		var existentCanvas = document.getElementsByTagName('canvas');
		for (var i = 0; i < existentCanvas.length; i++) {
			document.body.removeChild(existentCanvas[0]);
		}
	};
	
	this.splashScreen = function() {
		this.started = false;
		game.splash.draw();
		document.getElementById('select').style.display = 'block';
		document.getElementById('main').style.display = 'none';
		document.getElementById('texts').style.display = 'none';
		document.getElementById('score').style.display = 'none';
		animate();
	};
	
	this.selectScreen = function() {
		this.started = false;
		game.splash.clear();
		game.selectPlayers.show();
		document.getElementById('select').style.display = 'block';
		document.getElementById('main').style.display = 'none';
		document.getElementById('texts').style.display = 'none';
		document.getElementById('score').style.display = 'none';
	}

	this.start = function() {
		document.getElementById('select').style.display = 'none';
		document.getElementById('main').style.display = 'block';
		document.getElementById('texts').style.display = 'block';
		document.getElementById('score').style.display = 'block';
		this.started = true;
		this.players.createPlayers();
		this.players.maxRounds = 15;
		this.score.print();
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
function init() {
	if (game.init()) {
		game.splashScreen();
	}
}

