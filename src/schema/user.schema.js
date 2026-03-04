import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import { emailToken } from '../utils/commonResponse/authUtils.js';

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: [true, 'Email already exists'],
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please fill a valid email address'
            ]
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        username: {
            type: String,
            required: [true, 'username is required'],
            unique: [true, 'username already exists'],
            minLength: [3, 'Username must be atleast 3 characters'],
            match: [
                /^[a-zA-Z0-9]+$/,
                'username must contain only letter and numbers'
            ]
        },
        avatar: {
            type: String
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        emailVerificationToken: {
            type: String
        },
        emailVerificationTokenExpiry: {
            type: Date
        }
    },
    { timestamps: true }
);

userSchema.pre('save', async function () {
    const SALT = await bcrypt.genSalt(8);
    this.password = await bcrypt.hash(this.password, SALT);
    this.avatar = `https://robohash.org/${this.username}`;
    //Generate email verification token using crypto module or jwt
    //next()
});

const User = mongoose.model('User', userSchema);

export default User;
