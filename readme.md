# Chalk

Chalk is an online classroom management system currently in use at the Toronto based bootcamp, HackerYou.

It is used by all members of a classroom and instructors as a way to manage lessons, content and news. It replaces HackerYou's original Jekyll based notes system.

This repo contains the Chalk client, and houses all tools related to the HY Classroom Management system. It makes up one half of the Chalk application; the other half is the Chalk API, which can be accessed in a separate repo [by clicking here](https://github.com/hackeryou/chalk-api).


## Styleguide

The styles for the app exist within the `styles` directory. The base styles are compiled using PostCSS through the Gulpfile. To work within the gulp production files, run `gulp styleguide`.

The live styleguide will be located at [http://localhost:3000/app/styleguide](http://localhost:3000/app/styleguide)

All the production files for the base CSS are kept in `app/styles/dev`. Further component styles will exist within the `app/components/**componentname**/` folder.

## Installing the Chalk client

By default, the Chalk client is connected to the HackerYou instance of the Chalk API. This means that unless you have an existing HackerYou account, you will find it difficult to use Chalk, since you will be unable to access many of the API's endpoints.

If you would like to use Chalk and don't have a HackerYou account, we recommend running your own instance of the Chalk API. For information on setting up the Chalk API, please refer to the [Chalk API Readme](https://github.com/hackeryou/chalk-api).

To set up the Chalk client on your computer:

```bash
#1. Clone Chalk
https://github.com/HackerYou/chalk.git

#2. Install dependencies
cd chalk
npm install

#3. Run gulp
gulp
```

## Contributing

If you would like to contribute to this project please create a fork and make a pull request.
