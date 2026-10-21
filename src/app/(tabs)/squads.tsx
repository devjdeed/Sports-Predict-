import { Screen } from '@/components/layout/Screen';
import { Split } from '@/components/layout/Split';
import { DuelCard, ForecasterCard, PulseFeed, SectionTitle, SquadsHeader, SyndicateCard } from '@/components/squads/SquadModules';
import { forecasters } from '@/data/social';
import { useResponsive } from '@/hooks/useResponsive';

export default function SquadsScreen() {
  const { isTablet } = useResponsive();

  const squad = (
    <>
      <SquadsHeader />
      <SyndicateCard />
      <DuelCard />
      <PulseFeed />
    </>
  );

  const elite = (
    <>
      <SectionTitle icon="check-decagram-outline" title="Elite Forecasters" right="Whales & Sharps" />
      {forecasters.map((f) => (
        <ForecasterCard key={f.id} f={f} />
      ))}
    </>
  );

  if (isTablet) {
    return (
      <Screen fixed>
        <Split left={squad} right={elite} />
      </Screen>
    );
  }

  return (
    <Screen>
      <SquadsHeader />
      <SyndicateCard />
      {elite}
      <DuelCard />
      <PulseFeed />
    </Screen>
  );
}
