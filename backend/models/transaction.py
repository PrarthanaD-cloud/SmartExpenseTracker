from extensions import db


class Transaction(
    db.Model
):

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    user_id = db.Column(
        db.Integer,
        nullable=False
    )

    amount = db.Column(
        db.Float,
        nullable=False
    )

    type = db.Column(
        db.String(20),
        nullable=False
    )

    category = db.Column(
        db.String(50)
    )

    description = db.Column(
        db.String(255)
    )

    date = db.Column(
        db.String(30)
    )