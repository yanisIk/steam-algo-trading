//Import api libraries
//Init api libraries

////////////////// OPSKINS //////////////////


/**
 * Downloads a list of prices for the past 60 days for an entire app.
 * Prices are provided as the average sale price for an item in a particular day. \
 * The returned data is updated once every 24 hours
 * 
 * Example:
 * "AK-47 | Black Laminate (Factory New)": {
        "2016-08-10": { 
            "price": 10500 //avg price
        },
        "2016-08-14": {
            "price": 10810
        },
    },
 */
exports.getAllOpskinsAvgPrices = (steamAppId = 730) => {
    return new Promise((resolve, reject) => {
        let prices = {
            "AK-47 | Black Laminate (Factory New)": {
                "2016-08-10": {
                    "price": 10500
                },
                "2016-08-14": {
                    "price": 10810
                },
            },
            "AK-47 | Black Laminate (Field-Tested)": {
                "2016-08-10": {
                    "price": 494
                },
                "2016-08-11": {
                    "price": 489
                },
            },
        };
        resolve(prices);
    });
}

/**
 * Downloads the current lowest list price and quantity on sale for each item in an app.
 * Data is updated every 30mn
 * 
 * Example:
 * "AK-47 | Black Laminate (Battle-Scarred)": {
        "price": 590, //lowest price
        "quantity": 13 //all quantity in sale
    },
 */
exports.getAllOpskinsLowestPrices = (steamAppId = 730) => {
    return new Promise((resolve, reject) => {
        let prices = {
            "AK-47 | Black Laminate (Battle-Scarred)": {
                "price": 590,
                "quantity": 13
            },
            "AK-47 | Black Laminate (Factory New)": {
                "price": 9899,
                "quantity": 12
            },
        };
        resolve(prices);
    });
}

/**
 * Gets suggested prices for one or more items
 * @market_hash_names: limited to listing_limit at once
 * 
 * Example:
 * "AK-47 | Black Laminate (Battle-Scarred)": {
        "opskins_price": 590,
        "market_price": 600,
        "opskins_lowest_price": 570
    },
 */
exports.getOpskinsSuggestedPrices = (market_hash_names, steamAppId = 730) => {
    return new Promise((resolve, reject) => {
        let prices = {
            "AK-47 | Black Laminate (Battle-Scarred)": {
                "opskins_price": 590,
                "market_price": 600,
                "opskins_lowest_price": 570
            },
        };
        resolve(prices);
    });
}

/**
 * Search active OPSkins listings for particular items. 
 * This endpoint is relatively heavily rate-limited. 
 * Currently, it is limited to 20 requests per minute. 
 * To prevent bot sniping, this endpoint will only return listings which have been publicly visible for at least ten minutes,
 * and are not currently limited to Buyers Club members. 
 * This endpoint always returns 100 listings sorted from lowest to highest price.
 */
exports.getOpskinsSales = (market_hash_names,  min = 5, max = 3000, steamAppId = 730) => {
    return new Promise((resolve, reject) => {
        let items = [{
            id: "test",
            market_name: "test",
            appid: "test",
            type: "test",
            wear: "test",
            amount: "test",
            img: "test"
        }]
        resolve(items);
    });
}


//////////////// BITSKINS ///////////////////

/**
 * Retrieves the entire price database used at BitSkins.
 */
exports.getAllBitskinsItemPrices = () => {
    return new Promise((resolve, reject) => {
        let itemPrices = [{
            "appid": "730",
            "market_hash_name": "AK-47 | Aquamarine Revenge (Battle-Scarred)",
            "price": "11.74",
            "pricing_mode": "market",
            "skewness": "-0.01",
            "created_at": 1494507537
        }];
        resolve(itemPrices);
    });
}

/**
 * Allows you to retrieve basic price data for upto 250 market_hash_names from BitSkins at a time. 
 * This data is only for items currently on sale. Please make sure to URI encode your items' names.
 */
exports.getBitskinsMarketDataByItems = (market_hash_names) => {
    return new Promise((resolve, reject) => {
        let items = [{
            "market_hash_name": "AK-47 | Aquamarine Revenge (Battle-Scarred)",
            "total_items": 26,
            "lowest_price": "11.00",
            "highest_price": "21.47",
            "cumulative_price": "515.67",
            "recent_sales_info": {
                "hours": "8.56",
                "average_price": "10.11"
            },
            "updated_at": 1494510269
        }];
        resolve(items);
    });
}

/**
 * Allows you to retrieve the BitSkins inventory currently on sale.
 * This includes items you cannot buy (i.e., items listed for sale by you).
 * By default, upto 24 items per page, and optionally up to 480 items per page.
 * This method allows you to search the inventory just as the search function on the website allows you to search inventory.
 */
exports.getBitskinsItemsOnSale = (market_hash_name = "", page = 1, per_page = 480) => {
    return new Promise((resolve, reject) => {
        let items = [{
            "item_id": "10181800414",
            "class_id": "1012004440",
            "instance_id": "480085569",
            "market_hash_name": "AWP | Hyper Beast (Minimal Wear)",
            "item_type": "Sniper Rifle",
            "image": "steam url",
            "price": "32.89",
            "suggested_price": "34.93",
            "is_featured": true,
        }];
        resolve(items);
    });
}

/**
 * Allows you to retrieve upto 5 pages worth of recent sale data for a given item name.
 * These are the recent sales for the given item at BitSkins, in descending order.
 */
exports.getBitskinsRecentSalesInfo = (market_hash_name, page = 1) => {
    return new Promise((resolve, reject) => {
        let items = [{
            "market_hash_name": "AWP | Hyper Beast (Minimal Wear)",
            "price": "32.6500",
            "wear_value": "0.10555487",
            "sold_at": 1494613311
        }];
        resolve(items);
    });
}

exports.getAllBitskinsBuyOrders = () => {
    return new Promise((resolve, reject) => {
        let buyOrders = [
            "★ Bloodhound Gloves | Charred (Field-Tested)", {
                "number_of_buy_orders": 1,
                "max_price": "2.75",
                "min_price": "2.75",
                "my_buy_orders": null
            }
        ];
        resolve(buyOrders);
    });
}

exports.getBitskinsMarketBuyOrders = (market_hash_name, page = 1) => {
    return new Promise((resolve, reject) => {
        let buyOrders = [{
            "buy_order_id": 77294665,
            "market_hash_name": "AK-47 | Point Disarray (Battle-Scarred)",
            "price": "7.67",
            "suggested_price": "9.73",
            "is_mine": false,
            "created_at": 1494849873,
            "place_in_queue": 0
        }, {
            "buy_order_id": 79187961,
            "market_hash_name": "AK-47 | Point Disarray (Battle-Scarred)",
            "price": "7.54",
            "suggested_price": "9.73",
            "is_mine": false,
            "created_at": 1495043953,
            "place_in_queue": 1
        }];
        resolve(buyOrders);
    });
}