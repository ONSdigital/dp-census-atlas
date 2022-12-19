from slugify import slugify


def slugify_with_expanded_special_characters(txt: str) -> str:
    """
    Slugify txt but replace some special characters with their text equivalent (e.g. replace '+' with 'plus'). NB use
    leading space to distinguish '-' meaning 'minus' (e.g. 'rating: -1') from '-' meaning 'hyphenated' (e.g. 
    'days-worked'), and add trailing space after character expansion to preserve sentence structure (e.g. 'rating: -1' 
    -> 'rating-minus-1', not 'rating-minus1').
    """
    for special_char, replacement_string in ((" -", " minus "), (" +", " plus ")):
        txt = txt.replace(special_char, replacement_string)
    return slugify(txt)


def clone_census_object(census_obj, **kwargs):
    """
    Return copy of census_obj with identical data EXCEPT whatever overrides are specified as kwargs
    """
    census_obj_props = {**vars(census_obj)}
    census_obj_props.update(kwargs)
    census_obj_class = type(census_obj)
    return census_obj_class(**census_obj_props)
