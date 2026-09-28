import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Lock, Eye, Cpu, CheckCircle2 } from 'lucide-react';

export type VaultState = 'LOCKED' | 'MEASURING' | 'PROVING' | 'VERIFIED';

interface ContractVaultProps {
  state: VaultState;
  onStateChange?: (state: VaultState) => void;
  className?: string;
}

export const ContractVault: React.FC<ContractVaultProps> = ({
  state,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Three.js Scene Setup
    const width = container.clientWidth || 360;
    const height = container.clientHeight || 340;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const vaultGroup = new THREE.Group();
    scene.add(vaultGroup);

    // 1. Outer Platinum / Quartz Frosted Cage
    const cageGeo = new THREE.IcosahedronGeometry(1.6, 1);
    const cageMat = new THREE.MeshStandardMaterial({
      color: 0x64748b, // Platinum slate
      wireframe: true,
      transparent: true,
      opacity: 0.45,
      metalness: 0.8,
      roughness: 0.3,
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    vaultGroup.add(cageMesh);

    // 2. Cipher Tumbler Ring 1 (Royal Violet / Amethyst)
    const ring1Geo = new THREE.TorusGeometry(1.9, 0.035, 16, 64);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x7c3aed, // Royal Violet
      metalness: 0.95,
      roughness: 0.1,
      emissive: 0x6d28d9,
      emissiveIntensity: 0.5,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    vaultGroup.add(ring1);

    // 3. Cipher Tumbler Ring 2 (Warm Amber / Honey Gold)
    const ring2Geo = new THREE.TorusGeometry(2.1, 0.03, 16, 64);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xd97706, // Honey Amber
      metalness: 0.95,
      roughness: 0.1,
      emissive: 0xb45309,
      emissiveIntensity: 0.4,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 2;
    vaultGroup.add(ring2);

    // 4. Central Cryptographic Octahedron Core (Platinum / Obsidian)
    const coreGeo = new THREE.OctahedronGeometry(0.85, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x334155,
      emissiveIntensity: 0.5,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    vaultGroup.add(coreMesh);

    // Ambient & Directional Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x7c3aed, 2.0); // Violet beam
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xd97706, 1.6); // Amber beam
    dirLight2.position.set(-5, -5, -3);
    scene.add(dirLight2);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      let speedMult = 1.0;
      if (state === 'LOCKED') speedMult = 0.5;
      if (state === 'MEASURING') speedMult = 1.6;
      if (state === 'PROVING') speedMult = 4.5;
      if (state === 'VERIFIED') speedMult = 0.7;

      ring1.rotation.z += delta * 0.4 * speedMult;
      ring1.rotation.y += delta * 0.2 * speedMult;

      ring2.rotation.x += delta * 0.5 * speedMult;
      ring2.rotation.z -= delta * 0.3 * speedMult;

      cageMesh.rotation.y -= delta * 0.15 * speedMult;
      cageMesh.rotation.x += delta * 0.08 * speedMult;

      // Color and pulse reactivity (NO blue, NO green!)
      if (state === 'VERIFIED') {
        coreMat.color.setHex(0xd97706); // Warm Amber Gold
        coreMat.emissive.setHex(0xb45309);
        coreMat.emissiveIntensity = 1.6 + Math.sin(elapsed * 3) * 0.4;
        ring1Mat.emissive.setHex(0xd97706);
      } else if (state === 'PROVING') {
        coreMat.color.setHex(0x7c3aed); // Royal Violet
        coreMat.emissive.setHex(0x6d28d9);
        coreMat.emissiveIntensity = 2.2 + Math.sin(elapsed * 8) * 0.8;
      } else if (state === 'MEASURING') {
        coreMat.color.setHex(0xe11d48); // Rose Coral
        coreMat.emissive.setHex(0xbe123c);
        coreMat.emissiveIntensity = 1.2;
      } else {
        coreMat.color.setHex(0x475569);
        coreMat.emissive.setHex(0x334155);
        coreMat.emissiveIntensity = 0.3;
      }

      vaultGroup.position.y = Math.sin(elapsed * 1.5) * 0.1;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      cageGeo.dispose();
      cageMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [state]);

  const stateBadges = [
    { id: 'LOCKED', label: '1. Locked', icon: Lock, color: 'text-slate-600 bg-slate-100 border-slate-300' },
    { id: 'MEASURING', label: '2. Measuring', icon: Eye, color: 'text-rose-700 bg-rose-50 border-rose-200' },
    { id: 'PROVING', label: '3. Proving', icon: Cpu, color: 'text-purple-700 bg-purple-50 border-purple-200' },
    { id: 'VERIFIED', label: '4. Verified', icon: CheckCircle2, color: 'text-amber-800 bg-amber-50 border-amber-300' },
  ];

  return (
    <div className={`relative flex flex-col items-center justify-center p-5 rounded-2xl bg-white/90 border border-slate-200/90 shadow-sm backdrop-blur-md ${className}`}>
      {/* State Progress Badges */}
      <div className="w-full flex justify-between items-center mb-2 px-2 z-10">
        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
          Cryptographic Contract Vault
        </span>
        <div className="flex gap-1.5">
          {stateBadges.map((b) => {
            const Icon = b.icon;
            const isActive = state === b.id;
            return (
              <span
                key={b.id}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-medium border transition-all ${
                  isActive ? `${b.color} font-bold ring-1 ring-purple-400/40 shadow-xs` : 'text-slate-400 bg-slate-50 border-slate-200'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span className="hidden sm:inline">{b.label}</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="w-full h-[320px] max-w-[420px] cursor-grab active:cursor-grabbing" />

      {/* Center Subtitle Caption */}
      <div className="text-center mt-1 z-10">
        <span className="text-xs font-mono text-slate-500">
          State:{' '}
          <span className="font-semibold text-purple-700">
            {state === 'LOCKED' && 'Awaiting Private Witness Telemetry'}
            {state === 'MEASURING' && 'Witness Loaded — Asserting Predicates Off-Chain'}
            {state === 'PROVING' && 'Halo 2 Circuit Prover Generating ZK-SNARK...'}
            {state === 'VERIFIED' && 'Settled On-Chain — 0 PII Disclosed to Ledger'}
          </span>
        </span>
      </div>
    </div>
  );
};
