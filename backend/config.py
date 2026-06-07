import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = "expense_tracker_secret"

    SQLALCHEMY_DATABASE_URI = \
        "sqlite:///" + os.path.join(
            BASE_DIR,
            "../database/expense_tracker.db"
        )

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = \
"smart_expense_tracker_super_secure_jwt_key_2026"