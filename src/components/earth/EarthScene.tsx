"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  AdditiveBlending,
  AgXToneMapping,
  Group,
  IcosahedronGeometry,
  LinearSRGBColorSpace,
  LoadingManager,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  DirectionalLight,
  Scene,
  TextureLoader,
  Vector2,
  WebGLRenderer,
  SphereGeometry,
  SRGBColorSpace,
  AmbientLight,
} from "three";
import {
  EffectComposer,
  RenderPass,
  UnrealBloomPass,
} from "three-stdlib";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { getFresnelMat, getStarfield, SECTIONS } from "./utils";
import LoadingScreen from "./LoadingScreen";
import EarthOverlay from "./EarthOverlay";
import styles from "./earth.module.scss";

gsap.registerPlugin(ScrollTrigger);

const EARTH_DETAIL = 128; // Higher detail for smoother sphere

export default function EarthScene() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const [loadProgress, setLoadProgress] = useState(0);
  const [activeSectionId, setActiveSectionId] = useState("hero");
  const [currentStep, setCurrentStep] = useState(0);
  const [isDebug, setIsDebug] = useState(false);
  const [showFinalText, setShowFinalText] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [debugValues, setDebugValues] = useState({ rx: 0, ry: 0, rz: 0, px: 0, cz: 0 });

  const isDebugRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentStepRef = useRef(0);
  useEffect(() => {
    isDebugRef.current = isDebug;
  }, [isDebug]);

  useEffect(() => {
    // Initial audio setup
    audioRef.current = new Audio("/audio/space-song.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    const container = canvasContainerRef.current;
    const scrollContainer = scrollContainerRef.current;
    if (!container || !scrollContainer) return;

    // ── Cleanup refs ──────────────────────────────────────────────────────────
    let animFrameId: number;
    let composer: EffectComposer;

    // ── Loading Manager ───────────────────────────────────────────────────────
    let loadedCount = 0;
    const totalTextures = 6; // earthmap, bump, spec, lights, cloudmap, cloudtrans
    const manager = new LoadingManager();
    manager.onProgress = (_url, loaded, total) => {
      setLoadProgress(loaded / total);
    };
    manager.onLoad = () => {
      setLoadProgress(1);
    };

    // ── Renderer ──────────────────────────────────────────────────────────────
    const w = window.innerWidth;
    const h = window.innerHeight;
    const renderer = new WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = AgXToneMapping;
    renderer.outputColorSpace = LinearSRGBColorSpace;
    container.appendChild(renderer.domElement);

    // ── Scene & Camera ────────────────────────────────────────────────────────
    const scene = new Scene();
    const camera = new PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.z = SECTIONS[0].cameraZ;

    // ── Earth Group ───────────────────────────────────────────────────────────
    const earthGroup = new Group();
    earthGroup.rotation.z = (-23.4 * Math.PI) / 180; // axial tilt
    earthGroup.rotation.y = SECTIONS[0].earthRotationY;
    earthGroup.position.x = SECTIONS[0].earthPositionX;
    scene.add(earthGroup);

    const loader = new TextureLoader(manager);
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

    const loadTexture = (path: string) => {
      const texture = loader.load(path);
      texture.anisotropy = maxAnisotropy;
      return texture;
    };

    // Use SphereGeometry for more uniform segments than Icosahedron
    const geometry = new SphereGeometry(1, EARTH_DETAIL, EARTH_DETAIL);

    // Daytime surface
    const earthMat = new MeshPhongMaterial({
      map: loadTexture("/textures/earth/8081earthmap10k.jpg"),
      specularMap: loadTexture("/textures/earth/8081earthspec10k.jpg"),
      specular: "#333333", // Subtle metallic spec
      shininess: 35, // More polished look
      bumpMap: loadTexture("/textures/earth/8081earthbump10k.jpg"),
      bumpScale: 0.06, // More depth
    });
    const earthMesh = new Mesh(geometry, earthMat);
    earthGroup.add(earthMesh);

    // Night lights
    const lightsMat = new MeshBasicMaterial({
      map: loadTexture("/textures/earth/8081earthlights10k.jpg"),
      blending: AdditiveBlending,
    });
    const lightsMesh = new Mesh(geometry, lightsMat);
    earthGroup.add(lightsMesh);

    // Clouds
    const cloudsMat = new MeshStandardMaterial({
      map: loadTexture("/textures/earth/8k_earth_clouds.jpg"),
      transparent: true,
      opacity: 0.6, // Balanced
      blending: AdditiveBlending,
      alphaMap: loadTexture("/textures/earth/05_earthcloudmaptrans.jpg"),
    });
    const cloudsMesh = new Mesh(geometry, cloudsMat);
    cloudsMesh.scale.setScalar(1.008); // More depth between earth and clouds
    earthGroup.add(cloudsMesh);

    // Fresnel atmospheric glow
    const fresnelMat = getFresnelMat();
    const glowMesh = new Mesh(geometry, fresnelMat);
    glowMesh.scale.setScalar(1.01);
    earthGroup.add(glowMesh);

    // ── Stars ─────────────────────────────────────────────────────────────────
    const stars = getStarfield({ numStars: 15000 });
    scene.add(stars);

    // ── Lighting ──────────────────────────────────────────────────────────────
    const sunLight = new DirectionalLight("#ffffff", 1.2); // Slightly boosted
    sunLight.position.set(-5, 3, 5);
    scene.add(sunLight);

    const ambientLight = new AmbientLight("#112244", 0.05); // Deep space blue tint for night side
    scene.add(ambientLight);

    // Remove AmbientLight to keep the contrast high as before
    // (Optional: keep a tiny bit if it was there before, but original had none)

    // ── Post-processing ───────────────────────────────────────────────────────
    const renderPass = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new Vector2(w, h),
      0.6, // More subtle but refined bloom
      0.4,
      0.85,
    );
    const outputPass = new OutputPass();
    composer = new EffectComposer(renderer);
    composer.addPass(renderPass);
    composer.addPass(bloomPass);
    composer.addPass(outputPass);

    // ── Discrete Step Logic ───────────────────────────────────────────────────
    let step = 0;
    let isAnimating = false;
    let touchStartY = 0;
    let touchStartTime = 0;

    function goToStep(newStep: number) {
      if (isAnimating) return;
      if (newStep < 0 || newStep >= SECTIONS.length) return;

      // Lock scroll-back if we are in the last step
      if (step === SECTIONS.length - 1 && newStep < step) {
        return;
      }

      isAnimating = true;
      step = newStep;
      setCurrentStep(step);
      setActiveSectionId(SECTIONS[step].id);

      const s = SECTIONS[step];
      const duration = s.duration ?? 1.2;
      const isLastStep = step === SECTIONS.length - 1;

      if (isLastStep) {
        setShowFinalText(false);
        // Start music on outro
        if (audioRef.current && audioRef.current.paused) {
          audioRef.current.play().then(() => {
            gsap.to(audioRef.current, { volume: 0.5, duration: 4 });
          }).catch(err => console.log("Audio play failed:", err));
        }
      }

      gsap.to(earthGroup.rotation, {
        y: s.earthRotationY,
        x: s.earthRotationX ?? 0,
        z: s.earthRotationZ ?? 0,
        duration,
        ease: "power2.inOut",
      });
      gsap.to(earthGroup.position, {
        x: s.earthPositionX,
        duration,
        ease: "power2.inOut",
      });
      gsap.to(camera.position, {
        z: s.cameraZ,
        duration,
        ease: "power2.inOut",
        onComplete: () => {
          if (isLastStep) {
            setShowFinalText(true);
          }
        }
      });

      // Unlock after animation completes (unless it's the last step which we want to keep locked)
      setTimeout(() => {
        isAnimating = false;
      }, duration * 1000 + 100);
    }

    function handleWheel(e: WheelEvent) {
      // Prevent default scrolling on the page to keep it fixed
      e.preventDefault();

      // We only want to trigger once per strong scroll event
      // Using deltaY threshold helps ignore tiny touchpad jitters
      if (e.deltaY > 30) {
        // Prevent scrolling forward from step 0
        if (step === 0) return;
        goToStep(step + 1);
      } else if (e.deltaY < -30) {
        goToStep(step - 1);
      }
    }

    function handleTouchStart(e: TouchEvent) {
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    }

    function handleTouchMove(e: TouchEvent) {
      // Prevent default to avoid pull-to-refresh and native scroll
      e.preventDefault();

      if (isAnimating) return;

      const touchEndY = e.touches[0].clientY;
      const diff = touchStartY - touchEndY;
      const timeDiff = Date.now() - touchStartTime;

      // Wait for a clear swipe motion
      if (Math.abs(diff) > 40 && timeDiff > 50) {
        if (diff > 0) {
          // Prevent swiping forward from step 0
          if (step === 0) return;
          goToStep(step + 1);
        } else {
          goToStep(step - 1);
        }
        // Update start to prevent multi-firing
        touchStartY = touchEndY;
        touchStartTime = Date.now();
      }
    }

    // Listen for custom start event from overlay
    const handleCustomGoToStep = (e: any) => {
      goToStep(e.detail);
    };
    window.addEventListener("earth:go-to-step", handleCustomGoToStep);

    // Use passive: false so we can call e.preventDefault()
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    // ── Debug Logic ──────────────────────────────────────────────────────────
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };

    function updateDebugValues() {
      setDebugValues({
        rx: earthGroup.rotation.x,
        ry: earthGroup.rotation.y,
        rz: earthGroup.rotation.z,
        px: earthGroup.position.x,
        cz: camera.position.z,
      });
    }

    function onMouseDown(e: MouseEvent) {
      if (!isDebugRef.current) return;
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    }

    function onMouseMove(e: MouseEvent) {
      if (!isDragging || !isDebugRef.current) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;

      if (e.altKey) {
        earthGroup.position.x += dx * 0.01;
      } else if (e.shiftKey) {
        earthGroup.rotation.z += dx * 0.01;
      } else {
        earthGroup.rotation.y += dx * 0.01;
        earthGroup.rotation.x += dy * 0.01;
      }

      prevMouse = { x: e.clientX, y: e.clientY };
      updateDebugValues();
    }

    function onMouseUp() {
      isDragging = false;
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key.toLowerCase() === "d") {
        setIsDebug(prev => {
          const next = !prev;
          if (next) updateDebugValues();
          return next;
        });
      }
    }

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("keydown", onKeyDown);

    // Update wheel for debug
    const originalHandleWheel = handleWheel;
    function wrappedHandleWheel(e: WheelEvent) {
      if (isDebugRef.current) {
        e.preventDefault();
        camera.position.z += e.deltaY * 0.001;
        updateDebugValues();
        return;
      }
      originalHandleWheel(e);
    }
    window.removeEventListener("wheel", handleWheel);
    window.addEventListener("wheel", wrappedHandleWheel, { passive: false });

    // ── Render Loop ───────────────────────────────────────────────────────────
    function animate() {
      animFrameId = requestAnimationFrame(animate);

      const isAutoRotating = SECTIONS[step].autoRotate;

      if (isAutoRotating) {
        earthMesh.rotation.y += 0.002;
        lightsMesh.rotation.y += 0.002;
        cloudsMesh.rotation.y += 0.0022;
        glowMesh.rotation.y += 0.002;
      } else {
        // Subtle floating/breathing effect
        const time = Date.now() * 0.0005;
        earthGroup.position.y = SECTIONS[step].earthPositionX ? (Math.sin(time) * 0.02) : (Math.sin(time) * 0.02);
        // Slowly drift clouds even when idle
        cloudsMesh.rotation.y += 0.0001;
      }

      composer.render();
    }
    animate();

    // ── Resize ────────────────────────────────────────────────────────────────
    function onResize() {
      const nw = window.innerWidth;
      const nh = window.innerHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
      composer.setSize(nw, nh);
    }
    window.addEventListener("resize", onResize);

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("wheel", wrappedHandleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("keydown", onKeyDown);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={scrollContainerRef} className={styles.pageWrapper}>
      <div className={styles.stickyContainer}>
        {/* Three.js canvas */}
        <div ref={canvasContainerRef} className={styles.canvasContainer} />

        {/* DOM Overlay */}
        <EarthOverlay
          activeSectionId={activeSectionId}
          currentStep={currentStep}
          totalSteps={SECTIONS.length}
          onStart={() => {
            // Unlock audio on interaction
            if (audioRef.current && audioRef.current.paused) {
              audioRef.current.play().then(() => {
                audioRef.current?.pause(); // Unlock but stay silent
              }).catch(e => console.log("Unlock failed", e));
            }
            // Trigger transition to step 1
            window.dispatchEvent(new CustomEvent("earth:go-to-step", { detail: 1 }));
          }}
        />

        {/* Audio Control */}
        <button 
          className={styles.audioToggle}
          onClick={() => setIsMuted(!isMuted)}
          aria-label="Toggle Audio"
        >
          {isMuted ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6"/></svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg>
          )}
        </button>

        {/* Loading screen (unmounts when loaded) */}
        <LoadingScreen progress={loadProgress} />

        {/* Final Outro Text */}
        <AnimatePresence>
          {showFinalText && (
            <motion.div 
              className={styles.finalOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2 }}
            >
              <div className={styles.blurBackground} />
              <div className={styles.finalContent}>
                <motion.h1 
                  className={styles.finalTitle}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                >
                  You are here.
                </motion.h1>

                <div className={styles.finalText}>
                  {"Look again at that dot. That's here. That's home. That's us. On it everyone you love, everyone you know, everyone you ever heard of, every human being who ever was, lived out their lives.".split("").map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 0.1,
                        delay: 1.5 + i * 0.03, // Typewriter start after title
                      }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>

                <motion.div 
                  className={styles.finalQuote}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 2, delay: 8 }} // Reveal after typewriter finishes mostly
                >
                  "Whatever you're going through, remember the scale of it all.<br/>
                  In the vastness of space, we are a small but beautiful miracle.<br/>
                  Take a breath. This too shall pass."
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Debug UI */}
        {isDebug && (
          <div style={{
            position: "fixed",
            top: "20px",
            left: "20px",
            zIndex: 10000,
            background: "rgba(0,0,0,0.85)",
            padding: "20px",
            borderRadius: "12px",
            color: "#fff",
            fontFamily: "monospace",
            fontSize: "13px",
            border: "1px solid #444",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            backdropFilter: "blur(8px)",
            minWidth: "220px"
          }}>
            <h3 style={{ margin: "0 0 15px 0", color: "#0088ff", fontSize: "16px" }}>🌍 Earth Debugger</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div><span style={{ color: "#aaa" }}>earthRotationX:</span> <span style={{ color: "#00ff88" }}>{debugValues.rx.toFixed(3)}</span></div>
              <div><span style={{ color: "#aaa" }}>earthRotationY:</span> <span style={{ color: "#00ff88" }}>{debugValues.ry.toFixed(3)}</span></div>
              <div><span style={{ color: "#aaa" }}>earthRotationZ:</span> <span style={{ color: "#00ff88" }}>{debugValues.rz.toFixed(3)}</span></div>
              <div style={{ marginTop: "4px" }}><span style={{ color: "#aaa" }}>earthPositionX:</span> <span style={{ color: "#ffcc00" }}>{debugValues.px.toFixed(3)}</span></div>
              <div><span style={{ color: "#aaa" }}>cameraZ:</span> <span style={{ color: "#ffcc00" }}>{debugValues.cz.toFixed(3)}</span></div>
            </div>

            <button
              onClick={() => {
                const text = `earthRotationX: ${debugValues.rx.toFixed(3)},
earthRotationY: ${debugValues.ry.toFixed(3)},
earthRotationZ: ${debugValues.rz.toFixed(3)},
earthPositionX: ${debugValues.px.toFixed(3)},
cameraZ: ${debugValues.cz.toFixed(3)},`;
                navigator.clipboard.writeText(text);
                alert("Kopyalandı!");
              }}
              style={{
                marginTop: "20px",
                width: "100%",
                padding: "8px",
                background: "#0088ff",
                border: "none",
                borderRadius: "6px",
                color: "white",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Değerleri Kopyala
            </button>

            <div style={{ marginTop: "15px", fontSize: "10px", color: "#888", lineHeight: "1.4" }}>
              • Drag: Rotate X/Y<br />
              • Shift + Drag: Rotate Z<br />
              • Alt + Drag: Position X<br />
              • Scroll: Camera Z<br />
              • Press 'D': Toggle Debug
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
