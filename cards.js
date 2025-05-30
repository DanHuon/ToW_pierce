/**
 * structure:
 * {
 * name: "Card Name",
 * pierce: INT value,
 * type: "Column type" // "armor", "talisman", "headwear", "gloves", "weapon"
 * }
 */

const allCards = [
    // --- ARMOR CARDS ---
    { name: "Diva - Celestial", pierce: 180, type: "armor" },
    { name: "Zashiki Warashi", pierce: 151, type: "armor" },
    { name: "Tengu Raccoon", pierce: 143, type: "armor" },
    { name: "Kamaitachi", pierce: 124, type: "armor" },
    { name: "Keukegen", pierce: 81, type: "armor" },
    { name: "Blue Heron", pierce: 59, type: "armor" },
    { name: "Loras", pierce: 43, type: "armor" },
    { name: "Mina", pierce: 43, type: "armor" },

    // --- TALISMAN CARDS ---
    { name: "Fortune Estrid", pierce: 246, type: "talisman" },
    { name: "Hakuzosu", pierce: 200, type: "talisman" },
    { name: "Ananre", pierce: 180, type: "talisman" },
    { name: "Chimehime", pierce: 152, type: "talisman" },
    { name: "Kitsunebi", pierce: 124, type: "talisman" },
    { name: "Kodama", pierce: 108, type: "talisman" },
    { name: "Chie", pierce: 108, type: "talisman" },

    // --- HEADWEAR CARDS ---
    { name: "Onikiri", pierce: 200, type: "headwear" },
    { name: "Kinnara", pierce: 180, type: "headwear" },
    { name: "Kubinashi", pierce: 124, type: "headwear" },
    { name: "Mayu", pierce: 108, type: "headwear" },

    // --- GLOVES CARDS ---
    { name: "Butterfly Hime - Akane", pierce: 246, type: "gloves" },
    { name: "Ice Spirit", pierce: 180, type: "gloves" },
    { name: "Yasutsuna", pierce: 120, type: "gloves" },

    // --- WEAPON CARDS ---
    { name: "Blood Sakura", pierce: 200, type: "weapon" },
    { name: "Enenra", pierce: 150, type: "weapon" },

];

const emptyCard = { name: "Empty", pierce: 0, type: "any" };

function getCardsByType(type) {
    const filteredCards = allCards.filter(card => card.type === type);
    return [emptyCard, ...filteredCards];
}