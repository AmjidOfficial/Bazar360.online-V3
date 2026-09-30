import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, RotateCw, Eye, ShieldCheck, Zap } from 'lucide-react';

interface Interactive3DShowroomHeroProps {
  onExploreClick?: () => void;
  onSellClick?: () => void;
  availableCount?: number;
  verifiedCount?: number;
}

export function Interactive3DShowroomHero({
  onExploreClick,
  onSellClick,
  availableCount = 48,
  verifiedCount = 24,
}: Interactive3DShowroomHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [isInteracting, setIsInteracting] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let carGroup: THREE.Group;
    let clock = new THREE.Clock();

    let isMouseDown = false;
    let previousMouseX = 0;
    let previousMouseY = 0;
    let targetRotationY = 0;
    let targetRotationX = 0;

    try {
      const width = container.clientWidth || 360;
      const height = container.clientHeight || 260;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
      camera.position.set(0, 2.4, 6.2);
      camera.lookAt(0, 0.2, 0);

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;

      // Clean old canvas if any
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      container.appendChild(renderer.domElement);

      // Luxury ambient & directional lighting (Electric cyan & warm gold)
      const ambientLight = new THREE.AmbientLight(0x00d2ff, 1.6);
      scene.add(ambientLight);

      const pointLight1 = new THREE.PointLight(0xffb95f, 3.5, 60);
      pointLight1.position.set(6, 6, 6);
      scene.add(pointLight1);

      const pointLight2 = new THREE.PointLight(0x00d2ff, 3.2, 60);
      pointLight2.position.set(-6, -2, -6);
      scene.add(pointLight2);

      const spotLight = new THREE.SpotLight(0xffffff, 2.0);
      spotLight.position.set(0, 8, 4);
      spotLight.angle = Math.PI / 4;
      spotLight.penumbra = 0.5;
      scene.add(spotLight);

      // Create Stylized 3D Luxury Supercar
      carGroup = new THREE.Group();

      // Materials
      const bodyMat = new THREE.MeshPhongMaterial({
        color: 0x060e20,
        shininess: 120,
        specular: 0x00d2ff,
      });

      const accentMat = new THREE.MeshPhongMaterial({
        color: 0x00d2ff,
        emissive: 0x004e60,
        shininess: 90,
      });

      const goldMat = new THREE.MeshPhongMaterial({
        color: 0xffb95f,
        emissive: 0x3a2000,
        shininess: 95,
      });

      const glassMat = new THREE.MeshPhongMaterial({
        color: 0xa5e7ff,
        transparent: true,
        opacity: 0.65,
        shininess: 160,
        specular: 0xffffff,
      });

      const lightGlowMat = new THREE.MeshBasicMaterial({
        color: 0x47d6ff,
      });

      const tailGlowMat = new THREE.MeshBasicMaterial({
        color: 0xff3b30,
      });

      // 1. Aerodynamic Lower Body / Chassis
      const chassisGeo = new THREE.BoxGeometry(3.0, 0.45, 1.4);
      const chassis = new THREE.Mesh(chassisGeo, bodyMat);
      chassis.position.y = 0.35;
      carGroup.add(chassis);

      // 2. Front Hood Slope
      const hoodGeo = new THREE.BoxGeometry(1.0, 0.25, 1.36);
      const hood = new THREE.Mesh(hoodGeo, bodyMat);
      hood.position.set(1.1, 0.45, 0);
      hood.rotation.z = -0.15;
      carGroup.add(hood);

      // 3. Cabin / Greenhouse Dome (Tinted Glass)
      const cabinGeo = new THREE.BoxGeometry(1.5, 0.5, 1.15);
      const cabin = new THREE.Mesh(cabinGeo, glassMat);
      cabin.position.set(-0.1, 0.8, 0);
      carGroup.add(cabin);

      // 4. Roof Lip / Spoiler
      const spoilerGeo = new THREE.BoxGeometry(0.3, 0.08, 1.35);
      const spoiler = new THREE.Mesh(spoilerGeo, accentMat);
      spoiler.position.set(-1.45, 0.72, 0);
      carGroup.add(spoiler);

      // 5. LED Headlights (Cyan DRL Strips)
      const headLightLeft = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.35), lightGlowMat);
      headLightLeft.position.set(1.5, 0.42, 0.45);
      carGroup.add(headLightLeft);

      const headLightRight = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.35), lightGlowMat);
      headLightRight.position.set(1.5, 0.42, -0.45);
      carGroup.add(headLightRight);

      // 6. LED Tail Light Bar (Red Glowing Strip)
      const tailLight = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 1.25), tailGlowMat);
      tailLight.position.set(-1.52, 0.48, 0);
      carGroup.add(tailLight);

      // 7. Alloy Wheels (Gold Multi-spoke)
      const wheelGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.28, 24);
      wheelGeo.rotateX(Math.PI / 2);

      const wheelPositions = [
        { x: 0.95, y: 0.36, z: 0.72 },
        { x: -0.95, y: 0.36, z: 0.72 },
        { x: 0.95, y: 0.36, z: -0.72 },
        { x: -0.95, y: 0.36, z: -0.72 },
      ];

      wheelPositions.forEach((pos) => {
        const wheel = new THREE.Mesh(wheelGeo, goldMat);
        wheel.position.set(pos.x, pos.y, pos.z);
        carGroup.add(wheel);

        // Center hub cap
        const hubCap = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.3, 16), accentMat);
        hubCap.rotateX(Math.PI / 2);
        hubCap.position.set(pos.x, pos.y, pos.z);
        carGroup.add(hubCap);
      });

      scene.add(carGroup);

      // 8. Glowing Holographic Floor Grid
      const gridHelper = new THREE.GridHelper(16, 16, 0x00d2ff, 0x131b2e);
      gridHelper.position.y = 0;
      scene.add(gridHelper);

      // Interactive Mouse / Touch Handlers
      const onPointerDown = (clientX: number, clientY: number) => {
        isMouseDown = true;
        previousMouseX = clientX;
        previousMouseY = clientY;
        setIsInteracting(true);
      };

      const onPointerMove = (clientX: number, clientY: number) => {
        if (!isMouseDown) return;
        const deltaX = clientX - previousMouseX;
        const deltaY = clientY - previousMouseY;

        targetRotationY += deltaX * 0.008;
        targetRotationX = Math.max(-0.2, Math.min(0.3, targetRotationX + deltaY * 0.004));

        previousMouseX = clientX;
        previousMouseY = clientY;
      };

      const onPointerUp = () => {
        isMouseDown = false;
        setIsInteracting(false);
      };

      const domElement = renderer.domElement;
      
      const handleMouseDown = (e: MouseEvent) => onPointerDown(e.clientX, e.clientY);
      const handleMouseMove = (e: MouseEvent) => onPointerMove(e.clientX, e.clientY);
      const handleMouseUp = () => onPointerUp();

      const handleTouchStart = (e: TouchEvent) => {
        if (e.touches.length > 0) {
          onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
        }
      };
      const handleTouchMove = (e: TouchEvent) => {
        if (e.touches.length > 0) {
          onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      };
      const handleTouchEnd = () => onPointerUp();

      domElement.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);

      domElement.addEventListener('touchstart', handleTouchStart, { passive: true });
      window.addEventListener('touchmove', handleTouchMove, { passive: true });
      window.addEventListener('touchend', handleTouchEnd);

      // Resize observer
      const handleResize = () => {
        if (!container) return;
        const w = container.clientWidth || 360;
        const h = container.clientHeight || 260;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      window.addEventListener('resize', handleResize);

      // Animation Render Loop
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        if (isRotating && !isMouseDown) {
          targetRotationY += 0.006;
        }

        // Smooth damping
        carGroup.rotation.y += (targetRotationY - carGroup.rotation.y) * 0.08;
        carGroup.rotation.x += (targetRotationX - carGroup.rotation.x) * 0.08;
        carGroup.position.y = Math.sin(elapsedTime * 2.2) * 0.04 + 0.02;

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', handleResize);
        domElement.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        domElement.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);

        if (renderer && renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
        renderer?.dispose();
      };
    } catch (e) {
      console.warn('[Interactive 3D Showroom] WebGL Initialization note:', e);
      setHasWebGL(false);
    }
  }, [isRotating]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#0b1326] via-[#131b2e] to-[#0b1326] border border-[#00d2ff]/25 shadow-2xl p-4 sm:p-6 mb-6">
      {/* Background ambient lighting effects */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#00d2ff]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#ffb95f]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Badge & Telemetry */}
      <div className="relative z-20 flex flex-col gap-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ee9800]/20 border border-[#ffb95f]/40 text-[#ffb95f] w-max shadow-md">
            <ShieldCheck size={14} className="text-[#ffb95f]" />
            <span className="text-[11px] font-bold uppercase tracking-wider">3D Interactive Showroom & Telemetry</span>
          </div>

          <button
            type="button"
            onClick={() => setIsRotating(!isRotating)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#222a3d]/80 hover:bg-[#2d3449] text-[#a5e7ff] text-xs font-semibold border border-[#00d2ff]/20 transition-all cursor-pointer shadow-xs"
            title={isRotating ? "Pause auto-rotation" : "Resume auto-rotation"}
          >
            <RotateCw size={12} className={isRotating ? "animate-spin" : ""} />
            <span>{isRotating ? "Auto-Rotating" : "Paused"}</span>
          </button>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#dae2fd] tracking-tight mt-1">
          Pakistan's Elite Certified Automotive Marketplace
        </h1>
        <p className="text-xs sm:text-sm text-[#bbc9cf] max-w-xl">
          Discover verified luxury vehicles, electric mobility, and certified showrooms backed by our 360-degree inspection guarantee.
        </p>
      </div>

      {/* 3D Canvas Container */}
      <div className="relative w-full h-64 sm:h-76 md:h-84 my-3 rounded-xl overflow-hidden bg-[#060e20]/80 border border-[#00d2ff]/20 shadow-inner group">
        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* 3D Telemetry Overlay Controls */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-[#a5e7ff] pointer-events-none">
          <div className="flex items-center gap-1.5 bg-[#060e20]/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#00d2ff]/20">
            <span className="w-2 h-2 rounded-full bg-[#00d2ff] animate-ping" />
            <span className="font-semibold">Live 3D Telemetry</span>
          </div>

          <div className="bg-[#060e20]/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#ffb95f]/30 text-[#ffb95f] font-semibold flex items-center gap-1">
            <Eye size={12} />
            <span>Drag / Swipe to Rotate</span>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons & Live Stats */}
      <div className="relative z-20 flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={onExploreClick}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00d2ff] to-[#47d6ff] hover:from-[#47d6ff] hover:to-[#00d2ff] text-[#003543] font-bold text-xs sm:text-sm tracking-wide uppercase transition-all shadow-lg shadow-[#00d2ff]/20 cursor-pointer active:scale-95"
          >
            <Zap size={15} />
            <span>Browse {availableCount}+ Vehicles</span>
          </button>

          <button
            type="button"
            onClick={onSellClick}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#222a3d] hover:bg-[#2d3449] text-[#dae2fd] hover:text-[#00d2ff] border border-[#00d2ff]/30 font-semibold text-xs sm:text-sm transition-all cursor-pointer active:scale-95"
          >
            <Sparkles size={14} className="text-[#ffb95f]" />
            <span>Sell in 60s</span>
          </button>
        </div>

        {/* Quick Micro-Stats Strip */}
        <div className="flex items-center gap-4 text-xs text-[#bbc9cf] w-full sm:w-auto justify-around sm:justify-end border-t sm:border-t-0 border-[#222a3d] pt-2 sm:pt-0">
          <div>
            <span className="font-bold text-[#dae2fd] text-sm">{availableCount}</span>
            <span className="text-[10px] block uppercase text-[#859399]">Live Units</span>
          </div>
          <div className="h-6 w-px bg-[#222a3d]" />
          <div>
            <span className="font-bold text-[#ffb95f] text-sm">{verifiedCount}</span>
            <span className="text-[10px] block uppercase text-[#859399]">360° Inspected</span>
          </div>
          <div className="h-6 w-px bg-[#222a3d]" />
          <div>
            <span className="font-bold text-[#00d2ff] text-sm">100%</span>
            <span className="text-[10px] block uppercase text-[#859399]">Direct Contact</span>
          </div>
        </div>
      </div>
    </div>
  );
}
