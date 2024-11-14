import{DataTypes} from 'sequelize'
import db from '../config/db.js' 
import { Hooks } from 'sequelize/lib/hooks';

const User = db.define('tb_users',{
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
        token: DataTypes.STRING,
        comfirmed: DataTypes.BOOLEAN
    },{
        hooks:{
            beforeCreate: async function(user)
            {
                //Generamos la clave para el hasheo,
                const salt = await bcrypt.genSalt(10)
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    })
export default User;