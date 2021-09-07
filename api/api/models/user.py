from __future__ import annotations
import uuid

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from api import db
from api import util


# Describes the json representation of this model in terms
#  of the class's field names
json_model = {
    'userId': 'user_id',
    'username': 'username',
    'firstName': 'first_name',
    'lastName': 'last_name',
    'email': 'email',
    'phone': 'phone',
    'created': 'created',
    'modified': 'modified'
}


def get_user_json_key(attr_name: str) -> str:
    for json_key, attr in json_model.items():
        if attr == attr_name:
            return json_key
    return None


class User(db.Model):
    __tablename__ = 'users'

    user_id = db.Column(UUID(as_uuid=True),
                        primary_key=True, default=uuid.uuid4)
    username = db.Column(db.String(), unique=True, nullable=False)
    first_name = db.Column(db.String(), nullable=False)
    last_name = db.Column(db.String(), nullable=False)
    email = db.Column(db.String(), unique=True, nullable=False)
    phone = db.Column(db.String(), unique=True)
    created = db.Column(db.DateTime(timezone=True), nullable=False,
                        server_default=func.now())
    modified = db.Column(db.DateTime(timezone=True), nullable=False,
                         server_default=func.now(), onupdate=func.now())

    def __init__(self, username: str, first_name: str, last_name: str,
                 email: str, phone: str | None = None):
        self.username = username
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.phone = phone

    def __repr__(self):
        return f'<User {self.username}>'

    @property
    def json(self) -> dict:
        user_json = {}

        for json_key, attr in json_model.items():
            user_json[json_key] = getattr(self, attr)

        return user_json

    @staticmethod
    def from_json(json: dict) -> User:
        try:
            if 'user' in json.keys():
                json = json['user']

            return User(json['username'], json['firstName'],
                        json['lastName'], json['email'], json.get('phone'))
        except KeyError:
            raise KeyError("Missing fields in request's JSON")

    def update(self, json: dict):
        if 'user' in json.keys():
            json = json['user']

        update_exclude = {'userId', 'created', 'modified'}
        model_to_update = util.without_keys(json_model, update_exclude)

        for json_key, attr in model_to_update.items():
            if json_key in json.keys():
                setattr(self, attr, json[json_key])
