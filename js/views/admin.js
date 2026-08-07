const AdminView = {
    render() {
        const user = Auth.getCurrentUser();
        const workloads = DB.getAllWorkloadsForAdmin();
        const users = DB.getUsers();
        
        // Dashboard Stats
        let totalCount = workloads.length;
        let pendingCount = 0;
        let certifiedCount = 0;
        let approvedCount = 0;

        workloads.forEach(w => {
            if (w.status === 'pending') pendingCount++;
            else if (w.status === 'certified') certifiedCount++;
            else if (w.status === 'approved') approvedCount++;
        });

        // Dashboard HTML
        let dashboardHtml = `
            <div id="tab-dashboard" class="tab-content" style="display: block;">
                <div style="margin-bottom: 2rem;">
                    <h2 style="margin-bottom: 1.5rem;">ภาพรวมระบบ</h2>
                    <div style="display: flex; flex-wrap: wrap; gap: 1.5rem;">
                        <div style="flex: 2; display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem;">
                            <div class="glass-panel" style="padding: 1.5rem; display: flex; align-items: center; gap: 1rem; border-left: 4px solid var(--primary); margin-bottom: 0;">
                                <div style="background: rgba(43, 88, 255, 0.1); padding: 1rem; border-radius: 50%; color: var(--primary);">
                                    <i data-lucide="file-text" style="width: 24px; height: 24px;"></i>
                                </div>
                                <div>
                                    <div style="color: var(--text-muted); font-size: 0.9rem;">รายงานทั้งหมด</div>
                                    <div style="font-size: 1.8rem; font-weight: 700; color: var(--text-main);">${totalCount}</div>
                                </div>
                            </div>
                            <div class="glass-panel" style="padding: 1.5rem; display: flex; align-items: center; gap: 1rem; border-left: 4px solid var(--warning); margin-bottom: 0;">
                                <div style="background: rgba(245, 158, 11, 0.1); padding: 1rem; border-radius: 50%; color: var(--warning);">
                                    <i data-lucide="clock" style="width: 24px; height: 24px;"></i>
                                </div>
                                <div>
                                    <div style="color: var(--text-muted); font-size: 0.9rem;">รอรับรอง</div>
                                    <div style="font-size: 1.8rem; font-weight: 700; color: var(--text-main);">${pendingCount}</div>
                                </div>
                            </div>
                            <div class="glass-panel" style="padding: 1.5rem; display: flex; align-items: center; gap: 1rem; border-left: 4px solid var(--secondary); margin-bottom: 0;">
                                <div style="background: rgba(16, 185, 129, 0.1); padding: 1rem; border-radius: 50%; color: var(--secondary);">
                                    <i data-lucide="user-check" style="width: 24px; height: 24px;"></i>
                                </div>
                                <div>
                                    <div style="color: var(--text-muted); font-size: 0.9rem;">รออนุมัติ</div>
                                    <div style="font-size: 1.8rem; font-weight: 700; color: var(--text-main);">${certifiedCount}</div>
                                </div>
                            </div>
                            <div class="glass-panel" style="padding: 1.5rem; display: flex; align-items: center; gap: 1rem; border-left: 4px solid #10b981; margin-bottom: 0;">
                                <div style="background: rgba(16, 185, 129, 0.1); padding: 1rem; border-radius: 50%; color: #10b981;">
                                    <i data-lucide="check-circle" style="width: 24px; height: 24px;"></i>
                                </div>
                                <div>
                                    <div style="color: var(--text-muted); font-size: 0.9rem;">อนุมัติแล้ว</div>
                                    <div style="font-size: 1.8rem; font-weight: 700; color: var(--text-main);">${approvedCount}</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="glass-panel" style="flex: 1; min-width: 300px; padding: 1.5rem; margin-bottom: 0;">
                            <h4 style="margin-bottom: 1rem; text-align: center; color: var(--text-main);">สัดส่วนสถานะรายงาน</h4>
                            <div style="position: relative; height: 220px; width: 100%; display: flex; justify-content: center;">
                                <canvas id="adminStatusChart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="glass-panel" style="padding: 0; overflow: hidden;">
                    <div style="padding: 1.5rem; border-bottom: 1px solid #E5E7EB; display: flex; justify-content: space-between; align-items: center;">
                        <h2 style="margin: 0;">รายการภาระงานทั้งหมด</h2>
                    </div>
                    <div style="overflow-x: auto;">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>วันที่รายงาน</th>
                                    <th>ผู้รายงาน</th>
                                    <th>กลุ่มสาระ</th>
                                    <th>ชั่วโมงรวม</th>
                                    <th>สถานะ</th>
                                    <th>จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.renderWorkloadRows(workloads)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        // Users Management HTML
        let usersHtml = `
            <div id="tab-users" class="tab-content" style="display: none;">
                <div class="glass-panel" style="padding: 0; overflow: hidden;">
                    <div style="padding: 1.5rem; border-bottom: 1px solid #E5E7EB; display: flex; justify-content: space-between; align-items: center;">
                        <h2 style="margin: 0;">จัดการผู้ใช้งาน</h2>
                        <button id="add-user-btn" class="btn btn-primary">
                            <i data-lucide="plus"></i> เพิ่มผู้ใช้งาน
                        </button>
                    </div>
                    <div style="overflow-x: auto;">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>ชื่อผู้ใช้</th>
                                    <th>ชื่อ-สกุล</th>
                                    <th>ตำแหน่ง</th>
                                    <th>สิทธิ์การใช้งาน</th>
                                    <th>จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.renderUserRows(users)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        return `
            <div class="app-header glass-panel" style="margin-bottom: 2rem; padding: 0 1.5rem;">
                <div style="display: flex; align-items: center; gap: 1.5rem;">
                    <img src="assets/logo.png" alt="โลโก้โรงเรียน" class="header-logo" onerror="this.style.display='none'">
                    <div class="user-info">
                        <div class="avatar" style="background-color: var(--primary);">${user.name.charAt(0)}</div>
                        <div>
                            <div style="font-weight: 700; font-size: 1.25rem;">${user.name} ${user.surname}</div>
                            <div style="font-size: 1rem; color: var(--text-muted);">โหมด: ผู้ดูแลระบบ (Admin)</div>
                        </div>
                    </div>
                </div>
                <button id="logout-btn" class="btn btn-danger">
                    <i data-lucide="log-out"></i> ออกจากระบบ
                </button>
            </div>

            <div class="tabs" style="display: flex; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 1px solid #E5E7EB;">
                <button class="tab-btn active" data-target="tab-dashboard" style="padding: 0.75rem 1.5rem; border: none; background: transparent; border-bottom: 2px solid var(--primary); color: var(--primary); font-weight: 600; cursor: pointer; transition: 0.3s;">
                    <i data-lucide="layout-dashboard"></i> แดชบอร์ด
                </button>
                <button class="tab-btn" data-target="tab-users" style="padding: 0.75rem 1.5rem; border: none; background: transparent; border-bottom: 2px solid transparent; color: var(--text-muted); font-weight: 600; cursor: pointer; transition: 0.3s;">
                    <i data-lucide="users"></i> จัดการผู้ใช้
                </button>
            </div>

            <div id="admin-container">
                ${dashboardHtml}
                ${usersHtml}
            </div>

            <!-- Modal for Workload details -->
            <div id="details-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 100; align-items: center; justify-content: center;">
                <div class="glass-panel" style="width: 90%; max-width: 800px; max-height: 90vh; overflow-y: auto; position: relative;">
                    <button id="close-modal" class="btn btn-secondary btn-icon" style="position: absolute; top: 1rem; right: 1rem; z-index: 10;">
                        <i data-lucide="x"></i>
                    </button>
                    <h2 style="margin-bottom: 1.5rem;">รายละเอียดภาระงาน</h2>
                    <div id="modal-content"></div>
                </div>
            </div>

            <!-- Modal for User Form -->
            <div id="user-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 100; align-items: center; justify-content: center;">
                <div class="glass-panel" style="width: 90%; max-width: 500px; max-height: 90vh; overflow-y: auto; position: relative;">
                    <button id="close-user-modal" class="btn btn-secondary btn-icon" style="position: absolute; top: 1rem; right: 1rem; z-index: 10;">
                        <i data-lucide="x"></i>
                    </button>
                    <h2 id="user-modal-title" style="margin-bottom: 1.5rem;">เพิ่มผู้ใช้งาน</h2>
                    <form id="user-form">
                        <input type="hidden" id="u-id">
                        <div class="form-group">
                            <label>ชื่อผู้ใช้ (Username) *</label>
                            <input type="text" id="u-username" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label>รหัสผ่าน (Password) *</label>
                            <input type="text" id="u-password" class="form-control" required>
                        </div>
                        <div class="grid-2">
                            <div class="form-group">
                                <label>ชื่อ *</label>
                                <input type="text" id="u-name" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label>นามสกุล *</label>
                                <input type="text" id="u-surname" class="form-control" required>
                            </div>
                        </div>
                        <div class="grid-2">
                            <div class="form-group">
                                <label>ตำแหน่ง *</label>
                                <input type="text" id="u-position" class="form-control" placeholder="เช่น ครู คศ.1" required>
                            </div>
                            <div class="form-group">
                                <label>กลุ่มสาระ/แผนก *</label>
                                <input type="text" id="u-department" class="form-control" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>สิทธิ์การใช้งาน (Role) *</label>
                            <select id="u-role" class="form-control" required>
                                <option value="teacher">ครู (ผู้รายงาน)</option>
                                <option value="certifier">ผู้รับรอง</option>
                                <option value="admin">ผู้ดูแลระบบ (Admin)</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">บันทึกข้อมูล</button>
                    </form>
                </div>
            </div>
        `;
    },

    renderWorkloadRows(workloads) {
        if (workloads.length === 0) return '<tr><td colspan="6" style="text-align:center; padding: 2rem;">ไม่มีข้อมูลระบบ</td></tr>';
        
        workloads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return workloads.map(w => {
            const actionBtn = w.status === 'certified' 
                ? `<button class="btn btn-secondary btn-sm approve-wl-btn" data-id="${w.id}" style="color: var(--secondary); border-color: var(--secondary);"><i data-lucide="check-circle" style="width: 16px;"></i> อนุมัติ</button>`
                : `<button class="btn btn-secondary btn-sm" disabled style="opacity: 0.5;">-</button>`;
                
            return `
                <tr>
                    <td>${Utils.formatDate(w.createdAt)}</td>
                    <td>${w.teacherInfo.name} ${w.teacherInfo.surname}</td>
                    <td>${w.teacherInfo.department}</td>
                    <td>${w.totalHours}</td>
                    <td>${Utils.getStatusBadge(w.status)}</td>
                    <td>
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn btn-secondary btn-sm view-details-btn" data-id="${w.id}">
                                <i data-lucide="eye" style="width: 16px;"></i> ดูรายละเอียด
                            </button>
                            ${actionBtn}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    renderUserRows(users) {
        if (users.length === 0) return '<tr><td colspan="5" style="text-align:center; padding: 2rem;">ไม่มีผู้ใช้งาน</td></tr>';
        
        const roleLabels = {
            'teacher': '<span style="color:#6366F1;">ครู</span>',
            'certifier': '<span style="color:#F59E0B;">ผู้รับรอง</span>',
            'admin': '<span style="color:#10B981;">ผู้ดูแลระบบ</span>'
        };

        return users.map(u => `
            <tr>
                <td><strong>${u.username}</strong></td>
                <td>${u.name} ${u.surname}</td>
                <td>${u.position}<br><span style="font-size:0.8rem;color:#6B7280;">${u.department}</span></td>
                <td>${roleLabels[u.role] || u.role}</td>
                <td>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-secondary btn-sm edit-user-btn" data-id="${u.id}">
                            <i data-lucide="edit" style="width: 16px;"></i> แก้ไข
                        </button>
                        <button class="btn btn-danger btn-sm delete-user-btn" data-id="${u.id}" ${u.id === Auth.getCurrentUser().id ? 'disabled' : ''}>
                            <i data-lucide="trash-2" style="width: 16px;"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    init() {
        // Render lucide icons
        if (window.lucide) {
            lucide.createIcons();
        }

        const workloads = DB.getAllWorkloadsForAdmin();
        const users = DB.getUsers();
        
        // Logout
        document.getElementById('logout-btn')?.addEventListener('click', () => Auth.logout());

        // Tab Switching Logic
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => {
                    b.classList.remove('active');
                    b.style.borderBottomColor = 'transparent';
                    b.style.color = 'var(--text-muted)';
                });
                const targetBtn = e.currentTarget;
                targetBtn.classList.add('active');
                targetBtn.style.borderBottomColor = 'var(--primary)';
                targetBtn.style.color = 'var(--primary)';

                document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
                document.getElementById(targetBtn.dataset.target).style.display = 'block';
            });
        });

        // Initialize Chart
        let pending = 0, certified = 0, approved = 0;
        workloads.forEach(w => {
            if (w.status === 'pending') pending++;
            else if (w.status === 'certified') certified++;
            else if (w.status === 'approved') approved++;
        });

        const ctx = document.getElementById('adminStatusChart');
        if (ctx && (pending > 0 || certified > 0 || approved > 0)) {
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['รอรับรอง', 'รออนุมัติ', 'อนุมัติแล้ว'],
                    datasets: [{
                        data: [pending, certified, approved],
                        backgroundColor: [
                            '#FF6384', 
                            '#36A2EB', 
                            '#4BC0C0'  
                        ],
                        borderWidth: 2,
                        borderColor: '#ffffff',
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom', labels: { font: { family: 'Sarabun' } } }
                    }
                }
            });
        }

        // Dashboard Handlers
        document.querySelectorAll('.approve-wl-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const button = e.target.closest('.approve-wl-btn');
                const id = button.dataset.id;
                
                if (confirm('คุณต้องการอนุมัติรายการนี้ใช่หรือไม่?')) {
                    const originalText = button.innerHTML;
                    button.innerHTML = '<div class="spinner" style="width: 16px; height: 16px; border-width: 2px;"></div>';
                    button.disabled = true;

                    try {
                        const success = await DB.approveWorkload(id);
                        if (success) {
                            Utils.showToast('อนุมัติรายการสำเร็จ', 'success');
                            setTimeout(() => window.location.reload(), 1500);
                        } else {
                            Utils.showToast('เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
                            button.innerHTML = originalText;
                            button.disabled = false;
                        }
                    } catch (error) {
                        console.error(error);
                        Utils.showToast('เกิดข้อผิดพลาดในการเชื่อมต่อ', 'error');
                        button.innerHTML = originalText;
                        button.disabled = false;
                    }
                }
            });
        });

        const detailsModal = document.getElementById('details-modal');
        document.getElementById('close-modal')?.addEventListener('click', () => {
            detailsModal.style.display = 'none';
        });

        document.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('.view-details-btn').dataset.id;
                const wl = workloads.find(w => w.id === id);
                if (!wl) return;

                let itemsHtml = wl.items.map(i => `
                    <div style="border: 1px solid #E5E7EB; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                        <div class="grid-2">
                            <div><strong>ภาระงาน:</strong> ${i.description}</div>
                            <div><strong>กลุ่มงาน:</strong> ${i.group}</div>
                            <div><strong>ชั่วโมง/สัปดาห์:</strong> ${i.hours}</div>
                            <div><strong>สถานะรับรอง:</strong> ${i.isCertified ? '<span style="color:var(--secondary)">รับรองแล้ว</span>' : '<span style="color:var(--danger)">ยังไม่รับรอง</span>'}</div>
                        </div>
                        ${i.isCertified && i.certifierSignature ? `
                            <div style="margin-top: 1rem; border-top: 1px dashed #E5E7EB; padding-top: 1rem;">
                                <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">ลายเซ็นผู้รับรอง:</div>
                                <img src="${i.certifierSignature}" style="max-height: 80px; border: 1px solid #eee; background: white;" />
                            </div>
                        ` : ''}
                    </div>
                `).join('');

                const contentHtml = `
                    <div class="grid-2" style="margin-bottom: 2rem; background: #F9FAFB; padding: 1.5rem; border-radius: 8px;">
                        <div><strong>ผู้รายงาน:</strong> ${wl.teacherInfo.name} ${wl.teacherInfo.surname}</div>
                        <div><strong>ตำแหน่ง:</strong> ${wl.teacherInfo.position}</div>
                        <div><strong>ชั่วโมงรวมทั้งหมด:</strong> ${wl.totalHours} ชม./สัปดาห์</div>
                        <div><strong>สถานะ:</strong> ${Utils.getStatusBadge(wl.status)}</div>
                    </div>
                    
                    <h3 style="margin-bottom: 1rem;">รายการภาระงาน</h3>
                    ${itemsHtml}

                    <h3 style="margin: 2rem 0 1rem;">ลายเซ็นผู้รายงาน</h3>
                    <div style="background: white; padding: 1rem; border: 1px solid #E5E7EB; border-radius: 8px; display: inline-block;">
                        <img src="${wl.reporterSignature}" style="max-height: 120px;" />
                    </div>

                    <div style="margin-top: 2rem; text-align: right; border-top: 1px solid #E5E7EB; padding-top: 1.5rem;">
                        <button class="btn btn-secondary close-modal-btn">ปิดหน้าต่าง</button>
                    </div>
                `;

                document.getElementById('modal-content').innerHTML = contentHtml;
                detailsModal.style.display = 'flex';
                
                document.querySelectorAll('.close-modal-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        detailsModal.style.display = 'none';
                    });
                });
            });
        });

        // User Management Handlers
        const userModal = document.getElementById('user-modal');
        const userForm = document.getElementById('user-form');
        
        document.getElementById('add-user-btn')?.addEventListener('click', () => {
            userForm.reset();
            document.getElementById('u-id').value = '';
            document.getElementById('user-modal-title').textContent = 'เพิ่มผู้ใช้งาน';
            document.getElementById('u-username').readOnly = false;
            userModal.style.display = 'flex';
        });

        document.getElementById('close-user-modal')?.addEventListener('click', () => {
            userModal.style.display = 'none';
        });

        document.querySelectorAll('.edit-user-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('.edit-user-btn').dataset.id;
                const userObj = users.find(u => u.id === id);
                if (!userObj) return;

                document.getElementById('u-id').value = userObj.id || '';
                document.getElementById('u-username').value = userObj.username || '';
                document.getElementById('u-username').readOnly = true; // prevent changing username/id
                document.getElementById('u-password').value = userObj.password || '';
                document.getElementById('u-name').value = userObj.name || '';
                document.getElementById('u-surname').value = userObj.surname || '';
                document.getElementById('u-position').value = userObj.position || '';
                document.getElementById('u-department').value = userObj.department || '';
                document.getElementById('u-role').value = userObj.role || 'teacher';
                
                document.getElementById('user-modal-title').textContent = 'แก้ไขผู้ใช้งาน';
                userModal.style.display = 'flex';
            });
        });

        document.querySelectorAll('.delete-user-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const button = e.target.closest('.delete-user-btn');
                const id = button.dataset.id;
                
                if (confirm('คุณต้องการลบผู้ใช้งานนี้อย่างถาวรใช่หรือไม่?')) {
                    const originalText = button.innerHTML;
                    button.innerHTML = '<div class="spinner" style="width: 16px; height: 16px; border-width: 2px;"></div>';
                    button.disabled = true;

                    try {
                        const success = await DB.deleteUser(id);
                        if (success) {
                            Utils.showToast('ลบผู้ใช้งานสำเร็จ', 'success');
                            // Let the DB listener handle reload, or just force reload
                            setTimeout(() => window.location.reload(), 1500);
                        } else {
                            Utils.showToast('เกิดข้อผิดพลาดในการลบ', 'error');
                            button.innerHTML = originalText;
                            button.disabled = false;
                        }
                    } catch (error) {
                        Utils.showToast('เกิดข้อผิดพลาดในการเชื่อมต่อ', 'error');
                        button.innerHTML = originalText;
                        button.disabled = false;
                    }
                }
            });
        });

        userForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = userForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<div class="spinner" style="width: 16px; height: 16px; border-width: 2px; margin: 0 auto;"></div>';
            submitBtn.disabled = true;

            const userData = {
                id: document.getElementById('u-id').value || document.getElementById('u-username').value,
                username: document.getElementById('u-username').value,
                password: document.getElementById('u-password').value,
                name: document.getElementById('u-name').value,
                surname: document.getElementById('u-surname').value,
                position: document.getElementById('u-position').value,
                department: document.getElementById('u-department').value,
                role: document.getElementById('u-role').value,
            };

            const success = await DB.saveUser(userData);
            
            if (success) {
                Utils.showToast('บันทึกข้อมูลสำเร็จ', 'success');
                userModal.style.display = 'none';
                setTimeout(() => window.location.reload(), 1500);
            } else {
                Utils.showToast('เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });

        // Listen for db updates to re-render if needed
        window.addEventListener('db-updated', () => {
            // Note: Since we reload the page on mutations, this is mainly for other clients.
            // If we wanted true SPA, we'd call App.route() here or a targeted render.
        });
    }
};
