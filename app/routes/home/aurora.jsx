import { Transition } from '~/components/transition';
import { useReducedMotion } from 'framer-motion';
import { useInViewport } from '~/hooks';
import { useEffect, useRef } from 'react';
import {
  Color,
  DoubleSide,
  Mesh,
  PlaneGeometry,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  WebGLRenderer,
} from 'three';
import { cleanRenderer, cleanScene } from '~/utils/three';
import styles from './displacement-sphere.module.css';

const vertexShader = `
  uniform float uTime;
  uniform float uOffset;
  varying vec2 vUv;

  void main() {
    vUv = uv;

    vec3 displaced = position;
    float wave = sin(displaced.x * 0.045 + displaced.y * 0.08 + uTime * 1.1 + uOffset) * 4.5;
    wave += sin(displaced.x * 0.025 - displaced.y * 0.16 - uTime * 0.75 + uOffset * 1.3) * 3.0;
    wave += sin(displaced.x * 0.065 + displaced.y * 0.1 + uTime * 0.55 + uOffset) * 1.5;
    displaced.y += wave;
    displaced.z += sin(displaced.x * 0.03 + displaced.y * 0.08 - uTime * 0.7 + uOffset) * 4.5;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform float uOffset;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying vec2 vUv;

  void main() {
    float edge = abs(vUv.y - 0.5);
    float band = 1.0 - smoothstep(0.04, 0.5, edge);
    float shimmer = 0.76 + 0.24 * sin(vUv.x * 18.0 - uTime * 1.4 + uOffset);
    float blend = 0.5 + 0.5 * sin(vUv.x * 4.0 + vUv.y * 1.8 + uTime * 0.4 + uOffset);
    vec3 color = mix(uColorA, uColorB, blend);

    gl_FragColor = vec4(color, band * shimmer * 0.28);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const ribbonStyles = [
  { y: -11, z: -2, offset: 0, colors: [0x6d28d9, 0xc084fc] },
  { y: -2, z: 1, offset: 2.1, colors: [0x9333ea, 0xe9d5ff] },
  { y: 8, z: -1, offset: 4.2, colors: [0x7e22ce, 0xa855f7] },
];

export const Aurora = props => {
  const canvasRef = useRef();
  const animationRef = useRef();
  const rendererRef = useRef();
  const sceneRef = useRef();
  const cameraRef = useRef();
  const materialsRef = useRef([]);
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
    const geometry = new PlaneGeometry(240, 24, 160, 8);
    const materials = ribbonStyles.map(({ offset, colors }) => {
      const material = new ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uOffset: { value: offset },
          uColorA: { value: new Color(colors[0]) },
          uColorB: { value: new Color(colors[1]) },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        side: DoubleSide,
      });

      return material;
    });

    ribbonStyles.forEach(({ y, z }, index) => {
      const ribbon = new Mesh(geometry, materials[index]);
      ribbon.position.set(0, y, z);
      scene.add(ribbon);
    });

    const camera = new PerspectiveCamera(54, 1, 0.1, 100);
    camera.position.z = 52;

    const updateSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight * 1.3;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };

    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;
    materialsRef.current = materials;
    updateSize();
    window.addEventListener('resize', updateSize);

    return () => {
      window.removeEventListener('resize', updateSize);
      cancelAnimationFrame(animationRef.current);
      cleanScene(scene);
      cleanRenderer(renderer);
      rendererRef.current = undefined;
      sceneRef.current = undefined;
      cameraRef.current = undefined;
      materialsRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (
      !rendererRef.current ||
      !sceneRef.current ||
      !cameraRef.current ||
      reduceMotion ||
      !isInViewport
    ) {
      return;
    }

    let start;
    const animate = time => {
      animationRef.current = requestAnimationFrame(animate);
      if (start === undefined) start = time;
      const elapsed = (time - start) * 0.001;

      materialsRef.current.forEach((material, index) => {
        material.uniforms.uTime.value = elapsed;
        material.uniforms.uOffset.value =
          ribbonStyles[index].offset + elapsed * (0.1 + index * 0.035);
      });

      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    const resize = () => {
      cameraRef.current.aspect = window.innerWidth / (window.innerHeight * 1.3);
      cameraRef.current.updateProjectionMatrix();
    };
    resize();
    window.addEventListener('resize', resize);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
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
