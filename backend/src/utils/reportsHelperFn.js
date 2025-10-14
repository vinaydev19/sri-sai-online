function getDateGroupFormat(range) {
    switch (range) {
        case "1d":
            return "%Y-%m-%d";
        case "7d":
            return "%Y-%m-%d";
        case "1m":
            return "%Y-%U";
        case "3m":
            return "%Y-%U";
        case "6m":
            return "%Y-%U";
        case "1y":
            return "%Y-%m";
        case "life":
            return "%Y";
        default:
            return "%Y-%m-%d";
    }
}


export { getDateGroupFormat };