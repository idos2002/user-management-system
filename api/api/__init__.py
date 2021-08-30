from flask import Flask
from flask_sqlalchemy import SQLAlchemy

import config

db = SQLAlchemy()


def create_app():
    app = Flask(__name__)
    config.config_app(app)

    db.init_app(app)

    # @app.after_request
    # def add_cors(response):
    #     response.headers['Access-Control-Allow-Origin'] = '*'
    #     response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE'
    #     response.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, X-Total-Count, Content-Type, Accept'
    #     return response

    # Because there is no global Flask app instance,
    # in order for views to access the current_app,
    # we need to import and register them using the
    # created app's context.
    with app.app_context():
        from .views import users
        app.register_blueprint(users.blueprint)

    return app
