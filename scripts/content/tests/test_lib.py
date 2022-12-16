from lib import slugify_with_expanded_special_characters


def test_slugify_with_expanded_special_characters():
    for txt, expected_slug in (
        ("Highest level of qualification", "highest-level-of-qualification"),
        ("Whole house or bungalow: Terraced", "whole-house-or-bungalow-terraced"),
        (
            "Occupancy rating of bedrooms: +2 or more",
            "occupancy-rating-of-bedrooms-plus-2-or-more"
        ),
        ("Occupancy rating of bedrooms: -1", "occupancy-rating-of-bedrooms-minus-1"),
        (
            "Main language is English (English or Welsh in Wales)",
            "main-language-is-english-english-or-welsh-in-wales"
        ),
        (
            "L14.1 and L14.2: Never worked and long-term unemployed",
            "l14-1-and-l14-2-never-worked-and-long-term-unemployed"
        )
    ):
        assert slugify_with_expanded_special_characters(txt) == expected_slug
