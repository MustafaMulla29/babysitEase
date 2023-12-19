//import model
const userModel = require('../models/userModels')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = require('../routes/userRoutes')
const authMiddleware = require('../middlewares/authMiddleware')
const nodemailer = require('nodemailer')
const Mailgen = require('mailgen')
const caregiverModel = require('../models/caregiverModel')


//register callback
// const registerController = async (req, res) => {
//     try {
//         const existingUser = await userModel.findOne({ email: req.body.email })
//         if (existingUser) {
//             return res.status(200).send({
//                 message: 'User already exists', success: false
//             })
//         }
//         const password = req.body.password
//         const salt = await bcrypt.genSalt(10)
//         const hashedPassword = await bcrypt.hash(password, salt)
//         req.body.password = hashedPassword
//         const newUser = new userModel(req.body)
//         await newUser.save()
//         //email
//         let config = {
//             service: 'gmail',
//             auth: {
//                 // user: 'babysitease@gmail.com',
//                 // pass: 'nazm oaib xcsz hxow',
//                 user: process.env.BABYSITEASE_EMAIL,
//                 pass: process.env.BABYSITEASE_APP_PASSWORD,
//             }
//         }

//         let transporter = nodemailer.createTransport(config)

//         let mailGenerator = new Mailgen({
//             theme: 'default',
//             product: {
//                 name: 'Mailgen',
//                 link: 'https://mailgen.js/'
//             }
//         })

//         let response = {
//             body: {
//                 name: req.body.name,
//                 intro: 'You are registered successfully with BabysitEase',
//                 outro: 'Looking forward to see you at BabysitEase'
//             }
//         }
//         // if (!existingUser) {
//         let mail = mailGenerator.generate(response)

//         let message = {
//             from: 'babysitease@gmail.com',
//             to: req.body.email,
//             subject: 'Registered successully!',
//             html: mail
//         }

//         transporter.sendMail(message, (error, info) => {
//             if (error) {
//                 console.log(error)
//             } else {
//                 console.log(info)
//             }
//         })
//         // }

//         res.status(201).send({
//             message: 'Registered sccessfully', success: true
//         })
//     } catch (error) {
//         console.log(error)
//         res.status(500).send({
//             success: false,
//             message: `Register controller: ${error.message}`
//         })
//     }
// }

const registerController = async (req, res) => {
    try {
        const existingUser = await userModel.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(200).send({
                message: 'User already exists', success: false
            });
        }

        // Process profile picture upload
        const profilePicture = req.file ? req.file.path : null; // Assuming the profile picture is sent as a file

        // Your existing code for hashing the password
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;

        // Create a new user instance with the provided data
        const newUser = new userModel({
            ...req.body,
            profilePicture: profilePicture // Save the file path to the profilePicture field
        });

        // Save the user to the database
        await newUser.save();

        let config = {
            service: 'gmail',
            auth: {
                // user: 'babysitease@gmail.com',
                // pass: 'nazm oaib xcsz hxow',
                user: process.env.BABYSITEASE_EMAIL,
                pass: process.env.BABYSITEASE_APP_PASSWORD,
            }
        }

        let transporter = nodemailer.createTransport(config)

        let mailGenerator = new Mailgen({
            theme: 'default',
            product: {
                name: 'Mailgen',
                link: 'https://mailgen.js/'
            }
        })

        let response = {
            body: {
                name: req.body.name,
                intro: 'You are registered successfully with BabysitEase',
                outro: 'Looking forward to see you at BabysitEase'
            }
        }
        // if (!existingUser) {
        let mail = mailGenerator.generate(response)

        let message = {
            from: 'babysitease@gmail.com',
            to: req.body.email,
            subject: 'Registered successully!',
            html: mail
        }

        transporter.sendMail(message, (error, info) => {
            if (error) {
                console.log(error)
            } else {
                console.log(info)
            }
        })
        // }

        res.status(201).send({
            message: 'Registered sccessfully', success: true
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: `Register controller: ${error.message}`
        });
    }
};


//login callback
const loginController = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email })
        if (!user) {
            return res.status(200).send({
                message: 'User not found',
                success: false
            })
        }
        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password)
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
        if (!isPasswordMatch) {
            return res.status(200).send({
                message: 'Invalid email or password',
                success: false
            })
        }
        else {
            const newUser = user.toObject()
            newUser.password = undefined
            newUser.aadharNumber = undefined
            if (req.body.email === process.env.ADMIN_EMAIL && req.body.password === process.env.ADMIN_PASS) {
                user.isAdmin = true
                await userModel.findByIdAndUpdate(user._id, { $set: { isAdmin: true } });

                res.status(200).send({
                    message: 'Admin Login success', success: true,
                    token,
                    user: newUser
                })
            }
            else {
                res.status(200).send({
                    message: 'Login success', success: true,
                    token,
                    user: newUser
                })
            }
        }

    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: `Error in login ctrl ${error.message}`
        })
    }

}

//authController callback
const authController = async (req, res) => {
    try {
        const user = await userModel.findById({ _id: req.body.userId })
        user.password = undefined
        if (!user) {
            return res.status(200).send({
                message: 'User not found',
                success: false
            })
        }
        else {
            res.status(200).send({
                success: true,
                data: user
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ messae: 'Auth error', success: false, error })
    }
}


// previous login controller
// const loginController = async (req, res) => {
//     try {
//         const user = await userModel.findOne({ email: req.body.email })
//         if (!user) {
//             return res.status(200).send({
//                 message: 'User not found',
//                 success: false
//             })
//         }
//         const isPasswordMatch = await bcrypt.compare(req.body.password, user.password)
//         if (!isPasswordMatch) {
//             return res.status(200).send({
//                 message: 'Invalid email or password',
//                 success: false
//             })
//         }
//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
//         res.status(200).send({
//             message: 'Login success', success: true,
//             token
//         })
//     } catch (error) {
//         console.log(error)
//         res.status(500).send({
//             message: `Error in login ctrl ${error.message}`
//         })
//     }

// }

// const applyCaregiverController = async (req, res) => {
//     try {
//         const newCaregiver = await caregiverModel({ ...req.body, status: "Pending" })
//         await newCaregiver.save()
//         const existingUser = await userModel.findOne({ _id: req.body.userId })
//         const adminUser = await userModel.findOne({ isAdmin: true })
//         const notification = adminUser.notification
//         notification.push({
//             type: "apply-nurse-request",
//             message: `${existingUser.name} has applied for a nurse account`,
//             data: {
//                 caregiverId: newCaregiver._id,
//                 name: existingUser.name,
//                 onClickPath: "/admin/nurses",
//             }
//         })
//         await userModel.findByIdAndUpdate(adminUser._id, { notification })
//         res.status(201).send({
//             success: true,
//             message: "Applied for nurse successfully"
//         })
//     } catch (error) {
//         console.log(error)
//         res.status(500).send({
//             success: false,
//             error: error,
//             message: "Error while applying for nurse"
//         })
//     }
// }

const applyCaregiverController = async (req, res) => {
    try {
        // Extract certificates from req.files
        const certifications = req.files ? req.files.map(file => file.path) : null;

        // Extract other form data from req.body
        const ageRange = JSON.parse(req.body.ageRange)
        const {
            experience,
            feesPerDay,
            preferredCities,
            description,
            qualification,
            specialisation,
            userId,
        } = req.body;
        const existingCaregiver = await caregiverModel.findOne({ userId: userId })

        if (existingCaregiver) {
            return res.status(200).send({
                success: true,
                message: "You have already applied"
            })
        }

        const newCaregiver = await caregiverModel({
            experience,
            feesPerDay,
            preferredCities,
            description,
            qualification,
            specialisation,
            ageRange,
            userId,
            certifications, // Add certificates to the caregiver model
            status: "Pending", // Fix the typo in 'status'
        });

        await newCaregiver.save();

        const existingUser = await userModel.findOne({ _id: userId });
        const adminUser = await userModel.findOne({ isAdmin: true });
        const notification = adminUser.notification;

        notification.push({
            type: "apply-nurse-request",
            message: `${existingUser.name} has applied for a nurse account`,
            data: {
                caregiverId: newCaregiver._id,
                name: existingUser.name,
                onClickPath: "/admin/nurses",
            },
        });

        await userModel.findByIdAndUpdate(adminUser._id, { notification });

        res.status(201).send({
            success: true,
            message: "Applied for nurse successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error: error,
            message: "Error while applying for nurse",
        });
    }
};


//ALL NOTIFICATIONS
const getNotificationsController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId })
        const seenNotification = user.seenNotification
        const notification = user.notification
        seenNotification.push(...notification)
        user.notification = []
        user.seenNotification = notification
        const updatedUser = await user.save()
        res.status(200).send({
            success: true,
            message: 'All notification marked as read',
            data: updatedUser
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error in notifications"
        })
    }
}

//DELETE NOTIFICATIONS
const deleteNotificationsController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId })
        user.notification = []
        user.seenNotification = []
        const updatedUser = await user.save()
        updatedUser.password = undefined
        res.status(200).send({
            success: true,
            message: "Notifications deleted successfully",
            data: updatedUser
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while deleting notifications", error
        })
    }
}

module.exports = { loginController, registerController, authController, applyCaregiverController, getNotificationsController, deleteNotificationsController }