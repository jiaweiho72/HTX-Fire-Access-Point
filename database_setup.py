import psycopg2
from psycopg2 import OperationalError, sql

# Replace with your actual database credentials
db_name = "map"
db_user = "guest2"
db_password = "90108501"
db_host = "localhost"
db_port = "5432"

def create_connection(db_name, db_user, db_password, db_host, db_port):
    connection = None
    try:
        connection = psycopg2.connect(
            database=db_name,
            user=db_user,
            password=db_password,
            host=db_host,
            port=db_port,
        )
        print("Connection to PostgreSQL DB successful")
    except OperationalError as e:
        print(f"The error '{e}' occurred")
    return connection

def execute_query(connection, query):
    cursor = connection.cursor()
    try:
        cursor.execute(query)
        connection.commit()
        print("Query executed successfully")
    except OperationalError as e:
        print(f"The error '{e}' occurred")

# Connect to the database
connection = create_connection(db_name, db_user, db_password, db_host, db_port)

# Enable PostGIS extension
enable_postgis_query = "CREATE EXTENSION IF NOT EXISTS postgis"

# Create a schema and a table
create_schema_query = "CREATE SCHEMA IF NOT EXISTS my_schema"
create_table_query = """
CREATE TABLE my_schema.polygons (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    address VARCHAR(255),
    type VARCHAR(255),
    coordinates geometry(POLYGON, 4326)
)
"""

# Execute the queries
if connection is not None:
    execute_query(connection, enable_postgis_query)
    execute_query(connection, create_schema_query)
    execute_query(connection, create_table_query)
