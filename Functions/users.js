export const GetUsers = async () => {
    try {

        console.log("Fetching all users...");
        // below is just an example for now
        const users = [
            {
                id: 1,
                name: "Jane Doe"
            }
        ];
        return {
            success: true,
            payload: users
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}
