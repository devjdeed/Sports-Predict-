import Svg, { Line, Rect } from 'react-native-svg';

import { colors } from '@/theme';

/** Tiny candlestick strip summarising recent price action in buckets. */
export function CandleMini({ data, buckets = 5, width = 110, height = 32 }: { data: number[]; buckets?: number; width?: number; height?: number }) {
  const slice = data.slice(-buckets * 6);
  const size = Math.max(1, Math.floor(slice.length / buckets));
  const candles = Array.from({ length: buckets }, (_, i) => slice.slice(i * size, (i + 1) * size)).filter((c) => c.length);
  const all = slice.length ? slice : [50];
  const lo = Math.min(...all) - 1;
  const hi = Math.max(...all) + 1;
  const y = (v: number) => height - ((v - lo) / (hi - lo)) * height;
  const step = width / buckets;

  return (
    <Svg width={width} height={height}>
      {candles.map((c, i) => {
        const open = c[0];
        const close = c[c.length - 1];
        const up = close >= open;
        const color = up ? colors.yes : colors.no;
        const cx = i * step + step / 2;
        const top = y(Math.max(open, close));
        const body = Math.max(3, Math.abs(y(open) - y(close)));
        return [
          <Line key={`w${i}`} x1={cx} x2={cx} y1={y(Math.max(...c))} y2={y(Math.min(...c))} stroke={color} strokeWidth={1.5} />,
          <Rect key={`b${i}`} x={cx - 3} y={top} width={6} height={body} rx={1} fill={color} />,
        ];
      })}
    </Svg>
  );
}
