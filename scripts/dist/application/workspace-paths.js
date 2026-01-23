import path from 'node:path';
export class WorkspacePaths {
    rootDir;
    constructor(rootDir) {
        this.rootDir = rootDir;
    }
    themeDir(themeId) {
        return path.join(this.rootDir, 'theme', themeId.toString());
    }
    themeOutputDir(themeId) {
        return path.join(this.themeDir(themeId), 'out');
    }
    optimizedImagesDir(themeId) {
        return path.join(this.themeOutputDir(themeId), 'nextImageExportOptimizer');
    }
    searchIndexesDir(themeId) {
        return path.join(this.themeOutputDir(themeId), 'search-indexes');
    }
    contentsDir(siteId) {
        return path.join(this.rootDir, 'contents', siteId.toString(), 'contents');
    }
}
