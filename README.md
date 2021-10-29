# Image-Processing-API
A REST API that can be used to resize images. This application is written in TypeScript and the backend is built by Node.js.

## Install
1. [Node.js](https://nodejs.org/) is needed to run this application.
2. Download the project and run 
```sh
$ npm install
```
to install all the dependencies.
3. Start the project by running
```sh
$ npm start
```
The server will start on port 3000.

## Endpoints
`/api/images`
The endpoint to resize the chosen image to the chosen size, with query parameters.

| Parameter    | Description |
|-------------|---------------|
| filename    | The file name of the image, the images can be chosen from /assets/full folder   |
| width    | The width of the resized image          |
| height | The height of the resized image         |

### Example
`http://localhost:3000/api/images?filename=fjord&width=100&height=500`
Display the resized image fjord.jpg with width 100 and height 500.
