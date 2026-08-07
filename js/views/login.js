const LoginView = {
    render() {
        return `
            <div class="auth-container glass-panel">
                <div style="text-align: center; margin-bottom: 2rem;">
                    <img src="assets/logo.png" alt="โลโก้โรงเรียน" class="app-logo" onerror="this.style.display='none'">
                    <h2 style="color: var(--primary);">ระบบภาระงาน สำหรับครู</h2>
                    <p style="color: var(--text-muted);">เข้าสู่ระบบเพื่อดำเนินการต่อ</p>
                </div>
                <form id="login-form">
                    <div class="form-group">
                        <label for="username">ชื่อผู้ใช้งาน</label>
                        <input type="text" id="username" class="form-control" required placeholder="เช่น t..........">
                    </div>
                    <div class="form-group">
                        <label for="password">รหัสผ่าน</label>
                        <input type="password" id="password" class="form-control" required placeholder="ใส่รหัสผ่าน">
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; margin-top: 1rem;">
                        <i data-lucide="log-in"></i> เข้าสู่ระบบ
                    </button>
                </form>
                
                <div style="margin-top: 2rem; font-size: 0.9rem; color: var(--text-muted); background: rgba(0,0,0,0.02); padding: 1rem; border-radius: 8px; text-align: center;">
                    <strong>* ใช้ username และ password เดียวกันกับ schoolmit</strong>
                </div>
            </div>
        `;
    },

    init() {
        const form = document.getElementById('login-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const username = document.getElementById('username').value.trim();
                const password = document.getElementById('password').value.trim();

                if (Auth.login(username, password)) {
                    Utils.showToast('เข้าสู่ระบบสำเร็จ', 'success');
                    // Reload to update state
                    setTimeout(() => window.location.reload(), 1000);
                } else {
                    Utils.showToast('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง', 'error');
                }
            });
        }
    }
};
