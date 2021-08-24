from flask import Flask
from flask_sqlalchemy import SQLAlchemy

import config

db = SQLAlchemy()


def create_app():
    app = Flask(__name__)
    config.config_app(app)

    db.init_app(app)

    # Because there is no global Flask app instance,
    # in order for views to access the current_app,
    # we need to import and register them using the
    # created app's context.
    with app.app_context():
        from .views import users
        app.register_blueprint(users.blueprint)

    return app
