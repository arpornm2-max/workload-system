const TeacherView = {
    signaturePad: null,
    
    render() {
        const user = Auth.getCurrentUser();
        const workloads = DB.getWorkloadsByTeacher(user.id);
        const certifiers = DB.getCertifiers();
        
        let workloadsListHtml = '';
        if (workloads.length === 0) {
            workloadsListHtml = '<div style="text-align:center; padding: 2rem; color: var(--text-muted);">ยังไม่มีรายการภาระงาน</div>';
        } else {
            // Sort by newest first
            workloads.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
            workloadsListHtml = workloads.map(w => {
                const canDelete = w.status === 'pending';
                const deleteBtnHtml = canDelete 
                    ? `<button class="btn btn-danger btn-sm delete-workload-btn" data-id="${w.id}" style="padding: 0.25rem 0.5rem; margin-top: 0.5rem; width: 100%;"><i data-lucide="trash-2" style="width:14px; height:14px;"></i> ลบรายการนี้</button>` 
                    : '';
                return `
                <div class="glass-panel" style="padding: 1.5rem; margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <strong>รายการวันที่ ${Utils.formatDate(w.createdAt)}</strong>
                        ${Utils.getStatusBadge(w.status)}
                    </div>
                    <div>รวมเวลา: ${w.totalHours} ชั่วโมง</div>
                    <div style="margin-top: 1rem; font-size: 0.9rem; color: var(--text-muted); display: flex; justify-content: space-between; align-items: center;">
                        <span>มีภาระงาน ${w.items.length} รายการ</span>
                        <button class="btn btn-secondary btn-sm view-details-btn-teacher" data-id="${w.id}" style="padding: 0.25rem 0.5rem;"><i data-lucide="eye" style="width:14px; height:14px;"></i> ดูรายละเอียด</button>
                    </div>
                    ${deleteBtnHtml}
                </div>
                `;
            }).join('');
        }

        const certifierOptions = certifiers.map(c => 
            `<option value="${c.id}" data-pos="${c.position}">${c.name} ${c.surname}</option>`
        ).join('');

        return `
            <div class="app-header glass-panel" style="margin-bottom: 2rem; padding: 0 1.5rem;">
                <div style="display: flex; align-items: center; gap: 1.5rem;">
                    <img src="assets/logo.png" alt="โลโก้โรงเรียน" class="header-logo" onerror="this.style.display='none'">
                    <div class="user-info">
                        <div class="avatar">${user.name.charAt(0)}</div>
                        <div>
                            <div style="font-weight: 700; font-size: 1.25rem;">${user.name} ${user.surname}</div>
                            <div style="font-size: 1rem; color: var(--text-muted);">โหมด: ผู้รายงาน (ครู)</div>
                        </div>
                    </div>
                </div>
                <button id="logout-btn" class="btn btn-danger">
                    <i data-lucide="log-out"></i> ออกจากระบบ
                </button>
            </div>

            <div class="grid-2" style="grid-template-columns: 1fr 2fr;">
                <!-- Sidebar: History -->
                <div>
                    <div class="glass-panel" style="padding: 1.5rem;">
                        <h3 style="margin-bottom: 1.5rem;">ประวัติการส่งรายงาน</h3>
                        ${workloadsListHtml}
                    </div>
                </div>

                <!-- Main Content: New Form -->
                <div class="glass-panel">
                    <h2 style="margin-bottom: 1.5rem;">แบบรายงานภาระงาน</h2>
                    <form id="workload-form">
                        <!-- Part 1: Info -->
                        <h4 style="margin-bottom: 1rem; color: var(--primary);">ส่วนที่ 1: ข้อมูลผู้รายงาน</h4>
                        <div class="grid-2">
                            <div class="form-group">
                                <label>ชื่อ</label>
                                <input type="text" class="form-control" value="${user.name}" readonly>
                            </div>
                            <div class="form-group">
                                <label>สกุล</label>
                                <input type="text" class="form-control" value="${user.surname}" readonly>
                            </div>
                            <div class="form-group">
                                <label>ตำแหน่ง</label>
                                <input type="text" class="form-control" value="${user.position}" readonly>
                            </div>
                            <div class="form-group">
                                <label>กลุ่มสาระ</label>
                                <input type="text" class="form-control" value="${user.department}" readonly>
                            </div>
                        </div>

                        <!-- Part 2: Dynamic Rows -->
                        <div style="margin-top: 2rem; display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                            <h4 style="color: var(--primary); margin: 0;">ส่วนที่ 2: รายการภาระงาน</h4>
                            <button type="button" id="add-row-btn" class="btn btn-primary btn-sm" style="padding: 0.5rem 1rem;">
                                <i data-lucide="plus"></i> เพิ่มภาระงาน
                            </button>
                        </div>
                        
                        <div id="workload-items-container" class="workload-list">
                            <!-- Rows will be added here -->
                        </div>

                        <div style="text-align: right; margin-bottom: 2rem; font-size: 1.25rem; font-weight: 600;">
                            รวม: <span id="total-hours" style="color: var(--primary);">0</span> ชั่วโมง/สัปดาห์
                        </div>

                        <!-- Part 3: Signature -->
                        <h4 style="margin-bottom: 1rem; color: var(--primary);">ส่วนที่ 3: ลายเซ็นผู้รายงาน</h4>
                        <div class="signature-container">
                            <canvas id="teacher-signature"></canvas>
                            <div class="signature-actions">
                                <button type="button" id="clear-signature" class="btn btn-secondary" style="padding: 0.25rem 0.75rem; font-size: 0.85rem;">ล้างลายเซ็น</button>
                            </div>
                        </div>

                        <div style="margin-top: 2rem; text-align: right;">
                            <button type="submit" class="btn btn-primary">
                                <i data-lucide="send"></i> ส่งรายงานขออนุมัติ
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Modal for Teacher Workload details -->
            <div id="teacher-details-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 100; align-items: center; justify-content: center;">
                <div class="glass-panel" style="width: 90%; max-width: 800px; max-height: 90vh; overflow-y: auto; position: relative;">
                    <button id="close-teacher-modal" class="btn btn-secondary btn-icon" style="position: absolute; top: 1rem; right: 1rem; z-index: 10;">
                        <i data-lucide="x"></i>
                    </button>
                    <h2 style="margin-bottom: 1.5rem;">รายละเอียดภาระงาน</h2>
                    <div id="teacher-modal-content"></div>
                </div>
            </div>
        `;
    },

    init() {
        // Logout
        document.getElementById('logout-btn')?.addEventListener('click', () => Auth.logout());

        // Signature Pad
        this.signaturePad = Utils.initSignaturePad('teacher-signature');
        document.getElementById('clear-signature')?.addEventListener('click', () => {
            if (this.signaturePad) this.signaturePad.clear();
        });

        // Dynamic Rows
        const container = document.getElementById('workload-items-container');
        const addRowBtn = document.getElementById('add-row-btn');
        let rowCount = 0;
        const certifiers = DB.getCertifiers();
        const certifierOptions = certifiers.map(c => 
            `<option value="${c.id}" data-pos="${c.position}">${c.name} ${c.surname}</option>`
        ).join('');

        const addRow = () => {
            rowCount++;
            const id = 'row_' + Date.now() + '_' + rowCount;
            const rowHtml = `
                <div class="workload-item" id="${id}">
                    <button type="button" class="btn delete-button" data-tooltip="ลบภาระงานนี้" onclick="document.getElementById('${id}').remove(); window.updateTotalHours();">
                        ✕
                    </button>
                    <div class="grid-2">
                        <div class="form-group" style="grid-column: span 2;">
                            <label>ภาระงาน</label>
                            <textarea class="form-control w-desc" required placeholder="ระบุรายละเอียดภาระงาน"></textarea>
                        </div>
                        <div class="form-group">
                            <label>กลุ่มงาน</label>
                            <select class="form-control w-group" required>
                                <option value="">-- เลือกกลุ่มงาน --</option>
                                <option value="วิชาการ">วิชาการ</option>
                                <option value="งบประมาณ">งบประมาณ</option>
                                <option value="บริหารงานบุคคล">บริหารงานบุคคล</option>
                                <option value="บริหารงานทั่วไป">บริหารงานทั่วไป</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>ชั่วโมง/สัปดาห์</label>
                            <input type="number" class="form-control w-hours" min="0" step="0.5" required placeholder="0">
                        </div>
                        <div class="form-group">
                            <label>ผู้รับรอง</label>
                            <select class="form-control w-cert-id" required>
                                <option value="">-- เลือกผู้รับรอง --</option>
                                ${certifierOptions}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>ตำแหน่งผู้รับรอง</label>
                            <input type="text" class="form-control w-cert-pos" required readonly placeholder="เลือกผู้รับรองก่อน">
                        </div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', rowHtml);
            
            // Re-init icons for new row
            if (window.lucide) window.lucide.createIcons({ root: document.getElementById(id) });

            // Event listener for certifier change
            const row = document.getElementById(id);
            const select = row.querySelector('.w-cert-id');
            const posInput = row.querySelector('.w-cert-pos');
            select.addEventListener('change', (e) => {
                const option = e.target.options[e.target.selectedIndex];
                posInput.value = option.dataset.pos || '';
            });

            // Event listener for hours change
            row.querySelector('.w-hours').addEventListener('input', () => window.updateTotalHours());
        };

        window.updateTotalHours = () => {
            let total = 0;
            document.querySelectorAll('.w-hours').forEach(input => {
                total += Number(input.value) || 0;
            });
            document.getElementById('total-hours').innerText = total;
        };

        addRowBtn?.addEventListener('click', addRow);
        
        // Add first row by default
        if (container && container.children.length === 0) {
            addRow();
        }

        // Form Submit
        document.getElementById('workload-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (this.signaturePad && this.signaturePad.isEmpty()) {
                Utils.showToast('กรุณาเซ็นชื่อในช่องลายเซ็น', 'error');
                return;
            }

            const items = [];
            document.querySelectorAll('.workload-item').forEach(row => {
                items.push({
                    id: 'item_' + Math.random().toString(36).substring(7),
                    description: row.querySelector('.w-desc').value,
                    group: row.querySelector('.w-group').value,
                    hours: Number(row.querySelector('.w-hours').value),
                    certifierId: row.querySelector('.w-cert-id').value,
                    certifierPosition: row.querySelector('.w-cert-pos').value,
                    isCertified: false
                });
            });

            if (items.length === 0) {
                Utils.showToast('กรุณาเพิ่มภาระงานอย่างน้อย 1 รายการ', 'error');
                return;
            }

            const totalHours = items.reduce((sum, item) => sum + item.hours, 0);
            const signatureBase64 = this.signaturePad.toDataURL();
            const user = Auth.getCurrentUser();

            const payload = {
                id: 'wl_' + Date.now(),
                teacherId: user.id,
                teacherInfo: {
                    name: user.name,
                    surname: user.surname,
                    position: user.position,
                    department: user.department
                },
                status: 'pending',
                createdAt: new Date().toISOString(),
                totalHours: totalHours,
                reporterSignature: signatureBase64,
                items: items
            };

            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<div class="spinner" style="width: 20px; height: 20px; border-width: 2px;"></div> กำลังบันทึก...';
            submitBtn.disabled = true;

            try {
                const success = await DB.saveWorkload(payload);
                if (success) {
                    Utils.showToast('ส่งรายงานสำเร็จ', 'success');
                    // Reload page to show new history
                    setTimeout(() => window.location.reload(), 1500);
                } else {
                    Utils.showToast('เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
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

        // Delete Workload Handlers
        document.querySelectorAll('.delete-workload-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const button = e.target.closest('.delete-workload-btn');
                const id = button.dataset.id;
                
                if (confirm('คุณต้องการลบรายงานนี้อย่างถาวรใช่หรือไม่?')) {
                    const originalText = button.innerHTML;
                    button.innerHTML = '<div class="spinner" style="width: 14px; height: 14px; border-width: 2px;"></div>';
                    button.disabled = true;

                    try {
                        const success = await DB.deleteWorkload(id);
                        if (success) {
                            Utils.showToast('ลบรายงานสำเร็จ', 'success');
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

        // Details Modal Handlers
        const detailsModal = document.getElementById('teacher-details-modal');
        document.getElementById('close-teacher-modal')?.addEventListener('click', () => {
            detailsModal.style.display = 'none';
        });

        const workloadsList = DB.getWorkloadsByTeacher(Auth.getCurrentUser().id);
        document.querySelectorAll('.view-details-btn-teacher').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('.view-details-btn-teacher').dataset.id;
                const wl = workloadsList.find(w => w.id === id);
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

                    <div style="margin-top: 2rem; text-align: right; border-top: 1px solid #E5E7EB; padding-top: 1.5rem;">
                        <button class="btn btn-secondary close-teacher-modal-btn">ปิดหน้าต่าง</button>
                    </div>
                `;

                document.getElementById('teacher-modal-content').innerHTML = contentHtml;
                detailsModal.style.display = 'flex';
                
                document.querySelectorAll('.close-teacher-modal-btn').forEach(b => {
                    b.addEventListener('click', () => {
                        detailsModal.style.display = 'none';
                    });
                });
            });
        });
    }
};
