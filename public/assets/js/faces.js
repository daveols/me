var Faces = {
	
	container 	: null,
	audioPlayer : null,
	audioSource	: null,
	stats				: null,
	camera 			: null,
	scene 			: null,
	renderer 		: null,
	particle 		: null,
	mouseX 			: 0,
	mouseY 			: 0,
	windowHalfX	: 0,
	windowHalfY	: 0,
	isTouched		: false,
	isFirefox 	: false,
	songs				: [
		'https://a.tumblr.com/tumblr_mtjkuxYt0Q1sy6sdno1.mp3#_=_', 			// where is my mind
		'http://salmonofcapistrano.com/resources/audio/waterfalls.mp3', // waterfalls
		'https://a.tumblr.com/tumblr_mp95sp8EV51sy6sdno1.mp3#_=_', 			// stayin' alive
		'https://a.tumblr.com/tumblr_mw2b37FtnG1sy6sdno1.mp3#_=_', 			// is this love
	],

	windowInit : function() {
		var self = Faces;
		if (!window.location.hash) {
			if (document.height < window.outerHeight) {
				document.body.style.height = (window.outerHeight + 50) + 'px';
			}

			setTimeout(self.init, 50);
		}
	},

	init : function() {
		var self = Faces;

		window.scrollTo(0, 1);

		self.windowHalfX = window.innerWidth / 2;
		self.windowHalfY = window.innerHeight / 2;

		self.container = document.getElementById('faces-container');
		self.audioPlayer = document.getElementById('audio-player');		
		self.audioSource = document.getElementById('audio-source');

		self.isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
	   
		self.camera = new THREE.Camera(60, window.innerWidth / window.innerHeight, 1, 3000); // fov, aspect, near, far
		self.camera.position.z = 1000;

		self.scene = new THREE.Scene();		
		
		for (var i = 0; i < 200; i++) {
			num = Math.floor(Math.random() * 6);
			particle = new THREE.Particle(new THREE.ParticleBasicMaterial({ map: document.getElementById('face-source-' + num) }));
			particle.position.x = Math.random() * 2000 - 1000;
			particle.position.y = Math.random() * 2000 - 1000;
			particle.position.z = Math.random() * 2000 - 1000;
			self.scene.addObject(particle);
		}

		self.renderer = new THREE.CanvasRenderer();
		self.renderer.setSize(window.innerWidth, window.innerHeight);
		self.container.appendChild(self.renderer.domElement);
		self.audioSource.setAttribute('src', self.songs[Math.floor(Math.random() * self.songs.length)])
		self.audioPlayer.load()
		self.audioPlayer.play()		

		document.addEventListener('mousemove', self.mouseMove, false);
		document.addEventListener('touchstart', self.touchStart, false);
		document.addEventListener('touchend', self.touchEnd, false);
		document.addEventListener('touchmove', self.touchMove, false);
		window.addEventListener('devicemotion', self.deviceMotion, false);
		window.addEventListener('orientationchange', self.orientationChange, false);		

		setInterval(self.loop, 1000 / 60);
	},

	mouseMove : function(event) {
		var self = Faces;

		self.mouseX = event.clientX - self.windowHalfX;
		self.mouseY = event.clientY - self.windowHalfY;
	},

	touchStart : function() {
		var self = Faces;

		self.isTouched = true;
		self.touchMove();
	},

	touchEnd : function() {
		var self = Faces;

		self.isTouched = false;
	},

	touchMove : function(event) {
		var self = Faces;

		if (event.touches.length == 1) {
			event.preventDefault();

			self.mouseX = event.touches[0].pageX - self.windowHalfX;
			self.mouseY = event.touches[0].pageY - self.windowHalfY;
		}
	},

	deviceMotion : function(event) {
		var self = Faces;
		if (!self.isFirefox) {
			if (!self.isTouched) {
				self.mouseX = event.accelerationIncludingGravity.x * 100;
				self.mouseY = -event.accelerationIncludingGravity.y * 100;
			}
		}
	},

	orientationChange : function() {
		var self = Faces;

		if (self.container.hasChildNodes()) {
		    while (self.container.childNodes.length >= 1) {
		        self.container.removeChild(self.container.firstChild);       
			} 
		}

		self.init();
		self.hideAddressBar();
	},

	loop : function() {
		var self = Faces;

		self.camera.position.x += (self.mouseX - self.camera.position.x) * 0.05;
		self.camera.position.y += (-self.mouseY - self.camera.position.y) * 0.05;
		self.renderer.render(self.scene, self.camera);
	}
 }