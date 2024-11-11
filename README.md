## DataviewJS API Awareness in VS Code

Example scripts folder setup to enable IntelliSense in VS Code for the DataviewJS API.

I had been trying to understand how I can make dataviewjs script easier to write. Eventually, I found some help on the Obsidian Discord from user GottZ ([Website](https://contact.gottz.de), [GitHub](https://github.com/GottZ)).

### Setup Instructions

Create a folder in your vault for your obsidian views, and add a file into it, called "globals.d.ts" with this content:

```js
import { DataviewInlineApi } from "./.definitions/dataview/api/inline-api";
import type { App } from "./.definitions/obsidian";

declare global {
    const dv: DataviewInlineApi;
    //const app: App;
}
```
you then just have to add a sub folder called .definitions, and drop the corresponding annotations into it.

The Obsidian API type declarations:
https://github.com/obsidianmd/obsidian-api/blob/master/obsidian.d.ts
goes into views/.definitions/obsidian/index.d.ts

Dataview API type declarations:
and for https://github.com/blacksmithgu/obsidian-dataview
you essentially have to generate it with `tsc`.

look at edit.bat, to see how I open it in vsc. 
essentially, I just open the vault directory as it seems.

you have to keep globals.d.ts open in vscode for it to work

slight change, if you add
```js
/// <reference path="../globals.d.ts" />
```

as first line into your views, you can just import the definitions ez.


### Generate Dataview Type Declarations

You could take type declarations from [this repo](.definitions\dataview), but if you want to generate the most up-to-date ones yourself, read on.

After you have the Dataview project source code (i.e., you've cloned the repo)

Apply these instructions ([Creating .d.ts Files from .js files.](https://www.typescriptlang.org/docs/handbook/declaration-files/dts-from-js.html)) to your copy of the project: 
> 
> - Add TypeScript to your dev dependencies (this will probably already be applied)
> - Add a tsconfig.json to configure TypeScript
> - Run the TypeScript compiler to generate the corresponding d.ts files for JS files
> - (optional) Edit your package.json to reference the types



#### Add TypeScript to your dev dependencies
`npm install typescript --save-dev`

#### Add a tsconfig.json to configure TypeScript

The TSConfig is a jsonc file which configures both your compiler flags, and declare where to find files. In this case, you will want a file like the following:

```json
{
  // Change this to match your project
  "include": ["src/**/*"],
  "compilerOptions": {
    // Tells TypeScript to read JS files, as
    // normally they are ignored as source files
    "allowJs": true,
    // Generate d.ts files
    "declaration": true,
    // This compiler run should
    // only output d.ts files
    "emitDeclarationOnly": true,
    // Types should go into this directory.
    // Removing this would place the .d.ts files
    // next to the .js files
    "outDir": "dist",
    // go to js file when using IDE functions like
    // "Go to Definition" in VSCode
    "declarationMap": true
  }
}
```
#### Run the TypeScript compiler to generate the corresponding d.ts files for JS files

`npx tsc`





