# Обработка запроса на поиск по IP/DNS

import json
import logging
import socket
import requests
from urllib.parse import urlparse
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .CRUD import DataBase
import idna
import http.client
import dns.resolver
import webbrowser
from django.http import JsonResponse


# Настройка логирования
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')

# Функция для проверки наличия интернета
def is_internet_available():
    try:
        logging.info('Проверка наличия интернет-соединения...')
        # Пробуем подключиться к Google DNS серверу, чтобы проверить наличие интернета
        socket.create_connection(("8.8.8.8", 53), timeout=3)
        logging.info('Интернет-соединение установлено.')
        return True
    except OSError as e:
        logging.error(f'Отсутствие интернет-соединения: {e}')
        return False



# Обработка запроса на поиск по IP/DNS
class GetRequestIP_DNS(APIView):
    def get(self, request):
        logging.info('GET запрос на поиск по IP/DNS получен.')
        return Response({})

    def post(self, request):
        logging.info(f'POST запрос на поиск по IP/DNS получен: {request.data}')

        # Проверяем наличие интернет-соединения
        if not is_internet_available():
            logging.error('Интернет-соединение отсутствует. Возврат ошибки.')
            return Response({'error': 'No internet connection'}, status=503)

        try:
            request_data = request.data
            logging.info(f'Начало обработки запроса: {request_data}')
            answer = Valid_IP_or_DNS().check_request(request_data)
            logging.info(f'Ответ на запрос: {answer}')
            return Response({"result": answer})
        except Exception as e:
            logging.error(f'Ошибка при обработке POST запроса: {e}', exc_info=True)
            return Response({'error': str(e)}, status=500)

# Класс для обработки данных по IP
class Get_answer_by_IP:
    @staticmethod
    def get_ip_1(ip):
        try:
            logging.info(f'Запрос информации об IP {ip} через ipwho.is')
            response = requests.get(url=f'http://ipwho.is/{ip}')
            if response.status_code == 200:
                json_response = response.json()
                logging.info(f'Успешный ответ от ipwho.is для {ip}: {json_response}')
                data1 = {
                    '[IP]': json_response.get('ip'),
                    '[Country]': json_response.get('country'),
                    '[RegionName]': json_response.get('region'),
                    '[City]': json_response.get('city'),
                    '[Lat]': json_response.get('latitude'),
                    '[Lon]': json_response.get('longitude'),
                }
            else:
                logging.error(f'Ошибка от ipwho.is: код {response.status_code}, текст: {response.text}')
                data1 = {'[IP]': '0', '[Country]': '0', '[RegionName]': '0', '[City]': '0', '[Lat]': '0', '[Lon]': '0'}
            return data1
        except Exception as e:
            logging.error(f'Исключение при запросе к ipwho.is: {e}', exc_info=True)
            return {'[IP]': '0', '[Country]': '0', '[RegionName]': '0', '[City]': '0', '[Lat]': '0', '[Lon]': '0'}

    @staticmethod
    def get_ip_2(ip):
        try:
            logging.info(f'Запрос информации об IP {ip} через freeipapi.com')
            response = requests.get(url=f"https://freeipapi.com/api/json/{ip}")
            if response.status_code == 200:
                json_response = response.json()
                logging.info(f'Успешный ответ от freeipapi.com для {ip}: {json_response}')
                data2 = {
                    '[IP]': json_response.get('ipAddress'),
                    '[Country]': json_response.get('countryName'),
                    '[RegionName]': json_response.get('regionName'),
                    '[City]': json_response.get('cityName'),
                    '[Lat]': json_response.get('latitude'),
                    '[Lon]': json_response.get('longitude'),
                }
            else:
                logging.error(f'Ошибка от freeipapi.com: код {response.status_code}, текст: {response.text}')
                data2 = {'[IP]': '0', '[Country]': '0', '[RegionName]': '0', '[City]': '0', '[Lat]': '0', '[Lon]': '0'}
            return data2
        except Exception as e:
            logging.error(f'Исключение при запросе к freeipapi.com: {e}', exc_info=True)
            return {'[IP]': '0', '[Country]': '0', '[RegionName]': '0', '[City]': '0', '[Lat]': '0', '[Lon]': '0'}

    @staticmethod
    def get_ip_3(ip):
        try:
            logging.info(f'Запрос информации об IP {ip} через api.ip2location.io')
            payload = {'key': 'C3B6DACACFC2589D5E72B003804863AC', 'ip': ip, 'format': 'json'}
            response = requests.get(url='https://api.ip2location.io/', params=payload)
            if response.status_code == 200:
                json_response = response.json()
                logging.info(f'Успешный ответ от api.ip2location.io для {ip}: {json_response}')
                data3 = {
                    '[IP]': json_response.get('ip'),
                    '[Country]': json_response.get('country_name'),
                    '[RegionName]': json_response.get('region_name'),
                    '[City]': json_response.get('city_name'),
                    '[Lat]': json_response.get('latitude'),
                    '[Lon]': json_response.get('longitude'),
                }
            else:
                logging.error(f'Ошибка от api.ip2location.io: код {response.status_code}, текст: {response.text}')
                data3 = {'[IP]': '0', '[Country]': '0', '[RegionName]': '0', '[City]': '0', '[Lat]': '0', '[Lon]': '0'}
            return data3
        except Exception as e:
            logging.error(f'Исключение при запросе к api.ip2location.io: {e}', exc_info=True)
            return {'[IP]': '0', '[Country]': '0', '[RegionName]': '0', '[City]': '0', '[Lat]': '0', '[Lon]': '0'}

    @staticmethod
    def get_info_by_ip(ip):
        logging.info(f'Запрос полной информации об IP {ip}')
        result_data = {}
        data1 = Get_answer_by_IP.get_ip_1(ip)
        data2 = Get_answer_by_IP.get_ip_2(ip)
        data3 = Get_answer_by_IP.get_ip_3(ip)
        for key in data1:
            result_data[key] = [data1[key], data2[key], data3[key]]
        logging.info(f'Собранные данные для {ip}: {result_data}')
        return result_data

class Valid_IP_or_DNS:
    def check_request(self, req):
        logging.info(f'Начало проверки запроса: {req}')
        ip_address = req.get('ip')
        domain_name = req.get('domain')

        if not ip_address and not domain_name:
            logging.error('IP-адрес или доменное имя не предоставлены в запросе.')
            return 'error'

        if ip_address:
            logging.info(f'Запрос содержит IP-адрес: {ip_address}')
            try:
                data = Get_answer_by_IP.get_info_by_ip(ip_address)
                logging.info(f'Полученные данные по IP: {data}')
                
                # Попытка записи данных в базу
                logging.info(f'Попытка записи данных IP ({ip_address}) в базу данных.')
                try:
                    DataBase.append_data(ip_address)
                    logging.info(f'Запись IP ({ip_address}) в базу данных прошла успешно.')
                except Exception as e:
                    logging.error(f'Ошибка при записи IP ({ip_address}) в базу данных: {e}', exc_info=True)
                    # Возвращаем данные, даже если произошла ошибка записи в базу
                    return data

                return data
            except Exception as e:
                logging.error(f'Ошибка при получении данных по IP: {e}', exc_info=True)
                return 'error'

        if domain_name:
            logging.info(f'Запрос содержит DNS имя: {domain_name}')
            try:
                original_name, punycode_name, ip_by_dns_or_error = self.DNS_or_URL(domain_name)
                if ip_by_dns_or_error == 'error':
                    logging.error(f'Ошибка DNS имени: {domain_name}. Имя не найдено.')
                    return "Error of DNS name. This name not found"
                logging.info(f'IP по DNS имени: {ip_by_dns_or_error}')
                data = Get_answer_by_IP.get_info_by_ip(ip_by_dns_or_error)

                # Попытка записи данных в базу
                logging.info(f'Попытка записи данных DNS ({original_name}) в базу данных.')
                try:
                    DataBase.create_data_base()
                    original_domnain_name = idna.decode(domain_name)
                    logging.info(f'({original_domnain_name})')
                    DataBase.append_data(original_domnain_name)  # Сохраняем оригинальное доменное имя
                    logging.info(f'Запись DNS ({original_name}) в базу данных прошла успешно.')
                except Exception as e:
                    logging.error(f'Ошибка при записи DNS ({original_name}) в базу данных: {e}', exc_info=True)
                    # Возвращаем данные, даже если произошла ошибка записи в базу
                    return data

                logging.info(f'Полученные данные по DNS: {data}')
                return data
            except Exception as e:
                logging.error(f'Ошибка при обработке DNS: {e}', exc_info=True)
                return 'error'

    def DNS_or_URL(self, text):
        logging.info(f'Проверка доменного имени или URL: {text}')
        if urlparse(text).netloc != '':
            text = urlparse(text).netloc
            logging.info(f'Извлеченное доменное имя: {text}')
        else:
            text = "http://" + text
            text = urlparse(text).netloc
            logging.info(f'Извлеченное доменное имя из URL: {text}')

        try:
            # Сохраняем оригинальное доменное имя
            original_name = text
            # Преобразуем доменное имя в Punycode
            punycode_name = idna.encode(text).decode('utf-8')
            logging.info(f'Доменное имя в Punycode: {punycode_name}')
            logging.info(f'{text}')
            ip = socket.gethostbyname(text)
            logging.info(f'IP адрес по доменному имени: {ip}')

            conn = http.client.HTTPConnection(text)
            conn.request("HEAD", "/")
            ip_address = conn.sock.getpeername()[0]
            logging.info(f'{ip_address}')


            domain = text
            result = dns.resolver.resolve(domain, 'A')
            ip_addresses = [ip.to_text() for ip in result]
            logging.info(f'{ip_addresses}')


            return original_name, punycode_name, ip
        except Exception as e:
            logging.error(f'Ошибка при получении IP по доменному имени: {e}', exc_info=True)
            return "error", "error", "error"

class GetDataFromDB(APIView):
    def get(self, request):
        try:
            # Получаем данные из базы данных
            data = DataBase.read_data_base()
            # Преобразуем данные в JSON
            data_list = [{"IPorLink": item[0]} for item in data]
            return Response({"data": data_list}, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

class DeleteItemFromDB(APIView):
    def post(self, request):
        try:
            # Получаем IP или домен, который нужно удалить
            ip_or_link = request.data.get('IPorLink')
            if not ip_or_link:
                return Response({"error": "IPorLink not provided"}, status=400)

            # Удаляем элемент из базы данных
            DataBase.delete_item(ip_or_link)
            return Response({"message": "Item deleted successfully"}, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

class OpenTelegramLink(APIView):
    def get(self, request):
        try:
            # Открываем ссылку в браузере по умолчанию
            telegram_url = "https://t.me/Ip_Tracers_bot"
            logging.info(f"Открытие браузера с ссылкой: {telegram_url}")
            webbrowser.open(telegram_url)
            return Response({"message": "Telegram link opened successfully!"}, status=200)
        except Exception as e:
            logging.error(f"Ошибка при открытии ссылки: {e}")
            return Response({"error": str(e)}, status=500)