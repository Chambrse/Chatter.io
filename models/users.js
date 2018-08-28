module.exports = function (sequelize, DataTypes) {
    var users = sequelize.define("users", {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allownull: false,
            unique: true
        },
        hash: {
            type: DataTypes.STRING,
            allownull: false
        }
    });

    return users;
};