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
    
    downloadModule(mod) {
        Core.log('***** downloadModule ( ' + mod + ' )');
        // return this.GET('https://github.com/checheza/' + mod + '/archive/stable.zip', true)
        mod = mod.replace('https://data.checheza.com','');
        Core.log('***** GET\'ing ' + mod);
        return this.GET(mod, true)
        .then(file => {
            return Core.filesystem.unzipFile(file, false);
        }).then(() => {
            return Core.refreshModules();
        })
    }

    downloadBook(url) {
        url = url.replace('https://data.checheza.com','');
        return this.GET(url, true)
        .then(file => {
            return Core.filesystem.unzipFile(file, true);
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