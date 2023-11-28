<template>
    <div>
      <canvas ref="canvas"></canvas>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import * as THREE from 'three';
  
  const canvasRef = ref(null);
  let mouseX = 0;
  let mouseY = 0;
  
  onMounted(() => {
    // 初始化场景
    const scene = new THREE.Scene();
  
    // 初始化相机
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
  
    // 初始化渲染器
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value });
    renderer.setSize(window.innerWidth, window.innerHeight);
  
    // 创建地球
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('@/assets/earth.jpg'); // 替换为你的地球纹理图路径
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const earth = new THREE.Mesh(geometry, material);
    scene.add(earth);
  
    // 添加光源
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
  
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);
  
    // 鼠标移动事件监听
    window.addEventListener('mousemove', (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });
  
    // 动画循环
    const animate = () => {
      requestAnimationFrame(animate);
  
      // 地球旋转
      earth.rotation.y += 0.005;
  
      // 更新相机位置
      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (-mouseY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);
  
      // 渲染场景
      renderer.render(scene, camera);
    };
  
    // 调整窗口大小时更新相机投影
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  
    // 启动动画循环
    animate();
  });
  </script>
  
  <style>
    canvas {
      display: block;
    }
  </style>
  