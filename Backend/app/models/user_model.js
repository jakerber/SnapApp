//  Sources:
//  http://stackoverflow.com/questions/27732209/turning-off-eslint-rule-for-a-specific-line
//  http://cs52.me/assignments/hw5p2/

import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

// create a schema for posts with a field
const UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,
  profilePicURL: String,
  profilePicKey: String,
  username: String,
  friends: [{ name: String, score: Number }],
  topFriend: String,
  snapScore: Number,
  facebookUserID: String,
  fbProfPicURL: String,
});

UserSchema.set('toJSON', {
  virtuals: true,
});

UserSchema.pre('save', function beforeyYourModelSave(next) { // eslint-disable-line consistent-return
  // this is a reference to our model
  // the function runs in some other context so DO NOT bind it
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) {
    return next();
  }

  // generate a salt then run callback
  bcrypt.genSalt(10, (err, salt) => { // eslint-disable-line consistent-return
    if (err) {
      return next(err);
    }

    // hash (encrypt) our password using the salt
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) {
        return next(err);
      }

      // overwrite plain text password with encrypted password
      user.password = hash;
      return next();
    });
  });
  // when done run the next callback with no arguments
  // call next with an error if you encounter one
});

// note use of named function rather than arrow notation
//  this arrow notation is lexically scoped and prevents binding scope, which mongoose relies on
UserSchema.methods.comparePassword = function comparePassword(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => { // eslint-disable-line consistent-return
    if (err) {
      return callback(err);
    }

    callback(null, isMatch);
  });
};

// create model class
const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
