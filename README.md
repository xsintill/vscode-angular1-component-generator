# Angular 1 File Generation Extension for VS Code

## Description
Extension lets you create the following angular files:
- `Components`
- `Directives`
- `Services`
- `Tests`
- `Config routes`

Command "New component" creates the following files: 
- [path]/[component name]/`component-name.component.ts`
- [path]/[component name]/`component-name.template.html`
- [path]/[component name]/`component-name.css`
- [path]/[component name]/`component-name.test.ts`  
or if not configured alongside
- [test folder]/[path]/[component name]/`component-name.test.ts` 


Command "New service" creates the following file:
- [path]/`service-name.service.ts`
- [path]/`service-name.test.ts`  
or if not configured alongside
- [test folder]/[path]/`service-name.test.ts` 

Command "New directive" creates the following file:
- [path]/`directive-name.directive.ts`

Command "New test" creates the following file:
- [test folder]/[path]/`test-name.test.ts`

Command "New config route" creates the following file:
- [path]/`config-route-name.config.route.ts`


## Usage

- Right click on the file or folder in the explorer
- Select "New Component", "New service", "New test", "New directive" or "New config route" 
- Enter namespace name in the pop up in camelCase
- Enter the name for the component, service, test, directive or config route in the pop up in camelCase 


![Use Extension](assets/tutorial/createComponent.gif)

## Configuration
- create true / false - (controls whether to generate this file)
- extension - extension of generated file (e.g. you might want to change "scss" to just plain "css")
- template - path to the custom template for the generated file
- testFile - configuration object with the following properties
    - create - true / false - (controls whether to generate the test file belonging to the general file type configuration it is placed under)
    - alongSide - true / false - determines whether to place the testfile in same directory as the file the tesfile will test or put the testfile in a special test dir

Use the "template" key to override default templates for the extension

```json
{
     "files": {
        "filter": {
            "create": true,
            "extension": "ts",
            "testFile": {
                "create": true,
                "extension": "ts",
                "alongSide": false
            }
        },
        "directive": {
            "create": true,
            "extension": "ts",
            "testFile": {
                "create": true,
                "extension": "ts",
                "alongSide": false
            }
        },
        "configRoute": {
            "create": true,
            "extension": "ts",
            "testFile": {
                "create": false,
                "extension": "ts",
                "alongSide": false
            }
        },
        "controller": {
            "create": true,
            "extension": "ts",
            "testFile": {
                "create": true,
                "extension": "ts",
                "alongSide": false
            }
        },
        "service": {
            "create": true,
            "extension": "ts",
            "testFile": {
                "create": true,
                "extension": "ts",
                "alongSide": false
            }
        },
        "component": {
            "create": true,
            "extension": "ts",
            "testFile": {
                "create": true,
                "extension": "ts",
                "alongSide": false
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
        },
        "module": {
            "create": true,
            "extension": "ts"
        }
    },
    "globals": {
        "applicationName": "",
        "prefix": "",
        "sharedConstant": "",
        "srcConstant": "",
        "test": {
            "path": ""
        }
    }
}
```
![Config Extension](assets/tutorial/customTemplate.gif)

## Bugs

Please report [here](https://github.com/xsintill/vscode-angular1-component-generator/issues)