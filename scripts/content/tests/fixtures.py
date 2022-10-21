from scripts.census_objects import (
    CensusCategory,
    CensusClassification,
    CensusVariable,
    CensusVariableGroup,
)


def get_test_category(**kwargs) -> CensusCategory:
    return CensusCategory(
        name=kwargs.get("name", "test_name"),
        slug=kwargs.get("slug", "test_slug"),
        code=kwargs.get("code", "test_code"),
        legend_str_1=kwargs.get("legend_str_1", "test_legend_str_1"),
        legend_str_2=kwargs.get("legend_str_2", "test_legend_str_2"),
        legend_str_3=kwargs.get("legend_str_3", "test_legend_str_3"),
        _classification_code=kwargs.get("_classification_code", "test_classification_code"),
        _category_code=kwargs.get("_category_code", 1),
    )


def get_test_classification(**kwargs) -> CensusClassification:
    return CensusClassification(
        code=kwargs.get("code", "test_code"),
        slug=kwargs.get("slug", "test_slug"),
        desc=kwargs.get("desc", "test_desc"),
        available_geotypes=kwargs.get("available_geotypes", ["OA"]),
        choropleth_default=kwargs.get("choropleth_default", False),
        dot_density_default=kwargs.get("dot_density_default", False),
        dataset=kwargs.get("dataset", "test_dataset"),
        comparison_2011_data_available=kwargs.get("comparison_2011_data_available", False),
        categories=kwargs.get("categories", []),
        _variable_code=kwargs.get("_variable_code", "test_variable_code"),
    )


def get_test_variable(**kwargs) -> CensusVariable:
    return CensusVariable(
        name=kwargs.get("name", "test_name"),
        code=kwargs.get("code", "test_code"),
        slug=kwargs.get("slug", "test_slug"),
        desc=kwargs.get("desc", "test_desc"),
        long_desc=kwargs.get("long_desc", "test_long_desc"),
        units=kwargs.get("units", "person"),
        topic_code=kwargs.get("topic_code", "test_topic_code"),
        classifications=kwargs.get("classifications", []),
    )


def get_test_variable_group(**kwargs) -> CensusVariableGroup:
    return CensusVariableGroup(
        name=kwargs.get("name", "test_name"),
        slug=kwargs.get("slug", "test_slug"),
        desc=kwargs.get("desc", "test_desc"),
        variables=kwargs.get("variables", []),
        _topic_codes=kwargs.get("_topic_codes", []),
    )
