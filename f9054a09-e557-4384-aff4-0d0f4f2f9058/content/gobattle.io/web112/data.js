
  var Module = typeof Module !== 'undefined' ? Module : {};
  
  if (!Module.expectedDataFileDownloads) {
    Module.expectedDataFileDownloads = 0;
  }
  Module.expectedDataFileDownloads++;
  (function() {
   var loadPackage = function(metadata) {
  
      var PACKAGE_PATH;
      if (typeof window === 'object') {
        PACKAGE_PATH = window['encodeURIComponent'](window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf('/')) + '/');
      } else if (typeof location !== 'undefined') {
        // worker
        PACKAGE_PATH = encodeURIComponent(location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf('/')) + '/');
      } else {
        throw 'using preloaded data can only be done on a web page or in a web worker';
      }
      var PACKAGE_NAME = '../htdocs//web112/app.data';
      var REMOTE_PACKAGE_BASE = 'app.data';
      if (typeof Module['locateFilePackage'] === 'function' && !Module['locateFile']) {
        Module['locateFile'] = Module['locateFilePackage'];
        err('warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)');
      }
      var REMOTE_PACKAGE_NAME = Module['locateFile'] ? Module['locateFile'](REMOTE_PACKAGE_BASE, '') : REMOTE_PACKAGE_BASE;
    
      var REMOTE_PACKAGE_SIZE = metadata['remote_package_size'];
      var PACKAGE_UUID = metadata['package_uuid'];
    
      function fetchRemotePackage(packageName, packageSize, callback, errback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', packageName, true);
        xhr.responseType = 'arraybuffer';
        xhr.onprogress = function(event) {
          var url = packageName;
          var size = packageSize;
          if (event.total) size = event.total;
          if (event.loaded) {
            if (!xhr.addedTotal) {
              xhr.addedTotal = true;
              if (!Module.dataFileDownloads) Module.dataFileDownloads = {};
              Module.dataFileDownloads[url] = {
                loaded: event.loaded,
                total: size
              };
            } else {
              Module.dataFileDownloads[url].loaded = event.loaded;
            }
            var total = 0;
            var loaded = 0;
            var num = 0;
            for (var download in Module.dataFileDownloads) {
            var data = Module.dataFileDownloads[download];
              total += data.total;
              loaded += data.loaded;
              num++;
            }
            total = Math.ceil(total * Module.expectedDataFileDownloads/num);
            if (Module['setStatus']) Module['setStatus']('Downloading data... (' + loaded + '/' + total + ')');
          } else if (!Module.dataFileDownloads) {
            if (Module['setStatus']) Module['setStatus']('Downloading data...');
          }
        };
        xhr.onerror = function(event) {
          throw new Error("NetworkError for: " + packageName);
        }
        xhr.onload = function(event) {
          if (xhr.status == 200 || xhr.status == 304 || xhr.status == 206 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
            var packageData = xhr.response;
            callback(packageData);
          } else {
            throw new Error(xhr.statusText + " : " + xhr.responseURL);
          }
        };
        xhr.send(null);
      };

      function handleError(error) {
        console.error('package error:', error);
      };
    
    function runWithFS() {
  
      function assert(check, msg) {
        if (!check) throw msg + new Error().stack;
      }
  Module['FS_createPath']("/", "xmas", true, true);
Module['FS_createPath']("/", "halloween", true, true);
Module['FS_createPath']("/", "logic", true, true);

          /** @constructor */
          function DataRequest(start, end, audio) {
            this.start = start;
            this.end = end;
            this.audio = audio;
          }
          DataRequest.prototype = {
            requests: {},
            open: function(mode, name) {
              this.name = name;
              this.requests[name] = this;
              Module['addRunDependency']('fp ' + this.name);
            },
            send: function() {},
            onload: function() {
              var byteArray = this.byteArray.subarray(this.start, this.end);
              this.finish(byteArray);
            },
            finish: function(byteArray) {
              var that = this;
      
          Module['FS_createPreloadedFile'](this.name, null, byteArray, true, true, function() {
            Module['removeRunDependency']('fp ' + that.name);
          }, function() {
            if (that.audio) {
              Module['removeRunDependency']('fp ' + that.name); // workaround for chromium bug 124926 (still no audio with this, but at least we don't hang)
            } else {
              err('Preloading file ' + that.name + ' failed');
            }
          }, false, true); // canOwn this data in the filesystem, it is a slide into the heap that will never change
  
              this.requests[this.name] = null;
            }
          };
      
              var files = metadata['files'];
              for (var i = 0; i < files.length; ++i) {
                new DataRequest(files[i]['start'], files[i]['end'], files[i]['audio']).open('GET', files[i]['filename']);
              }
      
        
        var indexedDB;
        if (typeof window === 'object') {
          indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        } else if (typeof location !== 'undefined') {
          // worker
          indexedDB = self.indexedDB;
        } else {
          throw 'using IndexedDB to cache data can only be done on a web page or in a web worker';
        }
        var IDB_RO = "readonly";
        var IDB_RW = "readwrite";
        var DB_NAME = "EM_PRELOAD_CACHE";
        var DB_VERSION = 1;
        var METADATA_STORE_NAME = 'METADATA';
        var PACKAGE_STORE_NAME = 'PACKAGES';
        function openDatabase(callback, errback) {
          try {
            var openRequest = indexedDB.open(DB_NAME, DB_VERSION);
          } catch (e) {
            return errback(e);
          }
          openRequest.onupgradeneeded = function(event) {
            var db = event.target.result;

            if(db.objectStoreNames.contains(PACKAGE_STORE_NAME)) {
              db.deleteObjectStore(PACKAGE_STORE_NAME);
            }
            var packages = db.createObjectStore(PACKAGE_STORE_NAME);

            if(db.objectStoreNames.contains(METADATA_STORE_NAME)) {
              db.deleteObjectStore(METADATA_STORE_NAME);
            }
            var metadata = db.createObjectStore(METADATA_STORE_NAME);
          };
          openRequest.onsuccess = function(event) {
            var db = event.target.result;
            callback(db);
          };
          openRequest.onerror = function(error) {
            errback(error);
          };
        };

        // This is needed as chromium has a limit on per-entry files in IndexedDB
        // https://cs.chromium.org/chromium/src/content/renderer/indexed_db/webidbdatabase_impl.cc?type=cs&sq=package:chromium&g=0&l=177
        // https://cs.chromium.org/chromium/src/out/Debug/gen/third_party/blink/public/mojom/indexeddb/indexeddb.mojom.h?type=cs&sq=package:chromium&g=0&l=60
        // We set the chunk size to 64MB to stay well-below the limit
        var CHUNK_SIZE = 64 * 1024 * 1024;

        function cacheRemotePackage(
          db,
          packageName,
          packageData,
          packageMeta,
          callback,
          errback
        ) {
          var transactionPackages = db.transaction([PACKAGE_STORE_NAME], IDB_RW);
          var packages = transactionPackages.objectStore(PACKAGE_STORE_NAME);
          var chunkSliceStart = 0;
          var nextChunkSliceStart = 0;
          var chunkCount = Math.ceil(packageData.byteLength / CHUNK_SIZE);
          var finishedChunks = 0;
          for (var chunkId = 0; chunkId < chunkCount; chunkId++) {
            nextChunkSliceStart += CHUNK_SIZE;
            var putPackageRequest = packages.put(
              packageData.slice(chunkSliceStart, nextChunkSliceStart),
              'package/' + packageName + '/' + chunkId
            );
            chunkSliceStart = nextChunkSliceStart;
            putPackageRequest.onsuccess = function(event) {
              finishedChunks++;
              if (finishedChunks == chunkCount) {
                var transaction_metadata = db.transaction(
                  [METADATA_STORE_NAME],
                  IDB_RW
                );
                var metadata = transaction_metadata.objectStore(METADATA_STORE_NAME);
                var putMetadataRequest = metadata.put(
                  {
                    'uuid': packageMeta.uuid,
                    'chunkCount': chunkCount
                  },
                  'metadata/' + packageName
                );
                putMetadataRequest.onsuccess = function(event) {
                  callback(packageData);
                };
                putMetadataRequest.onerror = function(error) {
                  errback(error);
                };
              }
            };
            putPackageRequest.onerror = function(error) {
              errback(error);
            };
          }
        }

        /* Check if there's a cached package, and if so whether it's the latest available */
        function checkCachedPackage(db, packageName, callback, errback) {
          var transaction = db.transaction([METADATA_STORE_NAME], IDB_RO);
          var metadata = transaction.objectStore(METADATA_STORE_NAME);
          var getRequest = metadata.get('metadata/' + packageName);
          getRequest.onsuccess = function(event) {
            var result = event.target.result;
            if (!result) {
              return callback(false, null);
            } else {
              return callback(PACKAGE_UUID === result['uuid'], result);
            }
          };
          getRequest.onerror = function(error) {
            errback(error);
          };
        }

        function fetchCachedPackage(db, packageName, metadata, callback, errback) {
          var transaction = db.transaction([PACKAGE_STORE_NAME], IDB_RO);
          var packages = transaction.objectStore(PACKAGE_STORE_NAME);

          var chunksDone = 0;
          var totalSize = 0;
          var chunkCount = metadata['chunkCount'];
          var chunks = new Array(chunkCount);

          for (var chunkId = 0; chunkId < chunkCount; chunkId++) {
            var getRequest = packages.get('package/' + packageName + '/' + chunkId);
            getRequest.onsuccess = function(event) {
              // If there's only 1 chunk, there's nothing to concatenate it with so we can just return it now
              if (chunkCount == 1) {
                callback(event.target.result);
              } else {
                chunksDone++;
                totalSize += event.target.result.byteLength;
                chunks.push(event.target.result);
                if (chunksDone == chunkCount) {
                  if (chunksDone == 1) {
                    callback(event.target.result);
                  } else {
                    var tempTyped = new Uint8Array(totalSize);
                    var byteOffset = 0;
                    for (var chunkId in chunks) {
                      var buffer = chunks[chunkId];
                      tempTyped.set(new Uint8Array(buffer), byteOffset);
                      byteOffset += buffer.byteLength;
                      buffer = undefined;
                    }
                    chunks = undefined;
                    callback(tempTyped.buffer);
                    tempTyped = undefined;
                  }
                }
              }
            };
            getRequest.onerror = function(error) {
              errback(error);
            };
          }
        }
      
      function processPackageData(arrayBuffer) {
        assert(arrayBuffer, 'Loading data file failed.');
        assert(arrayBuffer instanceof ArrayBuffer, 'bad input to processPackageData');
        var byteArray = new Uint8Array(arrayBuffer);
        var curr;
        
          // Reuse the bytearray from the XHR as the source for file reads.
          DataRequest.prototype.byteArray = byteArray;
    
            var files = metadata['files'];
            for (var i = 0; i < files.length; ++i) {
              DataRequest.prototype.requests[files[i].filename].onload();
            }
                Module['removeRunDependency']('datafile_../htdocs//web112/app.data');

      };
      Module['addRunDependency']('datafile_../htdocs//web112/app.data');
    
      if (!Module.preloadResults) Module.preloadResults = {};
    
        function preloadFallback(error) {
          console.error(error);
          console.error('falling back to default preload behavior');
          fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE, processPackageData, handleError);
        };

        openDatabase(
          function(db) {
            checkCachedPackage(db, PACKAGE_PATH + PACKAGE_NAME,
              function(useCached, metadata) {
                Module.preloadResults[PACKAGE_NAME] = {fromCache: useCached};
                if (useCached) {
                  fetchCachedPackage(db, PACKAGE_PATH + PACKAGE_NAME, metadata, processPackageData, preloadFallback);
                } else {
                  fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE,
                    function(packageData) {
                      cacheRemotePackage(db, PACKAGE_PATH + PACKAGE_NAME, packageData, {uuid:PACKAGE_UUID}, processPackageData,
                        function(error) {
                          console.error(error);
                          processPackageData(packageData);
                        });
                    }
                  , preloadFallback);
                }
              }
            , preloadFallback);
          }
        , preloadFallback);

        if (Module['setStatus']) Module['setStatus']('Downloading...');
      
    }
    if (Module['calledRun']) {
      runWithFS();
    } else {
      if (!Module['preRun']) Module['preRun'] = [];
      Module["preRun"].push(runWithFS); // FS is not initialized yet, wait for it
    }
  
   }
   loadPackage({"files": [{"filename": "/mg3.png", "start": 0, "end": 24491, "audio": 0}, {"filename": "/hit3.wav", "start": 24491, "end": 61107, "audio": 1}, {"filename": "/habilities.shin$", "start": 61107, "end": 62255, "audio": 0}, {"filename": "/pack0.jpeg", "start": 62255, "end": 74235, "audio": 0}, {"filename": "/wingflap.wav", "start": 74235, "end": 97795, "audio": 1}, {"filename": "/enemy.atlas", "start": 97795, "end": 102715, "audio": 0}, {"filename": "/sword_swipe.wav", "start": 102715, "end": 122105, "audio": 1}, {"filename": "/stones.wav", "start": 122105, "end": 167839, "audio": 1}, {"filename": "/map5.jpeg", "start": 167839, "end": 181119, "audio": 0}, {"filename": "/impact.wav", "start": 181119, "end": 184455, "audio": 1}, {"filename": "/laser.wav", "start": 184455, "end": 272771, "audio": 1}, {"filename": "/hit2.wav", "start": 272771, "end": 314647, "audio": 1}, {"filename": "/life.wav", "start": 314647, "end": 361263, "audio": 1}, {"filename": "/mg2.png", "start": 361263, "end": 372282, "audio": 0}, {"filename": "/roar.wav", "start": 372282, "end": 504698, "audio": 1}, {"filename": "/mg0.png", "start": 504698, "end": 513824, "audio": 0}, {"filename": "/enemy.png", "start": 513824, "end": 908301, "audio": 0}, {"filename": "/mg14.png", "start": 908301, "end": 918280, "audio": 0}, {"filename": "/store_item_select.shin$", "start": 918280, "end": 918646, "audio": 0}, {"filename": "/fall.wav", "start": 918646, "end": 930544, "audio": 1}, {"filename": "/fg21.png", "start": 930544, "end": 978403, "audio": 0}, {"filename": "/die.wav", "start": 978403, "end": 1038195, "audio": 1}, {"filename": "/map1_over.jpeg", "start": 1038195, "end": 1051281, "audio": 0}, {"filename": "/yeti_growl.wav", "start": 1051281, "end": 1090169, "audio": 1}, {"filename": "/tileset_rocks.png", "start": 1090169, "end": 1196026, "audio": 0}, {"filename": "/cauldron.bsp", "start": 1196026, "end": 1196606, "audio": 0}, {"filename": "/cloth-heavy.wav", "start": 1196606, "end": 1214710, "audio": 1}, {"filename": "/lightswipe.wav", "start": 1214710, "end": 1233226, "audio": 1}, {"filename": "/compass.ttf", "start": 1233226, "end": 1244314, "audio": 0}, {"filename": "/select_knight.shin$", "start": 1244314, "end": 1245494, "audio": 0}, {"filename": "/hit1.wav", "start": 1245494, "end": 1317964, "audio": 1}, {"filename": "/manage_stats.css$", "start": 1317964, "end": 1319745, "audio": 0}, {"filename": "/mg1.png", "start": 1319745, "end": 1325234, "audio": 0}, {"filename": "/ogre.bsp", "start": 1325234, "end": 1352088, "audio": 0}, {"filename": "/.DS_Store", "start": 1352088, "end": 1358236, "audio": 0}, {"filename": "/key3.png", "start": 1358236, "end": 1359408, "audio": 0}, {"filename": "/dark.png", "start": 1359408, "end": 1540274, "audio": 0}, {"filename": "/quest.shin$", "start": 1540274, "end": 1540366, "audio": 0}, {"filename": "/key2.png", "start": 1540366, "end": 1541537, "audio": 0}, {"filename": "/stats.css$", "start": 1541537, "end": 1542882, "audio": 0}, {"filename": "/pets.atlas", "start": 1542882, "end": 1544183, "audio": 0}, {"filename": "/index.shin$", "start": 1544183, "end": 1550098, "audio": 0}, {"filename": "/minotaur_roar.wav", "start": 1550098, "end": 1682514, "audio": 1}, {"filename": "/mg10.png", "start": 1682514, "end": 1715788, "audio": 0}, {"filename": "/mg4.png", "start": 1715788, "end": 1724935, "audio": 0}, {"filename": "/store_banner.png", "start": 1724935, "end": 1731887, "audio": 0}, {"filename": "/mg12.png", "start": 1731887, "end": 1784451, "audio": 0}, {"filename": "/map4.jpeg", "start": 1784451, "end": 1800500, "audio": 0}, {"filename": "/login.shin$", "start": 1800500, "end": 1803241, "audio": 0}, {"filename": "/recover.css$", "start": 1803241, "end": 1804271, "audio": 0}, {"filename": "/credits.shin$", "start": 1804271, "end": 1805389, "audio": 0}, {"filename": "/game.shin$", "start": 1805389, "end": 1812280, "audio": 0}, {"filename": "/store_game.shin$", "start": 1812280, "end": 1812578, "audio": 0}, {"filename": "/changelog.md", "start": 1812578, "end": 1813217, "audio": 0}, {"filename": "/habilities.css$", "start": 1813217, "end": 1814713, "audio": 0}, {"filename": "/key1.png", "start": 1814713, "end": 1815884, "audio": 0}, {"filename": "/podium.tmx", "start": 1815884, "end": 1821038, "audio": 0}, {"filename": "/minotaur.bsp", "start": 1821038, "end": 1842179, "audio": 0}, {"filename": "/pack1.jpeg", "start": 1842179, "end": 1858498, "audio": 0}, {"filename": "/modeadventure.jpg", "start": 1858498, "end": 1870870, "audio": 0}, {"filename": "/mg13.png", "start": 1870870, "end": 1878608, "audio": 0}, {"filename": "/testserver.lua$", "start": 1878608, "end": 1879973, "audio": 0}, {"filename": "/mg7.png", "start": 1879973, "end": 1920189, "audio": 0}, {"filename": "/ogre_hardstep.wav", "start": 1920189, "end": 1960205, "audio": 1}, {"filename": "/in_app_purchases.css$", "start": 1960205, "end": 1961859, "audio": 0}, {"filename": "/bell.wav", "start": 1961859, "end": 2059409, "audio": 1}, {"filename": "/private_game.css$", "start": 2059409, "end": 2061323, "audio": 0}, {"filename": "/jump.wav", "start": 2061323, "end": 2069611, "audio": 1}, {"filename": "/block1.wav", "start": 2069611, "end": 2108203, "audio": 1}, {"filename": "/mainmenu.tmx", "start": 2108203, "end": 2116151, "audio": 0}, {"filename": "/reputation_item.shin$", "start": 2116151, "end": 2116303, "audio": 0}, {"filename": "/private_game.shin$", "start": 2116303, "end": 2120536, "audio": 0}, {"filename": "/change_server.shin$", "start": 2120536, "end": 2120652, "audio": 0}, {"filename": "/dungeon_list.shin$", "start": 2120652, "end": 2120809, "audio": 0}, {"filename": "/yeti_growl2.wav", "start": 2120809, "end": 2151897, "audio": 1}, {"filename": "/bow.wav", "start": 2151897, "end": 2178843, "audio": 1}, {"filename": "/collideaxe.wav", "start": 2178843, "end": 2239025, "audio": 1}, {"filename": "/firebreath.atlas", "start": 2239025, "end": 2239575, "audio": 0}, {"filename": "/fg8.png", "start": 2239575, "end": 2264681, "audio": 0}, {"filename": "/fire5.wav", "start": 2264681, "end": 2279729, "audio": 1}, {"filename": "/fairy.bsp", "start": 2279729, "end": 2280526, "audio": 0}, {"filename": "/fg81.png", "start": 2280526, "end": 2303361, "audio": 0}, {"filename": "/store_item.shin$", "start": 2303361, "end": 2303720, "audio": 0}, {"filename": "/block3.wav", "start": 2303720, "end": 2335558, "audio": 1}, {"filename": "/ogre3.wav", "start": 2335558, "end": 2354972, "audio": 1}, {"filename": "/dragon.bsp", "start": 2354972, "end": 2369080, "audio": 0}, {"filename": "/block2.wav", "start": 2369080, "end": 2407534, "audio": 1}, {"filename": "/fire4.wav", "start": 2407534, "end": 2422352, "audio": 1}, {"filename": "/map3.jpeg", "start": 2422352, "end": 2438633, "audio": 0}, {"filename": "/slime.bsp", "start": 2438633, "end": 2441206, "audio": 0}, {"filename": "/metalhit.wav", "start": 2441206, "end": 2473688, "audio": 1}, {"filename": "/login.css$", "start": 2473688, "end": 2475132, "audio": 0}, {"filename": "/map2.jpeg", "start": 2475132, "end": 2492328, "audio": 0}, {"filename": "/download.shin$", "start": 2492328, "end": 2494718, "audio": 0}, {"filename": "/maptest.shin$", "start": 2494718, "end": 2497052, "audio": 0}, {"filename": "/ogre_growl2.wav", "start": 2497052, "end": 2567342, "audio": 1}, {"filename": "/tileset_houses.png", "start": 2567342, "end": 2817896, "audio": 0}, {"filename": "/fire1.wav", "start": 2817896, "end": 2832370, "audio": 1}, {"filename": "/ogre_footstep.wav", "start": 2832370, "end": 2859432, "audio": 1}, {"filename": "/tileset_general.png", "start": 2859432, "end": 3067204, "audio": 0}, {"filename": "/ghost.bsp", "start": 3067204, "end": 3068293, "audio": 0}, {"filename": "/assets_640_000000.png", "start": 3068293, "end": 3107034, "audio": 0}, {"filename": "/fire3.wav", "start": 3107034, "end": 3121600, "audio": 1}, {"filename": "/modes.jpkg", "start": 3121600, "end": 3122278, "audio": 0}, {"filename": "/latestnews.md", "start": 3122278, "end": 3123345, "audio": 0}, {"filename": "/fire2.wav", "start": 3123345, "end": 3140529, "audio": 1}, {"filename": "/miniogre.bsp", "start": 3140529, "end": 3154709, "audio": 0}, {"filename": "/dinosaur.bsp", "start": 3154709, "end": 3161492, "audio": 0}, {"filename": "/confetti.wav", "start": 3161492, "end": 3169946, "audio": 1}, {"filename": "/dragon_nest.png", "start": 3169946, "end": 3175034, "audio": 0}, {"filename": "/big_hit.wav", "start": 3175034, "end": 3351550, "audio": 1}, {"filename": "/Carta-03-(Guardia-Valdoran).png", "start": 3351550, "end": 3379180, "audio": 0}, {"filename": "/fg2.png", "start": 3379180, "end": 3432440, "audio": 0}, {"filename": "/activate.shin$", "start": 3432440, "end": 3433349, "audio": 0}, {"filename": "/stats_item.shin$", "start": 3433349, "end": 3433638, "audio": 0}, {"filename": "/bg10.png", "start": 3433638, "end": 3442897, "audio": 0}, {"filename": "/battledragon.bsp", "start": 3442897, "end": 3467075, "audio": 0}, {"filename": "/recover.shin$", "start": 3467075, "end": 3468145, "audio": 0}, {"filename": "/bg6.png", "start": 3468145, "end": 3482454, "audio": 0}, {"filename": "/bg7.png", "start": 3482454, "end": 3499282, "audio": 0}, {"filename": "/in_app_purchases.shin$", "start": 3499282, "end": 3502234, "audio": 0}, {"filename": "/wolf.bsp", "start": 3502234, "end": 3509200, "audio": 0}, {"filename": "/modeking.jpg", "start": 3509200, "end": 3519017, "audio": 0}, {"filename": "/swords.shin$", "start": 3519017, "end": 3519319, "audio": 0}, {"filename": "/glowtiles.png", "start": 3519319, "end": 3521984, "audio": 0}, {"filename": "/footstep.wav", "start": 3521984, "end": 3534234, "audio": 1}, {"filename": "/style.css$", "start": 3534234, "end": 3539013, "audio": 0}, {"filename": "/map3_over.jpeg", "start": 3539013, "end": 3555639, "audio": 0}, {"filename": "/map1.jpeg", "start": 3555639, "end": 3568313, "audio": 0}, {"filename": "/fg1.png", "start": 3568313, "end": 3604653, "audio": 0}, {"filename": "/bg13.png", "start": 3604653, "end": 3607132, "audio": 0}, {"filename": "/bg5.png", "start": 3607132, "end": 3620055, "audio": 0}, {"filename": "/bg4.png", "start": 3620055, "end": 3628593, "audio": 0}, {"filename": "/game_assets.jpkg", "start": 3628593, "end": 3980151, "audio": 0}, {"filename": "/bg12.png", "start": 3980151, "end": 3999460, "audio": 0}, {"filename": "/select.wav", "start": 3999460, "end": 4009518, "audio": 1}, {"filename": "/swords_selected.shin$", "start": 4009518, "end": 4009526, "audio": 0}, {"filename": "/cat.bsp", "start": 4009526, "end": 4013477, "audio": 0}, {"filename": "/game_tablet.css$", "start": 4013477, "end": 4014089, "audio": 0}, {"filename": "/pack4.jpeg", "start": 4014089, "end": 4038430, "audio": 0}, {"filename": "/store.shin$", "start": 4038430, "end": 4043882, "audio": 0}, {"filename": "/button.wav", "start": 4043882, "end": 4047568, "audio": 1}, {"filename": "/store_game_selected.shin$", "start": 4047568, "end": 4047792, "audio": 0}, {"filename": "/yeti.bsp", "start": 4047792, "end": 4062160, "audio": 0}, {"filename": "/game_assets_640_000000.png", "start": 4062160, "end": 4820566, "audio": 0}, {"filename": "/game.css$", "start": 4820566, "end": 4831577, "audio": 0}, {"filename": "/pets.png", "start": 4831577, "end": 4842855, "audio": 0}, {"filename": "/bg0.png", "start": 4842855, "end": 4897025, "audio": 0}, {"filename": "/yeti.png", "start": 4897025, "end": 4912855, "audio": 0}, {"filename": "/bg1.png", "start": 4912855, "end": 4918344, "audio": 0}, {"filename": "/game_assets_640_000001.png", "start": 4918344, "end": 5228905, "audio": 0}, {"filename": "/groundfire.wav", "start": 5228905, "end": 5317221, "audio": 1}, {"filename": "/ghostboss.bsp", "start": 5317221, "end": 5322696, "audio": 0}, {"filename": "/damageroar.wav", "start": 5322696, "end": 5411012, "audio": 1}, {"filename": "/twosteps.wav", "start": 5411012, "end": 5444074, "audio": 1}, {"filename": "/fg5.png", "start": 5444074, "end": 5479378, "audio": 0}, {"filename": "/RAM.bsp", "start": 5479378, "end": 5481569, "audio": 0}, {"filename": "/firebreath.png", "start": 5481569, "end": 5616551, "audio": 0}, {"filename": "/fire_impact.wav", "start": 5616551, "end": 5789561, "audio": 1}, {"filename": "/Carta-01-(Trono).png", "start": 5789561, "end": 5819859, "audio": 0}, {"filename": "/earthquake.wav", "start": 5819859, "end": 5991637, "audio": 1}, {"filename": "/fg7.png", "start": 5991637, "end": 6012789, "audio": 0}, {"filename": "/test.scml$", "start": 6012789, "end": 6224538, "audio": 0}, {"filename": "/tileset_trees.png", "start": 6224538, "end": 6395494, "audio": 0}, {"filename": "/url.shin$", "start": 6395494, "end": 6396631, "audio": 0}, {"filename": "/tileset_christmas.png", "start": 6396631, "end": 6419333, "audio": 0}, {"filename": "/bg15.png", "start": 6419333, "end": 6427971, "audio": 0}, {"filename": "/download.css$", "start": 6427971, "end": 6428723, "audio": 0}, {"filename": "/bg3.png", "start": 6428723, "end": 6436048, "audio": 0}, {"filename": "/bg2.png", "start": 6436048, "end": 6441049, "audio": 0}, {"filename": "/bg14.png", "start": 6441049, "end": 6446438, "audio": 0}, {"filename": "/magic.wav", "start": 6446438, "end": 6573758, "audio": 1}, {"filename": "/firebreath.bsp", "start": 6573758, "end": 6615601, "audio": 0}, {"filename": "/player.atlas", "start": 6615601, "end": 6643754, "audio": 0}, {"filename": "/map5_over.jpeg", "start": 6643754, "end": 6657387, "audio": 0}, {"filename": "/coin.wav", "start": 6657387, "end": 6676587, "audio": 1}, {"filename": "/explosion.wav", "start": 6676587, "end": 6853103, "audio": 1}, {"filename": "/manage_stats.shin$", "start": 6853103, "end": 6855557, "audio": 0}, {"filename": "/store.tmx", "start": 6855557, "end": 6861466, "audio": 0}, {"filename": "/Carta-02-(Guardia-Real).png", "start": 6861466, "end": 6889625, "audio": 0}, {"filename": "/flower.bsp", "start": 6889625, "end": 6893112, "audio": 0}, {"filename": "/modes_640_000000.png", "start": 6893112, "end": 6897603, "audio": 0}, {"filename": "/fire_throw.wav", "start": 6897603, "end": 7051131, "audio": 1}, {"filename": "/sleigh.wav", "start": 7051131, "end": 7082831, "audio": 1}, {"filename": "/store.css$", "start": 7082831, "end": 7085752, "audio": 0}, {"filename": "/slimespitter.bsp", "start": 7085752, "end": 7091846, "audio": 0}, {"filename": "/pack2.jpeg", "start": 7091846, "end": 7111156, "audio": 0}, {"filename": "/profile.lua$", "start": 7111156, "end": 7119174, "audio": 0}, {"filename": "/mg9.png", "start": 7119174, "end": 7144445, "audio": 0}, {"filename": "/ogre_shout.wav", "start": 7144445, "end": 7273161, "audio": 1}, {"filename": "/fg14.png", "start": 7273161, "end": 7289260, "audio": 0}, {"filename": "/tileset_interiors.png", "start": 7289260, "end": 7340083, "audio": 0}, {"filename": "/map2_over.jpeg", "start": 7340083, "end": 7357546, "audio": 0}, {"filename": "/yeti.atlas", "start": 7357546, "end": 7357814, "audio": 0}, {"filename": "/stats.shin$", "start": 7357814, "end": 7360315, "audio": 0}, {"filename": "/tileset_caves.png", "start": 7360315, "end": 7485056, "audio": 0}, {"filename": "/dragonpet.bsp", "start": 7485056, "end": 7495067, "audio": 0}, {"filename": "/minotaur_inhale.wav", "start": 7495067, "end": 7583383, "audio": 1}, {"filename": "/minimedusa.bsp", "start": 7583383, "end": 7585962, "audio": 0}, {"filename": "/credits.css$", "start": 7585962, "end": 7586634, "audio": 0}, {"filename": "/skin_selector.shin$", "start": 7586634, "end": 7588432, "audio": 0}, {"filename": "/bgmenu.png", "start": 7588432, "end": 7618213, "audio": 0}, {"filename": "/modebattleroyal.jpeg", "start": 7618213, "end": 7629885, "audio": 0}, {"filename": "/throw_axe.wav", "start": 7629885, "end": 7655935, "audio": 1}, {"filename": "/fg11.png", "start": 7655935, "end": 7705151, "audio": 0}, {"filename": "/assets.jpkg", "start": 7705151, "end": 7710899, "audio": 0}, {"filename": "/glare.png", "start": 7710899, "end": 7729904, "audio": 0}, {"filename": "/enemies.scml$", "start": 7729904, "end": 7919397, "audio": 0}, {"filename": "/fg10.png", "start": 7919397, "end": 7971114, "audio": 0}, {"filename": "/ogre_spit2.wav", "start": 7971114, "end": 8036036, "audio": 1}, {"filename": "/sword_swipe2.wav", "start": 8036036, "end": 8054392, "audio": 1}, {"filename": "/pack3.jpeg", "start": 8054392, "end": 8077122, "audio": 0}, {"filename": "/game_mobile.css$", "start": 8077122, "end": 8078212, "audio": 0}, {"filename": "/ogre_growl.wav", "start": 8078212, "end": 8108226, "audio": 1}, {"filename": "/player.bsp", "start": 8108226, "end": 8315277, "audio": 0}, {"filename": "/modedamageball.jpeg", "start": 8315277, "end": 8326744, "audio": 0}, {"filename": "/player.png", "start": 8326744, "end": 8683984, "audio": 0}, {"filename": "/ogre_spit1.wav", "start": 8683984, "end": 8822992, "audio": 1}, {"filename": "/fg13.png", "start": 8822992, "end": 8834924, "audio": 0}, {"filename": "/throne.png", "start": 8834924, "end": 8855769, "audio": 0}, {"filename": "/roll.wav", "start": 8855769, "end": 8888871, "audio": 1}, {"filename": "/garrotehit.wav", "start": 8888871, "end": 8907479, "audio": 1}, {"filename": "/map4_over.jpeg", "start": 8907479, "end": 8923937, "audio": 0}, {"filename": "/xmas/gift4.png", "start": 8923937, "end": 8924942, "audio": 0}, {"filename": "/xmas/gift1.png", "start": 8924942, "end": 8925841, "audio": 0}, {"filename": "/xmas/gift2.png", "start": 8925841, "end": 8926338, "audio": 0}, {"filename": "/xmas/gift3.png", "start": 8926338, "end": 8926800, "audio": 0}, {"filename": "/xmas/tree.png", "start": 8926800, "end": 8934693, "audio": 0}, {"filename": "/xmas/gift-stack.png", "start": 8934693, "end": 8938127, "audio": 0}, {"filename": "/xmas/snowman.png", "start": 8938127, "end": 8940723, "audio": 0}, {"filename": "/halloween/hat.png", "start": 8940723, "end": 8941457, "audio": 0}, {"filename": "/halloween/pumpkin3.png", "start": 8941457, "end": 8941971, "audio": 0}, {"filename": "/halloween/pumpkin2.png", "start": 8941971, "end": 8942556, "audio": 0}, {"filename": "/halloween/pumpkin1.png", "start": 8942556, "end": 8943236, "audio": 0}, {"filename": "/halloween/pumpkin5.png", "start": 8943236, "end": 8944173, "audio": 0}, {"filename": "/halloween/pumpkin4.png", "start": 8944173, "end": 8944774, "audio": 0}, {"filename": "/halloween/pumpkinstack3.png", "start": 8944774, "end": 8956594, "audio": 0}, {"filename": "/halloween/pumpkinstack2.png", "start": 8956594, "end": 8960106, "audio": 0}, {"filename": "/halloween/pumpkinstack1.png", "start": 8960106, "end": 8962601, "audio": 0}, {"filename": "/halloween/pumpkinstack5.png", "start": 8962601, "end": 8969941, "audio": 0}, {"filename": "/halloween/pumpkinstack4.png", "start": 8969941, "end": 8982322, "audio": 0}, {"filename": "/logic/emoji.lua$", "start": 8982322, "end": 9006171, "audio": 0}, {"filename": "/logic/.DS_Store", "start": 9006171, "end": 9012319, "audio": 0}, {"filename": "/logic/bit.lua$", "start": 9012319, "end": 9014805, "audio": 0}, {"filename": "/logic/game.lua$", "start": 9014805, "end": 9087176, "audio": 0}, {"filename": "/logic/json.lua$", "start": 9087176, "end": 9090368, "audio": 0}], "remote_package_size": 9090368, "package_uuid": "ba5cd477-afa6-4419-b270-deaa9fd68349"});
  
  })();
  