export default class CoreAudio {
	constructor() {
		this.audio = [];
	}

	play(data) {
		let clip = new Audio(data);
		clip.play();
		this.audio.push(clip);
	}

	loop(data) { 
		let clip = new Audio(data);
		clip.loop();
		clip.play();
		this.audio.push(clip);
	}

	unloadAll() {
		// for all audio using Checheza's core audio utils
		for (let clip of this.audio) {
			clip.pause();
			clip.removeAttribute('src');
			clip.load();
		}
		// make sure to empty the audio queue
		this.audio = [];

		// for any other sounds found in HTML5 tags
		var sounds = document.getElementsByTagName('audio');
		for(let i=0; i<sounds.length; i++) {
			sounds[i].pause();
		}
		var media = document.getElementsByTagName('media');
		for(let m=0; m<media.length; m++) {
			media[m].pause();
		}
	}

	stopAll() {
		// for all audio using Checheza's core audio utils
		for(let clip of this.audio) {
			clip.pause();
			clip.currentTime = 0;
		}
		// for any other sounds found in HTML5 tags
		var sounds = document.getElementsByTagName('audio');
		for(let i=0; i<sounds.length; i++) {
			sounds[i].pause();
		}
		var media = document.getElementsByTagName('media');
		for(let m=0; m<media.length; m++) {
			media[m].pause();
		}
	}
}
