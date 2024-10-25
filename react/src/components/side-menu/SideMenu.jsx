import React, { useEffect, useState } from "react";
import axios from "axios";
import "./sideMenu.scss"; // Стили бокового меню

export default function SideMenu({ isOpen, toggleMenu, onItemSelect }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false); // Для отображения загрузки
    const [error, setError] = useState(null);

    // Запрос данных из базы при открытии бокового меню
    useEffect(() => {
        if (isOpen) {
            setLoading(true); // Начинаем загрузку данных
            axios
                .get("http://localhost:8000/api/get-data") // Убедитесь, что эндпоинт совпадает
                .then((response) => {
                    setData(response.data.data.reverse()); // Меняем порядок данных, чтобы свежие были сверху
                    setLoading(false); // Загрузка завершена
                })
                .catch((error) => {
                    setError(error.message); // В случае ошибки сохраняем сообщение
                    setLoading(false);
                });
        }
    }, [isOpen]);

    const handleDelete = (index) => {
        // Получаем элемент, который нужно удалить
        const item = data[index];

        // Отправка запроса на удаление элемента
        axios
            .post("http://localhost:8000/api/delete-item", { IPorLink: item.IPorLink })
            .then(() => {
                // После успешного удаления обновляем состояние, удаляя элемент по индексу
                setData((prevData) => prevData.filter((_, i) => i !== index));
            })
            .catch((error) => {
                console.error("Ошибка при удалении элемента:", error);
            });
    };

    if (loading) {
        return <div className="side-menu">Загрузка...</div>;
    }

    if (error) {
        return <div className="side-menu">Ошибка: {error}</div>;
    }

    return (
        <div className={`side-menu ${isOpen ? "open" : ""}`}>
            <button className="close-btn" onClick={toggleMenu}>
                &times;
            </button>
            <h2>История поиска</h2>
            <ul>
                {data.length > 0 ? (
                    data.map((item, index) => (
                        <li
                            key={index}
                            onClick={() => {
                                console.log("Clicked on item:", item.IPorLink);
                                onItemSelect(item.IPorLink); // Передаем выбранный элемент в onItemSelect
                            }}
                        >
                            {/* Отображаем текст элемента (IP или доменное имя) */}
                            {item.IPorLink}
                            <button
                                className="delete-btn"
                                onClick={(e) => {
                                    e.stopPropagation(); // Останавливаем всплытие события клика
                                    handleDelete(index); // Передаём индекс для удаления
                                }}
                            >
                                &times;
                            </button>
                        </li>
                    ))
                ) : (
                    <li>Пока данных нет</li>
                )}
            </ul>
        </div>
    );
}
