import { Transition } from '~/components/transition';
import { useTheme } from '~/components/theme-provider';
import { useReducedMotion } from 'framer-motion';
import { useInViewport } from '~/hooks';
import { useEffect, useRef } from 'react';
import {
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  WebGLRenderer,
} from 'three';
import { cleanRenderer } from '~/utils/three';
import styles from './background-animation.module.css';

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform float uAspect;
  uniform float uLightMode;
  varying vec2 vUv;

  float hash(float value) {
    return fract(sin(value * 127.1 + 311.7) * 43758.5453);
  }

  void main() {
    vec2 point = vec2(vUv.x * uAspect, vUv.y);
    float streaks = 0.0;

    for (int index = 0; index < 18; index++) {
      float seed = float(index);
      float phase = fract(uTime * (0.08 + hash(seed + 4.0) * 0.12) + hash(seed));
      float startX = hash(seed + 1.0) * (uAspect + 0.3);
      float startY = 0.72 + hash(seed + 2.0) * 0.72;
      vec2 head = vec2(startX, startY) + vec2(-0.34, -1.18) * phase;
      vec2 tailDirection = normalize(vec2(0.28, 0.72));
      vec2 fromHead = point - head;
      float alongTail = dot(fromHead, tailDirection);
      float acrossTail = abs(fromHead.x * tailDirection.y - fromHead.y * tailDirection.x);
      float tailLength = 0.075 + hash(seed + 3.0) * 0.09;
      float width = 0.0009 + hash(seed + 5.0) * 0.0014;
      float tailPosition = alongTail / tailLength;
      float tailMask = smoothstep(0.0, 0.08, tailPosition) *
        (1.0 - smoothstep(0.78, 1.0, tailPosition));
      float streak = exp(-pow(acrossTail / width, 2.0)) *
        exp(-max(tailPosition, 0.0) * 2.4) * tailMask;

      streaks += streak * (0.45 + hash(seed + 6.0) * 0.55);
    }

    vec3 streakColor = mix(vec3(0.95, 0.72, 1.0), vec3(0.3, 0.06, 0.58), uLightMode);
    float alpha = clamp(streaks * mix(0.4, 0.58, uLightMode), 0.0, 0.62);

    gl_FragColor = vec4(streakColor, alpha);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export const Meteors = props => {
  const { theme } = useTheme();
  const canvasRef = useRef();
  const engineRef = useRef();
  const animationRef = useRef();
  const reduceMotion = useReducedMotion();
  const isInViewport = useInViewport(canvasRef);

  useEffect(() => {
    const renderer = new WebGLRenderer({
      canvas: canvasRef.current,
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
      failIfMajorPerformanceCaveat: true,
    });
    renderer.setPixelRatio(1);
    renderer.outputColorSpace = SRGBColorSpace;

    const scene = new Scene();
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;
    const geometry = new PlaneGeometry(2, 2);
    const material = new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uAspect: { value: 1 },
        uLightMode: { value: 0 },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
    });
    scene.add(new Mesh(geometry, material));

    const updateSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight * 1.3;
      renderer.setSize(width, height);
      material.uniforms.uAspect.value = width / height;
      renderer.render(scene, camera);
    };

    engineRef.current = { renderer, scene, camera, geometry, material };
    updateSize();
    window.addEventListener('resize', updateSize);

    return () => {
      window.removeEventListener('resize', updateSize);
      cancelAnimationFrame(animationRef.current);
      geometry.dispose();
      material.dispose();
      cleanRenderer(renderer);
      engineRef.current = undefined;
    };
  }, []);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    engine.material.uniforms.uLightMode.value = theme === 'light' ? 1 : 0;
    engine.renderer.render(engine.scene, engine.camera);
  }, [theme]);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine || reduceMotion || !isInViewport) return;

    let start;
    const animate = time => {
      animationRef.current = requestAnimationFrame(animate);
      if (start === undefined) start = time;
      engine.material.uniforms.uTime.value = (time - start) * 0.001;
      engine.renderer.render(engine.scene, engine.camera);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isInViewport, reduceMotion]);

  return (
    <Transition in timeout={3000} nodeRef={canvasRef}>
      {({ visible, nodeRef }) => (
        <canvas
          aria-hidden
          className={styles.canvas}
          data-visible={visible}
          ref={nodeRef}
          {...props}
        />
      )}
    </Transition>
  );
};
