from flask.cli import FlaskGroup

from api import db, create_app

cli = FlaskGroup(create_app=create_app)


@cli.command(short_help="Initialize the application's database.")
def init_db():
    db.create_all()
    db.session.commit()


if __name__ == '__main__':
    cli()
