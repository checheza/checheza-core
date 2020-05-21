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
		for (let clip of this.audio) {
			clip.pause();
			clip.removeAttribute('src');
			clip.load();
		}

		this.audio = [];
	}

	stopAll() {
		for(let clip of this.audio) {
			clip.pause();
		}
	}
}
