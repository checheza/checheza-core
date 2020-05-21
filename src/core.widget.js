import Module from './core.module.js';
import Core from './core.js';

export class Widget extends Module {
	constructor(manifest) {
		super(manifest);
	}

	/**
	 * method to retrieve users progress in current widget
	 * returns a promise to be resolved
	 */
	getProgress() {
		return Core.database.getProgress(this.identifier).then((result) => {
			return result;
		});
	}

	/**
	 * method to save the users progress in the current widget
	 * returns a promise to be resolved
	 * @param {*} progress
	 */
	saveProgress(progress) {
		return Core.database
			.saveProgress(this.identifier, progress)
			.then(() => {
				return true;
			});
	}

	render(view) {
		return new Promise((resolve, reject) => {
			let timeout = setTimeout(() => {
				reject(false);
			}, 5000);

			document
				.getElementById('core_app_container')
				.addEventListener('DOMSubtreeModified', () => {
					clearTimeout(timeout);
					resolve(true);
				});

			document.getElementById('core_app_container').innerHTML = view;
		});
	}

	openDomain(domainName, payload) {
		Core.utils.makeUnzoomable();
		Core.utils.clearBackgroundLayer();
		Core.audio.unloadAll();
		Core.domainHistory.push({ name: domainName, payload: payload });

		this.render(this.domains[domainName].render()).then(() => {
			this.domains[domainName].start(payload);
		});
	}

	start() {
		Core.audio.unloadAll();
		Core.domainHistory = [];
		Core.setActiveWidget(this);
		this.openDomain('main');
	}

	getViewFromName(viewName) {
		return this.views.find((view) => {
			return view.name === viewName;
		});
	}

	clearBackgroundLayer() {
		document.getElementById('core_background_container').innerHTML = '';
	}
}
