import React, {createContext, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SortingDropdown from "./components/sortingDropdown";
import DisplayCards from "./components/displayCards";
import {SortOption} from "./interfaces/SortOption";

const defaultStart: SortOption = {
    key: "PrimaryCardName",
    direction: "ASC",
    maxImageWidth: "750px"
};

export const SortContext = createContext<SortOption>(defaultStart);

function App() {
    const [sortState, sortStateUpdate] = useState<SortOption>(defaultStart);

    return (
        <SortContext.Provider value={sortState}>
            <SortingDropdown sortState={sortState} sortStateUpdate={sortStateUpdate}></SortingDropdown>
            <DisplayCards/>
        </SortContext.Provider>
    );
}

export default App;
