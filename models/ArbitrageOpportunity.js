{
    market_hash_name: String,
    wear_value: Number,
    from_market_name: String,
    to_market_name: String,
    from_market_price: Number,
    status: Number, //(on buy market: 0 | bought: 1 | in inventory: 2 | pending listing: 3 | on sell market: 4 | sold on market: 5)
    is_in_use: Boolean, //Indicates if item is being processed
    error: String, //When an error happens during the process
    bought_at: Date,
    bought_for: Number,
    sold_at: Date,
    sold_for: Number,
    created_at: Date,
    updated_at: Date
}