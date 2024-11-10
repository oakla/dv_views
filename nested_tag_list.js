console.log("Loading view nested tag list");

/**
 * @typedef {Object} Tag
 * @property {String} full_name
 * @property {Page[]} direct_pages
 * @property {Tag[]} nested_tags
 */

/**
 * @typedef {Object} Page
 * @property {String} name
 * @property {unknown} link
 */

/**
 * @typedef {Object.<string, Tag>} TagMap
 */

/**
 * @param {string[]} args - An array of strings
 */
function nestedTagList(...args) {
    try {
        /**
         * @typedef {Object} FileInfo
         * @property {string[]} tags - An array of tags
         * @property {string} name - The name of the file
         * @property {unknown} link - The link of the file (type needs to be specified)
         */

        /**
         * @type {FileInfo[]}
         */
        const files = dv.pages(args[0])
            .map(p => ({
                tags: p.file.etags.values,
                name: p.file.name,
                link: p.file.link
            }));
        /** @type {TagMap} */
        const tagMap = {}
        /** @type{Set<string>} */
        const rootTagSet = new Set();

        for (let file of files) {
            const page = {
                name: file.name,
                link: file.link
            };
            for (let tag of file.tags) {
                insertTag(tag, page, tagMap, rootTagSet);
            }
        }

        relateTags(tagMap);
        let rootTagArr = Array.from(rootTagSet);
        if (args[0] != undefined) {
            rootTagArr = args;
        }


        const sortedTags = sortTagsAndPages(rootTagArr.map(x => tagMap[x]));
        let minSize = findHeaderSize(sortedTags, 6);
        if (minSize > 4) minSize = 4;
        for (let tag of sortedTags) {
            displayTag(tag, minSize);
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

/**
* Find the maximum header size
* @param {Tag[]} tags
* @param {number} minimumSize
* @returns {number}
*/
function findHeaderSize(tags, minimumSize) {
    if (tags.length == 0) return minimumSize;

    let maximumSize = minimumSize;
    for (let tag of tags) {
        let tag_size = findHeaderSize(tag.nested_tags);
        if (tag_size < maximumSize) maximumSize = tag_size;
    }

    return maximumSize - 1;
}

/** 
* @param {Tag} tag - The tag to display
* @param {number} headerSize - The size of the header
*/
function displayTag(tag, headerSize) {
    dv.header(headerSize, tag.full_name);
    dv.list(tag.direct_pages.map(p => p.link));
    for (let nested of tag.nested_tags) {
        displayTag(nested, headerSize + 1); // Larger is smaller
    }
}

/**
* Sorts the tags and pages
* @param {Tag[]} tags
*/
function sortTagsAndPages(tags) {
    if (tags.length == 0) return [];
    for (let tag of tags) {
        tag.direct_pages = tag.direct_pages.sort(p => p.name);
        tag.nested_tags = sortTagsAndPages(tag.nested_tags);
    }

    return tags.sort(t => t.full_name);
}

/**
 * Inserts a tag into the tag map and updates root tags.
 * @param {String} tag - The tag to insert.
 * @param {Page} page - The page associated with the tag.
 * @param {TagMap} tagMap - The tag map where the tag will be inserted.
 * @param {Set<String>} rootTags - The set of root tags.
 */
function insertTag(tag, page, tagMap, rootTags) {
    const parentTags = tag.split("/").map((_, index) => {
        return tag.split("/").slice(0, tag.split("/").length - index).join("/");
    });

    for (const parentTag of parentTags) {
        if (tagMap[parentTag] === undefined) {
            tagMap[parentTag] = {
                full_name: parentTag,
                direct_pages: [],
                nested_tags: []
            };

            if (parentTag === parentTags[parentTags.length - 1]) {
                rootTags.add(parentTag);
            }
        }
    }

    tagMap[tag].direct_pages.push(page);
    return parentTags.length;
}

/**
 * Relates tags by adding nested tags to their parent tags in the tag map.
 * @param {TagMap} tagMap - The tag map containing tags to be related.
 */
function relateTags(tagMap) {
    for (const [key, tag] of Object.entries(tagMap)) {
        const parent = getParent(key);
        if (parent === "") continue;

        tagMap[parent].nested_tags.push(tag);
    }
}

/**
 * Retrieves the parent tag from a given input string.
 * @param {String} inputString - The input string representing a tag.
 * @returns {String} The parent tag.
 */
function getParent(inputString) {
    const parts = inputString.split('/');
    if (parts.length === 1) {
        return ''; // No parent, return empty string
    } else {
        parts.pop(); // Remove the last element
        return parts.join('/');
    }
}

nestedTagList(input);
