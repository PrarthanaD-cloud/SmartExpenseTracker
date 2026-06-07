from flask import Blueprint
from flask import request

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from extensions import db

from models.transaction import Transaction


transaction_bp = Blueprint(
    "transaction",
    __name__,
    url_prefix="/transactions"
)


# =========================
# ADD TRANSACTION
# =========================

@transaction_bp.route(
    "/add",
    methods=["POST"]
)
@jwt_required()
def add_transaction():

    user_id = int(
        get_jwt_identity()
    )

    data = request.json

    transaction = Transaction(

        user_id=user_id,

        amount=float(
            data["amount"]
        ),

        type=data["type"],

        category=data["category"],

        description=data["description"],

        date=data["date"]

    )

    db.session.add(
        transaction
    )

    db.session.commit()

    return {

        "message":
        "Added Successfully"

    }


# =========================
# GET ALL TRANSACTIONS
# =========================

@transaction_bp.route(
    "/all",
    methods=["GET"]
)
@jwt_required()
def get_transactions():

    user_id = int(
        get_jwt_identity()
    )

    transactions = Transaction.query.filter_by(
        user_id=user_id
    ).all()

    result = []

    for t in transactions:

        result.append({

            "id": t.id,

            "amount": t.amount,

            "type": t.type,

            "category": t.category,

            "description": t.description,

            "date": t.date

        })

    return result


# =========================
# DELETE TRANSACTION
# =========================

@transaction_bp.route(
    "/delete/<int:id>",
    methods=["DELETE"]
)
@jwt_required()
def delete_transaction(id):

    transaction = Transaction.query.get(id)

    if not transaction:
        return {
            "message": "Transaction Not Found"
        }, 404

    db.session.delete(
        transaction
    )

    db.session.commit()

    return {
        "message": "Deleted Successfully"
    }


# =========================
# UPDATE TRANSACTION
# =========================

@transaction_bp.route(
    "/update/<int:id>",
    methods=["PUT"]
)
@jwt_required()
def update_transaction(id):

    transaction = Transaction.query.get(id)

    if not transaction:
        return {
            "message": "Transaction Not Found"
        }, 404

    data = request.json

    transaction.amount = float(
        data["amount"]
    )

    transaction.type = data["type"]

    transaction.category = data["category"]

    transaction.description = data["description"]

    transaction.date = data["date"]

    db.session.commit()

    return {
        "message": "Updated Successfully"
    }