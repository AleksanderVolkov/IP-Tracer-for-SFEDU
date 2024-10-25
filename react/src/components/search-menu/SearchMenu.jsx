import "./searchMenu.scss";
import axios from "axios";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import handleClick from "../../utils/handleClick";
import cross from "../../images/cross.svg";

// Используем forwardRef, чтобы родительский компонент мог вызывать fetchData
const SearchMenu = forwardRef((props, ref) => {
  const [ipData, setIpData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    axios
      .get("http://localhost:8000/api/get-data")
      .then((response) => {
        const updatedData = response.data.data.reverse(); // Инвертируем список, чтобы новые элементы были сверху
        setIpData(updatedData.slice(0, 3)); // Оставляем только три последних элемента
        setLoading(false);
      })
      .catch((error) => {
        console.error("Ошибка при загрузке данных:", error);
        setLoading(false);
      });
  };

  useImperativeHandle(ref, () => ({
    fetchData, // Позволяем родительскому компоненту вызывать fetchData
  }));

  useEffect(() => {
    fetchData(); // Загружаем данные при монтировании компонента
  }, []);

  const addIp = (e) => {
    const inputElement = document.querySelector(".search-input");
    inputElement.value = e;
    handleClick(); // Ваш обработчик для дальнейшей логики
  };

  const deletePrompt = (ipOrLink) => {
    axios
      .post("http://localhost:8000/api/delete-item", { IPorLink: ipOrLink })
      .then(() => {
        setIpData(ipData.filter((item) => item.IPorLink !== ipOrLink));
      })
      .catch((error) => {
        console.error("Ошибка при удалении элемента:", error);
      });
  };

  if (loading) {
    return <p>Загрузка...</p>;
  }

  return (
    <ul className={`search-menu ${props.className}`}>
      {ipData.map((item, index) => (
        <li className="search-item" key={index}>
          <p className="search-text" onClick={() => addIp(item.IPorLink)}>
            {item.IPorLink}
          </p>
          <img
            className="search-img"
            src={cross}
            alt="cross"
            onClick={() => deletePrompt(item.IPorLink)}
          />
        </li>
      ))}
    </ul>
  );
});

export default SearchMenu;
