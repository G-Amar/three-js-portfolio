import './style.css';

import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { FlyControls } from 'three/examples/jsm/controls/FlyControls';


//start on page 1
document.getElementById('Sun').scrollIntoView({ behavior: 'smooth', block: 'start' });

let disableScroll = false;
let disableScrollCountdown = 0;
const ANIMATION_FRAMES = 100;

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
})

camera.position.setZ(20)
camera.position.setY(5)

// Set up the camera position based on initial viewport size
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight);

// Function to update camera aspect ratio
function updateCameraAspect() {
  const currentViewportWidth = window.innerWidth;
  const currentViewportHeight = window.innerHeight;
  const aspect = currentViewportWidth / currentViewportHeight;

  // Adjust the camera's aspect ratio to match the new viewport size
  camera.aspect = aspect;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(currentViewportWidth, currentViewportHeight);
}

// Function to handle window resize events
function onWindowResize() {
  updateCameraAspect();
}

// Add a listener for window resize events
window.addEventListener('resize', onWindowResize);

//deafult position for objects is (0,0,0)

function constructTorus(){
  const geometry = new THREE.TorusGeometry(8, 2, 16, 100)
  const material = new THREE.MeshStandardMaterial({color: 0xccccff, wireframe: true})
  const torus = new THREE.Mesh(geometry, material)
  return torus
}

const torus = constructTorus()
scene.add(torus)

const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(0,0,0)
scene.add(pointLight)

const ambientLight = new THREE.AmbientLight(0xffffff)
scene.add(ambientLight)

//add background, make it a transparent sphere
const spaceTexture = new THREE.TextureLoader().load('textures/8k_stars_milky_way.jpg')
const spaceGeometry = new THREE.SphereGeometry(250, 32, 32);
const spaceMaterial = new THREE.MeshBasicMaterial({ map:spaceTexture, color: 0x555555 });
const space = new THREE.Mesh(spaceGeometry, spaceMaterial);
space.material.side = THREE.BackSide
scene.add(space);

const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(500, 100)
// scene.add(lightHelper, gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement)
// controls.maxDistance = 200
// controls.minDistance = 15

// // Create the Sun
// const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
// const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffd700 });
// const sun = new THREE.Mesh(sunGeometry, sunMaterial);
// scene.add(sun);

// Create the planets
const planets = {};
const planetData = [
  { name: 'Sun', distance: 0, size: 5, color: 0xffcc00, orbitSpeed: 0.002, texturePath: 'textures/2k_sun.jpg' },
  { name: 'Mercury', distance: 20, size: 1, color: 0xa5a5a5, orbitSpeed: 0.0035, texturePath: 'textures/2k_mercury.jpg' },
  { name: 'Venus', distance: 30, size: 1.5, color: 0xe1b881, orbitSpeed: 0.0028, texturePath: 'textures/2k_venus_surface.jpg' },
  { name: 'Earth', distance: 40, size: 1.5, color: 0x6190e8, orbitSpeed: 0.0033, texturePath: 'textures/2k_earth_daymap.jpg' },
  { name: 'Mars', distance: 55, size: 1, color: 0xbf3f3f, orbitSpeed: 0.0037, texturePath: 'textures/2k_mars.jpg' },
  { name: 'Jupiter', distance: 80, size: 5, color: 0xe09f6b, orbitSpeed: 0.004, texturePath: 'textures/2k_jupiter.jpg' },
  { name: 'Saturn', distance: 110, size: 4.5, color: 0xcfad7c, orbitSpeed: 0.003, texturePath: 'textures/2k_saturn.jpg' },
  { name: 'Uranus', distance: 140, size: 3, color: 0x80c3cd, orbitSpeed: 0.0022, texturePath: 'textures/2k_uranus.jpg' },
  { name: 'Neptune', distance: 170, size: 3, color: 0x34495e, orbitSpeed: 0.001, texturePath: 'textures/2k_neptune.jpg' },
];

planetData.forEach((planetInfo) => {
  const planetGeometry = new THREE.SphereGeometry(planetInfo.size, 32, 32);
  const planetTexture = new THREE.TextureLoader().load(planetInfo.texturePath)
  const planetMaterial = new THREE.MeshBasicMaterial({ color: planetInfo.color, map: planetTexture });
  const planet = new THREE.Mesh(planetGeometry, planetMaterial);
  planet.position.x = planetInfo.distance;
  scene.add(planet);
  planets[planetInfo.name] = { mesh: planet, distance: planetInfo.distance, orbitSpeed: planetInfo.orbitSpeed, angle: Math.random() * Math.PI * 2 };
});

const moonGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const moonTexture = new THREE.TextureLoader().load('textures/2k_moon.jpg')
const moonMaterial = new THREE.MeshBasicMaterial({ color: 0xd3d3d3, map: moonTexture });
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
planets['Earth'].mesh.add(moon);
moon.position.set(3, 0, 0); // Position the moon relative to Earth

// Create Saturn's Ring
const ringGeometry = new THREE.TorusGeometry(7, 2, 2, 100);
const ringTexture = new THREE.TextureLoader().load('textures/2k_saturn_ring_alpha.png')
const ringMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, map: ringTexture });
ringMaterial.map.rotation = Math.PI / 2;
const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
ringMesh.rotation.x = Math.PI / 3; // Rotate the ring to be parallel to the ground
planets['Saturn'].mesh.add(ringMesh);

// cube textureing is super buggy right now, leaving it for later
// const cubeGeometry = new THREE.BoxGeometry(2,2,2);
// const cubeTexture = new THREE.TextureLoader().load('textures/headshot.jpg', () => {
//   const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xc0c0c0, map: cubeTexture });
//   const cube1 = new THREE.Mesh(cubeGeometry, cubeMaterial);
//   planets['Sun'].mesh.add(cube1);
//   cube1.position.set(0, 6.5, 0); 
// })
// const cube2 = new THREE.Mesh(cubeGeometry, cubeMaterial);
// planets['Sun'].mesh.add(cube2);
// const cube3 = new THREE.Mesh(cubeGeometry, cubeMaterial);
// planets['Sun'].mesh.add(cube3);
// const cube4 = new THREE.Mesh(cubeGeometry, cubeMaterial);
// planets['Sun'].mesh.add(cube4);
// Position the cube relative to Sun
// cube2.position.set(-6.5, 0, 0); 
// cube3.position.set(0, 6.5, 0); 
// cube4.position.set(0, -6.5, 0); 


const starGeometry = new THREE.SphereGeometry(0.2, 25, 25);
const starMaterial = new THREE.MeshStandardMaterial( {color: 0xffffff} );

function addStar() {
  const star = new THREE.Mesh(starGeometry, starMaterial);

  //generate random coordinates
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(500));
  star.position.set(x,y,z);

  scene.add(star);
}

Array(500).fill().forEach(addStar)

function rotateTorus(){
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.01;
  torus.rotation.z += 0.01;
}



// Set up the camera position
const initialCameraPosition = new THREE.Vector3(0, 5, 20);
let currentPlanetIndex = 0;
let currentPlanet = 'Sun'
camera.position.copy(initialCameraPosition);

// modern Chrome requires { passive: false } when adding event
let supportsPassive = false;
try {
  window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
    get: function () { supportsPassive = true; } 
  }));
} catch(e) {}



const wheelOpt = supportsPassive ? { passive: false } : false;
const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

let prevTouchY = null;

function customScroll(event){
  // console.log(event, event.type, wheelEvent)

  const isTouchmove = event.type === 'touchmove';

  //prevent default if movement key or wheel event
  const movementKeys = [32, 33, 34, 35, 36, 37, 38, 39, 40];
  if (movementKeys.includes(event.keyCode) || event.type === wheelEvent || isTouchmove) {
    event.preventDefault();
    // console.log('Prevented')
  }

  let delta = 0;

  if (isTouchmove){
    const touchY = event.touches[0].clientY;
    delta = (prevTouchY !== null) ? (prevTouchY - touchY) : 0
    prevTouchY = touchY;
    // console.log(delta)
  } else {
    delta = event.deltaY;
  }

  if (disableScroll) return;

  const pastIndex = currentPlanetIndex;
  
  const key = event.code ? event.code : '';

  const moveDown = delta > 0 || key === 'ArrowDown' || key === 'ArrowRight' || key === 'PageDown' || key === 'Space'
  const moveUp = delta < 0 || key === 'ArrowUp' || key === 'ArrowLeft' || key === 'PageUp' 

  if (moveDown) {
    // Scroll down, jump to the next planet
    currentPlanetIndex = Math.min((currentPlanetIndex + 1), planetData.length-1);
  } else if (moveUp) {
    // Scroll up, jump to the previous planet
    currentPlanetIndex = Math.max((currentPlanetIndex - 1), 0);
  }

  // console.log(pastIndex, currentPlanetIndex)
  if (pastIndex === currentPlanetIndex) return;

  const planetName = planetData[currentPlanetIndex].name
  
  moveToPlanet(planetName);
  
}

const planetNumberMap = {
  'Sun': 0,
  'Mercury': 1,
  'Venus': 2,
  'Earth': 3,
  'Mars': 4,
  'Jupiter': 5,
  'Saturn': 6,
  'Uranus': 7,
  'Neptune': 8,
}

const pagePlanetMap = {
  'home' : 'Sun',
  'about' : 'Mercury',
  'experience' : 'Venus',
  'skills' : 'Earth',
  'education' : 'Mars',
  'projects' : 'Jupiter',
  'awards' : 'Saturn',
  'socials' : 'Uranus',
  'end' : 'Neptune'
}

//add onClick to each of the buttons to move to respective planet
for (const page in pagePlanetMap){
  const btn = document.getElementById(page)
  const destination = pagePlanetMap[page]
  btn.addEventListener('click', () => moveToPlanet(destination))
  // console.log(btn)
}

function moveToPlanet(planetName) {
  //dont move if we already at this planet
  if (currentPlanet === planetName) return;
  if (disableScroll) return;
  
  //scroll page into view
  const planetSection = document.getElementById(planetName);
  planetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

  //get angle and position for the camera
  const angle = planets[planetName].angle + (0.75/ (planetNumberMap[planetName]+1))
  const distance = planets[planetName].distance + 15 //want to be slightly further out
  const x = distance * Math.cos(angle);
  const y = planets[planetName].mesh.position.y + 5  //stay slightly above
  const z = distance * Math.sin(angle);
  //animate camera
  gsap.to(camera.position, { x: x, y: y, z: z, duration: ANIMATION_FRAMES/60 });

  // console.log(planetName)

  disableScroll = true;
  disableScrollCountdown = ANIMATION_FRAMES;

   //update planet name and index
  currentPlanetIndex = planetNumberMap[planetName]
  currentPlanet = planetName
}

//limit the touch actions to the container, rather than window
const container = document.getElementById('container')
// mobile
container.addEventListener('touchmove', customScroll, wheelOpt);

// Scroll-based navigation
// mousewheel
window.addEventListener(wheelEvent, customScroll, wheelOpt);
// older FF
window.addEventListener('DOMMouseScroll', customScroll, false);
// keydown
window.addEventListener('keydown', customScroll, false);

window.addEventListener('touchend', (e) => prevTouchY=null);

let clock = new THREE.Clock();
let delta = 0;
// 60 fps, limit as higher refresh rate is breaking it
let interval = 1 / 60;

// Animation loop
function animate() {
  requestAnimationFrame( animate );
  delta += clock.getDelta();

  if (delta  > interval) {
    
    if(disableScroll){
      disableScrollCountdown -= 1
      if (disableScrollCountdown === 0){
        disableScroll = false
      }
    }
    else {    
      // Move the planets around the Sun
      for (const planet in planets){
        const planetObject = planets[planet]
        const { mesh, distance, orbitSpeed } = planetObject;
        planetObject.angle += orbitSpeed;
        const x = distance * Math.cos(planetObject.angle);
        const z = distance * Math.sin(planetObject.angle);
        mesh.position.set(x, 0, z);
        mesh.rotation.y += 0.01
      };
      
      rotateTorus();
      
      // controls.update();
      
      //update camera
      const planetName = planetData[currentPlanetIndex].name
      const angle = planets[planetName].angle + (0.75/ (currentPlanetIndex+1))
      const distance = planets[planetName].distance + 15 //want to be slightly further out
      const x = distance * Math.cos(angle);
      const y = planets[planetName].mesh.position.y + 5  //stay slightly above
      const z = distance * Math.sin(angle);
      
      const cameraPosition = new THREE.Vector3(x, y, z);
      camera.position.copy(cameraPosition);
    }
    camera.lookAt(0,0,0)
    
    renderer.render(scene, camera);

    delta = delta % interval;
  }
}

animate();