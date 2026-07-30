import Users from "../Schemas/user.js";

export const GetClientList = async (userId) => {
  try {
    const user = await Users.findById(userId).select("clients").lean();
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }
    return {
      success: true,
      clients: user.clients,
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while fetching the client list",
    };
  }
};

export const AddClient = async (userId, clientData) => {
  try {
    const user = await Users.findById(userId);
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    user.clients.push(clientData);
    await user.save();
    return {
      success: true,
      message: "Client added successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while adding the client",
    };
  }
};

export const DeleteClient = async (userId, clientId) => {
  try {
    const user = await Users.findById(userId);
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }
    const clientIndex = user.clients.findIndex(client => client._id.toString() === clientId);
    if (clientIndex === -1) {
      return {
        success: false,
        message: "Client not found",
      };
    }
    user.clients.splice(clientIndex, 1);
    await user.save();
    return {
      success: true,
      message: "Client deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while deleting the client",
    };
  }
};