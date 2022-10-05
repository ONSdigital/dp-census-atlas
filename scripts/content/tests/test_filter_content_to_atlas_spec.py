from unittest import mock

from scripts.filter_content_to_atlas_spec import clone_census_object, filter_variable_groups_to_atlas_spec
from fixtures import (
    get_test_classification,
    get_test_variable,
    get_test_variable_group,
)


def test_clone_census_object_clones_with_no_overrides():
    # GIVEN a set of census objects
    for object_to_clone in (
        get_test_classification(),
        get_test_variable(),
        get_test_variable_group(),
    ):
        # WHEN we clone one with no overrides
        clone = clone_census_object(object_to_clone)
        # THEN we expect the clone to be the same class as its donor
        assert isinstance(clone, object_to_clone.__class__)
        # AND we expect the clone to have identical properties to the donor
        assert vars(clone) == vars(object_to_clone)


def test_clone_census_object_clones_with_overrides():
    # GIVEN a set of census objects
    for object_to_clone, overrides in (
        (get_test_classification(), {"code": "override_test_code"}),
        (get_test_variable(), {"name": "override_test_name"}),
        (get_test_variable_group(), {"slug": "override-test-slug"}),
    ):
        # WHEN we clone one with overrides
        clone = clone_census_object(object_to_clone, **overrides)
        # THEN we expect the clone to be the same class as its donor
        assert isinstance(clone, object_to_clone.__class__)
        # AND we expect the clone to have identical properties to the donor, EXCEPT the overrides
        expected_props = vars(object_to_clone)
        expected_props.update(overrides)
        assert vars(clone) == expected_props


def test_filter_content_filters_to_required_objects():
    # GIVEN a CensusVariableGroup that has two CensusVariables with CensusClassifications with id-able names
    test_variable_group = get_test_variable_group()

    test_variable_1 = get_test_variable(code="v1")
    test_classification_codes_1 = [
        test_variable_1.code,
        f"{test_variable_1.code}_3a",
        f"{test_variable_1.code}_7a",
        f"{test_variable_1.code}_27a",
        f"{test_variable_1.code}_86a"
    ]
    test_classifications_1 = [get_test_classification(code=code) for code in test_classification_codes_1]
    test_variable_1.classifications = test_classifications_1

    test_variable_2 = get_test_variable(code="v2")
    test_classification_codes_2 = [
        test_variable_2.code,
        f"{test_variable_2.code}_3a",
        f"{test_variable_2.code}_7a",
        f"{test_variable_2.code}_27a",
        f"{test_variable_2.code}_86a"
    ]
    test_classifications_2 = [get_test_classification(code=code) for code in test_classification_codes_2]
    test_variable_2.classifications = test_classifications_2

    test_variable_group.variables = [test_variable_1, test_variable_2]

    # AND given a spec that specifies a subset of those classifications from one variable
    test_spec= {
        "atlas_classifications": [test_classification_codes_1[0], *test_classification_codes_1[3:]],
        "choropleth_defaults": [],
        "dot_density_defaults": [],
        "comparison_2011": [],
    }

    # WHEN we invoke filter_content_to_atlas_spec against our test values
    returned_variable_groups = filter_variable_groups_to_atlas_spec([test_variable_group], test_spec)

    # THEN we expect to get one variable group back...
    assert len(returned_variable_groups) == 1
    returned_variable_group = returned_variable_groups[0]

    # ... that is NOT our original variable group...
    assert returned_variable_group != test_variable_group
    # ... BUT IS a clone of it
    for test_prop in ["name", "slug", "desc"]:
        assert getattr(returned_variable_group, test_prop) == getattr(test_variable_group, test_prop)

    # AND we expect our variable group to only have a single variable, that is NOT the original target variable...
    assert len(returned_variable_group.variables) == 1
    returned_variable = returned_variable_group.variables[0]
    assert returned_variable != test_variable_1
    # ... BUT IS a clone of it ...
    for test_prop in ["name", "code", "slug", "desc", "units"]:
        assert getattr(returned_variable, test_prop) == getattr(test_variable_1, test_prop)
    # ... which only has the specified classifications attached, in the specified order
    assert returned_variable.classifications == [test_classifications_1[0], *test_classifications_1[3:]]


def test_filter_content_adds_rendering_flags():
    # GIVEN a CensusVariableGroup that has a CensusVariables with three CensusClassifications
    test_variable_group = get_test_variable_group()

    test_variable = get_test_variable(code="v1")
    test_classifications = [
        get_test_classification(code="v1_1a"),
        get_test_classification(code="v1_2a"),
        get_test_classification(code="v1_3a")
    ]
    test_variable.classifications = test_classifications
    test_variable_group.variables = [test_variable]

    # AND given a spec that specifies all three classification, and sets visualisation flags for two and 2011 comparison
    # for one
    test_spec= {
        "atlas_classifications": ["v1_1a", "v1_2a", "v1_3a"],
        "choropleth_defaults": ["v1_1a"],
        "dot_density_defaults": ["v1_3a"],
        "comparison_2011": ["v1_2a"],
    }

    # WHEN we invoke filter_content against our test values
    returned_variable_groups = filter_variable_groups_to_atlas_spec([test_variable_group], test_spec)

    # THEN we expect to get a single variable group and variable back
    assert len(returned_variable_groups) == 1
    returned_variables = returned_variable_groups[0].variables
    assert len(returned_variables) == 1

    # AND we expect the variable to have three classifications
    returned_variable = returned_variables[0]
    returned_classifications = returned_variable.classifications
    assert len(returned_classifications) == 3

    # AND we expect there to be one choropleth default classification, and it to be v1_1a
    choropleth_default_classifications = [c for c in returned_classifications if c.choropleth_default is True]
    assert len(choropleth_default_classifications) == 1
    assert choropleth_default_classifications[0].code == "v1_1a"

    # AND we expect there to be one dot density default classification, and it to be v1_3a
    dot_density_default_classifications = [c for c in returned_classifications if c.dot_density_default is True]
    assert len(dot_density_default_classifications) == 1
    assert dot_density_default_classifications[0].code == "v1_3a"

    # AND we expect there to be one classification with 2011 comparison, and it to be v1_2a
    dot_density_default_classifications = [c for c in returned_classifications if c.comparison_2011_data_available is True]
    assert len(dot_density_default_classifications) == 1
    assert dot_density_default_classifications[0].code == "v1_2a"
