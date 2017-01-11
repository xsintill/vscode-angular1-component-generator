# Angular 1 File Generation Extension for VS CODE

## Description
Extension let's you create the following angular files:
- `Components`
- `Directives`
- `Services`
- `Tests`

Command "Create component" creates the following files: 
- <span style="color: lightblue">[path]/[component name]/</span>`component-name.component.ts`
- <span style="color: lightblue">[path]/[component name]/</span>`component-name.template.html`
- <span style="color: lightblue">[path]/[component name]/</span>`component-name.css`
- <span style="color: lightblue">[test folder]/[path]/[component name]/</span>`component-name.test.ts`

Command "Create service" creates the following file:
- <span style="color: lightblue">[path]/</span>`service-name.service.ts`

Command "Create directive" creates the following file:
- <span style="color: lightblue">[path]/</span>`directive-name.directive.ts`

## Usage

- Right click on the file or folder in the explorer
- Select "Create Component", "Create service" or "Create directive" 
- Enter namespace name in the pop up in camelCase
- Enter the name for the component, service or directive in the pop up in camelCase 


![Use Extension](assets/tutorial/createComponent.gif)

## Configuration
- create true / false - (controls whether to generate this file or not)
- extension - extension of generated file (e.g. you might want to change "scss" to just plain "css")
- template - path to the custom template for the generated file

Use the "template" key to override default templates for the extension

```json
{
    "files": {
          "filter": {
            "create": true,
            "extension": "ts"
        },
        "directive": {
            "create": true,
            "extension": "ts"
        },
        "directiveTestFile": {
            "create": true,
            "extension": "ts"
        },
        "configRoute": {
            "create": true,
            "extension": "ts"
        },
        "controller": {
            "create": true,
            "extension": "ts"
        },
        "service": {
            "create": true,
            "extension": "ts"
        },
        "serviceTestFile": {
            "create": true,
            "extension": "ts"
        },
        "component": {
            "create": true,
            "extension": "ts"
        },
        "componentTestFile": {
            "create": true,
            "extension": "ts"
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