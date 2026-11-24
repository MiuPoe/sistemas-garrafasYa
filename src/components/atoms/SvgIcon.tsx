import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Svg, { Path, Circle, Rect, Polyline, Polygon } from 'react-native-svg';
import { Colors } from '../../theme/colors';

export type SvgIconName =
  | 'truck'
  | 'cylinder'
  | 'map'
  | 'mapPin'
  | 'bell'
  | 'user'
  | 'shieldCheck'
  | 'check'
  | 'checkCircle'
  | 'clock'
  | 'alertTriangle'
  | 'plus'
  | 'eye'
  | 'refresh'
  | 'chevronDown'
  | 'chevronRight'
  | 'chevronLeft'
  | 'filter'
  | 'search'
  | 'phone'
  | 'dollar'
  | 'close'
  | 'play'
  | 'square'
  | 'layers'
  | 'fileText'
  | 'barChart'
  | 'calendar'
  | 'info'
  | 'location'
  | 'home'
  | 'moreHorizontal'
  | 'newspaper'
  | 'users'
  | 'logout';

interface SvgIconProps {
  name: SvgIconName;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export const SvgIcon: React.FC<SvgIconProps> = ({
  name,
  size = 20,
  color = Colors.textPrimary,
  style,
}) => {
  const renderPath = () => {
    switch (name) {
      case 'truck':
        return (
          <>
            <Path d="M1 3h15v13H1z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Path d="M16 8h4l3 3v5h-7V8z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Circle cx="5.5" cy="18.5" r="2.5" stroke={color} strokeWidth="2" fill="none" />
            <Circle cx="18.5" cy="18.5" r="2.5" stroke={color} strokeWidth="2" fill="none" />
          </>
        );

      case 'cylinder':
        return (
          <>
            <Rect x="6" y="8" width="12" height="13" rx="3" stroke={color} strokeWidth="2" fill="none" />
            <Path d="M8 8V5a2 2 0 012-2h4a2 2 0 012 2v3" stroke={color} strokeWidth="2" fill="none" />
            <Path d="M10 3h4" stroke={color} strokeWidth="2" strokeLinecap="round" />
            <Path d="M10 13h4" stroke={color} strokeWidth="2" strokeLinecap="round" />
          </>
        );

      case 'map':
        return (
          <Path
            d="M1 6v15l7-4 8 4 7-4V2l-7 4-8-4-7 4zm7-4v15m8-11v15"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );

      case 'mapPin':
        return (
          <>
            <Path
              d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <Circle cx="12" cy="10" r="3" stroke={color} strokeWidth="2" fill="none" />
          </>
        );

      case 'bell':
        return (
          <>
            <Path
              d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <Path d="M13.73 21a2 2 0 01-3.46 0" stroke={color} strokeWidth="2" strokeLinecap="round" />
          </>
        );

      case 'user':
        return (
          <>
            <Path
              d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2" fill="none" />
          </>
        );

      case 'shieldCheck':
        return (
          <>
            <Path
              d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <Polyline
              points="9 12 11 14 15 10"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </>
        );

      case 'check':
        return (
          <Polyline
            points="20 6 9 17 4 12"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );

      case 'checkCircle':
        return (
          <>
            <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
            <Polyline
              points="9 12 11 14 15 10"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </>
        );

      case 'clock':
        return (
          <>
            <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
            <Polyline
              points="12 6 12 12 16 14"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </>
        );

      case 'alertTriangle':
        return (
          <>
            <Path
              d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <Path d="M12 9v4M12 17h.01" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          </>
        );

      case 'plus':
        return <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2.5" strokeLinecap="round" />;

      case 'eye':
        return (
          <>
            <Path
              d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" fill="none" />
          </>
        );

      case 'refresh':
        return (
          <>
            <Polyline
              points="23 4 23 10 17 10"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <Path
              d="M20.49 15a9 9 0 11-2.12-9.36L23 10"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </>
        );

      case 'chevronDown':
        return <Polyline points="6 9 12 15 18 9" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />;

      case 'chevronRight':
        return <Polyline points="9 18 15 12 9 6" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />;

      case 'chevronLeft':
        return <Polyline points="15 18 9 12 15 6" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />;

      case 'filter':
        return <Polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />;

      case 'search':
        return (
          <>
            <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2" fill="none" />
            <Path d="M21 21l-4.35-4.35" stroke={color} strokeWidth="2" strokeLinecap="round" />
          </>
        );

      case 'phone':
        return (
          <Path
            d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );

      case 'dollar':
        return <Path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke={color} strokeWidth="2" strokeLinecap="round" />;

      case 'close':
        return <Path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth="2.5" strokeLinecap="round" />;

      case 'play':
        return <Path d="M5 3l14 9-14 9V3z" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />;

      case 'square':
        return <Rect x="4" y="4" width="16" height="16" rx="2" fill={color} stroke={color} strokeWidth="1.5" />;

      case 'layers':
        return (
          <>
            <Polygon points="12 2 2 7 12 12 22 7 12 2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Polyline points="2 17 12 22 22 17" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );

      case 'fileText':
        return (
          <>
            <Path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Polyline points="14 2 14 8 20 8" stroke={color} strokeWidth="2" fill="none" />
            <Path d="M16 13H8M16 17H8M10 9H8" stroke={color} strokeWidth="2" strokeLinecap="round" />
          </>
        );

      case 'barChart':
        return <Path d="M18 20V10M12 20V4M6 20v-6" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />;

      case 'calendar':
        return (
          <>
            <Rect x="3" y="4" width="18" height="18" rx="2" stroke={color} strokeWidth="2" fill="none" />
            <Path d="M16 2v4M8 2v4M3 10h18" stroke={color} strokeWidth="2" strokeLinecap="round" />
          </>
        );

      case 'info':
        return (
          <>
            <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
            <Path d="M12 16v-4M12 8h.01" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          </>
        );

      case 'location':
        return (
          <>
            <Circle cx="12" cy="12" r="4" stroke={color} strokeWidth="2" fill="none" />
            <Path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke={color} strokeWidth="2" strokeLinecap="round" />
          </>
        );

      case 'home':
        return (
          <>
            <Path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Polyline points="9 22 9 12 15 12 15 22" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );

      case 'moreHorizontal':
        return (
          <>
            <Circle cx="12" cy="12" r="2" fill={color} />
            <Circle cx="19" cy="12" r="2" fill={color} />
            <Circle cx="5" cy="12" r="2" fill={color} />
          </>
        );

      case 'newspaper':
        return (
          <>
            <Path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Path d="M18 14h-8M15 18h-5M10 6h8v4h-8z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );

      case 'users':
        return (
          <>
            <Path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2" fill="none" />
            <Path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );

      case 'logout':
        return (
          <>
            <Path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Polyline points="16 17 21 12 16 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Path d="M21 12H9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        );

      default:
        return <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />;
    }
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      {renderPath()}
    </Svg>
  );
};
