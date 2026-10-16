import { createContext, useCallback, useContext, useState } from 'react';

const modes = ['sphere', 'aurora', 'galaxy', 'meteors'];
const BackgroundAnimationContext = createContext(null);

export function BackgroundAnimationProvider({ children }) {
  const [mode, setMode] = useState('galaxy');
  const nextMode = modes[(modes.indexOf(mode) + 1) % modes.length];
  const cycleMode = useCallback(() => {
    setMode(current => modes[(modes.indexOf(current) + 1) % modes.length]);
  }, []);

  return (
    <BackgroundAnimationContext.Provider value={{ mode, nextMode, cycleMode }}>
      {children}
    </BackgroundAnimationContext.Provider>
  );
}

export function useBackgroundAnimation() {
  const context = useContext(BackgroundAnimationContext);
  if (!context) {
    throw new Error('useBackgroundAnimation must be used within BackgroundAnimationProvider');
  }

  return context;
}
