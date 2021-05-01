# Simplematcomponents

Simplematcomponents is a set of Angular (6+) components that fit into or use Angular Material Design.

Each component has it's own npm package. There are (currently) no ties or shared files between the components.

## Projects

Currently, there are two projects:

- [Simplemattable](https://www.npmjs.com/package/simplemattable) [![npm version](https://badge.fury.io/js/simplemattable.svg)](https://badge.fury.io/js/simplemattable): 
A simplified, declarative table-library using @angular/material's MatTable with form capabilities for adding/editing/deleting data
- [Simpelalert](https://www.npmjs.com/package/simplealert) [![npm version](https://badge.fury.io/js/simplealert.svg)](https://badge.fury.io/js/simplealert): 
simple Angular component for info, error, danger and success alerts.


You can contribute to both using this repository.

## Demo

To see the components in action, visit the [demo application site](https://smc-demo.simplex24.de/).
 
Alternatively, you can alway install the demo application locally:
- check out this repository
- install the dependencies using `npm install` while being in the project root
- build simplealert and simplemattable using `ng build simplealert` and `ng build simplemattable`.
- start the demo application using `ng serve`.

## Simplemattable

The sourcecode of simplemattable can be found in `/projects/simplemattable`.

For information on how to use simplemattable, visit [the NPM package](https://www.npmjs.com/package/simplemattable).

If you want to build simplemattable, use `ng build --prod simplemattable`.

The build should trigger a refresh of the demo application (if currently running). 
You need to build simplemattable before you can use it in the demo.

The results of `ng build` are stored under `dist/simplemattable`.

If you create any new classes that needs to be visible outside of simplemattable, dont forget to include them in the `projects/simplemattable/src/public_api.ts`.

To run the unit tests, use `ng test simplemattable`. If you want to generate the code coverage report, use `ng test simplemattable --code-coverage --watch=false`.

## Simplealert

NOTE: Simplealert is no longer maintained

The sourcecode of simplealert can be found in `/projects/simplealert`.

For information on how to use simplealert, visit [the NPM package](https://www.npmjs.com/package/simplealert).

If you want to build simplealert, use `ng build --prod simplealert`.

The build should trigger a refresh of the demo application (if currently running).
You need to build simplealert before you can use it in the demo.

The results of `ng build` are stored under `dist/simplealert`.

If you create any new classes that needs to be visible outside of simplealert, dont forget to include them in the `projects/simplealert/src/public_api.ts`.

There are currently no meaningful unit tests for simplealert.


## Contributing

Feel free to contribute to any of the components or even to create new components by opening up pull request.

## Author

Henning Wobken (henning.wobken@simplex24.de)

## License

The Simplematcomponents project and all it's components are licensed under the MIT license.
