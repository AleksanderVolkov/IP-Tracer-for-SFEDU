// MapBox.jsx
import React, { useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './mapBox.scss';

const MapBox = ({ latitude, longitude }) => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://api.maptiler.com/maps/streets/style.json?key=2zkWV1cCK3UbcT0l3Z93', // URL стиля Maptiler
      center: [longitude, latitude],
      zoom: 9,
    });

    new maplibregl.Marker()
      .setLngLat([longitude, latitude])
      .addTo(map);

    map.flyTo({ center: [longitude, latitude], zoom: 14 });

    return () => map.remove();
  }, [latitude, longitude]);

  return <div className="map-container" ref={mapContainerRef} />;
};

export default MapBox;
