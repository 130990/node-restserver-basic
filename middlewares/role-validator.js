const { response, request } = require("express");

const isAdminRole = async (req = request, res = response, next) => {
    const { userAuth } = req;

    if (!userAuth) {
        return res.status(500).json({
            msg: 'Role validation was attempted without first validate token'
        });
    }

    if (userAuth.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${userAuth.name} can't execute this action, only administrators`
        });
    }

    next();
}

const hasRoles = (...roles) => {
    return (req = request, res = response, next) => {
        const { userAuth } = req;

        console.log(roles)

        if (!userAuth) {
            return res.status(500).json({
                msg: 'Role validation was attempted without first validate token'
            });
        }

        if(!roles.includes(userAuth.role)){
            return res.status(401).json({
                msg: `Request execution requires one of following roles: ${roles}`
            });
        }
        next();
    }
}

module.exports = {
    isAdminRole,
    hasRoles
}