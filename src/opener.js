/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const HASH_PREFIX = '#!/ext+container:';

function error(e) {
    console.error(e);

    document.getElementById('errorBody').textContent = e;
    document.getElementById('errorPageContainer').classList.remove('hidden');
}

async function main() {
    let params = null;
    try {
        params = parseQuery();
    } catch (e) {
        error(`Error opening URL: ${e}.`);
        return;
    }
    let containerLookup = params.containerLookup;
    let container = getContainer(containerLookup);
    if (!container) {
        console.warn('container does not exists');
        return;
    }

    try {
        await newTab(container, params.url);
    } catch (e) {
        error(`Error creating new tab: ${e}.`);
    }
}

function parseQuery() {
    let queryString = extractQueryStringFromWindowLocation();
    return extractParametersFromQueryString(queryString);
}

function extractParametersFromQueryString(queryString) {
    let searchParams = new URLSearchParams(queryString);

    let containerId = searchParams.get("id");
    let containerName = searchParams.get("name");
    if (!containerId && !containerName) {
        throw `at least one of id or name should be specified`;
    }
    let containerLookup = new ContainerLookup(containerId, containerName);

    let url = searchParams.get("url");
    if (!url) {
        throw `"url" parameter is missing`;
    }

    return new Parameters(containerLookup, url);
}

class Parameters {
    constructor(
        containerLookup,
        url
    ) {
        this.containerLookup = containerLookup;
        this.url = url;
    }
}

class ContainerLookup {
    constructor(
        id,
        name
    ) {
        this.id = id;
        this.name = name;
    }
}

function extractQueryStringFromWindowLocation() {
    let hash = decodeURIComponent(window.location.hash);

    if (!hash.startsWith(HASH_PREFIX)) {
        throw ('cannot parse url');
    }

    return hash.substring(HASH_PREFIX.length);
}

async function getContainer(containerLookup) {
    try {
        if (containerLookup.id) {
            return await getContainerById(containerLookup.id);
        } else if (containerLookup.name) {
            return await getContainerByName(containerLookup.name);
        }
    } catch (e) {
        error(`Error getting container: ${e}.`);
    }
}

async function getContainerById(id) {
    return await browser.contextualIdentities.get(id);
}

async function getContainerByName(name) {
    let containers = await browser.contextualIdentities.query({
        name: name,
    });
    return containers[0];
}

async function newTab(container, url) {
    let currentTab = await browser.tabs.getCurrent();

    let createTabParams = {
        cookieStoreId: container.cookieStoreId, // container id
        url: url
    };

    await browser.tabs.create(createTabParams);
    await browser.tabs.remove(currentTab.id);
}

main();
