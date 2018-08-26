module.exports = function (sequelize, DataTypes) {
    var users = sequelize.define("users", {
        user: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allownull: false
        },
        hash: {
            type: DataTypes.STRING,
            allownull: false
        }
    });

    return users;
};