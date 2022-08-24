from census_objects import (
    CensusCategory,
    CensusClassification,
    CensusVariable,
    CensusTopic,
    CensusRelease,
)
from filter_content_json_add_viz_flags import (
    ConfigRow,
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
        _source_value=kwargs.get("_source_value", "test_source_value"),
    )


def get_test_classification(**kwargs) -> CensusClassification:
    return CensusClassification(
        code=kwargs.get("code", "test_code"),
        slug=kwargs.get("slug", "test_slug"),
        desc=kwargs.get("desc", "test_desc"),
        choropleth_default=kwargs.get("choropleth_default", False),
        dot_density_default=kwargs.get("dot_density_default", False),
        categories=kwargs.get("categories", []),
        _variable_code=kwargs.get("_variable_code", "test_variable_code"),
    )


def get_test_variable(**kwargs) -> CensusVariable:
    return CensusVariable(
        name=kwargs.get("name", "test_name"),
        code=kwargs.get("code", "test_code"),
        slug=kwargs.get("slug", "test_slug"),
        desc=kwargs.get("desc", "test_desc"),
        units=kwargs.get("units", "person"),
        classifications=kwargs.get("classifications", []),
        _topic_code=kwargs.get("_topic_code", "test_topic_code"),
    )


def get_test_topic(**kwargs) -> CensusTopic:
    return CensusTopic(
        name=kwargs.get("name", "test_name"),
        slug=kwargs.get("slug", "test_slug"),
        desc=kwargs.get("desc", "test_desc"),
        variables=kwargs.get("variables", []),
        _code=kwargs.get("_code", "test_code"),
    )


def get_test_release(**kwargs) -> CensusRelease:
    return CensusRelease(
        name=kwargs.get("name", "test_name"),
        topics=kwargs.get("topics", []),
    )


def get_test_config_row(**kwargs) -> ConfigRow:
    return ConfigRow(
        release=kwargs.get("release", "test_release"),
        topic_grouping=kwargs.get("topic_grouping", "test_topic_grouping"),
        topic=kwargs.get("topic", "test_topic"),
        variable=kwargs.get("variable", "test_variable"),
        classifications=kwargs.get("classifications", "raw"),
        choropleth_default_classification=kwargs.get("choropleth_default_classification", ""),
        dot_density_default_classification=kwargs.get("dot_density_default_classification", ""),
    )