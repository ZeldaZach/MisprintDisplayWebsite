import {DatabaseEntry} from "./databaseEntry";

export interface SortOption {
    key: keyof DatabaseEntry;
    direction: "ASC"|"DESC";
    maxImageWidth: string;
}