# Simplematcomponents

Simplematcomponents is a set of Angular (6+) components that fit into or use Angular Material Design.

Each component has it's own npm package. There are (currently) no ties or shared files between the components.

## Projects

Currently, there are two projects:

- [Simpelalert](https://www.npmjs.com/package/simplealert): 
simple Angular component for info or error alerts.
- [Simplemattable](https://www.npmjs.com/package/simplemattable): 
A simplified, declarative table-library using @angular/material's MatTable with form capabilities for adding/editing/deleting data

You can contribute to both using this repository.

## Demo

To see the components in action, spin up the demo application:
- check out this repository
- install the dependencies using `npm install` while being in the project root
- build simplealert and simplemattable using `ng build simplealert` and `ng build simplemattable`.
- start the demo application using `ng serve`.

## Simplealert

The sourcecode of simplealert can be found in `/projects/simplealert`.

For information on how to use simplealert, visit [the NPM package](https://www.npmjs.com/package/simplealert).

If you want to build simplealert, use `ng build --prod simplealert`.

The build should trigger a refresh of the demo application (if currently running).
You need to build simplemattable before you can use it in the demo.

The results of `ng build` are stored under `dist/simplealert`.

If you create any new classes that needs to be visible outside of simplemattable, dont forget to include them in the `projects/simplemattable/src/public_api.ts`.

There are currently no unit tests for simplealert.

## Simplemattable

The sourcecode of simplealert can be found in `/projects/simplemattable`.

For information on how to use simplealert, visit [the NPM package](https://www.npmjs.com/package/simplemattable).

If you want to build simplealert, use `ng build --prod simplemattable`.

The build should trigger a refresh of the demo application (if currently running). 
You need to build simplemattable before you can use it in the demo.

The results of `ng build` are stored under `dist/simplemattable`.

If you create any new classes that needs to be visible outside of simplemattable, dont forget to include them in the `projects/simplemattable/src/public_api.ts`.

To run the unit tests, use `ng test simplemattable`. If you want to generate the code coverage report, use `ng test simplemattable --code-coverage --watch=false`.

## Contributing

Feel free to contribute to any of the components or even to create new components by opening up pull request.

## Author

Henning Wobken (henning.wobken@simplex24.de)

## License

The Simplematcomponents project and all it's components are licensed under the MIT license.
