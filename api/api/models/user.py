import uuid

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from api.api import db


class User(db.Model):
    __tablename__ = 'users'

    user_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = db.Column(db.String(), unique=True, nullable=False)
    first_name = db.Column(db.String(), nullable=False)
    last_name = db.Column(db.String(), nullable=False)
    email = db.Column(db.String(), unique=True, nullable=False)
    phone = db.Column(db.String(), unique=True)
    created = db.Column(db.DateTime(timezone=True),
                     nullable=False, default=func.now())
    modified = db.Column(db.DateTime(timezone=True),
                      nullable=False, default=func.now())

    def __init__(self, username, first_name, last_name, email, phone):
        self.username = username
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.phone = phone

    def __repr__(self):
        return f'<User {self.username}>'

    def as_dict(self):
        return {
            'userId': self.user_id,
            'username': self.username,
            'firstName': self.first_name,
            'lastName': self.last_name,
            'email': self.email,
            'phone': self.phone,
            'created': self.created,
            'modified': self.modified
        }
