import type { SelectedGeographyData } from "../types"

export const buildHyperlink = (args: {topic?: string, variable?: string, classification?: string, category?: string, selectedGeography?: SelectedGeographyData }) => {
    let url = "/"
    if (args.topic){
        if (args.category && !args.classification){
            args.classification = "default"
        }
        const paramsArr = [args.topic, args.variable, args.classification, args.category]
        url = "/2021"
        paramsArr.forEach((param) => {
            url = checkParam(url, param)
        })
    }
    if (!args.selectedGeography || args.selectedGeography.geoType === "ew"){
        return url
    } else {
        return `${url}?${args.selectedGeography.geoType}=${args.selectedGeography.geoCode}`
    }
}

const checkParam = (url: string, param: string | undefined) => {
    if (!param) {
        return url
    } else {
        return `${url}/${param}`
    }
}