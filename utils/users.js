const users = [];

//join user to chat

function userJoin (id, name, team) {
    const user = {id, name, team};

    users.push(user);
    return user;
}
//get current user

function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index,1)[0];
    }
}
function getTeamUsers(team) {
    return users.filter(user => user.team === team);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getTeamUsers
};