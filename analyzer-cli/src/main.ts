import {analyzeFunctionAttributionUnits} from "mutationmap-analyzer";
import cac from "cac";

const cli = cac("mutationmap-analyzer-cli");
cli.help();
cli.command("<path>", "Analyze a file for attribution units")
    .option("-g, --gitRepoPath <repoSourcePath>", "Path to git repository")
    .action(async (path, repoSourcePath) => {
        const config = { path, repoSourcePath };
        const units = await analyzeFunctionAttributionUnits(config);
        console.log(units);
    });

cli.parse();
