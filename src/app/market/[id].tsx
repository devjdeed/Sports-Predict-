import { router, useLocalSearchParams } from 'expo-router';

import { TradeView } from '@/components/trade/TradeView';

export default function MarketRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <TradeView marketId={id} onBack={() => (router.canGoBack() ? router.back() : router.replace('/'))} />;
}
