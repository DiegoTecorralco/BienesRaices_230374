import{DataTypes} from 'sequelize'
import db from '../config/db.js' 
//import { Token } from 'graphql'

const User = db.define('usuarios',{
    nombre:{
        type: DataTypes.STRING,
        allowNull: false
    },
    email:{
        type: DataTypes.STRING,
        allowNull:false,
        unique: true
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false
    },
    Token: { 
        type: DataTypes.STRING,
        comfirmado: DataTypes.BOOLEAN
    }
})

export default User;