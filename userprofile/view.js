const f = dv.current();
const imageLink = app.vault.getResourcePath(app.vault.getFileByPath(f.image.path));
console.log(imageLink);

const image = document.createElement("img");
image.src = imageLink;
image.alt = f.name;
image.classList.add("profile-image");

return image;
