"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { anim, backgroundVariant, displayVariant } from "@/constants/variants";
import { getFresnelMat, getStarfield } from "@/components/threejs/Earth/utils";
import {
  AdditiveBlending,
  AgXToneMapping,
  AnimationMixer,
  Clock,
  DirectionalLight,
  Group,
  IcosahedronGeometry,
  LinearSRGBColorSpace,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  TextureLoader,
  Vector2,
  WebGLRenderer,
} from "three";
import {
  EffectComposer,
  GLTF,
  GLTFLoader,
  OrbitControls,
  RenderPass,
  UnrealBloomPass,
} from "three-stdlib";
// @ts-expect-error There is no type file about the outputpass
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { AudioLines } from "lucide-react";

const ANIMATION_DURATION = 40; // Animasyon süresi (saniye)
const EARTH_DETAIL = 12;

export default function Earth() {
  const t = useTranslations("404");

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isClickedViewButton, setIsClickedViewButton] = useState(false);
  const [isAnimationEnd, setIsAnimationEnd] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      const clock = new Clock();
      let startTime: number = 0;
      let animationStarted = false;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const scene = new Scene();
      const camera = new PerspectiveCamera(75, w / h, 0.1, 1000);
      camera.position.z = 2;
      const renderer = new WebGLRenderer({ antialias: true });
      renderer.setSize(w, h);
      containerRef.current.appendChild(renderer.domElement);

      renderer.toneMapping = AgXToneMapping;
      renderer.outputColorSpace = LinearSRGBColorSpace;

      const earthGroup = new Group();
      earthGroup.rotation.z = (-23.4 * Math.PI) / 180;
      scene.add(earthGroup);
      const loader = new TextureLoader();
      const geometry = new IcosahedronGeometry(1, EARTH_DETAIL);
      const material = new MeshPhongMaterial({
        map: loader.load("/textures/00_earthmap1k.jpg"),
        specularMap: loader.load("/textures/02_earthspec1k.jpg"),
        bumpMap: loader.load("/textures/01_earthbump1k.jpg"),
        bumpScale: 0.04,
      });
      // material.map.colorSpace = THREE.SRGBColorSpace;
      const earthMesh = new Mesh(geometry, material);
      earthGroup.add(earthMesh);

      const lightsMat = new MeshBasicMaterial({
        map: loader.load("/textures/03_earthlights1k.jpg"),
        blending: AdditiveBlending,
      });
      const lightsMesh = new Mesh(geometry, lightsMat);
      earthGroup.add(lightsMesh);

      let blackHole: Group | null = null;
      let mixer: AnimationMixer;

      const gltfLoader = new GLTFLoader();
      gltfLoader.load(
        "/textures/blackhole.glb",
        function (gltf: GLTF) {
          if (blackHole === null) {
            blackHole = gltf.scene;
            blackHole!.scale.set(50, 50, 35);
            blackHole!.rotation.x = -0.2;
            blackHole!.rotation.z = Math.PI;
            blackHole!.position.z = -25;

            const blackHoleLight = new DirectionalLight("rgb(255,255,255)", 3);
            // const lightHelper = new THREE.DirectionalLightHelper(blackHoleLight, 5); // 5 birim boyutunda
            // scene.add(lightHelper);
            blackHoleLight.position.y = -5;
            blackHole?.add(blackHoleLight);
            scene.add(blackHole!);
            mixer = new AnimationMixer(blackHole!);
            mixer.clipAction(gltf.animations[0]).play();
          }
        },
        function () {},
        function (error: unknown) {
          console.log(error);
        },
      );

      const cloudsMat = new MeshStandardMaterial({
        map: loader.load("/textures/04_earthcloudmap.jpg"),
        transparent: true,
        opacity: 0.8,
        blending: AdditiveBlending,
        alphaMap: loader.load("/textures/05_earthcloudmaptrans.jpg"),
      });
      const cloudsMesh = new Mesh(geometry, cloudsMat);
      cloudsMesh.scale.setScalar(1.003);
      earthGroup.add(cloudsMesh);

      const fresnelMat = getFresnelMat();
      const glowMesh = new Mesh(geometry, fresnelMat);
      glowMesh.scale.setScalar(1.01);
      earthGroup.add(glowMesh);

      const stars = getStarfield({ numStars: 2000 });
      scene.add(stars);

      const sunLight = new DirectionalLight("rgb(255,255,255)", 0.5);
      sunLight.position.set(-2, 0.5, 1.5);
      scene.add(sunLight);

      const renderScene = new RenderPass(scene, camera);

      const bloomPass = new UnrealBloomPass(
        new Vector2(window.innerWidth, window.innerHeight),
        1.0,
        0.5,
        0.1,
      );

      const outputPass = new OutputPass();

      const composer = new EffectComposer(renderer);
      composer.addPass(renderScene);
      composer.addPass(bloomPass);
      composer.addPass(outputPass);

      function easeInExpo(x: number): number {
        return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
      }

      let runOnce = false;

      function animate() {
        if (animationStarted && !runOnce) {
          const elapsedTime = clock.getElapsedTime() - startTime;
          const progress = Math.min(
            easeInExpo(elapsedTime / ANIMATION_DURATION),
            1,
          ); // Easing ile dönüşüm ilerlemesi

          camera.rotation.z = MathUtils.lerp(0, Math.PI / 1.16, progress);
          camera.position.z = MathUtils.lerp(2, 100, progress);

          // Animasyon bitmis demektir
          if (progress === 1) {
            setIsAnimationEnd(true);
            if (!runOnce) {
              runOnce = true;
              new OrbitControls(camera, renderer.domElement);
              camera.rotation.z = Math.PI / 1.16;
            }
          }
        }
        requestAnimationFrame(animate);
        composer.render();
        earthMesh.rotation.y += 0.0002;
        lightsMesh.rotation.y += 0.0002;
        cloudsMesh.rotation.y += 0.00022;
        glowMesh.rotation.y += 0.0002;
        // stars.rotation.y += 0.0002;
        if (mixer) mixer.update(0.001);
      }

      function startAnimation() {
        if (!animationStarted) {
          animationStarted = true;
          try {
            audioRef.current?.play();
          } catch (e: unknown) {
            console.log(e);
          }
          startTime = clock.getElapsedTime();
        }
      }

      animate();
      buttonRef.current?.addEventListener("click", startAnimation);

      function handleWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }

      window.addEventListener("resize", handleWindowResize, false);
    }
  }, []);

  return (
    <div className="absolute inset-0 flex justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        {!isClickedViewButton && (
          <motion.div
            {...anim(backgroundVariant)}
            className="fixed inset-0 z-overlay flex h-screen w-screen items-center bg-black"
          >
            <motion.div
              {...anim(displayVariant)}
              className="ml-40 flex max-w-[450px] flex-col justify-center gap-y-5 rounded-lg bg-white bg-opacity-30 p-4"
            >
              <h1 className="text-9xl text-center font-medium">404</h1>
              <h1 className="text-3xl font-medium">{t("title")}</h1>
              <h2>{t("description")}</h2>
              <div className="flex flex-row justify-between">
                <Button asChild size="lg">
                  <Link href="/" className="hover:underline">
                    {t("backToMainPage")}
                  </Link>
                </Button>
                {!isAnimationEnd && (
                  <Button
                    ref={buttonRef}
                    variant="ghost"
                    size="lg"
                    onClick={() => setIsClickedViewButton(true)}
                  >
                    {t("lookView")}
                    <AudioLines />
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
        {isAnimationEnd && (
          <motion.div
            {...anim(displayVariant)}
            className="fixed bottom-5 flex max-w-[450px] flex-col justify-center gap-y-5"
          >
            <Button asChild size="lg">
              <Link href="/" className="hover:underline">
                {t("backToMainPage")}
              </Link>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <audio ref={audioRef} src="/sounds/blackhole_music.mp3" />
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
