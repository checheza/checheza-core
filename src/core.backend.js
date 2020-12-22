import Core from './core';

export default class CoreBackend {

    constructor() {
        this.initialize();
    }

    initialize() { 
        this.activeRequests = [];

        if(__cfg.backend.use) {
            this.address = __cfg.backend.address;
            this.auth = btoa(__cfg.backend.username+":"+__cfg.backend.password);
            console.log("Instantiated core.backend");
        } else {
            console.log("Skipping backend module. Not configured");
        }
    }

    request(method, resource, data) {
        return new Promise((resolve, reject) => { 
            Core.log("Fetching "+ this.address + resource);
            fetch(this.address + resource, {
                method: method,
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + this.auth
                },
                body: data === null ? null: JSON.stringify(data)
            }).then(response => {
                let infoObject = {
                    resource: resource,
                    receivedLength: 0,
                    contentLength: 0,
                    data: []
                }

                let requestIndex = this.activeRequests.push(infoObject);

                const reader = response.body.getReader();      
                infoObject.contentLength = response.headers.get('Content-Length');

                var chunks = [];      
                return pump();

                function pump() {
                    reader.read().then(({ value, done }) => {
                      if (done) {
                        infoObject.data = new Uint8Array(infoObject.receivedLength); // (4.1)
                        let position = 0;

                        for(let chunk of chunks) {
                            infoObject.data.set(chunk, position); // (4.2)
                            position += chunk.length;
                        }

                        Core.backend.activeRequests.splice(requestIndex, 1);

                        resolve(infoObject.data);
                        return;
                      }
                      
                      infoObject.receivedLength += value.length;
                      chunks.push(value);
                      Core.backend.activeRequests[requestIndex] = infoObject;

                      return pump();
                    });
                }
            });   
        });
    }

    checkConnection() {
        return this.GET("/report/", false)
        .then(response => {
            return response.available;
        })
    }

    showModal() {
        var modal = document.getElementById("downloadingModal");
        var span = document.getElementsByClassName("close-modal")[0];
        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
            modal.style.display = "none";
        }
        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
            modal.style.display = "none";
            }
        }
        modal.style.display = "block";
    }

    hideModal() {
        var modal = document.getElementById("downloadingModal");
        modal.style.display = "none";
    }
    
    downloadModule(mod) {
        Core.log('***** downloadModule ( ' + mod + ' )');
        // return this.GET('https://github.com/checheza/' + mod + '/archive/stable.zip', true)
        mod = mod.replace('https://data.checheza.com','');
        if (!mod.includes("main.treehouse")) {
            this.showModal();
        }
        Core.log('***** GET\'ing ' + mod);
        return this.GET(mod, true)
        .then(file => {
            // change modal content to "checkmark"
            return Core.filesystem.unzipFile(file, false);
        }).then(() => {
            if (!mod.includes("main.treehouse")) {
                Core.log('***** Done Downloading module');
                Core.refreshModules()
                .then(() => {
                    this.hideModal();
                    Core.goBack();
                    Core.log('***** Closed downloading modal and went back');
                    setTimeout(() => {
                        Core.goBack();
                        Core.log('***** went back again');
                    }, 200);
                });
            }else {
                Core.log('***** Done Downloading Treehouse');
                return Core.refreshModules();
            }
        })
    }

    downloadBook(url) {
        url = url.replace('https://data.checheza.com','');
        this.showModal();
        return this.GET(url, true)
        .then(file => {
            return Core.filesystem.unzipFile(file, true);
        }).then(() => {
            this.hideModal();
            Core.goBack();
            setTimeout(() => {
                Core.goBack();
            }, 200);
        });
    }

    POST(resource, data, asBlob) {
        return this.request('POST', resource, data)
        .then(response => {
            if(asBlob) {
                return response.buffer;
            } else {
                return new TextDecoder("utf-8").decode(response);
            }
        });
    }

    GET(resource, asBlob) {
        return this.request('GET', resource, null)
        .then(response => {
            if(asBlob) {
                return response.buffer;
            } else {
                return new TextDecoder("utf-8").decode(response);
            }
        })
    }

    PUT(resource, data, asBlob)  {
        return this.request('PUT', resource, data)
        .then(response => {
            if(asBlob) {
                return response.buffer;
            } else {
                return new TextDecoder("utf-8").decode(response);
            }
        });
    }

    DELETE(resource, asBlob) {
        return this.request('DELETE', resource, null)
        .then(response => {
            if(asBlob) {
                return response.buffer;
            } else {
                return new TextDecoder("utf-8").decode(response);
            }
        });
    }
}