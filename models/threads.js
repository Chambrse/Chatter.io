module.exports = function (sequelize, DataTypes) {
    var threads = sequelize.define("threads", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        color: {
            type: DataTypes.STRING,
            allowNull: false,  
        }
    });

    return threads;
};