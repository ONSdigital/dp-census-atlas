import type { SelectedGeographyData } from "../types"

export const makeHyperlink = (topicSlug?: string, variableSlug?: string, classificationSlug?: string, categorySlug?: string, selectedGeography?: SelectedGeographyData ) => {
    if (categorySlug && !classificationSlug){
        classificationSlug = "default"
    }
    const paramsArr = [topicSlug, variableSlug, classificationSlug, categorySlug]
    let url = "2021/"
    paramsArr.forEach((param) => {
        url = checkParam(url, param)
    })
    if (!selectedGeography || selectedGeography.geoType === "ew"){
        return url
    } else {
        return `${url}?${selectedGeography.geoType}=${selectedGeography.geoCode}`
    }
}

const checkParam = (url: string, param: string | undefined) => {
    if (!param) {
        return url
    } else {
        return `${url}/${param}`
    }
}