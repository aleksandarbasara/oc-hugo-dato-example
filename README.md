# Hugo DatoCMS Starter

This repo contains a working static website written with [Hugo](http://gohugo.io/), integrated with content coming from this [DatoCMS administrative area](https://dashboard.datocms.com/account/sites/template?name=Portfolio&siteId=604). 

[This starter is based on DatoCMS Portfolio](https://github.com/datocms/hugo-portfolio) 

## Usage

First, install the dependencies of this project:

```
yarn install
```

Add an `.env` file containing the read-only API token of your DatoCMS site:

```
echo 'DATO_API_TOKEN=abc123' >> .env
```

Then, to run this website in development mode (with live-reload):

```
yarn start
```

To build the final, production ready static website:

```
yarn build
```

The final result will be saved in the `public` directory.

## Licence
The source code is licensed [MIT](https://opensource.org/licenses/mit-license.php). The website content is licensed CC BY NC SA 4.0.

