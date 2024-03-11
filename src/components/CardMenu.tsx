import testCards from "../data/test-cards.json";
import { MenuItem, Select } from "@mui/material";
import { useState } from "react";

interface CardMenuProps {
  onSelect: (cardNumber: string) => void;
}

export const CardMenu = ({ onSelect }: CardMenuProps) => {
  const [selectedCard, setSelectedCard] = useState("4200000000000002");

  const handleChange = (event: { target: { value: string } }) => {
    setSelectedCard(event.target.value);
    onSelect(event.target.value);
  };

  return (
    <Select value={selectedCard} onChange={handleChange} sx={{width: "100%"}}>
      {testCards.map((card) => (
        <MenuItem key={card.cardNumber} value={card.cardNumber}>
          {card.title}
        </MenuItem>
      ))}
    </Select>
  );
};
