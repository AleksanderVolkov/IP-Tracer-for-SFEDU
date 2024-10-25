import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import sendIp from "../../utils/sendIp";
import menuIcon from "../../images/menu.svg";
import logo from "../../images/logo.png";
import search from "../../images/search.svg";
import telegramIcon from "../../images/telegram.svg";
import "./home.scss";
import SearchMenu from "../../components/search-menu/SearchMenu.jsx";
import handleClick from "../../utils/handleClick";
import SideMenu from "../../components/side-menu/SideMenu.jsx";
import axios from "axios";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [loading, setLoading] = useState(false);  // Состояние для загрузки
  const navigate = useNavigate();

  const handleSearch = async () => {
    setLoading(true);  // Показать индикатор загрузки
    try {
      const result = await sendIp();
      if (result.success) {
        navigate("/main/Main");
      }
    } catch (error) {
      console.error("Ошибка:", error.message);
      alert(error.message);
    } finally {
      setLoading(false);  // Скрыть индикатор загрузки
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleItemSelect = (item) => {
    setSelectedItem(item);
  };

  const openTelegram = async () => {
    setLoading(true);  // Показать индикатор загрузки
    try {
      const response = await axios.get("http://localhost:8000/open-telegram");
      console.log(response.data);
    } catch (error) {
      console.error("Ошибка при отправке запроса на сервер:", error);
    } finally {
      setLoading(false);  // Скрыть индикатор загрузки
    }
  };

  return (
    <div className="home">
      {/* Блокировка взаимодействий и индикатор загрузки */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

      {/* Условное отображение кнопки Menu */}
      <div className={`menu-icon ${loading ? 'disabled' : ''}`} onClick={toggleMenu} style={{ display: isMenuOpen ? 'none' : 'block' }}>
        <img src={menuIcon} alt="Menu" />
      </div>
      
      <div className={`home-inner ${loading ? 'disabled' : ''}`}>
        <div className="logo">
          <img className="logo-img" src={logo} alt="Logo" />
          <h1 className="logo-text">IP-Tracer</h1>
        </div>
        <div className="search">
          <input
            type="text"
            className="search-input"
            placeholder="Введите IP-адрес\Ссылку"
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
            onClick={handleClick}
            onKeyPress={handleKeyPress}
            disabled={loading}  // Отключить ввод при загрузке
          />
          <button className="search-btn" onClick={handleSearch} disabled={loading}>
            <img className="search-img" src={search} alt="Search" />
          </button>
          <SearchMenu className="search-menu--home" />
        </div>

        <div className="telegram-icon">
          <button
            className="telegram-btn"
            onClick={openTelegram}
            disabled={loading}  // Отключить кнопку при загрузке
          >
            <img
              src={telegramIcon}
              width={300}
              height={300}
              alt="Telegram"
              style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
            />
          </button>
        </div>

        <SideMenu
          isOpen={isMenuOpen}
          toggleMenu={toggleMenu}
          onItemSelect={handleItemSelect}
          disabled={loading}  // Отключить меню при загрузке
        />
      </div>
    </div>
  );
}
