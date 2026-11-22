import {DatabaseEntry} from "./databaseEntry";

export interface SortOption {
    key: keyof DatabaseEntry;
    direction: "ASC"|"DESC";
    maxImageWidth: "300px" | "750px" | "large";
    filterString?: string;
}