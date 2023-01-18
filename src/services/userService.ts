import User from '../models/User';

export const createUser = async (firstName: string, lastName: string, email: string, token: string, avatar: string) => {
    
    if ( token ) {

        const newUser = new User;
        newUser.name.firstName = firstName;
        newUser.name.lastName = lastName;
        newUser.email = email;
        newUser.password = token;
        newUser.avatar = avatar;

        await newUser.save();
        
        return newUser;

    } else {

        return new Error('Sem o token de validação!');
    }

};

export const findUser = async (email: string) => {

    return await User.findOne({ email: email });

};

export const UpdatePassword = async (email: string, newPassword: string) => {

    const user = await findUser(email);

    if ( user ) {

        user.password = newPassword;

        await user.save();

        return user;

    } else {

        return new Error('Usuário inexistente');

    }

};

export const UpdateAutenticate = async (email: string) => {

    const user = await findUser(email);

    if(user) {

        user.autenticate = true;

        await user.save();

        return user;
        
    } else {
        return new Error('Usuário inexistente');
    }

};

