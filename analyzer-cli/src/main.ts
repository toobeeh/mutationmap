import {FunctionUnitAnalyzer} from "mutationmap-analyzer";
import cac from "cac";

const cli = cac("mutationmap-analyzer-cli");
cli.help();
cli.command("<path>", "Analyze a file for attribution units")
    .option("-g, --gitRepoPath <repoSourcePath>", "Path to git repository")
    .action(async (path, repoSourcePath) => {
        const config = { repoSourcePath };
        const analyzer = new FunctionUnitAnalyzer(config);
        const units = await analyzer.analyzeFile(path);
        console.log(units);
    });

cli.parse();
