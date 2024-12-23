"use client"

import React, {useEffect, useRef} from "react";
import * as THREE from "three";
// @ts-expect-error No type
import {GLTF, GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
// @ts-expect-error No type
import {AnimationMixer} from "three/src/animation/AnimationMixer";

export default function BlackHole() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(false);

  useEffect(() => {
    if (containerRef.current && !isMounted.current) {
      isMounted.current = true;
      const camera = new THREE.PerspectiveCamera(
        10,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );

      camera.position.z = 13;

      const scene = new THREE.Scene();
      let blackHole: GLTF | null = null;
      let mixer: AnimationMixer;

      const loader = new GLTFLoader();
      loader.load("/blackhole.glb",
        function (gltf: GLTF) {
          if (blackHole === null) {
            blackHole = gltf.scene;
            blackHole.rotation.x = 0.4;
            scene.add(blackHole);
            mixer = new THREE.AnimationMixer(blackHole);
            mixer.clipAction(gltf.animations[0]).play();
          }
        },
        function () {

        },
        function (error: unknown) {
          console.log(error);
        }
      );

      const renderer = new THREE.WebGLRenderer({alpha: true});
      renderer.setSize(window.innerWidth, window.innerHeight);
      containerRef.current.appendChild(renderer.domElement);

      // light
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);

      ambientLight.position.set(0, 0, 0);
      // scene.add(ambientLight);

      // const topLight = new THREE.DirectionalLight(0xffffff, 1);
      //
      // topLight.position.set(500, 500, 500);
      // scene.add(topLight);

      const reRender3D = () => {
        requestAnimationFrame(reRender3D);
        renderer.render(scene, camera);
        if (mixer) mixer.update(0.001);
      }

      reRender3D();

      return () => reRender3D();
    }
  }, []);


  return (
    <div ref={containerRef} className="flex justify-center absolute -z-1 inset-0 pointer-events-none overflow-hidden blur-[2px]"/>
  )
}
