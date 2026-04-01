(function (window) {
    window.env = window.env || {};

    // Environment variables
    window["env"]["apiUrl"] = "${API_URL}";
    window["env"]["logoutUrl"] = "${LOGOUT_URL}";
    window["env"]["apiVersion"] = "${API_VER}";
    window["env"]["electionType"] = "${ELECTION_TYPE}";
})(this);
