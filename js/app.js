const App = {
    async init() {
        // Show loading screen initially
        const appContainer = document.getElementById('app');
        appContainer.innerHTML = `
            <div class="loading-screen" style="display: flex;">
                <div class="spinner"></div>
                <p>กำลังเชื่อมต่อข้อมูล...</p>
            </div>
        `;
        
        await DB.init();
        
        // Hide loading and route
        const loading = document.querySelector('.loading-screen');
        if (loading) loading.style.display = 'none';
        
        this.route();
    },

    route() {
        const appContainer = document.getElementById('app');
        
        if (!Auth.isAuthenticated()) {
            appContainer.innerHTML = LoginView.render();
            LoginView.init();
        } else {
            const user = Auth.getCurrentUser();
            if (user.role === 'teacher') {
                appContainer.innerHTML = TeacherView.render();
                TeacherView.init();
            } else if (user.role === 'certifier') {
                appContainer.innerHTML = CertifierView.render();
                CertifierView.init();
            } else if (user.role === 'admin') {
                appContainer.innerHTML = AdminView.render();
                AdminView.init();
            }
        }
        
        // Re-initialize icons for new content
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
