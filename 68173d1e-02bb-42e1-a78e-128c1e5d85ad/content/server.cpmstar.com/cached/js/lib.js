(function () {
    var w = window;
    var d = w.document;
    var h = w.location.href.split('#')[0];
    var r = function (c, m) { c = c.split('').reduce(function (a, b) { return (a << 5) - a + b.charCodeAt(0) >>> m }, 0); return (10 + ((c * 7) % 26)).toString(36) + c.toString(36); }
    var x = "cpmstarx"; 
    var y = r(h, 1);
    var z = "cpmsx";
    
    var proto = (window.location.protocol == "https:") ? "https:" : "http:";

    var injectScript = function (url) {
        var s = d.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = url;
        var s2 = d.getElementsByTagName('script')[0];
        s2.parentNode.insertBefore(s, s2);
    }

    var renderImmediate = function (el, res) {
        if (el == null) return;
        if (res == null || res.creatives == null || res.creatives.length < 1) return;
        var cr0 = res.creatives[0];
        var width = cr0.width || ''; // FIXME - should be 0 outside of testing
        var height = cr0.height || ''; // FIXME - should be 0 outside of testing
        var iframe = d.createElement('iframe');
        iframe.style.borderWidth = 0;
        iframe.scrolling = 'no';
        iframe.marginwidth = 0;
        iframe.marginheight = 0;
        iframe.topmargin = 0;
        iframe.leftmargin = 0;
        iframe.allowtransparency = true;
        iframe.setAttribute('marginwidth', '0');
        iframe.setAttribute('marginheight', '0');
        iframe.setAttribute('topmargin', '0');
        iframe.setAttribute('leftmargin', '0');
        iframe.setAttribute('allowtransparency', 'true');
        iframe.width = 0;
        iframe.height = 0;
        el.appendChild(iframe);

        var renderHtml = '<head></head><body>' + cr0.code;
        if (cr0.px_cr) renderHtml += '\n<img width=0 height=0 src="' + cr0.px_cr + '" />';
        renderHtml += '</body>';

        iframe.width = width;
        iframe.height = height;
        var iframeDoc = iframe.contentWindow.document;
        iframeDoc.write(renderHtml);
        iframeDoc.close();
    };
    var renderDeferred = function (el, pid) {
        var rando = Math.floor(10 + Math.random() * 26).toString(36) + Math.floor(Math.random() * 99999999).toString(36);
        w[rando] = renderImmediate.bind(null, el);
        injectScript(proto + '//server.cpmstar.com/view.aspx?poolid=' + pid + '&json=c_m&callback=' + rando);
    };

    var loadZoneFile = function (zone) {
        try { var top_loc = w.top.location, top_href = top_loc.href, top_hash = top_loc.hash; } catch (err) {
            top_href = d.referrer;
            top_hash = (top_hash = top_href.match(/[\?\&]cpmstarhash=([^\&]*)/)) == null ? '' : '#' + top_hash[1];
        }
        var dev = top_hash == '#cpmstarDev';
        var staging = top_hash == '#cpmstarStaging';
        var hostPrefix = '';
        var zonefile = '';
        var version = Math.round(Math.random() * 999999);
        if (dev && zone.dev) {
            hostPrefix = '//dev.server.';
            zonefile = zone.zonefile;
        } else if (staging && zone.staging) {
            hostPrefix = '//staging.server.';
            zonefile = zone.zonefile;
        } else if (zone.prod) {
            hostPrefix = '//server.';
            zonefile = zone.zonefile;
            //hostPrefix = 'https://ssl.cdne.'; // FIXME - SSL vs NON-SSL
            //version = zone.version;
        }
        if (zonefile != '') {
            if (w[y].pending == null && w.cpmstarAPI == null) {
                w[y].pending = true;
                injectScript(proto + hostPrefix + 'cpmstar.com/cached/zonefiles/' + zonefile + '.js?v=' + version);
            }
        }
        return zonefile;
    }

    var execCmdZone = function (zone, command) {
        var zonefile = loadZoneFile(zone);
        if (zonefile != '') {
            var cmd = (w[y].cmd = w[y].cmd || []);
            if (command) {
                cmd.push(command);
            }
        }
    }

    var execSyncTagInjectedZone = function (pid, zone, pindex) {
        var zonefile = loadZoneFile(zone);
        if (zonefile != '') {
            var c = r(h + pid, 0);
            var el = document.getElementsByClassName(c)[pindex];

            var cmd = (w[y].cmd = w[y].cmd || []);
            cmd.push({ kind: 'addplacementandgo', pid: pid, pindex: pindex, render: renderDeferred.bind(null, el, pid) });
        }
    }

    var findElement = function (pid, pindex) {
        var els = w[y].elements = w[y].elements || [];
		for (var i = 0; i < els.length; i++) {
			if (els[i].pid == pid && !els[i].used && (pindex == null || els[i].pindex == pindex)) return els[i];
		}
		return null;
    }
	var addElement = function (pid, pindex, el) {
		var elEntry = findElement(pid, pindex);
		if (elEntry) {
			for (var i = 0; i < 10; i++) {
				pindex = i; //modify pindex
				if (!findElement(pid, pindex)) break;
			}
		}
		if (elEntry && elEntry.el === el) {
			el = document.getElementsByClassName("div-" + pid)[pindex];					
			if (el === null) {
				var c = r(h + pid, 0);
				el = document.getElementsByClassName(c)[pindex];
			}
		}

		w[y].elements.push({ pid: pid, pindex: pindex, el: el, eid: el.id });

		return pindex;
    }

    var execPlacementTag = function (pid, zone, pindex, res) {
        var el = null;
        var elEntry = findElement(pid, pindex);
        if (elEntry) {
			el = elEntry.el;
			elEntry.used = true;
		}
		if (el == null) {
            var c = r(h + pid, 0);
            el = document.getElementsByClassName(c)[pindex];
		}



        var zonefile = loadZoneFile(zone);
        if (zonefile == '' && w.cpmstarAPI == null) {
            renderImmediate(el, res);
        } else {
            var cmd = (w[y].cmd = w[y].cmd || []);
            cmd.push({ kind: 'addplacementandgo', el: el, pid: pid, pindex: pindex, render: renderDeferred.bind(null, el, pid) });
        }
    }

    var execLibCmd = function (cmd) {
        switch (cmd.kind) {
            case 'synctagcb':
                execSyncTagInjectedZone(cmd.pid, cmd.zone, cmd.pindex);
                break;
            case 'asynctagfetch':
                if (cmd.el) {
                    cmd.pindex = addElement(cmd.pid, cmd.pindex, cmd.el);
                }
                injectScript(proto + '//server.cpmstar.com/view.aspx?poolid=' + cmd.pid + '&script=async&pindex=' + cmd.pindex);
                break;
            case 'asynctagcb':
                execPlacementTag(cmd.pid, cmd.zone, cmd.pindex, cmd.res);
                break;
            case 'zonecmd':
                execCmdZone({ dev: true, staging: true, prod: true, zonefile: cmd.zone }, cmd.cmd);
                break;
        }
    }

    var b = !!(w[z] || w[x] || w[y]);
    w[z] = w[x] = w[y] = w[z] || w[x] || w[y] || {};

    if (b) w[x].cmd = w[x].cmd || [];
    (w[y].libcmd = w[y].libcmd || []).push = execLibCmd;

    var cmd;
    while (cmd = w[y].libcmd.shift()) {
        execLibCmd(cmd);
    }
})();