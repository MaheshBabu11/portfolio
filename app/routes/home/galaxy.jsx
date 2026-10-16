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
import styles from './displacement-sphere.module.css';

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

  float hash21(vec2 point) {
    return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 point) {
    vec2 cell = floor(point);
    vec2 local = fract(point);
    local = local * local * (3.0 - 2.0 * local);

    float bottom = mix(
      hash21(cell),
      hash21(cell + vec2(1.0, 0.0)),
      local.x
    );
    float top = mix(
      hash21(cell + vec2(0.0, 1.0)),
      hash21(cell + vec2(1.0, 1.0)),
      local.x
    );
    return mix(bottom, top, local.y);
  }

  float fbm(vec2 point) {
    float value = 0.0;
    float amplitude = 0.5;
    mat2 rotation = mat2(1.6, 1.2, -1.2, 1.6);

    for (int octave = 0; octave < 4; octave++) {
      value += amplitude * noise(point);
      point = rotation * point;
      amplitude *= 0.5;
    }

    return value;
  }

  void main() {
    vec2 point = (vUv - 0.5) * vec2(uAspect, 1.0);
    float rotationAngle = uTime * 0.24;
    mat2 rotation = mat2(
      cos(rotationAngle),
      -sin(rotationAngle),
      sin(rotationAngle),
      cos(rotationAngle)
    );
    vec2 galaxyPoint = rotation * (point * vec2(0.94, 1.12));
    float radius = length(galaxyPoint);
    float angle = atan(galaxyPoint.y, galaxyPoint.x + 0.000001);
    float spiral = angle * 4.0 - log(radius + 0.045) * 5.5;
    float armShape = pow(max(cos(spiral), 0.0), 5.0);
    float diskFade = 1.0 - smoothstep(0.52, 0.86, radius);

    float clouds = fbm(galaxyPoint * 20.0 + vec2(uTime * 0.008, -uTime * 0.004));
    float dust = fbm(galaxyPoint * 42.0 + vec2(3.4, 1.8));
    float armLight = armShape * diskFade * smoothstep(0.035, 0.14, radius);
    armLight *= 0.3 + clouds * 1.4;
    armLight *= 1.0 - smoothstep(0.42, 0.76, dust) * 0.5;

    float redClouds = smoothstep(0.52, 0.78, clouds) * armLight;
    float nebula = smoothstep(0.42, 0.78, clouds) * diskFade;
    float bulge = exp(-radius * 4.5) * diskFade;
    float core = exp(-radius * 21.0);

    vec3 blueArm = mix(vec3(0.035, 0.12, 0.3), vec3(0.1, 0.16, 0.28), uLightMode);
    vec3 redArm = mix(vec3(0.38, 0.045, 0.1), vec3(0.35, 0.11, 0.18), uLightMode);
    vec3 color = vec3(0.004, 0.006, 0.016);
    color += blueArm * (armLight + nebula * 0.3);
    color += redArm * redClouds * 1.8;
    color += mix(vec3(0.24, 0.12, 0.4), vec3(0.22, 0.17, 0.29), uLightMode) * bulge;
    color += mix(vec3(1.0, 0.78, 0.58), vec3(0.68, 0.45, 0.2), uLightMode) * core * 2.0;

    vec2 starGrid = vUv * vec2(700.0, 420.0);
    vec2 starCell = floor(starGrid);
    vec2 starLocal = fract(starGrid) - 0.5;
    float starSeed = hash21(starCell);
    float starDot = step(0.998, starSeed) *
      (1.0 - smoothstep(0.04, 0.27, length(starLocal)));
    float brightStar = step(0.9998, hash21(starCell + vec2(13.0, 29.0)));
    float crossGlow = max(
      exp(-abs(starLocal.x) * 38.0) * exp(-abs(starLocal.y) * 5.0),
      exp(-abs(starLocal.y) * 38.0) * exp(-abs(starLocal.x) * 5.0)
    ) * brightStar;

    color += mix(vec3(0.62, 0.72, 1.0), vec3(0.25, 0.2, 0.32), uLightMode) *
      (starDot * 0.8 + crossGlow * 0.7);
    float alpha = clamp(
      0.035 + nebula * 0.2 + armLight * 0.62 + bulge * 0.28 + core * 0.35 +
        starDot * 0.75 + crossGlow * 0.65,
      0.0,
      0.92
    );
    alpha = clamp(alpha * mix(1.0, 1.35, uLightMode), 0.0, 0.9);

    gl_FragColor = vec4(color, alpha);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export const Galaxy = props => {
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
