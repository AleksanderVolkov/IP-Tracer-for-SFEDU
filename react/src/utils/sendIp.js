import axios from 'axios'; 
import { mapData } from "../helpers/mapData";
import { ipData } from "../helpers/ipData";
let lastIndexElement = 0;

// Получаем элементы модального окна
const modal = document.getElementById("errorModal");
const modalMessage = document.getElementById("modal-error-message");
const closeBtn = document.getElementsByClassName("close")[0];

// Функция для открытия модального окна
function openModal(errorMessage) {
  modalMessage.textContent = errorMessage;
  modal.style.display = "block";
}

// Закрытие модального окна при клике на кнопку "x"
closeBtn.onclick = function() {
  modal.style.display = "none";
};

// Закрытие модального окна при клике вне его
window.onclick = function(event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// Зарезервированные диапазоны IP-адресов
// const reservedIpRanges = [
//   { range: "10.0.0.0/8", message: "Этот IP-адрес используется внутри компаний и офисов. Нельзя найти такой адрес в интернете, потому что он используется только внутри сети компании. Попробуйте ввести другой IP-адрес." },
//   { range: "172.16.0.0/12", message: "Этот IP-адрес используется в крупных организациях или учебных заведениях. Он недоступен для поиска в интернете. Попробуйте ввести другой IP-адрес." },
//   { range: "192.168.0.0/16", message: "Этот IP-адрес используется для домашней сети, например, вашего роутера. Поиск в интернете не найдёт этот адрес. Попробуйте ввести другой IP-адрес." },
//   { range: "224.0.0.0/4", message: "Этот IP-адрес предназначен для мультикастинга — отправки данных сразу нескольким устройствам. Он не может быть найден в интернете. Попробуйте ввести другой IP-адрес." },
//   { range: "255.255.255.255", message: "Этот IP-адрес используется для широковещательных сообщений в локальной сети. Он не предназначен для поиска в интернете. Попробуйте ввести другой IP-адрес." }
// ];

// Проверка, находится ли IP в диапазоне
// function checkReservedIp(ip) {
//   const ipParts = ip.split('.').map(Number);

//   for (let range of reservedIpRanges) {
//     if (ipInRange(ipParts, range.range)) {
//       return range.message;
//     }
//   }
//   return null;
// }

// Преобразование IP в двоичный формат
function ipToBinary(ipParts) {
  return ipParts.map(part => part.toString(2).padStart(8, '0')).join('');
}

// Проверка, находится ли IP в заданном диапазоне
// function ipInRange(ip, range) {
//   const [rangeIp, prefixLength] = range.split('/');
//   const rangeParts = rangeIp.split('.').map(Number);
//   const bits = parseInt(prefixLength, 10);

//   const ipBinary = ipToBinary(ip);
//   const rangeBinary = ipToBinary(rangeParts);

//   return ipBinary.substring(0, bits) === rangeBinary.substring(0, bits);
// }

export default async function sendIp() {
  const inputElement1 = document.querySelector('.search-input');
  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.(xn--[a-zA-Z0-9]+|[a-zA-Z]{2,24})$/;

  let inputValue = inputElement1.value.trim();
  let originalInputValue = inputValue; // Сохраняем оригинальное значение

  if (inputValue === "") {
    openModal("Ввод не должен быть пустым");
    return { success: false };
  }

  // Проверяем, содержит ли домен не-ASCII символы
  if (/[^a-zA-Z0-9.-]/.test(inputValue)) {
    try {
      // Преобразуем домен в Punycode
      const punycodeDomain = new URL(`http://${inputValue}`).hostname;
      inputValue = punycodeDomain;  // Теперь inputValue — это домен в формате Punycode
    } catch (error) {
      openModal("Неверный формат доменного имени");
      return { success: false };
    }
  }

  // Проверяем формат IP-адреса или домена
  if (!ipRegex.test(inputValue) && !domainRegex.test(inputValue)) {
    openModal("Неверный формат ввода IP-адреса или доменного имени");
    return { success: false };
  }

  const isIp = ipRegex.test(inputValue);
  
  // Если это IP, проверяем, не зарезервирован ли он
  // if (isIp) {
  //   const reservedIpMessage = checkReservedIp(inputValue);
  //   if (reservedIpMessage) {
  //     openModal(reservedIpMessage); // Выводим сообщение, если IP зарезервирован
  //     return { success: false }; // Не отправляем запрос на сервер
  //   }
  // }

  const data = isIp ? { ip: inputValue } : { domain: inputValue };

  try {
    const response = await axios.post('http://127.0.0.1:8000/GetRequestIP_DNS', JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('Ответ от сервера:', response.data);

    if (response.data.result && response.data.result == "Error of DNS name. This name not found") {
      openModal("Доменное имя не найдено. Убедитесь, что вы ввели его правильно.");
      return { success: false };
  }
  
    console.log('Response data:', response.data);  // Логирование данных с сервера
  
    if (response.status === 503) {
      openModal('Отсутствует подключение к интернету');
      return { success: false };
    }
  
    mapData.length = 0;
    mapData.push(response.data);  // Здесь добавляем данные в mapData
    console.log('Updated mapData:', mapData);  // Логирование mapData

    // Логика работы с историей запросов
    if (ipData.length === 0) {
      ipData.push(originalInputValue); // Сохраняем оригинальное доменное имя
    } else if (ipData.length === 3) {
      for (let i = 0; i < 3; i++) {
        if (originalInputValue === ipData[i]) {
          return { success: true };
        }
      }
      ipData[lastIndexElement] = originalInputValue; // Сохраняем оригинальное доменное имя
      lastIndexElement = (lastIndexElement + 1) % 3;
    } else {
      for (let i = 0; i < 3; i++) {
        if (originalInputValue === ipData[i]) {
          return { success: true };
        }
      }
      ipData.push(originalInputValue); // Сохраняем оригинальное доменное имя
    }
    return { success: true };  // Успешный результат
  } catch (error) {
    // Обработка ошибки при отсутствии интернета или других сетевых ошибок
    if (!error.response) {
      openModal('Ошибка сети. Проверьте подключение к интернету.');
    } else {
      openModal('Ошибка сети. Проверьте подключение к интернету.');
    }
    return { success: false };  // Возвращаем ошибку
  }
}
