import { useEffect, useMemo, useRef, useState } from 'react'
import mapboxgl, { Map as MapboxMap, GeoJSONSource } from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

type ReportFeature = {
  type: 'Feature'
  properties: {
    id: string
    title: string
    severity: 'low' | 'medium' | 'high'
  }
  geometry: {
    type: 'Point'
    coordinates: [number, number]
  }
}

function generateMockReports(count: number, bbox: [number, number, number, number]): ReportFeature[] {
  const [minLng, minLat, maxLng, maxLat] = bbox
  const features: ReportFeature[] = []
  for (let i = 0; i < count; i++) {
    const lng = minLng + Math.random() * (maxLng - minLng)
    const lat = minLat + Math.random() * (maxLat - minLat)
    const sev = (['low','medium','high'] as const)[Math.floor(Math.random()*3)]
    features.push({
      type: 'Feature',
      properties: { id: `r_${i}`, title: `Report ${i}`, severity: sev },
      geometry: { type: 'Point', coordinates: [lng, lat] },
    })
  }
  return features
}

export function MapView() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<MapboxMap | null>(null)
  const [accessToken] = useState<string>(import.meta.env.VITE_MAPBOX_TOKEN || '')
  const data = useMemo(() => ({
    type: 'FeatureCollection',
    features: generateMockReports(250, [68, 7, 97, 22]), // India coastal bbox approx
  }), []) as unknown as GeoJSON.FeatureCollection

  useEffect(() => {
    mapboxgl.accessToken = accessToken || 'no-token'
    if (!containerRef.current || mapRef.current) return

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'https://api.maptiler.com/maps/streets/style.json?key=Get_Your_Own_Key',
      center: [78.9629, 20.5937],
      zoom: 4.2,
      attributionControl: true,
    })
    mapRef.current = map

    map.on('load', () => {
      map.addSource('reports', {
        type: 'geojson',
        data,
        cluster: true,
        clusterMaxZoom: 12,
        clusterRadius: 40,
      })

      map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'reports',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#39BEBB',
            10, '#2CA6A4',
            50, '#176B87',
            100, '#0B486B',
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            16,
            10, 20,
            50, 26,
            100, 32,
          ],
        },
      })

      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'reports',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': ['get', 'point_count_abbreviated'],
          'text-font': ['Open Sans Bold','Arial Unicode MS Bold'],
          'text-size': 12,
        },
        paint: {
          'text-color': '#ffffff',
        },
      })

      map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'reports',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': [
            'match', ['get', 'severity'],
            'high', '#FF6B35',
            'medium', '#39BEBB',
            /* other */ '#176B87'
          ],
          'circle-radius': 6,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#ffffff',
        },
      })

      map.on('click', 'clusters', (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] })
        if (!features.length) return
        const clusterId = features[0].properties?.cluster_id as number | undefined
        if (clusterId === undefined) return
        const source = map.getSource('reports') as GeoJSONSource
        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err || zoom == null) return
          const center = (features[0].geometry as any).coordinates as [number, number]
          map.easeTo({ center, zoom })
        })
      })

      map.on('click', 'unclustered-point', (e) => {
        const feature = e.features?.[0] as any
        if (!feature) return
        const coordinates = feature.geometry.coordinates.slice()
        const title = feature.properties.title
        new mapboxgl.Popup({ offset: 12 })
          .setLngLat(coordinates)
          .setHTML(`<div style="font-weight:600;">${title}</div><div style="font-size:12px;color:#555">Severity: ${feature.properties.severity}</div>`)
          .addTo(map)
      })

      map.on('mouseenter', 'clusters', () => { map.getCanvas().style.cursor = 'pointer' })
      map.on('mouseleave', 'clusters', () => { map.getCanvas().style.cursor = '' })
      map.on('mouseenter', 'unclustered-point', () => { map.getCanvas().style.cursor = 'pointer' })
      map.on('mouseleave', 'unclustered-point', () => { map.getCanvas().style.cursor = '' })
    })

    return () => { map.remove() }
  }, [accessToken, data])

  return <div ref={containerRef} className="absolute inset-0" />
}

