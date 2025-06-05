/**
 * structure:
 * {
 * name: "Card Name",
 * pierce: INT value,
 * assistPierce: INT value,
 * activePierce: INT value,
 * type: "Column type" // "armor", "talisman", "headwear", "gloves", "weapon"
 * imageFile: "image_name.webp"
 * detailsImageFile: "image_detail_name.webp"
 * }
 */

const allCards = [
    // --- ARMOR CARDS ---
    { name: "(Unofficial)Dezeria A", pierce: 211, assistPierce: 23, type: "armor", imageFile: "dezeria_a.webp", detailsImageFile: "dezeria_a_details.webp" },
    { name: "Diva - Celestial", pierce: 180, assistPierce: 19, type: "armor", imageFile: "diva_celestial.webp", detailsImageFile: "diva_celestial_details.webp" },
    { name: "Zashiki Warashi", pierce: 151, assistPierce: 15, type: "armor", imageFile: "zashiki_warashi.webp", detailsImageFile: "zashiki_warashi_details.webp" },
    { name: "Tengu Raccoon", pierce: 143, assistPierce: 15, type: "armor", imageFile: "tengu_raccoon.webp", detailsImageFile: "tengu_raccoon_details.webp" },
    { name: "Kamaitachi", pierce: 124, assistPierce: 15, type: "armor", imageFile: "kamaitachi.webp", detailsImageFile: "kamaitachi_details.webp" },
    { name: "Keukegen", pierce: 81, type: "armor", imageFile: "keukegen.webp", detailsImageFile: "keukegen_details.webp" },
    { name: "Blue Heron", pierce: 59, type: "armor", imageFile: "blue_heron.webp", detailsImageFile: "blue_heron_details.webp" },
    { name: "Loras", pierce: 43, type: "armor", imageFile: "loras.webp", detailsImageFile: "loras_details.webp" },
    { name: "Mina", pierce: 43, type: "armor", imageFile: "mina.webp", detailsImageFile: "mina_details.webp" },

    // --- TALISMAN CARDS ---
    { name: "Fortune Estrid", pierce: 246, assistPierce: 25, type: "talisman", imageFile: "fortune_estrid.webp", detailsImageFile: "fortune_estrid_details.webp" },
    { name: "Hakuzosu", pierce: 200, assistPierce: 21, type: "talisman", imageFile: "hakuzosu.webp", detailsImageFile: "hakuzosu_details.webp" },
    { name: "Ananre", pierce: 180, assistPierce: 19, type: "talisman", imageFile: "ananre.webp", detailsImageFile: "ananre_details.webp" },
    { name: "Chimehime", pierce: 152, assistPierce: 18, type: "talisman", imageFile: "chimehime.webp", detailsImageFile: "chimehime_details.webp" },
    { name: "Kitsunebi", pierce: 124, assistPierce: 15, type: "talisman", imageFile: "kitsunebi.webp", detailsImageFile: "kitsunebi_details.webp" },
    { name: "Kodama", pierce: 108, type: "talisman", imageFile: "kodama.webp", detailsImageFile: "kodama_details.webp" },
    { name: "Chie", pierce: 108, type: "talisman", imageFile: "chie.webp", detailsImageFile: "chie_details.webp" },

    // --- HEADWEAR CARDS ---
    { name: "(Unofficial)Blood Phantom Princess - Camellia", pierce: 204, assistPierce: 25, type: "headwear", imageFile: "camellia.webp", detailsImageFile: "camellia_details.webp" },
    { name: "Onikiri", pierce: 200, assistPierce: 21, type: "headwear", imageFile: "onikiri.webp", detailsImageFile: "onikiri_details.webp" },
    { name: "Kinnara", pierce: 180, assistPierce: 19, type: "headwear", imageFile: "kinnara.webp", detailsImageFile: "kinnara_details.webp" },
    { name: "Kubinashi", pierce: 124, assistPierce: 15, type: "headwear", imageFile: "kubinashi.webp", detailsImageFile: "kubinashi_details.webp" },
    { name: "Mayu", pierce: 108, type: "headwear", imageFile: "mayu.webp", detailsImageFile: "mayu_details.webp" },

    // --- GLOVES CARDS ---
    { name: "Butterfly Hime - Akane", pierce: 246, assistPierce: 25, activePierce: 210, type: "gloves", imageFile: "butterfly_hime_akane.webp", detailsImageFile: "butterfly_hime_akane_details.webp" },
    { name: "Ice Spirit", pierce: 180, assistPierce: 19, activePierce: 180, type: "gloves", imageFile: "ice_spirit.webp", detailsImageFile: "ice_spirit_details.webp" },
    { name: "Yasutsuna", pierce: 120, assistPierce: 9, activePierce: 100, type: "gloves", imageFile: "yasutsuna.webp", detailsImageFile: "yasutsuna_details.webp" },

    // --- WEAPON CARDS ---
    { name: "Blood Sakura", pierce: 200, assistPierce: 21, activePierce: 200, type: "weapon", imageFile: "blood_sakura.webp", detailsImageFile: "blood_sakura_details.webp" },
    { name: "Enenra", pierce: 150, assistPierce: 12, activePierce: 175, type: "weapon", imageFile: "enenra.webp", detailsImageFile: "enenra_details.webp" },
];

const emptyCard = { name: "Empty", pierce: 0, assistPierce: 0, activePierce: 0, type: "any", imageFile: null, detailsImageFile: null };

function getCardByName(name) {
    if (name === "Empty" || !name) return {...emptyCard};
    const card = allCards.find(card => card.name === name);
    return card ? {...card} : {...emptyCard};
}

function getCardsByType(type) {
    const filteredCards = allCards.filter(card => card.type === type);
    return [emptyCard, ...filteredCards.map(card => ({...card}))];
}

function getAllCardsForCatalog() {
    return allCards.map(card => ({...card}));
}