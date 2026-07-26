import {analyzeFunctionAttributionUnits} from "mutationmap-analyzer";
import cac from "cac";

const cli = cac("mutationmap-analyzer-cli");
cli.help();
cli.command("<path>", "Analyze a file for attribution units")
    .action((path) => {
        const config = { path };
        const units = analyzeFunctionAttributionUnits(config);
        console.log(units);
    });

cli.parse();
