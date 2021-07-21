import json

try:
    with open("config.json") as config_file:
        config_file = json.load(config_file)
except FileNotFoundError:
    print("It seems that config.json is not present in current directory")


DATABASE_HOST = config_file["DATABASE_HOST"]
DATABASE_PORT = config_file["DATABASE_PORT"]
DATABASE_USERNAME = config_file["DATABASE_USERNAME"]
DATABASE_PASSWORD = config_file["DATABASE_PASSWORD"]
DATABASE_NAME = config_file["DATABASE_NAME"]
SECRET_KEY = "-z1KYYRfularhlIxSfBIGNQrQwk"

