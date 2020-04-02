import CoreUtils from './core.utils.js';
import CoreFilesystem from './core.fs.js';
import CoreBackend from './core.utils.js';
import CoreDatabase from './core.database.js';
import CoreAnalytics from './core.analytics.js';

class Core {	
	/**
     * @ignore
     * This method is not supposed to be used by anything other than starting up the application.
     */
	constructor() {

		this.modules = [];

		// This is the currently active widget module.
		this.activeWidget = null;

		// Initialize the core utilities
		this.utils = new CoreUtils();

		// Initialize filesystem access
		this.filesystem = new CoreFilesystem();

		// Initialize core backend
		this.backend = new CoreBackend();

		// Initialize core analytics
		this.analytics = new CoreAnalytics();
		
		// Initialize database
		this.database = new CoreDatabase("1", "chechezaCoreDb", "Database for Checheza core", 2*1024*1024);

		this.countdown = 0;
	}

	log(message) {
		console.log(`CORE (${new Date().toTimeString()}): ${message}`);
	}

	initializeResizeListener() {
		$(window).on("resize", () => {
			$("#core_resize_overlay").show(100);
			this.countdown += 1;
			
			setTimeout(()=>{
				this.countdown-=1;
				if(this.countdown === 0) {
					core.utils.adjustAspectRatio();
					core.utils.alignScreenLayers();
					$("#core_resize_overlay").hide(100);
				}
			}, 1000);
		})
	}
	
	/**
	 * @return {Array} returns all loaded modules
	 */
	getModules() {
		return this.modules;
	}

	getModule(identifier) {
		return this.module[identifier];
	}

	/**
	 * @return {Array} returns all modules of a specific type
	 * @param {type} WidgetType (ref:)
	 */
	getAllModulesOfType(type) {
		let result = [];

		for (let module in this.modules) {
			if (this.modules[module].type === type) {
				result.push(this.modules[module]);
			}
		}

		return result;
	}

	getAllModulesInCategory(category) {
		let result = []
		
		for (let module in this.modules) {
			if(this.modules[module].category === category) {
				result.push(this.modules[module]);
			}
		}

		return result;
	}

	/**
	 * @return {Object} Returns the active widget.
	 */
	getActiveWidget() {
		return this.activeWidget;
	}

	/**
	 * Method used to set which widget is the current active widget.
	 * @ignore
	 * @param {*} widgetObject
	 */
	setActiveWidget(widgetObject) {
		this.activeWidget = widgetObject;
	}

	/**
	 * @param {String} identifier 
	 */
	startWidget(identifier) {
		if (identifier === "quit") {
			
			if(core.utils.isPhone()) {
				navigator.app.exitApp();
			} 

			console.info("Cannot close app in browser-mode");
		}
		else {
			this.modules[identifier].start();
		}
	}

	refreshModules() {
		this.filesystem.readFolder("modules")
		.then(modules => {
			modules.forEach(module => {
				console.log(module);
			});
		})
	}
}

export default new Core();
export { Widget } from './core.widget.js';