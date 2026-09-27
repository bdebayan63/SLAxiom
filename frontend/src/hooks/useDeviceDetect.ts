import { useSyncExternalStore } from 'react';

// ==============================================================================
// Hardware-Level Device & Pointer Capability Detection
// ==============================================================================

export interface DeviceInfo {
  isMobile: boolean;
  hasTouch: boolean;
  hasCoarsePointer: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  os: 'ios' | 'android' | 'macos' | 'windows' | 'linux' | 'unknown';
}

function detectOS(): DeviceInfo['os'] {
  if (typeof window === 'undefined') return 'unknown';
  const ua = window.navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return 'ios';
  if (/android/.test(ua)) return 'android';
  if (/macintosh|mac os x/.test(ua)) return 'macos';
  if (/windows/.test(ua)) return 'windows';
  if (/linux/.test(ua)) return 'linux';
  return 'unknown';
}

const SERVER_SNAPSHOT: DeviceInfo = {
  isMobile: false,
  hasTouch: false,
  hasCoarsePointer: false,
  isTablet: false,
  isDesktop: true,
  os: 'unknown',
};

let cachedDeviceState: DeviceInfo | null = null;

function getCachedDeviceState(): DeviceInfo {
  if (typeof window === 'undefined') return SERVER_SNAPSHOT;

  const hasTouch = (window.navigator?.maxTouchPoints ?? 0) > 0;
  const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const width = window.innerWidth;

  const isMobile = (hasTouch && hasCoarsePointer && width < 768) || width < 768;
  const isTablet = hasTouch && width >= 768 && width <= 1024;
  const isDesktop = !isMobile && !isTablet;
  const os = detectOS();

  if (
    !cachedDeviceState ||
    cachedDeviceState.isMobile !== isMobile ||
    cachedDeviceState.hasTouch !== hasTouch ||
    cachedDeviceState.hasCoarsePointer !== hasCoarsePointer ||
    cachedDeviceState.isTablet !== isTablet ||
    cachedDeviceState.isDesktop !== isDesktop ||
    cachedDeviceState.os !== os
  ) {
    cachedDeviceState = {
      isMobile,
      hasTouch,
      hasCoarsePointer,
      isTablet,
      isDesktop,
      os,
    };
  }

  return cachedDeviceState;
}

export function useDeviceDetect(): DeviceInfo {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener('resize', callback);
      const mqCoarse = window.matchMedia('(pointer: coarse)');
      mqCoarse.addEventListener('change', callback);

      return () => {
        window.removeEventListener('resize', callback);
        mqCoarse.removeEventListener('change', callback);
      };
    },
    getCachedDeviceState,
    () => SERVER_SNAPSHOT
  );
}
