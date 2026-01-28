import React, { useMemo, useRef } from 'react';
import { View, PanResponder, GestureResponderEvent, PanResponderGestureState } from 'react-native';
import { usePathname, useRouter } from 'expo-router';

type Props = {
  children: React.ReactNode;
};

export default function SwipeTabsWrapper({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const lastNavAt = useRef(0);

  const panResponder = useMemo(() => {
    // Ajustes finos para que se sienta “natural” con scroll vertical
    const SWIPE_THRESHOLD = 70;         // px mínimos para navegar
    const START_THRESHOLD = 10;         // px para empezar a capturar
    const HORIZONTAL_DOMINANCE = 1.25;  // dx debe dominar a dy
    const COOLDOWN_MS = 600;            // evita doble navegación

    const canNavigate = () => {
      const now = Date.now();
      if (now - lastNavAt.current < COOLDOWN_MS) return false;
      lastNavAt.current = now;
      return true;
    };

    const isHorizontalSwipe = (g: PanResponderGestureState) => {
      const adx = Math.abs(g.dx);
      const ady = Math.abs(g.dy);
      return adx > START_THRESHOLD && adx > ady * HORIZONTAL_DOMINANCE;
    };

    const normalizePath = (p?: string) => {
      if (!p) return '/';
      // expo-router a veces entrega cosas tipo "/(tabs)/advanced" dependiendo de config
      // así que normalizamos por si acaso.
      if (p.includes('advanced')) return '/advanced';
      if (p === '/index') return '/';
      return p;
    };

    return PanResponder.create({
      // Importante: permitir que el scroll vertical funcione normal,
      // pero si detectamos horizontal claro, capturamos.
      onMoveShouldSetPanResponder: (_evt, g) => isHorizontalSwipe(g),
      onMoveShouldSetPanResponderCapture: (_evt, g) => isHorizontalSwipe(g),

      onPanResponderTerminationRequest: () => true,

      onPanResponderRelease: (_evt, g) => {
        const adx = Math.abs(g.dx);
        const ady = Math.abs(g.dy);

        // Si no fue horizontal dominante, no hacemos nada
        if (!(adx > ady * HORIZONTAL_DOMINANCE)) return;
        if (adx < SWIPE_THRESHOLD) return;
        if (!canNavigate()) return;

        const current = normalizePath(pathname);

        const isSimple = current === '/';
        const isAdvanced = current === '/advanced';

        // Swipe izquierda => ir a Avanzada (solo si estás en Simple)
        if (g.dx < 0) {
          if (isSimple) router.replace('/advanced');
          return;
        }

        // Swipe derecha => volver a Simple (solo si estás en Avanzada)
        if (g.dx > 0) {
          if (isAdvanced) router.replace('/');
        }
      },
    });
  }, [router, pathname]);

  return (
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
      {children}
    </View>
  );
}
