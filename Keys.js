'use strict';

//// CONTROL KEYS ////
// The keycodes that will be mapped when a user presses a button.
// Original code by Doug McInnes
var KEY_CODES = {
	1: 'mouse1',
	2: 'mouse2',
	32: 'space',
	37: 'left',
	38: 'up',
	39: 'right',
	40: 'down',
	17: 'Ctrl',
	16: 'Shift',
	49: '1',
	81: 'q',

	77: 'm',
	78: 'n',

	79: 'o',
	80: 'p',
/*
	65: 'a',
	83: 's',

	57: '9',
	48: '0',
	50: '2',
	51: '3',
	52: '4',
	53: '5',
	54: '6',
	55: '7',
	56: '8',
	67: 'c',
	68: 'd',
	69: 'e',
	70: 'f',
	71: 'g',
	72: 'h',
	73: 'i',
	74: 'j',
	75: 'k',
	76: 'l',

	66: 'b',
	86: 'v',
	82: 'r',
	84: 't',
	85: 'u',
	87: 'w',
	88: 'x',
	89: 'y',
	90: 'z'
*/
}
// Creates the array to hold the KEY_CODES and sets all their values
// to false. Checking true/flase is the quickest way to check status
// of a key press and which one was pressed when determining
// when to move and which direction.
var KEY_STATUS = {};
for (var code in KEY_CODES) {
  KEY_STATUS[ KEY_CODES[ code ]] = false;
}
/**
 * Sets up the document to listen to onkeydown events (fired when
 * any key on the keyboard is pressed down). When a key is pressed,
 * it sets the appropriate direction to true to let us know which
 * key it was.
 */
document.onkeydown = function(e) {
  // Firefox and opera use charCode instead of keyCode to
  // return which key was pressed.
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = true;
  }
}

/**
 * Sets up the document to listen to ownkeyup events (fired when
 * any key on the keyboard is released). When a key is released,
 * it sets teh appropriate direction to false to let us know which
 * key it was.
 */
document.onkeyup = function(e) {
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = false;
  }
}



// mouse
document.getElementById('game').addEventListener('mousedown', function (e){
    if(e.button === 2){
		KEY_STATUS.mouse2 = true; // right
		return false;
    }
    else if(e.button === 0){
		KEY_STATUS.mouse1 = true; // left
    }
}, false);

document.getElementById('game').addEventListener('mouseup', function (e){
    if(e.button === 2){
		KEY_STATUS.mouse2 = false;
		return false;
    }
    else if(e.button === 0){
		KEY_STATUS.mouse1 = false;
    }
}, false);



