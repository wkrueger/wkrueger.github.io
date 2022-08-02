# Integrating APIs to a TypeScript frontend with OpenAPI/Swagger

[[Tag: Typescript]]

Http-served REST and HTTP + JSON has became popular with great human readability, we can fairly easily call remote functions with a `curl` line on console.

While it is great to have an highly readable exchange format, I also strongly lean to the opinion that calling an API through HTTP should ideally feel as integrated as calling a function from an imported library.

If you use web frameworks like Django, Rails, Spring or Nest.js you can easily produce OpenAPI definitions through your application code, since those gather information enough to collect not just which routes are exposed, but also which data types they use to communicate. OpenAPI serves as a solid exchange format to help API metadata traverse between different languages.

# Objectives

Given some REST API and its OpenAPI definition, I'd like to invoke this API's methods from my TypeScript front-end codebase in a type-safe way, just as functions, abstracting away details from the (http) protocol.

We will be using [SendGrid's REST API](https://github.com/sendgrid/sendgrid-oai) as an example here. The link includes an OpenAPI representation as both json or yaml. While they have a custom render for this API on their website, you could also paste the .yaml into the [swagger editor](https://editor.swagger.io/).

Let's take as a sample a random method:


![sendgrids input](https://thepracticaldev.s3.amazonaws.com/i/qkwu0tm5z1rqqyg8snp5.PNG)

![sendgrids output](https://thepracticaldev.s3.amazonaws.com/i/krjuilnvqq3jw1kmey44.PNG)

OpenAPI includes a decent handful of information about that API, such as:

  - Which methods are available;
  - Which input parematers they take;
  - What is the data type of its response;
  - Documentation comments;

I'd like to call this interface on my code as simply as

```ts
const updatedAlert = await updateAlert({
  alert_id: 123,
  data: { email_to: "example@example.com" },
  "on-behalf-of": "someuser"
})
```

The way the API definition maps to code may vary according to the tool we use for the integration. Nonetheless I'd like to point out a couple of features I desire for this API call:

  - It should abstract out the protocol; An HTTP call has parameters split between path, query, headers and body parameters. That body can be JSON or URL-encoded. And we also have a verb. On the other hand, when writing code, our tools are just function names and input parameters. How each parameter is sent over HTTP is not part of the API intent, but mostly a protocol detail;
  - It should bring types along. Which means:
    - The function parameters are validated with typescript. The response `updatedAlert` has a defined type without the need of extra type annotations. All of this embeds editor completions, hints and even documentation on tooltips.
  - The funcion names are predictable and dictated by the API authors.

# Making it happen

Since type information is static, it is quite hard to escape having a code generation step. Most of the drawbacks of integrating API's this way come from the need to use code generation.

  - A chosen code generation tool will populate a folder with generated code. That code is locked in place, static. If that code doesn't fit you, you will probably need to edit the template and/or the logic from the tool, or choose another tool;

  - The generated code style may vary wildly depending on the template authors' tastes;
  
  - A good code generator can make things a bit more flexible by providing extension points, either on the code generation process or on the generated code;

Now it doesn't seem that using OpenAPI generated code is a fairly common practice, as most code generators found on google are not really popular. Some alternatives I researched are:

  - [OpenAPI client](https://github.com/mikestead/openapi-client) seems quite decent with good extensibility; Best impressions from the time I wrote this article.
  - [OpenAPI generator](https://github.com/OpenAPITools/openapi-generator) is the oficial one with templates for multiple languages and setups; I'm personally not a fan since the templates are usually verbose non-extensible boilerplates;
  - [sw2dts](https://github.com/mstssk/sw2dts) is focused on generating just the type definitions. Seems quite mature;

I'll be using my own-rolled [swagger-ts-template](https://github.com/wkrueger/swagger-ts-template.git) for this sample, but you could try any other. This lib's code generator is invoked through a javascript API, here it is a sample.

```ts
// put this on your scripts folder
// invoke directly with node or add to package.json > scripts
const generator = require('@proerd/swagger-ts-template')
const fetch = require('node-fetch')

async function run() {
  const apiDef = await fetch('https://some.api/swagger.json').then(r => r.json())
  await generator.genPaths(apiDef, { output: "../src/common/api/swagger" })
  console.log('okay')
}
run()
```

It generates code on a defined folder, using the following structure: ([you can also see a sample on the github repo](https://github.com/wkrueger/swagger-ts-template/tree/master/samples))

```
|__ modules
| |__ TagOne.ts       -- API methods are split by tag
| |__ TagTwo.ts
|__ api-common.ts     -- runtime for processing and extending the calls
|__ api-types.ts      -- all types present in "declarations" key
```

Below an example of the generated code:

```ts
export type GET_contactdb_lists_list_id_recipients_Type = {
  list_id: number
  "on-behalf-of"?: string
  page?: number
  page_size?: number
}
export type GET_contactdb_lists_list_id_recipients_Response = {
  recipients?: Types.contactdb_recipient[]
}
/**
 * GET /contactdb/lists/{list_id}/recipients
 *
 * **This endpoint allows you to retrieve all recipients on the list with the given ID.**
 *
 * The Contacts API helps you manage your [Marketing Campaigns](https://sendgrid.com/docs/User_Guide/Marketing_Campaigns/index.html) recipients.
 **/
export const GET_contactdb_lists_list_id_recipients = ApiCommon.requestMaker<
  GET_contactdb_lists_list_id_recipients_Type,
  GET_contactdb_lists_list_id_recipients_Response
>({
  id: "GET_contactdb_lists_list_id_recipients",
  path: "/contactdb/lists/{list_id}/recipients",
  verb: "GET",
  parameters: [
    { name: "list_id", required: true, in: "query" },
    { name: "on-behalf-of", in: "header" },
    { name: "page", required: false, in: "query" },
    { name: "page_size", required: false, in: "query" }
  ]
})
```

# Wiring up the request

The boilerplate tries to impose not much opinion on how you should perform the requests. You need to write the "protocol bridge"  yourself.

```
  operation metadata
  request parameters     -->  Request Handler  -->  APIResponse
  extra custom parameters                           Custom added data
```

Here's a sample using `fetch` and assuming all requests work with JSON:

```ts
import { SwaggerRequester, IRequest, IOperation, settings } from "./swagger/api-common";
import { authToken_Response } from "./swagger/modules/Auth";

const BACKEND_URL = process.env.BACKEND_URL!;

class RestRequester extends SwaggerRequester {
  getCurrentToken(): authToken_Response {
    const stored = localStorage.get("auth_info") || "{}";
    return JSON.parse(stored);
  }

  async handler(
    request: IRequest & GApiCommon.MergeToRequest,
    input: Record<string, any>,
    operation: IOperation
  ) {
    const url = new URL(BACKEND_URL);
    const params = request.query || {};
    Object.keys(params).forEach(key =>
      url.searchParams.append(key, params[key])
    );
    const token = this.getCurrentToken().access;
    const body = ["GET", "DELETE"].includes(request.verb!)
      ? undefined
      : JSON.stringify(request.body);
    const fetchResp = await fetch(url.toString(), {
      method: request.verb,
      body,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : (undefined as any)
      }
    });
    if (fetchResp.status === 204) return {};
    return fetchResp.json();
  }
}

const requester = new RestRequester()
settings.getRequester = () => requester
```

# Goodies

  - Function names are indexed by `operationId`. Typing the `operationId` in the editor kicks in the auto-import completion.

![Alt Text](https://thepracticaldev.s3.amazonaws.com/i/1edfrr8xyeo13o4dwhng.jpg)

  - Input parameters are autocompleted and type-checked;

![Alt Text](https://thepracticaldev.s3.amazonaws.com/i/99324stqtwbvb7jzfxfc.jpg)

  - The response type is type-checked

![Alt Text](https://thepracticaldev.s3.amazonaws.com/i/33z9rimeug0mm1it6swm.jpg)

# Customizing request and response input

This boilerplate includes global empty interfaces `MergeToRequest` and `MergeToResponse` which can be extended through typescript's _interface augmenting_ in order to provide a bit of extra flexibility for edge cases or custom handling.

```ts
declare global {
  namespace GApiCommon {
    interface MergeToRequest {
      _allowCache?: boolean
      _forceBody?: Record<string, any>
    }

    interface MergeToResponse {
      timeToFetch: number
    }
  }
}
```

  - `MergeToRequest` is merged into every request arguments type;
  - `MergeToResponse` is merged into every response type.

# Customizing the code generation

The code generation step has a couple of options which may be useful to provide a bit more flexibility on the usage of the template. You usually won't need to tweak tweak here. Special mention to `mapOperation`, which may be used to tweak the `swagger.json` input for things like changing the `operationId`s.

```ts
type genPathsOpts = {
  output: string
  moduleStyle: "commonjs" | "esm"
  failOnMissingOperationId?: boolean
  typesOpts?: genTypesOpts
  mapOperation?: (operation: Operation) => Operation
  templateString?: string
  prettierOpts?: prettier.Options
}

export interface genTypesOpts {
  external?: any
  hideComments?: boolean
  mapVariableName?: (s: string) => string
  prettierOpts?: prettier.Options
}
```

# Pros and cons

**Pros**

  - Call API's in a type-safe way, like if they were a part of the current codebase;
  - Integrate with code completion, auto imports and tooltip docs;
  - Reuse already existing data types from the back-end;
  - Propagate API changes to the front-end codebase, possibly catching errors just by updating the response types;

**Cons**
  - Must use a code generation step;
  - Your backend's swagger generation may be not very accurate sometimes, which would require
some `any` casts or fallback to more manual methods;
  - Some VERY creative API designs may not integrate well.

# Conclusion

This was a quick sample on how to get better integration between an API and the web frontend. It has been serving me great for some years now. I hope you did enjoy!