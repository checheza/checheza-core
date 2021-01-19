import CoreUtils from './core.utils.js';
import CoreFilesystem from './core.fs.js';
import CoreBackend from './core.backend.js';
import CoreDatabase from './core.database.js';
import CoreAnalytics from './core.analytics.js';
import CoreAudio from './core.audio.js';
import styles from '../assets/core.css';

class Core {
	/**
	 * @ignore
	 * This method is not supposed to be used by anything other than starting up the application.
	 */
	constructor() {
		this.modules = [];
		this.domainHistory = [];

		this.modules_updates = {};

		// This is the currently active widget module.
		this.activeWidget = null;

		// Initialize the core utilities
		this.utils = new CoreUtils();

		// Initialize the core audio utility
		this.audio = new CoreAudio();

		// Initialize filesystem access
		this.filesystem = new CoreFilesystem();

		// Initialize core backend
		this.backend = new CoreBackend();

		// Initialize core analytics
		this.analytics = new CoreAnalytics();

		// Initialize database
		this.database = new CoreDatabase(
			'1',
			'chechezaCoreDb',
			'Database for Checheza core',
			2 * 1024 * 1024
		);

		this.countdown = 0;
	}

	log(message) {
		console.log(`CORE (${new Date().toTimeString()}): ${message}`);
	}

	initializeResizeListener() {
		window.addEventListener('resize', () => {
			document.getElementById('core_resize_overlay').style.display =
				'block';
			this.countdown += 1;

			setTimeout(() => {
				this.countdown -= 1;
				if (this.countdown === 0) {
					this.utils.adjustAspectRatio();
					this.utils.alignScreenLayers();
					document.getElementById(
						'core_resize_overlay'
					).style.display = 'none';
				}
			}, 1000);
		});
	}

	/**
	 * @return {Array} returns all loaded modules
	 */
	getModules() {
		return this.modules;
	}

	/**
	 * @return {Module} return module by identifier
	 */
	getModule(identifier) {
		return this.modules[identifier];
	}

	/**
	 * @return {Array} returns all modules of a specific type
	 * @param {type} WidgetType (ref:)
	 */
	getAllModulesOfType(type) {
		this.log('***** getAllModulesOfType');
		let result__ = [];

		for (let module in this.modules) {
			this.log('***** module: ' + module);
			if (this.modules[module].type === type) {
				result__.push(this.modules[module]);
			}
		}

		return result__;
	}

	/**
	 * @return {Array} returns all modules of in a specifc category
	 * @param {String} category (ref:)
	 */
	getAllModulesInCategory(category) {
		let result__ = [];

		for (let module in this.modules) {
			if (this.modules[module].category === category) {
				result__.push(this.modules[module]);
			}
		}

		return result__;
	}

	getCoreAsset(asset) {
		return styles[asset];
	}

	/**
	 * @return {Object} Returns the active widget.
	 */
	getActiveWidget() {
		return this.activeWidget;
	}

	/**
	 * Method used to set the current active widget.
	 * @ignore
	 * @param {*} widgetObject
	 */
	setActiveWidget(widgetObject) {
		this.log('***** setActiveWidget');
		this.activeWidget = widgetObject;
	}

	/**
	 * Method used to start a widget.
	 * @param {String} widget identifier
	 */
	startWidget(identifier) {
		this.log('***** startWidget');
		this.setActiveWidget(this.modules[identifier]);
		this.modules[identifier].start();
	}

	setupEnvironment() {
		this.log('***** setupEnvironment');
		// this.backend.downloadModule("checheza-main-treehouse")
		this.backend.downloadModule("/files/checheza.main.treehouse.zip")
		.then(() => {
			this.startMainWidget();
		})
	}

	startMainWidget() {
		this.log('***** startMainWidget');
		let mainWidgets = this.getAllModulesOfType('main');
		// this.log('***** mainWidgets:' + JSON.stringify(mainWidgets));

		if (mainWidgets.length > 1) {
			this.log('Multiple main addons. Cannot start...');
		} else if (mainWidgets.length === 0) {
			this.log("***** Starting over; didn't find any 'main' modules yet.");
			this.setupEnvironment();

		} else if (mainWidgets.length === 1) {
			this.startWidget(mainWidgets[0].identifier);
		}
	}

	importModule(module) {
		this.modules[module.identifier] = module;
	}

	moduleNeedsUpdate(){
		const semver = require('semver');
		for (let module_id in this.modules) {
			console.log(module_id);
			module = this.modules[module_id];
			if (module.version.split(".").length < 3) {
				module.version = module.version + ".0";
			}

			if (__cfg.modules[module.identifier] && semver.diff(module.version, __cfg.modules[module.identifier]) ) {
				this.modules_updates[module.identifier] = __cfg.modules[module.identifier];
			}
		}
	}

	moduleUpdate(){
		let promises = [];
		if (__cfg.modules){
			this.moduleNeedsUpdate();
			for (var module in this.modules_updates){
				console.log("***** Updating module: " + module)
				let module_checked = module;
				if (module.includes("widget.treehouse")){
					module_checked = module.replace("widget", "main");
				}
				promises.push(this.backend.downloadModule("/" + module_checked + "-" + this.modules_updates[module] + ".zip"))
			}
		}
		return Promise.all(promises);
	}

	refreshModules() {
		this.log('***** refreshModules');
		return new Promise((resolve, reject) => {
			this.filesystem
				.readFolder('modules')
				.then(modulesFolder => {
					// this.log('***** modulesFolder: ' + JSON.stringify(modulesFolder));
					if( modulesFolder === false ) {
						this.log('***** Creating System Directories');
						this.filesystem.createSystemDirectories()
						.then(() => {
							this.log('***** Done Creating System Directories; time to refresh modules');
							return this.refreshModules();
						});
					} else {
						return modulesFolder.files; // read modules folder
					}
				})
				.then((modules) => {
					// this.log('***** then modules: ' + JSON.stringify(modules));
					if(modules === undefined) {
						this.log('***** need to refreshModules() again');
						return this.refreshModules();
					}

					return Promise.all(
						modules.map((folder) => {
							this.log('***** mapping module ('+folder+')');
							return this.filesystem
								.readFolder('modules/' + folder)
								.then((data) => {
									// this.log('***** reading folder (modules/'+ folder +'): ' + JSON.stringify(data));
									return data.files
										.map((file) => {
											if (file === 'module.js')
												return `modules/${folder}/${file}`; // return source file path
										})
										.filter((item) => item !== undefined);
								});
						})
					);
				})
				.then((moduleSource) => {
					if(moduleSource === undefined)
						return this.refreshModules();

					return Promise.all(
						moduleSource.flat().map((source) => {
							return new Promise((res, rej) => {
								let timeout = setTimeout(() => {
									rej();
								}, 5000);

								document.head.addEventListener(
									'DOMSubtreeModified',
									() => {
										clearTimeout(timeout);

										timeout = setTimeout(() => {
											res();
										}, 1000);
									}
								);
								if (
									source !== undefined &&
									source.includes('module.js')
								) {
									this.filesystem
										.getUri(source)
										.then((file) => {
											let script = document.createElement(
												'script'
											);
											script.setAttribute(
												'type',
												'text/javascript'
											);
											script.setAttribute(
												'src',
												file.uri
											);
											document
												.getElementsByTagName('head')[0]
												.appendChild(script); // append module source code
										});
								}
							});
						})
					);
				})
				.then(() => {
					this.initializeResizeListener();
					this.utils.adjustAspectRatio();
					this.utils.alignScreenLayers();
					this.analytics.initialize();

					setTimeout(() => {
						resolve();
					}, 1000);
				});
		});
	}

	goBack() {
		if (this.domainHistory.length > 1) {
			let prevDomain = this.domainHistory[this.domainHistory.length - 2];

			this.domainHistory.pop();

			this.getActiveWidget().openDomain(
				prevDomain.name,
				prevDomain.payload
			);

			this.domainHistory.pop();

		} else {
			this.log('history is empty');
		}
	}
}

export default new Core();
export { Widget } from './core.widget.js';
