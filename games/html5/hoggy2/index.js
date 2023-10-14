

// The Module object: Our interface to the outside world. We import
// and export values on it. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(Module) { ..generated code.. }
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to check if Module already exists (e.g. case 3 above).
// Substitution will be replaced with actual code on later stage of the build,
// this way Closure Compiler will not mangle it (e.g. case 4. above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module = typeof Module !== 'undefined' ? Module : {};



// --pre-jses are emitted after the Module integration code, so that they can
// refer to Module (if they choose; they can also define Module)

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
      var PACKAGE_NAME = 'WASMbuild/index.data';
      var REMOTE_PACKAGE_BASE = 'index.data?version=269';
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
    
        var fetchedCallback = null;
        var fetched = Module['getPreloadedPackage'] ? Module['getPreloadedPackage'](REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE) : null;

        if (!fetched) fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE, function(data) {
          if (fetchedCallback) {
            fetchedCallback(data);
            fetchedCallback = null;
          } else {
            fetched = data;
          }
        }, handleError);
      
    function runWithFS() {
  
      function assert(check, msg) {
        if (!check) throw msg + new Error().stack;
      }
  Module['FS_createPath']('/', 'data', true, true);
Module['FS_createPath']('/data', 'bonuscontent', true, true);
Module['FS_createPath']('/data', 'levels', true, true);
Module['FS_createPath']('/', 'images', true, true);
Module['FS_createPath']('/', 'sounds', true, true);
Module['FS_createPath']('/sounds', 'spark', true, true);
Module['FS_createPath']('/', 'music', true, true);

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
  
          Module['FS_createDataFile'](this.name, null, byteArray, true, true, true); // canOwn this data in the filesystem, it is a slide into the heap that will never change
          Module['removeRunDependency']('fp ' + that.name);
  
          this.requests[this.name] = null;
        }
      };
  
          var files = metadata['files'];
          for (var i = 0; i < files.length; ++i) {
            new DataRequest(files[i]['start'], files[i]['end'], files[i]['audio']).open('GET', files[i]['filename']);
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
                Module['removeRunDependency']('datafile_WASMbuild/index.data');

      };
      Module['addRunDependency']('datafile_WASMbuild/index.data');
    
      if (!Module.preloadResults) Module.preloadResults = {};
    
        Module.preloadResults[PACKAGE_NAME] = {fromCache: false};
        if (fetched) {
          processPackageData(fetched);
          fetched = null;
        } else {
          fetchedCallback = processPackageData;
        }
      
    }
    if (Module['calledRun']) {
      runWithFS();
    } else {
      if (!Module['preRun']) Module['preRun'] = [];
      Module["preRun"].push(runWithFS); // FS is not initialized yet, wait for it
    }
  
   }
   loadPackage({"files": [{"filename": "/data/badwholewords.txt", "start": 0, "end": 118, "audio": 0}, {"filename": "/data/badwords.txt", "start": 118, "end": 319, "audio": 0}, {"filename": "/data/createprofile.ml", "start": 319, "end": 1169, "audio": 0}, {"filename": "/data/createprofilefail.ml", "start": 1169, "end": 1406, "audio": 0}, {"filename": "/data/createprofileok.ml", "start": 1406, "end": 1753, "audio": 0}, {"filename": "/data/democreate.ml", "start": 1753, "end": 2968, "audio": 0}, {"filename": "/data/demodoor.ml", "start": 2968, "end": 4197, "audio": 0}, {"filename": "/data/demolimit.ml", "start": 4197, "end": 5421, "audio": 0}, {"filename": "/data/demomm.ml", "start": 5421, "end": 6426, "audio": 0}, {"filename": "/data/demorandom.ml", "start": 6426, "end": 7362, "audio": 0}, {"filename": "/data/goodwords.txt", "start": 7362, "end": 48136, "audio": 0}, {"filename": "/data/levelnames.txt", "start": 48136, "end": 51288, "audio": 0}, {"filename": "/data/recover.ml", "start": 51288, "end": 51919, "audio": 0}, {"filename": "/data/recoverfail.ml", "start": 51919, "end": 52132, "audio": 0}, {"filename": "/data/recoverok.ml", "start": 52132, "end": 52371, "audio": 0}, {"filename": "/data/sendactivation.ml", "start": 52371, "end": 52563, "audio": 0}, {"filename": "/data/signin.ml", "start": 52563, "end": 53596, "audio": 0}, {"filename": "/data/signinfail.ml", "start": 53596, "end": 53863, "audio": 0}, {"filename": "/data/signinnotactive.ml", "start": 53863, "end": 54452, "audio": 0}, {"filename": "/data/bonuscontent/old_001.hoggy", "start": 54452, "end": 60163, "audio": 0}, {"filename": "/data/bonuscontent/old_001_small.hoggy", "start": 60163, "end": 66264, "audio": 0}, {"filename": "/data/bonuscontent/old_002.hoggy", "start": 66264, "end": 71021, "audio": 0}, {"filename": "/data/bonuscontent/old_002_small.hoggy", "start": 71021, "end": 75981, "audio": 0}, {"filename": "/data/bonuscontent/old_003.hoggy", "start": 75981, "end": 80656, "audio": 0}, {"filename": "/data/bonuscontent/old_003_small.hoggy", "start": 80656, "end": 86733, "audio": 0}, {"filename": "/data/bonuscontent/old_004.hoggy", "start": 86733, "end": 90715, "audio": 0}, {"filename": "/data/bonuscontent/old_004_small.hoggy", "start": 90715, "end": 95507, "audio": 0}, {"filename": "/data/bonuscontent/old_005.hoggy", "start": 95507, "end": 101990, "audio": 0}, {"filename": "/data/bonuscontent/old_005_small.hoggy", "start": 101990, "end": 109282, "audio": 0}, {"filename": "/data/bonuscontent/old_006.hoggy", "start": 109282, "end": 115553, "audio": 0}, {"filename": "/data/bonuscontent/old_006_small.hoggy", "start": 115553, "end": 123245, "audio": 0}, {"filename": "/data/bonuscontent/old_007.hoggy", "start": 123245, "end": 127210, "audio": 0}, {"filename": "/data/bonuscontent/old_007_small.hoggy", "start": 127210, "end": 132409, "audio": 0}, {"filename": "/data/bonuscontent/old_008.hoggy", "start": 132409, "end": 136844, "audio": 0}, {"filename": "/data/bonuscontent/old_008_small.hoggy", "start": 136844, "end": 141287, "audio": 0}, {"filename": "/data/bonuscontent/old_009.hoggy", "start": 141287, "end": 146575, "audio": 0}, {"filename": "/data/bonuscontent/old_009_small.hoggy", "start": 146575, "end": 152677, "audio": 0}, {"filename": "/data/bonuscontent/old_010.hoggy", "start": 152677, "end": 156659, "audio": 0}, {"filename": "/data/bonuscontent/old_010_small.hoggy", "start": 156659, "end": 161455, "audio": 0}, {"filename": "/data/bonuscontent/old_011.hoggy", "start": 161455, "end": 169038, "audio": 0}, {"filename": "/data/bonuscontent/old_011_small.hoggy", "start": 169038, "end": 177865, "audio": 0}, {"filename": "/data/bonuscontent/old_012.hoggy", "start": 177865, "end": 181793, "audio": 0}, {"filename": "/data/bonuscontent/old_012_small.hoggy", "start": 181793, "end": 185729, "audio": 0}, {"filename": "/data/bonuscontent/old_013.hoggy", "start": 185729, "end": 189321, "audio": 0}, {"filename": "/data/bonuscontent/old_013_small.hoggy", "start": 189321, "end": 192921, "audio": 0}, {"filename": "/data/bonuscontent/old_014.hoggy", "start": 192921, "end": 196845, "audio": 0}, {"filename": "/data/bonuscontent/old_014_small.hoggy", "start": 196845, "end": 200777, "audio": 0}, {"filename": "/data/bonuscontent/old_015.hoggy", "start": 200777, "end": 204848, "audio": 0}, {"filename": "/data/bonuscontent/old_015_small.hoggy", "start": 204848, "end": 209729, "audio": 0}, {"filename": "/data/bonuscontent/old_016.hoggy", "start": 209729, "end": 213176, "audio": 0}, {"filename": "/data/bonuscontent/old_016_small.hoggy", "start": 213176, "end": 216631, "audio": 0}, {"filename": "/data/bonuscontent/old_017.hoggy", "start": 216631, "end": 221071, "audio": 0}, {"filename": "/data/bonuscontent/old_017_small.hoggy", "start": 221071, "end": 225518, "audio": 0}, {"filename": "/data/bonuscontent/old_018.hoggy", "start": 225518, "end": 231181, "audio": 0}, {"filename": "/data/bonuscontent/old_018_small.hoggy", "start": 231181, "end": 238265, "audio": 0}, {"filename": "/data/bonuscontent/old_019.hoggy", "start": 238265, "end": 242663, "audio": 0}, {"filename": "/data/bonuscontent/old_019_small.hoggy", "start": 242663, "end": 247694, "audio": 0}, {"filename": "/data/bonuscontent/old_020.hoggy", "start": 247694, "end": 251629, "audio": 0}, {"filename": "/data/bonuscontent/old_020_small.hoggy", "start": 251629, "end": 255572, "audio": 0}, {"filename": "/data/bonuscontent/old_021.hoggy", "start": 255572, "end": 259496, "audio": 0}, {"filename": "/data/bonuscontent/old_021_small.hoggy", "start": 259496, "end": 264230, "audio": 0}, {"filename": "/data/bonuscontent/old_022.hoggy", "start": 264230, "end": 267472, "audio": 0}, {"filename": "/data/bonuscontent/old_022_small.hoggy", "start": 267472, "end": 270726, "audio": 0}, {"filename": "/data/bonuscontent/old_023.hoggy", "start": 270726, "end": 274445, "audio": 0}, {"filename": "/data/bonuscontent/old_023_small.hoggy", "start": 274445, "end": 278978, "audio": 0}, {"filename": "/data/bonuscontent/old_024.hoggy", "start": 278978, "end": 283035, "audio": 0}, {"filename": "/data/bonuscontent/old_024_small.hoggy", "start": 283035, "end": 287100, "audio": 0}, {"filename": "/data/bonuscontent/old_025.hoggy", "start": 287100, "end": 291214, "audio": 0}, {"filename": "/data/bonuscontent/old_025_small.hoggy", "start": 291214, "end": 295340, "audio": 0}, {"filename": "/data/bonuscontent/old_026.hoggy", "start": 295340, "end": 300587, "audio": 0}, {"filename": "/data/bonuscontent/old_026_small.hoggy", "start": 300587, "end": 305842, "audio": 0}, {"filename": "/data/bonuscontent/old_027.hoggy", "start": 305842, "end": 312772, "audio": 0}, {"filename": "/data/bonuscontent/old_027_small.hoggy", "start": 312772, "end": 321734, "audio": 0}, {"filename": "/data/bonuscontent/old_028.hoggy", "start": 321734, "end": 329487, "audio": 0}, {"filename": "/data/bonuscontent/old_028_small.hoggy", "start": 329487, "end": 340494, "audio": 0}, {"filename": "/data/bonuscontent/old_029.hoggy", "start": 340494, "end": 347838, "audio": 0}, {"filename": "/data/bonuscontent/old_029_small.hoggy", "start": 347838, "end": 355815, "audio": 0}, {"filename": "/data/bonuscontent/old_030.hoggy", "start": 355815, "end": 359129, "audio": 0}, {"filename": "/data/bonuscontent/old_030_small.hoggy", "start": 359129, "end": 362455, "audio": 0}, {"filename": "/data/bonuscontent/old_031.hoggy", "start": 362455, "end": 366115, "audio": 0}, {"filename": "/data/bonuscontent/old_031_small.hoggy", "start": 366115, "end": 369783, "audio": 0}, {"filename": "/data/bonuscontent/old_032.hoggy", "start": 369783, "end": 373475, "audio": 0}, {"filename": "/data/bonuscontent/old_032_small.hoggy", "start": 373475, "end": 378592, "audio": 0}, {"filename": "/data/bonuscontent/old_033.hoggy", "start": 378592, "end": 385922, "audio": 0}, {"filename": "/data/bonuscontent/old_033_small.hoggy", "start": 385922, "end": 393642, "audio": 0}, {"filename": "/data/bonuscontent/old_034.hoggy", "start": 393642, "end": 398844, "audio": 0}, {"filename": "/data/bonuscontent/old_034_small.hoggy", "start": 398844, "end": 404054, "audio": 0}, {"filename": "/data/bonuscontent/old_035.hoggy", "start": 404054, "end": 407739, "audio": 0}, {"filename": "/data/bonuscontent/old_035_small.hoggy", "start": 407739, "end": 411436, "audio": 0}, {"filename": "/data/bonuscontent/old_036.hoggy", "start": 411436, "end": 415503, "audio": 0}, {"filename": "/data/bonuscontent/old_036_small.hoggy", "start": 415503, "end": 419582, "audio": 0}, {"filename": "/data/bonuscontent/old_037.hoggy", "start": 419582, "end": 423653, "audio": 0}, {"filename": "/data/bonuscontent/old_037_small.hoggy", "start": 423653, "end": 427732, "audio": 0}, {"filename": "/data/bonuscontent/old_038.hoggy", "start": 427732, "end": 433555, "audio": 0}, {"filename": "/data/bonuscontent/old_038_small.hoggy", "start": 433555, "end": 440187, "audio": 0}, {"filename": "/data/bonuscontent/old_039.hoggy", "start": 440187, "end": 457146, "audio": 0}, {"filename": "/data/bonuscontent/old_039_small.hoggy", "start": 457146, "end": 474111, "audio": 0}, {"filename": "/data/bonuscontent/old_040.hoggy", "start": 474111, "end": 494577, "audio": 0}, {"filename": "/data/bonuscontent/old_040_small.hoggy", "start": 494577, "end": 515050, "audio": 0}, {"filename": "/data/levels/aaa_258.hoggy", "start": 515050, "end": 520432, "audio": 0}, {"filename": "/data/levels/aaa_258_small.hoggy", "start": 520432, "end": 525822, "audio": 0}, {"filename": "/data/levels/aaa_26.hoggy", "start": 525822, "end": 531898, "audio": 0}, {"filename": "/data/levels/aaa_26_small.hoggy", "start": 531898, "end": 537981, "audio": 0}, {"filename": "/data/levels/aaa_300.hoggy", "start": 537981, "end": 541672, "audio": 0}, {"filename": "/data/levels/aaa_300_small.hoggy", "start": 541672, "end": 545371, "audio": 0}, {"filename": "/data/levels/aaa_301.hoggy", "start": 545371, "end": 548982, "audio": 0}, {"filename": "/data/levels/aaa_301_small.hoggy", "start": 548982, "end": 552605, "audio": 0}, {"filename": "/data/levels/aaa_302.hoggy", "start": 552605, "end": 557592, "audio": 0}, {"filename": "/data/levels/aaa_302_small.hoggy", "start": 557592, "end": 562989, "audio": 0}, {"filename": "/data/levels/aaa_303.hoggy", "start": 562989, "end": 566464, "audio": 0}, {"filename": "/data/levels/aaa_303_small.hoggy", "start": 566464, "end": 569947, "audio": 0}, {"filename": "/data/levels/aaa_304.hoggy", "start": 569947, "end": 573958, "audio": 0}, {"filename": "/data/levels/aaa_304_small.hoggy", "start": 573958, "end": 577773, "audio": 0}, {"filename": "/data/levels/aaa_305.hoggy", "start": 577773, "end": 581665, "audio": 0}, {"filename": "/data/levels/aaa_305_small.hoggy", "start": 581665, "end": 586329, "audio": 0}, {"filename": "/data/levels/aaa_306.hoggy", "start": 586329, "end": 590923, "audio": 0}, {"filename": "/data/levels/aaa_306_small.hoggy", "start": 590923, "end": 595525, "audio": 0}, {"filename": "/data/levels/aaa_307.hoggy", "start": 595525, "end": 599208, "audio": 0}, {"filename": "/data/levels/aaa_307_small.hoggy", "start": 599208, "end": 603076, "audio": 0}, {"filename": "/data/levels/aaa_308.hoggy", "start": 603076, "end": 609583, "audio": 0}, {"filename": "/data/levels/aaa_308_small.hoggy", "start": 609583, "end": 618130, "audio": 0}, {"filename": "/data/levels/aaa_309.hoggy", "start": 618130, "end": 622140, "audio": 0}, {"filename": "/data/levels/aaa_309_small.hoggy", "start": 622140, "end": 626022, "audio": 0}, {"filename": "/data/levels/aaa_310.hoggy", "start": 626022, "end": 633816, "audio": 0}, {"filename": "/data/levels/aaa_310_small.hoggy", "start": 633816, "end": 642657, "audio": 0}, {"filename": "/data/levels/aaa_311.hoggy", "start": 642657, "end": 648884, "audio": 0}, {"filename": "/data/levels/aaa_311_small.hoggy", "start": 648884, "end": 655123, "audio": 0}, {"filename": "/data/levels/aaa_312.hoggy", "start": 655123, "end": 661148, "audio": 0}, {"filename": "/data/levels/aaa_312_small.hoggy", "start": 661148, "end": 667109, "audio": 0}, {"filename": "/data/levels/aaa_314.hoggy", "start": 667109, "end": 671709, "audio": 0}, {"filename": "/data/levels/aaa_314_small.hoggy", "start": 671709, "end": 676316, "audio": 0}, {"filename": "/data/levels/aaa_315.hoggy", "start": 676316, "end": 679815, "audio": 0}, {"filename": "/data/levels/aaa_315_small.hoggy", "start": 679815, "end": 683322, "audio": 0}, {"filename": "/data/levels/aaa_316.hoggy", "start": 683322, "end": 689405, "audio": 0}, {"filename": "/data/levels/aaa_316_small.hoggy", "start": 689405, "end": 695500, "audio": 0}, {"filename": "/data/levels/aaa_317.hoggy", "start": 695500, "end": 699676, "audio": 0}, {"filename": "/data/levels/aaa_317_small.hoggy", "start": 699676, "end": 704954, "audio": 0}, {"filename": "/data/levels/aaa_318.hoggy", "start": 704954, "end": 709746, "audio": 0}, {"filename": "/data/levels/aaa_318_small.hoggy", "start": 709746, "end": 714546, "audio": 0}, {"filename": "/data/levels/aaa_319.hoggy", "start": 714546, "end": 719928, "audio": 0}, {"filename": "/data/levels/aaa_319_small.hoggy", "start": 719928, "end": 725318, "audio": 0}, {"filename": "/data/levels/aaa_320.hoggy", "start": 725318, "end": 730061, "audio": 0}, {"filename": "/data/levels/aaa_320_small.hoggy", "start": 730061, "end": 734812, "audio": 0}, {"filename": "/data/levels/aaa_321.hoggy", "start": 734812, "end": 751006, "audio": 0}, {"filename": "/data/levels/aaa_321_small.hoggy", "start": 751006, "end": 767603, "audio": 0}, {"filename": "/data/levels/aaa_322.hoggy", "start": 767603, "end": 772109, "audio": 0}, {"filename": "/data/levels/aaa_322_small.hoggy", "start": 772109, "end": 777425, "audio": 0}, {"filename": "/data/levels/aaa_323.hoggy", "start": 777425, "end": 782698, "audio": 0}, {"filename": "/data/levels/aaa_323_small.hoggy", "start": 782698, "end": 787983, "audio": 0}, {"filename": "/data/levels/aaa_324.hoggy", "start": 787983, "end": 798647, "audio": 0}, {"filename": "/data/levels/aaa_324_small.hoggy", "start": 798647, "end": 809331, "audio": 0}, {"filename": "/data/levels/aaa_325.hoggy", "start": 809331, "end": 813940, "audio": 0}, {"filename": "/data/levels/aaa_325_small.hoggy", "start": 813940, "end": 818557, "audio": 0}, {"filename": "/data/levels/aaa_326.hoggy", "start": 818557, "end": 835189, "audio": 0}, {"filename": "/data/levels/aaa_326_small.hoggy", "start": 835189, "end": 851635, "audio": 0}, {"filename": "/data/levels/aaa_327.hoggy", "start": 851635, "end": 856434, "audio": 0}, {"filename": "/data/levels/aaa_327_small.hoggy", "start": 856434, "end": 861241, "audio": 0}, {"filename": "/data/levels/aaa_328.hoggy", "start": 861241, "end": 864930, "audio": 0}, {"filename": "/data/levels/aaa_328_small.hoggy", "start": 864930, "end": 868656, "audio": 0}, {"filename": "/data/levels/aaa_e01.hoggy", "start": 868656, "end": 872587, "audio": 0}, {"filename": "/data/levels/aaa_e01_small.hoggy", "start": 872587, "end": 876526, "audio": 0}, {"filename": "/data/levels/aaa_e02.hoggy", "start": 876526, "end": 880873, "audio": 0}, {"filename": "/data/levels/aaa_e02_small.hoggy", "start": 880873, "end": 885094, "audio": 0}, {"filename": "/data/levels/aaa_e03.hoggy", "start": 885094, "end": 889591, "audio": 0}, {"filename": "/data/levels/aaa_e03_small.hoggy", "start": 889591, "end": 894096, "audio": 0}, {"filename": "/data/levels/aaa_e04.hoggy", "start": 894096, "end": 898470, "audio": 0}, {"filename": "/data/levels/aaa_e04_small.hoggy", "start": 898470, "end": 902655, "audio": 0}, {"filename": "/data/levels/aaa_e05.hoggy", "start": 902655, "end": 907425, "audio": 0}, {"filename": "/data/levels/aaa_e05_small.hoggy", "start": 907425, "end": 912379, "audio": 0}, {"filename": "/data/levels/aaa_e06.hoggy", "start": 912379, "end": 920706, "audio": 0}, {"filename": "/data/levels/aaa_e06_small.hoggy", "start": 920706, "end": 929246, "audio": 0}, {"filename": "/data/levels/aaa_e07.hoggy", "start": 929246, "end": 938550, "audio": 0}, {"filename": "/data/levels/aaa_e07_small.hoggy", "start": 938550, "end": 947980, "audio": 0}, {"filename": "/data/levels/aaa_e08.hoggy", "start": 947980, "end": 951917, "audio": 0}, {"filename": "/data/levels/aaa_e08_small.hoggy", "start": 951917, "end": 955578, "audio": 0}, {"filename": "/data/levels/aaa_e09.hoggy", "start": 955578, "end": 959249, "audio": 0}, {"filename": "/data/levels/aaa_e09_small.hoggy", "start": 959249, "end": 962948, "audio": 0}, {"filename": "/data/levels/aaa_e10.hoggy", "start": 962948, "end": 966349, "audio": 0}, {"filename": "/data/levels/aaa_e10_small.hoggy", "start": 966349, "end": 969832, "audio": 0}, {"filename": "/data/levels/aaa_e11.hoggy", "start": 969832, "end": 975091, "audio": 0}, {"filename": "/data/levels/aaa_e11_small.hoggy", "start": 975091, "end": 980358, "audio": 0}, {"filename": "/data/levels/aaa_e12.hoggy", "start": 980358, "end": 987262, "audio": 0}, {"filename": "/data/levels/aaa_e12_small.hoggy", "start": 987262, "end": 994984, "audio": 0}, {"filename": "/data/levels/aaa_e13.hoggy", "start": 994984, "end": 1000356, "audio": 0}, {"filename": "/data/levels/aaa_e13_small.hoggy", "start": 1000356, "end": 1005746, "audio": 0}, {"filename": "/data/levels/aaa_e14.hoggy", "start": 1005746, "end": 1009551, "audio": 0}, {"filename": "/data/levels/aaa_e14_small.hoggy", "start": 1009551, "end": 1013374, "audio": 0}, {"filename": "/data/levels/aaa_e15.hoggy", "start": 1013374, "end": 1016863, "audio": 0}, {"filename": "/data/levels/aaa_e15_small.hoggy", "start": 1016863, "end": 1020370, "audio": 0}, {"filename": "/data/levels/aaa_e16.hoggy", "start": 1020370, "end": 1024646, "audio": 0}, {"filename": "/data/levels/aaa_e16_small.hoggy", "start": 1024646, "end": 1028942, "audio": 0}, {"filename": "/data/levels/aaa_e17.hoggy", "start": 1028942, "end": 1036004, "audio": 0}, {"filename": "/data/levels/aaa_e17_small.hoggy", "start": 1036004, "end": 1043484, "audio": 0}, {"filename": "/data/levels/aaa_e18.hoggy", "start": 1043484, "end": 1051980, "audio": 0}, {"filename": "/data/levels/aaa_e18_small.hoggy", "start": 1051980, "end": 1060552, "audio": 0}, {"filename": "/data/levels/aaa_e19.hoggy", "start": 1060552, "end": 1065779, "audio": 0}, {"filename": "/data/levels/aaa_e19_small.hoggy", "start": 1065779, "end": 1070942, "audio": 0}, {"filename": "/data/levels/aaa_e20.hoggy", "start": 1070942, "end": 1077808, "audio": 0}, {"filename": "/data/levels/aaa_e20_small.hoggy", "start": 1077808, "end": 1085214, "audio": 0}, {"filename": "/data/levels/aaa_e21.hoggy", "start": 1085214, "end": 1090122, "audio": 0}, {"filename": "/data/levels/aaa_e21_small.hoggy", "start": 1090122, "end": 1095038, "audio": 0}, {"filename": "/data/levels/aaa_e22.hoggy", "start": 1095038, "end": 1099454, "audio": 0}, {"filename": "/data/levels/aaa_e22_small.hoggy", "start": 1099454, "end": 1103882, "audio": 0}, {"filename": "/data/levels/aaa_e23.hoggy", "start": 1103882, "end": 1109848, "audio": 0}, {"filename": "/data/levels/aaa_e23_small.hoggy", "start": 1109848, "end": 1115822, "audio": 0}, {"filename": "/data/levels/aaa_e24.hoggy", "start": 1115822, "end": 1122144, "audio": 0}, {"filename": "/data/levels/aaa_e24_small.hoggy", "start": 1122144, "end": 1128855, "audio": 0}, {"filename": "/data/levels/aaa_e25.hoggy", "start": 1128855, "end": 1135485, "audio": 0}, {"filename": "/data/levels/aaa_e25_small.hoggy", "start": 1135485, "end": 1142413, "audio": 0}, {"filename": "/data/levels/aaa_e26.hoggy", "start": 1142413, "end": 1146857, "audio": 0}, {"filename": "/data/levels/aaa_e26_small.hoggy", "start": 1146857, "end": 1152111, "audio": 0}, {"filename": "/data/levels/aaa_e27.hoggy", "start": 1152111, "end": 1156343, "audio": 0}, {"filename": "/data/levels/aaa_e27_small.hoggy", "start": 1156343, "end": 1160591, "audio": 0}, {"filename": "/data/levels/aaa_e28.hoggy", "start": 1160591, "end": 1165666, "audio": 0}, {"filename": "/data/levels/aaa_e28_small.hoggy", "start": 1165666, "end": 1170749, "audio": 0}, {"filename": "/data/levels/aaa_e29.hoggy", "start": 1170749, "end": 1181163, "audio": 0}, {"filename": "/data/levels/aaa_e29_small.hoggy", "start": 1181163, "end": 1192781, "audio": 0}, {"filename": "/data/levels/aaa_e30.hoggy", "start": 1192781, "end": 1196704, "audio": 0}, {"filename": "/data/levels/aaa_e30_small.hoggy", "start": 1196704, "end": 1200635, "audio": 0}, {"filename": "/data/levels/aaa_e31.hoggy", "start": 1200635, "end": 1205005, "audio": 0}, {"filename": "/data/levels/aaa_e31_small.hoggy", "start": 1205005, "end": 1210189, "audio": 0}, {"filename": "/data/levels/aaa_e32.hoggy", "start": 1210189, "end": 1221542, "audio": 0}, {"filename": "/data/levels/aaa_e32_small.hoggy", "start": 1221542, "end": 1232971, "audio": 0}, {"filename": "/data/levels/aaa_e33.hoggy", "start": 1232971, "end": 1237410, "audio": 0}, {"filename": "/data/levels/aaa_e33_small.hoggy", "start": 1237410, "end": 1241867, "audio": 0}, {"filename": "/data/levels/aaa_e34.hoggy", "start": 1241867, "end": 1246394, "audio": 0}, {"filename": "/data/levels/aaa_e34_small.hoggy", "start": 1246394, "end": 1252696, "audio": 0}, {"filename": "/data/levels/aaa_e35.hoggy", "start": 1252696, "end": 1258485, "audio": 0}, {"filename": "/data/levels/aaa_e35_small.hoggy", "start": 1258485, "end": 1264287, "audio": 0}, {"filename": "/data/levels/aaa_e36.hoggy", "start": 1264287, "end": 1272108, "audio": 0}, {"filename": "/data/levels/aaa_e36_small.hoggy", "start": 1272108, "end": 1279937, "audio": 0}, {"filename": "/data/levels/aaa_e37.hoggy", "start": 1279937, "end": 1289376, "audio": 0}, {"filename": "/data/levels/aaa_e38.hoggy", "start": 1289376, "end": 1293457, "audio": 0}, {"filename": "/data/levels/aaa_e38_small.hoggy", "start": 1293457, "end": 1298348, "audio": 0}, {"filename": "/data/levels/aaa_e39.hoggy", "start": 1298348, "end": 1304251, "audio": 0}, {"filename": "/data/levels/aaa_e39_small.hoggy", "start": 1304251, "end": 1310976, "audio": 0}, {"filename": "/data/levels/aaa_e40.hoggy", "start": 1310976, "end": 1315187, "audio": 0}, {"filename": "/data/levels/aaa_e40_small.hoggy", "start": 1315187, "end": 1319430, "audio": 0}, {"filename": "/data/levels/aaa_e41.hoggy", "start": 1319430, "end": 1324102, "audio": 0}, {"filename": "/data/levels/aaa_e41_small.hoggy", "start": 1324102, "end": 1329558, "audio": 0}, {"filename": "/data/levels/aaa_e42.hoggy", "start": 1329558, "end": 1334326, "audio": 0}, {"filename": "/data/levels/aaa_e42_small.hoggy", "start": 1334326, "end": 1339102, "audio": 0}, {"filename": "/data/levels/aaa_e43.hoggy", "start": 1339102, "end": 1343374, "audio": 0}, {"filename": "/data/levels/aaa_e43_small.hoggy", "start": 1343374, "end": 1347652, "audio": 0}, {"filename": "/data/levels/aaa_e44.hoggy", "start": 1347652, "end": 1353262, "audio": 0}, {"filename": "/data/levels/aaa_e44_small.hoggy", "start": 1353262, "end": 1358592, "audio": 0}, {"filename": "/data/levels/aaa_e45.hoggy", "start": 1358592, "end": 1362475, "audio": 0}, {"filename": "/data/levels/aaa_e45_small.hoggy", "start": 1362475, "end": 1367139, "audio": 0}, {"filename": "/data/levels/aaa_e46.hoggy", "start": 1367139, "end": 1372231, "audio": 0}, {"filename": "/data/levels/aaa_e46_small.hoggy", "start": 1372231, "end": 1378657, "audio": 0}, {"filename": "/data/levels/aaa_e47.hoggy", "start": 1378657, "end": 1390206, "audio": 0}, {"filename": "/data/levels/aaa_e47_small.hoggy", "start": 1390206, "end": 1402436, "audio": 0}, {"filename": "/data/levels/aaa_e48.hoggy", "start": 1402436, "end": 1407496, "audio": 0}, {"filename": "/data/levels/aaa_e48_small.hoggy", "start": 1407496, "end": 1412563, "audio": 0}, {"filename": "/data/levels/aaa_e49.hoggy", "start": 1412563, "end": 1418584, "audio": 0}, {"filename": "/data/levels/aaa_e49_small.hoggy", "start": 1418584, "end": 1424509, "audio": 0}, {"filename": "/data/levels/aaa_e50.hoggy", "start": 1424509, "end": 1428918, "audio": 0}, {"filename": "/data/levels/aaa_e50_small.hoggy", "start": 1428918, "end": 1433635, "audio": 0}, {"filename": "/data/levels/aaa_e51.hoggy", "start": 1433635, "end": 1438468, "audio": 0}, {"filename": "/data/levels/aaa_e51_small.hoggy", "start": 1438468, "end": 1443321, "audio": 0}, {"filename": "/data/levels/aaa_e52.hoggy", "start": 1443321, "end": 1447529, "audio": 0}, {"filename": "/data/levels/aaa_e52_small.hoggy", "start": 1447529, "end": 1451745, "audio": 0}, {"filename": "/data/levels/aaa_e53.hoggy", "start": 1451745, "end": 1456774, "audio": 0}, {"filename": "/data/levels/aaa_e53_small.hoggy", "start": 1456774, "end": 1461930, "audio": 0}, {"filename": "/data/levels/aaa_e54.hoggy", "start": 1461930, "end": 1470083, "audio": 0}, {"filename": "/data/levels/aaa_e54_small.hoggy", "start": 1470083, "end": 1480268, "audio": 0}, {"filename": "/data/levels/aaa_e55.hoggy", "start": 1480268, "end": 1483916, "audio": 0}, {"filename": "/data/levels/aaa_e55_small.hoggy", "start": 1483916, "end": 1490219, "audio": 0}, {"filename": "/data/levels/aaa_e56.hoggy", "start": 1490219, "end": 1494565, "audio": 0}, {"filename": "/data/levels/aaa_e56_small.hoggy", "start": 1494565, "end": 1498919, "audio": 0}, {"filename": "/data/levels/aaa_h01.hoggy", "start": 1498919, "end": 1503821, "audio": 0}, {"filename": "/data/levels/aaa_h01_small.hoggy", "start": 1503821, "end": 1508605, "audio": 0}, {"filename": "/data/levels/aaa_h02.hoggy", "start": 1508605, "end": 1514231, "audio": 0}, {"filename": "/data/levels/aaa_h02_small.hoggy", "start": 1514231, "end": 1519881, "audio": 0}, {"filename": "/data/levels/aaa_h03.hoggy", "start": 1519881, "end": 1524317, "audio": 0}, {"filename": "/data/levels/aaa_h03_small.hoggy", "start": 1524317, "end": 1528761, "audio": 0}, {"filename": "/data/levels/aaa_h04.hoggy", "start": 1528761, "end": 1532924, "audio": 0}, {"filename": "/data/levels/aaa_h04_small.hoggy", "start": 1532924, "end": 1537099, "audio": 0}, {"filename": "/data/levels/aaa_h05.hoggy", "start": 1537099, "end": 1541153, "audio": 0}, {"filename": "/data/levels/aaa_h05_small.hoggy", "start": 1541153, "end": 1545227, "audio": 0}, {"filename": "/data/levels/aaa_h06.hoggy", "start": 1545227, "end": 1550213, "audio": 0}, {"filename": "/data/levels/aaa_h06_small.hoggy", "start": 1550213, "end": 1555067, "audio": 0}, {"filename": "/data/levels/aaa_h07.hoggy", "start": 1555067, "end": 1560490, "audio": 0}, {"filename": "/data/levels/aaa_h07_small.hoggy", "start": 1560490, "end": 1566067, "audio": 0}, {"filename": "/data/levels/aaa_h08.hoggy", "start": 1566067, "end": 1577116, "audio": 0}, {"filename": "/data/levels/aaa_h08_small.hoggy", "start": 1577116, "end": 1588311, "audio": 0}, {"filename": "/data/levels/aaa_h09.hoggy", "start": 1588311, "end": 1596772, "audio": 0}, {"filename": "/data/levels/aaa_h09_small.hoggy", "start": 1596772, "end": 1605249, "audio": 0}, {"filename": "/data/levels/aaa_h10.hoggy", "start": 1605249, "end": 1609405, "audio": 0}, {"filename": "/data/levels/aaa_h10_small.hoggy", "start": 1609405, "end": 1613569, "audio": 0}, {"filename": "/data/levels/aaa_h11.hoggy", "start": 1613569, "end": 1621283, "audio": 0}, {"filename": "/data/levels/aaa_h11_small.hoggy", "start": 1621283, "end": 1629005, "audio": 0}, {"filename": "/data/levels/aaa_h12.hoggy", "start": 1629005, "end": 1633864, "audio": 0}, {"filename": "/data/levels/aaa_h12_small.hoggy", "start": 1633864, "end": 1638735, "audio": 0}, {"filename": "/data/levels/aaa_h13.hoggy", "start": 1638735, "end": 1643397, "audio": 0}, {"filename": "/data/levels/aaa_h13_small.hoggy", "start": 1643397, "end": 1648871, "audio": 0}, {"filename": "/data/levels/aaa_h14.hoggy", "start": 1648871, "end": 1652967, "audio": 0}, {"filename": "/data/levels/aaa_h14_small.hoggy", "start": 1652967, "end": 1657002, "audio": 0}, {"filename": "/data/levels/aaa_h15.hoggy", "start": 1657002, "end": 1667121, "audio": 0}, {"filename": "/data/levels/aaa_h15_small.hoggy", "start": 1667121, "end": 1677264, "audio": 0}, {"filename": "/data/levels/aaa_h16.hoggy", "start": 1677264, "end": 1682494, "audio": 0}, {"filename": "/data/levels/aaa_h16_small.hoggy", "start": 1682494, "end": 1687740, "audio": 0}, {"filename": "/data/levels/aaa_h17.hoggy", "start": 1687740, "end": 1692228, "audio": 0}, {"filename": "/data/levels/aaa_h17_small.hoggy", "start": 1692228, "end": 1696579, "audio": 0}, {"filename": "/data/levels/aaa_h18.hoggy", "start": 1696579, "end": 1705584, "audio": 0}, {"filename": "/data/levels/aaa_h18_small.hoggy", "start": 1705584, "end": 1714630, "audio": 0}, {"filename": "/data/levels/aaa_h19.hoggy", "start": 1714630, "end": 1719096, "audio": 0}, {"filename": "/data/levels/aaa_h19_small.hoggy", "start": 1719096, "end": 1723578, "audio": 0}, {"filename": "/data/levels/aaa_h20.hoggy", "start": 1723578, "end": 1727838, "audio": 0}, {"filename": "/data/levels/aaa_h20_small.hoggy", "start": 1727838, "end": 1732034, "audio": 0}, {"filename": "/data/levels/aaa_h21.hoggy", "start": 1732034, "end": 1736106, "audio": 0}, {"filename": "/data/levels/aaa_h21_small.hoggy", "start": 1736106, "end": 1740193, "audio": 0}, {"filename": "/data/levels/aaa_h22.hoggy", "start": 1740193, "end": 1750181, "audio": 0}, {"filename": "/data/levels/aaa_h22_small.hoggy", "start": 1750181, "end": 1760671, "audio": 0}, {"filename": "/data/levels/aaa_h23.hoggy", "start": 1760671, "end": 1764169, "audio": 0}, {"filename": "/data/levels/aaa_h23_small.hoggy", "start": 1764169, "end": 1767690, "audio": 0}, {"filename": "/data/levels/aaa_h24.hoggy", "start": 1767690, "end": 1771512, "audio": 0}, {"filename": "/data/levels/aaa_h24_small.hoggy", "start": 1771512, "end": 1775278, "audio": 0}, {"filename": "/data/levels/aaa_h25.hoggy", "start": 1775278, "end": 1778959, "audio": 0}, {"filename": "/data/levels/aaa_h25_small.hoggy", "start": 1778959, "end": 1782825, "audio": 0}, {"filename": "/data/levels/aaa_h26.hoggy", "start": 1782825, "end": 1786164, "audio": 0}, {"filename": "/data/levels/aaa_h26_small.hoggy", "start": 1786164, "end": 1789511, "audio": 0}, {"filename": "/data/levels/aaa_h27.hoggy", "start": 1789511, "end": 1793522, "audio": 0}, {"filename": "/data/levels/aaa_h27_small.hoggy", "start": 1793522, "end": 1797557, "audio": 0}, {"filename": "/data/levels/aaa_h28.hoggy", "start": 1797557, "end": 1802703, "audio": 0}, {"filename": "/data/levels/aaa_h28_small.hoggy", "start": 1802703, "end": 1807649, "audio": 0}, {"filename": "/data/levels/aaa_h29.hoggy", "start": 1807649, "end": 1811996, "audio": 0}, {"filename": "/data/levels/aaa_h29_small.hoggy", "start": 1811996, "end": 1816359, "audio": 0}, {"filename": "/data/levels/aaa_h30.hoggy", "start": 1816359, "end": 1819960, "audio": 0}, {"filename": "/data/levels/aaa_h30_small.hoggy", "start": 1819960, "end": 1823577, "audio": 0}, {"filename": "/data/levels/aaa_h31.hoggy", "start": 1823577, "end": 1830536, "audio": 0}, {"filename": "/data/levels/aaa_h31_small.hoggy", "start": 1830536, "end": 1837563, "audio": 0}, {"filename": "/data/levels/aaa_h32.hoggy", "start": 1837563, "end": 1841977, "audio": 0}, {"filename": "/data/levels/aaa_h32_small.hoggy", "start": 1841977, "end": 1846259, "audio": 0}, {"filename": "/data/levels/aaa_h33.hoggy", "start": 1846259, "end": 1851701, "audio": 0}, {"filename": "/data/levels/aaa_h33_small.hoggy", "start": 1851701, "end": 1858374, "audio": 0}, {"filename": "/data/levels/aaa_h34.hoggy", "start": 1858374, "end": 1862083, "audio": 0}, {"filename": "/data/levels/aaa_h34_small.hoggy", "start": 1862083, "end": 1865800, "audio": 0}, {"filename": "/data/levels/aaa_h35.hoggy", "start": 1865800, "end": 1870310, "audio": 0}, {"filename": "/data/levels/aaa_h35_small.hoggy", "start": 1870310, "end": 1874832, "audio": 0}, {"filename": "/data/levels/aaa_h36.hoggy", "start": 1874832, "end": 1879145, "audio": 0}, {"filename": "/data/levels/aaa_h36_small.hoggy", "start": 1879145, "end": 1883158, "audio": 0}, {"filename": "/data/levels/aaa_h37.hoggy", "start": 1883158, "end": 1887052, "audio": 0}, {"filename": "/data/levels/aaa_h37_small.hoggy", "start": 1887052, "end": 1890954, "audio": 0}, {"filename": "/data/levels/aaa_h38.hoggy", "start": 1890954, "end": 1896384, "audio": 0}, {"filename": "/data/levels/aaa_h38_small.hoggy", "start": 1896384, "end": 1902585, "audio": 0}, {"filename": "/data/levels/aaa_h39.hoggy", "start": 1902585, "end": 1909217, "audio": 0}, {"filename": "/data/levels/aaa_h39_small.hoggy", "start": 1909217, "end": 1917720, "audio": 0}, {"filename": "/data/levels/aaa_insane.hoggy", "start": 1917720, "end": 1938071, "audio": 0}, {"filename": "/data/levels/aaa_insane_small.hoggy", "start": 1938071, "end": 1958428, "audio": 0}, {"filename": "/data/levels/aaa_m01.hoggy", "start": 1958428, "end": 1969305, "audio": 0}, {"filename": "/data/levels/aaa_m01_small.hoggy", "start": 1969305, "end": 1982526, "audio": 0}, {"filename": "/data/levels/aaa_m02.hoggy", "start": 1982526, "end": 1987084, "audio": 0}, {"filename": "/data/levels/aaa_m02_small.hoggy", "start": 1987084, "end": 1991650, "audio": 0}, {"filename": "/data/levels/aaa_m03.hoggy", "start": 1991650, "end": 1995722, "audio": 0}, {"filename": "/data/levels/aaa_m03_small.hoggy", "start": 1995722, "end": 1999801, "audio": 0}, {"filename": "/data/levels/aaa_m04.hoggy", "start": 1999801, "end": 2005502, "audio": 0}, {"filename": "/data/levels/aaa_m04_small.hoggy", "start": 2005502, "end": 2012013, "audio": 0}, {"filename": "/data/levels/aaa_m05.hoggy", "start": 2012013, "end": 2019926, "audio": 0}, {"filename": "/data/levels/aaa_m05_small.hoggy", "start": 2019926, "end": 2027855, "audio": 0}, {"filename": "/data/levels/aaa_m06.hoggy", "start": 2027855, "end": 2033614, "audio": 0}, {"filename": "/data/levels/aaa_m06_small.hoggy", "start": 2033614, "end": 2039379, "audio": 0}, {"filename": "/data/levels/aaa_m07.hoggy", "start": 2039379, "end": 2043662, "audio": 0}, {"filename": "/data/levels/aaa_m07_small.hoggy", "start": 2043662, "end": 2049370, "audio": 0}, {"filename": "/data/levels/aaa_m08.hoggy", "start": 2049370, "end": 2057669, "audio": 0}, {"filename": "/data/levels/aaa_m08_small.hoggy", "start": 2057669, "end": 2065832, "audio": 0}, {"filename": "/data/levels/aaa_m09.hoggy", "start": 2065832, "end": 2069888, "audio": 0}, {"filename": "/data/levels/aaa_m09_small.hoggy", "start": 2069888, "end": 2073968, "audio": 0}, {"filename": "/data/levels/aaa_m10.hoggy", "start": 2073968, "end": 2078260, "audio": 0}, {"filename": "/data/levels/aaa_m10_small.hoggy", "start": 2078260, "end": 2082970, "audio": 0}, {"filename": "/data/levels/aaa_m11.hoggy", "start": 2082970, "end": 2087296, "audio": 0}, {"filename": "/data/levels/aaa_m11_small.hoggy", "start": 2087296, "end": 2091630, "audio": 0}, {"filename": "/data/levels/aaa_m12.hoggy", "start": 2091630, "end": 2102600, "audio": 0}, {"filename": "/data/levels/aaa_m12_small.hoggy", "start": 2102600, "end": 2114188, "audio": 0}, {"filename": "/data/levels/aaa_m13.hoggy", "start": 2114188, "end": 2118176, "audio": 0}, {"filename": "/data/levels/aaa_m13_small.hoggy", "start": 2118176, "end": 2122945, "audio": 0}, {"filename": "/data/levels/aaa_m14.hoggy", "start": 2122945, "end": 2127614, "audio": 0}, {"filename": "/data/levels/aaa_m14_small.hoggy", "start": 2127614, "end": 2132083, "audio": 0}, {"filename": "/data/levels/aaa_m15.hoggy", "start": 2132083, "end": 2136961, "audio": 0}, {"filename": "/data/levels/aaa_m15_small.hoggy", "start": 2136961, "end": 2141575, "audio": 0}, {"filename": "/data/levels/aaa_m16.hoggy", "start": 2141575, "end": 2148349, "audio": 0}, {"filename": "/data/levels/aaa_m16_small.hoggy", "start": 2148349, "end": 2155059, "audio": 0}, {"filename": "/data/levels/aaa_m17.hoggy", "start": 2155059, "end": 2159122, "audio": 0}, {"filename": "/data/levels/aaa_m17_small.hoggy", "start": 2159122, "end": 2163473, "audio": 0}, {"filename": "/data/levels/aaa_m18.hoggy", "start": 2163473, "end": 2169259, "audio": 0}, {"filename": "/data/levels/aaa_m18_small.hoggy", "start": 2169259, "end": 2175061, "audio": 0}, {"filename": "/data/levels/aaa_m19.hoggy", "start": 2175061, "end": 2179142, "audio": 0}, {"filename": "/data/levels/aaa_m19_small.hoggy", "start": 2179142, "end": 2184041, "audio": 0}, {"filename": "/data/levels/aaa_m20.hoggy", "start": 2184041, "end": 2190092, "audio": 0}, {"filename": "/data/levels/aaa_m20_small.hoggy", "start": 2190092, "end": 2196015, "audio": 0}, {"filename": "/data/levels/aaa_m21.hoggy", "start": 2196015, "end": 2200822, "audio": 0}, {"filename": "/data/levels/aaa_m21_small.hoggy", "start": 2200822, "end": 2205649, "audio": 0}, {"filename": "/data/levels/aaa_m22.hoggy", "start": 2205649, "end": 2215939, "audio": 0}, {"filename": "/data/levels/aaa_m22_small.hoggy", "start": 2215939, "end": 2226241, "audio": 0}, {"filename": "/data/levels/aaa_m23.hoggy", "start": 2226241, "end": 2230608, "audio": 0}, {"filename": "/data/levels/aaa_m23_small.hoggy", "start": 2230608, "end": 2234995, "audio": 0}, {"filename": "/data/levels/aaa_m24.hoggy", "start": 2234995, "end": 2238781, "audio": 0}, {"filename": "/data/levels/aaa_m24_small.hoggy", "start": 2238781, "end": 2242575, "audio": 0}, {"filename": "/data/levels/aaa_m25.hoggy", "start": 2242575, "end": 2246318, "audio": 0}, {"filename": "/data/levels/aaa_m25_small.hoggy", "start": 2246318, "end": 2250069, "audio": 0}, {"filename": "/data/levels/aaa_m26.hoggy", "start": 2250069, "end": 2255246, "audio": 0}, {"filename": "/data/levels/aaa_m26_small.hoggy", "start": 2255246, "end": 2261304, "audio": 0}, {"filename": "/data/levels/aaa_m27.hoggy", "start": 2261304, "end": 2266382, "audio": 0}, {"filename": "/data/levels/aaa_m27_small.hoggy", "start": 2266382, "end": 2272270, "audio": 0}, {"filename": "/data/levels/aaa_m28.hoggy", "start": 2272270, "end": 2278539, "audio": 0}, {"filename": "/data/levels/aaa_m28_small.hoggy", "start": 2278539, "end": 2285617, "audio": 0}, {"filename": "/data/levels/aaa_m29.hoggy", "start": 2285617, "end": 2289781, "audio": 0}, {"filename": "/data/levels/aaa_m29_small.hoggy", "start": 2289781, "end": 2293965, "audio": 0}, {"filename": "/data/levels/aaa_m30.hoggy", "start": 2293965, "end": 2300002, "audio": 0}, {"filename": "/data/levels/aaa_m30_small.hoggy", "start": 2300002, "end": 2306051, "audio": 0}, {"filename": "/data/levels/aaa_m31.hoggy", "start": 2306051, "end": 2311629, "audio": 0}, {"filename": "/data/levels/aaa_m31_small.hoggy", "start": 2311629, "end": 2317215, "audio": 0}, {"filename": "/data/levels/aaa_m32.hoggy", "start": 2317215, "end": 2321958, "audio": 0}, {"filename": "/data/levels/aaa_m32_small.hoggy", "start": 2321958, "end": 2326509, "audio": 0}, {"filename": "/data/levels/aaa_m33.hoggy", "start": 2326509, "end": 2330174, "audio": 0}, {"filename": "/data/levels/aaa_m33_small.hoggy", "start": 2330174, "end": 2333851, "audio": 0}, {"filename": "/data/levels/aaa_m34.hoggy", "start": 2333851, "end": 2340088, "audio": 0}, {"filename": "/data/levels/aaa_m34_small.hoggy", "start": 2340088, "end": 2346357, "audio": 0}, {"filename": "/data/levels/aaa_m35.hoggy", "start": 2346357, "end": 2350742, "audio": 0}, {"filename": "/data/levels/aaa_m35_small.hoggy", "start": 2350742, "end": 2355147, "audio": 0}, {"filename": "/data/levels/aaa_m36.hoggy", "start": 2355147, "end": 2363031, "audio": 0}, {"filename": "/data/levels/aaa_m36_small.hoggy", "start": 2363031, "end": 2370923, "audio": 0}, {"filename": "/data/levels/aaa_m37.hoggy", "start": 2370923, "end": 2380103, "audio": 0}, {"filename": "/data/levels/aaa_m37_small.hoggy", "start": 2380103, "end": 2389677, "audio": 0}, {"filename": "/data/levels/aaa_m38.hoggy", "start": 2389677, "end": 2396210, "audio": 0}, {"filename": "/data/levels/aaa_m38_small.hoggy", "start": 2396210, "end": 2402928, "audio": 0}, {"filename": "/data/levels/aaa_m39.hoggy", "start": 2402928, "end": 2407877, "audio": 0}, {"filename": "/data/levels/aaa_m39_small.hoggy", "start": 2407877, "end": 2413635, "audio": 0}, {"filename": "/data/levels/aaa_m40.hoggy", "start": 2413635, "end": 2418928, "audio": 0}, {"filename": "/data/levels/aaa_m40_small.hoggy", "start": 2418928, "end": 2424907, "audio": 0}, {"filename": "/data/levels/aaa_m41.hoggy", "start": 2424907, "end": 2430783, "audio": 0}, {"filename": "/data/levels/aaa_m41_small.hoggy", "start": 2430783, "end": 2436667, "audio": 0}, {"filename": "/data/levels/aaa_x01.hoggy", "start": 2436667, "end": 2441507, "audio": 0}, {"filename": "/data/levels/aaa_x01_small.hoggy", "start": 2441507, "end": 2446354, "audio": 0}, {"filename": "/data/levels/aaa_x02.hoggy", "start": 2446354, "end": 2452690, "audio": 0}, {"filename": "/data/levels/aaa_x02_small.hoggy", "start": 2452690, "end": 2460459, "audio": 0}, {"filename": "/data/levels/aaa_x03.hoggy", "start": 2460459, "end": 2473665, "audio": 0}, {"filename": "/data/levels/aaa_x03_small.hoggy", "start": 2473665, "end": 2487494, "audio": 0}, {"filename": "/data/levels/aaa_x04.hoggy", "start": 2487494, "end": 2492732, "audio": 0}, {"filename": "/data/levels/aaa_x04_small.hoggy", "start": 2492732, "end": 2497994, "audio": 0}, {"filename": "/data/levels/aaa_x05.hoggy", "start": 2497994, "end": 2502418, "audio": 0}, {"filename": "/data/levels/aaa_x05_small.hoggy", "start": 2502418, "end": 2506870, "audio": 0}, {"filename": "/data/levels/aaa_x06.hoggy", "start": 2506870, "end": 2510631, "audio": 0}, {"filename": "/data/levels/aaa_x06_small.hoggy", "start": 2510631, "end": 2514408, "audio": 0}, {"filename": "/data/levels/aaa_x07.hoggy", "start": 2514408, "end": 2518404, "audio": 0}, {"filename": "/data/levels/aaa_x07_small.hoggy", "start": 2518404, "end": 2522416, "audio": 0}, {"filename": "/data/levels/aaa_x08.hoggy", "start": 2522416, "end": 2529507, "audio": 0}, {"filename": "/data/levels/aaa_x08_small.hoggy", "start": 2529507, "end": 2536811, "audio": 0}, {"filename": "/data/levels/aaa_x09.hoggy", "start": 2536811, "end": 2540956, "audio": 0}, {"filename": "/data/levels/aaa_x09_small.hoggy", "start": 2540956, "end": 2545109, "audio": 0}, {"filename": "/data/levels/aaa_x10.hoggy", "start": 2545109, "end": 2560076, "audio": 0}, {"filename": "/data/levels/aaa_x10_small.hoggy", "start": 2560076, "end": 2575120, "audio": 0}, {"filename": "/data/levels/aaa_x11.hoggy", "start": 2575120, "end": 2579442, "audio": 0}, {"filename": "/data/levels/aaa_x11_small.hoggy", "start": 2579442, "end": 2583780, "audio": 0}, {"filename": "/data/levels/aaa_x12.hoggy", "start": 2583780, "end": 2587302, "audio": 0}, {"filename": "/data/levels/aaa_x12_small.hoggy", "start": 2587302, "end": 2590844, "audio": 0}, {"filename": "/data/levels/aaa_x13.hoggy", "start": 2590844, "end": 2596708, "audio": 0}, {"filename": "/data/levels/aaa_x13_small.hoggy", "start": 2596708, "end": 2602308, "audio": 0}, {"filename": "/data/levels/aaa_x14.hoggy", "start": 2602308, "end": 2606175, "audio": 0}, {"filename": "/data/levels/aaa_x14_small.hoggy", "start": 2606175, "end": 2610066, "audio": 0}, {"filename": "/data/levels/aaa_x15.hoggy", "start": 2610066, "end": 2616603, "audio": 0}, {"filename": "/data/levels/aaa_x15_small.hoggy", "start": 2616603, "end": 2624139, "audio": 0}, {"filename": "/data/levels/aaa_x16.hoggy", "start": 2624139, "end": 2634859, "audio": 0}, {"filename": "/data/levels/aaa_x16_small.hoggy", "start": 2634859, "end": 2645809, "audio": 0}, {"filename": "/data/levels/aaa_x17.hoggy", "start": 2645809, "end": 2655937, "audio": 0}, {"filename": "/data/levels/aaa_x17_small.hoggy", "start": 2655937, "end": 2666683, "audio": 0}, {"filename": "/data/levels/aaa_x18.hoggy", "start": 2666683, "end": 2670562, "audio": 0}, {"filename": "/data/levels/aaa_x18_small.hoggy", "start": 2670562, "end": 2674457, "audio": 0}, {"filename": "/data/levels/aaa_x19.hoggy", "start": 2674457, "end": 2678724, "audio": 0}, {"filename": "/data/levels/aaa_x19_small.hoggy", "start": 2678724, "end": 2683019, "audio": 0}, {"filename": "/data/levels/aaa_x20.hoggy", "start": 2683019, "end": 2687433, "audio": 0}, {"filename": "/data/levels/aaa_x20_small.hoggy", "start": 2687433, "end": 2692669, "audio": 0}, {"filename": "/data/levels/aaa_x21.hoggy", "start": 2692669, "end": 2718585, "audio": 0}, {"filename": "/data/levels/aaa_x21_small.hoggy", "start": 2718585, "end": 2744509, "audio": 0}, {"filename": "/data/levels/aaa_x22.hoggy", "start": 2744509, "end": 2750561, "audio": 0}, {"filename": "/data/levels/aaa_x22_small.hoggy", "start": 2750561, "end": 2756629, "audio": 0}, {"filename": "/data/levels/aaa_x23.hoggy", "start": 2756629, "end": 2760066, "audio": 0}, {"filename": "/data/levels/aaa_x23_small.hoggy", "start": 2760066, "end": 2763523, "audio": 0}, {"filename": "/data/levels/aaa_x24.hoggy", "start": 2763523, "end": 2767185, "audio": 0}, {"filename": "/data/levels/aaa_x24_small.hoggy", "start": 2767185, "end": 2770863, "audio": 0}, {"filename": "/data/levels/aaa_x25.hoggy", "start": 2770863, "end": 2776187, "audio": 0}, {"filename": "/data/levels/aaa_x25_small.hoggy", "start": 2776187, "end": 2782138, "audio": 0}, {"filename": "/data/levels/aaa_x26.hoggy", "start": 2782138, "end": 2788119, "audio": 0}, {"filename": "/data/levels/aaa_x26_small.hoggy", "start": 2788119, "end": 2794782, "audio": 0}, {"filename": "/data/levels/aaa_x27.hoggy", "start": 2794782, "end": 2798569, "audio": 0}, {"filename": "/data/levels/aaa_x27_small.hoggy", "start": 2798569, "end": 2802362, "audio": 0}, {"filename": "/data/levels/aaa_x28.hoggy", "start": 2802362, "end": 2806808, "audio": 0}, {"filename": "/data/levels/aaa_x28_small.hoggy", "start": 2806808, "end": 2811262, "audio": 0}, {"filename": "/data/levels/aaa_x29.hoggy", "start": 2811262, "end": 2818690, "audio": 0}, {"filename": "/data/levels/aaa_x29_small.hoggy", "start": 2818690, "end": 2826146, "audio": 0}, {"filename": "/data/levels/aaa_x30.hoggy", "start": 2826146, "end": 2831884, "audio": 0}, {"filename": "/data/levels/aaa_x30_small.hoggy", "start": 2831884, "end": 2837630, "audio": 0}, {"filename": "/data/levels/aaa_x31.hoggy", "start": 2837630, "end": 2843149, "audio": 0}, {"filename": "/data/levels/aaa_x31_small.hoggy", "start": 2843149, "end": 2848696, "audio": 0}, {"filename": "/data/levels/aaa_x32.hoggy", "start": 2848696, "end": 2852599, "audio": 0}, {"filename": "/data/levels/aaa_x32_small.hoggy", "start": 2852599, "end": 2856522, "audio": 0}, {"filename": "/data/levels/aaa_x33.hoggy", "start": 2856522, "end": 2860775, "audio": 0}, {"filename": "/data/levels/aaa_x34.hoggy", "start": 2860775, "end": 2864958, "audio": 0}, {"filename": "/data/levels/aaa_x34_small.hoggy", "start": 2864958, "end": 2869149, "audio": 0}, {"filename": "/data/levels/aaa_x35.hoggy", "start": 2869149, "end": 2875160, "audio": 0}, {"filename": "/data/levels/aaa_x35_small.hoggy", "start": 2875160, "end": 2881179, "audio": 0}, {"filename": "/data/levels/aaa_x36.hoggy", "start": 2881179, "end": 2890654, "audio": 0}, {"filename": "/data/levels/aaa_x36_small.hoggy", "start": 2890654, "end": 2900147, "audio": 0}, {"filename": "/data/levels/aaa_x37.hoggy", "start": 2900147, "end": 2905840, "audio": 0}, {"filename": "/data/levels/aaa_x37_small.hoggy", "start": 2905840, "end": 2912343, "audio": 0}, {"filename": "/data/levels/aaa_x38.hoggy", "start": 2912343, "end": 2945599, "audio": 0}, {"filename": "/data/levels/aaa_x38_small.hoggy", "start": 2945599, "end": 2978863, "audio": 0}, {"filename": "/data/levels/aaa_x39.hoggy", "start": 2978863, "end": 3033436, "audio": 0}, {"filename": "/data/levels/aaa_x39_small.hoggy", "start": 3033436, "end": 3088025, "audio": 0}, {"filename": "/data/levels/aaa_x40.hoggy", "start": 3088025, "end": 3122322, "audio": 0}, {"filename": "/data/levels/aaa_x40_small.hoggy", "start": 3122322, "end": 3157858, "audio": 0}, {"filename": "/data/levels/aaa_x41.hoggy", "start": 3157858, "end": 3167009, "audio": 0}, {"filename": "/data/levels/aaa_x41_small.hoggy", "start": 3167009, "end": 3176095, "audio": 0}, {"filename": "/data/levels/aaa_x42.hoggy", "start": 3176095, "end": 3181123, "audio": 0}, {"filename": "/data/levels/aaa_x42_small.hoggy", "start": 3181123, "end": 3186171, "audio": 0}, {"filename": "/data/levels/boss1.hoggy", "start": 3186171, "end": 3188052, "audio": 0}, {"filename": "/data/levels/boss11.hoggy", "start": 3188052, "end": 3209825, "audio": 0}, {"filename": "/data/levels/boss11_small.hoggy", "start": 3209825, "end": 3232362, "audio": 0}, {"filename": "/data/levels/boss12.hoggy", "start": 3232362, "end": 3258980, "audio": 0}, {"filename": "/data/levels/boss12_small.hoggy", "start": 3258980, "end": 3287958, "audio": 0}, {"filename": "/data/levels/boss13.hoggy", "start": 3287958, "end": 3338948, "audio": 0}, {"filename": "/data/levels/boss13_small.hoggy", "start": 3338948, "end": 3392793, "audio": 0}, {"filename": "/data/levels/boss14.hoggy", "start": 3392793, "end": 3402076, "audio": 0}, {"filename": "/data/levels/boss14_small.hoggy", "start": 3402076, "end": 3411396, "audio": 0}, {"filename": "/data/levels/boss2.hoggy", "start": 3411396, "end": 3413277, "audio": 0}, {"filename": "/data/levels/boss21.hoggy", "start": 3413277, "end": 3429145, "audio": 0}, {"filename": "/data/levels/boss21_small.hoggy", "start": 3429145, "end": 3444910, "audio": 0}, {"filename": "/data/levels/boss22.hoggy", "start": 3444910, "end": 3473644, "audio": 0}, {"filename": "/data/levels/boss22_small.hoggy", "start": 3473644, "end": 3503586, "audio": 0}, {"filename": "/data/levels/boss23.hoggy", "start": 3503586, "end": 3522302, "audio": 0}, {"filename": "/data/levels/boss23_small.hoggy", "start": 3522302, "end": 3542282, "audio": 0}, {"filename": "/data/levels/boss31.hoggy", "start": 3542282, "end": 3566265, "audio": 0}, {"filename": "/data/levels/boss31_small.hoggy", "start": 3566265, "end": 3590565, "audio": 0}, {"filename": "/data/levels/boss32.hoggy", "start": 3590565, "end": 3608631, "audio": 0}, {"filename": "/data/levels/boss32_small.hoggy", "start": 3608631, "end": 3626712, "audio": 0}, {"filename": "/data/levels/boss33.hoggy", "start": 3626712, "end": 3655884, "audio": 0}, {"filename": "/data/levels/boss33_small.hoggy", "start": 3655884, "end": 3686475, "audio": 0}, {"filename": "/data/levels/bosshub.hoggy", "start": 3686475, "end": 3689899, "audio": 0}, {"filename": "/data/levels/bosshub_small.hoggy", "start": 3689899, "end": 3693346, "audio": 0}, {"filename": "/data/levels/credits.hoggy", "start": 3693346, "end": 3707981, "audio": 0}, {"filename": "/data/levels/credits_small.hoggy", "start": 3707981, "end": 3723375, "audio": 0}, {"filename": "/data/levels/ed01.hoggy", "start": 3723375, "end": 3728654, "audio": 0}, {"filename": "/data/levels/ed01_small.hoggy", "start": 3728654, "end": 3733941, "audio": 0}, {"filename": "/data/levels/ed02.hoggy", "start": 3733941, "end": 3750256, "audio": 0}, {"filename": "/data/levels/ed02_small.hoggy", "start": 3750256, "end": 3766579, "audio": 0}, {"filename": "/data/levels/ed03.hoggy", "start": 3766579, "end": 3771917, "audio": 0}, {"filename": "/data/levels/ed03_small.hoggy", "start": 3771917, "end": 3777263, "audio": 0}, {"filename": "/data/levels/ed04.hoggy", "start": 3777263, "end": 3782219, "audio": 0}, {"filename": "/data/levels/ed04_small.hoggy", "start": 3782219, "end": 3788146, "audio": 0}, {"filename": "/data/levels/ed05.hoggy", "start": 3788146, "end": 3792614, "audio": 0}, {"filename": "/data/levels/ed05_small.hoggy", "start": 3792614, "end": 3797094, "audio": 0}, {"filename": "/data/levels/intro.hoggy", "start": 3797094, "end": 3799337, "audio": 0}, {"filename": "/data/levels/k01.hoggy", "start": 3799337, "end": 3803843, "audio": 0}, {"filename": "/data/levels/k01_small.hoggy", "start": 3803843, "end": 3808356, "audio": 0}, {"filename": "/data/levels/k02.hoggy", "start": 3808356, "end": 3813215, "audio": 0}, {"filename": "/data/levels/k02_small.hoggy", "start": 3813215, "end": 3818081, "audio": 0}, {"filename": "/data/levels/k03.hoggy", "start": 3818081, "end": 3822366, "audio": 0}, {"filename": "/data/levels/k03_small.hoggy", "start": 3822366, "end": 3826658, "audio": 0}, {"filename": "/data/levels/k04.hoggy", "start": 3826658, "end": 3831401, "audio": 0}, {"filename": "/data/levels/k04_small.hoggy", "start": 3831401, "end": 3836007, "audio": 0}, {"filename": "/data/levels/k05.hoggy", "start": 3836007, "end": 3839716, "audio": 0}, {"filename": "/data/levels/k05_small.hoggy", "start": 3839716, "end": 3843432, "audio": 0}, {"filename": "/data/levels/k06.hoggy", "start": 3843432, "end": 3848135, "audio": 0}, {"filename": "/data/levels/k06_small.hoggy", "start": 3848135, "end": 3852845, "audio": 0}, {"filename": "/data/levels/k07.hoggy", "start": 3852845, "end": 3857540, "audio": 0}, {"filename": "/data/levels/k07_small.hoggy", "start": 3857540, "end": 3863044, "audio": 0}, {"filename": "/data/levels/k08.hoggy", "start": 3863044, "end": 3870705, "audio": 0}, {"filename": "/data/levels/k08_small.hoggy", "start": 3870705, "end": 3878373, "audio": 0}, {"filename": "/data/levels/k09.hoggy", "start": 3878373, "end": 3885703, "audio": 0}, {"filename": "/data/levels/k09_small.hoggy", "start": 3885703, "end": 3893040, "audio": 0}, {"filename": "/data/levels/k10.hoggy", "start": 3893040, "end": 3897330, "audio": 0}, {"filename": "/data/levels/k10_small.hoggy", "start": 3897330, "end": 3901627, "audio": 0}, {"filename": "/data/levels/k11.hoggy", "start": 3901627, "end": 3907613, "audio": 0}, {"filename": "/data/levels/k11_small.hoggy", "start": 3907613, "end": 3913606, "audio": 0}, {"filename": "/data/levels/k12.hoggy", "start": 3913606, "end": 3918167, "audio": 0}, {"filename": "/data/levels/k12_small.hoggy", "start": 3918167, "end": 3923537, "audio": 0}, {"filename": "/data/levels/k13.hoggy", "start": 3923537, "end": 3928831, "audio": 0}, {"filename": "/data/levels/k13_small.hoggy", "start": 3928831, "end": 3934132, "audio": 0}, {"filename": "/data/levels/k14.hoggy", "start": 3934132, "end": 3939349, "audio": 0}, {"filename": "/data/levels/k14_small.hoggy", "start": 3939349, "end": 3944573, "audio": 0}, {"filename": "/data/levels/k15.hoggy", "start": 3944573, "end": 3950184, "audio": 0}, {"filename": "/data/levels/k15_small.hoggy", "start": 3950184, "end": 3956604, "audio": 0}, {"filename": "/data/levels/k16.hoggy", "start": 3956604, "end": 3966613, "audio": 0}, {"filename": "/data/levels/k16_small.hoggy", "start": 3966613, "end": 3976629, "audio": 0}, {"filename": "/data/levels/k17.hoggy", "start": 3976629, "end": 3981725, "audio": 0}, {"filename": "/data/levels/k17_small.hoggy", "start": 3981725, "end": 3986828, "audio": 0}, {"filename": "/data/levels/k18.hoggy", "start": 3986828, "end": 3993715, "audio": 0}, {"filename": "/data/levels/k18_small.hoggy", "start": 3993715, "end": 4000609, "audio": 0}, {"filename": "/data/levels/k19.hoggy", "start": 4000609, "end": 4008656, "audio": 0}, {"filename": "/data/levels/k19_small.hoggy", "start": 4008656, "end": 4016710, "audio": 0}, {"filename": "/data/levels/k20.hoggy", "start": 4016710, "end": 4020804, "audio": 0}, {"filename": "/data/levels/k20_small.hoggy", "start": 4020804, "end": 4024905, "audio": 0}, {"filename": "/data/levels/kidboss.hoggy", "start": 4024905, "end": 4029941, "audio": 0}, {"filename": "/data/levels/kidboss_small.hoggy", "start": 4029941, "end": 4034983, "audio": 0}, {"filename": "/data/levels/kidworld.hoggy", "start": 4034983, "end": 4092892, "audio": 0}, {"filename": "/data/levels/kidworld_small.hoggy", "start": 4092892, "end": 4152640, "audio": 0}, {"filename": "/data/levels/miniboss1.hoggy", "start": 4152640, "end": 4160460, "audio": 0}, {"filename": "/data/levels/miniboss1_small.hoggy", "start": 4160460, "end": 4168301, "audio": 0}, {"filename": "/data/levels/miniboss2.hoggy", "start": 4168301, "end": 4176346, "audio": 0}, {"filename": "/data/levels/miniboss2_small.hoggy", "start": 4176346, "end": 4184412, "audio": 0}, {"filename": "/data/levels/miniboss3.hoggy", "start": 4184412, "end": 4193456, "audio": 0}, {"filename": "/data/levels/miniboss3_small.hoggy", "start": 4193456, "end": 4205140, "audio": 0}, {"filename": "/data/levels/t00.hoggy", "start": 4205140, "end": 4210567, "audio": 0}, {"filename": "/data/levels/t00_small.hoggy", "start": 4210567, "end": 4216019, "audio": 0}, {"filename": "/data/levels/t01.hoggy", "start": 4216019, "end": 4222198, "audio": 0}, {"filename": "/data/levels/t01_small.hoggy", "start": 4222198, "end": 4228782, "audio": 0}, {"filename": "/data/levels/t02.hoggy", "start": 4228782, "end": 4234306, "audio": 0}, {"filename": "/data/levels/t02_small.hoggy", "start": 4234306, "end": 4240830, "audio": 0}, {"filename": "/data/levels/t03.hoggy", "start": 4240830, "end": 4247534, "audio": 0}, {"filename": "/data/levels/t03_small.hoggy", "start": 4247534, "end": 4255390, "audio": 0}, {"filename": "/data/levels/t04.hoggy", "start": 4255390, "end": 4260805, "audio": 0}, {"filename": "/data/levels/t04_small.hoggy", "start": 4260805, "end": 4267640, "audio": 0}, {"filename": "/data/levels/t05.hoggy", "start": 4267640, "end": 4272719, "audio": 0}, {"filename": "/data/levels/t05_small.hoggy", "start": 4272719, "end": 4279218, "audio": 0}, {"filename": "/data/levels/t06.hoggy", "start": 4279218, "end": 4284225, "audio": 0}, {"filename": "/data/levels/t06_small.hoggy", "start": 4284225, "end": 4290461, "audio": 0}, {"filename": "/data/levels/t07.hoggy", "start": 4290461, "end": 4296926, "audio": 0}, {"filename": "/data/levels/t07_small.hoggy", "start": 4296926, "end": 4304814, "audio": 0}, {"filename": "/data/levels/t08.hoggy", "start": 4304814, "end": 4310382, "audio": 0}, {"filename": "/data/levels/t08_small.hoggy", "start": 4310382, "end": 4315894, "audio": 0}, {"filename": "/data/levels/t09.hoggy", "start": 4315894, "end": 4322047, "audio": 0}, {"filename": "/data/levels/t09_small.hoggy", "start": 4322047, "end": 4329624, "audio": 0}, {"filename": "/data/levels/t10.hoggy", "start": 4329624, "end": 4334285, "audio": 0}, {"filename": "/data/levels/t10_small.hoggy", "start": 4334285, "end": 4338809, "audio": 0}, {"filename": "/data/levels/t11.hoggy", "start": 4338809, "end": 4347114, "audio": 0}, {"filename": "/data/levels/t11_small.hoggy", "start": 4347114, "end": 4357147, "audio": 0}, {"filename": "/data/levels/t12.hoggy", "start": 4357147, "end": 4364680, "audio": 0}, {"filename": "/data/levels/t12_small.hoggy", "start": 4364680, "end": 4372602, "audio": 0}, {"filename": "/data/levels/thefall.hoggy", "start": 4372602, "end": 4377759, "audio": 0}, {"filename": "/data/levels/world.hoggy", "start": 4377759, "end": 4686857, "audio": 0}, {"filename": "/data/levels/world_small.hoggy", "start": 4686857, "end": 5007225, "audio": 0}, {"filename": "/images/Backgrounds.bundle", "start": 5007225, "end": 5007765, "audio": 0}, {"filename": "/images/Backgrounds.png", "start": 5007765, "end": 5161115, "audio": 0}, {"filename": "/images/Blocks.bundle", "start": 5161115, "end": 5222000, "audio": 0}, {"filename": "/images/Blocks.png", "start": 5222000, "end": 7760877, "audio": 0}, {"filename": "/images/ControlPanel.bundle", "start": 7760877, "end": 7772744, "audio": 0}, {"filename": "/images/ControlPanel.png", "start": 7772744, "end": 7805288, "audio": 0}, {"filename": "/images/Controls.bundle", "start": 7805288, "end": 7805693, "audio": 0}, {"filename": "/images/Controls.png", "start": 7805693, "end": 7937480, "audio": 0}, {"filename": "/images/Critters.bundle", "start": 7937480, "end": 7959960, "audio": 0}, {"filename": "/images/Critters.png", "start": 7959960, "end": 9987150, "audio": 0}, {"filename": "/images/Editor.bundle", "start": 9987150, "end": 10021313, "audio": 0}, {"filename": "/images/Editor.png", "start": 10021313, "end": 10608948, "audio": 0}, {"filename": "/images/FunDialog.bundle", "start": 10608948, "end": 10629786, "audio": 0}, {"filename": "/images/FunDialog.png", "start": 10629786, "end": 10746184, "audio": 0}, {"filename": "/images/loader.bundle", "start": 10746184, "end": 10752344, "audio": 0}, {"filename": "/images/Loader.png", "start": 10752344, "end": 10845079, "audio": 0}, {"filename": "/images/MakerMall.bundle", "start": 10845079, "end": 10923234, "audio": 0}, {"filename": "/images/MakerMall.png", "start": 10923234, "end": 11928400, "audio": 0}, {"filename": "/images/previewmask.png", "start": 11928400, "end": 12010643, "audio": 0}, {"filename": "/images/Script.bundle", "start": 12010643, "end": 12016703, "audio": 0}, {"filename": "/images/Script.png", "start": 12016703, "end": 12032774, "audio": 0}, {"filename": "/images/Title.bundle", "start": 12032774, "end": 12033764, "audio": 0}, {"filename": "/images/Title.png", "start": 12033764, "end": 12940781, "audio": 0}, {"filename": "/images/TriggerDialog.bundle", "start": 12940781, "end": 12958647, "audio": 0}, {"filename": "/images/TriggerDialog.png", "start": 12958647, "end": 13006854, "audio": 0}, {"filename": "/images/UI.bundle", "start": 13006854, "end": 13107218, "audio": 0}, {"filename": "/images/UI.png", "start": 13107218, "end": 14153831, "audio": 0}, {"filename": "/sounds/angry.ogg", "start": 14153831, "end": 14167134, "audio": 1}, {"filename": "/sounds/attention.ogg", "start": 14167134, "end": 14177128, "audio": 1}, {"filename": "/sounds/badchime.ogg", "start": 14177128, "end": 14183623, "audio": 1}, {"filename": "/sounds/bangcage.ogg", "start": 14183623, "end": 14206586, "audio": 1}, {"filename": "/sounds/bash.ogg", "start": 14206586, "end": 14212159, "audio": 1}, {"filename": "/sounds/bashmoonunit1.ogg", "start": 14212159, "end": 14220854, "audio": 1}, {"filename": "/sounds/bashmoonunit2__STREAM.ogg", "start": 14220854, "end": 14259265, "audio": 1}, {"filename": "/sounds/bigboom.ogg", "start": 14259265, "end": 14288842, "audio": 1}, {"filename": "/sounds/bigexplode.ogg", "start": 14288842, "end": 14315581, "audio": 1}, {"filename": "/sounds/bigkiss__LOOP.ogg", "start": 14315581, "end": 14326484, "audio": 1}, {"filename": "/sounds/blastoff__STREAM.ogg", "start": 14326484, "end": 14352091, "audio": 1}, {"filename": "/sounds/blip.ogg", "start": 14352091, "end": 14358137, "audio": 1}, {"filename": "/sounds/blockland.ogg", "start": 14358137, "end": 14363529, "audio": 1}, {"filename": "/sounds/bomb.ogg", "start": 14363529, "end": 14373872, "audio": 1}, {"filename": "/sounds/bombbig.ogg", "start": 14373872, "end": 14383190, "audio": 1}, {"filename": "/sounds/BossBounce.ogg", "start": 14383190, "end": 14390952, "audio": 1}, {"filename": "/sounds/bosstalk__LOOP.ogg", "start": 14390952, "end": 14449815, "audio": 1}, {"filename": "/sounds/bounce.ogg", "start": 14449815, "end": 14456241, "audio": 1}, {"filename": "/sounds/breakblock.ogg", "start": 14456241, "end": 14469317, "audio": 1}, {"filename": "/sounds/breakcork.ogg", "start": 14469317, "end": 14482946, "audio": 1}, {"filename": "/sounds/breakglass.ogg", "start": 14482946, "end": 14489832, "audio": 1}, {"filename": "/sounds/breakice.ogg", "start": 14489832, "end": 14501020, "audio": 1}, {"filename": "/sounds/brickup.ogg", "start": 14501020, "end": 14509525, "audio": 1}, {"filename": "/sounds/Buggy__LOOP.ogg", "start": 14509525, "end": 14519327, "audio": 1}, {"filename": "/sounds/bump.ogg", "start": 14519327, "end": 14525753, "audio": 1}, {"filename": "/sounds/bumpball.ogg", "start": 14525753, "end": 14530861, "audio": 1}, {"filename": "/sounds/changetype__STREAM.ogg", "start": 14530861, "end": 14537803, "audio": 1}, {"filename": "/sounds/checkpoint.ogg", "start": 14537803, "end": 14551626, "audio": 1}, {"filename": "/sounds/chime.ogg", "start": 14551626, "end": 14560212, "audio": 1}, {"filename": "/sounds/chuzzlehiccup.ogg", "start": 14560212, "end": 14566954, "audio": 1}, {"filename": "/sounds/clap.ogg", "start": 14566954, "end": 14572791, "audio": 1}, {"filename": "/sounds/click.ogg", "start": 14572791, "end": 14580462, "audio": 1}, {"filename": "/sounds/closedoor.ogg", "start": 14580462, "end": 14594333, "audio": 1}, {"filename": "/sounds/closestats__STREAM.ogg", "start": 14594333, "end": 14602910, "audio": 1}, {"filename": "/sounds/cloudstartle.ogg", "start": 14602910, "end": 14610797, "audio": 1}, {"filename": "/sounds/cooldown.ogg", "start": 14610797, "end": 14622810, "audio": 1}, {"filename": "/sounds/Corked.ogg", "start": 14622810, "end": 14632723, "audio": 1}, {"filename": "/sounds/countdown.ogg", "start": 14632723, "end": 14642330, "audio": 1}, {"filename": "/sounds/crunchacorn.ogg", "start": 14642330, "end": 14660419, "audio": 1}, {"filename": "/sounds/crunchjalapeno.ogg", "start": 14660419, "end": 14678178, "audio": 1}, {"filename": "/sounds/crunchmushroom.ogg", "start": 14678178, "end": 14699159, "audio": 1}, {"filename": "/sounds/ding.ogg", "start": 14699159, "end": 14707717, "audio": 1}, {"filename": "/sounds/dizzy__LOOP.ogg", "start": 14707717, "end": 14758346, "audio": 1}, {"filename": "/sounds/drama.ogg", "start": 14758346, "end": 14793147, "audio": 1}, {"filename": "/sounds/drip.ogg", "start": 14793147, "end": 14797564, "audio": 1}, {"filename": "/sounds/drumroll__STREAM.ogg", "start": 14797564, "end": 14830129, "audio": 1}, {"filename": "/sounds/eat.ogg", "start": 14830129, "end": 14837755, "audio": 1}, {"filename": "/sounds/emerge.ogg", "start": 14837755, "end": 14845079, "audio": 1}, {"filename": "/sounds/eraser__LOOP.ogg", "start": 14845079, "end": 14930649, "audio": 1}, {"filename": "/sounds/fadetowhite.ogg", "start": 14930649, "end": 14948040, "audio": 1}, {"filename": "/sounds/flame__LOOP.ogg", "start": 14948040, "end": 14968003, "audio": 1}, {"filename": "/sounds/flipswitch.ogg", "start": 14968003, "end": 14974530, "audio": 1}, {"filename": "/sounds/fullbrick.ogg", "start": 14974530, "end": 14984414, "audio": 1}, {"filename": "/sounds/gibberish__LOOP.ogg", "start": 14984414, "end": 15026255, "audio": 1}, {"filename": "/sounds/godoor.ogg", "start": 15026255, "end": 15035555, "audio": 1}, {"filename": "/sounds/gotkey.ogg", "start": 15035555, "end": 15047109, "audio": 1}, {"filename": "/sounds/gotstar.ogg", "start": 15047109, "end": 15064535, "audio": 1}, {"filename": "/sounds/grab.ogg", "start": 15064535, "end": 15069790, "audio": 1}, {"filename": "/sounds/hinge.ogg", "start": 15069790, "end": 15079753, "audio": 1}, {"filename": "/sounds/Hiss.ogg", "start": 15079753, "end": 15090917, "audio": 1}, {"filename": "/sounds/hitbaddy.ogg", "start": 15090917, "end": 15097343, "audio": 1}, {"filename": "/sounds/hoggyblockmove.ogg", "start": 15097343, "end": 15104952, "audio": 1}, {"filename": "/sounds/hoggyhitshoggy.ogg", "start": 15104952, "end": 15111148, "audio": 1}, {"filename": "/sounds/icebeam__LOOP.ogg", "start": 15111148, "end": 15118062, "audio": 1}, {"filename": "/sounds/icebump.ogg", "start": 15118062, "end": 15125911, "audio": 1}, {"filename": "/sounds/icecube.ogg", "start": 15125911, "end": 15133310, "audio": 1}, {"filename": "/sounds/inbubble.ogg", "start": 15133310, "end": 15139235, "audio": 1}, {"filename": "/sounds/intojar.ogg", "start": 15139235, "end": 15152209, "audio": 1}, {"filename": "/sounds/jump.ogg", "start": 15152209, "end": 15157651, "audio": 1}, {"filename": "/sounds/kisspop.ogg", "start": 15157651, "end": 15165110, "audio": 1}, {"filename": "/sounds/landed.ogg", "start": 15165110, "end": 15173181, "audio": 1}, {"filename": "/sounds/menu.ogg", "start": 15173181, "end": 15179834, "audio": 1}, {"filename": "/sounds/metalcreak__STREAM.ogg", "start": 15179834, "end": 15190459, "audio": 1}, {"filename": "/sounds/moonarm.ogg", "start": 15190459, "end": 15204322, "audio": 1}, {"filename": "/sounds/moonbeam__STREAM.ogg", "start": 15204322, "end": 15241221, "audio": 1}, {"filename": "/sounds/moonbounce.ogg", "start": 15241221, "end": 15248983, "audio": 1}, {"filename": "/sounds/moonhit.ogg", "start": 15248983, "end": 15258850, "audio": 1}, {"filename": "/sounds/Moonmad.ogg", "start": 15258850, "end": 15265494, "audio": 1}, {"filename": "/sounds/moonpipe.ogg", "start": 15265494, "end": 15274375, "audio": 1}, {"filename": "/sounds/moonpunch.ogg", "start": 15274375, "end": 15282118, "audio": 1}, {"filename": "/sounds/moonybugtrapped.ogg", "start": 15282118, "end": 15287631, "audio": 1}, {"filename": "/sounds/moveplatform.ogg", "start": 15287631, "end": 15293102, "audio": 1}, {"filename": "/sounds/neon.ogg", "start": 15293102, "end": 15306875, "audio": 1}, {"filename": "/sounds/newkey.ogg", "start": 15306875, "end": 15312710, "audio": 1}, {"filename": "/sounds/nukeburp.ogg", "start": 15312710, "end": 15326712, "audio": 1}, {"filename": "/sounds/nuke__STREAM.ogg", "start": 15326712, "end": 15407863, "audio": 1}, {"filename": "/sounds/obliterate.ogg", "start": 15407863, "end": 15414581, "audio": 1}, {"filename": "/sounds/opencage.ogg", "start": 15414581, "end": 15420684, "audio": 1}, {"filename": "/sounds/opendoor.ogg", "start": 15420684, "end": 15436597, "audio": 1}, {"filename": "/sounds/outofjar.ogg", "start": 15436597, "end": 15442862, "audio": 1}, {"filename": "/sounds/pop.ogg", "start": 15442862, "end": 15448621, "audio": 1}, {"filename": "/sounds/popbomb.ogg", "start": 15448621, "end": 15460369, "audio": 1}, {"filename": "/sounds/popchuzzle.ogg", "start": 15460369, "end": 15466085, "audio": 1}, {"filename": "/sounds/popoff.ogg", "start": 15466085, "end": 15474195, "audio": 1}, {"filename": "/sounds/popup.ogg", "start": 15474195, "end": 15479119, "audio": 1}, {"filename": "/sounds/powerup.ogg", "start": 15479119, "end": 15499158, "audio": 1}, {"filename": "/sounds/puffcloud.ogg", "start": 15499158, "end": 15507427, "audio": 1}, {"filename": "/sounds/punchspring.ogg", "start": 15507427, "end": 15515281, "audio": 1}, {"filename": "/sounds/push.ogg", "start": 15515281, "end": 15526179, "audio": 1}, {"filename": "/sounds/push__LOOP.ogg", "start": 15526179, "end": 15534361, "audio": 1}, {"filename": "/sounds/putinbumper.ogg", "start": 15534361, "end": 15540237, "audio": 1}, {"filename": "/sounds/reportabuse__LOOP.ogg", "start": 15540237, "end": 15561198, "audio": 1}, {"filename": "/sounds/restart.ogg", "start": 15561198, "end": 15572541, "audio": 1}, {"filename": "/sounds/reveal.ogg", "start": 15572541, "end": 15590264, "audio": 1}, {"filename": "/sounds/rumble__LOOP.ogg", "start": 15590264, "end": 15613292, "audio": 1}, {"filename": "/sounds/sawyersaw.ogg", "start": 15613292, "end": 15636164, "audio": 1}, {"filename": "/sounds/sawyerzoom.ogg", "start": 15636164, "end": 15644510, "audio": 1}, {"filename": "/sounds/shellclick.ogg", "start": 15644510, "end": 15649009, "audio": 1}, {"filename": "/sounds/skid.ogg", "start": 15649009, "end": 15657183, "audio": 1}, {"filename": "/sounds/Speeddown.ogg", "start": 15657183, "end": 15665136, "audio": 1}, {"filename": "/sounds/Speedup.ogg", "start": 15665136, "end": 15673163, "audio": 1}, {"filename": "/sounds/spinkey.ogg", "start": 15673163, "end": 15682704, "audio": 1}, {"filename": "/sounds/squish.ogg", "start": 15682704, "end": 15696989, "audio": 1}, {"filename": "/sounds/Startle.ogg", "start": 15696989, "end": 15703814, "audio": 1}, {"filename": "/sounds/static__LOOP.ogg", "start": 15703814, "end": 15717809, "audio": 1}, {"filename": "/sounds/switchon.ogg", "start": 15717809, "end": 15725485, "audio": 1}, {"filename": "/sounds/textmessage.ogg", "start": 15725485, "end": 15735692, "audio": 1}, {"filename": "/sounds/thunder.ogg", "start": 15735692, "end": 15745266, "audio": 1}, {"filename": "/sounds/touchnuke.ogg", "start": 15745266, "end": 15759927, "audio": 1}, {"filename": "/sounds/TransferComplete__STREAM.ogg", "start": 15759927, "end": 15778011, "audio": 1}, {"filename": "/sounds/transmit__LOOP.ogg", "start": 15778011, "end": 15807459, "audio": 1}, {"filename": "/sounds/tutortext__LOOP.ogg", "start": 15807459, "end": 15871966, "audio": 1}, {"filename": "/sounds/twitch.ogg", "start": 15871966, "end": 15884843, "audio": 1}, {"filename": "/sounds/unlock.ogg", "start": 15884843, "end": 15894228, "audio": 1}, {"filename": "/sounds/whiplash.ogg", "start": 15894228, "end": 15905539, "audio": 1}, {"filename": "/sounds/youcanlevelup__STREAM.ogg", "start": 15905539, "end": 15919020, "audio": 1}, {"filename": "/sounds/spark/spark1.ogg", "start": 15919020, "end": 15926440, "audio": 1}, {"filename": "/sounds/spark/spark2.ogg", "start": 15926440, "end": 15931860, "audio": 1}, {"filename": "/music/music.mo3", "start": 15931860, "end": 16181375, "audio": 0}, {"filename": "/music/music.txt", "start": 16181375, "end": 16182469, "audio": 0}], "remote_package_size": 16182469, "package_uuid": "7764c946-8493-455d-851e-90969d9c3b3b"});
  
  })();
  

    // All the pre-js content up to here must remain later on, we need to run
    // it.
    var necessaryPreJSTasks = Module['preRun'].slice();
  //
// Misc startup function... gets called by OS_Core::Startup() before anything else happens,
// so that we can do any necessary work before tweaking anything else...
//
var gAdBlocking=false;
function Startup()
{
	console.log("Raptisoft Game Startup...");
	HitCounter();
	
	if(document.getElementById('gmzDqNoMBFfb')) {} else {gAdBlocking=true;}
	if (typeof OnStartup === "function") OnStartup(); // Local startup...
}

//
// Gets our command arguments for us...
//

if (typeof window === "object") {
  Module['arguments'] = window.location.search.substr(1).trim().split('&');
  // If no args were passed arguments = [''], in which case kill the single empty string.
  if (!Module['arguments'][0]) {
    Module['arguments'] = [];
  }
}

//
// Something SDL needs to resume audio...
//
document.getElementById('canvas').addEventListener('click', resumePlaying);
function resumePlaying(e) 
{
	if (document.getElementById("canvas")) document.getElementById("canvas").focus();	
	if (typeof Module === 'undefined' || typeof Module.SDL2 == 'undefined' || typeof Module.SDL2.audioContext == 'undefined') return;
	if (Module.SDL2.audioContext.state == 'suspended') 
	{
			Module.SDL2.audioContext.resume();
	}
	/*
	//
	// Originally this removed the listener after one time.
	// But if in an iFrame, this listener has to hang around so if
	// they click off the frame, they can click to recover things.
	//
	if (Module.SDL2.audioContext.state == 'running')
	{
		document.getElementById('canvas').removeEventListener('click', resumePlaying);
		document.removeEventListener('keydown', resumePlaying);
	}
	*/
}

//
// Fullscreen handler...
//
function requestFullScreen(element) 
{
	// Supports most browsers and their versions.
	var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
	if (requestMethod) 
	{ // Native full screen.
		requestMethod.call(element);
	} 
	else if (typeof window.ActiveXObject !== "undefined") 
	{ // Older IE.
		var wscript = new ActiveXObject("WScript.Shell");
		if (wscript !== null) 
		{
			wscript.SendKeys("{F11}");
		}
	}
}
function getCanvasWidth() {return parseInt(document.getElementById('canvas').style.width,10);}
function getCanvasHeight() {return parseInt(document.getElementById('canvas').style.height,10);}

document.getElementById('canvas').addEventListener("keydown", event => 
{
	if (event.keyCode === 120) 
	{
		requestFullScreen(document.getElementById('canvas'));
		return;
	}
});

//
// For ads...
// Implement a custom _ShowInterstitial function for different ad providers.
//
function ShowInterstitial() 
{
	//console.log("Show Interstitial...");
	if (typeof _ShowInterstitial === "function") {_ShowInterstitial();}
	else 
	{
		console.log("No _ShowInterstitial function implemented!");
		
		var aResult="blocked";
		var aStringPtr=allocate(intArrayFromString(aResult), 'i8', ALLOC_NORMAL);				
		_AdComplete(aStringPtr);
		_free(aStringPtr);
	}
}

function HideInterstitial()
{
	document.getElementById('canvas').focus();
}

function RefreshBanner()
{
	//console.log("Refresh banner...");
	if (typeof _RefreshBanner === "function") _RefreshBanner();
}


function IsAdBlock() {if (typeof _IsAdBlock === "function") return _IsAdBlock();return gAdBlocking;}
function WebNotify(theNotify) {if (typeof _WebNotify === "function") _WebNotify(theNotify);}
function WebQuery(theQuery) {if (typeof _WebQuery === "function") return _WebQuery(theQuery);return 0;}

function CopyToClipboard(theText)
{
	var copyText = document.getElementById("cutpaste_textbox");
	if (copyText==null)
	{
		document.body.insertAdjacentHTML('beforeend','<div id="cutpaste_div"><input type="text" value="" id="cutpaste_textbox"></div>');
	}
	copyText = document.getElementById("cutpaste_textbox");
	if (copyText!=null)
	{
		document.getElementById("cutpaste_div").style.visibility = "visible";
		copyText.value=theText;
		copyText.select();
		copyText.setSelectionRange(0, 99999);
		document.execCommand("copy");
		document.getElementById("cutpaste_div").style.visibility = "hidden";
	}
}

function PasteListener(e) 
{
    var clipboardData, pastedData;
    e.stopPropagation();
    e.preventDefault();
    clipboardData = e.clipboardData || window.clipboardData;
    var aPasteData=clipboardData.getData('Text');
	
	var aStringPtr=allocate(intArrayFromString(aPasteData), 'i8', ALLOC_NORMAL);				
	_SetPasteData(aStringPtr);
	_free(aStringPtr);
	
	alert("You can now use the clipboad data in the game!");
    //alert(gPasteData);
}

function ShowPasteHelper(theShow)
{
	var aHelper = document.getElementById("paste_helper");
	if (aHelper==null)
	{
		document.body.insertAdjacentHTML('beforeend','<center><div id="paste_helper" contenteditable="true">The Application is expecting clipboard data.  Please right click here and select "paste" to make it available!</div>');
	}
	aHelper = document.getElementById("paste_helper");
	if (aHelper!=null) 
	{
		if (theShow==0) 
		{
			aHelper.style.display="none";
			document.getElementById('paste_helper').removeEventListener('paste', PasteListener);
		}
		if (theShow==1) 
		{
			aHelper.style.display="block";
			document.getElementById('paste_helper').addEventListener('paste', PasteListener);
		}
	}
}

function HitCounter()
{
	const aHttp = new XMLHttpRequest();
	const aUrl='https://www.raptisoft.net/hit.php?os=WASM&url='+window.location.href;
	aHttp.open("GET", aUrl);
	aHttp.send();
	
	// Could add a function to see if someone's still playing after x minutes...
	//setTimeout(function, milliseconds)	

	/*
	aHttp.onreadystatechange = (e) => {
	console.log("WEB RESPONSE = "+aHttp.responseText)
	}
	*/
}



    if (!Module['preRun']) throw 'Module.preRun should exist because file support used it; did a pre-js delete it?';
    necessaryPreJSTasks.forEach(function(task) {
      if (Module['preRun'].indexOf(task) < 0) throw 'All preRun tasks that exist before user pre-js code should remain after; did you replace Module or modify Module.preRun?';
    });
  

// Sometimes an existing Module object exists with properties
// meant to overwrite the default module functionality. Here
// we collect those properties and reapply _after_ we configure
// the current environment's defaults to avoid having to be so
// defensive during initialization.
var moduleOverrides = {};
var key;
for (key in Module) {
  if (Module.hasOwnProperty(key)) {
    moduleOverrides[key] = Module[key];
  }
}

var arguments_ = [];
var thisProgram = './this.program';
var quit_ = function(status, toThrow) {
  throw toThrow;
};

// Determine the runtime environment we are in. You can customize this by
// setting the ENVIRONMENT setting at compile time (see settings.js).

var ENVIRONMENT_IS_WEB = false;
var ENVIRONMENT_IS_WORKER = false;
var ENVIRONMENT_IS_NODE = false;
var ENVIRONMENT_IS_SHELL = false;
ENVIRONMENT_IS_WEB = typeof window === 'object';
ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
// N.b. Electron.js environment is simultaneously a NODE-environment, but
// also a web environment.
ENVIRONMENT_IS_NODE = typeof process === 'object' && typeof process.versions === 'object' && typeof process.versions.node === 'string';
ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;

if (Module['ENVIRONMENT']) {
  throw new Error('Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -s ENVIRONMENT=web or -s ENVIRONMENT=node)');
}



// `/` should be present at the end if `scriptDirectory` is not empty
var scriptDirectory = '';
function locateFile(path) {
  if (Module['locateFile']) {
    return Module['locateFile'](path, scriptDirectory);
  }
  return scriptDirectory + path;
}

// Hooks that are implemented differently in different runtime environments.
var read_,
    readAsync,
    readBinary,
    setWindowTitle;

var nodeFS;
var nodePath;

if (ENVIRONMENT_IS_NODE) {
  if (ENVIRONMENT_IS_WORKER) {
    scriptDirectory = require('path').dirname(scriptDirectory) + '/';
  } else {
    scriptDirectory = __dirname + '/';
  }




  read_ = function shell_read(filename, binary) {
    if (!nodeFS) nodeFS = require('fs');
    if (!nodePath) nodePath = require('path');
    filename = nodePath['normalize'](filename);
    return nodeFS['readFileSync'](filename, binary ? null : 'utf8');
  };

  readBinary = function readBinary(filename) {
    var ret = read_(filename, true);
    if (!ret.buffer) {
      ret = new Uint8Array(ret);
    }
    assert(ret.buffer);
    return ret;
  };




  if (process['argv'].length > 1) {
    thisProgram = process['argv'][1].replace(/\\/g, '/');
  }

  arguments_ = process['argv'].slice(2);

  if (typeof module !== 'undefined') {
    module['exports'] = Module;
  }

  process['on']('uncaughtException', function(ex) {
    // suppress ExitStatus exceptions from showing an error
    if (!(ex instanceof ExitStatus)) {
      throw ex;
    }
  });

  process['on']('unhandledRejection', abort);

  quit_ = function(status) {
    process['exit'](status);
  };

  Module['inspect'] = function () { return '[Emscripten Module object]'; };



} else
if (ENVIRONMENT_IS_SHELL) {


  if (typeof read != 'undefined') {
    read_ = function shell_read(f) {
      return read(f);
    };
  }

  readBinary = function readBinary(f) {
    var data;
    if (typeof readbuffer === 'function') {
      return new Uint8Array(readbuffer(f));
    }
    data = read(f, 'binary');
    assert(typeof data === 'object');
    return data;
  };

  if (typeof scriptArgs != 'undefined') {
    arguments_ = scriptArgs;
  } else if (typeof arguments != 'undefined') {
    arguments_ = arguments;
  }

  if (typeof quit === 'function') {
    quit_ = function(status) {
      quit(status);
    };
  }

  if (typeof print !== 'undefined') {
    // Prefer to use print/printErr where they exist, as they usually work better.
    if (typeof console === 'undefined') console = /** @type{!Console} */({});
    console.log = /** @type{!function(this:Console, ...*): undefined} */ (print);
    console.warn = console.error = /** @type{!function(this:Console, ...*): undefined} */ (typeof printErr !== 'undefined' ? printErr : print);
  }


} else

// Note that this includes Node.js workers when relevant (pthreads is enabled).
// Node.js workers are detected as a combination of ENVIRONMENT_IS_WORKER and
// ENVIRONMENT_IS_NODE.
if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  if (ENVIRONMENT_IS_WORKER) { // Check worker, not web, since window could be polyfilled
    scriptDirectory = self.location.href;
  } else if (document.currentScript) { // web
    scriptDirectory = document.currentScript.src;
  }
  // blob urls look like blob:http://site.com/etc/etc and we cannot infer anything from them.
  // otherwise, slice off the final part of the url to find the script directory.
  // if scriptDirectory does not contain a slash, lastIndexOf will return -1,
  // and scriptDirectory will correctly be replaced with an empty string.
  if (scriptDirectory.indexOf('blob:') !== 0) {
    scriptDirectory = scriptDirectory.substr(0, scriptDirectory.lastIndexOf('/')+1);
  } else {
    scriptDirectory = '';
  }


  // Differentiate the Web Worker from the Node Worker case, as reading must
  // be done differently.
  {




  read_ = function shell_read(url) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, false);
      xhr.send(null);
      return xhr.responseText;
  };

  if (ENVIRONMENT_IS_WORKER) {
    readBinary = function readBinary(url) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        xhr.responseType = 'arraybuffer';
        xhr.send(null);
        return new Uint8Array(/** @type{!ArrayBuffer} */(xhr.response));
    };
  }

  readAsync = function readAsync(url, onload, onerror) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function xhr_onload() {
      if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
        onload(xhr.response);
        return;
      }
      onerror();
    };
    xhr.onerror = onerror;
    xhr.send(null);
  };




  }

  setWindowTitle = function(title) { document.title = title };
} else
{
  throw new Error('environment detection error');
}


// Set up the out() and err() hooks, which are how we can print to stdout or
// stderr, respectively.
var out = Module['print'] || console.log.bind(console);
var err = Module['printErr'] || console.warn.bind(console);

// Merge back in the overrides
for (key in moduleOverrides) {
  if (moduleOverrides.hasOwnProperty(key)) {
    Module[key] = moduleOverrides[key];
  }
}
// Free the object hierarchy contained in the overrides, this lets the GC
// reclaim data used e.g. in memoryInitializerRequest, which is a large typed array.
moduleOverrides = null;

// Emit code to handle expected values on the Module object. This applies Module.x
// to the proper local x. This has two benefits: first, we only emit it if it is
// expected to arrive, and second, by using a local everywhere else that can be
// minified.
if (Module['arguments']) arguments_ = Module['arguments'];if (!Object.getOwnPropertyDescriptor(Module, 'arguments')) Object.defineProperty(Module, 'arguments', { configurable: true, get: function() { abort('Module.arguments has been replaced with plain arguments_ (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)') } });
if (Module['thisProgram']) thisProgram = Module['thisProgram'];if (!Object.getOwnPropertyDescriptor(Module, 'thisProgram')) Object.defineProperty(Module, 'thisProgram', { configurable: true, get: function() { abort('Module.thisProgram has been replaced with plain thisProgram (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)') } });
if (Module['quit']) quit_ = Module['quit'];if (!Object.getOwnPropertyDescriptor(Module, 'quit')) Object.defineProperty(Module, 'quit', { configurable: true, get: function() { abort('Module.quit has been replaced with plain quit_ (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)') } });

// perform assertions in shell.js after we set up out() and err(), as otherwise if an assertion fails it cannot print the message
// Assertions on removed incoming Module JS APIs.
assert(typeof Module['memoryInitializerPrefixURL'] === 'undefined', 'Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['pthreadMainPrefixURL'] === 'undefined', 'Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['cdInitializerPrefixURL'] === 'undefined', 'Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['filePackagePrefixURL'] === 'undefined', 'Module.filePackagePrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['read'] === 'undefined', 'Module.read option was removed (modify read_ in JS)');
assert(typeof Module['readAsync'] === 'undefined', 'Module.readAsync option was removed (modify readAsync in JS)');
assert(typeof Module['readBinary'] === 'undefined', 'Module.readBinary option was removed (modify readBinary in JS)');
assert(typeof Module['setWindowTitle'] === 'undefined', 'Module.setWindowTitle option was removed (modify setWindowTitle in JS)');
assert(typeof Module['TOTAL_MEMORY'] === 'undefined', 'Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY');
if (!Object.getOwnPropertyDescriptor(Module, 'read')) Object.defineProperty(Module, 'read', { configurable: true, get: function() { abort('Module.read has been replaced with plain read_ (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)') } });
if (!Object.getOwnPropertyDescriptor(Module, 'readAsync')) Object.defineProperty(Module, 'readAsync', { configurable: true, get: function() { abort('Module.readAsync has been replaced with plain readAsync (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)') } });
if (!Object.getOwnPropertyDescriptor(Module, 'readBinary')) Object.defineProperty(Module, 'readBinary', { configurable: true, get: function() { abort('Module.readBinary has been replaced with plain readBinary (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)') } });
if (!Object.getOwnPropertyDescriptor(Module, 'setWindowTitle')) Object.defineProperty(Module, 'setWindowTitle', { configurable: true, get: function() { abort('Module.setWindowTitle has been replaced with plain setWindowTitle (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)') } });

var PROXYFS = 'PROXYFS is no longer included by default; build with -lproxyfs.js';
var WORKERFS = 'WORKERFS is no longer included by default; build with -lworkerfs.js';
var NODEFS = 'NODEFS is no longer included by default; build with -lnodefs.js';






// {{PREAMBLE_ADDITIONS}}

var STACK_ALIGN = 16;

function dynamicAlloc(size) {
  assert(DYNAMICTOP_PTR);
  var ret = HEAP32[DYNAMICTOP_PTR>>2];
  var end = (ret + size + 15) & -16;
  assert(end <= HEAP8.length, 'failure to dynamicAlloc - memory growth etc. is not supported there, call malloc/sbrk directly');
  HEAP32[DYNAMICTOP_PTR>>2] = end;
  return ret;
}

function alignMemory(size, factor) {
  if (!factor) factor = STACK_ALIGN; // stack alignment (16-byte) by default
  return Math.ceil(size / factor) * factor;
}

function getNativeTypeSize(type) {
  switch (type) {
    case 'i1': case 'i8': return 1;
    case 'i16': return 2;
    case 'i32': return 4;
    case 'i64': return 8;
    case 'float': return 4;
    case 'double': return 8;
    default: {
      if (type[type.length-1] === '*') {
        return 4; // A pointer
      } else if (type[0] === 'i') {
        var bits = Number(type.substr(1));
        assert(bits % 8 === 0, 'getNativeTypeSize invalid bits ' + bits + ', type ' + type);
        return bits / 8;
      } else {
        return 0;
      }
    }
  }
}

function warnOnce(text) {
  if (!warnOnce.shown) warnOnce.shown = {};
  if (!warnOnce.shown[text]) {
    warnOnce.shown[text] = 1;
    err(text);
  }
}








// Wraps a JS function as a wasm function with a given signature.
function convertJsFunctionToWasm(func, sig) {

  // If the type reflection proposal is available, use the new
  // "WebAssembly.Function" constructor.
  // Otherwise, construct a minimal wasm module importing the JS function and
  // re-exporting it.
  if (typeof WebAssembly.Function === "function") {
    var typeNames = {
      'i': 'i32',
      'j': 'i64',
      'f': 'f32',
      'd': 'f64'
    };
    var type = {
      parameters: [],
      results: sig[0] == 'v' ? [] : [typeNames[sig[0]]]
    };
    for (var i = 1; i < sig.length; ++i) {
      type.parameters.push(typeNames[sig[i]]);
    }
    return new WebAssembly.Function(type, func);
  }

  // The module is static, with the exception of the type section, which is
  // generated based on the signature passed in.
  var typeSection = [
    0x01, // id: section,
    0x00, // length: 0 (placeholder)
    0x01, // count: 1
    0x60, // form: func
  ];
  var sigRet = sig.slice(0, 1);
  var sigParam = sig.slice(1);
  var typeCodes = {
    'i': 0x7f, // i32
    'j': 0x7e, // i64
    'f': 0x7d, // f32
    'd': 0x7c, // f64
  };

  // Parameters, length + signatures
  typeSection.push(sigParam.length);
  for (var i = 0; i < sigParam.length; ++i) {
    typeSection.push(typeCodes[sigParam[i]]);
  }

  // Return values, length + signatures
  // With no multi-return in MVP, either 0 (void) or 1 (anything else)
  if (sigRet == 'v') {
    typeSection.push(0x00);
  } else {
    typeSection = typeSection.concat([0x01, typeCodes[sigRet]]);
  }

  // Write the overall length of the type section back into the section header
  // (excepting the 2 bytes for the section id and length)
  typeSection[1] = typeSection.length - 2;

  // Rest of the module is static
  var bytes = new Uint8Array([
    0x00, 0x61, 0x73, 0x6d, // magic ("\0asm")
    0x01, 0x00, 0x00, 0x00, // version: 1
  ].concat(typeSection, [
    0x02, 0x07, // import section
      // (import "e" "f" (func 0 (type 0)))
      0x01, 0x01, 0x65, 0x01, 0x66, 0x00, 0x00,
    0x07, 0x05, // export section
      // (export "f" (func 0 (type 0)))
      0x01, 0x01, 0x66, 0x00, 0x00,
  ]));

   // We can compile this wasm module synchronously because it is very small.
  // This accepts an import (at "e.f"), that it reroutes to an export (at "f")
  var module = new WebAssembly.Module(bytes);
  var instance = new WebAssembly.Instance(module, {
    'e': {
      'f': func
    }
  });
  var wrappedFunc = instance.exports['f'];
  return wrappedFunc;
}

var freeTableIndexes = [];

// Weak map of functions in the table to their indexes, created on first use.
var functionsInTableMap;

// Add a wasm function to the table.
function addFunctionWasm(func, sig) {
  var table = wasmTable;

  // Check if the function is already in the table, to ensure each function
  // gets a unique index. First, create the map if this is the first use.
  if (!functionsInTableMap) {
    functionsInTableMap = new WeakMap();
    for (var i = 0; i < table.length; i++) {
      var item = table.get(i);
      // Ignore null values.
      if (item) {
        functionsInTableMap.set(item, i);
      }
    }
  }
  if (functionsInTableMap.has(func)) {
    return functionsInTableMap.get(func);
  }

  // It's not in the table, add it now.


  var ret;
  // Reuse a free index if there is one, otherwise grow.
  if (freeTableIndexes.length) {
    ret = freeTableIndexes.pop();
  } else {
    ret = table.length;
    // Grow the table
    try {
      table.grow(1);
    } catch (err) {
      if (!(err instanceof RangeError)) {
        throw err;
      }
      throw 'Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.';
    }
  }

  // Set the new value.
  try {
    // Attempting to call this with JS function will cause of table.set() to fail
    table.set(ret, func);
  } catch (err) {
    if (!(err instanceof TypeError)) {
      throw err;
    }
    assert(typeof sig !== 'undefined', 'Missing signature argument to addFunction');
    var wrapped = convertJsFunctionToWasm(func, sig);
    table.set(ret, wrapped);
  }

  functionsInTableMap.set(func, ret);

  return ret;
}

function removeFunctionWasm(index) {
  functionsInTableMap.delete(wasmTable.get(index));
  freeTableIndexes.push(index);
}

// 'sig' parameter is required for the llvm backend but only when func is not
// already a WebAssembly function.
function addFunction(func, sig) {
  assert(typeof func !== 'undefined');

  return addFunctionWasm(func, sig);
}

function removeFunction(index) {
  removeFunctionWasm(index);
}



var funcWrappers = {};

function getFuncWrapper(func, sig) {
  if (!func) return; // on null pointer, return undefined
  assert(sig);
  if (!funcWrappers[sig]) {
    funcWrappers[sig] = {};
  }
  var sigCache = funcWrappers[sig];
  if (!sigCache[func]) {
    // optimize away arguments usage in common cases
    if (sig.length === 1) {
      sigCache[func] = function dynCall_wrapper() {
        return dynCall(sig, func);
      };
    } else if (sig.length === 2) {
      sigCache[func] = function dynCall_wrapper(arg) {
        return dynCall(sig, func, [arg]);
      };
    } else {
      // general case
      sigCache[func] = function dynCall_wrapper() {
        return dynCall(sig, func, Array.prototype.slice.call(arguments));
      };
    }
  }
  return sigCache[func];
}







function makeBigInt(low, high, unsigned) {
  return unsigned ? ((+((low>>>0)))+((+((high>>>0)))*4294967296.0)) : ((+((low>>>0)))+((+((high|0)))*4294967296.0));
}

/** @param {Array=} args */
function dynCall(sig, ptr, args) {
  if (args && args.length) {
    // j (64-bit integer) must be passed in as two numbers [low 32, high 32].
    assert(args.length === sig.substring(1).replace(/j/g, '--').length);
    assert(('dynCall_' + sig) in Module, 'bad function pointer type - no table for sig \'' + sig + '\'');
    return Module['dynCall_' + sig].apply(null, [ptr].concat(args));
  } else {
    assert(sig.length == 1);
    assert(('dynCall_' + sig) in Module, 'bad function pointer type - no table for sig \'' + sig + '\'');
    return Module['dynCall_' + sig].call(null, ptr);
  }
}

var tempRet0 = 0;

var setTempRet0 = function(value) {
  tempRet0 = value;
};

var getTempRet0 = function() {
  return tempRet0;
};

function getCompilerSetting(name) {
  throw 'You must build with -s RETAIN_COMPILER_SETTINGS=1 for getCompilerSetting or emscripten_get_compiler_setting to work';
}

// The address globals begin at. Very low in memory, for code size and optimization opportunities.
// Above 0 is static memory, starting with globals.
// Then the stack.
// Then 'dynamic' memory for sbrk.
var GLOBAL_BASE = 1024;





// === Preamble library stuff ===

// Documentation for the public APIs defined in this file must be updated in:
//    site/source/docs/api_reference/preamble.js.rst
// A prebuilt local version of the documentation is available at:
//    site/build/text/docs/api_reference/preamble.js.txt
// You can also build docs locally as HTML or other formats in site/
// An online HTML version (which may be of a different version of Emscripten)
//    is up at http://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html


var wasmBinary;if (Module['wasmBinary']) wasmBinary = Module['wasmBinary'];if (!Object.getOwnPropertyDescriptor(Module, 'wasmBinary')) Object.defineProperty(Module, 'wasmBinary', { configurable: true, get: function() { abort('Module.wasmBinary has been replaced with plain wasmBinary (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)') } });
var noExitRuntime;if (Module['noExitRuntime']) noExitRuntime = Module['noExitRuntime'];if (!Object.getOwnPropertyDescriptor(Module, 'noExitRuntime')) Object.defineProperty(Module, 'noExitRuntime', { configurable: true, get: function() { abort('Module.noExitRuntime has been replaced with plain noExitRuntime (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)') } });


if (typeof WebAssembly !== 'object') {
  abort('no native wasm support detected');
}




// In MINIMAL_RUNTIME, setValue() and getValue() are only available when building with safe heap enabled, for heap safety checking.
// In traditional runtime, setValue() and getValue() are always available (although their use is highly discouraged due to perf penalties)

/** @param {number} ptr
    @param {number} value
    @param {string} type
    @param {number|boolean=} noSafe */
function setValue(ptr, value, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': HEAP8[((ptr)>>0)]=value; break;
      case 'i8': HEAP8[((ptr)>>0)]=value; break;
      case 'i16': HEAP16[((ptr)>>1)]=value; break;
      case 'i32': HEAP32[((ptr)>>2)]=value; break;
      case 'i64': (tempI64 = [value>>>0,(tempDouble=value,(+(Math_abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math_min((+(Math_floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[((ptr)>>2)]=tempI64[0],HEAP32[(((ptr)+(4))>>2)]=tempI64[1]); break;
      case 'float': HEAPF32[((ptr)>>2)]=value; break;
      case 'double': HEAPF64[((ptr)>>3)]=value; break;
      default: abort('invalid type for setValue: ' + type);
    }
}

/** @param {number} ptr
    @param {string} type
    @param {number|boolean=} noSafe */
function getValue(ptr, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': return HEAP8[((ptr)>>0)];
      case 'i8': return HEAP8[((ptr)>>0)];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': return HEAP32[((ptr)>>2)];
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return HEAPF64[((ptr)>>3)];
      default: abort('invalid type for getValue: ' + type);
    }
  return null;
}






// Wasm globals

var wasmMemory;

// In fastcomp asm.js, we don't need a wasm Table at all.
// In the wasm backend, we polyfill the WebAssembly object,
// so this creates a (non-native-wasm) table for us.

var wasmTable = new WebAssembly.Table({
  'initial': 4925,
  'maximum': 4925 + 0,
  'element': 'anyfunc'
});




//========================================
// Runtime essentials
//========================================

// whether we are quitting the application. no code should run after this.
// set in exit() and abort()
var ABORT = false;

// set by exit() and abort().  Passed to 'onExit' handler.
// NOTE: This is also used as the process return code code in shell environments
// but only when noExitRuntime is false.
var EXITSTATUS = 0;

/** @type {function(*, string=)} */
function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed: ' + text);
  }
}

// Returns the C function with a specified identifier (for C++, you need to do manual name mangling)
function getCFunc(ident) {
  var func = Module['_' + ident]; // closure exported function
  assert(func, 'Cannot call unknown function ' + ident + ', make sure it is exported');
  return func;
}

// C calling interface.
/** @param {string|null=} returnType
    @param {Array=} argTypes
    @param {Arguments|Array=} args
    @param {Object=} opts */
function ccall(ident, returnType, argTypes, args, opts) {
  // For fast lookup of conversion functions
  var toC = {
    'string': function(str) {
      var ret = 0;
      if (str !== null && str !== undefined && str !== 0) { // null string
        // at most 4 bytes per UTF-8 code point, +1 for the trailing '\0'
        var len = (str.length << 2) + 1;
        ret = stackAlloc(len);
        stringToUTF8(str, ret, len);
      }
      return ret;
    },
    'array': function(arr) {
      var ret = stackAlloc(arr.length);
      writeArrayToMemory(arr, ret);
      return ret;
    }
  };

  function convertReturnValue(ret) {
    if (returnType === 'string') return UTF8ToString(ret);
    if (returnType === 'boolean') return Boolean(ret);
    return ret;
  }

  var func = getCFunc(ident);
  var cArgs = [];
  var stack = 0;
  assert(returnType !== 'array', 'Return type should not be "array".');
  if (args) {
    for (var i = 0; i < args.length; i++) {
      var converter = toC[argTypes[i]];
      if (converter) {
        if (stack === 0) stack = stackSave();
        cArgs[i] = converter(args[i]);
      } else {
        cArgs[i] = args[i];
      }
    }
  }
  var ret = func.apply(null, cArgs);

  ret = convertReturnValue(ret);
  if (stack !== 0) stackRestore(stack);
  return ret;
}

/** @param {string=} returnType
    @param {Array=} argTypes
    @param {Object=} opts */
function cwrap(ident, returnType, argTypes, opts) {
  return function() {
    return ccall(ident, returnType, argTypes, arguments, opts);
  }
}

var ALLOC_NORMAL = 0; // Tries to use _malloc()
var ALLOC_STACK = 1; // Lives for the duration of the current function call
var ALLOC_DYNAMIC = 2; // Cannot be freed except through sbrk
var ALLOC_NONE = 3; // Do not allocate

// allocate(): This is for internal use. You can use it yourself as well, but the interface
//             is a little tricky (see docs right below). The reason is that it is optimized
//             for multiple syntaxes to save space in generated code. So you should
//             normally not use allocate(), and instead allocate memory using _malloc(),
//             initialize it with setValue(), and so forth.
// @slab: An array of data, or a number. If a number, then the size of the block to allocate,
//        in *bytes* (note that this is sometimes confusing: the next parameter does not
//        affect this!)
// @types: Either an array of types, one for each byte (or 0 if no type at that position),
//         or a single type which is used for the entire block. This only matters if there
//         is initial data - if @slab is a number, then this does not matter at all and is
//         ignored.
// @allocator: How to allocate memory, see ALLOC_*
/** @type {function((TypedArray|Array<number>|number), string, number, number=)} */
function allocate(slab, types, allocator, ptr) {
  var zeroinit, size;
  if (typeof slab === 'number') {
    zeroinit = true;
    size = slab;
  } else {
    zeroinit = false;
    size = slab.length;
  }

  var singleType = typeof types === 'string' ? types : null;

  var ret;
  if (allocator == ALLOC_NONE) {
    ret = ptr;
  } else {
    ret = [_malloc,
    stackAlloc,
    dynamicAlloc][allocator](Math.max(size, singleType ? 1 : types.length));
  }

  if (zeroinit) {
    var stop;
    ptr = ret;
    assert((ret & 3) == 0);
    stop = ret + (size & ~3);
    for (; ptr < stop; ptr += 4) {
      HEAP32[((ptr)>>2)]=0;
    }
    stop = ret + size;
    while (ptr < stop) {
      HEAP8[((ptr++)>>0)]=0;
    }
    return ret;
  }

  if (singleType === 'i8') {
    if (slab.subarray || slab.slice) {
      HEAPU8.set(/** @type {!Uint8Array} */ (slab), ret);
    } else {
      HEAPU8.set(new Uint8Array(slab), ret);
    }
    return ret;
  }

  var i = 0, type, typeSize, previousType;
  while (i < size) {
    var curr = slab[i];

    type = singleType || types[i];
    if (type === 0) {
      i++;
      continue;
    }
    assert(type, 'Must know what type to store in allocate!');

    if (type == 'i64') type = 'i32'; // special case: we have one i32 here, and one i32 later

    setValue(ret+i, curr, type);

    // no need to look up size unless type changes, so cache it
    if (previousType !== type) {
      typeSize = getNativeTypeSize(type);
      previousType = type;
    }
    i += typeSize;
  }

  return ret;
}

// Allocate memory during any stage of startup - static memory early on, dynamic memory later, malloc when ready
function getMemory(size) {
  if (!runtimeInitialized) return dynamicAlloc(size);
  return _malloc(size);
}




// runtime_strings.js: Strings related runtime functions that are part of both MINIMAL_RUNTIME and regular runtime.

// Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the given array that contains uint8 values, returns
// a copy of that string as a Javascript String object.

var UTF8Decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf8') : undefined;

/**
 * @param {number} idx
 * @param {number=} maxBytesToRead
 * @return {string}
 */
function UTF8ArrayToString(heap, idx, maxBytesToRead) {
  var endIdx = idx + maxBytesToRead;
  var endPtr = idx;
  // TextDecoder needs to know the byte length in advance, it doesn't stop on null terminator by itself.
  // Also, use the length info to avoid running tiny strings through TextDecoder, since .subarray() allocates garbage.
  // (As a tiny code save trick, compare endPtr against endIdx using a negation, so that undefined means Infinity)
  while (heap[endPtr] && !(endPtr >= endIdx)) ++endPtr;

  if (endPtr - idx > 16 && heap.subarray && UTF8Decoder) {
    return UTF8Decoder.decode(heap.subarray(idx, endPtr));
  } else {
    var str = '';
    // If building with TextDecoder, we have already computed the string length above, so test loop end condition against that
    while (idx < endPtr) {
      // For UTF8 byte structure, see:
      // http://en.wikipedia.org/wiki/UTF-8#Description
      // https://www.ietf.org/rfc/rfc2279.txt
      // https://tools.ietf.org/html/rfc3629
      var u0 = heap[idx++];
      if (!(u0 & 0x80)) { str += String.fromCharCode(u0); continue; }
      var u1 = heap[idx++] & 63;
      if ((u0 & 0xE0) == 0xC0) { str += String.fromCharCode(((u0 & 31) << 6) | u1); continue; }
      var u2 = heap[idx++] & 63;
      if ((u0 & 0xF0) == 0xE0) {
        u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
      } else {
        if ((u0 & 0xF8) != 0xF0) warnOnce('Invalid UTF-8 leading byte 0x' + u0.toString(16) + ' encountered when deserializing a UTF-8 string on the asm.js/wasm heap to a JS string!');
        u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heap[idx++] & 63);
      }

      if (u0 < 0x10000) {
        str += String.fromCharCode(u0);
      } else {
        var ch = u0 - 0x10000;
        str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
      }
    }
  }
  return str;
}

// Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the emscripten HEAP, returns a
// copy of that string as a Javascript String object.
// maxBytesToRead: an optional length that specifies the maximum number of bytes to read. You can omit
//                 this parameter to scan the string until the first \0 byte. If maxBytesToRead is
//                 passed, and the string at [ptr, ptr+maxBytesToReadr[ contains a null byte in the
//                 middle, then the string will cut short at that byte index (i.e. maxBytesToRead will
//                 not produce a string of exact length [ptr, ptr+maxBytesToRead[)
//                 N.B. mixing frequent uses of UTF8ToString() with and without maxBytesToRead may
//                 throw JS JIT optimizations off, so it is worth to consider consistently using one
//                 style or the other.
/**
 * @param {number} ptr
 * @param {number=} maxBytesToRead
 * @return {string}
 */
function UTF8ToString(ptr, maxBytesToRead) {
  return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : '';
}

// Copies the given Javascript String object 'str' to the given byte array at address 'outIdx',
// encoded in UTF8 form and null-terminated. The copy will require at most str.length*4+1 bytes of space in the HEAP.
// Use the function lengthBytesUTF8 to compute the exact number of bytes (excluding null terminator) that this function will write.
// Parameters:
//   str: the Javascript string to copy.
//   heap: the array to copy to. Each index in this array is assumed to be one 8-byte element.
//   outIdx: The starting offset in the array to begin the copying.
//   maxBytesToWrite: The maximum number of bytes this function can write to the array.
//                    This count should include the null terminator,
//                    i.e. if maxBytesToWrite=1, only the null terminator will be written and nothing else.
//                    maxBytesToWrite=0 does not write any bytes to the output, not even the null terminator.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
  if (!(maxBytesToWrite > 0)) // Parameter maxBytesToWrite is not optional. Negative values, 0, null, undefined and false each don't write out any bytes.
    return 0;

  var startIdx = outIdx;
  var endIdx = outIdx + maxBytesToWrite - 1; // -1 for string null terminator.
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description and https://www.ietf.org/rfc/rfc2279.txt and https://tools.ietf.org/html/rfc3629
    var u = str.charCodeAt(i); // possibly a lead surrogate
    if (u >= 0xD800 && u <= 0xDFFF) {
      var u1 = str.charCodeAt(++i);
      u = 0x10000 + ((u & 0x3FF) << 10) | (u1 & 0x3FF);
    }
    if (u <= 0x7F) {
      if (outIdx >= endIdx) break;
      heap[outIdx++] = u;
    } else if (u <= 0x7FF) {
      if (outIdx + 1 >= endIdx) break;
      heap[outIdx++] = 0xC0 | (u >> 6);
      heap[outIdx++] = 0x80 | (u & 63);
    } else if (u <= 0xFFFF) {
      if (outIdx + 2 >= endIdx) break;
      heap[outIdx++] = 0xE0 | (u >> 12);
      heap[outIdx++] = 0x80 | ((u >> 6) & 63);
      heap[outIdx++] = 0x80 | (u & 63);
    } else {
      if (outIdx + 3 >= endIdx) break;
      if (u >= 0x200000) warnOnce('Invalid Unicode code point 0x' + u.toString(16) + ' encountered when serializing a JS string to an UTF-8 string on the asm.js/wasm heap! (Valid unicode code points should be in range 0-0x1FFFFF).');
      heap[outIdx++] = 0xF0 | (u >> 18);
      heap[outIdx++] = 0x80 | ((u >> 12) & 63);
      heap[outIdx++] = 0x80 | ((u >> 6) & 63);
      heap[outIdx++] = 0x80 | (u & 63);
    }
  }
  // Null-terminate the pointer to the buffer.
  heap[outIdx] = 0;
  return outIdx - startIdx;
}

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF8 form. The copy will require at most str.length*4+1 bytes of space in the HEAP.
// Use the function lengthBytesUTF8 to compute the exact number of bytes (excluding null terminator) that this function will write.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF8(str, outPtr, maxBytesToWrite) {
  assert(typeof maxBytesToWrite == 'number', 'stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
  return stringToUTF8Array(str, HEAPU8,outPtr, maxBytesToWrite);
}

// Returns the number of bytes the given Javascript string takes if encoded as a UTF8 byte array, EXCLUDING the null terminator byte.
function lengthBytesUTF8(str) {
  var len = 0;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var u = str.charCodeAt(i); // possibly a lead surrogate
    if (u >= 0xD800 && u <= 0xDFFF) u = 0x10000 + ((u & 0x3FF) << 10) | (str.charCodeAt(++i) & 0x3FF);
    if (u <= 0x7F) ++len;
    else if (u <= 0x7FF) len += 2;
    else if (u <= 0xFFFF) len += 3;
    else len += 4;
  }
  return len;
}





// runtime_strings_extra.js: Strings related runtime functions that are available only in regular runtime.

// Given a pointer 'ptr' to a null-terminated ASCII-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.

function AsciiToString(ptr) {
  var str = '';
  while (1) {
    var ch = HEAPU8[((ptr++)>>0)];
    if (!ch) return str;
    str += String.fromCharCode(ch);
  }
}

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in ASCII form. The copy will require at most str.length+1 bytes of space in the HEAP.

function stringToAscii(str, outPtr) {
  return writeAsciiToMemory(str, outPtr, false);
}

// Given a pointer 'ptr' to a null-terminated UTF16LE-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.

var UTF16Decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-16le') : undefined;

function UTF16ToString(ptr, maxBytesToRead) {
  assert(ptr % 2 == 0, 'Pointer passed to UTF16ToString must be aligned to two bytes!');
  var endPtr = ptr;
  // TextDecoder needs to know the byte length in advance, it doesn't stop on null terminator by itself.
  // Also, use the length info to avoid running tiny strings through TextDecoder, since .subarray() allocates garbage.
  var idx = endPtr >> 1;
  var maxIdx = idx + maxBytesToRead / 2;
  // If maxBytesToRead is not passed explicitly, it will be undefined, and this
  // will always evaluate to true. This saves on code size.
  while (!(idx >= maxIdx) && HEAPU16[idx]) ++idx;
  endPtr = idx << 1;

  if (endPtr - ptr > 32 && UTF16Decoder) {
    return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr));
  } else {
    var i = 0;

    var str = '';
    while (1) {
      var codeUnit = HEAP16[(((ptr)+(i*2))>>1)];
      if (codeUnit == 0 || i == maxBytesToRead / 2) return str;
      ++i;
      // fromCharCode constructs a character from a UTF-16 code unit, so we can pass the UTF16 string right through.
      str += String.fromCharCode(codeUnit);
    }
  }
}

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF16 form. The copy will require at most str.length*4+2 bytes of space in the HEAP.
// Use the function lengthBytesUTF16() to compute the exact number of bytes (excluding null terminator) that this function will write.
// Parameters:
//   str: the Javascript string to copy.
//   outPtr: Byte address in Emscripten HEAP where to write the string to.
//   maxBytesToWrite: The maximum number of bytes this function can write to the array. This count should include the null
//                    terminator, i.e. if maxBytesToWrite=2, only the null terminator will be written and nothing else.
//                    maxBytesToWrite<2 does not write any bytes to the output, not even the null terminator.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF16(str, outPtr, maxBytesToWrite) {
  assert(outPtr % 2 == 0, 'Pointer passed to stringToUTF16 must be aligned to two bytes!');
  assert(typeof maxBytesToWrite == 'number', 'stringToUTF16(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
  // Backwards compatibility: if max bytes is not specified, assume unsafe unbounded write is allowed.
  if (maxBytesToWrite === undefined) {
    maxBytesToWrite = 0x7FFFFFFF;
  }
  if (maxBytesToWrite < 2) return 0;
  maxBytesToWrite -= 2; // Null terminator.
  var startPtr = outPtr;
  var numCharsToWrite = (maxBytesToWrite < str.length*2) ? (maxBytesToWrite / 2) : str.length;
  for (var i = 0; i < numCharsToWrite; ++i) {
    // charCodeAt returns a UTF-16 encoded code unit, so it can be directly written to the HEAP.
    var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
    HEAP16[((outPtr)>>1)]=codeUnit;
    outPtr += 2;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP16[((outPtr)>>1)]=0;
  return outPtr - startPtr;
}

// Returns the number of bytes the given Javascript string takes if encoded as a UTF16 byte array, EXCLUDING the null terminator byte.

function lengthBytesUTF16(str) {
  return str.length*2;
}

function UTF32ToString(ptr, maxBytesToRead) {
  assert(ptr % 4 == 0, 'Pointer passed to UTF32ToString must be aligned to four bytes!');
  var i = 0;

  var str = '';
  // If maxBytesToRead is not passed explicitly, it will be undefined, and this
  // will always evaluate to true. This saves on code size.
  while (!(i >= maxBytesToRead / 4)) {
    var utf32 = HEAP32[(((ptr)+(i*4))>>2)];
    if (utf32 == 0) break;
    ++i;
    // Gotcha: fromCharCode constructs a character from a UTF-16 encoded code (pair), not from a Unicode code point! So encode the code point to UTF-16 for constructing.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    if (utf32 >= 0x10000) {
      var ch = utf32 - 0x10000;
      str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
    } else {
      str += String.fromCharCode(utf32);
    }
  }
  return str;
}

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF32 form. The copy will require at most str.length*4+4 bytes of space in the HEAP.
// Use the function lengthBytesUTF32() to compute the exact number of bytes (excluding null terminator) that this function will write.
// Parameters:
//   str: the Javascript string to copy.
//   outPtr: Byte address in Emscripten HEAP where to write the string to.
//   maxBytesToWrite: The maximum number of bytes this function can write to the array. This count should include the null
//                    terminator, i.e. if maxBytesToWrite=4, only the null terminator will be written and nothing else.
//                    maxBytesToWrite<4 does not write any bytes to the output, not even the null terminator.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF32(str, outPtr, maxBytesToWrite) {
  assert(outPtr % 4 == 0, 'Pointer passed to stringToUTF32 must be aligned to four bytes!');
  assert(typeof maxBytesToWrite == 'number', 'stringToUTF32(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
  // Backwards compatibility: if max bytes is not specified, assume unsafe unbounded write is allowed.
  if (maxBytesToWrite === undefined) {
    maxBytesToWrite = 0x7FFFFFFF;
  }
  if (maxBytesToWrite < 4) return 0;
  var startPtr = outPtr;
  var endPtr = startPtr + maxBytesToWrite - 4;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
    if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) {
      var trailSurrogate = str.charCodeAt(++i);
      codeUnit = 0x10000 + ((codeUnit & 0x3FF) << 10) | (trailSurrogate & 0x3FF);
    }
    HEAP32[((outPtr)>>2)]=codeUnit;
    outPtr += 4;
    if (outPtr + 4 > endPtr) break;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP32[((outPtr)>>2)]=0;
  return outPtr - startPtr;
}

// Returns the number of bytes the given Javascript string takes if encoded as a UTF16 byte array, EXCLUDING the null terminator byte.

function lengthBytesUTF32(str) {
  var len = 0;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var codeUnit = str.charCodeAt(i);
    if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) ++i; // possibly a lead surrogate, so skip over the tail surrogate.
    len += 4;
  }

  return len;
}

// Allocate heap space for a JS string, and write it there.
// It is the responsibility of the caller to free() that memory.
function allocateUTF8(str) {
  var size = lengthBytesUTF8(str) + 1;
  var ret = _malloc(size);
  if (ret) stringToUTF8Array(str, HEAP8, ret, size);
  return ret;
}

// Allocate stack space for a JS string, and write it there.
function allocateUTF8OnStack(str) {
  var size = lengthBytesUTF8(str) + 1;
  var ret = stackAlloc(size);
  stringToUTF8Array(str, HEAP8, ret, size);
  return ret;
}

// Deprecated: This function should not be called because it is unsafe and does not provide
// a maximum length limit of how many bytes it is allowed to write. Prefer calling the
// function stringToUTF8Array() instead, which takes in a maximum length that can be used
// to be secure from out of bounds writes.
/** @deprecated
    @param {boolean=} dontAddNull */
function writeStringToMemory(string, buffer, dontAddNull) {
  warnOnce('writeStringToMemory is deprecated and should not be called! Use stringToUTF8() instead!');

  var /** @type {number} */ lastChar, /** @type {number} */ end;
  if (dontAddNull) {
    // stringToUTF8Array always appends null. If we don't want to do that, remember the
    // character that existed at the location where the null will be placed, and restore
    // that after the write (below).
    end = buffer + lengthBytesUTF8(string);
    lastChar = HEAP8[end];
  }
  stringToUTF8(string, buffer, Infinity);
  if (dontAddNull) HEAP8[end] = lastChar; // Restore the value under the null character.
}

function writeArrayToMemory(array, buffer) {
  assert(array.length >= 0, 'writeArrayToMemory array must have a length (should be an array or typed array)')
  HEAP8.set(array, buffer);
}

/** @param {boolean=} dontAddNull */
function writeAsciiToMemory(str, buffer, dontAddNull) {
  for (var i = 0; i < str.length; ++i) {
    assert(str.charCodeAt(i) === str.charCodeAt(i)&0xff);
    HEAP8[((buffer++)>>0)]=str.charCodeAt(i);
  }
  // Null-terminate the pointer to the HEAP.
  if (!dontAddNull) HEAP8[((buffer)>>0)]=0;
}



// Memory management

var PAGE_SIZE = 16384;
var WASM_PAGE_SIZE = 65536;
var ASMJS_PAGE_SIZE = 16777216;

function alignUp(x, multiple) {
  if (x % multiple > 0) {
    x += multiple - (x % multiple);
  }
  return x;
}

var HEAP,
/** @type {ArrayBuffer} */
  buffer,
/** @type {Int8Array} */
  HEAP8,
/** @type {Uint8Array} */
  HEAPU8,
/** @type {Int16Array} */
  HEAP16,
/** @type {Uint16Array} */
  HEAPU16,
/** @type {Int32Array} */
  HEAP32,
/** @type {Uint32Array} */
  HEAPU32,
/** @type {Float32Array} */
  HEAPF32,
/** @type {Float64Array} */
  HEAPF64;

function updateGlobalBufferAndViews(buf) {
  buffer = buf;
  Module['HEAP8'] = HEAP8 = new Int8Array(buf);
  Module['HEAP16'] = HEAP16 = new Int16Array(buf);
  Module['HEAP32'] = HEAP32 = new Int32Array(buf);
  Module['HEAPU8'] = HEAPU8 = new Uint8Array(buf);
  Module['HEAPU16'] = HEAPU16 = new Uint16Array(buf);
  Module['HEAPU32'] = HEAPU32 = new Uint32Array(buf);
  Module['HEAPF32'] = HEAPF32 = new Float32Array(buf);
  Module['HEAPF64'] = HEAPF64 = new Float64Array(buf);
}

var STATIC_BASE = 1024,
    STACK_BASE = 6132880,
    STACKTOP = STACK_BASE,
    STACK_MAX = 890000,
    DYNAMIC_BASE = 6132880,
    DYNAMICTOP_PTR = 889824;

assert(STACK_BASE % 16 === 0, 'stack must start aligned');
assert(DYNAMIC_BASE % 16 === 0, 'heap must start aligned');


var TOTAL_STACK = 5242880;
if (Module['TOTAL_STACK']) assert(TOTAL_STACK === Module['TOTAL_STACK'], 'the stack size can no longer be determined at runtime')

var INITIAL_INITIAL_MEMORY = Module['INITIAL_MEMORY'] || 16777216;if (!Object.getOwnPropertyDescriptor(Module, 'INITIAL_MEMORY')) Object.defineProperty(Module, 'INITIAL_MEMORY', { configurable: true, get: function() { abort('Module.INITIAL_MEMORY has been replaced with plain INITIAL_INITIAL_MEMORY (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)') } });

assert(INITIAL_INITIAL_MEMORY >= TOTAL_STACK, 'INITIAL_MEMORY should be larger than TOTAL_STACK, was ' + INITIAL_INITIAL_MEMORY + '! (TOTAL_STACK=' + TOTAL_STACK + ')');

// check for full engine support (use string 'subarray' to avoid closure compiler confusion)
assert(typeof Int32Array !== 'undefined' && typeof Float64Array !== 'undefined' && Int32Array.prototype.subarray !== undefined && Int32Array.prototype.set !== undefined,
       'JS engine does not provide full typed array support');








// In non-standalone/normal mode, we create the memory here.



// Create the main memory. (Note: this isn't used in STANDALONE_WASM mode since the wasm
// memory is created in the wasm, not in JS.)

  if (Module['wasmMemory']) {
    wasmMemory = Module['wasmMemory'];
  } else
  {
    wasmMemory = new WebAssembly.Memory({
      'initial': INITIAL_INITIAL_MEMORY / WASM_PAGE_SIZE
      ,
      'maximum': 2147483648 / WASM_PAGE_SIZE
    });
  }


if (wasmMemory) {
  buffer = wasmMemory.buffer;
}

// If the user provides an incorrect length, just use that length instead rather than providing the user to
// specifically provide the memory length with Module['INITIAL_MEMORY'].
INITIAL_INITIAL_MEMORY = buffer.byteLength;
assert(INITIAL_INITIAL_MEMORY % WASM_PAGE_SIZE === 0);
assert(65536 % WASM_PAGE_SIZE === 0);
updateGlobalBufferAndViews(buffer);

HEAP32[DYNAMICTOP_PTR>>2] = DYNAMIC_BASE;






// Initializes the stack cookie. Called at the startup of main and at the startup of each thread in pthreads mode.
function writeStackCookie() {
  assert((STACK_MAX & 3) == 0);
  // The stack grows downwards
  HEAPU32[(STACK_MAX >> 2)+1] = 0x2135467;
  HEAPU32[(STACK_MAX >> 2)+2] = 0x89BACDFE;
  // Also test the global address 0 for integrity.
  // We don't do this with ASan because ASan does its own checks for this.
  HEAP32[0] = 0x63736d65; /* 'emsc' */
}

function checkStackCookie() {
  var cookie1 = HEAPU32[(STACK_MAX >> 2)+1];
  var cookie2 = HEAPU32[(STACK_MAX >> 2)+2];
  if (cookie1 != 0x2135467 || cookie2 != 0x89BACDFE) {
    abort('Stack overflow! Stack cookie has been overwritten, expected hex dwords 0x89BACDFE and 0x2135467, but received 0x' + cookie2.toString(16) + ' ' + cookie1.toString(16));
  }
  // Also test the global address 0 for integrity.
  // We don't do this with ASan because ASan does its own checks for this.
  if (HEAP32[0] !== 0x63736d65 /* 'emsc' */) abort('Runtime error: The application has corrupted its heap memory area (address zero)!');
}





// Endianness check (note: assumes compiler arch was little-endian)
(function() {
  var h16 = new Int16Array(1);
  var h8 = new Int8Array(h16.buffer);
  h16[0] = 0x6373;
  if (h8[0] !== 0x73 || h8[1] !== 0x63) throw 'Runtime error: expected the system to be little-endian!';
})();

function abortFnPtrError(ptr, sig) {
	abort("Invalid function pointer " + ptr + " called with signature '" + sig + "'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this). Build with ASSERTIONS=2 for more info.");
}



function callRuntimeCallbacks(callbacks) {
  while(callbacks.length > 0) {
    var callback = callbacks.shift();
    if (typeof callback == 'function') {
      callback(Module); // Pass the module as the first argument.
      continue;
    }
    var func = callback.func;
    if (typeof func === 'number') {
      if (callback.arg === undefined) {
        Module['dynCall_v'](func);
      } else {
        Module['dynCall_vi'](func, callback.arg);
      }
    } else {
      func(callback.arg === undefined ? null : callback.arg);
    }
  }
}

var __ATPRERUN__  = []; // functions called before the runtime is initialized
var __ATINIT__    = []; // functions called during startup
var __ATMAIN__    = []; // functions called when main() is to be run
var __ATEXIT__    = []; // functions called during shutdown
var __ATPOSTRUN__ = []; // functions called after the main() is called

var runtimeInitialized = false;
var runtimeExited = false;


function preRun() {

  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    while (Module['preRun'].length) {
      addOnPreRun(Module['preRun'].shift());
    }
  }

  callRuntimeCallbacks(__ATPRERUN__);
}

function initRuntime() {
  checkStackCookie();
  assert(!runtimeInitialized);
  runtimeInitialized = true;
  if (!Module["noFSInit"] && !FS.init.initialized) FS.init();
TTY.init();
  callRuntimeCallbacks(__ATINIT__);
}

function preMain() {
  checkStackCookie();
  FS.ignorePermissions = false;
  callRuntimeCallbacks(__ATMAIN__);
}

function exitRuntime() {
  checkStackCookie();
  runtimeExited = true;
}

function postRun() {
  checkStackCookie();

  if (Module['postRun']) {
    if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
    while (Module['postRun'].length) {
      addOnPostRun(Module['postRun'].shift());
    }
  }

  callRuntimeCallbacks(__ATPOSTRUN__);
}

function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}

function addOnInit(cb) {
  __ATINIT__.unshift(cb);
}

function addOnPreMain(cb) {
  __ATMAIN__.unshift(cb);
}

function addOnExit(cb) {
}

function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}

/** @param {number|boolean=} ignore */
function unSign(value, bits, ignore) {
  if (value >= 0) {
    return value;
  }
  return bits <= 32 ? 2*Math.abs(1 << (bits-1)) + value // Need some trickery, since if bits == 32, we are right at the limit of the bits JS uses in bitshifts
                    : Math.pow(2, bits)         + value;
}
/** @param {number|boolean=} ignore */
function reSign(value, bits, ignore) {
  if (value <= 0) {
    return value;
  }
  var half = bits <= 32 ? Math.abs(1 << (bits-1)) // abs is needed if bits == 32
                        : Math.pow(2, bits-1);
  if (value >= half && (bits <= 32 || value > half)) { // for huge values, we can hit the precision limit and always get true here. so don't do that
                                                       // but, in general there is no perfect solution here. With 64-bit ints, we get rounding and errors
                                                       // TODO: In i64 mode 1, resign the two parts separately and safely
    value = -2*half + value; // Cannot bitshift half, as it may be at the limit of the bits JS uses in bitshifts
  }
  return value;
}




// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/fround

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/clz32

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc

assert(Math.imul, 'This browser does not support Math.imul(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
assert(Math.fround, 'This browser does not support Math.fround(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
assert(Math.clz32, 'This browser does not support Math.clz32(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
assert(Math.trunc, 'This browser does not support Math.trunc(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');

var Math_abs = Math.abs;
var Math_cos = Math.cos;
var Math_sin = Math.sin;
var Math_tan = Math.tan;
var Math_acos = Math.acos;
var Math_asin = Math.asin;
var Math_atan = Math.atan;
var Math_atan2 = Math.atan2;
var Math_exp = Math.exp;
var Math_log = Math.log;
var Math_sqrt = Math.sqrt;
var Math_ceil = Math.ceil;
var Math_floor = Math.floor;
var Math_pow = Math.pow;
var Math_imul = Math.imul;
var Math_fround = Math.fround;
var Math_round = Math.round;
var Math_min = Math.min;
var Math_max = Math.max;
var Math_clz32 = Math.clz32;
var Math_trunc = Math.trunc;



// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// Module.preRun (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null; // overridden to take different actions when all run dependencies are fulfilled
var runDependencyTracking = {};

function getUniqueRunDependency(id) {
  var orig = id;
  while (1) {
    if (!runDependencyTracking[id]) return id;
    id = orig + Math.random();
  }
}

function addRunDependency(id) {
  runDependencies++;

  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }

  if (id) {
    assert(!runDependencyTracking[id]);
    runDependencyTracking[id] = 1;
    if (runDependencyWatcher === null && typeof setInterval !== 'undefined') {
      // Check for missing dependencies every few seconds
      runDependencyWatcher = setInterval(function() {
        if (ABORT) {
          clearInterval(runDependencyWatcher);
          runDependencyWatcher = null;
          return;
        }
        var shown = false;
        for (var dep in runDependencyTracking) {
          if (!shown) {
            shown = true;
            err('still waiting on run dependencies:');
          }
          err('dependency: ' + dep);
        }
        if (shown) {
          err('(end of list)');
        }
      }, 10000);
    }
  } else {
    err('warning: run dependency added without ID');
  }
}

function removeRunDependency(id) {
  runDependencies--;

  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }

  if (id) {
    assert(runDependencyTracking[id]);
    delete runDependencyTracking[id];
  } else {
    err('warning: run dependency removed without ID');
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    }
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback(); // can add another dependenciesFulfilled
    }
  }
}

Module["preloadedImages"] = {}; // maps url to image data
Module["preloadedAudios"] = {}; // maps url to audio data

/** @param {string|number=} what */
function abort(what) {
  if (Module['onAbort']) {
    Module['onAbort'](what);
  }

  what += '';
  err(what);

  ABORT = true;
  EXITSTATUS = 1;

  var output = 'abort(' + what + ') at ' + stackTrace();
  what = output;

  // Use a wasm runtime error, because a JS error might be seen as a foreign
  // exception, which means we'd run destructors on it. We need the error to
  // simply make the program stop.
  var e = new WebAssembly.RuntimeError(what);

  // Throw the error whether or not MODULARIZE is set because abort is used
  // in code paths apart from instantiation where an exception is expected
  // to be thrown when abort is called.
  throw e;
}


var memoryInitializer = null;












function hasPrefix(str, prefix) {
  return String.prototype.startsWith ?
      str.startsWith(prefix) :
      str.indexOf(prefix) === 0;
}

// Prefix of data URIs emitted by SINGLE_FILE and related options.
var dataURIPrefix = 'data:application/octet-stream;base64,';

// Indicates whether filename is a base64 data URI.
function isDataURI(filename) {
  return hasPrefix(filename, dataURIPrefix);
}

var fileURIPrefix = "file://";

// Indicates whether filename is delivered via file protocol (as opposed to http/https)
function isFileURI(filename) {
  return hasPrefix(filename, fileURIPrefix);
}



function createExportWrapper(name, fixedasm) {
  return function() {
    var displayName = name;
    var asm = fixedasm;
    if (!fixedasm) {
      asm = Module['asm'];
    }
    assert(runtimeInitialized, 'native function `' + displayName + '` called before runtime initialization');
    assert(!runtimeExited, 'native function `' + displayName + '` called after runtime exit (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
    if (!asm[name]) {
      assert(asm[name], 'exported native function `' + displayName + '` not found');
    }
    return asm[name].apply(null, arguments);
  };
}

var wasmBinaryFile = 'index.wasm?version=269';
if (!isDataURI(wasmBinaryFile)) {
  wasmBinaryFile = locateFile(wasmBinaryFile);
}

function getBinary() {
  try {
    if (wasmBinary) {
      return new Uint8Array(wasmBinary);
    }

    if (readBinary) {
      return readBinary(wasmBinaryFile);
    } else {
      throw "both async and sync fetching of the wasm failed";
    }
  }
  catch (err) {
    abort(err);
  }
}

function getBinaryPromise() {
  // If we don't have the binary yet, and have the Fetch api, use that;
  // in some environments, like Electron's render process, Fetch api may be present, but have a different context than expected, let's only use it on the Web
  if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && typeof fetch === 'function'
      // Let's not use fetch to get objects over file:// as it's most likely Cordova which doesn't support fetch for file://
      && !isFileURI(wasmBinaryFile)
      ) {
    return fetch(wasmBinaryFile, { credentials: 'same-origin' }).then(function(response) {
      if (!response['ok']) {
        throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
      }
      return response['arrayBuffer']();
    }).catch(function () {
      return getBinary();
    });
  }
  // Otherwise, getBinary should be able to get it synchronously
  return new Promise(function(resolve, reject) {
    resolve(getBinary());
  });
}



// Create the wasm instance.
// Receives the wasm imports, returns the exports.
function createWasm() {
  // prepare imports
  var info = {
    'env': asmLibraryArg,
    'wasi_snapshot_preview1': asmLibraryArg
  };
  // Load the wasm module and create an instance of using native support in the JS engine.
  // handle a generated wasm instance, receiving its exports and
  // performing other necessary setup
  /** @param {WebAssembly.Module=} module*/
  function receiveInstance(instance, module) {
    var exports = instance.exports;
    Module['asm'] = exports;
    removeRunDependency('wasm-instantiate');
  }
  // we can't run yet (except in a pthread, where we have a custom sync instantiator)
  addRunDependency('wasm-instantiate');


  // Async compilation can be confusing when an error on the page overwrites Module
  // (for example, if the order of elements is wrong, and the one defining Module is
  // later), so we save Module and check it later.
  var trueModule = Module;
  function receiveInstantiatedSource(output) {
    // 'output' is a WebAssemblyInstantiatedSource object which has both the module and instance.
    // receiveInstance() will swap in the exports (to Module.asm) so they can be called
    assert(Module === trueModule, 'the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?');
    trueModule = null;
    // TODO: Due to Closure regression https://github.com/google/closure-compiler/issues/3193, the above line no longer optimizes out down to the following line.
    // When the regression is fixed, can restore the above USE_PTHREADS-enabled path.
    receiveInstance(output['instance']);
  }


  function instantiateArrayBuffer(receiver) {
    return getBinaryPromise().then(function(binary) {
      return WebAssembly.instantiate(binary, info);
    }).then(receiver, function(reason) {
      err('failed to asynchronously prepare wasm: ' + reason);


      abort(reason);
    });
  }

  // Prefer streaming instantiation if available.
  function instantiateAsync() {
    if (!wasmBinary &&
        typeof WebAssembly.instantiateStreaming === 'function' &&
        !isDataURI(wasmBinaryFile) &&
        // Don't use streaming for file:// delivered objects in a webview, fetch them synchronously.
        !isFileURI(wasmBinaryFile) &&
        typeof fetch === 'function') {
      fetch(wasmBinaryFile, { credentials: 'same-origin' }).then(function (response) {
        var result = WebAssembly.instantiateStreaming(response, info);
        return result.then(receiveInstantiatedSource, function(reason) {
            // We expect the most common failure cause to be a bad MIME type for the binary,
            // in which case falling back to ArrayBuffer instantiation should work.
            err('wasm streaming compile failed: ' + reason);
            err('falling back to ArrayBuffer instantiation');
            return instantiateArrayBuffer(receiveInstantiatedSource);
          });
      });
    } else {
      return instantiateArrayBuffer(receiveInstantiatedSource);
    }
  }
  // User shell pages can write their own Module.instantiateWasm = function(imports, successCallback) callback
  // to manually instantiate the Wasm module themselves. This allows pages to run the instantiation parallel
  // to any other async startup actions they are performing.
  if (Module['instantiateWasm']) {
    try {
      var exports = Module['instantiateWasm'](info, receiveInstance);
      return exports;
    } catch(e) {
      err('Module.instantiateWasm callback failed with error: ' + e);
      return false;
    }
  }

  instantiateAsync();
  return {}; // no exports yet; we'll fill them in later
}


// Globals used by JS i64 conversions
var tempDouble;
var tempI64;

// === Body ===

var ASM_CONSTS = {
  1950: function() {FS.syncfs(false, function (err) { assert(!err); ccall('IDBFS_WriteSync', 'v'); });},  
 2034: function() {FS.mkdir('/RAPTISOFT_SANDBOX'); FS.mount(IDBFS, {}, '/RAPTISOFT_SANDBOX'); FS.syncfs(true, function (err) {if(err) console.log("got some error"); else ccall('IDBFS_ReadSync', 'v');});},  
 262842: function($0) {var str = UTF8ToString($0) + '\n\n' + 'Abort/Retry/Ignore/AlwaysIgnore? [ariA] :'; var reply = window.prompt(str, "i"); if (reply === null) { reply = "i"; } return allocate(intArrayFromString(reply), 'i8', ALLOC_NORMAL);},  
 301980: function($0, $1, $2) {var w = $0; var h = $1; var pixels = $2; if (!Module['SDL2']) Module['SDL2'] = {}; var SDL2 = Module['SDL2']; if (SDL2.ctxCanvas !== Module['canvas']) { SDL2.ctx = Module['createContext'](Module['canvas'], false, true); SDL2.ctxCanvas = Module['canvas']; } if (SDL2.w !== w || SDL2.h !== h || SDL2.imageCtx !== SDL2.ctx) { SDL2.image = SDL2.ctx.createImageData(w, h); SDL2.w = w; SDL2.h = h; SDL2.imageCtx = SDL2.ctx; } var data = SDL2.image.data; var src = pixels >> 2; var dst = 0; var num; if (typeof CanvasPixelArray !== 'undefined' && data instanceof CanvasPixelArray) { num = data.length; while (dst < num) { var val = HEAP32[src]; data[dst ] = val & 0xff; data[dst+1] = (val >> 8) & 0xff; data[dst+2] = (val >> 16) & 0xff; data[dst+3] = 0xff; src++; dst += 4; } } else { if (SDL2.data32Data !== data) { SDL2.data32 = new Int32Array(data.buffer); SDL2.data8 = new Uint8Array(data.buffer); } var data32 = SDL2.data32; num = data32.length; data32.set(HEAP32.subarray(src, src + num)); var data8 = SDL2.data8; var i = 3; var j = i + 4*num; if (num % 8 == 0) { while (i < j) { data8[i] = 0xff; i = i + 4 | 0; data8[i] = 0xff; i = i + 4 | 0; data8[i] = 0xff; i = i + 4 | 0; data8[i] = 0xff; i = i + 4 | 0; data8[i] = 0xff; i = i + 4 | 0; data8[i] = 0xff; i = i + 4 | 0; data8[i] = 0xff; i = i + 4 | 0; data8[i] = 0xff; i = i + 4 | 0; } } else { while (i < j) { data8[i] = 0xff; i = i + 4 | 0; } } } SDL2.ctx.putImageData(SDL2.image, 0, 0); return 0;},  
 303459: function($0, $1, $2, $3, $4) {var w = $0; var h = $1; var hot_x = $2; var hot_y = $3; var pixels = $4; var canvas = document.createElement("canvas"); canvas.width = w; canvas.height = h; var ctx = canvas.getContext("2d"); var image = ctx.createImageData(w, h); var data = image.data; var src = pixels >> 2; var dst = 0; var num; if (typeof CanvasPixelArray !== 'undefined' && data instanceof CanvasPixelArray) { num = data.length; while (dst < num) { var val = HEAP32[src]; data[dst ] = val & 0xff; data[dst+1] = (val >> 8) & 0xff; data[dst+2] = (val >> 16) & 0xff; data[dst+3] = (val >> 24) & 0xff; src++; dst += 4; } } else { var data32 = new Int32Array(data.buffer); num = data32.length; data32.set(HEAP32.subarray(src, src + num)); } ctx.putImageData(image, 0, 0); var url = hot_x === 0 && hot_y === 0 ? "url(" + canvas.toDataURL() + "), auto" : "url(" + canvas.toDataURL() + ") " + hot_x + " " + hot_y + ", auto"; var urlBuf = _malloc(url.length + 1); stringToUTF8(url, urlBuf, url.length + 1); return urlBuf;},  
 304448: function($0) {if (Module['canvas']) { Module['canvas'].style['cursor'] = UTF8ToString($0); } return 0;},  
 304541: function() {if (Module['canvas']) { Module['canvas'].style['cursor'] = 'none'; }},  
 305766: function() {return screen.width;},  
 305793: function() {return screen.height;},  
 305821: function() {return window.innerWidth;},  
 305853: function() {return window.innerHeight;},  
 305931: function($0) {if (typeof setWindowTitle !== 'undefined') { setWindowTitle(UTF8ToString($0)); } return 0;},  
 306065: function() {if (typeof(AudioContext) !== 'undefined') { return 1; } else if (typeof(webkitAudioContext) !== 'undefined') { return 1; } return 0;},  
 306231: function() {if ((typeof(navigator.mediaDevices) !== 'undefined') && (typeof(navigator.mediaDevices.getUserMedia) !== 'undefined')) { return 1; } else if (typeof(navigator.webkitGetUserMedia) !== 'undefined') { return 1; } return 0;},  
 306457: function($0) {if(typeof(Module['SDL2']) === 'undefined') { Module['SDL2'] = {}; } var SDL2 = Module['SDL2']; if (!$0) { SDL2.audio = {}; } else { SDL2.capture = {}; } if (!SDL2.audioContext) { if (typeof(AudioContext) !== 'undefined') { SDL2.audioContext = new AudioContext(); } else if (typeof(webkitAudioContext) !== 'undefined') { SDL2.audioContext = new webkitAudioContext(); } if (SDL2.audioContext) { autoResumeAudioContext(SDL2.audioContext); } } return SDL2.audioContext === undefined ? -1 : 0;},  
 307010: function() {var SDL2 = Module['SDL2']; return SDL2.audioContext.sampleRate;},  
 307080: function($0, $1, $2, $3) {var SDL2 = Module['SDL2']; var have_microphone = function(stream) { if (SDL2.capture.silenceTimer !== undefined) { clearTimeout(SDL2.capture.silenceTimer); SDL2.capture.silenceTimer = undefined; } SDL2.capture.mediaStreamNode = SDL2.audioContext.createMediaStreamSource(stream); SDL2.capture.scriptProcessorNode = SDL2.audioContext.createScriptProcessor($1, $0, 1); SDL2.capture.scriptProcessorNode.onaudioprocess = function(audioProcessingEvent) { if ((SDL2 === undefined) || (SDL2.capture === undefined)) { return; } audioProcessingEvent.outputBuffer.getChannelData(0).fill(0.0); SDL2.capture.currentCaptureBuffer = audioProcessingEvent.inputBuffer; dynCall('vi', $2, [$3]); }; SDL2.capture.mediaStreamNode.connect(SDL2.capture.scriptProcessorNode); SDL2.capture.scriptProcessorNode.connect(SDL2.audioContext.destination); SDL2.capture.stream = stream; }; var no_microphone = function(error) { }; SDL2.capture.silenceBuffer = SDL2.audioContext.createBuffer($0, $1, SDL2.audioContext.sampleRate); SDL2.capture.silenceBuffer.getChannelData(0).fill(0.0); var silence_callback = function() { SDL2.capture.currentCaptureBuffer = SDL2.capture.silenceBuffer; dynCall('vi', $2, [$3]); }; SDL2.capture.silenceTimer = setTimeout(silence_callback, ($1 / SDL2.audioContext.sampleRate) * 1000); if ((navigator.mediaDevices !== undefined) && (navigator.mediaDevices.getUserMedia !== undefined)) { navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(have_microphone).catch(no_microphone); } else if (navigator.webkitGetUserMedia !== undefined) { navigator.webkitGetUserMedia({ audio: true, video: false }, have_microphone, no_microphone); }},  
 308732: function($0, $1, $2, $3) {var SDL2 = Module['SDL2']; SDL2.audio.scriptProcessorNode = SDL2.audioContext['createScriptProcessor']($1, 0, $0); SDL2.audio.scriptProcessorNode['onaudioprocess'] = function (e) { if ((SDL2 === undefined) || (SDL2.audio === undefined)) { return; } SDL2.audio.currentOutputBuffer = e['outputBuffer']; dynCall('vi', $2, [$3]); }; SDL2.audio.scriptProcessorNode['connect'](SDL2.audioContext['destination']);},  
 309142: function($0, $1) {var SDL2 = Module['SDL2']; var numChannels = SDL2.capture.currentCaptureBuffer.numberOfChannels; for (var c = 0; c < numChannels; ++c) { var channelData = SDL2.capture.currentCaptureBuffer.getChannelData(c); if (channelData.length != $1) { throw 'Web Audio capture buffer length mismatch! Destination size: ' + channelData.length + ' samples vs expected ' + $1 + ' samples!'; } if (numChannels == 1) { for (var j = 0; j < $1; ++j) { setValue($0 + (j * 4), channelData[j], 'float'); } } else { for (var j = 0; j < $1; ++j) { setValue($0 + (((j * numChannels) + c) * 4), channelData[j], 'float'); } } }},  
 309747: function($0, $1) {var SDL2 = Module['SDL2']; var numChannels = SDL2.audio.currentOutputBuffer['numberOfChannels']; for (var c = 0; c < numChannels; ++c) { var channelData = SDL2.audio.currentOutputBuffer['getChannelData'](c); if (channelData.length != $1) { throw 'Web Audio output buffer length mismatch! Destination size: ' + channelData.length + ' samples vs expected ' + $1 + ' samples!'; } for (var j = 0; j < $1; ++j) { channelData[j] = HEAPF32[$0 + ((j*numChannels + c) << 2) >> 2]; } }},  
 310227: function($0) {var SDL2 = Module['SDL2']; if ($0) { if (SDL2.capture.silenceTimer !== undefined) { clearTimeout(SDL2.capture.silenceTimer); } if (SDL2.capture.stream !== undefined) { var tracks = SDL2.capture.stream.getAudioTracks(); for (var i = 0; i < tracks.length; i++) { SDL2.capture.stream.removeTrack(tracks[i]); } SDL2.capture.stream = undefined; } if (SDL2.capture.scriptProcessorNode !== undefined) { SDL2.capture.scriptProcessorNode.onaudioprocess = function(audioProcessingEvent) {}; SDL2.capture.scriptProcessorNode.disconnect(); SDL2.capture.scriptProcessorNode = undefined; } if (SDL2.capture.mediaStreamNode !== undefined) { SDL2.capture.mediaStreamNode.disconnect(); SDL2.capture.mediaStreamNode = undefined; } if (SDL2.capture.silenceBuffer !== undefined) { SDL2.capture.silenceBuffer = undefined } SDL2.capture = undefined; } else { if (SDL2.audio.scriptProcessorNode != undefined) { SDL2.audio.scriptProcessorNode.disconnect(); SDL2.audio.scriptProcessorNode = undefined; } SDL2.audio = undefined; } if ((SDL2.audioContext !== undefined) && (SDL2.audio === undefined) && (SDL2.capture === undefined)) { SDL2.audioContext.close(); SDL2.audioContext = undefined; }}
};

function _emscripten_asm_const_iii(code, sigPtr, argbuf) {
  var args = readAsmConstArgs(sigPtr, argbuf);

  return ASM_CONSTS[code].apply(null, args);
}



// STATICTOP = STATIC_BASE + 888976;
/* global initializers */  __ATINIT__.push({ func: function() { ___wasm_call_ctors() } });




/* no memory initializer */
// {{PRE_LIBRARY}}


  function abortStackOverflow(allocSize) {
      abort('Stack overflow! Attempted to allocate ' + allocSize + ' bytes on the stack, but stack has only ' + (STACK_MAX - stackSave() + allocSize) + ' bytes available!');
    }

  
  function listenOnce(object, event, func) {
      object.addEventListener(event, func, { 'once': true });
    }function autoResumeAudioContext(ctx, elements) {
      if (!elements) {
        elements = [document, document.getElementById('canvas')];
      }
      ['keydown', 'mousedown', 'touchstart'].forEach(function(event) {
        elements.forEach(function(element) {
          if (element) {
            listenOnce(element, event, function() {
              if (ctx.state === 'suspended') ctx.resume();
            });
          }
        });
      });
    }

  function demangle(func) {
      warnOnce('warning: build with  -s DEMANGLE_SUPPORT=1  to link in libcxxabi demangling');
      return func;
    }

  function demangleAll(text) {
      var regex =
        /\b_Z[\w\d_]+/g;
      return text.replace(regex,
        function(x) {
          var y = demangle(x);
          return x === y ? x : (y + ' [' + x + ']');
        });
    }

  function jsStackTrace() {
      var err = new Error();
      if (!err.stack) {
        // IE10+ special cases: It does have callstack info, but it is only populated if an Error object is thrown,
        // so try that as a special-case.
        try {
          throw new Error();
        } catch(e) {
          err = e;
        }
        if (!err.stack) {
          return '(no stack trace available)';
        }
      }
      return err.stack.toString();
    }

  function stackTrace() {
      var js = jsStackTrace();
      if (Module['extraStackTrace']) js += '\n' + Module['extraStackTrace']();
      return demangleAll(js);
    }

  function ___assert_fail(condition, filename, line, func) {
      abort('Assertion failed: ' + UTF8ToString(condition) + ', at: ' + [filename ? UTF8ToString(filename) : 'unknown filename', line, func ? UTF8ToString(func) : 'unknown function']);
    }

  function ___cxa_allocate_exception(size) {
      return _malloc(size);
    }

  
  function _atexit(func, arg) {
      warnOnce('atexit() called, but EXIT_RUNTIME is not set, so atexits() will not be called. set EXIT_RUNTIME to 1 (see the FAQ)');
  
    }function ___cxa_atexit(a0,a1
  ) {
  return _atexit(a0,a1);
  }

  
  var exceptionInfos={};
  
  var exceptionLast=0;
  
  function __ZSt18uncaught_exceptionv() { // std::uncaught_exception()
      return __ZSt18uncaught_exceptionv.uncaught_exceptions > 0;
    }function ___cxa_throw(ptr, type, destructor) {
      exceptionInfos[ptr] = {
        ptr: ptr,
        adjusted: [ptr],
        type: type,
        destructor: destructor,
        refcount: 0,
        caught: false,
        rethrown: false
      };
      exceptionLast = ptr;
      if (!("uncaught_exception" in __ZSt18uncaught_exceptionv)) {
        __ZSt18uncaught_exceptionv.uncaught_exceptions = 1;
      } else {
        __ZSt18uncaught_exceptionv.uncaught_exceptions++;
      }
      throw ptr + " - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch.";
    }

  function ___handle_stack_overflow() {
      abort('stack overflow')
    }

  
  function setErrNo(value) {
      HEAP32[((___errno_location())>>2)]=value;
      return value;
    }function ___map_file(pathname, size) {
      setErrNo(63);
      return -1;
    }

  
  
  var PATH={splitPath:function(filename) {
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1);
      },normalizeArray:function(parts, allowAboveRoot) {
        // if the path tries to go above the root, `up` ends up > 0
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
          var last = parts[i];
          if (last === '.') {
            parts.splice(i, 1);
          } else if (last === '..') {
            parts.splice(i, 1);
            up++;
          } else if (up) {
            parts.splice(i, 1);
            up--;
          }
        }
        // if the path is allowed to go above the root, restore leading ..s
        if (allowAboveRoot) {
          for (; up; up--) {
            parts.unshift('..');
          }
        }
        return parts;
      },normalize:function(path) {
        var isAbsolute = path.charAt(0) === '/',
            trailingSlash = path.substr(-1) === '/';
        // Normalize the path
        path = PATH.normalizeArray(path.split('/').filter(function(p) {
          return !!p;
        }), !isAbsolute).join('/');
        if (!path && !isAbsolute) {
          path = '.';
        }
        if (path && trailingSlash) {
          path += '/';
        }
        return (isAbsolute ? '/' : '') + path;
      },dirname:function(path) {
        var result = PATH.splitPath(path),
            root = result[0],
            dir = result[1];
        if (!root && !dir) {
          // No dirname whatsoever
          return '.';
        }
        if (dir) {
          // It has a dirname, strip trailing slash
          dir = dir.substr(0, dir.length - 1);
        }
        return root + dir;
      },basename:function(path) {
        // EMSCRIPTEN return '/'' for '/', not an empty string
        if (path === '/') return '/';
        var lastSlash = path.lastIndexOf('/');
        if (lastSlash === -1) return path;
        return path.substr(lastSlash+1);
      },extname:function(path) {
        return PATH.splitPath(path)[3];
      },join:function() {
        var paths = Array.prototype.slice.call(arguments, 0);
        return PATH.normalize(paths.join('/'));
      },join2:function(l, r) {
        return PATH.normalize(l + '/' + r);
      }};
  
  
  var PATH_FS={resolve:function() {
        var resolvedPath = '',
          resolvedAbsolute = false;
        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
          var path = (i >= 0) ? arguments[i] : FS.cwd();
          // Skip empty and invalid entries
          if (typeof path !== 'string') {
            throw new TypeError('Arguments to path.resolve must be strings');
          } else if (!path) {
            return ''; // an invalid portion invalidates the whole thing
          }
          resolvedPath = path + '/' + resolvedPath;
          resolvedAbsolute = path.charAt(0) === '/';
        }
        // At this point the path should be resolved to a full absolute path, but
        // handle relative paths to be safe (might happen when process.cwd() fails)
        resolvedPath = PATH.normalizeArray(resolvedPath.split('/').filter(function(p) {
          return !!p;
        }), !resolvedAbsolute).join('/');
        return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
      },relative:function(from, to) {
        from = PATH_FS.resolve(from).substr(1);
        to = PATH_FS.resolve(to).substr(1);
        function trim(arr) {
          var start = 0;
          for (; start < arr.length; start++) {
            if (arr[start] !== '') break;
          }
          var end = arr.length - 1;
          for (; end >= 0; end--) {
            if (arr[end] !== '') break;
          }
          if (start > end) return [];
          return arr.slice(start, end - start + 1);
        }
        var fromParts = trim(from.split('/'));
        var toParts = trim(to.split('/'));
        var length = Math.min(fromParts.length, toParts.length);
        var samePartsLength = length;
        for (var i = 0; i < length; i++) {
          if (fromParts[i] !== toParts[i]) {
            samePartsLength = i;
            break;
          }
        }
        var outputParts = [];
        for (var i = samePartsLength; i < fromParts.length; i++) {
          outputParts.push('..');
        }
        outputParts = outputParts.concat(toParts.slice(samePartsLength));
        return outputParts.join('/');
      }};
  
  var TTY={ttys:[],init:function () {
        // https://github.com/emscripten-core/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // currently, FS.init does not distinguish if process.stdin is a file or TTY
        //   // device, it always assumes it's a TTY device. because of this, we're forcing
        //   // process.stdin to UTF8 encoding to at least make stdin reading compatible
        //   // with text files until FS.init can be refactored.
        //   process['stdin']['setEncoding']('utf8');
        // }
      },shutdown:function() {
        // https://github.com/emscripten-core/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // inolen: any idea as to why node -e 'process.stdin.read()' wouldn't exit immediately (with process.stdin being a tty)?
        //   // isaacs: because now it's reading from the stream, you've expressed interest in it, so that read() kicks off a _read() which creates a ReadReq operation
        //   // inolen: I thought read() in that case was a synchronous operation that just grabbed some amount of buffered data if it exists?
        //   // isaacs: it is. but it also triggers a _read() call, which calls readStart() on the handle
        //   // isaacs: do process.stdin.pause() and i'd think it'd probably close the pending call
        //   process['stdin']['pause']();
        // }
      },register:function(dev, ops) {
        TTY.ttys[dev] = { input: [], output: [], ops: ops };
        FS.registerDevice(dev, TTY.stream_ops);
      },stream_ops:{open:function(stream) {
          var tty = TTY.ttys[stream.node.rdev];
          if (!tty) {
            throw new FS.ErrnoError(43);
          }
          stream.tty = tty;
          stream.seekable = false;
        },close:function(stream) {
          // flush any pending line data
          stream.tty.ops.flush(stream.tty);
        },flush:function(stream) {
          stream.tty.ops.flush(stream.tty);
        },read:function(stream, buffer, offset, length, pos /* ignored */) {
          if (!stream.tty || !stream.tty.ops.get_char) {
            throw new FS.ErrnoError(60);
          }
          var bytesRead = 0;
          for (var i = 0; i < length; i++) {
            var result;
            try {
              result = stream.tty.ops.get_char(stream.tty);
            } catch (e) {
              throw new FS.ErrnoError(29);
            }
            if (result === undefined && bytesRead === 0) {
              throw new FS.ErrnoError(6);
            }
            if (result === null || result === undefined) break;
            bytesRead++;
            buffer[offset+i] = result;
          }
          if (bytesRead) {
            stream.node.timestamp = Date.now();
          }
          return bytesRead;
        },write:function(stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.put_char) {
            throw new FS.ErrnoError(60);
          }
          try {
            for (var i = 0; i < length; i++) {
              stream.tty.ops.put_char(stream.tty, buffer[offset+i]);
            }
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
          if (length) {
            stream.node.timestamp = Date.now();
          }
          return i;
        }},default_tty_ops:{get_char:function(tty) {
          if (!tty.input.length) {
            var result = null;
            if (ENVIRONMENT_IS_NODE) {
              // we will read data by chunks of BUFSIZE
              var BUFSIZE = 256;
              var buf = Buffer.alloc ? Buffer.alloc(BUFSIZE) : new Buffer(BUFSIZE);
              var bytesRead = 0;
  
              try {
                bytesRead = nodeFS.readSync(process.stdin.fd, buf, 0, BUFSIZE, null);
              } catch(e) {
                // Cross-platform differences: on Windows, reading EOF throws an exception, but on other OSes,
                // reading EOF returns 0. Uniformize behavior by treating the EOF exception to return 0.
                if (e.toString().indexOf('EOF') != -1) bytesRead = 0;
                else throw e;
              }
  
              if (bytesRead > 0) {
                result = buf.slice(0, bytesRead).toString('utf-8');
              } else {
                result = null;
              }
            } else
            if (typeof window != 'undefined' &&
              typeof window.prompt == 'function') {
              // Browser.
              result = window.prompt('Input: ');  // returns null on cancel
              if (result !== null) {
                result += '\n';
              }
            } else if (typeof readline == 'function') {
              // Command line.
              result = readline();
              if (result !== null) {
                result += '\n';
              }
            }
            if (!result) {
              return null;
            }
            tty.input = intArrayFromString(result, true);
          }
          return tty.input.shift();
        },put_char:function(tty, val) {
          if (val === null || val === 10) {
            out(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          } else {
            if (val != 0) tty.output.push(val); // val == 0 would cut text output off in the middle.
          }
        },flush:function(tty) {
          if (tty.output && tty.output.length > 0) {
            out(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          }
        }},default_tty1_ops:{put_char:function(tty, val) {
          if (val === null || val === 10) {
            err(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          } else {
            if (val != 0) tty.output.push(val);
          }
        },flush:function(tty) {
          if (tty.output && tty.output.length > 0) {
            err(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          }
        }}};
  
  var MEMFS={ops_table:null,mount:function(mount) {
        return MEMFS.createNode(null, '/', 16384 | 511 /* 0777 */, 0);
      },createNode:function(parent, name, mode, dev) {
        if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
          // no supported
          throw new FS.ErrnoError(63);
        }
        if (!MEMFS.ops_table) {
          MEMFS.ops_table = {
            dir: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                lookup: MEMFS.node_ops.lookup,
                mknod: MEMFS.node_ops.mknod,
                rename: MEMFS.node_ops.rename,
                unlink: MEMFS.node_ops.unlink,
                rmdir: MEMFS.node_ops.rmdir,
                readdir: MEMFS.node_ops.readdir,
                symlink: MEMFS.node_ops.symlink
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek
              }
            },
            file: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek,
                read: MEMFS.stream_ops.read,
                write: MEMFS.stream_ops.write,
                allocate: MEMFS.stream_ops.allocate,
                mmap: MEMFS.stream_ops.mmap,
                msync: MEMFS.stream_ops.msync
              }
            },
            link: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                readlink: MEMFS.node_ops.readlink
              },
              stream: {}
            },
            chrdev: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: FS.chrdev_stream_ops
            }
          };
        }
        var node = FS.createNode(parent, name, mode, dev);
        if (FS.isDir(node.mode)) {
          node.node_ops = MEMFS.ops_table.dir.node;
          node.stream_ops = MEMFS.ops_table.dir.stream;
          node.contents = {};
        } else if (FS.isFile(node.mode)) {
          node.node_ops = MEMFS.ops_table.file.node;
          node.stream_ops = MEMFS.ops_table.file.stream;
          node.usedBytes = 0; // The actual number of bytes used in the typed array, as opposed to contents.length which gives the whole capacity.
          // When the byte data of the file is populated, this will point to either a typed array, or a normal JS array. Typed arrays are preferred
          // for performance, and used by default. However, typed arrays are not resizable like normal JS arrays are, so there is a small disk size
          // penalty involved for appending file writes that continuously grow a file similar to std::vector capacity vs used -scheme.
          node.contents = null; 
        } else if (FS.isLink(node.mode)) {
          node.node_ops = MEMFS.ops_table.link.node;
          node.stream_ops = MEMFS.ops_table.link.stream;
        } else if (FS.isChrdev(node.mode)) {
          node.node_ops = MEMFS.ops_table.chrdev.node;
          node.stream_ops = MEMFS.ops_table.chrdev.stream;
        }
        node.timestamp = Date.now();
        // add the new node to the parent
        if (parent) {
          parent.contents[name] = node;
        }
        return node;
      },getFileDataAsRegularArray:function(node) {
        if (node.contents && node.contents.subarray) {
          var arr = [];
          for (var i = 0; i < node.usedBytes; ++i) arr.push(node.contents[i]);
          return arr; // Returns a copy of the original data.
        }
        return node.contents; // No-op, the file contents are already in a JS array. Return as-is.
      },getFileDataAsTypedArray:function(node) {
        if (!node.contents) return new Uint8Array(0);
        if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes); // Make sure to not return excess unused bytes.
        return new Uint8Array(node.contents);
      },expandFileStorage:function(node, newCapacity) {
        var prevCapacity = node.contents ? node.contents.length : 0;
        if (prevCapacity >= newCapacity) return; // No need to expand, the storage was already large enough.
        // Don't expand strictly to the given requested limit if it's only a very small increase, but instead geometrically grow capacity.
        // For small filesizes (<1MB), perform size*2 geometric increase, but for large sizes, do a much more conservative size*1.125 increase to
        // avoid overshooting the allocation cap by a very large margin.
        var CAPACITY_DOUBLING_MAX = 1024 * 1024;
        newCapacity = Math.max(newCapacity, (prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2.0 : 1.125)) >>> 0);
        if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256); // At minimum allocate 256b for each file when expanding.
        var oldContents = node.contents;
        node.contents = new Uint8Array(newCapacity); // Allocate new storage.
        if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0); // Copy old data over to the new storage.
        return;
      },resizeFileStorage:function(node, newSize) {
        if (node.usedBytes == newSize) return;
        if (newSize == 0) {
          node.contents = null; // Fully decommit when requesting a resize to zero.
          node.usedBytes = 0;
          return;
        }
        if (!node.contents || node.contents.subarray) { // Resize a typed array if that is being used as the backing store.
          var oldContents = node.contents;
          node.contents = new Uint8Array(newSize); // Allocate new storage.
          if (oldContents) {
            node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes))); // Copy old data over to the new storage.
          }
          node.usedBytes = newSize;
          return;
        }
        // Backing with a JS array.
        if (!node.contents) node.contents = [];
        if (node.contents.length > newSize) node.contents.length = newSize;
        else while (node.contents.length < newSize) node.contents.push(0);
        node.usedBytes = newSize;
      },node_ops:{getattr:function(node) {
          var attr = {};
          // device numbers reuse inode numbers.
          attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
          attr.ino = node.id;
          attr.mode = node.mode;
          attr.nlink = 1;
          attr.uid = 0;
          attr.gid = 0;
          attr.rdev = node.rdev;
          if (FS.isDir(node.mode)) {
            attr.size = 4096;
          } else if (FS.isFile(node.mode)) {
            attr.size = node.usedBytes;
          } else if (FS.isLink(node.mode)) {
            attr.size = node.link.length;
          } else {
            attr.size = 0;
          }
          attr.atime = new Date(node.timestamp);
          attr.mtime = new Date(node.timestamp);
          attr.ctime = new Date(node.timestamp);
          // NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),
          //       but this is not required by the standard.
          attr.blksize = 4096;
          attr.blocks = Math.ceil(attr.size / attr.blksize);
          return attr;
        },setattr:function(node, attr) {
          if (attr.mode !== undefined) {
            node.mode = attr.mode;
          }
          if (attr.timestamp !== undefined) {
            node.timestamp = attr.timestamp;
          }
          if (attr.size !== undefined) {
            MEMFS.resizeFileStorage(node, attr.size);
          }
        },lookup:function(parent, name) {
          throw FS.genericErrors[44];
        },mknod:function(parent, name, mode, dev) {
          return MEMFS.createNode(parent, name, mode, dev);
        },rename:function(old_node, new_dir, new_name) {
          // if we're overwriting a directory at new_name, make sure it's empty.
          if (FS.isDir(old_node.mode)) {
            var new_node;
            try {
              new_node = FS.lookupNode(new_dir, new_name);
            } catch (e) {
            }
            if (new_node) {
              for (var i in new_node.contents) {
                throw new FS.ErrnoError(55);
              }
            }
          }
          // do the internal rewiring
          delete old_node.parent.contents[old_node.name];
          old_node.name = new_name;
          new_dir.contents[new_name] = old_node;
          old_node.parent = new_dir;
        },unlink:function(parent, name) {
          delete parent.contents[name];
        },rmdir:function(parent, name) {
          var node = FS.lookupNode(parent, name);
          for (var i in node.contents) {
            throw new FS.ErrnoError(55);
          }
          delete parent.contents[name];
        },readdir:function(node) {
          var entries = ['.', '..'];
          for (var key in node.contents) {
            if (!node.contents.hasOwnProperty(key)) {
              continue;
            }
            entries.push(key);
          }
          return entries;
        },symlink:function(parent, newname, oldpath) {
          var node = MEMFS.createNode(parent, newname, 511 /* 0777 */ | 40960, 0);
          node.link = oldpath;
          return node;
        },readlink:function(node) {
          if (!FS.isLink(node.mode)) {
            throw new FS.ErrnoError(28);
          }
          return node.link;
        }},stream_ops:{read:function(stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= stream.node.usedBytes) return 0;
          var size = Math.min(stream.node.usedBytes - position, length);
          assert(size >= 0);
          if (size > 8 && contents.subarray) { // non-trivial, and typed array
            buffer.set(contents.subarray(position, position + size), offset);
          } else {
            for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i];
          }
          return size;
        },write:function(stream, buffer, offset, length, position, canOwn) {
          // The data buffer should be a typed array view
          assert(!(buffer instanceof ArrayBuffer));
          // If the buffer is located in main memory (HEAP), and if
          // memory can grow, we can't hold on to references of the
          // memory buffer, as they may get invalidated. That means we
          // need to do copy its contents.
          if (buffer.buffer === HEAP8.buffer) {
            // FIXME: this is inefficient as the file packager may have
            //        copied the data into memory already - we may want to
            //        integrate more there and let the file packager loading
            //        code be able to query if memory growth is on or off.
            if (canOwn) {
              warnOnce('file packager has copied file data into memory, but in memory growth we are forced to copy it again (see --no-heap-copy)');
            }
            canOwn = false;
          }
  
          if (!length) return 0;
          var node = stream.node;
          node.timestamp = Date.now();
  
          if (buffer.subarray && (!node.contents || node.contents.subarray)) { // This write is from a typed array to a typed array?
            if (canOwn) {
              assert(position === 0, 'canOwn must imply no weird position inside the file');
              node.contents = buffer.subarray(offset, offset + length);
              node.usedBytes = length;
              return length;
            } else if (node.usedBytes === 0 && position === 0) { // If this is a simple first write to an empty file, do a fast set since we don't need to care about old data.
              node.contents = buffer.slice(offset, offset + length);
              node.usedBytes = length;
              return length;
            } else if (position + length <= node.usedBytes) { // Writing to an already allocated and used subrange of the file?
              node.contents.set(buffer.subarray(offset, offset + length), position);
              return length;
            }
          }
  
          // Appending to an existing file and we need to reallocate, or source data did not come as a typed array.
          MEMFS.expandFileStorage(node, position+length);
          if (node.contents.subarray && buffer.subarray) {
            // Use typed array write which is available.
            node.contents.set(buffer.subarray(offset, offset + length), position);
          } else {
            for (var i = 0; i < length; i++) {
             node.contents[position + i] = buffer[offset + i]; // Or fall back to manual write if not.
            }
          }
          node.usedBytes = Math.max(node.usedBytes, position + length);
          return length;
        },llseek:function(stream, offset, whence) {
          var position = offset;
          if (whence === 1) {
            position += stream.position;
          } else if (whence === 2) {
            if (FS.isFile(stream.node.mode)) {
              position += stream.node.usedBytes;
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(28);
          }
          return position;
        },allocate:function(stream, offset, length) {
          MEMFS.expandFileStorage(stream.node, offset + length);
          stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length);
        },mmap:function(stream, address, length, position, prot, flags) {
          // We don't currently support location hints for the address of the mapping
          assert(address === 0);
  
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(43);
          }
          var ptr;
          var allocated;
          var contents = stream.node.contents;
          // Only make a new copy when MAP_PRIVATE is specified.
          if (!(flags & 2) && contents.buffer === buffer) {
            // We can't emulate MAP_SHARED when the file is not backed by the buffer
            // we're mapping to (e.g. the HEAP buffer).
            allocated = false;
            ptr = contents.byteOffset;
          } else {
            // Try to avoid unnecessary slices.
            if (position > 0 || position + length < contents.length) {
              if (contents.subarray) {
                contents = contents.subarray(position, position + length);
              } else {
                contents = Array.prototype.slice.call(contents, position, position + length);
              }
            }
            allocated = true;
            ptr = FS.mmapAlloc(length);
            if (!ptr) {
              throw new FS.ErrnoError(48);
            }
            HEAP8.set(contents, ptr);
          }
          return { ptr: ptr, allocated: allocated };
        },msync:function(stream, buffer, offset, length, mmapFlags) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(43);
          }
          if (mmapFlags & 2) {
            // MAP_PRIVATE calls need not to be synced back to underlying fs
            return 0;
          }
  
          var bytesWritten = MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
          // should we check if bytesWritten and length are the same?
          return 0;
        }}};
  
  var IDBFS={dbs:{},indexedDB:function() {
        if (typeof indexedDB !== 'undefined') return indexedDB;
        var ret = null;
        if (typeof window === 'object') ret = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        assert(ret, 'IDBFS used, but indexedDB not supported');
        return ret;
      },DB_VERSION:21,DB_STORE_NAME:"FILE_DATA",mount:function(mount) {
        // reuse all of the core MEMFS functionality
        return MEMFS.mount.apply(null, arguments);
      },syncfs:function(mount, populate, callback) {
        IDBFS.getLocalSet(mount, function(err, local) {
          if (err) return callback(err);
  
          IDBFS.getRemoteSet(mount, function(err, remote) {
            if (err) return callback(err);
  
            var src = populate ? remote : local;
            var dst = populate ? local : remote;
  
            IDBFS.reconcile(src, dst, callback);
          });
        });
      },getDB:function(name, callback) {
        // check the cache first
        var db = IDBFS.dbs[name];
        if (db) {
          return callback(null, db);
        }
  
        var req;
        try {
          req = IDBFS.indexedDB().open(name, IDBFS.DB_VERSION);
        } catch (e) {
          return callback(e);
        }
        if (!req) {
          return callback("Unable to connect to IndexedDB");
        }
        req.onupgradeneeded = function(e) {
          var db = e.target.result;
          var transaction = e.target.transaction;
  
          var fileStore;
  
          if (db.objectStoreNames.contains(IDBFS.DB_STORE_NAME)) {
            fileStore = transaction.objectStore(IDBFS.DB_STORE_NAME);
          } else {
            fileStore = db.createObjectStore(IDBFS.DB_STORE_NAME);
          }
  
          if (!fileStore.indexNames.contains('timestamp')) {
            fileStore.createIndex('timestamp', 'timestamp', { unique: false });
          }
        };
        req.onsuccess = function() {
          db = req.result;
  
          // add to the cache
          IDBFS.dbs[name] = db;
          callback(null, db);
        };
        req.onerror = function(e) {
          callback(this.error);
          e.preventDefault();
        };
      },getLocalSet:function(mount, callback) {
        var entries = {};
  
        function isRealDir(p) {
          return p !== '.' && p !== '..';
        };
        function toAbsolute(root) {
          return function(p) {
            return PATH.join2(root, p);
          }
        };
  
        var check = FS.readdir(mount.mountpoint).filter(isRealDir).map(toAbsolute(mount.mountpoint));
  
        while (check.length) {
          var path = check.pop();
          var stat;
  
          try {
            stat = FS.stat(path);
          } catch (e) {
            return callback(e);
          }
  
          if (FS.isDir(stat.mode)) {
            check.push.apply(check, FS.readdir(path).filter(isRealDir).map(toAbsolute(path)));
          }
  
          entries[path] = { 'timestamp': stat.mtime };
        }
  
        return callback(null, { type: 'local', entries: entries });
      },getRemoteSet:function(mount, callback) {
        var entries = {};
  
        IDBFS.getDB(mount.mountpoint, function(err, db) {
          if (err) return callback(err);
  
          try {
            var transaction = db.transaction([IDBFS.DB_STORE_NAME], 'readonly');
            transaction.onerror = function(e) {
              callback(this.error);
              e.preventDefault();
            };
  
            var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
            var index = store.index('timestamp');
  
            index.openKeyCursor().onsuccess = function(event) {
              var cursor = event.target.result;
  
              if (!cursor) {
                return callback(null, { type: 'remote', db: db, entries: entries });
              }
  
              entries[cursor.primaryKey] = { 'timestamp': cursor.key };
  
              cursor.continue();
            };
          } catch (e) {
            return callback(e);
          }
        });
      },loadLocalEntry:function(path, callback) {
        var stat, node;
  
        try {
          var lookup = FS.lookupPath(path);
          node = lookup.node;
          stat = FS.stat(path);
        } catch (e) {
          return callback(e);
        }
  
        if (FS.isDir(stat.mode)) {
          return callback(null, { 'timestamp': stat.mtime, 'mode': stat.mode });
        } else if (FS.isFile(stat.mode)) {
          // Performance consideration: storing a normal JavaScript array to a IndexedDB is much slower than storing a typed array.
          // Therefore always convert the file contents to a typed array first before writing the data to IndexedDB.
          node.contents = MEMFS.getFileDataAsTypedArray(node);
          return callback(null, { 'timestamp': stat.mtime, 'mode': stat.mode, 'contents': node.contents });
        } else {
          return callback(new Error('node type not supported'));
        }
      },storeLocalEntry:function(path, entry, callback) {
        try {
          if (FS.isDir(entry['mode'])) {
            FS.mkdir(path, entry['mode']);
          } else if (FS.isFile(entry['mode'])) {
            FS.writeFile(path, entry['contents'], { canOwn: true });
          } else {
            return callback(new Error('node type not supported'));
          }
  
          FS.chmod(path, entry['mode']);
          FS.utime(path, entry['timestamp'], entry['timestamp']);
        } catch (e) {
          return callback(e);
        }
  
        callback(null);
      },removeLocalEntry:function(path, callback) {
        try {
          var lookup = FS.lookupPath(path);
          var stat = FS.stat(path);
  
          if (FS.isDir(stat.mode)) {
            FS.rmdir(path);
          } else if (FS.isFile(stat.mode)) {
            FS.unlink(path);
          }
        } catch (e) {
          return callback(e);
        }
  
        callback(null);
      },loadRemoteEntry:function(store, path, callback) {
        var req = store.get(path);
        req.onsuccess = function(event) { callback(null, event.target.result); };
        req.onerror = function(e) {
          callback(this.error);
          e.preventDefault();
        };
      },storeRemoteEntry:function(store, path, entry, callback) {
        var req = store.put(entry, path);
        req.onsuccess = function() { callback(null); };
        req.onerror = function(e) {
          callback(this.error);
          e.preventDefault();
        };
      },removeRemoteEntry:function(store, path, callback) {
        var req = store.delete(path);
        req.onsuccess = function() { callback(null); };
        req.onerror = function(e) {
          callback(this.error);
          e.preventDefault();
        };
      },reconcile:function(src, dst, callback) {
        var total = 0;
  
        var create = [];
        Object.keys(src.entries).forEach(function (key) {
          var e = src.entries[key];
          var e2 = dst.entries[key];
          if (!e2 || e['timestamp'] > e2['timestamp']) {
            create.push(key);
            total++;
          }
        });
  
        var remove = [];
        Object.keys(dst.entries).forEach(function (key) {
          var e = dst.entries[key];
          var e2 = src.entries[key];
          if (!e2) {
            remove.push(key);
            total++;
          }
        });
  
        if (!total) {
          return callback(null);
        }
  
        var errored = false;
        var db = src.type === 'remote' ? src.db : dst.db;
        var transaction = db.transaction([IDBFS.DB_STORE_NAME], 'readwrite');
        var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
  
        function done(err) {
          if (err && !errored) {
            errored = true;
            return callback(err);
          }
        };
  
        transaction.onerror = function(e) {
          done(this.error);
          e.preventDefault();
        };
  
        transaction.oncomplete = function(e) {
          if (!errored) {
            callback(null);
          }
        };
  
        // sort paths in ascending order so directory entries are created
        // before the files inside them
        create.sort().forEach(function (path) {
          if (dst.type === 'local') {
            IDBFS.loadRemoteEntry(store, path, function (err, entry) {
              if (err) return done(err);
              IDBFS.storeLocalEntry(path, entry, done);
            });
          } else {
            IDBFS.loadLocalEntry(path, function (err, entry) {
              if (err) return done(err);
              IDBFS.storeRemoteEntry(store, path, entry, done);
            });
          }
        });
  
        // sort paths in descending order so files are deleted before their
        // parent directories
        remove.sort().reverse().forEach(function(path) {
          if (dst.type === 'local') {
            IDBFS.removeLocalEntry(path, done);
          } else {
            IDBFS.removeRemoteEntry(store, path, done);
          }
        });
      }};
  
  var ERRNO_MESSAGES={0:"Success",1:"Arg list too long",2:"Permission denied",3:"Address already in use",4:"Address not available",5:"Address family not supported by protocol family",6:"No more processes",7:"Socket already connected",8:"Bad file number",9:"Trying to read unreadable message",10:"Mount device busy",11:"Operation canceled",12:"No children",13:"Connection aborted",14:"Connection refused",15:"Connection reset by peer",16:"File locking deadlock error",17:"Destination address required",18:"Math arg out of domain of func",19:"Quota exceeded",20:"File exists",21:"Bad address",22:"File too large",23:"Host is unreachable",24:"Identifier removed",25:"Illegal byte sequence",26:"Connection already in progress",27:"Interrupted system call",28:"Invalid argument",29:"I/O error",30:"Socket is already connected",31:"Is a directory",32:"Too many symbolic links",33:"Too many open files",34:"Too many links",35:"Message too long",36:"Multihop attempted",37:"File or path name too long",38:"Network interface is not configured",39:"Connection reset by network",40:"Network is unreachable",41:"Too many open files in system",42:"No buffer space available",43:"No such device",44:"No such file or directory",45:"Exec format error",46:"No record locks available",47:"The link has been severed",48:"Not enough core",49:"No message of desired type",50:"Protocol not available",51:"No space left on device",52:"Function not implemented",53:"Socket is not connected",54:"Not a directory",55:"Directory not empty",56:"State not recoverable",57:"Socket operation on non-socket",59:"Not a typewriter",60:"No such device or address",61:"Value too large for defined data type",62:"Previous owner died",63:"Not super-user",64:"Broken pipe",65:"Protocol error",66:"Unknown protocol",67:"Protocol wrong type for socket",68:"Math result not representable",69:"Read only file system",70:"Illegal seek",71:"No such process",72:"Stale file handle",73:"Connection timed out",74:"Text file busy",75:"Cross-device link",100:"Device not a stream",101:"Bad font file fmt",102:"Invalid slot",103:"Invalid request code",104:"No anode",105:"Block device required",106:"Channel number out of range",107:"Level 3 halted",108:"Level 3 reset",109:"Link number out of range",110:"Protocol driver not attached",111:"No CSI structure available",112:"Level 2 halted",113:"Invalid exchange",114:"Invalid request descriptor",115:"Exchange full",116:"No data (for no delay io)",117:"Timer expired",118:"Out of streams resources",119:"Machine is not on the network",120:"Package not installed",121:"The object is remote",122:"Advertise error",123:"Srmount error",124:"Communication error on send",125:"Cross mount point (not really error)",126:"Given log. name not unique",127:"f.d. invalid for this operation",128:"Remote address changed",129:"Can   access a needed shared lib",130:"Accessing a corrupted shared lib",131:".lib section in a.out corrupted",132:"Attempting to link in too many libs",133:"Attempting to exec a shared library",135:"Streams pipe error",136:"Too many users",137:"Socket type not supported",138:"Not supported",139:"Protocol family not supported",140:"Can't send after socket shutdown",141:"Too many references",142:"Host is down",148:"No medium (in tape drive)",156:"Level 2 not synchronized"};
  
  var ERRNO_CODES={EPERM:63,ENOENT:44,ESRCH:71,EINTR:27,EIO:29,ENXIO:60,E2BIG:1,ENOEXEC:45,EBADF:8,ECHILD:12,EAGAIN:6,EWOULDBLOCK:6,ENOMEM:48,EACCES:2,EFAULT:21,ENOTBLK:105,EBUSY:10,EEXIST:20,EXDEV:75,ENODEV:43,ENOTDIR:54,EISDIR:31,EINVAL:28,ENFILE:41,EMFILE:33,ENOTTY:59,ETXTBSY:74,EFBIG:22,ENOSPC:51,ESPIPE:70,EROFS:69,EMLINK:34,EPIPE:64,EDOM:18,ERANGE:68,ENOMSG:49,EIDRM:24,ECHRNG:106,EL2NSYNC:156,EL3HLT:107,EL3RST:108,ELNRNG:109,EUNATCH:110,ENOCSI:111,EL2HLT:112,EDEADLK:16,ENOLCK:46,EBADE:113,EBADR:114,EXFULL:115,ENOANO:104,EBADRQC:103,EBADSLT:102,EDEADLOCK:16,EBFONT:101,ENOSTR:100,ENODATA:116,ETIME:117,ENOSR:118,ENONET:119,ENOPKG:120,EREMOTE:121,ENOLINK:47,EADV:122,ESRMNT:123,ECOMM:124,EPROTO:65,EMULTIHOP:36,EDOTDOT:125,EBADMSG:9,ENOTUNIQ:126,EBADFD:127,EREMCHG:128,ELIBACC:129,ELIBBAD:130,ELIBSCN:131,ELIBMAX:132,ELIBEXEC:133,ENOSYS:52,ENOTEMPTY:55,ENAMETOOLONG:37,ELOOP:32,EOPNOTSUPP:138,EPFNOSUPPORT:139,ECONNRESET:15,ENOBUFS:42,EAFNOSUPPORT:5,EPROTOTYPE:67,ENOTSOCK:57,ENOPROTOOPT:50,ESHUTDOWN:140,ECONNREFUSED:14,EADDRINUSE:3,ECONNABORTED:13,ENETUNREACH:40,ENETDOWN:38,ETIMEDOUT:73,EHOSTDOWN:142,EHOSTUNREACH:23,EINPROGRESS:26,EALREADY:7,EDESTADDRREQ:17,EMSGSIZE:35,EPROTONOSUPPORT:66,ESOCKTNOSUPPORT:137,EADDRNOTAVAIL:4,ENETRESET:39,EISCONN:30,ENOTCONN:53,ETOOMANYREFS:141,EUSERS:136,EDQUOT:19,ESTALE:72,ENOTSUP:138,ENOMEDIUM:148,EILSEQ:25,EOVERFLOW:61,ECANCELED:11,ENOTRECOVERABLE:56,EOWNERDEAD:62,ESTRPIPE:135};var FS={root:null,mounts:[],devices:{},streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:false,ignorePermissions:true,trackingDelegate:{},tracking:{openFlags:{READ:1,WRITE:2}},ErrnoError:null,genericErrors:{},filesystems:null,syncFSRequests:0,handleFSError:function(e) {
        if (!(e instanceof FS.ErrnoError)) throw e + ' : ' + stackTrace();
        return setErrNo(e.errno);
      },lookupPath:function(path, opts) {
        path = PATH_FS.resolve(FS.cwd(), path);
        opts = opts || {};
  
        if (!path) return { path: '', node: null };
  
        var defaults = {
          follow_mount: true,
          recurse_count: 0
        };
        for (var key in defaults) {
          if (opts[key] === undefined) {
            opts[key] = defaults[key];
          }
        }
  
        if (opts.recurse_count > 8) {  // max recursive lookup of 8
          throw new FS.ErrnoError(32);
        }
  
        // split the path
        var parts = PATH.normalizeArray(path.split('/').filter(function(p) {
          return !!p;
        }), false);
  
        // start at the root
        var current = FS.root;
        var current_path = '/';
  
        for (var i = 0; i < parts.length; i++) {
          var islast = (i === parts.length-1);
          if (islast && opts.parent) {
            // stop resolving
            break;
          }
  
          current = FS.lookupNode(current, parts[i]);
          current_path = PATH.join2(current_path, parts[i]);
  
          // jump to the mount's root node if this is a mountpoint
          if (FS.isMountpoint(current)) {
            if (!islast || (islast && opts.follow_mount)) {
              current = current.mounted.root;
            }
          }
  
          // by default, lookupPath will not follow a symlink if it is the final path component.
          // setting opts.follow = true will override this behavior.
          if (!islast || opts.follow) {
            var count = 0;
            while (FS.isLink(current.mode)) {
              var link = FS.readlink(current_path);
              current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
  
              var lookup = FS.lookupPath(current_path, { recurse_count: opts.recurse_count });
              current = lookup.node;
  
              if (count++ > 40) {  // limit max consecutive symlinks to 40 (SYMLOOP_MAX).
                throw new FS.ErrnoError(32);
              }
            }
          }
        }
  
        return { path: current_path, node: current };
      },getPath:function(node) {
        var path;
        while (true) {
          if (FS.isRoot(node)) {
            var mount = node.mount.mountpoint;
            if (!path) return mount;
            return mount[mount.length-1] !== '/' ? mount + '/' + path : mount + path;
          }
          path = path ? node.name + '/' + path : node.name;
          node = node.parent;
        }
      },hashName:function(parentid, name) {
        var hash = 0;
  
  
        for (var i = 0; i < name.length; i++) {
          hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
        }
        return ((parentid + hash) >>> 0) % FS.nameTable.length;
      },hashAddNode:function(node) {
        var hash = FS.hashName(node.parent.id, node.name);
        node.name_next = FS.nameTable[hash];
        FS.nameTable[hash] = node;
      },hashRemoveNode:function(node) {
        var hash = FS.hashName(node.parent.id, node.name);
        if (FS.nameTable[hash] === node) {
          FS.nameTable[hash] = node.name_next;
        } else {
          var current = FS.nameTable[hash];
          while (current) {
            if (current.name_next === node) {
              current.name_next = node.name_next;
              break;
            }
            current = current.name_next;
          }
        }
      },lookupNode:function(parent, name) {
        var errCode = FS.mayLookup(parent);
        if (errCode) {
          throw new FS.ErrnoError(errCode, parent);
        }
        var hash = FS.hashName(parent.id, name);
        for (var node = FS.nameTable[hash]; node; node = node.name_next) {
          var nodeName = node.name;
          if (node.parent.id === parent.id && nodeName === name) {
            return node;
          }
        }
        // if we failed to find it in the cache, call into the VFS
        return FS.lookup(parent, name);
      },createNode:function(parent, name, mode, rdev) {
        var node = new FS.FSNode(parent, name, mode, rdev);
  
        FS.hashAddNode(node);
  
        return node;
      },destroyNode:function(node) {
        FS.hashRemoveNode(node);
      },isRoot:function(node) {
        return node === node.parent;
      },isMountpoint:function(node) {
        return !!node.mounted;
      },isFile:function(mode) {
        return (mode & 61440) === 32768;
      },isDir:function(mode) {
        return (mode & 61440) === 16384;
      },isLink:function(mode) {
        return (mode & 61440) === 40960;
      },isChrdev:function(mode) {
        return (mode & 61440) === 8192;
      },isBlkdev:function(mode) {
        return (mode & 61440) === 24576;
      },isFIFO:function(mode) {
        return (mode & 61440) === 4096;
      },isSocket:function(mode) {
        return (mode & 49152) === 49152;
      },flagModes:{"r":0,"rs":1052672,"r+":2,"w":577,"wx":705,"xw":705,"w+":578,"wx+":706,"xw+":706,"a":1089,"ax":1217,"xa":1217,"a+":1090,"ax+":1218,"xa+":1218},modeStringToFlags:function(str) {
        var flags = FS.flagModes[str];
        if (typeof flags === 'undefined') {
          throw new Error('Unknown file open mode: ' + str);
        }
        return flags;
      },flagsToPermissionString:function(flag) {
        var perms = ['r', 'w', 'rw'][flag & 3];
        if ((flag & 512)) {
          perms += 'w';
        }
        return perms;
      },nodePermissions:function(node, perms) {
        if (FS.ignorePermissions) {
          return 0;
        }
        // return 0 if any user, group or owner bits are set.
        if (perms.indexOf('r') !== -1 && !(node.mode & 292)) {
          return 2;
        } else if (perms.indexOf('w') !== -1 && !(node.mode & 146)) {
          return 2;
        } else if (perms.indexOf('x') !== -1 && !(node.mode & 73)) {
          return 2;
        }
        return 0;
      },mayLookup:function(dir) {
        var errCode = FS.nodePermissions(dir, 'x');
        if (errCode) return errCode;
        if (!dir.node_ops.lookup) return 2;
        return 0;
      },mayCreate:function(dir, name) {
        try {
          var node = FS.lookupNode(dir, name);
          return 20;
        } catch (e) {
        }
        return FS.nodePermissions(dir, 'wx');
      },mayDelete:function(dir, name, isdir) {
        var node;
        try {
          node = FS.lookupNode(dir, name);
        } catch (e) {
          return e.errno;
        }
        var errCode = FS.nodePermissions(dir, 'wx');
        if (errCode) {
          return errCode;
        }
        if (isdir) {
          if (!FS.isDir(node.mode)) {
            return 54;
          }
          if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
            return 10;
          }
        } else {
          if (FS.isDir(node.mode)) {
            return 31;
          }
        }
        return 0;
      },mayOpen:function(node, flags) {
        if (!node) {
          return 44;
        }
        if (FS.isLink(node.mode)) {
          return 32;
        } else if (FS.isDir(node.mode)) {
          if (FS.flagsToPermissionString(flags) !== 'r' || // opening for write
              (flags & 512)) { // TODO: check for O_SEARCH? (== search for dir only)
            return 31;
          }
        }
        return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
      },MAX_OPEN_FDS:4096,nextfd:function(fd_start, fd_end) {
        fd_start = fd_start || 0;
        fd_end = fd_end || FS.MAX_OPEN_FDS;
        for (var fd = fd_start; fd <= fd_end; fd++) {
          if (!FS.streams[fd]) {
            return fd;
          }
        }
        throw new FS.ErrnoError(33);
      },getStream:function(fd) {
        return FS.streams[fd];
      },createStream:function(stream, fd_start, fd_end) {
        if (!FS.FSStream) {
          FS.FSStream = /** @constructor */ function(){};
          FS.FSStream.prototype = {
            object: {
              get: function() { return this.node; },
              set: function(val) { this.node = val; }
            },
            isRead: {
              get: function() { return (this.flags & 2097155) !== 1; }
            },
            isWrite: {
              get: function() { return (this.flags & 2097155) !== 0; }
            },
            isAppend: {
              get: function() { return (this.flags & 1024); }
            }
          };
        }
        // clone it, so we can return an instance of FSStream
        var newStream = new FS.FSStream();
        for (var p in stream) {
          newStream[p] = stream[p];
        }
        stream = newStream;
        var fd = FS.nextfd(fd_start, fd_end);
        stream.fd = fd;
        FS.streams[fd] = stream;
        return stream;
      },closeStream:function(fd) {
        FS.streams[fd] = null;
      },chrdev_stream_ops:{open:function(stream) {
          var device = FS.getDevice(stream.node.rdev);
          // override node's stream ops with the device's
          stream.stream_ops = device.stream_ops;
          // forward the open call
          if (stream.stream_ops.open) {
            stream.stream_ops.open(stream);
          }
        },llseek:function() {
          throw new FS.ErrnoError(70);
        }},major:function(dev) {
        return ((dev) >> 8);
      },minor:function(dev) {
        return ((dev) & 0xff);
      },makedev:function(ma, mi) {
        return ((ma) << 8 | (mi));
      },registerDevice:function(dev, ops) {
        FS.devices[dev] = { stream_ops: ops };
      },getDevice:function(dev) {
        return FS.devices[dev];
      },getMounts:function(mount) {
        var mounts = [];
        var check = [mount];
  
        while (check.length) {
          var m = check.pop();
  
          mounts.push(m);
  
          check.push.apply(check, m.mounts);
        }
  
        return mounts;
      },syncfs:function(populate, callback) {
        if (typeof(populate) === 'function') {
          callback = populate;
          populate = false;
        }
  
        FS.syncFSRequests++;
  
        if (FS.syncFSRequests > 1) {
          err('warning: ' + FS.syncFSRequests + ' FS.syncfs operations in flight at once, probably just doing extra work');
        }
  
        var mounts = FS.getMounts(FS.root.mount);
        var completed = 0;
  
        function doCallback(errCode) {
          assert(FS.syncFSRequests > 0);
          FS.syncFSRequests--;
          return callback(errCode);
        }
  
        function done(errCode) {
          if (errCode) {
            if (!done.errored) {
              done.errored = true;
              return doCallback(errCode);
            }
            return;
          }
          if (++completed >= mounts.length) {
            doCallback(null);
          }
        };
  
        // sync all mounts
        mounts.forEach(function (mount) {
          if (!mount.type.syncfs) {
            return done(null);
          }
          mount.type.syncfs(mount, populate, done);
        });
      },mount:function(type, opts, mountpoint) {
        if (typeof type === 'string') {
          // The filesystem was not included, and instead we have an error
          // message stored in the variable.
          throw type;
        }
        var root = mountpoint === '/';
        var pseudo = !mountpoint;
        var node;
  
        if (root && FS.root) {
          throw new FS.ErrnoError(10);
        } else if (!root && !pseudo) {
          var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
  
          mountpoint = lookup.path;  // use the absolute path
          node = lookup.node;
  
          if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(10);
          }
  
          if (!FS.isDir(node.mode)) {
            throw new FS.ErrnoError(54);
          }
        }
  
        var mount = {
          type: type,
          opts: opts,
          mountpoint: mountpoint,
          mounts: []
        };
  
        // create a root node for the fs
        var mountRoot = type.mount(mount);
        mountRoot.mount = mount;
        mount.root = mountRoot;
  
        if (root) {
          FS.root = mountRoot;
        } else if (node) {
          // set as a mountpoint
          node.mounted = mount;
  
          // add the new mount to the current mount's children
          if (node.mount) {
            node.mount.mounts.push(mount);
          }
        }
  
        return mountRoot;
      },unmount:function (mountpoint) {
        var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
  
        if (!FS.isMountpoint(lookup.node)) {
          throw new FS.ErrnoError(28);
        }
  
        // destroy the nodes for this mount, and all its child mounts
        var node = lookup.node;
        var mount = node.mounted;
        var mounts = FS.getMounts(mount);
  
        Object.keys(FS.nameTable).forEach(function (hash) {
          var current = FS.nameTable[hash];
  
          while (current) {
            var next = current.name_next;
  
            if (mounts.indexOf(current.mount) !== -1) {
              FS.destroyNode(current);
            }
  
            current = next;
          }
        });
  
        // no longer a mountpoint
        node.mounted = null;
  
        // remove this mount from the child mounts
        var idx = node.mount.mounts.indexOf(mount);
        assert(idx !== -1);
        node.mount.mounts.splice(idx, 1);
      },lookup:function(parent, name) {
        return parent.node_ops.lookup(parent, name);
      },mknod:function(path, mode, dev) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        if (!name || name === '.' || name === '..') {
          throw new FS.ErrnoError(28);
        }
        var errCode = FS.mayCreate(parent, name);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.mknod) {
          throw new FS.ErrnoError(63);
        }
        return parent.node_ops.mknod(parent, name, mode, dev);
      },create:function(path, mode) {
        mode = mode !== undefined ? mode : 438 /* 0666 */;
        mode &= 4095;
        mode |= 32768;
        return FS.mknod(path, mode, 0);
      },mkdir:function(path, mode) {
        mode = mode !== undefined ? mode : 511 /* 0777 */;
        mode &= 511 | 512;
        mode |= 16384;
        return FS.mknod(path, mode, 0);
      },mkdirTree:function(path, mode) {
        var dirs = path.split('/');
        var d = '';
        for (var i = 0; i < dirs.length; ++i) {
          if (!dirs[i]) continue;
          d += '/' + dirs[i];
          try {
            FS.mkdir(d, mode);
          } catch(e) {
            if (e.errno != 20) throw e;
          }
        }
      },mkdev:function(path, mode, dev) {
        if (typeof(dev) === 'undefined') {
          dev = mode;
          mode = 438 /* 0666 */;
        }
        mode |= 8192;
        return FS.mknod(path, mode, dev);
      },symlink:function(oldpath, newpath) {
        if (!PATH_FS.resolve(oldpath)) {
          throw new FS.ErrnoError(44);
        }
        var lookup = FS.lookupPath(newpath, { parent: true });
        var parent = lookup.node;
        if (!parent) {
          throw new FS.ErrnoError(44);
        }
        var newname = PATH.basename(newpath);
        var errCode = FS.mayCreate(parent, newname);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.symlink) {
          throw new FS.ErrnoError(63);
        }
        return parent.node_ops.symlink(parent, newname, oldpath);
      },rename:function(old_path, new_path) {
        var old_dirname = PATH.dirname(old_path);
        var new_dirname = PATH.dirname(new_path);
        var old_name = PATH.basename(old_path);
        var new_name = PATH.basename(new_path);
        // parents must exist
        var lookup, old_dir, new_dir;
        try {
          lookup = FS.lookupPath(old_path, { parent: true });
          old_dir = lookup.node;
          lookup = FS.lookupPath(new_path, { parent: true });
          new_dir = lookup.node;
        } catch (e) {
          throw new FS.ErrnoError(10);
        }
        if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
        // need to be part of the same mount
        if (old_dir.mount !== new_dir.mount) {
          throw new FS.ErrnoError(75);
        }
        // source must exist
        var old_node = FS.lookupNode(old_dir, old_name);
        // old path should not be an ancestor of the new path
        var relative = PATH_FS.relative(old_path, new_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(28);
        }
        // new path should not be an ancestor of the old path
        relative = PATH_FS.relative(new_path, old_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(55);
        }
        // see if the new path already exists
        var new_node;
        try {
          new_node = FS.lookupNode(new_dir, new_name);
        } catch (e) {
          // not fatal
        }
        // early out if nothing needs to change
        if (old_node === new_node) {
          return;
        }
        // we'll need to delete the old entry
        var isdir = FS.isDir(old_node.mode);
        var errCode = FS.mayDelete(old_dir, old_name, isdir);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        // need delete permissions if we'll be overwriting.
        // need create permissions if new doesn't already exist.
        errCode = new_node ?
          FS.mayDelete(new_dir, new_name, isdir) :
          FS.mayCreate(new_dir, new_name);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!old_dir.node_ops.rename) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
          throw new FS.ErrnoError(10);
        }
        // if we are going to change the parent, check write permissions
        if (new_dir !== old_dir) {
          errCode = FS.nodePermissions(old_dir, 'w');
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
        }
        try {
          if (FS.trackingDelegate['willMovePath']) {
            FS.trackingDelegate['willMovePath'](old_path, new_path);
          }
        } catch(e) {
          err("FS.trackingDelegate['willMovePath']('"+old_path+"', '"+new_path+"') threw an exception: " + e.message);
        }
        // remove the node from the lookup hash
        FS.hashRemoveNode(old_node);
        // do the underlying fs rename
        try {
          old_dir.node_ops.rename(old_node, new_dir, new_name);
        } catch (e) {
          throw e;
        } finally {
          // add the node back to the hash (in case node_ops.rename
          // changed its name)
          FS.hashAddNode(old_node);
        }
        try {
          if (FS.trackingDelegate['onMovePath']) FS.trackingDelegate['onMovePath'](old_path, new_path);
        } catch(e) {
          err("FS.trackingDelegate['onMovePath']('"+old_path+"', '"+new_path+"') threw an exception: " + e.message);
        }
      },rmdir:function(path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var errCode = FS.mayDelete(parent, name, true);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.rmdir) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(10);
        }
        try {
          if (FS.trackingDelegate['willDeletePath']) {
            FS.trackingDelegate['willDeletePath'](path);
          }
        } catch(e) {
          err("FS.trackingDelegate['willDeletePath']('"+path+"') threw an exception: " + e.message);
        }
        parent.node_ops.rmdir(parent, name);
        FS.destroyNode(node);
        try {
          if (FS.trackingDelegate['onDeletePath']) FS.trackingDelegate['onDeletePath'](path);
        } catch(e) {
          err("FS.trackingDelegate['onDeletePath']('"+path+"') threw an exception: " + e.message);
        }
      },readdir:function(path) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        if (!node.node_ops.readdir) {
          throw new FS.ErrnoError(54);
        }
        return node.node_ops.readdir(node);
      },unlink:function(path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var errCode = FS.mayDelete(parent, name, false);
        if (errCode) {
          // According to POSIX, we should map EISDIR to EPERM, but
          // we instead do what Linux does (and we must, as we use
          // the musl linux libc).
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.unlink) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(10);
        }
        try {
          if (FS.trackingDelegate['willDeletePath']) {
            FS.trackingDelegate['willDeletePath'](path);
          }
        } catch(e) {
          err("FS.trackingDelegate['willDeletePath']('"+path+"') threw an exception: " + e.message);
        }
        parent.node_ops.unlink(parent, name);
        FS.destroyNode(node);
        try {
          if (FS.trackingDelegate['onDeletePath']) FS.trackingDelegate['onDeletePath'](path);
        } catch(e) {
          err("FS.trackingDelegate['onDeletePath']('"+path+"') threw an exception: " + e.message);
        }
      },readlink:function(path) {
        var lookup = FS.lookupPath(path);
        var link = lookup.node;
        if (!link) {
          throw new FS.ErrnoError(44);
        }
        if (!link.node_ops.readlink) {
          throw new FS.ErrnoError(28);
        }
        return PATH_FS.resolve(FS.getPath(link.parent), link.node_ops.readlink(link));
      },stat:function(path, dontFollow) {
        var lookup = FS.lookupPath(path, { follow: !dontFollow });
        var node = lookup.node;
        if (!node) {
          throw new FS.ErrnoError(44);
        }
        if (!node.node_ops.getattr) {
          throw new FS.ErrnoError(63);
        }
        return node.node_ops.getattr(node);
      },lstat:function(path) {
        return FS.stat(path, true);
      },chmod:function(path, mode, dontFollow) {
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(63);
        }
        node.node_ops.setattr(node, {
          mode: (mode & 4095) | (node.mode & ~4095),
          timestamp: Date.now()
        });
      },lchmod:function(path, mode) {
        FS.chmod(path, mode, true);
      },fchmod:function(fd, mode) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(8);
        }
        FS.chmod(stream.node, mode);
      },chown:function(path, uid, gid, dontFollow) {
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(63);
        }
        node.node_ops.setattr(node, {
          timestamp: Date.now()
          // we ignore the uid / gid for now
        });
      },lchown:function(path, uid, gid) {
        FS.chown(path, uid, gid, true);
      },fchown:function(fd, uid, gid) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(8);
        }
        FS.chown(stream.node, uid, gid);
      },truncate:function(path, len) {
        if (len < 0) {
          throw new FS.ErrnoError(28);
        }
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: true });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isDir(node.mode)) {
          throw new FS.ErrnoError(31);
        }
        if (!FS.isFile(node.mode)) {
          throw new FS.ErrnoError(28);
        }
        var errCode = FS.nodePermissions(node, 'w');
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        node.node_ops.setattr(node, {
          size: len,
          timestamp: Date.now()
        });
      },ftruncate:function(fd, len) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(8);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(28);
        }
        FS.truncate(stream.node, len);
      },utime:function(path, atime, mtime) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        node.node_ops.setattr(node, {
          timestamp: Math.max(atime, mtime)
        });
      },open:function(path, flags, mode, fd_start, fd_end) {
        if (path === "") {
          throw new FS.ErrnoError(44);
        }
        flags = typeof flags === 'string' ? FS.modeStringToFlags(flags) : flags;
        mode = typeof mode === 'undefined' ? 438 /* 0666 */ : mode;
        if ((flags & 64)) {
          mode = (mode & 4095) | 32768;
        } else {
          mode = 0;
        }
        var node;
        if (typeof path === 'object') {
          node = path;
        } else {
          path = PATH.normalize(path);
          try {
            var lookup = FS.lookupPath(path, {
              follow: !(flags & 131072)
            });
            node = lookup.node;
          } catch (e) {
            // ignore
          }
        }
        // perhaps we need to create the node
        var created = false;
        if ((flags & 64)) {
          if (node) {
            // if O_CREAT and O_EXCL are set, error out if the node already exists
            if ((flags & 128)) {
              throw new FS.ErrnoError(20);
            }
          } else {
            // node doesn't exist, try to create it
            node = FS.mknod(path, mode, 0);
            created = true;
          }
        }
        if (!node) {
          throw new FS.ErrnoError(44);
        }
        // can't truncate a device
        if (FS.isChrdev(node.mode)) {
          flags &= ~512;
        }
        // if asked only for a directory, then this must be one
        if ((flags & 65536) && !FS.isDir(node.mode)) {
          throw new FS.ErrnoError(54);
        }
        // check permissions, if this is not a file we just created now (it is ok to
        // create and write to a file with read-only permissions; it is read-only
        // for later use)
        if (!created) {
          var errCode = FS.mayOpen(node, flags);
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
        }
        // do truncation if necessary
        if ((flags & 512)) {
          FS.truncate(node, 0);
        }
        // we've already handled these, don't pass down to the underlying vfs
        flags &= ~(128 | 512 | 131072);
  
        // register the stream with the filesystem
        var stream = FS.createStream({
          node: node,
          path: FS.getPath(node),  // we want the absolute path to the node
          flags: flags,
          seekable: true,
          position: 0,
          stream_ops: node.stream_ops,
          // used by the file family libc calls (fopen, fwrite, ferror, etc.)
          ungotten: [],
          error: false
        }, fd_start, fd_end);
        // call the new stream's open function
        if (stream.stream_ops.open) {
          stream.stream_ops.open(stream);
        }
        if (Module['logReadFiles'] && !(flags & 1)) {
          if (!FS.readFiles) FS.readFiles = {};
          if (!(path in FS.readFiles)) {
            FS.readFiles[path] = 1;
            err("FS.trackingDelegate error on read file: " + path);
          }
        }
        try {
          if (FS.trackingDelegate['onOpenFile']) {
            var trackingFlags = 0;
            if ((flags & 2097155) !== 1) {
              trackingFlags |= FS.tracking.openFlags.READ;
            }
            if ((flags & 2097155) !== 0) {
              trackingFlags |= FS.tracking.openFlags.WRITE;
            }
            FS.trackingDelegate['onOpenFile'](path, trackingFlags);
          }
        } catch(e) {
          err("FS.trackingDelegate['onOpenFile']('"+path+"', flags) threw an exception: " + e.message);
        }
        return stream;
      },close:function(stream) {
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if (stream.getdents) stream.getdents = null; // free readdir state
        try {
          if (stream.stream_ops.close) {
            stream.stream_ops.close(stream);
          }
        } catch (e) {
          throw e;
        } finally {
          FS.closeStream(stream.fd);
        }
        stream.fd = null;
      },isClosed:function(stream) {
        return stream.fd === null;
      },llseek:function(stream, offset, whence) {
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if (!stream.seekable || !stream.stream_ops.llseek) {
          throw new FS.ErrnoError(70);
        }
        if (whence != 0 && whence != 1 && whence != 2) {
          throw new FS.ErrnoError(28);
        }
        stream.position = stream.stream_ops.llseek(stream, offset, whence);
        stream.ungotten = [];
        return stream.position;
      },read:function(stream, buffer, offset, length, position) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(28);
        }
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(8);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(31);
        }
        if (!stream.stream_ops.read) {
          throw new FS.ErrnoError(28);
        }
        var seeking = typeof position !== 'undefined';
        if (!seeking) {
          position = stream.position;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(70);
        }
        var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
        if (!seeking) stream.position += bytesRead;
        return bytesRead;
      },write:function(stream, buffer, offset, length, position, canOwn) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(28);
        }
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(8);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(31);
        }
        if (!stream.stream_ops.write) {
          throw new FS.ErrnoError(28);
        }
        if (stream.seekable && stream.flags & 1024) {
          // seek to the end before writing in append mode
          FS.llseek(stream, 0, 2);
        }
        var seeking = typeof position !== 'undefined';
        if (!seeking) {
          position = stream.position;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(70);
        }
        var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
        if (!seeking) stream.position += bytesWritten;
        try {
          if (stream.path && FS.trackingDelegate['onWriteToFile']) FS.trackingDelegate['onWriteToFile'](stream.path);
        } catch(e) {
          err("FS.trackingDelegate['onWriteToFile']('"+stream.path+"') threw an exception: " + e.message);
        }
        return bytesWritten;
      },allocate:function(stream, offset, length) {
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if (offset < 0 || length <= 0) {
          throw new FS.ErrnoError(28);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(8);
        }
        if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(43);
        }
        if (!stream.stream_ops.allocate) {
          throw new FS.ErrnoError(138);
        }
        stream.stream_ops.allocate(stream, offset, length);
      },mmap:function(stream, address, length, position, prot, flags) {
        // User requests writing to file (prot & PROT_WRITE != 0).
        // Checking if we have permissions to write to the file unless
        // MAP_PRIVATE flag is set. According to POSIX spec it is possible
        // to write to file opened in read-only mode with MAP_PRIVATE flag,
        // as all modifications will be visible only in the memory of
        // the current process.
        if ((prot & 2) !== 0
            && (flags & 2) === 0
            && (stream.flags & 2097155) !== 2) {
          throw new FS.ErrnoError(2);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(2);
        }
        if (!stream.stream_ops.mmap) {
          throw new FS.ErrnoError(43);
        }
        return stream.stream_ops.mmap(stream, address, length, position, prot, flags);
      },msync:function(stream, buffer, offset, length, mmapFlags) {
        if (!stream || !stream.stream_ops.msync) {
          return 0;
        }
        return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
      },munmap:function(stream) {
        return 0;
      },ioctl:function(stream, cmd, arg) {
        if (!stream.stream_ops.ioctl) {
          throw new FS.ErrnoError(59);
        }
        return stream.stream_ops.ioctl(stream, cmd, arg);
      },readFile:function(path, opts) {
        opts = opts || {};
        opts.flags = opts.flags || 'r';
        opts.encoding = opts.encoding || 'binary';
        if (opts.encoding !== 'utf8' && opts.encoding !== 'binary') {
          throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }
        var ret;
        var stream = FS.open(path, opts.flags);
        var stat = FS.stat(path);
        var length = stat.size;
        var buf = new Uint8Array(length);
        FS.read(stream, buf, 0, length, 0);
        if (opts.encoding === 'utf8') {
          ret = UTF8ArrayToString(buf, 0);
        } else if (opts.encoding === 'binary') {
          ret = buf;
        }
        FS.close(stream);
        return ret;
      },writeFile:function(path, data, opts) {
        opts = opts || {};
        opts.flags = opts.flags || 'w';
        var stream = FS.open(path, opts.flags, opts.mode);
        if (typeof data === 'string') {
          var buf = new Uint8Array(lengthBytesUTF8(data)+1);
          var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
          FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn);
        } else if (ArrayBuffer.isView(data)) {
          FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn);
        } else {
          throw new Error('Unsupported data type');
        }
        FS.close(stream);
      },cwd:function() {
        return FS.currentPath;
      },chdir:function(path) {
        var lookup = FS.lookupPath(path, { follow: true });
        if (lookup.node === null) {
          throw new FS.ErrnoError(44);
        }
        if (!FS.isDir(lookup.node.mode)) {
          throw new FS.ErrnoError(54);
        }
        var errCode = FS.nodePermissions(lookup.node, 'x');
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        FS.currentPath = lookup.path;
      },createDefaultDirectories:function() {
        FS.mkdir('/tmp');
        FS.mkdir('/home');
        FS.mkdir('/home/web_user');
      },createDefaultDevices:function() {
        // create /dev
        FS.mkdir('/dev');
        // setup /dev/null
        FS.registerDevice(FS.makedev(1, 3), {
          read: function() { return 0; },
          write: function(stream, buffer, offset, length, pos) { return length; }
        });
        FS.mkdev('/dev/null', FS.makedev(1, 3));
        // setup /dev/tty and /dev/tty1
        // stderr needs to print output using Module['printErr']
        // so we register a second tty just for it.
        TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
        TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
        FS.mkdev('/dev/tty', FS.makedev(5, 0));
        FS.mkdev('/dev/tty1', FS.makedev(6, 0));
        // setup /dev/[u]random
        var random_device;
        if (typeof crypto === 'object' && typeof crypto['getRandomValues'] === 'function') {
          // for modern web browsers
          var randomBuffer = new Uint8Array(1);
          random_device = function() { crypto.getRandomValues(randomBuffer); return randomBuffer[0]; };
        } else
        if (ENVIRONMENT_IS_NODE) {
          // for nodejs with or without crypto support included
          try {
            var crypto_module = require('crypto');
            // nodejs has crypto support
            random_device = function() { return crypto_module['randomBytes'](1)[0]; };
          } catch (e) {
            // nodejs doesn't have crypto support
          }
        } else
        {}
        if (!random_device) {
          // we couldn't find a proper implementation, as Math.random() is not suitable for /dev/random, see emscripten-core/emscripten/pull/7096
          random_device = function() { abort("no cryptographic support found for random_device. consider polyfilling it if you want to use something insecure like Math.random(), e.g. put this in a --pre-js: var crypto = { getRandomValues: function(array) { for (var i = 0; i < array.length; i++) array[i] = (Math.random()*256)|0 } };"); };
        }
        FS.createDevice('/dev', 'random', random_device);
        FS.createDevice('/dev', 'urandom', random_device);
        // we're not going to emulate the actual shm device,
        // just create the tmp dirs that reside in it commonly
        FS.mkdir('/dev/shm');
        FS.mkdir('/dev/shm/tmp');
      },createSpecialDirectories:function() {
        // create /proc/self/fd which allows /proc/self/fd/6 => readlink gives the name of the stream for fd 6 (see test_unistd_ttyname)
        FS.mkdir('/proc');
        FS.mkdir('/proc/self');
        FS.mkdir('/proc/self/fd');
        FS.mount({
          mount: function() {
            var node = FS.createNode('/proc/self', 'fd', 16384 | 511 /* 0777 */, 73);
            node.node_ops = {
              lookup: function(parent, name) {
                var fd = +name;
                var stream = FS.getStream(fd);
                if (!stream) throw new FS.ErrnoError(8);
                var ret = {
                  parent: null,
                  mount: { mountpoint: 'fake' },
                  node_ops: { readlink: function() { return stream.path } }
                };
                ret.parent = ret; // make it look like a simple root node
                return ret;
              }
            };
            return node;
          }
        }, {}, '/proc/self/fd');
      },createStandardStreams:function() {
        // TODO deprecate the old functionality of a single
        // input / output callback and that utilizes FS.createDevice
        // and instead require a unique set of stream ops
  
        // by default, we symlink the standard streams to the
        // default tty devices. however, if the standard streams
        // have been overwritten we create a unique device for
        // them instead.
        if (Module['stdin']) {
          FS.createDevice('/dev', 'stdin', Module['stdin']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdin');
        }
        if (Module['stdout']) {
          FS.createDevice('/dev', 'stdout', null, Module['stdout']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdout');
        }
        if (Module['stderr']) {
          FS.createDevice('/dev', 'stderr', null, Module['stderr']);
        } else {
          FS.symlink('/dev/tty1', '/dev/stderr');
        }
  
        // open default streams for the stdin, stdout and stderr devices
        var stdin = FS.open('/dev/stdin', 'r');
        var stdout = FS.open('/dev/stdout', 'w');
        var stderr = FS.open('/dev/stderr', 'w');
        assert(stdin.fd === 0, 'invalid handle for stdin (' + stdin.fd + ')');
        assert(stdout.fd === 1, 'invalid handle for stdout (' + stdout.fd + ')');
        assert(stderr.fd === 2, 'invalid handle for stderr (' + stderr.fd + ')');
      },ensureErrnoError:function() {
        if (FS.ErrnoError) return;
        FS.ErrnoError = /** @this{Object} */ function ErrnoError(errno, node) {
          this.node = node;
          this.setErrno = /** @this{Object} */ function(errno) {
            this.errno = errno;
            for (var key in ERRNO_CODES) {
              if (ERRNO_CODES[key] === errno) {
                this.code = key;
                break;
              }
            }
          };
          this.setErrno(errno);
          this.message = ERRNO_MESSAGES[errno];
  
          // Try to get a maximally helpful stack trace. On Node.js, getting Error.stack
          // now ensures it shows what we want.
          if (this.stack) {
            // Define the stack property for Node.js 4, which otherwise errors on the next line.
            Object.defineProperty(this, "stack", { value: (new Error).stack, writable: true });
            this.stack = demangleAll(this.stack);
          }
        };
        FS.ErrnoError.prototype = new Error();
        FS.ErrnoError.prototype.constructor = FS.ErrnoError;
        // Some errors may happen quite a bit, to avoid overhead we reuse them (and suffer a lack of stack info)
        [44].forEach(function(code) {
          FS.genericErrors[code] = new FS.ErrnoError(code);
          FS.genericErrors[code].stack = '<generic error, no stack>';
        });
      },staticInit:function() {
        FS.ensureErrnoError();
  
        FS.nameTable = new Array(4096);
  
        FS.mount(MEMFS, {}, '/');
  
        FS.createDefaultDirectories();
        FS.createDefaultDevices();
        FS.createSpecialDirectories();
  
        FS.filesystems = {
          'MEMFS': MEMFS,
          'IDBFS': IDBFS,
        };
      },init:function(input, output, error) {
        assert(!FS.init.initialized, 'FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)');
        FS.init.initialized = true;
  
        FS.ensureErrnoError();
  
        // Allow Module.stdin etc. to provide defaults, if none explicitly passed to us here
        Module['stdin'] = input || Module['stdin'];
        Module['stdout'] = output || Module['stdout'];
        Module['stderr'] = error || Module['stderr'];
  
        FS.createStandardStreams();
      },quit:function() {
        FS.init.initialized = false;
        // force-flush all streams, so we get musl std streams printed out
        var fflush = Module['_fflush'];
        if (fflush) fflush(0);
        // close all of our streams
        for (var i = 0; i < FS.streams.length; i++) {
          var stream = FS.streams[i];
          if (!stream) {
            continue;
          }
          FS.close(stream);
        }
      },getMode:function(canRead, canWrite) {
        var mode = 0;
        if (canRead) mode |= 292 | 73;
        if (canWrite) mode |= 146;
        return mode;
      },joinPath:function(parts, forceRelative) {
        var path = PATH.join.apply(null, parts);
        if (forceRelative && path[0] == '/') path = path.substr(1);
        return path;
      },absolutePath:function(relative, base) {
        return PATH_FS.resolve(base, relative);
      },standardizePath:function(path) {
        return PATH.normalize(path);
      },findObject:function(path, dontResolveLastLink) {
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (ret.exists) {
          return ret.object;
        } else {
          setErrNo(ret.error);
          return null;
        }
      },analyzePath:function(path, dontResolveLastLink) {
        // operate from within the context of the symlink's target
        try {
          var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          path = lookup.path;
        } catch (e) {
        }
        var ret = {
          isRoot: false, exists: false, error: 0, name: null, path: null, object: null,
          parentExists: false, parentPath: null, parentObject: null
        };
        try {
          var lookup = FS.lookupPath(path, { parent: true });
          ret.parentExists = true;
          ret.parentPath = lookup.path;
          ret.parentObject = lookup.node;
          ret.name = PATH.basename(path);
          lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          ret.exists = true;
          ret.path = lookup.path;
          ret.object = lookup.node;
          ret.name = lookup.node.name;
          ret.isRoot = lookup.path === '/';
        } catch (e) {
          ret.error = e.errno;
        };
        return ret;
      },createFolder:function(parent, name, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.mkdir(path, mode);
      },createPath:function(parent, path, canRead, canWrite) {
        parent = typeof parent === 'string' ? parent : FS.getPath(parent);
        var parts = path.split('/').reverse();
        while (parts.length) {
          var part = parts.pop();
          if (!part) continue;
          var current = PATH.join2(parent, part);
          try {
            FS.mkdir(current);
          } catch (e) {
            // ignore EEXIST
          }
          parent = current;
        }
        return current;
      },createFile:function(parent, name, properties, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.create(path, mode);
      },createDataFile:function(parent, name, data, canRead, canWrite, canOwn) {
        var path = name ? PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name) : parent;
        var mode = FS.getMode(canRead, canWrite);
        var node = FS.create(path, mode);
        if (data) {
          if (typeof data === 'string') {
            var arr = new Array(data.length);
            for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
            data = arr;
          }
          // make sure we can write to the file
          FS.chmod(node, mode | 146);
          var stream = FS.open(node, 'w');
          FS.write(stream, data, 0, data.length, 0, canOwn);
          FS.close(stream);
          FS.chmod(node, mode);
        }
        return node;
      },createDevice:function(parent, name, input, output) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(!!input, !!output);
        if (!FS.createDevice.major) FS.createDevice.major = 64;
        var dev = FS.makedev(FS.createDevice.major++, 0);
        // Create a fake device that a set of stream ops to emulate
        // the old behavior.
        FS.registerDevice(dev, {
          open: function(stream) {
            stream.seekable = false;
          },
          close: function(stream) {
            // flush any pending line data
            if (output && output.buffer && output.buffer.length) {
              output(10);
            }
          },
          read: function(stream, buffer, offset, length, pos /* ignored */) {
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
              var result;
              try {
                result = input();
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
              if (result === undefined && bytesRead === 0) {
                throw new FS.ErrnoError(6);
              }
              if (result === null || result === undefined) break;
              bytesRead++;
              buffer[offset+i] = result;
            }
            if (bytesRead) {
              stream.node.timestamp = Date.now();
            }
            return bytesRead;
          },
          write: function(stream, buffer, offset, length, pos) {
            for (var i = 0; i < length; i++) {
              try {
                output(buffer[offset+i]);
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
            }
            if (length) {
              stream.node.timestamp = Date.now();
            }
            return i;
          }
        });
        return FS.mkdev(path, mode, dev);
      },createLink:function(parent, name, target, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        return FS.symlink(target, path);
      },forceLoadFile:function(obj) {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
        var success = true;
        if (typeof XMLHttpRequest !== 'undefined') {
          throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
        } else if (read_) {
          // Command-line.
          try {
            // WARNING: Can't read binary files in V8's d8 or tracemonkey's js, as
            //          read() will try to parse UTF8.
            obj.contents = intArrayFromString(read_(obj.url), true);
            obj.usedBytes = obj.contents.length;
          } catch (e) {
            success = false;
          }
        } else {
          throw new Error('Cannot load without read() or XMLHttpRequest.');
        }
        if (!success) setErrNo(29);
        return success;
      },createLazyFile:function(parent, name, url, canRead, canWrite) {
        // Lazy chunked Uint8Array (implements get and length from Uint8Array). Actual getting is abstracted away for eventual reuse.
        /** @constructor */
        function LazyUint8Array() {
          this.lengthKnown = false;
          this.chunks = []; // Loaded chunks. Index is the chunk number
        }
        LazyUint8Array.prototype.get = /** @this{Object} */ function LazyUint8Array_get(idx) {
          if (idx > this.length-1 || idx < 0) {
            return undefined;
          }
          var chunkOffset = idx % this.chunkSize;
          var chunkNum = (idx / this.chunkSize)|0;
          return this.getter(chunkNum)[chunkOffset];
        };
        LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
          this.getter = getter;
        };
        LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
          // Find length
          var xhr = new XMLHttpRequest();
          xhr.open('HEAD', url, false);
          xhr.send(null);
          if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
          var datalength = Number(xhr.getResponseHeader("Content-length"));
          var header;
          var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
          var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
  
          var chunkSize = 1024*1024; // Chunk size in bytes
  
          if (!hasByteServing) chunkSize = datalength;
  
          // Function to get a range from the remote URL.
          var doXHR = (function(from, to) {
            if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
            if (to > datalength-1) throw new Error("only " + datalength + " bytes available! programmer error!");
  
            // TODO: Use mozResponseArrayBuffer, responseStream, etc. if available.
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, false);
            if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
  
            // Some hints to the browser that we want binary data.
            if (typeof Uint8Array != 'undefined') xhr.responseType = 'arraybuffer';
            if (xhr.overrideMimeType) {
              xhr.overrideMimeType('text/plain; charset=x-user-defined');
            }
  
            xhr.send(null);
            if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
            if (xhr.response !== undefined) {
              return new Uint8Array(/** @type{Array<number>} */(xhr.response || []));
            } else {
              return intArrayFromString(xhr.responseText || '', true);
            }
          });
          var lazyArray = this;
          lazyArray.setDataGetter(function(chunkNum) {
            var start = chunkNum * chunkSize;
            var end = (chunkNum+1) * chunkSize - 1; // including this byte
            end = Math.min(end, datalength-1); // if datalength-1 is selected, this is the last block
            if (typeof(lazyArray.chunks[chunkNum]) === "undefined") {
              lazyArray.chunks[chunkNum] = doXHR(start, end);
            }
            if (typeof(lazyArray.chunks[chunkNum]) === "undefined") throw new Error("doXHR failed!");
            return lazyArray.chunks[chunkNum];
          });
  
          if (usesGzip || !datalength) {
            // if the server uses gzip or doesn't supply the length, we have to download the whole file to get the (uncompressed) length
            chunkSize = datalength = 1; // this will force getter(0)/doXHR do download the whole file
            datalength = this.getter(0).length;
            chunkSize = datalength;
            out("LazyFiles on gzip forces download of the whole file when length is accessed");
          }
  
          this._length = datalength;
          this._chunkSize = chunkSize;
          this.lengthKnown = true;
        };
        if (typeof XMLHttpRequest !== 'undefined') {
          if (!ENVIRONMENT_IS_WORKER) throw 'Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc';
          var lazyArray = new LazyUint8Array();
          Object.defineProperties(lazyArray, {
            length: {
              get: /** @this{Object} */ function() {
                if(!this.lengthKnown) {
                  this.cacheLength();
                }
                return this._length;
              }
            },
            chunkSize: {
              get: /** @this{Object} */ function() {
                if(!this.lengthKnown) {
                  this.cacheLength();
                }
                return this._chunkSize;
              }
            }
          });
  
          var properties = { isDevice: false, contents: lazyArray };
        } else {
          var properties = { isDevice: false, url: url };
        }
  
        var node = FS.createFile(parent, name, properties, canRead, canWrite);
        // This is a total hack, but I want to get this lazy file code out of the
        // core of MEMFS. If we want to keep this lazy file concept I feel it should
        // be its own thin LAZYFS proxying calls to MEMFS.
        if (properties.contents) {
          node.contents = properties.contents;
        } else if (properties.url) {
          node.contents = null;
          node.url = properties.url;
        }
        // Add a function that defers querying the file size until it is asked the first time.
        Object.defineProperties(node, {
          usedBytes: {
            get: /** @this {FSNode} */ function() { return this.contents.length; }
          }
        });
        // override each stream op with one that tries to force load the lazy file first
        var stream_ops = {};
        var keys = Object.keys(node.stream_ops);
        keys.forEach(function(key) {
          var fn = node.stream_ops[key];
          stream_ops[key] = function forceLoadLazyFile() {
            if (!FS.forceLoadFile(node)) {
              throw new FS.ErrnoError(29);
            }
            return fn.apply(null, arguments);
          };
        });
        // use a custom read function
        stream_ops.read = function stream_ops_read(stream, buffer, offset, length, position) {
          if (!FS.forceLoadFile(node)) {
            throw new FS.ErrnoError(29);
          }
          var contents = stream.node.contents;
          if (position >= contents.length)
            return 0;
          var size = Math.min(contents.length - position, length);
          assert(size >= 0);
          if (contents.slice) { // normal array
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          } else {
            for (var i = 0; i < size; i++) { // LazyUint8Array from sync binary XHR
              buffer[offset + i] = contents.get(position + i);
            }
          }
          return size;
        };
        node.stream_ops = stream_ops;
        return node;
      },createPreloadedFile:function(parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) {
        Browser.init(); // XXX perhaps this method should move onto Browser?
        // TODO we should allow people to just pass in a complete filename instead
        // of parent and name being that we just join them anyways
        var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
        var dep = getUniqueRunDependency('cp ' + fullname); // might have several active requests for the same fullname
        function processData(byteArray) {
          function finish(byteArray) {
            if (preFinish) preFinish();
            if (!dontCreateFile) {
              FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
            }
            if (onload) onload();
            removeRunDependency(dep);
          }
          var handled = false;
          Module['preloadPlugins'].forEach(function(plugin) {
            if (handled) return;
            if (plugin['canHandle'](fullname)) {
              plugin['handle'](byteArray, fullname, finish, function() {
                if (onerror) onerror();
                removeRunDependency(dep);
              });
              handled = true;
            }
          });
          if (!handled) finish(byteArray);
        }
        addRunDependency(dep);
        if (typeof url == 'string') {
          Browser.asyncLoad(url, function(byteArray) {
            processData(byteArray);
          }, onerror);
        } else {
          processData(url);
        }
      },indexedDB:function() {
        return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
      },DB_NAME:function() {
        return 'EM_FS_' + window.location.pathname;
      },DB_VERSION:20,DB_STORE_NAME:"FILE_DATA",saveFilesToDB:function(paths, onload, onerror) {
        onload = onload || function(){};
        onerror = onerror || function(){};
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
          out('creating db');
          var db = openRequest.result;
          db.createObjectStore(FS.DB_STORE_NAME);
        };
        openRequest.onsuccess = function openRequest_onsuccess() {
          var db = openRequest.result;
          var transaction = db.transaction([FS.DB_STORE_NAME], 'readwrite');
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0) onload(); else onerror();
          }
          paths.forEach(function(path) {
            var putRequest = files.put(FS.analyzePath(path).object.contents, path);
            putRequest.onsuccess = function putRequest_onsuccess() { ok++; if (ok + fail == total) finish() };
            putRequest.onerror = function putRequest_onerror() { fail++; if (ok + fail == total) finish() };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      },loadFilesFromDB:function(paths, onload, onerror) {
        onload = onload || function(){};
        onerror = onerror || function(){};
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = onerror; // no database to load from
        openRequest.onsuccess = function openRequest_onsuccess() {
          var db = openRequest.result;
          try {
            var transaction = db.transaction([FS.DB_STORE_NAME], 'readonly');
          } catch(e) {
            onerror(e);
            return;
          }
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0) onload(); else onerror();
          }
          paths.forEach(function(path) {
            var getRequest = files.get(path);
            getRequest.onsuccess = function getRequest_onsuccess() {
              if (FS.analyzePath(path).exists) {
                FS.unlink(path);
              }
              FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
              ok++;
              if (ok + fail == total) finish();
            };
            getRequest.onerror = function getRequest_onerror() { fail++; if (ok + fail == total) finish() };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      },mmapAlloc:function(size) {
        var alignedSize = alignMemory(size, 16384);
        var ptr = _malloc(alignedSize);
        while (size < alignedSize) HEAP8[ptr + size++] = 0;
        return ptr;
      }};var SYSCALLS={mappings:{},DEFAULT_POLLMASK:5,umask:511,calculateAt:function(dirfd, path) {
        if (path[0] !== '/') {
          // relative path
          var dir;
          if (dirfd === -100) {
            dir = FS.cwd();
          } else {
            var dirstream = FS.getStream(dirfd);
            if (!dirstream) throw new FS.ErrnoError(8);
            dir = dirstream.path;
          }
          path = PATH.join2(dir, path);
        }
        return path;
      },doStat:function(func, path, buf) {
        try {
          var stat = func(path);
        } catch (e) {
          if (e && e.node && PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))) {
            // an error occurred while trying to look up the path; we should just report ENOTDIR
            return -54;
          }
          throw e;
        }
        HEAP32[((buf)>>2)]=stat.dev;
        HEAP32[(((buf)+(4))>>2)]=0;
        HEAP32[(((buf)+(8))>>2)]=stat.ino;
        HEAP32[(((buf)+(12))>>2)]=stat.mode;
        HEAP32[(((buf)+(16))>>2)]=stat.nlink;
        HEAP32[(((buf)+(20))>>2)]=stat.uid;
        HEAP32[(((buf)+(24))>>2)]=stat.gid;
        HEAP32[(((buf)+(28))>>2)]=stat.rdev;
        HEAP32[(((buf)+(32))>>2)]=0;
        (tempI64 = [stat.size>>>0,(tempDouble=stat.size,(+(Math_abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math_min((+(Math_floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[(((buf)+(40))>>2)]=tempI64[0],HEAP32[(((buf)+(44))>>2)]=tempI64[1]);
        HEAP32[(((buf)+(48))>>2)]=4096;
        HEAP32[(((buf)+(52))>>2)]=stat.blocks;
        HEAP32[(((buf)+(56))>>2)]=(stat.atime.getTime() / 1000)|0;
        HEAP32[(((buf)+(60))>>2)]=0;
        HEAP32[(((buf)+(64))>>2)]=(stat.mtime.getTime() / 1000)|0;
        HEAP32[(((buf)+(68))>>2)]=0;
        HEAP32[(((buf)+(72))>>2)]=(stat.ctime.getTime() / 1000)|0;
        HEAP32[(((buf)+(76))>>2)]=0;
        (tempI64 = [stat.ino>>>0,(tempDouble=stat.ino,(+(Math_abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math_min((+(Math_floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[(((buf)+(80))>>2)]=tempI64[0],HEAP32[(((buf)+(84))>>2)]=tempI64[1]);
        return 0;
      },doMsync:function(addr, stream, len, flags, offset) {
        var buffer = HEAPU8.slice(addr, addr + len);
        FS.msync(stream, buffer, offset, len, flags);
      },doMkdir:function(path, mode) {
        // remove a trailing slash, if one - /a/b/ has basename of '', but
        // we want to create b in the context of this function
        path = PATH.normalize(path);
        if (path[path.length-1] === '/') path = path.substr(0, path.length-1);
        FS.mkdir(path, mode, 0);
        return 0;
      },doMknod:function(path, mode, dev) {
        // we don't want this in the JS API as it uses mknod to create all nodes.
        switch (mode & 61440) {
          case 32768:
          case 8192:
          case 24576:
          case 4096:
          case 49152:
            break;
          default: return -28;
        }
        FS.mknod(path, mode, dev);
        return 0;
      },doReadlink:function(path, buf, bufsize) {
        if (bufsize <= 0) return -28;
        var ret = FS.readlink(path);
  
        var len = Math.min(bufsize, lengthBytesUTF8(ret));
        var endChar = HEAP8[buf+len];
        stringToUTF8(ret, buf, bufsize+1);
        // readlink is one of the rare functions that write out a C string, but does never append a null to the output buffer(!)
        // stringToUTF8() always appends a null byte, so restore the character under the null byte after the write.
        HEAP8[buf+len] = endChar;
  
        return len;
      },doAccess:function(path, amode) {
        if (amode & ~7) {
          // need a valid mode
          return -28;
        }
        var node;
        var lookup = FS.lookupPath(path, { follow: true });
        node = lookup.node;
        if (!node) {
          return -44;
        }
        var perms = '';
        if (amode & 4) perms += 'r';
        if (amode & 2) perms += 'w';
        if (amode & 1) perms += 'x';
        if (perms /* otherwise, they've just passed F_OK */ && FS.nodePermissions(node, perms)) {
          return -2;
        }
        return 0;
      },doDup:function(path, flags, suggestFD) {
        var suggest = FS.getStream(suggestFD);
        if (suggest) FS.close(suggest);
        return FS.open(path, flags, 0, suggestFD, suggestFD).fd;
      },doReadv:function(stream, iov, iovcnt, offset) {
        var ret = 0;
        for (var i = 0; i < iovcnt; i++) {
          var ptr = HEAP32[(((iov)+(i*8))>>2)];
          var len = HEAP32[(((iov)+(i*8 + 4))>>2)];
          var curr = FS.read(stream, HEAP8,ptr, len, offset);
          if (curr < 0) return -1;
          ret += curr;
          if (curr < len) break; // nothing more to read
        }
        return ret;
      },doWritev:function(stream, iov, iovcnt, offset) {
        var ret = 0;
        for (var i = 0; i < iovcnt; i++) {
          var ptr = HEAP32[(((iov)+(i*8))>>2)];
          var len = HEAP32[(((iov)+(i*8 + 4))>>2)];
          var curr = FS.write(stream, HEAP8,ptr, len, offset);
          if (curr < 0) return -1;
          ret += curr;
        }
        return ret;
      },varargs:undefined,get:function() {
        assert(SYSCALLS.varargs != undefined);
        SYSCALLS.varargs += 4;
        var ret = HEAP32[(((SYSCALLS.varargs)-(4))>>2)];
        return ret;
      },getStr:function(ptr) {
        var ret = UTF8ToString(ptr);
        return ret;
      },getStreamFromFD:function(fd) {
        var stream = FS.getStream(fd);
        if (!stream) throw new FS.ErrnoError(8);
        return stream;
      },get64:function(low, high) {
        if (low >= 0) assert(high === 0);
        else assert(high === -1);
        return low;
      }};function ___sys_access(path, amode) {try {
  
      path = SYSCALLS.getStr(path);
      return SYSCALLS.doAccess(path, amode);
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___sys_fcntl64(fd, cmd, varargs) {SYSCALLS.varargs = varargs;
  try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      switch (cmd) {
        case 0: {
          var arg = SYSCALLS.get();
          if (arg < 0) {
            return -28;
          }
          var newStream;
          newStream = FS.open(stream.path, stream.flags, 0, arg);
          return newStream.fd;
        }
        case 1:
        case 2:
          return 0;  // FD_CLOEXEC makes no sense for a single process.
        case 3:
          return stream.flags;
        case 4: {
          var arg = SYSCALLS.get();
          stream.flags |= arg;
          return 0;
        }
        case 12:
        /* case 12: Currently in musl F_GETLK64 has same value as F_GETLK, so omitted to avoid duplicate case blocks. If that changes, uncomment this */ {
          
          var arg = SYSCALLS.get();
          var offset = 0;
          // We're always unlocked.
          HEAP16[(((arg)+(offset))>>1)]=2;
          return 0;
        }
        case 13:
        case 14:
        /* case 13: Currently in musl F_SETLK64 has same value as F_SETLK, so omitted to avoid duplicate case blocks. If that changes, uncomment this */
        /* case 14: Currently in musl F_SETLKW64 has same value as F_SETLKW, so omitted to avoid duplicate case blocks. If that changes, uncomment this */
          
          
          return 0; // Pretend that the locking is successful.
        case 16:
        case 8:
          return -28; // These are for sockets. We don't have them fully implemented yet.
        case 9:
          // musl trusts getown return values, due to a bug where they must be, as they overlap with errors. just return -1 here, so fnctl() returns that, and we set errno ourselves.
          setErrNo(28);
          return -1;
        default: {
          return -28;
        }
      }
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___sys_getdents64(fd, dirp, count) {try {
  
      var stream = SYSCALLS.getStreamFromFD(fd)
      if (!stream.getdents) {
        stream.getdents = FS.readdir(stream.path);
      }
  
      var struct_size = 280;
      var pos = 0;
      var off = FS.llseek(stream, 0, 1);
  
      var idx = Math.floor(off / struct_size);
  
      while (idx < stream.getdents.length && pos + struct_size <= count) {
        var id;
        var type;
        var name = stream.getdents[idx];
        if (name[0] === '.') {
          id = 1;
          type = 4; // DT_DIR
        } else {
          var child = FS.lookupNode(stream.node, name);
          id = child.id;
          type = FS.isChrdev(child.mode) ? 2 :  // DT_CHR, character device.
                 FS.isDir(child.mode) ? 4 :     // DT_DIR, directory.
                 FS.isLink(child.mode) ? 10 :   // DT_LNK, symbolic link.
                 8;                             // DT_REG, regular file.
        }
        (tempI64 = [id>>>0,(tempDouble=id,(+(Math_abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math_min((+(Math_floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[((dirp + pos)>>2)]=tempI64[0],HEAP32[(((dirp + pos)+(4))>>2)]=tempI64[1]);
        (tempI64 = [(idx + 1) * struct_size>>>0,(tempDouble=(idx + 1) * struct_size,(+(Math_abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math_min((+(Math_floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[(((dirp + pos)+(8))>>2)]=tempI64[0],HEAP32[(((dirp + pos)+(12))>>2)]=tempI64[1]);
        HEAP16[(((dirp + pos)+(16))>>1)]=280;
        HEAP8[(((dirp + pos)+(18))>>0)]=type;
        stringToUTF8(name, dirp + pos + 19, 256);
        pos += struct_size;
        idx += 1;
      }
      FS.llseek(stream, idx * struct_size, 0);
      return pos;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___sys_ioctl(fd, op, varargs) {SYSCALLS.varargs = varargs;
  try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      switch (op) {
        case 21509:
        case 21505: {
          if (!stream.tty) return -59;
          return 0;
        }
        case 21510:
        case 21511:
        case 21512:
        case 21506:
        case 21507:
        case 21508: {
          if (!stream.tty) return -59;
          return 0; // no-op, not actually adjusting terminal settings
        }
        case 21519: {
          if (!stream.tty) return -59;
          var argp = SYSCALLS.get();
          HEAP32[((argp)>>2)]=0;
          return 0;
        }
        case 21520: {
          if (!stream.tty) return -59;
          return -28; // not supported
        }
        case 21531: {
          var argp = SYSCALLS.get();
          return FS.ioctl(stream, op, argp);
        }
        case 21523: {
          // TODO: in theory we should write to the winsize struct that gets
          // passed in, but for now musl doesn't read anything on it
          if (!stream.tty) return -59;
          return 0;
        }
        case 21524: {
          // TODO: technically, this ioctl call should change the window size.
          // but, since emscripten doesn't have any concept of a terminal window
          // yet, we'll just silently throw it away as we do TIOCGWINSZ
          if (!stream.tty) return -59;
          return 0;
        }
        default: abort('bad ioctl syscall ' + op);
      }
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___sys_mkdir(path, mode) {try {
  
      path = SYSCALLS.getStr(path);
      return SYSCALLS.doMkdir(path, mode);
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  
  function syscallMunmap(addr, len) {
      if ((addr | 0) === -1 || len === 0) {
        return -28;
      }
      // TODO: support unmmap'ing parts of allocations
      var info = SYSCALLS.mappings[addr];
      if (!info) return 0;
      if (len === info.len) {
        var stream = FS.getStream(info.fd);
        if (info.prot & 2) {
          SYSCALLS.doMsync(addr, stream, len, info.flags, info.offset);
        }
        FS.munmap(stream);
        SYSCALLS.mappings[addr] = null;
        if (info.allocated) {
          _free(info.malloc);
        }
      }
      return 0;
    }function ___sys_munmap(addr, len) {try {
  
      return syscallMunmap(addr, len);
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___sys_open(path, flags, varargs) {SYSCALLS.varargs = varargs;
  try {
  
      var pathname = SYSCALLS.getStr(path);
      var mode = SYSCALLS.get();
      var stream = FS.open(pathname, flags, mode);
      return stream.fd;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___sys_read(fd, buf, count) {try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      return FS.read(stream, HEAP8,buf, count);
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___sys_rmdir(path) {try {
  
      path = SYSCALLS.getStr(path);
      FS.rmdir(path);
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___sys_stat64(path, buf) {try {
  
      path = SYSCALLS.getStr(path);
      return SYSCALLS.doStat(FS.stat, path, buf);
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___sys_unlink(path) {try {
  
      path = SYSCALLS.getStr(path);
      FS.unlink(path);
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function __emscripten_fetch_free(id) {
    //Note: should just be [id], but indexes off by 1 (see: #8803)
    delete Fetch.xhrs[id-1];
  }

  function _abort() {
      abort();
    }

  var _abs=Math_abs;

  
  
  
  
  function _emscripten_set_main_loop_timing(mode, value) {
      Browser.mainLoop.timingMode = mode;
      Browser.mainLoop.timingValue = value;
  
      if (!Browser.mainLoop.func) {
        console.error('emscripten_set_main_loop_timing: Cannot set timing mode for main loop since a main loop does not exist! Call emscripten_set_main_loop first to set one up.');
        return 1; // Return non-zero on failure, can't set timing mode when there is no main loop.
      }
  
      if (mode == 0 /*EM_TIMING_SETTIMEOUT*/) {
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_setTimeout() {
          var timeUntilNextTick = Math.max(0, Browser.mainLoop.tickStartTime + value - _emscripten_get_now())|0;
          setTimeout(Browser.mainLoop.runner, timeUntilNextTick); // doing this each time means that on exception, we stop
        };
        Browser.mainLoop.method = 'timeout';
      } else if (mode == 1 /*EM_TIMING_RAF*/) {
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_rAF() {
          Browser.requestAnimationFrame(Browser.mainLoop.runner);
        };
        Browser.mainLoop.method = 'rAF';
      } else if (mode == 2 /*EM_TIMING_SETIMMEDIATE*/) {
        if (typeof setImmediate === 'undefined') {
          // Emulate setImmediate. (note: not a complete polyfill, we don't emulate clearImmediate() to keep code size to minimum, since not needed)
          var setImmediates = [];
          var emscriptenMainLoopMessageId = 'setimmediate';
          var Browser_setImmediate_messageHandler = function(event) {
            // When called in current thread or Worker, the main loop ID is structured slightly different to accommodate for --proxy-to-worker runtime listening to Worker events,
            // so check for both cases.
            if (event.data === emscriptenMainLoopMessageId || event.data.target === emscriptenMainLoopMessageId) {
              event.stopPropagation();
              setImmediates.shift()();
            }
          }
          addEventListener("message", Browser_setImmediate_messageHandler, true);
          setImmediate = /** @type{function(function(): ?, ...?): number} */(function Browser_emulated_setImmediate(func) {
            setImmediates.push(func);
            if (ENVIRONMENT_IS_WORKER) {
              if (Module['setImmediates'] === undefined) Module['setImmediates'] = [];
              Module['setImmediates'].push(func);
              postMessage({target: emscriptenMainLoopMessageId}); // In --proxy-to-worker, route the message via proxyClient.js
            } else postMessage(emscriptenMainLoopMessageId, "*"); // On the main thread, can just send the message to itself.
          })
        }
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_setImmediate() {
          setImmediate(Browser.mainLoop.runner);
        };
        Browser.mainLoop.method = 'immediate';
      }
      return 0;
    }
  
  var _emscripten_get_now;if (ENVIRONMENT_IS_NODE) {
    _emscripten_get_now = function() {
      var t = process['hrtime']();
      return t[0] * 1e3 + t[1] / 1e6;
    };
  } else if (typeof dateNow !== 'undefined') {
    _emscripten_get_now = dateNow;
  } else _emscripten_get_now = function() { return performance.now(); }
  ;/** @param {number|boolean=} noSetTiming */
  function _emscripten_set_main_loop(func, fps, simulateInfiniteLoop, arg, noSetTiming) {
      noExitRuntime = true;
  
      assert(!Browser.mainLoop.func, 'emscripten_set_main_loop: there can only be one main loop function at once: call emscripten_cancel_main_loop to cancel the previous one before setting a new one with different parameters.');
  
      Browser.mainLoop.func = func;
      Browser.mainLoop.arg = arg;
  
      var browserIterationFunc;
      if (typeof arg !== 'undefined') {
        browserIterationFunc = function() {
          Module['dynCall_vi'](func, arg);
        };
      } else {
        browserIterationFunc = function() {
          Module['dynCall_v'](func);
        };
      }
  
      var thisMainLoopId = Browser.mainLoop.currentlyRunningMainloop;
  
      Browser.mainLoop.runner = function Browser_mainLoop_runner() {
        if (ABORT) return;
        if (Browser.mainLoop.queue.length > 0) {
          var start = Date.now();
          var blocker = Browser.mainLoop.queue.shift();
          blocker.func(blocker.arg);
          if (Browser.mainLoop.remainingBlockers) {
            var remaining = Browser.mainLoop.remainingBlockers;
            var next = remaining%1 == 0 ? remaining-1 : Math.floor(remaining);
            if (blocker.counted) {
              Browser.mainLoop.remainingBlockers = next;
            } else {
              // not counted, but move the progress along a tiny bit
              next = next + 0.5; // do not steal all the next one's progress
              Browser.mainLoop.remainingBlockers = (8*remaining + next)/9;
            }
          }
          console.log('main loop blocker "' + blocker.name + '" took ' + (Date.now() - start) + ' ms'); //, left: ' + Browser.mainLoop.remainingBlockers);
          Browser.mainLoop.updateStatus();
  
          // catches pause/resume main loop from blocker execution
          if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) return;
  
          setTimeout(Browser.mainLoop.runner, 0);
          return;
        }
  
        // catch pauses from non-main loop sources
        if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) return;
  
        // Implement very basic swap interval control
        Browser.mainLoop.currentFrameNumber = Browser.mainLoop.currentFrameNumber + 1 | 0;
        if (Browser.mainLoop.timingMode == 1/*EM_TIMING_RAF*/ && Browser.mainLoop.timingValue > 1 && Browser.mainLoop.currentFrameNumber % Browser.mainLoop.timingValue != 0) {
          // Not the scheduled time to render this frame - skip.
          Browser.mainLoop.scheduler();
          return;
        } else if (Browser.mainLoop.timingMode == 0/*EM_TIMING_SETTIMEOUT*/) {
          Browser.mainLoop.tickStartTime = _emscripten_get_now();
        }
  
        // Signal GL rendering layer that processing of a new frame is about to start. This helps it optimize
        // VBO double-buffering and reduce GPU stalls.
        GL.newRenderingFrameStarted();
  
  
  
        if (Browser.mainLoop.method === 'timeout' && Module.ctx) {
          warnOnce('Looks like you are rendering without using requestAnimationFrame for the main loop. You should use 0 for the frame rate in emscripten_set_main_loop in order to use requestAnimationFrame, as that can greatly improve your frame rates!');
          Browser.mainLoop.method = ''; // just warn once per call to set main loop
        }
  
        Browser.mainLoop.runIter(browserIterationFunc);
  
        checkStackCookie();
  
        // catch pauses from the main loop itself
        if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) return;
  
        // Queue new audio data. This is important to be right after the main loop invocation, so that we will immediately be able
        // to queue the newest produced audio samples.
        // TODO: Consider adding pre- and post- rAF callbacks so that GL.newRenderingFrameStarted() and SDL.audio.queueNewAudioData()
        //       do not need to be hardcoded into this function, but can be more generic.
        if (typeof SDL === 'object' && SDL.audio && SDL.audio.queueNewAudioData) SDL.audio.queueNewAudioData();
  
        Browser.mainLoop.scheduler();
      }
  
      if (!noSetTiming) {
        if (fps && fps > 0) _emscripten_set_main_loop_timing(0/*EM_TIMING_SETTIMEOUT*/, 1000.0 / fps);
        else _emscripten_set_main_loop_timing(1/*EM_TIMING_RAF*/, 1); // Do rAF by rendering each frame (no decimating)
  
        Browser.mainLoop.scheduler();
      }
  
      if (simulateInfiniteLoop) {
        throw 'unwind';
      }
    }var Browser={mainLoop:{scheduler:null,method:"",currentlyRunningMainloop:0,func:null,arg:0,timingMode:0,timingValue:0,currentFrameNumber:0,queue:[],pause:function() {
          Browser.mainLoop.scheduler = null;
          Browser.mainLoop.currentlyRunningMainloop++; // Incrementing this signals the previous main loop that it's now become old, and it must return.
        },resume:function() {
          Browser.mainLoop.currentlyRunningMainloop++;
          var timingMode = Browser.mainLoop.timingMode;
          var timingValue = Browser.mainLoop.timingValue;
          var func = Browser.mainLoop.func;
          Browser.mainLoop.func = null;
          _emscripten_set_main_loop(func, 0, false, Browser.mainLoop.arg, true /* do not set timing and call scheduler, we will do it on the next lines */);
          _emscripten_set_main_loop_timing(timingMode, timingValue);
          Browser.mainLoop.scheduler();
        },updateStatus:function() {
          if (Module['setStatus']) {
            var message = Module['statusMessage'] || 'Please wait...';
            var remaining = Browser.mainLoop.remainingBlockers;
            var expected = Browser.mainLoop.expectedBlockers;
            if (remaining) {
              if (remaining < expected) {
                Module['setStatus'](message + ' (' + (expected - remaining) + '/' + expected + ')');
              } else {
                Module['setStatus'](message);
              }
            } else {
              Module['setStatus']('');
            }
          }
        },runIter:function(func) {
          if (ABORT) return;
          if (Module['preMainLoop']) {
            var preRet = Module['preMainLoop']();
            if (preRet === false) {
              return; // |return false| skips a frame
            }
          }
          try {
            func();
          } catch (e) {
            if (e instanceof ExitStatus) {
              return;
            } else {
              if (e && typeof e === 'object' && e.stack) err('exception thrown: ' + [e, e.stack]);
              throw e;
            }
          }
          if (Module['postMainLoop']) Module['postMainLoop']();
        }},isFullscreen:false,pointerLock:false,moduleContextCreatedCallbacks:[],workers:[],init:function() {
        if (!Module["preloadPlugins"]) Module["preloadPlugins"] = []; // needs to exist even in workers
  
        if (Browser.initted) return;
        Browser.initted = true;
  
        try {
          new Blob();
          Browser.hasBlobConstructor = true;
        } catch(e) {
          Browser.hasBlobConstructor = false;
          console.log("warning: no blob constructor, cannot create blobs with mimetypes");
        }
        Browser.BlobBuilder = typeof MozBlobBuilder != "undefined" ? MozBlobBuilder : (typeof WebKitBlobBuilder != "undefined" ? WebKitBlobBuilder : (!Browser.hasBlobConstructor ? console.log("warning: no BlobBuilder") : null));
        Browser.URLObject = typeof window != "undefined" ? (window.URL ? window.URL : window.webkitURL) : undefined;
        if (!Module.noImageDecoding && typeof Browser.URLObject === 'undefined') {
          console.log("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available.");
          Module.noImageDecoding = true;
        }
  
        // Support for plugins that can process preloaded files. You can add more of these to
        // your app by creating and appending to Module.preloadPlugins.
        //
        // Each plugin is asked if it can handle a file based on the file's name. If it can,
        // it is given the file's raw data. When it is done, it calls a callback with the file's
        // (possibly modified) data. For example, a plugin might decompress a file, or it
        // might create some side data structure for use later (like an Image element, etc.).
  
        var imagePlugin = {};
        imagePlugin['canHandle'] = function imagePlugin_canHandle(name) {
          return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name);
        };
        imagePlugin['handle'] = function imagePlugin_handle(byteArray, name, onload, onerror) {
          var b = null;
          if (Browser.hasBlobConstructor) {
            try {
              b = new Blob([byteArray], { type: Browser.getMimetype(name) });
              if (b.size !== byteArray.length) { // Safari bug #118630
                // Safari's Blob can only take an ArrayBuffer
                b = new Blob([(new Uint8Array(byteArray)).buffer], { type: Browser.getMimetype(name) });
              }
            } catch(e) {
              warnOnce('Blob constructor present but fails: ' + e + '; falling back to blob builder');
            }
          }
          if (!b) {
            var bb = new Browser.BlobBuilder();
            bb.append((new Uint8Array(byteArray)).buffer); // we need to pass a buffer, and must copy the array to get the right data range
            b = bb.getBlob();
          }
          var url = Browser.URLObject.createObjectURL(b);
          assert(typeof url == 'string', 'createObjectURL must return a url as a string');
          var img = new Image();
          img.onload = function img_onload() {
            assert(img.complete, 'Image ' + name + ' could not be decoded');
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            Module["preloadedImages"][name] = canvas;
            Browser.URLObject.revokeObjectURL(url);
            if (onload) onload(byteArray);
          };
          img.onerror = function img_onerror(event) {
            console.log('Image ' + url + ' could not be decoded');
            if (onerror) onerror();
          };
          img.src = url;
        };
        Module['preloadPlugins'].push(imagePlugin);
  
        var audioPlugin = {};
        audioPlugin['canHandle'] = function audioPlugin_canHandle(name) {
          return !Module.noAudioDecoding && name.substr(-4) in { '.ogg': 1, '.wav': 1, '.mp3': 1 };
        };
        audioPlugin['handle'] = function audioPlugin_handle(byteArray, name, onload, onerror) {
          var done = false;
          function finish(audio) {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = audio;
            if (onload) onload(byteArray);
          }
          function fail() {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = new Audio(); // empty shim
            if (onerror) onerror();
          }
          if (Browser.hasBlobConstructor) {
            try {
              var b = new Blob([byteArray], { type: Browser.getMimetype(name) });
            } catch(e) {
              return fail();
            }
            var url = Browser.URLObject.createObjectURL(b); // XXX we never revoke this!
            assert(typeof url == 'string', 'createObjectURL must return a url as a string');
            var audio = new Audio();
            audio.addEventListener('canplaythrough', function() { finish(audio) }, false); // use addEventListener due to chromium bug 124926
            audio.onerror = function audio_onerror(event) {
              if (done) return;
              console.log('warning: browser could not fully decode audio ' + name + ', trying slower base64 approach');
              function encode64(data) {
                var BASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
                var PAD = '=';
                var ret = '';
                var leftchar = 0;
                var leftbits = 0;
                for (var i = 0; i < data.length; i++) {
                  leftchar = (leftchar << 8) | data[i];
                  leftbits += 8;
                  while (leftbits >= 6) {
                    var curr = (leftchar >> (leftbits-6)) & 0x3f;
                    leftbits -= 6;
                    ret += BASE[curr];
                  }
                }
                if (leftbits == 2) {
                  ret += BASE[(leftchar&3) << 4];
                  ret += PAD + PAD;
                } else if (leftbits == 4) {
                  ret += BASE[(leftchar&0xf) << 2];
                  ret += PAD;
                }
                return ret;
              }
              audio.src = 'data:audio/x-' + name.substr(-3) + ';base64,' + encode64(byteArray);
              finish(audio); // we don't wait for confirmation this worked - but it's worth trying
            };
            audio.src = url;
            // workaround for chrome bug 124926 - we do not always get oncanplaythrough or onerror
            Browser.safeSetTimeout(function() {
              finish(audio); // try to use it even though it is not necessarily ready to play
            }, 10000);
          } else {
            return fail();
          }
        };
        Module['preloadPlugins'].push(audioPlugin);
  
  
        // Canvas event setup
  
        function pointerLockChange() {
          Browser.pointerLock = document['pointerLockElement'] === Module['canvas'] ||
                                document['mozPointerLockElement'] === Module['canvas'] ||
                                document['webkitPointerLockElement'] === Module['canvas'] ||
                                document['msPointerLockElement'] === Module['canvas'];
        }
        var canvas = Module['canvas'];
        if (canvas) {
          // forced aspect ratio can be enabled by defining 'forcedAspectRatio' on Module
          // Module['forcedAspectRatio'] = 4 / 3;
  
          canvas.requestPointerLock = canvas['requestPointerLock'] ||
                                      canvas['mozRequestPointerLock'] ||
                                      canvas['webkitRequestPointerLock'] ||
                                      canvas['msRequestPointerLock'] ||
                                      function(){};
          canvas.exitPointerLock = document['exitPointerLock'] ||
                                   document['mozExitPointerLock'] ||
                                   document['webkitExitPointerLock'] ||
                                   document['msExitPointerLock'] ||
                                   function(){}; // no-op if function does not exist
          canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
  
          document.addEventListener('pointerlockchange', pointerLockChange, false);
          document.addEventListener('mozpointerlockchange', pointerLockChange, false);
          document.addEventListener('webkitpointerlockchange', pointerLockChange, false);
          document.addEventListener('mspointerlockchange', pointerLockChange, false);
  
          if (Module['elementPointerLock']) {
            canvas.addEventListener("click", function(ev) {
              if (!Browser.pointerLock && Module['canvas'].requestPointerLock) {
                Module['canvas'].requestPointerLock();
                ev.preventDefault();
              }
            }, false);
          }
        }
      },createContext:function(canvas, useWebGL, setInModule, webGLContextAttributes) {
        if (useWebGL && Module.ctx && canvas == Module.canvas) return Module.ctx; // no need to recreate GL context if it's already been created for this canvas.
  
        var ctx;
        var contextHandle;
        if (useWebGL) {
          // For GLES2/desktop GL compatibility, adjust a few defaults to be different to WebGL defaults, so that they align better with the desktop defaults.
          var contextAttributes = {
            antialias: false,
            alpha: false,
            majorVersion: 1,
          };
  
          if (webGLContextAttributes) {
            for (var attribute in webGLContextAttributes) {
              contextAttributes[attribute] = webGLContextAttributes[attribute];
            }
          }
  
          // This check of existence of GL is here to satisfy Closure compiler, which yells if variable GL is referenced below but GL object is not
          // actually compiled in because application is not doing any GL operations. TODO: Ideally if GL is not being used, this function
          // Browser.createContext() should not even be emitted.
          if (typeof GL !== 'undefined') {
            contextHandle = GL.createContext(canvas, contextAttributes);
            if (contextHandle) {
              ctx = GL.getContext(contextHandle).GLctx;
            }
          }
        } else {
          ctx = canvas.getContext('2d');
        }
  
        if (!ctx) return null;
  
        if (setInModule) {
          if (!useWebGL) assert(typeof GLctx === 'undefined', 'cannot set in module if GLctx is used, but we are a non-GL context that would replace it');
  
          Module.ctx = ctx;
          if (useWebGL) GL.makeContextCurrent(contextHandle);
          Module.useWebGL = useWebGL;
          Browser.moduleContextCreatedCallbacks.forEach(function(callback) { callback() });
          Browser.init();
        }
        return ctx;
      },destroyContext:function(canvas, useWebGL, setInModule) {},fullscreenHandlersInstalled:false,lockPointer:undefined,resizeCanvas:undefined,requestFullscreen:function(lockPointer, resizeCanvas) {
        Browser.lockPointer = lockPointer;
        Browser.resizeCanvas = resizeCanvas;
        if (typeof Browser.lockPointer === 'undefined') Browser.lockPointer = true;
        if (typeof Browser.resizeCanvas === 'undefined') Browser.resizeCanvas = false;
  
        var canvas = Module['canvas'];
        function fullscreenChange() {
          Browser.isFullscreen = false;
          var canvasContainer = canvas.parentNode;
          if ((document['fullscreenElement'] || document['mozFullScreenElement'] ||
               document['msFullscreenElement'] || document['webkitFullscreenElement'] ||
               document['webkitCurrentFullScreenElement']) === canvasContainer) {
            canvas.exitFullscreen = Browser.exitFullscreen;
            if (Browser.lockPointer) canvas.requestPointerLock();
            Browser.isFullscreen = true;
            if (Browser.resizeCanvas) {
              Browser.setFullscreenCanvasSize();
            } else {
              Browser.updateCanvasDimensions(canvas);
            }
          } else {
            // remove the full screen specific parent of the canvas again to restore the HTML structure from before going full screen
            canvasContainer.parentNode.insertBefore(canvas, canvasContainer);
            canvasContainer.parentNode.removeChild(canvasContainer);
  
            if (Browser.resizeCanvas) {
              Browser.setWindowedCanvasSize();
            } else {
              Browser.updateCanvasDimensions(canvas);
            }
          }
          if (Module['onFullScreen']) Module['onFullScreen'](Browser.isFullscreen);
          if (Module['onFullscreen']) Module['onFullscreen'](Browser.isFullscreen);
        }
  
        if (!Browser.fullscreenHandlersInstalled) {
          Browser.fullscreenHandlersInstalled = true;
          document.addEventListener('fullscreenchange', fullscreenChange, false);
          document.addEventListener('mozfullscreenchange', fullscreenChange, false);
          document.addEventListener('webkitfullscreenchange', fullscreenChange, false);
          document.addEventListener('MSFullscreenChange', fullscreenChange, false);
        }
  
        // create a new parent to ensure the canvas has no siblings. this allows browsers to optimize full screen performance when its parent is the full screen root
        var canvasContainer = document.createElement("div");
        canvas.parentNode.insertBefore(canvasContainer, canvas);
        canvasContainer.appendChild(canvas);
  
        // use parent of canvas as full screen root to allow aspect ratio correction (Firefox stretches the root to screen size)
        canvasContainer.requestFullscreen = canvasContainer['requestFullscreen'] ||
                                            canvasContainer['mozRequestFullScreen'] ||
                                            canvasContainer['msRequestFullscreen'] ||
                                           (canvasContainer['webkitRequestFullscreen'] ? function() { canvasContainer['webkitRequestFullscreen'](Element['ALLOW_KEYBOARD_INPUT']) } : null) ||
                                           (canvasContainer['webkitRequestFullScreen'] ? function() { canvasContainer['webkitRequestFullScreen'](Element['ALLOW_KEYBOARD_INPUT']) } : null);
  
        canvasContainer.requestFullscreen();
      },requestFullScreen:function() {
        abort('Module.requestFullScreen has been replaced by Module.requestFullscreen (without a capital S)');
      },exitFullscreen:function() {
        // This is workaround for chrome. Trying to exit from fullscreen
        // not in fullscreen state will cause "TypeError: Document not active"
        // in chrome. See https://github.com/emscripten-core/emscripten/pull/8236
        if (!Browser.isFullscreen) {
          return false;
        }
  
        var CFS = document['exitFullscreen'] ||
                  document['cancelFullScreen'] ||
                  document['mozCancelFullScreen'] ||
                  document['msExitFullscreen'] ||
                  document['webkitCancelFullScreen'] ||
            (function() {});
        CFS.apply(document, []);
        return true;
      },nextRAF:0,fakeRequestAnimationFrame:function(func) {
        // try to keep 60fps between calls to here
        var now = Date.now();
        if (Browser.nextRAF === 0) {
          Browser.nextRAF = now + 1000/60;
        } else {
          while (now + 2 >= Browser.nextRAF) { // fudge a little, to avoid timer jitter causing us to do lots of delay:0
            Browser.nextRAF += 1000/60;
          }
        }
        var delay = Math.max(Browser.nextRAF - now, 0);
        setTimeout(func, delay);
      },requestAnimationFrame:function(func) {
        if (typeof requestAnimationFrame === 'function') {
          requestAnimationFrame(func);
          return;
        }
        var RAF = Browser.fakeRequestAnimationFrame;
        RAF(func);
      },safeCallback:function(func) {
        return function() {
          if (!ABORT) return func.apply(null, arguments);
        };
      },allowAsyncCallbacks:true,queuedAsyncCallbacks:[],pauseAsyncCallbacks:function() {
        Browser.allowAsyncCallbacks = false;
      },resumeAsyncCallbacks:function() { // marks future callbacks as ok to execute, and synchronously runs any remaining ones right now
        Browser.allowAsyncCallbacks = true;
        if (Browser.queuedAsyncCallbacks.length > 0) {
          var callbacks = Browser.queuedAsyncCallbacks;
          Browser.queuedAsyncCallbacks = [];
          callbacks.forEach(function(func) {
            func();
          });
        }
      },safeRequestAnimationFrame:function(func) {
        return Browser.requestAnimationFrame(function() {
          if (ABORT) return;
          if (Browser.allowAsyncCallbacks) {
            func();
          } else {
            Browser.queuedAsyncCallbacks.push(func);
          }
        });
      },safeSetTimeout:function(func, timeout) {
        noExitRuntime = true;
        return setTimeout(function() {
          if (ABORT) return;
          if (Browser.allowAsyncCallbacks) {
            func();
          } else {
            Browser.queuedAsyncCallbacks.push(func);
          }
        }, timeout);
      },safeSetInterval:function(func, timeout) {
        noExitRuntime = true;
        return setInterval(function() {
          if (ABORT) return;
          if (Browser.allowAsyncCallbacks) {
            func();
          } // drop it on the floor otherwise, next interval will kick in
        }, timeout);
      },getMimetype:function(name) {
        return {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'bmp': 'image/bmp',
          'ogg': 'audio/ogg',
          'wav': 'audio/wav',
          'mp3': 'audio/mpeg'
        }[name.substr(name.lastIndexOf('.')+1)];
      },getUserMedia:function(func) {
        if(!window.getUserMedia) {
          window.getUserMedia = navigator['getUserMedia'] ||
                                navigator['mozGetUserMedia'];
        }
        window.getUserMedia(func);
      },getMovementX:function(event) {
        return event['movementX'] ||
               event['mozMovementX'] ||
               event['webkitMovementX'] ||
               0;
      },getMovementY:function(event) {
        return event['movementY'] ||
               event['mozMovementY'] ||
               event['webkitMovementY'] ||
               0;
      },getMouseWheelDelta:function(event) {
        var delta = 0;
        switch (event.type) {
          case 'DOMMouseScroll':
            // 3 lines make up a step
            delta = event.detail / 3;
            break;
          case 'mousewheel':
            // 120 units make up a step
            delta = event.wheelDelta / 120;
            break;
          case 'wheel':
            delta = event.deltaY
            switch(event.deltaMode) {
              case 0:
                // DOM_DELTA_PIXEL: 100 pixels make up a step
                delta /= 100;
                break;
              case 1:
                // DOM_DELTA_LINE: 3 lines make up a step
                delta /= 3;
                break;
              case 2:
                // DOM_DELTA_PAGE: A page makes up 80 steps
                delta *= 80;
                break;
              default:
                throw 'unrecognized mouse wheel delta mode: ' + event.deltaMode;
            }
            break;
          default:
            throw 'unrecognized mouse wheel event: ' + event.type;
        }
        return delta;
      },mouseX:0,mouseY:0,mouseMovementX:0,mouseMovementY:0,touches:{},lastTouches:{},calculateMouseEvent:function(event) { // event should be mousemove, mousedown or mouseup
        if (Browser.pointerLock) {
          // When the pointer is locked, calculate the coordinates
          // based on the movement of the mouse.
          // Workaround for Firefox bug 764498
          if (event.type != 'mousemove' &&
              ('mozMovementX' in event)) {
            Browser.mouseMovementX = Browser.mouseMovementY = 0;
          } else {
            Browser.mouseMovementX = Browser.getMovementX(event);
            Browser.mouseMovementY = Browser.getMovementY(event);
          }
  
          // check if SDL is available
          if (typeof SDL != "undefined") {
            Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
            Browser.mouseY = SDL.mouseY + Browser.mouseMovementY;
          } else {
            // just add the mouse delta to the current absolut mouse position
            // FIXME: ideally this should be clamped against the canvas size and zero
            Browser.mouseX += Browser.mouseMovementX;
            Browser.mouseY += Browser.mouseMovementY;
          }
        } else {
          // Otherwise, calculate the movement based on the changes
          // in the coordinates.
          var rect = Module["canvas"].getBoundingClientRect();
          var cw = Module["canvas"].width;
          var ch = Module["canvas"].height;
  
          // Neither .scrollX or .pageXOffset are defined in a spec, but
          // we prefer .scrollX because it is currently in a spec draft.
          // (see: http://www.w3.org/TR/2013/WD-cssom-view-20131217/)
          var scrollX = ((typeof window.scrollX !== 'undefined') ? window.scrollX : window.pageXOffset);
          var scrollY = ((typeof window.scrollY !== 'undefined') ? window.scrollY : window.pageYOffset);
          // If this assert lands, it's likely because the browser doesn't support scrollX or pageXOffset
          // and we have no viable fallback.
          assert((typeof scrollX !== 'undefined') && (typeof scrollY !== 'undefined'), 'Unable to retrieve scroll position, mouse positions likely broken.');
  
          if (event.type === 'touchstart' || event.type === 'touchend' || event.type === 'touchmove') {
            var touch = event.touch;
            if (touch === undefined) {
              return; // the "touch" property is only defined in SDL
  
            }
            var adjustedX = touch.pageX - (scrollX + rect.left);
            var adjustedY = touch.pageY - (scrollY + rect.top);
  
            adjustedX = adjustedX * (cw / rect.width);
            adjustedY = adjustedY * (ch / rect.height);
  
            var coords = { x: adjustedX, y: adjustedY };
  
            if (event.type === 'touchstart') {
              Browser.lastTouches[touch.identifier] = coords;
              Browser.touches[touch.identifier] = coords;
            } else if (event.type === 'touchend' || event.type === 'touchmove') {
              var last = Browser.touches[touch.identifier];
              if (!last) last = coords;
              Browser.lastTouches[touch.identifier] = last;
              Browser.touches[touch.identifier] = coords;
            }
            return;
          }
  
          var x = event.pageX - (scrollX + rect.left);
          var y = event.pageY - (scrollY + rect.top);
  
          // the canvas might be CSS-scaled compared to its backbuffer;
          // SDL-using content will want mouse coordinates in terms
          // of backbuffer units.
          x = x * (cw / rect.width);
          y = y * (ch / rect.height);
  
          Browser.mouseMovementX = x - Browser.mouseX;
          Browser.mouseMovementY = y - Browser.mouseY;
          Browser.mouseX = x;
          Browser.mouseY = y;
        }
      },asyncLoad:function(url, onload, onerror, noRunDep) {
        var dep = !noRunDep ? getUniqueRunDependency('al ' + url) : '';
        readAsync(url, function(arrayBuffer) {
          assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
          onload(new Uint8Array(arrayBuffer));
          if (dep) removeRunDependency(dep);
        }, function(event) {
          if (onerror) {
            onerror();
          } else {
            throw 'Loading data file "' + url + '" failed.';
          }
        });
        if (dep) addRunDependency(dep);
      },resizeListeners:[],updateResizeListeners:function() {
        var canvas = Module['canvas'];
        Browser.resizeListeners.forEach(function(listener) {
          listener(canvas.width, canvas.height);
        });
      },setCanvasSize:function(width, height, noUpdates) {
        var canvas = Module['canvas'];
        Browser.updateCanvasDimensions(canvas, width, height);
        if (!noUpdates) Browser.updateResizeListeners();
      },windowedWidth:0,windowedHeight:0,setFullscreenCanvasSize:function() {
        // check if SDL is available
        if (typeof SDL != "undefined") {
          var flags = HEAPU32[((SDL.screen)>>2)];
          flags = flags | 0x00800000; // set SDL_FULLSCREEN flag
          HEAP32[((SDL.screen)>>2)]=flags
        }
        Browser.updateCanvasDimensions(Module['canvas']);
        Browser.updateResizeListeners();
      },setWindowedCanvasSize:function() {
        // check if SDL is available
        if (typeof SDL != "undefined") {
          var flags = HEAPU32[((SDL.screen)>>2)];
          flags = flags & ~0x00800000; // clear SDL_FULLSCREEN flag
          HEAP32[((SDL.screen)>>2)]=flags
        }
        Browser.updateCanvasDimensions(Module['canvas']);
        Browser.updateResizeListeners();
      },updateCanvasDimensions:function(canvas, wNative, hNative) {
        if (wNative && hNative) {
          canvas.widthNative = wNative;
          canvas.heightNative = hNative;
        } else {
          wNative = canvas.widthNative;
          hNative = canvas.heightNative;
        }
        var w = wNative;
        var h = hNative;
        if (Module['forcedAspectRatio'] && Module['forcedAspectRatio'] > 0) {
          if (w/h < Module['forcedAspectRatio']) {
            w = Math.round(h * Module['forcedAspectRatio']);
          } else {
            h = Math.round(w / Module['forcedAspectRatio']);
          }
        }
        if (((document['fullscreenElement'] || document['mozFullScreenElement'] ||
             document['msFullscreenElement'] || document['webkitFullscreenElement'] ||
             document['webkitCurrentFullScreenElement']) === canvas.parentNode) && (typeof screen != 'undefined')) {
           var factor = Math.min(screen.width / w, screen.height / h);
           w = Math.round(w * factor);
           h = Math.round(h * factor);
        }
        if (Browser.resizeCanvas) {
          if (canvas.width  != w) canvas.width  = w;
          if (canvas.height != h) canvas.height = h;
          if (typeof canvas.style != 'undefined') {
            canvas.style.removeProperty( "width");
            canvas.style.removeProperty("height");
          }
        } else {
          if (canvas.width  != wNative) canvas.width  = wNative;
          if (canvas.height != hNative) canvas.height = hNative;
          if (typeof canvas.style != 'undefined') {
            if (w != wNative || h != hNative) {
              canvas.style.setProperty( "width", w + "px", "important");
              canvas.style.setProperty("height", h + "px", "important");
            } else {
              canvas.style.removeProperty( "width");
              canvas.style.removeProperty("height");
            }
          }
        }
      },wgetRequests:{},nextWgetRequestHandle:0,getNextWgetRequestHandle:function() {
        var handle = Browser.nextWgetRequestHandle;
        Browser.nextWgetRequestHandle++;
        return handle;
      }};var AL={QUEUE_INTERVAL:25,QUEUE_LOOKAHEAD:0.1,DEVICE_NAME:"Emscripten OpenAL",CAPTURE_DEVICE_NAME:"Emscripten OpenAL capture",ALC_EXTENSIONS:{ALC_SOFT_pause_device:true,ALC_SOFT_HRTF:true},AL_EXTENSIONS:{AL_EXT_float32:true,AL_SOFT_loop_points:true,AL_SOFT_source_length:true,AL_EXT_source_distance_model:true,AL_SOFT_source_spatialize:true},_alcErr:0,alcErr:0,deviceRefCounts:{},alcStringCache:{},paused:false,stringCache:{},contexts:{},currentCtx:null,buffers:{0:{id:0,refCount:0,audioBuf:null,frequency:0,bytesPerSample:2,channels:1,length:0}},paramArray:[],_nextId:1,newId:function() {
        return AL.freeIds.length > 0 ? AL.freeIds.pop() : AL._nextId++;
      },freeIds:[],scheduleContextAudio:function(ctx) {
        // If we are animating using the requestAnimationFrame method, then the main loop does not run when in the background.
        // To give a perfect glitch-free audio stop when switching from foreground to background, we need to avoid updating
        // audio altogether when in the background, so detect that case and kill audio buffer streaming if so.
        if (Browser.mainLoop.timingMode === 1 /* EM_TIMING_RAF */ && document['visibilityState'] != 'visible') {
          return;
        }
  
        for (var i in ctx.sources) {
          AL.scheduleSourceAudio(ctx.sources[i]);
        }
      },scheduleSourceAudio:function(src, lookahead) {
        // See comment on scheduleContextAudio above.
        if (Browser.mainLoop.timingMode === 1 /*EM_TIMING_RAF*/ && document['visibilityState'] != 'visible') {
          return;
        }
        if (src.state !== 0x1012 /* AL_PLAYING */) {
          return;
        }
  
        var currentTime = AL.updateSourceTime(src);
  
        var startTime = src.bufStartTime;
        var startOffset = src.bufOffset;
        var bufCursor = src.bufsProcessed;
  
        // Advance past any audio that is already scheduled
        for (var i = 0; i < src.audioQueue.length; i++) {
          var audioSrc = src.audioQueue[i];
          startTime = audioSrc._startTime + audioSrc._duration;
          startOffset = 0.0;
          bufCursor += audioSrc._skipCount + 1;
        }
  
        if (!lookahead) {
          lookahead = AL.QUEUE_LOOKAHEAD;
        }
        var lookaheadTime = currentTime + lookahead;
        var skipCount = 0;
        while (startTime < lookaheadTime) {
          if (bufCursor >= src.bufQueue.length) {
            if (src.looping) {
              bufCursor %= src.bufQueue.length;
            } else {
              break;
            }
          }
  
          var buf = src.bufQueue[bufCursor % src.bufQueue.length];
          // If the buffer contains no data, skip it
          if (buf.length === 0) {
            skipCount++;
            // If we've gone through the whole queue and everything is 0 length, just give up
            if (skipCount === src.bufQueue.length) {
              break;
            }
          } else {
            var audioSrc = src.context.audioCtx.createBufferSource();
            audioSrc.buffer = buf.audioBuf;
            audioSrc.playbackRate.value = src.playbackRate;
            if (buf.audioBuf._loopStart || buf.audioBuf._loopEnd) {
              audioSrc.loopStart = buf.audioBuf._loopStart;
              audioSrc.loopEnd = buf.audioBuf._loopEnd;
            }
  
            var duration = 0.0;
            // If the source is a looping static buffer, use native looping for gapless playback
            if (src.type === 0x1028 /* AL_STATIC */ && src.looping) {
              duration = Number.POSITIVE_INFINITY;
              audioSrc.loop = true;
              if (buf.audioBuf._loopStart) {
                audioSrc.loopStart = buf.audioBuf._loopStart;
              }
              if (buf.audioBuf._loopEnd) {
                audioSrc.loopEnd = buf.audioBuf._loopEnd;
              }
            } else {
              duration = (buf.audioBuf.duration - startOffset) / src.playbackRate;
            }
  
            audioSrc._startOffset = startOffset;
            audioSrc._duration = duration;
            audioSrc._skipCount = skipCount;
            skipCount = 0;
  
            audioSrc.connect(src.gain);
  
            if (typeof(audioSrc.start) !== 'undefined') {
              // Sample the current time as late as possible to mitigate drift
              startTime = Math.max(startTime, src.context.audioCtx.currentTime);
              audioSrc.start(startTime, startOffset);
            } else if (typeof(audioSrc.noteOn) !== 'undefined') {
              startTime = Math.max(startTime, src.context.audioCtx.currentTime);
              audioSrc.noteOn(startTime);
            }
            audioSrc._startTime = startTime;
            src.audioQueue.push(audioSrc);
  
            startTime += duration;
          }
  
          startOffset = 0.0;
          bufCursor++;
        }
      },updateSourceTime:function(src) {
        var currentTime = src.context.audioCtx.currentTime;
        if (src.state !== 0x1012 /* AL_PLAYING */) {
          return currentTime;
        }
  
        // if the start time is unset, determine it based on the current offset.
        // This will be the case when a source is resumed after being paused, and
        // allows us to pretend that the source actually started playing some time
        // in the past such that it would just now have reached the stored offset.
        if (!isFinite(src.bufStartTime)) {
          src.bufStartTime = currentTime - src.bufOffset / src.playbackRate;
          src.bufOffset = 0.0;
        }
  
        var nextStartTime = 0.0;
        while (src.audioQueue.length) {
          var audioSrc = src.audioQueue[0];
          src.bufsProcessed += audioSrc._skipCount;
          nextStartTime = audioSrc._startTime + audioSrc._duration; // n.b. audioSrc._duration already factors in playbackRate, so no divide by src.playbackRate on it.
  
          if (currentTime < nextStartTime) {
            break;
          }
  
          src.audioQueue.shift();
          src.bufStartTime = nextStartTime;
          src.bufOffset = 0.0;
          src.bufsProcessed++;
        }
  
        if (src.bufsProcessed >= src.bufQueue.length && !src.looping) {
          // The source has played its entire queue and is non-looping, so just mark it as stopped.
          AL.setSourceState(src, 0x1014 /* AL_STOPPED */);
        } else if (src.type === 0x1028 /* AL_STATIC */ && src.looping) {
          // If the source is a looping static buffer, determine the buffer offset based on the loop points
          var buf = src.bufQueue[0];
          if (buf.length === 0) {
            src.bufOffset = 0.0;
          } else {
            var delta = (currentTime - src.bufStartTime) * src.playbackRate;
            var loopStart = buf.audioBuf._loopStart || 0.0;
            var loopEnd = buf.audioBuf._loopEnd || buf.audioBuf.duration;
            if (loopEnd <= loopStart) {
              loopEnd = buf.audioBuf.duration;
            }
  
            if (delta < loopEnd) {
              src.bufOffset = delta;
            } else {
              src.bufOffset = loopStart + (delta - loopStart) % (loopEnd - loopStart);
            }
          }
        } else if (src.audioQueue[0]) {
          // The source is still actively playing, so we just need to calculate where we are in the current buffer
          // so it can be remembered if the source gets paused.
          src.bufOffset = (currentTime - src.audioQueue[0]._startTime) * src.playbackRate;
        } else {
          // The source hasn't finished yet, but there is no scheduled audio left for it. This can be because
          // the source has just been started/resumed, or due to an underrun caused by a long blocking operation.
          // We need to determine what state we would be in by this point in time so that when we next schedule
          // audio playback, it will be just as if no underrun occurred.
  
          if (src.type !== 0x1028 /* AL_STATIC */ && src.looping) {
            // if the source is a looping buffer queue, let's first calculate the queue duration, so we can
            // quickly fast forward past any full loops of the queue and only worry about the remainder.
            var srcDuration = AL.sourceDuration(src) / src.playbackRate;
            if (srcDuration > 0.0) {
              src.bufStartTime += Math.floor((currentTime - src.bufStartTime) / srcDuration) * srcDuration;
            }
          }
  
          // Since we've already skipped any full-queue loops if there were any, we just need to find
          // out where in the queue the remaining time puts us, which won't require stepping through the
          // entire queue more than once.
          for (var i = 0; i < src.bufQueue.length; i++) {
            if (src.bufsProcessed >= src.bufQueue.length) {
              if (src.looping) {
                src.bufsProcessed %= src.bufQueue.length;
              } else {
                AL.setSourceState(src, 0x1014 /* AL_STOPPED */);
                break;
              }
            }
  
            var buf = src.bufQueue[src.bufsProcessed];
            if (buf.length > 0) {
              nextStartTime = src.bufStartTime + buf.audioBuf.duration / src.playbackRate;
  
              if (currentTime < nextStartTime) {
                src.bufOffset = (currentTime - src.bufStartTime) * src.playbackRate;
                break;
              }
  
              src.bufStartTime = nextStartTime;
            }
  
            src.bufOffset = 0.0;
            src.bufsProcessed++;
          }
        }
  
        return currentTime;
      },cancelPendingSourceAudio:function(src) {
        AL.updateSourceTime(src);
  
        for (var i = 1; i < src.audioQueue.length; i++) {
          var audioSrc = src.audioQueue[i];
          audioSrc.stop();
        }
  
        if (src.audioQueue.length > 1) {
          src.audioQueue.length = 1;
        }
      },stopSourceAudio:function(src) {
        for (var i = 0; i < src.audioQueue.length; i++) {
          src.audioQueue[i].stop();
        }
        src.audioQueue.length = 0;
      },setSourceState:function(src, state) {
        if (state === 0x1012 /* AL_PLAYING */) {
          if (src.state === 0x1012 /* AL_PLAYING */ || src.state == 0x1014 /* AL_STOPPED */) {
            src.bufsProcessed = 0;
            src.bufOffset = 0.0;
          } else {
          }
  
          AL.stopSourceAudio(src);
  
          src.state = 0x1012 /* AL_PLAYING */;
          src.bufStartTime = Number.NEGATIVE_INFINITY;
          AL.scheduleSourceAudio(src);
        } else if (state === 0x1013 /* AL_PAUSED */) {
          if (src.state === 0x1012 /* AL_PLAYING */) {
            // Store off the current offset to restore with on resume.
            AL.updateSourceTime(src);
            AL.stopSourceAudio(src);
  
            src.state = 0x1013 /* AL_PAUSED */;
          }
        } else if (state === 0x1014 /* AL_STOPPED */) {
          if (src.state !== 0x1011 /* AL_INITIAL */) {
            src.state = 0x1014 /* AL_STOPPED */;
            src.bufsProcessed = src.bufQueue.length;
            src.bufStartTime = Number.NEGATIVE_INFINITY;
            src.bufOffset = 0.0;
            AL.stopSourceAudio(src);
          }
        } else if (state === 0x1011 /* AL_INITIAL */) {
          if (src.state !== 0x1011 /* AL_INITIAL */) {
            src.state = 0x1011 /* AL_INITIAL */;
            src.bufsProcessed = 0;
            src.bufStartTime = Number.NEGATIVE_INFINITY;
            src.bufOffset = 0.0;
            AL.stopSourceAudio(src);
          }
        }
      },initSourcePanner:function(src) {
        if (src.type === 0x1030 /* AL_UNDETERMINED */) {
          return;
        }
  
        // Find the first non-zero buffer in the queue to determine the proper format
        var templateBuf = AL.buffers[0];
        for (var i = 0; i < src.bufQueue.length; i++) {
          if (src.bufQueue[i].id !== 0) {
            templateBuf = src.bufQueue[i];
            break;
          }
        }
        // Create a panner if AL_SOURCE_SPATIALIZE_SOFT is set to true, or alternatively if it's set to auto and the source is mono
        if (src.spatialize === 1 /* AL_TRUE */ || (src.spatialize === 2 /* AL_AUTO_SOFT */ && templateBuf.channels === 1)) {
          if (src.panner) {
            return;
          }
          src.panner = src.context.audioCtx.createPanner();
  
          AL.updateSourceGlobal(src);
          AL.updateSourceSpace(src);
  
          src.panner.connect(src.context.gain);
          src.gain.disconnect();
          src.gain.connect(src.panner);
        } else {
          if (!src.panner) {
            return;
          }
  
          src.panner.disconnect();
          src.gain.disconnect();
          src.gain.connect(src.context.gain);
          src.panner = null;
        }
      },updateContextGlobal:function(ctx) {
        for (var i in ctx.sources) {
          AL.updateSourceGlobal(ctx.sources[i]);
        }
      },updateSourceGlobal:function(src) {
        var panner = src.panner;
        if (!panner) {
          return;
        }
  
        panner.refDistance = src.refDistance;
        panner.maxDistance = src.maxDistance;
        panner.rolloffFactor = src.rolloffFactor;
  
        panner.panningModel = src.context.hrtf ? 'HRTF' : 'equalpower';
  
        // Use the source's distance model if AL_SOURCE_DISTANCE_MODEL is enabled
        var distanceModel = src.context.sourceDistanceModel ? src.distanceModel : src.context.distanceModel;
        switch (distanceModel) {
        case 0 /* AL_NONE */:
          panner.distanceModel = 'inverse';
          panner.refDistance = 3.40282e38 /* FLT_MAX */;
          break;
        case 0xd001 /* AL_INVERSE_DISTANCE */:
        case 0xd002 /* AL_INVERSE_DISTANCE_CLAMPED */:
          panner.distanceModel = 'inverse';
          break;
        case 0xd003 /* AL_LINEAR_DISTANCE */:
        case 0xd004 /* AL_LINEAR_DISTANCE_CLAMPED */:
          panner.distanceModel = 'linear';
          break;
        case 0xd005 /* AL_EXPONENT_DISTANCE */:
        case 0xd006 /* AL_EXPONENT_DISTANCE_CLAMPED */:
          panner.distanceModel = 'exponential';
          break;
        }
      },updateListenerSpace:function(ctx) {
        var listener = ctx.audioCtx.listener;
        if (listener.positionX) {
          listener.positionX.value = ctx.listener.position[0];
          listener.positionY.value = ctx.listener.position[1];
          listener.positionZ.value = ctx.listener.position[2];
        } else {
          listener.setPosition(ctx.listener.position[0], ctx.listener.position[1], ctx.listener.position[2]);
        }
        if (listener.forwardX) {
          listener.forwardX.value = ctx.listener.direction[0];
          listener.forwardY.value = ctx.listener.direction[1];
          listener.forwardZ.value = ctx.listener.direction[2];
          listener.upX.value = ctx.listener.up[0];
          listener.upY.value = ctx.listener.up[1];
          listener.upZ.value = ctx.listener.up[2];
        } else {
          listener.setOrientation(
            ctx.listener.direction[0], ctx.listener.direction[1], ctx.listener.direction[2],
            ctx.listener.up[0], ctx.listener.up[1], ctx.listener.up[2]);
        }
  
        // Update sources that are relative to the listener
        for (var i in ctx.sources) {
          AL.updateSourceSpace(ctx.sources[i]);
        }
      },updateSourceSpace:function(src) {
        if (!src.panner) {
          return;
        }
        var panner = src.panner;
  
        var posX = src.position[0];
        var posY = src.position[1];
        var posZ = src.position[2];
        var dirX = src.direction[0];
        var dirY = src.direction[1];
        var dirZ = src.direction[2];
  
        var listener = src.context.listener;
        var lPosX = listener.position[0];
        var lPosY = listener.position[1];
        var lPosZ = listener.position[2];
  
        // WebAudio does spatialization in world-space coordinates, meaning both the buffer sources and
        // the listener position are in the same absolute coordinate system relative to a fixed origin.
        // By default, OpenAL works this way as well, but it also provides a "listener relative" mode, where
        // a buffer source's coordinate are interpreted not in absolute world space, but as being relative
        // to the listener object itself, so as the listener moves the source appears to move with it
        // with no update required. Since web audio does not support this mode, we must transform the source
        // coordinates from listener-relative space to absolute world space.
        //
        // We do this via affine transformation matrices applied to the source position and source direction.
        // A change-of-basis converts from listener-space displacements to world-space displacements,
        // which must be done for both the source position and direction. Lastly, the source position must be
        // added to the listener position to get the final source position, since the source position represents
        // a displacement from the listener.
        if (src.relative) {
          // Negate the listener direction since forward is -Z.
          var lBackX = -listener.direction[0];
          var lBackY = -listener.direction[1];
          var lBackZ = -listener.direction[2];
          var lUpX = listener.up[0];
          var lUpY = listener.up[1];
          var lUpZ = listener.up[2];
  
          var inverseMagnitude = function(x, y, z) {
            var length = Math.sqrt(x * x + y * y + z * z);
  
            if (length < Number.EPSILON) {
              return 0.0;
            }
  
            return 1.0 / length;
          };
  
          // Normalize the Back vector
          var invMag = inverseMagnitude(lBackX, lBackY, lBackZ);
          lBackX *= invMag;
          lBackY *= invMag;
          lBackZ *= invMag;
  
          // ...and the Up vector
          invMag = inverseMagnitude(lUpX, lUpY, lUpZ);
          lUpX *= invMag;
          lUpY *= invMag;
          lUpZ *= invMag;
  
          // Calculate the Right vector as the cross product of the Up and Back vectors
          var lRightX = (lUpY * lBackZ - lUpZ * lBackY);
          var lRightY = (lUpZ * lBackX - lUpX * lBackZ);
          var lRightZ = (lUpX * lBackY - lUpY * lBackX);
  
          // Back and Up might not be exactly perpendicular, so the cross product also needs normalization
          invMag = inverseMagnitude(lRightX, lRightY, lRightZ);
          lRightX *= invMag;
          lRightY *= invMag;
          lRightZ *= invMag;
  
          // Recompute Up from the now orthonormal Right and Back vectors so we have a fully orthonormal basis
          lUpX = (lBackY * lRightZ - lBackZ * lRightY);
          lUpY = (lBackZ * lRightX - lBackX * lRightZ);
          lUpZ = (lBackX * lRightY - lBackY * lRightX);
  
          var oldX = dirX;
          var oldY = dirY;
          var oldZ = dirZ;
  
          // Use our 3 vectors to apply a change-of-basis matrix to the source direction
          dirX = oldX * lRightX + oldY * lUpX + oldZ * lBackX;
          dirY = oldX * lRightY + oldY * lUpY + oldZ * lBackY;
          dirZ = oldX * lRightZ + oldY * lUpZ + oldZ * lBackZ;
  
          oldX = posX;
          oldY = posY;
          oldZ = posZ;
  
          // ...and to the source position
          posX = oldX * lRightX + oldY * lUpX + oldZ * lBackX;
          posY = oldX * lRightY + oldY * lUpY + oldZ * lBackY;
          posZ = oldX * lRightZ + oldY * lUpZ + oldZ * lBackZ;
  
          // The change-of-basis corrects the orientation, but the origin is still the listener.
          // Translate the source position by the listener position to finish.
          posX += lPosX;
          posY += lPosY;
          posZ += lPosZ;
        }
  
        if (panner.positionX) {
          panner.positionX.value = posX;
          panner.positionY.value = posY;
          panner.positionZ.value = posZ;
        } else {
          panner.setPosition(posX, posY, posZ);
        }
        if (panner.orientationX) {
          panner.orientationX.value = dirX;
          panner.orientationY.value = dirY;
          panner.orientationZ.value = dirZ;
        } else {
          panner.setOrientation(dirX, dirY, dirZ);
        }
  
        var oldShift = src.dopplerShift;
        var velX = src.velocity[0];
        var velY = src.velocity[1];
        var velZ = src.velocity[2];
        var lVelX = listener.velocity[0];
        var lVelY = listener.velocity[1];
        var lVelZ = listener.velocity[2];
        if (posX === lPosX && posY === lPosY && posZ === lPosZ
          || velX === lVelX && velY === lVelY && velZ === lVelZ)
        {
          src.dopplerShift = 1.0;
        } else {
          // Doppler algorithm from 1.1 spec
          var speedOfSound = src.context.speedOfSound;
          var dopplerFactor = src.context.dopplerFactor;
  
          var slX = lPosX - posX;
          var slY = lPosY - posY;
          var slZ = lPosZ - posZ;
  
          var magSl = Math.sqrt(slX * slX + slY * slY + slZ * slZ);
          var vls = (slX * lVelX + slY * lVelY + slZ * lVelZ) / magSl;
          var vss = (slX * velX + slY * velY + slZ * velZ) / magSl;
  
          vls = Math.min(vls, speedOfSound / dopplerFactor);
          vss = Math.min(vss, speedOfSound / dopplerFactor);
  
          src.dopplerShift = (speedOfSound - dopplerFactor * vls) / (speedOfSound - dopplerFactor * vss);
        }
        if (src.dopplerShift !== oldShift) {
          AL.updateSourceRate(src);
        }
      },updateSourceRate:function(src) {
        if (src.state === 0x1012 /* AL_PLAYING */) {
          // clear scheduled buffers
          AL.cancelPendingSourceAudio(src);
  
          var audioSrc = src.audioQueue[0];
          if (!audioSrc) {
            return; // It is possible that AL.scheduleContextAudio() has not yet fed the next buffer, if so, skip.
          }
  
          var duration;
          if (src.type === 0x1028 /* AL_STATIC */ && src.looping) {
            duration = Number.POSITIVE_INFINITY;
          } else {
            // audioSrc._duration is expressed after factoring in playbackRate, so when changing playback rate, need
            // to recompute/rescale the rate to the new playback speed.
            duration = (audioSrc.buffer.duration - audioSrc._startOffset) / src.playbackRate;
          }
  
          audioSrc._duration = duration;
          audioSrc.playbackRate.value = src.playbackRate;
  
          // reschedule buffers with the new playbackRate
          AL.scheduleSourceAudio(src);
        }
      },sourceDuration:function(src) {
        var length = 0.0;
        for (var i = 0; i < src.bufQueue.length; i++) {
          var audioBuf = src.bufQueue[i].audioBuf;
          length += audioBuf ? audioBuf.duration : 0.0;
        }
        return length;
      },sourceTell:function(src) {
        AL.updateSourceTime(src);
  
        var offset = 0.0;
        for (var i = 0; i < src.bufsProcessed; i++) {
          offset += src.bufQueue[i].audioBuf.duration;
        }
        offset += src.bufOffset;
  
        return offset;
      },sourceSeek:function(src, offset) {
        var playing = src.state == 0x1012 /* AL_PLAYING */;
        if (playing) {
          AL.setSourceState(src, 0x1011 /* AL_INITIAL */);
        }
  
        if (src.bufQueue[src.bufsProcessed].audioBuf !== null) {
          src.bufsProcessed = 0;
          while (offset > src.bufQueue[src.bufsProcessed].audioBuf.duration) {
            offset -= src.bufQueue[src.bufsProcessed].audiobuf.duration;
            src.bufsProcessed++;
          }
  
          src.bufOffset = offset;
        }
  
        if (playing) {
          AL.setSourceState(src, 0x1012 /* AL_PLAYING */);
        }
      },getGlobalParam:function(funcname, param) {
        if (!AL.currentCtx) {
          return null;
        }
  
        switch (param) {
        case 0xC000 /* AL_DOPPLER_FACTOR */:
          return AL.currentCtx.dopplerFactor;
        case 0xC003 /* AL_SPEED_OF_SOUND */:
          return AL.currentCtx.speedOfSound;
        case 0xD000 /* AL_DISTANCE_MODEL */:
          return AL.currentCtx.distanceModel;
        default:
          AL.currentCtx.err = 0xA002 /* AL_INVALID_ENUM */;
          return null;
        }
      },setGlobalParam:function(funcname, param, value) {
        if (!AL.currentCtx) {
          return;
        }
  
        switch (param) {
        case 0xC000 /* AL_DOPPLER_FACTOR */:
          if (!Number.isFinite(value) || value < 0.0) { // Strictly negative values are disallowed
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
  
          AL.currentCtx.dopplerFactor = value;
          AL.updateListenerSpace(AL.currentCtx);
          break;
        case 0xC003 /* AL_SPEED_OF_SOUND */:
          if (!Number.isFinite(value) || value <= 0.0) { // Negative or zero values are disallowed
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
  
          AL.currentCtx.speedOfSound = value;
          AL.updateListenerSpace(AL.currentCtx);
          break;
        case 0xD000 /* AL_DISTANCE_MODEL */:
          switch (value) {
          case 0 /* AL_NONE */:
          case 0xd001 /* AL_INVERSE_DISTANCE */:
          case 0xd002 /* AL_INVERSE_DISTANCE_CLAMPED */:
          case 0xd003 /* AL_LINEAR_DISTANCE */:
          case 0xd004 /* AL_LINEAR_DISTANCE_CLAMPED */:
          case 0xd005 /* AL_EXPONENT_DISTANCE */:
          case 0xd006 /* AL_EXPONENT_DISTANCE_CLAMPED */:
            AL.currentCtx.distanceModel = value;
            AL.updateContextGlobal(AL.currentCtx);
            break;
          default:
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
          break;
        default:
          AL.currentCtx.err = 0xA002 /* AL_INVALID_ENUM */;
          return;
        }
      },getListenerParam:function(funcname, param) {
        if (!AL.currentCtx) {
          return null;
        }
  
        switch (param) {
        case 0x1004 /* AL_POSITION */:
          return AL.currentCtx.listener.position;
        case 0x1006 /* AL_VELOCITY */:
          return AL.currentCtx.listener.velocity;
        case 0x100F /* AL_ORIENTATION */:
          return AL.currentCtx.listener.direction.concat(AL.currentCtx.listener.up);
        case 0x100A /* AL_GAIN */:
          return AL.currentCtx.gain.gain.value;
        default:
          AL.currentCtx.err = 0xA002 /* AL_INVALID_ENUM */;
          return null;
        }
      },setListenerParam:function(funcname, param, value) {
        if (!AL.currentCtx) {
          return;
        }
        if (value === null) {
          AL.currentCtx.err = 0xA002 /* AL_INVALID_ENUM */;
          return;
        }
  
        var listener = AL.currentCtx.listener;
        switch (param) {
        case 0x1004 /* AL_POSITION */:
          if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2])) {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
  
          listener.position[0] = value[0];
          listener.position[1] = value[1];
          listener.position[2] = value[2];
          AL.updateListenerSpace(AL.currentCtx);
          break;
        case 0x1006 /* AL_VELOCITY */:
          if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2])) {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
  
          listener.velocity[0] = value[0];
          listener.velocity[1] = value[1];
          listener.velocity[2] = value[2];
          AL.updateListenerSpace(AL.currentCtx);
          break;
        case 0x100A /* AL_GAIN */:
          if (!Number.isFinite(value) || value < 0.0) {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
  
          AL.currentCtx.gain.gain.value = value;
          break;
        case 0x100F /* AL_ORIENTATION */:
          if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2])
            || !Number.isFinite(value[3]) || !Number.isFinite(value[4]) || !Number.isFinite(value[5])
          ) {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
  
          listener.direction[0] = value[0];
          listener.direction[1] = value[1];
          listener.direction[2] = value[2];
          listener.up[0] = value[3];
          listener.up[1] = value[4];
          listener.up[2] = value[5];
          AL.updateListenerSpace(AL.currentCtx);
          break;
        default:
          AL.currentCtx.err = 0xA002 /* AL_INVALID_ENUM */;
          return;
        }
      },getBufferParam:function(funcname, bufferId, param) {
        if (!AL.currentCtx) {
          return;
        }
        var buf = AL.buffers[bufferId];
        if (!buf || bufferId === 0) {
          AL.currentCtx.err = 0xA001 /* AL_INVALID_NAME */;
          return;
        }
  
        switch (param) {
        case 0x2001 /* AL_FREQUENCY */:
          return buf.frequency;
        case 0x2002 /* AL_BITS */:
          return buf.bytesPerSample * 8;
        case 0x2003 /* AL_CHANNELS */:
          return buf.channels;
        case 0x2004 /* AL_SIZE */:
          return buf.length * buf.bytesPerSample * buf.channels;
        case 0x2015 /* AL_LOOP_POINTS_SOFT */:
          if (buf.length === 0) {
            return [0, 0];
          } else {
            return [
              (buf.audioBuf._loopStart || 0.0) * buf.frequency,
              (buf.audioBuf._loopEnd || buf.length) * buf.frequency
            ];
          }
        default:
          AL.currentCtx.err = 0xA002 /* AL_INVALID_ENUM */;
          return null;
        }
      },setBufferParam:function(funcname, bufferId, param, value) {
        if (!AL.currentCtx) {
          return;
        }
        var buf = AL.buffers[bufferId];
        if (!buf || bufferId === 0) {
          AL.currentCtx.err = 0xA001 /* AL_INVALID_NAME */;
          return;
        }
        if (value === null) {
          AL.currentCtx.err = 0xA002 /* AL_INVALID_ENUM */;
          return;
        }
  
        switch (param) {
        case 0x2004 /* AL_SIZE */:
          if (value !== 0) {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
  
          // Per the spec, setting AL_SIZE to 0 is a legal NOP.
          break;
        case 0x2015 /* AL_LOOP_POINTS_SOFT */:
          if (value[0] < 0 || value[0] > buf.length || value[1] < 0 || value[1] > buf.Length || value[0] >= value[1]) {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
          if (buf.refCount > 0) {
            AL.currentCtx.err = 0xA004 /* AL_INVALID_OPERATION */;
            return;
          }
  
          if (buf.audioBuf) {
            buf.audioBuf._loopStart = value[0] / buf.frequency;
            buf.audioBuf._loopEnd = value[1] / buf.frequency;
          }
          break;
        default:
          AL.currentCtx.err = 0xA002 /* AL_INVALID_ENUM */;
          return;
        }
      },getSourceParam:function(funcname, sourceId, param) {
        if (!AL.currentCtx) {
          return null;
        }
        var src = AL.currentCtx.sources[sourceId];
        if (!src) {
          AL.currentCtx.err = 0xA001 /* AL_INVALID_NAME */;
          return null;
        }
  
        switch (param) {
        case 0x202 /* AL_SOURCE_RELATIVE */:
          return src.relative;
        case 0x1001 /* AL_CONE_INNER_ANGLE */:
          return src.coneInnerAngle;
        case 0x1002 /* AL_CONE_OUTER_ANGLE */:
          return src.coneOuterAngle;
        case 0x1003 /* AL_PITCH */:
          return src.pitch;
        case 0x1004 /* AL_POSITION */:
          return src.position;
        case 0x1005 /* AL_DIRECTION */:
          return src.direction;
        case 0x1006 /* AL_VELOCITY */:
          return src.velocity;
        case 0x1007 /* AL_LOOPING */:
          return src.looping;
        case 0x1009 /* AL_BUFFER */:
          if (src.type === 0x1028 /* AL_STATIC */) {
            return src.bufQueue[0].id;
          } else {
            return 0;
          }
        case 0x100A /* AL_GAIN */:
          return src.gain.gain.value;
         case 0x100D /* AL_MIN_GAIN */:
          return src.minGain;
        case 0x100E /* AL_MAX_GAIN */:
          return src.maxGain;
        case 0x1010 /* AL_SOURCE_STATE */:
          return src.state;
        case 0x1015 /* AL_BUFFERS_QUEUED */:
          if (src.bufQueue.length === 1 && src.bufQueue[0].id === 0) {
            return 0;
          } else {
            return src.bufQueue.length;
          }
        case 0x1016 /* AL_BUFFERS_PROCESSED */:
          if ((src.bufQueue.length === 1 && src.bufQueue[0].id === 0) || src.looping) {
            return 0;
          } else {
            return src.bufsProcessed;
          }
        case 0x1020 /* AL_REFERENCE_DISTANCE */:
          return src.refDistance;
        case 0x1021 /* AL_ROLLOFF_FACTOR */:
          return src.rolloffFactor;
        case 0x1022 /* AL_CONE_OUTER_GAIN */:
          return src.coneOuterGain;
        case 0x1023 /* AL_MAX_DISTANCE */:
          return src.maxDistance;
        case 0x1024 /* AL_SEC_OFFSET */:
          return AL.sourceTell(src);
        case 0x1025 /* AL_SAMPLE_OFFSET */:
          var offset = AL.sourceTell(src);
          if (offset > 0.0) {
            offset *= src.bufQueue[0].frequency;
          }
          return offset;
        case 0x1026 /* AL_BYTE_OFFSET */:
          var offset = AL.sourceTell(src);
          if (offset > 0.0) {
            offset *= src.bufQueue[0].frequency * src.bufQueue[0].bytesPerSample;
          }
          return offset;
        case 0x1027 /* AL_SOURCE_TYPE */:
          return src.type;
        case 0x1214 /* AL_SOURCE_SPATIALIZE_SOFT */:
          return src.spatialize;
        case 0x2009 /* AL_BYTE_LENGTH_SOFT */: 
          var length = 0;
          var bytesPerFrame = 0;
          for (var i = 0; i < src.bufQueue.length; i++) {
            length += src.bufQueue[i].length;
            if (src.bufQueue[i].id !== 0) {
              bytesPerFrame = src.bufQueue[i].bytesPerSample * src.bufQueue[i].channels;
            }
          }
          return length * bytesPerFrame;
        case 0x200A /* AL_SAMPLE_LENGTH_SOFT */:
          var length = 0;
          for (var i = 0; i < src.bufQueue.length; i++) {
            length += src.bufQueue[i].length;
          }
          return length;
        case 0x200B /* AL_SEC_LENGTH_SOFT */:
          return AL.sourceDuration(src);
        case 0xD000 /* AL_DISTANCE_MODEL */:
          return src.distanceModel;
        default:
          AL.currentCtx.err = 0xA002 /* AL_INVALID_ENUM */;
          return null;
        }
      },setSourceParam:function(funcname, sourceId, param, value) {
        if (!AL.currentCtx) {
          return;
        }
        var src = AL.currentCtx.sources[sourceId];
        if (!src) {
          AL.currentCtx.err = 0xA001 /* AL_INVALID_NAME */;
          return;
        }
        if (value === null) {
          AL.currentCtx.err = 0xA002 /* AL_INVALID_ENUM */;
          return;
        }
  
        switch (param) {
        case 0x202 /* AL_SOURCE_RELATIVE */:
          if (value === 1 /* AL_TRUE */) {
            src.relative = true;
            AL.updateSourceSpace(src);
          } else if (value === 0 /* AL_FALSE */) {
            src.relative = false;
            AL.updateSourceSpace(src);
          } else {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
          break;
        case 0x1001 /* AL_CONE_INNER_ANGLE */:
          if (!Number.isFinite(value)) {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
  
          src.coneInnerAngle = value;
          if (src.panner) {
            src.panner.coneInnerAngle = value % 360.0;
          }
          break;
        case 0x1002 /* AL_CONE_OUTER_ANGLE */:
          if (!Number.isFinite(value)) {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
  
          src.coneOuterAngle = value;
          if (src.panner) {
            src.panner.coneOuterAngle = value % 360.0;
          }
          break;
        case 0x1003 /* AL_PITCH */:
          if (!Number.isFinite(value) || value <= 0.0) {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
  
          if (src.pitch === value) {
            break;
          }
  
          src.pitch = value;
          AL.updateSourceRate(src);
          break;
        case 0x1004 /* AL_POSITION */:
          if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2])) {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
  
          src.position[0] = value[0];
          src.position[1] = value[1];
          src.position[2] = value[2];
          AL.updateSourceSpace(src);
          break;
        case 0x1005 /* AL_DIRECTION */:
          if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2])) {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
  
          src.direction[0] = value[0];
          src.direction[1] = value[1];
          src.direction[2] = value[2];
          AL.updateSourceSpace(src);
          break;
        case 0x1006 /* AL_VELOCITY */:
          if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2])) {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
  
          src.velocity[0] = value[0];
          src.velocity[1] = value[1];
          src.velocity[2] = value[2];
          AL.updateSourceSpace(src);
          break;
        case 0x1007 /* AL_LOOPING */:
          if (value === 1 /* AL_TRUE */) {
            src.looping = true;
            AL.updateSourceTime(src);
            if (src.type === 0x1028 /* AL_STATIC */ && src.audioQueue.length > 0) {
              var audioSrc  = src.audioQueue[0];
              audioSrc.loop = true;
              audioSrc._duration = Number.POSITIVE_INFINITY;
            }
          } else if (value === 0 /* AL_FALSE */) {
            src.looping = false;
            var currentTime = AL.updateSourceTime(src);
            if (src.type === 0x1028 /* AL_STATIC */ && src.audioQueue.length > 0) {
              var audioSrc  = src.audioQueue[0];
              audioSrc.loop = false;
              audioSrc._duration = src.bufQueue[0].audioBuf.duration / src.playbackRate;
              audioSrc._startTime = currentTime - src.bufOffset / src.playbackRate;
            }
          } else {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
          break;
        case 0x1009 /* AL_BUFFER */:
          if (src.state === 0x1012 /* AL_PLAYING */ || src.state === 0x1013 /* AL_PAUSED */) {
            AL.currentCtx.err = 0xA004 /* AL_INVALID_OPERATION */;
            return;
          }
  
          if (value === 0) {
            for (var i in src.bufQueue) {
              src.bufQueue[i].refCount--;
            }
            src.bufQueue.length = 1;
            src.bufQueue[0] = AL.buffers[0];
  
            src.bufsProcessed = 0;
            src.type = 0x1030 /* AL_UNDETERMINED */;
          } else {
            var buf = AL.buffers[value];
            if (!buf) {
              AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
              return;
            }
  
            for (var i in src.bufQueue) {
              src.bufQueue[i].refCount--;
            }
            src.bufQueue.length = 0;
  
            buf.refCount++;
            src.bufQueue = [buf];
            src.bufsProcessed = 0;
            src.type = 0x1028 /* AL_STATIC */;
          }
  
          AL.initSourcePanner(src);
          AL.scheduleSourceAudio(src);
          break;
        case 0x100A /* AL_GAIN */:
          if (!Number.isFinite(value) || value < 0.0) {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
          src.gain.gain.value = value;
          break;
        case 0x100D /* AL_MIN_GAIN */:
          if (!Number.isFinite(value) || value < 0.0 || value > Math.min(src.maxGain, 1.0)) {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
          src.minGain = value;
          break;
        case 0x100E /* AL_MAX_GAIN */:
          if (!Number.isFinite(value) || value < Math.max(0.0, src.minGain) || value > 1.0) {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
          src.maxGain = value;
          break;
        case 0x1020 /* AL_REFERENCE_DISTANCE */:
          if (!Number.isFinite(value) || value < 0.0) {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
          src.refDistance = value;
          if (src.panner) {
            src.panner.refDistance = value;
          }
          break;
        case 0x1021 /* AL_ROLLOFF_FACTOR */:
          if (!Number.isFinite(value) || value < 0.0) {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
          src.rolloffFactor = value;
          if (src.panner) {
            src.panner.rolloffFactor = value;
          }
          break;
        case 0x1022 /* AL_CONE_OUTER_GAIN */:
          if (!Number.isFinite(value) || value < 0.0 || value > 1.0) {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
          src.coneOuterGain = value;
          if (src.panner) {
            src.panner.coneOuterGain = value;
          }
          break;
        case 0x1023 /* AL_MAX_DISTANCE */:
          if (!Number.isFinite(value) || value < 0.0) {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
          src.maxDistance = value;
          if (src.panner) {
            src.panner.maxDistance = value;
          }
          break;
        case 0x1024 /* AL_SEC_OFFSET */:
          if (value < 0.0 || value > AL.sourceDuration(src)) {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
  
          AL.sourceSeek(src, value);
          break;
        case 0x1025 /* AL_SAMPLE_OFFSET */:
          var srcLen = AL.sourceDuration(src);
          if (srcLen > 0.0) {
            var frequency;
            for (var bufId in src.bufQueue) {
              if (bufId) {
                frequency = src.bufQueue[bufId].frequency;
                break;
              }
            }
            value /= frequency;
          }
          if (value < 0.0 || value > srcLen) {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
  
          AL.sourceSeek(src, value);
          break;
        case 0x1026 /* AL_BYTE_OFFSET */:
          var srcLen = AL.sourceDuration(src);
          if (srcLen > 0.0) {
            var bytesPerSec;
            for (var bufId in src.bufQueue) {
              if (bufId) {
                var buf = src.bufQueue[bufId];
                bytesPerSec = buf.frequency * buf.bytesPerSample * buf.channels;
                break;
              }
            }
            value /= bytesPerSec;
          }
          if (value < 0.0 || value > srcLen) {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
  
          AL.sourceSeek(src, value);
          break;
        case 0x1214 /* AL_SOURCE_SPATIALIZE_SOFT */:
          if (value !== 0 /* AL_FALSE */ && value !== 1 /* AL_TRUE */ && value !== 2 /* AL_AUTO_SOFT */) {
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
  
          src.spatialize = value;
          AL.initSourcePanner(src);
          break;
        case 0x2009 /* AL_BYTE_LENGTH_SOFT */: 
        case 0x200A /* AL_SAMPLE_LENGTH_SOFT */:
        case 0x200B /* AL_SEC_LENGTH_SOFT */:
          AL.currentCtx.err = 0xA004 /* AL_INVALID_OPERATION */;
          break;
        case 0xD000 /* AL_DISTANCE_MODEL */:
          switch (value) {
          case 0 /* AL_NONE */:
          case 0xd001 /* AL_INVERSE_DISTANCE */:
          case 0xd002 /* AL_INVERSE_DISTANCE_CLAMPED */:
          case 0xd003 /* AL_LINEAR_DISTANCE */:
          case 0xd004 /* AL_LINEAR_DISTANCE_CLAMPED */:
          case 0xd005 /* AL_EXPONENT_DISTANCE */:
          case 0xd006 /* AL_EXPONENT_DISTANCE_CLAMPED */:
            src.distanceModel = value;
            if (AL.currentCtx.sourceDistanceModel) {
              AL.updateContextGlobal(AL.currentCtx);
            }
            break;
          default:
            AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
            return;
          }
          break;
        default:
          AL.currentCtx.err = 0xA002 /* AL_INVALID_ENUM */;
          return;
        }
      },captures:{},sharedCaptureAudioCtx:null,requireValidCaptureDevice:function(deviceId, funcname) {
        if (deviceId === 0) {
          AL.alcErr = 0xA001 /* ALC_INVALID_DEVICE */;
          return null;
        }
        var c = AL.captures[deviceId];
        if (!c) {
          AL.alcErr = 0xA001 /* ALC_INVALID_DEVICE */;
          return null;
        }
        var err = c.mediaStreamError;
        if (err) {
          AL.alcErr = 0xA001 /* ALC_INVALID_DEVICE */;
          return null;
        }
        return c;
      }};function _alBufferData(bufferId, format, pData, size, freq) {
      if (!AL.currentCtx) {
        return;
      }
      var buf = AL.buffers[bufferId];
      if (!buf) {
        AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
        return;
      }
      if (freq <= 0) {
        AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
        return;
      }
  
      var audioBuf = null;
      try {
        switch (format) {
        case 0x1100 /* AL_FORMAT_MONO8 */:
          if (size > 0) {
            audioBuf = AL.currentCtx.audioCtx.createBuffer(1, size, freq);
            var channel0 = audioBuf.getChannelData(0);
            for (var i = 0; i < size; ++i) {
              channel0[i] = HEAPU8[pData++] * 0.0078125 /* 1/128 */ - 1.0;
            }
          }
          buf.bytesPerSample = 1;
          buf.channels = 1;
          buf.length = size;
          break;
        case 0x1101 /* AL_FORMAT_MONO16 */:
          if (size > 0) {
            audioBuf = AL.currentCtx.audioCtx.createBuffer(1, size >> 1, freq);
            var channel0 = audioBuf.getChannelData(0);
            pData >>= 1;
            for (var i = 0; i < size >> 1; ++i) {
              channel0[i] = HEAP16[pData++] * 0.000030517578125 /* 1/32768 */;
            }
          }
          buf.bytesPerSample = 2;
          buf.channels = 1;
          buf.length = size >> 1;
          break;
        case 0x1102 /* AL_FORMAT_STEREO8 */:
          if (size > 0) {
            audioBuf = AL.currentCtx.audioCtx.createBuffer(2, size >> 1, freq);
            var channel0 = audioBuf.getChannelData(0);
            var channel1 = audioBuf.getChannelData(1);
            for (var i = 0; i < size >> 1; ++i) {
              channel0[i] = HEAPU8[pData++] * 0.0078125 /* 1/128 */ - 1.0;
              channel1[i] = HEAPU8[pData++] * 0.0078125 /* 1/128 */ - 1.0;
            }
          }
          buf.bytesPerSample = 1;
          buf.channels = 2;
          buf.length = size >> 1;
          break;
        case 0x1103 /* AL_FORMAT_STEREO16 */:
          if (size > 0) {
            audioBuf = AL.currentCtx.audioCtx.createBuffer(2, size >> 2, freq);
            var channel0 = audioBuf.getChannelData(0);
            var channel1 = audioBuf.getChannelData(1);
            pData >>= 1;
            for (var i = 0; i < size >> 2; ++i) {
              channel0[i] = HEAP16[pData++] * 0.000030517578125 /* 1/32768 */;
              channel1[i] = HEAP16[pData++] * 0.000030517578125 /* 1/32768 */;
            }
          }
          buf.bytesPerSample = 2;
          buf.channels = 2;
          buf.length = size >> 2;
          break;
        case 0x10010 /* AL_FORMAT_MONO_FLOAT32 */:
          if (size > 0) {
            audioBuf = AL.currentCtx.audioCtx.createBuffer(1, size >> 2, freq);
            var channel0 = audioBuf.getChannelData(0);
            pData >>= 2;
            for (var i = 0; i < size >> 2; ++i) {
              channel0[i] = HEAPF32[pData++];
            }
          }
          buf.bytesPerSample = 4;
          buf.channels = 1;
          buf.length = size >> 2;
          break;
        case 0x10011 /* AL_FORMAT_STEREO_FLOAT32 */:
          if (size > 0) {
            audioBuf = AL.currentCtx.audioCtx.createBuffer(2, size >> 3, freq);
            var channel0 = audioBuf.getChannelData(0);
            var channel1 = audioBuf.getChannelData(1);
            pData >>= 2;
            for (var i = 0; i < size >> 3; ++i) {
              channel0[i] = HEAPF32[pData++];
              channel1[i] = HEAPF32[pData++];
            }
          }
          buf.bytesPerSample = 4;
          buf.channels = 2;
          buf.length = size >> 3;
          break;
        default:
          AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
          return;
        }
        buf.frequency = freq;
        buf.audioBuf = audioBuf;
      } catch (e) {
        AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
        return;
      }
    }

  function _alDeleteBuffers(count, pBufferIds) {
      if (!AL.currentCtx) {
        return;
      }
  
      for (var i = 0; i < count; ++i) {
        var bufId = HEAP32[(((pBufferIds)+(i*4))>>2)];
        /// Deleting the zero buffer is a legal NOP, so ignore it
        if (bufId === 0) {
          continue;
        }
  
        // Make sure the buffer index is valid.
        if (!AL.buffers[bufId]) {
          AL.currentCtx.err = 0xA001 /* AL_INVALID_NAME */;
          return;
        }
  
        // Make sure the buffer is no longer in use.
        if (AL.buffers[bufId].refCount) {
          AL.currentCtx.err = 0xA004 /* AL_INVALID_OPERATION */;
          return;
        }
      }
  
      for (var i = 0; i < count; ++i) {
        var bufId = HEAP32[(((pBufferIds)+(i*4))>>2)];
        if (bufId === 0) {
          continue;
        }
  
        AL.deviceRefCounts[AL.buffers[bufId].deviceId]--;
        delete AL.buffers[bufId];
        AL.freeIds.push(bufId);
      }
    }

  
  function _alSourcei(sourceId, param, value) {
      switch (param) {
      case 0x202 /* AL_SOURCE_RELATIVE */:
      case 0x1001 /* AL_CONE_INNER_ANGLE */:
      case 0x1002 /* AL_CONE_OUTER_ANGLE */:
      case 0x1007 /* AL_LOOPING */:
      case 0x1009 /* AL_BUFFER */:
      case 0x1020 /* AL_REFERENCE_DISTANCE */:
      case 0x1021 /* AL_ROLLOFF_FACTOR */:
      case 0x1023 /* AL_MAX_DISTANCE */:
      case 0x1024 /* AL_SEC_OFFSET */:
      case 0x1025 /* AL_SAMPLE_OFFSET */:
      case 0x1026 /* AL_BYTE_OFFSET */:
      case 0x1214 /* AL_SOURCE_SPATIALIZE_SOFT */:
      case 0x2009 /* AL_BYTE_LENGTH_SOFT */: 
      case 0x200A /* AL_SAMPLE_LENGTH_SOFT */:
      case 0xD000 /* AL_DISTANCE_MODEL */:
        AL.setSourceParam('alSourcei', sourceId, param, value);
        break;
      default:
        AL.setSourceParam('alSourcei', sourceId, param, null);
        break;
      }
    }function _alDeleteSources(count, pSourceIds) {
      if (!AL.currentCtx) {
        return;
      }
  
      for (var i = 0; i < count; ++i) {
        var srcId = HEAP32[(((pSourceIds)+(i*4))>>2)];
        if (!AL.currentCtx.sources[srcId]) {
          AL.currentCtx.err = 0xA001 /* AL_INVALID_NAME */;
          return;
        }
      }
  
      for (var i = 0; i < count; ++i) {
        var srcId = HEAP32[(((pSourceIds)+(i*4))>>2)];
        AL.setSourceState(AL.currentCtx.sources[srcId], 0x1014 /* AL_STOPPED */);
        _alSourcei(srcId, 0x1009 /* AL_BUFFER */, 0);
        delete AL.currentCtx.sources[srcId];
        AL.freeIds.push(srcId);
      }
    }

  function _alGenBuffers(count, pBufferIds) {
      if (!AL.currentCtx) {
        return;
      }
  
      for (var i = 0; i < count; ++i) {
        var buf = {
          deviceId: AL.currentCtx.deviceId,
          id: AL.newId(),
          refCount: 0,
          audioBuf: null,
          frequency: 0,
          bytesPerSample: 2,
          channels: 1,
          length: 0,
        };
        AL.deviceRefCounts[buf.deviceId]++;
        AL.buffers[buf.id] = buf;
        HEAP32[(((pBufferIds)+(i*4))>>2)]=buf.id;
      }
    }

  function _alGenSources(count, pSourceIds) {
      if (!AL.currentCtx) {
        return;
      }
      for (var i = 0; i < count; ++i) {
        var gain = AL.currentCtx.audioCtx.createGain();
        gain.connect(AL.currentCtx.gain);
        var src = {
          context: AL.currentCtx,
          id: AL.newId(),
          type: 0x1030 /* AL_UNDETERMINED */,
          state: 0x1011 /* AL_INITIAL */,
          bufQueue: [AL.buffers[0]],
          audioQueue: [],
          looping: false,
          pitch: 1.0,
          dopplerShift: 1.0,
          gain: gain,
          minGain: 0.0,
          maxGain: 1.0,
          panner: null,
          bufsProcessed: 0,
          bufStartTime: Number.NEGATIVE_INFINITY,
          bufOffset: 0.0,
          relative: false,
          refDistance: 1.0,
          maxDistance: 3.40282e38 /* FLT_MAX */,
          rolloffFactor: 1.0,
          position: [0.0, 0.0, 0.0],
          velocity: [0.0, 0.0, 0.0],
          direction: [0.0, 0.0, 0.0],
          coneOuterGain: 0.0,
          coneInnerAngle: 360.0,
          coneOuterAngle: 360.0,
          distanceModel: 0xd002 /* AL_INVERSE_DISTANCE_CLAMPED */,
          spatialize: 2 /* AL_AUTO_SOFT */,
  
          get playbackRate() {
            return this.pitch * this.dopplerShift;
          }
        };
        AL.currentCtx.sources[src.id] = src;
        HEAP32[(((pSourceIds)+(i*4))>>2)]=src.id;
      }
    }

  function _alGetError() {
      if (!AL.currentCtx) {
        return 0xA004 /* AL_INVALID_OPERATION */;
      } else {
        // Reset error on get.
        var err = AL.currentCtx.err;
        AL.currentCtx.err = 0 /* AL_NO_ERROR */;
        return err;
      }
    }

  function _alGetSourcef(sourceId, param, pValue) {
      var val = AL.getSourceParam('alGetSourcef', sourceId, param);
      if (val === null) {
        return;
      }
      if (!pValue) {
        AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
        return;
      }
  
      switch (param) {
      case 0x1001 /* AL_CONE_INNER_ANGLE */:
      case 0x1002 /* AL_CONE_OUTER_ANGLE */:
      case 0x1003 /* AL_PITCH */:
      case 0x100A /* AL_GAIN */:
      case 0x100D /* AL_MIN_GAIN */:
      case 0x100E /* AL_MAX_GAIN */:
      case 0x1020 /* AL_REFERENCE_DISTANCE */:
      case 0x1021 /* AL_ROLLOFF_FACTOR */:
      case 0x1022 /* AL_CONE_OUTER_GAIN */:
      case 0x1023 /* AL_MAX_DISTANCE */:
      case 0x1024 /* AL_SEC_OFFSET */:
      case 0x1025 /* AL_SAMPLE_OFFSET */:
      case 0x1026 /* AL_BYTE_OFFSET */:
      case 0x200B /* AL_SEC_LENGTH_SOFT */:
        HEAPF32[((pValue)>>2)]=val;
        break;
      default:
        AL.currentCtx.err = 0xA002 /* AL_INVALID_ENUM */;
        return;
      }
    }

  function _alGetSourcei(sourceId, param, pValue) {
      var val = AL.getSourceParam('alGetSourcei', sourceId, param);
      if (val === null) {
        return;
      }
      if (!pValue) {
        AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
        return;
      }
  
      switch (param) {
      case 0x202 /* AL_SOURCE_RELATIVE */:
      case 0x1001 /* AL_CONE_INNER_ANGLE */:
      case 0x1002 /* AL_CONE_OUTER_ANGLE */:
      case 0x1007 /* AL_LOOPING */:
      case 0x1009 /* AL_BUFFER */:
      case 0x1010 /* AL_SOURCE_STATE */:
      case 0x1015 /* AL_BUFFERS_QUEUED */:
      case 0x1016 /* AL_BUFFERS_PROCESSED */:
      case 0x1020 /* AL_REFERENCE_DISTANCE */:
      case 0x1021 /* AL_ROLLOFF_FACTOR */:
      case 0x1023 /* AL_MAX_DISTANCE */:
      case 0x1024 /* AL_SEC_OFFSET */:
      case 0x1025 /* AL_SAMPLE_OFFSET */:
      case 0x1026 /* AL_BYTE_OFFSET */:
      case 0x1027 /* AL_SOURCE_TYPE */:
      case 0x1214 /* AL_SOURCE_SPATIALIZE_SOFT */:
      case 0x2009 /* AL_BYTE_LENGTH_SOFT */: 
      case 0x200A /* AL_SAMPLE_LENGTH_SOFT */:
      case 0xD000 /* AL_DISTANCE_MODEL */:
        HEAP32[((pValue)>>2)]=val;
        break;
      default:
        AL.currentCtx.err = 0xA002 /* AL_INVALID_ENUM */;
        return;
      }
    }

  function _alListenerf(param, value) {
      switch (param) {
      case 0x100A /* AL_GAIN */:
        AL.setListenerParam('alListenerf', param, value);
        break;
      default:
        AL.setListenerParam('alListenerf', param, null);
        break;
      }
    }

  function _alListenerfv(param, pValues) {
      if (!AL.currentCtx) {
        return;
      }
      if (!pValues) {
        AL.currentCtx.err = 0xA003 /* AL_INVALID_VALUE */;
        return;
      }
  
      switch (param) {
      case 0x1004 /* AL_POSITION */:
      case 0x1006 /* AL_VELOCITY */:
        AL.paramArray[0] = HEAPF32[((pValues)>>2)];
        AL.paramArray[1] = HEAPF32[(((pValues)+(4))>>2)];
        AL.paramArray[2] = HEAPF32[(((pValues)+(8))>>2)];
        AL.setListenerParam('alListenerfv', param, AL.paramArray);
        break;
      case 0x100F /* AL_ORIENTATION */:
        AL.paramArray[0] = HEAPF32[((pValues)>>2)];
        AL.paramArray[1] = HEAPF32[(((pValues)+(4))>>2)];
        AL.paramArray[2] = HEAPF32[(((pValues)+(8))>>2)];
        AL.paramArray[3] = HEAPF32[(((pValues)+(12))>>2)];
        AL.paramArray[4] = HEAPF32[(((pValues)+(16))>>2)];
        AL.paramArray[5] = HEAPF32[(((pValues)+(20))>>2)];
        AL.setListenerParam('alListenerfv', param, AL.paramArray);
        break;
      default:
        AL.setListenerParam('alListenerfv', param, null);
        break;
      }
    }

  function _alSourcePause(sourceId) {
      if (!AL.currentCtx) {
        return;
      }
      var src = AL.currentCtx.sources[sourceId];
      if (!src) {
        AL.currentCtx.err = 0xA001 /* AL_INVALID_NAME */;
        return;
      }
      AL.setSourceState(src, 0x1013 /* AL_PAUSED */);
    }

  function _alSourcePlay(sourceId) {
      if (!AL.currentCtx) {
        return;
      }
      var src = AL.currentCtx.sources[sourceId];
      if (!src) {
        AL.currentCtx.err = 0xA001 /* AL_INVALID_NAME */;
        return;
      }
      AL.setSourceState(src, 0x1012 /* AL_PLAYING */);
    }

  function _alSourceStop(sourceId) {
      if (!AL.currentCtx) {
        return;
      }
      var src = AL.currentCtx.sources[sourceId];
      if (!src) {
        AL.currentCtx.err = 0xA001 /* AL_INVALID_NAME */;
        return;
      }
      AL.setSourceState(src, 0x1014 /* AL_STOPPED */);
    }

  function _alSourcef(sourceId, param, value) {
      switch (param) {
      case 0x1001 /* AL_CONE_INNER_ANGLE */:
      case 0x1002 /* AL_CONE_OUTER_ANGLE */:
      case 0x1003 /* AL_PITCH */:
      case 0x100A /* AL_GAIN */:
      case 0x100D /* AL_MIN_GAIN */:
      case 0x100E /* AL_MAX_GAIN */:
      case 0x1020 /* AL_REFERENCE_DISTANCE */:
      case 0x1021 /* AL_ROLLOFF_FACTOR */:
      case 0x1022 /* AL_CONE_OUTER_GAIN */:
      case 0x1023 /* AL_MAX_DISTANCE */:
      case 0x1024 /* AL_SEC_OFFSET */:
      case 0x1025 /* AL_SAMPLE_OFFSET */:
      case 0x1026 /* AL_BYTE_OFFSET */:
      case 0x200B /* AL_SEC_LENGTH_SOFT */:
        AL.setSourceParam('alSourcef', sourceId, param, value);
        break;
      default:
        AL.setSourceParam('alSourcef', sourceId, param, null);
        break;
      }
    }


  function _alcCloseDevice(deviceId) {
      if (!(deviceId in AL.deviceRefCounts) || AL.deviceRefCounts[deviceId] > 0) {
        return 0 /* ALC_FALSE */;
      }
  
      delete AL.deviceRefCounts[deviceId];
      AL.freeIds.push(deviceId);
      return 1 /* ALC_TRUE */;
    }

  function _alcCreateContext(deviceId, pAttrList) {
      if (!(deviceId in AL.deviceRefCounts)) {
        AL.alcErr = 0xA001; /* ALC_INVALID_DEVICE */
        return 0;
      }
  
      var options = null;
      var attrs = [];
      var hrtf = null;
      pAttrList >>= 2;
      if (pAttrList) {
        var attr = 0;
        var val = 0;
        while (true) {
          attr = HEAP32[pAttrList++];
          attrs.push(attr);
          if (attr === 0) {
            break;
          }
          val = HEAP32[pAttrList++];
          attrs.push(val);
  
          switch (attr) {
          case 0x1007 /* ALC_FREQUENCY */:
            if (!options) {
              options = {};
            }
  
            options.sampleRate = val;
            break;
          case 0x1010 /* ALC_MONO_SOURCES */: // fallthrough
          case 0x1011 /* ALC_STEREO_SOURCES */:
            // Do nothing; these hints are satisfied by default
            break
          case 0x1992 /* ALC_HRTF_SOFT */:
            switch (val) {
              case 0 /* ALC_FALSE */:
                hrtf = false;
                break;
              case 1 /* ALC_TRUE */:
                hrtf = true;
                break;
              case 2 /* ALC_DONT_CARE_SOFT */:
                break;
              default:
                AL.alcErr = 0xA004 /* ALC_INVALID_VALUE */;
                return 0;
            }
            break;
          case 0x1996 /* ALC_HRTF_ID_SOFT */:
            if (val !== 0) {
              AL.alcErr = 0xA004 /* ALC_INVALID_VALUE */;
              return 0;
            }
            break;
          default:
            AL.alcErr = 0xA004; /* ALC_INVALID_VALUE */
            return 0;
          }
        }
      }
  
      var AudioContext = window.AudioContext || window.webkitAudioContext;
      var ac = null;
      try {
        // Only try to pass options if there are any, for compat with browsers that don't support this
        if (options) {
          ac = new AudioContext(options);
        } else {
          ac = new AudioContext();
        }
      } catch (e) {
        if (e.name === 'NotSupportedError') {
          AL.alcErr = 0xA004; /* ALC_INVALID_VALUE */
        } else {
          AL.alcErr = 0xA001; /* ALC_INVALID_DEVICE */
        }
  
        return 0;
      }
  
      autoResumeAudioContext(ac);
  
      // Old Web Audio API (e.g. Safari 6.0.5) had an inconsistently named createGainNode function.
      if (typeof(ac.createGain) === 'undefined') {
        ac.createGain = ac.createGainNode;
      }
  
      var gain = ac.createGain();
      gain.connect(ac.destination);
      var ctx = {
        deviceId: deviceId,
        id: AL.newId(),
        attrs: attrs,
        audioCtx: ac,
        listener: {
      	  position: [0.0, 0.0, 0.0],
      	  velocity: [0.0, 0.0, 0.0],
      	  direction: [0.0, 0.0, 0.0],
      	  up: [0.0, 0.0, 0.0]
        },
        sources: [],
        interval: setInterval(function() { AL.scheduleContextAudio(ctx); }, AL.QUEUE_INTERVAL),
        gain: gain,
        distanceModel: 0xd002 /* AL_INVERSE_DISTANCE_CLAMPED */,
        speedOfSound: 343.3,
        dopplerFactor: 1.0,
        sourceDistanceModel: false,
        hrtf: hrtf || false,
  
        _err: 0,
        get err() {
          return this._err;
        },
        set err(val) {
          // Errors should not be overwritten by later errors until they are cleared by a query.
          if (this._err === 0 /* AL_NO_ERROR */ || val === 0 /* AL_NO_ERROR */) {
            this._err = val;
          }
        }
      };
      AL.deviceRefCounts[deviceId]++;
      AL.contexts[ctx.id] = ctx;
  
      if (hrtf !== null) {
        // Apply hrtf attrib to all contexts for this device
        for (var ctxId in AL.contexts) {
          var c = AL.contexts[ctxId];
          if (c.deviceId === deviceId) {
            c.hrtf = hrtf;
            AL.updateContextGlobal(c);
          }
        }
      }
  
      return ctx.id;
    }

  function _alcDestroyContext(contextId) {
      var ctx = AL.contexts[contextId];
      if (AL.currentCtx === ctx) {
        AL.alcErr = 0xA002 /* ALC_INVALID_CONTEXT */;
        return;
      }
  
      // Stop playback, etc
      if (AL.contexts[contextId].interval) {
        clearInterval(AL.contexts[contextId].interval);
      }
      AL.deviceRefCounts[ctx.deviceId]--;
      delete AL.contexts[contextId];
      AL.freeIds.push(contextId);
    }

  function _alcMakeContextCurrent(contextId) {
      if (contextId === 0) {
        AL.currentCtx = null;
        return 0;
      } else {
        AL.currentCtx = AL.contexts[contextId];
        return 1;
      }
    }

  function _alcOpenDevice(pDeviceName) {
      if (pDeviceName) {
        var name = UTF8ToString(pDeviceName);
        if (name !== AL.DEVICE_NAME) {
          return 0;
        }
      }
  
      if (typeof(AudioContext) !== 'undefined' || typeof(webkitAudioContext) !== 'undefined') {
        var deviceId = AL.newId();
        AL.deviceRefCounts[deviceId] = 0;
        return deviceId;
      } else {
        return 0;
      }
    }

  
  var _emscripten_get_now_is_monotonic=true;;function _clock_gettime(clk_id, tp) {
      // int clock_gettime(clockid_t clk_id, struct timespec *tp);
      var now;
      if (clk_id === 0) {
        now = Date.now();
      } else if ((clk_id === 1 || clk_id === 4) && _emscripten_get_now_is_monotonic) {
        now = _emscripten_get_now();
      } else {
        setErrNo(28);
        return -1;
      }
      HEAP32[((tp)>>2)]=(now/1000)|0; // seconds
      HEAP32[(((tp)+(4))>>2)]=((now % 1000)*1000*1000)|0; // nanoseconds
      return 0;
    }

  function _dlclose(handle) {
      abort("To use dlopen, you need to use Emscripten's linking support, see https://github.com/emscripten-core/emscripten/wiki/Linking");
    }

  
  var EGL={errorCode:12288,defaultDisplayInitialized:false,currentContext:0,currentReadSurface:0,currentDrawSurface:0,contextAttributes:{alpha:false,depth:false,stencil:false,antialias:false},stringCache:{},setErrorCode:function(code) {
        EGL.errorCode = code;
      },chooseConfig:function(display, attribList, config, config_size, numConfigs) {
        if (display != 62000 /* Magic ID for Emscripten 'default display' */) {
          EGL.setErrorCode(0x3008 /* EGL_BAD_DISPLAY */);
          return 0;
        }
  
        if (attribList) {
          // read attribList if it is non-null
          for(;;) {
            var param = HEAP32[((attribList)>>2)];
            if (param == 0x3021 /*EGL_ALPHA_SIZE*/) {
              var alphaSize = HEAP32[(((attribList)+(4))>>2)];
              EGL.contextAttributes.alpha = (alphaSize > 0);
            } else if (param == 0x3025 /*EGL_DEPTH_SIZE*/) {
              var depthSize = HEAP32[(((attribList)+(4))>>2)];
              EGL.contextAttributes.depth = (depthSize > 0);
            } else if (param == 0x3026 /*EGL_STENCIL_SIZE*/) {
              var stencilSize = HEAP32[(((attribList)+(4))>>2)];
              EGL.contextAttributes.stencil = (stencilSize > 0);
            } else if (param == 0x3031 /*EGL_SAMPLES*/) {
              var samples = HEAP32[(((attribList)+(4))>>2)];
              EGL.contextAttributes.antialias = (samples > 0);
            } else if (param == 0x3032 /*EGL_SAMPLE_BUFFERS*/) {
              var samples = HEAP32[(((attribList)+(4))>>2)];
              EGL.contextAttributes.antialias = (samples == 1);
            } else if (param == 0x3100 /*EGL_CONTEXT_PRIORITY_LEVEL_IMG*/) {
              var requestedPriority = HEAP32[(((attribList)+(4))>>2)];
              EGL.contextAttributes.lowLatency = (requestedPriority != 0x3103 /*EGL_CONTEXT_PRIORITY_LOW_IMG*/);
            } else if (param == 0x3038 /*EGL_NONE*/) {
                break;
            }
            attribList += 8;
          }
        }
  
        if ((!config || !config_size) && !numConfigs) {
          EGL.setErrorCode(0x300C /* EGL_BAD_PARAMETER */);
          return 0;
        }
        if (numConfigs) {
          HEAP32[((numConfigs)>>2)]=1; // Total number of supported configs: 1.
        }
        if (config && config_size > 0) {
          HEAP32[((config)>>2)]=62002;
        }
  
        EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
        return 1;
      }};function _eglBindAPI(api) {
      if (api == 0x30A0 /* EGL_OPENGL_ES_API */) {
        EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
        return 1;
      } else { // if (api == 0x30A1 /* EGL_OPENVG_API */ || api == 0x30A2 /* EGL_OPENGL_API */) {
        EGL.setErrorCode(0x300C /* EGL_BAD_PARAMETER */);
        return 0;
      }
    }

  function _eglChooseConfig(display, attrib_list, configs, config_size, numConfigs) {
      return EGL.chooseConfig(display, attrib_list, configs, config_size, numConfigs);
    }

  
  
  function __webgl_enable_ANGLE_instanced_arrays(ctx) {
      // Extension available in WebGL 1 from Firefox 26 and Google Chrome 30 onwards. Core feature in WebGL 2.
      var ext = ctx.getExtension('ANGLE_instanced_arrays');
      if (ext) {
        ctx['vertexAttribDivisor'] = function(index, divisor) { ext['vertexAttribDivisorANGLE'](index, divisor); };
        ctx['drawArraysInstanced'] = function(mode, first, count, primcount) { ext['drawArraysInstancedANGLE'](mode, first, count, primcount); };
        ctx['drawElementsInstanced'] = function(mode, count, type, indices, primcount) { ext['drawElementsInstancedANGLE'](mode, count, type, indices, primcount); };
        return 1;
      }
    }
  
  function __webgl_enable_OES_vertex_array_object(ctx) {
      // Extension available in WebGL 1 from Firefox 25 and WebKit 536.28/desktop Safari 6.0.3 onwards. Core feature in WebGL 2.
      var ext = ctx.getExtension('OES_vertex_array_object');
      if (ext) {
        ctx['createVertexArray'] = function() { return ext['createVertexArrayOES'](); };
        ctx['deleteVertexArray'] = function(vao) { ext['deleteVertexArrayOES'](vao); };
        ctx['bindVertexArray'] = function(vao) { ext['bindVertexArrayOES'](vao); };
        ctx['isVertexArray'] = function(vao) { return ext['isVertexArrayOES'](vao); };
        return 1;
      }
    }
  
  function __webgl_enable_WEBGL_draw_buffers(ctx) {
      // Extension available in WebGL 1 from Firefox 28 onwards. Core feature in WebGL 2.
      var ext = ctx.getExtension('WEBGL_draw_buffers');
      if (ext) {
        ctx['drawBuffers'] = function(n, bufs) { ext['drawBuffersWEBGL'](n, bufs); };
        return 1;
      }
    }var GL={counter:1,buffers:[],programs:[],framebuffers:[],renderbuffers:[],textures:[],uniforms:[],shaders:[],vaos:[],contexts:[],offscreenCanvases:{},timerQueriesEXT:[],byteSizeByTypeRoot:5120,byteSizeByType:[1,1,2,2,4,4,4,2,3,4,8],programInfos:{},stringCache:{},unpackAlignment:4,recordError:function recordError(errorCode) {
        if (!GL.lastError) {
          GL.lastError = errorCode;
        }
      },getNewId:function(table) {
        var ret = GL.counter++;
        for (var i = table.length; i < ret; i++) {
          table[i] = null;
        }
        return ret;
      },MAX_TEMP_BUFFER_SIZE:2097152,numTempVertexBuffersPerSize:64,log2ceilLookup:function(i) {
        return 32 - Math.clz32(i-1);
      },generateTempBuffers:function(quads, context) {
        var largestIndex = GL.log2ceilLookup(GL.MAX_TEMP_BUFFER_SIZE);
        context.tempVertexBufferCounters1 = [];
        context.tempVertexBufferCounters2 = [];
        context.tempVertexBufferCounters1.length = context.tempVertexBufferCounters2.length = largestIndex+1;
        context.tempVertexBuffers1 = [];
        context.tempVertexBuffers2 = [];
        context.tempVertexBuffers1.length = context.tempVertexBuffers2.length = largestIndex+1;
        context.tempIndexBuffers = [];
        context.tempIndexBuffers.length = largestIndex+1;
        for (var i = 0; i <= largestIndex; ++i) {
          context.tempIndexBuffers[i] = null; // Created on-demand
          context.tempVertexBufferCounters1[i] = context.tempVertexBufferCounters2[i] = 0;
          var ringbufferLength = GL.numTempVertexBuffersPerSize;
          context.tempVertexBuffers1[i] = [];
          context.tempVertexBuffers2[i] = [];
          var ringbuffer1 = context.tempVertexBuffers1[i];
          var ringbuffer2 = context.tempVertexBuffers2[i];
          ringbuffer1.length = ringbuffer2.length = ringbufferLength;
          for (var j = 0; j < ringbufferLength; ++j) {
            ringbuffer1[j] = ringbuffer2[j] = null; // Created on-demand
          }
        }
  
        if (quads) {
          // GL_QUAD indexes can be precalculated
          context.tempQuadIndexBuffer = GLctx.createBuffer();
          context.GLctx.bindBuffer(0x8893 /*GL_ELEMENT_ARRAY_BUFFER*/, context.tempQuadIndexBuffer);
          var numIndexes = GL.MAX_TEMP_BUFFER_SIZE >> 1;
          var quadIndexes = new Uint16Array(numIndexes);
          var i = 0, v = 0;
          while (1) {
            quadIndexes[i++] = v;
            if (i >= numIndexes) break;
            quadIndexes[i++] = v+1;
            if (i >= numIndexes) break;
            quadIndexes[i++] = v+2;
            if (i >= numIndexes) break;
            quadIndexes[i++] = v;
            if (i >= numIndexes) break;
            quadIndexes[i++] = v+2;
            if (i >= numIndexes) break;
            quadIndexes[i++] = v+3;
            if (i >= numIndexes) break;
            v += 4;
          }
          context.GLctx.bufferData(0x8893 /*GL_ELEMENT_ARRAY_BUFFER*/, quadIndexes, 0x88E4 /*GL_STATIC_DRAW*/);
          context.GLctx.bindBuffer(0x8893 /*GL_ELEMENT_ARRAY_BUFFER*/, null);
        }
      },getTempVertexBuffer:function getTempVertexBuffer(sizeBytes) {
        var idx = GL.log2ceilLookup(sizeBytes);
        var ringbuffer = GL.currentContext.tempVertexBuffers1[idx];
        var nextFreeBufferIndex = GL.currentContext.tempVertexBufferCounters1[idx];
        GL.currentContext.tempVertexBufferCounters1[idx] = (GL.currentContext.tempVertexBufferCounters1[idx]+1) & (GL.numTempVertexBuffersPerSize-1);
        var vbo = ringbuffer[nextFreeBufferIndex];
        if (vbo) {
          return vbo;
        }
        var prevVBO = GLctx.getParameter(0x8894 /*GL_ARRAY_BUFFER_BINDING*/);
        ringbuffer[nextFreeBufferIndex] = GLctx.createBuffer();
        GLctx.bindBuffer(0x8892 /*GL_ARRAY_BUFFER*/, ringbuffer[nextFreeBufferIndex]);
        GLctx.bufferData(0x8892 /*GL_ARRAY_BUFFER*/, 1 << idx, 0x88E8 /*GL_DYNAMIC_DRAW*/);
        GLctx.bindBuffer(0x8892 /*GL_ARRAY_BUFFER*/, prevVBO);
        return ringbuffer[nextFreeBufferIndex];
      },getTempIndexBuffer:function getTempIndexBuffer(sizeBytes) {
        var idx = GL.log2ceilLookup(sizeBytes);
        var ibo = GL.currentContext.tempIndexBuffers[idx];
        if (ibo) {
          return ibo;
        }
        var prevIBO = GLctx.getParameter(0x8895 /*ELEMENT_ARRAY_BUFFER_BINDING*/);
        GL.currentContext.tempIndexBuffers[idx] = GLctx.createBuffer();
        GLctx.bindBuffer(0x8893 /*GL_ELEMENT_ARRAY_BUFFER*/, GL.currentContext.tempIndexBuffers[idx]);
        GLctx.bufferData(0x8893 /*GL_ELEMENT_ARRAY_BUFFER*/, 1 << idx, 0x88E8 /*GL_DYNAMIC_DRAW*/);
        GLctx.bindBuffer(0x8893 /*GL_ELEMENT_ARRAY_BUFFER*/, prevIBO);
        return GL.currentContext.tempIndexBuffers[idx];
      },newRenderingFrameStarted:function newRenderingFrameStarted() {
        if (!GL.currentContext) {
          return;
        }
        var vb = GL.currentContext.tempVertexBuffers1;
        GL.currentContext.tempVertexBuffers1 = GL.currentContext.tempVertexBuffers2;
        GL.currentContext.tempVertexBuffers2 = vb;
        vb = GL.currentContext.tempVertexBufferCounters1;
        GL.currentContext.tempVertexBufferCounters1 = GL.currentContext.tempVertexBufferCounters2;
        GL.currentContext.tempVertexBufferCounters2 = vb;
        var largestIndex = GL.log2ceilLookup(GL.MAX_TEMP_BUFFER_SIZE);
        for (var i = 0; i <= largestIndex; ++i) {
          GL.currentContext.tempVertexBufferCounters1[i] = 0;
        }
      },getSource:function(shader, count, string, length) {
        var source = '';
        for (var i = 0; i < count; ++i) {
          var len = length ? HEAP32[(((length)+(i*4))>>2)] : -1;
          source += UTF8ToString(HEAP32[(((string)+(i*4))>>2)], len < 0 ? undefined : len);
        }
        // Let's see if we need to enable the standard derivatives extension
        var type = GLctx.getShaderParameter(GL.shaders[shader], 0x8B4F /* GL_SHADER_TYPE */);
        if (type == 0x8B30 /* GL_FRAGMENT_SHADER */) {
          if (GLEmulation.findToken(source, "dFdx") ||
              GLEmulation.findToken(source, "dFdy") ||
              GLEmulation.findToken(source, "fwidth")) {
            source = "#extension GL_OES_standard_derivatives : enable\n" + source;
            var extension = GLctx.getExtension("OES_standard_derivatives");
          }
        }
        return source;
      },enabledClientAttribIndices:[],enableVertexAttribArray:function enableVertexAttribArray(index) {
        if (!GL.enabledClientAttribIndices[index]) {
          GL.enabledClientAttribIndices[index] = true;
          GLctx.enableVertexAttribArray(index);
        }
      },disableVertexAttribArray:function disableVertexAttribArray(index) {
        if (GL.enabledClientAttribIndices[index]) {
          GL.enabledClientAttribIndices[index] = false;
          GLctx.disableVertexAttribArray(index);
        }
      },createContext:function(canvas, webGLContextAttributes) {
  
  
  
  
  
        var ctx = 
          (canvas.getContext("webgl", webGLContextAttributes)
            // https://caniuse.com/#feat=webgl
            );
  
  
        if (!ctx) return 0;
  
        var handle = GL.registerContext(ctx, webGLContextAttributes);
  
  
  
        return handle;
      },registerContext:function(ctx, webGLContextAttributes) {
        // without pthreads a context is just an integer ID
        var handle = GL.getNewId(GL.contexts);
  
        var context = {
          handle: handle,
          attributes: webGLContextAttributes,
          version: webGLContextAttributes.majorVersion,
          GLctx: ctx
        };
  
  
        // Store the created context object so that we can access the context given a canvas without having to pass the parameters again.
        if (ctx.canvas) ctx.canvas.GLctxObject = context;
        GL.contexts[handle] = context;
        if (typeof webGLContextAttributes.enableExtensionsByDefault === 'undefined' || webGLContextAttributes.enableExtensionsByDefault) {
          GL.initExtensions(context);
        }
  
  
  
  
        return handle;
      },makeContextCurrent:function(contextHandle) {
  
        GL.currentContext = GL.contexts[contextHandle]; // Active Emscripten GL layer context object.
        Module.ctx = GLctx = GL.currentContext && GL.currentContext.GLctx; // Active WebGL context object.
        return !(contextHandle && !GLctx);
      },getContext:function(contextHandle) {
        return GL.contexts[contextHandle];
      },deleteContext:function(contextHandle) {
        if (GL.currentContext === GL.contexts[contextHandle]) GL.currentContext = null;
        if (typeof JSEvents === 'object') JSEvents.removeAllHandlersOnTarget(GL.contexts[contextHandle].GLctx.canvas); // Release all JS event handlers on the DOM element that the GL context is associated with since the context is now deleted.
        if (GL.contexts[contextHandle] && GL.contexts[contextHandle].GLctx.canvas) GL.contexts[contextHandle].GLctx.canvas.GLctxObject = undefined; // Make sure the canvas object no longer refers to the context object so there are no GC surprises.
        GL.contexts[contextHandle] = null;
      },initExtensions:function(context) {
        // If this function is called without a specific context object, init the extensions of the currently active context.
        if (!context) context = GL.currentContext;
  
        if (context.initExtensionsDone) return;
        context.initExtensionsDone = true;
  
        var GLctx = context.GLctx;
  
        // Detect the presence of a few extensions manually, this GL interop layer itself will need to know if they exist.
        context.compressionExt = GLctx.getExtension('WEBGL_compressed_texture_s3tc');
        context.anisotropicExt = GLctx.getExtension('EXT_texture_filter_anisotropic');
  
        // Extensions that are only available in WebGL 1 (the calls will be no-ops if called on a WebGL 2 context active)
        __webgl_enable_ANGLE_instanced_arrays(GLctx);
        __webgl_enable_OES_vertex_array_object(GLctx);
        __webgl_enable_WEBGL_draw_buffers(GLctx);
  
        GLctx.disjointTimerQueryExt = GLctx.getExtension("EXT_disjoint_timer_query");
  
        // These are the 'safe' feature-enabling extensions that don't add any performance impact related to e.g. debugging, and
        // should be enabled by default so that client GLES2/GL code will not need to go through extra hoops to get its stuff working.
        // As new extensions are ratified at http://www.khronos.org/registry/webgl/extensions/ , feel free to add your new extensions
        // here, as long as they don't produce a performance impact for users that might not be using those extensions.
        // E.g. debugging-related extensions should probably be off by default.
        var automaticallyEnabledExtensions = [ // Khronos ratified WebGL extensions ordered by number (no debug extensions):
                                               "OES_texture_float", "OES_texture_half_float", "OES_standard_derivatives",
                                               "OES_vertex_array_object", "WEBGL_compressed_texture_s3tc", "WEBGL_depth_texture",
                                               "OES_element_index_uint", "EXT_texture_filter_anisotropic", "EXT_frag_depth",
                                               "WEBGL_draw_buffers", "ANGLE_instanced_arrays", "OES_texture_float_linear",
                                               "OES_texture_half_float_linear", "EXT_blend_minmax", "EXT_shader_texture_lod",
                                               "EXT_texture_norm16",
                                               // Community approved WebGL extensions ordered by number:
                                               "WEBGL_compressed_texture_pvrtc", "EXT_color_buffer_half_float", "WEBGL_color_buffer_float",
                                               "EXT_sRGB", "WEBGL_compressed_texture_etc1", "EXT_disjoint_timer_query",
                                               "WEBGL_compressed_texture_etc", "WEBGL_compressed_texture_astc", "EXT_color_buffer_float",
                                               "WEBGL_compressed_texture_s3tc_srgb", "EXT_disjoint_timer_query_webgl2",
                                               // Old style prefixed forms of extensions (but still currently used on e.g. iPhone Xs as
                                               // tested on iOS 12.4.1):
                                               "WEBKIT_WEBGL_compressed_texture_pvrtc"];
  
        function shouldEnableAutomatically(extension) {
          var ret = false;
          automaticallyEnabledExtensions.forEach(function(include) {
            if (extension.indexOf(include) != -1) {
              ret = true;
            }
          });
          return ret;
        }
  
        var exts = GLctx.getSupportedExtensions() || []; // .getSupportedExtensions() can return null if context is lost, so coerce to empty array.
        exts.forEach(function(ext) {
          if (automaticallyEnabledExtensions.indexOf(ext) != -1) {
            GLctx.getExtension(ext); // Calling .getExtension enables that extension permanently, no need to store the return value to be enabled.
          }
        });
      },populateUniformTable:function(program) {
        var p = GL.programs[program];
        var ptable = GL.programInfos[program] = {
          uniforms: {},
          maxUniformLength: 0, // This is eagerly computed below, since we already enumerate all uniforms anyway.
          maxAttributeLength: -1, // This is lazily computed and cached, computed when/if first asked, "-1" meaning not computed yet.
          maxUniformBlockNameLength: -1 // Lazily computed as well
        };
  
        var utable = ptable.uniforms;
        // A program's uniform table maps the string name of an uniform to an integer location of that uniform.
        // The global GL.uniforms map maps integer locations to WebGLUniformLocations.
        var numUniforms = GLctx.getProgramParameter(p, 0x8B86/*GL_ACTIVE_UNIFORMS*/);
        for (var i = 0; i < numUniforms; ++i) {
          var u = GLctx.getActiveUniform(p, i);
  
          var name = u.name;
          ptable.maxUniformLength = Math.max(ptable.maxUniformLength, name.length+1);
  
          // If we are dealing with an array, e.g. vec4 foo[3], strip off the array index part to canonicalize that "foo", "foo[]",
          // and "foo[0]" will mean the same. Loop below will populate foo[1] and foo[2].
          if (name.slice(-1) == ']') {
            name = name.slice(0, name.lastIndexOf('['));
          }
  
          // Optimize memory usage slightly: If we have an array of uniforms, e.g. 'vec3 colors[3];', then
          // only store the string 'colors' in utable, and 'colors[0]', 'colors[1]' and 'colors[2]' will be parsed as 'colors'+i.
          // Note that for the GL.uniforms table, we still need to fetch the all WebGLUniformLocations for all the indices.
          var loc = GLctx.getUniformLocation(p, name);
          if (loc) {
            var id = GL.getNewId(GL.uniforms);
            utable[name] = [u.size, id];
            GL.uniforms[id] = loc;
  
            for (var j = 1; j < u.size; ++j) {
              var n = name + '['+j+']';
              loc = GLctx.getUniformLocation(p, n);
              id = GL.getNewId(GL.uniforms);
  
              GL.uniforms[id] = loc;
            }
          }
        }
      }};function _eglCreateContext(display, config, hmm, contextAttribs) {
      if (display != 62000 /* Magic ID for Emscripten 'default display' */) {
        EGL.setErrorCode(0x3008 /* EGL_BAD_DISPLAY */);
        return 0;
      }
  
      // EGL 1.4 spec says default EGL_CONTEXT_CLIENT_VERSION is GLES1, but this is not supported by Emscripten.
      // So user must pass EGL_CONTEXT_CLIENT_VERSION == 2 to initialize EGL.
      var glesContextVersion = 1;
      for(;;) {
        var param = HEAP32[((contextAttribs)>>2)];
        if (param == 0x3098 /*EGL_CONTEXT_CLIENT_VERSION*/) {
          glesContextVersion = HEAP32[(((contextAttribs)+(4))>>2)];
        } else if (param == 0x3038 /*EGL_NONE*/) {
          break;
        } else {
          /* EGL1.4 specifies only EGL_CONTEXT_CLIENT_VERSION as supported attribute */
          EGL.setErrorCode(0x3004 /*EGL_BAD_ATTRIBUTE*/);
          return 0;
        }
        contextAttribs += 8;
      }
      if (glesContextVersion != 2) {
        EGL.setErrorCode(0x3005 /* EGL_BAD_CONFIG */);
        return 0; /* EGL_NO_CONTEXT */
      }
  
      EGL.contextAttributes.majorVersion = glesContextVersion - 1; // WebGL 1 is GLES 2, WebGL2 is GLES3
      EGL.contextAttributes.minorVersion = 0;
  
      EGL.context = GL.createContext(Module['canvas'], EGL.contextAttributes);
  
      if (EGL.context != 0) {
        EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
  
        // Run callbacks so that GL emulation works
        GL.makeContextCurrent(EGL.context);
        Module.useWebGL = true;
        Browser.moduleContextCreatedCallbacks.forEach(function(callback) { callback() });
  
        // Note: This function only creates a context, but it shall not make it active.
        GL.makeContextCurrent(null);
        return 62004; // Magic ID for Emscripten EGLContext
      } else {
        EGL.setErrorCode(0x3009 /* EGL_BAD_MATCH */); // By the EGL 1.4 spec, an implementation that does not support GLES2 (WebGL in this case), this error code is set.
        return 0; /* EGL_NO_CONTEXT */
      }
    }

  function _eglCreateWindowSurface(display, config, win, attrib_list) {
      if (display != 62000 /* Magic ID for Emscripten 'default display' */) {
        EGL.setErrorCode(0x3008 /* EGL_BAD_DISPLAY */);
        return 0;
      }
      if (config != 62002 /* Magic ID for the only EGLConfig supported by Emscripten */) {
        EGL.setErrorCode(0x3005 /* EGL_BAD_CONFIG */);
        return 0;
      }
      // TODO: Examine attrib_list! Parameters that can be present there are:
      // - EGL_RENDER_BUFFER (must be EGL_BACK_BUFFER)
      // - EGL_VG_COLORSPACE (can't be set)
      // - EGL_VG_ALPHA_FORMAT (can't be set)
      EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
      return 62006; /* Magic ID for Emscripten 'default surface' */
    }

  function _eglDestroyContext(display, context) {
      if (display != 62000 /* Magic ID for Emscripten 'default display' */) {
        EGL.setErrorCode(0x3008 /* EGL_BAD_DISPLAY */);
        return 0;
      }
      if (context != 62004 /* Magic ID for Emscripten EGLContext */) {
        EGL.setErrorCode(0x3006 /* EGL_BAD_CONTEXT */);
        return 0;
      }
  
      GL.deleteContext(EGL.context);
      EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
      if (EGL.currentContext == context) {
        EGL.currentContext = 0;
      }
      return 1 /* EGL_TRUE */;
    }

  function _eglDestroySurface(display, surface) {
      if (display != 62000 /* Magic ID for Emscripten 'default display' */) {
        EGL.setErrorCode(0x3008 /* EGL_BAD_DISPLAY */);
        return 0;
      }
      if (surface != 62006 /* Magic ID for the only EGLSurface supported by Emscripten */) {
        EGL.setErrorCode(0x300D /* EGL_BAD_SURFACE */);
        return 1;
      }
      if (EGL.currentReadSurface == surface) {
        EGL.currentReadSurface = 0;
      }
      if (EGL.currentDrawSurface == surface) {
        EGL.currentDrawSurface = 0;
      }
      EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
      return 1; /* Magic ID for Emscripten 'default surface' */
    }

  function _eglGetConfigAttrib(display, config, attribute, value) {
      if (display != 62000 /* Magic ID for Emscripten 'default display' */) {
        EGL.setErrorCode(0x3008 /* EGL_BAD_DISPLAY */);
        return 0;
      }
      if (config != 62002 /* Magic ID for the only EGLConfig supported by Emscripten */) {
        EGL.setErrorCode(0x3005 /* EGL_BAD_CONFIG */);
        return 0;
      }
      if (!value) {
        EGL.setErrorCode(0x300C /* EGL_BAD_PARAMETER */);
        return 0;
      }
      EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
      switch(attribute) {
      case 0x3020: // EGL_BUFFER_SIZE
        HEAP32[((value)>>2)]=EGL.contextAttributes.alpha ? 32 : 24;
        return 1;
      case 0x3021: // EGL_ALPHA_SIZE
        HEAP32[((value)>>2)]=EGL.contextAttributes.alpha ? 8 : 0;
        return 1;
      case 0x3022: // EGL_BLUE_SIZE
        HEAP32[((value)>>2)]=8;
        return 1;
      case 0x3023: // EGL_GREEN_SIZE
        HEAP32[((value)>>2)]=8;
        return 1;
      case 0x3024: // EGL_RED_SIZE
        HEAP32[((value)>>2)]=8;
        return 1;
      case 0x3025: // EGL_DEPTH_SIZE
        HEAP32[((value)>>2)]=EGL.contextAttributes.depth ? 24 : 0;
        return 1;
      case 0x3026: // EGL_STENCIL_SIZE
        HEAP32[((value)>>2)]=EGL.contextAttributes.stencil ? 8 : 0;
        return 1;
      case 0x3027: // EGL_CONFIG_CAVEAT
        // We can return here one of EGL_NONE (0x3038), EGL_SLOW_CONFIG (0x3050) or EGL_NON_CONFORMANT_CONFIG (0x3051).
        HEAP32[((value)>>2)]=0x3038;
        return 1;
      case 0x3028: // EGL_CONFIG_ID
        HEAP32[((value)>>2)]=62002;
        return 1;
      case 0x3029: // EGL_LEVEL
        HEAP32[((value)>>2)]=0;
        return 1;
      case 0x302A: // EGL_MAX_PBUFFER_HEIGHT
        HEAP32[((value)>>2)]=4096;
        return 1;
      case 0x302B: // EGL_MAX_PBUFFER_PIXELS
        HEAP32[((value)>>2)]=16777216;
        return 1;
      case 0x302C: // EGL_MAX_PBUFFER_WIDTH
        HEAP32[((value)>>2)]=4096;
        return 1;
      case 0x302D: // EGL_NATIVE_RENDERABLE
        HEAP32[((value)>>2)]=0;
        return 1;
      case 0x302E: // EGL_NATIVE_VISUAL_ID
        HEAP32[((value)>>2)]=0;
        return 1;
      case 0x302F: // EGL_NATIVE_VISUAL_TYPE
        HEAP32[((value)>>2)]=0x3038;
        return 1;
      case 0x3031: // EGL_SAMPLES
        HEAP32[((value)>>2)]=EGL.contextAttributes.antialias ? 4 : 0;
        return 1;
      case 0x3032: // EGL_SAMPLE_BUFFERS
        HEAP32[((value)>>2)]=EGL.contextAttributes.antialias ? 1 : 0;
        return 1;
      case 0x3033: // EGL_SURFACE_TYPE
        HEAP32[((value)>>2)]=0x4;
        return 1;
      case 0x3034: // EGL_TRANSPARENT_TYPE
        // If this returns EGL_TRANSPARENT_RGB (0x3052), transparency is used through color-keying. No such thing applies to Emscripten canvas.
        HEAP32[((value)>>2)]=0x3038;
        return 1;
      case 0x3035: // EGL_TRANSPARENT_BLUE_VALUE
      case 0x3036: // EGL_TRANSPARENT_GREEN_VALUE
      case 0x3037: // EGL_TRANSPARENT_RED_VALUE
        // "If EGL_TRANSPARENT_TYPE is EGL_NONE, then the values for EGL_TRANSPARENT_RED_VALUE, EGL_TRANSPARENT_GREEN_VALUE, and EGL_TRANSPARENT_BLUE_VALUE are undefined."
        HEAP32[((value)>>2)]=-1;
        return 1;
      case 0x3039: // EGL_BIND_TO_TEXTURE_RGB
      case 0x303A: // EGL_BIND_TO_TEXTURE_RGBA
        HEAP32[((value)>>2)]=0;
        return 1;
      case 0x303B: // EGL_MIN_SWAP_INTERVAL
        HEAP32[((value)>>2)]=0;
        return 1;
      case 0x303C: // EGL_MAX_SWAP_INTERVAL
        HEAP32[((value)>>2)]=1;
        return 1;
      case 0x303D: // EGL_LUMINANCE_SIZE
      case 0x303E: // EGL_ALPHA_MASK_SIZE
        HEAP32[((value)>>2)]=0;
        return 1;
      case 0x303F: // EGL_COLOR_BUFFER_TYPE
        // EGL has two types of buffers: EGL_RGB_BUFFER and EGL_LUMINANCE_BUFFER.
        HEAP32[((value)>>2)]=0x308E;
        return 1;
      case 0x3040: // EGL_RENDERABLE_TYPE
        // A bit combination of EGL_OPENGL_ES_BIT,EGL_OPENVG_BIT,EGL_OPENGL_ES2_BIT and EGL_OPENGL_BIT.
        HEAP32[((value)>>2)]=0x4;
        return 1;
      case 0x3042: // EGL_CONFORMANT
        // "EGL_CONFORMANT is a mask indicating if a client API context created with respect to the corresponding EGLConfig will pass the required conformance tests for that API."
        HEAP32[((value)>>2)]=0;
        return 1;
      default:
        EGL.setErrorCode(0x3004 /* EGL_BAD_ATTRIBUTE */);
        return 0;
      }
    }

  function _eglGetDisplay(nativeDisplayType) {
      EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
      // Note: As a 'conformant' implementation of EGL, we would prefer to init here only if the user
      //       calls this function with EGL_DEFAULT_DISPLAY. Other display IDs would be preferred to be unsupported
      //       and EGL_NO_DISPLAY returned. Uncomment the following code lines to do this.
      // Instead, an alternative route has been preferred, namely that the Emscripten EGL implementation
      // "emulates" X11, and eglGetDisplay is expected to accept/receive a pointer to an X11 Display object.
      // Therefore, be lax and allow anything to be passed in, and return the magic handle to our default EGLDisplay object.
  
  //    if (nativeDisplayType == 0 /* EGL_DEFAULT_DISPLAY */) {
          return 62000; // Magic ID for Emscripten 'default display'
  //    }
  //    else
  //      return 0; // EGL_NO_DISPLAY
    }

  function _eglGetError() {
      return EGL.errorCode;
    }

  function _eglGetProcAddress(name_) {
      return _emscripten_GetProcAddress(name_);
    }

  function _eglInitialize(display, majorVersion, minorVersion) {
      if (display == 62000 /* Magic ID for Emscripten 'default display' */) {
        if (majorVersion) {
          HEAP32[((majorVersion)>>2)]=1; // Advertise EGL Major version: '1'
        }
        if (minorVersion) {
          HEAP32[((minorVersion)>>2)]=4; // Advertise EGL Minor version: '4'
        }
        EGL.defaultDisplayInitialized = true;
        EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
        return 1;
      }
      else {
        EGL.setErrorCode(0x3008 /* EGL_BAD_DISPLAY */);
        return 0;
      }
    }

  function _eglMakeCurrent(display, draw, read, context) {
      if (display != 62000 /* Magic ID for Emscripten 'default display' */) {
        EGL.setErrorCode(0x3008 /* EGL_BAD_DISPLAY */);
        return 0 /* EGL_FALSE */;
      }
      //\todo An EGL_NOT_INITIALIZED error is generated if EGL is not initialized for dpy.
      if (context != 0 && context != 62004 /* Magic ID for Emscripten EGLContext */) {
        EGL.setErrorCode(0x3006 /* EGL_BAD_CONTEXT */);
        return 0;
      }
      if ((read != 0 && read != 62006) || (draw != 0 && draw != 62006 /* Magic ID for Emscripten 'default surface' */)) {
        EGL.setErrorCode(0x300D /* EGL_BAD_SURFACE */);
        return 0;
      }
  
      GL.makeContextCurrent(context ? EGL.context : null);
  
      EGL.currentContext = context;
      EGL.currentDrawSurface = draw;
      EGL.currentReadSurface = read;
      EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
      return 1 /* EGL_TRUE */;
    }

  function _eglQueryString(display, name) {
      if (display != 62000 /* Magic ID for Emscripten 'default display' */) {
        EGL.setErrorCode(0x3008 /* EGL_BAD_DISPLAY */);
        return 0;
      }
      //\todo An EGL_NOT_INITIALIZED error is generated if EGL is not initialized for dpy.
      EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
      if (EGL.stringCache[name]) return EGL.stringCache[name];
      var ret;
      switch(name) {
        case 0x3053 /* EGL_VENDOR */: ret = allocateUTF8("Emscripten"); break;
        case 0x3054 /* EGL_VERSION */: ret = allocateUTF8("1.4 Emscripten EGL"); break;
        case 0x3055 /* EGL_EXTENSIONS */:  ret = allocateUTF8(""); break; // Currently not supporting any EGL extensions.
        case 0x308D /* EGL_CLIENT_APIS */: ret = allocateUTF8("OpenGL_ES"); break;
        default:
          EGL.setErrorCode(0x300C /* EGL_BAD_PARAMETER */);
          return 0;
      }
      EGL.stringCache[name] = ret;
      return ret;
    }

  function _eglSwapBuffers() {
  
      if (!EGL.defaultDisplayInitialized) {
        EGL.setErrorCode(0x3001 /* EGL_NOT_INITIALIZED */);
      } else if (!Module.ctx) {
        EGL.setErrorCode(0x3002 /* EGL_BAD_ACCESS */);
      } else if (Module.ctx.isContextLost()) {
        EGL.setErrorCode(0x300E /* EGL_CONTEXT_LOST */);
      } else {
        // According to documentation this does an implicit flush.
        // Due to discussion at https://github.com/emscripten-core/emscripten/pull/1871
        // the flush was removed since this _may_ result in slowing code down.
        //_glFlush();
        EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
        return 1 /* EGL_TRUE */;
      }
      return 0 /* EGL_FALSE */;
    }

  function _eglSwapInterval(display, interval) {
      if (display != 62000 /* Magic ID for Emscripten 'default display' */) {
        EGL.setErrorCode(0x3008 /* EGL_BAD_DISPLAY */);
        return 0;
      }
      if (interval == 0) _emscripten_set_main_loop_timing(0/*EM_TIMING_SETTIMEOUT*/, 0);
      else _emscripten_set_main_loop_timing(1/*EM_TIMING_RAF*/, interval);
  
      EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
      return 1;
    }

  function _eglTerminate(display) {
      if (display != 62000 /* Magic ID for Emscripten 'default display' */) {
        EGL.setErrorCode(0x3008 /* EGL_BAD_DISPLAY */);
        return 0;
      }
      EGL.currentContext = 0;
      EGL.currentReadSurface = 0;
      EGL.currentDrawSurface = 0;
      EGL.defaultDisplayInitialized = false;
      EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
      return 1;
    }

  
  function _eglWaitClient() {
      EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
      return 1;
    }function _eglWaitGL(
  ) {
  return _eglWaitClient();
  }

  function _eglWaitNative(nativeEngineId) {
      EGL.setErrorCode(0x3000 /* EGL_SUCCESS */);
      return 1;
    }

  
  var JSEvents={inEventHandler:0,removeAllEventListeners:function() {
        for(var i = JSEvents.eventHandlers.length-1; i >= 0; --i) {
          JSEvents._removeHandler(i);
        }
        JSEvents.eventHandlers = [];
        JSEvents.deferredCalls = [];
      },registerRemoveEventListeners:function() {
        if (!JSEvents.removeEventListenersRegistered) {
          __ATEXIT__.push(JSEvents.removeAllEventListeners);
          JSEvents.removeEventListenersRegistered = true;
        }
      },deferredCalls:[],deferCall:function(targetFunction, precedence, argsList) {
        function arraysHaveEqualContent(arrA, arrB) {
          if (arrA.length != arrB.length) return false;
  
          for(var i in arrA) {
            if (arrA[i] != arrB[i]) return false;
          }
          return true;
        }
        // Test if the given call was already queued, and if so, don't add it again.
        for(var i in JSEvents.deferredCalls) {
          var call = JSEvents.deferredCalls[i];
          if (call.targetFunction == targetFunction && arraysHaveEqualContent(call.argsList, argsList)) {
            return;
          }
        }
        JSEvents.deferredCalls.push({
          targetFunction: targetFunction,
          precedence: precedence,
          argsList: argsList
        });
  
        JSEvents.deferredCalls.sort(function(x,y) { return x.precedence < y.precedence; });
      },removeDeferredCalls:function(targetFunction) {
        for(var i = 0; i < JSEvents.deferredCalls.length; ++i) {
          if (JSEvents.deferredCalls[i].targetFunction == targetFunction) {
            JSEvents.deferredCalls.splice(i, 1);
            --i;
          }
        }
      },canPerformEventHandlerRequests:function() {
        return JSEvents.inEventHandler && JSEvents.currentEventHandler.allowsDeferredCalls;
      },runDeferredCalls:function() {
        if (!JSEvents.canPerformEventHandlerRequests()) {
          return;
        }
        for(var i = 0; i < JSEvents.deferredCalls.length; ++i) {
          var call = JSEvents.deferredCalls[i];
          JSEvents.deferredCalls.splice(i, 1);
          --i;
          call.targetFunction.apply(null, call.argsList);
        }
      },eventHandlers:[],removeAllHandlersOnTarget:function(target, eventTypeString) {
        for(var i = 0; i < JSEvents.eventHandlers.length; ++i) {
          if (JSEvents.eventHandlers[i].target == target && 
            (!eventTypeString || eventTypeString == JSEvents.eventHandlers[i].eventTypeString)) {
             JSEvents._removeHandler(i--);
           }
        }
      },_removeHandler:function(i) {
        var h = JSEvents.eventHandlers[i];
        h.target.removeEventListener(h.eventTypeString, h.eventListenerFunc, h.useCapture);
        JSEvents.eventHandlers.splice(i, 1);
      },registerOrRemoveHandler:function(eventHandler) {
        var jsEventHandler = function jsEventHandler(event) {
          // Increment nesting count for the event handler.
          ++JSEvents.inEventHandler;
          JSEvents.currentEventHandler = eventHandler;
          // Process any old deferred calls the user has placed.
          JSEvents.runDeferredCalls();
          // Process the actual event, calls back to user C code handler.
          eventHandler.handlerFunc(event);
          // Process any new deferred calls that were placed right now from this event handler.
          JSEvents.runDeferredCalls();
          // Out of event handler - restore nesting count.
          --JSEvents.inEventHandler;
        };
        
        if (eventHandler.callbackfunc) {
          eventHandler.eventListenerFunc = jsEventHandler;
          eventHandler.target.addEventListener(eventHandler.eventTypeString, jsEventHandler, eventHandler.useCapture);
          JSEvents.eventHandlers.push(eventHandler);
          JSEvents.registerRemoveEventListeners();
        } else {
          for(var i = 0; i < JSEvents.eventHandlers.length; ++i) {
            if (JSEvents.eventHandlers[i].target == eventHandler.target
             && JSEvents.eventHandlers[i].eventTypeString == eventHandler.eventTypeString) {
               JSEvents._removeHandler(i--);
             }
          }
        }
      },getNodeNameForTarget:function(target) {
        if (!target) return '';
        if (target == window) return '#window';
        if (target == screen) return '#screen';
        return (target && target.nodeName) ? target.nodeName : '';
      },fullscreenEnabled:function() {
        return document.fullscreenEnabled
        // Safari 13.0.3 on macOS Catalina 10.15.1 still ships with prefixed webkitFullscreenEnabled.
        // TODO: If Safari at some point ships with unprefixed version, update the version check above.
        || document.webkitFullscreenEnabled
         ;
      }};
  
  var __currentFullscreenStrategy={};
  
  
  
  
  
  
  
  
  function maybeCStringToJsString(cString) {
      // "cString > 2" checks if the input is a number, and isn't of the special
      // values we accept here, EMSCRIPTEN_EVENT_TARGET_* (which map to 0, 1, 2).
      // In other words, if cString > 2 then it's a pointer to a valid place in
      // memory, and points to a C string.
      return cString > 2 ? UTF8ToString(cString) : cString;
    }
  
  var specialHTMLTargets=[0, typeof document !== 'undefined' ? document : 0, typeof window !== 'undefined' ? window : 0];function findEventTarget(target) {
      target = maybeCStringToJsString(target);
      var domElement = specialHTMLTargets[target] || (typeof document !== 'undefined' ? document.querySelector(target) : undefined);
      return domElement;
    }function findCanvasEventTarget(target) { return findEventTarget(target); }function _emscripten_get_canvas_element_size(target, width, height) {
      var canvas = findCanvasEventTarget(target);
      if (!canvas) return -4;
      HEAP32[((width)>>2)]=canvas.width;
      HEAP32[((height)>>2)]=canvas.height;
    }function __get_canvas_element_size(target) {
      var stackTop = stackSave();
      var w = stackAlloc(8);
      var h = w + 4;
  
      var targetInt = stackAlloc(target.id.length+1);
      stringToUTF8(target.id, targetInt, target.id.length+1);
      var ret = _emscripten_get_canvas_element_size(targetInt, w, h);
      var size = [HEAP32[((w)>>2)], HEAP32[((h)>>2)]];
      stackRestore(stackTop);
      return size;
    }
  
  
  function _emscripten_set_canvas_element_size(target, width, height) {
      var canvas = findCanvasEventTarget(target);
      if (!canvas) return -4;
      canvas.width = width;
      canvas.height = height;
      return 0;
    }function __set_canvas_element_size(target, width, height) {
      if (!target.controlTransferredOffscreen) {
        target.width = width;
        target.height = height;
      } else {
        // This function is being called from high-level JavaScript code instead of asm.js/Wasm,
        // and it needs to synchronously proxy over to another thread, so marshal the string onto the heap to do the call.
        var stackTop = stackSave();
        var targetInt = stackAlloc(target.id.length+1);
        stringToUTF8(target.id, targetInt, target.id.length+1);
        _emscripten_set_canvas_element_size(targetInt, width, height);
        stackRestore(stackTop);
      }
    }function __registerRestoreOldStyle(canvas) {
      var canvasSize = __get_canvas_element_size(canvas);
      var oldWidth = canvasSize[0];
      var oldHeight = canvasSize[1];
      var oldCssWidth = canvas.style.width;
      var oldCssHeight = canvas.style.height;
      var oldBackgroundColor = canvas.style.backgroundColor; // Chrome reads color from here.
      var oldDocumentBackgroundColor = document.body.style.backgroundColor; // IE11 reads color from here.
      // Firefox always has black background color.
      var oldPaddingLeft = canvas.style.paddingLeft; // Chrome, FF, Safari
      var oldPaddingRight = canvas.style.paddingRight;
      var oldPaddingTop = canvas.style.paddingTop;
      var oldPaddingBottom = canvas.style.paddingBottom;
      var oldMarginLeft = canvas.style.marginLeft; // IE11
      var oldMarginRight = canvas.style.marginRight;
      var oldMarginTop = canvas.style.marginTop;
      var oldMarginBottom = canvas.style.marginBottom;
      var oldDocumentBodyMargin = document.body.style.margin;
      var oldDocumentOverflow = document.documentElement.style.overflow; // Chrome, Firefox
      var oldDocumentScroll = document.body.scroll; // IE
      var oldImageRendering = canvas.style.imageRendering;
  
      function restoreOldStyle() {
        var fullscreenElement = document.fullscreenElement
          || document.webkitFullscreenElement
          || document.msFullscreenElement
          ;
        if (!fullscreenElement) {
          document.removeEventListener('fullscreenchange', restoreOldStyle);
  
  
          // Unprefixed Fullscreen API shipped in Chromium 71 (https://bugs.chromium.org/p/chromium/issues/detail?id=383813)
          // As of Safari 13.0.3 on macOS Catalina 10.15.1 still ships with prefixed webkitfullscreenchange. TODO: revisit this check once Safari ships unprefixed version.
          document.removeEventListener('webkitfullscreenchange', restoreOldStyle);
  
  
          __set_canvas_element_size(canvas, oldWidth, oldHeight);
  
          canvas.style.width = oldCssWidth;
          canvas.style.height = oldCssHeight;
          canvas.style.backgroundColor = oldBackgroundColor; // Chrome
          // IE11 hack: assigning 'undefined' or an empty string to document.body.style.backgroundColor has no effect, so first assign back the default color
          // before setting the undefined value. Setting undefined value is also important, or otherwise we would later treat that as something that the user
          // had explicitly set so subsequent fullscreen transitions would not set background color properly.
          if (!oldDocumentBackgroundColor) document.body.style.backgroundColor = 'white';
          document.body.style.backgroundColor = oldDocumentBackgroundColor; // IE11
          canvas.style.paddingLeft = oldPaddingLeft; // Chrome, FF, Safari
          canvas.style.paddingRight = oldPaddingRight;
          canvas.style.paddingTop = oldPaddingTop;
          canvas.style.paddingBottom = oldPaddingBottom;
          canvas.style.marginLeft = oldMarginLeft; // IE11
          canvas.style.marginRight = oldMarginRight;
          canvas.style.marginTop = oldMarginTop;
          canvas.style.marginBottom = oldMarginBottom;
          document.body.style.margin = oldDocumentBodyMargin;
          document.documentElement.style.overflow = oldDocumentOverflow; // Chrome, Firefox
          document.body.scroll = oldDocumentScroll; // IE
          canvas.style.imageRendering = oldImageRendering;
          if (canvas.GLctxObject) canvas.GLctxObject.GLctx.viewport(0, 0, oldWidth, oldHeight);
  
          if (__currentFullscreenStrategy.canvasResizedCallback) {
            dynCall_iiii(__currentFullscreenStrategy.canvasResizedCallback, 37, 0, __currentFullscreenStrategy.canvasResizedCallbackUserData);
          }
        }
      }
      document.addEventListener('fullscreenchange', restoreOldStyle);
      // Unprefixed Fullscreen API shipped in Chromium 71 (https://bugs.chromium.org/p/chromium/issues/detail?id=383813)
      // As of Safari 13.0.3 on macOS Catalina 10.15.1 still ships with prefixed webkitfullscreenchange. TODO: revisit this check once Safari ships unprefixed version.
      document.addEventListener('webkitfullscreenchange', restoreOldStyle);
      return restoreOldStyle;
    }
  
  function __setLetterbox(element, topBottom, leftRight) {
        // Cannot use margin to specify letterboxes in FF or Chrome, since those ignore margins in fullscreen mode.
        element.style.paddingLeft = element.style.paddingRight = leftRight + 'px';
        element.style.paddingTop = element.style.paddingBottom = topBottom + 'px';
    }
  
  function __getBoundingClientRect(e) {
      return specialHTMLTargets.indexOf(e) < 0 ? e.getBoundingClientRect() : {'left':0,'top':0};
    }function _JSEvents_resizeCanvasForFullscreen(target, strategy) {
      var restoreOldStyle = __registerRestoreOldStyle(target);
      var cssWidth = strategy.softFullscreen ? innerWidth : screen.width;
      var cssHeight = strategy.softFullscreen ? innerHeight : screen.height;
      var rect = __getBoundingClientRect(target);
      var windowedCssWidth = rect.width;
      var windowedCssHeight = rect.height;
      var canvasSize = __get_canvas_element_size(target);
      var windowedRttWidth = canvasSize[0];
      var windowedRttHeight = canvasSize[1];
  
      if (strategy.scaleMode == 3) {
        __setLetterbox(target, (cssHeight - windowedCssHeight) / 2, (cssWidth - windowedCssWidth) / 2);
        cssWidth = windowedCssWidth;
        cssHeight = windowedCssHeight;
      } else if (strategy.scaleMode == 2) {
        if (cssWidth*windowedRttHeight < windowedRttWidth*cssHeight) {
          var desiredCssHeight = windowedRttHeight * cssWidth / windowedRttWidth;
          __setLetterbox(target, (cssHeight - desiredCssHeight) / 2, 0);
          cssHeight = desiredCssHeight;
        } else {
          var desiredCssWidth = windowedRttWidth * cssHeight / windowedRttHeight;
          __setLetterbox(target, 0, (cssWidth - desiredCssWidth) / 2);
          cssWidth = desiredCssWidth;
        }
      }
  
      // If we are adding padding, must choose a background color or otherwise Chrome will give the
      // padding a default white color. Do it only if user has not customized their own background color.
      if (!target.style.backgroundColor) target.style.backgroundColor = 'black';
      // IE11 does the same, but requires the color to be set in the document body.
      if (!document.body.style.backgroundColor) document.body.style.backgroundColor = 'black'; // IE11
      // Firefox always shows black letterboxes independent of style color.
  
      target.style.width = cssWidth + 'px';
      target.style.height = cssHeight + 'px';
  
      if (strategy.filteringMode == 1) {
        target.style.imageRendering = 'optimizeSpeed';
        target.style.imageRendering = '-moz-crisp-edges';
        target.style.imageRendering = '-o-crisp-edges';
        target.style.imageRendering = '-webkit-optimize-contrast';
        target.style.imageRendering = 'optimize-contrast';
        target.style.imageRendering = 'crisp-edges';
        target.style.imageRendering = 'pixelated';
      }
  
      var dpiScale = (strategy.canvasResolutionScaleMode == 2) ? devicePixelRatio : 1;
      if (strategy.canvasResolutionScaleMode != 0) {
        var newWidth = (cssWidth * dpiScale)|0;
        var newHeight = (cssHeight * dpiScale)|0;
        __set_canvas_element_size(target, newWidth, newHeight);
        if (target.GLctxObject) target.GLctxObject.GLctx.viewport(0, 0, newWidth, newHeight);
      }
      return restoreOldStyle;
    }function _JSEvents_requestFullscreen(target, strategy) {
      // EMSCRIPTEN_FULLSCREEN_SCALE_DEFAULT + EMSCRIPTEN_FULLSCREEN_CANVAS_SCALE_NONE is a mode where no extra logic is performed to the DOM elements.
      if (strategy.scaleMode != 0 || strategy.canvasResolutionScaleMode != 0) {
        _JSEvents_resizeCanvasForFullscreen(target, strategy);
      }
  
      if (target.requestFullscreen) {
        target.requestFullscreen();
      } else if (target.webkitRequestFullscreen) {
        target.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      } else {
        return JSEvents.fullscreenEnabled() ? -3 : -1;
      }
  
      __currentFullscreenStrategy = strategy;
  
      if (strategy.canvasResizedCallback) {
        dynCall_iiii(strategy.canvasResizedCallback, 37, 0, strategy.canvasResizedCallbackUserData);
      }
  
      return 0;
    }function _emscripten_exit_fullscreen() {
      if (!JSEvents.fullscreenEnabled()) return -1;
      // Make sure no queued up calls will fire after this.
      JSEvents.removeDeferredCalls(_JSEvents_requestFullscreen);
  
      var d = specialHTMLTargets[1];
      if (d.exitFullscreen) {
        d.fullscreenElement && d.exitFullscreen();
      } else if (d.webkitExitFullscreen) {
        d.webkitFullscreenElement && d.webkitExitFullscreen();
      } else {
        return -1;
      }
  
      return 0;
    }

  
  function __requestPointerLock(target) {
      if (target.requestPointerLock) {
        target.requestPointerLock();
      } else if (target.msRequestPointerLock) {
        target.msRequestPointerLock();
      } else {
        // document.body is known to accept pointer lock, so use that to differentiate if the user passed a bad element,
        // or if the whole browser just doesn't support the feature.
        if (document.body.requestPointerLock
          || document.body.msRequestPointerLock
          ) {
          return -3;
        } else {
          return -1;
        }
      }
      return 0;
    }function _emscripten_exit_pointerlock() {
      // Make sure no queued up calls will fire after this.
      JSEvents.removeDeferredCalls(__requestPointerLock);
  
      if (document.exitPointerLock) {
        document.exitPointerLock();
      } else if (document.msExitPointerLock) {
        document.msExitPointerLock();
      } else {
        return -1;
      }
      return 0;
    }

  function _emscripten_exit_with_live_runtime() {
      noExitRuntime = true;
      throw 'unwind';
    }

  function _emscripten_get_device_pixel_ratio() {
      return (typeof devicePixelRatio === 'number' && devicePixelRatio) || 1.0;
    }

  function _emscripten_get_element_css_size(target, width, height) {
      target = findEventTarget(target);
      if (!target) return -4;
  
      var rect = __getBoundingClientRect(target);
      HEAPF64[((width)>>3)]=rect.width;
      HEAPF64[((height)>>3)]=rect.height;
  
      return 0;
    }

  
  function __fillGamepadEventData(eventStruct, e) {
      HEAPF64[((eventStruct)>>3)]=e.timestamp;
      for(var i = 0; i < e.axes.length; ++i) {
        HEAPF64[(((eventStruct+i*8)+(16))>>3)]=e.axes[i];
      }
      for(var i = 0; i < e.buttons.length; ++i) {
        if (typeof(e.buttons[i]) === 'object') {
          HEAPF64[(((eventStruct+i*8)+(528))>>3)]=e.buttons[i].value;
        } else {
          HEAPF64[(((eventStruct+i*8)+(528))>>3)]=e.buttons[i];
        }
      }
      for(var i = 0; i < e.buttons.length; ++i) {
        if (typeof(e.buttons[i]) === 'object') {
          HEAP32[(((eventStruct+i*4)+(1040))>>2)]=e.buttons[i].pressed;
        } else {
          // Assigning a boolean to HEAP32, that's ok, but Closure would like to warn about it:
          /** @suppress {checkTypes} */
          HEAP32[(((eventStruct+i*4)+(1040))>>2)]=e.buttons[i] == 1;
        }
      }
      HEAP32[(((eventStruct)+(1296))>>2)]=e.connected;
      HEAP32[(((eventStruct)+(1300))>>2)]=e.index;
      HEAP32[(((eventStruct)+(8))>>2)]=e.axes.length;
      HEAP32[(((eventStruct)+(12))>>2)]=e.buttons.length;
      stringToUTF8(e.id, eventStruct + 1304, 64);
      stringToUTF8(e.mapping, eventStruct + 1368, 64);
    }function _emscripten_get_gamepad_status(index, gamepadState) {
      if (!JSEvents.lastGamepadState) throw 'emscripten_get_gamepad_status() can only be called after having first called emscripten_sample_gamepad_data() and that function has returned EMSCRIPTEN_RESULT_SUCCESS!';
  
      // INVALID_PARAM is returned on a Gamepad index that never was there.
      if (index < 0 || index >= JSEvents.lastGamepadState.length) return -5;
  
      // NO_DATA is returned on a Gamepad index that was removed.
      // For previously disconnected gamepads there should be an empty slot (null/undefined/false) at the index.
      // This is because gamepads must keep their original position in the array.
      // For example, removing the first of two gamepads produces [null/undefined/false, gamepad].
      if (!JSEvents.lastGamepadState[index]) return -7;
  
      __fillGamepadEventData(gamepadState, JSEvents.lastGamepadState[index]);
      return 0;
    }

  function _emscripten_get_num_gamepads() {
      if (!JSEvents.lastGamepadState) throw 'emscripten_get_num_gamepads() can only be called after having first called emscripten_sample_gamepad_data() and that function has returned EMSCRIPTEN_RESULT_SUCCESS!';
      // N.B. Do not call emscripten_get_num_gamepads() unless having first called emscripten_sample_gamepad_data(), and that has returned EMSCRIPTEN_RESULT_SUCCESS.
      // Otherwise the following line will throw an exception.
      return JSEvents.lastGamepadState.length;
    }

  function _emscripten_get_sbrk_ptr() {
      return 889824;
    }

  function _emscripten_glActiveTexture(x0) { GLctx['activeTexture'](x0) }

  function _emscripten_glAlphaFunc(){}

  function _emscripten_glAttachShader(program, shader) {
      GLctx.attachShader(GL.programs[program],
                              GL.shaders[shader]);
    }

  
  
  
  
  function _glEnable(x0) { GLctx['enable'](x0) }
  
  function _glDisable(x0) { GLctx['disable'](x0) }
  
  function _glIsEnabled(x0) { return GLctx['isEnabled'](x0) }
  
  
  
  
  function readI53FromI64(ptr) {
      return HEAPU32[ptr>>2] + HEAP32[ptr+4>>2] * 4294967296;
    }
  
  function readI53FromU64(ptr) {
      return HEAPU32[ptr>>2] + HEAPU32[ptr+4>>2] * 4294967296;
    }function writeI53ToI64(ptr, num) {
      HEAPU32[ptr>>2] = num;
      HEAPU32[ptr+4>>2] = (num - HEAPU32[ptr>>2])/4294967296;
      var deserialized = (num >= 0) ? readI53FromU64(ptr) : readI53FromI64(ptr);
      if (deserialized != num) warnOnce('writeI53ToI64() out of range: serialized JS Number ' + num + ' to Wasm heap as bytes lo=0x' + HEAPU32[ptr>>2].toString(16) + ', hi=0x' + HEAPU32[ptr+4>>2].toString(16) + ', which deserializes back to ' + deserialized + ' instead!');
    }function emscriptenWebGLGet(name_, p, type) {
      // Guard against user passing a null pointer.
      // Note that GLES2 spec does not say anything about how passing a null pointer should be treated.
      // Testing on desktop core GL 3, the application crashes on glGetIntegerv to a null pointer, but
      // better to report an error instead of doing anything random.
      if (!p) {
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
      var ret = undefined;
      switch(name_) { // Handle a few trivial GLES values
        case 0x8DFA: // GL_SHADER_COMPILER
          ret = 1;
          break;
        case 0x8DF8: // GL_SHADER_BINARY_FORMATS
          if (type != 0 && type != 1) {
            GL.recordError(0x500); // GL_INVALID_ENUM
          }
          return; // Do not write anything to the out pointer, since no binary formats are supported.
        case 0x8DF9: // GL_NUM_SHADER_BINARY_FORMATS
          ret = 0;
          break;
        case 0x86A2: // GL_NUM_COMPRESSED_TEXTURE_FORMATS
          // WebGL doesn't have GL_NUM_COMPRESSED_TEXTURE_FORMATS (it's obsolete since GL_COMPRESSED_TEXTURE_FORMATS returns a JS array that can be queried for length),
          // so implement it ourselves to allow C++ GLES2 code get the length.
          var formats = GLctx.getParameter(0x86A3 /*GL_COMPRESSED_TEXTURE_FORMATS*/);
          ret = formats ? formats.length : 0;
          break;
      }
  
      if (ret === undefined) {
        var result = GLctx.getParameter(name_);
        switch (typeof(result)) {
          case "number":
            ret = result;
            break;
          case "boolean":
            ret = result ? 1 : 0;
            break;
          case "string":
            GL.recordError(0x500); // GL_INVALID_ENUM
            return;
          case "object":
            if (result === null) {
              // null is a valid result for some (e.g., which buffer is bound - perhaps nothing is bound), but otherwise
              // can mean an invalid name_, which we need to report as an error
              switch(name_) {
                case 0x8894: // ARRAY_BUFFER_BINDING
                case 0x8B8D: // CURRENT_PROGRAM
                case 0x8895: // ELEMENT_ARRAY_BUFFER_BINDING
                case 0x8CA6: // FRAMEBUFFER_BINDING or DRAW_FRAMEBUFFER_BINDING
                case 0x8CA7: // RENDERBUFFER_BINDING
                case 0x8069: // TEXTURE_BINDING_2D
                case 0x85B5: // WebGL 2 GL_VERTEX_ARRAY_BINDING, or WebGL 1 extension OES_vertex_array_object GL_VERTEX_ARRAY_BINDING_OES
                case 0x8514: { // TEXTURE_BINDING_CUBE_MAP
                  ret = 0;
                  break;
                }
                default: {
                  GL.recordError(0x500); // GL_INVALID_ENUM
                  return;
                }
              }
            } else if (result instanceof Float32Array ||
                       result instanceof Uint32Array ||
                       result instanceof Int32Array ||
                       result instanceof Array) {
              for (var i = 0; i < result.length; ++i) {
                switch (type) {
                  case 0: HEAP32[(((p)+(i*4))>>2)]=result[i]; break;
                  case 2: HEAPF32[(((p)+(i*4))>>2)]=result[i]; break;
                  case 4: HEAP8[(((p)+(i))>>0)]=result[i] ? 1 : 0; break;
                }
              }
              return;
            } else {
              try {
                ret = result.name | 0;
              } catch(e) {
                GL.recordError(0x500); // GL_INVALID_ENUM
                err('GL_INVALID_ENUM in glGet' + type + 'v: Unknown object returned from WebGL getParameter(' + name_ + ')! (error: ' + e + ')');
                return;
              }
            }
            break;
          default:
            GL.recordError(0x500); // GL_INVALID_ENUM
            err('GL_INVALID_ENUM in glGet' + type + 'v: Native code calling glGet' + type + 'v(' + name_ + ') and it returns ' + result + ' of type ' + typeof(result) + '!');
            return;
        }
      }
  
      switch (type) {
        case 1: writeI53ToI64(p, ret); break;
        case 0: HEAP32[((p)>>2)]=ret; break;
        case 2:   HEAPF32[((p)>>2)]=ret; break;
        case 4: HEAP8[((p)>>0)]=ret ? 1 : 0; break;
      }
    }function _glGetBooleanv(name_, p) {
      emscriptenWebGLGet(name_, p, 4);
    }
  
  function _glGetIntegerv(name_, p) {
      emscriptenWebGLGet(name_, p, 0);
    }
  
  
  function stringToNewUTF8(jsString) {
      var length = lengthBytesUTF8(jsString)+1;
      var cString = _malloc(length);
      stringToUTF8(jsString, cString, length);
      return cString;
    }function _glGetString(name_) {
      if (GL.stringCache[name_]) return GL.stringCache[name_];
      var ret;
      switch(name_) {
        case 0x1F03 /* GL_EXTENSIONS */:
          var exts = GLctx.getSupportedExtensions() || []; // .getSupportedExtensions() can return null if context is lost, so coerce to empty array.
          exts = exts.concat(exts.map(function(e) { return "GL_" + e; }));
          ret = stringToNewUTF8(exts.join(' '));
          break;
        case 0x1F00 /* GL_VENDOR */:
        case 0x1F01 /* GL_RENDERER */:
        case 0x9245 /* UNMASKED_VENDOR_WEBGL */:
        case 0x9246 /* UNMASKED_RENDERER_WEBGL */:
          var s = GLctx.getParameter(name_);
          if (!s) {
            GL.recordError(0x500/*GL_INVALID_ENUM*/);
          }
          ret = stringToNewUTF8(s);
          break;
  
        case 0x1F02 /* GL_VERSION */:
          var glVersion = GLctx.getParameter(0x1F02 /*GL_VERSION*/);
          // return GLES version string corresponding to the version of the WebGL context
          {
            glVersion = 'OpenGL ES 2.0 (' + glVersion + ')';
          }
          ret = stringToNewUTF8(glVersion);
          break;
        case 0x8B8C /* GL_SHADING_LANGUAGE_VERSION */:
          var glslVersion = GLctx.getParameter(0x8B8C /*GL_SHADING_LANGUAGE_VERSION*/);
          // extract the version number 'N.M' from the string 'WebGL GLSL ES N.M ...'
          var ver_re = /^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/;
          var ver_num = glslVersion.match(ver_re);
          if (ver_num !== null) {
            if (ver_num[1].length == 3) ver_num[1] = ver_num[1] + '0'; // ensure minor version has 2 digits
            glslVersion = 'OpenGL ES GLSL ES ' + ver_num[1] + ' (' + glslVersion + ')';
          }
          ret = stringToNewUTF8(glslVersion);
          break;
        default:
          GL.recordError(0x500/*GL_INVALID_ENUM*/);
          return 0;
      }
      GL.stringCache[name_] = ret;
      return ret;
    }
  
  function _glCreateShader(shaderType) {
      var id = GL.getNewId(GL.shaders);
      GL.shaders[id] = GLctx.createShader(shaderType);
      return id;
    }
  
  function _glShaderSource(shader, count, string, length) {
      var source = GL.getSource(shader, count, string, length);
  
  
      GLctx.shaderSource(GL.shaders[shader], source);
    }
  
  function _glCompileShader(shader) {
      GLctx.compileShader(GL.shaders[shader]);
    }
  
  function _glAttachShader(program, shader) {
      GLctx.attachShader(GL.programs[program],
                              GL.shaders[shader]);
    }
  
  function _glDetachShader(program, shader) {
      GLctx.detachShader(GL.programs[program],
                              GL.shaders[shader]);
    }
  
  function _glUseProgram(program) {
      GLctx.useProgram(GL.programs[program]);
    }
  
  function _glDeleteProgram(id) {
      if (!id) return;
      var program = GL.programs[id];
      if (!program) { // glDeleteProgram actually signals an error when deleting a nonexisting object, unlike some other GL delete functions.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
      GLctx.deleteProgram(program);
      program.name = 0;
      GL.programs[id] = null;
      GL.programInfos[id] = null;
    }
  
  function _glBindAttribLocation(program, index, name) {
      GLctx.bindAttribLocation(GL.programs[program], index, UTF8ToString(name));
    }
  
  function _glLinkProgram(program) {
      GLctx.linkProgram(GL.programs[program]);
      GL.populateUniformTable(program);
    }
  
  function _glBindBuffer(target, buffer) {
      if (target == 0x8892 /*GL_ARRAY_BUFFER*/) {
        GLctx.currentArrayBufferBinding = buffer;
        GLImmediate.lastArrayBuffer = buffer;
      } else if (target == 0x8893 /*GL_ELEMENT_ARRAY_BUFFER*/) {
        GLctx.currentElementArrayBufferBinding = buffer;
      }
  
      GLctx.bindBuffer(target, GL.buffers[buffer]);
    }
  
  function _glGetFloatv(name_, p) {
      emscriptenWebGLGet(name_, p, 2);
    }
  
  function _glHint(x0, x1) { GLctx['hint'](x0, x1) }
  
  function _glEnableVertexAttribArray(index) {
      GLctx.enableVertexAttribArray(index);
    }
  
  function _glDisableVertexAttribArray(index) {
      GLctx.disableVertexAttribArray(index);
    }
  
  function _glVertexAttribPointer(index, size, type, normalized, stride, ptr) {
      GLctx.vertexAttribPointer(index, size, type, !!normalized, stride, ptr);
    }
  
  function _glActiveTexture(x0) { GLctx['activeTexture'](x0) }var GLEmulation={fogStart:0,fogEnd:1,fogDensity:1,fogColor:null,fogMode:2048,fogEnabled:false,pointSize:1,vaos:[],currentVao:null,enabledVertexAttribArrays:{},hasRunInit:false,findToken:function(source, token) {
        function isIdentChar(ch) {
          if (ch >= 48 && ch <= 57) // 0-9
            return true;
          if (ch >= 65 && ch <= 90) // A-Z
            return true;
          if (ch >= 97 && ch <= 122) // a-z
            return true;
          return false;
        }
        var i = -1;
        do {
          i = source.indexOf(token, i + 1);
          if (i < 0) {
            break;
          }
          if (i > 0 && isIdentChar(source[i - 1])) {
            continue;
          }
          i += token.length;
          if (i < source.length - 1 && isIdentChar(source[i + 1])) {
            continue;
          }
          return true;
        } while (true);
        return false;
      },init:function() {
        // Do not activate immediate/emulation code (e.g. replace glDrawElements) when in FULL_ES2 mode.
        // We do not need full emulation, we instead emulate client-side arrays etc. in FULL_ES2 code in
        // a straightforward manner, and avoid not having a bound buffer be ambiguous between es2 emulation
        // code and legacy gl emulation code.
  
        if (GLEmulation.hasRunInit) {
          return;
        }
        GLEmulation.hasRunInit = true;
  
        GLEmulation.fogColor = new Float32Array(4);
  
        // Add some emulation workarounds
        err('WARNING: using emscripten GL emulation. This is a collection of limited workarounds, do not expect it to work.');
        err('WARNING: using emscripten GL emulation unsafe opts. If weirdness happens, try -s GL_UNSAFE_OPTS=0');
  
        // XXX some of the capabilities we don't support may lead to incorrect rendering, if we do not emulate them in shaders
        var validCapabilities = {
          0xB44: 1, // GL_CULL_FACE
          0xBE2: 1, // GL_BLEND
          0xBD0: 1, // GL_DITHER,
          0xB90: 1, // GL_STENCIL_TEST
          0xB71: 1, // GL_DEPTH_TEST
          0xC11: 1, // GL_SCISSOR_TEST
          0x8037: 1, // GL_POLYGON_OFFSET_FILL
          0x809E: 1, // GL_SAMPLE_ALPHA_TO_COVERAGE
          0x80A0: 1  // GL_SAMPLE_COVERAGE
        };
  
  
  
        var glEnable = _glEnable;
        _glEnable = _emscripten_glEnable = function _glEnable(cap) {
          // Clean up the renderer on any change to the rendering state. The optimization of
          // skipping renderer setup is aimed at the case of multiple glDraw* right after each other
          if (GLImmediate.lastRenderer) GLImmediate.lastRenderer.cleanup();
          if (cap == 0xB60 /* GL_FOG */) {
            if (GLEmulation.fogEnabled != true) {
              GLImmediate.currentRenderer = null; // Fog parameter is part of the FFP shader state, we must re-lookup the renderer to use.
              GLEmulation.fogEnabled = true;
            }
            return;
          } else if (cap == 0xDE1 /* GL_TEXTURE_2D */) {
            // XXX not according to spec, and not in desktop GL, but works in some GLES1.x apparently, so support
            // it by forwarding to glEnableClientState
            /* Actually, let's not, for now. (This sounds exceedingly broken)
             * This is in gl_ps_workaround2.c.
            _glEnableClientState(cap);
            */
            return;
          } else if (!(cap in validCapabilities)) {
            return;
          }
          glEnable(cap);
        };
        
  
        var glDisable = _glDisable;
        _glDisable = _emscripten_glDisable = function _glDisable(cap) {
          if (GLImmediate.lastRenderer) GLImmediate.lastRenderer.cleanup();
          if (cap == 0xB60 /* GL_FOG */) {
            if (GLEmulation.fogEnabled != false) {
              GLImmediate.currentRenderer = null; // Fog parameter is part of the FFP shader state, we must re-lookup the renderer to use.
              GLEmulation.fogEnabled = false;
            }
            return;
          } else if (cap == 0xDE1 /* GL_TEXTURE_2D */) {
            // XXX not according to spec, and not in desktop GL, but works in some GLES1.x apparently, so support
            // it by forwarding to glDisableClientState
            /* Actually, let's not, for now. (This sounds exceedingly broken)
             * This is in gl_ps_workaround2.c.
            _glDisableClientState(cap);
            */
            return;
          } else if (!(cap in validCapabilities)) {
            return;
          }
          glDisable(cap);
        };
        
  
        _glIsEnabled = _emscripten_glIsEnabled = function _glIsEnabled(cap) {
          if (cap == 0xB60 /* GL_FOG */) {
            return GLEmulation.fogEnabled ? 1 : 0;
          } else if (!(cap in validCapabilities)) {
            return 0;
          }
          return GLctx.isEnabled(cap);
        };
        
  
        var glGetBooleanv = _glGetBooleanv;
        _glGetBooleanv = _emscripten_glGetBooleanv = function _glGetBooleanv(pname, p) {
          var attrib = GLEmulation.getAttributeFromCapability(pname);
          if (attrib !== null) {
            var result = GLImmediate.enabledClientAttributes[attrib];
            HEAP8[((p)>>0)]=result === true ? 1 : 0;
            return;
          }
          glGetBooleanv(pname, p);
        };
        
  
        var glGetIntegerv = _glGetIntegerv;
        _glGetIntegerv = _emscripten_glGetIntegerv = function _glGetIntegerv(pname, params) {
          switch (pname) {
            case 0x84E2: pname = GLctx.MAX_TEXTURE_IMAGE_UNITS /* fake it */; break; // GL_MAX_TEXTURE_UNITS
            case 0x8B4A: { // GL_MAX_VERTEX_UNIFORM_COMPONENTS_ARB
              var result = GLctx.getParameter(GLctx.MAX_VERTEX_UNIFORM_VECTORS);
              HEAP32[((params)>>2)]=result*4; // GLES gives num of 4-element vectors, GL wants individual components, so multiply
              return;
            }
            case 0x8B49: { // GL_MAX_FRAGMENT_UNIFORM_COMPONENTS_ARB
              var result = GLctx.getParameter(GLctx.MAX_FRAGMENT_UNIFORM_VECTORS);
              HEAP32[((params)>>2)]=result*4; // GLES gives num of 4-element vectors, GL wants individual components, so multiply
              return;
            }
            case 0x8B4B: { // GL_MAX_VARYING_FLOATS_ARB
              var result = GLctx.getParameter(GLctx.MAX_VARYING_VECTORS);
              HEAP32[((params)>>2)]=result*4; // GLES gives num of 4-element vectors, GL wants individual components, so multiply
              return;
            }
            case 0x8871: pname = GLctx.MAX_COMBINED_TEXTURE_IMAGE_UNITS /* close enough */; break; // GL_MAX_TEXTURE_COORDS
            case 0x807A: { // GL_VERTEX_ARRAY_SIZE
              var attribute = GLImmediate.clientAttributes[GLImmediate.VERTEX];
              HEAP32[((params)>>2)]=attribute ? attribute.size : 0;
              return;
            }
            case 0x807B: { // GL_VERTEX_ARRAY_TYPE
              var attribute = GLImmediate.clientAttributes[GLImmediate.VERTEX];
              HEAP32[((params)>>2)]=attribute ? attribute.type : 0;
              return;
            }
            case 0x807C: { // GL_VERTEX_ARRAY_STRIDE
              var attribute = GLImmediate.clientAttributes[GLImmediate.VERTEX];
              HEAP32[((params)>>2)]=attribute ? attribute.stride : 0;
              return;
            }
            case 0x8081: { // GL_COLOR_ARRAY_SIZE
              var attribute = GLImmediate.clientAttributes[GLImmediate.COLOR];
              HEAP32[((params)>>2)]=attribute ? attribute.size : 0;
              return;
            }
            case 0x8082: { // GL_COLOR_ARRAY_TYPE
              var attribute = GLImmediate.clientAttributes[GLImmediate.COLOR];
              HEAP32[((params)>>2)]=attribute ? attribute.type : 0;
              return;
            }
            case 0x8083: { // GL_COLOR_ARRAY_STRIDE
              var attribute = GLImmediate.clientAttributes[GLImmediate.COLOR];
              HEAP32[((params)>>2)]=attribute ? attribute.stride : 0;
              return;
            }
            case 0x8088: { // GL_TEXTURE_COORD_ARRAY_SIZE
              var attribute = GLImmediate.clientAttributes[GLImmediate.TEXTURE0 + GLImmediate.clientActiveTexture];
              HEAP32[((params)>>2)]=attribute ? attribute.size : 0;
              return;
            }
            case 0x8089: { // GL_TEXTURE_COORD_ARRAY_TYPE
              var attribute = GLImmediate.clientAttributes[GLImmediate.TEXTURE0 + GLImmediate.clientActiveTexture];
              HEAP32[((params)>>2)]=attribute ? attribute.type : 0;
              return;
            }
            case 0x808A: { // GL_TEXTURE_COORD_ARRAY_STRIDE
              var attribute = GLImmediate.clientAttributes[GLImmediate.TEXTURE0 + GLImmediate.clientActiveTexture];
              HEAP32[((params)>>2)]=attribute ? attribute.stride : 0;
              return;
            }
          }
          glGetIntegerv(pname, params);
        };
        
  
        var glGetString = _glGetString;
        _glGetString = _emscripten_glGetString = function _glGetString(name_) {
          if (GL.stringCache[name_]) return GL.stringCache[name_];
          switch(name_) {
            case 0x1F03 /* GL_EXTENSIONS */: // Add various extensions that we can support
              var ret = stringToNewUTF8((GLctx.getSupportedExtensions() || []).join(' ') +
                     ' GL_EXT_texture_env_combine GL_ARB_texture_env_crossbar GL_ATI_texture_env_combine3 GL_NV_texture_env_combine4 GL_EXT_texture_env_dot3 GL_ARB_multitexture GL_ARB_vertex_buffer_object GL_EXT_framebuffer_object GL_ARB_vertex_program GL_ARB_fragment_program GL_ARB_shading_language_100 GL_ARB_shader_objects GL_ARB_vertex_shader GL_ARB_fragment_shader GL_ARB_texture_cube_map GL_EXT_draw_range_elements' +
                     (GL.currentContext.compressionExt ? ' GL_ARB_texture_compression GL_EXT_texture_compression_s3tc' : '') +
                     (GL.currentContext.anisotropicExt ? ' GL_EXT_texture_filter_anisotropic' : '')
              );
              GL.stringCache[name_] = ret;
              return ret;
          }
          return glGetString(name_);
        };
        
  
        // Do some automatic rewriting to work around GLSL differences. Note that this must be done in
        // tandem with the rest of the program, by itself it cannot suffice.
        // Note that we need to remember shader types for this rewriting, saving sources makes it easier to debug.
        GL.shaderInfos = {};
        var glCreateShader = _glCreateShader;
        _glCreateShader = _emscripten_glCreateShader = function _glCreateShader(shaderType) {
          var id = glCreateShader(shaderType);
          GL.shaderInfos[id] = {
            type: shaderType,
            ftransform: false
          };
          return id;
        };
        
  
        function ensurePrecision(source) {
          if (!/precision +(low|medium|high)p +float *;/.test(source)) {
            source = '#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n' + source;
          }
          return source;
        }
  
        var glShaderSource = _glShaderSource;
        _glShaderSource = _emscripten_glShaderSource = function _glShaderSource(shader, count, string, length) {
          var source = GL.getSource(shader, count, string, length);
          // XXX We add attributes and uniforms to shaders. The program can ask for the # of them, and see the
          // ones we generated, potentially confusing it? Perhaps we should hide them.
          if (GL.shaderInfos[shader].type == GLctx.VERTEX_SHADER) {
            // Replace ftransform() with explicit project/modelview transforms, and add position and matrix info.
            var has_pm = source.search(/u_projection/) >= 0;
            var has_mm = source.search(/u_modelView/) >= 0;
            var has_pv = source.search(/a_position/) >= 0;
            var need_pm = 0, need_mm = 0, need_pv = 0;
            var old = source;
            source = source.replace(/ftransform\(\)/g, '(u_projection * u_modelView * a_position)');
            if (old != source) need_pm = need_mm = need_pv = 1;
            old = source;
            source = source.replace(/gl_ProjectionMatrix/g, 'u_projection');
            if (old != source) need_pm = 1;
            old = source;
            source = source.replace(/gl_ModelViewMatrixTranspose\[2\]/g, 'vec4(u_modelView[0][2], u_modelView[1][2], u_modelView[2][2], u_modelView[3][2])'); // XXX extremely inefficient
            if (old != source) need_mm = 1;
            old = source;
            source = source.replace(/gl_ModelViewMatrix/g, 'u_modelView');
            if (old != source) need_mm = 1;
            old = source;
            source = source.replace(/gl_Vertex/g, 'a_position');
            if (old != source) need_pv = 1;
            old = source;
            source = source.replace(/gl_ModelViewProjectionMatrix/g, '(u_projection * u_modelView)');
            if (old != source) need_pm = need_mm = 1;
            if (need_pv && !has_pv) source = 'attribute vec4 a_position; \n' + source;
            if (need_mm && !has_mm) source = 'uniform mat4 u_modelView; \n' + source;
            if (need_pm && !has_pm) source = 'uniform mat4 u_projection; \n' + source;
            GL.shaderInfos[shader].ftransform = need_pm || need_mm || need_pv; // we will need to provide the fixed function stuff as attributes and uniforms
            for (var i = 0; i < GLImmediate.MAX_TEXTURES; i++) {
              // XXX To handle both regular texture mapping and cube mapping, we use vec4 for tex coordinates.
              old = source;
              var need_vtc = source.search('v_texCoord' + i) == -1;
              source = source.replace(new RegExp('gl_TexCoord\\[' + i + '\\]', 'g'), 'v_texCoord' + i)
                             .replace(new RegExp('gl_MultiTexCoord' + i, 'g'), 'a_texCoord' + i);
              if (source != old) {
                source = 'attribute vec4 a_texCoord' + i + '; \n' + source;
                if (need_vtc) {
                  source = 'varying vec4 v_texCoord' + i + ';   \n' + source;
                }
              }
  
              old = source;
              source = source.replace(new RegExp('gl_TextureMatrix\\[' + i + '\\]', 'g'), 'u_textureMatrix' + i);
              if (source != old) {
                source = 'uniform mat4 u_textureMatrix' + i + '; \n' + source;
              }
            }
            if (source.indexOf('gl_FrontColor') >= 0) {
              source = 'varying vec4 v_color; \n' +
                       source.replace(/gl_FrontColor/g, 'v_color');
            }
            if (source.indexOf('gl_Color') >= 0) {
              source = 'attribute vec4 a_color; \n' +
                       source.replace(/gl_Color/g, 'a_color');
            }
            if (source.indexOf('gl_Normal') >= 0) {
              source = 'attribute vec3 a_normal; \n' +
                       source.replace(/gl_Normal/g, 'a_normal');
            }
            // fog
            if (source.indexOf('gl_FogFragCoord') >= 0) {
              source = 'varying float v_fogFragCoord;   \n' +
                       source.replace(/gl_FogFragCoord/g, 'v_fogFragCoord');
            }
          } else { // Fragment shader
            for (i = 0; i < GLImmediate.MAX_TEXTURES; i++) {
              old = source;
              source = source.replace(new RegExp('gl_TexCoord\\[' + i + '\\]', 'g'), 'v_texCoord' + i);
              if (source != old) {
                source = 'varying vec4 v_texCoord' + i + ';   \n' + source;
              }
            }
            if (source.indexOf('gl_Color') >= 0) {
              source = 'varying vec4 v_color; \n' + source.replace(/gl_Color/g, 'v_color');
            }
            if (source.indexOf('gl_Fog.color') >= 0) {
              source = 'uniform vec4 u_fogColor;   \n' +
                       source.replace(/gl_Fog.color/g, 'u_fogColor');
            }
            if (source.indexOf('gl_Fog.end') >= 0) {
              source = 'uniform float u_fogEnd;   \n' +
                       source.replace(/gl_Fog.end/g, 'u_fogEnd');
            }
            if (source.indexOf('gl_Fog.scale') >= 0) {
              source = 'uniform float u_fogScale;   \n' +
                       source.replace(/gl_Fog.scale/g, 'u_fogScale');
            }
            if (source.indexOf('gl_Fog.density') >= 0) {
              source = 'uniform float u_fogDensity;   \n' +
                       source.replace(/gl_Fog.density/g, 'u_fogDensity');
            }
            if (source.indexOf('gl_FogFragCoord') >= 0) {
              source = 'varying float v_fogFragCoord;   \n' +
                       source.replace(/gl_FogFragCoord/g, 'v_fogFragCoord');
            }
            source = ensurePrecision(source);
          }
          GLctx.shaderSource(GL.shaders[shader], source);
        };
        
  
        var glCompileShader = _glCompileShader;
        _glCompileShader = _emscripten_glCompileShader = function _glCompileShader(shader) {
          GLctx.compileShader(GL.shaders[shader]);
        };
        
  
        GL.programShaders = {};
        var glAttachShader = _glAttachShader;
        _glAttachShader = _emscripten_glAttachShader = function _glAttachShader(program, shader) {
          if (!GL.programShaders[program]) GL.programShaders[program] = [];
          GL.programShaders[program].push(shader);
          glAttachShader(program, shader);
        };
        
  
        var glDetachShader = _glDetachShader;
        _glDetachShader = _emscripten_glDetachShader = function _glDetachShader(program, shader) {
          var programShader = GL.programShaders[program];
          if (!programShader) {
            err('WARNING: _glDetachShader received invalid program: ' + program);
            return;
          }
          var index = programShader.indexOf(shader);
          programShader.splice(index, 1);
          glDetachShader(program, shader);
        };
        
  
        var glUseProgram = _glUseProgram;
        _glUseProgram = _emscripten_glUseProgram = function _glUseProgram(program) {
          if (GL.currProgram != program) {
            GLImmediate.currentRenderer = null; // This changes the FFP emulation shader program, need to recompute that.
            GL.currProgram = program;
            GLImmediate.fixedFunctionProgram = 0;
            glUseProgram(program);
          }
        }
        
  
        var glDeleteProgram = _glDeleteProgram;
        _glDeleteProgram = _emscripten_glDeleteProgram = function _glDeleteProgram(program) {
          glDeleteProgram(program);
          if (program == GL.currProgram) {
            GLImmediate.currentRenderer = null; // This changes the FFP emulation shader program, need to recompute that.
            GL.currProgram = 0;
          }
        };
        
  
        // If attribute 0 was not bound, bind it to 0 for WebGL performance reasons. Track if 0 is free for that.
        var zeroUsedPrograms = {};
        var glBindAttribLocation = _glBindAttribLocation;
        _glBindAttribLocation = _emscripten_glBindAttribLocation = function _glBindAttribLocation(program, index, name) {
          if (index == 0) zeroUsedPrograms[program] = true;
          glBindAttribLocation(program, index, name);
        };
        
  
        var glLinkProgram = _glLinkProgram;
        _glLinkProgram = _emscripten_glLinkProgram = function _glLinkProgram(program) {
          if (!(program in zeroUsedPrograms)) {
            GLctx.bindAttribLocation(GL.programs[program], 0, 'a_position');
          }
          glLinkProgram(program);
        };
        
  
        var glBindBuffer = _glBindBuffer;
        _glBindBuffer = _emscripten_glBindBuffer = function _glBindBuffer(target, buffer) {
          glBindBuffer(target, buffer);
          if (target == GLctx.ARRAY_BUFFER) {
            if (GLEmulation.currentVao) {
              assert(GLEmulation.currentVao.arrayBuffer == buffer || GLEmulation.currentVao.arrayBuffer == 0 || buffer == 0, 'TODO: support for multiple array buffers in vao');
              GLEmulation.currentVao.arrayBuffer = buffer;
            }
          } else if (target == GLctx.ELEMENT_ARRAY_BUFFER) {
            if (GLEmulation.currentVao) GLEmulation.currentVao.elementArrayBuffer = buffer;
          }
        };
        
  
        var glGetFloatv = _glGetFloatv;
        _glGetFloatv = _emscripten_glGetFloatv = function _glGetFloatv(pname, params) {
          if (pname == 0xBA6) { // GL_MODELVIEW_MATRIX
            HEAPF32.set(GLImmediate.matrix[0/*m*/], params >> 2);
          } else if (pname == 0xBA7) { // GL_PROJECTION_MATRIX
            HEAPF32.set(GLImmediate.matrix[1/*p*/], params >> 2);
          } else if (pname == 0xBA8) { // GL_TEXTURE_MATRIX
            HEAPF32.set(GLImmediate.matrix[2/*t*/ + GLImmediate.clientActiveTexture], params >> 2);
          } else if (pname == 0xB66) { // GL_FOG_COLOR
            HEAPF32.set(GLEmulation.fogColor, params >> 2);
          } else if (pname == 0xB63) { // GL_FOG_START
            HEAPF32[((params)>>2)]=GLEmulation.fogStart;
          } else if (pname == 0xB64) { // GL_FOG_END
            HEAPF32[((params)>>2)]=GLEmulation.fogEnd;
          } else if (pname == 0xB62) { // GL_FOG_DENSITY
            HEAPF32[((params)>>2)]=GLEmulation.fogDensity;
          } else if (pname == 0xB65) { // GL_FOG_MODE
            HEAPF32[((params)>>2)]=GLEmulation.fogMode;
          } else {
            glGetFloatv(pname, params);
          }
        };
        
  
        var glHint = _glHint;
        _glHint = _emscripten_glHint = function _glHint(target, mode) {
          if (target == 0x84EF) { // GL_TEXTURE_COMPRESSION_HINT
            return;
          }
          glHint(target, mode);
        };
        
  
        var glEnableVertexAttribArray = _glEnableVertexAttribArray;
        _glEnableVertexAttribArray = _emscripten_glEnableVertexAttribArray = function _glEnableVertexAttribArray(index) {
          glEnableVertexAttribArray(index);
          GLEmulation.enabledVertexAttribArrays[index] = 1;
          if (GLEmulation.currentVao) GLEmulation.currentVao.enabledVertexAttribArrays[index] = 1;
        };
        
  
        var glDisableVertexAttribArray = _glDisableVertexAttribArray;
        _glDisableVertexAttribArray = _emscripten_glDisableVertexAttribArray = function _glDisableVertexAttribArray(index) {
          glDisableVertexAttribArray(index);
          delete GLEmulation.enabledVertexAttribArrays[index];
          if (GLEmulation.currentVao) delete GLEmulation.currentVao.enabledVertexAttribArrays[index];
        };
        
  
        var glVertexAttribPointer = _glVertexAttribPointer;
        _glVertexAttribPointer = _emscripten_glVertexAttribPointer = function _glVertexAttribPointer(index, size, type, normalized, stride, pointer) {
          glVertexAttribPointer(index, size, type, normalized, stride, pointer);
          if (GLEmulation.currentVao) { // TODO: avoid object creation here? likely not hot though
            GLEmulation.currentVao.vertexAttribPointers[index] = [index, size, type, normalized, stride, pointer];
          }
        };
        
      },getAttributeFromCapability:function(cap) {
        var attrib = null;
        switch (cap) {
          case 0xDE1: // GL_TEXTURE_2D - XXX not according to spec, and not in desktop GL, but works in some GLES1.x apparently, so support it
            abort("GL_TEXTURE_2D is not a spec-defined capability for gl{Enable,Disable}ClientState.");
            // Fall through:
          case 0x8078: // GL_TEXTURE_COORD_ARRAY
            attrib = GLImmediate.TEXTURE0 + GLImmediate.clientActiveTexture; break;
          case 0x8074: // GL_VERTEX_ARRAY
            attrib = GLImmediate.VERTEX; break;
          case 0x8075: // GL_NORMAL_ARRAY
            attrib = GLImmediate.NORMAL; break;
          case 0x8076: // GL_COLOR_ARRAY
            attrib = GLImmediate.COLOR; break;
        }
        return attrib;
      }};var GLImmediate={MapTreeLib:null,spawnMapTreeLib:function() {
        /* A naive implementation of a map backed by an array, and accessed by
         * naive iteration along the array. (hashmap with only one bucket)
         */
        function CNaiveListMap() {
          var list = [];
  
          this.insert = function CNaiveListMap_insert(key, val) {
            if (this.contains(key|0)) return false;
            list.push([key, val]);
            return true;
          };
  
          var __contains_i;
          this.contains = function CNaiveListMap_contains(key) {
            for (__contains_i = 0; __contains_i < list.length; ++__contains_i) {
              if (list[__contains_i][0] === key) return true;
            }
            return false;
          };
  
          var __get_i;
          this.get = function CNaiveListMap_get(key) {
            for (__get_i = 0; __get_i < list.length; ++__get_i) {
              if (list[__get_i][0] === key) return list[__get_i][1];
            }
            return undefined;
          };
        };
  
        /* A tree of map nodes.
          Uses `KeyView`s to allow descending the tree without garbage.
          Example: {
            // Create our map object.
            var map = new ObjTreeMap();
  
            // Grab the static keyView for the map.
            var keyView = map.GetStaticKeyView();
  
            // Let's make a map for:
            // root: <undefined>
            //   1: <undefined>
            //     2: <undefined>
            //       5: "Three, sir!"
            //       3: "Three!"
  
            // Note how we can chain together `Reset` and `Next` to
            // easily descend based on multiple key fragments.
            keyView.Reset().Next(1).Next(2).Next(5).Set("Three, sir!");
            keyView.Reset().Next(1).Next(2).Next(3).Set("Three!");
          }
        */
        function CMapTree() {
          function CNLNode() {
            var map = new CNaiveListMap();
  
            this.child = function CNLNode_child(keyFrag) {
              if (!map.contains(keyFrag|0)) {
                map.insert(keyFrag|0, new CNLNode());
              }
              return map.get(keyFrag|0);
            };
  
            this.value = undefined;
            this.get = function CNLNode_get() {
              return this.value;
            };
  
            this.set = function CNLNode_set(val) {
              this.value = val;
            };
          }
  
          function CKeyView(root) {
            var cur;
  
            this.reset = function CKeyView_reset() {
              cur = root;
              return this;
            };
            this.reset();
  
            this.next = function CKeyView_next(keyFrag) {
              cur = cur.child(keyFrag);
              return this;
            };
  
            this.get = function CKeyView_get() {
              return cur.get();
            };
  
            this.set = function CKeyView_set(val) {
              cur.set(val);
            };
          };
  
          var root;
          var staticKeyView;
  
          this.createKeyView = function CNLNode_createKeyView() {
            return new CKeyView(root);
          }
  
          this.clear = function CNLNode_clear() {
            root = new CNLNode();
            staticKeyView = this.createKeyView();
          };
          this.clear();
  
          this.getStaticKeyView = function CNLNode_getStaticKeyView() {
            staticKeyView.reset();
            return staticKeyView;
          };
        };
  
        // Exports:
        return {
          create: function() {
            return new CMapTree();
          },
        };
      },TexEnvJIT:null,spawnTexEnvJIT:function() {
        // GL defs:
        var GL_TEXTURE0 = 0x84C0;
        var GL_TEXTURE_1D = 0xDE0;
        var GL_TEXTURE_2D = 0xDE1;
        var GL_TEXTURE_3D = 0x806f;
        var GL_TEXTURE_CUBE_MAP = 0x8513;
        var GL_TEXTURE_ENV = 0x2300;
        var GL_TEXTURE_ENV_MODE = 0x2200;
        var GL_TEXTURE_ENV_COLOR = 0x2201;
        var GL_TEXTURE_CUBE_MAP_POSITIVE_X = 0x8515;
        var GL_TEXTURE_CUBE_MAP_NEGATIVE_X = 0x8516;
        var GL_TEXTURE_CUBE_MAP_POSITIVE_Y = 0x8517;
        var GL_TEXTURE_CUBE_MAP_NEGATIVE_Y = 0x8518;
        var GL_TEXTURE_CUBE_MAP_POSITIVE_Z = 0x8519;
        var GL_TEXTURE_CUBE_MAP_NEGATIVE_Z = 0x851A;
  
        var GL_SRC0_RGB = 0x8580;
        var GL_SRC1_RGB = 0x8581;
        var GL_SRC2_RGB = 0x8582;
  
        var GL_SRC0_ALPHA = 0x8588;
        var GL_SRC1_ALPHA = 0x8589;
        var GL_SRC2_ALPHA = 0x858A;
  
        var GL_OPERAND0_RGB = 0x8590;
        var GL_OPERAND1_RGB = 0x8591;
        var GL_OPERAND2_RGB = 0x8592;
  
        var GL_OPERAND0_ALPHA = 0x8598;
        var GL_OPERAND1_ALPHA = 0x8599;
        var GL_OPERAND2_ALPHA = 0x859A;
  
        var GL_COMBINE_RGB = 0x8571;
        var GL_COMBINE_ALPHA = 0x8572;
  
        var GL_RGB_SCALE = 0x8573;
        var GL_ALPHA_SCALE = 0xD1C;
  
        // env.mode
        var GL_ADD      = 0x104;
        var GL_BLEND    = 0xBE2;
        var GL_REPLACE  = 0x1E01;
        var GL_MODULATE = 0x2100;
        var GL_DECAL    = 0x2101;
        var GL_COMBINE  = 0x8570;
  
        // env.color/alphaCombiner
        //var GL_ADD         = 0x104;
        //var GL_REPLACE     = 0x1E01;
        //var GL_MODULATE    = 0x2100;
        var GL_SUBTRACT    = 0x84E7;
        var GL_INTERPOLATE = 0x8575;
  
        // env.color/alphaSrc
        var GL_TEXTURE       = 0x1702;
        var GL_CONSTANT      = 0x8576;
        var GL_PRIMARY_COLOR = 0x8577;
        var GL_PREVIOUS      = 0x8578;
  
        // env.color/alphaOp
        var GL_SRC_COLOR           = 0x300;
        var GL_ONE_MINUS_SRC_COLOR = 0x301;
        var GL_SRC_ALPHA           = 0x302;
        var GL_ONE_MINUS_SRC_ALPHA = 0x303;
  
        var GL_RGB  = 0x1907;
        var GL_RGBA = 0x1908;
  
        // Our defs:
        var TEXENVJIT_NAMESPACE_PREFIX = "tej_";
        // Not actually constant, as they can be changed between JIT passes:
        var TEX_UNIT_UNIFORM_PREFIX = "uTexUnit";
        var TEX_COORD_VARYING_PREFIX = "vTexCoord";
        var PRIM_COLOR_VARYING = "vPrimColor";
        var TEX_MATRIX_UNIFORM_PREFIX = "uTexMatrix";
  
        // Static vars:
        var s_texUnits = null; //[];
        var s_activeTexture = 0;
  
        var s_requiredTexUnitsForPass = [];
  
        // Static funcs:
        function abort(info) {
          assert(false, "[TexEnvJIT] ABORT: " + info);
        }
  
        function abort_noSupport(info) {
          abort("No support: " + info);
        }
  
        function abort_sanity(info) {
          abort("Sanity failure: " + info);
        }
  
        function genTexUnitSampleExpr(texUnitID) {
          var texUnit = s_texUnits[texUnitID];
          var texType = texUnit.getTexType();
  
          var func = null;
          switch (texType) {
            case GL_TEXTURE_1D:
              func = "texture2D";
              break;
            case GL_TEXTURE_2D:
              func = "texture2D";
              break;
            case GL_TEXTURE_3D:
              return abort_noSupport("No support for 3D textures.");
            case GL_TEXTURE_CUBE_MAP:
              func = "textureCube";
              break;
            default:
              return abort_sanity("Unknown texType: 0x" + texType.toString(16));
          }
  
          var texCoordExpr = TEX_COORD_VARYING_PREFIX + texUnitID;
          if (TEX_MATRIX_UNIFORM_PREFIX != null) {
            texCoordExpr = "(" + TEX_MATRIX_UNIFORM_PREFIX + texUnitID + " * " + texCoordExpr + ")";
          }
          return func + "(" + TEX_UNIT_UNIFORM_PREFIX + texUnitID + ", " + texCoordExpr + ".xy)";
        }
  
        function getTypeFromCombineOp(op) {
          switch (op) {
            case GL_SRC_COLOR:
            case GL_ONE_MINUS_SRC_COLOR:
              return "vec3";
            case GL_SRC_ALPHA:
            case GL_ONE_MINUS_SRC_ALPHA:
              return "float";
          }
  
          return abort_noSupport("Unsupported combiner op: 0x" + op.toString(16));
        }
  
        function getCurTexUnit() {
          return s_texUnits[s_activeTexture];
        }
  
        function genCombinerSourceExpr(texUnitID, constantExpr, previousVar,
                                       src, op)
        {
          var srcExpr = null;
          switch (src) {
            case GL_TEXTURE:
              srcExpr = genTexUnitSampleExpr(texUnitID);
              break;
            case GL_CONSTANT:
              srcExpr = constantExpr;
              break;
            case GL_PRIMARY_COLOR:
              srcExpr = PRIM_COLOR_VARYING;
              break;
            case GL_PREVIOUS:
              srcExpr = previousVar;
              break;
            default:
                return abort_noSupport("Unsupported combiner src: 0x" + src.toString(16));
          }
  
          var expr = null;
          switch (op) {
            case GL_SRC_COLOR:
              expr = srcExpr + ".rgb";
              break;
            case GL_ONE_MINUS_SRC_COLOR:
              expr = "(vec3(1.0) - " + srcExpr + ".rgb)";
              break;
            case GL_SRC_ALPHA:
              expr = srcExpr + ".a";
              break;
            case GL_ONE_MINUS_SRC_ALPHA:
              expr = "(1.0 - " + srcExpr + ".a)";
              break;
            default:
              return abort_noSupport("Unsupported combiner op: 0x" + op.toString(16));
          }
  
          return expr;
        }
  
        function valToFloatLiteral(val) {
          if (val == Math.round(val)) return val + '.0';
          return val;
        }
  
  
        // Classes:
        function CTexEnv() {
          this.mode = GL_MODULATE;
          this.colorCombiner = GL_MODULATE;
          this.alphaCombiner = GL_MODULATE;
          this.colorScale = 1;
          this.alphaScale = 1;
          this.envColor = [0, 0, 0, 0];
  
          this.colorSrc = [
            GL_TEXTURE,
            GL_PREVIOUS,
            GL_CONSTANT
          ];
          this.alphaSrc = [
            GL_TEXTURE,
            GL_PREVIOUS,
            GL_CONSTANT
          ];
          this.colorOp = [
            GL_SRC_COLOR,
            GL_SRC_COLOR,
            GL_SRC_ALPHA
          ];
          this.alphaOp = [
            GL_SRC_ALPHA,
            GL_SRC_ALPHA,
            GL_SRC_ALPHA
          ];
  
          // Map GLenums to small values to efficiently pack the enums to bits for tighter access.
          this.traverseKey = {
            // mode
            0x1E01 /* GL_REPLACE */: 0,
            0x2100 /* GL_MODULATE */: 1,
            0x104 /* GL_ADD */: 2,
            0xBE2 /* GL_BLEND */: 3,
            0x2101 /* GL_DECAL */: 4,
            0x8570 /* GL_COMBINE */: 5,
  
            // additional color and alpha combiners
            0x84E7 /* GL_SUBTRACT */: 3,
            0x8575 /* GL_INTERPOLATE */: 4,
  
            // color and alpha src
            0x1702 /* GL_TEXTURE */: 0,
            0x8576 /* GL_CONSTANT */: 1,
            0x8577 /* GL_PRIMARY_COLOR */: 2,
            0x8578 /* GL_PREVIOUS */: 3,
  
            // color and alpha op
            0x300 /* GL_SRC_COLOR */: 0,
            0x301 /* GL_ONE_MINUS_SRC_COLOR */: 1,
            0x302 /* GL_SRC_ALPHA */: 2,
            0x303 /* GL_ONE_MINUS_SRC_ALPHA */: 3
          };
  
          // The tuple (key0,key1,key2) uniquely identifies the state of the variables in CTexEnv.
          // -1 on key0 denotes 'the whole cached key is dirty'
          this.key0 = -1;
          this.key1 = 0;
          this.key2 = 0;
  
          this.computeKey0 = function() {
            var k = this.traverseKey;
            var key = k[this.mode] * 1638400; // 6 distinct values.
            key += k[this.colorCombiner] * 327680; // 5 distinct values.
            key += k[this.alphaCombiner] * 65536; // 5 distinct values.
            // The above three fields have 6*5*5=150 distinct values -> 8 bits.
            key += (this.colorScale-1) * 16384; // 10 bits used.
            key += (this.alphaScale-1) * 4096; // 12 bits used.
            key += k[this.colorSrc[0]] * 1024; // 14
            key += k[this.colorSrc[1]] * 256; // 16
            key += k[this.colorSrc[2]] * 64; // 18
            key += k[this.alphaSrc[0]] * 16; // 20
            key += k[this.alphaSrc[1]] * 4; // 22
            key += k[this.alphaSrc[2]]; // 24 bits used total.
            return key;
          }
          this.computeKey1 = function() {
            var k = this.traverseKey;
            key = k[this.colorOp[0]] * 4096;
            key += k[this.colorOp[1]] * 1024;
            key += k[this.colorOp[2]] * 256;
            key += k[this.alphaOp[0]] * 16;
            key += k[this.alphaOp[1]] * 4;
            key += k[this.alphaOp[2]];
            return key;
          }
          // TODO: remove this. The color should not be part of the key!
          this.computeKey2 = function() {
            return this.envColor[0] * 16777216 + this.envColor[1] * 65536 + this.envColor[2] * 256 + 1 + this.envColor[3];
          }
          this.recomputeKey = function() {
            this.key0 = this.computeKey0();
            this.key1 = this.computeKey1();
            this.key2 = this.computeKey2();
          }
          this.invalidateKey = function() {
            this.key0 = -1; // The key of this texture unit must be recomputed when rendering the next time.
            GLImmediate.currentRenderer = null; // The currently used renderer must be re-evaluated at next render.
          }
        }
  
        function CTexUnit() {
          this.env = new CTexEnv();
          this.enabled_tex1D   = false;
          this.enabled_tex2D   = false;
          this.enabled_tex3D   = false;
          this.enabled_texCube = false;
          this.texTypesEnabled = 0; // A bitfield combination of the four flags above, used for fast access to operations.
  
          this.traverseState = function CTexUnit_traverseState(keyView) {
            if (this.texTypesEnabled) {
              if (this.env.key0 == -1) {
                this.env.recomputeKey();
              }
              keyView.next(this.texTypesEnabled | (this.env.key0 << 4));
              keyView.next(this.env.key1);
              keyView.next(this.env.key2);
            } else {
              // For correctness, must traverse a zero value, theoretically a subsequent integer key could collide with this value otherwise.
              keyView.next(0);
            }
          };
        };
  
        // Class impls:
        CTexUnit.prototype.enabled = function CTexUnit_enabled() {
          return this.texTypesEnabled;
        }
  
        CTexUnit.prototype.genPassLines = function CTexUnit_genPassLines(passOutputVar, passInputVar, texUnitID) {
          if (!this.enabled()) {
            return ["vec4 " + passOutputVar + " = " + passInputVar + ";"];
          }
          var lines = this.env.genPassLines(passOutputVar, passInputVar, texUnitID).join('\n');
  
          var texLoadLines = '';
          var texLoadRegex = /(texture.*?\(.*?\))/g;
          var loadCounter = 0;
          var load;
  
          // As an optimization, merge duplicate identical texture loads to one var.
          while(load = texLoadRegex.exec(lines)) {
            var texLoadExpr = load[1];
            var secondOccurrence = lines.slice(load.index+1).indexOf(texLoadExpr);
            if (secondOccurrence != -1) { // And also has a second occurrence of same load expression..
              // Create new var to store the common load.
              var prefix = TEXENVJIT_NAMESPACE_PREFIX + 'env' + texUnitID + "_";
              var texLoadVar = prefix + 'texload' + loadCounter++;
              var texLoadLine = 'vec4 ' + texLoadVar + ' = ' + texLoadExpr + ';\n';
              texLoadLines += texLoadLine + '\n'; // Store the generated texture load statements in a temp string to not confuse regex search in progress.
              lines = lines.split(texLoadExpr).join(texLoadVar);
              // Reset regex search, since we modified the string.
              texLoadRegex = /(texture.*\(.*\))/g;
            }
          }
          return [texLoadLines + lines];
        }
  
        CTexUnit.prototype.getTexType = function CTexUnit_getTexType() {
          if (this.enabled_texCube) {
            return GL_TEXTURE_CUBE_MAP;
          } else if (this.enabled_tex3D) {
            return GL_TEXTURE_3D;
          } else if (this.enabled_tex2D) {
            return GL_TEXTURE_2D;
          } else if (this.enabled_tex1D) {
            return GL_TEXTURE_1D;
          }
          return 0;
        }
  
        CTexEnv.prototype.genPassLines = function CTexEnv_genPassLines(passOutputVar, passInputVar, texUnitID) {
          switch (this.mode) {
            case GL_REPLACE: {
              /* RGB:
               * Cv = Cs
               * Av = Ap // Note how this is different, and that we'll
               *            need to track the bound texture internalFormat
               *            to get this right.
               *
               * RGBA:
               * Cv = Cs
               * Av = As
               */
              return [
                "vec4 " + passOutputVar + " = " + genTexUnitSampleExpr(texUnitID) + ";",
              ];
            }
            case GL_ADD: {
              /* RGBA:
               * Cv = Cp + Cs
               * Av = ApAs
               */
              var prefix = TEXENVJIT_NAMESPACE_PREFIX + 'env' + texUnitID + "_";
              var texVar = prefix + "tex";
              var colorVar = prefix + "color";
              var alphaVar = prefix + "alpha";
  
              return [
                "vec4 " + texVar + " = " + genTexUnitSampleExpr(texUnitID) + ";",
                "vec3 " + colorVar + " = " + passInputVar + ".rgb + " + texVar + ".rgb;",
                "float " + alphaVar + " = " + passInputVar + ".a * " + texVar + ".a;",
                "vec4 " + passOutputVar + " = vec4(" + colorVar + ", " + alphaVar + ");",
              ];
            }
            case GL_MODULATE: {
              /* RGBA:
               * Cv = CpCs
               * Av = ApAs
               */
              var line = [
                "vec4 " + passOutputVar,
                " = ",
                  passInputVar,
                  " * ",
                  genTexUnitSampleExpr(texUnitID),
                ";",
              ];
              return [line.join("")];
            }
            case GL_DECAL: {
              /* RGBA:
               * Cv = Cp(1 - As) + CsAs
               * Av = Ap
               */
              var prefix = TEXENVJIT_NAMESPACE_PREFIX + 'env' + texUnitID + "_";
              var texVar = prefix + "tex";
              var colorVar = prefix + "color";
              var alphaVar = prefix + "alpha";
  
              return [
                "vec4 " + texVar + " = " + genTexUnitSampleExpr(texUnitID) + ";",
                [
                  "vec3 " + colorVar + " = ",
                    passInputVar + ".rgb * (1.0 - " + texVar + ".a)",
                      " + ",
                    texVar + ".rgb * " + texVar + ".a",
                  ";"
                ].join(""),
                "float " + alphaVar + " = " + passInputVar + ".a;",
                "vec4 " + passOutputVar + " = vec4(" + colorVar + ", " + alphaVar + ");",
              ];
            }
            case GL_BLEND: {
              /* RGBA:
               * Cv = Cp(1 - Cs) + CcCs
               * Av = As
               */
              var prefix = TEXENVJIT_NAMESPACE_PREFIX + 'env' + texUnitID + "_";
              var texVar = prefix + "tex";
              var colorVar = prefix + "color";
              var alphaVar = prefix + "alpha";
  
              return [
                "vec4 " + texVar + " = " + genTexUnitSampleExpr(texUnitID) + ";",
                [
                  "vec3 " + colorVar + " = ",
                    passInputVar + ".rgb * (1.0 - " + texVar + ".rgb)",
                      " + ",
                    PRIM_COLOR_VARYING + ".rgb * " + texVar + ".rgb",
                  ";"
                ].join(""),
                "float " + alphaVar + " = " + texVar + ".a;",
                "vec4 " + passOutputVar + " = vec4(" + colorVar + ", " + alphaVar + ");",
              ];
            }
            case GL_COMBINE: {
              var prefix = TEXENVJIT_NAMESPACE_PREFIX + 'env' + texUnitID + "_";
              var colorVar = prefix + "color";
              var alphaVar = prefix + "alpha";
              var colorLines = this.genCombinerLines(true, colorVar,
                                                     passInputVar, texUnitID,
                                                     this.colorCombiner, this.colorSrc, this.colorOp);
              var alphaLines = this.genCombinerLines(false, alphaVar,
                                                     passInputVar, texUnitID,
                                                     this.alphaCombiner, this.alphaSrc, this.alphaOp);
  
              // Generate scale, but avoid generating an identity op that multiplies by one.
              var scaledColor = (this.colorScale == 1) ? colorVar : (colorVar + " * " + valToFloatLiteral(this.colorScale));
              var scaledAlpha = (this.alphaScale == 1) ? alphaVar : (alphaVar + " * " + valToFloatLiteral(this.alphaScale));
  
              var line = [
                "vec4 " + passOutputVar,
                " = ",
                  "vec4(",
                      scaledColor,
                      ", ",
                      scaledAlpha,
                  ")",
                ";",
              ].join("");
              return [].concat(colorLines, alphaLines, [line]);
            }
          }
  
          return abort_noSupport("Unsupported TexEnv mode: 0x" + this.mode.toString(16));
        }
  
        CTexEnv.prototype.genCombinerLines = function CTexEnv_getCombinerLines(isColor, outputVar,
                                                                               passInputVar, texUnitID,
                                                                               combiner, srcArr, opArr)
        {
          var argsNeeded = null;
          switch (combiner) {
            case GL_REPLACE:
              argsNeeded = 1;
              break;
  
            case GL_MODULATE:
            case GL_ADD:
            case GL_SUBTRACT:
              argsNeeded = 2;
              break;
  
            case GL_INTERPOLATE:
              argsNeeded = 3;
              break;
  
            default:
              return abort_noSupport("Unsupported combiner: 0x" + combiner.toString(16));
          }
  
          var constantExpr = [
            "vec4(",
              valToFloatLiteral(this.envColor[0]),
              ", ",
              valToFloatLiteral(this.envColor[1]),
              ", ",
              valToFloatLiteral(this.envColor[2]),
              ", ",
              valToFloatLiteral(this.envColor[3]),
            ")",
          ].join("");
          var src0Expr = (argsNeeded >= 1) ? genCombinerSourceExpr(texUnitID, constantExpr, passInputVar, srcArr[0], opArr[0])
                                           : null;
          var src1Expr = (argsNeeded >= 2) ? genCombinerSourceExpr(texUnitID, constantExpr, passInputVar, srcArr[1], opArr[1])
                                           : null;
          var src2Expr = (argsNeeded >= 3) ? genCombinerSourceExpr(texUnitID, constantExpr, passInputVar, srcArr[2], opArr[2])
                                           : null;
  
          var outputType = isColor ? "vec3" : "float";
          var lines = null;
          switch (combiner) {
            case GL_REPLACE: {
              var line = [
                outputType + " " + outputVar,
                " = ",
                  src0Expr,
                ";",
              ];
              lines = [line.join("")];
              break;
            }
            case GL_MODULATE: {
              var line = [
                outputType + " " + outputVar + " = ",
                  src0Expr + " * " + src1Expr,
                ";",
              ];
              lines = [line.join("")];
              break;
            }
            case GL_ADD: {
              var line = [
                outputType + " " + outputVar + " = ",
                  src0Expr + " + " + src1Expr,
                ";",
              ];
              lines = [line.join("")];
              break;
            }
            case GL_SUBTRACT: {
              var line = [
                outputType + " " + outputVar + " = ",
                  src0Expr + " - " + src1Expr,
                ";",
              ];
              lines = [line.join("")];
              break;
            }
            case GL_INTERPOLATE: {
              var prefix = TEXENVJIT_NAMESPACE_PREFIX + 'env' + texUnitID + "_";
              var arg2Var = prefix + "colorSrc2";
              var arg2Line = getTypeFromCombineOp(this.colorOp[2]) + " " + arg2Var + " = " + src2Expr + ";";
  
              var line = [
                outputType + " " + outputVar,
                " = ",
                  src0Expr + " * " + arg2Var,
                  " + ",
                  src1Expr + " * (1.0 - " + arg2Var + ")",
                ";",
              ];
              lines = [
                arg2Line,
                line.join(""),
              ];
              break;
            }
  
            default:
              return abort_sanity("Unmatched TexEnv.colorCombiner?");
          }
  
          return lines;
        }
  
        return {
          // Exports:
          init: function(gl, specifiedMaxTextureImageUnits) {
            var maxTexUnits = 0;
            if (specifiedMaxTextureImageUnits) {
              maxTexUnits = specifiedMaxTextureImageUnits;
            } else if (gl) {
              maxTexUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
            }
            assert(maxTexUnits > 0);
            s_texUnits = [];
            for (var i = 0; i < maxTexUnits; i++) {
              s_texUnits.push(new CTexUnit());
            }
          },
  
          setGLSLVars: function(uTexUnitPrefix, vTexCoordPrefix, vPrimColor, uTexMatrixPrefix) {
            TEX_UNIT_UNIFORM_PREFIX   = uTexUnitPrefix;
            TEX_COORD_VARYING_PREFIX  = vTexCoordPrefix;
            PRIM_COLOR_VARYING        = vPrimColor;
            TEX_MATRIX_UNIFORM_PREFIX = uTexMatrixPrefix;
          },
  
          genAllPassLines: function(resultDest, indentSize) {
            indentSize = indentSize || 0;
  
            s_requiredTexUnitsForPass.length = 0; // Clear the list.
            var lines = [];
            var lastPassVar = PRIM_COLOR_VARYING;
            for (var i = 0; i < s_texUnits.length; i++) {
              if (!s_texUnits[i].enabled()) continue;
  
              s_requiredTexUnitsForPass.push(i);
  
              var prefix = TEXENVJIT_NAMESPACE_PREFIX + 'env' + i + "_";
              var passOutputVar = prefix + "result";
  
              var newLines = s_texUnits[i].genPassLines(passOutputVar, lastPassVar, i);
              lines = lines.concat(newLines, [""]);
  
              lastPassVar = passOutputVar;
            }
            lines.push(resultDest + " = " + lastPassVar + ";");
  
            var indent = "";
            for (var i = 0; i < indentSize; i++) indent += " ";
  
            var output = indent + lines.join("\n" + indent);
  
            return output;
          },
  
          getUsedTexUnitList: function() {
            return s_requiredTexUnitsForPass;
          },
  
          getActiveTexture: function () {
            return s_activeTexture;
          },
  
          traverseState: function(keyView) {
            for (var i = 0; i < s_texUnits.length; i++) {
              s_texUnits[i].traverseState(keyView);
            }
          },
  
          getTexUnitType: function(texUnitID) {
            assert(texUnitID >= 0 &&
                   texUnitID < s_texUnits.length);
            return s_texUnits[texUnitID].getTexType();
          },
  
          // Hooks:
          hook_activeTexture: function(texture) {
            s_activeTexture = texture - GL_TEXTURE0;
            // Check if the current matrix mode is GL_TEXTURE.
            if (GLImmediate.currentMatrix >= 2) {
              // Switch to the corresponding texture matrix stack.
              GLImmediate.currentMatrix = 2 + s_activeTexture;
            }
          },
  
          hook_enable: function(cap) {
            var cur = getCurTexUnit();
            switch (cap) {
              case GL_TEXTURE_1D:
                if (!cur.enabled_tex1D) {
                  GLImmediate.currentRenderer = null; // Renderer state changed, and must be recreated or looked up again.
                  cur.enabled_tex1D = true;
                  cur.texTypesEnabled |= 1;
                }
                break;
              case GL_TEXTURE_2D:
                if (!cur.enabled_tex2D) {
                  GLImmediate.currentRenderer = null;
                  cur.enabled_tex2D = true;
                  cur.texTypesEnabled |= 2;
                }
                break;
              case GL_TEXTURE_3D:
                if (!cur.enabled_tex3D) {
                  GLImmediate.currentRenderer = null;
                  cur.enabled_tex3D = true;
                  cur.texTypesEnabled |= 4;
                }
                break;
              case GL_TEXTURE_CUBE_MAP:
                if (!cur.enabled_texCube) {
                  GLImmediate.currentRenderer = null;
                  cur.enabled_texCube = true;
                  cur.texTypesEnabled |= 8;
                }
                break;
            }
          },
  
          hook_disable: function(cap) {
            var cur = getCurTexUnit();
            switch (cap) {
              case GL_TEXTURE_1D:
                if (cur.enabled_tex1D) {
                  GLImmediate.currentRenderer = null; // Renderer state changed, and must be recreated or looked up again.
                  cur.enabled_tex1D = false;
                  cur.texTypesEnabled &= ~1;
                }
                break;
              case GL_TEXTURE_2D:
                if (cur.enabled_tex2D) {
                  GLImmediate.currentRenderer = null;
                  cur.enabled_tex2D = false;
                  cur.texTypesEnabled &= ~2;
                }
                break;
              case GL_TEXTURE_3D:
                if (cur.enabled_tex3D) {
                  GLImmediate.currentRenderer = null;
                  cur.enabled_tex3D = false;
                  cur.texTypesEnabled &= ~4;
                }
                break;
              case GL_TEXTURE_CUBE_MAP:
                if (cur.enabled_texCube) {
                  GLImmediate.currentRenderer = null;
                  cur.enabled_texCube = false;
                  cur.texTypesEnabled &= ~8;
                }
                break;
            }
          },
  
          hook_texEnvf: function(target, pname, param) {
            if (target != GL_TEXTURE_ENV)
              return;
  
            var env = getCurTexUnit().env;
            switch (pname) {
              case GL_RGB_SCALE:
                if (env.colorScale != param) {
                  env.invalidateKey(); // We changed FFP emulation renderer state.
                  env.colorScale = param;
                }
                break;
              case GL_ALPHA_SCALE:
                if (env.alphaScale != param) {
                  env.invalidateKey();
                  env.alphaScale = param;
                }
                break;
  
              default:
                err('WARNING: Unhandled `pname` in call to `glTexEnvf`.');
            }
          },
  
          hook_texEnvi: function(target, pname, param) {
            if (target != GL_TEXTURE_ENV)
              return;
  
            var env = getCurTexUnit().env;
            switch (pname) {
              case GL_TEXTURE_ENV_MODE:
                if (env.mode != param) {
                  env.invalidateKey(); // We changed FFP emulation renderer state.
                  env.mode = param;
                }
                break;
  
              case GL_COMBINE_RGB:
                if (env.colorCombiner != param) {
                  env.invalidateKey();
                  env.colorCombiner = param;
                }
                break;
              case GL_COMBINE_ALPHA:
                if (env.alphaCombiner != param) {
                  env.invalidateKey();
                  env.alphaCombiner = param;
                }
                break;
  
              case GL_SRC0_RGB:
                if (env.colorSrc[0] != param) {
                  env.invalidateKey();
                  env.colorSrc[0] = param;
                }
                break;
              case GL_SRC1_RGB:
                if (env.colorSrc[1] != param) {
                  env.invalidateKey();
                  env.colorSrc[1] = param;
                }
                break;
              case GL_SRC2_RGB:
                if (env.colorSrc[2] != param) {
                  env.invalidateKey();
                  env.colorSrc[2] = param;
                }
                break;
  
              case GL_SRC0_ALPHA:
                if (env.alphaSrc[0] != param) {
                  env.invalidateKey();
                  env.alphaSrc[0] = param;
                }
                break;
              case GL_SRC1_ALPHA:
                if (env.alphaSrc[1] != param) {
                  env.invalidateKey();
                  env.alphaSrc[1] = param;
                }
                break;
              case GL_SRC2_ALPHA:
                if (env.alphaSrc[2] != param) {
                  env.invalidateKey();
                  env.alphaSrc[2] = param;
                }
                break;
  
              case GL_OPERAND0_RGB:
                if (env.colorOp[0] != param) {
                  env.invalidateKey();
                  env.colorOp[0] = param;
                }
                break;
              case GL_OPERAND1_RGB:
                if (env.colorOp[1] != param) {
                  env.invalidateKey();
                  env.colorOp[1] = param;
                }
                break;
              case GL_OPERAND2_RGB:
                if (env.colorOp[2] != param) {
                  env.invalidateKey();
                  env.colorOp[2] = param;
                }
                break;
  
              case GL_OPERAND0_ALPHA:
                if (env.alphaOp[0] != param) {
                  env.invalidateKey();
                  env.alphaOp[0] = param;
                }
                break;
              case GL_OPERAND1_ALPHA:
                if (env.alphaOp[1] != param) {
                  env.invalidateKey();
                  env.alphaOp[1] = param;
                }
                break;
              case GL_OPERAND2_ALPHA:
                if (env.alphaOp[2] != param) {
                  env.invalidateKey();
                  env.alphaOp[2] = param;
                }
                break;
  
              case GL_RGB_SCALE:
                if (env.colorScale != param) {
                  env.invalidateKey();
                  env.colorScale = param;
                }
                break;
              case GL_ALPHA_SCALE:
                if (env.alphaScale != param) {
                  env.invalidateKey();
                  env.alphaScale = param;
                }
                break;
  
              default:
                err('WARNING: Unhandled `pname` in call to `glTexEnvi`.');
            }
          },
  
          hook_texEnvfv: function(target, pname, params) {
            if (target != GL_TEXTURE_ENV) return;
  
            var env = getCurTexUnit().env;
            switch (pname) {
              case GL_TEXTURE_ENV_COLOR: {
                for (var i = 0; i < 4; i++) {
                  var param = HEAPF32[(((params)+(i*4))>>2)];
                  if (env.envColor[i] != param) {
                    env.invalidateKey(); // We changed FFP emulation renderer state.
                    env.envColor[i] = param;
                  }
                }
                break
              }
              default:
                err('WARNING: Unhandled `pname` in call to `glTexEnvfv`.');
            }
          },
  
          hook_getTexEnviv: function(target, pname, param) {
            if (target != GL_TEXTURE_ENV)
              return;
  
            var env = getCurTexUnit().env;
            switch (pname) {
              case GL_TEXTURE_ENV_MODE:
                HEAP32[((param)>>2)]=env.mode;
                return;
  
              case GL_TEXTURE_ENV_COLOR:
                HEAP32[((param)>>2)]=Math.max(Math.min(env.envColor[0]*255, 255, -255));
                HEAP32[(((param)+(1))>>2)]=Math.max(Math.min(env.envColor[1]*255, 255, -255));
                HEAP32[(((param)+(2))>>2)]=Math.max(Math.min(env.envColor[2]*255, 255, -255));
                HEAP32[(((param)+(3))>>2)]=Math.max(Math.min(env.envColor[3]*255, 255, -255));
                return;
  
              case GL_COMBINE_RGB:
                HEAP32[((param)>>2)]=env.colorCombiner;
                return;
  
              case GL_COMBINE_ALPHA:
                HEAP32[((param)>>2)]=env.alphaCombiner;
                return;
  
              case GL_SRC0_RGB:
                HEAP32[((param)>>2)]=env.colorSrc[0];
                return;
  
              case GL_SRC1_RGB:
                HEAP32[((param)>>2)]=env.colorSrc[1];
                return;
  
              case GL_SRC2_RGB:
                HEAP32[((param)>>2)]=env.colorSrc[2];
                return;
  
              case GL_SRC0_ALPHA:
                HEAP32[((param)>>2)]=env.alphaSrc[0];
                return;
  
              case GL_SRC1_ALPHA:
                HEAP32[((param)>>2)]=env.alphaSrc[1];
                return;
  
              case GL_SRC2_ALPHA:
                HEAP32[((param)>>2)]=env.alphaSrc[2];
                return;
  
              case GL_OPERAND0_RGB:
                HEAP32[((param)>>2)]=env.colorOp[0];
                return;
  
              case GL_OPERAND1_RGB:
                HEAP32[((param)>>2)]=env.colorOp[1];
                return;
  
              case GL_OPERAND2_RGB:
                HEAP32[((param)>>2)]=env.colorOp[2];
                return;
  
              case GL_OPERAND0_ALPHA:
                HEAP32[((param)>>2)]=env.alphaOp[0];
                return;
  
              case GL_OPERAND1_ALPHA:
                HEAP32[((param)>>2)]=env.alphaOp[1];
                return;
  
              case GL_OPERAND2_ALPHA:
                HEAP32[((param)>>2)]=env.alphaOp[2];
                return;
  
              case GL_RGB_SCALE:
                HEAP32[((param)>>2)]=env.colorScale;
                return;
  
              case GL_ALPHA_SCALE:
                HEAP32[((param)>>2)]=env.alphaScale;
                return;
  
              default:
                err('WARNING: Unhandled `pname` in call to `glGetTexEnvi`.');
            }
          },
  
          hook_getTexEnvfv: function(target, pname, param) {
            if (target != GL_TEXTURE_ENV)
              return;
  
            var env = getCurTexUnit().env;
            switch (pname) {
              case GL_TEXTURE_ENV_COLOR:
                HEAPF32[((param)>>2)]=env.envColor[0];
                HEAPF32[(((param)+(4))>>2)]=env.envColor[1];
                HEAPF32[(((param)+(8))>>2)]=env.envColor[2];
                HEAPF32[(((param)+(12))>>2)]=env.envColor[3];
                return;
            }
          }
        };
      },vertexData:null,vertexDataU8:null,tempData:null,indexData:null,vertexCounter:0,mode:-1,rendererCache:null,rendererComponents:[],rendererComponentPointer:0,lastRenderer:null,lastArrayBuffer:null,lastProgram:null,lastStride:-1,matrix:[],matrixStack:[],currentMatrix:0,tempMatrix:null,matricesModified:false,useTextureMatrix:false,VERTEX:0,NORMAL:1,COLOR:2,TEXTURE0:3,NUM_ATTRIBUTES:-1,MAX_TEXTURES:-1,totalEnabledClientAttributes:0,enabledClientAttributes:[0,0],clientAttributes:[],liveClientAttributes:[],currentRenderer:null,modifiedClientAttributes:false,clientActiveTexture:0,clientColor:null,usedTexUnitList:[],fixedFunctionProgram:null,setClientAttribute:function setClientAttribute(name, size, type, stride, pointer) {
        var attrib = GLImmediate.clientAttributes[name];
        if (!attrib) {
          for (var i = 0; i <= name; i++) { // keep flat
            if (!GLImmediate.clientAttributes[i]) {
              GLImmediate.clientAttributes[i] = {
                name: name,
                size: size,
                type: type,
                stride: stride,
                pointer: pointer,
                offset: 0
              };
            }
          }
        } else {
          attrib.name = name;
          attrib.size = size;
          attrib.type = type;
          attrib.stride = stride;
          attrib.pointer = pointer;
          attrib.offset = 0;
        }
        GLImmediate.modifiedClientAttributes = true;
      },addRendererComponent:function addRendererComponent(name, size, type) {
        if (!GLImmediate.rendererComponents[name]) {
          GLImmediate.rendererComponents[name] = 1;
          if (GLImmediate.enabledClientAttributes[name]) {
            console.log("Warning: glTexCoord used after EnableClientState for TEXTURE_COORD_ARRAY for TEXTURE0. Disabling TEXTURE_COORD_ARRAY...");
          }
          GLImmediate.enabledClientAttributes[name] = true;
          GLImmediate.setClientAttribute(name, size, type, 0, GLImmediate.rendererComponentPointer);
          GLImmediate.rendererComponentPointer += size * GL.byteSizeByType[type - GL.byteSizeByTypeRoot];
          // We can enable the correct attribute stream index immediately here, since the same attribute in each shader
          // will be bound to this same index.
          GL.enableVertexAttribArray(name);
        } else {
          GLImmediate.rendererComponents[name]++;
        }
      },disableBeginEndClientAttributes:function disableBeginEndClientAttributes() {
        for (var i = 0; i < GLImmediate.NUM_ATTRIBUTES; i++) {
          if (GLImmediate.rendererComponents[i]) GLImmediate.enabledClientAttributes[i] = false;
        }
      },getRenderer:function getRenderer() {
        // If no FFP state has changed that would have forced to re-evaluate which FFP emulation shader to use,
        // we have the currently used renderer in cache, and can immediately return that.
        if (GLImmediate.currentRenderer) {
          return GLImmediate.currentRenderer;
        }
        // return a renderer object given the liveClientAttributes
        // we maintain a cache of renderers, optimized to not generate garbage
        var attributes = GLImmediate.liveClientAttributes;
        var cacheMap = GLImmediate.rendererCache;
        var keyView = cacheMap.getStaticKeyView().reset();
  
        // By attrib state:
        var enabledAttributesKey = 0;
        for (var i = 0; i < attributes.length; i++) {
          enabledAttributesKey |= 1 << attributes[i].name;
        }
  
        // By fog state:
        var fogParam = 0;
        if (GLEmulation.fogEnabled) {
          switch (GLEmulation.fogMode) {
            case 0x801: // GL_EXP2
              fogParam = 1;
              break;
            case 0x2601: // GL_LINEAR
              fogParam = 2;
              break;
            default: // default to GL_EXP
              fogParam = 3;
              break;
          }
        }
        enabledAttributesKey = (enabledAttributesKey << 2) | fogParam;
  
        // By drawing mode:
        enabledAttributesKey = (enabledAttributesKey << 1) | (GLImmediate.mode == GLctx.POINTS ? 1 : 0);
  
        keyView.next(enabledAttributesKey);
  
          GLImmediate.TexEnvJIT.traverseState(keyView);
  
        // If we don't already have it, create it.
        var renderer = keyView.get();
        if (!renderer) {
          renderer = GLImmediate.createRenderer();
          GLImmediate.currentRenderer = renderer;
          keyView.set(renderer);
          return renderer;
        }
        GLImmediate.currentRenderer = renderer; // Cache the currently used renderer, so later lookups without state changes can get this fast.
        return renderer;
      },createRenderer:function createRenderer(renderer) {
        var useCurrProgram = !!GL.currProgram;
        var hasTextures = false;
        for (var i = 0; i < GLImmediate.MAX_TEXTURES; i++) {
          var texAttribName = GLImmediate.TEXTURE0 + i;
          if (!GLImmediate.enabledClientAttributes[texAttribName])
            continue;
  
          if (!useCurrProgram) {
            if (GLImmediate.TexEnvJIT.getTexUnitType(i) == 0) {
               warnOnce("GL_TEXTURE" + i + " coords are supplied, but that texture unit is disabled in the fixed-function pipeline.");
            }
          }
  
          hasTextures = true;
        }
  
        var ret = {
          init: function init() {
            // For fixed-function shader generation.
            var uTexUnitPrefix = 'u_texUnit';
            var aTexCoordPrefix = 'a_texCoord';
            var vTexCoordPrefix = 'v_texCoord';
            var vPrimColor = 'v_color';
            var uTexMatrixPrefix = GLImmediate.useTextureMatrix ? 'u_textureMatrix' : null;
  
            if (useCurrProgram) {
              if (GL.shaderInfos[GL.programShaders[GL.currProgram][0]].type == GLctx.VERTEX_SHADER) {
                this.vertexShader = GL.shaders[GL.programShaders[GL.currProgram][0]];
                this.fragmentShader = GL.shaders[GL.programShaders[GL.currProgram][1]];
              } else {
                this.vertexShader = GL.shaders[GL.programShaders[GL.currProgram][1]];
                this.fragmentShader = GL.shaders[GL.programShaders[GL.currProgram][0]];
              }
              this.program = GL.programs[GL.currProgram];
              this.usedTexUnitList = [];
            } else {
              // IMPORTANT NOTE: If you parameterize the shader source based on any runtime values
              // in order to create the least expensive shader possible based on the features being
              // used, you should also update the code in the beginning of getRenderer to make sure
              // that you cache the renderer based on the said parameters.
              if (GLEmulation.fogEnabled) {
                switch (GLEmulation.fogMode) {
                  case 0x801: // GL_EXP2
                    // fog = exp(-(gl_Fog.density * gl_FogFragCoord)^2)
                    var fogFormula = '  float fog = exp(-u_fogDensity * u_fogDensity * ecDistance * ecDistance); \n';
                    break;
                  case 0x2601: // GL_LINEAR
                    // fog = (gl_Fog.end - gl_FogFragCoord) * gl_fog.scale
                    var fogFormula = '  float fog = (u_fogEnd - ecDistance) * u_fogScale; \n';
                    break;
                  default: // default to GL_EXP
                    // fog = exp(-gl_Fog.density * gl_FogFragCoord)
                    var fogFormula = '  float fog = exp(-u_fogDensity * ecDistance); \n';
                    break;
                }
              }
  
              GLImmediate.TexEnvJIT.setGLSLVars(uTexUnitPrefix, vTexCoordPrefix, vPrimColor, uTexMatrixPrefix);
              var fsTexEnvPass = GLImmediate.TexEnvJIT.genAllPassLines('gl_FragColor', 2);
  
              var texUnitAttribList = '';
              var texUnitVaryingList = '';
              var texUnitUniformList = '';
              var vsTexCoordInits = '';
              this.usedTexUnitList = GLImmediate.TexEnvJIT.getUsedTexUnitList();
              for (var i = 0; i < this.usedTexUnitList.length; i++) {
                var texUnit = this.usedTexUnitList[i];
                texUnitAttribList += 'attribute vec4 ' + aTexCoordPrefix + texUnit + ';\n';
                texUnitVaryingList += 'varying vec4 ' + vTexCoordPrefix + texUnit + ';\n';
                texUnitUniformList += 'uniform sampler2D ' + uTexUnitPrefix + texUnit + ';\n';
                vsTexCoordInits += '  ' + vTexCoordPrefix + texUnit + ' = ' + aTexCoordPrefix + texUnit + ';\n';
  
                if (GLImmediate.useTextureMatrix) {
                  texUnitUniformList += 'uniform mat4 ' + uTexMatrixPrefix + texUnit + ';\n';
                }
              }
  
              var vsFogVaryingInit = null;
              if (GLEmulation.fogEnabled) {
                vsFogVaryingInit = '  v_fogFragCoord = abs(ecPosition.z);\n';
              }
  
              var vsPointSizeDefs = null;
              var vsPointSizeInit = null;
              if (GLImmediate.mode == GLctx.POINTS) {
                vsPointSizeDefs = 'uniform float u_pointSize;\n';
                vsPointSizeInit = '  gl_PointSize = u_pointSize;\n';
              }
  
              var vsSource = [
                'attribute vec4 a_position;',
                'attribute vec4 a_color;',
                'varying vec4 v_color;',
                texUnitAttribList,
                texUnitVaryingList,
                (GLEmulation.fogEnabled ? 'varying float v_fogFragCoord;' : null),
                'uniform mat4 u_modelView;',
                'uniform mat4 u_projection;',
                vsPointSizeDefs,
                'void main()',
                '{',
                '  vec4 ecPosition = u_modelView * a_position;', // eye-coordinate position
                '  gl_Position = u_projection * ecPosition;',
                '  v_color = a_color;',
                vsTexCoordInits,
                vsFogVaryingInit,
                vsPointSizeInit,
                '}',
                ''
              ].join('\n').replace(/\n\n+/g, '\n');
  
              this.vertexShader = GLctx.createShader(GLctx.VERTEX_SHADER);
              GLctx.shaderSource(this.vertexShader, vsSource);
              GLctx.compileShader(this.vertexShader);
  
              var fogHeaderIfNeeded = null;
              if (GLEmulation.fogEnabled) {
                fogHeaderIfNeeded = [
                  '',
                  'varying float v_fogFragCoord; ',
                  'uniform vec4 u_fogColor;      ',
                  'uniform float u_fogEnd;       ',
                  'uniform float u_fogScale;     ',
                  'uniform float u_fogDensity;   ',
                  'float ffog(in float ecDistance) { ',
                  fogFormula,
                  '  fog = clamp(fog, 0.0, 1.0); ',
                  '  return fog;                 ',
                  '}',
                  '',
                ].join("\n");
              }
  
              var fogPass = null;
              if (GLEmulation.fogEnabled) {
                fogPass = 'gl_FragColor = vec4(mix(u_fogColor.rgb, gl_FragColor.rgb, ffog(v_fogFragCoord)), gl_FragColor.a);\n';
              }
  
              var fsSource = [
                'precision mediump float;',
                texUnitVaryingList,
                texUnitUniformList,
                'varying vec4 v_color;',
                fogHeaderIfNeeded,
                'void main()',
                '{',
                fsTexEnvPass,
                fogPass,
                '}',
                ''
              ].join("\n").replace(/\n\n+/g, '\n');
  
              this.fragmentShader = GLctx.createShader(GLctx.FRAGMENT_SHADER);
              GLctx.shaderSource(this.fragmentShader, fsSource);
              GLctx.compileShader(this.fragmentShader);
  
              this.program = GLctx.createProgram();
              GLctx.attachShader(this.program, this.vertexShader);
              GLctx.attachShader(this.program, this.fragmentShader);
  
              // As optimization, bind all attributes to prespecified locations, so that the FFP emulation
              // code can submit attributes to any generated FFP shader without having to examine each shader in turn.
              // These prespecified locations are only assumed if GL_FFP_ONLY is specified, since user could also create their
              // own shaders that didn't have attributes in the same locations.
              GLctx.bindAttribLocation(this.program, GLImmediate.VERTEX, 'a_position');
              GLctx.bindAttribLocation(this.program, GLImmediate.COLOR, 'a_color');
              GLctx.bindAttribLocation(this.program, GLImmediate.NORMAL, 'a_normal');
              var maxVertexAttribs = GLctx.getParameter(GLctx.MAX_VERTEX_ATTRIBS);
              for (var i = 0; i < GLImmediate.MAX_TEXTURES && GLImmediate.TEXTURE0 + i < maxVertexAttribs; i++) {
                GLctx.bindAttribLocation(this.program, GLImmediate.TEXTURE0 + i, 'a_texCoord'+i);
                GLctx.bindAttribLocation(this.program, GLImmediate.TEXTURE0 + i, aTexCoordPrefix+i);
              }
              GLctx.linkProgram(this.program);
            }
  
            // Stores an array that remembers which matrix uniforms are up-to-date in this FFP renderer, so they don't need to be resubmitted
            // each time we render with this program.
            this.textureMatrixVersion = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
  
            this.positionLocation = GLctx.getAttribLocation(this.program, 'a_position');
  
            this.texCoordLocations = [];
  
            for (var i = 0; i < GLImmediate.MAX_TEXTURES; i++) {
              if (!GLImmediate.enabledClientAttributes[GLImmediate.TEXTURE0 + i]) {
                this.texCoordLocations[i] = -1;
                continue;
              }
  
              if (useCurrProgram) {
                this.texCoordLocations[i] = GLctx.getAttribLocation(this.program, 'a_texCoord' + i);
              } else {
                this.texCoordLocations[i] = GLctx.getAttribLocation(this.program, aTexCoordPrefix + i);
              }
            }
            this.colorLocation = GLctx.getAttribLocation(this.program, 'a_color');
            if (!useCurrProgram) {
              // Temporarily switch to the program so we can set our sampler uniforms early.
              var prevBoundProg = GLctx.getParameter(GLctx.CURRENT_PROGRAM);
              GLctx.useProgram(this.program);
              {
                for (var i = 0; i < this.usedTexUnitList.length; i++) {
                  var texUnitID = this.usedTexUnitList[i];
                  var texSamplerLoc = GLctx.getUniformLocation(this.program, uTexUnitPrefix + texUnitID);
                  GLctx.uniform1i(texSamplerLoc, texUnitID);
                }
              }
              // The default color attribute value is not the same as the default for all other attribute streams (0,0,0,1) but (1,1,1,1),
              // so explicitly set it right at start.
              GLctx.vertexAttrib4fv(this.colorLocation, [1,1,1,1]);
              GLctx.useProgram(prevBoundProg);
            }
  
            this.textureMatrixLocations = [];
            for (var i = 0; i < GLImmediate.MAX_TEXTURES; i++) {
              this.textureMatrixLocations[i] = GLctx.getUniformLocation(this.program, 'u_textureMatrix' + i);
            }
            this.normalLocation = GLctx.getAttribLocation(this.program, 'a_normal');
  
            this.modelViewLocation = GLctx.getUniformLocation(this.program, 'u_modelView');
            this.projectionLocation = GLctx.getUniformLocation(this.program, 'u_projection');
  
            this.hasTextures = hasTextures;
            this.hasNormal = GLImmediate.enabledClientAttributes[GLImmediate.NORMAL] &&
                             GLImmediate.clientAttributes[GLImmediate.NORMAL].size > 0 &&
                             this.normalLocation >= 0;
            this.hasColor = (this.colorLocation === 0) || this.colorLocation > 0;
  
            this.floatType = GLctx.FLOAT; // minor optimization
  
            this.fogColorLocation = GLctx.getUniformLocation(this.program, 'u_fogColor');
            this.fogEndLocation = GLctx.getUniformLocation(this.program, 'u_fogEnd');
            this.fogScaleLocation = GLctx.getUniformLocation(this.program, 'u_fogScale');
            this.fogDensityLocation = GLctx.getUniformLocation(this.program, 'u_fogDensity');
            this.hasFog = !!(this.fogColorLocation || this.fogEndLocation ||
                             this.fogScaleLocation || this.fogDensityLocation);
  
            this.pointSizeLocation = GLctx.getUniformLocation(this.program, 'u_pointSize');
          },
  
          prepare: function prepare() {
            // Calculate the array buffer
            var arrayBuffer;
            if (!GLctx.currentArrayBufferBinding) {
              var start = GLImmediate.firstVertex*GLImmediate.stride;
              var end = GLImmediate.lastVertex*GLImmediate.stride;
              assert(end <= GL.MAX_TEMP_BUFFER_SIZE, 'too much vertex data');
              arrayBuffer = GL.getTempVertexBuffer(end);
              // TODO: consider using the last buffer we bound, if it was larger. downside is larger buffer, but we might avoid rebinding and preparing
            } else {
              arrayBuffer = GLctx.currentArrayBufferBinding;
            }
  
            // If the array buffer is unchanged and the renderer as well, then we can avoid all the work here
            // XXX We use some heuristics here, and this may not work in all cases. Try disabling GL_UNSAFE_OPTS if you
            // have odd glitches
            var lastRenderer = GLImmediate.lastRenderer;
            var canSkip = this == lastRenderer &&
                          arrayBuffer == GLImmediate.lastArrayBuffer &&
                          (GL.currProgram || this.program) == GLImmediate.lastProgram &&
                          GLImmediate.stride == GLImmediate.lastStride &&
                          !GLImmediate.matricesModified;
            if (!canSkip && lastRenderer) lastRenderer.cleanup();
            if (!GLctx.currentArrayBufferBinding) {
              // Bind the array buffer and upload data after cleaning up the previous renderer
  
              if (arrayBuffer != GLImmediate.lastArrayBuffer) {
                GLctx.bindBuffer(GLctx.ARRAY_BUFFER, arrayBuffer);
                GLImmediate.lastArrayBuffer = arrayBuffer;
              }
  
              GLctx.bufferSubData(GLctx.ARRAY_BUFFER, start, GLImmediate.vertexData.subarray(start >> 2, end >> 2));
            }
            if (canSkip) return;
            GLImmediate.lastRenderer = this;
            GLImmediate.lastProgram = GL.currProgram || this.program;
            GLImmediate.lastStride == GLImmediate.stride;
            GLImmediate.matricesModified = false;
  
            if (!GL.currProgram) {
              if (GLImmediate.fixedFunctionProgram != this.program) {
                GLctx.useProgram(this.program);
                GLImmediate.fixedFunctionProgram = this.program;
              }
            }
  
            if (this.modelViewLocation && this.modelViewMatrixVersion != GLImmediate.matrixVersion[0/*m*/]) {
              this.modelViewMatrixVersion = GLImmediate.matrixVersion[0/*m*/];
              GLctx.uniformMatrix4fv(this.modelViewLocation, false, GLImmediate.matrix[0/*m*/]);
            }
            if (this.projectionLocation && this.projectionMatrixVersion != GLImmediate.matrixVersion[1/*p*/]) {
              this.projectionMatrixVersion = GLImmediate.matrixVersion[1/*p*/];
              GLctx.uniformMatrix4fv(this.projectionLocation, false, GLImmediate.matrix[1/*p*/]);
            }
  
            var clientAttributes = GLImmediate.clientAttributes;
            var posAttr = clientAttributes[GLImmediate.VERTEX];
  
  
            if (!GLctx.currentArrayBufferBinding) {
              GLctx.vertexAttribPointer(GLImmediate.VERTEX, posAttr.size, posAttr.type, false, GLImmediate.stride, posAttr.offset);
              if (this.hasNormal) {
                var normalAttr = clientAttributes[GLImmediate.NORMAL];
                GLctx.vertexAttribPointer(GLImmediate.NORMAL, normalAttr.size, normalAttr.type, true, GLImmediate.stride, normalAttr.offset);
              }
            }
            if (this.hasTextures) {
              for (var i = 0; i < GLImmediate.MAX_TEXTURES; i++) {
                if (!GLctx.currentArrayBufferBinding) {
                  var attribLoc = GLImmediate.TEXTURE0+i;
                  var texAttr = clientAttributes[attribLoc];
                  if (texAttr.size) {
                    GLctx.vertexAttribPointer(attribLoc, texAttr.size, texAttr.type, false, GLImmediate.stride, texAttr.offset);
                  } else {
                    // These two might be dangerous, but let's try them.
                    GLctx.vertexAttrib4f(attribLoc, 0, 0, 0, 1);
                  }
                }
                var t = 2/*t*/+i;
                if (this.textureMatrixLocations[i] && this.textureMatrixVersion[t] != GLImmediate.matrixVersion[t]) { // XXX might we need this even without the condition we are currently in?
                  this.textureMatrixVersion[t] = GLImmediate.matrixVersion[t];
                  GLctx.uniformMatrix4fv(this.textureMatrixLocations[i], false, GLImmediate.matrix[t]);
                }
              }
            }
            if (GLImmediate.enabledClientAttributes[GLImmediate.COLOR]) {
              var colorAttr = clientAttributes[GLImmediate.COLOR];
              if (!GLctx.currentArrayBufferBinding) {
                GLctx.vertexAttribPointer(GLImmediate.COLOR, colorAttr.size, colorAttr.type, true, GLImmediate.stride, colorAttr.offset);
              }
            }
            if (this.hasFog) {
              if (this.fogColorLocation) GLctx.uniform4fv(this.fogColorLocation, GLEmulation.fogColor);
              if (this.fogEndLocation) GLctx.uniform1f(this.fogEndLocation, GLEmulation.fogEnd);
              if (this.fogScaleLocation) GLctx.uniform1f(this.fogScaleLocation, 1/(GLEmulation.fogEnd - GLEmulation.fogStart));
              if (this.fogDensityLocation) GLctx.uniform1f(this.fogDensityLocation, GLEmulation.fogDensity);
            }
  
            if (GLImmediate.mode == GLctx.POINTS) {
              if (this.pointSizeLocation) {
                GLctx.uniform1f(this.pointSizeLocation, GLEmulation.pointSize);
              }
            }
          },
  
          cleanup: function cleanup() {
          }
        };
        ret.init();
        return ret;
      },setupFuncs:function() {
        // TexEnv stuff needs to be prepared early, so do it here.
        // init() is too late for -O2, since it freezes the GL functions
        // by that point.
        GLImmediate.MapTreeLib = GLImmediate.spawnMapTreeLib();
        GLImmediate.spawnMapTreeLib = null;
  
        GLImmediate.TexEnvJIT = GLImmediate.spawnTexEnvJIT();
        GLImmediate.spawnTexEnvJIT = null;
  
        GLImmediate.setupHooks();
      },setupHooks:function() {
        if (!GLEmulation.hasRunInit) {
          GLEmulation.init();
        }
  
        var glActiveTexture = _glActiveTexture;
        _glActiveTexture = _emscripten_glActiveTexture = function _glActiveTexture(texture) {
          GLImmediate.TexEnvJIT.hook_activeTexture(texture);
          glActiveTexture(texture);
        };
        
  
        var glEnable = _glEnable;
        _glEnable = _emscripten_glEnable = function _glEnable(cap) {
          GLImmediate.TexEnvJIT.hook_enable(cap);
          glEnable(cap);
        };
        
  
        var glDisable = _glDisable;
        _glDisable = _emscripten_glDisable = function _glDisable(cap) {
          GLImmediate.TexEnvJIT.hook_disable(cap);
          glDisable(cap);
        };
        
  
        var glTexEnvf = (typeof(_glTexEnvf) != 'undefined') ? _glTexEnvf : function(){};
        _glTexEnvf = _emscripten_glTexEnvf = function _glTexEnvf(target, pname, param) {
          GLImmediate.TexEnvJIT.hook_texEnvf(target, pname, param);
          // Don't call old func, since we are the implementor.
          //glTexEnvf(target, pname, param);
        };
        
  
        var glTexEnvi = (typeof(_glTexEnvi) != 'undefined') ? _glTexEnvi : function(){};
        _glTexEnvi = _emscripten_glTexEnvi = function _glTexEnvi(target, pname, param) {
          GLImmediate.TexEnvJIT.hook_texEnvi(target, pname, param);
          // Don't call old func, since we are the implementor.
          //glTexEnvi(target, pname, param);
        };
        
  
        var glTexEnvfv = (typeof(_glTexEnvfv) != 'undefined') ? _glTexEnvfv : function(){};
        _glTexEnvfv = _emscripten_glTexEnvfv = function _glTexEnvfv(target, pname, param) {
          GLImmediate.TexEnvJIT.hook_texEnvfv(target, pname, param);
          // Don't call old func, since we are the implementor.
          //glTexEnvfv(target, pname, param);
        };
        
  
        _glGetTexEnviv = function _glGetTexEnviv(target, pname, param) {
          GLImmediate.TexEnvJIT.hook_getTexEnviv(target, pname, param);
        };
        
  
        _glGetTexEnvfv = function _glGetTexEnvfv(target, pname, param) {
          GLImmediate.TexEnvJIT.hook_getTexEnvfv(target, pname, param);
        };
        
  
        var glGetIntegerv = _glGetIntegerv;
        _glGetIntegerv = _emscripten_glGetIntegerv = function _glGetIntegerv(pname, params) {
          switch (pname) {
            case 0x8B8D: { // GL_CURRENT_PROGRAM
              // Just query directly so we're working with WebGL objects.
              var cur = GLctx.getParameter(GLctx.CURRENT_PROGRAM);
              if (cur == GLImmediate.fixedFunctionProgram) {
                // Pretend we're not using a program.
                HEAP32[((params)>>2)]=0;
                return;
              }
              break;
            }
          }
          glGetIntegerv(pname, params);
        };
        
      },initted:false,init:function() {
        err('WARNING: using emscripten GL immediate mode emulation. This is very limited in what it supports');
        GLImmediate.initted = true;
  
        if (!Module.useWebGL) return; // a 2D canvas may be currently used TODO: make sure we are actually called in that case
  
        // User can override the maximum number of texture units that we emulate. Using fewer texture units increases runtime performance
        // slightly, so it is advantageous to choose as small value as needed.
        GLImmediate.MAX_TEXTURES = Module['GL_MAX_TEXTURE_IMAGE_UNITS'] || GLctx.getParameter(GLctx.MAX_TEXTURE_IMAGE_UNITS);
  
        GLImmediate.TexEnvJIT.init(GLctx, GLImmediate.MAX_TEXTURES);
  
        GLImmediate.NUM_ATTRIBUTES = 3 /*pos+normal+color attributes*/ + GLImmediate.MAX_TEXTURES;
        GLImmediate.clientAttributes = [];
        GLEmulation.enabledClientAttribIndices = [];
        for (var i = 0; i < GLImmediate.NUM_ATTRIBUTES; i++) {
          GLImmediate.clientAttributes.push({});
          GLEmulation.enabledClientAttribIndices.push(false);
        }
  
        // Initialize matrix library
        // When user sets a matrix, increment a 'version number' on the new data, and when rendering, submit
        // the matrices to the shader program only if they have an old version of the data.
        GLImmediate.matrix = [];
        GLImmediate.matrixStack = [];
        GLImmediate.matrixVersion = [];
        for (var i = 0; i < 2 + GLImmediate.MAX_TEXTURES; i++) { // Modelview, Projection, plus one matrix for each texture coordinate.
          GLImmediate.matrixStack.push([]);
          GLImmediate.matrixVersion.push(0);
          GLImmediate.matrix.push(GLImmediate.matrixLib.mat4.create());
          GLImmediate.matrixLib.mat4.identity(GLImmediate.matrix[i]);
        }
  
        // Renderer cache
        GLImmediate.rendererCache = GLImmediate.MapTreeLib.create();
  
        // Buffers for data
        GLImmediate.tempData = new Float32Array(GL.MAX_TEMP_BUFFER_SIZE >> 2);
        GLImmediate.indexData = new Uint16Array(GL.MAX_TEMP_BUFFER_SIZE >> 1);
  
        GLImmediate.vertexDataU8 = new Uint8Array(GLImmediate.tempData.buffer);
  
        GL.generateTempBuffers(true, GL.currentContext);
  
        GLImmediate.clientColor = new Float32Array([1, 1, 1, 1]);
      },prepareClientAttributes:function prepareClientAttributes(count, beginEnd) {
        // If no client attributes were modified since we were last called, do nothing. Note that this
        // does not work for glBegin/End, where we generate renderer components dynamically and then
        // disable them ourselves, but it does help with glDrawElements/Arrays.
        if (!GLImmediate.modifiedClientAttributes) {
          GLImmediate.vertexCounter = (GLImmediate.stride * count) / 4; // XXX assuming float
          return;
        }
        GLImmediate.modifiedClientAttributes = false;
  
        // The role of prepareClientAttributes is to examine the set of client-side vertex attribute buffers
        // that user code has submitted, and to prepare them to be uploaded to a VBO in GPU memory
        // (since WebGL does not support client-side rendering, i.e. rendering from vertex data in CPU memory)
        // User can submit vertex data generally in three different configurations:
        // 1. Fully planar: all attributes are in their own separate tightly-packed arrays in CPU memory.
        // 2. Fully interleaved: all attributes share a single array where data is interleaved something like (pos,uv,normal), (pos,uv,normal), ...
        // 3. Complex hybrid: Multiple separate arrays that either are sparsely strided, and/or partially interleave vertex attributes.
  
        // For simplicity, we support the case (2) as the fast case. For (1) and (3), we do a memory copy of the
        // vertex data here to prepare a relayouted buffer that is of the structure in case (2). The reason
        // for this is that it allows the emulation code to get away with using just one VBO buffer for rendering,
        // and not have to maintain multiple ones. Therefore cases (1) and (3) will be very slow, and case (2) is fast.
  
        // Detect which case we are in by using a quick heuristic by examining the strides of the buffers. If all the buffers have identical
        // stride, we assume we have case (2), otherwise we have something more complex.
        var clientStartPointer = 0x7FFFFFFF;
        var bytes = 0; // Total number of bytes taken up by a single vertex.
        var minStride = 0x7FFFFFFF;
        var maxStride = 0;
        var attributes = GLImmediate.liveClientAttributes;
        attributes.length = 0;
        for (var i = 0; i < 3+GLImmediate.MAX_TEXTURES; i++) {
          if (GLImmediate.enabledClientAttributes[i]) {
            var attr = GLImmediate.clientAttributes[i];
            attributes.push(attr);
            clientStartPointer = Math.min(clientStartPointer, attr.pointer);
            attr.sizeBytes = attr.size * GL.byteSizeByType[attr.type - GL.byteSizeByTypeRoot];
            bytes += attr.sizeBytes;
            minStride = Math.min(minStride, attr.stride);
            maxStride = Math.max(maxStride, attr.stride);
          }
        }
  
        if ((minStride != maxStride || maxStride < bytes) && !beginEnd) {
          // We are in cases (1) or (3): slow path, shuffle the data around into a single interleaved vertex buffer.
          // The immediate-mode glBegin()/glEnd() vertex submission gets automatically generated in appropriate layout,
          // so never need to come down this path if that was used.
          if (!GLImmediate.restrideBuffer) GLImmediate.restrideBuffer = _malloc(GL.MAX_TEMP_BUFFER_SIZE);
          var start = GLImmediate.restrideBuffer;
          bytes = 0;
          // calculate restrided offsets and total size
          for (var i = 0; i < attributes.length; i++) {
            var attr = attributes[i];
            var size = attr.sizeBytes;
            if (size % 4 != 0) size += 4 - (size % 4); // align everything
            attr.offset = bytes;
            bytes += size;
          }
          // copy out the data (we need to know the stride for that, and define attr.pointer)
          for (var i = 0; i < attributes.length; i++) {
            var attr = attributes[i];
            var srcStride = Math.max(attr.sizeBytes, attr.stride);
            if ((srcStride & 3) == 0 && (attr.sizeBytes & 3) == 0) {
              var size4 = attr.sizeBytes>>2;
              var srcStride4 = Math.max(attr.sizeBytes, attr.stride)>>2;
              for (var j = 0; j < count; j++) {
                for (var k = 0; k < size4; k++) { // copy in chunks of 4 bytes, our alignment makes this possible
                  HEAP32[((start + attr.offset + bytes*j)>>2) + k] = HEAP32[(attr.pointer>>2) + j*srcStride4 + k];
                }
              }
            } else {
              for (var j = 0; j < count; j++) {
                for (var k = 0; k < attr.sizeBytes; k++) { // source data was not aligned to multiples of 4, must copy byte by byte.
                  HEAP8[start + attr.offset + bytes*j + k] = HEAP8[attr.pointer + j*srcStride + k];
                }
              }
            }
            attr.pointer = start + attr.offset;
          }
          GLImmediate.stride = bytes;
          GLImmediate.vertexPointer = start;
        } else {
          // case (2): fast path, all data is interleaved to a single vertex array so we can get away with a single VBO upload.
          if (GLctx.currentArrayBufferBinding) {
            GLImmediate.vertexPointer = 0;
          } else {
            GLImmediate.vertexPointer = clientStartPointer;
          }
          for (var i = 0; i < attributes.length; i++) {
            var attr = attributes[i];
            attr.offset = attr.pointer - GLImmediate.vertexPointer; // Compute what will be the offset of this attribute in the VBO after we upload.
          }
          GLImmediate.stride = Math.max(maxStride, bytes);
        }
        if (!beginEnd) {
          GLImmediate.vertexCounter = (GLImmediate.stride * count) / 4; // XXX assuming float
        }
      },flush:function flush(numProvidedIndexes, startIndex, ptr) {
        assert(numProvidedIndexes >= 0 || !numProvidedIndexes);
        startIndex = startIndex || 0;
        ptr = ptr || 0;
  
        var renderer = GLImmediate.getRenderer();
  
        // Generate index data in a format suitable for GLES 2.0/WebGL
        var numVertexes = 4 * GLImmediate.vertexCounter / GLImmediate.stride;
        if (!numVertexes) return;
        assert(numVertexes % 1 == 0, "`numVertexes` must be an integer.");
        var emulatedElementArrayBuffer = false;
        var numIndexes = 0;
        if (numProvidedIndexes) {
          numIndexes = numProvidedIndexes;
          if (!GLctx.currentArrayBufferBinding && GLImmediate.firstVertex > GLImmediate.lastVertex) {
            // Figure out the first and last vertex from the index data
            // If we are going to upload array buffer data, we need to find which range to
            // upload based on the indices. If they are in a buffer on the GPU, that is very
            // inconvenient! So if you do not have an array buffer, you should also not have
            // an element array buffer. But best is to use both buffers!
            assert(!GLctx.currentElementArrayBufferBinding);
            for (var i = 0; i < numProvidedIndexes; i++) {
              var currIndex = HEAPU16[(((ptr)+(i*2))>>1)];
              GLImmediate.firstVertex = Math.min(GLImmediate.firstVertex, currIndex);
              GLImmediate.lastVertex = Math.max(GLImmediate.lastVertex, currIndex+1);
            }
          }
          if (!GLctx.currentElementArrayBufferBinding) {
            // If no element array buffer is bound, then indices is a literal pointer to clientside data
            assert(numProvidedIndexes << 1 <= GL.MAX_TEMP_BUFFER_SIZE, 'too many immediate mode indexes (a)');
            var indexBuffer = GL.getTempIndexBuffer(numProvidedIndexes << 1);
            GLctx.bindBuffer(GLctx.ELEMENT_ARRAY_BUFFER, indexBuffer);
            GLctx.bufferSubData(GLctx.ELEMENT_ARRAY_BUFFER, 0, HEAPU16.subarray((ptr)>>1,(ptr + (numProvidedIndexes << 1))>>1));
            ptr = 0;
            emulatedElementArrayBuffer = true;
          }
        } else if (GLImmediate.mode > 6) { // above GL_TRIANGLE_FAN are the non-GL ES modes
          if (GLImmediate.mode != 7) throw 'unsupported immediate mode ' + GLImmediate.mode; // GL_QUADS
          // GLImmediate.firstVertex is the first vertex we want. Quad indexes are in the pattern
          // 0 1 2, 0 2 3, 4 5 6, 4 6 7, so we need to look at index firstVertex * 1.5 to see it.
          // Then since indexes are 2 bytes each, that means 3
          assert(GLImmediate.firstVertex % 4 == 0);
          ptr = GLImmediate.firstVertex*3;
          var numQuads = numVertexes / 4;
          numIndexes = numQuads * 6; // 0 1 2, 0 2 3 pattern
          assert(ptr + (numIndexes << 1) <= GL.MAX_TEMP_BUFFER_SIZE, 'too many immediate mode indexes (b)');
          GLctx.bindBuffer(GLctx.ELEMENT_ARRAY_BUFFER, GL.currentContext.tempQuadIndexBuffer);
          emulatedElementArrayBuffer = true;
          GLImmediate.mode = GLctx.TRIANGLES;
        }
  
        renderer.prepare();
  
        if (numIndexes) {
          GLctx.drawElements(GLImmediate.mode, numIndexes, GLctx.UNSIGNED_SHORT, ptr);
        } else {
          GLctx.drawArrays(GLImmediate.mode, startIndex, numVertexes);
        }
  
        if (emulatedElementArrayBuffer) {
          GLctx.bindBuffer(GLctx.ELEMENT_ARRAY_BUFFER, GL.buffers[GLctx.currentElementArrayBufferBinding] || null);
        }
  
      }};
  GLImmediate.matrixLib = (function() {
  
  /**
   * @fileoverview gl-matrix - High performance matrix and vector operations for WebGL
   * @author Brandon Jones
   * @version 1.2.4
   */
  
  // Modifed for emscripten: Global scoping etc.
  
  /*
   * Copyright (c) 2011 Brandon Jones
   *
   * This software is provided 'as-is', without any express or implied
   * warranty. In no event will the authors be held liable for any damages
   * arising from the use of this software.
   *
   * Permission is granted to anyone to use this software for any purpose,
   * including commercial applications, and to alter it and redistribute it
   * freely, subject to the following restrictions:
   *
   *    1. The origin of this software must not be misrepresented; you must not
   *    claim that you wrote the original software. If you use this software
   *    in a product, an acknowledgment in the product documentation would be
   *    appreciated but is not required.
   *
   *    2. Altered source versions must be plainly marked as such, and must not
   *    be misrepresented as being the original software.
   *
   *    3. This notice may not be removed or altered from any source
   *    distribution.
   */
  
  
  /**
   * @class 3 Dimensional Vector
   * @name vec3
   */
  var vec3 = {};
  
  /**
   * @class 3x3 Matrix
   * @name mat3
   */
  var mat3 = {};
  
  /**
   * @class 4x4 Matrix
   * @name mat4
   */
  var mat4 = {};
  
  /**
   * @class Quaternion
   * @name quat4
   */
  var quat4 = {};
  
  var MatrixArray = Float32Array;
  
  /*
   * vec3
   */
  
  /**
   * Creates a new instance of a vec3 using the default array type
   * Any javascript array-like objects containing at least 3 numeric elements can serve as a vec3
   *
   * @param {vec3} [vec] vec3 containing values to initialize with
   *
   * @returns {vec3} New vec3
   */
  vec3.create = function (vec) {
      var dest = new MatrixArray(3);
  
      if (vec) {
          dest[0] = vec[0];
          dest[1] = vec[1];
          dest[2] = vec[2];
      } else {
          dest[0] = dest[1] = dest[2] = 0;
      }
  
      return dest;
  };
  
  /**
   * Copies the values of one vec3 to another
   *
   * @param {vec3} vec vec3 containing values to copy
   * @param {vec3} dest vec3 receiving copied values
   *
   * @returns {vec3} dest
   */
  vec3.set = function (vec, dest) {
      dest[0] = vec[0];
      dest[1] = vec[1];
      dest[2] = vec[2];
  
      return dest;
  };
  
  /**
   * Performs a vector addition
   *
   * @param {vec3} vec First operand
   * @param {vec3} vec2 Second operand
   * @param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
   *
   * @returns {vec3} dest if specified, vec otherwise
   */
  vec3.add = function (vec, vec2, dest) {
      if (!dest || vec === dest) {
          vec[0] += vec2[0];
          vec[1] += vec2[1];
          vec[2] += vec2[2];
          return vec;
      }
  
      dest[0] = vec[0] + vec2[0];
      dest[1] = vec[1] + vec2[1];
      dest[2] = vec[2] + vec2[2];
      return dest;
  };
  
  /**
   * Performs a vector subtraction
   *
   * @param {vec3} vec First operand
   * @param {vec3} vec2 Second operand
   * @param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
   *
   * @returns {vec3} dest if specified, vec otherwise
   */
  vec3.subtract = function (vec, vec2, dest) {
      if (!dest || vec === dest) {
          vec[0] -= vec2[0];
          vec[1] -= vec2[1];
          vec[2] -= vec2[2];
          return vec;
      }
  
      dest[0] = vec[0] - vec2[0];
      dest[1] = vec[1] - vec2[1];
      dest[2] = vec[2] - vec2[2];
      return dest;
  };
  
  /**
   * Performs a vector multiplication
   *
   * @param {vec3} vec First operand
   * @param {vec3} vec2 Second operand
   * @param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
   *
   * @returns {vec3} dest if specified, vec otherwise
   */
  vec3.multiply = function (vec, vec2, dest) {
      if (!dest || vec === dest) {
          vec[0] *= vec2[0];
          vec[1] *= vec2[1];
          vec[2] *= vec2[2];
          return vec;
      }
  
      dest[0] = vec[0] * vec2[0];
      dest[1] = vec[1] * vec2[1];
      dest[2] = vec[2] * vec2[2];
      return dest;
  };
  
  /**
   * Negates the components of a vec3
   *
   * @param {vec3} vec vec3 to negate
   * @param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
   *
   * @returns {vec3} dest if specified, vec otherwise
   */
  vec3.negate = function (vec, dest) {
      if (!dest) { dest = vec; }
  
      dest[0] = -vec[0];
      dest[1] = -vec[1];
      dest[2] = -vec[2];
      return dest;
  };
  
  /**
   * Multiplies the components of a vec3 by a scalar value
   *
   * @param {vec3} vec vec3 to scale
   * @param {number} val Value to scale by
   * @param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
   *
   * @returns {vec3} dest if specified, vec otherwise
   */
  vec3.scale = function (vec, val, dest) {
      if (!dest || vec === dest) {
          vec[0] *= val;
          vec[1] *= val;
          vec[2] *= val;
          return vec;
      }
  
      dest[0] = vec[0] * val;
      dest[1] = vec[1] * val;
      dest[2] = vec[2] * val;
      return dest;
  };
  
  /**
   * Generates a unit vector of the same direction as the provided vec3
   * If vector length is 0, returns [0, 0, 0]
   *
   * @param {vec3} vec vec3 to normalize
   * @param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
   *
   * @returns {vec3} dest if specified, vec otherwise
   */
  vec3.normalize = function (vec, dest) {
      if (!dest) { dest = vec; }
  
      var x = vec[0], y = vec[1], z = vec[2],
          len = Math.sqrt(x * x + y * y + z * z);
  
      if (!len) {
          dest[0] = 0;
          dest[1] = 0;
          dest[2] = 0;
          return dest;
      } else if (len === 1) {
          dest[0] = x;
          dest[1] = y;
          dest[2] = z;
          return dest;
      }
  
      len = 1 / len;
      dest[0] = x * len;
      dest[1] = y * len;
      dest[2] = z * len;
      return dest;
  };
  
  /**
   * Generates the cross product of two vec3s
   *
   * @param {vec3} vec First operand
   * @param {vec3} vec2 Second operand
   * @param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
   *
   * @returns {vec3} dest if specified, vec otherwise
   */
  vec3.cross = function (vec, vec2, dest) {
      if (!dest) { dest = vec; }
  
      var x = vec[0], y = vec[1], z = vec[2],
          x2 = vec2[0], y2 = vec2[1], z2 = vec2[2];
  
      dest[0] = y * z2 - z * y2;
      dest[1] = z * x2 - x * z2;
      dest[2] = x * y2 - y * x2;
      return dest;
  };
  
  /**
   * Caclulates the length of a vec3
   *
   * @param {vec3} vec vec3 to calculate length of
   *
   * @returns {number} Length of vec
   */
  vec3.length = function (vec) {
      var x = vec[0], y = vec[1], z = vec[2];
      return Math.sqrt(x * x + y * y + z * z);
  };
  
  /**
   * Caclulates the dot product of two vec3s
   *
   * @param {vec3} vec First operand
   * @param {vec3} vec2 Second operand
   *
   * @returns {number} Dot product of vec and vec2
   */
  vec3.dot = function (vec, vec2) {
      return vec[0] * vec2[0] + vec[1] * vec2[1] + vec[2] * vec2[2];
  };
  
  /**
   * Generates a unit vector pointing from one vector to another
   *
   * @param {vec3} vec Origin vec3
   * @param {vec3} vec2 vec3 to point to
   * @param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
   *
   * @returns {vec3} dest if specified, vec otherwise
   */
  vec3.direction = function (vec, vec2, dest) {
      if (!dest) { dest = vec; }
  
      var x = vec[0] - vec2[0],
          y = vec[1] - vec2[1],
          z = vec[2] - vec2[2],
          len = Math.sqrt(x * x + y * y + z * z);
  
      if (!len) {
          dest[0] = 0;
          dest[1] = 0;
          dest[2] = 0;
          return dest;
      }
  
      len = 1 / len;
      dest[0] = x * len;
      dest[1] = y * len;
      dest[2] = z * len;
      return dest;
  };
  
  /**
   * Performs a linear interpolation between two vec3
   *
   * @param {vec3} vec First vector
   * @param {vec3} vec2 Second vector
   * @param {number} lerp Interpolation amount between the two inputs
   * @param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
   *
   * @returns {vec3} dest if specified, vec otherwise
   */
  vec3.lerp = function (vec, vec2, lerp, dest) {
      if (!dest) { dest = vec; }
  
      dest[0] = vec[0] + lerp * (vec2[0] - vec[0]);
      dest[1] = vec[1] + lerp * (vec2[1] - vec[1]);
      dest[2] = vec[2] + lerp * (vec2[2] - vec[2]);
  
      return dest;
  };
  
  /**
   * Calculates the euclidian distance between two vec3
   *
   * Params:
   * @param {vec3} vec First vector
   * @param {vec3} vec2 Second vector
   *
   * @returns {number} Distance between vec and vec2
   */
  vec3.dist = function (vec, vec2) {
      var x = vec2[0] - vec[0],
          y = vec2[1] - vec[1],
          z = vec2[2] - vec[2];
  
      return Math.sqrt(x*x + y*y + z*z);
  };
  
  /**
   * Projects the specified vec3 from screen space into object space
   * Based on the <a href="http://webcvs.freedesktop.org/mesa/Mesa/src/glu/mesa/project.c?revision=1.4&view=markup">Mesa gluUnProject implementation</a>
   *
   * @param {vec3} vec Screen-space vector to project
   * @param {mat4} view View matrix
   * @param {mat4} proj Projection matrix
   * @param {vec4} viewport Viewport as given to gl.viewport [x, y, width, height]
   * @param {vec3} [dest] vec3 receiving unprojected result. If not specified result is written to vec
   *
   * @returns {vec3} dest if specified, vec otherwise
   */
  vec3.unproject = function (vec, view, proj, viewport, dest) {
      if (!dest) { dest = vec; }
  
      var m = mat4.create();
      var v = new MatrixArray(4);
  
      v[0] = (vec[0] - viewport[0]) * 2.0 / viewport[2] - 1.0;
      v[1] = (vec[1] - viewport[1]) * 2.0 / viewport[3] - 1.0;
      v[2] = 2.0 * vec[2] - 1.0;
      v[3] = 1.0;
  
      mat4.multiply(proj, view, m);
      if(!mat4.inverse(m)) { return null; }
  
      mat4.multiplyVec4(m, v);
      if(v[3] === 0.0) { return null; }
  
      dest[0] = v[0] / v[3];
      dest[1] = v[1] / v[3];
      dest[2] = v[2] / v[3];
  
      return dest;
  };
  
  /**
   * Returns a string representation of a vector
   *
   * @param {vec3} vec Vector to represent as a string
   *
   * @returns {string} String representation of vec
   */
  vec3.str = function (vec) {
      return '[' + vec[0] + ', ' + vec[1] + ', ' + vec[2] + ']';
  };
  
  /*
   * mat3
   */
  
  /**
   * Creates a new instance of a mat3 using the default array type
   * Any javascript array-like object containing at least 9 numeric elements can serve as a mat3
   *
   * @param {mat3} [mat] mat3 containing values to initialize with
   *
   * @returns {mat3} New mat3
   */
  mat3.create = function (mat) {
      var dest = new MatrixArray(9);
  
      if (mat) {
          dest[0] = mat[0];
          dest[1] = mat[1];
          dest[2] = mat[2];
          dest[3] = mat[3];
          dest[4] = mat[4];
          dest[5] = mat[5];
          dest[6] = mat[6];
          dest[7] = mat[7];
          dest[8] = mat[8];
      }
  
      return dest;
  };
  
  /**
   * Copies the values of one mat3 to another
   *
   * @param {mat3} mat mat3 containing values to copy
   * @param {mat3} dest mat3 receiving copied values
   *
   * @returns {mat3} dest
   */
  mat3.set = function (mat, dest) {
      dest[0] = mat[0];
      dest[1] = mat[1];
      dest[2] = mat[2];
      dest[3] = mat[3];
      dest[4] = mat[4];
      dest[5] = mat[5];
      dest[6] = mat[6];
      dest[7] = mat[7];
      dest[8] = mat[8];
      return dest;
  };
  
  /**
   * Sets a mat3 to an identity matrix
   *
   * @param {mat3} dest mat3 to set
   *
   * @returns dest if specified, otherwise a new mat3
   */
  mat3.identity = function (dest) {
      if (!dest) { dest = mat3.create(); }
      dest[0] = 1;
      dest[1] = 0;
      dest[2] = 0;
      dest[3] = 0;
      dest[4] = 1;
      dest[5] = 0;
      dest[6] = 0;
      dest[7] = 0;
      dest[8] = 1;
      return dest;
  };
  
  /**
   * Transposes a mat3 (flips the values over the diagonal)
   *
   * Params:
   * @param {mat3} mat mat3 to transpose
   * @param {mat3} [dest] mat3 receiving transposed values. If not specified result is written to mat
   */
  mat3.transpose = function (mat, dest) {
      // If we are transposing ourselves we can skip a few steps but have to cache some values
      if (!dest || mat === dest) {
          var a01 = mat[1], a02 = mat[2],
              a12 = mat[5];
  
          mat[1] = mat[3];
          mat[2] = mat[6];
          mat[3] = a01;
          mat[5] = mat[7];
          mat[6] = a02;
          mat[7] = a12;
          return mat;
      }
  
      dest[0] = mat[0];
      dest[1] = mat[3];
      dest[2] = mat[6];
      dest[3] = mat[1];
      dest[4] = mat[4];
      dest[5] = mat[7];
      dest[6] = mat[2];
      dest[7] = mat[5];
      dest[8] = mat[8];
      return dest;
  };
  
  /**
   * Copies the elements of a mat3 into the upper 3x3 elements of a mat4
   *
   * @param {mat3} mat mat3 containing values to copy
   * @param {mat4} [dest] mat4 receiving copied values
   *
   * @returns {mat4} dest if specified, a new mat4 otherwise
   */
  mat3.toMat4 = function (mat, dest) {
      if (!dest) { dest = mat4.create(); }
  
      dest[15] = 1;
      dest[14] = 0;
      dest[13] = 0;
      dest[12] = 0;
  
      dest[11] = 0;
      dest[10] = mat[8];
      dest[9] = mat[7];
      dest[8] = mat[6];
  
      dest[7] = 0;
      dest[6] = mat[5];
      dest[5] = mat[4];
      dest[4] = mat[3];
  
      dest[3] = 0;
      dest[2] = mat[2];
      dest[1] = mat[1];
      dest[0] = mat[0];
  
      return dest;
  };
  
  /**
   * Returns a string representation of a mat3
   *
   * @param {mat3} mat mat3 to represent as a string
   *
   * @param {string} String representation of mat
   */
  mat3.str = function (mat) {
      return '[' + mat[0] + ', ' + mat[1] + ', ' + mat[2] +
          ', ' + mat[3] + ', ' + mat[4] + ', ' + mat[5] +
          ', ' + mat[6] + ', ' + mat[7] + ', ' + mat[8] + ']';
  };
  
  /*
   * mat4
   */
  
  /**
   * Creates a new instance of a mat4 using the default array type
   * Any javascript array-like object containing at least 16 numeric elements can serve as a mat4
   *
   * @param {mat4} [mat] mat4 containing values to initialize with
   *
   * @returns {mat4} New mat4
   */
  mat4.create = function (mat) {
      var dest = new MatrixArray(16);
  
      if (mat) {
          dest[0] = mat[0];
          dest[1] = mat[1];
          dest[2] = mat[2];
          dest[3] = mat[3];
          dest[4] = mat[4];
          dest[5] = mat[5];
          dest[6] = mat[6];
          dest[7] = mat[7];
          dest[8] = mat[8];
          dest[9] = mat[9];
          dest[10] = mat[10];
          dest[11] = mat[11];
          dest[12] = mat[12];
          dest[13] = mat[13];
          dest[14] = mat[14];
          dest[15] = mat[15];
      }
  
      return dest;
  };
  
  /**
   * Copies the values of one mat4 to another
   *
   * @param {mat4} mat mat4 containing values to copy
   * @param {mat4} dest mat4 receiving copied values
   *
   * @returns {mat4} dest
   */
  mat4.set = function (mat, dest) {
      dest[0] = mat[0];
      dest[1] = mat[1];
      dest[2] = mat[2];
      dest[3] = mat[3];
      dest[4] = mat[4];
      dest[5] = mat[5];
      dest[6] = mat[6];
      dest[7] = mat[7];
      dest[8] = mat[8];
      dest[9] = mat[9];
      dest[10] = mat[10];
      dest[11] = mat[11];
      dest[12] = mat[12];
      dest[13] = mat[13];
      dest[14] = mat[14];
      dest[15] = mat[15];
      return dest;
  };
  
  /**
   * Sets a mat4 to an identity matrix
   *
   * @param {mat4} dest mat4 to set
   *
   * @returns {mat4} dest
   */
  mat4.identity = function (dest) {
      if (!dest) { dest = mat4.create(); }
      dest[0] = 1;
      dest[1] = 0;
      dest[2] = 0;
      dest[3] = 0;
      dest[4] = 0;
      dest[5] = 1;
      dest[6] = 0;
      dest[7] = 0;
      dest[8] = 0;
      dest[9] = 0;
      dest[10] = 1;
      dest[11] = 0;
      dest[12] = 0;
      dest[13] = 0;
      dest[14] = 0;
      dest[15] = 1;
      return dest;
  };
  
  /**
   * Transposes a mat4 (flips the values over the diagonal)
   *
   * @param {mat4} mat mat4 to transpose
   * @param {mat4} [dest] mat4 receiving transposed values. If not specified result is written to mat
   */
  mat4.transpose = function (mat, dest) {
      // If we are transposing ourselves we can skip a few steps but have to cache some values
      if (!dest || mat === dest) {
          var a01 = mat[1], a02 = mat[2], a03 = mat[3],
              a12 = mat[6], a13 = mat[7],
              a23 = mat[11];
  
          mat[1] = mat[4];
          mat[2] = mat[8];
          mat[3] = mat[12];
          mat[4] = a01;
          mat[6] = mat[9];
          mat[7] = mat[13];
          mat[8] = a02;
          mat[9] = a12;
          mat[11] = mat[14];
          mat[12] = a03;
          mat[13] = a13;
          mat[14] = a23;
          return mat;
      }
  
      dest[0] = mat[0];
      dest[1] = mat[4];
      dest[2] = mat[8];
      dest[3] = mat[12];
      dest[4] = mat[1];
      dest[5] = mat[5];
      dest[6] = mat[9];
      dest[7] = mat[13];
      dest[8] = mat[2];
      dest[9] = mat[6];
      dest[10] = mat[10];
      dest[11] = mat[14];
      dest[12] = mat[3];
      dest[13] = mat[7];
      dest[14] = mat[11];
      dest[15] = mat[15];
      return dest;
  };
  
  /**
   * Calculates the determinant of a mat4
   *
   * @param {mat4} mat mat4 to calculate determinant of
   *
   * @returns {number} determinant of mat
   */
  mat4.determinant = function (mat) {
      // Cache the matrix values (makes for huge speed increases!)
      var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3],
          a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7],
          a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11],
          a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15];
  
      return (a30 * a21 * a12 * a03 - a20 * a31 * a12 * a03 - a30 * a11 * a22 * a03 + a10 * a31 * a22 * a03 +
              a20 * a11 * a32 * a03 - a10 * a21 * a32 * a03 - a30 * a21 * a02 * a13 + a20 * a31 * a02 * a13 +
              a30 * a01 * a22 * a13 - a00 * a31 * a22 * a13 - a20 * a01 * a32 * a13 + a00 * a21 * a32 * a13 +
              a30 * a11 * a02 * a23 - a10 * a31 * a02 * a23 - a30 * a01 * a12 * a23 + a00 * a31 * a12 * a23 +
              a10 * a01 * a32 * a23 - a00 * a11 * a32 * a23 - a20 * a11 * a02 * a33 + a10 * a21 * a02 * a33 +
              a20 * a01 * a12 * a33 - a00 * a21 * a12 * a33 - a10 * a01 * a22 * a33 + a00 * a11 * a22 * a33);
  };
  
  /**
   * Calculates the inverse matrix of a mat4
   *
   * @param {mat4} mat mat4 to calculate inverse of
   * @param {mat4} [dest] mat4 receiving inverse matrix. If not specified result is written to mat, null if matrix cannot be inverted
   */
  mat4.inverse = function (mat, dest) {
      if (!dest) { dest = mat; }
  
      // Cache the matrix values (makes for huge speed increases!)
      var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3],
          a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7],
          a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11],
          a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15],
  
          b00 = a00 * a11 - a01 * a10,
          b01 = a00 * a12 - a02 * a10,
          b02 = a00 * a13 - a03 * a10,
          b03 = a01 * a12 - a02 * a11,
          b04 = a01 * a13 - a03 * a11,
          b05 = a02 * a13 - a03 * a12,
          b06 = a20 * a31 - a21 * a30,
          b07 = a20 * a32 - a22 * a30,
          b08 = a20 * a33 - a23 * a30,
          b09 = a21 * a32 - a22 * a31,
          b10 = a21 * a33 - a23 * a31,
          b11 = a22 * a33 - a23 * a32,
  
          d = (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06),
          invDet;
  
          // Calculate the determinant
          if (!d) { return null; }
          invDet = 1 / d;
  
      dest[0] = (a11 * b11 - a12 * b10 + a13 * b09) * invDet;
      dest[1] = (-a01 * b11 + a02 * b10 - a03 * b09) * invDet;
      dest[2] = (a31 * b05 - a32 * b04 + a33 * b03) * invDet;
      dest[3] = (-a21 * b05 + a22 * b04 - a23 * b03) * invDet;
      dest[4] = (-a10 * b11 + a12 * b08 - a13 * b07) * invDet;
      dest[5] = (a00 * b11 - a02 * b08 + a03 * b07) * invDet;
      dest[6] = (-a30 * b05 + a32 * b02 - a33 * b01) * invDet;
      dest[7] = (a20 * b05 - a22 * b02 + a23 * b01) * invDet;
      dest[8] = (a10 * b10 - a11 * b08 + a13 * b06) * invDet;
      dest[9] = (-a00 * b10 + a01 * b08 - a03 * b06) * invDet;
      dest[10] = (a30 * b04 - a31 * b02 + a33 * b00) * invDet;
      dest[11] = (-a20 * b04 + a21 * b02 - a23 * b00) * invDet;
      dest[12] = (-a10 * b09 + a11 * b07 - a12 * b06) * invDet;
      dest[13] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;
      dest[14] = (-a30 * b03 + a31 * b01 - a32 * b00) * invDet;
      dest[15] = (a20 * b03 - a21 * b01 + a22 * b00) * invDet;
  
      return dest;
  };
  
  /**
   * Copies the upper 3x3 elements of a mat4 into another mat4
   *
   * @param {mat4} mat mat4 containing values to copy
   * @param {mat4} [dest] mat4 receiving copied values
   *
   * @returns {mat4} dest is specified, a new mat4 otherwise
   */
  mat4.toRotationMat = function (mat, dest) {
      if (!dest) { dest = mat4.create(); }
  
      dest[0] = mat[0];
      dest[1] = mat[1];
      dest[2] = mat[2];
      dest[3] = mat[3];
      dest[4] = mat[4];
      dest[5] = mat[5];
      dest[6] = mat[6];
      dest[7] = mat[7];
      dest[8] = mat[8];
      dest[9] = mat[9];
      dest[10] = mat[10];
      dest[11] = mat[11];
      dest[12] = 0;
      dest[13] = 0;
      dest[14] = 0;
      dest[15] = 1;
  
      return dest;
  };
  
  /**
   * Copies the upper 3x3 elements of a mat4 into a mat3
   *
   * @param {mat4} mat mat4 containing values to copy
   * @param {mat3} [dest] mat3 receiving copied values
   *
   * @returns {mat3} dest is specified, a new mat3 otherwise
   */
  mat4.toMat3 = function (mat, dest) {
      if (!dest) { dest = mat3.create(); }
  
      dest[0] = mat[0];
      dest[1] = mat[1];
      dest[2] = mat[2];
      dest[3] = mat[4];
      dest[4] = mat[5];
      dest[5] = mat[6];
      dest[6] = mat[8];
      dest[7] = mat[9];
      dest[8] = mat[10];
  
      return dest;
  };
  
  /**
   * Calculates the inverse of the upper 3x3 elements of a mat4 and copies the result into a mat3
   * The resulting matrix is useful for calculating transformed normals
   *
   * Params:
   * @param {mat4} mat mat4 containing values to invert and copy
   * @param {mat3} [dest] mat3 receiving values
   *
   * @returns {mat3} dest is specified, a new mat3 otherwise, null if the matrix cannot be inverted
   */
  mat4.toInverseMat3 = function (mat, dest) {
      // Cache the matrix values (makes for huge speed increases!)
      var a00 = mat[0], a01 = mat[1], a02 = mat[2],
          a10 = mat[4], a11 = mat[5], a12 = mat[6],
          a20 = mat[8], a21 = mat[9], a22 = mat[10],
  
          b01 = a22 * a11 - a12 * a21,
          b11 = -a22 * a10 + a12 * a20,
          b21 = a21 * a10 - a11 * a20,
  
          d = a00 * b01 + a01 * b11 + a02 * b21,
          id;
  
      if (!d) { return null; }
      id = 1 / d;
  
      if (!dest) { dest = mat3.create(); }
  
      dest[0] = b01 * id;
      dest[1] = (-a22 * a01 + a02 * a21) * id;
      dest[2] = (a12 * a01 - a02 * a11) * id;
      dest[3] = b11 * id;
      dest[4] = (a22 * a00 - a02 * a20) * id;
      dest[5] = (-a12 * a00 + a02 * a10) * id;
      dest[6] = b21 * id;
      dest[7] = (-a21 * a00 + a01 * a20) * id;
      dest[8] = (a11 * a00 - a01 * a10) * id;
  
      return dest;
  };
  
  /**
   * Performs a matrix multiplication
   *
   * @param {mat4} mat First operand
   * @param {mat4} mat2 Second operand
   * @param {mat4} [dest] mat4 receiving operation result. If not specified result is written to mat
   */
  mat4.multiply = function (mat, mat2, dest) {
      if (!dest) { dest = mat; }
  
      // Cache the matrix values (makes for huge speed increases!)
      var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3],
          a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7],
          a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11],
          a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15],
  
          b00 = mat2[0], b01 = mat2[1], b02 = mat2[2], b03 = mat2[3],
          b10 = mat2[4], b11 = mat2[5], b12 = mat2[6], b13 = mat2[7],
          b20 = mat2[8], b21 = mat2[9], b22 = mat2[10], b23 = mat2[11],
          b30 = mat2[12], b31 = mat2[13], b32 = mat2[14], b33 = mat2[15];
  
      dest[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
      dest[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
      dest[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
      dest[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
      dest[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
      dest[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
      dest[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
      dest[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
      dest[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
      dest[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
      dest[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
      dest[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
      dest[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
      dest[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
      dest[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
      dest[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;
  
      return dest;
  };
  
  /**
   * Transforms a vec3 with the given matrix
   * 4th vector component is implicitly '1'
   *
   * @param {mat4} mat mat4 to transform the vector with
   * @param {vec3} vec vec3 to transform
   * @param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
   *
   * @returns {vec3} dest if specified, vec otherwise
   */
  mat4.multiplyVec3 = function (mat, vec, dest) {
      if (!dest) { dest = vec; }
  
      var x = vec[0], y = vec[1], z = vec[2];
  
      dest[0] = mat[0] * x + mat[4] * y + mat[8] * z + mat[12];
      dest[1] = mat[1] * x + mat[5] * y + mat[9] * z + mat[13];
      dest[2] = mat[2] * x + mat[6] * y + mat[10] * z + mat[14];
  
      return dest;
  };
  
  /**
   * Transforms a vec4 with the given matrix
   *
   * @param {mat4} mat mat4 to transform the vector with
   * @param {vec4} vec vec4 to transform
   * @param {vec4} [dest] vec4 receiving operation result. If not specified result is written to vec
   *
   * @returns {vec4} dest if specified, vec otherwise
   */
  mat4.multiplyVec4 = function (mat, vec, dest) {
      if (!dest) { dest = vec; }
  
      var x = vec[0], y = vec[1], z = vec[2], w = vec[3];
  
      dest[0] = mat[0] * x + mat[4] * y + mat[8] * z + mat[12] * w;
      dest[1] = mat[1] * x + mat[5] * y + mat[9] * z + mat[13] * w;
      dest[2] = mat[2] * x + mat[6] * y + mat[10] * z + mat[14] * w;
      dest[3] = mat[3] * x + mat[7] * y + mat[11] * z + mat[15] * w;
  
      return dest;
  };
  
  /**
   * Translates a matrix by the given vector
   *
   * @param {mat4} mat mat4 to translate
   * @param {vec3} vec vec3 specifying the translation
   * @param {mat4} [dest] mat4 receiving operation result. If not specified result is written to mat
   */
  mat4.translate = function (mat, vec, dest) {
      var x = vec[0], y = vec[1], z = vec[2],
          a00, a01, a02, a03,
          a10, a11, a12, a13,
          a20, a21, a22, a23;
  
      if (!dest || mat === dest) {
          mat[12] = mat[0] * x + mat[4] * y + mat[8] * z + mat[12];
          mat[13] = mat[1] * x + mat[5] * y + mat[9] * z + mat[13];
          mat[14] = mat[2] * x + mat[6] * y + mat[10] * z + mat[14];
          mat[15] = mat[3] * x + mat[7] * y + mat[11] * z + mat[15];
          return mat;
      }
  
      a00 = mat[0]; a01 = mat[1]; a02 = mat[2]; a03 = mat[3];
      a10 = mat[4]; a11 = mat[5]; a12 = mat[6]; a13 = mat[7];
      a20 = mat[8]; a21 = mat[9]; a22 = mat[10]; a23 = mat[11];
  
      dest[0] = a00; dest[1] = a01; dest[2] = a02; dest[3] = a03;
      dest[4] = a10; dest[5] = a11; dest[6] = a12; dest[7] = a13;
      dest[8] = a20; dest[9] = a21; dest[10] = a22; dest[11] = a23;
  
      dest[12] = a00 * x + a10 * y + a20 * z + mat[12];
      dest[13] = a01 * x + a11 * y + a21 * z + mat[13];
      dest[14] = a02 * x + a12 * y + a22 * z + mat[14];
      dest[15] = a03 * x + a13 * y + a23 * z + mat[15];
      return dest;
  };
  
  /**
   * Scales a matrix by the given vector
   *
   * @param {mat4} mat mat4 to scale
   * @param {vec3} vec vec3 specifying the scale for each axis
   * @param {mat4} [dest] mat4 receiving operation result. If not specified result is written to mat
   */
  mat4.scale = function (mat, vec, dest) {
      var x = vec[0], y = vec[1], z = vec[2];
  
      if (!dest || mat === dest) {
          mat[0] *= x;
          mat[1] *= x;
          mat[2] *= x;
          mat[3] *= x;
          mat[4] *= y;
          mat[5] *= y;
          mat[6] *= y;
          mat[7] *= y;
          mat[8] *= z;
          mat[9] *= z;
          mat[10] *= z;
          mat[11] *= z;
          return mat;
      }
  
      dest[0] = mat[0] * x;
      dest[1] = mat[1] * x;
      dest[2] = mat[2] * x;
      dest[3] = mat[3] * x;
      dest[4] = mat[4] * y;
      dest[5] = mat[5] * y;
      dest[6] = mat[6] * y;
      dest[7] = mat[7] * y;
      dest[8] = mat[8] * z;
      dest[9] = mat[9] * z;
      dest[10] = mat[10] * z;
      dest[11] = mat[11] * z;
      dest[12] = mat[12];
      dest[13] = mat[13];
      dest[14] = mat[14];
      dest[15] = mat[15];
      return dest;
  };
  
  /**
   * Rotates a matrix by the given angle around the specified axis
   * If rotating around a primary axis (X,Y,Z) one of the specialized rotation functions should be used instead for performance
   *
   * @param {mat4} mat mat4 to rotate
   * @param {number} angle Angle (in radians) to rotate
   * @param {vec3} axis vec3 representing the axis to rotate around
   * @param {mat4} [dest] mat4 receiving operation result. If not specified result is written to mat
   */
  mat4.rotate = function (mat, angle, axis, dest) {
      var x = axis[0], y = axis[1], z = axis[2],
          len = Math.sqrt(x * x + y * y + z * z),
          s, c, t,
          a00, a01, a02, a03,
          a10, a11, a12, a13,
          a20, a21, a22, a23,
          b00, b01, b02,
          b10, b11, b12,
          b20, b21, b22;
  
      if (!len) { return null; }
      if (len !== 1) {
          len = 1 / len;
          x *= len;
          y *= len;
          z *= len;
      }
  
      s = Math.sin(angle);
      c = Math.cos(angle);
      t = 1 - c;
  
      a00 = mat[0]; a01 = mat[1]; a02 = mat[2]; a03 = mat[3];
      a10 = mat[4]; a11 = mat[5]; a12 = mat[6]; a13 = mat[7];
      a20 = mat[8]; a21 = mat[9]; a22 = mat[10]; a23 = mat[11];
  
      // Construct the elements of the rotation matrix
      b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
      b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
      b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;
  
      if (!dest) {
          dest = mat;
      } else if (mat !== dest) { // If the source and destination differ, copy the unchanged last row
          dest[12] = mat[12];
          dest[13] = mat[13];
          dest[14] = mat[14];
          dest[15] = mat[15];
      }
  
      // Perform rotation-specific matrix multiplication
      dest[0] = a00 * b00 + a10 * b01 + a20 * b02;
      dest[1] = a01 * b00 + a11 * b01 + a21 * b02;
      dest[2] = a02 * b00 + a12 * b01 + a22 * b02;
      dest[3] = a03 * b00 + a13 * b01 + a23 * b02;
  
      dest[4] = a00 * b10 + a10 * b11 + a20 * b12;
      dest[5] = a01 * b10 + a11 * b11 + a21 * b12;
      dest[6] = a02 * b10 + a12 * b11 + a22 * b12;
      dest[7] = a03 * b10 + a13 * b11 + a23 * b12;
  
      dest[8] = a00 * b20 + a10 * b21 + a20 * b22;
      dest[9] = a01 * b20 + a11 * b21 + a21 * b22;
      dest[10] = a02 * b20 + a12 * b21 + a22 * b22;
      dest[11] = a03 * b20 + a13 * b21 + a23 * b22;
      return dest;
  };
  
  /**
   * Rotates a matrix by the given angle around the X axis
   *
   * @param {mat4} mat mat4 to rotate
   * @param {number} angle Angle (in radians) to rotate
   * @param {mat4} [dest] mat4 receiving operation result. If not specified result is written to mat
   */
  mat4.rotateX = function (mat, angle, dest) {
      var s = Math.sin(angle),
          c = Math.cos(angle),
          a10 = mat[4],
          a11 = mat[5],
          a12 = mat[6],
          a13 = mat[7],
          a20 = mat[8],
          a21 = mat[9],
          a22 = mat[10],
          a23 = mat[11];
  
      if (!dest) {
          dest = mat;
      } else if (mat !== dest) { // If the source and destination differ, copy the unchanged rows
          dest[0] = mat[0];
          dest[1] = mat[1];
          dest[2] = mat[2];
          dest[3] = mat[3];
  
          dest[12] = mat[12];
          dest[13] = mat[13];
          dest[14] = mat[14];
          dest[15] = mat[15];
      }
  
      // Perform axis-specific matrix multiplication
      dest[4] = a10 * c + a20 * s;
      dest[5] = a11 * c + a21 * s;
      dest[6] = a12 * c + a22 * s;
      dest[7] = a13 * c + a23 * s;
  
      dest[8] = a10 * -s + a20 * c;
      dest[9] = a11 * -s + a21 * c;
      dest[10] = a12 * -s + a22 * c;
      dest[11] = a13 * -s + a23 * c;
      return dest;
  };
  
  /**
   * Rotates a matrix by the given angle around the Y axis
   *
   * @param {mat4} mat mat4 to rotate
   * @param {number} angle Angle (in radians) to rotate
   * @param {mat4} [dest] mat4 receiving operation result. If not specified result is written to mat
   */
  mat4.rotateY = function (mat, angle, dest) {
      var s = Math.sin(angle),
          c = Math.cos(angle),
          a00 = mat[0],
          a01 = mat[1],
          a02 = mat[2],
          a03 = mat[3],
          a20 = mat[8],
          a21 = mat[9],
          a22 = mat[10],
          a23 = mat[11];
  
      if (!dest) {
          dest = mat;
      } else if (mat !== dest) { // If the source and destination differ, copy the unchanged rows
          dest[4] = mat[4];
          dest[5] = mat[5];
          dest[6] = mat[6];
          dest[7] = mat[7];
  
          dest[12] = mat[12];
          dest[13] = mat[13];
          dest[14] = mat[14];
          dest[15] = mat[15];
      }
  
      // Perform axis-specific matrix multiplication
      dest[0] = a00 * c + a20 * -s;
      dest[1] = a01 * c + a21 * -s;
      dest[2] = a02 * c + a22 * -s;
      dest[3] = a03 * c + a23 * -s;
  
      dest[8] = a00 * s + a20 * c;
      dest[9] = a01 * s + a21 * c;
      dest[10] = a02 * s + a22 * c;
      dest[11] = a03 * s + a23 * c;
      return dest;
  };
  
  /**
   * Rotates a matrix by the given angle around the Z axis
   *
   * @param {mat4} mat mat4 to rotate
   * @param {number} angle Angle (in radians) to rotate
   * @param {mat4} [dest] mat4 receiving operation result. If not specified result is written to mat
   */
  mat4.rotateZ = function (mat, angle, dest) {
      var s = Math.sin(angle),
          c = Math.cos(angle),
          a00 = mat[0],
          a01 = mat[1],
          a02 = mat[2],
          a03 = mat[3],
          a10 = mat[4],
          a11 = mat[5],
          a12 = mat[6],
          a13 = mat[7];
  
      if (!dest) {
          dest = mat;
      } else if (mat !== dest) { // If the source and destination differ, copy the unchanged last row
          dest[8] = mat[8];
          dest[9] = mat[9];
          dest[10] = mat[10];
          dest[11] = mat[11];
  
          dest[12] = mat[12];
          dest[13] = mat[13];
          dest[14] = mat[14];
          dest[15] = mat[15];
      }
  
      // Perform axis-specific matrix multiplication
      dest[0] = a00 * c + a10 * s;
      dest[1] = a01 * c + a11 * s;
      dest[2] = a02 * c + a12 * s;
      dest[3] = a03 * c + a13 * s;
  
      dest[4] = a00 * -s + a10 * c;
      dest[5] = a01 * -s + a11 * c;
      dest[6] = a02 * -s + a12 * c;
      dest[7] = a03 * -s + a13 * c;
  
      return dest;
  };
  
  /**
   * Generates a frustum matrix with the given bounds
   *
   * @param {number} left Left bound of the frustum
   * @param {number} right Right bound of the frustum
   * @param {number} bottom Bottom bound of the frustum
   * @param {number} top Top bound of the frustum
   * @param {number} near Near bound of the frustum
   * @param {number} far Far bound of the frustum
   * @param {mat4} [dest] mat4 frustum matrix will be written into
   *
   * @returns {mat4} dest if specified, a new mat4 otherwise
   */
  mat4.frustum = function (left, right, bottom, top, near, far, dest) {
      if (!dest) { dest = mat4.create(); }
      var rl = (right - left),
          tb = (top - bottom),
          fn = (far - near);
      dest[0] = (near * 2) / rl;
      dest[1] = 0;
      dest[2] = 0;
      dest[3] = 0;
      dest[4] = 0;
      dest[5] = (near * 2) / tb;
      dest[6] = 0;
      dest[7] = 0;
      dest[8] = (right + left) / rl;
      dest[9] = (top + bottom) / tb;
      dest[10] = -(far + near) / fn;
      dest[11] = -1;
      dest[12] = 0;
      dest[13] = 0;
      dest[14] = -(far * near * 2) / fn;
      dest[15] = 0;
      return dest;
  };
  
  /**
   * Generates a perspective projection matrix with the given bounds
   *
   * @param {number} fovy Vertical field of view
   * @param {number} aspect Aspect ratio. typically viewport width/height
   * @param {number} near Near bound of the frustum
   * @param {number} far Far bound of the frustum
   * @param {mat4} [dest] mat4 frustum matrix will be written into
   *
   * @returns {mat4} dest if specified, a new mat4 otherwise
   */
  mat4.perspective = function (fovy, aspect, near, far, dest) {
      var top = near * Math.tan(fovy * Math.PI / 360.0),
          right = top * aspect;
      return mat4.frustum(-right, right, -top, top, near, far, dest);
  };
  
  /**
   * Generates a orthogonal projection matrix with the given bounds
   *
   * @param {number} left Left bound of the frustum
   * @param {number} right Right bound of the frustum
   * @param {number} bottom Bottom bound of the frustum
   * @param {number} top Top bound of the frustum
   * @param {number} near Near bound of the frustum
   * @param {number} far Far bound of the frustum
   * @param {mat4} [dest] mat4 frustum matrix will be written into
   *
   * @returns {mat4} dest if specified, a new mat4 otherwise
   */
  mat4.ortho = function (left, right, bottom, top, near, far, dest) {
      if (!dest) { dest = mat4.create(); }
      var rl = (right - left),
          tb = (top - bottom),
          fn = (far - near);
      dest[0] = 2 / rl;
      dest[1] = 0;
      dest[2] = 0;
      dest[3] = 0;
      dest[4] = 0;
      dest[5] = 2 / tb;
      dest[6] = 0;
      dest[7] = 0;
      dest[8] = 0;
      dest[9] = 0;
      dest[10] = -2 / fn;
      dest[11] = 0;
      dest[12] = -(left + right) / rl;
      dest[13] = -(top + bottom) / tb;
      dest[14] = -(far + near) / fn;
      dest[15] = 1;
      return dest;
  };
  
  /**
   * Generates a look-at matrix with the given eye position, focal point, and up axis
   *
   * @param {vec3} eye Position of the viewer
   * @param {vec3} center Point the viewer is looking at
   * @param {vec3} up vec3 pointing "up"
   * @param {mat4} [dest] mat4 frustum matrix will be written into
   *
   * @returns {mat4} dest if specified, a new mat4 otherwise
   */
  mat4.lookAt = function (eye, center, up, dest) {
      if (!dest) { dest = mat4.create(); }
  
      var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
          eyex = eye[0],
          eyey = eye[1],
          eyez = eye[2],
          upx = up[0],
          upy = up[1],
          upz = up[2],
          centerx = center[0],
          centery = center[1],
          centerz = center[2];
  
      if (eyex === centerx && eyey === centery && eyez === centerz) {
          return mat4.identity(dest);
      }
  
      //vec3.direction(eye, center, z);
      z0 = eyex - centerx;
      z1 = eyey - centery;
      z2 = eyez - centerz;
  
      // normalize (no check needed for 0 because of early return)
      len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
      z0 *= len;
      z1 *= len;
      z2 *= len;
  
      //vec3.normalize(vec3.cross(up, z, x));
      x0 = upy * z2 - upz * z1;
      x1 = upz * z0 - upx * z2;
      x2 = upx * z1 - upy * z0;
      len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
      if (!len) {
          x0 = 0;
          x1 = 0;
          x2 = 0;
      } else {
          len = 1 / len;
          x0 *= len;
          x1 *= len;
          x2 *= len;
      }
  
      //vec3.normalize(vec3.cross(z, x, y));
      y0 = z1 * x2 - z2 * x1;
      y1 = z2 * x0 - z0 * x2;
      y2 = z0 * x1 - z1 * x0;
  
      len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
      if (!len) {
          y0 = 0;
          y1 = 0;
          y2 = 0;
      } else {
          len = 1 / len;
          y0 *= len;
          y1 *= len;
          y2 *= len;
      }
  
      dest[0] = x0;
      dest[1] = y0;
      dest[2] = z0;
      dest[3] = 0;
      dest[4] = x1;
      dest[5] = y1;
      dest[6] = z1;
      dest[7] = 0;
      dest[8] = x2;
      dest[9] = y2;
      dest[10] = z2;
      dest[11] = 0;
      dest[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
      dest[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
      dest[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
      dest[15] = 1;
  
      return dest;
  };
  
  /**
   * Creates a matrix from a quaternion rotation and vector translation
   * This is equivalent to (but much faster than):
   *
   *     mat4.identity(dest);
   *     mat4.translate(dest, vec);
   *     var quatMat = mat4.create();
   *     quat4.toMat4(quat, quatMat);
   *     mat4.multiply(dest, quatMat);
   *
   * @param {quat4} quat Rotation quaternion
   * @param {vec3} vec Translation vector
   * @param {mat4} [dest] mat4 receiving operation result. If not specified result is written to a new mat4
   *
   * @returns {mat4} dest if specified, a new mat4 otherwise
   */
  mat4.fromRotationTranslation = function (quat, vec, dest) {
      if (!dest) { dest = mat4.create(); }
  
      // Quaternion math
      var x = quat[0], y = quat[1], z = quat[2], w = quat[3],
          x2 = x + x,
          y2 = y + y,
          z2 = z + z,
  
          xx = x * x2,
          xy = x * y2,
          xz = x * z2,
          yy = y * y2,
          yz = y * z2,
          zz = z * z2,
          wx = w * x2,
          wy = w * y2,
          wz = w * z2;
  
      dest[0] = 1 - (yy + zz);
      dest[1] = xy + wz;
      dest[2] = xz - wy;
      dest[3] = 0;
      dest[4] = xy - wz;
      dest[5] = 1 - (xx + zz);
      dest[6] = yz + wx;
      dest[7] = 0;
      dest[8] = xz + wy;
      dest[9] = yz - wx;
      dest[10] = 1 - (xx + yy);
      dest[11] = 0;
      dest[12] = vec[0];
      dest[13] = vec[1];
      dest[14] = vec[2];
      dest[15] = 1;
  
      return dest;
  };
  
  /**
   * Returns a string representation of a mat4
   *
   * @param {mat4} mat mat4 to represent as a string
   *
   * @returns {string} String representation of mat
   */
  mat4.str = function (mat) {
      return '[' + mat[0] + ', ' + mat[1] + ', ' + mat[2] + ', ' + mat[3] +
          ', ' + mat[4] + ', ' + mat[5] + ', ' + mat[6] + ', ' + mat[7] +
          ', ' + mat[8] + ', ' + mat[9] + ', ' + mat[10] + ', ' + mat[11] +
          ', ' + mat[12] + ', ' + mat[13] + ', ' + mat[14] + ', ' + mat[15] + ']';
  };
  
  /*
   * quat4
   */
  
  /**
   * Creates a new instance of a quat4 using the default array type
   * Any javascript array containing at least 4 numeric elements can serve as a quat4
   *
   * @param {quat4} [quat] quat4 containing values to initialize with
   *
   * @returns {quat4} New quat4
   */
  quat4.create = function (quat) {
      var dest = new MatrixArray(4);
  
      if (quat) {
          dest[0] = quat[0];
          dest[1] = quat[1];
          dest[2] = quat[2];
          dest[3] = quat[3];
      }
  
      return dest;
  };
  
  /**
   * Copies the values of one quat4 to another
   *
   * @param {quat4} quat quat4 containing values to copy
   * @param {quat4} dest quat4 receiving copied values
   *
   * @returns {quat4} dest
   */
  quat4.set = function (quat, dest) {
      dest[0] = quat[0];
      dest[1] = quat[1];
      dest[2] = quat[2];
      dest[3] = quat[3];
  
      return dest;
  };
  
  /**
   * Calculates the W component of a quat4 from the X, Y, and Z components.
   * Assumes that quaternion is 1 unit in length.
   * Any existing W component will be ignored.
   *
   * @param {quat4} quat quat4 to calculate W component of
   * @param {quat4} [dest] quat4 receiving calculated values. If not specified result is written to quat
   *
   * @returns {quat4} dest if specified, quat otherwise
   */
  quat4.calculateW = function (quat, dest) {
      var x = quat[0], y = quat[1], z = quat[2];
  
      if (!dest || quat === dest) {
          quat[3] = -Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
          return quat;
      }
      dest[0] = x;
      dest[1] = y;
      dest[2] = z;
      dest[3] = -Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
      return dest;
  };
  
  /**
   * Calculates the dot product of two quaternions
   *
   * @param {quat4} quat First operand
   * @param {quat4} quat2 Second operand
   *
   * @return {number} Dot product of quat and quat2
   */
  quat4.dot = function(quat, quat2){
      return quat[0]*quat2[0] + quat[1]*quat2[1] + quat[2]*quat2[2] + quat[3]*quat2[3];
  };
  
  /**
   * Calculates the inverse of a quat4
   *
   * @param {quat4} quat quat4 to calculate inverse of
   * @param {quat4} [dest] quat4 receiving inverse values. If not specified result is written to quat
   *
   * @returns {quat4} dest if specified, quat otherwise
   */
  quat4.inverse = function(quat, dest) {
      var q0 = quat[0], q1 = quat[1], q2 = quat[2], q3 = quat[3],
          dot = q0*q0 + q1*q1 + q2*q2 + q3*q3,
          invDot = dot ? 1.0/dot : 0;
  
      // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0
  
      if(!dest || quat === dest) {
          quat[0] *= -invDot;
          quat[1] *= -invDot;
          quat[2] *= -invDot;
          quat[3] *= invDot;
          return quat;
      }
      dest[0] = -quat[0]*invDot;
      dest[1] = -quat[1]*invDot;
      dest[2] = -quat[2]*invDot;
      dest[3] = quat[3]*invDot;
      return dest;
  };
  
  
  /**
   * Calculates the conjugate of a quat4
   * If the quaternion is normalized, this function is faster than quat4.inverse and produces the same result.
   *
   * @param {quat4} quat quat4 to calculate conjugate of
   * @param {quat4} [dest] quat4 receiving conjugate values. If not specified result is written to quat
   *
   * @returns {quat4} dest if specified, quat otherwise
   */
  quat4.conjugate = function (quat, dest) {
      if (!dest || quat === dest) {
          quat[0] *= -1;
          quat[1] *= -1;
          quat[2] *= -1;
          return quat;
      }
      dest[0] = -quat[0];
      dest[1] = -quat[1];
      dest[2] = -quat[2];
      dest[3] = quat[3];
      return dest;
  };
  
  /**
   * Calculates the length of a quat4
   *
   * Params:
   * @param {quat4} quat quat4 to calculate length of
   *
   * @returns Length of quat
   */
  quat4.length = function (quat) {
      var x = quat[0], y = quat[1], z = quat[2], w = quat[3];
      return Math.sqrt(x * x + y * y + z * z + w * w);
  };
  
  /**
   * Generates a unit quaternion of the same direction as the provided quat4
   * If quaternion length is 0, returns [0, 0, 0, 0]
   *
   * @param {quat4} quat quat4 to normalize
   * @param {quat4} [dest] quat4 receiving operation result. If not specified result is written to quat
   *
   * @returns {quat4} dest if specified, quat otherwise
   */
  quat4.normalize = function (quat, dest) {
      if (!dest) { dest = quat; }
  
      var x = quat[0], y = quat[1], z = quat[2], w = quat[3],
          len = Math.sqrt(x * x + y * y + z * z + w * w);
      if (len === 0) {
          dest[0] = 0;
          dest[1] = 0;
          dest[2] = 0;
          dest[3] = 0;
          return dest;
      }
      len = 1 / len;
      dest[0] = x * len;
      dest[1] = y * len;
      dest[2] = z * len;
      dest[3] = w * len;
  
      return dest;
  };
  
  /**
   * Performs quaternion addition
   *
   * @param {quat4} quat First operand
   * @param {quat4} quat2 Second operand
   * @param {quat4} [dest] quat4 receiving operation result. If not specified result is written to quat
   *
   * @returns {quat4} dest if specified, quat otherwise
   */
  quat4.add = function (quat, quat2, dest) {
      if(!dest || quat === dest) {
          quat[0] += quat2[0];
          quat[1] += quat2[1];
          quat[2] += quat2[2];
          quat[3] += quat2[3];
          return quat;
      }
      dest[0] = quat[0]+quat2[0];
      dest[1] = quat[1]+quat2[1];
      dest[2] = quat[2]+quat2[2];
      dest[3] = quat[3]+quat2[3];
      return dest;
  };
  
  /**
   * Performs a quaternion multiplication
   *
   * @param {quat4} quat First operand
   * @param {quat4} quat2 Second operand
   * @param {quat4} [dest] quat4 receiving operation result. If not specified result is written to quat
   *
   * @returns {quat4} dest if specified, quat otherwise
   */
  quat4.multiply = function (quat, quat2, dest) {
      if (!dest) { dest = quat; }
  
      var qax = quat[0], qay = quat[1], qaz = quat[2], qaw = quat[3],
          qbx = quat2[0], qby = quat2[1], qbz = quat2[2], qbw = quat2[3];
  
      dest[0] = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
      dest[1] = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
      dest[2] = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
      dest[3] = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
  
      return dest;
  };
  
  /**
   * Transforms a vec3 with the given quaternion
   *
   * @param {quat4} quat quat4 to transform the vector with
   * @param {vec3} vec vec3 to transform
   * @param {vec3} [dest] vec3 receiving operation result. If not specified result is written to vec
   *
   * @returns dest if specified, vec otherwise
   */
  quat4.multiplyVec3 = function (quat, vec, dest) {
      if (!dest) { dest = vec; }
  
      var x = vec[0], y = vec[1], z = vec[2],
          qx = quat[0], qy = quat[1], qz = quat[2], qw = quat[3],
  
          // calculate quat * vec
          ix = qw * x + qy * z - qz * y,
          iy = qw * y + qz * x - qx * z,
          iz = qw * z + qx * y - qy * x,
          iw = -qx * x - qy * y - qz * z;
  
      // calculate result * inverse quat
      dest[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
      dest[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
      dest[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
  
      return dest;
  };
  
  /**
   * Multiplies the components of a quaternion by a scalar value
   *
   * @param {quat4} quat to scale
   * @param {number} val Value to scale by
   * @param {quat4} [dest] quat4 receiving operation result. If not specified result is written to quat
   *
   * @returns {quat4} dest if specified, quat otherwise
   */
  quat4.scale = function (quat, val, dest) {
      if(!dest || quat === dest) {
          quat[0] *= val;
          quat[1] *= val;
          quat[2] *= val;
          quat[3] *= val;
          return quat;
      }
      dest[0] = quat[0]*val;
      dest[1] = quat[1]*val;
      dest[2] = quat[2]*val;
      dest[3] = quat[3]*val;
      return dest;
  };
  
  /**
   * Calculates a 3x3 matrix from the given quat4
   *
   * @param {quat4} quat quat4 to create matrix from
   * @param {mat3} [dest] mat3 receiving operation result
   *
   * @returns {mat3} dest if specified, a new mat3 otherwise
   */
  quat4.toMat3 = function (quat, dest) {
      if (!dest) { dest = mat3.create(); }
  
      var x = quat[0], y = quat[1], z = quat[2], w = quat[3],
          x2 = x + x,
          y2 = y + y,
          z2 = z + z,
  
          xx = x * x2,
          xy = x * y2,
          xz = x * z2,
          yy = y * y2,
          yz = y * z2,
          zz = z * z2,
          wx = w * x2,
          wy = w * y2,
          wz = w * z2;
  
      dest[0] = 1 - (yy + zz);
      dest[1] = xy + wz;
      dest[2] = xz - wy;
  
      dest[3] = xy - wz;
      dest[4] = 1 - (xx + zz);
      dest[5] = yz + wx;
  
      dest[6] = xz + wy;
      dest[7] = yz - wx;
      dest[8] = 1 - (xx + yy);
  
      return dest;
  };
  
  /**
   * Calculates a 4x4 matrix from the given quat4
   *
   * @param {quat4} quat quat4 to create matrix from
   * @param {mat4} [dest] mat4 receiving operation result
   *
   * @returns {mat4} dest if specified, a new mat4 otherwise
   */
  quat4.toMat4 = function (quat, dest) {
      if (!dest) { dest = mat4.create(); }
  
      var x = quat[0], y = quat[1], z = quat[2], w = quat[3],
          x2 = x + x,
          y2 = y + y,
          z2 = z + z,
  
          xx = x * x2,
          xy = x * y2,
          xz = x * z2,
          yy = y * y2,
          yz = y * z2,
          zz = z * z2,
          wx = w * x2,
          wy = w * y2,
          wz = w * z2;
  
      dest[0] = 1 - (yy + zz);
      dest[1] = xy + wz;
      dest[2] = xz - wy;
      dest[3] = 0;
  
      dest[4] = xy - wz;
      dest[5] = 1 - (xx + zz);
      dest[6] = yz + wx;
      dest[7] = 0;
  
      dest[8] = xz + wy;
      dest[9] = yz - wx;
      dest[10] = 1 - (xx + yy);
      dest[11] = 0;
  
      dest[12] = 0;
      dest[13] = 0;
      dest[14] = 0;
      dest[15] = 1;
  
      return dest;
  };
  
  /**
   * Performs a spherical linear interpolation between two quat4
   *
   * @param {quat4} quat First quaternion
   * @param {quat4} quat2 Second quaternion
   * @param {number} slerp Interpolation amount between the two inputs
   * @param {quat4} [dest] quat4 receiving operation result. If not specified result is written to quat
   *
   * @returns {quat4} dest if specified, quat otherwise
   */
  quat4.slerp = function (quat, quat2, slerp, dest) {
      if (!dest) { dest = quat; }
  
      var cosHalfTheta = quat[0] * quat2[0] + quat[1] * quat2[1] + quat[2] * quat2[2] + quat[3] * quat2[3],
          halfTheta,
          sinHalfTheta,
          ratioA,
          ratioB;
  
      if (Math.abs(cosHalfTheta) >= 1.0) {
          if (dest !== quat) {
              dest[0] = quat[0];
              dest[1] = quat[1];
              dest[2] = quat[2];
              dest[3] = quat[3];
          }
          return dest;
      }
  
      halfTheta = Math.acos(cosHalfTheta);
      sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);
  
      if (Math.abs(sinHalfTheta) < 0.001) {
          dest[0] = (quat[0] * 0.5 + quat2[0] * 0.5);
          dest[1] = (quat[1] * 0.5 + quat2[1] * 0.5);
          dest[2] = (quat[2] * 0.5 + quat2[2] * 0.5);
          dest[3] = (quat[3] * 0.5 + quat2[3] * 0.5);
          return dest;
      }
  
      ratioA = Math.sin((1 - slerp) * halfTheta) / sinHalfTheta;
      ratioB = Math.sin(slerp * halfTheta) / sinHalfTheta;
  
      dest[0] = (quat[0] * ratioA + quat2[0] * ratioB);
      dest[1] = (quat[1] * ratioA + quat2[1] * ratioB);
      dest[2] = (quat[2] * ratioA + quat2[2] * ratioB);
      dest[3] = (quat[3] * ratioA + quat2[3] * ratioB);
  
      return dest;
  };
  
  /**
   * Returns a string representation of a quaternion
   *
   * @param {quat4} quat quat4 to represent as a string
   *
   * @returns {string} String representation of quat
   */
  quat4.str = function (quat) {
      return '[' + quat[0] + ', ' + quat[1] + ', ' + quat[2] + ', ' + quat[3] + ']';
  };
  
  
  return {
    vec3: vec3,
    mat3: mat3,
    mat4: mat4,
    quat4: quat4
  };
  
  })();
  
  ;
  var GLImmediateSetup={};function _emscripten_glBegin(mode) {
      // Push the old state:
      GLImmediate.enabledClientAttributes_preBegin = GLImmediate.enabledClientAttributes;
      GLImmediate.enabledClientAttributes = [];
  
      GLImmediate.clientAttributes_preBegin = GLImmediate.clientAttributes;
      GLImmediate.clientAttributes = []
      for (var i = 0; i < GLImmediate.clientAttributes_preBegin.length; i++) {
        GLImmediate.clientAttributes.push({});
      }
  
      GLImmediate.mode = mode;
      GLImmediate.vertexCounter = 0;
      var components = GLImmediate.rendererComponents = [];
      for (var i = 0; i < GLImmediate.NUM_ATTRIBUTES; i++) {
        components[i] = 0;
      }
      GLImmediate.rendererComponentPointer = 0;
      GLImmediate.vertexData = GLImmediate.tempData;
    }

  function _emscripten_glBeginQueryEXT(target, id) {
      GLctx.disjointTimerQueryExt['beginQueryEXT'](target, GL.timerQueriesEXT[id]);
    }

  function _emscripten_glBindAttribLocation(program, index, name) {
      GLctx.bindAttribLocation(GL.programs[program], index, UTF8ToString(name));
    }

  function _emscripten_glBindBuffer(target, buffer) {
      if (target == 0x8892 /*GL_ARRAY_BUFFER*/) {
        GLctx.currentArrayBufferBinding = buffer;
        GLImmediate.lastArrayBuffer = buffer;
      } else if (target == 0x8893 /*GL_ELEMENT_ARRAY_BUFFER*/) {
        GLctx.currentElementArrayBufferBinding = buffer;
      }
  
      GLctx.bindBuffer(target, GL.buffers[buffer]);
    }

  function _emscripten_glBindFramebuffer(target, framebuffer) {
  
      GLctx.bindFramebuffer(target, GL.framebuffers[framebuffer]);
  
    }

  function _emscripten_glBindProgram(type, id) {
      assert(id == 0);
    }

  function _emscripten_glBindRenderbuffer(target, renderbuffer) {
      GLctx.bindRenderbuffer(target, GL.renderbuffers[renderbuffer]);
    }

  function _emscripten_glBindTexture(target, texture) {
      GLctx.bindTexture(target, GL.textures[texture]);
    }

  
  
  function _glEnableClientState(cap) {
      var attrib = GLEmulation.getAttributeFromCapability(cap);
      if (attrib === null) {
        err('WARNING: unhandled clientstate: ' + cap);
        return;
      }
      if (!GLImmediate.enabledClientAttributes[attrib]) {
        GLImmediate.enabledClientAttributes[attrib] = true;
        GLImmediate.totalEnabledClientAttributes++;
        GLImmediate.currentRenderer = null; // Will need to change current renderer, since the set of active vertex pointers changed.
        // In GL_FFP_ONLY mode, attributes are bound to the same index in each FFP emulation shader, so we can immediately apply the change here.
        GL.enableVertexAttribArray(attrib);
        if (GLEmulation.currentVao) GLEmulation.currentVao.enabledClientStates[cap] = 1;
        GLImmediate.modifiedClientAttributes = true;
      }
    }function _emulGlBindVertexArray(vao) {
      // undo vao-related things, wipe the slate clean, both for vao of 0 or an actual vao
      GLEmulation.currentVao = null; // make sure the commands we run here are not recorded
      if (GLImmediate.lastRenderer) GLImmediate.lastRenderer.cleanup();
      _glBindBuffer(GLctx.ARRAY_BUFFER, 0); // XXX if one was there before we were bound?
      _glBindBuffer(GLctx.ELEMENT_ARRAY_BUFFER, 0);
      for (var vaa in GLEmulation.enabledVertexAttribArrays) {
        GLctx.disableVertexAttribArray(vaa);
      }
      GLEmulation.enabledVertexAttribArrays = {};
      GLImmediate.enabledClientAttributes = [0, 0];
      GLImmediate.totalEnabledClientAttributes = 0;
      GLImmediate.modifiedClientAttributes = true;
      if (vao) {
        // replay vao
        var info = GLEmulation.vaos[vao];
        _glBindBuffer(GLctx.ARRAY_BUFFER, info.arrayBuffer); // XXX overwrite current binding?
        _glBindBuffer(GLctx.ELEMENT_ARRAY_BUFFER, info.elementArrayBuffer);
        for (var vaa in info.enabledVertexAttribArrays) {
          _glEnableVertexAttribArray(vaa);
        }
        for (var vaa in info.vertexAttribPointers) {
          _glVertexAttribPointer.apply(null, info.vertexAttribPointers[vaa]);
        }
        for (var attrib in info.enabledClientStates) {
          _glEnableClientState(attrib|0);
        }
        GLEmulation.currentVao = info; // set currentVao last, so the commands we ran here were not recorded
      }
    }function _emscripten_glBindVertexArrayOES(vao) {
      _emulGlBindVertexArray(vao);
      var ibo = GLctx.getParameter(0x8895 /*ELEMENT_ARRAY_BUFFER_BINDING*/);
      GLctx.currentElementArrayBufferBinding = ibo ? (ibo.name | 0) : 0;
    }

  function _emscripten_glBlendColor(x0, x1, x2, x3) { GLctx['blendColor'](x0, x1, x2, x3) }

  function _emscripten_glBlendEquation(x0) { GLctx['blendEquation'](x0) }

  function _emscripten_glBlendEquationSeparate(x0, x1) { GLctx['blendEquationSeparate'](x0, x1) }

  function _emscripten_glBlendFunc(x0, x1) { GLctx['blendFunc'](x0, x1) }

  function _emscripten_glBlendFuncSeparate(x0, x1, x2, x3) { GLctx['blendFuncSeparate'](x0, x1, x2, x3) }

  function _emscripten_glBufferData(target, size, data, usage) {
      switch (usage) { // fix usages, WebGL 1 only has *_DRAW
        case 0x88E1: // GL_STREAM_READ
        case 0x88E2: // GL_STREAM_COPY
          usage = 0x88E0; // GL_STREAM_DRAW
          break;
        case 0x88E5: // GL_STATIC_READ
        case 0x88E6: // GL_STATIC_COPY
          usage = 0x88E4; // GL_STATIC_DRAW
          break;
        case 0x88E9: // GL_DYNAMIC_READ
        case 0x88EA: // GL_DYNAMIC_COPY
          usage = 0x88E8; // GL_DYNAMIC_DRAW
          break;
      }
  
        // N.b. here first form specifies a heap subarray, second form an integer size, so the ?: code here is polymorphic. It is advised to avoid
        // randomly mixing both uses in calling code, to avoid any potential JS engine JIT issues.
        GLctx.bufferData(target, data ? HEAPU8.subarray(data, data+size) : size, usage);
    }

  function _emscripten_glBufferSubData(target, offset, size, data) {
      GLctx.bufferSubData(target, offset, HEAPU8.subarray(data, data+size));
    }

  function _emscripten_glCheckFramebufferStatus(x0) { return GLctx['checkFramebufferStatus'](x0) }

  function _emscripten_glClear(x0) { GLctx['clear'](x0) }

  function _emscripten_glClearColor(x0, x1, x2, x3) { GLctx['clearColor'](x0, x1, x2, x3) }

  function _emscripten_glClearDepthf(x0) { GLctx['clearDepth'](x0) }

  function _emscripten_glClearStencil(x0) { GLctx['clearStencil'](x0) }

  function _emscripten_glClientActiveTexture(texture) {
      GLImmediate.clientActiveTexture = texture - 0x84C0; // GL_TEXTURE0
    }

  
  function _emscripten_glColor4f(r, g, b, a) {
      r = Math.max(Math.min(r, 1), 0);
      g = Math.max(Math.min(g, 1), 0);
      b = Math.max(Math.min(b, 1), 0);
      a = Math.max(Math.min(a, 1), 0);
  
      // TODO: make ub the default, not f, save a few mathops
      if (GLImmediate.mode >= 0) {
        var start = GLImmediate.vertexCounter << 2;
        GLImmediate.vertexDataU8[start + 0] = r * 255;
        GLImmediate.vertexDataU8[start + 1] = g * 255;
        GLImmediate.vertexDataU8[start + 2] = b * 255;
        GLImmediate.vertexDataU8[start + 3] = a * 255;
        GLImmediate.vertexCounter++;
        GLImmediate.addRendererComponent(GLImmediate.COLOR, 4, GLctx.UNSIGNED_BYTE);
      } else {
        GLImmediate.clientColor[0] = r;
        GLImmediate.clientColor[1] = g;
        GLImmediate.clientColor[2] = b;
        GLImmediate.clientColor[3] = a;
        GLctx.vertexAttrib4fv(GLImmediate.COLOR, GLImmediate.clientColor);
      }
    }function _emscripten_glColor3d(r, g, b) {
      _emscripten_glColor4f(r, g, b, 1);
    }

  function _emscripten_glColor3f(r, g, b) {
      _emscripten_glColor4f(r, g, b, 1);
    }

  function _emscripten_glColor3fv(p) {
      _emscripten_glColor3f(HEAPF32[((p)>>2)], HEAPF32[(((p)+(4))>>2)], HEAPF32[(((p)+(8))>>2)]);
    }

  
  function _emscripten_glColor4ub(r, g, b, a) {
      _emscripten_glColor4f((r&255)/255, (g&255)/255, (b&255)/255, (a&255)/255);
    }function _emscripten_glColor3ub(r, g, b) {
      _emscripten_glColor4ub(r, g, b, 255);
    }

  function _emscripten_glColor3ubv(p) {
      _emscripten_glColor3ub(HEAP8[((p)>>0)], HEAP8[(((p)+(1))>>0)], HEAP8[(((p)+(2))>>0)]);
    }

  
  function _emscripten_glColor4ui(r, g, b, a) {
      _emscripten_glColor4f((r>>>0)/4294967295, (g>>>0)/4294967295, (b>>>0)/4294967295, (a>>>0)/4294967295);
    }function _emscripten_glColor3ui(r, g, b) {
      _emscripten_glColor4ui(r, g, b, 4294967295);
    }

  function _emscripten_glColor3uiv(p) {
      _emscripten_glColor3ui(HEAP32[((p)>>2)], HEAP32[(((p)+(4))>>2)], HEAP32[(((p)+(8))>>2)]);
    }

  
  function _emscripten_glColor4us(r, g, b, a) {
      _emscripten_glColor4f((r&65535)/65535, (g&65535)/65535, (b&65535)/65535, (a&65535)/65535);
    }function _emscripten_glColor3us(r, g, b) {
      _emscripten_glColor4us(r, g, b, 65535);
    }

  function _emscripten_glColor3usv(p) {
      _emscripten_glColor3us(HEAP16[((p)>>1)], HEAP16[(((p)+(2))>>1)], HEAP16[(((p)+(4))>>1)]);
    }

  function _emscripten_glColor4d(r, g, b, a) {
      r = Math.max(Math.min(r, 1), 0);
      g = Math.max(Math.min(g, 1), 0);
      b = Math.max(Math.min(b, 1), 0);
      a = Math.max(Math.min(a, 1), 0);
  
      // TODO: make ub the default, not f, save a few mathops
      if (GLImmediate.mode >= 0) {
        var start = GLImmediate.vertexCounter << 2;
        GLImmediate.vertexDataU8[start + 0] = r * 255;
        GLImmediate.vertexDataU8[start + 1] = g * 255;
        GLImmediate.vertexDataU8[start + 2] = b * 255;
        GLImmediate.vertexDataU8[start + 3] = a * 255;
        GLImmediate.vertexCounter++;
        GLImmediate.addRendererComponent(GLImmediate.COLOR, 4, GLctx.UNSIGNED_BYTE);
      } else {
        GLImmediate.clientColor[0] = r;
        GLImmediate.clientColor[1] = g;
        GLImmediate.clientColor[2] = b;
        GLImmediate.clientColor[3] = a;
        GLctx.vertexAttrib4fv(GLImmediate.COLOR, GLImmediate.clientColor);
      }
    }


  function _emscripten_glColor4fv(p) {
      _emscripten_glColor4f(HEAPF32[((p)>>2)], HEAPF32[(((p)+(4))>>2)], HEAPF32[(((p)+(8))>>2)], HEAPF32[(((p)+(12))>>2)]);
    }


  function _emscripten_glColor4ubv(p) {
      _emscripten_glColor4ub(HEAP8[((p)>>0)], HEAP8[(((p)+(1))>>0)], HEAP8[(((p)+(2))>>0)], HEAP8[(((p)+(3))>>0)]);
    }



  function _emscripten_glColorMask(red, green, blue, alpha) {
      GLctx.colorMask(!!red, !!green, !!blue, !!alpha);
    }

  function _emscripten_glColorPointer(size, type, stride, pointer) {
      GLImmediate.setClientAttribute(GLImmediate.COLOR, size, type, stride, pointer);
      if (GLctx.currentArrayBufferBinding) {
        GLctx.vertexAttribPointer(GLImmediate.COLOR, size, type, true, stride, pointer);
      }
    }

  function _emscripten_glCompileShader(shader) {
      GLctx.compileShader(GL.shaders[shader]);
    }

  function _emscripten_glCompressedTexImage2D(target, level, internalFormat, width, height, border, imageSize, data) {
      GLctx['compressedTexImage2D'](target, level, internalFormat, width, height, border, data ? HEAPU8.subarray((data),(data+imageSize)) : null);
    }

  function _emscripten_glCompressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, imageSize, data) {
      GLctx['compressedTexSubImage2D'](target, level, xoffset, yoffset, width, height, format, data ? HEAPU8.subarray((data),(data+imageSize)) : null);
    }

  function _emscripten_glCopyTexImage2D(x0, x1, x2, x3, x4, x5, x6, x7) { GLctx['copyTexImage2D'](x0, x1, x2, x3, x4, x5, x6, x7) }

  function _emscripten_glCopyTexSubImage2D(x0, x1, x2, x3, x4, x5, x6, x7) { GLctx['copyTexSubImage2D'](x0, x1, x2, x3, x4, x5, x6, x7) }

  function _emscripten_glCreateProgram() {
      var id = GL.getNewId(GL.programs);
      var program = GLctx.createProgram();
      program.name = id;
      GL.programs[id] = program;
      return id;
    }

  function _emscripten_glCreateShader(shaderType) {
      var id = GL.getNewId(GL.shaders);
      GL.shaders[id] = GLctx.createShader(shaderType);
      return id;
    }

  function _emscripten_glCullFace(x0) { GLctx['cullFace'](x0) }

  function _emscripten_glDeleteBuffers(n, buffers) {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(((buffers)+(i*4))>>2)];
        var buffer = GL.buffers[id];
  
        // From spec: "glDeleteBuffers silently ignores 0's and names that do not
        // correspond to existing buffer objects."
        if (!buffer) continue;
  
        GLctx.deleteBuffer(buffer);
        buffer.name = 0;
        GL.buffers[id] = null;
  
        if (id == GLctx.currentArrayBufferBinding) GLctx.currentArrayBufferBinding = 0;
        if (id == GLctx.currentElementArrayBufferBinding) GLctx.currentElementArrayBufferBinding = 0;
      }
    }

  function _emscripten_glDeleteFramebuffers(n, framebuffers) {
      for (var i = 0; i < n; ++i) {
        var id = HEAP32[(((framebuffers)+(i*4))>>2)];
        var framebuffer = GL.framebuffers[id];
        if (!framebuffer) continue; // GL spec: "glDeleteFramebuffers silently ignores 0s and names that do not correspond to existing framebuffer objects".
        GLctx.deleteFramebuffer(framebuffer);
        framebuffer.name = 0;
        GL.framebuffers[id] = null;
      }
    }

  
  function _glDeleteShader(id) {
      if (!id) return;
      var shader = GL.shaders[id];
      if (!shader) { // glDeleteShader actually signals an error when deleting a nonexisting object, unlike some other GL delete functions.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
      GLctx.deleteShader(shader);
      GL.shaders[id] = null;
    }function _emscripten_glDeleteObject(id) {
      if (GL.programs[id]) {
        _glDeleteProgram(id);
      } else if (GL.shaders[id]) {
        _glDeleteShader(id);
      } else {
        err('WARNING: deleteObject received invalid id: ' + id);
      }
    }

  function _emscripten_glDeleteProgram(id) {
      if (!id) return;
      var program = GL.programs[id];
      if (!program) { // glDeleteProgram actually signals an error when deleting a nonexisting object, unlike some other GL delete functions.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
      GLctx.deleteProgram(program);
      program.name = 0;
      GL.programs[id] = null;
      GL.programInfos[id] = null;
    }

  function _emscripten_glDeleteQueriesEXT(n, ids) {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(((ids)+(i*4))>>2)];
        var query = GL.timerQueriesEXT[id];
        if (!query) continue; // GL spec: "unused names in ids are ignored, as is the name zero."
        GLctx.disjointTimerQueryExt['deleteQueryEXT'](query);
        GL.timerQueriesEXT[id] = null;
      }
    }

  function _emscripten_glDeleteRenderbuffers(n, renderbuffers) {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(((renderbuffers)+(i*4))>>2)];
        var renderbuffer = GL.renderbuffers[id];
        if (!renderbuffer) continue; // GL spec: "glDeleteRenderbuffers silently ignores 0s and names that do not correspond to existing renderbuffer objects".
        GLctx.deleteRenderbuffer(renderbuffer);
        renderbuffer.name = 0;
        GL.renderbuffers[id] = null;
      }
    }

  function _emscripten_glDeleteShader(id) {
      if (!id) return;
      var shader = GL.shaders[id];
      if (!shader) { // glDeleteShader actually signals an error when deleting a nonexisting object, unlike some other GL delete functions.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
      GLctx.deleteShader(shader);
      GL.shaders[id] = null;
    }

  function _emscripten_glDeleteTextures(n, textures) {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(((textures)+(i*4))>>2)];
        var texture = GL.textures[id];
        if (!texture) continue; // GL spec: "glDeleteTextures silently ignores 0s and names that do not correspond to existing textures".
        GLctx.deleteTexture(texture);
        texture.name = 0;
        GL.textures[id] = null;
      }
    }

  
  function _emulGlDeleteVertexArrays(n, vaos) {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(((vaos)+(i*4))>>2)];
        GLEmulation.vaos[id] = null;
        if (GLEmulation.currentVao && GLEmulation.currentVao.id == id) GLEmulation.currentVao = null;
      }
    }function _emscripten_glDeleteVertexArraysOES(n, vaos) {
      _emulGlDeleteVertexArrays(n, vaos);
    }

  function _emscripten_glDepthFunc(x0) { GLctx['depthFunc'](x0) }

  function _emscripten_glDepthMask(flag) {
      GLctx.depthMask(!!flag);
    }

  function _emscripten_glDepthRangef(x0, x1) { GLctx['depthRange'](x0, x1) }

  function _emscripten_glDetachShader(program, shader) {
      GLctx.detachShader(GL.programs[program],
                              GL.shaders[shader]);
    }

  function _emscripten_glDisable(x0) { GLctx['disable'](x0) }

  function _emscripten_glDisableClientState(cap) {
      var attrib = GLEmulation.getAttributeFromCapability(cap);
      if (attrib === null) {
        err('WARNING: unhandled clientstate: ' + cap);
        return;
      }
      if (GLImmediate.enabledClientAttributes[attrib]) {
        GLImmediate.enabledClientAttributes[attrib] = false;
        GLImmediate.totalEnabledClientAttributes--;
        GLImmediate.currentRenderer = null; // Will need to change current renderer, since the set of active vertex pointers changed.
        // In GL_FFP_ONLY mode, attributes are bound to the same index in each FFP emulation shader, so we can immediately apply the change here.
        GL.disableVertexAttribArray(attrib);
        if (GLEmulation.currentVao) delete GLEmulation.currentVao.enabledClientStates[cap];
        GLImmediate.modifiedClientAttributes = true;
      }
    }

  function _emscripten_glDisableVertexAttribArray(index) {
      GLctx.disableVertexAttribArray(index);
    }

  function _emscripten_glDrawArrays(mode, first, count) {
      if (GLImmediate.totalEnabledClientAttributes == 0 && mode <= 6) {
        GLctx.drawArrays(mode, first, count);
        return;
      }
      GLImmediate.prepareClientAttributes(count, false);
      GLImmediate.mode = mode;
      if (!GLctx.currentArrayBufferBinding) {
        GLImmediate.vertexData = HEAPF32.subarray((GLImmediate.vertexPointer)>>2,(GLImmediate.vertexPointer + (first+count)*GLImmediate.stride)>>2); // XXX assuming float
        GLImmediate.firstVertex = first;
        GLImmediate.lastVertex = first + count;
      }
      GLImmediate.flush(null, first);
      GLImmediate.mode = -1;
    }

  function _emscripten_glDrawArraysInstancedANGLE(mode, first, count, primcount) {
      GLctx['drawArraysInstanced'](mode, first, count, primcount);
    }

  function _emscripten_glDrawBuffer() { throw 'glDrawBuffer: TODO' }

  
  var tempFixedLengthArray=[];function _emscripten_glDrawBuffersWEBGL(n, bufs) {
  
      var bufArray = tempFixedLengthArray[n];
      for (var i = 0; i < n; i++) {
        bufArray[i] = HEAP32[(((bufs)+(i*4))>>2)];
      }
  
      GLctx['drawBuffers'](bufArray);
    }

  function _emscripten_glDrawElements(mode, count, type, indices, start, end) { // start, end are given if we come from glDrawRangeElements
      if (GLImmediate.totalEnabledClientAttributes == 0 && mode <= 6 && GLctx.currentElementArrayBufferBinding) {
        GLctx.drawElements(mode, count, type, indices);
        return;
      }
      if (!GLctx.currentElementArrayBufferBinding) {
        assert(type == GLctx.UNSIGNED_SHORT); // We can only emulate buffers of this kind, for now
      }
      //console.log("DrawElements doesn't actually prepareClientAttributes properly.");
      GLImmediate.prepareClientAttributes(count, false);
      GLImmediate.mode = mode;
      if (!GLctx.currentArrayBufferBinding) {
        GLImmediate.firstVertex = end ? start : HEAP8.length; // if we don't know the start, set an invalid value and we will calculate it later from the indices
        GLImmediate.lastVertex = end ? end+1 : 0;
        GLImmediate.vertexData = HEAPF32.subarray(GLImmediate.vertexPointer >> 2, end ? (GLImmediate.vertexPointer + (end+1)*GLImmediate.stride) >> 2 : undefined); // XXX assuming float
      }
      GLImmediate.flush(count, 0, indices);
      GLImmediate.mode = -1;
    }

  function _emscripten_glDrawElementsInstancedANGLE(mode, count, type, indices, primcount) {
      GLctx['drawElementsInstanced'](mode, count, type, indices, primcount);
    }

  function _emscripten_glDrawRangeElements(mode, start, end, count, type, indices) {
      _emscripten_glDrawElements(mode, count, type, indices, start, end);
    }

  function _emscripten_glEnable(x0) { GLctx['enable'](x0) }

  function _emscripten_glEnableClientState(cap) {
      var attrib = GLEmulation.getAttributeFromCapability(cap);
      if (attrib === null) {
        err('WARNING: unhandled clientstate: ' + cap);
        return;
      }
      if (!GLImmediate.enabledClientAttributes[attrib]) {
        GLImmediate.enabledClientAttributes[attrib] = true;
        GLImmediate.totalEnabledClientAttributes++;
        GLImmediate.currentRenderer = null; // Will need to change current renderer, since the set of active vertex pointers changed.
        // In GL_FFP_ONLY mode, attributes are bound to the same index in each FFP emulation shader, so we can immediately apply the change here.
        GL.enableVertexAttribArray(attrib);
        if (GLEmulation.currentVao) GLEmulation.currentVao.enabledClientStates[cap] = 1;
        GLImmediate.modifiedClientAttributes = true;
      }
    }

  function _emscripten_glEnableVertexAttribArray(index) {
      GLctx.enableVertexAttribArray(index);
    }

  function _emscripten_glEnd() {
      GLImmediate.prepareClientAttributes(GLImmediate.rendererComponents[GLImmediate.VERTEX], true);
      GLImmediate.firstVertex = 0;
      GLImmediate.lastVertex = GLImmediate.vertexCounter / (GLImmediate.stride >> 2);
      GLImmediate.flush();
      GLImmediate.disableBeginEndClientAttributes();
      GLImmediate.mode = -1;
  
      // Pop the old state:
      GLImmediate.enabledClientAttributes = GLImmediate.enabledClientAttributes_preBegin;
      GLImmediate.clientAttributes = GLImmediate.clientAttributes_preBegin;
      GLImmediate.currentRenderer = null; // The set of active client attributes changed, we must re-lookup the renderer to use.
      GLImmediate.modifiedClientAttributes = true;
    }

  function _emscripten_glEndQueryEXT(target) {
      GLctx.disjointTimerQueryExt['endQueryEXT'](target);
    }

  function _emscripten_glFinish() { GLctx['finish']() }

  function _emscripten_glFlush() { GLctx['flush']() }

  function _emscripten_glFramebufferRenderbuffer(target, attachment, renderbuffertarget, renderbuffer) {
      GLctx.framebufferRenderbuffer(target, attachment, renderbuffertarget,
                                         GL.renderbuffers[renderbuffer]);
    }

  function _emscripten_glFramebufferTexture2D(target, attachment, textarget, texture, level) {
      GLctx.framebufferTexture2D(target, attachment, textarget,
                                      GL.textures[texture], level);
    }

  function _emscripten_glFrontFace(x0) { GLctx['frontFace'](x0) }

  function _emscripten_glFrustum(left, right, bottom, top_, nearVal, farVal) {
      GLImmediate.matricesModified = true;
      GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1)|0;
      GLImmediate.matrixLib.mat4.multiply(GLImmediate.matrix[GLImmediate.currentMatrix],
          GLImmediate.matrixLib.mat4.frustum(left, right, bottom, top_, nearVal, farVal));
    }

  
  function __glGenObject(n, buffers, createFunction, objectTable
      ) {
      for (var i = 0; i < n; i++) {
        var buffer = GLctx[createFunction]();
        var id = buffer && GL.getNewId(objectTable);
        if (buffer) {
          buffer.name = id;
          objectTable[id] = buffer;
        } else {
          GL.recordError(0x502 /* GL_INVALID_OPERATION */);
        }
        HEAP32[(((buffers)+(i*4))>>2)]=id;
      }
    }function _emscripten_glGenBuffers(n, buffers) {
      __glGenObject(n, buffers, 'createBuffer', GL.buffers
        );
    }

  function _emscripten_glGenFramebuffers(n, ids) {
      __glGenObject(n, ids, 'createFramebuffer', GL.framebuffers
        );
    }

  function _emscripten_glGenQueriesEXT(n, ids) {
      for (var i = 0; i < n; i++) {
        var query = GLctx.disjointTimerQueryExt['createQueryEXT']();
        if (!query) {
          GL.recordError(0x502 /* GL_INVALID_OPERATION */);
          while(i < n) HEAP32[(((ids)+(i++*4))>>2)]=0;
          return;
        }
        var id = GL.getNewId(GL.timerQueriesEXT);
        query.name = id;
        GL.timerQueriesEXT[id] = query;
        HEAP32[(((ids)+(i*4))>>2)]=id;
      }
    }

  function _emscripten_glGenRenderbuffers(n, renderbuffers) {
      __glGenObject(n, renderbuffers, 'createRenderbuffer', GL.renderbuffers
        );
    }

  function _emscripten_glGenTextures(n, textures) {
      __glGenObject(n, textures, 'createTexture', GL.textures
        );
    }

  
  function _emulGlGenVertexArrays(n, vaos) {
      for (var i = 0; i < n; i++) {
        var id = GL.getNewId(GLEmulation.vaos);
        GLEmulation.vaos[id] = {
          id: id,
          arrayBuffer: 0,
          elementArrayBuffer: 0,
          enabledVertexAttribArrays: {},
          vertexAttribPointers: {},
          enabledClientStates: {},
        };
        HEAP32[(((vaos)+(i*4))>>2)]=id;
      }
    }function _emscripten_glGenVertexArraysOES(n, arrays) {
      _emulGlGenVertexArrays(n, arrays);
    }

  function _emscripten_glGenerateMipmap(x0) { GLctx['generateMipmap'](x0) }

  
  function __glGetActiveAttribOrUniform(funcName, program, index, bufSize, length, size, type, name) {
      program = GL.programs[program];
      var info = GLctx[funcName](program, index);
      if (info) { // If an error occurs, nothing will be written to length, size and type and name.
        var numBytesWrittenExclNull = name && stringToUTF8(info.name, name, bufSize);
        if (length) HEAP32[((length)>>2)]=numBytesWrittenExclNull;
        if (size) HEAP32[((size)>>2)]=info.size;
        if (type) HEAP32[((type)>>2)]=info.type;
      }
    }function _emscripten_glGetActiveAttrib(program, index, bufSize, length, size, type, name) {
      __glGetActiveAttribOrUniform('getActiveAttrib', program, index, bufSize, length, size, type, name);
    }

  function _emscripten_glGetActiveUniform(program, index, bufSize, length, size, type, name) {
      __glGetActiveAttribOrUniform('getActiveUniform', program, index, bufSize, length, size, type, name);
    }

  function _emscripten_glGetAttachedShaders(program, maxCount, count, shaders) {
      var result = GLctx.getAttachedShaders(GL.programs[program]);
      var len = result.length;
      if (len > maxCount) {
        len = maxCount;
      }
      HEAP32[((count)>>2)]=len;
      for (var i = 0; i < len; ++i) {
        var id = GL.shaders.indexOf(result[i]);
        HEAP32[(((shaders)+(i*4))>>2)]=id;
      }
    }

  function _emscripten_glGetAttribLocation(program, name) {
      return GLctx.getAttribLocation(GL.programs[program], UTF8ToString(name));
    }

  function _emscripten_glGetBooleanv(name_, p) {
      emscriptenWebGLGet(name_, p, 4);
    }

  function _emscripten_glGetBufferParameteriv(target, value, data) {
      if (!data) {
        // GLES2 specification does not specify how to behave if data is a null pointer. Since calling this function does not make sense
        // if data == null, issue a GL error to notify user about it.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
      HEAP32[((data)>>2)]=GLctx.getBufferParameter(target, value);
    }

  function _emscripten_glGetError() {
      var error = GLctx.getError() || GL.lastError;
      GL.lastError = 0/*GL_NO_ERROR*/;
      return error;
    }

  function _emscripten_glGetFloatv(name_, p) {
      emscriptenWebGLGet(name_, p, 2);
    }

  function _emscripten_glGetFramebufferAttachmentParameteriv(target, attachment, pname, params) {
      var result = GLctx.getFramebufferAttachmentParameter(target, attachment, pname);
      if (result instanceof WebGLRenderbuffer ||
          result instanceof WebGLTexture) {
        result = result.name | 0;
      }
      HEAP32[((params)>>2)]=result;
    }

  
  function _glGetProgramInfoLog(program, maxLength, length, infoLog) {
      var log = GLctx.getProgramInfoLog(GL.programs[program]);
      if (log === null) log = '(unknown error)';
      var numBytesWrittenExclNull = (maxLength > 0 && infoLog) ? stringToUTF8(log, infoLog, maxLength) : 0;
      if (length) HEAP32[((length)>>2)]=numBytesWrittenExclNull;
    }
  
  function _glGetShaderInfoLog(shader, maxLength, length, infoLog) {
      var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
      if (log === null) log = '(unknown error)';
      var numBytesWrittenExclNull = (maxLength > 0 && infoLog) ? stringToUTF8(log, infoLog, maxLength) : 0;
      if (length) HEAP32[((length)>>2)]=numBytesWrittenExclNull;
    }function _emscripten_glGetInfoLog(id, maxLength, length, infoLog) {
      if (GL.programs[id]) {
        _glGetProgramInfoLog(id, maxLength, length, infoLog);
      } else if (GL.shaders[id]) {
        _glGetShaderInfoLog(id, maxLength, length, infoLog);
      } else {
        err('WARNING: glGetInfoLog received invalid id: ' + id);
      }
    }

  function _emscripten_glGetIntegerv(name_, p) {
      emscriptenWebGLGet(name_, p, 0);
    }

  
  function _glGetProgramiv(program, pname, p) {
      if (!p) {
        // GLES2 specification does not specify how to behave if p is a null pointer. Since calling this function does not make sense
        // if p == null, issue a GL error to notify user about it.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
  
      if (program >= GL.counter) {
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
  
      var ptable = GL.programInfos[program];
      if (!ptable) {
        GL.recordError(0x502 /* GL_INVALID_OPERATION */);
        return;
      }
  
      if (pname == 0x8B84) { // GL_INFO_LOG_LENGTH
        var log = GLctx.getProgramInfoLog(GL.programs[program]);
        if (log === null) log = '(unknown error)';
        HEAP32[((p)>>2)]=log.length + 1;
      } else if (pname == 0x8B87 /* GL_ACTIVE_UNIFORM_MAX_LENGTH */) {
        HEAP32[((p)>>2)]=ptable.maxUniformLength;
      } else if (pname == 0x8B8A /* GL_ACTIVE_ATTRIBUTE_MAX_LENGTH */) {
        if (ptable.maxAttributeLength == -1) {
          program = GL.programs[program];
          var numAttribs = GLctx.getProgramParameter(program, 0x8B89/*GL_ACTIVE_ATTRIBUTES*/);
          ptable.maxAttributeLength = 0; // Spec says if there are no active attribs, 0 must be returned.
          for (var i = 0; i < numAttribs; ++i) {
            var activeAttrib = GLctx.getActiveAttrib(program, i);
            ptable.maxAttributeLength = Math.max(ptable.maxAttributeLength, activeAttrib.name.length+1);
          }
        }
        HEAP32[((p)>>2)]=ptable.maxAttributeLength;
      } else if (pname == 0x8A35 /* GL_ACTIVE_UNIFORM_BLOCK_MAX_NAME_LENGTH */) {
        if (ptable.maxUniformBlockNameLength == -1) {
          program = GL.programs[program];
          var numBlocks = GLctx.getProgramParameter(program, 0x8A36/*GL_ACTIVE_UNIFORM_BLOCKS*/);
          ptable.maxUniformBlockNameLength = 0;
          for (var i = 0; i < numBlocks; ++i) {
            var activeBlockName = GLctx.getActiveUniformBlockName(program, i);
            ptable.maxUniformBlockNameLength = Math.max(ptable.maxUniformBlockNameLength, activeBlockName.length+1);
          }
        }
        HEAP32[((p)>>2)]=ptable.maxUniformBlockNameLength;
      } else {
        HEAP32[((p)>>2)]=GLctx.getProgramParameter(GL.programs[program], pname);
      }
    }
  
  function _glGetShaderiv(shader, pname, p) {
      if (!p) {
        // GLES2 specification does not specify how to behave if p is a null pointer. Since calling this function does not make sense
        // if p == null, issue a GL error to notify user about it.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
      if (pname == 0x8B84) { // GL_INFO_LOG_LENGTH
        var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
        if (log === null) log = '(unknown error)';
        // The GLES2 specification says that if the shader has an empty info log,
        // a value of 0 is returned. Otherwise the log has a null char appended.
        // (An empty string is falsey, so we can just check that instead of
        // looking at log.length.)
        var logLength = log ? log.length + 1 : 0;
        HEAP32[((p)>>2)]=logLength;
      } else if (pname == 0x8B88) { // GL_SHADER_SOURCE_LENGTH
        var source = GLctx.getShaderSource(GL.shaders[shader]);
        // source may be a null, or the empty string, both of which are falsey
        // values that we report a 0 length for.
        var sourceLength = source ? source.length + 1 : 0;
        HEAP32[((p)>>2)]=sourceLength;
      } else {
        HEAP32[((p)>>2)]=GLctx.getShaderParameter(GL.shaders[shader], pname);
      }
    }function _emscripten_glGetObjectParameteriv(id, type, result) {
      if (GL.programs[id]) {
        if (type == 0x8B84) { // GL_OBJECT_INFO_LOG_LENGTH_ARB
          var log = GLctx.getProgramInfoLog(GL.programs[id]);
          if (log === null) log = '(unknown error)';
          HEAP32[((result)>>2)]=log.length;
          return;
        }
        _glGetProgramiv(id, type, result);
      } else if (GL.shaders[id]) {
        if (type == 0x8B84) { // GL_OBJECT_INFO_LOG_LENGTH_ARB
          var log = GLctx.getShaderInfoLog(GL.shaders[id]);
          if (log === null) log = '(unknown error)';
          HEAP32[((result)>>2)]=log.length;
          return;
        } else if (type == 0x8B88) { // GL_OBJECT_SHADER_SOURCE_LENGTH_ARB
          var source = GLctx.getShaderSource(GL.shaders[id]);
          if (source === null) return; // If an error occurs, nothing will be written to result
          HEAP32[((result)>>2)]=source.length;
          return;
        }
        _glGetShaderiv(id, type, result);
      } else {
        err('WARNING: getObjectParameteriv received invalid id: ' + id);
      }
    }

  function _emscripten_glGetPointerv(name, p) {
      var attribute;
      switch(name) {
        case 0x808E: // GL_VERTEX_ARRAY_POINTER
          attribute = GLImmediate.clientAttributes[GLImmediate.VERTEX]; break;
        case 0x8090: // GL_COLOR_ARRAY_POINTER
          attribute = GLImmediate.clientAttributes[GLImmediate.COLOR]; break;
        case 0x8092: // GL_TEXTURE_COORD_ARRAY_POINTER
          attribute = GLImmediate.clientAttributes[GLImmediate.TEXTURE0 + GLImmediate.clientActiveTexture]; break;
        default:
          GL.recordError(0x500/*GL_INVALID_ENUM*/);
          return;
      }
      HEAP32[((p)>>2)]=attribute ? attribute.pointer : 0;
    }

  function _emscripten_glGetProgramInfoLog(program, maxLength, length, infoLog) {
      var log = GLctx.getProgramInfoLog(GL.programs[program]);
      if (log === null) log = '(unknown error)';
      var numBytesWrittenExclNull = (maxLength > 0 && infoLog) ? stringToUTF8(log, infoLog, maxLength) : 0;
      if (length) HEAP32[((length)>>2)]=numBytesWrittenExclNull;
    }

  function _emscripten_glGetProgramiv(program, pname, p) {
      if (!p) {
        // GLES2 specification does not specify how to behave if p is a null pointer. Since calling this function does not make sense
        // if p == null, issue a GL error to notify user about it.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
  
      if (program >= GL.counter) {
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
  
      var ptable = GL.programInfos[program];
      if (!ptable) {
        GL.recordError(0x502 /* GL_INVALID_OPERATION */);
        return;
      }
  
      if (pname == 0x8B84) { // GL_INFO_LOG_LENGTH
        var log = GLctx.getProgramInfoLog(GL.programs[program]);
        if (log === null) log = '(unknown error)';
        HEAP32[((p)>>2)]=log.length + 1;
      } else if (pname == 0x8B87 /* GL_ACTIVE_UNIFORM_MAX_LENGTH */) {
        HEAP32[((p)>>2)]=ptable.maxUniformLength;
      } else if (pname == 0x8B8A /* GL_ACTIVE_ATTRIBUTE_MAX_LENGTH */) {
        if (ptable.maxAttributeLength == -1) {
          program = GL.programs[program];
          var numAttribs = GLctx.getProgramParameter(program, 0x8B89/*GL_ACTIVE_ATTRIBUTES*/);
          ptable.maxAttributeLength = 0; // Spec says if there are no active attribs, 0 must be returned.
          for (var i = 0; i < numAttribs; ++i) {
            var activeAttrib = GLctx.getActiveAttrib(program, i);
            ptable.maxAttributeLength = Math.max(ptable.maxAttributeLength, activeAttrib.name.length+1);
          }
        }
        HEAP32[((p)>>2)]=ptable.maxAttributeLength;
      } else if (pname == 0x8A35 /* GL_ACTIVE_UNIFORM_BLOCK_MAX_NAME_LENGTH */) {
        if (ptable.maxUniformBlockNameLength == -1) {
          program = GL.programs[program];
          var numBlocks = GLctx.getProgramParameter(program, 0x8A36/*GL_ACTIVE_UNIFORM_BLOCKS*/);
          ptable.maxUniformBlockNameLength = 0;
          for (var i = 0; i < numBlocks; ++i) {
            var activeBlockName = GLctx.getActiveUniformBlockName(program, i);
            ptable.maxUniformBlockNameLength = Math.max(ptable.maxUniformBlockNameLength, activeBlockName.length+1);
          }
        }
        HEAP32[((p)>>2)]=ptable.maxUniformBlockNameLength;
      } else {
        HEAP32[((p)>>2)]=GLctx.getProgramParameter(GL.programs[program], pname);
      }
    }

  function _emscripten_glGetQueryObjecti64vEXT(id, pname, params) {
      if (!params) {
        // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
        // if p == null, issue a GL error to notify user about it.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
      var query = GL.timerQueriesEXT[id];
      var param = GLctx.disjointTimerQueryExt['getQueryObjectEXT'](query, pname);
      var ret;
      if (typeof param == 'boolean') {
        ret = param ? 1 : 0;
      } else {
        ret = param;
      }
      writeI53ToI64(params, ret);
    }

  function _emscripten_glGetQueryObjectivEXT(id, pname, params) {
      if (!params) {
        // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
        // if p == null, issue a GL error to notify user about it.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
      var query = GL.timerQueriesEXT[id];
      var param = GLctx.disjointTimerQueryExt['getQueryObjectEXT'](query, pname);
      var ret;
      if (typeof param == 'boolean') {
        ret = param ? 1 : 0;
      } else {
        ret = param;
      }
      HEAP32[((params)>>2)]=ret;
    }

  function _emscripten_glGetQueryObjectui64vEXT(id, pname, params) {
      if (!params) {
        // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
        // if p == null, issue a GL error to notify user about it.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
      var query = GL.timerQueriesEXT[id];
      var param = GLctx.disjointTimerQueryExt['getQueryObjectEXT'](query, pname);
      var ret;
      if (typeof param == 'boolean') {
        ret = param ? 1 : 0;
      } else {
        ret = param;
      }
      writeI53ToI64(params, ret);
    }

  function _emscripten_glGetQueryObjectuivEXT(id, pname, params) {
      if (!params) {
        // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
        // if p == null, issue a GL error to notify user about it.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
      var query = GL.timerQueriesEXT[id];
      var param = GLctx.disjointTimerQueryExt['getQueryObjectEXT'](query, pname);
      var ret;
      if (typeof param == 'boolean') {
        ret = param ? 1 : 0;
      } else {
        ret = param;
      }
      HEAP32[((params)>>2)]=ret;
    }

  function _emscripten_glGetQueryivEXT(target, pname, params) {
      if (!params) {
        // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
        // if p == null, issue a GL error to notify user about it.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
      HEAP32[((params)>>2)]=GLctx.disjointTimerQueryExt['getQueryEXT'](target, pname);
    }

  function _emscripten_glGetRenderbufferParameteriv(target, pname, params) {
      if (!params) {
        // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
        // if params == null, issue a GL error to notify user about it.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
      HEAP32[((params)>>2)]=GLctx.getRenderbufferParameter(target, pname);
    }

  function _emscripten_glGetShaderInfoLog(shader, maxLength, length, infoLog) {
      var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
      if (log === null) log = '(unknown error)';
      var numBytesWrittenExclNull = (maxLength > 0 && infoLog) ? stringToUTF8(log, infoLog, maxLength) : 0;
      if (length) HEAP32[((length)>>2)]=numBytesWrittenExclNull;
    }

  function _emscripten_glGetShaderPrecisionFormat(shaderType, precisionType, range, precision) {
      var result = GLctx.getShaderPrecisionFormat(shaderType, precisionType);
      HEAP32[((range)>>2)]=result.rangeMin;
      HEAP32[(((range)+(4))>>2)]=result.rangeMax;
      HEAP32[((precision)>>2)]=result.precision;
    }

  function _emscripten_glGetShaderSource(shader, bufSize, length, source) {
      var result = GLctx.getShaderSource(GL.shaders[shader]);
      if (!result) return; // If an error occurs, nothing will be written to length or source.
      var numBytesWrittenExclNull = (bufSize > 0 && source) ? stringToUTF8(result, source, bufSize) : 0;
      if (length) HEAP32[((length)>>2)]=numBytesWrittenExclNull;
    }

  function _emscripten_glGetShaderiv(shader, pname, p) {
      if (!p) {
        // GLES2 specification does not specify how to behave if p is a null pointer. Since calling this function does not make sense
        // if p == null, issue a GL error to notify user about it.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
      if (pname == 0x8B84) { // GL_INFO_LOG_LENGTH
        var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
        if (log === null) log = '(unknown error)';
        // The GLES2 specification says that if the shader has an empty info log,
        // a value of 0 is returned. Otherwise the log has a null char appended.
        // (An empty string is falsey, so we can just check that instead of
        // looking at log.length.)
        var logLength = log ? log.length + 1 : 0;
        HEAP32[((p)>>2)]=logLength;
      } else if (pname == 0x8B88) { // GL_SHADER_SOURCE_LENGTH
        var source = GLctx.getShaderSource(GL.shaders[shader]);
        // source may be a null, or the empty string, both of which are falsey
        // values that we report a 0 length for.
        var sourceLength = source ? source.length + 1 : 0;
        HEAP32[((p)>>2)]=sourceLength;
      } else {
        HEAP32[((p)>>2)]=GLctx.getShaderParameter(GL.shaders[shader], pname);
      }
    }

  function _emscripten_glGetString(name_) {
      if (GL.stringCache[name_]) return GL.stringCache[name_];
      var ret;
      switch(name_) {
        case 0x1F03 /* GL_EXTENSIONS */:
          var exts = GLctx.getSupportedExtensions() || []; // .getSupportedExtensions() can return null if context is lost, so coerce to empty array.
          exts = exts.concat(exts.map(function(e) { return "GL_" + e; }));
          ret = stringToNewUTF8(exts.join(' '));
          break;
        case 0x1F00 /* GL_VENDOR */:
        case 0x1F01 /* GL_RENDERER */:
        case 0x9245 /* UNMASKED_VENDOR_WEBGL */:
        case 0x9246 /* UNMASKED_RENDERER_WEBGL */:
          var s = GLctx.getParameter(name_);
          if (!s) {
            GL.recordError(0x500/*GL_INVALID_ENUM*/);
          }
          ret = stringToNewUTF8(s);
          break;
  
        case 0x1F02 /* GL_VERSION */:
          var glVersion = GLctx.getParameter(0x1F02 /*GL_VERSION*/);
          // return GLES version string corresponding to the version of the WebGL context
          {
            glVersion = 'OpenGL ES 2.0 (' + glVersion + ')';
          }
          ret = stringToNewUTF8(glVersion);
          break;
        case 0x8B8C /* GL_SHADING_LANGUAGE_VERSION */:
          var glslVersion = GLctx.getParameter(0x8B8C /*GL_SHADING_LANGUAGE_VERSION*/);
          // extract the version number 'N.M' from the string 'WebGL GLSL ES N.M ...'
          var ver_re = /^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/;
          var ver_num = glslVersion.match(ver_re);
          if (ver_num !== null) {
            if (ver_num[1].length == 3) ver_num[1] = ver_num[1] + '0'; // ensure minor version has 2 digits
            glslVersion = 'OpenGL ES GLSL ES ' + ver_num[1] + ' (' + glslVersion + ')';
          }
          ret = stringToNewUTF8(glslVersion);
          break;
        default:
          GL.recordError(0x500/*GL_INVALID_ENUM*/);
          return 0;
      }
      GL.stringCache[name_] = ret;
      return ret;
    }

  function _emscripten_glGetTexEnvfv(target, pname, param) { throw 'GL emulation not initialized!'; }

  function _emscripten_glGetTexEnviv(target, pname, param) { throw 'GL emulation not initialized!'; }

  function _emscripten_glGetTexLevelParameteriv() { throw 'glGetTexLevelParameteriv: TODO' }

  function _emscripten_glGetTexParameterfv(target, pname, params) {
      if (!params) {
        // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
        // if p == null, issue a GL error to notify user about it.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
      HEAPF32[((params)>>2)]=GLctx.getTexParameter(target, pname);
    }

  function _emscripten_glGetTexParameteriv(target, pname, params) {
      if (!params) {
        // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
        // if p == null, issue a GL error to notify user about it.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
      HEAP32[((params)>>2)]=GLctx.getTexParameter(target, pname);
    }

  
  /** @suppress {checkTypes} */
  function jstoi_q(str) {
      return parseInt(str);
    }function _emscripten_glGetUniformLocation(program, name) {
      name = UTF8ToString(name);
  
      var arrayIndex = 0;
      // If user passed an array accessor "[index]", parse the array index off the accessor.
      if (name[name.length - 1] == ']') {
        var leftBrace = name.lastIndexOf('[');
        arrayIndex = name[leftBrace+1] != ']' ? jstoi_q(name.slice(leftBrace + 1)) : 0; // "index]", parseInt will ignore the ']' at the end; but treat "foo[]" as "foo[0]"
        name = name.slice(0, leftBrace);
      }
  
      var uniformInfo = GL.programInfos[program] && GL.programInfos[program].uniforms[name]; // returns pair [ dimension_of_uniform_array, uniform_location ]
      if (uniformInfo && arrayIndex >= 0 && arrayIndex < uniformInfo[0]) { // Check if user asked for an out-of-bounds element, i.e. for 'vec4 colors[3];' user could ask for 'colors[10]' which should return -1.
        return uniformInfo[1] + arrayIndex;
      } else {
        return -1;
      }
    }

  
  /** @suppress{checkTypes} */
  function emscriptenWebGLGetUniform(program, location, params, type) {
      if (!params) {
        // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
        // if params == null, issue a GL error to notify user about it.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
      var data = GLctx.getUniform(GL.programs[program], GL.uniforms[location]);
      if (typeof data == 'number' || typeof data == 'boolean') {
        switch (type) {
          case 0: HEAP32[((params)>>2)]=data; break;
          case 2: HEAPF32[((params)>>2)]=data; break;
        }
      } else {
        for (var i = 0; i < data.length; i++) {
          switch (type) {
            case 0: HEAP32[(((params)+(i*4))>>2)]=data[i]; break;
            case 2: HEAPF32[(((params)+(i*4))>>2)]=data[i]; break;
          }
        }
      }
    }function _emscripten_glGetUniformfv(program, location, params) {
      emscriptenWebGLGetUniform(program, location, params, 2);
    }

  function _emscripten_glGetUniformiv(program, location, params) {
      emscriptenWebGLGetUniform(program, location, params, 0);
    }

  function _emscripten_glGetVertexAttribPointerv(index, pname, pointer) {
      if (!pointer) {
        // GLES2 specification does not specify how to behave if pointer is a null pointer. Since calling this function does not make sense
        // if pointer == null, issue a GL error to notify user about it.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
      HEAP32[((pointer)>>2)]=GLctx.getVertexAttribOffset(index, pname);
    }

  
  /** @suppress{checkTypes} */
  function emscriptenWebGLGetVertexAttrib(index, pname, params, type) {
      if (!params) {
        // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
        // if params == null, issue a GL error to notify user about it.
        GL.recordError(0x501 /* GL_INVALID_VALUE */);
        return;
      }
      var data = GLctx.getVertexAttrib(index, pname);
      if (pname == 0x889F/*VERTEX_ATTRIB_ARRAY_BUFFER_BINDING*/) {
        HEAP32[((params)>>2)]=data && data["name"];
      } else if (typeof data == 'number' || typeof data == 'boolean') {
        switch (type) {
          case 0: HEAP32[((params)>>2)]=data; break;
          case 2: HEAPF32[((params)>>2)]=data; break;
          case 5: HEAP32[((params)>>2)]=Math.fround(data); break;
        }
      } else {
        for (var i = 0; i < data.length; i++) {
          switch (type) {
            case 0: HEAP32[(((params)+(i*4))>>2)]=data[i]; break;
            case 2: HEAPF32[(((params)+(i*4))>>2)]=data[i]; break;
            case 5: HEAP32[(((params)+(i*4))>>2)]=Math.fround(data[i]); break;
          }
        }
      }
    }function _emscripten_glGetVertexAttribfv(index, pname, params) {
      // N.B. This function may only be called if the vertex attribute was specified using the function glVertexAttrib*f(),
      // otherwise the results are undefined. (GLES3 spec 6.1.12)
      emscriptenWebGLGetVertexAttrib(index, pname, params, 2);
    }

  function _emscripten_glGetVertexAttribiv(index, pname, params) {
      // N.B. This function may only be called if the vertex attribute was specified using the function glVertexAttrib*f(),
      // otherwise the results are undefined. (GLES3 spec 6.1.12)
      emscriptenWebGLGetVertexAttrib(index, pname, params, 5);
    }

  function _emscripten_glHint(x0, x1) { GLctx['hint'](x0, x1) }

  function _emscripten_glIsBuffer(buffer) {
      var b = GL.buffers[buffer];
      if (!b) return 0;
      return GLctx.isBuffer(b);
    }

  function _emscripten_glIsEnabled(x0) { return GLctx['isEnabled'](x0) }

  function _emscripten_glIsFramebuffer(framebuffer) {
      var fb = GL.framebuffers[framebuffer];
      if (!fb) return 0;
      return GLctx.isFramebuffer(fb);
    }

  function _emscripten_glIsProgram(program) {
      program = GL.programs[program];
      if (!program) return 0;
      return GLctx.isProgram(program);
    }

  function _emscripten_glIsQueryEXT(id) {
      var query = GL.timerQueriesEXT[id];
      if (!query) return 0;
      return GLctx.disjointTimerQueryExt['isQueryEXT'](query);
    }

  function _emscripten_glIsRenderbuffer(renderbuffer) {
      var rb = GL.renderbuffers[renderbuffer];
      if (!rb) return 0;
      return GLctx.isRenderbuffer(rb);
    }

  function _emscripten_glIsShader(shader) {
      var s = GL.shaders[shader];
      if (!s) return 0;
      return GLctx.isShader(s);
    }

  function _emscripten_glIsTexture(id) {
      var texture = GL.textures[id];
      if (!texture) return 0;
      return GLctx.isTexture(texture);
    }

  
  function _emulGlIsVertexArray(array) {
      var vao = GLEmulation.vaos[array];
      if (!vao) return 0;
      return 1;
    }function _emscripten_glIsVertexArrayOES(array) {
      return _emulGlIsVertexArray(array);
    }

  function _emscripten_glLightModelfv() { throw 'glLightModelfv: TODO' }

  function _emscripten_glLightfv() { throw 'glLightfv: TODO' }

  function _emscripten_glLineWidth(x0) { GLctx['lineWidth'](x0) }

  function _emscripten_glLinkProgram(program) {
      GLctx.linkProgram(GL.programs[program]);
      GL.populateUniformTable(program);
    }

  function _emscripten_glLoadIdentity() {
      GLImmediate.matricesModified = true;
      GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1)|0;
      GLImmediate.matrixLib.mat4.identity(GLImmediate.matrix[GLImmediate.currentMatrix]);
    }

  function _emscripten_glLoadMatrixd(matrix) {
      GLImmediate.matricesModified = true;
      GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1)|0;
      GLImmediate.matrixLib.mat4.set(HEAPF64.subarray((matrix)>>3,(matrix+128)>>3), GLImmediate.matrix[GLImmediate.currentMatrix]);
    }

  function _emscripten_glLoadMatrixf(matrix) {
      GLImmediate.matricesModified = true;
      GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1)|0;
      GLImmediate.matrixLib.mat4.set(HEAPF32.subarray((matrix)>>2,(matrix+64)>>2), GLImmediate.matrix[GLImmediate.currentMatrix]);
    }

  function _emscripten_glLoadTransposeMatrixd(matrix) {
      GLImmediate.matricesModified = true;
      GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1)|0;
      GLImmediate.matrixLib.mat4.set(HEAPF64.subarray((matrix)>>3,(matrix+128)>>3), GLImmediate.matrix[GLImmediate.currentMatrix]);
      GLImmediate.matrixLib.mat4.transpose(GLImmediate.matrix[GLImmediate.currentMatrix]);
    }

  function _emscripten_glLoadTransposeMatrixf(matrix) {
      GLImmediate.matricesModified = true;
      GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1)|0;
      GLImmediate.matrixLib.mat4.set(HEAPF32.subarray((matrix)>>2,(matrix+64)>>2), GLImmediate.matrix[GLImmediate.currentMatrix]);
      GLImmediate.matrixLib.mat4.transpose(GLImmediate.matrix[GLImmediate.currentMatrix]);
    }

  function _emscripten_glMaterialfv() { throw 'glMaterialfv: TODO' }

  function _emscripten_glMatrixMode(mode) {
      if (mode == 0x1700 /* GL_MODELVIEW */) {
        GLImmediate.currentMatrix = 0/*m*/;
      } else if (mode == 0x1701 /* GL_PROJECTION */) {
        GLImmediate.currentMatrix = 1/*p*/;
      } else if (mode == 0x1702) { // GL_TEXTURE
        GLImmediate.useTextureMatrix = true;
        GLImmediate.currentMatrix = 2/*t*/ + GLImmediate.TexEnvJIT.getActiveTexture();
      } else {
        throw "Wrong mode " + mode + " passed to glMatrixMode";
      }
    }

  function _emscripten_glMultMatrixd(matrix) {
      GLImmediate.matricesModified = true;
      GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1)|0;
      GLImmediate.matrixLib.mat4.multiply(GLImmediate.matrix[GLImmediate.currentMatrix],
          HEAPF64.subarray((matrix)>>3,(matrix+128)>>3));
    }

  function _emscripten_glMultMatrixf(matrix) {
      GLImmediate.matricesModified = true;
      GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1)|0;
      GLImmediate.matrixLib.mat4.multiply(GLImmediate.matrix[GLImmediate.currentMatrix],
          HEAPF32.subarray((matrix)>>2,(matrix+64)>>2));
    }

  function _emscripten_glMultTransposeMatrixd(matrix) {
      GLImmediate.matricesModified = true;
      GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1)|0;
      var colMajor = GLImmediate.matrixLib.mat4.create();
      GLImmediate.matrixLib.mat4.set(HEAPF64.subarray((matrix)>>3,(matrix+128)>>3), colMajor);
      GLImmediate.matrixLib.mat4.transpose(colMajor);
      GLImmediate.matrixLib.mat4.multiply(GLImmediate.matrix[GLImmediate.currentMatrix], colMajor);
    }

  function _emscripten_glMultTransposeMatrixf(matrix) {
      GLImmediate.matricesModified = true;
      GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1)|0;
      var colMajor = GLImmediate.matrixLib.mat4.create();
      GLImmediate.matrixLib.mat4.set(HEAPF32.subarray((matrix)>>2,(matrix+64)>>2), colMajor);
      GLImmediate.matrixLib.mat4.transpose(colMajor);
      GLImmediate.matrixLib.mat4.multiply(GLImmediate.matrix[GLImmediate.currentMatrix], colMajor);
    }

  function _emscripten_glNormal3f(){}

  function _emscripten_glNormalPointer(type, stride, pointer) {
      GLImmediate.setClientAttribute(GLImmediate.NORMAL, 3, type, stride, pointer);
      if (GLctx.currentArrayBufferBinding) {
        GLctx.vertexAttribPointer(GLImmediate.NORMAL, 3, type, true, stride, pointer);
      }
    }

  function _emscripten_glOrtho(left, right, bottom, top_, nearVal, farVal) {
      GLImmediate.matricesModified = true;
      GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1)|0;
      GLImmediate.matrixLib.mat4.multiply(GLImmediate.matrix[GLImmediate.currentMatrix],
          GLImmediate.matrixLib.mat4.ortho(left, right, bottom, top_, nearVal, farVal));
    }

  function _emscripten_glPixelStorei(pname, param) {
      if (pname == 0xCF5 /* GL_UNPACK_ALIGNMENT */) {
        GL.unpackAlignment = param;
      }
      GLctx.pixelStorei(pname, param);
    }

  function _emscripten_glPolygonMode(){}

  function _emscripten_glPolygonOffset(x0, x1) { GLctx['polygonOffset'](x0, x1) }

  function _emscripten_glPopMatrix() {
      if (GLImmediate.matrixStack[GLImmediate.currentMatrix].length == 0) {
        GL.recordError(0x504/*GL_STACK_UNDERFLOW*/);
        return;
      }
      GLImmediate.matricesModified = true;
      GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1)|0;
      GLImmediate.matrix[GLImmediate.currentMatrix] = GLImmediate.matrixStack[GLImmediate.currentMatrix].pop();
    }

  function _emscripten_glPushMatrix() {
      GLImmediate.matricesModified = true;
      GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1)|0;
      GLImmediate.matrixStack[GLImmediate.currentMatrix].push(
          Array.prototype.slice.call(GLImmediate.matrix[GLImmediate.currentMatrix]));
    }

  function _emscripten_glQueryCounterEXT(id, target) {
      GLctx.disjointTimerQueryExt['queryCounterEXT'](GL.timerQueriesEXT[id], target);
    }

  function _emscripten_glReadBuffer() { throw 'glReadBuffer: TODO' }

  
  
  function computeUnpackAlignedImageSize(width, height, sizePerPixel, alignment) {
      function roundedToNextMultipleOf(x, y) {
        return (x + y - 1) & -y;
      }
      var plainRowSize = width * sizePerPixel;
      var alignedRowSize = roundedToNextMultipleOf(plainRowSize, alignment);
      return height * alignedRowSize;
    }
  
  function __colorChannelsInGlTextureFormat(format) {
      // Micro-optimizations for size: map format to size by subtracting smallest enum value (0x1902) from all values first.
      // Also omit the most common size value (1) from the list, which is assumed by formats not on the list.
      var colorChannels = {
        // 0x1902 /* GL_DEPTH_COMPONENT */ - 0x1902: 1,
        // 0x1906 /* GL_ALPHA */ - 0x1902: 1,
        5: 3,
        6: 4,
        // 0x1909 /* GL_LUMINANCE */ - 0x1902: 1,
        8: 2,
        29502: 3,
        29504: 4,
      };
      return colorChannels[format - 0x1902]||1;
    }
  
  function heapObjectForWebGLType(type) {
      // Micro-optimization for size: Subtract lowest GL enum number (0x1400/* GL_BYTE */) from type to compare
      // smaller values for the heap, for shorter generated code size.
      // Also the type HEAPU16 is not tested for explicitly, but any unrecognized type will return out HEAPU16.
      // (since most types are HEAPU16)
      type -= 0x1400;
  
      if (type == 1) return HEAPU8;
  
  
      if (type == 4) return HEAP32;
  
      if (type == 6) return HEAPF32;
  
      if (type == 5
        || type == 28922
        )
        return HEAPU32;
  
      return HEAPU16;
    }
  
  function heapAccessShiftForWebGLHeap(heap) {
      return 31 - Math.clz32(heap.BYTES_PER_ELEMENT);
    }function emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, internalFormat) {
      var heap = heapObjectForWebGLType(type);
      var shift = heapAccessShiftForWebGLHeap(heap);
      var byteSize = 1<<shift;
      var sizePerPixel = __colorChannelsInGlTextureFormat(format) * byteSize;
      var bytes = computeUnpackAlignedImageSize(width, height, sizePerPixel, GL.unpackAlignment);
      return heap.subarray(pixels >> shift, pixels + bytes >> shift);
    }function _emscripten_glReadPixels(x, y, width, height, format, type, pixels) {
      var pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, format);
      if (!pixelData) {
        GL.recordError(0x500/*GL_INVALID_ENUM*/);
        return;
      }
      GLctx.readPixels(x, y, width, height, format, type, pixelData);
    }

  function _emscripten_glReleaseShaderCompiler() {
      // NOP (as allowed by GLES 2.0 spec)
    }

  function _emscripten_glRenderbufferStorage(x0, x1, x2, x3) { GLctx['renderbufferStorage'](x0, x1, x2, x3) }

  function _emscripten_glRotated(angle, x, y, z) {
      GLImmediate.matricesModified = true;
      GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1)|0;
      GLImmediate.matrixLib.mat4.rotate(GLImmediate.matrix[GLImmediate.currentMatrix], angle*Math.PI/180, [x, y, z]);
    }

  function _emscripten_glRotatef(angle, x, y, z) {
      GLImmediate.matricesModified = true;
      GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1)|0;
      GLImmediate.matrixLib.mat4.rotate(GLImmediate.matrix[GLImmediate.currentMatrix], angle*Math.PI/180, [x, y, z]);
    }

  function _emscripten_glSampleCoverage(value, invert) {
      GLctx.sampleCoverage(value, !!invert);
    }

  function _emscripten_glScaled(x, y, z) {
      GLImmediate.matricesModified = true;
      GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1)|0;
      GLImmediate.matrixLib.mat4.scale(GLImmediate.matrix[GLImmediate.currentMatrix], [x, y, z]);
    }

  function _emscripten_glScalef(x, y, z) {
      GLImmediate.matricesModified = true;
      GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1)|0;
      GLImmediate.matrixLib.mat4.scale(GLImmediate.matrix[GLImmediate.currentMatrix], [x, y, z]);
    }

  function _emscripten_glScissor(x0, x1, x2, x3) { GLctx['scissor'](x0, x1, x2, x3) }

  function _emscripten_glShadeModel() { warnOnce('TODO: glShadeModel') }

  function _emscripten_glShaderBinary() {
      GL.recordError(0x500/*GL_INVALID_ENUM*/);
    }

  function _emscripten_glShaderSource(shader, count, string, length) {
      var source = GL.getSource(shader, count, string, length);
  
  
      GLctx.shaderSource(GL.shaders[shader], source);
    }

  function _emscripten_glStencilFunc(x0, x1, x2) { GLctx['stencilFunc'](x0, x1, x2) }

  function _emscripten_glStencilFuncSeparate(x0, x1, x2, x3) { GLctx['stencilFuncSeparate'](x0, x1, x2, x3) }

  function _emscripten_glStencilMask(x0) { GLctx['stencilMask'](x0) }

  function _emscripten_glStencilMaskSeparate(x0, x1) { GLctx['stencilMaskSeparate'](x0, x1) }

  function _emscripten_glStencilOp(x0, x1, x2) { GLctx['stencilOp'](x0, x1, x2) }

  function _emscripten_glStencilOpSeparate(x0, x1, x2, x3) { GLctx['stencilOpSeparate'](x0, x1, x2, x3) }

  function _emscripten_glTexCoord2f(u, v) {
      assert(GLImmediate.mode >= 0); // must be in begin/end
      GLImmediate.vertexData[GLImmediate.vertexCounter++] = u;
      GLImmediate.vertexData[GLImmediate.vertexCounter++] = v;
      GLImmediate.addRendererComponent(GLImmediate.TEXTURE0, 2, GLctx.FLOAT);
    }

  
  function _emscripten_glTexCoord2i(u, v) {
      assert(GLImmediate.mode >= 0); // must be in begin/end
      GLImmediate.vertexData[GLImmediate.vertexCounter++] = u;
      GLImmediate.vertexData[GLImmediate.vertexCounter++] = v;
      GLImmediate.addRendererComponent(GLImmediate.TEXTURE0, 2, GLctx.FLOAT);
    }function _emscripten_glTexCoord2fv(v) {
      _emscripten_glTexCoord2i(HEAPF32[((v)>>2)], HEAPF32[(((v)+(4))>>2)]);
    }


  function _emscripten_glTexCoord3f() { throw 'glTexCoord3f: TODO' }

  function _emscripten_glTexCoord4f() { throw 'glTexCoord4f: TODO' }

  function _emscripten_glTexCoordPointer(size, type, stride, pointer) {
      GLImmediate.setClientAttribute(GLImmediate.TEXTURE0 + GLImmediate.clientActiveTexture, size, type, stride, pointer);
      if (GLctx.currentArrayBufferBinding) {
        var loc = GLImmediate.TEXTURE0 + GLImmediate.clientActiveTexture;
        GLctx.vertexAttribPointer(loc, size, type, false, stride, pointer);
      }
    }

  function _emscripten_glTexGenfv() { throw 'glTexGenfv: TODO' }

  function _emscripten_glTexGeni() { throw 'glTexGeni: TODO' }

  function _emscripten_glTexImage1D() { throw 'glTexImage1D: TODO' }

  function _emscripten_glTexImage2D(target, level, internalFormat, width, height, border, format, type, pixels) {
      GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixels ? emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, internalFormat) : null);
    }

  function _emscripten_glTexParameterf(x0, x1, x2) { GLctx['texParameterf'](x0, x1, x2) }

  function _emscripten_glTexParameterfv(target, pname, params) {
      var param = HEAPF32[((params)>>2)];
      GLctx.texParameterf(target, pname, param);
    }

  function _emscripten_glTexParameteri(x0, x1, x2) { GLctx['texParameteri'](x0, x1, x2) }

  function _emscripten_glTexParameteriv(target, pname, params) {
      var param = HEAP32[((params)>>2)];
      GLctx.texParameteri(target, pname, param);
    }

  function _emscripten_glTexSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels) {
      var pixelData = null;
      if (pixels) pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, 0);
      GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixelData);
    }

  function _emscripten_glTranslated(x, y, z) {
      GLImmediate.matricesModified = true;
      GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1)|0;
      GLImmediate.matrixLib.mat4.translate(GLImmediate.matrix[GLImmediate.currentMatrix], [x, y, z]);
    }

  function _emscripten_glTranslatef(x, y, z) {
      GLImmediate.matricesModified = true;
      GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1)|0;
      GLImmediate.matrixLib.mat4.translate(GLImmediate.matrix[GLImmediate.currentMatrix], [x, y, z]);
    }

  function _emscripten_glUniform1f(location, v0) {
      GLctx.uniform1f(GL.uniforms[location], v0);
    }

  
  var miniTempWebGLFloatBuffers=[];function _emscripten_glUniform1fv(location, count, value) {
  
  
  
      if (count <= 288) {
        // avoid allocation when uploading few enough uniforms
        var view = miniTempWebGLFloatBuffers[count-1];
        for (var i = 0; i < count; ++i) {
          view[i] = HEAPF32[(((value)+(4*i))>>2)];
        }
      } else
      {
        var view = HEAPF32.subarray((value)>>2,(value+count*4)>>2);
      }
      GLctx.uniform1fv(GL.uniforms[location], view);
    }

  function _emscripten_glUniform1i(location, v0) {
      GLctx.uniform1i(GL.uniforms[location], v0);
    }

  
  var __miniTempWebGLIntBuffers=[];function _emscripten_glUniform1iv(location, count, value) {
  
  
  
      if (count <= 288) {
        // avoid allocation when uploading few enough uniforms
        var view = __miniTempWebGLIntBuffers[count-1];
        for (var i = 0; i < count; ++i) {
          view[i] = HEAP32[(((value)+(4*i))>>2)];
        }
      } else
      {
        var view = HEAP32.subarray((value)>>2,(value+count*4)>>2);
      }
      GLctx.uniform1iv(GL.uniforms[location], view);
    }

  function _emscripten_glUniform2f(location, v0, v1) {
      GLctx.uniform2f(GL.uniforms[location], v0, v1);
    }

  function _emscripten_glUniform2fv(location, count, value) {
  
  
  
      if (count <= 144) {
        // avoid allocation when uploading few enough uniforms
        var view = miniTempWebGLFloatBuffers[2*count-1];
        for (var i = 0; i < 2*count; i += 2) {
          view[i] = HEAPF32[(((value)+(4*i))>>2)];
          view[i+1] = HEAPF32[(((value)+(4*i+4))>>2)];
        }
      } else
      {
        var view = HEAPF32.subarray((value)>>2,(value+count*8)>>2);
      }
      GLctx.uniform2fv(GL.uniforms[location], view);
    }

  function _emscripten_glUniform2i(location, v0, v1) {
      GLctx.uniform2i(GL.uniforms[location], v0, v1);
    }

  function _emscripten_glUniform2iv(location, count, value) {
  
  
  
      if (count <= 144) {
        // avoid allocation when uploading few enough uniforms
        var view = __miniTempWebGLIntBuffers[2*count-1];
        for (var i = 0; i < 2*count; i += 2) {
          view[i] = HEAP32[(((value)+(4*i))>>2)];
          view[i+1] = HEAP32[(((value)+(4*i+4))>>2)];
        }
      } else
      {
        var view = HEAP32.subarray((value)>>2,(value+count*8)>>2);
      }
      GLctx.uniform2iv(GL.uniforms[location], view);
    }

  function _emscripten_glUniform3f(location, v0, v1, v2) {
      GLctx.uniform3f(GL.uniforms[location], v0, v1, v2);
    }

  function _emscripten_glUniform3fv(location, count, value) {
  
  
  
      if (count <= 96) {
        // avoid allocation when uploading few enough uniforms
        var view = miniTempWebGLFloatBuffers[3*count-1];
        for (var i = 0; i < 3*count; i += 3) {
          view[i] = HEAPF32[(((value)+(4*i))>>2)];
          view[i+1] = HEAPF32[(((value)+(4*i+4))>>2)];
          view[i+2] = HEAPF32[(((value)+(4*i+8))>>2)];
        }
      } else
      {
        var view = HEAPF32.subarray((value)>>2,(value+count*12)>>2);
      }
      GLctx.uniform3fv(GL.uniforms[location], view);
    }

  function _emscripten_glUniform3i(location, v0, v1, v2) {
      GLctx.uniform3i(GL.uniforms[location], v0, v1, v2);
    }

  function _emscripten_glUniform3iv(location, count, value) {
  
  
  
      if (count <= 96) {
        // avoid allocation when uploading few enough uniforms
        var view = __miniTempWebGLIntBuffers[3*count-1];
        for (var i = 0; i < 3*count; i += 3) {
          view[i] = HEAP32[(((value)+(4*i))>>2)];
          view[i+1] = HEAP32[(((value)+(4*i+4))>>2)];
          view[i+2] = HEAP32[(((value)+(4*i+8))>>2)];
        }
      } else
      {
        var view = HEAP32.subarray((value)>>2,(value+count*12)>>2);
      }
      GLctx.uniform3iv(GL.uniforms[location], view);
    }

  function _emscripten_glUniform4f(location, v0, v1, v2, v3) {
      GLctx.uniform4f(GL.uniforms[location], v0, v1, v2, v3);
    }

  function _emscripten_glUniform4fv(location, count, value) {
  
  
  
      if (count <= 72) {
        // avoid allocation when uploading few enough uniforms
        var view = miniTempWebGLFloatBuffers[4*count-1];
        // hoist the heap out of the loop for size and for pthreads+growth.
        var heap = HEAPF32;
        value >>= 2;
        for (var i = 0; i < 4 * count; i += 4) {
          var dst = value + i;
          view[i] = heap[dst];
          view[i + 1] = heap[dst + 1];
          view[i + 2] = heap[dst + 2];
          view[i + 3] = heap[dst + 3];
        }
      } else
      {
        var view = HEAPF32.subarray((value)>>2,(value+count*16)>>2);
      }
      GLctx.uniform4fv(GL.uniforms[location], view);
    }

  function _emscripten_glUniform4i(location, v0, v1, v2, v3) {
      GLctx.uniform4i(GL.uniforms[location], v0, v1, v2, v3);
    }

  function _emscripten_glUniform4iv(location, count, value) {
  
  
  
      if (count <= 72) {
        // avoid allocation when uploading few enough uniforms
        var view = __miniTempWebGLIntBuffers[4*count-1];
        for (var i = 0; i < 4*count; i += 4) {
          view[i] = HEAP32[(((value)+(4*i))>>2)];
          view[i+1] = HEAP32[(((value)+(4*i+4))>>2)];
          view[i+2] = HEAP32[(((value)+(4*i+8))>>2)];
          view[i+3] = HEAP32[(((value)+(4*i+12))>>2)];
        }
      } else
      {
        var view = HEAP32.subarray((value)>>2,(value+count*16)>>2);
      }
      GLctx.uniform4iv(GL.uniforms[location], view);
    }

  function _emscripten_glUniformMatrix2fv(location, count, transpose, value) {
  
  
  
      if (count <= 72) {
        // avoid allocation when uploading few enough uniforms
        var view = miniTempWebGLFloatBuffers[4*count-1];
        for (var i = 0; i < 4*count; i += 4) {
          view[i] = HEAPF32[(((value)+(4*i))>>2)];
          view[i+1] = HEAPF32[(((value)+(4*i+4))>>2)];
          view[i+2] = HEAPF32[(((value)+(4*i+8))>>2)];
          view[i+3] = HEAPF32[(((value)+(4*i+12))>>2)];
        }
      } else
      {
        var view = HEAPF32.subarray((value)>>2,(value+count*16)>>2);
      }
      GLctx.uniformMatrix2fv(GL.uniforms[location], !!transpose, view);
    }

  function _emscripten_glUniformMatrix3fv(location, count, transpose, value) {
  
  
  
      if (count <= 32) {
        // avoid allocation when uploading few enough uniforms
        var view = miniTempWebGLFloatBuffers[9*count-1];
        for (var i = 0; i < 9*count; i += 9) {
          view[i] = HEAPF32[(((value)+(4*i))>>2)];
          view[i+1] = HEAPF32[(((value)+(4*i+4))>>2)];
          view[i+2] = HEAPF32[(((value)+(4*i+8))>>2)];
          view[i+3] = HEAPF32[(((value)+(4*i+12))>>2)];
          view[i+4] = HEAPF32[(((value)+(4*i+16))>>2)];
          view[i+5] = HEAPF32[(((value)+(4*i+20))>>2)];
          view[i+6] = HEAPF32[(((value)+(4*i+24))>>2)];
          view[i+7] = HEAPF32[(((value)+(4*i+28))>>2)];
          view[i+8] = HEAPF32[(((value)+(4*i+32))>>2)];
        }
      } else
      {
        var view = HEAPF32.subarray((value)>>2,(value+count*36)>>2);
      }
      GLctx.uniformMatrix3fv(GL.uniforms[location], !!transpose, view);
    }

  function _emscripten_glUniformMatrix4fv(location, count, transpose, value) {
  
  
  
      if (count <= 18) {
        // avoid allocation when uploading few enough uniforms
        var view = miniTempWebGLFloatBuffers[16*count-1];
        // hoist the heap out of the loop for size and for pthreads+growth.
        var heap = HEAPF32;
        value >>= 2;
        for (var i = 0; i < 16 * count; i += 16) {
          var dst = value + i;
          view[i] = heap[dst];
          view[i + 1] = heap[dst + 1];
          view[i + 2] = heap[dst + 2];
          view[i + 3] = heap[dst + 3];
          view[i + 4] = heap[dst + 4];
          view[i + 5] = heap[dst + 5];
          view[i + 6] = heap[dst + 6];
          view[i + 7] = heap[dst + 7];
          view[i + 8] = heap[dst + 8];
          view[i + 9] = heap[dst + 9];
          view[i + 10] = heap[dst + 10];
          view[i + 11] = heap[dst + 11];
          view[i + 12] = heap[dst + 12];
          view[i + 13] = heap[dst + 13];
          view[i + 14] = heap[dst + 14];
          view[i + 15] = heap[dst + 15];
        }
      } else
      {
        var view = HEAPF32.subarray((value)>>2,(value+count*64)>>2);
      }
      GLctx.uniformMatrix4fv(GL.uniforms[location], !!transpose, view);
    }

  function _emscripten_glUseProgram(program) {
      GLctx.useProgram(GL.programs[program]);
    }

  function _emscripten_glValidateProgram(program) {
      GLctx.validateProgram(GL.programs[program]);
    }

  function _emscripten_glVertex2f(x, y) {
      assert(GLImmediate.mode >= 0); // must be in begin/end
      GLImmediate.vertexData[GLImmediate.vertexCounter++] = x;
      GLImmediate.vertexData[GLImmediate.vertexCounter++] = y;
      GLImmediate.vertexData[GLImmediate.vertexCounter++] = 0;
      GLImmediate.vertexData[GLImmediate.vertexCounter++] = 1;
      assert(GLImmediate.vertexCounter << 2 < GL.MAX_TEMP_BUFFER_SIZE);
      GLImmediate.addRendererComponent(GLImmediate.VERTEX, 4, GLctx.FLOAT);
    }

  function _emscripten_glVertex2fv(p) {
      _emscripten_glVertex2f(HEAPF32[((p)>>2)], HEAPF32[(((p)+(4))>>2)]);
    }

  function _emscripten_glVertex2i(x, y) {
      assert(GLImmediate.mode >= 0); // must be in begin/end
      GLImmediate.vertexData[GLImmediate.vertexCounter++] = x;
      GLImmediate.vertexData[GLImmediate.vertexCounter++] = y;
      GLImmediate.vertexData[GLImmediate.vertexCounter++] = 0;
      GLImmediate.vertexData[GLImmediate.vertexCounter++] = 1;
      assert(GLImmediate.vertexCounter << 2 < GL.MAX_TEMP_BUFFER_SIZE);
      GLImmediate.addRendererComponent(GLImmediate.VERTEX, 4, GLctx.FLOAT);
    }

  function _emscripten_glVertex3f(x, y, z) {
      assert(GLImmediate.mode >= 0); // must be in begin/end
      GLImmediate.vertexData[GLImmediate.vertexCounter++] = x;
      GLImmediate.vertexData[GLImmediate.vertexCounter++] = y;
      GLImmediate.vertexData[GLImmediate.vertexCounter++] = z;
      GLImmediate.vertexData[GLImmediate.vertexCounter++] = 1;
      assert(GLImmediate.vertexCounter << 2 < GL.MAX_TEMP_BUFFER_SIZE);
      GLImmediate.addRendererComponent(GLImmediate.VERTEX, 4, GLctx.FLOAT);
    }

  function _emscripten_glVertex3fv(p) {
      _emscripten_glVertex3f(HEAPF32[((p)>>2)], HEAPF32[(((p)+(4))>>2)], HEAPF32[(((p)+(8))>>2)]);
    }

  function _emscripten_glVertex3i(x, y, z) {
      assert(GLImmediate.mode >= 0); // must be in begin/end
      GLImmediate.vertexData[GLImmediate.vertexCounter++] = x;
      GLImmediate.vertexData[GLImmediate.vertexCounter++] = y;
      GLImmediate.vertexData[GLImmediate.vertexCounter++] = z;
      GLImmediate.vertexData[GLImmediate.vertexCounter++] = 1;
      assert(GLImmediate.vertexCounter << 2 < GL.MAX_TEMP_BUFFER_SIZE);
      GLImmediate.addRendererComponent(GLImmediate.VERTEX, 4, GLctx.FLOAT);
    }

  function _emscripten_glVertex4f(x, y, z, w) {
      assert(GLImmediate.mode >= 0); // must be in begin/end
      GLImmediate.vertexData[GLImmediate.vertexCounter++] = x;
      GLImmediate.vertexData[GLImmediate.vertexCounter++] = y;
      GLImmediate.vertexData[GLImmediate.vertexCounter++] = z;
      GLImmediate.vertexData[GLImmediate.vertexCounter++] = w;
      assert(GLImmediate.vertexCounter << 2 < GL.MAX_TEMP_BUFFER_SIZE);
      GLImmediate.addRendererComponent(GLImmediate.VERTEX, 4, GLctx.FLOAT);
    }

  function _emscripten_glVertex4fv(p) {
      _emscripten_glVertex4f(HEAPF32[((p)>>2)], HEAPF32[(((p)+(4))>>2)], HEAPF32[(((p)+(8))>>2)], HEAPF32[(((p)+(12))>>2)]);
    }

  function _emscripten_glVertex4i(x, y, z, w) {
      assert(GLImmediate.mode >= 0); // must be in begin/end
      GLImmediate.vertexData[GLImmediate.vertexCounter++] = x;
      GLImmediate.vertexData[GLImmediate.vertexCounter++] = y;
      GLImmediate.vertexData[GLImmediate.vertexCounter++] = z;
      GLImmediate.vertexData[GLImmediate.vertexCounter++] = w;
      assert(GLImmediate.vertexCounter << 2 < GL.MAX_TEMP_BUFFER_SIZE);
      GLImmediate.addRendererComponent(GLImmediate.VERTEX, 4, GLctx.FLOAT);
    }

  function _emscripten_glVertexAttrib1f(x0, x1) { GLctx['vertexAttrib1f'](x0, x1) }

  function _emscripten_glVertexAttrib1fv(index, v) {
  
      GLctx.vertexAttrib1f(index, HEAPF32[v>>2]);
    }

  function _emscripten_glVertexAttrib2f(x0, x1, x2) { GLctx['vertexAttrib2f'](x0, x1, x2) }

  function _emscripten_glVertexAttrib2fv(index, v) {
  
      GLctx.vertexAttrib2f(index, HEAPF32[v>>2], HEAPF32[v+4>>2]);
    }

  function _emscripten_glVertexAttrib3f(x0, x1, x2, x3) { GLctx['vertexAttrib3f'](x0, x1, x2, x3) }

  function _emscripten_glVertexAttrib3fv(index, v) {
  
      GLctx.vertexAttrib3f(index, HEAPF32[v>>2], HEAPF32[v+4>>2], HEAPF32[v+8>>2]);
    }

  function _emscripten_glVertexAttrib4f(x0, x1, x2, x3, x4) { GLctx['vertexAttrib4f'](x0, x1, x2, x3, x4) }

  function _emscripten_glVertexAttrib4fv(index, v) {
  
      GLctx.vertexAttrib4f(index, HEAPF32[v>>2], HEAPF32[v+4>>2], HEAPF32[v+8>>2], HEAPF32[v+12>>2]);
    }

  function _emscripten_glVertexAttribDivisorANGLE(index, divisor) {
      GLctx['vertexAttribDivisor'](index, divisor);
    }

  function _emscripten_glVertexAttribPointer(index, size, type, normalized, stride, ptr) {
      GLctx.vertexAttribPointer(index, size, type, !!normalized, stride, ptr);
    }

  function _emscripten_glVertexPointer(size, type, stride, pointer) {
      GLImmediate.setClientAttribute(GLImmediate.VERTEX, size, type, stride, pointer);
      if (GLctx.currentArrayBufferBinding) {
        GLctx.vertexAttribPointer(GLImmediate.VERTEX, size, type, false, stride, pointer);
      }
    }

  function _emscripten_glViewport(x0, x1, x2, x3) { GLctx['viewport'](x0, x1, x2, x3) }

  function _emscripten_has_asyncify() {
      return 0;
    }

  function _emscripten_is_main_browser_thread() {
      return !ENVIRONMENT_IS_WORKER;
    }

  
  function _longjmp(env, value) {
      _setThrew(env, value || 1);
      throw 'longjmp';
    }function _emscripten_longjmp(env, value) {
      _longjmp(env, value);
    }

  function _emscripten_memcpy_big(dest, src, num) {
      HEAPU8.copyWithin(dest, src, src + num);
    }

  
  function __emscripten_do_request_fullscreen(target, strategy) {
      if (!JSEvents.fullscreenEnabled()) return -1;
      target = findEventTarget(target);
      if (!target) return -4;
  
      if (!target.requestFullscreen
        && !target.webkitRequestFullscreen
        ) {
        return -3;
      }
  
      var canPerformRequests = JSEvents.canPerformEventHandlerRequests();
  
      // Queue this function call if we're not currently in an event handler and the user saw it appropriate to do so.
      if (!canPerformRequests) {
        if (strategy.deferUntilInEventHandler) {
          JSEvents.deferCall(_JSEvents_requestFullscreen, 1 /* priority over pointer lock */, [target, strategy]);
          return 1;
        } else {
          return -2;
        }
      }
  
      return _JSEvents_requestFullscreen(target, strategy);
    }function _emscripten_request_fullscreen_strategy(target, deferUntilInEventHandler, fullscreenStrategy) {
      var strategy = {
        scaleMode: HEAP32[((fullscreenStrategy)>>2)],
        canvasResolutionScaleMode: HEAP32[(((fullscreenStrategy)+(4))>>2)],
        filteringMode: HEAP32[(((fullscreenStrategy)+(8))>>2)],
        deferUntilInEventHandler: deferUntilInEventHandler,
        canvasResizedCallback: HEAP32[(((fullscreenStrategy)+(12))>>2)],
        canvasResizedCallbackUserData: HEAP32[(((fullscreenStrategy)+(16))>>2)]
      };
  
      return __emscripten_do_request_fullscreen(target, strategy);
    }

  function _emscripten_request_pointerlock(target, deferUntilInEventHandler) {
      target = findEventTarget(target);
      if (!target) return -4;
      if (!target.requestPointerLock
        && !target.msRequestPointerLock
        ) {
        return -1;
      }
  
      var canPerformRequests = JSEvents.canPerformEventHandlerRequests();
  
      // Queue this function call if we're not currently in an event handler and the user saw it appropriate to do so.
      if (!canPerformRequests) {
        if (deferUntilInEventHandler) {
          JSEvents.deferCall(__requestPointerLock, 2 /* priority below fullscreen */, [target]);
          return 1;
        } else {
          return -2;
        }
      }
  
      return __requestPointerLock(target);
    }

  
  function _emscripten_get_heap_size() {
      return HEAPU8.length;
    }
  
  function emscripten_realloc_buffer(size) {
      try {
        // round size grow request up to wasm page size (fixed 64KB per spec)
        wasmMemory.grow((size - buffer.byteLength + 65535) >>> 16); // .grow() takes a delta compared to the previous size
        updateGlobalBufferAndViews(wasmMemory.buffer);
        return 1 /*success*/;
      } catch(e) {
        console.error('emscripten_realloc_buffer: Attempted to grow heap from ' + buffer.byteLength  + ' bytes to ' + size + ' bytes, but got error: ' + e);
      }
    }function _emscripten_resize_heap(requestedSize) {
      requestedSize = requestedSize >>> 0;
      var oldSize = _emscripten_get_heap_size();
      // With pthreads, races can happen (another thread might increase the size in between), so return a failure, and let the caller retry.
      assert(requestedSize > oldSize);
  
  
      var PAGE_MULTIPLE = 65536;
  
      // Memory resize rules:
      // 1. When resizing, always produce a resized heap that is at least 16MB (to avoid tiny heap sizes receiving lots of repeated resizes at startup)
      // 2. Always increase heap size to at least the requested size, rounded up to next page multiple.
      // 3a. If MEMORY_GROWTH_LINEAR_STEP == -1, excessively resize the heap geometrically: increase the heap size according to 
      //                                         MEMORY_GROWTH_GEOMETRIC_STEP factor (default +20%),
      //                                         At most overreserve by MEMORY_GROWTH_GEOMETRIC_CAP bytes (default 96MB).
      // 3b. If MEMORY_GROWTH_LINEAR_STEP != -1, excessively resize the heap linearly: increase the heap size by at least MEMORY_GROWTH_LINEAR_STEP bytes.
      // 4. Max size for the heap is capped at 2048MB-PAGE_MULTIPLE, or by MAXIMUM_MEMORY, or by ASAN limit, depending on which is smallest
      // 5. If we were unable to allocate as much memory, it may be due to over-eager decision to excessively reserve due to (3) above.
      //    Hence if an allocation fails, cut down on the amount of excess growth, in an attempt to succeed to perform a smaller allocation.
  
      // A limit was set for how much we can grow. We should not exceed that
      // (the wasm binary specifies it, so if we tried, we'd fail anyhow).
      var maxHeapSize = 2147483648;
      if (requestedSize > maxHeapSize) {
        err('Cannot enlarge memory, asked to go up to ' + requestedSize + ' bytes, but the limit is ' + maxHeapSize + ' bytes!');
        return false;
      }
  
      var minHeapSize = 16777216;
  
      // Loop through potential heap size increases. If we attempt a too eager reservation that fails, cut down on the
      // attempted size and reserve a smaller bump instead. (max 3 times, chosen somewhat arbitrarily)
      for(var cutDown = 1; cutDown <= 4; cutDown *= 2) {
        var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown); // ensure geometric growth
        // but limit overreserving (default to capping at +96MB overgrowth at most)
        overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296 );
  
  
        var newSize = Math.min(maxHeapSize, alignUp(Math.max(minHeapSize, requestedSize, overGrownHeapSize), PAGE_MULTIPLE));
  
        var replacement = emscripten_realloc_buffer(newSize);
        if (replacement) {
  
          return true;
        }
      }
      err('Failed to grow the heap from ' + oldSize + ' bytes to ' + newSize + ' bytes, not enough memory!');
      return false;
    }

  function _emscripten_run_script(ptr) {
      eval(UTF8ToString(ptr));
    }

  /** @suppress{checkTypes} */
  function _emscripten_run_script_int(ptr) {
      return eval(UTF8ToString(ptr))|0;
    }

  function _emscripten_sample_gamepad_data() {
      return (JSEvents.lastGamepadState = (navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : null)))
        ? 0 : -1;
    }

  
  function __registerBeforeUnloadEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
      var beforeUnloadEventHandlerFunc = function(ev) {
        var e = ev || event;
  
        // Note: This is always called on the main browser thread, since it needs synchronously return a value!
        var confirmationMessage = dynCall_iiii(callbackfunc, eventTypeId, 0, userData);
        
        if (confirmationMessage) {
          confirmationMessage = UTF8ToString(confirmationMessage);
        }
        if (confirmationMessage) {
          e.preventDefault();
          e.returnValue = confirmationMessage;
          return confirmationMessage;
        }
      };
  
      var eventHandler = {
        target: findEventTarget(target),
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: beforeUnloadEventHandlerFunc,
        useCapture: useCapture
      };
      JSEvents.registerOrRemoveHandler(eventHandler);
    }function _emscripten_set_beforeunload_callback_on_thread(userData, callbackfunc, targetThread) {
      if (typeof onbeforeunload === 'undefined') return -1;
      // beforeunload callback can only be registered on the main browser thread, because the page will go away immediately after returning from the handler,
      // and there is no time to start proxying it anywhere.
      if (targetThread !== 1) return -5;
      __registerBeforeUnloadEventCallback(2, userData, true, callbackfunc, 28, "beforeunload");
      return 0;
    }

  
  function __registerFocusEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
      if (!JSEvents.focusEvent) JSEvents.focusEvent = _malloc( 256 );
  
      var focusEventHandlerFunc = function(ev) {
        var e = ev || event;
  
        var nodeName = JSEvents.getNodeNameForTarget(e.target);
        var id = e.target.id ? e.target.id : '';
  
        var focusEvent = JSEvents.focusEvent;
        stringToUTF8(nodeName, focusEvent + 0, 128);
        stringToUTF8(id, focusEvent + 128, 128);
  
        if (dynCall_iiii(callbackfunc, eventTypeId, focusEvent, userData)) e.preventDefault();
      };
  
      var eventHandler = {
        target: findEventTarget(target),
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: focusEventHandlerFunc,
        useCapture: useCapture
      };
      JSEvents.registerOrRemoveHandler(eventHandler);
    }function _emscripten_set_blur_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
      __registerFocusEventCallback(target, userData, useCapture, callbackfunc, 12, "blur", targetThread);
      return 0;
    }


  function _emscripten_set_element_css_size(target, width, height) {
      target = findEventTarget(target);
      if (!target) return -4;
  
      target.style.width = width + "px";
      target.style.height = height + "px";
  
      return 0;
    }

  function _emscripten_set_focus_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
      __registerFocusEventCallback(target, userData, useCapture, callbackfunc, 13, "focus", targetThread);
      return 0;
    }

  
  
  function __fillFullscreenChangeEventData(eventStruct) {
      var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
      var isFullscreen = !!fullscreenElement;
      /** @suppress{checkTypes} */
      HEAP32[((eventStruct)>>2)]=isFullscreen;
      HEAP32[(((eventStruct)+(4))>>2)]=JSEvents.fullscreenEnabled();
      // If transitioning to fullscreen, report info about the element that is now fullscreen.
      // If transitioning to windowed mode, report info about the element that just was fullscreen.
      var reportedElement = isFullscreen ? fullscreenElement : JSEvents.previousFullscreenElement;
      var nodeName = JSEvents.getNodeNameForTarget(reportedElement);
      var id = (reportedElement && reportedElement.id) ? reportedElement.id : '';
      stringToUTF8(nodeName, eventStruct + 8, 128);
      stringToUTF8(id, eventStruct + 136, 128);
      HEAP32[(((eventStruct)+(264))>>2)]=reportedElement ? reportedElement.clientWidth : 0;
      HEAP32[(((eventStruct)+(268))>>2)]=reportedElement ? reportedElement.clientHeight : 0;
      HEAP32[(((eventStruct)+(272))>>2)]=screen.width;
      HEAP32[(((eventStruct)+(276))>>2)]=screen.height;
      if (isFullscreen) {
        JSEvents.previousFullscreenElement = fullscreenElement;
      }
    }function __registerFullscreenChangeEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
      if (!JSEvents.fullscreenChangeEvent) JSEvents.fullscreenChangeEvent = _malloc( 280 );
  
      var fullscreenChangeEventhandlerFunc = function(ev) {
        var e = ev || event;
  
        var fullscreenChangeEvent = JSEvents.fullscreenChangeEvent;
  
        __fillFullscreenChangeEventData(fullscreenChangeEvent);
  
        if (dynCall_iiii(callbackfunc, eventTypeId, fullscreenChangeEvent, userData)) e.preventDefault();
      };
  
      var eventHandler = {
        target: target,
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: fullscreenChangeEventhandlerFunc,
        useCapture: useCapture
      };
      JSEvents.registerOrRemoveHandler(eventHandler);
    }function _emscripten_set_fullscreenchange_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
      if (!JSEvents.fullscreenEnabled()) return -1;
      target = findEventTarget(target);
      if (!target) return -4;
      __registerFullscreenChangeEventCallback(target, userData, useCapture, callbackfunc, 19, "fullscreenchange", targetThread);
  
  
      // Unprefixed Fullscreen API shipped in Chromium 71 (https://bugs.chromium.org/p/chromium/issues/detail?id=383813)
      // As of Safari 13.0.3 on macOS Catalina 10.15.1 still ships with prefixed webkitfullscreenchange. TODO: revisit this check once Safari ships unprefixed version.
      __registerFullscreenChangeEventCallback(target, userData, useCapture, callbackfunc, 19, "webkitfullscreenchange", targetThread);
  
      return 0;
    }

  
  function __registerGamepadEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
      if (!JSEvents.gamepadEvent) JSEvents.gamepadEvent = _malloc( 1432 );
  
      var gamepadEventHandlerFunc = function(ev) {
        var e = ev || event;
  
        var gamepadEvent = JSEvents.gamepadEvent;
        __fillGamepadEventData(gamepadEvent, e["gamepad"]);
  
        if (dynCall_iiii(callbackfunc, eventTypeId, gamepadEvent, userData)) e.preventDefault();
      };
  
      var eventHandler = {
        target: findEventTarget(target),
        allowsDeferredCalls: true,
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: gamepadEventHandlerFunc,
        useCapture: useCapture
      };
      JSEvents.registerOrRemoveHandler(eventHandler);
    }function _emscripten_set_gamepadconnected_callback_on_thread(userData, useCapture, callbackfunc, targetThread) {
      if (!navigator.getGamepads && !navigator.webkitGetGamepads) return -1;
      __registerGamepadEventCallback(2, userData, useCapture, callbackfunc, 26, "gamepadconnected", targetThread);
      return 0;
    }

  function _emscripten_set_gamepaddisconnected_callback_on_thread(userData, useCapture, callbackfunc, targetThread) {
      if (!navigator.getGamepads && !navigator.webkitGetGamepads) return -1;
      __registerGamepadEventCallback(2, userData, useCapture, callbackfunc, 27, "gamepaddisconnected", targetThread);
      return 0;
    }

  
  function __registerKeyEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
      if (!JSEvents.keyEvent) JSEvents.keyEvent = _malloc( 164 );
  
      var keyEventHandlerFunc = function(e) {
        assert(e);
  
        var keyEventData = JSEvents.keyEvent;
        var idx = keyEventData >> 2;
  
        HEAP32[idx + 0] = e.location;
        HEAP32[idx + 1] = e.ctrlKey;
        HEAP32[idx + 2] = e.shiftKey;
        HEAP32[idx + 3] = e.altKey;
        HEAP32[idx + 4] = e.metaKey;
        HEAP32[idx + 5] = e.repeat;
        HEAP32[idx + 6] = e.charCode;
        HEAP32[idx + 7] = e.keyCode;
        HEAP32[idx + 8] = e.which;
        stringToUTF8(e.key || '', keyEventData + 36, 32);
        stringToUTF8(e.code || '', keyEventData + 68, 32);
        stringToUTF8(e.char || '', keyEventData + 100, 32);
        stringToUTF8(e.locale || '', keyEventData + 132, 32);
  
        if (dynCall_iiii(callbackfunc, eventTypeId, keyEventData, userData)) e.preventDefault();
      };
  
      var eventHandler = {
        target: findEventTarget(target),
        allowsDeferredCalls: true,
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: keyEventHandlerFunc,
        useCapture: useCapture
      };
      JSEvents.registerOrRemoveHandler(eventHandler);
    }function _emscripten_set_keydown_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
      __registerKeyEventCallback(target, userData, useCapture, callbackfunc, 2, "keydown", targetThread);
      return 0;
    }

  function _emscripten_set_keypress_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
      __registerKeyEventCallback(target, userData, useCapture, callbackfunc, 1, "keypress", targetThread);
      return 0;
    }

  function _emscripten_set_keyup_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
      __registerKeyEventCallback(target, userData, useCapture, callbackfunc, 3, "keyup", targetThread);
      return 0;
    }


  
  
  function __fillMouseEventData(eventStruct, e, target) {
      assert(eventStruct % 4 == 0);
      var idx = eventStruct >> 2;
      HEAP32[idx + 0] = e.screenX;
      HEAP32[idx + 1] = e.screenY;
      HEAP32[idx + 2] = e.clientX;
      HEAP32[idx + 3] = e.clientY;
      HEAP32[idx + 4] = e.ctrlKey;
      HEAP32[idx + 5] = e.shiftKey;
      HEAP32[idx + 6] = e.altKey;
      HEAP32[idx + 7] = e.metaKey;
      HEAP16[idx*2 + 16] = e.button;
      HEAP16[idx*2 + 17] = e.buttons;
  
      HEAP32[idx + 9] = e["movementX"]
        ;
  
      HEAP32[idx + 10] = e["movementY"]
        ;
  
      var rect = __getBoundingClientRect(target);
      HEAP32[idx + 11] = e.clientX - rect.left;
      HEAP32[idx + 12] = e.clientY - rect.top;
  
    }function __registerMouseEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
      if (!JSEvents.mouseEvent) JSEvents.mouseEvent = _malloc( 64 );
      target = findEventTarget(target);
  
      var mouseEventHandlerFunc = function(ev) {
        var e = ev || event;
  
        // TODO: Make this access thread safe, or this could update live while app is reading it.
        __fillMouseEventData(JSEvents.mouseEvent, e, target);
  
        if (dynCall_iiii(callbackfunc, eventTypeId, JSEvents.mouseEvent, userData)) e.preventDefault();
      };
  
      var eventHandler = {
        target: target,
        allowsDeferredCalls: eventTypeString != 'mousemove' && eventTypeString != 'mouseenter' && eventTypeString != 'mouseleave', // Mouse move events do not allow fullscreen/pointer lock requests to be handled in them!
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: mouseEventHandlerFunc,
        useCapture: useCapture
      };
      JSEvents.registerOrRemoveHandler(eventHandler);
    }function _emscripten_set_mousedown_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
      __registerMouseEventCallback(target, userData, useCapture, callbackfunc, 5, "mousedown", targetThread);
      return 0;
    }

  function _emscripten_set_mouseenter_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
      __registerMouseEventCallback(target, userData, useCapture, callbackfunc, 33, "mouseenter", targetThread);
      return 0;
    }

  function _emscripten_set_mouseleave_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
      __registerMouseEventCallback(target, userData, useCapture, callbackfunc, 34, "mouseleave", targetThread);
      return 0;
    }

  function _emscripten_set_mousemove_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
      __registerMouseEventCallback(target, userData, useCapture, callbackfunc, 8, "mousemove", targetThread);
      return 0;
    }

  function _emscripten_set_mouseup_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
      __registerMouseEventCallback(target, userData, useCapture, callbackfunc, 6, "mouseup", targetThread);
      return 0;
    }

  
  
  function __fillPointerlockChangeEventData(eventStruct) {
      var pointerLockElement = document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement || document.msPointerLockElement;
      var isPointerlocked = !!pointerLockElement;
      /** @suppress {checkTypes} */
      HEAP32[((eventStruct)>>2)]=isPointerlocked;
      var nodeName = JSEvents.getNodeNameForTarget(pointerLockElement);
      var id = (pointerLockElement && pointerLockElement.id) ? pointerLockElement.id : '';
      stringToUTF8(nodeName, eventStruct + 4, 128);
      stringToUTF8(id, eventStruct + 132, 128);
    }function __registerPointerlockChangeEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
      if (!JSEvents.pointerlockChangeEvent) JSEvents.pointerlockChangeEvent = _malloc( 260 );
  
      var pointerlockChangeEventHandlerFunc = function(ev) {
        var e = ev || event;
  
        var pointerlockChangeEvent = JSEvents.pointerlockChangeEvent;
        __fillPointerlockChangeEventData(pointerlockChangeEvent);
  
        if (dynCall_iiii(callbackfunc, eventTypeId, pointerlockChangeEvent, userData)) e.preventDefault();
      };
  
      var eventHandler = {
        target: target,
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: pointerlockChangeEventHandlerFunc,
        useCapture: useCapture
      };
      JSEvents.registerOrRemoveHandler(eventHandler);
    }/** @suppress {missingProperties} */
  function _emscripten_set_pointerlockchange_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
      // TODO: Currently not supported in pthreads or in --proxy-to-worker mode. (In pthreads mode, document object is not defined)
      if (!document || !document.body || (!document.body.requestPointerLock && !document.body.mozRequestPointerLock && !document.body.webkitRequestPointerLock && !document.body.msRequestPointerLock)) {
        return -1;
      }
  
      target = findEventTarget(target);
      if (!target) return -4;
      __registerPointerlockChangeEventCallback(target, userData, useCapture, callbackfunc, 20, "pointerlockchange", targetThread);
      __registerPointerlockChangeEventCallback(target, userData, useCapture, callbackfunc, 20, "mozpointerlockchange", targetThread);
      __registerPointerlockChangeEventCallback(target, userData, useCapture, callbackfunc, 20, "webkitpointerlockchange", targetThread);
      __registerPointerlockChangeEventCallback(target, userData, useCapture, callbackfunc, 20, "mspointerlockchange", targetThread);
      return 0;
    }

  
  function __registerUiEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
      if (!JSEvents.uiEvent) JSEvents.uiEvent = _malloc( 36 );
  
      target = findEventTarget(target);
  
      var uiEventHandlerFunc = function(ev) {
        var e = ev || event;
        if (e.target != target) {
          // Never take ui events such as scroll via a 'bubbled' route, but always from the direct element that
          // was targeted. Otherwise e.g. if app logs a message in response to a page scroll, the Emscripten log
          // message box could cause to scroll, generating a new (bubbled) scroll message, causing a new log print,
          // causing a new scroll, etc..
          return;
        }
        var uiEvent = JSEvents.uiEvent;
        var b = document.body; // Take document.body to a variable, Closure compiler does not outline access to it on its own.
        HEAP32[((uiEvent)>>2)]=e.detail;
        HEAP32[(((uiEvent)+(4))>>2)]=b.clientWidth;
        HEAP32[(((uiEvent)+(8))>>2)]=b.clientHeight;
        HEAP32[(((uiEvent)+(12))>>2)]=innerWidth;
        HEAP32[(((uiEvent)+(16))>>2)]=innerHeight;
        HEAP32[(((uiEvent)+(20))>>2)]=outerWidth;
        HEAP32[(((uiEvent)+(24))>>2)]=outerHeight;
        HEAP32[(((uiEvent)+(28))>>2)]=pageXOffset;
        HEAP32[(((uiEvent)+(32))>>2)]=pageYOffset;
        if (dynCall_iiii(callbackfunc, eventTypeId, uiEvent, userData)) e.preventDefault();
      };
  
      var eventHandler = {
        target: target,
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: uiEventHandlerFunc,
        useCapture: useCapture
      };
      JSEvents.registerOrRemoveHandler(eventHandler);
    }function _emscripten_set_resize_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
      __registerUiEventCallback(target, userData, useCapture, callbackfunc, 10, "resize", targetThread);
      return 0;
    }

  
  function __registerTouchEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
      if (!JSEvents.touchEvent) JSEvents.touchEvent = _malloc( 1684 );
  
      target = findEventTarget(target);
  
      var touchEventHandlerFunc = function(e) {
        assert(e);
        var touches = {};
        var et = e.touches;
        for(var i = 0; i < et.length; ++i) {
          var touch = et[i];
          // Verify that browser does not recycle touch objects with old stale data, but reports new ones each time.
          assert(!touch.isChanged);
          assert(!touch.onTarget);
          touches[touch.identifier] = touch;
        }
        et = e.changedTouches;
        for(var i = 0; i < et.length; ++i) {
          var touch = et[i];
          // Verify that browser does not recycle touch objects with old stale data, but reports new ones each time.
          assert(!touch.onTarget);
          touch.isChanged = 1;
          touches[touch.identifier] = touch;
        }
        et = e.targetTouches;
        for(var i = 0; i < et.length; ++i) {
          touches[et[i].identifier].onTarget = 1;
        }
  
        var touchEvent = JSEvents.touchEvent;
        var idx = touchEvent>>2; // Pre-shift the ptr to index to HEAP32 to save code size
        HEAP32[idx + 1] = e.ctrlKey;
        HEAP32[idx + 2] = e.shiftKey;
        HEAP32[idx + 3] = e.altKey;
        HEAP32[idx + 4] = e.metaKey;
        idx += 5; // Advance to the start of the touch array.
        var targetRect = __getBoundingClientRect(target);
        var numTouches = 0;
        for(var i in touches) {
          var t = touches[i];
          HEAP32[idx + 0] = t.identifier;
          HEAP32[idx + 1] = t.screenX;
          HEAP32[idx + 2] = t.screenY;
          HEAP32[idx + 3] = t.clientX;
          HEAP32[idx + 4] = t.clientY;
          HEAP32[idx + 5] = t.pageX;
          HEAP32[idx + 6] = t.pageY;
          HEAP32[idx + 7] = t.isChanged;
          HEAP32[idx + 8] = t.onTarget;
          HEAP32[idx + 9] = t.clientX - targetRect.left;
          HEAP32[idx + 10] = t.clientY - targetRect.top;
  
          idx += 13;
  
          if (++numTouches > 31) {
            break;
          }
        }
        HEAP32[((touchEvent)>>2)]=numTouches;
  
        if (dynCall_iiii(callbackfunc, eventTypeId, touchEvent, userData)) e.preventDefault();
      };
  
      var eventHandler = {
        target: target,
        allowsDeferredCalls: eventTypeString == 'touchstart' || eventTypeString == 'touchend',
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: touchEventHandlerFunc,
        useCapture: useCapture
      };
      JSEvents.registerOrRemoveHandler(eventHandler);
    }function _emscripten_set_touchcancel_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
      __registerTouchEventCallback(target, userData, useCapture, callbackfunc, 25, "touchcancel", targetThread);
      return 0;
    }

  function _emscripten_set_touchend_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
      __registerTouchEventCallback(target, userData, useCapture, callbackfunc, 23, "touchend", targetThread);
      return 0;
    }

  function _emscripten_set_touchmove_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
      __registerTouchEventCallback(target, userData, useCapture, callbackfunc, 24, "touchmove", targetThread);
      return 0;
    }

  function _emscripten_set_touchstart_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
      __registerTouchEventCallback(target, userData, useCapture, callbackfunc, 22, "touchstart", targetThread);
      return 0;
    }

  
  
  function __fillVisibilityChangeEventData(eventStruct) {
      var visibilityStates = [ "hidden", "visible", "prerender", "unloaded" ];
      var visibilityState = visibilityStates.indexOf(document.visibilityState);
  
      // Assigning a boolean to HEAP32 with expected type coercion.
      /** @suppress {checkTypes} */
      HEAP32[((eventStruct)>>2)]=document.hidden;
      HEAP32[(((eventStruct)+(4))>>2)]=visibilityState;
    }function __registerVisibilityChangeEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
      if (!JSEvents.visibilityChangeEvent) JSEvents.visibilityChangeEvent = _malloc( 8 );
  
      var visibilityChangeEventHandlerFunc = function(ev) {
        var e = ev || event;
  
        var visibilityChangeEvent = JSEvents.visibilityChangeEvent;
  
        __fillVisibilityChangeEventData(visibilityChangeEvent);
  
        if (dynCall_iiii(callbackfunc, eventTypeId, visibilityChangeEvent, userData)) e.preventDefault();
      };
  
      var eventHandler = {
        target: target,
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: visibilityChangeEventHandlerFunc,
        useCapture: useCapture
      };
      JSEvents.registerOrRemoveHandler(eventHandler);
    }function _emscripten_set_visibilitychange_callback_on_thread(userData, useCapture, callbackfunc, targetThread) {
    if (!specialHTMLTargets[1]) {
      return -4;
    }
      __registerVisibilityChangeEventCallback(specialHTMLTargets[1], userData, useCapture, callbackfunc, 21, "visibilitychange", targetThread);
      return 0;
    }

  
  function __registerWheelEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
      if (!JSEvents.wheelEvent) JSEvents.wheelEvent = _malloc( 96 );
  
      // The DOM Level 3 events spec event 'wheel'
      var wheelHandlerFunc = function(ev) {
        var e = ev || event;
        var wheelEvent = JSEvents.wheelEvent;
        __fillMouseEventData(wheelEvent, e, target);
        HEAPF64[(((wheelEvent)+(64))>>3)]=e["deltaX"];
        HEAPF64[(((wheelEvent)+(72))>>3)]=e["deltaY"];
        HEAPF64[(((wheelEvent)+(80))>>3)]=e["deltaZ"];
        HEAP32[(((wheelEvent)+(88))>>2)]=e["deltaMode"];
        if (dynCall_iiii(callbackfunc, eventTypeId, wheelEvent, userData)) e.preventDefault();
      };
  
      var eventHandler = {
        target: target,
        allowsDeferredCalls: true,
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: wheelHandlerFunc,
        useCapture: useCapture
      };
      JSEvents.registerOrRemoveHandler(eventHandler);
    }function _emscripten_set_wheel_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
      target = findEventTarget(target);
      if (typeof target.onwheel !== 'undefined') {
        __registerWheelEventCallback(target, userData, useCapture, callbackfunc, 9, "wheel", targetThread);
        return 0;
      } else {
        return -1;
      }
    }

  function _emscripten_sleep() {
      throw 'Please compile your program with async support in order to use asynchronous operations like emscripten_sleep';
    }

  
  var Fetch={xhrs:[],setu64:function(addr, val) {
      HEAPU32[addr >> 2] = val;
      HEAPU32[addr + 4 >> 2] = (val / 4294967296)|0;
    },openDatabase:function(dbname, dbversion, onsuccess, onerror) {
      try {
        var openRequest = indexedDB.open(dbname, dbversion);
      } catch (e) { return onerror(e); }
  
      openRequest.onupgradeneeded = function(event) {
        var db = event.target.result;
        if (db.objectStoreNames.contains('FILES')) {
          db.deleteObjectStore('FILES');
        }
        db.createObjectStore('FILES');
      };
      openRequest.onsuccess = function(event) { onsuccess(event.target.result); };
      openRequest.onerror = function(error) { onerror(error); };
    },staticInit:function() {
      var isMainThread = true;
  
      var onsuccess = function(db) {
        Fetch.dbInstance = db;
  
        if (isMainThread) {
          removeRunDependency('library_fetch_init');
        }
      };
      var onerror = function() {
        Fetch.dbInstance = false;
  
        if (isMainThread) {
          removeRunDependency('library_fetch_init');
        }
      };
      Fetch.openDatabase('emscripten_filesystem', 1, onsuccess, onerror);
  
      if (typeof ENVIRONMENT_IS_FETCH_WORKER === 'undefined' || !ENVIRONMENT_IS_FETCH_WORKER) addRunDependency('library_fetch_init');
    }};
  
  function __emscripten_fetch_xhr(fetch, onsuccess, onerror, onprogress, onreadystatechange) {
    var url = HEAPU32[fetch + 8 >> 2];
    if (!url) {
      onerror(fetch, 0, 'no url specified!');
      return;
    }
    var url_ = UTF8ToString(url);
  
    var fetch_attr = fetch + 112;
    var requestMethod = UTF8ToString(fetch_attr);
    if (!requestMethod) requestMethod = 'GET';
    var userData = HEAPU32[fetch_attr + 32 >> 2];
    var fetchAttributes = HEAPU32[fetch_attr + 52 >> 2];
    var timeoutMsecs = HEAPU32[fetch_attr + 56 >> 2];
    var withCredentials = !!HEAPU32[fetch_attr + 60 >> 2];
    var destinationPath = HEAPU32[fetch_attr + 64 >> 2];
    var userName = HEAPU32[fetch_attr + 68 >> 2];
    var password = HEAPU32[fetch_attr + 72 >> 2];
    var requestHeaders = HEAPU32[fetch_attr + 76 >> 2];
    var overriddenMimeType = HEAPU32[fetch_attr + 80 >> 2];
    var dataPtr = HEAPU32[fetch_attr + 84 >> 2];
    var dataLength = HEAPU32[fetch_attr + 88 >> 2];
  
    var fetchAttrLoadToMemory = !!(fetchAttributes & 1);
    var fetchAttrStreamData = !!(fetchAttributes & 2);
    var fetchAttrPersistFile = !!(fetchAttributes & 4);
    var fetchAttrAppend = !!(fetchAttributes & 8);
    var fetchAttrReplace = !!(fetchAttributes & 16);
    var fetchAttrSynchronous = !!(fetchAttributes & 64);
    var fetchAttrWaitable = !!(fetchAttributes & 128);
  
    var userNameStr = userName ? UTF8ToString(userName) : undefined;
    var passwordStr = password ? UTF8ToString(password) : undefined;
    var overriddenMimeTypeStr = overriddenMimeType ? UTF8ToString(overriddenMimeType) : undefined;
  
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = withCredentials;
    xhr.open(requestMethod, url_, !fetchAttrSynchronous, userNameStr, passwordStr);
    if (!fetchAttrSynchronous) xhr.timeout = timeoutMsecs; // XHR timeout field is only accessible in async XHRs, and must be set after .open() but before .send().
    xhr.url_ = url_; // Save the url for debugging purposes (and for comparing to the responseURL that server side advertised)
    assert(!fetchAttrStreamData, 'streaming uses moz-chunked-arraybuffer which is no longer supported; TODO: rewrite using fetch()');
    xhr.responseType = 'arraybuffer';
  
    if (overriddenMimeType) {
      xhr.overrideMimeType(overriddenMimeTypeStr);
    }
    if (requestHeaders) {
      for(;;) {
        var key = HEAPU32[requestHeaders >> 2];
        if (!key) break;
        var value = HEAPU32[requestHeaders + 4 >> 2];
        if (!value) break;
        requestHeaders += 8;
        var keyStr = UTF8ToString(key);
        var valueStr = UTF8ToString(value);
        xhr.setRequestHeader(keyStr, valueStr);
      }
    }
    Fetch.xhrs.push(xhr);
    var id = Fetch.xhrs.length;
    HEAPU32[fetch + 0 >> 2] = id;
    var data = (dataPtr && dataLength) ? HEAPU8.slice(dataPtr, dataPtr + dataLength) : null;
    // TODO: Support specifying custom headers to the request.
  
    // Share the code to save the response, as we need to do so both on success
    // and on error (despite an error, there may be a response, like a 404 page).
    // This receives a condition, which determines whether to save the xhr's
    // response, or just 0.
    function saveResponse(condition) {
      var ptr = 0;
      var ptrLen = 0;
      if (condition) {
        ptrLen = xhr.response ? xhr.response.byteLength : 0;
        // The data pointer malloc()ed here has the same lifetime as the emscripten_fetch_t structure itself has, and is
        // freed when emscripten_fetch_close() is called.
        ptr = _malloc(ptrLen);
        HEAPU8.set(new Uint8Array(xhr.response), ptr);
      }
      HEAPU32[fetch + 12 >> 2] = ptr;
      Fetch.setu64(fetch + 16, ptrLen);
    }
  
    xhr.onload = function(e) {
      saveResponse(fetchAttrLoadToMemory && !fetchAttrStreamData);
      var len = xhr.response ? xhr.response.byteLength : 0;
      Fetch.setu64(fetch + 24, 0);
      if (len) {
        // If the final XHR.onload handler receives the bytedata to compute total length, report that,
        // otherwise don't write anything out here, which will retain the latest byte size reported in
        // the most recent XHR.onprogress handler.
        Fetch.setu64(fetch + 32, len);
      }
      HEAPU16[fetch + 40 >> 1] = xhr.readyState;
      if (xhr.readyState === 4 && xhr.status === 0) {
        if (len > 0) xhr.status = 200; // If loading files from a source that does not give HTTP status code, assume success if we got data bytes.
        else xhr.status = 404; // Conversely, no data bytes is 404.
      }
      HEAPU16[fetch + 42 >> 1] = xhr.status;
      if (xhr.statusText) stringToUTF8(xhr.statusText, fetch + 44, 64);
      if (xhr.status >= 200 && xhr.status < 300) {
        if (onsuccess) onsuccess(fetch, xhr, e);
      } else {
        if (onerror) onerror(fetch, xhr, e);
      }
    };
    xhr.onerror = function(e) {
      saveResponse(fetchAttrLoadToMemory);
      var status = xhr.status; // XXX TODO: Overwriting xhr.status doesn't work here, so don't override anywhere else either.
      if (xhr.readyState === 4 && status === 0) status = 404; // If no error recorded, pretend it was 404 Not Found.
      Fetch.setu64(fetch + 24, 0);
      Fetch.setu64(fetch + 32, xhr.response ? xhr.response.byteLength : 0);
      HEAPU16[fetch + 40 >> 1] = xhr.readyState;
      HEAPU16[fetch + 42 >> 1] = status;
      if (onerror) onerror(fetch, xhr, e);
    };
    xhr.ontimeout = function(e) {
      if (onerror) onerror(fetch, xhr, e);
    };
    xhr.onprogress = function(e) {
      var ptrLen = (fetchAttrLoadToMemory && fetchAttrStreamData && xhr.response) ? xhr.response.byteLength : 0;
      var ptr = 0;
      if (fetchAttrLoadToMemory && fetchAttrStreamData) {
        assert(onprogress, 'When doing a streaming fetch, you should have an onprogress handler registered to receive the chunks!');
        // Allocate byte data in Emscripten heap for the streamed memory block (freed immediately after onprogress call)
        ptr = _malloc(ptrLen);
        HEAPU8.set(new Uint8Array(xhr.response), ptr);
      }
      HEAPU32[fetch + 12 >> 2] = ptr;
      Fetch.setu64(fetch + 16, ptrLen);
      Fetch.setu64(fetch + 24, e.loaded - ptrLen);
      Fetch.setu64(fetch + 32, e.total);
      HEAPU16[fetch + 40 >> 1] = xhr.readyState;
      if (xhr.readyState >= 3 && xhr.status === 0 && e.loaded > 0) xhr.status = 200; // If loading files from a source that does not give HTTP status code, assume success if we get data bytes
      HEAPU16[fetch + 42 >> 1] = xhr.status;
      if (xhr.statusText) stringToUTF8(xhr.statusText, fetch + 44, 64);
      if (onprogress) onprogress(fetch, xhr, e);
      if (ptr) {
        _free(ptr);
      }
    };
    xhr.onreadystatechange = function(e) {
      HEAPU16[fetch + 40 >> 1] = xhr.readyState;
      if (xhr.readyState >= 2) {
        HEAPU16[fetch + 42 >> 1] = xhr.status;
      }
      if (onreadystatechange) onreadystatechange(fetch, xhr, e);
    };
    try {
      xhr.send(data);
    } catch(e) {
      if (onerror) onerror(fetch, xhr, e);
    }
  }
  
  function __emscripten_fetch_cache_data(db, fetch, data, onsuccess, onerror) {
    if (!db) {
      onerror(fetch, 0, 'IndexedDB not available!');
      return;
    }
  
    var fetch_attr = fetch + 112;
    var destinationPath = HEAPU32[fetch_attr + 64 >> 2];
    if (!destinationPath) destinationPath = HEAPU32[fetch + 8 >> 2];
    var destinationPathStr = UTF8ToString(destinationPath);
  
    try {
      var transaction = db.transaction(['FILES'], 'readwrite');
      var packages = transaction.objectStore('FILES');
      var putRequest = packages.put(data, destinationPathStr);
      putRequest.onsuccess = function(event) {
        HEAPU16[fetch + 40 >> 1] = 4; // Mimic XHR readyState 4 === 'DONE: The operation is complete'
        HEAPU16[fetch + 42 >> 1] = 200; // Mimic XHR HTTP status code 200 "OK"
        stringToUTF8("OK", fetch + 44, 64);
        onsuccess(fetch, 0, destinationPathStr);
      };
      putRequest.onerror = function(error) {
        // Most likely we got an error if IndexedDB is unwilling to store any more data for this page.
        // TODO: Can we identify and break down different IndexedDB-provided errors and convert those
        // to more HTTP status codes for more information?
        HEAPU16[fetch + 40 >> 1] = 4; // Mimic XHR readyState 4 === 'DONE: The operation is complete'
        HEAPU16[fetch + 42 >> 1] = 413; // Mimic XHR HTTP status code 413 "Payload Too Large"
        stringToUTF8("Payload Too Large", fetch + 44, 64);
        onerror(fetch, 0, error);
      };
    } catch(e) {
      onerror(fetch, 0, e);
    }
  }
  
  function __emscripten_fetch_load_cached_data(db, fetch, onsuccess, onerror) {
    if (!db) {
      onerror(fetch, 0, 'IndexedDB not available!');
      return;
    }
  
    var fetch_attr = fetch + 112;
    var path = HEAPU32[fetch_attr + 64 >> 2];
    if (!path) path = HEAPU32[fetch + 8 >> 2];
    var pathStr = UTF8ToString(path);
  
    try {
      var transaction = db.transaction(['FILES'], 'readonly');
      var packages = transaction.objectStore('FILES');
      var getRequest = packages.get(pathStr);
      getRequest.onsuccess = function(event) {
        if (event.target.result) {
          var value = event.target.result;
          var len = value.byteLength || value.length;
          // The data pointer malloc()ed here has the same lifetime as the emscripten_fetch_t structure itself has, and is
          // freed when emscripten_fetch_close() is called.
          var ptr = _malloc(len);
          HEAPU8.set(new Uint8Array(value), ptr);
          HEAPU32[fetch + 12 >> 2] = ptr;
          Fetch.setu64(fetch + 16, len);
          Fetch.setu64(fetch + 24, 0);
          Fetch.setu64(fetch + 32, len);
          HEAPU16[fetch + 40 >> 1] = 4; // Mimic XHR readyState 4 === 'DONE: The operation is complete'
          HEAPU16[fetch + 42 >> 1] = 200; // Mimic XHR HTTP status code 200 "OK"
          stringToUTF8("OK", fetch + 44, 64);
          onsuccess(fetch, 0, value);
        } else {
          // Succeeded to load, but the load came back with the value of undefined, treat that as an error since we never store undefined in db.
          HEAPU16[fetch + 40 >> 1] = 4; // Mimic XHR readyState 4 === 'DONE: The operation is complete'
          HEAPU16[fetch + 42 >> 1] = 404; // Mimic XHR HTTP status code 404 "Not Found"
          stringToUTF8("Not Found", fetch + 44, 64);
          onerror(fetch, 0, 'no data');
        }
      };
      getRequest.onerror = function(error) {
        HEAPU16[fetch + 40 >> 1] = 4; // Mimic XHR readyState 4 === 'DONE: The operation is complete'
        HEAPU16[fetch + 42 >> 1] = 404; // Mimic XHR HTTP status code 404 "Not Found"
        stringToUTF8("Not Found", fetch + 44, 64);
        onerror(fetch, 0, error);
      };
    } catch(e) {
      onerror(fetch, 0, e);
    }
  }
  
  function __emscripten_fetch_delete_cached_data(db, fetch, onsuccess, onerror) {
    if (!db) {
      onerror(fetch, 0, 'IndexedDB not available!');
      return;
    }
  
    var fetch_attr = fetch + 112;
    var path = HEAPU32[fetch_attr + 64 >> 2];
    if (!path) path = HEAPU32[fetch + 8 >> 2];
    var pathStr = UTF8ToString(path);
  
    try {
      var transaction = db.transaction(['FILES'], 'readwrite');
      var packages = transaction.objectStore('FILES');
      var request = packages.delete(pathStr);
      request.onsuccess = function(event) {
        var value = event.target.result;
        HEAPU32[fetch + 12 >> 2] = 0;
        Fetch.setu64(fetch + 16, 0);
        Fetch.setu64(fetch + 24, 0);
        Fetch.setu64(fetch + 32, 0);
        HEAPU16[fetch + 40 >> 1] = 4; // Mimic XHR readyState 4 === 'DONE: The operation is complete'
        HEAPU16[fetch + 42 >> 1] = 200; // Mimic XHR HTTP status code 200 "OK"
        stringToUTF8("OK", fetch + 44, 64);
        onsuccess(fetch, 0, value);
      };
      request.onerror = function(error) {
        HEAPU16[fetch + 40 >> 1] = 4; // Mimic XHR readyState 4 === 'DONE: The operation is complete'
        HEAPU16[fetch + 42 >> 1] = 404; // Mimic XHR HTTP status code 404 "Not Found"
        stringToUTF8("Not Found", fetch + 44, 64);
        onerror(fetch, 0, error);
      };
    } catch(e) {
      onerror(fetch, 0, e);
    }
  }
  
  
  var _fetch_work_queue=889984;function __emscripten_get_fetch_work_queue() {
      return _fetch_work_queue;
    }function _emscripten_start_fetch(fetch, successcb, errorcb, progresscb, readystatechangecb) {
    if (typeof noExitRuntime !== 'undefined') noExitRuntime = true; // If we are the main Emscripten runtime, we should not be closing down.
  
    var fetch_attr = fetch + 112;
    var requestMethod = UTF8ToString(fetch_attr);
    var onsuccess = HEAPU32[fetch_attr + 36 >> 2];
    var onerror = HEAPU32[fetch_attr + 40 >> 2];
    var onprogress = HEAPU32[fetch_attr + 44 >> 2];
    var onreadystatechange = HEAPU32[fetch_attr + 48 >> 2];
    var fetchAttributes = HEAPU32[fetch_attr + 52 >> 2];
    var fetchAttrLoadToMemory = !!(fetchAttributes & 1);
    var fetchAttrStreamData = !!(fetchAttributes & 2);
    var fetchAttrPersistFile = !!(fetchAttributes & 4);
    var fetchAttrNoDownload = !!(fetchAttributes & 32);
    var fetchAttrAppend = !!(fetchAttributes & 8);
    var fetchAttrReplace = !!(fetchAttributes & 16);
  
    var reportSuccess = function(fetch, xhr, e) {
      if (onsuccess) dynCall_vi(onsuccess, fetch);
      else if (successcb) successcb(fetch);
    };
  
    var reportProgress = function(fetch, xhr, e) {
      if (onprogress) dynCall_vi(onprogress, fetch);
      else if (progresscb) progresscb(fetch);
    };
  
    var reportError = function(fetch, xhr, e) {
      if (onerror) dynCall_vi(onerror, fetch);
      else if (errorcb) errorcb(fetch);
    };
  
    var reportReadyStateChange = function(fetch, xhr, e) {
      if (onreadystatechange) dynCall_vi(onreadystatechange, fetch);
      else if (readystatechangecb) readystatechangecb(fetch);
    };
  
    var performUncachedXhr = function(fetch, xhr, e) {
      __emscripten_fetch_xhr(fetch, reportSuccess, reportError, reportProgress, reportReadyStateChange);
    };
  
    var cacheResultAndReportSuccess = function(fetch, xhr, e) {
      var storeSuccess = function(fetch, xhr, e) {
        if (onsuccess) dynCall_vi(onsuccess, fetch);
        else if (successcb) successcb(fetch);
      };
      var storeError = function(fetch, xhr, e) {
        if (onsuccess) dynCall_vi(onsuccess, fetch);
        else if (successcb) successcb(fetch);
      };
      __emscripten_fetch_cache_data(Fetch.dbInstance, fetch, xhr.response, storeSuccess, storeError);
    };
  
    var performCachedXhr = function(fetch, xhr, e) {
      __emscripten_fetch_xhr(fetch, cacheResultAndReportSuccess, reportError, reportProgress, reportReadyStateChange);
    };
  
    if (requestMethod === 'EM_IDB_STORE') {
      // TODO(?): Here we perform a clone of the data, because storing shared typed arrays to IndexedDB does not seem to be allowed.
      var ptr = HEAPU32[fetch_attr + 84 >> 2];
      __emscripten_fetch_cache_data(Fetch.dbInstance, fetch, HEAPU8.slice(ptr, ptr + HEAPU32[fetch_attr + 88 >> 2]), reportSuccess, reportError);
    } else if (requestMethod === 'EM_IDB_DELETE') {
      __emscripten_fetch_delete_cached_data(Fetch.dbInstance, fetch, reportSuccess, reportError);
    } else if (!fetchAttrReplace) {
      __emscripten_fetch_load_cached_data(Fetch.dbInstance, fetch, reportSuccess, fetchAttrNoDownload ? reportError : (fetchAttrPersistFile ? performCachedXhr : performUncachedXhr));
    } else if (!fetchAttrNoDownload) {
      __emscripten_fetch_xhr(fetch, fetchAttrPersistFile ? cacheResultAndReportSuccess : reportSuccess, reportError, reportProgress, reportReadyStateChange);
    } else {
      return 0; // todo: free
    }
    return fetch;
  }

  
  
  var ENV={};
  
  function getExecutableName() {
      return thisProgram || './this.program';
    }function getEnvStrings() {
      if (!getEnvStrings.strings) {
        // Default values.
        // Browser language detection #8751
        var lang = ((typeof navigator === 'object' && navigator.languages && navigator.languages[0]) || 'C').replace('-', '_') + '.UTF-8';
        var env = {
          'USER': 'web_user',
          'LOGNAME': 'web_user',
          'PATH': '/',
          'PWD': '/',
          'HOME': '/home/web_user',
          'LANG': lang,
          '_': getExecutableName()
        };
        // Apply the user-provided values, if any.
        for (var x in ENV) {
          env[x] = ENV[x];
        }
        var strings = [];
        for (var x in env) {
          strings.push(x + '=' + env[x]);
        }
        getEnvStrings.strings = strings;
      }
      return getEnvStrings.strings;
    }function _environ_get(__environ, environ_buf) {
      var bufSize = 0;
      getEnvStrings().forEach(function(string, i) {
        var ptr = environ_buf + bufSize;
        HEAP32[(((__environ)+(i * 4))>>2)]=ptr;
        writeAsciiToMemory(string, ptr);
        bufSize += string.length + 1;
      });
      return 0;
    }

  function _environ_sizes_get(penviron_count, penviron_buf_size) {
      var strings = getEnvStrings();
      HEAP32[((penviron_count)>>2)]=strings.length;
      var bufSize = 0;
      strings.forEach(function(string) {
        bufSize += string.length + 1;
      });
      HEAP32[((penviron_buf_size)>>2)]=bufSize;
      return 0;
    }

  function _exit(status) {
      // void _exit(int status);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/exit.html
      exit(status);
    }

  function _fd_close(fd) {try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      FS.close(stream);
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return e.errno;
  }
  }

  function _fd_read(fd, iov, iovcnt, pnum) {try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      var num = SYSCALLS.doReadv(stream, iov, iovcnt);
      HEAP32[((pnum)>>2)]=num
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return e.errno;
  }
  }

  function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {try {
  
      
      var stream = SYSCALLS.getStreamFromFD(fd);
      var HIGH_OFFSET = 0x100000000; // 2^32
      // use an unsigned operator on low and shift high by 32-bits
      var offset = offset_high * HIGH_OFFSET + (offset_low >>> 0);
  
      var DOUBLE_LIMIT = 0x20000000000000; // 2^53
      // we also check for equality since DOUBLE_LIMIT + 1 == DOUBLE_LIMIT
      if (offset <= -DOUBLE_LIMIT || offset >= DOUBLE_LIMIT) {
        return -61;
      }
  
      FS.llseek(stream, offset, whence);
      (tempI64 = [stream.position>>>0,(tempDouble=stream.position,(+(Math_abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math_min((+(Math_floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[((newOffset)>>2)]=tempI64[0],HEAP32[(((newOffset)+(4))>>2)]=tempI64[1]);
      if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null; // reset readdir state
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return e.errno;
  }
  }

  function _fd_write(fd, iov, iovcnt, pnum) {try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      var num = SYSCALLS.doWritev(stream, iov, iovcnt);
      HEAP32[((pnum)>>2)]=num
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return e.errno;
  }
  }

  function _getTempRet0() {
      return (getTempRet0() | 0);
    }

  function _gettimeofday(ptr) {
      var now = Date.now();
      HEAP32[((ptr)>>2)]=(now/1000)|0; // seconds
      HEAP32[(((ptr)+(4))>>2)]=((now % 1000)*1000)|0; // microseconds
      return 0;
    }


  function _glAlphaFunc(){}


  function _glBindFramebuffer(target, framebuffer) {
  
      GLctx.bindFramebuffer(target, GL.framebuffers[framebuffer]);
  
    }

  function _glBindTexture(target, texture) {
      GLctx.bindTexture(target, GL.textures[texture]);
    }

  function _glBlendEquation(x0) { GLctx['blendEquation'](x0) }

  function _glBlendEquationSeparate(x0, x1) { GLctx['blendEquationSeparate'](x0, x1) }

  function _glBlendFunc(x0, x1) { GLctx['blendFunc'](x0, x1) }

  function _glBlendFuncSeparate(x0, x1, x2, x3) { GLctx['blendFuncSeparate'](x0, x1, x2, x3) }

  function _glClear(x0) { GLctx['clear'](x0) }

  function _glClearColor(x0, x1, x2, x3) { GLctx['clearColor'](x0, x1, x2, x3) }

  function _glClearDepthf(x0) { GLctx['clearDepth'](x0) }

  function _glClientActiveTexture(texture) {
      GLImmediate.clientActiveTexture = texture - 0x84C0; // GL_TEXTURE0
    }

  function _glColor4f(r, g, b, a) {
      r = Math.max(Math.min(r, 1), 0);
      g = Math.max(Math.min(g, 1), 0);
      b = Math.max(Math.min(b, 1), 0);
      a = Math.max(Math.min(a, 1), 0);
  
      // TODO: make ub the default, not f, save a few mathops
      if (GLImmediate.mode >= 0) {
        var start = GLImmediate.vertexCounter << 2;
        GLImmediate.vertexDataU8[start + 0] = r * 255;
        GLImmediate.vertexDataU8[start + 1] = g * 255;
        GLImmediate.vertexDataU8[start + 2] = b * 255;
        GLImmediate.vertexDataU8[start + 3] = a * 255;
        GLImmediate.vertexCounter++;
        GLImmediate.addRendererComponent(GLImmediate.COLOR, 4, GLctx.UNSIGNED_BYTE);
      } else {
        GLImmediate.clientColor[0] = r;
        GLImmediate.clientColor[1] = g;
        GLImmediate.clientColor[2] = b;
        GLImmediate.clientColor[3] = a;
        GLctx.vertexAttrib4fv(GLImmediate.COLOR, GLImmediate.clientColor);
      }
    }

  function _glColorPointer(size, type, stride, pointer) {
      GLImmediate.setClientAttribute(GLImmediate.COLOR, size, type, stride, pointer);
      if (GLctx.currentArrayBufferBinding) {
        GLctx.vertexAttribPointer(GLImmediate.COLOR, size, type, true, stride, pointer);
      }
    }

  function _glDeleteBuffers(n, buffers) {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(((buffers)+(i*4))>>2)];
        var buffer = GL.buffers[id];
  
        // From spec: "glDeleteBuffers silently ignores 0's and names that do not
        // correspond to existing buffer objects."
        if (!buffer) continue;
  
        GLctx.deleteBuffer(buffer);
        buffer.name = 0;
        GL.buffers[id] = null;
  
        if (id == GLctx.currentArrayBufferBinding) GLctx.currentArrayBufferBinding = 0;
        if (id == GLctx.currentElementArrayBufferBinding) GLctx.currentElementArrayBufferBinding = 0;
      }
    }

  function _glDeleteFramebuffers(n, framebuffers) {
      for (var i = 0; i < n; ++i) {
        var id = HEAP32[(((framebuffers)+(i*4))>>2)];
        var framebuffer = GL.framebuffers[id];
        if (!framebuffer) continue; // GL spec: "glDeleteFramebuffers silently ignores 0s and names that do not correspond to existing framebuffer objects".
        GLctx.deleteFramebuffer(framebuffer);
        framebuffer.name = 0;
        GL.framebuffers[id] = null;
      }
    }

  function _glDeleteTextures(n, textures) {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(((textures)+(i*4))>>2)];
        var texture = GL.textures[id];
        if (!texture) continue; // GL spec: "glDeleteTextures silently ignores 0s and names that do not correspond to existing textures".
        GLctx.deleteTexture(texture);
        texture.name = 0;
        GL.textures[id] = null;
      }
    }

  function _glDepthFunc(x0) { GLctx['depthFunc'](x0) }


  function _glDrawArrays(mode, first, count) {
      if (GLImmediate.totalEnabledClientAttributes == 0 && mode <= 6) {
        GLctx.drawArrays(mode, first, count);
        return;
      }
      GLImmediate.prepareClientAttributes(count, false);
      GLImmediate.mode = mode;
      if (!GLctx.currentArrayBufferBinding) {
        GLImmediate.vertexData = HEAPF32.subarray((GLImmediate.vertexPointer)>>2,(GLImmediate.vertexPointer + (first+count)*GLImmediate.stride)>>2); // XXX assuming float
        GLImmediate.firstVertex = first;
        GLImmediate.lastVertex = first + count;
      }
      GLImmediate.flush(null, first);
      GLImmediate.mode = -1;
    }

  function _glDrawElements(mode, count, type, indices, start, end) { // start, end are given if we come from glDrawRangeElements
      if (GLImmediate.totalEnabledClientAttributes == 0 && mode <= 6 && GLctx.currentElementArrayBufferBinding) {
        GLctx.drawElements(mode, count, type, indices);
        return;
      }
      if (!GLctx.currentElementArrayBufferBinding) {
        assert(type == GLctx.UNSIGNED_SHORT); // We can only emulate buffers of this kind, for now
      }
      //console.log("DrawElements doesn't actually prepareClientAttributes properly.");
      GLImmediate.prepareClientAttributes(count, false);
      GLImmediate.mode = mode;
      if (!GLctx.currentArrayBufferBinding) {
        GLImmediate.firstVertex = end ? start : HEAP8.length; // if we don't know the start, set an invalid value and we will calculate it later from the indices
        GLImmediate.lastVertex = end ? end+1 : 0;
        GLImmediate.vertexData = HEAPF32.subarray(GLImmediate.vertexPointer >> 2, end ? (GLImmediate.vertexPointer + (end+1)*GLImmediate.stride) >> 2 : undefined); // XXX assuming float
      }
      GLImmediate.flush(count, 0, indices);
      GLImmediate.mode = -1;
    }



  function _glFlush() { GLctx['flush']() }

  function _glFramebufferTexture2D(target, attachment, textarget, texture, level) {
      GLctx.framebufferTexture2D(target, attachment, textarget,
                                      GL.textures[texture], level);
    }

  function _glGenFramebuffers(n, ids) {
      __glGenObject(n, ids, 'createFramebuffer', GL.framebuffers
        );
    }

  function _glGenTextures(n, textures) {
      __glGenObject(n, textures, 'createTexture', GL.textures
        );
    }



  function _glLoadIdentity() {
      GLImmediate.matricesModified = true;
      GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1)|0;
      GLImmediate.matrixLib.mat4.identity(GLImmediate.matrix[GLImmediate.currentMatrix]);
    }

  function _glLoadMatrixf(matrix) {
      GLImmediate.matricesModified = true;
      GLImmediate.matrixVersion[GLImmediate.currentMatrix] = (GLImmediate.matrixVersion[GLImmediate.currentMatrix] + 1)|0;
      GLImmediate.matrixLib.mat4.set(HEAPF32.subarray((matrix)>>2,(matrix+64)>>2), GLImmediate.matrix[GLImmediate.currentMatrix]);
    }

  function _glMatrixMode(mode) {
      if (mode == 0x1700 /* GL_MODELVIEW */) {
        GLImmediate.currentMatrix = 0/*m*/;
      } else if (mode == 0x1701 /* GL_PROJECTION */) {
        GLImmediate.currentMatrix = 1/*p*/;
      } else if (mode == 0x1702) { // GL_TEXTURE
        GLImmediate.useTextureMatrix = true;
        GLImmediate.currentMatrix = 2/*t*/ + GLImmediate.TexEnvJIT.getActiveTexture();
      } else {
        throw "Wrong mode " + mode + " passed to glMatrixMode";
      }
    }

  function _glPolygonOffset(x0, x1) { GLctx['polygonOffset'](x0, x1) }

  function _glReadPixels(x, y, width, height, format, type, pixels) {
      var pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, format);
      if (!pixelData) {
        GL.recordError(0x500/*GL_INVALID_ENUM*/);
        return;
      }
      GLctx.readPixels(x, y, width, height, format, type, pixelData);
    }

  function _glScissor(x0, x1, x2, x3) { GLctx['scissor'](x0, x1, x2, x3) }

  function _glShadeModel() { warnOnce('TODO: glShadeModel') }

  function _glTexCoordPointer(size, type, stride, pointer) {
      GLImmediate.setClientAttribute(GLImmediate.TEXTURE0 + GLImmediate.clientActiveTexture, size, type, stride, pointer);
      if (GLctx.currentArrayBufferBinding) {
        var loc = GLImmediate.TEXTURE0 + GLImmediate.clientActiveTexture;
        GLctx.vertexAttribPointer(loc, size, type, false, stride, pointer);
      }
    }

  function _glTexEnvf() { warnOnce('glTexEnvf: TODO') }

  function _glTexEnvfv() { warnOnce('glTexEnvfv: TODO') }

  function _glTexEnvi() { warnOnce('glTexEnvi: TODO') }

  function _glTexImage2D(target, level, internalFormat, width, height, border, format, type, pixels) {
      GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixels ? emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, internalFormat) : null);
    }

  function _glTexParameterf(x0, x1, x2) { GLctx['texParameterf'](x0, x1, x2) }

  function _glTexParameteri(x0, x1, x2) { GLctx['texParameteri'](x0, x1, x2) }

  function _glVertexPointer(size, type, stride, pointer) {
      GLImmediate.setClientAttribute(GLImmediate.VERTEX, size, type, stride, pointer);
      if (GLctx.currentArrayBufferBinding) {
        GLctx.vertexAttribPointer(GLImmediate.VERTEX, size, type, false, stride, pointer);
      }
    }

  function _glViewport(x0, x1, x2, x3) { GLctx['viewport'](x0, x1, x2, x3) }

  
  var ___tm_current=889840;
  
  
  var ___tm_timezone=(stringToUTF8("GMT", 889888, 4), 889888);
  
  function _tzset() {
      // TODO: Use (malleable) environment variables instead of system settings.
      if (_tzset.called) return;
      _tzset.called = true;
  
      // timezone is specified as seconds west of UTC ("The external variable
      // `timezone` shall be set to the difference, in seconds, between
      // Coordinated Universal Time (UTC) and local standard time."), the same
      // as returned by getTimezoneOffset().
      // See http://pubs.opengroup.org/onlinepubs/009695399/functions/tzset.html
      HEAP32[((__get_timezone())>>2)]=(new Date()).getTimezoneOffset() * 60;
  
      var currentYear = new Date().getFullYear();
      var winter = new Date(currentYear, 0, 1);
      var summer = new Date(currentYear, 6, 1);
      HEAP32[((__get_daylight())>>2)]=Number(winter.getTimezoneOffset() != summer.getTimezoneOffset());
  
      function extractZone(date) {
        var match = date.toTimeString().match(/\(([A-Za-z ]+)\)$/);
        return match ? match[1] : "GMT";
      };
      var winterName = extractZone(winter);
      var summerName = extractZone(summer);
      var winterNamePtr = allocateUTF8(winterName);
      var summerNamePtr = allocateUTF8(summerName);
      if (summer.getTimezoneOffset() < winter.getTimezoneOffset()) {
        // Northern hemisphere
        HEAP32[((__get_tzname())>>2)]=winterNamePtr;
        HEAP32[(((__get_tzname())+(4))>>2)]=summerNamePtr;
      } else {
        HEAP32[((__get_tzname())>>2)]=summerNamePtr;
        HEAP32[(((__get_tzname())+(4))>>2)]=winterNamePtr;
      }
    }function _localtime_r(time, tmPtr) {
      _tzset();
      var date = new Date(HEAP32[((time)>>2)]*1000);
      HEAP32[((tmPtr)>>2)]=date.getSeconds();
      HEAP32[(((tmPtr)+(4))>>2)]=date.getMinutes();
      HEAP32[(((tmPtr)+(8))>>2)]=date.getHours();
      HEAP32[(((tmPtr)+(12))>>2)]=date.getDate();
      HEAP32[(((tmPtr)+(16))>>2)]=date.getMonth();
      HEAP32[(((tmPtr)+(20))>>2)]=date.getFullYear()-1900;
      HEAP32[(((tmPtr)+(24))>>2)]=date.getDay();
  
      var start = new Date(date.getFullYear(), 0, 1);
      var yday = ((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))|0;
      HEAP32[(((tmPtr)+(28))>>2)]=yday;
      HEAP32[(((tmPtr)+(36))>>2)]=-(date.getTimezoneOffset() * 60);
  
      // Attention: DST is in December in South, and some regions don't have DST at all.
      var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
      var winterOffset = start.getTimezoneOffset();
      var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset))|0;
      HEAP32[(((tmPtr)+(32))>>2)]=dst;
  
      var zonePtr = HEAP32[(((__get_tzname())+(dst ? 4 : 0))>>2)];
      HEAP32[(((tmPtr)+(40))>>2)]=zonePtr;
  
      return tmPtr;
    }function _localtime(time) {
      return _localtime_r(time, ___tm_current);
    }

  
  function _usleep(useconds) {
      // int usleep(useconds_t useconds);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/usleep.html
      // We're single-threaded, so use a busy loop. Super-ugly.
      var start = _emscripten_get_now();
      while (_emscripten_get_now() - start < useconds / 1000) {
        // Do nothing.
      }
    }function _nanosleep(rqtp, rmtp) {
      // int nanosleep(const struct timespec  *rqtp, struct timespec *rmtp);
      if (rqtp === 0) {
        setErrNo(28);
        return -1;
      }
      var seconds = HEAP32[((rqtp)>>2)];
      var nanoseconds = HEAP32[(((rqtp)+(4))>>2)];
      if (nanoseconds < 0 || nanoseconds > 999999999 || seconds < 0) {
        setErrNo(28);
        return -1;
      }
      if (rmtp !== 0) {
        HEAP32[((rmtp)>>2)]=0;
        HEAP32[(((rmtp)+(4))>>2)]=0;
      }
      return _usleep((seconds * 1e6) + (nanoseconds / 1000));
    }

  
  function _round(d) {
      d = +d;
      return d >= +0 ? +Math_floor(d + +0.5) : +Math_ceil(d - +0.5);
    }

  function _roundf(d) {
      d = +d;
      return d >= +0 ? +Math_floor(d + +0.5) : +Math_ceil(d - +0.5);
    }

  function _setTempRet0($i) {
      setTempRet0(($i) | 0);
    }

  function _sigaction(signum, act, oldact) {
      //int sigaction(int signum, const struct sigaction *act, struct sigaction *oldact);
      err('Calling stub instead of sigaction()');
      return 0;
    }

  
  var __sigalrm_handler=0;function _signal(sig, func) {
      if (sig == 14 /*SIGALRM*/) {
        __sigalrm_handler = func;
      } else {
        err('Calling stub instead of signal()');
      }
      return 0;
    }

  
  
  function __isLeapYear(year) {
        return year%4 === 0 && (year%100 !== 0 || year%400 === 0);
    }
  
  function __arraySum(array, index) {
      var sum = 0;
      for (var i = 0; i <= index; sum += array[i++]) {
        // no-op
      }
      return sum;
    }
  
  
  var __MONTH_DAYS_LEAP=[31,29,31,30,31,30,31,31,30,31,30,31];
  
  var __MONTH_DAYS_REGULAR=[31,28,31,30,31,30,31,31,30,31,30,31];function __addDays(date, days) {
      var newDate = new Date(date.getTime());
      while(days > 0) {
        var leap = __isLeapYear(newDate.getFullYear());
        var currentMonth = newDate.getMonth();
        var daysInCurrentMonth = (leap ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR)[currentMonth];
  
        if (days > daysInCurrentMonth-newDate.getDate()) {
          // we spill over to next month
          days -= (daysInCurrentMonth-newDate.getDate()+1);
          newDate.setDate(1);
          if (currentMonth < 11) {
            newDate.setMonth(currentMonth+1)
          } else {
            newDate.setMonth(0);
            newDate.setFullYear(newDate.getFullYear()+1);
          }
        } else {
          // we stay in current month
          newDate.setDate(newDate.getDate()+days);
          return newDate;
        }
      }
  
      return newDate;
    }function _strftime(s, maxsize, format, tm) {
      // size_t strftime(char *restrict s, size_t maxsize, const char *restrict format, const struct tm *restrict timeptr);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/strftime.html
  
      var tm_zone = HEAP32[(((tm)+(40))>>2)];
  
      var date = {
        tm_sec: HEAP32[((tm)>>2)],
        tm_min: HEAP32[(((tm)+(4))>>2)],
        tm_hour: HEAP32[(((tm)+(8))>>2)],
        tm_mday: HEAP32[(((tm)+(12))>>2)],
        tm_mon: HEAP32[(((tm)+(16))>>2)],
        tm_year: HEAP32[(((tm)+(20))>>2)],
        tm_wday: HEAP32[(((tm)+(24))>>2)],
        tm_yday: HEAP32[(((tm)+(28))>>2)],
        tm_isdst: HEAP32[(((tm)+(32))>>2)],
        tm_gmtoff: HEAP32[(((tm)+(36))>>2)],
        tm_zone: tm_zone ? UTF8ToString(tm_zone) : ''
      };
  
      var pattern = UTF8ToString(format);
  
      // expand format
      var EXPANSION_RULES_1 = {
        '%c': '%a %b %d %H:%M:%S %Y',     // Replaced by the locale's appropriate date and time representation - e.g., Mon Aug  3 14:02:01 2013
        '%D': '%m/%d/%y',                 // Equivalent to %m / %d / %y
        '%F': '%Y-%m-%d',                 // Equivalent to %Y - %m - %d
        '%h': '%b',                       // Equivalent to %b
        '%r': '%I:%M:%S %p',              // Replaced by the time in a.m. and p.m. notation
        '%R': '%H:%M',                    // Replaced by the time in 24-hour notation
        '%T': '%H:%M:%S',                 // Replaced by the time
        '%x': '%m/%d/%y',                 // Replaced by the locale's appropriate date representation
        '%X': '%H:%M:%S',                 // Replaced by the locale's appropriate time representation
        // Modified Conversion Specifiers
        '%Ec': '%c',                      // Replaced by the locale's alternative appropriate date and time representation.
        '%EC': '%C',                      // Replaced by the name of the base year (period) in the locale's alternative representation.
        '%Ex': '%m/%d/%y',                // Replaced by the locale's alternative date representation.
        '%EX': '%H:%M:%S',                // Replaced by the locale's alternative time representation.
        '%Ey': '%y',                      // Replaced by the offset from %EC (year only) in the locale's alternative representation.
        '%EY': '%Y',                      // Replaced by the full alternative year representation.
        '%Od': '%d',                      // Replaced by the day of the month, using the locale's alternative numeric symbols, filled as needed with leading zeros if there is any alternative symbol for zero; otherwise, with leading <space> characters.
        '%Oe': '%e',                      // Replaced by the day of the month, using the locale's alternative numeric symbols, filled as needed with leading <space> characters.
        '%OH': '%H',                      // Replaced by the hour (24-hour clock) using the locale's alternative numeric symbols.
        '%OI': '%I',                      // Replaced by the hour (12-hour clock) using the locale's alternative numeric symbols.
        '%Om': '%m',                      // Replaced by the month using the locale's alternative numeric symbols.
        '%OM': '%M',                      // Replaced by the minutes using the locale's alternative numeric symbols.
        '%OS': '%S',                      // Replaced by the seconds using the locale's alternative numeric symbols.
        '%Ou': '%u',                      // Replaced by the weekday as a number in the locale's alternative representation (Monday=1).
        '%OU': '%U',                      // Replaced by the week number of the year (Sunday as the first day of the week, rules corresponding to %U ) using the locale's alternative numeric symbols.
        '%OV': '%V',                      // Replaced by the week number of the year (Monday as the first day of the week, rules corresponding to %V ) using the locale's alternative numeric symbols.
        '%Ow': '%w',                      // Replaced by the number of the weekday (Sunday=0) using the locale's alternative numeric symbols.
        '%OW': '%W',                      // Replaced by the week number of the year (Monday as the first day of the week) using the locale's alternative numeric symbols.
        '%Oy': '%y',                      // Replaced by the year (offset from %C ) using the locale's alternative numeric symbols.
      };
      for (var rule in EXPANSION_RULES_1) {
        pattern = pattern.replace(new RegExp(rule, 'g'), EXPANSION_RULES_1[rule]);
      }
  
      var WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
      function leadingSomething(value, digits, character) {
        var str = typeof value === 'number' ? value.toString() : (value || '');
        while (str.length < digits) {
          str = character[0]+str;
        }
        return str;
      }
  
      function leadingNulls(value, digits) {
        return leadingSomething(value, digits, '0');
      }
  
      function compareByDay(date1, date2) {
        function sgn(value) {
          return value < 0 ? -1 : (value > 0 ? 1 : 0);
        }
  
        var compare;
        if ((compare = sgn(date1.getFullYear()-date2.getFullYear())) === 0) {
          if ((compare = sgn(date1.getMonth()-date2.getMonth())) === 0) {
            compare = sgn(date1.getDate()-date2.getDate());
          }
        }
        return compare;
      }
  
      function getFirstWeekStartDate(janFourth) {
          switch (janFourth.getDay()) {
            case 0: // Sunday
              return new Date(janFourth.getFullYear()-1, 11, 29);
            case 1: // Monday
              return janFourth;
            case 2: // Tuesday
              return new Date(janFourth.getFullYear(), 0, 3);
            case 3: // Wednesday
              return new Date(janFourth.getFullYear(), 0, 2);
            case 4: // Thursday
              return new Date(janFourth.getFullYear(), 0, 1);
            case 5: // Friday
              return new Date(janFourth.getFullYear()-1, 11, 31);
            case 6: // Saturday
              return new Date(janFourth.getFullYear()-1, 11, 30);
          }
      }
  
      function getWeekBasedYear(date) {
          var thisDate = __addDays(new Date(date.tm_year+1900, 0, 1), date.tm_yday);
  
          var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
          var janFourthNextYear = new Date(thisDate.getFullYear()+1, 0, 4);
  
          var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
          var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
  
          if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
            // this date is after the start of the first week of this year
            if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
              return thisDate.getFullYear()+1;
            } else {
              return thisDate.getFullYear();
            }
          } else {
            return thisDate.getFullYear()-1;
          }
      }
  
      var EXPANSION_RULES_2 = {
        '%a': function(date) {
          return WEEKDAYS[date.tm_wday].substring(0,3);
        },
        '%A': function(date) {
          return WEEKDAYS[date.tm_wday];
        },
        '%b': function(date) {
          return MONTHS[date.tm_mon].substring(0,3);
        },
        '%B': function(date) {
          return MONTHS[date.tm_mon];
        },
        '%C': function(date) {
          var year = date.tm_year+1900;
          return leadingNulls((year/100)|0,2);
        },
        '%d': function(date) {
          return leadingNulls(date.tm_mday, 2);
        },
        '%e': function(date) {
          return leadingSomething(date.tm_mday, 2, ' ');
        },
        '%g': function(date) {
          // %g, %G, and %V give values according to the ISO 8601:2000 standard week-based year.
          // In this system, weeks begin on a Monday and week 1 of the year is the week that includes
          // January 4th, which is also the week that includes the first Thursday of the year, and
          // is also the first week that contains at least four days in the year.
          // If the first Monday of January is the 2nd, 3rd, or 4th, the preceding days are part of
          // the last week of the preceding year; thus, for Saturday 2nd January 1999,
          // %G is replaced by 1998 and %V is replaced by 53. If December 29th, 30th,
          // or 31st is a Monday, it and any following days are part of week 1 of the following year.
          // Thus, for Tuesday 30th December 1997, %G is replaced by 1998 and %V is replaced by 01.
  
          return getWeekBasedYear(date).toString().substring(2);
        },
        '%G': function(date) {
          return getWeekBasedYear(date);
        },
        '%H': function(date) {
          return leadingNulls(date.tm_hour, 2);
        },
        '%I': function(date) {
          var twelveHour = date.tm_hour;
          if (twelveHour == 0) twelveHour = 12;
          else if (twelveHour > 12) twelveHour -= 12;
          return leadingNulls(twelveHour, 2);
        },
        '%j': function(date) {
          // Day of the year (001-366)
          return leadingNulls(date.tm_mday+__arraySum(__isLeapYear(date.tm_year+1900) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, date.tm_mon-1), 3);
        },
        '%m': function(date) {
          return leadingNulls(date.tm_mon+1, 2);
        },
        '%M': function(date) {
          return leadingNulls(date.tm_min, 2);
        },
        '%n': function() {
          return '\n';
        },
        '%p': function(date) {
          if (date.tm_hour >= 0 && date.tm_hour < 12) {
            return 'AM';
          } else {
            return 'PM';
          }
        },
        '%S': function(date) {
          return leadingNulls(date.tm_sec, 2);
        },
        '%t': function() {
          return '\t';
        },
        '%u': function(date) {
          return date.tm_wday || 7;
        },
        '%U': function(date) {
          // Replaced by the week number of the year as a decimal number [00,53].
          // The first Sunday of January is the first day of week 1;
          // days in the new year before this are in week 0. [ tm_year, tm_wday, tm_yday]
          var janFirst = new Date(date.tm_year+1900, 0, 1);
          var firstSunday = janFirst.getDay() === 0 ? janFirst : __addDays(janFirst, 7-janFirst.getDay());
          var endDate = new Date(date.tm_year+1900, date.tm_mon, date.tm_mday);
  
          // is target date after the first Sunday?
          if (compareByDay(firstSunday, endDate) < 0) {
            // calculate difference in days between first Sunday and endDate
            var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth()-1)-31;
            var firstSundayUntilEndJanuary = 31-firstSunday.getDate();
            var days = firstSundayUntilEndJanuary+februaryFirstUntilEndMonth+endDate.getDate();
            return leadingNulls(Math.ceil(days/7), 2);
          }
  
          return compareByDay(firstSunday, janFirst) === 0 ? '01': '00';
        },
        '%V': function(date) {
          // Replaced by the week number of the year (Monday as the first day of the week)
          // as a decimal number [01,53]. If the week containing 1 January has four
          // or more days in the new year, then it is considered week 1.
          // Otherwise, it is the last week of the previous year, and the next week is week 1.
          // Both January 4th and the first Thursday of January are always in week 1. [ tm_year, tm_wday, tm_yday]
          var janFourthThisYear = new Date(date.tm_year+1900, 0, 4);
          var janFourthNextYear = new Date(date.tm_year+1901, 0, 4);
  
          var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
          var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
  
          var endDate = __addDays(new Date(date.tm_year+1900, 0, 1), date.tm_yday);
  
          if (compareByDay(endDate, firstWeekStartThisYear) < 0) {
            // if given date is before this years first week, then it belongs to the 53rd week of last year
            return '53';
          }
  
          if (compareByDay(firstWeekStartNextYear, endDate) <= 0) {
            // if given date is after next years first week, then it belongs to the 01th week of next year
            return '01';
          }
  
          // given date is in between CW 01..53 of this calendar year
          var daysDifference;
          if (firstWeekStartThisYear.getFullYear() < date.tm_year+1900) {
            // first CW of this year starts last year
            daysDifference = date.tm_yday+32-firstWeekStartThisYear.getDate()
          } else {
            // first CW of this year starts this year
            daysDifference = date.tm_yday+1-firstWeekStartThisYear.getDate();
          }
          return leadingNulls(Math.ceil(daysDifference/7), 2);
        },
        '%w': function(date) {
          return date.tm_wday;
        },
        '%W': function(date) {
          // Replaced by the week number of the year as a decimal number [00,53].
          // The first Monday of January is the first day of week 1;
          // days in the new year before this are in week 0. [ tm_year, tm_wday, tm_yday]
          var janFirst = new Date(date.tm_year, 0, 1);
          var firstMonday = janFirst.getDay() === 1 ? janFirst : __addDays(janFirst, janFirst.getDay() === 0 ? 1 : 7-janFirst.getDay()+1);
          var endDate = new Date(date.tm_year+1900, date.tm_mon, date.tm_mday);
  
          // is target date after the first Monday?
          if (compareByDay(firstMonday, endDate) < 0) {
            var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth()-1)-31;
            var firstMondayUntilEndJanuary = 31-firstMonday.getDate();
            var days = firstMondayUntilEndJanuary+februaryFirstUntilEndMonth+endDate.getDate();
            return leadingNulls(Math.ceil(days/7), 2);
          }
          return compareByDay(firstMonday, janFirst) === 0 ? '01': '00';
        },
        '%y': function(date) {
          // Replaced by the last two digits of the year as a decimal number [00,99]. [ tm_year]
          return (date.tm_year+1900).toString().substring(2);
        },
        '%Y': function(date) {
          // Replaced by the year as a decimal number (for example, 1997). [ tm_year]
          return date.tm_year+1900;
        },
        '%z': function(date) {
          // Replaced by the offset from UTC in the ISO 8601:2000 standard format ( +hhmm or -hhmm ).
          // For example, "-0430" means 4 hours 30 minutes behind UTC (west of Greenwich).
          var off = date.tm_gmtoff;
          var ahead = off >= 0;
          off = Math.abs(off) / 60;
          // convert from minutes into hhmm format (which means 60 minutes = 100 units)
          off = (off / 60)*100 + (off % 60);
          return (ahead ? '+' : '-') + String("0000" + off).slice(-4);
        },
        '%Z': function(date) {
          return date.tm_zone;
        },
        '%%': function() {
          return '%';
        }
      };
      for (var rule in EXPANSION_RULES_2) {
        if (pattern.indexOf(rule) >= 0) {
          pattern = pattern.replace(new RegExp(rule, 'g'), EXPANSION_RULES_2[rule](date));
        }
      }
  
      var bytes = intArrayFromString(pattern, false);
      if (bytes.length > maxsize) {
        return 0;
      }
  
      writeArrayToMemory(bytes, s);
      return bytes.length-1;
    }function _strftime_l(s, maxsize, format, tm) {
      return _strftime(s, maxsize, format, tm); // no locale support yet
    }

  function _time(ptr) {
      var ret = (Date.now()/1000)|0;
      if (ptr) {
        HEAP32[((ptr)>>2)]=ret;
      }
      return ret;
    }

  
  var readAsmConstArgsArray=[];function readAsmConstArgs(sigPtr, buf) {
      // Nobody should have mutated _readAsmConstArgsArray underneath us to be something else than an array.
      assert(Array.isArray(readAsmConstArgsArray));
      // The input buffer is allocated on the stack, so it must be stack-aligned.
      assert(buf % 16 == 0);
      readAsmConstArgsArray.length = 0;
      var ch;
      // Most arguments are i32s, so shift the buffer pointer so it is a plain
      // index into HEAP32.
      buf >>= 2;
      while (ch = HEAPU8[sigPtr++]) {
        assert(ch === 100/*'d'*/ || ch === 102/*'f'*/ || ch === 105 /*'i'*/);
        // A double takes two 32-bit slots, and must also be aligned - the backend
        // will emit padding to avoid that.
        var double = ch < 105;
        if (double && (buf & 1)) buf++;
        readAsmConstArgsArray.push(double ? HEAPF64[buf++ >> 1] : HEAP32[buf]);
        ++buf;
      }
      return readAsmConstArgsArray;
    }


var FSNode = /** @constructor */ function(parent, name, mode, rdev) {
    if (!parent) {
      parent = this;  // root node sets parent to itself
    }
    this.parent = parent;
    this.mount = parent.mount;
    this.mounted = null;
    this.id = FS.nextInode++;
    this.name = name;
    this.mode = mode;
    this.node_ops = {};
    this.stream_ops = {};
    this.rdev = rdev;
  };
  var readMode = 292/*292*/ | 73/*73*/;
  var writeMode = 146/*146*/;
  Object.defineProperties(FSNode.prototype, {
   read: {
    get: /** @this{FSNode} */function() {
     return (this.mode & readMode) === readMode;
    },
    set: /** @this{FSNode} */function(val) {
     val ? this.mode |= readMode : this.mode &= ~readMode;
    }
   },
   write: {
    get: /** @this{FSNode} */function() {
     return (this.mode & writeMode) === writeMode;
    },
    set: /** @this{FSNode} */function(val) {
     val ? this.mode |= writeMode : this.mode &= ~writeMode;
    }
   },
   isFolder: {
    get: /** @this{FSNode} */function() {
     return FS.isDir(this.mode);
    }
   },
   isDevice: {
    get: /** @this{FSNode} */function() {
     return FS.isChrdev(this.mode);
    }
   }
  });
  FS.FSNode = FSNode;
  FS.staticInit();Module["FS_createFolder"] = FS.createFolder;Module["FS_createPath"] = FS.createPath;Module["FS_createDataFile"] = FS.createDataFile;Module["FS_createPreloadedFile"] = FS.createPreloadedFile;Module["FS_createLazyFile"] = FS.createLazyFile;Module["FS_createLink"] = FS.createLink;Module["FS_createDevice"] = FS.createDevice;Module["FS_unlink"] = FS.unlink;;
Module["requestFullscreen"] = function Module_requestFullscreen(lockPointer, resizeCanvas) { Browser.requestFullscreen(lockPointer, resizeCanvas) };
  Module["requestFullScreen"] = function Module_requestFullScreen() { Browser.requestFullScreen() };
  Module["requestAnimationFrame"] = function Module_requestAnimationFrame(func) { Browser.requestAnimationFrame(func) };
  Module["setCanvasSize"] = function Module_setCanvasSize(width, height, noUpdates) { Browser.setCanvasSize(width, height, noUpdates) };
  Module["pauseMainLoop"] = function Module_pauseMainLoop() { Browser.mainLoop.pause() };
  Module["resumeMainLoop"] = function Module_resumeMainLoop() { Browser.mainLoop.resume() };
  Module["getUserMedia"] = function Module_getUserMedia() { Browser.getUserMedia() }
  Module["createContext"] = function Module_createContext(canvas, useWebGL, setInModule, webGLContextAttributes) { return Browser.createContext(canvas, useWebGL, setInModule, webGLContextAttributes) };
var GLctx;;
GLImmediate.setupFuncs(); Browser.moduleContextCreatedCallbacks.push(function() { GLImmediate.init() });;
GLEmulation.init();;
for (var i = 0; i < 32; ++i) tempFixedLengthArray.push(new Array(i));;
var miniTempWebGLFloatBuffersStorage = new Float32Array(288);
  for (/**@suppress{duplicate}*/var i = 0; i < 288; ++i) {
  miniTempWebGLFloatBuffers[i] = miniTempWebGLFloatBuffersStorage.subarray(0, i+1);
  }
  ;
var __miniTempWebGLIntBuffersStorage = new Int32Array(288);
  for (/**@suppress{duplicate}*/var i = 0; i < 288; ++i) {
  __miniTempWebGLIntBuffers[i] = __miniTempWebGLIntBuffersStorage.subarray(0, i+1);
  }
  ;
Fetch.staticInit();;
var ASSERTIONS = true;



/** @type {function(string, boolean=, number=)} */
function intArrayFromString(stringy, dontAddNull, length) {
  var len = length > 0 ? length : lengthBytesUTF8(stringy)+1;
  var u8array = new Array(len);
  var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
  if (dontAddNull) u8array.length = numBytesWritten;
  return u8array;
}

function intArrayToString(array) {
  var ret = [];
  for (var i = 0; i < array.length; i++) {
    var chr = array[i];
    if (chr > 0xFF) {
      if (ASSERTIONS) {
        assert(false, 'Character code ' + chr + ' (' + String.fromCharCode(chr) + ')  at offset ' + i + ' not in 0x00-0xFF.');
      }
      chr &= 0xFF;
    }
    ret.push(String.fromCharCode(chr));
  }
  return ret.join('');
}


// ASM_LIBRARY EXTERN PRIMITIVES: Math_floor,Math_ceil

var asmGlobalArg = {};
var asmLibraryArg = { "__assert_fail": ___assert_fail, "__cxa_allocate_exception": ___cxa_allocate_exception, "__cxa_atexit": ___cxa_atexit, "__cxa_throw": ___cxa_throw, "__handle_stack_overflow": ___handle_stack_overflow, "__map_file": ___map_file, "__sys_access": ___sys_access, "__sys_fcntl64": ___sys_fcntl64, "__sys_getdents64": ___sys_getdents64, "__sys_ioctl": ___sys_ioctl, "__sys_mkdir": ___sys_mkdir, "__sys_munmap": ___sys_munmap, "__sys_open": ___sys_open, "__sys_read": ___sys_read, "__sys_rmdir": ___sys_rmdir, "__sys_stat64": ___sys_stat64, "__sys_unlink": ___sys_unlink, "_emscripten_fetch_free": __emscripten_fetch_free, "abort": _abort, "abs": _abs, "alBufferData": _alBufferData, "alDeleteBuffers": _alDeleteBuffers, "alDeleteSources": _alDeleteSources, "alGenBuffers": _alGenBuffers, "alGenSources": _alGenSources, "alGetError": _alGetError, "alGetSourcef": _alGetSourcef, "alGetSourcei": _alGetSourcei, "alListenerf": _alListenerf, "alListenerfv": _alListenerfv, "alSourcePause": _alSourcePause, "alSourcePlay": _alSourcePlay, "alSourceStop": _alSourceStop, "alSourcef": _alSourcef, "alSourcei": _alSourcei, "alcCloseDevice": _alcCloseDevice, "alcCreateContext": _alcCreateContext, "alcDestroyContext": _alcDestroyContext, "alcMakeContextCurrent": _alcMakeContextCurrent, "alcOpenDevice": _alcOpenDevice, "clock_gettime": _clock_gettime, "dlclose": _dlclose, "eglBindAPI": _eglBindAPI, "eglChooseConfig": _eglChooseConfig, "eglCreateContext": _eglCreateContext, "eglCreateWindowSurface": _eglCreateWindowSurface, "eglDestroyContext": _eglDestroyContext, "eglDestroySurface": _eglDestroySurface, "eglGetConfigAttrib": _eglGetConfigAttrib, "eglGetDisplay": _eglGetDisplay, "eglGetError": _eglGetError, "eglGetProcAddress": _eglGetProcAddress, "eglInitialize": _eglInitialize, "eglMakeCurrent": _eglMakeCurrent, "eglQueryString": _eglQueryString, "eglSwapBuffers": _eglSwapBuffers, "eglSwapInterval": _eglSwapInterval, "eglTerminate": _eglTerminate, "eglWaitGL": _eglWaitGL, "eglWaitNative": _eglWaitNative, "emscripten_asm_const_iii": _emscripten_asm_const_iii, "emscripten_exit_fullscreen": _emscripten_exit_fullscreen, "emscripten_exit_pointerlock": _emscripten_exit_pointerlock, "emscripten_exit_with_live_runtime": _emscripten_exit_with_live_runtime, "emscripten_get_device_pixel_ratio": _emscripten_get_device_pixel_ratio, "emscripten_get_element_css_size": _emscripten_get_element_css_size, "emscripten_get_gamepad_status": _emscripten_get_gamepad_status, "emscripten_get_num_gamepads": _emscripten_get_num_gamepads, "emscripten_get_sbrk_ptr": _emscripten_get_sbrk_ptr, "emscripten_glActiveTexture": _emscripten_glActiveTexture, "emscripten_glAlphaFunc": _emscripten_glAlphaFunc, "emscripten_glAttachShader": _emscripten_glAttachShader, "emscripten_glBegin": _emscripten_glBegin, "emscripten_glBeginQueryEXT": _emscripten_glBeginQueryEXT, "emscripten_glBindAttribLocation": _emscripten_glBindAttribLocation, "emscripten_glBindBuffer": _emscripten_glBindBuffer, "emscripten_glBindFramebuffer": _emscripten_glBindFramebuffer, "emscripten_glBindProgram": _emscripten_glBindProgram, "emscripten_glBindRenderbuffer": _emscripten_glBindRenderbuffer, "emscripten_glBindTexture": _emscripten_glBindTexture, "emscripten_glBindVertexArrayOES": _emscripten_glBindVertexArrayOES, "emscripten_glBlendColor": _emscripten_glBlendColor, "emscripten_glBlendEquation": _emscripten_glBlendEquation, "emscripten_glBlendEquationSeparate": _emscripten_glBlendEquationSeparate, "emscripten_glBlendFunc": _emscripten_glBlendFunc, "emscripten_glBlendFuncSeparate": _emscripten_glBlendFuncSeparate, "emscripten_glBufferData": _emscripten_glBufferData, "emscripten_glBufferSubData": _emscripten_glBufferSubData, "emscripten_glCheckFramebufferStatus": _emscripten_glCheckFramebufferStatus, "emscripten_glClear": _emscripten_glClear, "emscripten_glClearColor": _emscripten_glClearColor, "emscripten_glClearDepthf": _emscripten_glClearDepthf, "emscripten_glClearStencil": _emscripten_glClearStencil, "emscripten_glClientActiveTexture": _emscripten_glClientActiveTexture, "emscripten_glColor3d": _emscripten_glColor3d, "emscripten_glColor3f": _emscripten_glColor3f, "emscripten_glColor3fv": _emscripten_glColor3fv, "emscripten_glColor3ub": _emscripten_glColor3ub, "emscripten_glColor3ubv": _emscripten_glColor3ubv, "emscripten_glColor3ui": _emscripten_glColor3ui, "emscripten_glColor3uiv": _emscripten_glColor3uiv, "emscripten_glColor3us": _emscripten_glColor3us, "emscripten_glColor3usv": _emscripten_glColor3usv, "emscripten_glColor4d": _emscripten_glColor4d, "emscripten_glColor4f": _emscripten_glColor4f, "emscripten_glColor4fv": _emscripten_glColor4fv, "emscripten_glColor4ub": _emscripten_glColor4ub, "emscripten_glColor4ubv": _emscripten_glColor4ubv, "emscripten_glColor4ui": _emscripten_glColor4ui, "emscripten_glColor4us": _emscripten_glColor4us, "emscripten_glColorMask": _emscripten_glColorMask, "emscripten_glColorPointer": _emscripten_glColorPointer, "emscripten_glCompileShader": _emscripten_glCompileShader, "emscripten_glCompressedTexImage2D": _emscripten_glCompressedTexImage2D, "emscripten_glCompressedTexSubImage2D": _emscripten_glCompressedTexSubImage2D, "emscripten_glCopyTexImage2D": _emscripten_glCopyTexImage2D, "emscripten_glCopyTexSubImage2D": _emscripten_glCopyTexSubImage2D, "emscripten_glCreateProgram": _emscripten_glCreateProgram, "emscripten_glCreateShader": _emscripten_glCreateShader, "emscripten_glCullFace": _emscripten_glCullFace, "emscripten_glDeleteBuffers": _emscripten_glDeleteBuffers, "emscripten_glDeleteFramebuffers": _emscripten_glDeleteFramebuffers, "emscripten_glDeleteObject": _emscripten_glDeleteObject, "emscripten_glDeleteProgram": _emscripten_glDeleteProgram, "emscripten_glDeleteQueriesEXT": _emscripten_glDeleteQueriesEXT, "emscripten_glDeleteRenderbuffers": _emscripten_glDeleteRenderbuffers, "emscripten_glDeleteShader": _emscripten_glDeleteShader, "emscripten_glDeleteTextures": _emscripten_glDeleteTextures, "emscripten_glDeleteVertexArraysOES": _emscripten_glDeleteVertexArraysOES, "emscripten_glDepthFunc": _emscripten_glDepthFunc, "emscripten_glDepthMask": _emscripten_glDepthMask, "emscripten_glDepthRangef": _emscripten_glDepthRangef, "emscripten_glDetachShader": _emscripten_glDetachShader, "emscripten_glDisable": _emscripten_glDisable, "emscripten_glDisableClientState": _emscripten_glDisableClientState, "emscripten_glDisableVertexAttribArray": _emscripten_glDisableVertexAttribArray, "emscripten_glDrawArrays": _emscripten_glDrawArrays, "emscripten_glDrawArraysInstancedANGLE": _emscripten_glDrawArraysInstancedANGLE, "emscripten_glDrawBuffer": _emscripten_glDrawBuffer, "emscripten_glDrawBuffersWEBGL": _emscripten_glDrawBuffersWEBGL, "emscripten_glDrawElements": _emscripten_glDrawElements, "emscripten_glDrawElementsInstancedANGLE": _emscripten_glDrawElementsInstancedANGLE, "emscripten_glDrawRangeElements": _emscripten_glDrawRangeElements, "emscripten_glEnable": _emscripten_glEnable, "emscripten_glEnableClientState": _emscripten_glEnableClientState, "emscripten_glEnableVertexAttribArray": _emscripten_glEnableVertexAttribArray, "emscripten_glEnd": _emscripten_glEnd, "emscripten_glEndQueryEXT": _emscripten_glEndQueryEXT, "emscripten_glFinish": _emscripten_glFinish, "emscripten_glFlush": _emscripten_glFlush, "emscripten_glFramebufferRenderbuffer": _emscripten_glFramebufferRenderbuffer, "emscripten_glFramebufferTexture2D": _emscripten_glFramebufferTexture2D, "emscripten_glFrontFace": _emscripten_glFrontFace, "emscripten_glFrustum": _emscripten_glFrustum, "emscripten_glGenBuffers": _emscripten_glGenBuffers, "emscripten_glGenFramebuffers": _emscripten_glGenFramebuffers, "emscripten_glGenQueriesEXT": _emscripten_glGenQueriesEXT, "emscripten_glGenRenderbuffers": _emscripten_glGenRenderbuffers, "emscripten_glGenTextures": _emscripten_glGenTextures, "emscripten_glGenVertexArraysOES": _emscripten_glGenVertexArraysOES, "emscripten_glGenerateMipmap": _emscripten_glGenerateMipmap, "emscripten_glGetActiveAttrib": _emscripten_glGetActiveAttrib, "emscripten_glGetActiveUniform": _emscripten_glGetActiveUniform, "emscripten_glGetAttachedShaders": _emscripten_glGetAttachedShaders, "emscripten_glGetAttribLocation": _emscripten_glGetAttribLocation, "emscripten_glGetBooleanv": _emscripten_glGetBooleanv, "emscripten_glGetBufferParameteriv": _emscripten_glGetBufferParameteriv, "emscripten_glGetError": _emscripten_glGetError, "emscripten_glGetFloatv": _emscripten_glGetFloatv, "emscripten_glGetFramebufferAttachmentParameteriv": _emscripten_glGetFramebufferAttachmentParameteriv, "emscripten_glGetInfoLog": _emscripten_glGetInfoLog, "emscripten_glGetIntegerv": _emscripten_glGetIntegerv, "emscripten_glGetObjectParameteriv": _emscripten_glGetObjectParameteriv, "emscripten_glGetPointerv": _emscripten_glGetPointerv, "emscripten_glGetProgramInfoLog": _emscripten_glGetProgramInfoLog, "emscripten_glGetProgramiv": _emscripten_glGetProgramiv, "emscripten_glGetQueryObjecti64vEXT": _emscripten_glGetQueryObjecti64vEXT, "emscripten_glGetQueryObjectivEXT": _emscripten_glGetQueryObjectivEXT, "emscripten_glGetQueryObjectui64vEXT": _emscripten_glGetQueryObjectui64vEXT, "emscripten_glGetQueryObjectuivEXT": _emscripten_glGetQueryObjectuivEXT, "emscripten_glGetQueryivEXT": _emscripten_glGetQueryivEXT, "emscripten_glGetRenderbufferParameteriv": _emscripten_glGetRenderbufferParameteriv, "emscripten_glGetShaderInfoLog": _emscripten_glGetShaderInfoLog, "emscripten_glGetShaderPrecisionFormat": _emscripten_glGetShaderPrecisionFormat, "emscripten_glGetShaderSource": _emscripten_glGetShaderSource, "emscripten_glGetShaderiv": _emscripten_glGetShaderiv, "emscripten_glGetString": _emscripten_glGetString, "emscripten_glGetTexEnvfv": _emscripten_glGetTexEnvfv, "emscripten_glGetTexEnviv": _emscripten_glGetTexEnviv, "emscripten_glGetTexLevelParameteriv": _emscripten_glGetTexLevelParameteriv, "emscripten_glGetTexParameterfv": _emscripten_glGetTexParameterfv, "emscripten_glGetTexParameteriv": _emscripten_glGetTexParameteriv, "emscripten_glGetUniformLocation": _emscripten_glGetUniformLocation, "emscripten_glGetUniformfv": _emscripten_glGetUniformfv, "emscripten_glGetUniformiv": _emscripten_glGetUniformiv, "emscripten_glGetVertexAttribPointerv": _emscripten_glGetVertexAttribPointerv, "emscripten_glGetVertexAttribfv": _emscripten_glGetVertexAttribfv, "emscripten_glGetVertexAttribiv": _emscripten_glGetVertexAttribiv, "emscripten_glHint": _emscripten_glHint, "emscripten_glIsBuffer": _emscripten_glIsBuffer, "emscripten_glIsEnabled": _emscripten_glIsEnabled, "emscripten_glIsFramebuffer": _emscripten_glIsFramebuffer, "emscripten_glIsProgram": _emscripten_glIsProgram, "emscripten_glIsQueryEXT": _emscripten_glIsQueryEXT, "emscripten_glIsRenderbuffer": _emscripten_glIsRenderbuffer, "emscripten_glIsShader": _emscripten_glIsShader, "emscripten_glIsTexture": _emscripten_glIsTexture, "emscripten_glIsVertexArrayOES": _emscripten_glIsVertexArrayOES, "emscripten_glLightModelfv": _emscripten_glLightModelfv, "emscripten_glLightfv": _emscripten_glLightfv, "emscripten_glLineWidth": _emscripten_glLineWidth, "emscripten_glLinkProgram": _emscripten_glLinkProgram, "emscripten_glLoadIdentity": _emscripten_glLoadIdentity, "emscripten_glLoadMatrixd": _emscripten_glLoadMatrixd, "emscripten_glLoadMatrixf": _emscripten_glLoadMatrixf, "emscripten_glLoadTransposeMatrixd": _emscripten_glLoadTransposeMatrixd, "emscripten_glLoadTransposeMatrixf": _emscripten_glLoadTransposeMatrixf, "emscripten_glMaterialfv": _emscripten_glMaterialfv, "emscripten_glMatrixMode": _emscripten_glMatrixMode, "emscripten_glMultMatrixd": _emscripten_glMultMatrixd, "emscripten_glMultMatrixf": _emscripten_glMultMatrixf, "emscripten_glMultTransposeMatrixd": _emscripten_glMultTransposeMatrixd, "emscripten_glMultTransposeMatrixf": _emscripten_glMultTransposeMatrixf, "emscripten_glNormal3f": _emscripten_glNormal3f, "emscripten_glNormalPointer": _emscripten_glNormalPointer, "emscripten_glOrtho": _emscripten_glOrtho, "emscripten_glPixelStorei": _emscripten_glPixelStorei, "emscripten_glPolygonMode": _emscripten_glPolygonMode, "emscripten_glPolygonOffset": _emscripten_glPolygonOffset, "emscripten_glPopMatrix": _emscripten_glPopMatrix, "emscripten_glPushMatrix": _emscripten_glPushMatrix, "emscripten_glQueryCounterEXT": _emscripten_glQueryCounterEXT, "emscripten_glReadBuffer": _emscripten_glReadBuffer, "emscripten_glReadPixels": _emscripten_glReadPixels, "emscripten_glReleaseShaderCompiler": _emscripten_glReleaseShaderCompiler, "emscripten_glRenderbufferStorage": _emscripten_glRenderbufferStorage, "emscripten_glRotated": _emscripten_glRotated, "emscripten_glRotatef": _emscripten_glRotatef, "emscripten_glSampleCoverage": _emscripten_glSampleCoverage, "emscripten_glScaled": _emscripten_glScaled, "emscripten_glScalef": _emscripten_glScalef, "emscripten_glScissor": _emscripten_glScissor, "emscripten_glShadeModel": _emscripten_glShadeModel, "emscripten_glShaderBinary": _emscripten_glShaderBinary, "emscripten_glShaderSource": _emscripten_glShaderSource, "emscripten_glStencilFunc": _emscripten_glStencilFunc, "emscripten_glStencilFuncSeparate": _emscripten_glStencilFuncSeparate, "emscripten_glStencilMask": _emscripten_glStencilMask, "emscripten_glStencilMaskSeparate": _emscripten_glStencilMaskSeparate, "emscripten_glStencilOp": _emscripten_glStencilOp, "emscripten_glStencilOpSeparate": _emscripten_glStencilOpSeparate, "emscripten_glTexCoord2f": _emscripten_glTexCoord2f, "emscripten_glTexCoord2fv": _emscripten_glTexCoord2fv, "emscripten_glTexCoord2i": _emscripten_glTexCoord2i, "emscripten_glTexCoord3f": _emscripten_glTexCoord3f, "emscripten_glTexCoord4f": _emscripten_glTexCoord4f, "emscripten_glTexCoordPointer": _emscripten_glTexCoordPointer, "emscripten_glTexGenfv": _emscripten_glTexGenfv, "emscripten_glTexGeni": _emscripten_glTexGeni, "emscripten_glTexImage1D": _emscripten_glTexImage1D, "emscripten_glTexImage2D": _emscripten_glTexImage2D, "emscripten_glTexParameterf": _emscripten_glTexParameterf, "emscripten_glTexParameterfv": _emscripten_glTexParameterfv, "emscripten_glTexParameteri": _emscripten_glTexParameteri, "emscripten_glTexParameteriv": _emscripten_glTexParameteriv, "emscripten_glTexSubImage2D": _emscripten_glTexSubImage2D, "emscripten_glTranslated": _emscripten_glTranslated, "emscripten_glTranslatef": _emscripten_glTranslatef, "emscripten_glUniform1f": _emscripten_glUniform1f, "emscripten_glUniform1fv": _emscripten_glUniform1fv, "emscripten_glUniform1i": _emscripten_glUniform1i, "emscripten_glUniform1iv": _emscripten_glUniform1iv, "emscripten_glUniform2f": _emscripten_glUniform2f, "emscripten_glUniform2fv": _emscripten_glUniform2fv, "emscripten_glUniform2i": _emscripten_glUniform2i, "emscripten_glUniform2iv": _emscripten_glUniform2iv, "emscripten_glUniform3f": _emscripten_glUniform3f, "emscripten_glUniform3fv": _emscripten_glUniform3fv, "emscripten_glUniform3i": _emscripten_glUniform3i, "emscripten_glUniform3iv": _emscripten_glUniform3iv, "emscripten_glUniform4f": _emscripten_glUniform4f, "emscripten_glUniform4fv": _emscripten_glUniform4fv, "emscripten_glUniform4i": _emscripten_glUniform4i, "emscripten_glUniform4iv": _emscripten_glUniform4iv, "emscripten_glUniformMatrix2fv": _emscripten_glUniformMatrix2fv, "emscripten_glUniformMatrix3fv": _emscripten_glUniformMatrix3fv, "emscripten_glUniformMatrix4fv": _emscripten_glUniformMatrix4fv, "emscripten_glUseProgram": _emscripten_glUseProgram, "emscripten_glValidateProgram": _emscripten_glValidateProgram, "emscripten_glVertex2f": _emscripten_glVertex2f, "emscripten_glVertex2fv": _emscripten_glVertex2fv, "emscripten_glVertex2i": _emscripten_glVertex2i, "emscripten_glVertex3f": _emscripten_glVertex3f, "emscripten_glVertex3fv": _emscripten_glVertex3fv, "emscripten_glVertex3i": _emscripten_glVertex3i, "emscripten_glVertex4f": _emscripten_glVertex4f, "emscripten_glVertex4fv": _emscripten_glVertex4fv, "emscripten_glVertex4i": _emscripten_glVertex4i, "emscripten_glVertexAttrib1f": _emscripten_glVertexAttrib1f, "emscripten_glVertexAttrib1fv": _emscripten_glVertexAttrib1fv, "emscripten_glVertexAttrib2f": _emscripten_glVertexAttrib2f, "emscripten_glVertexAttrib2fv": _emscripten_glVertexAttrib2fv, "emscripten_glVertexAttrib3f": _emscripten_glVertexAttrib3f, "emscripten_glVertexAttrib3fv": _emscripten_glVertexAttrib3fv, "emscripten_glVertexAttrib4f": _emscripten_glVertexAttrib4f, "emscripten_glVertexAttrib4fv": _emscripten_glVertexAttrib4fv, "emscripten_glVertexAttribDivisorANGLE": _emscripten_glVertexAttribDivisorANGLE, "emscripten_glVertexAttribPointer": _emscripten_glVertexAttribPointer, "emscripten_glVertexPointer": _emscripten_glVertexPointer, "emscripten_glViewport": _emscripten_glViewport, "emscripten_has_asyncify": _emscripten_has_asyncify, "emscripten_is_main_browser_thread": _emscripten_is_main_browser_thread, "emscripten_longjmp": _emscripten_longjmp, "emscripten_memcpy_big": _emscripten_memcpy_big, "emscripten_request_fullscreen_strategy": _emscripten_request_fullscreen_strategy, "emscripten_request_pointerlock": _emscripten_request_pointerlock, "emscripten_resize_heap": _emscripten_resize_heap, "emscripten_run_script": _emscripten_run_script, "emscripten_run_script_int": _emscripten_run_script_int, "emscripten_sample_gamepad_data": _emscripten_sample_gamepad_data, "emscripten_set_beforeunload_callback_on_thread": _emscripten_set_beforeunload_callback_on_thread, "emscripten_set_blur_callback_on_thread": _emscripten_set_blur_callback_on_thread, "emscripten_set_canvas_element_size": _emscripten_set_canvas_element_size, "emscripten_set_element_css_size": _emscripten_set_element_css_size, "emscripten_set_focus_callback_on_thread": _emscripten_set_focus_callback_on_thread, "emscripten_set_fullscreenchange_callback_on_thread": _emscripten_set_fullscreenchange_callback_on_thread, "emscripten_set_gamepadconnected_callback_on_thread": _emscripten_set_gamepadconnected_callback_on_thread, "emscripten_set_gamepaddisconnected_callback_on_thread": _emscripten_set_gamepaddisconnected_callback_on_thread, "emscripten_set_keydown_callback_on_thread": _emscripten_set_keydown_callback_on_thread, "emscripten_set_keypress_callback_on_thread": _emscripten_set_keypress_callback_on_thread, "emscripten_set_keyup_callback_on_thread": _emscripten_set_keyup_callback_on_thread, "emscripten_set_main_loop": _emscripten_set_main_loop, "emscripten_set_mousedown_callback_on_thread": _emscripten_set_mousedown_callback_on_thread, "emscripten_set_mouseenter_callback_on_thread": _emscripten_set_mouseenter_callback_on_thread, "emscripten_set_mouseleave_callback_on_thread": _emscripten_set_mouseleave_callback_on_thread, "emscripten_set_mousemove_callback_on_thread": _emscripten_set_mousemove_callback_on_thread, "emscripten_set_mouseup_callback_on_thread": _emscripten_set_mouseup_callback_on_thread, "emscripten_set_pointerlockchange_callback_on_thread": _emscripten_set_pointerlockchange_callback_on_thread, "emscripten_set_resize_callback_on_thread": _emscripten_set_resize_callback_on_thread, "emscripten_set_touchcancel_callback_on_thread": _emscripten_set_touchcancel_callback_on_thread, "emscripten_set_touchend_callback_on_thread": _emscripten_set_touchend_callback_on_thread, "emscripten_set_touchmove_callback_on_thread": _emscripten_set_touchmove_callback_on_thread, "emscripten_set_touchstart_callback_on_thread": _emscripten_set_touchstart_callback_on_thread, "emscripten_set_visibilitychange_callback_on_thread": _emscripten_set_visibilitychange_callback_on_thread, "emscripten_set_wheel_callback_on_thread": _emscripten_set_wheel_callback_on_thread, "emscripten_sleep": _emscripten_sleep, "emscripten_start_fetch": _emscripten_start_fetch, "environ_get": _environ_get, "environ_sizes_get": _environ_sizes_get, "exit": _exit, "fd_close": _fd_close, "fd_read": _fd_read, "fd_seek": _fd_seek, "fd_write": _fd_write, "getTempRet0": _getTempRet0, "gettimeofday": _gettimeofday, "glActiveTexture": _glActiveTexture, "glAlphaFunc": _glAlphaFunc, "glBindBuffer": _glBindBuffer, "glBindFramebuffer": _glBindFramebuffer, "glBindTexture": _glBindTexture, "glBlendEquation": _glBlendEquation, "glBlendEquationSeparate": _glBlendEquationSeparate, "glBlendFunc": _glBlendFunc, "glBlendFuncSeparate": _glBlendFuncSeparate, "glClear": _glClear, "glClearColor": _glClearColor, "glClearDepthf": _glClearDepthf, "glClientActiveTexture": _glClientActiveTexture, "glColor4f": _glColor4f, "glColorPointer": _glColorPointer, "glDeleteBuffers": _glDeleteBuffers, "glDeleteFramebuffers": _glDeleteFramebuffers, "glDeleteTextures": _glDeleteTextures, "glDepthFunc": _glDepthFunc, "glDisable": _glDisable, "glDrawArrays": _glDrawArrays, "glDrawElements": _glDrawElements, "glEnable": _glEnable, "glEnableClientState": _glEnableClientState, "glFlush": _glFlush, "glFramebufferTexture2D": _glFramebufferTexture2D, "glGenFramebuffers": _glGenFramebuffers, "glGenTextures": _glGenTextures, "glGetFloatv": _glGetFloatv, "glGetIntegerv": _glGetIntegerv, "glLoadIdentity": _glLoadIdentity, "glLoadMatrixf": _glLoadMatrixf, "glMatrixMode": _glMatrixMode, "glPolygonOffset": _glPolygonOffset, "glReadPixels": _glReadPixels, "glScissor": _glScissor, "glShadeModel": _glShadeModel, "glTexCoordPointer": _glTexCoordPointer, "glTexEnvf": _glTexEnvf, "glTexEnvfv": _glTexEnvfv, "glTexEnvi": _glTexEnvi, "glTexImage2D": _glTexImage2D, "glTexParameterf": _glTexParameterf, "glTexParameteri": _glTexParameteri, "glVertexPointer": _glVertexPointer, "glViewport": _glViewport, "invoke_ii": invoke_ii, "invoke_iii": invoke_iii, "invoke_iiii": invoke_iiii, "invoke_iiiii": invoke_iiiii, "invoke_vii": invoke_vii, "invoke_viii": invoke_viii, "invoke_viiii": invoke_viiii, "localtime": _localtime, "memory": wasmMemory, "nanosleep": _nanosleep, "round": _round, "roundf": _roundf, "setTempRet0": _setTempRet0, "sigaction": _sigaction, "signal": _signal, "strftime_l": _strftime_l, "table": wasmTable, "time": _time };
var asm = createWasm();
/** @type {function(...*):?} */
var ___wasm_call_ctors = Module["___wasm_call_ctors"] = createExportWrapper("__wasm_call_ctors");

/** @type {function(...*):?} */
var _malloc = Module["_malloc"] = createExportWrapper("malloc");

/** @type {function(...*):?} */
var _testSetjmp = Module["_testSetjmp"] = createExportWrapper("testSetjmp");

/** @type {function(...*):?} */
var _saveSetjmp = Module["_saveSetjmp"] = createExportWrapper("saveSetjmp");

/** @type {function(...*):?} */
var _free = Module["_free"] = createExportWrapper("free");

/** @type {function(...*):?} */
var _memcpy = Module["_memcpy"] = createExportWrapper("memcpy");

/** @type {function(...*):?} */
var _memset = Module["_memset"] = createExportWrapper("memset");

/** @type {function(...*):?} */
var _IDBFS_ReadSync = Module["_IDBFS_ReadSync"] = createExportWrapper("IDBFS_ReadSync");

/** @type {function(...*):?} */
var _IDBFS_WriteSync = Module["_IDBFS_WriteSync"] = createExportWrapper("IDBFS_WriteSync");

/** @type {function(...*):?} */
var ___errno_location = Module["___errno_location"] = createExportWrapper("__errno_location");

/** @type {function(...*):?} */
var _SetPasteData = Module["_SetPasteData"] = createExportWrapper("SetPasteData");

/** @type {function(...*):?} */
var _openmpt_module_set_position_order_row = Module["_openmpt_module_set_position_order_row"] = createExportWrapper("openmpt_module_set_position_order_row");

/** @type {function(...*):?} */
var _openmpt_module_destroy = Module["_openmpt_module_destroy"] = createExportWrapper("openmpt_module_destroy");

/** @type {function(...*):?} */
var _openmpt_module_read_mono = Module["_openmpt_module_read_mono"] = createExportWrapper("openmpt_module_read_mono");

/** @type {function(...*):?} */
var _openmpt_module_create2 = Module["_openmpt_module_create2"] = createExportWrapper("openmpt_module_create2");

/** @type {function(...*):?} */
var _openmpt_module_set_repeat_count = Module["_openmpt_module_set_repeat_count"] = createExportWrapper("openmpt_module_set_repeat_count");

/** @type {function(...*):?} */
var _AdComplete = Module["_AdComplete"] = createExportWrapper("AdComplete");

/** @type {function(...*):?} */
var _openmpt_get_library_version = Module["_openmpt_get_library_version"] = createExportWrapper("openmpt_get_library_version");

/** @type {function(...*):?} */
var _openmpt_get_core_version = Module["_openmpt_get_core_version"] = createExportWrapper("openmpt_get_core_version");

/** @type {function(...*):?} */
var _openmpt_free_string = Module["_openmpt_free_string"] = createExportWrapper("openmpt_free_string");

/** @type {function(...*):?} */
var _openmpt_get_string = Module["_openmpt_get_string"] = createExportWrapper("openmpt_get_string");

/** @type {function(...*):?} */
var _openmpt_get_supported_extensions = Module["_openmpt_get_supported_extensions"] = createExportWrapper("openmpt_get_supported_extensions");

/** @type {function(...*):?} */
var _openmpt_is_extension_supported = Module["_openmpt_is_extension_supported"] = createExportWrapper("openmpt_is_extension_supported");

/** @type {function(...*):?} */
var _openmpt_log_func_default = Module["_openmpt_log_func_default"] = createExportWrapper("openmpt_log_func_default");

/** @type {function(...*):?} */
var _fflush = Module["_fflush"] = createExportWrapper("fflush");

/** @type {function(...*):?} */
var _openmpt_log_func_silent = Module["_openmpt_log_func_silent"] = createExportWrapper("openmpt_log_func_silent");

/** @type {function(...*):?} */
var _openmpt_error_is_transient = Module["_openmpt_error_is_transient"] = createExportWrapper("openmpt_error_is_transient");

/** @type {function(...*):?} */
var _openmpt_error_string = Module["_openmpt_error_string"] = createExportWrapper("openmpt_error_string");

/** @type {function(...*):?} */
var _openmpt_error_func_default = Module["_openmpt_error_func_default"] = createExportWrapper("openmpt_error_func_default");

/** @type {function(...*):?} */
var _openmpt_error_func_log = Module["_openmpt_error_func_log"] = createExportWrapper("openmpt_error_func_log");

/** @type {function(...*):?} */
var _openmpt_error_func_store = Module["_openmpt_error_func_store"] = createExportWrapper("openmpt_error_func_store");

/** @type {function(...*):?} */
var _openmpt_error_func_ignore = Module["_openmpt_error_func_ignore"] = createExportWrapper("openmpt_error_func_ignore");

/** @type {function(...*):?} */
var _openmpt_error_func_errno = Module["_openmpt_error_func_errno"] = createExportWrapper("openmpt_error_func_errno");

/** @type {function(...*):?} */
var _openmpt_error_func_errno_userdata = Module["_openmpt_error_func_errno_userdata"] = createExportWrapper("openmpt_error_func_errno_userdata");

/** @type {function(...*):?} */
var _openmpt_could_open_probability = Module["_openmpt_could_open_probability"] = createExportWrapper("openmpt_could_open_probability");

/** @type {function(...*):?} */
var _openmpt_could_open_probability2 = Module["_openmpt_could_open_probability2"] = createExportWrapper("openmpt_could_open_probability2");

/** @type {function(...*):?} */
var _openmpt_could_open_propability = Module["_openmpt_could_open_propability"] = createExportWrapper("openmpt_could_open_propability");

/** @type {function(...*):?} */
var _openmpt_probe_file_header_get_recommended_size = Module["_openmpt_probe_file_header_get_recommended_size"] = createExportWrapper("openmpt_probe_file_header_get_recommended_size");

/** @type {function(...*):?} */
var _openmpt_probe_file_header = Module["_openmpt_probe_file_header"] = createExportWrapper("openmpt_probe_file_header");

/** @type {function(...*):?} */
var _openmpt_probe_file_header_without_filesize = Module["_openmpt_probe_file_header_without_filesize"] = createExportWrapper("openmpt_probe_file_header_without_filesize");

/** @type {function(...*):?} */
var _openmpt_probe_file_header_from_stream = Module["_openmpt_probe_file_header_from_stream"] = createExportWrapper("openmpt_probe_file_header_from_stream");

/** @type {function(...*):?} */
var _openmpt_module_create = Module["_openmpt_module_create"] = createExportWrapper("openmpt_module_create");

/** @type {function(...*):?} */
var _openmpt_module_create_from_memory = Module["_openmpt_module_create_from_memory"] = createExportWrapper("openmpt_module_create_from_memory");

/** @type {function(...*):?} */
var _openmpt_module_create_from_memory2 = Module["_openmpt_module_create_from_memory2"] = createExportWrapper("openmpt_module_create_from_memory2");

/** @type {function(...*):?} */
var _openmpt_module_set_log_func = Module["_openmpt_module_set_log_func"] = createExportWrapper("openmpt_module_set_log_func");

/** @type {function(...*):?} */
var _openmpt_module_set_error_func = Module["_openmpt_module_set_error_func"] = createExportWrapper("openmpt_module_set_error_func");

/** @type {function(...*):?} */
var _openmpt_module_error_get_last = Module["_openmpt_module_error_get_last"] = createExportWrapper("openmpt_module_error_get_last");

/** @type {function(...*):?} */
var _openmpt_module_error_get_last_message = Module["_openmpt_module_error_get_last_message"] = createExportWrapper("openmpt_module_error_get_last_message");

/** @type {function(...*):?} */
var _openmpt_module_error_set_last = Module["_openmpt_module_error_set_last"] = createExportWrapper("openmpt_module_error_set_last");

/** @type {function(...*):?} */
var _openmpt_module_error_clear = Module["_openmpt_module_error_clear"] = createExportWrapper("openmpt_module_error_clear");

/** @type {function(...*):?} */
var _openmpt_module_select_subsong = Module["_openmpt_module_select_subsong"] = createExportWrapper("openmpt_module_select_subsong");

/** @type {function(...*):?} */
var _openmpt_module_get_selected_subsong = Module["_openmpt_module_get_selected_subsong"] = createExportWrapper("openmpt_module_get_selected_subsong");

/** @type {function(...*):?} */
var _openmpt_module_get_repeat_count = Module["_openmpt_module_get_repeat_count"] = createExportWrapper("openmpt_module_get_repeat_count");

/** @type {function(...*):?} */
var _openmpt_module_get_duration_seconds = Module["_openmpt_module_get_duration_seconds"] = createExportWrapper("openmpt_module_get_duration_seconds");

/** @type {function(...*):?} */
var _openmpt_module_set_position_seconds = Module["_openmpt_module_set_position_seconds"] = createExportWrapper("openmpt_module_set_position_seconds");

/** @type {function(...*):?} */
var _openmpt_module_get_position_seconds = Module["_openmpt_module_get_position_seconds"] = createExportWrapper("openmpt_module_get_position_seconds");

/** @type {function(...*):?} */
var _openmpt_module_get_render_param = Module["_openmpt_module_get_render_param"] = createExportWrapper("openmpt_module_get_render_param");

/** @type {function(...*):?} */
var _openmpt_module_set_render_param = Module["_openmpt_module_set_render_param"] = createExportWrapper("openmpt_module_set_render_param");

/** @type {function(...*):?} */
var _openmpt_module_read_stereo = Module["_openmpt_module_read_stereo"] = createExportWrapper("openmpt_module_read_stereo");

/** @type {function(...*):?} */
var _openmpt_module_read_quad = Module["_openmpt_module_read_quad"] = createExportWrapper("openmpt_module_read_quad");

/** @type {function(...*):?} */
var _openmpt_module_read_float_mono = Module["_openmpt_module_read_float_mono"] = createExportWrapper("openmpt_module_read_float_mono");

/** @type {function(...*):?} */
var _openmpt_module_read_float_stereo = Module["_openmpt_module_read_float_stereo"] = createExportWrapper("openmpt_module_read_float_stereo");

/** @type {function(...*):?} */
var _openmpt_module_read_float_quad = Module["_openmpt_module_read_float_quad"] = createExportWrapper("openmpt_module_read_float_quad");

/** @type {function(...*):?} */
var _openmpt_module_read_interleaved_stereo = Module["_openmpt_module_read_interleaved_stereo"] = createExportWrapper("openmpt_module_read_interleaved_stereo");

/** @type {function(...*):?} */
var _openmpt_module_read_interleaved_quad = Module["_openmpt_module_read_interleaved_quad"] = createExportWrapper("openmpt_module_read_interleaved_quad");

/** @type {function(...*):?} */
var _openmpt_module_read_interleaved_float_stereo = Module["_openmpt_module_read_interleaved_float_stereo"] = createExportWrapper("openmpt_module_read_interleaved_float_stereo");

/** @type {function(...*):?} */
var _openmpt_module_read_interleaved_float_quad = Module["_openmpt_module_read_interleaved_float_quad"] = createExportWrapper("openmpt_module_read_interleaved_float_quad");

/** @type {function(...*):?} */
var _openmpt_module_get_metadata_keys = Module["_openmpt_module_get_metadata_keys"] = createExportWrapper("openmpt_module_get_metadata_keys");

/** @type {function(...*):?} */
var _openmpt_module_get_metadata = Module["_openmpt_module_get_metadata"] = createExportWrapper("openmpt_module_get_metadata");

/** @type {function(...*):?} */
var _openmpt_module_get_current_estimated_bpm = Module["_openmpt_module_get_current_estimated_bpm"] = createExportWrapper("openmpt_module_get_current_estimated_bpm");

/** @type {function(...*):?} */
var _openmpt_module_get_current_speed = Module["_openmpt_module_get_current_speed"] = createExportWrapper("openmpt_module_get_current_speed");

/** @type {function(...*):?} */
var _openmpt_module_get_current_tempo = Module["_openmpt_module_get_current_tempo"] = createExportWrapper("openmpt_module_get_current_tempo");

/** @type {function(...*):?} */
var _openmpt_module_get_current_order = Module["_openmpt_module_get_current_order"] = createExportWrapper("openmpt_module_get_current_order");

/** @type {function(...*):?} */
var _openmpt_module_get_current_pattern = Module["_openmpt_module_get_current_pattern"] = createExportWrapper("openmpt_module_get_current_pattern");

/** @type {function(...*):?} */
var _openmpt_module_get_current_row = Module["_openmpt_module_get_current_row"] = createExportWrapper("openmpt_module_get_current_row");

/** @type {function(...*):?} */
var _openmpt_module_get_current_playing_channels = Module["_openmpt_module_get_current_playing_channels"] = createExportWrapper("openmpt_module_get_current_playing_channels");

/** @type {function(...*):?} */
var _openmpt_module_get_current_channel_vu_mono = Module["_openmpt_module_get_current_channel_vu_mono"] = createExportWrapper("openmpt_module_get_current_channel_vu_mono");

/** @type {function(...*):?} */
var _openmpt_module_get_current_channel_vu_left = Module["_openmpt_module_get_current_channel_vu_left"] = createExportWrapper("openmpt_module_get_current_channel_vu_left");

/** @type {function(...*):?} */
var _openmpt_module_get_current_channel_vu_right = Module["_openmpt_module_get_current_channel_vu_right"] = createExportWrapper("openmpt_module_get_current_channel_vu_right");

/** @type {function(...*):?} */
var _openmpt_module_get_current_channel_vu_rear_left = Module["_openmpt_module_get_current_channel_vu_rear_left"] = createExportWrapper("openmpt_module_get_current_channel_vu_rear_left");

/** @type {function(...*):?} */
var _openmpt_module_get_current_channel_vu_rear_right = Module["_openmpt_module_get_current_channel_vu_rear_right"] = createExportWrapper("openmpt_module_get_current_channel_vu_rear_right");

/** @type {function(...*):?} */
var _openmpt_module_get_num_subsongs = Module["_openmpt_module_get_num_subsongs"] = createExportWrapper("openmpt_module_get_num_subsongs");

/** @type {function(...*):?} */
var _openmpt_module_get_num_channels = Module["_openmpt_module_get_num_channels"] = createExportWrapper("openmpt_module_get_num_channels");

/** @type {function(...*):?} */
var _openmpt_module_get_num_orders = Module["_openmpt_module_get_num_orders"] = createExportWrapper("openmpt_module_get_num_orders");

/** @type {function(...*):?} */
var _openmpt_module_get_num_patterns = Module["_openmpt_module_get_num_patterns"] = createExportWrapper("openmpt_module_get_num_patterns");

/** @type {function(...*):?} */
var _openmpt_module_get_num_instruments = Module["_openmpt_module_get_num_instruments"] = createExportWrapper("openmpt_module_get_num_instruments");

/** @type {function(...*):?} */
var _openmpt_module_get_num_samples = Module["_openmpt_module_get_num_samples"] = createExportWrapper("openmpt_module_get_num_samples");

/** @type {function(...*):?} */
var _openmpt_module_get_subsong_name = Module["_openmpt_module_get_subsong_name"] = createExportWrapper("openmpt_module_get_subsong_name");

/** @type {function(...*):?} */
var _openmpt_module_get_channel_name = Module["_openmpt_module_get_channel_name"] = createExportWrapper("openmpt_module_get_channel_name");

/** @type {function(...*):?} */
var _openmpt_module_get_order_name = Module["_openmpt_module_get_order_name"] = createExportWrapper("openmpt_module_get_order_name");

/** @type {function(...*):?} */
var _openmpt_module_get_pattern_name = Module["_openmpt_module_get_pattern_name"] = createExportWrapper("openmpt_module_get_pattern_name");

/** @type {function(...*):?} */
var _openmpt_module_get_instrument_name = Module["_openmpt_module_get_instrument_name"] = createExportWrapper("openmpt_module_get_instrument_name");

/** @type {function(...*):?} */
var _openmpt_module_get_sample_name = Module["_openmpt_module_get_sample_name"] = createExportWrapper("openmpt_module_get_sample_name");

/** @type {function(...*):?} */
var _openmpt_module_get_order_pattern = Module["_openmpt_module_get_order_pattern"] = createExportWrapper("openmpt_module_get_order_pattern");

/** @type {function(...*):?} */
var _openmpt_module_get_pattern_num_rows = Module["_openmpt_module_get_pattern_num_rows"] = createExportWrapper("openmpt_module_get_pattern_num_rows");

/** @type {function(...*):?} */
var _openmpt_module_get_pattern_row_channel_command = Module["_openmpt_module_get_pattern_row_channel_command"] = createExportWrapper("openmpt_module_get_pattern_row_channel_command");

/** @type {function(...*):?} */
var _openmpt_module_format_pattern_row_channel_command = Module["_openmpt_module_format_pattern_row_channel_command"] = createExportWrapper("openmpt_module_format_pattern_row_channel_command");

/** @type {function(...*):?} */
var _openmpt_module_highlight_pattern_row_channel_command = Module["_openmpt_module_highlight_pattern_row_channel_command"] = createExportWrapper("openmpt_module_highlight_pattern_row_channel_command");

/** @type {function(...*):?} */
var _openmpt_module_format_pattern_row_channel = Module["_openmpt_module_format_pattern_row_channel"] = createExportWrapper("openmpt_module_format_pattern_row_channel");

/** @type {function(...*):?} */
var _openmpt_module_highlight_pattern_row_channel = Module["_openmpt_module_highlight_pattern_row_channel"] = createExportWrapper("openmpt_module_highlight_pattern_row_channel");

/** @type {function(...*):?} */
var _openmpt_module_get_ctls = Module["_openmpt_module_get_ctls"] = createExportWrapper("openmpt_module_get_ctls");

/** @type {function(...*):?} */
var _openmpt_module_ctl_get = Module["_openmpt_module_ctl_get"] = createExportWrapper("openmpt_module_ctl_get");

/** @type {function(...*):?} */
var _openmpt_module_ctl_get_boolean = Module["_openmpt_module_ctl_get_boolean"] = createExportWrapper("openmpt_module_ctl_get_boolean");

/** @type {function(...*):?} */
var _openmpt_module_ctl_get_integer = Module["_openmpt_module_ctl_get_integer"] = createExportWrapper("openmpt_module_ctl_get_integer");

/** @type {function(...*):?} */
var _openmpt_module_ctl_get_floatingpoint = Module["_openmpt_module_ctl_get_floatingpoint"] = createExportWrapper("openmpt_module_ctl_get_floatingpoint");

/** @type {function(...*):?} */
var _openmpt_module_ctl_get_text = Module["_openmpt_module_ctl_get_text"] = createExportWrapper("openmpt_module_ctl_get_text");

/** @type {function(...*):?} */
var _openmpt_module_ctl_set = Module["_openmpt_module_ctl_set"] = createExportWrapper("openmpt_module_ctl_set");

/** @type {function(...*):?} */
var _openmpt_module_ctl_set_boolean = Module["_openmpt_module_ctl_set_boolean"] = createExportWrapper("openmpt_module_ctl_set_boolean");

/** @type {function(...*):?} */
var _openmpt_module_ctl_set_integer = Module["_openmpt_module_ctl_set_integer"] = createExportWrapper("openmpt_module_ctl_set_integer");

/** @type {function(...*):?} */
var _openmpt_module_ctl_set_floatingpoint = Module["_openmpt_module_ctl_set_floatingpoint"] = createExportWrapper("openmpt_module_ctl_set_floatingpoint");

/** @type {function(...*):?} */
var _openmpt_module_ctl_set_text = Module["_openmpt_module_ctl_set_text"] = createExportWrapper("openmpt_module_ctl_set_text");

/** @type {function(...*):?} */
var _openmpt_module_ext_create = Module["_openmpt_module_ext_create"] = createExportWrapper("openmpt_module_ext_create");

/** @type {function(...*):?} */
var _openmpt_module_ext_create_from_memory = Module["_openmpt_module_ext_create_from_memory"] = createExportWrapper("openmpt_module_ext_create_from_memory");

/** @type {function(...*):?} */
var _openmpt_module_ext_destroy = Module["_openmpt_module_ext_destroy"] = createExportWrapper("openmpt_module_ext_destroy");

/** @type {function(...*):?} */
var _openmpt_module_ext_get_module = Module["_openmpt_module_ext_get_module"] = createExportWrapper("openmpt_module_ext_get_module");

/** @type {function(...*):?} */
var _openmpt_module_ext_get_interface = Module["_openmpt_module_ext_get_interface"] = createExportWrapper("openmpt_module_ext_get_interface");

/** @type {function(...*):?} */
var _main = Module["_main"] = createExportWrapper("main");

/** @type {function(...*):?} */
var _realloc = Module["_realloc"] = createExportWrapper("realloc");

/** @type {function(...*):?} */
var _strstr = Module["_strstr"] = createExportWrapper("strstr");

/** @type {function(...*):?} */
var _emscripten_GetProcAddress = Module["_emscripten_GetProcAddress"] = createExportWrapper("emscripten_GetProcAddress");

/** @type {function(...*):?} */
var __get_tzname = Module["__get_tzname"] = createExportWrapper("_get_tzname");

/** @type {function(...*):?} */
var __get_daylight = Module["__get_daylight"] = createExportWrapper("_get_daylight");

/** @type {function(...*):?} */
var __get_timezone = Module["__get_timezone"] = createExportWrapper("_get_timezone");

/** @type {function(...*):?} */
var _setThrew = Module["_setThrew"] = createExportWrapper("setThrew");

/** @type {function(...*):?} */
var stackSave = Module["stackSave"] = createExportWrapper("stackSave");

/** @type {function(...*):?} */
var stackRestore = Module["stackRestore"] = createExportWrapper("stackRestore");

/** @type {function(...*):?} */
var stackAlloc = Module["stackAlloc"] = createExportWrapper("stackAlloc");

/** @type {function(...*):?} */
var dynCall_vii = Module["dynCall_vii"] = createExportWrapper("dynCall_vii");

/** @type {function(...*):?} */
var dynCall_viii = Module["dynCall_viii"] = createExportWrapper("dynCall_viii");

/** @type {function(...*):?} */
var dynCall_viiii = Module["dynCall_viiii"] = createExportWrapper("dynCall_viiii");

/** @type {function(...*):?} */
var dynCall_ii = Module["dynCall_ii"] = createExportWrapper("dynCall_ii");

/** @type {function(...*):?} */
var dynCall_iii = Module["dynCall_iii"] = createExportWrapper("dynCall_iii");

/** @type {function(...*):?} */
var dynCall_iiii = Module["dynCall_iiii"] = createExportWrapper("dynCall_iiii");

/** @type {function(...*):?} */
var dynCall_iiiii = Module["dynCall_iiiii"] = createExportWrapper("dynCall_iiiii");

/** @type {function(...*):?} */
var ___set_stack_limit = Module["___set_stack_limit"] = createExportWrapper("__set_stack_limit");

/** @type {function(...*):?} */
var __growWasmMemory = Module["__growWasmMemory"] = createExportWrapper("__growWasmMemory");

/** @type {function(...*):?} */
var dynCall_vi = Module["dynCall_vi"] = createExportWrapper("dynCall_vi");

/** @type {function(...*):?} */
var dynCall_ji = Module["dynCall_ji"] = createExportWrapper("dynCall_ji");

/** @type {function(...*):?} */
var dynCall_iiji = Module["dynCall_iiji"] = createExportWrapper("dynCall_iiji");

/** @type {function(...*):?} */
var dynCall_iij = Module["dynCall_iij"] = createExportWrapper("dynCall_iij");

/** @type {function(...*):?} */
var dynCall_iiiidd = Module["dynCall_iiiidd"] = createExportWrapper("dynCall_iiiidd");

/** @type {function(...*):?} */
var dynCall_dii = Module["dynCall_dii"] = createExportWrapper("dynCall_dii");

/** @type {function(...*):?} */
var dynCall_iiid = Module["dynCall_iiid"] = createExportWrapper("dynCall_iiid");

/** @type {function(...*):?} */
var dynCall_di = Module["dynCall_di"] = createExportWrapper("dynCall_di");

/** @type {function(...*):?} */
var dynCall_iid = Module["dynCall_iid"] = createExportWrapper("dynCall_iid");

/** @type {function(...*):?} */
var dynCall_iidiii = Module["dynCall_iidiii"] = createExportWrapper("dynCall_iidiii");

/** @type {function(...*):?} */
var dynCall_v = Module["dynCall_v"] = createExportWrapper("dynCall_v");

/** @type {function(...*):?} */
var dynCall_viijii = Module["dynCall_viijii"] = createExportWrapper("dynCall_viijii");

/** @type {function(...*):?} */
var dynCall_viif = Module["dynCall_viif"] = createExportWrapper("dynCall_viif");

/** @type {function(...*):?} */
var dynCall_fii = Module["dynCall_fii"] = createExportWrapper("dynCall_fii");

/** @type {function(...*):?} */
var dynCall_viiiii = Module["dynCall_viiiii"] = createExportWrapper("dynCall_viiiii");

/** @type {function(...*):?} */
var dynCall_fi = Module["dynCall_fi"] = createExportWrapper("dynCall_fi");

/** @type {function(...*):?} */
var dynCall_vid = Module["dynCall_vid"] = createExportWrapper("dynCall_vid");

/** @type {function(...*):?} */
var dynCall_viid = Module["dynCall_viid"] = createExportWrapper("dynCall_viid");

/** @type {function(...*):?} */
var dynCall_iiff = Module["dynCall_iiff"] = createExportWrapper("dynCall_iiff");

/** @type {function(...*):?} */
var dynCall_viiiiiii = Module["dynCall_viiiiiii"] = createExportWrapper("dynCall_viiiiiii");

/** @type {function(...*):?} */
var dynCall_vif = Module["dynCall_vif"] = createExportWrapper("dynCall_vif");

/** @type {function(...*):?} */
var dynCall_iiiffi = Module["dynCall_iiiffi"] = createExportWrapper("dynCall_iiiffi");

/** @type {function(...*):?} */
var dynCall_iiifffif = Module["dynCall_iiifffif"] = createExportWrapper("dynCall_iiifffif");

/** @type {function(...*):?} */
var dynCall_iiffff = Module["dynCall_iiffff"] = createExportWrapper("dynCall_iiffff");

/** @type {function(...*):?} */
var dynCall_viiiiji = Module["dynCall_viiiiji"] = createExportWrapper("dynCall_viiiiji");

/** @type {function(...*):?} */
var dynCall_viiiji = Module["dynCall_viiiji"] = createExportWrapper("dynCall_viiiji");

/** @type {function(...*):?} */
var dynCall_viiiiiiji = Module["dynCall_viiiiiiji"] = createExportWrapper("dynCall_viiiiiiji");

/** @type {function(...*):?} */
var dynCall_viiiijiiii = Module["dynCall_viiiijiiii"] = createExportWrapper("dynCall_viiiijiiii");

/** @type {function(...*):?} */
var dynCall_viiiiii = Module["dynCall_viiiiii"] = createExportWrapper("dynCall_viiiiii");

/** @type {function(...*):?} */
var dynCall_iiiiii = Module["dynCall_iiiiii"] = createExportWrapper("dynCall_iiiiii");

/** @type {function(...*):?} */
var dynCall_viff = Module["dynCall_viff"] = createExportWrapper("dynCall_viff");

/** @type {function(...*):?} */
var dynCall_fiiiii = Module["dynCall_fiiiii"] = createExportWrapper("dynCall_fiiiii");

/** @type {function(...*):?} */
var dynCall_iiiiiiiii = Module["dynCall_iiiiiiiii"] = createExportWrapper("dynCall_iiiiiiiii");

/** @type {function(...*):?} */
var dynCall_jiji = Module["dynCall_jiji"] = createExportWrapper("dynCall_jiji");

/** @type {function(...*):?} */
var dynCall_iiiiiiiiii = Module["dynCall_iiiiiiiiii"] = createExportWrapper("dynCall_iiiiiiiiii");

/** @type {function(...*):?} */
var dynCall_iiiiiidii = Module["dynCall_iiiiiidii"] = createExportWrapper("dynCall_iiiiiidii");

/** @type {function(...*):?} */
var dynCall_viiiiiiiiiii = Module["dynCall_viiiiiiiiiii"] = createExportWrapper("dynCall_viiiiiiiiiii");

/** @type {function(...*):?} */
var dynCall_iiiiiiii = Module["dynCall_iiiiiiii"] = createExportWrapper("dynCall_iiiiiiii");

/** @type {function(...*):?} */
var dynCall_i = Module["dynCall_i"] = createExportWrapper("dynCall_i");

/** @type {function(...*):?} */
var dynCall_iiiiiii = Module["dynCall_iiiiiii"] = createExportWrapper("dynCall_iiiiiii");

/** @type {function(...*):?} */
var dynCall_iidiiii = Module["dynCall_iidiiii"] = createExportWrapper("dynCall_iidiiii");

/** @type {function(...*):?} */
var dynCall_iiiiij = Module["dynCall_iiiiij"] = createExportWrapper("dynCall_iiiiij");

/** @type {function(...*):?} */
var dynCall_iiiiid = Module["dynCall_iiiiid"] = createExportWrapper("dynCall_iiiiid");

/** @type {function(...*):?} */
var dynCall_iiiiijj = Module["dynCall_iiiiijj"] = createExportWrapper("dynCall_iiiiijj");

/** @type {function(...*):?} */
var dynCall_iiiiiijj = Module["dynCall_iiiiiijj"] = createExportWrapper("dynCall_iiiiiijj");

/** @type {function(...*):?} */
var dynCall_vffff = Module["dynCall_vffff"] = createExportWrapper("dynCall_vffff");

/** @type {function(...*):?} */
var dynCall_vf = Module["dynCall_vf"] = createExportWrapper("dynCall_vf");

/** @type {function(...*):?} */
var dynCall_viiiiiiii = Module["dynCall_viiiiiiii"] = createExportWrapper("dynCall_viiiiiiii");

/** @type {function(...*):?} */
var dynCall_viiiiiiiii = Module["dynCall_viiiiiiiii"] = createExportWrapper("dynCall_viiiiiiiii");

/** @type {function(...*):?} */
var dynCall_vff = Module["dynCall_vff"] = createExportWrapper("dynCall_vff");

/** @type {function(...*):?} */
var dynCall_vfi = Module["dynCall_vfi"] = createExportWrapper("dynCall_vfi");

/** @type {function(...*):?} */
var dynCall_vifff = Module["dynCall_vifff"] = createExportWrapper("dynCall_vifff");

/** @type {function(...*):?} */
var dynCall_viffff = Module["dynCall_viffff"] = createExportWrapper("dynCall_viffff");

/** @type {function(...*):?} */
var dynCall_vfff = Module["dynCall_vfff"] = createExportWrapper("dynCall_vfff");

/** @type {function(...*):?} */
var dynCall_vddd = Module["dynCall_vddd"] = createExportWrapper("dynCall_vddd");

/** @type {function(...*):?} */
var dynCall_vdddd = Module["dynCall_vdddd"] = createExportWrapper("dynCall_vdddd");

/** @type {function(...*):?} */
var dynCall_vdddddd = Module["dynCall_vdddddd"] = createExportWrapper("dynCall_vdddddd");


function invoke_ii(index,a1) {
  var sp = stackSave();
  try {
    return dynCall_ii(index,a1);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_iii(index,a1,a2) {
  var sp = stackSave();
  try {
    return dynCall_iii(index,a1,a2);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_vii(index,a1,a2) {
  var sp = stackSave();
  try {
    dynCall_vii(index,a1,a2);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiii(index,a1,a2,a3,a4) {
  var sp = stackSave();
  try {
    return dynCall_iiiii(index,a1,a2,a3,a4);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiii(index,a1,a2,a3) {
  var sp = stackSave();
  try {
    return dynCall_iiii(index,a1,a2,a3);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiii(index,a1,a2,a3,a4) {
  var sp = stackSave();
  try {
    dynCall_viiii(index,a1,a2,a3,a4);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}

function invoke_viii(index,a1,a2,a3) {
  var sp = stackSave();
  try {
    dynCall_viii(index,a1,a2,a3);
  } catch(e) {
    stackRestore(sp);
    if (e !== e+0 && e !== 'longjmp') throw e;
    _setThrew(1, 0);
  }
}




// === Auto-generated postamble setup entry stuff ===


if (!Object.getOwnPropertyDescriptor(Module, "intArrayFromString")) Module["intArrayFromString"] = function() { abort("'intArrayFromString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "intArrayToString")) Module["intArrayToString"] = function() { abort("'intArrayToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "ccall")) Module["ccall"] = function() { abort("'ccall' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "cwrap")) Module["cwrap"] = function() { abort("'cwrap' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "setValue")) Module["setValue"] = function() { abort("'setValue' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "getValue")) Module["getValue"] = function() { abort("'getValue' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "allocate")) Module["allocate"] = function() { abort("'allocate' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
Module["getMemory"] = getMemory;
if (!Object.getOwnPropertyDescriptor(Module, "UTF8ArrayToString")) Module["UTF8ArrayToString"] = function() { abort("'UTF8ArrayToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "UTF8ToString")) Module["UTF8ToString"] = function() { abort("'UTF8ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "stringToUTF8Array")) Module["stringToUTF8Array"] = function() { abort("'stringToUTF8Array' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "stringToUTF8")) Module["stringToUTF8"] = function() { abort("'stringToUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "lengthBytesUTF8")) Module["lengthBytesUTF8"] = function() { abort("'lengthBytesUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "stackTrace")) Module["stackTrace"] = function() { abort("'stackTrace' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "addOnPreRun")) Module["addOnPreRun"] = function() { abort("'addOnPreRun' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "addOnInit")) Module["addOnInit"] = function() { abort("'addOnInit' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "addOnPreMain")) Module["addOnPreMain"] = function() { abort("'addOnPreMain' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "addOnExit")) Module["addOnExit"] = function() { abort("'addOnExit' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "addOnPostRun")) Module["addOnPostRun"] = function() { abort("'addOnPostRun' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "writeStringToMemory")) Module["writeStringToMemory"] = function() { abort("'writeStringToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "writeArrayToMemory")) Module["writeArrayToMemory"] = function() { abort("'writeArrayToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "writeAsciiToMemory")) Module["writeAsciiToMemory"] = function() { abort("'writeAsciiToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
Module["addRunDependency"] = addRunDependency;
Module["removeRunDependency"] = removeRunDependency;
Module["FS_createFolder"] = FS.createFolder;
Module["FS_createPath"] = FS.createPath;
Module["FS_createDataFile"] = FS.createDataFile;
Module["FS_createPreloadedFile"] = FS.createPreloadedFile;
Module["FS_createLazyFile"] = FS.createLazyFile;
Module["FS_createLink"] = FS.createLink;
Module["FS_createDevice"] = FS.createDevice;
Module["FS_unlink"] = FS.unlink;
if (!Object.getOwnPropertyDescriptor(Module, "dynamicAlloc")) Module["dynamicAlloc"] = function() { abort("'dynamicAlloc' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "loadDynamicLibrary")) Module["loadDynamicLibrary"] = function() { abort("'loadDynamicLibrary' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "loadWebAssemblyModule")) Module["loadWebAssemblyModule"] = function() { abort("'loadWebAssemblyModule' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "getLEB")) Module["getLEB"] = function() { abort("'getLEB' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "getFunctionTables")) Module["getFunctionTables"] = function() { abort("'getFunctionTables' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "alignFunctionTables")) Module["alignFunctionTables"] = function() { abort("'alignFunctionTables' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "registerFunctions")) Module["registerFunctions"] = function() { abort("'registerFunctions' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "addFunction")) Module["addFunction"] = function() { abort("'addFunction' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "removeFunction")) Module["removeFunction"] = function() { abort("'removeFunction' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "getFuncWrapper")) Module["getFuncWrapper"] = function() { abort("'getFuncWrapper' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "prettyPrint")) Module["prettyPrint"] = function() { abort("'prettyPrint' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "makeBigInt")) Module["makeBigInt"] = function() { abort("'makeBigInt' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "dynCall")) Module["dynCall"] = function() { abort("'dynCall' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "getCompilerSetting")) Module["getCompilerSetting"] = function() { abort("'getCompilerSetting' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "print")) Module["print"] = function() { abort("'print' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "printErr")) Module["printErr"] = function() { abort("'printErr' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "getTempRet0")) Module["getTempRet0"] = function() { abort("'getTempRet0' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "setTempRet0")) Module["setTempRet0"] = function() { abort("'setTempRet0' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "callMain")) Module["callMain"] = function() { abort("'callMain' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "abort")) Module["abort"] = function() { abort("'abort' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "stringToNewUTF8")) Module["stringToNewUTF8"] = function() { abort("'stringToNewUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "emscripten_realloc_buffer")) Module["emscripten_realloc_buffer"] = function() { abort("'emscripten_realloc_buffer' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "ENV")) Module["ENV"] = function() { abort("'ENV' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "ERRNO_CODES")) Module["ERRNO_CODES"] = function() { abort("'ERRNO_CODES' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "ERRNO_MESSAGES")) Module["ERRNO_MESSAGES"] = function() { abort("'ERRNO_MESSAGES' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "setErrNo")) Module["setErrNo"] = function() { abort("'setErrNo' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "DNS")) Module["DNS"] = function() { abort("'DNS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "GAI_ERRNO_MESSAGES")) Module["GAI_ERRNO_MESSAGES"] = function() { abort("'GAI_ERRNO_MESSAGES' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "Protocols")) Module["Protocols"] = function() { abort("'Protocols' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "Sockets")) Module["Sockets"] = function() { abort("'Sockets' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "traverseStack")) Module["traverseStack"] = function() { abort("'traverseStack' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "UNWIND_CACHE")) Module["UNWIND_CACHE"] = function() { abort("'UNWIND_CACHE' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "withBuiltinMalloc")) Module["withBuiltinMalloc"] = function() { abort("'withBuiltinMalloc' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "readAsmConstArgsArray")) Module["readAsmConstArgsArray"] = function() { abort("'readAsmConstArgsArray' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "readAsmConstArgs")) Module["readAsmConstArgs"] = function() { abort("'readAsmConstArgs' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "jstoi_q")) Module["jstoi_q"] = function() { abort("'jstoi_q' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "jstoi_s")) Module["jstoi_s"] = function() { abort("'jstoi_s' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "getExecutableName")) Module["getExecutableName"] = function() { abort("'getExecutableName' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "listenOnce")) Module["listenOnce"] = function() { abort("'listenOnce' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "autoResumeAudioContext")) Module["autoResumeAudioContext"] = function() { abort("'autoResumeAudioContext' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "abortStackOverflow")) Module["abortStackOverflow"] = function() { abort("'abortStackOverflow' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "reallyNegative")) Module["reallyNegative"] = function() { abort("'reallyNegative' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "formatString")) Module["formatString"] = function() { abort("'formatString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "PATH")) Module["PATH"] = function() { abort("'PATH' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "PATH_FS")) Module["PATH_FS"] = function() { abort("'PATH_FS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "SYSCALLS")) Module["SYSCALLS"] = function() { abort("'SYSCALLS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "syscallMmap2")) Module["syscallMmap2"] = function() { abort("'syscallMmap2' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "syscallMunmap")) Module["syscallMunmap"] = function() { abort("'syscallMunmap' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "JSEvents")) Module["JSEvents"] = function() { abort("'JSEvents' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "specialHTMLTargets")) Module["specialHTMLTargets"] = function() { abort("'specialHTMLTargets' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "maybeCStringToJsString")) Module["maybeCStringToJsString"] = function() { abort("'maybeCStringToJsString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "findEventTarget")) Module["findEventTarget"] = function() { abort("'findEventTarget' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "findCanvasEventTarget")) Module["findCanvasEventTarget"] = function() { abort("'findCanvasEventTarget' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "polyfillSetImmediate")) Module["polyfillSetImmediate"] = function() { abort("'polyfillSetImmediate' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "demangle")) Module["demangle"] = function() { abort("'demangle' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "demangleAll")) Module["demangleAll"] = function() { abort("'demangleAll' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "jsStackTrace")) Module["jsStackTrace"] = function() { abort("'jsStackTrace' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "stackTrace")) Module["stackTrace"] = function() { abort("'stackTrace' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "getEnvStrings")) Module["getEnvStrings"] = function() { abort("'getEnvStrings' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "checkWasiClock")) Module["checkWasiClock"] = function() { abort("'checkWasiClock' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "writeI53ToI64")) Module["writeI53ToI64"] = function() { abort("'writeI53ToI64' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "writeI53ToI64Clamped")) Module["writeI53ToI64Clamped"] = function() { abort("'writeI53ToI64Clamped' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "writeI53ToI64Signaling")) Module["writeI53ToI64Signaling"] = function() { abort("'writeI53ToI64Signaling' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "writeI53ToU64Clamped")) Module["writeI53ToU64Clamped"] = function() { abort("'writeI53ToU64Clamped' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "writeI53ToU64Signaling")) Module["writeI53ToU64Signaling"] = function() { abort("'writeI53ToU64Signaling' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "readI53FromI64")) Module["readI53FromI64"] = function() { abort("'readI53FromI64' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "readI53FromU64")) Module["readI53FromU64"] = function() { abort("'readI53FromU64' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "convertI32PairToI53")) Module["convertI32PairToI53"] = function() { abort("'convertI32PairToI53' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "convertU32PairToI53")) Module["convertU32PairToI53"] = function() { abort("'convertU32PairToI53' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "exceptionLast")) Module["exceptionLast"] = function() { abort("'exceptionLast' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "exceptionCaught")) Module["exceptionCaught"] = function() { abort("'exceptionCaught' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "exceptionInfos")) Module["exceptionInfos"] = function() { abort("'exceptionInfos' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "exception_deAdjust")) Module["exception_deAdjust"] = function() { abort("'exception_deAdjust' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "exception_addRef")) Module["exception_addRef"] = function() { abort("'exception_addRef' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "exception_decRef")) Module["exception_decRef"] = function() { abort("'exception_decRef' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "Browser")) Module["Browser"] = function() { abort("'Browser' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "FS")) Module["FS"] = function() { abort("'FS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "MEMFS")) Module["MEMFS"] = function() { abort("'MEMFS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "TTY")) Module["TTY"] = function() { abort("'TTY' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "PIPEFS")) Module["PIPEFS"] = function() { abort("'PIPEFS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "SOCKFS")) Module["SOCKFS"] = function() { abort("'SOCKFS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "tempFixedLengthArray")) Module["tempFixedLengthArray"] = function() { abort("'tempFixedLengthArray' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "miniTempWebGLFloatBuffers")) Module["miniTempWebGLFloatBuffers"] = function() { abort("'miniTempWebGLFloatBuffers' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "heapObjectForWebGLType")) Module["heapObjectForWebGLType"] = function() { abort("'heapObjectForWebGLType' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "heapAccessShiftForWebGLHeap")) Module["heapAccessShiftForWebGLHeap"] = function() { abort("'heapAccessShiftForWebGLHeap' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "GL")) Module["GL"] = function() { abort("'GL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "emscriptenWebGLGet")) Module["emscriptenWebGLGet"] = function() { abort("'emscriptenWebGLGet' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "computeUnpackAlignedImageSize")) Module["computeUnpackAlignedImageSize"] = function() { abort("'computeUnpackAlignedImageSize' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "emscriptenWebGLGetTexPixelData")) Module["emscriptenWebGLGetTexPixelData"] = function() { abort("'emscriptenWebGLGetTexPixelData' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "emscriptenWebGLGetUniform")) Module["emscriptenWebGLGetUniform"] = function() { abort("'emscriptenWebGLGetUniform' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "emscriptenWebGLGetVertexAttrib")) Module["emscriptenWebGLGetVertexAttrib"] = function() { abort("'emscriptenWebGLGetVertexAttrib' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "writeGLArray")) Module["writeGLArray"] = function() { abort("'writeGLArray' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "AL")) Module["AL"] = function() { abort("'AL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "SDL_unicode")) Module["SDL_unicode"] = function() { abort("'SDL_unicode' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "SDL_ttfContext")) Module["SDL_ttfContext"] = function() { abort("'SDL_ttfContext' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "SDL_audio")) Module["SDL_audio"] = function() { abort("'SDL_audio' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "SDL")) Module["SDL"] = function() { abort("'SDL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "SDL_gfx")) Module["SDL_gfx"] = function() { abort("'SDL_gfx' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "GLUT")) Module["GLUT"] = function() { abort("'GLUT' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "EGL")) Module["EGL"] = function() { abort("'EGL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "GLFW_Window")) Module["GLFW_Window"] = function() { abort("'GLFW_Window' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "GLFW")) Module["GLFW"] = function() { abort("'GLFW' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "GLEW")) Module["GLEW"] = function() { abort("'GLEW' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "IDBStore")) Module["IDBStore"] = function() { abort("'IDBStore' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "runAndAbortIfError")) Module["runAndAbortIfError"] = function() { abort("'runAndAbortIfError' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "Fetch")) Module["Fetch"] = function() { abort("'Fetch' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "__emscripten_fetch_delete_cached_data")) Module["__emscripten_fetch_delete_cached_data"] = function() { abort("'__emscripten_fetch_delete_cached_data' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "__emscripten_fetch_load_cached_data")) Module["__emscripten_fetch_load_cached_data"] = function() { abort("'__emscripten_fetch_load_cached_data' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "__emscripten_fetch_cache_data")) Module["__emscripten_fetch_cache_data"] = function() { abort("'__emscripten_fetch_cache_data' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "__emscripten_fetch_xhr")) Module["__emscripten_fetch_xhr"] = function() { abort("'__emscripten_fetch_xhr' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "IDBFS")) Module["IDBFS"] = function() { abort("'IDBFS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "GLEmulation")) Module["GLEmulation"] = function() { abort("'GLEmulation' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "GLImmediate")) Module["GLImmediate"] = function() { abort("'GLImmediate' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "GLImmediateSetup")) Module["GLImmediateSetup"] = function() { abort("'GLImmediateSetup' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "warnOnce")) Module["warnOnce"] = function() { abort("'warnOnce' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "stackSave")) Module["stackSave"] = function() { abort("'stackSave' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "stackRestore")) Module["stackRestore"] = function() { abort("'stackRestore' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "stackAlloc")) Module["stackAlloc"] = function() { abort("'stackAlloc' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "AsciiToString")) Module["AsciiToString"] = function() { abort("'AsciiToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "stringToAscii")) Module["stringToAscii"] = function() { abort("'stringToAscii' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "UTF16ToString")) Module["UTF16ToString"] = function() { abort("'UTF16ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "stringToUTF16")) Module["stringToUTF16"] = function() { abort("'stringToUTF16' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "lengthBytesUTF16")) Module["lengthBytesUTF16"] = function() { abort("'lengthBytesUTF16' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "UTF32ToString")) Module["UTF32ToString"] = function() { abort("'UTF32ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "stringToUTF32")) Module["stringToUTF32"] = function() { abort("'stringToUTF32' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "lengthBytesUTF32")) Module["lengthBytesUTF32"] = function() { abort("'lengthBytesUTF32' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "allocateUTF8")) Module["allocateUTF8"] = function() { abort("'allocateUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "allocateUTF8OnStack")) Module["allocateUTF8OnStack"] = function() { abort("'allocateUTF8OnStack' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
Module["writeStackCookie"] = writeStackCookie;
Module["checkStackCookie"] = checkStackCookie;if (!Object.getOwnPropertyDescriptor(Module, "ALLOC_NORMAL")) Object.defineProperty(Module, "ALLOC_NORMAL", { configurable: true, get: function() { abort("'ALLOC_NORMAL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") } });
if (!Object.getOwnPropertyDescriptor(Module, "ALLOC_STACK")) Object.defineProperty(Module, "ALLOC_STACK", { configurable: true, get: function() { abort("'ALLOC_STACK' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") } });
if (!Object.getOwnPropertyDescriptor(Module, "ALLOC_DYNAMIC")) Object.defineProperty(Module, "ALLOC_DYNAMIC", { configurable: true, get: function() { abort("'ALLOC_DYNAMIC' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") } });
if (!Object.getOwnPropertyDescriptor(Module, "ALLOC_NONE")) Object.defineProperty(Module, "ALLOC_NONE", { configurable: true, get: function() { abort("'ALLOC_NONE' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") } });



var calledRun;

/**
 * @constructor
 * @this {ExitStatus}
 */
function ExitStatus(status) {
  this.name = "ExitStatus";
  this.message = "Program terminated with exit(" + status + ")";
  this.status = status;
}

var calledMain = false;


dependenciesFulfilled = function runCaller() {
  // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
  if (!calledRun) run();
  if (!calledRun) dependenciesFulfilled = runCaller; // try this again later, after new deps are fulfilled
};

function callMain(args) {
  assert(runDependencies == 0, 'cannot call main when async dependencies remain! (listen on Module["onRuntimeInitialized"])');
  assert(__ATPRERUN__.length == 0, 'cannot call main when preRun functions remain to be called');

  var entryFunction = Module['_main'];


  args = args || [];

  var argc = args.length+1;
  var argv = stackAlloc((argc + 1) * 4);
  HEAP32[argv >> 2] = allocateUTF8OnStack(thisProgram);
  for (var i = 1; i < argc; i++) {
    HEAP32[(argv >> 2) + i] = allocateUTF8OnStack(args[i - 1]);
  }
  HEAP32[(argv >> 2) + argc] = 0;

  try {

    Module['___set_stack_limit'](STACK_MAX);

    var ret = entryFunction(argc, argv);


    // In PROXY_TO_PTHREAD builds, we should never exit the runtime below, as execution is asynchronously handed
    // off to a pthread.
    // if we're not running an evented main loop, it's time to exit
      exit(ret, /* implicit = */ true);
  }
  catch(e) {
    if (e instanceof ExitStatus) {
      // exit() throws this once it's done to make sure execution
      // has been stopped completely
      return;
    } else if (e == 'unwind') {
      // running an evented main loop, don't immediately exit
      noExitRuntime = true;
      return;
    } else {
      var toLog = e;
      if (e && typeof e === 'object' && e.stack) {
        toLog = [e, e.stack];
      }
      err('exception thrown: ' + toLog);
      quit_(1, e);
    }
  } finally {
    calledMain = true;
  }
}




/** @type {function(Array=)} */
function run(args) {
  args = args || arguments_;

  if (runDependencies > 0) {
    return;
  }

  writeStackCookie();

  preRun();

  if (runDependencies > 0) return; // a preRun added a dependency, run will be called later

  function doRun() {
    // run may have just been called through dependencies being fulfilled just in this very frame,
    // or while the async setStatus time below was happening
    if (calledRun) return;
    calledRun = true;
    Module['calledRun'] = true;

    if (ABORT) return;

    initRuntime();

    preMain();

    if (Module['onRuntimeInitialized']) Module['onRuntimeInitialized']();

    if (shouldRunNow) callMain(args);

    postRun();
  }

  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(function() {
      setTimeout(function() {
        Module['setStatus']('');
      }, 1);
      doRun();
    }, 1);
  } else
  {
    doRun();
  }
  checkStackCookie();
}
Module['run'] = run;

function checkUnflushedContent() {
  // Compiler settings do not allow exiting the runtime, so flushing
  // the streams is not possible. but in ASSERTIONS mode we check
  // if there was something to flush, and if so tell the user they
  // should request that the runtime be exitable.
  // Normally we would not even include flush() at all, but in ASSERTIONS
  // builds we do so just for this check, and here we see if there is any
  // content to flush, that is, we check if there would have been
  // something a non-ASSERTIONS build would have not seen.
  // How we flush the streams depends on whether we are in SYSCALLS_REQUIRE_FILESYSTEM=0
  // mode (which has its own special function for this; otherwise, all
  // the code is inside libc)
  var print = out;
  var printErr = err;
  var has = false;
  out = err = function(x) {
    has = true;
  }
  try { // it doesn't matter if it fails
    var flush = Module['_fflush'];
    if (flush) flush(0);
    // also flush in the JS FS layer
    ['stdout', 'stderr'].forEach(function(name) {
      var info = FS.analyzePath('/dev/' + name);
      if (!info) return;
      var stream = info.object;
      var rdev = stream.rdev;
      var tty = TTY.ttys[rdev];
      if (tty && tty.output && tty.output.length) {
        has = true;
      }
    });
  } catch(e) {}
  out = print;
  err = printErr;
  if (has) {
    warnOnce('stdio streams had content in them that was not flushed. you should set EXIT_RUNTIME to 1 (see the FAQ), or make sure to emit a newline when you printf etc.');
  }
}

/** @param {boolean|number=} implicit */
function exit(status, implicit) {
  checkUnflushedContent();

  // if this is just main exit-ing implicitly, and the status is 0, then we
  // don't need to do anything here and can just leave. if the status is
  // non-zero, though, then we need to report it.
  // (we may have warned about this earlier, if a situation justifies doing so)
  if (implicit && noExitRuntime && status === 0) {
    return;
  }

  if (noExitRuntime) {
    // if exit() was called, we may warn the user if the runtime isn't actually being shut down
    if (!implicit) {
      var msg = 'program exited (with status: ' + status + '), but EXIT_RUNTIME is not set, so halting execution but not exiting the runtime or preventing further async execution (build with EXIT_RUNTIME=1, if you want a true shutdown)';
      err(msg);
    }
  } else {

    ABORT = true;
    EXITSTATUS = status;

    exitRuntime();

    if (Module['onExit']) Module['onExit'](status);
  }

  quit_(status, new ExitStatus(status));
}

if (Module['preInit']) {
  if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
  while (Module['preInit'].length > 0) {
    Module['preInit'].pop()();
  }
}

// shouldRunNow refers to calling main(), not run().
var shouldRunNow = true;

if (Module['noInitialRun']) shouldRunNow = false;


  noExitRuntime = true;

run();






// {{MODULE_ADDITIONS}}



