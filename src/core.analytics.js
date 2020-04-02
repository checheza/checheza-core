import Core from './core';

export default class CoreAnalytics {
    initialize() {
        window.onmousedown = this.clickListener;
        console.info("CORE: Anaytics click listener enabled");

        Core.backend.checkConnection()
        .then(hasConnection => {
            if (hasConnection) {
                Core.log("Anaytics data dispatcher enabled");
                Core.analytics.dispatchData();
                setInterval(() => {
                    Core.analytics.dispatchData();
                }, 60000);
            }
        })
    }

    dispatchData() {
        Core.database.getClicks()
        .then(clicks => {
            Core.log("Dispatching data to analytics server");
            Core.backend.POST("/report/clicks", { "clicks": clicks })
            .then(response => {
                if(response.success) {
                    Core.database.clearClicks();
                }
            });
        })
    }
    
    createClickObject(event) {
        return {
            "widget": Core.getActiveWidget().identifier,
            "x": event.clientX,
            "y": event.clientY,
            "targetElem": event.path[0].id !== undefined ? event.path[0].id : undefined 
        }
    }

    clickListener(event) {
        Core.database.storeClick(Core.analytics.createClickObject(event));
    }
}