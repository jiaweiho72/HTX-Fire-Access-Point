import psycopg2
from psycopg2 import sql

# Replace these values with your RDS instance details
db_host = 'amazon-relational-database-3ulct.cviisaeyqh5k.ap-southeast-1.rds.amazonaws.com'
db_port = '5432'
db_name = 'blockfinder'
db_user = 'blockfinderadmin'
db_password = 'blockfinder'

try:
    # Establish the connection
    connection = psycopg2.connect(
        host=db_host,
        port=db_port,
        dbname=db_name,
        user=db_user,
        password=db_password
    )

    # Create a cursor object
    cursor = connection.cursor()

    # Execute a simple query
    cursor.execute("SELECT version();")

    # Fetch and print the result of the query
    record = cursor.fetchone()
    print("You are connected to - ", record, "\n")

except Exception as error:
    print("Error while connecting to PostgreSQL", error)

finally:
    # Close the cursor and connection
    if cursor:
        cursor.close()
    if connection:
        connection.close()
