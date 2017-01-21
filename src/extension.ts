import { ObservableInput } from "rxjs/Observable";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as changeCase from "change-case";
import { Observable } from "rxjs";

import { FileHelper } from "./FileHelper";
import { Config } from "./config.interface";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    let configPrefix: string = "ng1FilesGenerator";
    let serviceDisposable = vscode.commands.registerCommand("extension.genAngular1ServiceFiles", (uri) => {
        let _workspace = vscode.workspace;
        let config = <Config>_workspace.getConfiguration((configPrefix + ".config"));        
        let configGlobals =  <Config>_workspace.getConfiguration(configPrefix);

        if (!config.files) {
            config = FileHelper.getConfig();
        }

        vscode.window.showInputBox({prompt: "Please enter name for the namespace."}).then(
            (namspaceValue: string) => {                
                if (namspaceValue.length === 0) {
                    throw new Error("namespace name can not be empty!");
                }

                //Display a namespace dialog to the user
                let enterNamespaceNameDialog$ = Observable.from(vscode.window.showInputBox({prompt: "Please enter name for the service."})); 
                enterNamespaceNameDialog$            
                    .concatMap( serviceNameValue => {                
                        if (serviceNameValue.length === 0) {
                            throw new Error("Service name can not be empty!");
                        }

                        let namespaceName = changeCase.paramCase(namspaceValue);
                        let serviceName = changeCase.paramCase(serviceNameValue);
                        let serviceDir = FileHelper.resolveWorkspaceRoot(FileHelper.getContextMenuDir(uri));
                        return Observable.forkJoin(
                            FileHelper.createService(serviceDir, namespaceName, serviceName, config.files.service),
                            FileHelper.createServiceTest(serviceDir, namespaceName, serviceName, config.files.serviceTestFile, configGlobals)
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
    });
    let directiveDisposable = vscode.commands.registerCommand("extension.genAngular1DirectiveFiles", (uri) => {
        let _workspace = vscode.workspace;
        let config = <Config>_workspace.getConfiguration((configPrefix + ".config"));

        if (!config.files) {
            config = FileHelper.getConfig();
        }

        vscode.window.showInputBox({prompt: "Please enter name for the namespace."}).then(
            (namspaceValue: string) => {                
                if (namspaceValue.length === 0) {
                    throw new Error("namespace name can not be empty!");
                }

                //Display a namespace dialog to the user
                let enterNamespaceNameDialog$ = Observable.from(vscode.window.showInputBox({prompt: "Please enter name for the directive."})); 
                enterNamespaceNameDialog$            
                    .concatMap( directiveNameValue => {                
                        if (directiveNameValue.length === 0) {
                            throw new Error("Directive name can not be empty!");
                        }

                        let namespaceName = changeCase.paramCase(namspaceValue);
                        let directiveName = changeCase.paramCase(directiveNameValue);
                        let contextMenuDir = FileHelper.resolveWorkspaceRoot(FileHelper.getContextMenuDir(uri));
                        return Observable.forkJoin(
                            FileHelper.createDirective(contextMenuDir, namespaceName, directiveName, config.files.directive)                      
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
    });

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let componentDisposable = vscode.commands.registerCommand("extension.genAngular1ComponentFiles", (uri) => {
        // The code you place here will be executed every time your command is executed

        let _workspace = vscode.workspace;
        let config = <Config>_workspace.getConfiguration((configPrefix + ".config"));
        let configGlobals =  <Config>_workspace.getConfiguration(configPrefix);

        if (!config.files) {
            config = FileHelper.getConfig();
        }

        vscode.window.showInputBox({prompt: "Please enter name for the namespace."}).then(
            (namspaceValue: string) => {                
                if (namspaceValue.length === 0) {
                    throw new Error("namespace name can not be empty!");
                }

                let enterComponentNameDialog$ = Observable.from(
                    vscode.window.showInputBox(
                        {prompt: "Please enter component name in camelCase"}
                    ));
                    

                enterComponentNameDialog$
                    .concatMap( val => {
                            if (val.length === 0) {
                                throw new Error("Component name can not be empty!");
                            }
                            let componentName = changeCase.paramCase(val);
                            let prefixedComponentName =  `${FileHelper.getTestPrefix(configGlobals)}${componentName}`;
                            let componentDir = FileHelper.createObjectDir(uri, prefixedComponentName);                            
                            let namespaceName = changeCase.paramCase(namspaceValue);

                            return Observable.forkJoin(
                                FileHelper.createComponent(componentDir, namespaceName, componentName, config.files.component, configGlobals),
                                FileHelper.createHtml(componentDir, prefixedComponentName, config.files.html),
                                FileHelper.createCss(componentDir, prefixedComponentName, config.files.css),
                                FileHelper.createComponentTest(componentDir, namespaceName, componentName, config.files.componentTestFile, configGlobals)
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

        // Display a dialog to the user

    });

    context.subscriptions.push(serviceDisposable);
    context.subscriptions.push(componentDisposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
    /**/
}
