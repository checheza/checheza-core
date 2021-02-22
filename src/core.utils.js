import Core from './core';
import styles from '../assets/core.css';
import { Plugins, AppState } from '@capacitor/core';
const { App } = Plugins;

export default class CoreUtils {
	/**
	 * @return {boolean} A boolean that is true if running on phone and false if running on a desktop computer
	 * @example if core.utils.isPhone()
	 *              console.log("Running on a phone");
	 */
	isPhone() {
		return /ios|iphone|ipod|ipad|android/i.test(navigator.userAgent);
	}

	/**
	 * @example core.utils.makeZoomable(); // Enables viewport zoom. (phone devices)
	 */
	makeZoomable() {
		if(document.getElementsByName('viewport')[0]) {
			document.getElementsByName('viewport')[0].remove();
		}

		document.getElementsByTagName(
			'head'
		)[0].innerHTML += `<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">`;
	}

	/**
	 * @example core.utils.makeZoomable(); // Disables viewport zoom. (phone devices)
	 */
	makeUnzoomable() {
		if(document.getElementsByName('viewport')[0]) {
			document.getElementsByName('viewport')[0].remove();
		}
		
		document.getElementsByTagName(
			'head'
		)[0].innerHTML += `<meta name="viewport" content="width=device-width, user-scalable=no">`;
	}

	addExitButton() {
		document.getElementById('core_ui_container').innerHTML = '';

		let coreExitButton = document.createElement('div');

		coreExitButton.classList.add(styles['core-exit-button']);
		coreExitButton.classList.add(styles.fadeIn);
		coreExitButton.classList.add(styles.animated);

		coreExitButton.onclick = () => {
			if (Core.getActiveWidget().type !== 'main') {
				console.log("EXIT BUTTON CALLED");
				
				var noofTimeOuts = setTimeout(function() {}, 0);
				console.log("NOOFTIMEOUTS: "+noofTimeOuts);
				for (var t = 0 ; t < noofTimeOuts ; t++) {
					console.log("Clearing timeout "+t);
					clearTimeout(t);
				}
				for (var v = 0 ; v < noofTimeOuts ; v++) {
					console.log("Clearing interval "+v);
					clearInterval(v);
				}
				Core.audio.stopAll();
				Core.audio.unloadAll();
				
				Core.startMainWidget();
			} else {
				App.exitApp();
				window.close();
			}
		};

		document
			.getElementById('core_ui_container')
			.appendChild(coreExitButton);
	}

	addBackButton() {
		document.getElementById('core_ui_container').innerHTML = '';

		let coreBackButton = document.createElement('div');

		coreBackButton.classList.add(styles['core-exit-button']);
		coreBackButton.classList.add(styles.fadeIn);
		coreBackButton.classList.add(styles.animated);

		coreBackButton.onclick = () => {
			Core.goBack();
		};

		document
			.getElementById('core_ui_container')
			.appendChild(coreBackButton);
	}

	adjustAspectRatioFor(box) {
		var outer = document.getElementById('core_container');

		if (outer.innerHeight > outer.innerWidth * 0.5625) {
			box.style.width = '100%';
			box.style.height = box.innerWidth * 0.5625;
		} else {
			box.style.height = '100%';
			box.style.width = box.innerWidth * 0.5625;
		}
	}

	alignScreenLayers() {
		let gameScreenHeight = document.getElementById('core_app_container').clientHeight;
		document.getElementById('core_background_container').style.marginTop = `${gameScreenHeight * -1}px`;
		document.getElementById('core_ui_container').style.marginTop = `${gameScreenHeight * -1}px`;
	}

	adjustAspectRatio() {
		this.adjustAspectRatioFor(
			document.getElementById('core_app_container')
		);
		this.adjustAspectRatioFor(
			document.getElementById('core_background_container')
		);
		this.adjustAspectRatioFor(document.getElementById('core_ui_container'));
	}

	setSkyColor(colorCode) {
        document.getElementById('sky').style.backgroundColor = colorCode;
    }

    addSky(weather) {
        let background_container = document.getElementById('core_background_container');
		
        switch (weather) {
            case 'partly-cloudy':
                background_container.innerHTML = `<div id="sky" class="${styles.sky}"><div class="${styles.cloud_1} ${styles.animate} ${styles.very_slow} ${styles.move_left} ${styles.infinite}"></div><div class="${styles.cloud_2} ${styles.animate} ${styles.very_slow} ${styles.move_right} ${styles.infinite}"></div></div>`;
				break;
			case 'clear':
				background_container.innerHTML = `<div id="sky" class="${styles.sky}"></div>`;
				break;
        }
	}
	
	clearBackgroundLayer() {
		document.getElementById('core_background_container').innerHTML = '';
	}
}
