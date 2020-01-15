// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as changeCase from "change-case";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/forkJoin';

import { FileHelper } from "./FileHelper";
import { Config } from "./config.interface";
import * as pluralize from 'pluralize';

// enum EventType {
//     None,
//     Incoming,
//     Outgoing
// }
// interface IEventItem {
//     name: string;
//     eventType: EventType;
// }

// export async function showEventInputType(eventItems: IEventItem[]): Promise<IEventItem[]> {
//     let eventItem: IEventItem;
//     const eventType = await vscode.window.showQuickPick([{label:"No events needed", description:"", target: EventType.None}, 
//     {label:"Incoming", description:"", target: EventType.Incoming}, {label:"Outgoing", description:"", target: EventType.Outgoing}],{placeHolder:"Select what kind of event you need."

//     });
//     if (eventType) {
//         if (eventType.target === EventType.None) {
//             return eventItems
//         } else {
//             eventItem.eventType = eventType.target;
//             eventItem.name = await vscode.window.showInputBox({placeHolder: "Give an event name (camelCased"})
//             showEventInputType(eventItems);
//         }
//     }
// }

// export function getBindingsO(bindings: string[]): Observable<string[]> {
//     if (!bindings) {
//         bindings = [];
//     }
//    .then((response)=>{
//     if (!bindings) {
//         bindings = [];
//     }
//             if (response !== "") {
//                 bindings.push(response);
//                 getBindingsO(bindings);
//             } else {
//                 return bindings;
//             }
//     });


// }


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    let configPrefix: string = "ng1FilesGenerator";

    let testDisposable = vscode.commands.registerCommand("extension.genAngular1TestFiles", (uri) => {
        let _workspace = vscode.workspace;
        let config = <Config>_workspace.getConfiguration((configPrefix + ".config"));
        let configGlobals = <Config>_workspace.getConfiguration(configPrefix);

        if (!config.files) {
            config = FileHelper.getConfig();
        }

        let enterNamespaceNameDialog$ = Observable.from(vscode.window.showInputBox({ prompt: "Please enter name for the service." }));
        enterNamespaceNameDialog$
            .concatMap(testFilenameValue => {
                if (testFilenameValue.length === 0) {
                    throw new Error("Service name can not be empty!");
                }

                let testFilename = changeCase.paramCase(testFilenameValue);
                let testFileDir = FileHelper.resolveWorkspaceRoot(FileHelper.getContextMenuDir(uri));
                return Observable.forkJoin(
                    FileHelper.createComponentTest(testFileDir, testFilename, config.files.component.testFile, configGlobals)
                );
            })
            .concatMap(result => {
                return Observable.from(result);
            })
            .filter(path => path.length > 0)
            .first()
            .concatMap(filename => Observable.from(vscode.workspace.openTextDocument(filename)))
            .concatMap(textDocument => {
                if (!textDocument) {
                    throw new Error("Could not open file!");
                };
                return Observable.from(vscode.window.showTextDocument(textDocument));
            })
            .do(editor => {
                if (!editor) {
                    throw new Error("Could not open file!");
                };
            })
            .subscribe(
                () => vscode.window.setStatusBarMessage("Component Testfile Successfuly created!"),
                err => vscode.window.showErrorMessage(err.message)
            );
    });

    let controllerTestDisposable = vscode.commands.registerCommand("extension.genAngular1ControllerTestFiles", (uri) => {
        let _workspace = vscode.workspace;
        let config = <Config>_workspace.getConfiguration((configPrefix + ".config"));
        let configGlobals = <Config>_workspace.getConfiguration(configPrefix);

        if (!config.files) {
            config = FileHelper.getConfig();
        }


        let enterNamespaceNameDialog$ = Observable.from(vscode.window.showInputBox({ prompt: "Please enter name for the controller." }));
        enterNamespaceNameDialog$
            .concatMap(testFilenameValue => {
                if (testFilenameValue.length === 0) {
                    throw new Error("Controller name can not be empty!");
                }

                let testFilename = changeCase.paramCase(testFilenameValue);
                let testFileDir = FileHelper.resolveWorkspaceRoot(FileHelper.getContextMenuDir(uri));
                return Observable.forkJoin(
                    FileHelper.createControllerTest(testFileDir, testFilename, config.files.controller.testFile, configGlobals)
                );
            })
            .concatMap(result => {
                return Observable.from(result);
            })
            .filter(path => path.length > 0)
            .first()
            .concatMap(filename => Observable.from(vscode.workspace.openTextDocument(filename)))
            .concatMap(textDocument => {
                if (!textDocument) {
                    throw new Error("Could not open file!");
                };
                return Observable.from(vscode.window.showTextDocument(textDocument));
            })
            .do(editor => {
                if (!editor) {
                    throw new Error("Could not open file!");
                };
            })
            .subscribe(
                () => vscode.window.setStatusBarMessage("Controller Testfile Successfuly created!"),
                err => vscode.window.showErrorMessage(err.message)
            );
    });

    let controllerDisposable = vscode.commands.registerCommand("extension.genAngular1DialogControllerFiles", (uri) => {
        let _workspace = vscode.workspace;
        let config = <Config>_workspace.getConfiguration((configPrefix + ".config"));
        let configGlobals = <Config>_workspace.getConfiguration(configPrefix);

        if (!config.files) {
            config = FileHelper.getConfig();
        }


        //Display a namespace dialog to the user
        let enterNamespaceNameDialog$ = Observable.from(vscode.window.showInputBox({ prompt: "Please enter name for the dialog controller(leave out any dialog reference in the name)." }));
        enterNamespaceNameDialog$
            .concatMap(controllerNameValue => {
                if (controllerNameValue.length === 0) {
                    throw new Error("Dialog controller name can not be empty!");
                }

                let controllerName = changeCase.paramCase(controllerNameValue);
                let controllerDir = FileHelper.resolveWorkspaceRoot(FileHelper.getContextMenuDir(uri));
                return Observable.forkJoin(
                    FileHelper.createDialogController(controllerDir, controllerName, config.files.controller, configGlobals),
                    // FileHelper.createDialogTemplate(controllerDir, controllerName, config.files.controller),
                    FileHelper.createHtml(controllerDir, controllerName, config.files.component.html),
                    FileHelper.createControllerTest(controllerDir, controllerName, config.files.controller.testFile, configGlobals)
                );
            })
            .concatMap(result => {
                return Observable.from(result);
            })
            .filter(path => path.length > 0)
            .first()
            .concatMap(filename => Observable.from(vscode.workspace.openTextDocument(filename)))
            .concatMap(textDocument => {
                if (!textDocument) {
                    throw new Error("Could not open file!");
                };
                return Observable.from(vscode.window.showTextDocument(textDocument));
            })
            .do(editor => {
                if (!editor) {
                    throw new Error("Could not open file!");
                };
            })
            .subscribe(
                () => vscode.window.setStatusBarMessage("Controller Successfuly created!"),
                err => vscode.window.showErrorMessage(err.message)
            );
    });

    let providerDisposable = vscode.commands.registerCommand("extension.genAngular1ProviderFiles", (uri) => {
        let _workspace = vscode.workspace;
        let config = <Config>_workspace.getConfiguration((configPrefix + ".config"));
        let configGlobals = <Config>_workspace.getConfiguration(configPrefix);

        if (!config.files) {
            config = FileHelper.getConfig();
        }


        //Display a namespace dialog to the user
        let enterNamespaceNameDialog$ = Observable.from(vscode.window.showInputBox({ prompt: "Please enter name for the provider." }));
        enterNamespaceNameDialog$
            .concatMap(serviceNameValue => {
                if (serviceNameValue.length === 0) {
                    throw new Error("Provider name can not be empty!");
                }

                let providerName = changeCase.paramCase(serviceNameValue);
                let providerDir = FileHelper.resolveWorkspaceRoot(FileHelper.getContextMenuDir(uri));
                return Observable.forkJoin(
                    FileHelper.createProvider(providerDir, providerName, config.files.provider, configGlobals),
                    FileHelper.createProviderTest(providerDir, providerName, config.files.provider.testFile, configGlobals)
                );
            })
            .concatMap(result => {
                return Observable.from(result);
            })
            .filter(path => path.length > 0)
            .first()
            .concatMap(filename => Observable.from(vscode.workspace.openTextDocument(filename)))
            .concatMap(textDocument => {
                if (!textDocument) {
                    throw new Error("Could not open file!");
                };
                return Observable.from(vscode.window.showTextDocument(textDocument));
            })
            .do(editor => {
                if (!editor) {
                    throw new Error("Could not open file!");
                };
            })
            .subscribe(
                () => vscode.window.setStatusBarMessage("Service Successfuly created!"),
                err => vscode.window.showErrorMessage(err.message)
            );
    });

    let serviceDisposable = vscode.commands.registerCommand("extension.genAngular1ServiceFiles", (uri) => {
        let _workspace = vscode.workspace;
        let config = <Config>_workspace.getConfiguration((configPrefix + ".config"));
        let configGlobals = <Config>_workspace.getConfiguration(configPrefix);

        if (!config.files) {
            config = FileHelper.getConfig();
        }

        //Display a namespace dialog to the user
        let enterNamespaceNameDialog$ = Observable.from(vscode.window.showInputBox({ prompt: "Please enter name for the service." }));
        enterNamespaceNameDialog$
            .concatMap(serviceNameValue => {
                if (serviceNameValue.length === 0) {
                    throw new Error("Service name can not be empty!");
                }

                let serviceName = changeCase.paramCase(serviceNameValue);
                let serviceDir = FileHelper.resolveWorkspaceRoot(FileHelper.getContextMenuDir(uri));
                return Observable.forkJoin(
                    FileHelper.createService(serviceDir, serviceName, config.files.service, configGlobals),
                    FileHelper.createServiceTest(serviceDir, serviceName, config.files.service.testFile, configGlobals)
                );
            })
            .concatMap(result => {
                return Observable.from(result);
            })
            .filter(path => path.length > 0)
            .first()
            .concatMap(filename => Observable.from(vscode.workspace.openTextDocument(filename)))
            .concatMap(textDocument => {
                if (!textDocument) {
                    throw new Error("Could not open file!");
                };
                return Observable.from(vscode.window.showTextDocument(textDocument));
            })
            .do(editor => {
                if (!editor) {
                    throw new Error("Could not open file!");
                };
            })
            .subscribe(
                () => vscode.window.setStatusBarMessage("Service Successfuly created!"),
                err => vscode.window.showErrorMessage(err.message)
            );
    });

    let configRouteDisposable = vscode.commands.registerCommand("extension.genAngular1ConfigRouteFiles", (uri) => {
        let _workspace = vscode.workspace;
        let config = <Config>_workspace.getConfiguration((configPrefix + ".config"));
        let configGlobals = <Config>_workspace.getConfiguration(configPrefix);

        if (!config.files) {
            config = FileHelper.getConfig();
        }

        //Display a namespace dialog to the user
        let enterConfigRouteNameDialog$ = Observable.from(vscode.window.showInputBox({ prompt: "Please enter name for the config route." }));
        enterConfigRouteNameDialog$
            .concatMap(configRouteNameValue => {
                if (configRouteNameValue.length === 0) {
                    throw new Error("Config route name can not be empty!");
                }

                let configRouteName = changeCase.paramCase(configRouteNameValue);
                let configRouteNameConstantCased = changeCase.constantCase(configRouteNameValue);
                let configRouteDir = FileHelper.resolveWorkspaceRoot(FileHelper.getContextMenuDir(uri));
                return Observable.forkJoin(
                    FileHelper.createConfigRoute(configRouteDir, configRouteNameConstantCased, config.files.configRoute, configGlobals)
                );
            })
            .concatMap(result => {
                return Observable.from(result);
            })
            .filter(path => path.length > 0)
            .first()
            .concatMap(filename => Observable.from(vscode.workspace.openTextDocument(filename)))
            .concatMap(textDocument => {
                if (!textDocument) {
                    throw new Error("Could not open file!");
                };
                return Observable.from(vscode.window.showTextDocument(textDocument));
            })
            .do(editor => {
                if (!editor) {
                    throw new Error("Could not open file!");
                };
            })
            .subscribe(
                () => vscode.window.setStatusBarMessage("Config route Successfully created!"),
                err => vscode.window.showErrorMessage(err.message)
            );
    });

    let directiveDisposable = vscode.commands.registerCommand("extension.genAngular1DirectiveFiles", (uri) => {
        let _workspace = vscode.workspace;
        let config = <Config>_workspace.getConfiguration((configPrefix + ".config"));
        let configGlobals = <Config>_workspace.getConfiguration(configPrefix);

        if (!config.files) {
            config = FileHelper.getConfig();
        }

        //Display a namespace dialog to the user
        let enterNamespaceNameDialog$ = Observable.from(vscode.window.showInputBox({ prompt: "Please enter name for the directive." }));
        enterNamespaceNameDialog$
            .concatMap(directiveNameValue => {
                if (directiveNameValue.length === 0) {
                    throw new Error("Directive name can not be empty!");
                }

                let directiveName = changeCase.paramCase(directiveNameValue);
                let contextMenuDir = FileHelper.resolveWorkspaceRoot(FileHelper.getContextMenuDir(uri));
                return Observable.forkJoin(
                    FileHelper.createDirective(contextMenuDir, directiveName, config.files.directive, configGlobals)
                );
            })
            .concatMap(result => Observable.from(result))
            .filter(path => path.length > 0)
            .first()
            .concatMap(filename => Observable.from(vscode.workspace.openTextDocument(filename)))
            .concatMap(textDocument => {
                if (!textDocument) {
                    throw new Error("Could not open file!");
                };
                return Observable.from(vscode.window.showTextDocument(textDocument));
            })
            .do(editor => {
                if (!editor) {
                    throw new Error("Could not open file!");
                };
            })
            .subscribe(
                () => vscode.window.setStatusBarMessage("Directive Successfuly created!"),
                err => vscode.window.showErrorMessage(err.message)
            );
    });

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let componentDisposable = vscode.commands.registerCommand("extension.genAngular1ComponentFiles", (uri) => {
        // The code you place here will be executed every time your command is executed

        let _workspace = vscode.workspace;
        let config = <Config>_workspace.getConfiguration((configPrefix + ".config"));
        let configGlobals = <Config>_workspace.getConfiguration(configPrefix);

        if (!config.files) {
            config = FileHelper.getConfig();
        }


        let enterComponentNameDialog$ = Observable.from(
            vscode.window.showInputBox(
                { prompt: "Please enter component name in camelCase" }
            ));


        enterComponentNameDialog$
            .concatMap(val => {
                if (val.length === 0) {
                    throw new Error("Component name can not be empty!");
                }
                let componentName = changeCase.paramCase(val);
                let prefixedComponentName = `${FileHelper.getTestPrefix(configGlobals)}${componentName}`;
                let componentDir = FileHelper.createObjectDir(uri, prefixedComponentName);

                return Observable.forkJoin(
                    FileHelper.createComponent(componentDir, componentName, config.files.component, configGlobals),
                    FileHelper.createHtml(componentDir, prefixedComponentName, config.files.component.html),
                    FileHelper.createCss(componentDir, prefixedComponentName, config.files.component.css),
                    FileHelper.createComponentTest(componentDir, componentName, config.files.component.testFile, configGlobals)
                );
            }
            )
            .concatMap(result => Observable.from(result))
            .filter(path => path.length > 0)
            .first()
            .concatMap(filename => Observable.from(vscode.workspace.openTextDocument(filename)))
            .concatMap(textDocument => {
                if (!textDocument) {
                    throw new Error("Could not open file!");
                };
                return Observable.from(vscode.window.showTextDocument(textDocument));
            })
            .do(editor => {
                if (!editor) {
                    throw new Error("Could not open file!");
                };
            })
            .subscribe(
                () => vscode.window.setStatusBarMessage("Component Successfuly created!"),
                err => vscode.window.showErrorMessage(err.message)
            );
    });
    let mvpPatternDisposable = vscode.commands.registerCommand("extension.genAngular1MvpPatternFiles", async (uri) => {
        // The code you place here will be executed every time your command is executed
        let bindings: string[] = [];
        let _workspace = vscode.workspace;
        let config = <Config>_workspace.getConfiguration((configPrefix + ".config"));
        let configGlobals = <Config>_workspace.getConfiguration(configPrefix);

        if (!config.files) {
            config = FileHelper.getConfig();
        }

        let enterComponentNameDialog$ = Observable.from(
            vscode.window.showInputBox(
                { prompt: "Please enter feature name in camelCase" }
            ));

        // let bindingNameDialog$ = Observable.from(
        //     vscode.window.showInputBox(
        //         { prompt: "Please enter a binding name in camelCase. Leave empty if you have defined all bindings" }
        //     )
        // );

        // // let eventItems = showEventInputType([]);
        // bindingNameDialog$.map(response => {
        //     bindings.push(response);
        // }).subscribe();
        enterComponentNameDialog$
            .concatMap(val => {
                if (val.length === 0) {
                    throw new Error("Feature name can not be empty!");
                }

                let componentName = changeCase.paramCase(val);
                let postfixedComponentName = `${componentName}.ui`;
                let postfixedPresenter = `${componentName}.presenter`;
                let postfixedContainer = `${componentName}.container`;
                // let prefixedContainer = `${FileHelper.getTestPrefix(configGlobals)}${componentName}.container`;
                let componentDir = FileHelper.createObjectDir(uri, componentName);
                // return 


                return Observable.forkJoin(
                    FileHelper.createUiComponent(componentDir, componentName, config.files.mvpPattern, configGlobals),
                    FileHelper.createUiComponentHtml(componentDir, postfixedComponentName, config.files.mvpPattern.html),
                    FileHelper.createUiComponentCss(componentDir, postfixedComponentName, config.files.mvpPattern.css),
                    FileHelper.createComponentTest(componentDir, postfixedComponentName, config.files.mvpPattern.testFile, configGlobals),
                    FileHelper.createPresenter(componentDir, componentName, config.files.mvpPattern.presenter, configGlobals),
                    FileHelper.createComponentTest(componentDir, postfixedPresenter, config.files.mvpPattern.presenter.testFile, configGlobals),
                    FileHelper.createContainer(componentDir, componentName, config.files.mvpPattern.container, configGlobals),
                    FileHelper.createContainerHtml(componentDir, componentName, config.files.mvpPattern.container.html),
                    FileHelper.createContainerCss(componentDir, componentName, config.files.mvpPattern.container.css),
                    FileHelper.createComponentTest(componentDir, postfixedContainer, config.files.mvpPattern.container.testFile, configGlobals),
                    FileHelper.createWebapiService(componentDir, componentName, config.files.component.testFile, configGlobals),
                    FileHelper.createServiceTest(componentDir, componentName, config.files.component.testFile, configGlobals),
                    FileHelper.createConst(componentDir, componentName, config.files.mvpPattern.const, configGlobals),
                    FileHelper.createType(componentDir, componentName, config.files.mvpPattern.type, configGlobals)

                );
                // })
            })
            .concatMap(result => {
                return Observable.from(Array.prototype.concat(result, bindings))
            })
            .filter(path => path && path.length > 0)
            .first()
            .concatMap(filename => Observable.from(filename && vscode.workspace.openTextDocument(filename)))
            .concatMap(textDocument => {
                if (!textDocument) {
                    throw new Error("Could not open file!");
                };
                return Observable.from(vscode.window.showTextDocument(textDocument));
            })
            .do(editor => {
                if (!editor) {
                    throw new Error("Could not open file!");
                };
            })
            .subscribe(
                () => vscode.window.setStatusBarMessage("Feature Successfuly created!"),
                err => vscode.window.showErrorMessage(err.message)
            );
    });
    let mvpPatternCrudDisposable = vscode.commands.registerCommand("extension.genAngular1MvpPatternCrudFiles", async (uri) => {
        // The code you place here will be executed every time your command is executed
        let bindings: string[] = [];
        let _workspace = vscode.workspace;
        let config = <Config>_workspace.getConfiguration((configPrefix + ".config"));
        let configGlobals = <Config>_workspace.getConfiguration(configPrefix);

        if (!config.files) {
            config = FileHelper.getConfig();
        }

        let enterComponentNameDialog$ = Observable.from(
            vscode.window.showInputBox(
                { prompt: "Please enter feature name in camelCase" }
            ));

        // let bindingNameDialog$ = Observable.from(
        //     vscode.window.showInputBox(
        //         { prompt: "Please enter a binding name in camelCase. Leave empty if you have defined all bindings" }
        //     )
        // );

        // // let eventItems = showEventInputType([]);
        // bindingNameDialog$.map(response => {
        //     bindings.push(response);
        // }).subscribe();
        enterComponentNameDialog$
            .concatMap(val => {
                if (val.length === 0) {
                    throw new Error("Feature name can not be empty!");
                }

                const componentName = changeCase.paramCase(val);
                const postfixedComponentName = `${componentName}.ui`;
                const postfixedPresenter = `${componentName}.presenter`;
                const postfixedContainer = `${componentName}.container`;
                // const prefixedContainer = `${FileHelper.getTestPrefix(configGlobals)}${componentName}.container`;
                const componentDir = FileHelper.createObjectDir(uri, pluralize(componentName));
                const upsertComponentDir = FileHelper.createObjectDir(uri, `${changeCase.paramCase(pluralize(componentName))}\\upsert-${componentName}`);
                // return 


                return Observable.forkJoin(
                    FileHelper.createCrudUiComponent(componentDir, componentName, config.files.mvpPattern, configGlobals),
                    FileHelper.createCrudUiComponentHtml(componentDir, componentName, config.files.mvpPattern.html),
                    FileHelper.createUiComponentCss(componentDir, postfixedComponentName, config.files.mvpPattern.css),
                    FileHelper.createCrudType(componentDir, componentName, config.files.mvpPattern.type, configGlobals),
                    FileHelper.createCrudPresenter(componentDir, componentName, config.files.mvpPattern.presenter, configGlobals),
                    FileHelper.createCrudContainer(componentDir, componentName, config.files.mvpPattern.container, configGlobals),
                    FileHelper.createCrudContainerHtml(componentDir, componentName, config.files.mvpPattern.container.html),
                    FileHelper.createContainerCss(componentDir, componentName, config.files.mvpPattern.container.css),
                    FileHelper.createCrudConst(componentDir, componentName, config.files.mvpPattern.const, configGlobals),
                    FileHelper.createCrudWebapiService(componentDir, componentName, config.files.component.testFile, configGlobals),
                    
                    FileHelper.createUpsertCrudConst(upsertComponentDir, componentName, config.files.mvpPattern, configGlobals),
                    FileHelper.createUpsertCrudContainerHtml(upsertComponentDir, componentName, config.files.mvpPattern.container.html),
                    FileHelper.createUpsertCrudContainerCss(upsertComponentDir, componentName, config.files.mvpPattern.container.css),
                    FileHelper.createUpsertCrudContainer(upsertComponentDir, componentName, config.files.mvpPattern.container, configGlobals),
                    FileHelper.createUpsertCrudPresenter(upsertComponentDir, componentName, config.files.mvpPattern.presenter, configGlobals),
                    FileHelper.createUpsertCrudType(upsertComponentDir, componentName, config.files.mvpPattern.type, configGlobals),
                    FileHelper.createUpsertCrudUiComponentHtml(upsertComponentDir, componentName, config.files.mvpPattern.html),
                    FileHelper.createUpsertUiComponentCss(upsertComponentDir, postfixedComponentName, config.files.mvpPattern.css),
                    FileHelper.createUpsertCrudUiComponent(upsertComponentDir, componentName, config.files.mvpPattern, configGlobals),
                );
                // })
            })
            .concatMap(result => {
                return Observable.from(Array.prototype.concat(result, bindings))
            })
            .filter(path => path && path.length > 0)
            .first()
            .concatMap(filename => Observable.from(filename && vscode.workspace.openTextDocument(filename)))
            .concatMap(textDocument => {
                if (!textDocument) {
                    throw new Error("Could not open file!");
                };
                return Observable.from(vscode.window.showTextDocument(textDocument));
            })
            .do(editor => {
                if (!editor) {
                    throw new Error("Could not open file!");
                };
            })
            .subscribe(
                () => vscode.window.setStatusBarMessage("Feature Successfuly created!"),
                err => vscode.window.showErrorMessage(err.message)
            );
    });

    context.subscriptions.push(serviceDisposable);
    context.subscriptions.push(componentDisposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
    /**/
}
