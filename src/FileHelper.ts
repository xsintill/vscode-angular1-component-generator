import * as vscode from "vscode";
import * as fse from "fs-extra";
import * as fs from "fs";
import * as path from "path";
import * as changeCase from "change-case";
import { Observable } from "rxjs";

export class FileHelper {
    private static createFile = <(file: string, data: string) => Observable<{}>>Observable.bindNodeCallback(fse.outputFile);
    private static assetRootDir: string = path.join(__dirname, "../../assets");

    public static createComponent(componentDir: string, componentName: string, config: any): Observable<string> {
        let templateFileName = this.assetRootDir + "/templates/component.template";
        if (config.template) {
            templateFileName = this.resolveWorkspaceRoot(config.template);
        }
        
        let componentContent = fs.readFileSync( templateFileName ).toString()          
            .replace(/{templateUrl}/g, `${componentName}.component.html`)
            .replace(/{styleUrls}/g, `${componentName}.component.css`)
            .replace(/{className}/g, changeCase.pascalCase(componentName));

        let filename = `${componentDir}/${componentName}.component.${config.extension}`;

        if (config.create) {
            return this.createFile(filename, componentContent)
                .map(result => filename);
        } else {
            return Observable.of("");
        }
    };

    public static createService(serviceDir: string, serviceName: string, config: any): Observable<string> {
        let templateFileName = this.assetRootDir + "/templates/service.template";
        if (config.template) {
            templateFileName = this.resolveWorkspaceRoot(config.template);
        }
        
        let serviceContent = fs.readFileSync( templateFileName ).toString()
            .replace(/{selector}/g, serviceName)
            .replace(/{templateUrl}/g, `${serviceName}.component.html`)
            .replace(/{styleUrls}/g, `${serviceName}.component.css`)
            .replace(/{className}/g, changeCase.pascalCase(serviceName));

        let filename = `${serviceDir}/${serviceName}.service.${config.extension}`;

        if (config.create) {
            return this.createFile(filename, serviceContent)
                .map(result => filename);
        } else {
            return Observable.of("");
        }
    };

    public static createModule(componentDir: string, componentName: string, config: any): Observable<string> {
        let templateFileName = this.assetRootDir + "/templates/module.template";
        if (config.template) {
            templateFileName = this.resolveWorkspaceRoot(config.template);
        }

        let moduleContent = fs.readFileSync( templateFileName ).toString()
            .replace(/{componentName}/g, componentName)
            .replace(/{className}/g, changeCase.pascalCase(componentName));

        let filename = `${componentDir}/${componentName}.module.${config.extension}`;

        if (config.create) {
            return this.createFile(filename, moduleContent)
                .map(result => filename);
        } else {
            return Observable.of("");
        }
    };

    public static createHtml(componentDir: string, componentName: string, config: any): Observable<string> {
        let templateFileName = this.assetRootDir + "/templates/html.template";
        if (config.template) {
            templateFileName = this.resolveWorkspaceRoot(config.template);
        }

        let htmlContent = fs.readFileSync( templateFileName ).toString();

        let filename = `${componentDir}/${componentName}.component.${config.extension}`; 
        if (config.create) {
            return this.createFile(filename, htmlContent)
                .map(result => filename);
        } else {
            return Observable.of("");
        }
    };

    public static createCss(componentDir: string, componentName: string, config: any): Observable<string> {
        let templateFileName = this.assetRootDir + "/templates/css.template";
        if (config.template) {
            templateFileName = this.resolveWorkspaceRoot(config.template);
        }

        let cssContent = fs.readFileSync( templateFileName ).toString();


        let filename = `${componentDir}/${componentName}.component.${config.extension}`; 
        if (config.create) {
            return this.createFile(filename, cssContent)
                .map(result => filename);
        } else {
            return Observable.of("");
        }
    };

    public static createObjectDir(uri: any, objectName: string): string { 
        let contextMenuSourcePath = this.getContextMenuDir(uri);        

        let objectDir = `${contextMenuSourcePath}/${objectName}`;
        fse.mkdirsSync(objectDir);
        return objectDir;
    }
    public static getContextMenuDir(uri: any): string { 
        let contextMenuSourcePath;

        if (uri && fs.lstatSync(uri.fsPath).isDirectory()) {
            contextMenuSourcePath = uri.fsPath;
        } else if (uri) {
            contextMenuSourcePath = path.dirname(uri.fsPath);
        } else {
            contextMenuSourcePath = vscode.workspace.rootPath;
        }

        return contextMenuSourcePath;
    }

    public static getConfig(): any {
        let content = fs.readFileSync( this.assetRootDir + "/config/config.json" ).toString();
        content = content.replace(/\${workspaceRoot}/g, vscode.workspace.rootPath);
        return JSON.parse(content);
    }

    public static resolveWorkspaceRoot(path: string): string {
        return path.replace("${workspaceRoot}", vscode.workspace.rootPath);
    }

}
