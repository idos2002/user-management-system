from flask import Blueprint, abort, jsonify, request

from api.api import db
from models import User

blueprint = Blueprint('users', __name__, url_prefix='/users')

@blueprint.route('/', methods=['GET'])
def get_users():
    page = request.args.get('page', default=1)
    page_size = request.args.get('pagesize')

    # query = User.query.order_by(User.modified)
    
    if page_size and page_size > 0 and page >= 1:
        q = q.limit(page_size).offset((page - 1) * page_size)

    return jsonify({'users': q.all()})


@blueprint.route('/', methods=['POST'])
def create_user():
    userDict = request.json
    user = User(userDict['username'], userDict['firstName'],
                userDict['lastName'], userDict['email'], userDict['phone'])
    db.session.add(user)
    db.session.commit()

    return jsonify({'userId': user.user_id}), 201


@blueprint.route('/<uuid:user_id>', methods=['GET'])
def get_user(user_id):
    user = db.session.get(User, user_id)
    if not user:
        return abort(404)
    return jsonify({'user': user})


@blueprint.route('/<uuid:user_id>', methods=['PUT'])
def update_user(user_id):
    pass


@blueprint.route('/<uuid:user_id>', methods=['DELETE'])
def delete_user(user_id):
    pass