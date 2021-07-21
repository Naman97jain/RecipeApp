import psycopg2
import app_config as CONFIG
import business_functions


def create_database_connection():
    connection = psycopg2.connect(host=CONFIG.DATABASE_HOST,
                                  port=CONFIG.DATABASE_PORT,
                                  database=CONFIG.DATABASE_NAME,
                                  user=CONFIG.DATABASE_USERNAME,
                                  password=CONFIG.DATABASE_PASSWORD)
    return connection


def execute_query(query, record, many=None):
    connection = create_database_connection()
    cursor = connection.cursor()
    if many:
        cursor.executemany(query, record)
    else:
        cursor.execute(query, record)
    connection.commit()
    if cursor.description:
        query_result = cursor.fetchone()

        if query_result is not None:
            result = query_result[0]
            return result


def execute_get_query(query, record=None):
    connection = create_database_connection()
    cursor = connection.cursor()

    cursor.execute(query, record)
    record_list = cursor.fetchall()

    result_list = []
    for record_list_item in enumerate(record_list):
        record_values = {}
        for j, cursor_item in enumerate(cursor.description):
            record_values[cursor_item[0]] = record_list_item[1][j]
        result_list.append(record_values)

    return result_list
