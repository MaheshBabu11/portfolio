import { lazy, Suspense } from 'react';

const Aurora = lazy(() =>
  import('./aurora').then(module => ({ default: module.Aurora })),
);
const Sphere = lazy(() =>
  import('./sphere').then(module => ({ default: module.Sphere })),
);
const Galaxy = lazy(() =>
  import('./galaxy').then(module => ({ default: module.Galaxy })),
);
const Meteors = lazy(() =>
  import('./meteors').then(module => ({ default: module.Meteors })),
);

export const BackgroundAnimation = ({ variant = 'sphere', ...props }) => {
  const animations = {
    sphere: Sphere,
    aurora: Aurora,
    galaxy: Galaxy,
    meteors: Meteors,
  };
  const Animation = animations[variant] || Sphere;

  return (
    <Suspense fallback={null}>
      <Animation {...props} />
    </Suspense>
  );
};
