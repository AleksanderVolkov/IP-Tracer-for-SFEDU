import sqlite3

# класс для работы с БД
class DataBase: 
    # функция считывания из БД
    def read_data_base():
        connection = sqlite3.connect("IP.db")
        cursor = connection.cursor()
        cursor.execute("SELECT IPorLink FROM IP")
        frames = cursor.fetchall()
        connection.close()
        answer = []
        for frame in frames:
            answer.append(frame)
            #print(f"IPorLink: {frame}")
        return answer

    # функция создания БД
    def create_data_base():
        connection = sqlite3.connect("IP.db")
        cursor = connection.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS IP (
            id TEXT PRIMARY KEY,
            IPorLink TEXT
            )
        ''')
        connection.commit()
        connection.close()

    # функция добавления в БД
    def append_data(ip_dns):
        connection = sqlite3.connect("IP.db")
        cursor = connection.cursor()
        cursor.execute('INSERT INTO IP (IPorLink) VALUES (?)', (ip_dns,))
        connection.commit()
        connection.close()

    # функция удаления строки из БД
    # функция удаления строки из БД
    def delete_item(ip_or_link):
        connection = sqlite3.connect("IP.db")
        cursor = connection.cursor()
        cursor.execute("DELETE FROM IP WHERE IPorLink = ?", (ip_or_link,))
        connection.commit()
        connection.close()


    # функция подсчёта количества строк в БД
    def count_rows():
        connection = sqlite3.connect("IP.db")
        cursor = connection.cursor()
        cursor.execute("SELECT COUNT(*) FROM IP") # COUNT(IPorLink)
        count = cursor.fetchone()[0]
        cursor.close()
        connection.close()
        return count