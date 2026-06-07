from flask import Blueprint
from flask import request

from extensions import db

from models.user import User

from flask_jwt_extended import (
    create_access_token
)

from bcrypt import checkpw


auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/auth"
)


@auth_bp.route(
    "/signup",
    methods=["POST"]
)
def signup():

    data = request.json

    email = data["email"]

    exists = User.query.filter_by(
        email=email
    ).first()

    if exists:

        return {

            "message":
            "User exists"

        }, 400

    user = User(

        name=data["name"],

        email=email

    )

    user.set_password(
        data["password"]
    )

    db.session.add(user)

    db.session.commit()

    return {

        "message":
        "Signup successful"

    }


@auth_bp.route(
    "/login",
    methods=["POST"]
)
def login():

    data = request.json

    user = User.query.filter_by(

        email=data["email"]

    ).first()

    if not user:

        return {

            "message":
            "Invalid credentials"

        }, 401

    valid = checkpw(

        data["password"].encode(),

        user.password.encode()

    )

    if not valid:

        return {

            "message":
            "Invalid credentials"

        }, 401

    token = create_access_token(

        identity=str(user.id)

    )

    return {

        "token": token,

        "name": user.name

    }