import { useState } from "react";

const useRowSelection = () => {
  const [selectedItems, setSelectedItems] = useState([]); // Ensure this is an array
  const [isAnyRowSelected, setIsAnyRowSelected] = useState(false);

  const handleSelect = (itemId) => {
    setSelectedItems(
      (prevSelected) =>
        Array.isArray(prevSelected)
          ? prevSelected.includes(itemId)
            ? prevSelected.filter((id) => id !== itemId)
            : [...prevSelected, itemId]
          : [itemId] // Fallback in case prevSelected is not an array
    );

    setIsAnyRowSelected((prevSelected) => {
      if (!Array.isArray(prevSelected)) return true;
      return !prevSelected.includes(itemId) || prevSelected.length > 1;
    });
  };

  const handleRowClick = (itemId) => {
    if (isAnyRowSelected) {
      handleSelect(itemId);
    }
  };

  const handleRowDoubleClick = (itemId) => {
    if (!isAnyRowSelected) {
      handleSelect(itemId);
    }
  };

  return {
    selectedItems,
    isAnyRowSelected,
    handleRowClick,
    handleRowDoubleClick,
  };
};

export default useRowSelection;
