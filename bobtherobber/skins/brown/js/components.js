var PlayToMaxPortal = {};

//-----------------------------------------------------------------------------
// Game model
//-----------------------------------------------------------------------------
(function(exports){
	
	var Game = function(jsonData)
	{
		for (var prop in jsonData)
		{
			this[prop] = jsonData[prop]
		}
	}
	
	exports.Game = Game;

})(PlayToMaxPortal);

//-----------------------------------------------------------------------------
// Image loader
//-----------------------------------------------------------------------------
(function(exports){
	
	var ImageLoader = function(params)
	{
		params = params || {};
		params.src = params.src || '';
		params.nodeStyle = params.nodeStyle || '';
		params.spinnerStyle = params.spinnerStyle || '';
		params.parent = params.parent || null;
		params.callback = params.callback || function(){};
		params.autoSize = params.autoSize == undefined ? true : !!params.autoSize;
		
		this.node = exports.ImageLoader.createDOM();
		if (params.nodeStyle) this.node.className = params.nodeStyle;
		if (params.parent) params.parent.appendChild(this.node);
		
		this.spinner = this.node.querySelector('spinner');
		if (params.spinnerStyle) 
		{
			this.spinner.className = params.spinnerStyle;
		}
		
		this.completed = false;
		this.loading = false;
		this.oncomplete = params.callback;
		
		this.src = params.src;
		this.autoSize = params.autoSize;
		
		this.load();
	}
	
	ImageLoader.createDOM = function()
	{
		var node = document.createElement('ImageLoader');
		node.innerHTML = '<spinner class="fa fa-gamepad fa-spin fa-2x"></spinner>';
		return node;
	}
	
	ImageLoader.prototype.load = function(src)
	{
		if (this.loading) return false;
		
		src = src || this.src;
		if (src == this.src && this.completed) return false;

		this.src = src;
		if (!this.src) return false;
		
		this.completed = false;
		this.loading = true;
		this.spinner.style.display = '';
		
		
		this.node.style.backgroundImage = '';
		var self = this;
		var fn = function()
		{
			self.node.style.backgroundImage = 'url("' + self.src + '")';
			self.loading = false;
			self.spinner.style.display = 'none';
			self.completed = true;
			self.oncomplete(self);
			
			if (self.autoSize)
			{
				self.node.style.width = img.width + 'px';
				self.node.style.height = img.height + 'px';
			}
		};
		
		var img = new Image();
		img.src = this.src;
		if (img.complete) fn.call(img);
		else
		{
			img.onload = fn;
			img.onerror = fn;
		}
	}

	exports.ImageLoader = ImageLoader;
	
})(PlayToMaxPortal);

//-----------------------------------------------------------------------------
// Tiles list
//-----------------------------------------------------------------------------
(function(exports){
	
	var ImageLoader = exports.ImageLoader;

	var GameTile = function(params)
	{
		var self = this;
		params = params || {};
		
		this.game = params.game;
		if (!this.game) throw new Error('Cannot create tile without game');
		
		params.nodeStyle = params.nodeStyle || '';
		params.caption = params.caption || this.game.title;
		params.subcaption = params.subcaption || '';
		params.src = params.src || this.game.thumbnail_url;
		params.href = params.href || this.game.details_url;
		
		params.action = params.action || null;
		params.parent = params.parent || null;
		params.callback = params.callback || function(){};

		this.onload = params.callback;
		
		this.node = GameTile.createDOM();
		if (params.nodeStyle) this.node.className = params.nodeStyle;
		
		if (params.parent) 
		{
			params.parent.appendChild(this.node);
		}
		
		this.image = new ImageLoader({ 
			autoSize: false,
			callback: function(){
				self.setCaption(params.caption);
				self.onload(self);
			},
		});
		var child = this.node.querySelector('ImageLoader');
		child.parentNode.replaceChild(this.image.node, child);

		this.setSrc(params.src);
		this.setHref(params.href);

		this.action = null;
		this.setAction(params.action);

		this.clickHandler = function(e)
		{
			
			if (typeof self.action == 'function')
			{
				if (false === self.action(self))
				{
					e.preventDefault();
					e.stopImmediatePropagation();
					return false;
				}
			}
			
		};
		
		this.node.querySelector('a').addEventListener('click', this.clickHandler);
	}
	
	GameTile.createDOM = function()
	{
		var node = document.createElement('GameTile');
		node.innerHTML = '<a><ImageLoader></ImageLoader><h2><span class="fa fa-spinner fa-spin"></span></h2></a>';
		return node;
	}
	
	GameTile.prototype.getCaption = function(){ return this.node.querySelector('h2').innerHTML; };
	GameTile.prototype.setCaption = function(val){ this.node.querySelector('h2').innerHTML = val; };
	
	GameTile.prototype.getSrc = function(){ return this.image.src; };
	GameTile.prototype.setSrc = function(val){ this.image.load(val); };
	
	GameTile.prototype.getHref = function(){ return this.node.querySelector('a').href; };
	GameTile.prototype.setHref = function(val){ this.node.querySelector('a').href = val; };
	
	GameTile.prototype.getAction = function(){ return this.action; };
	GameTile.prototype.setAction = function(val){ this.action = val; };
	
	GameTile.prototype.getMarker = function()
	{
		return this.node.getAttribute('marker') || '';
	}
	GameTile.prototype.setMarker = function(marker, color)
	{
		if (marker)
		{
			this.node.setAttribute('marker', marker);
			this.setMarkerColor(color);
		}
		else
		{
			if (this.node.hasAttribute('marker')) 
			{
				this.node.removeAttribute('marker');
			}
			this.setMarkerColor(null);
		}
	}
	GameTile.prototype.setMarkerColor = function(color)
	{
		var colors = [
			'marker-white','marker-yellow','marker-fuchsia','marker-red',
			'marker-silver','marker-gray','marker-olive','marker-purple',
			'marker-maroon','marker-aqua','marker-lime','marker-teal',
			'marker-green','marker-blue','marker-navy','marker-black'
		];
		var cls = this.node.className.replace(new RegExp(colors.join('\\s*|'), 'ig'), '').replace(new RegExp('^\\s+'), '');
		this.node.className = cls;
		if (color)
		{
			this.node.className += ' marker-' + color;
		}
	}

	var TilesList = function(params)
	{
		params = params || {};
		params.parent = params.parent || null;
		params.nodeStyle = params.nodeStyle || '';
		params.visibleItems = isNaN(params.visibleItems) ? 0 : Math.max(0, params.visibleItems);
		params.data = params.data || [];
		params.tileAction = params.tileAction || null;

		this.node = exports.TilesList.createDOM();
		if (params.nodeStyle) this.node.className = params.nodeStyle;
		if (params.parent) 
		{
			params.parent.appendChild(this.node);
		}
		
		this.loading = 0;
		this.complete = false;

		this.tileAction = params.tileAction;
		this.data = params.data;
		this.items = [];
		
		var len = Math.min(this.data.length, (params.visibleItems || this.data.length));
		for (var i = 0; i < len; i++)
		{
			this.addItem(this.data[i]);
		}
		
		if (params['callback']) this.oncomplete = params.callback;
	}
	
	TilesList.createDOM = function()
	{
		var node = document.createElement('TilesList');
		return node;
	}
	
	TilesList.prototype.addItem = function(game)
	{
		if (!game) return;
		
		var self = this;
		var item = new GameTile({
		    parent: this.node,
            game: game,
            action: this.tileAction,
		    callback: function(tile){
				self.loading--;
				if (self.loading < 1) 
				{
					self.complete = true;
					self.oncomplete(self);
				}
		    }
		});
		
		var marker = game.markers.shift();
		if (marker) item.setMarker(marker, 'white');
		if (marker == 'new') item.setMarker(marker, 'red');
		if (marker == 'best') item.setMarker(marker, 'green');
		
		this.items.push(item);
		
		this.loading++;
		this.complete = false;
		
		return item;
	}

	TilesList.prototype.showMoreGames = function(n, ignoreLoading)
	{
		if (typeof n == 'undefined') n = this.data.length - this.items.length;
		if (isNaN(n) || n < 1) return;
		if (this.data.length <= this.items.length) return; // all data visible
		
		if (!ignoreLoading && !this.complete) return;
		
		for (var i = this.items.length, end = Math.min((i + n), this.data.length); i < end; i++)
		{
			this.addItem(this.data[i]);
		}
	}
	
	TilesList.prototype.oncomplete = function()
	{
	}
	
	exports.TilesList = TilesList;
	
})(PlayToMaxPortal);

//-----------------------------------------------------------------------------
// Carousel
//-----------------------------------------------------------------------------
(function(exports){
	
	var ImageLoader = exports.ImageLoader;

	var CarouselItem = function(params)
	{
		var self = this;
		params = params || {};
		
		this.game = params.game;
		if (!this.game) throw new Error('Cannot create carousel item without game');
		
		params.nodeStyle = params.nodeStyle || '';
		params.src = params.src || this.game.icon_url;
		params.action = params.action || null;
		params.parent = params.parent || null;
		params.callback = params.callback || function(){};

		this.onload = params.callback;
		
		this.node = CarouselItem.createDOM();
		if (params.nodeStyle) this.node.className = params.nodeStyle;
		
		if (params.parent) 
		{
			params.parent.appendChild(this.node);
		}
		
		this.image = new ImageLoader({ 
			autoSize: false,
			callback: function(){
				self.onload(self);
			},
		});
		var child = this.node.querySelector('ImageLoader');
		child.parentNode.replaceChild(this.image.node, child);

		this.setSrc(params.src);

		this.action = null;
		this.setAction(params.action);

		this.clickHandler = function(e)
		{
			
			if (typeof self.action == 'function')
			{
				if (false === self.action(self))
				{
					e.preventDefault();
					e.stopImmediatePropagation();
					return false;
				}
			}
			
		};
		
		this.node.addEventListener('click', this.clickHandler);
	}
	
	CarouselItem.createDOM = function()
	{
		var node = document.createElement('CarouselItem');
		node.innerHTML = '<ImageLoader></ImageLoader>';
		return node;
	}
	
	CarouselItem.prototype.getSrc = function(){ return this.image.src; };
	CarouselItem.prototype.setSrc = function(val){ this.image.load(val); };
	
	CarouselItem.prototype.getAction = function(){ return this.action; };
	CarouselItem.prototype.setAction = function(val){ this.action = val; };
	
	var Carousel = function(params)
	{
		params = params || {};
		params.parent = params.parent || null;
		params.nodeStyle = params.nodeStyle || '';
		params.data = params.data || [];
		params.tileAction = params.tileAction || null;
		params.autoscroll = isNaN(params.autoscroll) ? 0 : Math.max(0, Math.round(params.autoscroll));

		this.node = exports.Carousel.createDOM();
		if (params.nodeStyle) this.node.className = params.nodeStyle;
		if (params.parent) 
		{
			params.parent.appendChild(this.node);
		}
		this.node.querySelector('panel').style.display = 'none';
		
		this.loading = 0;
		this.complete = false;

		this.tileAction = params.tileAction;
		this.data = params.data;
		this.items = [];
		
		this.scroll = null;
		this.autoscrollTO = null;
		this.autoscroll = params.autoscroll;
		this.currentGame = 0;
		
		if (this.data.length == 0) 
		{
			this.node.style.display = 'none';
		}
		else
		{
			for (var i = 0, len = this.data.length; i < len; i++)
			{
				this.addItem(this.data[i]);
			}
		}
		
		if (params.callback) this.oncomplete = params.callback;
	}

	Carousel.createDOM = function()
	{
		var node = document.createElement('Carousel');
		var html = '<wrapper><items></items></wrapper>';
		html += '<panel>';
		html += '<button class="previous"><span class="fa fa-angle-left"></span></button>';
		html += '<button class="next"><span class="fa fa-angle-right"></span></button>';
		html += '<h2></h2><h3></h3><dots></dots>';
		html += '</panel>';
		node.innerHTML = html;
		return node;
	}
	
	Carousel.prototype.addItem = function(game)
	{
		if (!game) return;
		
		this.node.querySelector('dots').appendChild(document.createElement('dot'));
		
		var self = this;
		var item = new CarouselItem({
		    parent: this.node.querySelector('items'),
            game: game,
            action: this.tileAction,
		    callback: function(tile){

				self.loading--;
				if (self.loading < 1) 
				{
					self.complete = true;
					self.contentLoaded(self);
					self.oncomplete(self);
				}

		    }
		});
		
		this.items.push(item);
		
		this.loading++;
		this.complete = false;
		
		return item;
	}

	Carousel.prototype.oncomplete = function(carousel){}
	
	Carousel.prototype.contentLoaded = function(carousel)
	{
		var self = this;
		if (this.data.length == 0)
		{
			this.node.querySelector('button.previous').style.display = 'none';
			this.node.querySelector('button.next').style.display = 'none';
			this.node.querySelector('dots').style.display = 'none';
		} 
		this.node.querySelector('panel').style.display = '';
		
		this.node.querySelector('button.previous').addEventListener('click', function(){
			var n = self.currentGame - 1;
			if (n < 0) n = self.data.length - 1;
			self.changeGame(n);
		});
		
		this.node.querySelector('button.next').addEventListener('click', function(){
			
			var n = self.currentGame + 1;
			if (n >= self.data.length) n = 0;
			self.changeGame(n);
			
		});
		
		this.onChangeGame(0);
		
		setTimeout(function(){
			
			var w = 0;
			for (var i = 0; i < self.items.length; i++)
			{
				w += self.items[i].node.offsetWidth;
				var dot = self.node.querySelector('dots > dot:nth-of-type('+(i+1)+')');
				dot.addEventListener('click', function(e){
					
					var nodes = e.currentTarget.parentNode.querySelectorAll('dot');
					for (var i = 0; i < nodes.length; i++)
					{
						if (nodes.item(i).isSameNode(e.currentTarget))
						{
							return self.changeGame(i);
						}
					}
					
				});
			}
			self.node.querySelector('wrapper > items').style.width = w + 'px';
			
			self.scroll = new IScroll(self.node.querySelector('wrapper'), {
				scrollX: true, scrollY: false,
				keyBindings: false, eventPassthrough: 'vertical',
				momentum: false, snap: 'CarouselItem', snapSpeed: 200,
				bounce: false,
			});
			
			self.scroll.on('scrollStart', function(){
				var nodes = self.node.querySelectorAll('CarouselItem');
				for (var i = 0, len = nodes.length; i < len; i++)
				{
					nodes.item(i).style.pointerEvents = 'none';
				}
				self.stopAutoScroll();
			});
			
			self.scroll.on('scrollEnd', function(){
				var nodes = self.node.querySelectorAll('CarouselItem');
				for (var i = 0, len = nodes.length; i < len; i++)
				{
					nodes.item(i).style.pointerEvents = '';
				}
				self.onChangeGame(self.scroll.currentPage.pageX);
				self.startAutoScroll(3000);
			});
		
			self.scroll.on('scrollCancel', function(){
				var nodes = self.node.querySelectorAll('CarouselItem');
				for (var i = 0, len = nodes.length; i < len; i++)
				{
					nodes.item(i).style.pointerEvents = '';
				}
				self.startAutoScroll(3000);
			});
			
			self.startAutoScroll(3000);
		});
	}

	Carousel.prototype.startAutoScroll = function(t)
	{
		this.stopAutoScroll();
		if (this.autoscroll <= 0) return false;
		
		var self = this;
		this.autoscrollTO = setTimeout(function(){
			
			var n = self.currentGame + 1;
			if (n >= self.data.length) n = 0;
			self.changeGame(n, 500);
			
		}, this.autoscroll);
	}

	Carousel.prototype.stopAutoScroll = function()
	{
		if (this.autoscrollTO) this.autoscrollTO = clearTimeout(this.autoscrollTO);
	}

	Carousel.prototype.onChangeGame = function(n)
	{
		this.currentGame = Math.max(0, Math.min(this.data.length-1, n || 0));
		var game = this.data[this.currentGame];
		
		this.node.querySelector('h2').innerHTML = game.title;
		this.node.querySelector('h3').innerHTML = game.categories.length ? game.categories[0] : '';
		
		var dots = this.node.querySelectorAll('dots > dot');
		for (var i = 0; i < dots.length; i++)
		{
			dots.item(i).className = (i == this.currentGame) ? 'current' : '';
		}
	}

	Carousel.prototype.changeGame = function(n, t)
	{
		if (!this.scroll) return;
		n = Math.max(0, Math.min(this.data.length-1, n || 0));
		t = Math.max(200, t*1);
		this.scroll.goToPage(n, 0, t, IScroll.utils.ease.circular);
		this.onChangeGame(n);
	}

	exports.Carousel = Carousel;
	
})(PlayToMaxPortal);
