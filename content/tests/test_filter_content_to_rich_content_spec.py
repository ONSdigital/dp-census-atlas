from unittest import mock

from filter_content_json_to_rich_content_spec import filter_content
from fixtures import (
    get_test_classification,
    get_test_variable,
    get_test_topic,
    get_test_spec_row,
)


def test_filter_content_filters_and_copies_required_objects():
    # GIVEN a CensusTopic that has two CensusVariables with CensusClassifications with id-able names
    test_topic = get_test_topic()

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

    test_topic.variables = [test_variable_1, test_variable_2]

    # AND given a spec row that specifies a subset of those classifications from one variable
    test_spec_row = get_test_spec_row(
        dataset_classification=test_classifications_1[0].code,
        additional_atlas_classifications=[c.code for c in test_classifications_1[3:]]
    )

    # WHEN we invoke filter_content against our test values
    returned_topic = filter_content([test_spec_row], [test_topic])[0]
    # THEN we expect to get a topic back that is NOT our original topic...
    assert returned_topic != test_topic
    # ... BUT IS a clone of it
    for test_prop in ["name", "slug", "desc"]:
        assert getattr(returned_topic, test_prop) == getattr(test_topic, test_prop)

    # AND we expect our topic to only have a single variable, that is NOT the original target variable...
    assert len(returned_topic.variables) == 1
    returned_variable = returned_topic.variables[0]
    assert returned_variable != test_variable_1
    # ... BUT IS a clone of it ...
    for test_prop in ["name", "code", "slug", "desc", "units"]:
        assert getattr(returned_variable, test_prop) == getattr(test_variable_1, test_prop)
    # ... which only has the specified classifications attached, in the specified order
    assert returned_variable.classifications == [test_classifications_1[0], *test_classifications_1[3:]]


def test_filter_content_aggregates_variables_from_multiple_spec_rows():
    # GIVEN a CensusTopic that has a CensusVariables with three CensusClassifications
    test_topic = get_test_topic()
    test_variable = get_test_variable(code="v1")
    test_classifications = [
        get_test_classification(code="v1_1a"),
        get_test_classification(code="v1_2a"),
        get_test_classification(code="v1_3a")
    ]
    test_variable.classifications = test_classifications
    test_topic.variables = [test_variable]

    # AND given two spec rows that each specifie a classification from the same variable
    test_spec_rows = [
        get_test_spec_row(dataset_classification="v1_1a"),
        get_test_spec_row(dataset_classification="v1_3a")
    ]

    # WHEN we invoke filter_content against our test values
    returned_topics = filter_content(test_spec_rows, [test_topic])
    # THEN we expect to get a single topic back
    assert len(returned_topics) == 1

    # AND we expect our topic to have a single variable, that is NOT the original target variable...
    returned_variables = returned_topics[0].variables
    assert len(returned_variables) == 1
    returned_variable = returned_variables[0]
    assert returned_variable != test_variable
    # ... BUT IS a clone of it ...
    for test_prop in ["name", "code", "slug", "desc", "units"]:
        assert getattr(returned_variable, test_prop) == getattr(test_variable, test_prop)
    # ... which only has the specified classifications attached, in the specified order
    assert returned_variable.classifications == [test_classifications[0], test_classifications[2]]


def test_filter_content_adds_visualisation_flags():
    # GIVEN a CensusTopic that has a CensusVariables with three CensusClassifications
    test_topic = get_test_topic()
    test_variable = get_test_variable(code="v1")
    test_classifications = [
        get_test_classification(code="v1_1a"),
        get_test_classification(code="v1_2a"),
        get_test_classification(code="v1_3a")
    ]
    test_variable.classifications = test_classifications
    test_topic.variables = [test_variable]

    # AND given a spec row that specifies all three classification, and sets visualisation flags for two
    test_spec_rows = [get_test_spec_row(
        dataset_classification="v1_1a",
        additional_atlas_classifications=["v1_2a", "v1_3a"],
        choropleth_default_classification="v1_1a",
        dot_density_default_classification="v1_3a"
    )]

    # WHEN we invoke filter_content against our test values
    returned_topics = filter_content(test_spec_rows, [test_topic])

    # THEN we expect to get a single topic and variable back
    assert len(returned_topics) == 1
    returned_variables = returned_topics[0].variables
    assert len(returned_variables) == 1
    returned_variable = returned_variables[0]
    # AND we expect the variable to have three classifications
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


def test_filter_content_adds_2011_comparison_flags():
    # GIVEN a CensusTopic that has two CensusVariables with three CensusClassifications
    test_topic = get_test_topic()
    test_variable_1 = get_test_variable(code="v1")
    test_classifications_1 = [
        get_test_classification(code="v1_1a"),
        get_test_classification(code="v1_2a"),
        get_test_classification(code="v1_3a")
    ]
    test_variable_1.classifications = test_classifications_1
    test_variable_2 = get_test_variable(code="v2")
    test_classifications_2 = [
        get_test_classification(code="v2_1a"),
        get_test_classification(code="v2_2a"),
        get_test_classification(code="v2_3a")
    ]
    test_variable_2.classifications = test_classifications_2
    test_topic.variables = [test_variable_1, test_variable_2]

    # AND given a spec row that specifies all three classification for both, but only 2011 comparison data for one
    test_spec_rows = [
        get_test_spec_row(
            dataset_classification="v1_1a",
            additional_atlas_classifications=["v1_2a", "v1_3a"],
            comparison_2011=True
        ),
        get_test_spec_row(
            dataset_classification="v2_1a",
            additional_atlas_classifications=["v2_2a", "v2_3a"]
        )
    ]

    # WHEN we invoke filter_content against our test values
    returned_topics = filter_content(test_spec_rows, [test_topic])

    # THEN we expect to get a single topic and two variables back
    assert len(returned_topics) == 1
    returned_variables = returned_topics[0].variables
    assert len(returned_variables) == 2

    # AND we expect each variable to have three classifications
    assert len(returned_variables[0].classifications) == 3
    assert len(returned_variables[1].classifications) == 3
    # AND we expect there to be 2011 comparison data flagged for all classifications in variable 1
    assert all(c.comparison_2011_data_available for c in returned_variables[0].classifications)
    # AND we expect there to be 2011 comparison data flagged for no classifications in variable 1
    assert not any(c.comparison_2011_data_available for c in returned_variables[1].classifications)
