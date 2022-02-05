Level=1;
failed = false;
finished = false;
pause = false;
isDriving = false;
skana = true;
up = false;
down = false;
right = false;
left = false;
mobile = false;
var again = false;
var gameTime = 10800;
var updateclock = 0;
var tryAgainScreen;
var levelScore = 0;
var levelStars = 0;
var totalScore = 0;
var levelScores = [0,0,0,0,0,0,0,0,0,0,0,0];
var targetScores = [1056,1100,1144,1182,1239,1288,1345,1460,1420,1515,1510,1270];
var achievement = [0,0,0,0,0,0,0,0,0,0,0,0];
var unlockedAchievement = -1;
var backgroundSound;
var idleSound;
var engineSound;
if(createjs.Touch.isSupported()) mobile = true;

var world;
var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2World = Box2D.Dynamics.b2World;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var debugDraw;
var bb = Box2D.Dynamics.b2Body;
var cart = Box2D.Dynamics.b2Body;
var cart2 = Box2D.Dynamics.b2Body;
var axle1 = Box2D.Dynamics.b2Body;
var axle2 = Box2D.Dynamics.b2Body;
var motor1 = Box2D.Dynamics.b2RevoluteJoint;
var motor2  = Box2D.Dynamics.b2RevoluteJoint;
var spring1 = Box2D.Dynamics.b2PrismaticJoint;
var spring2 = Box2D.Dynamics.b2PrismaticJoint;
var spring3 = Box2D.Dynamics.b2PrismaticJoint;
var debugPhysics = false;
var fons;
var box_original_size = 10;
var RATIO = 30;
var vRATIO = 40;
var SCREEN_WIDTH = 640;
var truckHealthFull;
var truckHealth;
var engineSpeed = 0;
var boxObjects;
var tPosition = new createjs.Point(150,278);
var truckFrame = 5;

// ---------------------------------------------------------------------------------------
function updateButtons() {

exportRoot.gmenu.buttons.lButtons.x = 0 -(stage.x / stage.scaleX);
exportRoot.gmenu.buttons.lButtons.y = 275 + (stage.y / stage.scaleY);
exportRoot.gmenu.buttons.rButtons.x = 635 +(stage.x / stage.scaleX);	
exportRoot.gmenu.buttons.rButtons.y = 280 + (stage.y / stage.scaleY);
exportRoot.gmenu.hWindow.x = 2 - (stage.x / stage.scaleX);

exportRoot.pButton.poga.pausePoga.x = 42 + (stage.x / stage.scaleX);
}

// ------------------------------------------------------------------------------------
function startGame() {	

if (backgroundSound) backgroundSound.stop();
if (idleSound) idleSound.stop();
if (engineSound) engineSound.stop();
	setTimeout(stopit,100);
	function stopit(){
backgroundSound = createjs.Sound.play("fonamuzons",{interrupt: createjs.Sound.INTERRUPT_EARLY, loop:-1});
idleSound = createjs.Sound.play("idle",{interrupt: createjs.Sound.INTERRUPT_EARLY, loop:-1});
engineSound = createjs.Sound.play("engine",{interrupt: createjs.Sound.INTERRUPT_EARLY, loop:-1});	
engineSound.volume = 0;
backgroundSound.volume = 0.4;//0.8		
}

pause = true;

var fade = new lib.fadeout();
exportRoot.addChild(fade);

gameTime = 10800;
levelScore =  0;
truckHealthFull = 10;
truckHealth = 10;
engineSpeed = 0;
truckFrame = 5;
exportRoot.gmenu.hWindow.healthline.scaleX = truckHealth / truckHealthFull;
exportRoot.gmenu.hWindow.leveltxt.text = "Level: "+ Level;

failed = false;
finished = false;
isDriving = true;
up = false;
down = false;
right = false;
left = false;	

exportRoot.pButton.poga.gotoAndStop(1);

setupWorld();
createTruck();
//setTimeout(topObjects,65);

var listener = new Box2D.Dynamics.b2ContactListener;

listener.BeginContact = function (contact) {
	
if(contact.GetFixtureA().m_isSensor || contact.GetFixtureB().m_isSensor) {
	if(contact.GetFixtureA().GetBody().GetUserData() != null && contact.GetFixtureB().GetBody().GetUserData() != null) {
	if((contact.GetFixtureA().GetBody().GetUserData().name == "Truck" && contact.GetFixtureB().GetBody().GetUserData().name == "Finish") || (contact.GetFixtureB().GetBody().GetUserData().name == "Truck" && contact.GetFixtureA().GetBody().GetUserData().name == "Finish")) {
if(!finished && !failed) {
	finished = true;
	levelComplete();
}
	} 	
}
} else {
	if(!finished) {
	if(contact.GetFixtureA().m_userData == "truckSensor" || contact.GetFixtureB().m_userData == "truckSensor") {
	
	   var worldManifold = new Box2D.Collision.b2WorldManifold;
       contact.GetWorldManifold(worldManifold);
	   var bumX = worldManifold.m_points[0].x * RATIO;
	   var bumY = worldManifold.m_points[0].y * RATIO;
	   var dumi = new lib.dums2();
	   dumi.x = bumX;
	   dumi.y = bumY;
	   if (truckHealth > 0) { fons.addChild(dumi);
	createjs.Sound.play("bum2");
	   }
	}
	}	
}	  
}

listener.PostSolve = function(contact, impulse) {
if(contact.GetFixtureA().m_userData == "truckSensor") {	
damage(contact.GetFixtureA().GetBody().GetUserData().x, contact.GetFixtureA().GetBody().GetUserData().y);		
} else if (contact.GetFixtureB().m_userData == "truckSensor") {
damage(contact.GetFixtureB().GetBody().GetUserData().x, contact.GetFixtureB().GetBody().GetUserData().y);
}
}

world.SetContactListener(listener);
		
if(mobile) {
			
createjs.Touch.enable(stage, false, false);
exportRoot.gmenu.buttons.visible = true;	
exportRoot.gmenu.buttons.lButtons.left.addEventListener( 'mousedown', leftDown);
exportRoot.gmenu.buttons.lButtons.left.addEventListener( 'pressup', leftUp);
exportRoot.gmenu.buttons.lButtons.right.addEventListener( 'mousedown', rightDown);
exportRoot.gmenu.buttons.lButtons.right.addEventListener( 'pressup', rightUp);
exportRoot.gmenu.buttons.rButtons.accelerate.addEventListener( 'mousedown', accDown);
exportRoot.gmenu.buttons.rButtons.accelerate.addEventListener( 'pressup', accUp);
exportRoot.gmenu.buttons.rButtons.brake.addEventListener( 'mousedown', brakeDown);
exportRoot.gmenu.buttons.rButtons.brake.addEventListener( 'pressup', brakeUp);

} else {
	
exportRoot.gmenu.buttons.visible = false;	 
document.addEventListener('keydown', keyIsDown);
document.addEventListener('keyup', keyIsUp);
}

createjs.Ticker.addEventListener("tick", handleTick);
var canvasLayer = document.getElementById("canvas");
canvasLayer.focus();
}

// ----------------------------------------------------------------------------
function setupWorld() {
	
		 world = new b2World(new b2Vec2(0, 10),true);		
		
		if(Level == 1) {
			fons = new lib.fons1();
		} else if(Level == 2) {
			fons = new lib.fons2();
		} else if(Level == 3) {
			fons = new lib.fons3();
		} else if(Level == 4) {
			fons = new lib.fons4();
		} else if(Level == 5) {
			fons = new lib.fons5();
		} else if(Level == 6) {
			fons = new lib.fons6();
		} else if(Level == 7) {
			fons = new lib.fons7();
		} else if(Level == 8) {
			fons = new lib.fons8();
		} else if(Level == 9) {
			fons = new lib.fons9();
		} else if(Level == 10) {
			fons = new lib.fons10();
		} else if(Level == 11) {
			fons = new lib.fons11();
		} else if(Level == 12) {
			fons = new lib.fons12();
		}
		
		exportRoot.screen.addChild(fons);	
		
/* 		 if(debugPhysics) {
			 debugDraw = new b2DebugDraw();
			 debugDraw.SetSprite(document.getElementById("debugcanvas").getContext("2d"));
			 debugDraw.SetDrawScale(30.0);
			 debugDraw.SetFillAlpha(0.0);
			 debugDraw.SetLineThickness(0.0);
			 debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
			 world.SetDebugDraw(debugDraw);
		 } */
		
		setTimeout(readNextFrame,60);
		
		function readNextFrame() {
		
			for (i=0;i<fons.numChildren;i++) {
				with (fons.getChildAt(i)) {					
					if (name == "b") {
						draw_box(x, y, box_original_size * scaleX, box_original_size * scaleY, rotation * 0.0174532925);
						visible = false;
						}
					else if (name == "c") {
						draw_circle(x, y, box_original_size * scaleX);
						visible = false;
						}
					else if (name == "muca") {
						var realRotation = rotation;
						rotation = 0;
						draw_custom_box(x, y, nominalBounds.width, nominalBounds.height, realRotation * 0.0174532925,new lib.mucas1());						
						visible = false;
						}
						else if (name == "muca2") {
						var realRotation = rotation;
						rotation = 0;
						draw_custom_box(x, y, nominalBounds.width, nominalBounds.height, realRotation * 0.0174532925,new lib.mucas2());						
						visible = false;
						} else if (name == "muca3") {
						var realRotation = rotation;
						rotation = 0;
						draw_custom_box(x, y, nominalBounds.width, nominalBounds.height, realRotation * 0.0174532925,new lib.mucas3());						
						visible = false;
						}
						else if (name == "Riepa") {
						var realRotation = rotation;
						rotation = 0;
						draw_custom_box(x, y, nominalBounds.width, nominalBounds.height, realRotation * 0.0174532925,new lib.Riepa());						
						visible = false;
						}
					else if (name == "Finish") {
						draw_finish(x, y, box_original_size * scaleX, box_original_size * scaleY, rotation * 0.0174532925, new lib.finish);
						visible = false;
						}
					}
				}
				boxObjects = [];
				for (bb = world.m_bodyList; bb; bb = bb.m_next) {
				if (bb.m_userData != null) {
					boxObjects.push(bb);				
				}
		 }
		 update();
		}
}
// ----------------------------------------------------------------------------
function topObjects() {
	
/* 	var fonstop;
	
	if(Level == 1) {
			fonstop = new lib.fons1top();
		} else if(Level == 2) {
			fonstop = new lib.fons2top();
		} else if(Level == 3) {
			fonstop = new lib.fons3top();
		} else if(Level == 4) {
			fonstop = new lib.fons4top();
		} else if(Level == 5) {
			fonstop = new lib.fons5top();
		} else if(Level == 6) {
			fonstop = new lib.fons6top();
		} else if(Level == 7) {
			fonstop = new lib.fons7top();
		} else if(Level == 8) {
			fonstop = new lib.fons8top();
		} else if(Level == 9) {
			fonstop = new lib.fons9top();
		} else if(Level == 10) {
			fonstop = new lib.fons10top();
		} else if(Level == 11) {
			fonstop = new lib.fons11top();
		} else if(Level == 12) {
			fonstop = new lib.fons12top();
		}
		fons.addChild(fonstop); */
}
// ----------------------------------------------------------------------------
function draw_box(x_origin,y_origin,box_width,box_height,angle) {
		
		 var boxDef = new b2FixtureDef;
		 boxDef.friction = 1;
         boxDef.density = 0; 
		 boxDef.restitution = 0;
		 
		 var bodyDef = new b2BodyDef;
		 bodyDef.type = b2Body.b2_staticBody;		 
		 bodyDef.position.Set(x_origin / 30, y_origin / 30);
		 bodyDef.angle =  angle;
		
		 boxDef.shape = new b2PolygonShape;
         boxDef.shape.SetAsBox(box_width / 2 / 30, box_height / 2 / 30);
		 world.CreateBody(bodyDef).CreateFixture(boxDef);
		 
		}
		
function draw_finish(x_origin,y_origin,box_width,box_height,angle,muviks) {
		
		 var boxDef = new b2FixtureDef;
		 boxDef.friction = 1;
         boxDef.density = 0; 
		 boxDef.restitution = 0;
		 
		 var bodyDef = new b2BodyDef;
		 bodyDef.type = b2Body.b2_staticBody;		 
		 bodyDef.position.Set(x_origin / 30, y_origin / 30);
		 bodyDef.angle =  angle;
		 bodyDef.userData = muviks;
		 bodyDef.userData.y = -200;
		 bodyDef.userData.visible = false;
		 fons.addChild(bodyDef.userData);
		 
		 boxDef.shape = new b2PolygonShape;
         boxDef.shape.SetAsBox(box_width / 2 / 30, box_height / 2 / 30);
		 boxDef.isSensor = true;
		 world.CreateBody(bodyDef).CreateFixture(boxDef);
		 
		}
		
function draw_circle(x_origin,y_origin,box_width) {
			
		 var boxDef = new b2FixtureDef;
		 boxDef.friction = 1;
         boxDef.density = 0; 
		 boxDef.restitution = 0;		 
		 var bodyDef = new b2BodyDef;
		 bodyDef.type = b2Body.b2_staticBody;		 
		 bodyDef.position.Set(x_origin / 30, y_origin / 30);		 
		 boxDef.shape = new b2CircleShape(box_width / 2 / 30);
		 world.CreateBody(bodyDef).CreateFixture(boxDef);			
		}
		
function draw_custom_box(x_origin,y_origin,box_width,box_height,angle,muviks) {
		
		 var boxDef = new b2FixtureDef;
		 boxDef.friction = 1;
         boxDef.density = 2; 
		 
		 var bodyDef = new b2BodyDef;
		 bodyDef.type = b2Body.b2_dynamicBody;		 
		 bodyDef.position.Set(x_origin / 30, y_origin / 30);
		 bodyDef.angle =  angle;
		 bodyDef.userData = muviks;
		 bodyDef.userData.y = -200;
		 fons.addChild(bodyDef.userData);
		 
		 boxDef.shape = new b2PolygonShape;
         boxDef.shape.SetAsBox((box_width / 2 - 1) / 30, (box_height / 2 - 1) / 30);
		 
		 world.CreateBody(bodyDef).CreateFixture(boxDef);
		 
		}
		
// ----------------------------------------------------------------------------
function createTruck() {
		 var i;
		 var bodyDef
		 var boxDef;
         var circleDef;
         var revoluteJointDef;
         var prismaticJointDef;
		  
         bodyDef = new b2BodyDef();
         bodyDef.position.Set(tPosition.x / RATIO, tPosition.y / RATIO);
		 bodyDef.type = b2Body.b2_dynamicBody;		 
		 bodyDef.userData = new lib.truck();
		 bodyDef.userData.y = -200;
		 fons.addChild(bodyDef.userData);
				
 cart = world.CreateBody(bodyDef);
 
         boxDef = new b2FixtureDef();
         boxDef.density = 1.8;//1.8
         boxDef.friction = 0.5;
         boxDef.restitution = 0.1;
         boxDef.filter.groupIndex = -1;
		boxDef.shape = new b2PolygonShape;        

//boxDef.shape.SetAsOrientedBox(14 / vRATIO, 16 / vRATIO, new b2Vec2(65 / vRATIO, 28 / vRATIO), 0 * Math.PI / 180);
//cart.CreateFixture(boxDef);
boxDef.shape.SetAsOrientedBox(35 / vRATIO, 8 / vRATIO, new b2Vec2(8 / vRATIO, 20 / vRATIO), -4 * Math.PI / 180);
cart.CreateFixture(boxDef);
boxDef.shape.SetAsOrientedBox(12 / vRATIO, 2 / vRATIO, new b2Vec2(-41 / vRATIO, 6 / vRATIO), -60 * Math.PI / 180);
cart.CreateFixture(boxDef);
boxDef.shape.SetAsOrientedBox(12 / vRATIO, 2 / vRATIO, new b2Vec2(56 / vRATIO, 9 / vRATIO), 66 * Math.PI / 180);
cart.CreateFixture(boxDef);

boxDef.restitution = 0.5;
bodyDef = new b2BodyDef();
bodyDef.userData = new lib.daksa1();
bodyDef.userData.y = -200;
fons.addChild(bodyDef.userData);
fons.setChildIndex(bodyDef.userData,fons.numChildren - 2);
bodyDef.position.Set(tPosition.x / RATIO, tPosition.y / RATIO);
bodyDef.type = b2Body.b2_dynamicBody;		 
 
axle1 = world.CreateBody(bodyDef); 

boxDef.shape.SetAsOrientedBox(30 / vRATIO, 1 / vRATIO, new b2Vec2((-29 / vRATIO) - (0.36 * (50 / vRATIO))*Math.cos(Math.PI/3), (13 / vRATIO) + (0.36 * (50 / vRATIO))*Math.sin(Math.PI/3)), -10 * Math.PI / 180);
axle1.CreateFixture(boxDef);

         prismaticJointDef = new Box2D.Dynamics.Joints.b2PrismaticJointDef();
         prismaticJointDef.Initialize(cart, axle1, axle1.GetWorldCenter(), new b2Vec2(Math.cos(Math.PI/2.2), Math.sin(-Math.PI/3)));
         prismaticJointDef.lowerTranslation = -0.35  * 50 / vRATIO;
         prismaticJointDef.upperTranslation = 0.25 * 50 / vRATIO;
         prismaticJointDef.enableLimit = true;
         prismaticJointDef.enableMotor = true;
         spring1 = world.CreateJoint(prismaticJointDef);
		 
boxDef.restitution = 0.5;
bodyDef = new b2BodyDef();
bodyDef.userData = new lib.daksa12();
bodyDef.userData.y = -200;
fons.addChild(bodyDef.userData);
bodyDef.position.Set(tPosition.x / RATIO, tPosition.y / RATIO);
bodyDef.type = b2Body.b2_dynamicBody;
		 
         axle2 = world.CreateBody(bodyDef); 
         boxDef.shape.SetAsOrientedBox(33 / vRATIO, 1 / vRATIO, new b2Vec2((58 / vRATIO), (-1 / vRATIO) + (0.36 * (50 / vRATIO))*Math.sin(Math.PI/3)), 66 * Math.PI / 180);
         axle2.CreateFixture(boxDef); 
         prismaticJointDef.Initialize(cart, axle2, axle2.GetWorldCenter(), new b2Vec2(Math.cos(Math.PI/3), Math.sin(Math.PI/2.4)));
         spring2 = world.CreateJoint(prismaticJointDef);
		 
		 circleDef = new b2FixtureDef();
		 circleDef.shape = new b2CircleShape(30.5 / vRATIO);
         circleDef.density = 0.2;//0.2
         circleDef.friction = 6;//6
         circleDef.restitution = 0;
         circleDef.filter.groupIndex = -1;
		 
		          for (i = 0; i < 2; i++) {
 
            bodyDef = new b2BodyDef();
			bodyDef.type = b2Body.b2_dynamicBody;	
			
            if (i == 0) {
				bodyDef.position.Set(axle1.GetWorldCenter().x - (18 / vRATIO), axle1.GetWorldCenter().y + (4 / vRATIO));
				bodyDef.userData = new lib.riepas2();
            } else {
				bodyDef.position.Set(axle2.GetWorldCenter().x + (0.4 * (50 / vRATIO)) * Math.cos( -Math.PI / 3), axle2.GetWorldCenter().y + (0.4 * (50 / vRATIO)) * Math.sin(Math.PI / 3));
				bodyDef.userData = new lib.riepas();
				circleDef.density = 0.72;//0.2
			
            }
			bodyDef.allowSleep = false;
 
            if (i == 0) wheel1 = world.CreateBody(bodyDef);
            else wheel2 = world.CreateBody(bodyDef);
 
            (i == 0 ? wheel1 : wheel2).CreateFixture(circleDef);
			bodyDef.userData.y = -200;
			fons.addChild(bodyDef.userData);
			fons.setChildIndex(bodyDef.userData,fons.numChildren - 4);
         }
		 
		          // add joints //
         revoluteJointDef = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
         revoluteJointDef.enableMotor = true;
 
         revoluteJointDef.Initialize(axle1, wheel1, wheel1.GetWorldCenter());
         motor1 = world.CreateJoint(revoluteJointDef);
 
         revoluteJointDef.Initialize(axle2, wheel2, wheel2.GetWorldCenter());
         motor2 = world.CreateJoint(revoluteJointDef);
		 
		 		 // sensori
		bodyDef = new b2BodyDef();
		bodyDef.position.Set(tPosition.x / RATIO, tPosition.y / RATIO);
		bodyDef.type = b2Body.b2_dynamicBody;
		bodyDef.userData = 1;
		cart2 = world.CreateBody(bodyDef);		 
				 
		 boxDef.shape.SetAsOrientedBox(8 / vRATIO, 30 / vRATIO, new b2Vec2( -12 / vRATIO, -50 / vRATIO), 38 * Math.PI / 180);
		 boxDef.density = 0.1;
		 boxDef.userData = "truckSensor";
		 cart2.CreateFixture(boxDef);	

		 prismaticJointDef = new Box2D.Dynamics.Joints.b2PrismaticJointDef();
		 prismaticJointDef.lowerTranslation = -0.3 * (50 / vRATIO);
         prismaticJointDef.upperTranslation = 0.78 * (50 / vRATIO);
         prismaticJointDef.enableLimit = true;
         prismaticJointDef.enableMotor = true;
		 prismaticJointDef.Initialize(cart, cart2, cart2.GetWorldCenter(), new b2Vec2(1, -.3 * (50 / vRATIO)));
 
         spring3 = world.CreateJoint(prismaticJointDef);
		 spring3.SetMaxMotorForce(15);
				 
				 
		 
		 boxDef.shape.SetAsOrientedBox(16 / vRATIO, 1 / vRATIO, new b2Vec2(12 / vRATIO, -36 / vRATIO), 7 * Math.PI / 180);
		 boxDef.userData = "truckSensor";
		 cart.CreateFixture(boxDef);

		 boxDef.shape.SetAsOrientedBox(1 / vRATIO, 10 / vRATIO, new b2Vec2(-5 / vRATIO, -10 / vRATIO), 35 * Math.PI / 180);
		 boxDef.userData = "truckSensor";
		 cart.CreateFixture(boxDef);
		 
	  }	

// ----------------------------------------------------------------------------
function leftDown(event) {event.nativeEvent.preventDefault();left = true;}
function leftUp(event) {event.nativeEvent.preventDefault();left = false;right = false;}
function rightDown(event) {event.nativeEvent.preventDefault();right = true;}
function rightUp(event) {event.nativeEvent.preventDefault();right = false;left = false;}
function accDown(event) {event.nativeEvent.preventDefault();up = true;}
function accUp(event) {event.nativeEvent.preventDefault();up = false;}
function brakeDown(event) {event.nativeEvent.preventDefault();down = true;}
function brakeUp(event) {event.nativeEvent.preventDefault();down = false;}
// ----------------------------------------------------------------------------
function keyIsUp(event) {
	event.preventDefault();
	 if (event.keyCode == 38 || event.keyCode == 87) {
	up = false;
  } else if (event.keyCode == 40 || event.keyCode == 83){
    down = false;
  }
    if (event.keyCode == 39 || event.keyCode == 68) {
	right = false;
  } else if (event.keyCode == 37 || event.keyCode == 65){
    left = false;
  }
}
// ----------------------------------------------------------------------------
function keyIsDown(event) {
	event.preventDefault();
	  if (event.keyCode == 38 || event.keyCode == 87) { // up
	up = true;	
  } else if (event.keyCode == 40 || event.keyCode == 83){ // down
    down = true;
  }
    if (event.keyCode == 39 || event.keyCode == 68) { // right
	right = true;
  } else if (event.keyCode == 37 || event.keyCode == 65){ // left
    left = true;
  }
}


function handleTick() {
	if(!pause && !finished && !failed) {
		world.Step(1/60,10,10);
		world.ClearForces();
		gameTime --;
		//exportRoot.gmenu.frameratext.text = Math.round(createjs.Ticker.getMeasuredFPS());
	}
}
// ----------------------------------------------------------------------------
function update() {
		
if(!pause) {
drive();

/*  if(debugPhysics) {
			  debugDraw.SetDrawScale(30.0 * stage.scaleX);
			  world.DrawDebugData();
		  }  */       
}
if (!failed && !finished && isDriving) requestAnimationFrame(update);
}
// ----------------------------------------------------------------------------
function drive() {
		

		 for (i = 0; i < boxObjects.length; i++) {
				boxObjects[i].m_userData.x=boxObjects[i].GetPosition().x*30;
				boxObjects[i].m_userData.y=boxObjects[i].GetPosition().y*30;
				boxObjects[i].m_userData.rotation = boxObjects[i].GetAngle() * (180 / Math.PI);
				
				if(boxObjects[i].m_userData.name == "Truck") {
					if(right) {
						if(truckFrame < 9) truckFrame+= 0.5;
					} else if(left) {
						if(truckFrame > 0) truckFrame-= 0.5;
					} else {
						if(truckFrame > 4) truckFrame-= 0.5;
						if(truckFrame < 4) truckFrame+= 0.5;
					}
					
					boxObjects[i].m_userData.mocis.gotoAndStop(truckFrame);
				}
		 }

		 motor1.SetMotorSpeed(20*Math.PI * (down ? -.15 : up ? .3 : 0));
         motor1.SetMaxMotorTorque(down || up ? 60 : 0.5);
		 
		 motor2.SetMotorSpeed(20*Math.PI * (down ? -.15 : up ? .3 : 0));
         motor2.SetMaxMotorTorque(down || up ? 3 : 0.5);
		 
	     spring1.SetMaxMotorForce(30+Math.abs(800*Math.pow(spring1.GetJointTranslation(), 2)));
         //spring1.SetMotorSpeed((spring1.GetMotorSpeed() - 10*spring1.GetJointTranslation())*0.4);  
		 spring1.SetMotorSpeed(-2*Math.pow(spring1.GetJointTranslation(), 1));
 
         spring2.SetMaxMotorForce(20+Math.abs(800*Math.pow(spring2.GetJointTranslation(), 2)));
        // spring2.SetMotorSpeed(-4*Math.pow(spring2.GetJointTranslation(), 1));	
		 spring2.SetMotorSpeed( -3 * Math.pow(spring2.GetJointTranslation(), 1));
		 
		 
		 if (left || right) {
		 spring3.SetMotorSpeed(1 * Math.PI * (left ? -1 : right ? 1.5 : 0));
		 
		 } else {
		 spring3.SetMotorSpeed( -10 * Math.pow(spring3.GetJointTranslation(), 1));
		 
		 }
		 
		if (up) {
			 wheel1.m_fixtureList.m_friction = 2;//6
		 } else {
			 wheel1.m_fixtureList.m_friction = 50;//50
		 }
		 

		 cart.ApplyTorque(20 * (left ? -1.5: right ? 0.7 : 0));
		 
		 if (cart.GetAngularVelocity() < -2) cart.SetAngularVelocity( -2);
		 if (cart.GetAngularVelocity() > 2) cart.SetAngularVelocity( 2);
	
			  fons.x -= ((fons.x - (-RATIO*cart.GetWorldCenter().x + SCREEN_WIDTH/2  - cart.GetLinearVelocity().x*10))/3 + (1000 / RATIO)) * 0.1;
			  
			  
			  
			  if(Level == 12) {
				 if(fons.x < - 3420) fons.x = -3420; //12. garaks
			  } else {
			  if(fons.x < - 3150) fons.x = -3150;
			  }
			  if(fons.x > 0) fons.x = 0;

	exportRoot.screen.sky.x = fons.x * 0.8;	 
	enginevolume();		 
}
// -----------------------------------------------------------------------------
function enginevolume() {
	
if (up) {
	if(engineSpeed < 1) engineSpeed += 0.06;
} else if (down) {
	if(engineSpeed > -1)engineSpeed -= 0.06;
} else {
	if(engineSpeed > 0) engineSpeed -= 0.06;
	if(engineSpeed < 0) engineSpeed += 0.06;
}
	var eSpeed = Math.abs(engineSpeed)
	engineSound.volume = eSpeed;
	idleSound.volume = 1 - eSpeed;
}
// -----------------------------------------------------------------------------
function damage(bum_x,bum_y) {

truckHealth --;
if(truckHealth < 0) truckHealth = 0;
exportRoot.gmenu.hWindow.healthline.scaleX = truckHealth / truckHealthFull;

if(truckHealth <= 0 && !failed && !finished) {
	failed = true;
	//var explosion = new lib.truckexplosion();
	   //explosion.x = bum_x;
	   //explosion.y = bum_y;
	   //fons.addChild(explosion);
	   levelFailed();
}

}
// -----------------------------------------------------------------------------
function levelFailed() {
	

	createjs.Sound.play("bum");
	exportRoot.gmenu.buttons.visible = false;
	tryAgainScreen = new lib.tryagain();
	exportRoot.addChild(tryAgainScreen);
	
if (idleSound) idleSound.stop();
if (engineSound) engineSound.stop();
	
}

// ------------------------------------------------------------------------------
function levelComplete() {
	
	var betterscore = false;
	unlockedAchievement = -1;
	
	if (idleSound) idleSound.stop();
if (engineSound) engineSound.stop();
	
	if(gameTime < 0) gameTime = 0;
	levelScore = Math.floor((Level * 60) + (gameTime / 10));
	if (levelScore > levelScores[Level - 1]) {
		levelScores[Level - 1] = levelScore;
		betterscore = true;
	}

	levelStars = 0;
	if(levelScore > 100) levelStars = 1;
	if(levelScore >= targetScores[Level-1] - (targetScores[Level-1] / 15)) levelStars = 2;
	if(levelScore >= targetScores[Level-1]) levelStars = 3;
	
	totalScore = 0;
	for (i = 0; i < levelScores.length; i++) {
    totalScore += levelScores[i];
	}
	if(betterscore) writeMemory();
	
	exportRoot.gmenu.buttons.visible = false;
	if(Level == 12) {
	tryAgainScreen = new lib.levelcompletefinal();
	} else {
		tryAgainScreen = new lib.levelcomplete();
	}
	exportRoot.addChild(tryAgainScreen);
}
// ------------------------------------------------------------------------------
function resetgame() {

if(mobile) {
	exportRoot.gmenu.buttons.lButtons.left.removeEventListener( 'mousedown', leftDown);
	exportRoot.gmenu.buttons.lButtons.left.removeEventListener( 'pressup', leftUp);
	exportRoot.gmenu.buttons.lButtons.right.removeEventListener( 'mousedown', rightDown);
	exportRoot.gmenu.buttons.lButtons.right.removeEventListener( 'pressup', rightUp);
	exportRoot.gmenu.buttons.rButtons.accelerate.removeEventListener( 'mousedown', accDown);
	exportRoot.gmenu.buttons.rButtons.accelerate.removeEventListener( 'pressup', accUp);
	exportRoot.gmenu.buttons.rButtons.brake.removeEventListener( 'mousedown', brakeDown);
	exportRoot.gmenu.buttons.rButtons.brake.removeEventListener( 'pressup', brakeUp);
} else {
	document.removeEventListener('keydown', keyIsDown);
	document.removeEventListener('keyup', keyIsUp);
}
createjs.Ticker.removeEventListener("tick", handleTick);
	isDriving = false;

	exportRoot.screen.removeChild(fons);
	fons = null;
	world = null;
	cancelAnimationFrame(update);
}
// ------------------------------------------------------------------------------
function readMemory() {
	for (i = 0; i < levelScores.length; i++) {
		if(localStorage.getItem('levelscoretrialssnow' + i) == null) localStorage.setItem('levelscoretrialssnow' + i, 0);
    levelScores[i] = parseInt(localStorage.getItem('levelscoretrialssnow' + i));
	}
	updateAchievements();
}
// ------------------------------------------------------------------------------
function writeMemory() {
		for (i = 0; i < levelScores.length; i++) {
    localStorage.setItem('levelscoretrialssnow' + i, levelScores[i]);
	}
	updateAchievements();
}
// ------------------------------------------------------------------------------
function resetMemory() {
		for (i = 0; i < levelScores.length; i++) {
	levelScores[i] = 0;		
    localStorage.setItem('levelscoretrialssnow' + i, levelScores[i]);
	}
}

function updateAchievements() {
	
	totalScore = 0;
	for (i = 0; i < levelScores.length; i++) {
    totalScore += levelScores[i];
	}
	
	var levelsfinished = 0;
	var threestars = 0;
	unlockedAchievement = -1;
	
	for (i = 0; i < levelScores.length; i++) {
		if (levelScores[i] > 0) levelsfinished ++;
		if(levelScores[i] >= targetScores[i]) threestars ++;
	}
	
	if(levelsfinished >= 1) {
		if(achievement[0] == 0) unlockedAchievement = 0;
		achievement[0] = 1;
	}
	if(levelsfinished >= 5) {
		if(achievement[1] == 0) unlockedAchievement = 1;
		achievement[1] = 1;
	}
	if(levelsfinished >= 10) {
		if(achievement[2] == 0) unlockedAchievement = 2;
		achievement[2] = 1;
	}
	if(levelsfinished >= 12) {
		if(achievement[3] == 0) unlockedAchievement = 3;
		achievement[3] = 1;
	}
	if(threestars >= 1) {
		if(achievement[4] == 0) unlockedAchievement = 4;
		achievement[4] = 1;
	}
	if(threestars >= 5) {
		if(achievement[5] == 0) unlockedAchievement = 5;
		achievement[5] = 1;
	}
	if(threestars >= 10) {
		if(achievement[6] == 0) unlockedAchievement = 6;
		achievement[6] = 1;
	}
	if(threestars >= 12) {
		if(achievement[7] == 0) unlockedAchievement = 7;
		achievement[7] = 1;
	}
	if(totalScore >= 1000) {
		if(achievement[8] == 0) unlockedAchievement = 8;
		achievement[8] = 1;
	}
	if(totalScore >= 5000) {
		if(achievement[9] == 0) unlockedAchievement = 9;
		achievement[9] = 1;
	}
	if(totalScore >= 10000) {
		if(achievement[10] == 0) unlockedAchievement = 10;
		achievement[10] = 1;
	}
	if(totalScore >= 15000) {
		if(achievement[11] == 0) unlockedAchievement = 11;
		achievement[11] = 1;
	}
	
}

$(window).focus(function() { 
    // Unpause when window gains focus 
    if(skana) createjs.Sound.muted = false;
}).blur(function() { 
    // Pause when window loses focus 
    createjs.Sound.muted = true; 
});