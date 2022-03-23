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
            if (param){
                url = `${url}/${param}`
            }
        })
    }
    if (!args.selectedGeography || args.selectedGeography.geoType === "ew"){
        return url
    } else {
        return `${url}?${args.selectedGeography.geoType}=${args.selectedGeography.geoCode}`
    }
}
