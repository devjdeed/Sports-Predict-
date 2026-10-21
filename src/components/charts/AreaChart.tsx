import { useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop, Text as SvgText } from 'react-native-svg';

import { colors, fonts } from '@/theme';

export interface ChartMarker {
  index: number;
  color: string;
}

interface Props {
  data: number[];
  height: number;
  color?: string;
  /** Fixed y-domain (e.g. 0–100 for cents); otherwise padded around the data. */
  domain?: [number, number];
  gridLines?: number[];
  markers?: ChartMarker[];
  formatGrid?: (v: number) => string;
  strokeWidth?: number;
}

/** Smooth line + gradient area, with optional grid labels and event markers. */
export function AreaChart({ data, height, color = colors.yes, domain, gridLines, markers, formatGrid, strokeWidth = 2.5 }: Props) {
  const [width, setWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  const min = domain ? domain[0] : Math.min(...data);
  const max = domain ? domain[1] : Math.max(...data);
  const pad = domain ? 0 : (max - min) * 0.15 || 1;
  const lo = min - pad;
  const hi = max + pad;
  const top = 8;
  const bottom = height - 4;

  const x = (i: number) => (data.length <= 1 ? width : (i / (data.length - 1)) * (width - 8));
  const y = (v: number) => bottom - ((v - lo) / (hi - lo || 1)) * (bottom - top);

  const points = data.map((v, i) => [x(i), y(v)] as const);
  const line = points.reduce((d, [px, py], i) => {
    if (i === 0) return `M${px},${py}`;
    const [qx, qy] = points[i - 1];
    const cx = (qx + px) / 2;
    return `${d} C${cx},${qy} ${cx},${py} ${px},${py}`;
  }, '');
  const area = points.length ? `${line} L${points[points.length - 1][0]},${height} L0,${height} Z` : '';
  const last = points[points.length - 1];
  const gradientId = `area-${color.replace('#', '')}`;

  return (
    <View style={{ height }} onLayout={onLayout}>
      {width > 0 && data.length > 1 && (
        <Svg width={width} height={height}>
          <Defs>
            <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={color} stopOpacity={0.32} />
              <Stop offset="1" stopColor={color} stopOpacity={0} />
            </LinearGradient>
          </Defs>
          {gridLines?.map((g) => (
            <Line key={g} x1={0} x2={width} y1={y(g)} y2={y(g)} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 4" />
          ))}
          {gridLines?.map((g) => (
            <SvgText key={`l${g}`} x={4} y={y(g) - 4} fill={colors.textMuted} fontSize={9} fontFamily={fonts.mono500}>
              {formatGrid ? formatGrid(g) : g}
            </SvgText>
          ))}
          <Path d={area} fill={`url(#${gradientId})`} />
          <Path d={line} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
          {markers?.map((m) =>
            points[m.index] ? (
              <Line key={`m${m.index}`} x1={points[m.index][0]} x2={points[m.index][0]} y1={points[m.index][1]} y2={height} stroke={m.color} strokeDasharray="3 3" strokeWidth={1.5} />
            ) : null,
          )}
          {markers?.map((m) =>
            points[m.index] ? <Circle key={`c${m.index}`} cx={points[m.index][0]} cy={points[m.index][1]} r={5} fill={m.color} stroke={colors.text} strokeWidth={2} /> : null,
          )}
          {last && <Circle cx={last[0]} cy={last[1]} r={4.5} fill={color} stroke={colors.bg} strokeWidth={2} />}
        </Svg>
      )}
    </View>
  );
}
