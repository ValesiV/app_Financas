import React, {createContext, useState, useEffect} from 'react';

import api from '../services/api';
import { useNavigation } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext({});

function AuthProvider({children}){
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const navigation = useNavigation();


    useEffect(() => {
        async function loadStorage(){
            const storageUser = await AsyncStorage.getItem('@findToken');

            if(storageUser){
                
            }
        }
    }, [])

    async function signUp(nome, email, password){
        setLoadingAuth(true);

        try{
            const response = await api.post('/users',{
                name: nome,
                password: password,
                email: email,
            })
            alert('CADASTRO REALIZADO. SEJA BEM VINDO')
            setLoadingAuth(false);
            navigation.goBack();

        }catch(err){
            console.log(err);
            setLoadingAuth(false);
        }
    }

    async function signIn(email, password){
        setLoadingAuth(true);

        try{
            const response = await api.post('/login', {
                email: email,
                password: password,
            })

            const {id, name, token} = response.data;
            const data = {
                id,
                name,
                token,
                email,
            };
            
            await AsyncStorage.setItem('@findToken', token)
            
            api.defaults.headers['Authorization'] = `Bearer ${token}`;
            
            setUser({
                id,
                name,
                email,
            });

            setLoadingAuth(false);

        }catch(err){
            console.log(err);
            setLoadingAuth(false);
        }
    }

    return(

        <AuthContext.Provider value={{signed: !!user, user, signIn, signUp, loadingAuth}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;