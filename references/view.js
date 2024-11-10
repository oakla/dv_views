const mc = app.metadataCache;

const current = dv.current();

let firstShown = false;

const links = app.metadataCache.resolvedLinks;

/** @type {Object<string, string[]>}
 * @example
 * {
 *   "Attachments/xd.png": ["foo.md", "nom/bar.md"],
 *   "Attachments/asdf.png": ["foo.md", "bla.md"]
 * }
*/
const backlinks = {};
for (const link of Object.keys(links)) {
	const targets = Object.keys(links[link]);
	//console.log("targets:", targets);
	for (const target of targets) {
		if (target.startsWith(current.file.folder + "/")) {
			if (!(target in backlinks)) backlinks[target] = [];
			//if (!backlinks[target].contains(link)) {
			backlinks[target].push(link);
			//}
		}
	}
}
//console.log(backlinks);

const hasImageFunction = typeof input === "object" && input.image && typeof input.image === "function";
const hasImageString = typeof input === "object" && input.image && typeof input.image === "string";
const imageFunction = hasImageFunction ? input.image : hasImageString ? ()=>input.image : file => app.vault.getResourcePath(file);

const files = app.vault.getFiles()
	.filter(file => file.parent.path == current.file.folder && file.path != current.file.path)
	.map(file => {
		// ToDo: check if file.extension is md
		// if so, get frontmatter image attribute and use that instead of the file itself
		const imageLink = imageFunction(file);
		if (!firstShown) {
			console.log(file, imageLink, input);
			firstShown = true;
		}
		

		return `
			<div class="file">
				<img class="image" alt="${file.name}" src="${imageLink}">

				<div class="name">
					<a class="internal-link" href="/${file.path}">
						${file.name}
					</a>
				</div>
				<div class="backlinks">
				${
					backlinks[file.path] ? backlinks[file.path].map(link => `<a class="internal-link ref-link" href="/${link}">${link}</a>`).join("") : ""
				}
				</div>
			</div>`;
	});

const div = document.createElement("div");
div.classList.add("files");
div.innerHTML = `
	${files.join("")}
`;

return div;

/*
dv.table([
	"Offene Themen", "Datum", "Status"
], dv.pages("#meeting and #due")
.sort(f => f.date, "desc")
.map(f=>[
	dv.fileLink(f.file.link.path, false, f.title),
	f.date,
	f.status,
]))
*/
