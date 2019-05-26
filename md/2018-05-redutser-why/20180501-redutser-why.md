# why redutser

I've looked onto what's around, tough it seems quite hard to find (there might be things that google hides from me on the 15th page, or with a query I havent tought of...).

Examples:

- https://github.com/cartant/ts-action
- https://github.com/palantir/redoodle
- https://github.com/piotrwitek/typesafe-actions

With most of them seem to focus on writing action creators: you'll still be writing reducers the "classic" way: write the action creator on one file, manually write a reducer in another file with a switch-casey function. The closest thing I've found is a "reducerBuilder" from ts-action. Their scope is usually bigger too, some enter the realm of side-effects/async utils/etc.

`redutser` follows a quite different (opinionated?) structure: you write the reducer in one single place, and let everything be born from it. The action creators are just byproducts of the reducer. The reducer is written as an object since that allows to leverage inference from mapped types and such.

The motivation: when you dispatch a (plain) action, in the end you are just writing a function in a different way (this has its reasons to be -- middleware, inspecting, detaching the store for testing...). But why the hell am I breaking the arguments into one file and the implementation into another? Context switching love? (one of the original reasons might be: untyped language) So I strived to sew them back together into the same place again.

In case you need aditional reducer functionality not covered by the "object reducer", you can still easily compose it (and its types) into another reducer function, since its "just a reducer".
