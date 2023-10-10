const { validationResult } = require('express-validator')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')

// create a new jsonwebtoken
const createToken = (_id) => jwt.sign({ _id }, process.env.SECRET_KEY, { expiresIn: '1d' })

// hashes the user password
const hashPassword = async (plainPassword) => {
    const saltRounds = 10;
    return await bcrypt.hash(plainPassword, saltRounds);
};

// compares the provided password using bcrypt
const comparePassword = async (plainPassword, hashedPassword) => bcrypt.compare(plainPassword, hashedPassword)

// creates a new user
const signUp = async (req, res) => {
    const errors = validationResult(req)
    const data = req.body
    const { username, password, withdrawalPassword, inviteCode } = data
    const inviteCodes = ['789yu45', 'uiw73u2', 'hsg572j']

    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() })
    }

    const usernameExists = await User.findOne({ username: username })

    // check if username already exists
    if (usernameExists) {
        return res.status(400).json({ message: 'Username already in use try another one' })
    }

    // check if invite code is valid
    if (!inviteCodes.includes(inviteCode)) {
        return res.status(400).json({ message: 'Invalid invite code' })
    }

    const hashedPassword = await hashPassword(password) // hash user password
    const hashedWithdrawalPassword = await hashPassword(withdrawalPassword) // hash user withdrawal password

    // try creating a new user document with a hashed password
    try {
        // create new user
        await User.create({
            ...data,
            withdrawalPassword: hashedWithdrawalPassword,
            password: hashedPassword,
            role: 'subscriber'
        })


        return res.status(200).json({ message: 'User registration complete' })
    }

    // catch an error if an error occurred while creating a new user
    catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

// controls a user login
const signIn = async (req, res) => {
    try {
        const { auth, userPassword } = req.body
        const errors = validationResult(req)

        // return an error array if errors are not empty
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() })
        }

        let user;

        // Determine the data type of 'auth'
        if (!isNaN(auth)) {
            // If 'auth' is numeric, search in the 'mobile' field
            user = await User.findOne({ mobile: auth });
        } else {
            // If 'auth' is not numeric, search in the 'username' field
            user = await User.findOne({ username: auth });
        }

        // check if user account already exists
        if (!user) {
            return res.status(403).json({ message: 'We could not find your account' })
        }

        const verifyPassword = await bcrypt.compare(userPassword, user.password) //verifies user password using bcrypt

        // check if password is matched
        if (!verifyPassword) {
            return res.status(403).json({ message: 'Your password is incorrect' })
        }

        const token = createToken(user._id) //creates a new json web token
        const { password, withdrawalPassword, ...userData } = user.toObject()

        return res.status(200).json({ message: { ...userData, token } })
    }

    catch (error) {
        return res.status(500).json({ message: 'Error occurred while signing you in. ' + error.message })
    }

}

// updates the user avatar field
const updateAvatar = async (req, res) => {
    const { id } = req.params

    // check if the provided id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid user ID' })
    }


    try {
        const user = await User.findOne({ _id: id })

        // check if the user exists
        if (!user) {
            return res.status(400).json({ message: 'No user exists with such ID .' })
        } else {
            const directory = 'uploads/avatars/'// old avatar directory

            // old avatar file directory
            const avatarOldPath = user.avatar ? path.join(directory, user.avatar) : null

            //check if the avatar file exists before attempting to delete it
            if (user.avatar && fs.existsSync(avatarOldPath)) {
                fs.unlinkSync(avatarOldPath)
            }
        }

        // update the user avatar
        const updateUser = await User.findByIdAndUpdate(id, { avatar: req.file.filename }, { new: true })

        // remove sensitive user information
        const { password, withdrawalPassword, ...userData } = updateUser.toObject()

        return res.status(200).json({ message: { ...userData } })
    }

    catch (error) {
        return res.status(500).json({ message: 'Could not update user data. ' + error.message })
    }
}

// resets user password fields
const resetPassword = async (req, res) => {
    const { type, id } = req.params
    const { userPassword, newPassword } = req.body
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() })
    }

    // check if the provided id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(500).json({ message: 'Invalid user ID' })
    }

    // check if user exists
    const userExists = await User.findOne({ _id: id })

    // return 404 error if user does not exist
    if (!userExists) {
        return res.status(404).json({ message: 'User not found' })
    }

    try {

        // check if the provided password is correct
        const passwordIsCorrect = await comparePassword(userPassword, type === 'password' ? userExists.password : type === 'withdrawal' ? userExists.withdrawalPassword : null)

        // return a sever error if the provided password is incorrect
        if (!passwordIsCorrect) {
            return res.status(500).json({ message: type === 'password' ? 'Incorrect user password' : type === 'withdrawal' && 'Invalid withdrawal password' })
        }

        const hash = await hashPassword(newPassword)

        const update = await User.findByIdAndUpdate(
            id,
            type === 'password' ? { password: hash } : type === 'withdrawal' ? { withdrawalPassword: hash } : null,
            { new: true }
        )
        const { password, withdrawalPassword, ...userData } = update.toObject()

        // return the new user object
        return res.status(200).json({ message: { ...userData } })
    }
    catch (error) {
        return res.status(500).json({ message: 'Could not change password ' + error.message })
    }
}

// updates user data
const updateData = async (req, res) => {
    const { id } = req.params
    const data = req.body

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() })
    }

    const user = await User.findOne({ _id: id })

    // check if the user exists
    if (!user) {
        return res.status(400).json({ message: 'No user exists with such ID .' })
    }

    try {
        const updatedData = await User.findByIdAndUpdate(id, data, { new: true })
        const { password, withdrawalPassword, ...userData } = updatedData.toObject()
        return res.status(200).json({ message: { ...userData } })
    }
    catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

module.exports = ({
    signUp,
    signIn,
    updateAvatar,
    resetPassword,
    updateData
})