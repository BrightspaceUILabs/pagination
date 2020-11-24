# d2l-labs-pagination

[![NPM version](https://img.shields.io/npm/v/@brightspace-ui-labs/pagination.svg)](https://www.npmjs.org/package/@brightspace-ui-labs/pagination)

> Note: this is a ["labs" component](https://github.com/BrightspaceUI/guide/wiki/Component-Tiers). While functional, these tasks are prerequisites to promotion to BrightspaceUI "official" status:
>
> - [ ] [Design organization buy-in](https://github.com/BrightspaceUI/guide/wiki/Before-you-build#working-with-design)
> - [ ] [design.d2l entry](http://design.d2l/)
> - [ ] [Architectural sign-off](https://github.com/BrightspaceUI/guide/wiki/Before-you-build#web-component-architecture)
> - [ ] [Continuous integration](https://github.com/BrightspaceUI/guide/wiki/Testing#testing-continuously-with-travis-ci)
> - [ ] [Cross-browser testing](https://github.com/BrightspaceUI/guide/wiki/Testing#testing-with-open-wc-testing-tools)
> - [ ] [Unit tests](https://github.com/BrightspaceUI/guide/wiki/Testing#testing-with-polymer-test) (if applicable)
> - [ ] [Accessibility tests](https://github.com/BrightspaceUI/guide/wiki/Testing#automated-accessibility-testing-with-axe)
> - [ ] [Visual diff tests](https://github.com/BrightspaceUI/visual-diff)
> - [ ] [Localization](https://github.com/BrightspaceUI/guide/wiki/Localization) with Serge (if applicable)
> - [x] Demo page
> - [x] README documentation

A component to indicate the existence of, and provide navigation for, multiple pages of content.

## Installation

To install from NPM:

```shell
npm install @brightspace-ui-labs/pagination
```

## Usage

```html
<script type="module">
    import '@brightspace-ui-labs/pagination/pagination.js';
</script>
<d2l-labs-pagination></d2l-labs-pagination>
```

**Properties:**
- `page-number` (required, Number): The current page number
- `max-page-number` (required, Number): The highest page number the user could navigate to
- `show-item-count-select` (Boolean, default:`False`): Determines whether or not to show the `Results Per Page` select component.
- `item-count-options` (Array, default:`[10,20,30,40]`): The options available in the `Results Per Page` select component.
- `selected-count-option`(Number): The starting `item-count-options` option to display in the `Results Per Page` select component.

**Events:**
The `d2l-labs-pagination` dispatches the `pagination-page-change` event when either the navigation buttons are pressed, or the page number is modified to point to a valid page number. It will return the number of the requested page:
```javascript
pagination.addEventListener('pagination-page-change', (e) => {
  console.log(e.detail.page);
});
```

The `d2l-labs-pagination` dispatches the `pagination-item-counter-change` event when the item count selector is value is changed. It will return the number of items requested per page:
```javascript
pagination.addEventListener('pagination-item-counter-change', (e) => {
  console.log(e.detail.itemCount);
});
```


## Developing, Testing and Contributing

After cloning the repo, run `npm install` to install dependencies.

### Running the demos

To start an [es-dev-server](https://open-wc.org/developing/es-dev-server.html) that hosts the demo page and tests:

```shell
npm start
```

### Linting

```shell
# eslint and lit-analyzer
npm run lint

# eslint only
npm run lint:eslint

# lit-analyzer only
npm run lint:lit
```

### Testing

```shell
# lint, unit test and visual-diff test
npm test

# lint only
npm run lint

# unit tests only
npm run test:headless

# debug or run a subset of local unit tests
# then navigate to `http://localhost:9876/debug.html`
npm run test:headless:watch
```

### Visual Diff Testing

This repo uses the [@brightspace-ui/visual-diff utility](https://github.com/BrightspaceUI/visual-diff/) to compare current snapshots against a set of golden snapshots stored in source control.

```shell
# run visual-diff tests
npm run test:diff

# subset of visual-diff tests:
npm run test:diff -- -g some-pattern

# update visual-diff goldens
npm run test:diff:golden
```

Golden snapshots in source control must be updated by Travis CI. To trigger an update, press the "Regenerate Goldens" button in the pull request `visual-difference` test run.

## Versioning, Releasing & Deploying

All version changes should obey [semantic versioning](https://semver.org/) rules.

Releases use the [semantic-release](https://semantic-release.gitbook.io/) tooling and the [angular preset](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular) for commit message syntax. Upon release, the version in `package.json` is updated, a tag and GitHub release is created and a new package will be deployed to NPM.

Commits prefixed with `feat` will trigger a minor release, while `fix` or `perf` will trigger a patch release. A commit containing `BREAKING CHANGE` will cause a major release to occur.

Other useful prefixes that will not trigger a release: `build`, `ci`, `docs`, `refactor`, `style` and `test`. More details in the [Angular Contribution Guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#type).
