import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js';

const scene = new THREE.Scene(); // o ambiente
scene.background = new THREE.Color(0x169EC7); //cor do "céu"

const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//-------------------------------- CARRO --------------------------------
var car_tam = 2.5;

//Parte de baixo do carro
const formato = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00008B }); // o material standard precisa de luz
const carroceria = new THREE.Mesh(formato, material);
carroceria.scale.set(2, 1, car_tam);
//Parte de cima do carro
const carroceria1 = new THREE.Mesh(formato, material);
carroceria1.position.y = 0.75;
carroceria1.scale.set(2, 0.75, 0.5);

//Formatação dos Pneus

var pos_y = -0.5;

const forma_pneu = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 128);
const mat_pneu = new THREE.MeshBasicMaterial({ color: 0x757575 });
function criarPneu(x, z) {
  const pneu = new THREE.Mesh(forma_pneu, mat_pneu);
  pneu.position.set(x, pos_y, z);
  pneu.rotation.x = Math.PI / 2;
  pneu.rotation.z = Math.PI / 2;
  return pneu;
}


const form_farol = new THREE.PlaneGeometry(0.4, 0.3);
const mat_farol = new THREE.MeshBasicMaterial({ color: 0xDE1A00});
const farolD = new THREE.Mesh(form_farol, mat_farol);
const farolE = new THREE.Mesh(form_farol, mat_farol);
farolD.position.z = (car_tam/2) + 0.01;
farolD.position.x = -0.75;
farolE.position.z = (car_tam/2) + 0.01;
farolE.position.x = 0.75;

const form_pisca = new THREE.PlaneGeometry(0.2, 0.3);
const mat_pisca = new THREE.MeshBasicMaterial({ color: 0xEDFF00});
const piscaD = new THREE.Mesh(form_pisca, mat_pisca);
const piscaE = new THREE.Mesh(form_pisca, mat_pisca);
piscaD.position.z = (car_tam/2) + 0.011;
piscaD.position.x = -0.65;
piscaE.position.z = (car_tam/2) + 0.011;
piscaE.position.x = 0.65;

const carro = new THREE.Group();
carro.add(carroceria); //adicionando o cubo para o grupo
carro.add(carroceria1);
carro.add(farolD);
carro.add(farolE);
carro.add(piscaD);
carro.add(piscaE);
carro.add(
  criarPneu(-0.9, -0.65),
  criarPneu(0.9, -0.65),
  criarPneu(-0.9, 0.65),
  criarPneu(0.9, 0.65)
);
scene.add(carro);

//-------------------------------- TERRENO --------------------------------
const form_terra = new THREE.PlaneGeometry(1000, 1000);
const mat_terra = new THREE.MeshBasicMaterial({color: 0x228B22});
const terra = new THREE.Mesh(form_terra, mat_terra);
terra.rotation.x = -Math.PI/2;
terra.position.y = pos_y - 0.4;

const estrada = new THREE.Group();

var larg_pista = 12;

const form_pista = new THREE.PlaneGeometry(larg_pista, 1000);
const mat_pista = new THREE.MeshBasicMaterial({color: 0x000000});
const pista = new THREE.Mesh(form_pista, mat_pista);
pista.rotation.x = -Math.PI/2;
pista.position.y = pos_y - 0.36;

//Configuração da calaçada
const form_calc = new THREE.PlaneGeometry(3, 1000);
const mat_calc = new THREE.MeshBasicMaterial({ color: 0x555555});
const calcadaD = new THREE.Mesh(form_calc, mat_calc);
const calcadaE = new THREE.Mesh(form_calc, mat_calc);
calcadaD.rotation.x = -Math.PI/2;
calcadaE.rotation.x = -Math.PI/2;
calcadaD.position.y = pos_y - 0.355;
calcadaE.position.y = pos_y - 0.355;
calcadaD.position.x = (larg_pista/2) + 1;
calcadaE.position.x = -(larg_pista/2) - 1;

scene.add(calcadaD);
scene.add(calcadaE);

const form_faixa = new THREE.PlaneGeometry(0.3, 2);
const mat_faixa = new THREE.MeshBasicMaterial({color: 0xFFFFFF});
for (let i = -495; i < 500; i += 5) {
  const faixa = new THREE.Mesh(form_faixa, mat_faixa);

  faixa.rotation.x = -Math.PI / 2;
  faixa.position.y = pos_y - 0.35;
  faixa.position.z = i;

  estrada.add(faixa);
}



estrada.add(pista)
scene.add(estrada);
scene.add(terra);
//-------------------------------- MOVIMENTOS --------------------------------
const keys = {};

document.addEventListener("keydown", (event) => {
  keys[event.key.toLowerCase()] = true;
});

document.addEventListener("keyup", (event) => {
  keys[event.key.toLowerCase()] = false;
});


const speed = 1;
const offset = new THREE.Vector3(0, 4, 8);
function animate() {
  requestAnimationFrame(animate);

  if (keys["w"]) carro.position.z -= speed;
  if (keys["s"]) carro.position.z += speed;
  if (keys["a"]) carro.position.x -= speed;
  if (keys["d"]) carro.position.x += speed;
  
  const cameraPosition = offset.clone().add(carro.position);

  camera.position.copy(cameraPosition);

  camera.lookAt(carro.position);

  renderer.render(scene, camera);
}
camera.position.z = 5;
camera.position.y = 4;
camera.rotation.x = -(Math.PI/6);



animate();