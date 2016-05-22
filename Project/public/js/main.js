var container, scene, camera, renderer;

var controls;

init();
animate();

function init() {
	// Setup
	container = document.getElementById( 'container' );

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z = 5;

	renderer = new THREE.WebGLRenderer( { alpha: true} );
	renderer.setSize( window.innerWidth, window.innerHeight);


	// Load game world

	firebase.auth().onAuthStateChanged(function( user ) {
		if ( user ) {
			// User is signed in

			console.log( "Player is signed in " );
			playerID = user.uid;

			fbRef.child( "Players/" + playerID + "/isOnline" ).once( "value" ).then( function( isOnline ) {

				if ( isOnline.val() === null || isOnline.val() === false ) {
					loadGame();
				} else {
					alert( "Hey, only one session at a time buddy!" );
				}
			});


		} else {
			// User is signed out
			console.log( "Player is signed out " );

			firebase.auth().signInAnonymously().catch(function(error) {
				console.log( error.code + ": " + error.message );
			})
		}
	});


	// Events
	window.addEventListener( "resize", onWindowResize, false );

	container.appendChild( renderer.domElement );
	document.body.appendChild( container );
}

function animate() {
	requestAnimationFrame( animate );

	if ( controls ) {
		controls.update();
	}
	
	render();
}

function render() {

	renderer.clear();
	renderer.render( scene, camera );
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	
	renderer.setSize( window.innerWidth, window.innerHeight );
}