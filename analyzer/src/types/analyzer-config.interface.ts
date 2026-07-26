/**
 * Configuration for running mutation attribution
 */
export interface analyzerConfig {

    /**
     * Path to the js/ts file which will be analyzed.
     */
    path: string;

    /**
     * Path to the GIT repository, if GIT metadata should be parsed
     */
    repoSourcePath?: string;
}
