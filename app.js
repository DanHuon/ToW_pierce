document.addEventListener('DOMContentLoaded', () => {
    // Calculator Elements
    const gridContainer = document.getElementById('gridContainer');
    const passivePierceValueSpan = document.getElementById('passivePierceValue');
    const activePierceValueSpan = document.getElementById('activePierceValue');
    const activeCardsDisplaySpan = document.getElementById('activeCardsDisplay');
    const doubleGloveActivePierceValueSpan = document.getElementById('doubleGloveActivePierceValue');
    const doubleGloveActiveCardsDisplaySpan = document.getElementById('doubleGloveActiveCardsDisplay');
    const activePierceSection = document.getElementById('activePierceSection');
    const doubleGloveActivePierceSection = document.getElementById('doubleGloveActivePierceSection');
    const passiveGloryLevelSpan = document.getElementById('passiveGloryLevel');
    const activeGloryLevelSpan = document.getElementById('activeGloryLevel');
    const doubleGloveGloryLevelSpan = document.getElementById('doubleGloveGloryLevel');

    // Tabs Elements
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const calculatorTabContent = document.getElementById('calculator');

    // Catalog Elements
    const cardsCatalogGrid = document.getElementById('cardsCatalogGrid');

    // Card Detail Modal Elements
    const cardDetailModal = document.getElementById('cardDetailModal');
    const modalCloseButton = document.querySelector('.modal-close-button');
    const modalCardName = document.getElementById('modalCardName');
    const modalCardDetailImage = document.getElementById('modalCardDetailImage');
    const modalDetailImagePlaceholder = document.getElementById('modalDetailImagePlaceholder');
    const modalCardPierceValue = document.getElementById('modalCardPierceValue');

    // Glory Requirements Data
    const gloryRequirements = [
        [30, 80, 150, 250, 350],         // Floor 1
        [150, 280, 420, 580, 740],      // Floor 2
        [320, 570, 820, 1040, 1230],     // Floor 3
        [580, 810, 1375, 1840, 2140],    // Floor 4
        [1140, 1590, 2040, 2490, 2940],  // Floor 5
        [1500, 2050, 2750, 3500, 3950],  // Floor 6
        [1700, 3050, 4300, 4800, 5050],  // Floor 7
        [2200, 4150, 5250, 5950, 6200]   // Floor 8
    ];

    // Calculator Definitions
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

    // --- Tabs Logic ---
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTabId = button.dataset.tab;
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === targetTabId) {
                    content.classList.add('active');
                }
            });
            if (targetTabId === 'catalog' && cardsCatalogGrid && cardsCatalogGrid.children.length === 0) {
                populateCardsCatalog();
            }
        });
    });

    // --- Card Detail Modal Logic ---
    function openCardDetailModal(card) {
        if (!card || !cardDetailModal) return;
        modalCardName.textContent = card.name;
        modalCardDetailImage.style.display = 'none';
        if (modalDetailImagePlaceholder) modalDetailImagePlaceholder.style.display = 'none';
        if (card.detailsImageFile && card.detailsImageFile.trim() !== "") {
            modalCardDetailImage.src = `images/${card.detailsImageFile}`;
            modalCardDetailImage.alt = `${card.name} details`;
            modalCardDetailImage.style.display = 'block';
        } else {
            if (modalDetailImagePlaceholder) modalDetailImagePlaceholder.style.display = 'flex';
        }
        modalCardDetailImage.onerror = function() {
            this.style.display = 'none';
            if (modalDetailImagePlaceholder) modalDetailImagePlaceholder.style.display = 'flex';
        };
        modalCardPierceValue.textContent = card.pierce || 0;
        cardDetailModal.style.display = 'flex';
    }

    function closeCardDetailModal() {
        if (!cardDetailModal) return;
        cardDetailModal.style.display = 'none';
    }

    if (modalCloseButton) {
        modalCloseButton.addEventListener('click', closeCardDetailModal);
    }
    if (cardDetailModal) {
        cardDetailModal.addEventListener('click', (event) => {
            if (event.target === cardDetailModal) {
                closeCardDetailModal();
            }
        });
    }

    // --- Cards Catalog Logic ---
    function populateCardsCatalog() {
        if (!cardsCatalogGrid) return;
        cardsCatalogGrid.innerHTML = '';
        const allCatalogCards = getAllCardsForCatalog();
        allCatalogCards.forEach(card => {
            const cardDiv = document.createElement('div');
            cardDiv.classList.add('catalog-card');
            cardDiv.addEventListener('click', () => openCardDetailModal(card));
            const imgContainer = document.createElement('div');
            if (card.imageFile && card.imageFile.trim() !== "") {
                const img = document.createElement('img');
                img.src = `images/${card.imageFile}`;
                img.alt = card.name;
                img.onerror = function() {
                    this.remove();
                    const placeholder = document.createElement('div');
                    placeholder.classList.add('catalog-card-placeholder');
                    placeholder.textContent = 'Image N/A';
                    imgContainer.appendChild(placeholder);
                };
                imgContainer.appendChild(img);
            } else {
                const placeholder = document.createElement('div');
                placeholder.classList.add('catalog-card-placeholder');
                placeholder.textContent = 'No Image';
                imgContainer.appendChild(placeholder);
            }
            cardDiv.appendChild(imgContainer);
            const nameSpan = document.createElement('span');
            nameSpan.classList.add('catalog-card-name');
            nameSpan.textContent = card.name;
            cardDiv.appendChild(nameSpan);
            cardsCatalogGrid.appendChild(cardDiv);
        });
    }

    // --- Calculator Logic ---
    function createGrid() {
        if (!gridContainer) return;
        gridContainer.innerHTML = '';
        columnDefinitions.forEach(colDef => {
            const columnDiv = document.createElement('div');
            columnDiv.classList.add('column');
            columnDiv.dataset.columnId = colDef.id;
            const columnTitle = document.createElement('div');
            columnTitle.classList.add('column-title');
            columnTitle.textContent = colDef.name;
            columnDiv.appendChild(columnTitle);
            const cardsForColumn = getCardsByType(colDef.type);
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
            const assistSlotIndexInArray = regularSlotsPerColumn;
            const assistSlotDiv = document.createElement('div');
            assistSlotDiv.classList.add('assist-slot');
            const assistSlotLabel = document.createElement('span');
            assistSlotLabel.classList.add('slot-label');
            assistSlotLabel.textContent = `Assist 1`;
            assistSlotDiv.appendChild(assistSlotLabel);
            const assistSelect = document.createElement('select');
            assistSelect.dataset.slotIndex = assistSlotIndexInArray;
            assistSelect.dataset.slotType = 'assist';
            assistSelect.dataset.columnType = colDef.type;
            populateSelectWithOptions(assistSelect, cardsForColumn, colDef.id, assistSlotIndexInArray);
            assistSelect.addEventListener('change', (event) => handleSelectionChange(event, colDef.id, assistSlotIndexInArray));
            assistSlotDiv.appendChild(assistSelect);
            columnDiv.appendChild(assistSlotDiv);
            gridContainer.appendChild(columnDiv);
        });
        updateAllSelects();
        calculateTotals();
    }

    function populateSelectWithOptions(selectElement, availableCards, columnId, slotIndex) {
        const previouslySelectedValue = selectElement.value;
        selectElement.innerHTML = '';
        const slotType = selectElement.dataset.slotType;
        availableCards.forEach(card => {
            const isSelectedInAnotherSlotInSameColumn = selectedCardsByColumn[columnId]
                .some((selectedCardName, sIndex) => sIndex !== slotIndex && selectedCardName === card.name && card.name !== "Empty");
            if (!isSelectedInAnotherSlotInSameColumn || card.name === "Empty") {
                const option = document.createElement('option');
                option.value = card.name;
                const pierceValue = (slotType === 'assist' ? (card.assistPierce || 0) : (card.pierce || 0));
                option.textContent = `${card.name} (+${pierceValue})`;
                option.dataset.cardName = card.name;
                option.dataset.pierce = card.pierce || 0;
                option.dataset.assistPierce = card.assistPierce || 0;
                option.dataset.activePierce = card.activePierce || 0;
                option.dataset.cardType = card.type;
                selectElement.appendChild(option);
            }
        });
        const currentOptions = Array.from(selectElement.options).map(opt => opt.value);
        if (currentOptions.includes(previouslySelectedValue)) {
            selectElement.value = previouslySelectedValue;
        } else {
            selectElement.value = "Empty";
            if (previouslySelectedValue && previouslySelectedValue !== "Empty") {
                selectedCardsByColumn[columnId][slotIndex] = "Empty";
            }
        }
        if (!selectElement.value && selectElement.options.length > 0 && currentOptions.includes("Empty")) {
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
        const columnElement = calculatorTabContent.querySelector(`.column[data-column-id="${columnId}"]`);
        if (!columnElement) return;
        const selectsInColumn = columnElement.querySelectorAll('select');
        if (selectsInColumn.length === 0) return;
        const columnType = selectsInColumn[0].dataset.columnType;
        const cardsForColumn = getCardsByType(columnType);
        selectsInColumn.forEach(select => {
            const slotIndex = parseInt(select.dataset.slotIndex);
            populateSelectWithOptions(select, cardsForColumn, columnId, slotIndex);
        });
    }

    function updateAllSelects() {
        columnDefinitions.forEach(colDef => {
            if (calculatorTabContent.querySelector(`.column[data-column-id="${colDef.id}"]`)) {
                updateSelectsInColumn(colDef.id);
            }
        });
    }

    function getGloryLevel(pierce) {
        if (pierce < gloryRequirements[0][0]) return "";

        let highestResult = { floor: 0, stage: 0 };

        for (let floorIndex = gloryRequirements.length - 1; floorIndex >= 0; floorIndex--) {
            const stages = gloryRequirements[floorIndex];
            for (let stageIndex = stages.length - 1; stageIndex >= 0; stageIndex--) {
                if (pierce >= stages[stageIndex]) {
                    highestResult = { floor: floorIndex + 1, stage: stageIndex + 1 };
                    break;
                }
            }
            if (highestResult.floor > 0) {
                break;
            }
        }

        if (highestResult.floor === 0) return "";

        let mainString = `Glory ${highestResult.floor}f stage ${highestResult.stage}`;

        if (highestResult.stage < 5 && highestResult.floor > 1) {
            const prevFloorIndex = highestResult.floor - 2;
            const prevFloorStages = gloryRequirements[prevFloorIndex];
            for (let stageIndex = prevFloorStages.length - 1; stageIndex >= 0; stageIndex--) {
                if (pierce >= prevFloorStages[stageIndex]) {
                    mainString += ` // ${prevFloorIndex + 1}f stage ${stageIndex + 1}`;
                    break;
                }
            }
        }
        return mainString;
    }

    function calculateTotals() {
        if (!passivePierceValueSpan) return;

        let passivePierce = 0;
        const selectedWeaponCards = [];
        const selectedGloveCards = [];

        const allSelects = calculatorTabContent.querySelectorAll('select');
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
                    selectedWeaponCards.push({ name: cardData.name, activePierce: cardData.activePierce || 0 });
                }
                if (cardData.type === 'gloves' && (cardData.activePierce || 0) > 0) {
                    selectedGloveCards.push({ name: cardData.name, activePierce: cardData.activePierce || 0 });
                }
            }
        });

        passivePierceValueSpan.textContent = passivePierce;
        if (passiveGloryLevelSpan) passiveGloryLevelSpan.textContent = getGloryLevel(passivePierce);

        selectedWeaponCards.sort((a, b) => b.activePierce - a.activePierce);
        selectedGloveCards.sort((a, b) => b.activePierce - a.activePierce);

        const hasWeaponOrGlove = selectedWeaponCards.length > 0 || selectedGloveCards.length > 0;

        if (hasWeaponOrGlove) {
            activePierceSection.style.display = 'block';
            let activePierceTotal = passivePierce;
            let activeCardNames = [];
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
            if (activeGloryLevelSpan) activeGloryLevelSpan.textContent = getGloryLevel(activePierceTotal);

            if (selectedGloveCards.length >= 2) {
                doubleGloveActivePierceSection.style.display = 'block';
                let doubleGloveActivePierceTotal = passivePierce;
                let doubleGloveActiveCardNames = [];
                if (selectedWeaponCards.length > 0) {
                    doubleGloveActivePierceTotal += selectedWeaponCards[0].activePierce;
                    doubleGloveActiveCardNames.push(selectedWeaponCards[0].name);
                }
                doubleGloveActivePierceTotal += selectedGloveCards[0].activePierce;
                doubleGloveActiveCardNames.push(selectedGloveCards[0].name);
                doubleGloveActivePierceTotal += selectedGloveCards[1].activePierce;
                doubleGloveActiveCardNames.push(selectedGloveCards[1].name);
                doubleGloveActivePierceValueSpan.textContent = doubleGloveActivePierceTotal;
                doubleGloveActiveCardsDisplaySpan.textContent = doubleGloveActiveCardNames.length > 0 ? doubleGloveActiveCardNames.map(name => `(${name})`).join(' + ') : '';
                if (doubleGloveGloryLevelSpan) doubleGloveGloryLevelSpan.textContent = getGloryLevel(doubleGloveActivePierceTotal);
            } else {
                doubleGloveActivePierceSection.style.display = 'none';
            }
        } else {
            activePierceSection.style.display = 'none';
            doubleGloveActivePierceSection.style.display = 'none';
        }
    }

    if (gridContainer) {
        createGrid();
    }
});