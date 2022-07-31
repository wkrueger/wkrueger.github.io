# Personal blog

## Dev server and builds

**Dev preview:**

After having some content, run next.js at the `website` folder.

```
cd website
yarn dev
```

**Github pages**

  - The github action (at `.github folder`) generates a static website, copies it to the `/docs` folder and commits; It only runs at master branch (if your repo has `main` as the root branch, adjust it accordingly); Unfortunalely GH pages requires us to commit the output, so your repo has to get dirty;
  - `/website/build.sh` does the same thing manually;
  - You may use different branches to write draft articles. They will not get built.
  - Github pages does not have preview builds;



## Current post structure

- Posts go into the `md` folder;
- Folder names must follow the `YYYY-MM-slug` convention (currently no day! you may tweak that tough);
- The first `.md` file inside the folder is taken. (I don't expect more than one.);
- The first title tag (`#` only) is taken as article title; (Currently no front matter);

## Images

- You can link images inside the same folder. Images in other folders are not expected to work;
- Obsidian: You can CTRL+V images directly inside the article, then move the created image to the correct folder;
- External images should work fine with the proper full path (`http://...`);
- Linking images from other folders with `images/slug/image.jpg` might work at the final build, but maybe not at the dev server;

## Extra resources as of 08/2022

 - Links written with [[wikilink syntax]] (or \[\[link | label\]\]) will be linked with similar post titles (unless they are absolute http links);