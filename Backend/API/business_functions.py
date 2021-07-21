import db_methods
import app_config as CONFIG
import datetime
import jwt
import json
from functools import wraps
from flask import request


def return_on_exception(message="Internal Server Error", status_code=500):
    return {
        "message": message,
        "success": False,
        "result": None,
        "status_code": status_code
    }


def generate_auth_token(email):
    """
    Generates the Auth Token
    :return: string
    """
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=0, minutes=30),
        'iat': datetime.datetime.utcnow(),
        'sub': email
    }
    return jwt.encode(
        payload,
        CONFIG.SECRET_KEY,
        algorithm='HS256'
    ).decode('utf-8')


def decode_auth_token(auth_token):
    """
    Decodes the auth token
    :param auth_token: the token to be decoded.
    :return: boolean|string: true if decoded successfully, else the reason for failure.
    """
    try:
        jwt.decode(auth_token, CONFIG.SECRET_KEY)
        return True
    except jwt.ExpiredSignatureError:
        return 'Signature expired. Please log in again.'
    except jwt.InvalidTokenError:
        return 'Invalid token. Please log in again.'


def login(data):
    query = """SELECT * FROM users WHERE email=%s AND password=%s"""
    record = (data["email"], data["password"])
    response = db_methods.execute_get_query(query, record)
    if isinstance(response, list) and len(response) > 0:
        return {"token": generate_auth_token(data["email"])}
    return "Email or Password is wrong"


def add_ingredient(item):
    ingredient = dict()
    ingredient["name"] = item["ingredient_name"]
    ingredient["amount"] = item["amount"]
    # ingredient["id"] = item["id"]
    return ingredient


def check_item_exists_or_not(response, value, column):
    for index, item in enumerate(response):
        if item[column] == value:
            return index
    return -1


def format_recipe_response(response):
    formatted_result = []
    counter = 0
    for item in response:
        formatted_item = dict()
        index = check_item_exists_or_not(formatted_result, item["recipe_id"], "recipe_id")
        if index == -1:
            index = counter
            formatted_item["recipe_id"] = item["id"]
            formatted_item["name"] = item["recipe_name"]
            formatted_item["description"] = item["description"]
            formatted_item["imagePath"] = item["imagepath"]
            formatted_item["ingredients"] = []
            formatted_result.append(formatted_item)
            counter += 1
        ingredient = add_ingredient(item)
        formatted_result[index]["ingredients"].append(ingredient)

    return formatted_result


def insert_ingredients(recipe_id, ingredients):
    part_for_ingredient_query = "(%s, %s, %s)," * len(ingredients)
    query = """INSERT INTO ingredient (recipe_id, name, amount) VALUES""" + \
            part_for_ingredient_query[:len(part_for_ingredient_query) - 1]
    record = [(recipe_id, item["name"], item["amount"]) for item in ingredients]

    tuple_record = tuple()
    for item in record:
        tuple_record += tuple(item)

    db_methods.execute_query(query, (tuple_record,), many=True)


def validate_user(function):
    @wraps(function)
    def validate_token(*args, **kwargs):
        if "auth" not in request.headers:
            return json.dumps("Not authorized"), 401
        token_with_request = request.headers["auth"]
        result = decode_auth_token(token_with_request)
        if isinstance(result, str):
            return json.dumps(result)
        if result:
            return function(*args, **kwargs)
    return validate_token
