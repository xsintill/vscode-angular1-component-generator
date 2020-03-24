xcopy /s /Y . %USERPROFILE%\.vscode\extensions\angular-file-generator\ /EXCLUDE:exclude.txt
xcopy /s /Y . %USERPROFILE%\.vscode-insiders\extensions\angular-file-generator\ /EXCLUDE:exclude.txt
cd %USERPROFILE%\.vscode\extensions\angular-file-generator\
npm install
tsc -p ./
cd %USERPROFILE%\.vscode-insiders\extensions\angular-file-generator\
npm install
tsc -p ./

