document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('gridContainer');
    const passivePierceValueSpan = document.getElementById('passivePierceValue');
    const activePierceValueSpan = document.getElementById('activePierceValue');
    const activeCardsDisplaySpan = document.getElementById('activeCardsDisplay');
    const doubleGloveActivePierceValueSpan = document.getElementById('doubleGloveActivePierceValue');
    const doubleGloveActiveCardsDisplaySpan = document.getElementById('doubleGloveActiveCardsDisplay');

    const activePierceSection = document.getElementById('activePierceSection');
    const doubleGloveActivePierceSection = document.getElementById('doubleGloveActivePierceSection');


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

    const regularSlotsPerColumn = 4;
    const assistSlotsPerColumn = 1;
    const totalSlotsPerColumn = regularSlotsPerColumn + assistSlotsPerColumn;

    const selectedCardsByColumn = {};

    columnDefinitions.forEach(colDef => {
        selectedCardsByColumn[colDef.id] = Array(totalSlotsPerColumn).fill(null);
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

            // Regular slots
            for (let i = 0; i < regularSlotsPerColumn; i++) {
                const slotDiv = document.createElement('div');
                slotDiv.classList.add('slot');
                const slotLabel = document.createElement('span');
                slotLabel.classList.add('slot-label');
                slotLabel.textContent = `Slot ${i + 1}`;
                slotDiv.appendChild(slotLabel);

                const select = document.createElement('select');
                select.dataset.slotIndex = i;
                select.dataset.slotType = 'regular';
                select.dataset.columnType = colDef.type;
                populateSelectWithOptions(select, cardsForColumn, colDef.id, i);
                select.addEventListener('change', (event) => handleSelectionChange(event, colDef.id, i));
                slotDiv.appendChild(select);
                columnDiv.appendChild(slotDiv);
            }

            // Assist slot
            for (let i = 0; i < assistSlotsPerColumn; i++) {
                const slotIndexInArray = regularSlotsPerColumn + i;
                const slotDiv = document.createElement('div');
                slotDiv.classList.add('assist-slot');

                const slotLabel = document.createElement('span');
                slotLabel.classList.add('slot-label');
                slotLabel.textContent = `Assist ${i + 1}`;
                slotDiv.appendChild(slotLabel);

                const select = document.createElement('select');
                select.dataset.slotIndex = slotIndexInArray;
                select.dataset.slotType = 'assist';
                select.dataset.columnType = colDef.type;

                populateSelectWithOptions(select, cardsForColumn, colDef.id, slotIndexInArray);
                select.addEventListener('change', (event) => handleSelectionChange(event, colDef.id, slotIndexInArray));
                slotDiv.appendChild(select);
                columnDiv.appendChild(slotDiv);
            }
            gridContainer.appendChild(columnDiv);
        });
        updateAllSelects();
        calculateTotals();
    }

    function populateSelectWithOptions(selectElement, availableCards, columnId, slotIndex) {
        const previouslySelectedValue = selectElement.value;
        selectElement.innerHTML = ''; // Clear old options

        const slotType = selectElement.dataset.slotType;

        availableCards.forEach(card => {
            const isSelectedInAnotherSlotInSameColumn = selectedCardsByColumn[columnId]
                .some((selectedCardName, sIndex) =>
                    sIndex !== slotIndex && selectedCardName === card.name && card.name !== "Empty"
                );

            if (!isSelectedInAnotherSlotInSameColumn || card.name === "Empty") {
                const option = document.createElement('option');
                option.value = card.name;
                const pierceValue = (slotType === 'assist' ? (card.assistPierce || 0) : card.pierce);
                option.textContent = `${card.name} (+${pierceValue})`;
                // Store all relevant card data on the option for easy access
                option.dataset.cardName = card.name;
                option.dataset.pierce = card.pierce || 0;
                option.dataset.assistPierce = card.assistPierce || 0;
                option.dataset.activePierce = card.activePierce || 0;
                option.dataset.cardType = card.type;
                selectElement.appendChild(option);
            }
        });

        if (Array.from(selectElement.options).some(opt => opt.value === previouslySelectedValue)) {
            selectElement.value = previouslySelectedValue;
        } else {
            selectElement.value = "Empty"; // Default to Empty if previous selection is no longer valid
            if (previouslySelectedValue !== "Empty" && previouslySelectedValue !== null) {
                 selectedCardsByColumn[columnId][slotIndex] = "Empty";
            }
        }
         if (!selectElement.value && selectElement.options.length > 0) {
            selectElement.value = "Empty";
        }
    }

    function handleSelectionChange(event, columnId, slotIndex) {
        const selectedCardName = event.target.value;
        selectedCardsByColumn[columnId][slotIndex] = selectedCardName;
        updateSelectsInColumn(columnId);
        calculateTotals();
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

    function calculateTotals() {
        let passivePierce = 0;
        const selectedWeaponCards = [];
        const selectedGloveCards = [];

        const allSelects = gridContainer.querySelectorAll('select');

        allSelects.forEach(select => {
            const selectedOption = select.options[select.selectedIndex];
            if (selectedOption && selectedOption.value !== "Empty") {
                const cardName = selectedOption.value;
                const cardData = getCardByName(cardName);
                const slotType = select.dataset.slotType;

                if (slotType === 'assist') {
                    passivePierce += (cardData.assistPierce || 0);
                } else {
                    passivePierce += (cardData.pierce || 0);
                }

                if (cardData.type === 'weapon' && (cardData.activePierce || 0) > 0) {
                    selectedWeaponCards.push({name: cardData.name, activePierce: cardData.activePierce || 0});
                }
                if (cardData.type === 'gloves' && (cardData.activePierce || 0) > 0) {
                    selectedGloveCards.push({name: cardData.name, activePierce: cardData.activePierce || 0});
                }
            }
        });

        passivePierceValueSpan.textContent = passivePierce;

        // Sort cards by activePierce descending to easily get highest values
        selectedWeaponCards.sort((a, b) => b.activePierce - a.activePierce);
        selectedGloveCards.sort((a, b) => b.activePierce - a.activePierce);

        let activePierceTotal = 0;
        let activeCardNames = [];
        let doubleGloveActivePierceTotal = 0;
        let doubleGloveActiveCardNames = [];

        const hasWeaponOrGlove = selectedWeaponCards.length > 0 || selectedGloveCards.length > 0;

        if (hasWeaponOrGlove) {
            activePierceSection.style.display = 'block';
            activePierceTotal = passivePierce;

            if (selectedWeaponCards.length > 0) {
                activePierceTotal += selectedWeaponCards[0].activePierce;
                activeCardNames.push(selectedWeaponCards[0].name);
            }
            if (selectedGloveCards.length > 0) {
                activePierceTotal += selectedGloveCards[0].activePierce;
                activeCardNames.push(selectedGloveCards[0].name);
            }
            activePierceValueSpan.textContent = activePierceTotal;
            activeCardsDisplaySpan.textContent = activeCardNames.length > 0 ? activeCardNames.map(name => `(${name})`).join(' + ') : '';

            // Double Glove Active Pierce Logic
            if (selectedGloveCards.length >= 2) {
                doubleGloveActivePierceSection.style.display = 'block';
                doubleGloveActivePierceTotal = passivePierce;
                doubleGloveActiveCardNames = [];

                if (selectedWeaponCards.length > 0) {
                    doubleGloveActivePierceTotal += selectedWeaponCards[0].activePierce;
                    doubleGloveActiveCardNames.push(selectedWeaponCards[0].name);
                }
                if (selectedGloveCards.length > 0) { // First glove
                    doubleGloveActivePierceTotal += selectedGloveCards[0].activePierce;
                    doubleGloveActiveCardNames.push(selectedGloveCards[0].name);
                }
                 if (selectedGloveCards.length >= 2) { // Second glove
                    doubleGloveActivePierceTotal += selectedGloveCards[1].activePierce;
                    doubleGloveActiveCardNames.push(selectedGloveCards[1].name);
                }

                doubleGloveActivePierceValueSpan.textContent = doubleGloveActivePierceTotal;
                doubleGloveActiveCardsDisplaySpan.textContent = doubleGloveActiveCardNames.length > 0 ? doubleGloveActiveCardNames.map(name => `(${name})`).join(' + ') : '';

            } else {
                doubleGloveActivePierceSection.style.display = 'none';
                doubleGloveActivePierceValueSpan.textContent = '0';
                doubleGloveActiveCardsDisplaySpan.textContent = '';
            }

        } else {
            activePierceSection.style.display = 'none';
            doubleGloveActivePierceSection.style.display = 'none';
            activePierceValueSpan.textContent = '0';
            activeCardsDisplaySpan.textContent = '';
            doubleGloveActivePierceValueSpan.textContent = '0';
            doubleGloveActiveCardsDisplaySpan.textContent = '';
        }
    }

    createGrid();
    // calculateTotals will be called at the end of createGrid
});