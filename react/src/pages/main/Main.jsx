import '../../styles/index.scss';
import "./main.scss";
import SearchMenu from "../../components/search-menu/SearchMenu";
import Slide from "../../components/slide/Slide";
import handleClick from "../../utils/handleClick";
import sendIp from "../../utils/sendIp";
import logo from "../../images/logo.png";
import search from "../../images/search.svg";

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';

import { Navigation } from 'swiper/modules';
import { NavLink, useNavigate } from "react-router-dom";

// Импорт библиотек для скачивания файлов
import { saveAs } from 'file-saver'; 
import * as XLSX from 'xlsx'; 
import { Document, Packer, Paragraph, TextRun } from 'docx'; 
import { useState, useRef } from 'react';

import { mapData } from '../../helpers/mapData'; // Импорт данных

export default function Main() {
  const navigate = useNavigate();
  const searchMenuRef = useRef(); // Создаем реф для доступа к функциям компонента SearchMenu
  const [showDownloadModal, setShowDownloadModal] = useState(false); // Состояние для модального окна скачивания
  const [loading, setLoading] = useState(false);  // Состояние для загрузки

  const handleSearch = async () => {
    setLoading(true);  // Включить индикатор загрузки
    try {
      await sendIp();
      if (searchMenuRef.current) {
        searchMenuRef.current.fetchData(); // Обновляем список запросов после поиска
      }
      navigate("/main/Main");
    } catch (error) {
      console.error('Ошибка:', error.message);
      alert(error.message);
    } finally {
      setLoading(false);  // Выключить индикатор загрузки
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch(); // Вызов функции поиска при нажатии Enter
    }
  };

  // Открытие/закрытие модального окна для скачивания
  const toggleDownloadModal = () => {
    setShowDownloadModal(!showDownloadModal);
  };

  // Обработка выбора формата и скачивания файла
  const handleDownload = (format) => {
    setLoading(true);  // Включить индикатор загрузки при скачивании
    try {
      if (format === 'txt') {
        downloadTxt();
      } else if (format === 'word') {
        downloadWord();
      } else if (format === 'excel') {
        downloadExcel();
      } else if (format === 'json') {
        downloadJson();
      }
    } catch (error) {
      console.error("Ошибка при скачивании файла:", error);
    } finally {
      setLoading(false);  // Выключить индикатор загрузки после скачивания
    }
    setShowDownloadModal(false); // Закрытие модального окна
  };

  const getData = () => {
    // Логика обработки данных mapData
    const dataObject = mapData[0].result;
    const result = [];

    for (let i = 0; i < dataObject['[IP]'].length; i++) {
      result.push({
        '[IP]': dataObject['[IP]'][i],
        '[Country]': dataObject['[Country]'][i],
        '[RegionName]': dataObject['[RegionName]'][i],
        '[City]': dataObject['[City]'][i],
        '[Lat]': dataObject['[Lat]'][i],
        '[Lon]': dataObject['[Lon]'][i],
      });
    }
    return result;
  };

  // Прочие функции для скачивания данных в разных форматах (txt, Word, Excel, JSON)
  const downloadTxt = () => {
    const fileContent = getData().map((item, i) => 
      `Результат ${i + 1}:\n` +
      `IP: ${item['[IP]']}\n` +
      `Country: ${item['[Country]']}\n` +
      `Region: ${item['[RegionName]']}\n` +
      `City: ${item['[City]']}\n` +
      `Lat: ${item['[Lat]']}\n` +
      `Lon: ${item['[Lon]']}\n`
    ).join('\n');
    
    const blob = new Blob([fileContent], { type: 'text/plain' });
    saveAs(blob, 'results.txt');
  };
  

  const downloadWord = async () => {
    const doc = new Document({
      sections: [
        {
          children: getData().map((item, i) => 
            new Paragraph({
              children: [
                // Жирный текст для заголовка результата
                new TextRun({
                  text: `Результат ${i + 1}:`,
                  bold: true // Выделение жирным
                }),
                new TextRun(`\nIP: ${item['[IP]']}`),
                new TextRun(`\nCountry: ${item['[Country]']}`),
                new TextRun(`\nRegion: ${item['[RegionName]']}`),
                new TextRun(`\nCity: ${item['[City]']}`),
                new TextRun(`\nLat: ${item['[Lat]']}`),
                new TextRun(`\nLon: ${item['[Lon]']}`)
              ]
            })
          )
        }
      ]
    });
  
    const blob = await Packer.toBlob(doc);
    saveAs(blob, 'results.docx');
  };
  
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(getData());
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Results");
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'results.xlsx');
  };

  const downloadJson = () => {
    const fileContent = JSON.stringify(getData(), null, 2);
    const blob = new Blob([fileContent], { type: 'application/json' });
    saveAs(blob, 'results.json');
  };

  return (
    <>
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

      <header className={`header ${loading ? 'disabled' : ''}`}>
        <div className="header-inner">
          <NavLink className="logo" to="/">
            <img className="logo-img" src={logo} alt="Logo" />
            <h1 className="logo-text">IP-Tracer</h1>
          </NavLink>
          <div className="search">
            <input 
              type="text" 
              className="search-input" 
              placeholder="" 
              onClick={handleClick} 
              onKeyPress={handleKeyPress}  
              disabled={loading}  // Отключение поля при загрузке
            />
            <button className="search-btn" onClick={handleSearch} disabled={loading}>
              <img className="search-img" src={search} alt="Search" />
            </button>
          </div>
          <SearchMenu ref={searchMenuRef} /> {/* Передаем реф в SearchMenu */}
        </div>
      </header>
      <main className={loading ? 'disabled' : ''}>
        <div className="section section1">
          <div className="map">
            <h4 className="map-title">Найдено 3 результата</h4>
            <div className="swiper-container">
              <Swiper 
                navigation={true}
                modules={[Navigation]}
                loop={true}
                allowTouchMove={false}
                className="mySwiper map-inner"
              >
                <SwiperSlide className="map-slide">
                  <Slide numSlide="0"/>
                </SwiperSlide>
                <SwiperSlide className="map-slide">
                  <Slide numSlide="1" />
                </SwiperSlide>
                <SwiperSlide className="map-slide">
                  <Slide numSlide="2" />
                </SwiperSlide>
              </Swiper>
            </div>
            <button className="download-btn" onClick={toggleDownloadModal} disabled={loading}>
              Скачать результаты
            </button>
          </div>

          {showDownloadModal && (
            <div className="download-modal">
              <div className="download-modal-content">
                <span className="close" onClick={toggleDownloadModal}>&times;</span>
                <h2>Выберите формат для скачивания</h2>
                <div className="download-modal-body">
                  <button onClick={() => handleDownload('txt')} disabled={loading}>TXT</button>
                  <button onClick={() => handleDownload('word')} disabled={loading}>Word</button>
                  <button onClick={() => handleDownload('excel')} disabled={loading}>Excel</button>
                  <button onClick={() => handleDownload('json')} disabled={loading}>JSON</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
