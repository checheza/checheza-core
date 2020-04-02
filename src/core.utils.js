export default class CoreUtils {
    /**
     * @return {boolean} A boolean that is true if running on phone and false if running on a desktop computer
     * @example if core.utils.isPhone()
     *              console.log("Running on a phone");
     */
    isPhone() {
        return (window.cordova || window.PhoneGap || window.phonegap)
            && /^file:\/{3}[^\/]/i.test(window.location.href)
            && /ios|iphone|ipod|ipad|android/i.test(navigator.userAgent);
    }


    /**
     * @example core.utils.makeZoomable(); // Enables viewport zoom. (phone devices)
     */
    makeZoomable() {
        document.getElementsByName("viewport")[0].remove();
        document.getElementsByTagName("head").innerHTML += `<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">`;
    }


    /**
     * @param {string} identifier - the widget identifier that you want to exit to
     * @example core.utils.addExitButton('checheza.main.treehouse') // Spawns button that if clicked, exits to treehouse
     */
    addExitButton(identifier) {
        if (identifier === undefined)
            identifier = "checheza.main.treehouse";

        document.getElementById("core_ui_container").innerHTML += `<a class="core-exit-button fadeIn animated" onclick="core.startWidget(\'' + identifier + '\');"></a>`;
    }

    adjustAspectRatioFor(box) {
        var outer = document.getElementById('#core_container');

        if (outer.innerHeight > outer.innerWidth * 0.5625) {
            box.style.width = '100%';
            box.style.height = box.innerWidth * 0.5625;
        } else {
            box.style.height = '100%';
            box.style.width = box.innerWidth * 0.5625;
        }
    }

    alignScreenLayers() {
        let gameScreenHeight = document.getElementById('core_app_container').innerHeight;
        document.getElementById('core_background_container').style.marginTop = gameScreenHeight*-1;
        document.getElementById('core_ui_container').style.marginTop = gameScreenHeight*-1;
    }

    adjustAspectRatio() {
        this.adjustAspectRatioFor(document.getElementById('core_app_container'));
        this.adjustAspectRatioFor(document.getElementById('core_background_container'));
        this.adjustAspectRatioFor(document.getElementById('core_ui_container'));
    }
}