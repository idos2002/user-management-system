import os


class Config:
    ENV = 'production'
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
    ENV = 'development'
    DEVELOPMENT = True
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False


class TestingConfig(Config):
    TESTING = True


config_types = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,

    'default': DevelopmentConfig
}


def current_config() -> Config:
    config_type = os.environ.get('API_CONFIG')
    if config_type not in config_types.keys():
        config_type = 'default'
    return config_types[config_type]


def config_app(app):
    config = current_config()
    app.config.from_object(config)
