{
    market_hash_name: String,
    image_url: String,
    item_type: String,
    market_price: Number, //csgo steam analyst
    sales: [{
        market_name: String,
        price: Number,
        wear_value: Number,
        sold_at: Date
    }],
    avg_market_prices: [{
        market_name: String,
        price: Number
    }],
    avg_sale_prices: [{
        market_name: String,
        date: Date,
        avg_price: Number
    }],
    updated_at: Date
}

/**
 
FLOAT VALUES CHART

Factory New: 0.00 - 0.07
Minimal Wear: 0.07 - 0.15
Field-Tested: 0.15 - 0.37
Well-Worn: 0.37 - 0.44
Battle-Scarred: 0.44 - 1.00

 */

const topSkins = ["AK-47 | Redline (Field-Tested)", "AK-47 | Frontside Misty (Field-Tested)", "USP-S | Cyrex (Minimal Wear)", "Glock-18 | Water Elemental (Field-Tested)", "AWP | Phobos (Factory New)", "AK-47 | Cartel (Field-Tested)", "StatTrak™ AK-47 | Elite Build (Field-Tested)", "M4A1-S | Decimator (Field-Tested)", "M4A4 | Desolate Space (Field-Tested)", "Glock-18 | Water Elemental (Minimal Wear)", "M4A4 | 龍王 (Dragon King) (Field-Tested)", "AWP | Elite Build (Field-Tested)", "M4A4 | Evil Daimyo (Factory New)", "AWP | Sun in Leo (Minimal Wear)", "M4A1-S | Hyper Beast (Field-Tested)", "AK-47 | Blue Laminate (Minimal Wear)", "Desert Eagle | Kumicho Dragon (Field-Tested)", "CS:GO Weapon Case", "StatTrak™ AK-47 | Elite Build (Well-Worn)", "Operation Bravo Case", "AK-47 | Cartel (Minimal Wear)", "AWP | Man-o'-war (Minimal Wear)", "UMP-45 | Primal Saber (Field-Tested)", "AK-47 | Blue Laminate (Field-Tested)", "P250 | Asiimov (Field-Tested)", "M4A4 | 龍王 (Dragon King) (Minimal Wear)", "USP-S | Cyrex (Factory New)", "StatTrak™ AK-47 | Elite Build (Minimal Wear)", "AWP | Fever Dream (Field-Tested)", "AWP | Fever Dream (Minimal Wear)", "M4A1-S | Atomic Alloy (Field-Tested)", "AK-47 | Blue Laminate (Factory New)", "M4A1-S | Atomic Alloy (Minimal Wear)", "AK-47 | Point Disarray (Field-Tested)", "AWP | Asiimov (Field-Tested)", "AWP | Corticera (Minimal Wear)", "AWP | Asiimov (Battle-Scarred)", "AWP | Redline (Field-Tested)", "CZ75-Auto | Xiangliu (Field-Tested)", "MAC-10 | Neon Rider (Minimal Wear)", "M4A1-S | Cyrex (Field-Tested)", "USP-S | Orion (Minimal Wear)", "AK-47 | Aquamarine Revenge (Field-Tested)", "M4A1-S | Decimator (Minimal Wear)", "AK-47 | Elite Build (Factory New)", "AWP | Sun in Leo (Factory New)", "P90 | Asiimov (Field-Tested)", "AK-47 | Frontside Misty (Minimal Wear)", "M4A4 | Desolate Space (Well-Worn)", "M4A4 | Desolate Space (Minimal Wear)", "StatTrak™ AK-47 | Elite Build (Battle-Scarred)", "CZ75-Auto | Xiangliu (Minimal Wear)", "M4A1-S | Guardian (Minimal Wear)", "StatTrak™ AWP | Worm God (Field-Tested)", "AWP | Redline (Minimal Wear)", "M4A1-S | Cyrex (Minimal Wear)", "AK-47 | Vulcan (Field-Tested)", "USP-S | Caiman (Minimal Wear)", "AWP | Hyper Beast (Field-Tested)", "AWP | Elite Build (Minimal Wear)", "StatTrak™ USP-S | Guardian (Field-Tested)", "AWP | Fever Dream (Factory New)", "StatTrak™ AWP | Worm God (Minimal Wear)", "M4A1-S | Hyper Beast (Well-Worn)", "AK-47 | Neon Revolution (Field-Tested)", "MP7 | Nemesis (Minimal Wear)", "M4A1-S | Golden Coil (Field-Tested)", "M4A1-S | Bright Water (Minimal Wear)", "Desert Eagle | Kumicho Dragon (Minimal Wear)", "StatTrak™ USP-S | Torque (Factory New)", "StatTrak™ USP-S | Guardian (Minimal Wear)", "M4A1-S | Nitro (Factory New)", "M4A4 | Desert-Strike (Minimal Wear)", "M4A1-S | Mecha Industries (Field-Tested)", "StatTrak™ Desert Eagle | Oxide Blaze (Minimal Wear)", "StatTrak™ Desert Eagle | Oxide Blaze (Factory New)", "M4A4 | Desolate Space (Battle-Scarred)", "M4A4 | The Battlestar (Field-Tested)", "AK-47 | Wasteland Rebel (Field-Tested)", "AK-47 | Emerald Pinstripe (Factory New)", "Nova | Hyper Beast (Minimal Wear)", "M4A1-S | Hyper Beast (Minimal Wear)", "AWP | Elite Build (Well-Worn)", "AWP | Asiimov (Well-Worn)", "Sticker | Unicorn (Holo)", "CZ75-Auto | Xiangliu (Factory New)", "Tec-9 | Fuel Injector (Minimal Wear)", "M4A1-S | Guardian (Factory New)", "StatTrak™ AK-47 | Redline (Field-Tested)", "StatTrak™ AWP | Worm God (Factory New)", "M4A1-S | Cyrex (Factory New)", "StatTrak™ M4A4 | Evil Daimyo (Field-Tested)", "UMP-45 | Primal Saber (Minimal Wear)", "AWP | BOOM (Minimal Wear)", "M4A1-S | Decimator (Battle-Scarred)", "AK-47 | Frontside Misty (Well-Worn)", "M4A1-S | Guardian (Field-Tested)", "StatTrak™ Music Kit | Hundredth, FREE", "Glock-18 | Water Elemental (Factory New)", "USP-S | Orion (Factory New)"]