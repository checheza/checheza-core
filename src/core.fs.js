import { Plugins, FilesystemDirectory } from '@capacitor/core';
const { Filesystem } = Plugins;

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
        path: "checheza/" + path,
        directory: FilesystemDirectory.Documents
      });
    } catch (error) {
      alert(`Could not read directory.\n\n${error}`)
    }
  }

  async readFile(path) {
    try {
      return await Filesystem.readFile({
        path: "checheza/" + path,
        directory: FilesystemDirectory.Documents
      });
    } catch (error) {
      console.error('Could not read file.', error);
    }
  }
}