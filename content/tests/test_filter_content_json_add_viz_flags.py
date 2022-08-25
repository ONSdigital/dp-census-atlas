from unittest import mock

from filter_content_json_add_viz_flags import (
    get_required_classifications,
    get_variable,
    get_topics,
)
from fixtures import (
    get_test_classification,
    get_test_variable,
    get_test_topic,
    get_test_config_row,
)


def test_get_required_classifications_filters_required_classifications():
    # GIVEN a CensusVariable that has CensusClassifications with id-able names
    test_variable = get_test_variable()
    test_suffixes = ["", "_3a", "_7a", "_27a", "_86a"]
    test_classifications = [get_test_classification(code=f"{test_variable.code}{suffix}") for suffix in test_suffixes]
    test_variable.classifications = test_classifications
    # AND given a config row that specifies a subset of those classifications
    test_config_row = get_test_config_row(classifications="raw,3a,7a")
    # WHEN we invoke get_required_classifications against our test values
    returned = get_required_classifications(test_config_row, test_variable)
    # THEN we expect to get only our specified classifications back, in the expected order
    returned_codes = [c.code for c in returned]
    assert returned_codes == [f"{test_variable.code}", f"{test_variable.code}_3a", f"{test_variable.code}_7a"]


def test_get_required_classifications_appends_visualisation_flags():
    # GIVEN a CensusVariable that has three CensusClassifications
    test_variable = get_test_variable()
    test_classifications = [
        get_test_classification(code="cls_1"),
        get_test_classification(code="cls_2"),
        get_test_classification(code="cls_3")
    ]
    test_variable.classifications = test_classifications
    # AND given a config row that specifies all classifications and sets viz flags for 1 and 2
    test_config_row = get_test_config_row(
        classifications="1,2,3",
        choropleth_default_classification="1",
        dot_density_default_classification="2"
    )
    # WHEN we invoke get_required_classifications against our test values
    returned = get_required_classifications(test_config_row, test_variable)
    # THEN we expect classification 0 to be the choropleth default (and nothing else to be)
    assert returned[0].choropleth_default is True
    assert not any(c.choropleth_default for c in returned[1:])
    # THEN we expect classification 1 to be the dot density default (and nothing else to be)
    assert returned[1].dot_density_default is True
    assert not any(c.dot_density_default for c in returned[2:])


@mock.patch("filter_content_json_add_viz_flags.get_required_classifications")
def test_get_variable_filters_and_copies_variable_from_topic(mock_get_classifications):
    mock_get_classifications.return_value = ["test_classifications"]
    # GIVEN a topic with variables
    test_topic = get_test_topic()
    test_variables = [get_test_variable(code=code, classifications=["1","2","3"]) for code in ["v1", "v2", "v3", "v4"]]
    test_topic.variables = test_variables
    # AND a config row that references one of them
    test_config_row = get_test_config_row(variable="v3")
    # WHEN we invoke get_variable against our test values
    returned = get_variable(test_config_row, test_topic)
    # THEN we expect to get a variable back that is NOT the target variable...
    assert returned != test_variables[2]
    # ... BUT IS a clone of it, with the attached classifications replaced by the result of calling
    # get_required_classifications
    for test_prop in ["name", "code", "slug", "desc", "units"]:
        assert getattr(returned, test_prop) == getattr(test_variables[2], test_prop)
    assert returned.classifications == ["test_classifications"]


@mock.patch("filter_content_json_add_viz_flags.get_variable")
def test_get_topics_filters_and_copies_topics_from_list(mock_get_variable):
    mock_get_variable.return_value = "test_variable"
    # GIVEN a list of four topics with variables
    test_topics = [
         get_test_topic(
            name=name,
            variables=[get_test_variable(code=code, classifications=["1","2","3"]) for code in ["v1", "v2", "v3", "v4"]]
         ) for name in ["t1", "t2", "t3", "t4"]
    ]
    # AND a list of config rows that references two of them
    test_config_rows = [get_test_config_row(topic=topic) for topic in ["t2", "t4"]]
    # WHEN we invoke get_topics against our test values
    returned = get_topics(test_config_rows, test_topics)
    # THEN we expect to get a list of topics back that are NOT the target topics...
    assert len(returned) == 2
    assert returned[0] != test_topics[1]
    assert returned[1] != test_topics[3]
    # ... BUT are clones of them, with the attached variables replaced by the result of calling
    # get_variable
    for test_prop in ["name", "slug", "desc"]:
        assert getattr(returned[0], test_prop) == getattr(test_topics[1], test_prop)
        assert getattr(returned[1], test_prop) == getattr(test_topics[3], test_prop)
    assert returned[0].variables == ["test_variable"]
    assert returned[1].variables == ["test_variable"]


@mock.patch("filter_content_json_add_viz_flags.get_variable")
def test_get_topics_does_not_duplicate_topics_referenced_on_multiple_config_rows(mock_get_variable):
    mock_get_variable.side_effect = ["test_variable_1", "test_variable_2"]
    # GIVEN a list of four topics with variables
    test_topics = [
         get_test_topic(
            name=name,
            variables=[get_test_variable(code=code, classifications=["1","2","3"]) for code in ["v1", "v2", "v3", "v4"]]
         ) for name in ["t1", "t2", "t3", "t4"]
    ]
    # AND a list of config rows that references one of them twice
    test_config_rows = [get_test_config_row(topic=topic) for topic in ["t2", "t2"]]
    # WHEN we invoke get_topics against our test values
    returned = get_topics(test_config_rows, test_topics)
    # THEN we expect to get only one topic back
    assert len(returned) == 1
    # AND we expect its variables to be the result of calling get_variable twice
    assert returned[0].variables == ["test_variable_1", "test_variable_2"]
