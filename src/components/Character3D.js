import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Character3D = ({ modelUrl, scale = 1, position = [0, 0, 0] }) => {
    const mountRef = useRef(null);

    useEffect(() => {
        // Настройка сцены
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f0f0);

        // Настройка камеры
        const camera = new THREE.PerspectiveCamera(
            75,
            mountRef.current.clientWidth / mountRef.current.clientHeight,
            0.1,
            1000
        );
        camera.position.z = 5;

        // Настройка рендерера
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        mountRef.current.appendChild(renderer.domElement);

        // Добавление освещения
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, 1, 1);
        scene.add(directionalLight);

        // Добавление контролов для вращения модели
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

        // Загрузка модели
        const loader = new GLTFLoader();
        let model;

        loader.load(
            modelUrl,
            (gltf) => {
                model = gltf.scene;
                model.scale.set(scale, scale, scale);
                model.position.set(...position);
                scene.add(model);
            },
            undefined,
            (error) => {
                console.error('Error loading model:', error);
            }
        );

        // Функция анимации
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Обработка изменения размера окна
        const handleResize = () => {
            camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        // Очистка
        return () => {
            window.removeEventListener('resize', handleResize);
            mountRef.current.removeChild(renderer.domElement);
            scene.remove(model);
            renderer.dispose();
        };
    }, [modelUrl, scale, position]);

    return (
        <div
            ref={mountRef}
            style={{
                width: '100%',
                height: '400px',
                position: 'relative'
            }}
        />
    );
};

export default Character3D; 