import Module from './core.module.js';
import core from './core.js';

export class Widget extends Module {

	constructor(manifest) {
		super(manifest);
	}

	/**
	 * method to retrieve users progress in current widget
	 * returns a promise to be resolved
	 */
	getProgress() {
		return core.database.getProgress(this.identifier)
			.then(result => {
				return result;
			})
	}

	/**
	 * method to save the users progress in the current widget
	 * returns a promise to be resolved
	 * @param {*} progress 
	 */
	saveProgress(progress) {
		return core.database.saveProgress(this.identifier, progress)
			.then(() => {
				return true;
			})
	}

	start() { 
		this.render(this.mainView);
	}

	getViewFromName(viewName) { 
		return this.views.find(view => {
			return view.name === viewName;
		});
	}

	clearBackgroundLayer() {
		document.getElementById('core_background_container').innerHTML = '';
	}
}
