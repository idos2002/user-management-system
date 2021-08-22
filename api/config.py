import os


class Config(object):
    DEBUG = False
    TESTING = False
    HOST = os.environ['API_HOST']
    PORT = os.environ['API_PORT']

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = (
        f"postgresql+psycopg2://"
        f"{os.environ['POSTGRES_USER']}:{os.environ['POSTGRES_PASSWORD']}@"
        f"{os.environ['POSTGRES_HOSTNAME']}:{os.environ['POSTGRES_PORT']}/"
        f"{os.environ['POSTGRES_DB']}"
    )


class DevelopmentConfig(Config):
    FLASK_ENV = 'development'
    DEVELOPMENT = True
    DEBUG = True


class ProductionConfig(Config):
    FLASK_ENV = 'production'
    DEBUG = False


class TestingConfig(Config):
    TESTING = True


config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,

    'default': DevelopmentConfig
}


def config_app(app):
    configType = os.environ.get('API_CONFIG')
    if configType not in config.keys():
        configType = 'default'

    app.config.from_object(config[configType])
