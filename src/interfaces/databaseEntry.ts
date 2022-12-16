
export interface DatabaseEntry {
    SetCode: string;
    PrimaryCardName: string;
    SecondaryCardName: string;
    Language: string;
    Errors: string;
    Picture: string;
    UUID: string;
    Connection1: string;
    Connection2: string;
    Favorites: string;
    ArrivalDate: string;
}

export const DatabaseEntryKeys = ["SetCode", "PrimaryCardName", "SecondaryCardName", "Language", "Errors", "Picture", "UUID", "Connection1", "Connection2", "Favorites", "ArrivalDate"];
