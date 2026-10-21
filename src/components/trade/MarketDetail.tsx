import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';

import { clockShort, leagueShort, mmss } from '@/domain/format';
import type { Side } from '@/domain/types';
import { useMarket, useMatch } from '@/store/marketStore';
import { colors, fonts, space } from '@/theme';
import { AppText } from '../ui/AppText';
import { PressableScale } from '../ui/PressableScale';
import { Tag } from '../ui/Tag';
import { Consensus, OrderBook } from './MarketDepth';
import { ProbabilityPanel } from './ProbabilityPanel';
import { Scoreboard } from './Scoreboard';
import { TradeSlip } from './TradeSlip';

interface Props {
  marketId: string;
  side: Side;
  onSideChange?: (side: Side) => void;
  onBack?: () => void;
  /** Hide the inline slip when a split layout renders it in its own column. */
  showSlip?: boolean;
}

/** Market telemetry column: breadcrumb, scoreboard, proposition, chart, depth and (optionally) the trade slip. */
export function MarketDetail({ marketId, side, onSideChange, onBack, showSlip = true }: Props) {
  const market = useMarket(marketId);
  const match = useMatch(market?.matchId);
  if (!market || !match) return null;

  const live = match.status === 'live';
  const remaining = market.closesAt !== undefined && match.clock.mode === 'up' ? Math.max(0, market.closesAt - match.clock.seconds) : null;

  return (
    <View style={{ gap: space.lg }}>
      <View style={styles.between}>
        <PressableScale onPress={onBack} disabled={!onBack} style={[styles.inline, !onBack && { opacity: 1 }]} accessibilityLabel="Back">
          {onBack && <MaterialCommunityIcons name="arrow-left" size={18} color={colors.textSecondary} />}
          <AppText variant="label-md" upper color={colors.textSecondary}>
            {leagueShort(match.league)}
          </AppText>
          {match.stage && (
            <AppText variant="label-md" upper color={colors.cyan}>
              {match.stage}
            </AppText>
          )}
        </PressableScale>
        {market.status === 'settled' ? (
          <Tag label={`Settled ${market.outcome}`} tone={market.outcome === 'YES' ? 'yes' : 'no'} />
        ) : live ? (
          <Tag label="Live In-Play" tone="no" live />
        ) : (
          <Tag label={clockShort(match.clock)} tone="cyan" />
        )}
      </View>

      <Scoreboard match={match} />

      <View style={{ gap: space.sm }}>
        <View style={styles.inline}>
          <Tag label={market.tag} tone="yes" />
          {remaining !== null && (
            <View style={styles.inline}>
              <MaterialCommunityIcons name="timer-outline" size={14} color={colors.textSecondary} />
              <AppText variant="label-md" color={colors.textSecondary}>
                Expires in {mmss(remaining)}
              </AppText>
            </View>
          )}
        </View>
        <AppText variant="headline-xl" weight={fonts.display800} upper>
          {market.question}
        </AppText>
      </View>

      <ProbabilityPanel market={market} />

      <View style={styles.depth}>
        <OrderBook market={market} />
        <Consensus market={market} />
      </View>

      {showSlip && <TradeSlip marketId={market.id} side={side} onSideChange={onSideChange} />}
    </View>
  );
}

const styles = StyleSheet.create({
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.sm },
  inline: { flexDirection: 'row', alignItems: 'center', gap: space.sm, flexWrap: 'wrap' },
  depth: { flexDirection: 'row', gap: space.md },
});
