This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

I created this project for training on TypeScript and learning the [material-ui](https://material-ui.com/) library

This library provides a bunch of React components ready to use and designed the Material way.

# TODO Liste
This is a PWA (Progressive Web App), so if you host this app, you can visit it a first time, then install it on your phone or just revisit even if you stop hosting this app.

Even if you use an "online" version, it never depends on internet to display and save your lists, all you datas is saved locally with the help of local storage

## DEMO
1. Clone this repo anywhere
2. Run `npm i` (or `npm install` for purists =p)
3. Run `npm run dev`
4. You're done !

After running the last command, the dev-server will start and then open http://localhost:3000 page on your browser automatically

## PRODUCTION
1. Clone this repo anywhere
2. Run `npm i` (or `npm install` for purists =p)
3. Run `npm run build`
4. Run `npm start`
5. You're done !

After running the last command, `serve` will host the app and this last one will be available at http://localhost:7080

- This port can be changed in the `package.json` file in the `start` script.
- You can use any web-server you want/need. After all, this app is client-side only so you can serve it like you want.

For production purposes with NodeJS, you can proxy the app available on port 7080 with NGINX for example.
