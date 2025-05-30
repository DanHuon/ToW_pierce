document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('gridContainer');
    const totalPierceValueSpan = document.getElementById('totalPierceValue');

    const columnDefinitions = [
        { name: 'Armor 1', type: 'armor', id: 'armor1' },
        { name: 'Armor 2', type: 'armor', id: 'armor2' },
        { name: 'Armor 3', type: 'armor', id: 'armor3' },
        { name: 'Armor 4', type: 'armor', id: 'armor4' },
        { name: 'Talisman', type: 'talisman', id: 'talisman1' },
        { name: 'Headwear', type: 'headwear', id: 'headwear1' },
        { name: 'Gloves', type: 'gloves', id: 'gloves1' },
        { name: 'Weapon', type: 'weapon', id: 'weapon1' },
    ];

    const slotsPerColumn = 4;
    const selectedCardsByColumn = {};

    columnDefinitions.forEach(colDef => {
        selectedCardsByColumn[colDef.id] = Array(slotsPerColumn).fill(null);
    });

    function createGrid() {
        columnDefinitions.forEach(colDef => {
            const columnDiv = document.createElement('div');
            columnDiv.classList.add('column');
            columnDiv.dataset.columnId = colDef.id;

            const columnTitle = document.createElement('div');
            columnTitle.classList.add('column-title');
            columnTitle.textContent = colDef.name;
            columnDiv.appendChild(columnTitle);

            const cardsForColumn = getCardsByType(colDef.type);

            for (let i = 0; i < slotsPerColumn; i++) {
                const slotDiv = document.createElement('div');
                slotDiv.classList.add('slot');

                const select = document.createElement('select');
                select.dataset.slotIndex = i;
                select.dataset.columnType = colDef.type;

                populateSelectWithOptions(select, cardsForColumn, colDef.id, i);
                select.addEventListener('change', (event) => handleSelectionChange(event, colDef.id, i));
                slotDiv.appendChild(select);
                columnDiv.appendChild(slotDiv);
            }
            gridContainer.appendChild(columnDiv);
        });
        updateAllSelects();
    }

    function populateSelectWithOptions(selectElement, availableCards, columnId, slotIndex) {
        const previouslySelectedValue = selectElement.value;
        selectElement.innerHTML = '';

        availableCards.forEach(card => {
            const isSelectedInAnotherSlot = selectedCardsByColumn[columnId]
                .some((selectedCardName, sIndex) =>
                    sIndex !== slotIndex && selectedCardName === card.name && card.name !== "Empty"
                );

            if (!isSelectedInAnotherSlot || card.name === "Empty") {
                const option = document.createElement('option');
                option.value = card.name;
                option.textContent = `${card.name} (+${card.pierce})`;
                option.dataset.pierce = card.pierce;
                selectElement.appendChild(option);
            }
        });

        if (Array.from(selectElement.options).some(opt => opt.value === previouslySelectedValue)) {
            selectElement.value = previouslySelectedValue;
        } else if (previouslySelectedValue !== "Empty" && previouslySelectedValue !== null) {
            selectElement.value = "Empty";
            selectedCardsByColumn[columnId][slotIndex] = "Empty";
        } else {
            if (selectElement.querySelector('option[value="Empty"]')) {
                 selectElement.value = "Empty";
            }
        }
    }

    function handleSelectionChange(event, columnId, slotIndex) {
        const selectedCardName = event.target.value;
        selectedCardsByColumn[columnId][slotIndex] = selectedCardName;
        updateSelectsInColumn(columnId);
        calculateTotalPierce();
    }

    function updateSelectsInColumn(columnId) {
        const columnDiv = gridContainer.querySelector(`.column[data-column-id="${columnId}"]`);
        if (!columnDiv) return;

        const selectsInColumn = columnDiv.querySelectorAll('select');
        const columnType = selectsInColumn[0].dataset.columnType;
        const cardsForColumn = getCardsByType(columnType);

        selectsInColumn.forEach(select => {
            const slotIndex = parseInt(select.dataset.slotIndex);
            populateSelectWithOptions(select, cardsForColumn, columnId, slotIndex);
        });
    }

    function updateAllSelects() {
        columnDefinitions.forEach(colDef => {
            updateSelectsInColumn(colDef.id);
        });
    }

    function calculateTotalPierce() {
        let totalPierce = 0;
        const allSelects = gridContainer.querySelectorAll('select');

        allSelects.forEach(select => {
            const selectedOption = select.options[select.selectedIndex];
            if (selectedOption && selectedOption.value !== "Empty") {
                totalPierce += parseInt(selectedOption.dataset.pierce || 0);
            }
        });
        totalPierceValueSpan.textContent = totalPierce;
    }

    createGrid();
    calculateTotalPierce();
});