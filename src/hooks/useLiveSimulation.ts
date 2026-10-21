import { useEffect } from 'react';
import { AppState } from 'react-native';

import { TICK_MS } from '@/services/liveSimulator';
import { useMarketStore } from '@/store/marketStore';
import { toast } from '@/store/toastStore';
import { useTradingStore } from '@/store/tradingStore';

/** Drives the mock live feed while the app is foregrounded, settling positions and limit orders as prices move. */
export function useLiveSimulation() {
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;

    const run = () => {
      const resolutions = useMarketStore.getState().tick();
      const trading = useTradingStore.getState();
      for (const r of trading.applyResolutions(resolutions)) toast(r.message, r.ok ? 'yes' : 'no');
      for (const r of trading.fillLimits()) toast(r.message, 'info');
    };

    const start = () => {
      if (!timer) timer = setInterval(run, TICK_MS);
    };
    const stop = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };

    start();
    const sub = AppState.addEventListener('change', (state) => (state === 'active' ? start() : stop()));
    return () => {
      stop();
      sub.remove();
    };
  }, []);
}
