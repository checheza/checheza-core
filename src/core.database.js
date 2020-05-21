import Core from './core';

export default class CoreDatabase {
	constructor(version, name, description, size) {
		this.version = version;
		this.name = name;
		this.description = description;
		this.size = size;
		this.db = undefined;

		let request = window.indexedDB.open(this.name, this.version);
		request.onsuccess = (e) => {
			this.bindDatabase(e);
		};
		request.onupgradeneeded = (e) => {
			this.upgrade(e);
		};
	}

	upgrade(event) {
		let db = event.target.result;
		db.createObjectStore('click', { autoIncrement: true });

		let progress = db.createObjectStore('progress', { keyPath: 'widget' });
		progress.createIndex('widget', 'widget', { unique: true });
	}

	bindDatabase(event) {
		this.db = event.target.result;
	}

	error(event) {
		Core.log('Could not initialize ChechezaDB');
	}

	clearClicks() {
		return new Promise((resolve) => {
			let transaction = this.db.transaction(['click'], 'readwrite');

			transaction.oncomplete = function (event) {
				resolve(event);
			};

			let objectStore = transaction.objectStore('click');
			objectStore.clear();
		});
	}

	storeClick(clickObject) {
		return new Promise((resolve) => {
			let transaction = this.db.transaction(['click'], 'readwrite');

			transaction.oncomplete = function (event) {
				resolve(event);
			};

			let objectStore = transaction.objectStore('click');
			objectStore.add(clickObject);
		});
	}

	getClicks() {
		return new Promise((resolve, reject) => {
			let transaction = this.db.transaction(['click'], 'readwrite');
			let objectStore = transaction.objectStore('click');
			let data = undefined;

			transaction.oncomplete = function (event) {
				resolve(data.result);
			};

			data = objectStore.getAll();
		});
	}

	getProgress(widgetIdentifier) {
		return new Promise((resolve, reject) => {
			let transaction = this.db.transaction(['progress'], 'readwrite');

			transaction.oncomplete = function (event) {
				resolve(event);
				s;
			};

			let objectStore = transaction.objectStore('progress');
			objectStore.get(widgetIdentifier);
		});
	}

	saveProgress(widgetIdentifier, progressIdentifier) {
		return new Promise((resolve) => {
			let transaction = this.db.transaction(['progress'], 'readwrite');

			transaction.oncomplete = function (event) {
				resolve(event);
			};

			let objectStore = transaction.objectStore('progress');
			objectStore.put({
				widget: widgetIdentifier,
				progress: progressIdentifier,
			});
		});
	}
}
