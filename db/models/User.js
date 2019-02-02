const bcrypt = require('bcrypt-nodejs')
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true },
  tokens: Array,
  profile: {
    name: { type: String, default: '' },
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  auth: {
    password: String,
    google: {}
  }
});

function encryptPassword(next) {
  const user = this;
  if (!user.isModified('auth.password')) return next();
  return bcrypt.genSalt(5, (saltErr, salt) => {
    if (saltErr) return next(saltErr);
    return bcrypt.hash(user.password, salt, null, (hashErr, hash) => {
      if (hashErr) return next(hashErr);
      user.password = hash;
      return next();
    });
  });
}

// Hash password before saving
UserSchema.pre('save', encryptPassword);

module.exports = mongoose.model('User', UserSchema);
