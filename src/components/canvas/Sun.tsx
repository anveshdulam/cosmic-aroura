import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// 3D Simplex Noise from Ashima Arts
const snoise = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0);
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}
`;

const sunVertexShader = `
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  vUv = uv;
  vPosition = position;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const sunFragmentShader = `
uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

${snoise}

void main() {
    // Surface noise (high detail)
    vec3 p = vPosition * 0.4;
    
    // Fractal Brownian Motion (layered noise)
    float n1 = snoise(p + vec3(time * 0.15));
    float n2 = snoise(p * 2.0 - vec3(time * 0.25));
    float n3 = snoise(p * 4.0 + vec3(time * 0.35));
    float n4 = snoise(p * 8.0 - vec3(time * 0.5));
    
    float totalNoise = (n1 * 0.5 + n2 * 0.25 + n3 * 0.125 + n4 * 0.0625);
    
    // Normalize noise to 0.0 - 1.0
    float n = (totalNoise + 1.0) * 0.5;
    
    // Increase contrast for dark sunspots
    n = smoothstep(0.1, 0.9, n);
    
    // Fire color palette
    vec3 color1 = vec3(0.05, 0.0, 0.0); // Sunspots (dark red/black)
    vec3 color2 = vec3(0.7, 0.1, 0.0);  // Dark orange
    vec3 color3 = vec3(1.0, 0.5, 0.0);  // Fiery orange/yellow
    vec3 color4 = vec3(1.0, 0.9, 0.6);  // White hot plasma
    
    vec3 finalColor;
    if (n < 0.33) {
        finalColor = mix(color1, color2, n / 0.33);
    } else if (n < 0.66) {
        finalColor = mix(color2, color3, (n - 0.33) / 0.33);
    } else {
        finalColor = mix(color3, color4, (n - 0.66) / 0.34);
    }
    
    gl_FragColor = vec4(finalColor, 1.0);
}
`;

const coronaFragmentShader = `
uniform float time;
varying vec3 vPosition;
varying vec3 vNormal;

${snoise}

void main() {
    // Low frequency noise for large flares
    vec3 p = vPosition * 0.2;
    
    float n1 = snoise(p + vec3(time * 0.2));
    float n2 = snoise(p * 2.0 - vec3(time * 0.3));
    
    float noise = (n1 * 0.6 + n2 * 0.4);
    
    // Create sharp cutoffs for flare shapes
    float alpha = smoothstep(0.2, 0.6, noise);
    
    // Fade out at the edges (Fresnel)
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = dot(vNormal, viewDir);
    
    // Edges are brighter for the corona, but fade out at the extreme edge
    float glow = pow(1.0 - abs(fresnel), 2.0) * alpha;
    
    vec3 flareColor = mix(vec3(1.0, 0.2, 0.0), vec3(1.0, 0.7, 0.1), noise);
    
    gl_FragColor = vec4(flareColor, glow * 0.8);
}
`;

interface SunProps {
  position: [number, number, number];
  sunRef?: React.Ref<THREE.Mesh>;
}

export function Sun({ position, sunRef }: SunProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Materials that we can animate
  const uniforms = useMemo(() => ({
    time: { value: 0 }
  }), []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.02;
    }
    uniforms.time.value += delta;
  });

  return (
    <group position={position} ref={groupRef}>
      {/* Core Surface */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[12, 128, 128]} />
        <shaderMaterial
          vertexShader={sunVertexShader}
          fragmentShader={sunFragmentShader}
          uniforms={uniforms}
        />
      </mesh>

      {/* Fiery Corona (Flares) */}
      <mesh scale={1.15}>
        <sphereGeometry args={[12, 128, 128]} />
        <shaderMaterial
          vertexShader={sunVertexShader}
          fragmentShader={coronaFragmentShader}
          uniforms={uniforms}
          transparent={true}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Atmospheric Glow */}
      <mesh scale={1.3}>
        <sphereGeometry args={[12, 64, 64]} />
        <meshBasicMaterial
          color="#ffaa00"
          transparent={true}
          opacity={0.1}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      <pointLight intensity={0.5} color="#ffaa33" distance={500} decay={1.5} />
      <pointLight intensity={0.2} color="#ffffff" distance={4000} decay={0.5} />
    </group>
  );
}
