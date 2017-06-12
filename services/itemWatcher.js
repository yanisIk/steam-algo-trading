const marketClient = require("./marketClient");

exports.getAllItemsOnSale = () => {
    let opskinsItemsPromise = marketClient.getOpskinsSales();
    let bitskinsItemsPromise = marketClient.getBitskinsItemsOnSale();

    return Promise.all([opskinsItemsPromise, bitskinsItemsPromise])
    .then((results) => {
        //consolidate
    })
}