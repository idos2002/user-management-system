from typing import Any
import re

from sqlalchemy.exc import IntegrityError

from api.models.user import get_user_json_key


class ApiErrorResponse:
    def __init__(self, status: int, error: str, message: str,
                 details: dict[str, Any] = None):
        self._status = status
        self._error = error
        self._message = message
        self._details = details

    @property
    def status(self) -> int:
        return self._status

    @property
    def error(self) -> str:
        return self._error

    @property
    def message(self) -> str:
        return self._message

    @property
    def details(self) -> dict[str, Any]:
        return self._details

    @property
    def json(self) -> dict[str, Any]:
        result = {
            'status': self._status,
            'error': self._error,
            'message': self._message
        }

        if self._details is not None:
            result['details'] = self._details

        return result


class DuplicateErrorResponse(ApiErrorResponse):
    def __init__(self, message: str, details: dict[str, Any] = None):
        super().__init__(409, 'Duplicate values error', message, details)


def parse_users_integrity_error(e: IntegrityError) -> ApiErrorResponse:
    # The message details are usually of the form:
    # "Key (key)=(value) already exists."
    error_details: str = e.orig.diag.message_detail
    matches = re.search(r'.*\((.*)\)=\((.*)\).*',
                        error_details,
                        re.M | re.I)
    if not matches:
        return ApiErrorResponse(400, str(e), '')

    key, value = matches.groups()
    print(key, value)
    key = get_user_json_key(key)

    return DuplicateErrorResponse(
        f"User with the {key} '{value}' already exists. The user's username, email and phone number must all be unique.",
        {
            'cause': [key, value]
        }
    )
