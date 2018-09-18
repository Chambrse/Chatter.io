module.exports = function (sequelize, DataTypes) {
    var messages = sequelize.define("messages", {
        messageBody: {
            type: DataTypes.STRING,
            allowNull: false
        },
        sender: {
            type: DataTypes.STRING,
            allowNull: false
        },
        replies: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        thread: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });

    return messages;
};