import { _do } from 'rxjs/operator/do';
import * as vscode from "vscode";
import * as fse from "fs-extra";
import * as fs from "fs";
import * as path from "path";
import * as changeCase from "change-case";
import * as _ from "lodash";
import { Observable } from "rxjs";
import { Config } from "./config.interface";

export class FileHelper {
    private static createFile = <(file: string, data: string) => Observable<{}>>Observable.bindNodeCallback(fse.outputFile);
    private static assetRootDir: string = path.join(__dirname, "../../assets");    

    public static createComponent(componentDir: string, namespaceName: string, componentName: string, config: any, configGlobals: Config): Observable<string> {
        let templateFileName = this.assetRootDir + "/templates/component.template";
        if (config.template) {
            templateFileName = this.resolveWorkspaceRoot(config.template);
        }

        //let relativeDir = this.resolveToRelativePath(componentDir); 
        let relativeDir = this.resolveToRelativePathWithReplacedConstants(componentDir, configGlobals); 

        
        let componentContent = fs.readFileSync( templateFileName ).toString()  
            .replace(/{appname}/g, configGlobals.globals.applicationName)
            .replace(/{namespace}/g, changeCase.pascalCase(namespaceName))
            .replace(/{currentpath}/g, `${relativeDir}`)
            .replace(/{templateUrl}/g, `${componentName}.component.html`)
            .replace(/{componentNameKebabCased}/g, changeCase.paramCase(componentName))
            .replace(/{componentNameConstantCased}/g, changeCase.constantCase(componentName))            
            .replace(/{className}/g, changeCase.pascalCase(componentName));

        let filename = `${componentDir}/${FileHelper.getTestPrefix(configGlobals)}${componentName}.component.${config.extension}`;

        if (config.create) {
            return this.createFile(filename, componentContent)
                .map(result => filename);
        } else {
            return Observable.of("");
        }
    };
    
    public static createComponentTest(componentDir: string, namespaceName: string, componentName: string, config: any, configGlobals: Config): Observable<string> {
        let templateFileName = this.assetRootDir + "/templates/component.test.template";
        if (config.template) {
            templateFileName = this.resolveWorkspaceRoot(config.template);
        }

        if  (configGlobals.globals.test) {
            let testDir: string;
            if (configGlobals && 
                configGlobals.files && 
                configGlobals.files.component && 
                configGlobals.files.component.testFile && 
                configGlobals.files.component.testFile.alongSide) {
                testDir = componentDir;
            } else {
                testDir = this.resolveTestPath(componentDir, configGlobals);
            }
            let componentContent = fs.readFileSync( templateFileName ).toString() 
                .replace(/{appname}/g, configGlobals.globals.applicationName) 
                .replace(/{namespace}/g, changeCase.pascalCase(namespaceName))
                .replace(/{componentNameKebabCased}/g, changeCase.paramCase(componentName))
                .replace(/{className}/g, changeCase.pascalCase(componentName));
            
            let filename = `${testDir}/${FileHelper.getTestPrefix(configGlobals)}${componentName}.component${FileHelper.getTestPostfix(configGlobals)}.${config.extension}`;
            if (config.create) {
                return this.createFile(filename, componentContent)
                    .map(result => filename);
            } else {
                return Observable.of("");
            }
        } else {
            return Observable.of("");
        }
        
    };

    public static createService(serviceDir: string, namespaceName: string, serviceName: string, config: any, configGlobals: Config): Observable<string> {
        if (config.create) {
            let templateFileName = this.assetRootDir + "/templates/service.template";
            if (config.template) {
                templateFileName = this.resolveWorkspaceRoot(config.template);
            }   

            let serviceContent = fs.readFileSync( templateFileName ).toString()
                .replace(/{appname}/g, configGlobals.globals.applicationName)
                .replace(/{namespace}/g, changeCase.pascalCase(namespaceName))
                .replace(/{serviceName}/g, changeCase.pascalCase(serviceName))
                .replace(/{serviceNameConstantCase}/g, changeCase.constantCase(serviceName));
            
            //let relativeDir = this.resolveToRelativePath(serviceDir);
            let filename = `${serviceDir}/${serviceName}.service.${config.extension}`;
            
            return this.createFile(filename, serviceContent)
                .map(result => filename);
        } else {
            return Observable.of("");
        }
    };
    public static createServiceTest(serviceDir: string, namespaceName: string, serviceName: string, config: any, configGlobals: Config): Observable<string> {
        let templateFileName = this.assetRootDir + "/templates/service.test.template";
        if (config.template) {
            templateFileName = this.resolveWorkspaceRoot(config.template);
        }   

         if  (configGlobals.globals.test) {
            let serviceContent = fs.readFileSync( templateFileName ).toString()
                .replace(/{appname}/g, configGlobals.globals.applicationName)
                .replace(/{serviceName}/g, changeCase.pascalCase(serviceName))
                .replace(/{namespace}/g, changeCase.pascalCase(namespaceName))
                .replace(/{serviceNameCamelCased}/g, changeCase.camelCase(serviceName))
                .replace(/{serviceNameConstantCase}/g, changeCase.constantCase(serviceName));

            let testDir: string;
             if (configGlobals && 
                configGlobals.files && 
                configGlobals.files.service && 
                configGlobals.files.service.testFile && 
                configGlobals.files.service.testFile.alongSide) {
                testDir = serviceDir;
            } else {
                testDir = this.resolveTestPath(serviceDir, config);
            }    
            
            let filename = `${testDir}/${serviceName}.service${FileHelper.getTestPostfix(configGlobals)}.${config.extension}`;

            if (config.create) {
                return this.createFile(filename, serviceContent)
                    .map(result => filename);
            } else {
                return Observable.of("");
            }
        } else {
            return Observable.of("");
        }     
        
       
    };
    public static createDirective(directiveDir: string, namespaceName: string, directiveName: string, config: any, configGlobals: Config): Observable<string> {
        let templateFileName = this.assetRootDir + "/templates/directive.template";
        if (config.template) {
            templateFileName = this.resolveWorkspaceRoot(config.template);
        }

        let serviceContent = fs.readFileSync( templateFileName ).toString()
            .replace(/{appname}/g, configGlobals.globals.applicationName)
            .replace(/{directiveNameKebabCased}/g, changeCase.paramCase(directiveName))
            .replace(/{namespace}/g, changeCase.pascalCase(namespaceName))
            .replace(/{directiveName}/g, changeCase.pascalCase(directiveName));
            

        let filename = `${directiveDir}/${directiveName}.directive.${config.extension}`;

        if (config.create) {
            return this.createFile(filename, serviceContent)
                .map(result => filename);
        } else {
            return Observable.of("");
        }
    };

    public static createModule(componentDir: string, componentName: string, config: any, configGlobals: Config): Observable<string> {
        let templateFileName = this.assetRootDir + "/templates/module.template";
        if (config.template) {
            templateFileName = this.resolveWorkspaceRoot(config.template);
        }

        let moduleContent = fs.readFileSync( templateFileName ).toString()
            .replace(/{appname}/g, configGlobals.globals.applicationName)
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

        let filename = `${componentDir}/${componentName}.template.${config.extension}`; 
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


        let filename = `${componentDir}/${componentName}.${config.extension}`; 
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

    public static resolveToRelativePath(path: string) {
        let result = path.replace(vscode.workspace.rootPath+"\\", "");
        return result;
    }
    public static resolveToRelativePathWithReplacedConstants(path: string, config: Config) {
        let result = this.resolveToRelativePath(path);
        if (config.globals.sharedConstant) {
            result = result.replace("app\\shared", config.globals.sharedConstant);
        }
        if (config.globals.srcConstant) {
            result = result.replace("app\\areas", config.globals.srcConstant);
        }
        return result;
    }
    public static resolveTestPath(path: string, configGlobals: Config) { 
        let testFolder = "tests";
        if (configGlobals.globals) {
            if (configGlobals.globals.test) {
                testFolder = (configGlobals.globals.test.path) ? configGlobals.globals.test.path : "tests";       
            }
        }
        if (_.startsWith(path, `${vscode.workspace.rootPath}\\${testFolder}\\`) ) {
            return path;
        } else {
            let result = path.replace(
                `${vscode.workspace.rootPath}\\`, 
                `${vscode.workspace.rootPath}\\${testFolder}\\`
            );
            return result;
        }
    }

    public static resolveWorkspaceRoot(path: string): string {
        let result = path.replace("${workspaceRoot}", vscode.workspace.rootPath);
        return result;
    }
    public static getTestPrefix(configGlobals: Config): string {
        return (configGlobals.globals.prefix) ? configGlobals.globals.prefix : "";
    }

    private static getTestPostfix(configGlobals: Config): string {
        return (configGlobals.globals.test.postfix) ? configGlobals.globals.test.postfix : ".test";
    }

}
