import{} from 'sequelize'
import db from '../config/db.js' 
import { Token } from 'graphql'

const Usuario = db.define('usuarios',{
    nombre:{
        type: DataTypes.STRING,
        allowNull: false
    },
    email:{
        type: DataTypes.STRING,
        allowNull:false
    },
    Token: {
        type: DataTypes.STRING,
        comfirmado: DataTypes.BOOLEAN
    },
})
export default Usuario