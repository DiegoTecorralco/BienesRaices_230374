import {DataTypes} from 'sequelize'
import db from '../db/config.js'
import bcrypt from 'bcrypt'
const User=db.define('tbb_users',{
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    fecha_nacimiento    : {
        type: DataTypes.DATE, 
        allowNull: true
    },
    token:DataTypes.STRING,
    confirmed:DataTypes.BOOLEAN
},{
    hooks:{
        beforeCreate: async function (user) {
            //Genaramos la clave para el hasheo, se recomienda 10 rondas de aleatorización para no consumir demasiados recursos de hadware y hacer lento el proceso
            const salt= await bcrypt.genSalt(10)
            user.password=await bcrypt.hash(user.password,salt);
        }
    }
})
//Metodos Personalizados 
User.prototype.verificarPassword = function(password){
    return bcrypt.compareSync(password, this.password);
    
}
export default User;