import { Plugins, FilesystemDirectory } from '@capacitor/core';
const { Filesystem } = Plugins;
import JSZip from 'jszip';
import Core from './core';

/** This class provides methods for reading and writing to the filesystem.
 * @class
 */
export default class CoreFilesystem {
	/**
	 * @param {string} path - the path of the folder you want to read from.
	 * @return {Promise} A promise that resolves all the entries inside the folder.
	 * @example core.filesystem.readFolder("/")
	 *          .then(entries => { // successfully read folder "/"
	 *              console.log(entries); // print all folder entries in
	 *          })
	 */
	async readFolder(path) {
		try {
			return await Filesystem.readdir({
				path: 'checheza/' + path,
				directory: FilesystemDirectory.Documents,
			});
		} catch (error) {
			Core.log(`Could not read directory.\n\n${error}`);
			return await false;
		}
	}

	async readFile(path) {
		try {
			return await Filesystem.readFile({
				path: 'checheza/' + path,
				directory: FilesystemDirectory.Documents,
			});
		} catch (error) {
			console.error('Could not read file.', error);
		}
	}

	async writeFile(path, data) {
		let bytes = new Uint8Array(data);
		let binaryString = '';

		for (let byte of bytes) {
			binaryString += String.fromCharCode(byte);
		}

		let base64 = btoa(binaryString);

		try {
			return await Filesystem.writeFile({
				path: 'checheza/' + path,
				data: base64,
				directory: FilesystemDirectory.Documents,
				recursive: true,
			});
		} catch (error) {
			console.error('Could not write file.', error);
		}
	}

	async removeFile(path) {
		return await Filesystem.deleteFile({
			path: 'checheza/' + path,
			directory: FilesystemDirectory.Documents,
		});
	}

	async makeDirectory(path) {
		try {
			return await Filesystem.mkdir({
				path: 'checheza/' + path,
				directory: FilesystemDirectory.Documents,
				recursive: true,
			});
		} catch (error) {
			console.error('Could not create directory.', error);
		}
	}

	async createSystemDirectories() {
		try {
			await Filesystem.mkdir({
				path: 'checheza',
				directory: FilesystemDirectory.Documents,
				recursive: true,
			});

			await Filesystem.mkdir({
				path: 'checheza/books',
				directory: FilesystemDirectory.Documents,
				recursive: true,
			});

			await Filesystem.mkdir({
				path: 'checheza/modules',
				directory: FilesystemDirectory.Documents,
				recursive: true,
			});


			return true;
		} catch (error) {
			return false;
		}
	}

	async unzipFile(data, book) {
		let prefix = '/modules/';

		if(book)
			prefix = '/books/';

		return new Promise(resolve => { 
			JSZip.loadAsync(data).then((contents) => {
				Object.keys(contents.files).forEach((filename, i) => {
					let file = contents.file(filename);
					if (file) {
						if(i === 0) {
							this.makeDirectory(prefix + file.name.split("/")[0])
							.then(() => { 
								file.async('uint8array')
								.then((data) =>
									this.writeFile(prefix + filename, data)
									.then(() => {
										if(Object.keys(contents.files).length-1 === i) {
											resolve(true);
										}
									})
								);
							});
						} else {
							file.async('uint8array')
							.then((data) =>
								this.writeFile(prefix + filename, data)
								.then(() => {
									if(Object.keys(contents.files).length-1 === i) {
										resolve(true);
									}
								})
							);
						}
					} else {
						this.makeDirectory(prefix + filename)
						.then(() => { 
							if(Object.keys(contents.files).length-1 === i) {
								resolve(true);
							}
						});
					}
				});
			});
		});
	}

	async getUri(path) {
		try {
			let uri = await Filesystem.getUri({
				path: 'checheza/' + path,
				directory: FilesystemDirectory.Documents,
			});

			if(Core.utils.isPhone()) {
				uri.uri = window.Ionic.WebView.convertFileSrc(uri.uri);
			}
			
			return uri;
			
		} catch (error) {
			console.error('Could not get URI.', error);
		}
	}
}
