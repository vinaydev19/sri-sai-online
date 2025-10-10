function getDateGroupFormat(range) {
    switch (range) {
        case "1d":
            return "%Y-%m-%d"; // today
        case "7d":
            return "%Y-%m-%d"; // each day
        case "1m":
        case "3m":
        case "6m":
            return "%Y-%U"; // week number
        case "1y":
            return "%Y-%m"; // month
        case "life":
            return "%Y"; // year
        default:
            return "%Y-%m-%d";
    }
}


export { getDateGroupFormat };