var objects={};var instances=[];function createObject(name,body){objects[name]=body;}
function createInstance(name,x,y,depth){var body=objects[name];var instance={name:name,x:x,y:y,depth:depth||0,init:body.init,loop:body.loop,};instances.push(instance);instances.sort(function(a,b){return b.depth-a.depth;});if(instance.init){instance.init();}
return instance;}
function destroyInstance(instance){instances.splice(instances.indexOf(instance),1);}
function forInstances(name,callback,self){var copy=instances.slice();for(var i=0;i<copy.length;i++){var instance=copy[i];if(instance.name===name){callback.call(self||{},instance);}}}
function clearInstances(){instances=[];}