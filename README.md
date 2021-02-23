# Vite Shell

This is a Vite project running on vue and syncing with shopify through themekit.

All files are in TypeScript and we use JSX for vue's render functions in TSX files.

## Setup

`yarn install`

`yarn dev`

#### Commit Lint

Messages must be matched by the following regex:

```js
;/^(revert: )?(feat|fix|docs|dx|refactor|perf|test|workflow|build|ci|chore|types|wip|release|deps)(\(.+\))?: .{1,50}/
```

#### VScode Settings

```json
//.vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "prettier.configPath": "~/.config/.prettierrc",
  "prettier.ignorePath": "~/.config/.prettierignore"
}
```
