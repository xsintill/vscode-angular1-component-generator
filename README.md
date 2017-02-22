# Angular 1 File Generation Extension for VS Code

## Description
Extension lets you create the following angular files:
- `Components`
- `Directives`
- `Services`
- `Tests`

Command "New component" creates the following files: 
- [path]/[component name]/`component-name.component.ts`
- [path]/[component name]/`component-name.template.html`
- [path]/[component name]/`component-name.css`
- [test folder]/[path]/[component name]/`component-name.test.ts`

Command "New service" creates the following file:
- [path]/`service-name.service.ts`

Command "New directive" creates the following file:
- [path]/`directive-name.directive.ts`

Command "New test" creates the following file:
- [test folder]/[path]/`test-name.test.ts`

## Usage

- Right click on the file or folder in the explorer
- Select "New Component", "New service", "New test" or "New directive" 
- Enter namespace name in the pop up in camelCase
- Enter the name for the component, service, test or directive in the pop up in camelCase 


![Use Extension](assets/tutorial/createComponent.gif)

## Configuration
- create true / false - (controls whether to generate this file)
- extension - extension of generated file (e.g. you might want to change "scss" to just plain "css")
- template - path to the custom template for the generated file
- testFile - configuration object with the following properties
    - create - true / false - (controls whether to generate the test file belonging to the general file type configuration it is placed under)

Use the "template" key to override default templates for the extension

```json
{
    "files": {
        "filter": {
            "create": true,
            "extension": "ts",
            "testFile": {
                "create": true,
                "extension": ".test"
            }
        },
        "directive": {
            "create": true,
            "extension": "ts",
            "testFile": {
                "create": true,
                "extension": ".test"
            }
        },        
        "configRoute": {
            "create": true,
            "extension": "ts",
            "testFile": {
                "create": true,
                "extension": ".test"
            }
        },
        "controller": {
            "create": true,
            "extension": "ts",
            "testFile": {
                "create": true,
                "extension": ".test"
            }
        },
        "service": {
            "create": true,
            "extension": "ts",
            "testFile": {
                "create": true,
                "extension": ".test"
            }
        },
        "component": {
            "create": true,
            "extension": "ts",            
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
            },
            "testFile": {
                "create": true,
                "extension": ".test"
            }
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