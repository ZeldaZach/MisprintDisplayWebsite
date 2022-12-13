import Card from 'react-bootstrap/Card';
import React from "react";
import {DatabaseEntry} from "../interfaces/databaseEntry";
import {SortOption} from "../interfaces/SortOption";

interface DisplayCardProps {
    card: DatabaseEntry;
    sortState: SortOption;
}

const DisplayCard = ({card, sortState}: DisplayCardProps) => {

    let cardDisplayName;
    if (card.SecondaryCardName) {
        cardDisplayName = card.PrimaryCardName + " // " + card.SecondaryCardName;
    } else {
        cardDisplayName = card.PrimaryCardName;
    }

    return (
        <Card id={card.UUID}>
            <Card.Img variant='top' src={card.Picture} style={{height: "auto", width:sortState.maxImageWidth, display:"block", marginLeft: "auto", marginRight: "auto"}}/>
            <Card.Body>
                <Card.Title>{cardDisplayName}</Card.Title>
                <Card.Text>
                        Set Code: {card.SetCode}<br/>
                        {card.Language && <>Language: {card.Language}<br/></>}
                        Errors: {card.Errors}<br/>
                        UUID: {card.UUID}<br/>
                        {card.Connection1 && <>Connection 1: {card.Connection1}<br/></>}
                        {card.Connection2 && <>Connection 2: {card.Connection2}<br/></>}
                        {card.Favorites && <>Favorite: {card.Favorites}<br/></>}
                </Card.Text>
            </Card.Body>
        </Card>
    );
}

export default DisplayCard;