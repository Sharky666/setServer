exports = module.exports = {
    resultHandling: {
        getResultStruct: () => {
            return {
                result: null,
                error: null
            }
        },

        handleResults: (response, results) => {
            if (results.result) {
                response.status(200).json(results);
            }
                //client did a bad request
            else {
                response.status(403).json(results);
            }
        
        }
    }
}