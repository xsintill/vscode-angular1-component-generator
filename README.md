# Angular 1 File Generation Extension for VS CODE

## Description
Extension let's you create the following angular files:
- `Components`
- `Directives`
- `Filters`
- `Controllers`
- `Services`
- `Config Route (angular-ui-router state configuration)`
- `Tests`

Extension automatically creates folder for angular1 component containing : 
- `component.ts`
- `module.ts`
- `component.html`
- `component.css`

## Usage

- Right click on the file or folder in the explorer
- Select "Create Component"
- Enter component name in the pop up in camelCase 

![Use Extension](assets/tutorial/createComponent.gif)

## Configuration
- create true / false - (controls whether to generate this file or not)
- extension - extension of generated file (e.g. you might want to change "scss" to just plain "css")
- template - path to the custom template for the generated file
    - {selector}    -> replaced with `lower case, dash separated string`
    - {templateUrl} -> replaced with `${selector}.component.html`
    - {styleUrls}   -> replaced with `${selector}.component.css`
    - {className}   -> replaced with `componentName in PascalCase`

Use the "template" key to override default templates for the extension

```json
{
    "files": {
        "component": {
            "create": true,
            "extension": "ts",
            "template": "${workspaceRoot}/myComponent.template"
        },
        "directive": {
            "create": true,
            "extension": "ts",
            "template": "${workspaceRoot}/myDirective.template"
        },
        "service": {
            "create": true,
            "extension": "ts",
            "template": "${workspaceRoot}/myService.template"
        },
        "filter": {
            "create": true,
            "extension": "ts",
            "template": "${workspaceRoot}/myFilter.template"
        },
        "configRoute": {
            "create": true,
            "extension": "ts",
            "template": "${workspaceRoot}/myConfigRoute.template"
        },
        "component": {
            "create": true,
            "extension": "ts",
            "template": "${workspaceRoot}/myComponent.template"
        },
        "css": {
            "create": true,
            "extension": "scss"
        },
        "html": {
            "create": true,
            "extension": "html"
        },
        "module": {
            "create": true,
            "extension": "ts"
        }
    }
}
```
![Config Extension](assets/tutorial/customTemplate.gif)

## Bugs

Please report [here](https://github.com/xsintill/vscode-angular1-component-generator/issues)