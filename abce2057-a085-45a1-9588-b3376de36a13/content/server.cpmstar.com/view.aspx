
(function(w,pid,zone){
    var d=w.document,s2=d.getElementsByTagName('script')[0],s=d.createElement('script');s.async=true;s.src='//server.cpmstar.com/cached/js/lib.js';s2.parentNode.insertBefore(s, s2);
    var r=function(c,m){c=c.split('').reduce(function(a,b){return(a<<5)-a+b.charCodeAt(0)>>>m},0);return(10+((c*7)%26)).toString(36)+c.toString(36);},x='cpmsx',y=r(w.location.href.split('#')[0],1),c=r(w.location.href.split('#')[0]+pid,0);
    var pindex=d.getElementsByClassName(c).length;
    d.write('<div class="'+c+'"></div>');
    w[x]=w[y]=w[x]||w[y]||{};(w[y].libcmd=w[y].libcmd||[]).push({kind:'synctagcb',pid:pid,pindex:pindex,zone:zone});
})(window,71337,{zonefile:'118_40114_funhtml5games',dev:true,staging:false,prod:true});