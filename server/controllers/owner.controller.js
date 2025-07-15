import User from "../models/User.model.js";


export const changeRoleToOwner = async(req, res) => {
    try {
        const {_id} = req.user;
        const updatedUser = await User.findByIdAndUpdate(_id, {role: "owner"});
        res.status(200).json({success: true, message: "Now you can list cars", updatedUser});

    } catch (error) {
        console.log("Error in changeRoleToOwner", error.message);       
        return res.status(500).json({success: false, message: error.message});
    }
}