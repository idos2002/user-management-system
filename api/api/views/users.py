from flask import Blueprint, request
from sqlalchemy import select, desc
from sqlalchemy.sql.functions import func
from sqlalchemy.exc import IntegrityError
import dateutil.parser

from api import db
from api.models.user import User

blueprint = Blueprint('users', __name__, url_prefix='/users')


@blueprint.route('/', methods=['GET'])
def get_users():
    # Parse URL parameters
    page = request.args.get('page', default=1)
    page_size = request.args.get('pageSize')
    start_time = request.args.get('startTime')

    try:
        start_time = dateutil.parser.isoparse(start_time)
    except (ValueError, TypeError):
        start_time = None

    # Set X-Total-Count header to the total number of users
    # in the requested data set (all users with creation time
    # before given time)
    sql = select(func.count(User.user_id))

    if start_time:
        sql = sql.where(User.created <= start_time)

    user_count = db.session.execute(sql).scalar_one()
    headers = {
        'X-Total-Count': user_count
    }

    # Select all requested users
    sql = select(User).order_by(desc(User.modified))

    try:
        page = int(page)
        page_size = int(page_size)

        if page_size > 0 and page >= 1:
            sql = sql.limit(page_size).offset((page - 1) * page_size)
    except (ValueError, TypeError):
        pass

    if start_time:
        sql = sql.where(User.created <= start_time)

    users = db.session.execute(sql).scalars().all()
    users_json = [user.json for user in users]

    return {'users': users_json}, headers


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
    except IntegrityError as e:
        return f"User's usersname, email and phone number must all be unique: {e.orig.diag.message_detail}", 409


@blueprint.route('/<uuid:user_id>', methods=['GET'])
def get_user(user_id):
    user = db.session.get(User, user_id)
    if not user:
        return f'User {user_id} not found', 404
    return {'user': user.json}


@blueprint.route('/<uuid:user_id>', methods=['PUT'])
def update_user(user_id):
    try:
        user = db.session.get(User, user_id)
        if not user:
            return f'User {user_id} not found', 404

        if not request.is_json:
            return "Invalid JSON body", 400

        user.update(request.json)
        db.session.commit()

        return {'user': user.json}
    except IntegrityError as e:
        return f"User's usersname, email and phone number must all be unique: {e.orig.diag.message_detail}", 409


@blueprint.route('/<uuid:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = db.session.get(User, user_id)
    if not user:
        return f'User {user_id} not found', 404

    db.session.delete(user)
    db.session.commit()

    return '', 204
