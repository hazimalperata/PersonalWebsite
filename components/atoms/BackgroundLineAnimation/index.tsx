'use client'

import React, {useEffect, useMemo, useRef} from "react";
import {useTheme} from "next-themes";
import {getRandomInt} from "@/utils/random";

export default function BackgroundLineAnimation() {
  const animationFrameId = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hueRef = useRef<number>(0);
  const isInitialized = useRef<boolean>(false);
  const unitCount = 200;

  const {theme} = useTheme();

  const fillStyle = useMemo(() => {
    return theme === "dark"
      ? "rgba(0, 0, 0, 0.05)"
      : "rgba(255, 255, 255, 0.05)";
  }, [theme]);

  // Unit sınıfı
  class Unit {
    x!: number;
    y!: number;
    sx!: number;
    sy!: number;
    angle!: number;
    size!: number;
    radian!: number;
    speed!: number;
    maxDistance!: number;
    time!: number;
    ttl!: number;
    hue!: number;

    constructor(w: number, h: number) {
      this.reset(w, h);
    }

    reset(w: number, h: number) {
      this.x = Math.round(w / 2);
      this.y = Math.round(h / 2);
      this.sx = this.x;
      this.sy = this.y;
      this.angle = 90 * getRandomInt(0, 5);
      this.size = 2;
      this.radian = (Math.PI / 180) * (this.angle + 90);
      this.speed = 3;
      this.maxDistance = 50;
      this.time = 0;
      this.ttl = getRandomInt(500, 2700);
      this.hue = hueRef.current;
      hueRef.current += 0.5;
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
      ctx.shadowColor = `hsl(${this.hue}, 100%, 50%)`;
      ctx.shadowBlur = 5;
      ctx.fill();
      ctx.closePath();
      ctx.restore();
    }

    update(w: number, h: number) {
      const dx = this.sx - this.x;
      const dy = this.sy - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance >= this.maxDistance) {
        this.angle += getRandomInt(0, 1) ? 90 : -90;
        this.radian = (Math.PI / 180) * (this.angle + 90);
        this.sx = this.x;
        this.sy = this.y;
      }

      this.x += this.speed * Math.sin(this.radian);
      this.y += this.speed * Math.cos(this.radian);

      if (
        this.time >= this.ttl ||
        this.x < 0 ||
        this.x > w ||
        this.y < 0 ||
        this.y > h
      ) {
        this.reset(w, h);
      }

      this.time++;
    }
  }

  const unitsRef = useRef<Unit[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;

    // Canvas boyutlarını ayarla ve temizle
    const resizeCanvas = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      ctx.fillRect(0, 0, w, h);
    };

    // Tüm birimleri oluştur
    const createUnits = () => {
      unitsRef.current = [];
      for (let i = 0; i < unitCount; i++) {
        setTimeout(() => {
          unitsRef.current.push(new Unit(w, h));
        }, i * 200);
      }
    };

    // Birimleri çiz
    const drawScene = () => {
      unitsRef.current.forEach((unit) => {
        unit.update(w, h);
        unit.draw(ctx);
      });
    };

    // Animasyon döngüsü
    const animationLoop = () => {
      ctx.fillStyle = fillStyle;
      // ctx.fillStyle = "transparent";
      ctx.fillRect(0, 0, w, h);
      drawScene();
      animationFrameId.current = requestAnimationFrame(animationLoop);
    };

    resizeCanvas();
    if (!isInitialized.current) {
      setTimeout(() => createUnits(), 4000);
      isInitialized.current = true;
    } else {
      createUnits()
    }

    animationLoop();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      window.removeEventListener("resize", resizeCanvas);
    };
    // eslint-disable-next-line
  }, [fillStyle]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute w-full pointer-events-none select-none h-screen"
    />
  );
}
