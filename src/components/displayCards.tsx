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

            if (sortState.direction === "ASC") {
                return a[sortState.key].localeCompare(b[sortState.key]);
            } else {
                return b[sortState.key].localeCompare(a[sortState.key]);
            }
        }));
    }, [sortState]);

    return <div style={{display: "flex", justifyContent: "space-between", margin: "10px", flexDirection: "row", flexWrap: "wrap", alignItems: "stretch", alignContent: "flex-start"}}>
        {sortedData.map((entry) => <DisplayCard card={entry} sortState={sortState}></DisplayCard>)}</div>;
};

export default DisplayCards;
