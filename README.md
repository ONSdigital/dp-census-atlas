# Census Atlas

Explore neighbourhood-level Census data tables on a map.

## State ownership

In this app, there are three 'owners' of state:

- URL (app state)
- Map instance (transitory map state, eg exact zoom and position)
- Svelte components (transistory, local UI state, eg a [details](https://design-system.service.gov.uk/components/details/) component)

All _important_ state flows in one direction from the URL to the UI. This is a fundamental principle of web design and UX on the web. It enables link sharing and makes apps work on the web.

- When a URL is shared, the app opens in the same state as when it was shared _in every important way_
- The Back (and Forward) buttons should work completely correctly
- Embedding is a special case of sharing - again, the URL needs to contain all the relevant state needed to show the embeddable content

## URL structure

    /population/sex/default/female          ? msoa=E02006827
                    |                               |
                    |                               |
    /topic/variable/classification/category ? geotype=geocode
                    |                               |
          `path` picks a node                `query` selects
          in the content tree                 the geography

## Localization

All hard-coded text should be added to the en.json file within the i18n locales folder. Each translation can be created under it's own file e.g cy.json.
The structure of the file is pages and hard-coded text relevant to those pages and custom components and text relevant to those components.

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

    npm run dev

## Building

    npm run build

You can preview the production build with `npm run preview`.

To build specifically for node (required for production deployment), use `npm run build-node`. This is as above, but first sets an env var (`SKADAPTER=node`) that controls the adapter used to build.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md) for details.

## License

Copyright © 2022, Office for National Statistics (https://www.ons.gov.uk)

Released under MIT license, see [LICENSE](LICENSE.md) for details.
