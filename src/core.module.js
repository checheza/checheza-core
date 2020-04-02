/**
 * Module Class
 */
export default class Module {
	/**
	 * @param {*} manifest 
	 */
	constructor (manifest) {
		this.name 			= manifest.name;
		this.identifier 	= manifest.identifier;
		this.author 		= manifest.author;
		this.version 		= manifest.version;
		this.category		= manifest.category;
		this.type 			= manifest.type;
		this.icon 			= manifest.icon;
	}
}
