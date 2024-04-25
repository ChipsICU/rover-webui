import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer; 
let light, controls, loadedModel;
var usemesh = false;

init_scene();
load_model();
animate();

function init_scene() {
  // 定义画布
  const canvas = document.getElementById('three-canvas');

  renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setPixelRatio(window.devicePixelRatio);

  const canvasRect = canvas.getBoundingClientRect();
  renderer.setSize(canvasRect.width, canvasRect.height);

  camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
  camera.position.set(1, 2, 2);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // 设置阻尼
  controls.dampingFactor = 0.25; // 阻尼系数
  controls.update();

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 600, 3000); // 设置雾效果
  scene.background = new THREE.Color(0xe8e8e8); // 背景色
  // let scene_bg = new THREE.TextureLoader().load('images/background.jpg');
  // scene.background = scene_bg;
  // 添加光源
  const hemisphereLight = new THREE.HemisphereLight(0xffaea8, 0x7f0900, 1);
  hemisphereLight.position.set(0, 50, 60);
  scene.add(hemisphereLight);

  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(100, 60, 100);
  scene.add(spotLight);

  light = new THREE.PointLight(0xffff00, 1, 100);
  light.position.set(0, 0, 0);
  scene.add(light);

  window.addEventListener('resize', onWindowResize, false); // 确保窗口调整时的响应
}

function onWindowResize() {
  const canvas = document.getElementById('three-canvas');
  const canvasRect = canvas.getBoundingClientRect(); // 使用canvas的尺寸
  camera.aspect = canvasRect.width / canvasRect.height;
  camera.updateProjectionMatrix();
  renderer.setSize(canvasRect.width, canvasRect.height); // 更新到canvas的尺寸
}

function load_model() {
  const textureUrls = [
    'textures/Rover_BackParts__C_Nr_6.png',
    'textures/Rover_chasis__C_Nr_0.png',
    'textures/Rover_ControlPannel__C_Nr_3.png',
    'textures/Rover_DampingScrews__C_5.png',
    'textures/Rover_FrontParts__C_Nr_2.png',
    'textures/Rover_seats__C_Nr_4.png',
    'textures/Rover_Wheels__C_Nr_1.png',
  ];
  const textures = {};
  const textureLoader = new THREE.TextureLoader();
  textureUrls.forEach((url, index) => {
    const textureName = `texture${index + 1}`;
    textures[textureName] = textureLoader.load(url);
  });


  const modelUrl = '3d-object/LRV02_che02_nurColor.glb'; // 模型文件路径
  const loader = new GLTFLoader();

  loader.load(
    modelUrl,
    function (glbf) {
      scene.add(glbf.scene);
      loadedModel = glbf.scene;
      console.log(loadedModel);

      if (usemesh) {
        loadedModel.traverse((child) => {
          if (child.isMesh) {
            const textureToUse = textures['texture1']; // 选择其中一个纹理
            child.material.map = textureToUse; // 将纹理应用到Mesh的材质
          }
        });
      };
      console.log('Model has been added to the scene.');
    },
    function (xhr) {
      console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`); // 显示加载进度
    },
    function (error) {
      console.error('An error happened', error); // 输出错误信息
    }
  );
}

function animate() {
  requestAnimationFrame(animate); // 确保动画循环
  const time = Date.now() * 0.0005;

  if (light) {
    light.position.x = Math.sin(time * 0.7) * 50; // 光源移动
    light.position.z = Math.sin(time * 0.5) * 50; 
  }

  if (loadedModel) {
    loadedModel.rotation.y += 0.01; // 使模型旋转
  }

  controls.update(); // 更新 OrbitControls

  renderer.render(scene, camera); // 渲染场景
}
