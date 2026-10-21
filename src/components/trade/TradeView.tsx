import { ScrollView } from 'react-native';

import { useResponsive } from '@/hooks/useResponsive';
import { useMarketStore } from '@/store/marketStore';
import { space } from '@/theme';
import { Screen } from '../layout/Screen';
import { Split } from '../layout/Split';
import { Chip } from '../ui/Chip';
import { MarketDetail } from './MarketDetail';
import { TradeSlip } from './TradeSlip';

/** Trade tab and market route: telemetry + execution. Tablets pin the slip in its own column. */
export function TradeView({ marketId, onBack, switcher }: { marketId: string; onBack?: () => void; switcher?: boolean }) {
  const { isTablet, margin } = useResponsive();
  const side = useMarketStore((s) => s.focusSide);
  const focus = useMarketStore((s) => s.focus);
  const markets = useMarketStore((s) => s.markets);
  const setSide = (next: typeof side) => focus(marketId, next);

  const picker = switcher ? (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -margin }} contentContainerStyle={{ gap: space.sm, paddingHorizontal: margin }}>
      {markets
        .filter((m) => m.status === 'open')
        .map((m) => (
          <Chip key={m.id} compact label={m.shortTitle} selected={m.id === marketId} onPress={() => focus(m.id)} />
        ))}
    </ScrollView>
  ) : null;

  if (isTablet) {
    return (
      <Screen fixed>
        <Split
          left={
            <>
              {picker}
              <MarketDetail marketId={marketId} side={side} onSideChange={setSide} onBack={onBack} showSlip={false} />
            </>
          }
          right={<TradeSlip marketId={marketId} side={side} onSideChange={setSide} />}
          rightWidth={380}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      {picker}
      <MarketDetail marketId={marketId} side={side} onSideChange={setSide} onBack={onBack} />
    </Screen>
  );
}
