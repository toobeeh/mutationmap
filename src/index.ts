import {analyzeFunctionAttributionUnits} from "./analyzer.js";
import type {analyzerConfig} from "./types/analyzer-config.interface.js";

const path = "C:\\Users\\tobeh\\Desktop\\TU\\BA\\analyzer\\src\\defaultRegionParser.ts";
const config: analyzerConfig = {
    path
};
const units = analyzeFunctionAttributionUnits(config);

console.log(units);






