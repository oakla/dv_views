import { DataviewInlineApi } from "./.definitions/dataview/api/inline-api";
import type { App } from "./.definitions/obsidian";

declare global {
    const dv: DataviewInlineApi;
    //const app: App;
}