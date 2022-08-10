# League of Legends Queue

League of Legends is one of the world’s most popular video games, developed by Riot Games. It features
a team-based competitive game mode based on strategy and outplaying opponents. There are a lot of features in League of Legends, but in this repository I try to make solo queue feature.

## About

This is a for fun project, I'm trying to implements something similar to the League of Legends Queue.

The basic premisses is:

1. Each player has a rank;
2. Each room has between one and five players;
3. Each room could be in a queue;
4. Each queue could be have a match.

## How it works

This project has some amazing features, and can be described as follow:

1. Create a player;
2. Create a room;
3. Invite a player to a room;
4. Join in a room;
5. Start a queue;
6. Accept a game.

All this features are make by API requests and socket events.

## Quick start

You can start cloning the repository:

```sh

git clone git@github.com:andraderaul/league-of-legends-queue
```

You should have a docker installed. Then runs the follow commands:

In a terminal start the server

```sh

cd server
docker-compose up
```

In a other terminal start the client

```sh

cd server
docker-compose up
```

## Environments

You need to create a `.env` file with the same keys from the `.env.example`. For this you should open a terminal and run this two command:

```sh
cp client/.env.example client/.env & cp server/.env.example server/.env
```

## Demo

[Screen Record](./assets/screen-record.gif)

## Stack

**Front-end:**

- [Vitejs](https://vitejs.dev/)
- [React](https://pt-br.reactjs.org/docs/getting-started.html)
- [TailwindCSS](https://tailwindcss.com/docs/)
- [React-Query](https://react-query.tanstack.com/)
- [Axios](https://github.com/axios/axios)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [MSW JS](https://mswjs.io/)

**Back-end:**

- [Express](https://expressjs.com)
- [Socket.IO](https://socket.io/)
- [Jest](https://jestjs.io/)

## License

[MIT](./LICENSE)

## Author

- [@andraderaul](https://github.com/andraderaul)
