const caregiverModel = require("../models/caregiverModel")
const userModel = require("../models/userModels")

// const getAllUsersController = async (req, res) => {
//     try {
//         const users = await userModel.find({ role: "client" })
//         res.status(200).send({
//             success: true,
//             message: "Successfully fetched users",
//             data: users
//         })
//     } catch (error) {
//         console.log(error)
//         res.status(500).send({
//             success: false,
//             message: "Error while fetching users",
//             error
//         })
//     }
// }

const getAllUsersController = async (req, res) => {
    const perPage = 10;
    const page = req.query.page || 1;

    try {
        const users = await userModel
            .find({ role: "client" })
            .skip((page - 1) * perPage)
            .limit(perPage);

        const totalUsersCount = await userModel.countDocuments({ role: "client" });
        const totalPages = Math.ceil(totalUsersCount / perPage);

        res.status(200).send({
            success: true,
            message: "Successfully fetched users",
            data: users,
            totalPages: totalPages,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while fetching users",
            error,
        });
    }
};


// const getAllCaregiversController = async (req, res) => {
//     try {
//         const users = await userModel.find({ role: { $in: ["nurse", "babysitter"] } })
//         const nurses = await caregiverModel.find({})

//         const nurseDetailsMap = {};
//         nurses.forEach(nurse => {
//             nurseDetailsMap[nurse.userId] = nurse;
//         });

//         // Combine user details with caregiver-specific details
//         const caregivers = users.map(user => {
//             const nurseDetails = nurseDetailsMap[user._id];
//             // Combine common details from user and nurse-specific details
//             return {
//                 ...user._doc,
//                 ...(nurseDetails ? { ...nurseDetails._doc } : {})
//             };
//         });
//         //TODO: CREATING BABYSITTER APPLY ROUTES AND FETCHING THEM
//         res.status(200).send({
//             success: true,
//             message: "Successfully fetched caregivers",
//             data: caregivers
//         })
//     } catch (error) {
//         console.log(error)
//         res.status(500).send({
//             success: false,
//             message: "Error while fetching caregivers",
//             error
//         })
//     }
// }


const getAllCaregiversController = async (req, res) => {
    const perPage = 10;
    const page = req.query.page || 1;

    try {
        const users = await userModel
            .find({ role: { $in: ["nurse", "babysitter"] } })
            .skip((page - 1) * perPage)
            .limit(perPage);

        const nurses = await caregiverModel.find({});

        const nurseDetailsMap = {};
        nurses.forEach(nurse => {
            nurseDetailsMap[nurse.userId] = nurse;
        });

        // Combine user details with caregiver-specific details
        const caregivers = users.map(user => {
            const nurseDetails = nurseDetailsMap[user._id];
            // Combine common details from user and nurse-specific details
            return {
                ...user._doc,
                ...(nurseDetails ? { ...nurseDetails._doc } : {})
            };
        });

        // Fetch the total count of caregivers
        const totalCaregiversCount = await userModel
            .find({ role: { $in: ["nurse", "babysitter"] } })
            .countDocuments();

        const totalPages = Math.ceil(totalCaregiversCount / perPage);

        res.status(200).send({
            success: true,
            message: "Successfully fetched caregivers",
            data: caregivers,
            totalPages: totalPages,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while fetching caregivers",
            error,
        });
    }
};

const getAdminDetailsController = async (req, res) => {
    try {
        const admin = await userModel.findOne({ role: "admin" })

        res.status(200).send({
            success: true,
            message: "Admin details fetched successfully",
            data: admin
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while fetching admin details",
            error
        })
    }
}


//CAREGIVER ACCOUNT STATUS
const changeAccountStatusController = async (req, res) => {
    try {
        const { caregiverId, status } = req.body
        const caregiver = await caregiverModel.findByIdAndUpdate(caregiverId, { status })
        const user = await userModel.findOne({ _id: caregiver.userId })
        const notification = user.notification
        if (status === "Approved") {
            notification.push({
                type: `${user?.role}-account-request-approved`,
                message: `Your caregiver account request has been ${status}`,
                onClickPath: "/notification"
            })
        }

        if (status === "Rejected") {
            notification.push({
                type: `${user?.role}-account-request-rejected`,
                message: `Your caregiver account request has been ${status}`,
                onClickPath: "/notification"
            })
        }

        user.isCaregiver = status === "Approved" ? true : false
        await user.save()
        res.status(200).send({
            success: true,
            message: "Account status updated",
            data: caregiver
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while changing account status",
            error
        })
    }
}

module.exports = { getAllUsersController, getAllCaregiversController, changeAccountStatusController, getAdminDetailsController }