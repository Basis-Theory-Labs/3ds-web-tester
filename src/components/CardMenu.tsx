import testCards from "../data/test-cards.json";
import { ListSubheader, MenuItem, Select } from "@mui/material";
import { useState } from "react";

interface CardMenuProps {
  onSelect: (cardNumber: string) => void;
}

export const CardMenu = ({ onSelect }: CardMenuProps) => {
  const [selectedCard, setSelectedCard] = useState(testCards.luhnValid[0].cardNumber);

  const handleChange = (event: { target: { value: string } }) => {
    setSelectedCard(event.target.value);
    onSelect(event.target.value);
  };

  // group cards by brand
  const cardsByBrand = testCards.luhnValid.reduce((acc, card) => {
    if (!acc[card.brand]) {
      acc[card.brand] = [];
    }
    acc[card.brand].push(card);
    return acc;
  }, {} as Record<string, typeof testCards.luhnValid>);

  return (
    <Select
      value={selectedCard}
      onChange={handleChange}
      sx={{ width: "100%" }}
    >
      {Object.entries(cardsByBrand).map(([brand, cards]) => [
        <ListSubheader key={brand}>{brand}</ListSubheader>,
        ...cards.map((card) => (
          <MenuItem
            key={card.cardNumber}
            value={card.cardNumber}
            sx={{ pl: 4 }}
          >
            {card.title}
          </MenuItem>
        )),
      ])}
    </Select>
  );
};
