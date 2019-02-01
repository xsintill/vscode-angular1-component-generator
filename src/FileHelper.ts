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

    public static createComponent(componentDir: string, componentName: string, config: any, configGlobals: Config): Observable<string> {
        let templateFileName = this.assetRootDir + "/templates/component.template";
        if (config.template) {
            templateFileName = this.resolveWorkspaceRoot(config.template);
        }

        let relativeDirObj = this.resolveToRelativePathWithReplacedConstants(componentDir, configGlobals);

        let componentContent = fs.readFileSync(templateFileName).toString()
            .replace(/{appname}/g, configGlobals.globals.applicationName)
            .replace(/{currentpath}/g, `${relativeDirObj.relativeDir}`)
            .replace(/{areasOrShared}/g, `${(relativeDirObj.isAreas)? "TEMPLATE_PATH_BASE_AREAS": "TEMPLATE_PATH_BASE_SHARED" }`)
            .replace(/{templateUrl}/g, `${componentName}.component.html`)
            .replace(/{componentNameKebabCased}/g, changeCase.paramCase(componentName))
            .replace(/{componentNameConstantCased}/g, changeCase.constantCase(componentName))
            .replace(/{className}/g, changeCase.pascalCase(componentName));

        let filename = `${componentDir}/${componentName}.ui.${config.extension}`;

        if (config.create) {
            return this.createFile(filename, componentContent)
                .map(result => filename);
        } else {
            return Observable.of("");
        }
    };
    public static createUiComponent(componentDir: string, componentName: string, config: any, configGlobals: Config): Observable<string> {
        let templateFileName = this.assetRootDir + "/templates/component-ui.template";
        if (config.template) {
            templateFileName = this.resolveWorkspaceRoot(config.template);
        }

        let relativeDirObj = this.resolveToRelativePathWithReplacedConstants(componentDir, configGlobals);

        let componentContent = fs.readFileSync(templateFileName).toString()
            .replace(/{appname}/g, configGlobals.globals.applicationName)
            .split("{currentpath}").join(`${relativeDirObj.relativeDir}`)
            // .replace(, `${relativeDirObj.relativeDir}`)
            .replace(/{areasOrShared}/g, `${(relativeDirObj.isAreas)? "TEMPLATE_PATH_BASE_AREAS": "TEMPLATE_PATH_BASE_SHARED" }`)
            .replace(/{templateUrl}/g, `${componentName}.ui.html`)
            .replace(/{componentNameKebabCased}/g, changeCase.paramCase(componentName))
            .replace(/{componentNameConstantCased}/g, changeCase.constantCase(componentName))
            .replace(/{className}/g, changeCase.pascalCase(componentName))
            .replace(/{camelCaseClassName}/g, `${changeCase.camelCase(componentName)}`);

        let filename = `${componentDir}/${componentName}.ui.${config.extension}`;

        if (config.create) {
            return this.createFile(filename, componentContent)
                .map(result => filename);
        } else {
            return Observable.of("");
        }
    };
    public static createPresenter(componentDir: string, componentName: string, config: any, configGlobals: Config): Observable<string> {
        let templateFileName = this.assetRootDir + "/templates/presenter.template";
        if (config.template) {
            templateFileName = this.resolveWorkspaceRoot(config.template);
        }

        let relativeDirObj = this.resolveToRelativePathWithReplacedConstants(componentDir, configGlobals);

        let componentContent = fs.readFileSync(templateFileName).toString()
            // .replace(/{appname}/g, configGlobals.globals.applicationName)
            // .replace(/{currentpath}/g, `${relativeDirObj.relativeDir}`)
            // .replace(/{areasOrShared}/g, `${(relativeDirObj.isAreas)? "TEMPLATE_PATH_BASE_AREAS": "TEMPLATE_PATH_BASE_SHARED" }`)
            // .replace(/{templateUrl}/g, `${componentName}.presenter.html`)
            // .replace(/{componentNameKebabCased}/g, changeCase.paramCase(componentName))
            .replace(/{componentNameConstantCased}/g, changeCase.constantCase(componentName))
            .replace(/{className}/g, `${changeCase.pascalCase(componentName)}`)
            .replace(/{camelCaseClassName}/g, `${changeCase.camelCase(componentName)}`);

        let filename = `${componentDir}/${componentName}.presenter.${config.extension}`;

        if (config.create) {
            return this.createFile(filename, componentContent)
                .map(result => filename);
        } else {
            return Observable.of("");
        }
    };
    public static createContainer(componentDir: string, componentName: string, config: any, configGlobals: Config): Observable<string> {
        let templateFileName = this.assetRootDir + "/templates/container.template";
        if (config.template) {
            templateFileName = this.resolveWorkspaceRoot(config.template);
        }

        //let relativeDir = this.resolveToRelativePath(componentDir); 
        let relativeDirObj = this.resolveToRelativePathWithReplacedConstants(componentDir, configGlobals);


        let componentContent = fs.readFileSync(templateFileName).toString()
            .replace(/{appname}/g, configGlobals.globals.applicationName)
            .replace(/{currentpath}/g, `${relativeDirObj.relativeDir}`)
            .replace(/{areasOrShared}/g, `${(relativeDirObj.isAreas)? "TEMPLATE_PATH_BASE_AREAS": "TEMPLATE_PATH_BASE_SHARED" }`)
            .replace(/{templateUrl}/g, `${componentName}.container.html`)
            .replace(/{componentNameKebabCased}/g, `${changeCase.paramCase(componentName)}-container`)
            .replace(/{serviceFileName}/g, `${changeCase.paramCase(componentName)}`)
            .replace(/{componentNameConstantCased}/g, `${changeCase.constantCase(componentName)}_CONTAINER`)
            .replace(/{serviceNameConstantCased}/g, `${changeCase.constantCase(componentName)}`)
            .replace(/{containerClassName}/g, `${changeCase.pascalCase(componentName)}Container`)
            .replace(/{camelCasedClassName}/g, changeCase.camelCase(componentName))
            .replace(/{className}/g, changeCase.pascalCase(componentName));

        let filename = `${componentDir}/${componentName}.container.${config.extension}`;

        if (config.create) {
            return this.createFile(filename, componentContent)
                .map(result => filename);
        } else {
            return Observable.of("");
        }
    };


    public static createDialogTemplate(controllerDir: string, controllerName: string, config: any): Observable<string> {
        let templateFileName = this.assetRootDir + "/templates/dialog-html.template";
        if (config.template) {
            templateFileName = this.resolveWorkspaceRoot(config.template);
        }

        // let relativeDir = this.resolveToRelativePathWithReplacedConstants(controllerDir, configGlobals);

        let dialogTemplateContent = fs.readFileSync(templateFileName).toString();

        let dialogTemplateFilename = `${controllerDir}/${controllerName}-dialog.template.${config.extension}`;

        if (config.create) {
            return this.createFile(dialogTemplateFilename, dialogTemplateContent)
                .map(result => dialogTemplateFilename);
        } else {
            return Observable.of("");
        }
    };

    public static createDialogController(controllerDir: string, controllerName: string, config: any, configGlobals: Config): Observable<string> {
        let templateFileName = this.assetRootDir + "/templates/dialog-controller.template";
        if (config.template) {
            templateFileName = this.resolveWorkspaceRoot(config.template);
        }

        let relativeDir = this.resolveToRelativePathWithReplacedConstants(controllerDir, configGlobals);

        let controllerContent = fs.readFileSync(templateFileName).toString()
            .replace(/{appname}/g, configGlobals.globals.applicationName)
            .replace(/{currentpath}/g, `${relativeDir}`)
            .replace(/{templateUrl}/g, `${controllerName}.template.html`)
            .replace(/{controllerNameConstantCased}/g, changeCase.constantCase(controllerName))
            .replace(/{className}/g, changeCase.pascalCase(controllerName));

        let dialogControllerFilename = `${controllerDir}/${controllerName}-dialog.controller.${config.extension}`;

        if (config.create) {
            return this.createFile(dialogControllerFilename, controllerContent)
                .map(result => dialogControllerFilename);
        } else {
            return Observable.of("");
        }
    };

    public static createComponentTest(componentDir: string, componentName: string, config: any, configGlobals: Config): Observable<string> {
        let templateFileName = this.assetRootDir + "/templates/component.test.template";
        if (config.template) {
            templateFileName = this.resolveWorkspaceRoot(config.template);
        }

        if (configGlobals.globals.test) {
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
            let componentContent = fs.readFileSync(templateFileName).toString()
                .replace(/{appname}/g, configGlobals.globals.applicationName)
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
    public static createControllerTest(controllerDir: string, controllerName: string, config: any, configGlobals: Config): Observable<string> {
        let templateFileName = this.assetRootDir + "/templates/controller.test.template";
        if (config.template) {
            templateFileName = this.resolveWorkspaceRoot(config.template);
        }

        if (configGlobals.globals.test) {
            let testDir: string;
            if (configGlobals &&
                configGlobals.files &&
                configGlobals.files.controller &&
                configGlobals.files.controller.testFile &&
                configGlobals.files.controller.testFile.alongSide) {
                testDir = controllerDir;
            } else {
                testDir = this.resolveTestPath(controllerDir, configGlobals);
            }
            let controllerContent = fs.readFileSync(templateFileName).toString()
                .replace(/{appname}/g, configGlobals.globals.applicationName)
                .replace(/{className}/g, changeCase.pascalCase(controllerName))
                .replace(/{controllerNameConstantCased}/g, changeCase.constantCase(controllerName));

            let strippedoOfController = controllerName.replace(/-controller$/g, "");
            let filename = `${testDir}/${strippedoOfController}.controller${FileHelper.getTestPostfix(configGlobals)}.${config.extension}`;
            if (config.create) {
                return this.createFile(filename, controllerContent)
                    .map(result => filename);
            } else {
                return Observable.of("");
            }
        } else {
            return Observable.of("");
        }

    };

    public static createService(serviceDir: string, serviceName: string, config: any, configGlobals: Config): Observable<string> {
        if (config.create) {
            let templateFileName = this.assetRootDir + "/templates/service.template";
            if (config.template) {
                templateFileName = this.resolveWorkspaceRoot(config.template);
            }

            let serviceContent = fs.readFileSync(templateFileName).toString()
                .replace(/{appname}/g, configGlobals.globals.applicationName)
                .replace(/{serviceName}/g, changeCase.pascalCase(serviceName))
                .replace(/{serviceNameConstantCase}/g, changeCase.constantCase(serviceName));

            let filename = `${serviceDir}/${serviceName}.service.${config.extension}`;

            return this.createFile(filename, serviceContent)
                .map(result => filename);
        } else {
            return Observable.of("");
        }
    };
    public static createWebapiService(serviceDir: string, serviceName: string, config: any, configGlobals: Config): Observable<string> {
        if (config.create) {
            let templateFileName = this.assetRootDir + "/templates/service-webapi.template";
            if (config.template) {
                templateFileName = this.resolveWorkspaceRoot(config.template);
            }

            let serviceContent = fs.readFileSync(templateFileName).toString()
                .replace(/{appname}/g, configGlobals.globals.applicationName)
                .replace(/{serviceName}/g, changeCase.pascalCase(serviceName))
                .replace(/{serviceNameConstantCase}/g, changeCase.constantCase(serviceName));

            let filename = `${serviceDir}/${serviceName}.service.${config.extension}`;

            return this.createFile(filename, serviceContent)
                .map(result => filename);
        } else {
            return Observable.of("");
        }
    };

    public static createServiceTest(serviceDir: string, serviceName: string, config: any, configGlobals: Config): Observable<string> {
        let templateFileName = this.assetRootDir + "/templates/service.test.template";
        if (config.template) {
            templateFileName = this.resolveWorkspaceRoot(config.template);
        }

        if (configGlobals.globals.test) {
            let serviceContent = fs.readFileSync(templateFileName).toString()
                .replace(/{appname}/g, configGlobals.globals.applicationName)
                .replace(/{serviceName}/g, changeCase.pascalCase(serviceName))
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

    public static createProvider(providerDir: string, providerName: string, config: any, configGlobals: Config): Observable<string> {
        if (config.create) {
            let templateFileName = this.assetRootDir + "/templates/provider.template";
            if (config.template) {
                templateFileName = this.resolveWorkspaceRoot(config.template);
            }

            let providerContent = fs.readFileSync(templateFileName).toString()
                .replace(/{appname}/g, configGlobals.globals.applicationName)
                .replace(/{providerName}/g, changeCase.pascalCase(providerName))
                .replace(/{providerNameConstantCase}/g, changeCase.constantCase(providerName));

            let filename = `${providerDir}/${providerName}.provider.${config.extension}`;

            return this.createFile(filename, providerContent)
                .map(result => filename);
        } else {
            return Observable.of("");
        }
    };

    public static createProviderTest(providerDir: string, providerName: string, config: any, configGlobals: Config): Observable<string> {
        let templateFileName = this.assetRootDir + "/templates/provider.test.template";
        if (config.template) {
            templateFileName = this.resolveWorkspaceRoot(config.template);
        }

        if (configGlobals.globals.test) {
            let providerContent = fs.readFileSync(templateFileName).toString()
                .replace(/{appname}/g, configGlobals.globals.applicationName)
                .replace(/{providerName}/g, changeCase.pascalCase(providerName))
                .replace(/{providereNameCamelCased}/g, changeCase.camelCase(providerName))
                .replace(/{providerNameConstantCase}/g, changeCase.constantCase(providerName));

            let testDir: string;
            if (configGlobals &&
                configGlobals.files &&
                configGlobals.files.provider &&
                configGlobals.files.provider.testFile &&
                configGlobals.files.provider.testFile.alongSide) {
                testDir = providerDir;
            } else {
                testDir = this.resolveTestPath(providerDir, config);
            }

            let filename = `${testDir}/${providerName}.provider${FileHelper.getTestPostfix(configGlobals)}.${config.extension}`;

            if (config.create) {
                return this.createFile(filename, providerContent)
                    .map(result => filename);
            } else {
                return Observable.of("");
            }
        } else {
            return Observable.of("");
        }
    };
    public static createConfigRoute(ConfigRouteDir: string, configRouteName: string, config: any, configGlobals: Config): Observable<string> {
        if (config.create) {
            let templateFileName = this.assetRootDir + "/templates/config.route.template";
            if (config.template) {
                templateFileName = this.resolveWorkspaceRoot(config.template);
            }

            let serviceContent = fs.readFileSync(templateFileName).toString()
                .replace(/{appname}/g, configGlobals.globals.applicationName)
                .replace(/{configRouteName}/g, changeCase.constantCase(configRouteName))
                .replace(/{configRouteNameKebabCased}/g, changeCase.paramCase(configRouteName))
                .replace(/{configRouteNameConstantCased}/g, changeCase.constantCase(configRouteName));

            let filename = `${ConfigRouteDir}/${changeCase.lowerCase(configRouteName)}.config.route.${config.extension}`;

            return this.createFile(filename, serviceContent)
                .map(result => filename);
        } else {
            return Observable.of("");
        }
    };
    public static createDirective(directiveDir: string, directiveName: string, config: any, configGlobals: Config): Observable<string> {
        let templateFileName = this.assetRootDir + "/templates/directive.template";
        if (config.template) {
            templateFileName = this.resolveWorkspaceRoot(config.template);
        }

        let serviceContent = fs.readFileSync(templateFileName).toString()
            .replace(/{appname}/g, configGlobals.globals.applicationName)
            .replace(/{directiveNameKebabCased}/g, changeCase.paramCase(directiveName))
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

        let moduleContent = fs.readFileSync(templateFileName).toString()
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

        let htmlContent = fs.readFileSync(templateFileName).toString().
            replace(/{className}/g, changeCase.pascalCase(componentName));

        let filename = `${componentDir}/${componentName}.${config.extension}`;
        if (config.create) {
            return this.createFile(filename, htmlContent)
                .map(result => filename);
        } else {
            return Observable.of("");
        }
    };
    public static createContainerHtml(componentDir: string, componentName: string, config: any): Observable<string> {
        let templateFileName = this.assetRootDir + "/templates/container-html.template";
        if (config.template) {
            templateFileName = this.resolveWorkspaceRoot(config.template);
        }

        let htmlContent = fs.readFileSync(templateFileName).toString()
            .replace(/{className}/g, changeCase.pascalCase(componentName))
            
            .replace(/{componentNameKebabCased}/g, changeCase.paramCase(componentName))

        let filename = `${componentDir}/${componentName}.container.${config.extension}`;
        if (config.create) {
            return this.createFile(filename, htmlContent)
                .map(result => filename);
        } else {
            return Observable.of("");
        }
    };
    public static createUiComponentHtml(componentDir: string, componentName: string, config: any): Observable<string> {
        let templateFileName = this.assetRootDir + "/templates/component-ui-html.template";
        if (config.template) {
            templateFileName = this.resolveWorkspaceRoot(config.template);
        }

        let htmlContent = fs.readFileSync(templateFileName).toString()
            .replace(/{className}/g, changeCase.pascalCase(componentName))
            .replace(/{componentNameKebabCased}/g, changeCase.paramCase(componentName))

        let filename = `${componentDir}/${componentName}.${config.extension}`;
        if (config.create) {
            return this.createFile(filename, htmlContent)
                .map(result => filename);
        } else {
            return Observable.of("");
        }
    };
    // public static createPresenterHtml(componentDir: string, componentName: string, config: any): Observable<string> {
    //     let templateFileName = this.assetRootDir + "/templates/presenter-html.template";
    //     if (config.template) {
    //         templateFileName = this.resolveWorkspaceRoot(config.template);
    //     }

    //     let htmlContent = fs.readFileSync(templateFileName).toString()
    //         .replace(/{{componentNameKebabCased}}/g, changeCase.paramCase(componentName))
    //         .replace(/{className}/g, changeCase.pascalCase(componentName));

    //     let filename = `${componentDir}/${componentName}.${config.extension}`;
    //     if (config.create) {
    //         return this.createFile(filename, htmlContent)
    //             .map(result => filename);
    //     } else {
    //         return Observable.of("");
    //     }
    // };

    public static createCss(componentDir: string, componentName: string, config: any): Observable<string> {
        let templateFileName = this.assetRootDir + "/templates/css.template";
        if (config.template) {
            templateFileName = this.resolveWorkspaceRoot(config.template);
        }

        let cssContent = fs.readFileSync(templateFileName).toString();


        let filename = `${componentDir}/${componentName}.${config.extension}`;
        if (config.create) {
            return this.createFile(filename, cssContent)
                .map(result => filename);
        } else {
            return Observable.of("");
        }
    };
    public static createUiComponentCss(componentDir: string, componentName: string, config: any): Observable<string> {
        let templateFileName = this.assetRootDir + "/templates/component-ui-css.template";
        if (config.template) {
            templateFileName = this.resolveWorkspaceRoot(config.template);
        }

        let cssContent = fs.readFileSync(templateFileName).toString()
            .replace(/{componentNameKebabCased}/g, changeCase.paramCase(componentName));


        let filename = `${componentDir}/${componentName}.${config.extension}`;
        if (config.create) {
            return this.createFile(filename, cssContent)
                .map(result => filename);
        } else {
            return Observable.of("");
        }
    };
    public static createContainerCss(componentDir: string, componentName: string, config: any): Observable<string> {
        let templateFileName = this.assetRootDir + "/templates/container-css.template";
        if (config.template) {
            templateFileName = this.resolveWorkspaceRoot(config.template);
        }

        let cssContent = fs.readFileSync(templateFileName).toString()
            .replace(/{componentNameKebabCased}/g, changeCase.paramCase(componentName));


        let filename = `${componentDir}/${componentName}.container.${config.extension}`;
        if (config.create) {
            return this.createFile(filename, cssContent)
                .map(result => filename);
        } else {
            return Observable.of("");
        }
    };

    public static createObjectDir(uri: any, objectName: string): string {
        let contextMenuSourcePath = this.getContextMenuDir(uri);

        let objectDir = `${contextMenuSourcePath}\\${objectName}`;
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
        let content = fs.readFileSync(this.assetRootDir + "/config/config.json").toString();
        content = content.replace(/\${workspaceRoot}/g, vscode.workspace.rootPath);
        return JSON.parse(content);
    }

    public static resolveToRelativePath(path: string) {
        let result = path.replace(vscode.workspace.rootPath + "\\", "");
        return result;
    }
    public static resolveToRelativePathWithReplacedConstants(path: string, config: Config) {
        let result = { 
            relativeDir: this.resolveToRelativePath(path),
            isShared: undefined,
            isAreas: undefined
        }
        if (config.globals.sharedConstant) {
            result.isShared = result.relativeDir.includes("app\\shared\\");
            result.relativeDir = result.relativeDir.replace("app\\shared\\", config.globals.sharedConstant + "\\");
        }
        if (config.globals.srcConstant) {
            result.isAreas = result.relativeDir.includes("app\\areas\\");
            result.relativeDir = result.relativeDir.replace("app\\areas\\", config.globals.srcConstant + "\\");
        }
        result.relativeDir = result.relativeDir.split("\\").join("/");
        return result;
    }
    public static resolveTestPath(path: string, configGlobals: Config) {
        let testFolder = "tests";
        if (configGlobals.globals) {
            if (configGlobals.globals.test) {
                testFolder = (configGlobals.globals.test.path) ? configGlobals.globals.test.path : "tests";
            }
        }
        if (_.startsWith(path, `${vscode.workspace.rootPath}\\${testFolder}\\`)) {
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
