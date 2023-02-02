import data from "../data.json";
import DisplayCard from "./displayCard";
import {DatabaseEntry} from "../interfaces/databaseEntry";
import {SortContext} from "../App";
import {useContext, useEffect, useState} from "react";
import {SortOption} from "../interfaces/SortOption";


const DisplayCards = () => {
    const sortState = useContext<SortOption>(SortContext);
    const [sortedData, sortedDataUpdate] = useState<DatabaseEntry[]>([]);

    useEffect(() => {
        sortedDataUpdate([...data as DatabaseEntry[]].sort((a,b) => {
            if (a[sortState.key] === null || a[sortState.key] === undefined) {
                a[sortState.key] = "";
            }
            if (b[sortState.key] === null || b[sortState.key] === undefined) {
                b[sortState.key] = "";
            }
            if (sortState.key === "ArrivalDate") {
                if (a[sortState.key] === "") {
                    a[sortState.key] = parseDate("1/1/1970");
                } else {
                    a[sortState.key] = parseDate(a[sortState.key]);
                }

                if (b[sortState.key] === "") {
                    b[sortState.key] = parseDate("1/1/1970");
                } else {
                    b[sortState.key] = parseDate(b[sortState.key]);
                }
            }

            if (sortState.direction === "ASC") {
                return a[sortState.key].localeCompare(b[sortState.key]);
            } else {
                return b[sortState.key].localeCompare(a[sortState.key]);
            }
        }));
    }, [sortState]);

    return <div style={{display: "flex", justifyContent: "space-between", margin: "10px", flexDirection: "row", flexWrap: "wrap", alignItems: "stretch", alignContent: "flex-start"}}>
        {
            sortedData
                .filter((entry) => {return entry.Picture})
                .filter((entry) => {return shouldFilter(entry, sortState.filterString)})
                .map((entry) => <DisplayCard card={entry} sortState={sortState}></DisplayCard>)
        }
        </div>;
};

const parseDate = (date: string): string => {
    return new Date(date).toISOString().split('T')[0];
}

const shouldFilter = (card: DatabaseEntry, filter?: string): boolean => {
    if (!filter) {
        return true;
    }
    return matchingFieldFound(card, filter)
}

const matchingFieldFound = (card: DatabaseEntry, filter: string): boolean => {
    let matchFound = false;
    Object.values(card).forEach((cardFieldValue: string) => {
        if (cardFieldValue.toLowerCase().includes(filter)) {
            matchFound = true;
            return;
        }
    })
    return matchFound;
}

export default DisplayCards;
