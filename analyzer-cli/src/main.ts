import {FunctionUnitAnalyzer} from "mutationmap-analyzer";
import cac from "cac";
import {Project} from "ts-morph";

const cli = cac("mutationmap-analyzer-cli");

cli.help();

cli.command("<path>", "Analyze a file for function-based attribution units as per specification")
    .option("-g, --gitRepoPath <repoSourcePath>", "Path to git repository")
    .action(async (path, repoSourcePath) => {
        const config = { repoSourcePath };
        const project = new Project({
            compilerOptions: {
                allowJs: true
            }
        });
        project.addSourceFileAtPath(path);

        const analyzer = new FunctionUnitAnalyzer(config);
        const units = await analyzer.analyzeCodebase(project);

        console.log(units);
    });

cli.parse();
