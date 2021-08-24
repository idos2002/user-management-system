from flask import Blueprint, request
from sqlalchemy import select, desc

from api import db
from api.models.user import User

blueprint = Blueprint('users', __name__, url_prefix='/users')


@blueprint.route('/', methods=['GET'])
def get_users():
    page = request.args.get('page', default=1)
    page_size = request.args.get('pagesize')

    sql = select(User).order_by(desc(User.modified))
    if page_size and page_size > 0 and page >= 1:
        sql = sql.limit(page_size).offset((page - 1) * page_size)

    users = db.session.execute(sql).scalars().all()
    users_json = [user.json for user in users]

    return {'users': users_json}


@blueprint.route('/', methods=['POST'])
def create_user():
    try:
        if not request.is_json:
            return "Invalid JSON body", 400

        user = User.from_json(request.json)
        db.session.add(user)
        db.session.commit()

        return {'userId': user.user_id}, 201
    except KeyError as e:
        return str(e), 400


@blueprint.route('/<uuid:user_id>', methods=['GET'])
def get_user(user_id):
    user = db.session.get(User, user_id)
    if not user:
        return f'User {user_id} not found', 404
    return {'user': user.json}


@blueprint.route('/<uuid:user_id>', methods=['PUT'])
def update_user(user_id):
    user = db.session.get(User, user_id)
    if not user:
        return f'User {user_id} not found', 404

    if not request.is_json:
        return "Invalid JSON body", 400

    user.update(request.json)
    db.session.commit()

    return {'user': user.json}


@blueprint.route('/<uuid:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = db.session.get(User, user_id)
    if not user:
        return f'User {user_id} not found', 404
    
    db.session.delete(user)
    db.session.commit()
    
    return '', 204
