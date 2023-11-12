const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator')
const bcrypt = require('bcrypt');

// Creating user schema using mongoose
const UserSchema = new mongoose.Schema({
   
    firstName: {
        type: String,
        required: [true, "First name is required."]
    },
    lastName: {
        type: String,
        required: [true, "Last name is required."]
    },
    email: {
        type: String,
        requied: [true, "Email is required."],
        unique: [true, "Account already exists."],
        validate: {
            validator: val => /^([\w-\.]+@([\w-]+\.)+[\w-]+)?$/.test(val),
            message: "Please enter a valid email address."
        }
    },
    password: {
        type: String,
        required: [true, "Password is required."],
        minlength: [8, "Password must be at least 8 characters long."]
    }

}, { timestamps: true });

UserSchema.plugin(uniqueValidator);

// add this after UserSchema is defined
UserSchema.virtual('confirmPassword')
    .get(() => this._confirmPassword)
    .set(value => this._confirmPassword = value);

// Middleware used to validate the match between password and confimPassword "pre hook"
UserSchema.pre('validate', function (next) {
    if (this.password !== this.confirmPassword) {
        this.invalidate('confirmPassword', 'Password must match confirm password');
    }
    next();
});


// Using bcrypt to hash the password before saving it to the databse "pre hook"
UserSchema.pre('save', function (next) {
    bcrypt.hash(this.password, 10)
        .then(hash => {
            this.password = hash;
            next();
        });
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
