
// eslint-disable-next-line no-use-before-define
import * as React from 'react'
import { MapView, Overlay } from 'react-native-baidu-map'

// 气泡，支持度待定
/**
 * 标记点气泡 callout
 */
type Callouts = {
  content?: string;
  color?: string;
  fontSize?: number;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  bgColor?: string;
  padding?: number;
  display?: 'BYCLICK' | 'ALWAYS';
  textAlign?: 'left' | 'right' | 'center';
}

/**
 * 标记点
 */
type Marker = {
  id?: number;
  latitude: number;
  longitude: number;
  title?: string;
  iconPath: string;
  rotate?: number;
  alpha?: number;
  //   width?: number;
  //   height?: number;
  callout?: Callouts;
  // label?: Label;
  anchor?: { x: number; y: number };// 暂无
}

/**
 * 多段线
 */
type Polyline = {
  points: Array<{ latitude: number; longitude: number }>;
  color?: string;
  width?: number;
}

/**
 * 多边形
 */
type Polygon = {
  points: Array<{ latitude: number; longitude: number }>;
  strokeWidth?: number;
  strokeColor?: string;
  fillColor?: string;
}

/**
 * 圆形
 */
type Circle = {
  latitude: number;
  longitude: number;
  color?: string;
  fillColor?: string;
  radius: number;
  strokeWidth?: number;
}

/**
 * 坐标
 */
type Coordinate = {
  latitude: number;
  longitude: number;
}

export interface Props {
  longitude: number;
  latitude: number;
  scale?: number;
  markers?: Array<Marker>;
  polyline?: Array<Polyline>;
  polygons?: Array<Polygon>;
  circles?: Array<Circle>;
  includePoints?: Array<Coordinate>;
  showLocation?: boolean;
  subkey?: string;
  enable3D?: boolean;
  showCompass?: boolean;
  enableOverlooking?: boolean;
  enableZoom?: boolean;
  enableScroll?: boolean;
  enableRotate?: boolean;
  enableTraffic?: boolean;

  onMarkerTap?(markerId?: number): void;

  onCalloutTap?(markerId?: number): void;

  onControlTap?(controlId?: number): void;

  onRegionChange?(event: { type: 'begin' | 'end'; timeStamp: number; causedBy?: 'scale' | 'drag' | 'update' }): void;

  onTap?(coordinate: Coordinate): void;

  onUpdated?(): void;

  onPoiTap?(): void;
}

export interface State {
  networkState: string;
}
export const noop = (...args: any[]): void => { }

export default class Map extends React.Component<Props, State> {
  static defaultProps: Props = {
    longitude: 0,
    latitude: 0,
    scale: 16,
    markers: [],
    polyline: [],
    polygons: [],
    circles: [],
    includePoints: [],
    subkey: '',
    enableZoom: true,
    enableScroll: true,
    enableTraffic: false,
    onMarkerTap: noop,
    onCalloutTap: noop,
    onControlTap: noop,
    onRegionChange: noop,
    onTap: noop,
    onUpdated: noop,
    onPoiTap: noop
  }

  _onClick = (e): void => {
    const { onTap } = this.props
    const { latitude, longitude } = e
    const coordinate: Coordinate = {
      latitude,
      longitude
    }
    onTap && onTap(coordinate)
  }

  _onMapReady = (): void => {
    const { onUpdated } = this.props
    onUpdated && onUpdated()
  }

  _onPoiClick = (): void => {
    const { onPoiTap } = this.props
    onPoiTap && onPoiTap()
  }

  _onRegionChange = (): void => {
    const { onRegionChange } = this.props
    onRegionChange && onRegionChange({
      type: 'begin',
      timeStamp: Date.now()
    })
  }

  render ():JSX.Element {
    const {
      latitude,
      longitude,
      markers,
      polyline,
      polygons,
      circles,
      showLocation,
      enableZoom,
      enableScroll,
      enableTraffic,
      onMarkerTap,
      scale
    } = this.props

    return (
      <MapView
        // @ts-ignore
        width={'100%'}
        height={'100%'}
        locationData={{
          latitude,
          longitude
        }}
        center={{
          latitude,
          longitude
        }}
        showsUserLocation={showLocation}
        zoomGesturesEnabled={enableZoom}
        scrollGesturesEnabled={enableScroll}
        trafficEnabled={enableTraffic}
        zoom={scale}
        onMapClick={this._onClick}
        onMapPoiClick={this._onPoiClick}
        onMarkerClick={() => {
          onMarkerTap && onMarkerTap()
        }}
        onMapStatusChange={this._onRegionChange}
        onMapLoaded={this._onMapReady}
      >
        {(markers || []).map((marker, index) => (
          <Overlay.Marker
            key={marker.id || `marker_${index}`}
            location={{
              latitude: marker.latitude,
              longitude: marker.longitude
            }}
            title={marker.title}
            icon={{ uri: marker.iconPath }}
            rotate={marker.rotate}
            // @ts-ignore
            onClick={() => {
              onMarkerTap && onMarkerTap(marker.id)
            }}
          >
          </Overlay.Marker>
        ))}
        {(polyline || []).map((p, index) => (
          <Overlay.Polyline
            key={`polyline_${index}`}
            points={p.points}
            stroke={{
              width: p.width || 5,
              color: p.color || 'AA000000'
            }}
          />
        ))}
        {(polygons || []).map((p, index) => (
          <Overlay.Polygon
            key={`polygon_${index}`}
            points={p.points}
            stroke={{
              width: p.strokeWidth || 5,
              color: p.strokeColor || 'AA000000'
            }}
            fillColor={p.fillColor}
          />
        ))}
        {(circles || []).map((c, index) => (
          <Overlay.Circle
            key={`circle_${index}`}
            center={{ latitude: c.latitude, longitude: c.longitude }}
            fillColor={c.fillColor || '000000FF'}
            radius={c.radius}
            stroke={{
              width: c.strokeWidth || 5,
              color: c.color || 'AA000000'
            }}
          />
        ))}
      </MapView>
    )
  }
}
