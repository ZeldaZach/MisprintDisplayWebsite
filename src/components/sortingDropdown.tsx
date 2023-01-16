import React from "react";
import {Dropdown, Form} from "react-bootstrap";
import {DatabaseEntryKeys} from "../interfaces/databaseEntry";
import {SortOption} from "../interfaces/SortOption";

interface SortingDropdownProps {
    sortState: SortOption;
    sortStateUpdate: Function;
}

const SortingDropdown = ({sortState, sortStateUpdate}: SortingDropdownProps) => {

    return (
        <div style={{display: "flex", margin: "10px", flexDirection: "row", flexWrap: "wrap", alignItems: "stretch"}}>
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-sort-key">
                    Sort Key ({sortState.key})
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {
                        DatabaseEntryKeys.map(entry => (<Dropdown.Item onClick={() => sortStateUpdate((s: SortOption) => ({...s, key:entry}))}>{entry}</Dropdown.Item>))
                    }
                </Dropdown.Menu>
            </Dropdown>&nbsp;
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-sort-direction">
                    Direction ({sortState.direction})
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {
                        ["ASC","DESC"].map(entry => (<Dropdown.Item onClick={() => sortStateUpdate((s: SortOption) => ({...s, direction:entry}))}>{entry}</Dropdown.Item>))
                    }
                </Dropdown.Menu>
            </Dropdown>&nbsp;
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-sort-image-size">
                    Image Size ({sortState.maxImageWidth})
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {
                        ["300px", "750px", "large"].map(entry => (<Dropdown.Item onClick={() => sortStateUpdate((s: SortOption) => ({...s, maxImageWidth:entry}))}>{entry}</Dropdown.Item>))
                    }
                </Dropdown.Menu>
            </Dropdown>&nbsp;
            <Form.Control className="w-50" as="input" placeholder="Search" onChange={
                (entry: React.ChangeEvent<HTMLInputElement>) => {
                    sortStateUpdate(() => {
                        return {...sortState, filterString: entry.target.value}
                    })
                }
            }/>
        </div>
    )
}

export default SortingDropdown;