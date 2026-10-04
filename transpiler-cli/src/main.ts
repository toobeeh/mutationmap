import cac from "cac";
import * as path from "node:path";
import { glob } from "glob";
import * as fs from "node:fs";
import {InstrumentationTranspiler, mutationHandlerModule} from "mutationmap-transpiler";
import {InstrumentationUnitAnalyzer} from "mutationmap-transpiler/dist/instrumentationUnitAnalyzer.js";

const cli = cac("mutationmap-analyzer-cli");

cli.help();

cli.command("<directory>", "Root directory to scan for files that will be transpiled")
    .option("-f, --filterExpression <filterExpression>", "File filter expression (glob pattern) to match files to be transpiled, e.g. '**/*.ts'")
    .option("-g, --gitRepoPath <repoSourcePath>", "Path to git repository")
    .action(async (directory, options) => {

        let {repoSourcePath, filterExpression} = options;

        /* resolve directory */
        directory = path.resolve(directory);

        /* resolve path if relative */
        repoSourcePath = repoSourcePath !== undefined ? path.resolve(repoSourcePath) : undefined;

        /* find all files in directory to be transpiled */
        const files = await glob(filterExpression, {
            cwd: directory,
            nodir: true,
            absolute: true
        });

        /* init analyzer */
        const analyzer = new InstrumentationUnitAnalyzer({repoSourcePath});

        /* instrument files */
        const handlerModule = path.join(directory, "mutationHandlerModule");
        for (const file of files) {
            const code = fs.readFileSync(file, "utf-8");
            const units = await analyzer.analyzeText(file, code);

            if (units.length > 0) {

                /* get relative handler module path */
                const modulePath = "./" + path.relative(path.dirname(file), handlerModule).replace(/\\/g, "/");

                /* transpile code and overwrite */
                const transpiler = new InstrumentationTranspiler(modulePath);
                const transpiledSource = transpiler.transpileToInstrumentedUnits(units, file);
                fs.writeFileSync(file, transpiledSource);
                console.log(`Instrumented file: ${file} with ${units.length} units`);
            } else {
                console.log(`No units found in file: ${file}`);
            }
        }

        /* create mutation handler module file afterwards so itself is not transpiled */
        const handlerPath = path.join(directory, "mutationHandlerModule.ts");
        fs.writeFileSync(handlerPath, mutationHandlerModule);
    });

cli.parse();
