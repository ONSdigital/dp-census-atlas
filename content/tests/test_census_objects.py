from unittest.mock import MagicMock

from fixtures import (
    get_test_category,
    get_test_classification,
    get_test_variable,
    get_test_topic,
    get_test_release
)


# -------------------------------------------------- CensusCategory -------------------------------------------------- #


def test_census_category_to_jsonable():
    # GIVEN we instatiate a CensusCategory with a set of test properties
    test_category  = get_test_category()
    # WHEN we invoke the to_jsonable method
    returned = test_category.to_jsonable()
    # THEN we expect to get the correct json-friendly object back
    expected =  {
        "name": test_category.name,
        "slug": test_category.slug,
        "code": test_category.code,
        "legend_str_1": test_category.legend_str_1,
        "legend_str_2": test_category.legend_str_2,
        "legend_str_3": test_category.legend_str_3,
    }
    assert returned == expected


def test_census_category_is_valid():
    # GIVEN we instatiate a CensusCategory with all required properties
    test_category = get_test_category()
    # WHEN we invoke the is_valid method, THEN we expect to get True
    assert test_category.is_valid() is True


def test_census_category_not_valid_blank_public_property():
    # GIVEN we instatiate a CensusCategory with a public property that is blank
    test_category = get_test_category(name="")
    # WHEN we invoke the is_valid method, THEN we expect to get false
    assert test_category.is_valid() is False


# ----------------------------------------------- CensusClassification ----------------------------------------------- #


def test_census_classification_to_jsonable_no_vis_flags():
    # GIVEN we instatiate a CensusClassification with a set of test properties and
    # no viz flags
    mock_categories = [MagicMock(), MagicMock(), MagicMock()]
    for mc in mock_categories:
        mc.to_jsonable.return_value = "test_category"
    test_classification  = get_test_classification(categories=mock_categories)
    # WHEN we invoke the to_jsonable method
    returned = test_classification.to_jsonable()
    # THEN we expect to get the correct json-friendly object back with no
    # viz flags
    expected =  {
        "code": test_classification.code,
        "slug": test_classification.slug,
        "desc": test_classification.desc,
        "categories": ["test_category","test_category","test_category"]
    }
    assert returned == expected
    # AND we expect the to_jsonable method to have been called on all
    # mock_categories
    for mc in mock_categories:
        mc.to_jsonable.assert_called


def test_census_classification_to_jsonable_vis_flags():
    # GIVEN we instatiate a CensusClassification with a set of test properties
    # and has viz flags set
    mock_categories = [MagicMock(), MagicMock(), MagicMock()]
    for mc in mock_categories:
        mc.to_jsonable.return_value = "test_category"
    test_classification  = get_test_classification(
        choropleth_default=True,
        dot_density_default=True,
        categories=mock_categories
    )
    # WHEN we invoke the to_jsonable method
    returned = test_classification.to_jsonable()
    # THEN we expect to get the correct json-friendly object back
    # with viz flags
    expected =  {
        "code": test_classification.code,
        "slug": test_classification.slug,
        "desc": test_classification.desc,
        "choropleth_default": test_classification.choropleth_default,
        "dot_density_default": test_classification.dot_density_default,
        "categories": ["test_category","test_category","test_category"]
    }
    assert returned == expected
    # AND we expect the to_jsonable method to have been called on all
    # mock_categories
    for mc in mock_categories:
        mc.to_jsonable.assert_called


def test_census_classification_is_valid():
    # GIVEN we instatiate a CensusClassification with all needed properties
    mock_category = MagicMock()
    mock_category.is_valid.return_value = True
    test_classification = get_test_classification(categories=[mock_category])
    # WHEN we invoke the is_valid method, THEN we expect to get True
    assert test_classification.is_valid() is True


def test_census_classification_not_valid_blank_public_property():
    # GIVEN we instatiate a CensusClassification with a public property that is blank
    mock_category = MagicMock()
    mock_category.is_valid.return_value = True
    test_classification = get_test_classification(code="", categories=[mock_category])
    # WHEN we invoke the is_valid method, THEN we expect to get false
    assert test_classification.is_valid() is False


def test_census_classification_not_valid_no_categories():
    # GIVEN we instatiate a CensusClassification with no categories (default)
    test_classification = get_test_classification()
    # WHEN we invoke the is_valid method, THEN we expect to get false
    assert test_classification.is_valid() is False


def test_census_classification_not_valid_invalid_category():
    # GIVEN we instatiate a CensusClassification a mocked invalid category
    mock_category = MagicMock()
    mock_category.is_valid.return_value = False
    test_classification = get_test_classification(categories=[mock_category])
    # WHEN we invoke the is_valid method, THEN we expect to get false
    assert test_classification.is_valid() is False


def gather_classification_setup():
    # GIVEN we instatiate a CensusClassification
    test_classification = get_test_classification()
    # AND GIVEN we have a list of categories, some with the same name but with different
    # source values, some with different names and source values, all of which reference our test_classification
    test_categories = []
    for name, source_value in [("tc1", "1"), ("tc1", "2"), ("tc1", "3"), ("tc2", "1"), ("tc3", "1")]:
        test_categories.append(
            get_test_category(name=name, _source_value=source_value, _classification_code=test_classification.code)
        )
    # AND GIVEN we append additional categories to our test list that do NOT reference our test_classification
    test_categories.extend([
        get_test_category(_classification_code="not_our_cls_1"),
        get_test_category(_classification_code="not_our_cls_2")
    ])
    # WHEN we invoke the gather_categories method against our test categories
    test_classification.gather_categories(test_categories)
    return test_classification


def test_census_classification_gather_categories_filters_for_associated_categories():
    # GIVEN we have setup the gather classifications test
    test_classification = gather_classification_setup()
    # THEN we expect the classification to NOT have the categories that do NOT reference it
    assert len(test_classification.categories) == 3
    for cl_cd in ["not_our_cls_1", "not_our_cls_2"]:
        assert any(c._classification_code == cl_cd for c in test_classification.categories) is False


def test_census_classification_gather_categories_preserves_category_order():
    # GIVEN we have setup the gather classifications test
    test_classification = gather_classification_setup()
    # THEN we expect the classification to have the classifications in the order they were added
    assert [c.name for c in test_classification.categories] == ["tc1", "tc2", "tc3"]
    # AND we expect the classification to have aggregated the multiple tc1 categories together and referenced the source
    # values in the code
    assert test_classification.categories[0].code == "tc1-1-2-3"


def test_census_classification_gather_categories_aggregates_compound_categories():
    # GIVEN we have setup the gather classifications test
    test_classification = gather_classification_setup()
    # THEN we expect the classification to have aggregated the multiple tc1 categories together and referenced the source
    # values in the code
    assert test_classification.categories[0].code == "tc1-1-2-3"


# -------------------------------------------------- CensusVariable -------------------------------------------------- #


def test_census_variable_to_jsonable():
    # GIVEN we instatiate a CensusVariable with a set of test properties
    mock_classifications = [MagicMock(), MagicMock(), MagicMock()]
    for mc in mock_classifications:
        mc.to_jsonable.return_value = "test_classification"
    test_variable  = get_test_variable(classifications=mock_classifications)
    # WHEN we invoke the to_jsonable method
    returned = test_variable.to_jsonable()
    # THEN we expect to get the correct json-friendly object back
    expected =  {
        "name": test_variable.name,
        "code": test_variable.code,
        "slug": test_variable.slug,
        "desc": test_variable.desc,
        "units": test_variable.units,
        "classifications": ["test_classification","test_classification","test_classification"]
    }
    assert returned == expected
    # AND we expect the to_jsonable method to have been called on all
    # mock_classifications
    for mc in mock_classifications:
        mc.to_jsonable.assert_called


def test_census_variable_is_valid():
    # GIVEN we instatiate a CensusVariable with all required properties
    mock_classification = MagicMock()
    mock_classification.is_valid.return_value = True
    mock_classification.choropleth_default = True
    test_variable = get_test_variable(classifications=[mock_classification])
    # WHEN we invoke the is_valid method, THEN we expect to get True
    assert test_variable.is_valid() is True


def test_census_variable_not_valid_blank_public_property():
    # GIVEN we instatiate a CensusVariable with a public property that is blank
    mock_classification = MagicMock()
    mock_classification.is_valid.return_value = True
    mock_classification.choropleth_default = True
    test_variable = get_test_variable(name="", classifications=[mock_classification])
    # WHEN we invoke the is_valid method, THEN we expect to get false
    assert test_variable.is_valid() is False


def test_census_variable_not_valid_no_classifications():
    # GIVEN we instatiate a CensusVariable with no classifications (default)
    test_variable = get_test_variable()
    # WHEN we invoke the is_valid method, THEN we expect to get false
    assert test_variable.is_valid() is False


def test_census_variable_not_valid_no_choropleth_default():
    # GIVEN we instatiate a CensusVariable with all required properties
    mock_classification = MagicMock()
    mock_classification.is_valid.return_value = True
    mock_classification.choropleth_default = True
    test_variable = get_test_variable(classifications=[mock_classification])
    # WHEN we invoke the is_valid method, THEN we expect to get True
    assert test_variable.is_valid() is True


def test_census_variable_not_valid_invalid_classification():
    # GIVEN we instantiate a CensusVariable a mocked invalid classification
    mock_classification = MagicMock()
    mock_classification.is_valid.return_value = False
    mock_classification.choropleth_default = True
    test_variable = get_test_variable(classifications=[mock_classification])
    # WHEN we invoke the is_valid method, THEN we expect to get false
    assert test_variable.is_valid() is False


def test_census_variable_gather_classifications_filters_for_associated_classifications():
   # GIVEN we instantiate a test variable
    test_variable  = get_test_variable()
    # AND we make a list of classifications, some of which reference our test variable and some which do not
    mock_classifications = [MagicMock(), MagicMock(), MagicMock(), MagicMock(), MagicMock()]
    for i in range(3):
        mock_classifications[i]._variable_code = test_variable.code
    mock_classifications[3]._variable_code = "not_our_v_1"
    mock_classifications[4]._variable_code = "not_our_v_2"
    # WHEN we invoke the gather_categories method against our test categories
    test_variable.gather_classifications(mock_classifications)
    # THEN we expect the classification to NOT have the categories that do NOT reference it
    assert len(test_variable.classifications) == 3
    for v_cd in ["not_our_v_1", "not_our_v_2"]:
        assert any(c._variable_code == v_cd for c in test_variable.classifications) is False


def test_census_variable_gather_classifications_sorts_by_n_categories():
    # GIVEN we instantiate a test variable
    test_variable  = get_test_variable()
    # AND we make a list of classifications with differing amounts of categories, that are NOT in order of n
    # categories
    mock_classifications = [MagicMock(), MagicMock(), MagicMock()]
    for mc, n_cats in zip(mock_classifications, [3, 2, 6]):
        mc._variable_code = test_variable.code
        mc.categories = ["test_classification"] * n_cats
    # WHEN we invoke the gather_classifications method against our test classifications
    test_variable.gather_classifications(mock_classifications)
    # THEN we expect the variable to have the classifications in ascending order of n categories
    assert [len(c.categories) for c in test_variable.classifications] == [2, 3, 6]


def test_census_variable_make_legend_strings():
    # GIVEN we instantiate a test variable with a classification that has a category
    test_variable = get_test_variable(
        units="household",
        classifications=[get_test_classification(categories=[get_test_category(name="Test_Category")])]
    )
    # WHEN we invoke the make_legend_strs method
    test_variable.make_legend_strings()
    # THEN we expect the nested classification to have the expected strings
    assert test_variable.classifications[0].categories[0].legend_str_1 == "of households in {location}"
    assert test_variable.classifications[0].categories[0].legend_str_2 == "are"
    assert test_variable.classifications[0].categories[0].legend_str_3 == "test_category"


# --------------------------------------------------- CensusTopic ---------------------------------------------------- #


def test_census_topic_to_jsonable():
    # GIVEN we instatiate a CensusTopic with a set of test properties
    mock_variables = [MagicMock(), MagicMock(), MagicMock()]
    for mv in mock_variables:
        mv.to_jsonable.return_value = "test_variable"
    test_topic  = get_test_topic(variables=mock_variables)
    # WHEN we invoke the to_jsonable method
    returned = test_topic.to_jsonable()
    # THEN we expect to get the correct json-friendly object back
    expected =  {
        "name": test_topic.name,
        "slug": test_topic.slug,
        "desc": test_topic.desc,
        "variables": ["test_variable","test_variable","test_variable"]
    }
    assert returned == expected
    # AND we expect the to_jsonable method to have been called on all
    # mock_variables
    for mv in mock_variables:
        mv.to_jsonable.assert_called


def test_census_topic_is_valid():
    # GIVEN we instatiate a CensusTopic with all required properties
    mock_variable = MagicMock()
    mock_variable.is_valid.return_value = True
    test_topic = get_test_topic(variables=[mock_variable])
    # WHEN we invoke the is_valid method, THEN we expect to get True
    assert test_topic.is_valid() is True


def test_census_topic_not_valid_blank_public_property():
    # GIVEN we instatiate a CensusTopic with all required properties except a blank public property
    mock_variable = MagicMock()
    mock_variable.is_valid.return_value = True
    test_topic = get_test_topic(name="", variables=[mock_variable])
    # WHEN we invoke the is_valid method, THEN we expect to get false
    assert test_topic.is_valid() is False


def test_census_topic_not_valid_no_variables():
    # GIVEN we instatiate a CensusTopic with no variables (default)
    test_topic = get_test_topic()
    # WHEN we invoke the is_valid method, THEN we expect to get false
    assert test_topic.is_valid() is False


def test_census_topic_not_valid_invalid_variable():
    # GIVEN we instantiate a CensusTopic a mocked invalid variable
    mock_variable = MagicMock()
    mock_variable.is_valid.return_value = False
    test_topic = get_test_topic(variables=[mock_variable])
    # WHEN we invoke the is_valid method, THEN we expect to get false
    assert test_topic.is_valid() is False


def test_census_topic_gather_variables_filters_for_associated_variables():
   # GIVEN we instantiate a test topic
    test_topic  = get_test_topic()
    # AND we make a list of variables, some of which reference our test topic and some which do not
    mock_variables = [MagicMock(), MagicMock(), MagicMock(), MagicMock(), MagicMock()]
    for i in range(3):
        mock_variables[i]._topic_code = test_topic._code
    mock_variables[3]._variable_code = "not_our_t_1"
    mock_variables[4]._variable_code = "not_our_t_2"
    # WHEN we invoke the gather_categories method against our test categories
    test_topic.gather_variables(mock_variables)
    # THEN we expect the classification to NOT have the categories that do NOT reference it
    assert len(test_topic.variables) == 3
    for t_cd in ["not_our_t_1", "not_our_t_2"]:
        assert any(v.topic_code == t_cd for v in test_topic.variables) is False


# -------------------------------------------------- CensusRelease --------------------------------------------------- #


def test_census_release_to_jsonable():
    # GIVEN we instatiate a CensusRelease with a set of test properties
    mock_topics = [MagicMock(), MagicMock(), MagicMock()]
    mock_topics[0].name = "test_topic_b"
    mock_topics[0].to_jsonable.return_value = "test_topic_b"
    mock_topics[1].name = "test_topic_a"
    mock_topics[1].to_jsonable.return_value = "test_topic_a"
    mock_topics[2].name = "test_topic_c"
    mock_topics[2].to_jsonable.return_value = "test_topic_c"
    test_release  = get_test_release(topics=mock_topics)
    # WHEN we invoke the to_jsonable method
    returned = test_release.to_jsonable()
    # THEN we expect to get the correct json-friendly object back, with topics sorted in lexical order
    expected = ["test_topic_a","test_topic_b","test_topic_c"]
    assert returned == expected
    # AND we expect the to_jsonable method to have been called on all
    # mock_variables
    for mt in mock_topics:
        mt.to_jsonable.assert_called


def test_census_release_is_valid():
    # GIVEN we instatiate a CensusRelease with all required properties
    mock_topic = MagicMock()
    mock_topic.is_valid.return_value = True
    test_release = get_test_release(topics=[mock_topic])
    # WHEN we invoke the is_valid method, THEN we expect to get True
    assert test_release.is_valid() is True


def test_census_release_not_valid_no_topics():
    # GIVEN we instatiate a CensusRelease with no topics (default)
    test_release = get_test_release()
    # WHEN we invoke the is_valid method, THEN we expect to get false
    assert test_release.is_valid() is False


def test_census_release_not_valid_repeated_topics():
    # GIVEN we instatiate a CensusRelease with repeated topics
    mock_topic = MagicMock()
    mock_topic.is_valid.return_value = True
    test_release = get_test_release(topics=[mock_topic, mock_topic])
    # WHEN we invoke the is_valid method, THEN we expect to get False
    assert test_release.is_valid() is False


def test_census_release_not_valid_invalid_topic():
    # GIVEN we instantiate a CensusRelease with a mocked invalid topic
    mock_topic = MagicMock()
    mock_topic.is_valid.return_value = False
    test_release = get_test_release(topics=[mock_topic])
    # WHEN we invoke the is_valid method, THEN we expect to get false
    assert test_release.is_valid() is False