window.missionpro.model = window.missionpro.model || {};
window.missionpro.model.user = (function () {
    var user = {};

    function stripId(id)
    {
        return id.split('\\');
    }

    function setUser(obj)
    {
        user = obj;
    }

    function getUser()
    {
        return user;
    }

    function init(obj)
    {
        user.auth = {};
        user.auth.authIdentity = stripId(obj.authIdentity);
        user.auth.authenticated = obj.authenticated;
    }

    return {
        getUser:getUser,
        init:init
    };
})();
window.missionpro.model.domain = (function () {
    function init(obj) {
        var domainDetails = {};
        domainDetails.id = obj.id;
        domainDetails.name = obj.name;
        return domainDetails;
    }

    return {
        init: init
    };
})();