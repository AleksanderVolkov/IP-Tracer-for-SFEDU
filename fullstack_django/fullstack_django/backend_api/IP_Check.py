# import json
# import socket
# import requests
# import folium  # карта
# from .CRUD import *
# from urllib.parse import urlparse
# from pyfiglet import Figlet  # для красивого превью в терминале
# from rest_framework.response import Response
# from rest_framework.views import APIView



# # # Получаем информацию по ссылке (DNS) [ Де факто просто получаем IP адресс из ссылки и делааем поиск по IP ]
# # def get_info_by_dns(http):
# #     # Удалить https// и всё остальное в ссылке кроме доменного имени
# #     http = urlparse(http).netloc
# #     print(http)
# #     try:
# #         ip_by_dns = socket.gethostbyname(http)
# #         get_info_by_ip(ip_by_dns)
# #         print(f'DNS is: || {http} ||')
# #     except socket.gaierror as error:
# #         print(f'[!] Invalid Hostname [!] - {error}')


# # # Получаем информацию по IP
# # def get_info_by_ip(ip='127.0.0.1'):
# #     try:
# #         response = requests.get(url=f'http://ip-api.com/json/{ip}').json()
# #         # append_data(ip)  # Добавляем IP в базу данных 

# #         # Записывает все возможные данные в JSON формате и сохраняет
# #         # with open(f'{ip}.json', 'w') as f:
# #         #     json.dump(response, f)
        
# #         #print(response) # вывод всего json файла
        
# #         # Вычленяем необходимые данные
# #         data = {
# #             '[IP]': response.get('query'), # не хвтает континента
# #             '[Country]': response.get('country'),
# #             '[Region Name]': response.get('regionName'),
# #             '[City]': response.get('city'),
# #             '[Lat]': response.get('lat'), # широта
# #             '[Lon]': response.get('lon'), # долгота
# #         }

# #         # # Открываем файл для записи и записываем в наши данные
# #         # file_name = f'{ip}.json'
# #         # with open(file_name, 'w') as f:
# #         # # Записываем словарь в файл в формате JSON
# #         #     json.dump(data, f)
# #         # # Отправка овета
# #         # with open(file_name, 'r') as f:
# #         #     #send_answer(f)
# #         #     f.close()
       

# #         # data = {  # расширенная версия
# #         #     '[IP]': response.get('query'),
# #         #     '[Int prov]': response.get('isp'),
# #         #     '[Lat]': response.get('lat'), # широта
# #         #     '[Lon]': response.get('lon'), # долгота
# #         #     '[Org]': response.get('org'),
# #         #     '[Country]': response.get('country'),
# #         #     '[Region Name]': response.get('regionName'),
# #         #     '[City]': response.get('city'),
# #         #     '[Timezone]': response.get('timezone')
# #         # }

# #         # Вывод 
# #         for k,v in data.items():
# #             print(f'{k}: {v}')

# #         # Сохраняем на карту
# #         # area = folium.Map(location=[response.get('lat'), response.get('lon')])
# #         # area.save(f"{response.get('query')}_{response.get('city')}_{response.get('org')}.html") # составляем название из IP адресса, города и организации и сохраняем в репазиторий ссылку на карту

# #     except requests.exceptions.ConnectionError:
# #         print('[!] CHECK YOUR CONNECTION!!!')


# def get_ip_1(self, ip):
#         try:
#             response = requests.get(url=f'http://ipwho.is/{ip}').json()
#             data1 = {
#             '[IP]': response.get('ip'), # не хвтает континента
#             '[Country]': response.get('country'),
#             '[Region Name]': response.get('region'),
#             '[City]': response.get('city'),
#             '[Lat]': response.get('latitude'), # широта
#             '[Lon]': response.get('longitude'), # долгота
#             }
#             return data1
#         except:
#             data_error = {
#             '[IP]': '0', # не хвтает континента
#             '[Country]': '0',
#             '[Region Name]': '0',
#             '[City]': '0',
#             '[Lat]': '0', # широта
#             '[Lon]': '0', # долгота
#             }
#             return data_error
    

#     # Этот API точнее - показывает улицу
# def get_ip_2(self, ip):
#     ip = {ip}
#     try:
#         response = requests.get(url=f"https://freeipapi.com/api/json/{ip}").json()
#         data2 = {
#         '[IP]': response.get('ipAddress'), # не хвтает континента
#         '[Country]': response.get('countryName'),
#         '[Region Name]': response.get('regionName'),
#         '[City]': response.get('cityName'),
#         '[Lat]': response.get('latitude'), # широта
#         '[Lon]': response.get('latitude'), # долгота
#         }
#         return data2
#     except:
#         data_error = {
#         '[IP]': '0', # не хвтает континента
#         '[Country]': '0',
#         '[Region Name]': '0',
#         '[City]': '0',
#         '[Lat]': '0', # широта
#         '[Lon]': '0', # долгота
#         }
#         return data_error
    

# def get_ip_3(self, ip):
#     try:
#         payload = {'key': 'AC9E4AB50F8585EB2621305D274DA4E3', 'ip': ip, 'format': 'json'}
#         response = requests.get(url=f'https://api.ip2location.io/', params = payload).json()
#         data3 = {
#             '[IP]': response.get('ip'), # не хвтает континента
#             '[Country]': response.get('country_name'),
#             '[Region Name]': response.get('region_name'),
#             '[City]': response.get('city_name'),
#             '[Lat]': response.get('latitude'), # широта
#             '[Lon]': response.get('longitude'), # долгота
#         }
#         return data3
#     except:
#         data_error = {
#             '[IP]': '0', # не хвтает континента
#             '[Country]': '0',
#             '[Region Name]': '0',
#             '[City]': '0',
#             '[Lat]': '0', # широта
#             '[Lon]': '0', # долгота
#         }
#         return data_error

# def get_info_by_ip(self, ip):
#         result_data = {}
#         data1 = data1.get_ip_1(ip)
#         data2 = data2.get_ip_2(ip)
#         data3 = data3.get_ip_3(ip)
#         for key in data1:
#             result_data[key] = []
#             result_data[key].append(data1[key])
#             result_data[key].append(data2[key])
#             result_data[key].append(data3[key])
#         return result_data

# # Проверка запроса на IP адресс или ссылку и последующий поиск данных
# # def check_request(req):
# #     if(req[0].isdigit()):
# #         get_info_by_ip(req)
# #     else:
# #         get_info_by_dns(req)
# def check_request(req):
#         if(req[0].isdigit()):
#             #append_data(req)
#             data = get_info_by_ip(req)
#             return data
#         else:
#             try:
#                 req = urlparse(req).netloc  # Удалить https// и всё остальное в ссылке кроме доменного имени
#                 ip_by_dns = socket.gethostbyname(req) # Получаем IP по доменному имени
#                 #append_data(ip_by_dns)
#                 data = get_info_by_ip(ip_by_dns)
#                 return data
#             except socket.gaierror as error: # Переделать в возврат результата "NOT FOUND"
#                 print(f'[!] Invalid Hostname [!] - {error}')

# def main():
#     # Участок с принятием запроса
#     preview_text = Figlet(font='slant') # для красивого превью в терминале
#     print(preview_text.renderText('IP INFO'))
    

#     # Сохранение запроса и передача его на проверку/определение типа запроса
#     request = input('Enter IP or http: ')
#     print(check_request(request))

#     # Старое временное решение
#     # ip = input('Enter IP adress: ')
#     # get_info_by_ip(ip=ip)


# if __name__ == '__main__':
#     main()
