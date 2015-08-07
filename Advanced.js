'use strict';

function Advanced() {

	this.active = false;

	this.getConfs = function() {
		var confs = {};
		var inputs = document.getElementsByTagName('input');
		for (var i = 0; i < inputs.length; i++) {
			var input = inputs[i];
			confs[input.id] = parseFloat(input.value);
		}
		return confs;
	};

	this.init = function() {
		var adv = this;
		this.populateFields('classic');
		
		document.getElementById('advanced-button').onclick = function() {
			if (adv.active) {
				adv.active = false;
				document.getElementById('classic').click();
				document.getElementById('advanced-button').innerHTML = 'Classic';
				document.getElementById('advanced-button').className = 'classic'
				document.getElementById('form').style.display = 'none';
			} else {
				adv.active = true;
				document.getElementById('advanced-button').innerHTML = 'Advanced';
				document.getElementById('advanced-button').className = '';
				document.getElementById('form').style.display = 'block';
			}
		};
		
		var presets = document.getElementsByClassName('preset');
		for (var i = 0; i < presets.length; i++) {
			presets[i].onclick = function() {
				var preset = this.getAttribute('data-preset');
				adv.populateFields(preset);
			};
		}
	};

	this.populateFields = function(preset) {
		var conf = configurations[preset];
		for (var key in conf) {
			document.getElementById(key).value = conf[key];
		}
	};

	this.show = function() {
		document.getElementById('advanced').style.display = 'block';
	};
	
	this.hide = function() {
		document.getElementById('advanced').style.display = 'none';
	};
	
	this.init();

}
