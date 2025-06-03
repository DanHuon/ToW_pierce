/**
 * structure:
 * {
 * name: "Card Name",
 * pierce: INT value,
 * assistPierce: INT value,
 * activePierce: INT value,
 * type: "Column type" // "armor", "talisman", "headwear", "gloves", "weapon"
 * }
 */

const allCards = [
    // --- ARMOR CARDS ---
    { name: "Diva - Celestial", pierce: 180, assistPierce: 19, type: "armor" },
    { name: "Zashiki Warashi", pierce: 151, assistPierce: 15, type: "armor" },
    { name: "Tengu Raccoon", pierce: 143, assistPierce: 15, type: "armor" },
    { name: "Kamaitachi", pierce: 124, assistPierce: 15, type: "armor" },
    { name: "Keukegen", pierce: 81, type: "armor" },
    { name: "Blue Heron", pierce: 59, type: "armor" },
    { name: "Loras", pierce: 43, type: "armor" },
    { name: "Mina", pierce: 43, type: "armor" },

    // --- TALISMAN CARDS ---
    { name: "Fortune Estrid", pierce: 246, assistPierce: 25, type: "talisman" },
    { name: "Hakuzosu", pierce: 200, assistPierce: 21, type: "talisman" },
    { name: "Ananre", pierce: 180, assistPierce: 19, type: "talisman" },
    { name: "Chimehime", pierce: 152, assistPierce: 18, type: "talisman" },
    { name: "Kitsunebi", pierce: 124, assistPierce: 15, type: "talisman" },
    { name: "Kodama", pierce: 108, type: "talisman" },
    { name: "Chie", pierce: 108, type: "talisman" },

    // --- HEADWEAR CARDS ---
    { name: "Onikiri", pierce: 200, assistPierce: 21, type: "headwear" },
    { name: "Kinnara", pierce: 180, assistPierce: 19, type: "headwear" },
    { name: "Kubinashi", pierce: 124, assistPierce: 15, type: "headwear" },
    { name: "Mayu", pierce: 108, type: "headwear" },

    // --- GLOVES CARDS ---
    { name: "Butterfly Hime - Akane", pierce: 246, assistPierce: 25, activePierce: 210, type: "gloves" },
    { name: "Ice Spirit", pierce: 180, assistPierce: 19, activePierce: 180, type: "gloves" },
    { name: "Yasutsuna", pierce: 120, assistPierce: 9, activePierce: 100, type: "gloves" },

    // --- WEAPON CARDS ---
    { name: "Blood Sakura", pierce: 200, assistPierce: 21, activePierce: 200, type: "weapon" },
    { name: "Enenra", pierce: 150, assistPierce: 12, activePierce: 175, type: "weapon" },
];

const emptyCard = { name: "Empty", pierce: 0, assistPierce: 0, activePierce: 0, type: "any" };

function getCardByName(name) {
    if (name === "Empty") return emptyCard;
    return allCards.find(card => card.name === name) || emptyCard;
}

function getCardsByType(type) {
    const filteredCards = allCards.filter(card => card.type === type);
    return [emptyCard, ...filteredCards];
}