import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    authToken: {
        type: String,
        unique: true,
    }
});

userSchema.statics.findByLogin = async function (login, password) {
    let user = await this.findOne({
        username: login,
		password: password
    });
    if (!user) {
        user = await this.findOne({
            email: login,
			password: password
        });
    }
	
	if(!user) {
		return { username: "INVALID" };
	}
    return user;
};

userSchema.statics.findByToken = async function(login, token){
    let user = await this.findOne({
        username: login,
        authToken: token
    });

    if(!user){
        return { username: "EXPIRED" };
    }

    return user;
}

userSchema.pre('remove', function (next) {
    this.model('Message').deleteMany({
        user: this._id
    }, next);
});

const User = mongoose.model('User', userSchema);

export default User;