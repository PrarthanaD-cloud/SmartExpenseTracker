from extensions import db
from bcrypt import hashpw
from bcrypt import gensalt


class User(db.Model):

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    name = db.Column(
        db.String(100),
        nullable=False
    )

    email = db.Column(
        db.String(100),
        unique=True,
        nullable=False
    )

    password = db.Column(
        db.String(255),
        nullable=False
    )

    def set_password(
        self,
        password
    ):

        self.password = hashpw(
            password.encode(),
            gensalt()
        ).decode()