import { TradeView } from '@/components/trade/TradeView';
import { useMarketStore } from '@/store/marketStore';

export default function TradeScreen() {
  const marketId = useMarketStore((s) => s.focusMarketId);
  return <TradeView marketId={marketId} switcher />;
}
