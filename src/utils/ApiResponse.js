// It is used to send a standardised successful API response in JSON format from your Express backend (like in your signup/login APIs you're building).

class ApiResponse{
    constructor(statusCode, data, message = "Success"){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}

export {ApiResponse}
//class for ApiResponse to make it standard

// | Status Code Range | Meaning        |
// | ----------------- | -------------- |
// | 100–199           | Informational  |
// | 200–299           | Success ✅      |
// | 300–399           | Redirection    |
// | 400–499           | Client Error ❌ |
// | 500–599           | Server Error ❌ |
