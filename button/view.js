const createButton = id => {
	const command = app.commands.commands[id];
    if (!command) {
        return dv.el("span", `command ${id} doesn't exist`);
    }
    //const button = dv.el("button", command.name);
    const button = document.createElement("button");
    button.textContent = command.name;
    button.onclick = () => app.commands.executeCommandById(command.id);
    return button;
};

globalThis.dv = dv;

if (typeof input === "string") {
    return createButton(input);
}

if (Array.isArray(input)) {
    const buttons = input.map(createButton);
    if (buttons.length === 0) {
        return dv.el("span", "no buttons");
    }
    else if (buttons.length === 1) {
        return buttons[0];
    }
    buttons[0].classList.add("left");
    buttons[buttons.length - 1].classList.add("right");
    if (buttons.length > 2) {
        for (let i = 1; i < buttons.length - 1; i++) {
            buttons[i].classList.add("center");
        }
    }
    const container = document.createElement("span");
    buttons.forEach(button => container.appendChild(button));
    return container;
}

/*dv.span(createButton("dataview:dataview-drop-cache"));
dv.span("&nbsp;");
dv.span(createButton("dataview:dataview-force-refresh-views"));
dv.span("&nbsp;");
dv.span(createButton("obsidian-reset-font-size:reset-font-size"));
dv.span("&nbsp;");
dv.span(createButton("daily-notes"));*/