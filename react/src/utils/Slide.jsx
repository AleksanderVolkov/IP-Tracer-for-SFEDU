// Slide.jsx
import React, { useState } from 'react';
import "./slide.scss";
import SlideItem from "../slide-item/SlideItem";
import { mapData } from "../../helpers/mapData";
import MapBox from '../map-box/MapBox';

export default function Slide({ numSlide }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Проверка наличия данных для данного слайда
  if (!mapData[0] || !mapData[0].result) {
    return null;
  }

  // Получение данных для текущего слайда
  const slideData = mapData[0].result;
  const latitude = slideData['[Lat]'][numSlide];
  const longitude = slideData['[Lon]'][numSlide];

  return (
    <div className="slide-inner">
      <ul className="table">
        <div className="table-inner">
          <SlideItem name="IP-адрес" value={slideData['[IP]'][numSlide]} color="red" />
          <SlideItem name="Страна" value={slideData['[Country]'][numSlide]} />
          <SlideItem name="Регион" value={slideData['[RegionName]'][numSlide]} />
          <SlideItem name="Город" value={slideData['[City]'][numSlide]} />
          <SlideItem name="Широта" value={latitude} /> 
          <SlideItem name="Долгота" value={longitude} />
        </div>
      </ul>
      <MapBox latitude={latitude} longitude={longitude} />
    </div>
  );
}
