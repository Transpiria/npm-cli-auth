# npm-cli-auth

This utility authenticates with a npm registry during automated package publishing.

## Usage

Run from the cli.

```shell
npx --yes npm-cli-auth
```

### Parameters

Parameters can be set through environment variables and/or command line arguments. Arguments should consist of a key and value, such as `--user myUser`.

|Argument|Environment|Default|Required|
|---|---|---|---|
|`--registry`|`NPM_REGISTRY`|`registry.npmjs.org`|No|
|`--user`|`NPM_USER`||Yes|
|`--password`|`NPM_PASSWORD`||Yes|
