////////////////////////////////////////////////////////////////////////////////

/* COMP 3490 A1 Skeleton for Claw Machine (Barebones Edition) 
 * Note that you may make use of the skeleton provided, or start from scratch.
 * The choice is up to you.
 * Read the assignment directions carefully
 * Your claw mechanism should be created such that it is represented hierarchically
 * You might consider looking at THREE.Group and THREE.Object3D for reference
 * If you want to play around with the canvas position, or other HTML/JS level constructs
 * you are welcome to do so.
**/
Physijs.scripts.worker = 'js/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';
 /*global variables, coordinates, clock etc.  */
var camera, scene, renderer, textureLoader;
var cameraControls;
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var clock = new THREE.Clock();

function fillScene() {
	scene = new Physijs.Scene();
	scene.setGravity(new THREE.Vector3( 0, -1000, 0 ));
	textureLoader = new THREE.TextureLoader();

	/*************************************************
	** SETUP ENVIRONMENT
	*************************************************/
	scene.fog = new THREE.Fog( 0x808080, 2000, 4000 );

	light = new THREE.DirectionalLight(0xffffff, 0.5);
	light.position.set(-500, 600, 700);
	light.castShadow = true;
	light.shadow.camera.near = 0.1;
	light.shadow.camera.far = 2500;
	light.shadow.camera.left = -1000;
	light.shadow.camera.right = 1000;
	light.shadow.camera.top = 1000;
	light.shadow.camera.bottom = -1000;
	scene.add(light);

	var floorTexture = textureLoader.load("pics/floor.jpg");
	var floorMat = new THREE.MeshPhongMaterial({
		map: floorTexture});
	meshFloor = new Physijs.BoxMesh(
		new THREE.PlaneGeometry(5000, 5000, 50, 50),
		floorMat
	);
	meshFloor.rotation.x -= Math.PI / 2;
	meshFloor.receiveShadow = true;
	scene.add(meshFloor);

	/*************************************************
	** CREATE OBJECTS
	*************************************************/
	drawClawMachine();
}

PrismGeometry = function ( vertices, height ) {
    var Shape = new THREE.Shape();

    ( function f( ctx ) {

        ctx.moveTo( vertices[0].x, vertices[0].y );
        for (var i=1; i < vertices.length; i++) {
            ctx.lineTo( vertices[i].x, vertices[i].y );
        }
        ctx.lineTo( vertices[0].x, vertices[0].y );

    } )( Shape );

    var settings = { };
    settings.amount = height;
    settings.bevelEnabled = false;
    THREE.ExtrudeGeometry.call( this, Shape, settings );
};
PrismGeometry.prototype = Object.create( THREE.ExtrudeGeometry.prototype );


function drawClawMachine() {

	//////////////////////////////
	// Some simple material definitions - This may become more complex in A2
	var baseTexture = textureLoader.load("pics/crate.gif");
	var baseMaterial = new THREE.MeshPhongMaterial({ 
		color: 0xffffff,
		map: baseTexture });

	var bodyMaterial = new THREE.MeshPhongMaterial();
	bodyMaterial.color.setRGB( 0.5, 0.5, 0.5 );

	var movingbodyMaterial = new THREE.MeshPhongMaterial();
	movingbodyMaterial.color.setRGB( 0.8, 0.2, 0.2 );

	var glassMaterial = new THREE.MeshPhongMaterial({
		opacity: 0.20,
		premultipliedAlpha: true,
		transparent: true
	});

	// This is where the model gets created. Add the appropriate geometry to create your machine
	// You are not limited to using BoxGeometry, and likely want to use other types of geometry for pieces of your submission
	// Note that the actual shape, size and other factors are up to you, provided constraints listed in the assignment description are met

	createBaseStructure(scene,baseMaterial);
	createGlassWall(scene, glassMaterial);
	createGuardandBin(scene, movingbodyMaterial);
	createConsole(scene, baseMaterial);
	createClawMech(scene, movingbodyMaterial);
	createSpotlights(scene);
	createMarquee(scene);
}

function createMarquee(scene) {
	var marqTexture = textureLoader.load("pics/marq.png");
	var marqMat = new THREE.MeshPhongMaterial({ 
		color: 0xffffff,
		map: marqTexture });

	marq = new Physijs.BoxMesh(
		new THREE.BoxGeometry( 500, 150, 10 ),
		marqMat, 0
	);
	marq.position.set(-305,1000,0);
	marq.rotation.y = Math.PI / 2;

	var marqL1 = new THREE.PointLight( 0xffeeee, 5, 100 );
	marqL1.position.set( -50, 0, -50 );
	var marqL2 = new THREE.PointLight( 0xffeeee, 5, 100 );
	marqL2.position.set( 50, 0, -50 );
	var marqL3 = new THREE.PointLight( 0xffeeee, 5, 100 );
	marqL3.position.set( -175, 0, -50 );
	var marqL4 = new THREE.PointLight( 0xffeeee, 5, 100 );
	marqL4.position.set( 175, 0, -50 );
	marq.add(marqL1);
	marq.add(marqL2);
	marq.add(marqL3);
	marq.add(marqL4);
	scene.add(marq);
}

function createBaseStructure(scene, bodyMaterial) {
	var base;
	base = new Physijs.BoxMesh(
	new THREE.BoxGeometry( 600, 500, 800 ), bodyMaterial, 0);
	base.position.set(0,250,0);

	// A supporting arm
	stand1 = new Physijs.BoxMesh(
		new THREE.BoxGeometry( 50, 600, 50 ), bodyMaterial );
		stand1.position.set(-275,400,-375);
		base.add( stand1 );

	stand2 = new Physijs.BoxMesh(
		new THREE.BoxGeometry( 50, 600, 50 ), bodyMaterial );
		stand2.position.set(275,400,-375);
		base.add( stand2 );

	stand3 = new Physijs.BoxMesh(
		new THREE.BoxGeometry( 50, 600, 50 ), bodyMaterial );
		stand3.position.set(275,400,375);
		base.add( stand3 );
		
	stand4 = new Physijs.BoxMesh(
		new THREE.BoxGeometry( 50, 600, 50 ), bodyMaterial );
		stand4.position.set(-275,400,375);
		base.add( stand4 );

	basetop = new Physijs.BoxMesh(
		new THREE.BoxGeometry( 600, 50, 800 ), bodyMaterial );
		basetop.position.set(0,700,0);
		base.add( basetop );

	stand1.receiveShadow = true;
	stand1.castShadow = true;
	stand2.receiveShadow = true;
	stand2.castShadow = true;
	stand3.receiveShadow = true;
	stand3.castShadow = true;
	stand4.receiveShadow = true;
	stand4.castShadow = true;
	basetop.receiveShadow = true;
	basetop.castShadow = true;
	base.receiveShadow = true;
	base.castShadow = true;
	scene.add(base);

	var s1 = new THREE.MeshPhongMaterial();
	s1.color.setRGB( 0.8, 0.8, 0.2 );
	var s2 = new THREE.MeshPhongMaterial();
	s2.color.setRGB( 0.8, 0.8, 0.8 );
	var s3 = new THREE.MeshPhongMaterial();
	s3.color.setRGB( 0.8, 0.5, 0.2 );

	for(i = 0; i < 10; i++){
		obj1 = new Physijs.BoxMesh(new THREE.BoxGeometry(50, 50, 50), s1);
	    obj1.position.set(100, 700, 150);
	    obj1.receiveShadow = true;
	    obj1.castShadow = true;
	    scene.add(obj1);
	    obj2 = new Physijs.SphereMesh(new THREE.SphereGeometry(30, 20, 20), s2);
	    obj2.position.set(-100, 700, 150);
	    obj2.receiveShadow = true;
	    obj2.castShadow = true;
	    scene.add(obj2);
	    obj3 = new Physijs.CylinderMesh(new THREE.CylinderGeometry(30, 30, 30), s3);
	    obj3.position.set(100, 700, -150);
	    obj3.receiveShadow = true;
	    obj3.castShadow = true;
	    scene.add(obj3);
	}
}

function createSpotlights(scene){
	spotLightOne = new THREE.SpotLight( 0xffffff, 1 );
	spotLightTwo = new THREE.SpotLight( 0xffffff, 1 );
	setSpotLight(spotLightOne);
	setSpotLight(spotLightTwo);
	spotLightOne.position.set(0, 900, 300);
	spotLightTwo.position.set(0, 900, -300);
	scene.add(spotLightOne);
	scene.add(spotLightTwo);
}

function setSpotLight(spotLight){
	spotLight.angle = Math.PI / 4;
	spotLight.penumbra = 0.05;
	spotLight.decay = 2;
	spotLight.distance = 500;
	spotLight.castShadow = true;
	spotLight.shadow.mapSize.width = 1024;
	spotLight.shadow.mapSize.height = 1024;
	spotLight.shadow.camera.near = 10;
	spotLight.shadow.camera.far = 100;
}	

function createGlassWall(scene, glassMaterial) {
	gl1 = new Physijs.BoxMesh(
		new THREE.BoxGeometry( 550, 450, 10 ),
		glassMaterial, 0
	);
	gl1.position.set(0,700,375);
	scene.add(gl1);
	
	gl2 = new Physijs.BoxMesh(
		new THREE.BoxGeometry( 550, 450, 10 ),
		glassMaterial, 0
	);
	gl2.position.set(0,700,-375);
	scene.add(gl2);
		
	gl3 = new Physijs.BoxMesh(
		new THREE.BoxGeometry( 800, 450, 10 ),
		glassMaterial, 0
	);
	gl3.position.set(275,700,0);
	gl3.rotation.y = Math.PI / 2;
	scene.add(gl3);

	gl4 = new Physijs.BoxMesh(
		new THREE.BoxGeometry( 800, 450, 10 ),
		glassMaterial, 0
	);
	gl4.position.set(-275,700,0);
	gl4.rotation.y = Math.PI / 2;
	scene.add(gl4);
}

function createGuardandBin(scene, movingbodyMaterial) {
	guard1 = new Physijs.BoxMesh(
		new THREE.BoxGeometry(10,100,200), movingbodyMaterial,0);
		guard1.rotation.y = 300;
	guard1.position.set(-175,550,175);

	guard2 = new Physijs.BoxMesh(
		new THREE.BoxGeometry(10,100,200), movingbodyMaterial,0);
	guard2.position.set(-75,550,275);

	scene.add(guard1);
	scene.add(guard2);
}

function createConsole(scene, bodyMaterial){
	var A = new THREE.Vector2( -300, -400 );
	var B = new THREE.Vector2( -200, -300 );
	var C = new THREE.Vector2( -200, -450);

	var height = 800;                   
	var geometry = new PrismGeometry( [ A, B, C ], height ); 

	var panel = new Physijs.BoxMesh( geometry, bodyMaterial, 0 );
		panel.position.set(-100,50,400);
		panel.rotation.x = -Math.PI  ;
	scene.add( panel );

	baseStick = new THREE.Mesh(
		new THREE.CylinderGeometry( 10, 20, 30, 10, 1, false ), bodyMaterial, 0 );
    baseStick.position.set(-360, 480, 0);
    baseStick.rotation.set(0, 0, Math.PI/5.9);

    stick = new Physijs.CylinderMesh(
    	new THREE.CylinderGeometry(5, 5, 40), bodyMaterial, 0);
    stick.position.set(0, 30, 0);

    handle = new Physijs.SphereMesh(new THREE.SphereGeometry(10), bodyMaterial, 0);
    handle.position.set(0, 20, 0);

    var btnMat = new THREE.MeshPhongMaterial({ 
		color: 0xff0000});

	btn1 = new Physijs.CylinderMesh(
		new THREE.CylinderGeometry( 10, 20, 10, 10, 1, false ), btnMat, 0 );  
	btn1.position.set(-360, 480, 0);
    btn1.rotation.set(0, 0, Math.PI/5.9);  
	btn2 = new Physijs.CylinderMesh(
		new THREE.CylinderGeometry( 10, 20, 10, 10, 1, false ), btnMat, 0 ); 
	btn2.position.z = 100;
	btn3 = new Physijs.CylinderMesh(
		new THREE.CylinderGeometry( 10, 20, 10, 10, 1, false ), btnMat, 0 ); 
	btn3.position.z = 150;

	var btn2L = new THREE.PointLight( 0xff0000, 3, 50 );
	btn2L.position.y = 25;
	btn2.add(btn2L);

	var btn3L = new THREE.PointLight( 0xff0000, 3, 50 );
	btn3L.position.y = 25;
	btn3.add(btn3L);

	var coinTexture = textureLoader.load("pics/coinslot.jpg");
	var coinMat = new THREE.MeshPhongMaterial({ 
		color: 0xffffff,
		map: coinTexture });

	coinslot = new Physijs.BoxMesh( new THREE.BoxGeometry(50,5,50), coinMat, 0);
	coinslot.position.z = -100;
	var coinslotL = new THREE.PointLight( 0xff0000, 3, 50 );
	coinslotL.position.y = 25;
	coinslot.add(coinslotL);

	btn1.add(coinslot);
	btn1.add(btn2);
	btn1.add(btn3);
	
    stick.add(handle);
    baseStick.add(stick);
    scene.add(baseStick);
    scene.add(btn1);
}

function createClawMech(scene, movingbodyMaterial){
	frame = new THREE.Group();
	cLTop = new Physijs.BoxMesh(
		new THREE.BoxGeometry( 600, 50, 30 ), movingbodyMaterial );
		cLTop.position.set(0,850,325);
	frame.add( cLTop );

	cRTop = new Physijs.BoxMesh(
		new THREE.BoxGeometry( 600, 50, 30 ), movingbodyMaterial );
		cRTop.position.set(0,850,-325);
	frame.add( cRTop );

	cUTop = new Physijs.BoxMesh(
		new THREE.BoxGeometry( 30, 50, 750 ), movingbodyMaterial );
		cUTop.position.set(225,850,0);
	frame.add( cUTop );

	cDTop = new Physijs.BoxMesh(
		new THREE.BoxGeometry( 30, 50, 750 ), movingbodyMaterial );
		cDTop.position.set(-225,850,0);
	frame.add( cDTop );

	movingBar = new Physijs.BoxMesh(
		new THREE.BoxGeometry( 30, 50, 650 ), movingbodyMaterial );
		movingBar.position.set(0,850,0);
	frame.add(movingBar);

	unitAttachedToBar = new Physijs.BoxMesh(
		new THREE.BoxGeometry( 100, 60, 100 ), movingbodyMaterial );
	movingBar.add(unitAttachedToBar);

	cRope = new THREE.Mesh(
		new THREE.BoxGeometry( 10, 100, 10 ), movingbodyMaterial);
		cRope.position.set(0,850,0);
	//unitAttachedToBar.add( cRope );
	scene.add(cRope);

	clawBaseCircle = new Physijs.CylinderMesh(
		new THREE.CylinderGeometry( 30, 20, 25, 10, 1, false ), movingbodyMaterial );
		clawBaseCircle.position.set(0,-90,0);
	unitAttachedToBar.add(clawBaseCircle);

	joint1 = new Physijs.SphereMesh(new THREE.SphereGeometry(10, 20, 20), movingbodyMaterial);
	clawBaseCircle.add(joint1);
	joint1.position.x = -15;
	joint1.position.y = -10;
	joint2 = new Physijs.SphereMesh(new THREE.SphereGeometry(10, 20, 20), movingbodyMaterial);
	clawBaseCircle.add(joint2);
	joint2.position.x = 15;
	joint2.position.y = -10;
	joint3 = new Physijs.SphereMesh(new THREE.SphereGeometry(10, 20, 20), movingbodyMaterial);
	clawBaseCircle.add(joint3);
	joint3.position.z = -15;
	joint3.position.y = -10;
	joint4 = new Physijs.SphereMesh(new THREE.SphereGeometry(10, 20, 20), movingbodyMaterial);
	clawBaseCircle.add(joint4);
	joint4.position.z = 15;
	joint4.position.y = -10;

	var fingers = new THREE.Group();
	f1 = new Physijs.BoxMesh(
		new THREE.BoxGeometry(10,40,10), movingbodyMaterial);
		f1.rotation.z = 230;
		f1.position.x = 20;
		f1.position.y = -20;
	joint2.add(f1);

	f2 = new Physijs.BoxMesh(
		new THREE.BoxGeometry(10,40,10), movingbodyMaterial);
		f2.rotation.z = -230;
		f2.position.x = -20;
		f2.position.y = -20;
	joint1.add(f2);
	f3 = new Physijs.BoxMesh(
		new THREE.BoxGeometry(10,40,10), movingbodyMaterial);
		f3.rotation.x = 230;
		f3.position.z = -20;
		f3.position.y = -20
	joint3.add(f3);
	f4 = new Physijs.BoxMesh(
		new THREE.BoxGeometry(10,40,10), movingbodyMaterial);
		f4.rotation.x = -230;
		f4.position.z = 20;
		f4.position.y = -20
	joint4.add(f4);
	fingers.position.y = -25;	
	clawBaseCircle.add(fingers);

	frame.position.y = 50;
	scene.add(frame);

	spotLightClaw = new THREE.SpotLight( 0xffffff, 1 );
	setSpotLight(spotLightClaw);
	spotLightClaw.castShadow = true;
	spotLightClaw.shadow.camera.near = 0.1;
	spotLightClaw.shadow.camera.far = 2500;
	spotLightClaw.shadow.camera.left = -1000;
	spotLightClaw.shadow.camera.right = 1000;
	spotLightClaw.shadow.camera.top = 1000;
	spotLightClaw.shadow.camera.bottom = -1000;
	clawBaseCircle.add(spotLightClaw);
}

var egocentric = false;
//ANIMATION CONTROL
document.onkeydown = (key) => {
    console.log(key.keyCode);
    var unitMax = 250;
    var barMax = 195;
    var slideSpeed = 8;
    switch (key.keyCode) {
        case 65: //LEFT
            if (baseStick.rotation.x > -Math.PI/10){
             	baseStick.rotation.x -= Math.PI/10; 
        	}
        	if (unitAttachedToBar.position.z > -unitMax) {
            	unitAttachedToBar.translateZ(-slideSpeed);
            	cRope.translateZ(-slideSpeed);
            }
            break;
        case 68://RIGHT
            if (baseStick.rotation.x < Math.PI/10) {
            	baseStick.rotation.x += Math.PI/10;
            }
            if (unitAttachedToBar.position.z < unitMax) {
            	unitAttachedToBar.translateZ(slideSpeed);
            	cRope.translateZ(slideSpeed);
            }
            break;
        case 83: //DOWN
            if (baseStick.rotation.z < Math.PI/5.9 + Math.PI/10) {
            	baseStick.rotation.z += Math.PI / 10; 
            }
            if (movingBar.position.x > -barMax) {
            	movingBar.translateX(-slideSpeed);
            	cRope.translateX(-slideSpeed);
            }
            break;
        case 87: //UP
            if (baseStick.rotation.z > Math.PI/5.9 - Math.PI/10) {
            	baseStick.rotation.z -= Math.PI / 10; 
            }
            if (movingBar.position.x < barMax) {
            	movingBar.translateX(slideSpeed);
            	cRope.translateX(slideSpeed);
            }
            break;
        case 86: //V
        	if(egocentric == false) {
        		egocentricView();
        		egocentric = true;
        	}
            else {
            	resetView();
            	egocentric = false;
            }
        	break;
        case 88: //X
        	requestAnimationFrame(moveFingers);
        	break;
        case 67: //C
        	console.log(camera.position);
        	console.log(cameraControls.target);
        	break;
        case 32:
        	requestAnimationFrame(dropClaw);  
            break;
    }
}

document.onkeyup = (e) => {
    baseStick.rotation.set(0, 0, Math.PI/5.9);
}

function egocentricView() {
	camera.position.set( -820, 731, -10);
	cameraControls.target.set( 95, 516, -2);
}

function resetView() {
	camera.position.set( -1435,951, -20);
	cameraControls.target.set(35,396,-17);
}

var dropSpeed = 0.02;
var drop = 1;
function dropClaw(){
	cRope.scale.set(1, drop, 1);
	drop = drop + dropSpeed;
	cRope.position.y -= 1;
	clawBaseCircle.position.y -= 2;
	if(Math.abs(drop) < 3.5) { requestAnimationFrame(dropClaw); }
	else {
		resetClaw();
		moveFingers();
	} 
}

function moveFingers(){
	joint1.rotation.z += 0.1;
	joint2.rotation.z -= 0.1;
	joint3.rotation.x -= 0.1;
	joint4.rotation.x += 0.1;
	if(joint1.rotation.z <= 0.99) { requestAnimationFrame(moveFingers)}
	//else resetFingers();
}
function resetFingers(){
	joint1.rotation.z -= 0.1;
	joint2.rotation.z += 0.1;
	joint3.rotation.x += 0.1;
	joint4.rotation.x -= 0.1;
	if(joint1.rotation.z >= 0.1) { requestAnimationFrame(resetFingers)}	
}

function resetClaw(){
	cRope.scale.set(1, drop, 1);
	drop = drop - dropSpeed;
	cRope.position.y += 1;
	clawBaseCircle.position.y += 2;
	if(Math.abs(drop) > 1) { requestAnimationFrame(resetClaw); }
	else resetFingers();
}

// Initialization. Define the size of the canvas and store the aspect ratio
// You can change these as well

function init() {
	var canvasWidth = 1280;
	var canvasHeight = 720;
	var canvasRatio = canvasWidth / canvasHeight;

	// Set up a renderer. This will allow WebGL to make your scene appear
	renderer = new THREE.WebGLRenderer( { antialias: true } );

	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize(canvasWidth, canvasHeight);
	renderer.setClearColor( 0xAAAAAA, 1.0 );
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.BasicShadowMap;

	// You also want a camera. The camera has a default position, but you most likely want to change this.
	// You'll also want to allow a viewpoint that is reminiscent of using the machine as described in the pdf
	// This might include a different position and/or a different field of view etc.
	camera = new THREE.PerspectiveCamera( 45, canvasRatio, 1, 4000 );
	// Moving the camera with the mouse is simple enough - so this is provided. However, note that by default,
	// the keyboard moves the viewpoint as well
	cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
	camera.position.set( -1435,951, -20);
	cameraControls.target.set(35,396,-17);
}

	// We want our document object model (a javascript / HTML construct) to include our canvas
	// These allow for easy integration of webGL and HTML
function addToDOM() {
    var canvas = document.getElementById('canvas');
    canvas.appendChild(renderer.domElement);
}

	// This is a browser callback for repainting
	// Since you might change view, or move things
	// We cant to update what appears
function animate() {
	window.requestAnimationFrame(animate);
	render();
}

	// getDelta comes from THREE.js - this tells how much time passed since this was last called
	// This might be useful if time is needed to make things appear smooth, in any animation, or calculation
	// The following function stores this, and also renders the scene based on the defined scene and camera
function render() {
	var delta = clock.getDelta();
	cameraControls.update(delta);
	scene.simulate();
	renderer.render(scene, camera);

}

	// Since we're such talented programmers, we include some exception handeling in case we break something
	// a try and catch accomplished this as it often does
	// The sequence below includes initialization, filling up the scene, adding this to the DOM, and animating (updating what appears)
try {
  init();
  fillScene();
  addToDOM();
  animate();
} catch(error) {
    console.log("You did something bordering on utter madness. Error was:");
    console.log(error);
}
