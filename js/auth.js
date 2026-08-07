const Auth = {
    login(username, password) {
        // Simple mock authentication
        const user = DB.getUserByUsername(username);
        if (user && user.password === password) {
            // Don't store password in session
            const { password: _, ...userWithoutPassword } = user;
            sessionStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
            return true;
        }
        return false;
    },

    logout() {
        sessionStorage.removeItem('currentUser');
        window.location.reload();
    },

    getCurrentUser() {
        const userStr = sessionStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated() {
        return !!this.getCurrentUser();
    },

    hasRole(role) {
        const user = this.getCurrentUser();
        return user && user.role === role;
    }
};
