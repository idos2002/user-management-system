from typing import TypeVar

K = TypeVar('K')
V = TypeVar('V')


def without_keys(d: dict[K, V], keys: set[K]) -> dict[K, V]:
    """Creates a dictionary based on :param:`d` without the keys 
    given in the set :param:`keys`.

    :param d: Original dictionary containing all keys
    :type d: dict
    :param keys: Keys to be excluded
    :type keys: set
    :return: Copy of the dictionary without the excluded keys
    :rtype: dict
    """
    return {key: d[key] for key in d if key not in keys}
