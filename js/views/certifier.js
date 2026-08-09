const CertifierView = {
    signaturePad: null,
    currentItemToApprove: null,

    render() {
        const user = Auth.getCurrentUser();
        const pendingItems = DB.getPendingItemsForCertifier(user.id);
        
        let pendingHtml = '';
        if (pendingItems.length === 0) {
            pendingHtml = '<div style="text-align:center; padding: 3rem; color: var(--text-muted);">ไม่มีรายการรอรับรอง</div>';
        } else {
            pendingHtml = pendingItems.map((pi, idx) => `
                <div class="glass-panel" style="padding: 1.5rem; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-weight: 600; font-size: 1.1rem; margin-bottom: 0.5rem;">
                            ผู้รายงาน: ${pi.teacher.name} ${pi.teacher.surname}
                        </div>
                        <div style="color: var(--text-muted); margin-bottom: 0.25rem;">ภาระงาน: ${pi.item.description}</div>
                        <div style="color: var(--text-muted); margin-bottom: 0.5rem;">วันที่ส่ง: ${Utils.formatDate(pi.createdAt)}</div>
                        <div style="color: var(--primary); font-weight: 500;">จำนวนชั่วโมง: ${pi.item.hours} ชม./สัปดาห์</div>
                    </div>
                    <div>
                        <button class="btn btn-primary approve-btn" data-idx="${idx}">
                            ตรวจสอบและรับรอง
                        </button>
                    </div>
                </div>
            `).join('');
        }

        const workloads = DB.getAllWorkloadsForAdmin();
        let totalCount = workloads.length;
        let pendingCount = 0;
        let certifiedCount = 0;
        let approvedCount = 0;

        workloads.forEach(w => {
            const st = w.status || 'pending';
            if (st === 'pending') pendingCount++;
            else if (st === 'certified' || st === 'pending_admin') certifiedCount++;
            else if (st === 'approved') approvedCount++;
        });
        
        let dashboardHtml = `
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
                            <canvas id="certifierStatusChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return `
            <div class="app-header glass-panel" style="margin-bottom: 2rem; padding: 0 1.5rem;">
                <div style="display: flex; align-items: center; gap: 1.5rem;">
                    <img src="assets/logo.png" alt="โลโก้โรงเรียน" class="header-logo" onerror="this.style.display='none'">
                    <div class="user-info">
                        <div class="avatar" style="background-color: var(--secondary);">${user.name.charAt(0)}</div>
                        <div>
                            <div style="font-weight: 700; font-size: 1.25rem;">${user.name} ${user.surname}</div>
                            <div style="font-size: 1rem; color: var(--text-muted);">โหมด: ผู้รับรอง</div>
                        </div>
                    </div>
                </div>
                <button id="logout-btn" class="btn btn-danger">
                    <i data-lucide="log-out"></i> ออกจากระบบ
                </button>
            </div>

            <div id="dashboard-view">
                ${dashboardHtml}
                <h2 style="margin-bottom: 1.5rem;">รายการรอรับรอง</h2>
                ${pendingHtml}
            </div>

            <div id="certify-view" style="display: none;">
                <div class="glass-panel">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                        <h2 style="margin: 0;">ตรวจสอบภาระงาน</h2>
                        <button id="back-btn" class="btn btn-secondary btn-sm">
                            <i data-lucide="arrow-left"></i> กลับ
                        </button>
                    </div>
                    
                    <div id="certify-details" style="background: rgba(255,255,255,0.5); padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
                        <!-- details injected here -->
                    </div>

                    <form id="certify-form">
                        <div class="form-group" style="max-width: 300px;">
                            <label>จำนวนชั่วโมง/สัปดาห์ (สามารถแก้ไขได้)</label>
                            <input type="number" id="edit-hours" class="form-control" step="0.5" min="0" required>
                        </div>

                        <h4 style="margin: 2rem 0 1rem; color: var(--primary);">ลายเซ็นผู้รับรอง</h4>
                        <div class="signature-container">
                            <canvas id="certifier-signature"></canvas>
                            <div class="signature-actions">
                                <button type="button" id="clear-signature" class="btn btn-secondary" style="padding: 0.25rem 0.75rem; font-size: 0.85rem;">ล้างลายเซ็น</button>
                            </div>
                        </div>

                        <div style="margin-top: 2rem; text-align: right;">
                            <button type="submit" class="btn btn-secondary" style="background: var(--secondary); color: white; border-color: var(--secondary);">
                                <i data-lucide="check-square"></i> เซ็นรับรองและส่งอนุมัติ
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    },

    init() {
        const user = Auth.getCurrentUser();
        const pendingItems = DB.getPendingItemsForCertifier(user.id);
        
        // Logout
        document.getElementById('logout-btn')?.addEventListener('click', () => Auth.logout());

        // Initialize Chart
        const workloads = DB.getAllWorkloadsForAdmin();
        let pending = 0, certified = 0, approved = 0;
        workloads.forEach(w => {
            const st = w.status || 'pending';
            if (st === 'pending') pending++;
            else if (st === 'certified' || st === 'pending_admin') certified++;
            else if (st === 'approved') approved++;
        });

        const ctx = document.getElementById('certifierStatusChart');
        if (ctx && (pending > 0 || certified > 0 || approved > 0)) {
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['รอรับรอง', 'รออนุมัติ', 'อนุมัติแล้ว'],
                    datasets: [{
                        data: [pending, certified, approved],
                        backgroundColor: [
                            '#FF6384', // Bright Pink/Red for Pending
                            '#36A2EB', // Bright Blue for Certified
                            '#4BC0C0'  // Bright Teal/Green for Approved
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

        // Back button
        document.getElementById('back-btn')?.addEventListener('click', () => {
            document.getElementById('certify-view').style.display = 'none';
            document.getElementById('dashboard-view').style.display = 'block';
            if (this.signaturePad) this.signaturePad.clear();
        });

        // Approve buttons
        document.querySelectorAll('.approve-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.target.closest('.approve-btn').dataset.idx;
                this.currentItemToApprove = pendingItems[idx];
                
                // Fill details
                const detailHtml = `
                    <div class="grid-2">
                        <div><strong>ผู้รายงาน:</strong> ${this.currentItemToApprove.teacher.name} ${this.currentItemToApprove.teacher.surname}</div>
                        <div><strong>ตำแหน่ง:</strong> ${this.currentItemToApprove.teacher.position}</div>
                        <div style="grid-column: span 2;"><strong>ภาระงาน:</strong> ${this.currentItemToApprove.item.description}</div>
                        <div><strong>กลุ่มงาน:</strong> ${this.currentItemToApprove.item.group}</div>
                        <div><strong>วันที่รายงาน:</strong> ${Utils.formatDate(this.currentItemToApprove.createdAt)}</div>
                    </div>
                `;
                document.getElementById('certify-details').innerHTML = detailHtml;
                document.getElementById('edit-hours').value = this.currentItemToApprove.item.hours;

                document.getElementById('dashboard-view').style.display = 'none';
                document.getElementById('certify-view').style.display = 'block';

                // Init signature if not already
                if (!this.signaturePad) {
                    this.signaturePad = Utils.initSignaturePad('certifier-signature');
                    document.getElementById('clear-signature')?.addEventListener('click', () => {
                        if (this.signaturePad) this.signaturePad.clear();
                    });
                } else {
                    this.signaturePad.clear();
                }
            });
        });

        // Submit form
        document.getElementById('certify-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (this.signaturePad && this.signaturePad.isEmpty()) {
                Utils.showToast('กรุณาเซ็นชื่อรับรอง', 'error');
                return;
            }

            const newHours = Number(document.getElementById('edit-hours').value);
            const signatureBase64 = this.signaturePad.toDataURL();

            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<div class="spinner" style="width: 20px; height: 20px; border-width: 2px;"></div> กำลังบันทึก...';
            submitBtn.disabled = true;

            try {
                const success = await DB.certifyItem(
                    this.currentItemToApprove.workloadId, 
                    this.currentItemToApprove.item.id, 
                    newHours, 
                    signatureBase64
                );

                if (success) {
                    Utils.showToast('รับรองรายการสำเร็จ', 'success');
                    setTimeout(() => window.location.reload(), 1500);
                } else {
                    Utils.showToast('เกิดข้อผิดพลาด กรุณาลองใหม่', 'error');
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            } catch (error) {
                console.error(error);
                Utils.showToast('เกิดข้อผิดพลาดในการเชื่อมต่อ', 'error');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
};
