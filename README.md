# Open external links in a container

<img src="src/icons/extension-96.png">

This is a Firefox extension that enables support for opening links in specific containers using custom protocol handler. It works for terminal, OS shortcuts and regular HTML pages.

An extension can be installed from the [official Mozilla Add-Ons Store for Firefox](https://addons.mozilla.org/firefox/addon/open-url-in-container/).

## Features

- provides custom protocol handler to open URLs in containers
- supports both command line and internal invocations
- supports creation of containers on the fly
- supports setting colors and icons when creating new containers
- supports tabs pinning
- supports opening tabs in reader mode
- works well in combination with other extensions

## Examples

Open `https://mozilla.org` in a container named `MyContainer`.

```bash
$ firefox 'ext+container:name=MyContainer&url=https://mozilla.org'
```

Open `https://mozilla.org` in a container named `MyContainer`. If the container doesn't exist, create it using an `orange` colored `fruit` icon. Also, pin the tab.

```bash
$ firefox 'ext+container:name=MyContainer&color=orange&icon=fruit&url=https://mozilla.org&pinned=true'
```

Also it will work with the [links on the site](ext+container:name=MyContainer&url=https://mozilla.org):

```html
<a href="ext+container:name=MyContainer&url=https://mozilla.org">Mozilla.Org in MyContainer</a>
```

### How it works
This extension registers urls with custom protocol `ext+container:` that are opened in Firefox to open 
the extension embedded page opener.html#!/ext:container:<query-string>
where query-string is "id=<container-id>&url=<url>"
<query-string> is html-encoded

It then uses `browser.tabs.create({cookieStoreId: <container-id>, url: <url>})` to open the website in new tab
and closes the extension page tab itself

## Build

### Step 1: Install node, npm, yarn
### Step 2:
```bash
$ git clone https://github.com/honsiorovskyi/open-url-in-container.git

$ cd open-url-in-container

$ yarn

$ yarn build
```

## License

[Mozilla Public License Version 2.0](LICENSE)

## Contibutions

Contributions are very welcome. There's no specific process right now, just open your PRs/issues in this repo.
