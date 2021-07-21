import json
from flask import Flask, request
from flask_cors import CORS
import wsgiref
import db_methods
import business_functions

app = Flask(__name__)
CORS(app)


@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.get_json()
    query = """INSERT INTO users (email, password) VALUES (%s,%s)"""
    record = (data["email"], data["password"])
    db_methods.execute_query(query, record)
    response = business_functions.login(data)
    if isinstance(response, str):
        return json.dumps(response), 401
    return json.dumps({"email": data["email"], "token": response["token"], "expiresIn": "1800"}), 200
    # return json.dumps({"email": data["email"], "token": None, "expiresIn": "0"}), 200


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    response = business_functions.login(data)
    if isinstance(response, str):
        return json.dumps(response), 401
    return json.dumps({"email": data["email"], "token": response["token"], "expiresIn": "1800"}), 200


@app.route("/", methods=["GET"])
def test():
    return "API IS WORKING FINE", 200


@app.route("/api/recipe/list", methods=["GET"])
@business_functions.validate_user
def get_recipe():
    query = """SELECT recipe.*, ingredient.id as ingredient_id, ingredient.name as ingredient_name, 
    ingredient.amount as amount, ingredient.recipe_id FROM recipe LEFT JOIN
    ingredient ON ingredient.recipe_id=recipe.id ORDER BY recipe.created_on"""

    response = db_methods.execute_get_query(query)
    # print(response)
    formatted_response = business_functions.format_recipe_response(response)
    return json.dumps(formatted_response), 200


@app.route("/api/recipe/add", methods=["POST"])
@business_functions.validate_user
def add_recipe():
    data = request.get_json()
    print(data)
    query = """INSERT INTO recipe (recipe_name, description, imagepath) VALUES (%s, %s, %s) RETURNING id"""
    record = (data["name"], data["description"], data["imagePath"])
    recipe_id = db_methods.execute_query(query, record)
    if len(data["ingredients"]) > 0:
        business_functions.insert_ingredients(recipe_id, data["ingredients"])
    return json.dumps("Operation Successful"), 200


@app.route("/api/recipe/update", methods=["PUT"])
def update_recipe():
    data = request.get_json()
    print(data)
    query = """UPDATE recipe SET recipe_name=%s, description=%s, imagepath=%s WHERE id=%s"""
    record = (data["name"], data["description"], data["imagePath"], data["id"])

    query_for_delete = """DELETE from ingredient WHERE recipe_id = %s"""
    record_for_delete = (data["id"],)

    db_methods.execute_query(query, record)
    db_methods.execute_query(query_for_delete, record_for_delete)
    if len(data["ingredients"]) > 0:
        business_functions.insert_ingredients(data["id"], data["ingredients"])

    return json.dumps("Operation Successful"), 200


@app.route("/api/recipe/delete", methods=["DELETE"])
def delete_recipe():
    query_params = request.args
    query_ingredient = """DELETE FROM ingredient WHERE recipe_id=%s"""
    record = (query_params["recipe_id"],)
    query_recipe = """DELETE FROM recipe WHERE id=%s"""

    db_methods.execute_query(query_ingredient, record)
    db_methods.execute_query(query_recipe, record)

    return json.dumps("Operation Successful"), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=2000, debug=True)
