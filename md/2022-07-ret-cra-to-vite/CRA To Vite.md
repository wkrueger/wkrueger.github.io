# Post-review: Migrating CRA to Vite

## Previous state

Create-react-app application takes around 3 minutes to build, requiring around 3GB of RAM.

## Why Vite

 - We wanted a quick frictionless migration (so picking a framework like Next is out of scope);
 - We wanted to avoid low level tools. We want something well-mantained with a good preset out of the box;
 - It looks like Vite achieved these goals, other similar tooling might have too;

## Migration tweaks

This might change a bit depending on what kind of stuff you have in your project. Here's what we had:

### Initial setup

- Vite's docs doesn't have any article about "migrating from an existing project"; So I have launched a starter project and copied the following files:
	- `vite.config.ts`
	- `tsconfig.json` (adapt accordingly)
	- `tsconfig.node.json`
- Review the `package.json` and remove anything related to Create React App, Babel or Webpack. For instance:
	- `react-scripts`
- Also replace the package.json's scripts accordingly. Ex:
```
    "vite": "vite",
    "start": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest --run",
    "test:watch": "vitest",
```
- Add Vite (`yarn add vite`). Update TS to the latest version since you don't have CRA locking you to an ancient version anymore;

## React plugin

Ont of the first things to add is the React plugin in the Vite Config. (`@vitejs/plugin/react`)

```ts
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, parse } from 'path';
import * as fs from 'fs';
import svgr from 'vite-plugin-svgr';

const rootPaths = fs.readdirSync('src').reduce((out, item) => {
  const parsed = parse(item);
  return { ...out, [parsed.name]: resolve('src', item) };
}, {});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svgr(), react()],
  resolve: {
    alias: rootPaths,
  },
  envPrefix: 'REACT_APP',
  test: {
    globals: true,
    environment: 'happy-dom',
  },
});
```

## Path mapping

In CRA, folders at the source root can be acessed as absolute paths. 
- I.e. `/src/ListComponent/Somefile.ts` can be imported as
- `import Somefile from 'ListComponent/Somefile'`
This special handling doesn't exist on Vite. I have manually stitched this mapping on vite config's `path.alias` setting.

## SVG Imports

Create React App embeds the "SVGR" library. If you use any import like...

```tsx
import { ReactComponent as MySvg } from './file.svg'
```

...then this won't work anymore.

A frictionless fix was to add the `vite-plugin-svgr` shown above (found in a Stack Overflow reply).

> Vite is based on Rollup, and SVGR provides its own Rollup plugin, `@svgr/rollup`. Unfortunately this seemed not to work properly here because Vite already embeds a static file URL plugin, which takes higher precedence. Even following the provided steps to use it alongside the URL plugin didn't work well.

## Environment variables

Vite doesnt read environment variables from `process.env`, but rather from `import.meta.env`; Also, the `NODE_ENV` variable is found on the `import.meta.env.mode`, which is set according to the build tool used (vite dev server, vite build or vitest);

Some bad taste environmental variables like `BROWSER=none` or `PORT` won't be needed anymore (Vite's server accepts a `--port` argument like 99% of other software in the world).

The default environment variable _safe prefix_ is `VITE_APP` instead of `REACT_APP`. This can be changed on the `envPrefix` setting (as shown above), as to avoid some refactoring.

## Type defs

If you previously depended on strictly typed `process.env`, you may need to move those types to the corresponding global interfaces `ImportMetaEnv` and `ImportMeta`, as shown on the [environment variable docs.](https://vitejs.dev/guide/env-and-mode.html#env-files);

On react.app-env.d.ts, replace:
```diff
- /// <reference types="react-scripts" />
+ /// <reference types="vite/client" />
```

## Other static asset imports

Importing non-public static assets (like images) generates an unique URL; If you need to dynamically import static assets, this may be done with the following trick, as shown on the [static asset docs](https://vitejs.dev/guide/assets.html#new-url-url-import-meta-url).
```tsx
function getImageUrl(name) {
	return new URL(`./dir/${name}.png`, import.meta.url).href
}
```

## The index.html

The `index.html` now lives in the root folder. It also requires a new script tag on its body, pointing to the project root:

```html
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.tsx"></script>    
  </body>
```

Also, any `%PUBLIC_URL%` tags must be removed.
```html
<link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
```

## Refactor sync require()'s

On webpack you could still get away with writing a synchronous CommonJS `require()` anywhere. On Vite this simply won't work out (unless maybe with a plugin);

## Default build folder

The default build folder on Vite is `dist` instead of `build`. This can be tweaked with `build.outDir`.

## Testing

The quickest way around testing is probably swithing to _Vitest_, as the Jest test runner kinda relies on Babel/Webpack;

We still kept Jest on the project, we're just not using its **test runner** anymore. Other parts of Jest like assertions or mocks are still there.

_Vitest_ reads from the same config file (`vite.config.ts`). You need to add its type directive for TS not to complain:

```ts
/// <reference types="vitest" />
```

As shown before, we needed a couple extra settings on the "test" key.
```
  test: {
    globals: true,
    environment: 'happy-dom',
  },
```

- **globals** adds the mocha-like globals (`describe`, `test`, etc) to the context;
- **environment** allows you to enable JSDOM or other;
- When you set an environment, the CLI will suggest you to separately install it.


## Eslint

Many ESLint plugins that were previously bundled with CRA had to be manually installed and added.
 - @typescript-eslint/eslint-plugin
 - @typescript-eslint/parser
 - eslint-plugin-jsx-a11y
 - eslint-plugin-react
 - eslint-plugin-react-hooks

We ended up with something like this on the  `eslint.config`:

```json
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": [
    "@typescript-eslint",
    "react-hooks",
    "jsx-a11y"
  ],
  "extends": [
    "plugin:react/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
  ],
  "settings": {
    "react": {
      "version": "17.0"
    }
  }
}
```

## Build and development

The Vite Dev server does not automatically include TS checking. It suggests you to run `tsc` on the build task (`tsc && vite build`). The tsconfig is alreaddy suggested with a `noEmit`.

While you may probably add `tsc` through a plugin, in the end I think it is better not to, since VSCode already runs its own TS Server, and running it on the development mode creates a duplicate TS Server.

In case you'd like to check errors project-wide:
  - you may still run `tsc -w`
  - or use a VS Code Task: F1 > Run Build Task > tsc - watch

Since type checking and building are now separate tasks, you may run them on _parallel_ on the CI.

## Performance feelings

Build time went to around 25 seconds down from 3 min (could be lower if I hadn't disabled SMT on my processor); While Webpack uses only a single core during most of the build, Vite displays some average activity on all cores.

Peak memory usage went to 1,2GB, down from ~3GB.

- The development server starts right away, since it actually didn't compile anything. Pages are compiled as you load them (similar to what happens on Next.js). The development mode may not feel THAT fast on a first page load, since every single file is served individually. If you look at the requests pane, you can see an enormous number of files being served;
- Nonetheless, it is orders faster than Webpacks 3-minute build-of-everything;
- Only the files required by a specific page are compiled and served;
- This also means that when performing HMR, only the changed files are re-served. HMR feels more responsive;
- This may also mean that once the first load is done, the browser may leverage caching of individual files on its side;
- On the production mode, the files are bundled more like it happens on other traditional tools. The differences are explained right on the [first page of the docs](https://vitejs.dev/guide/why.html).
