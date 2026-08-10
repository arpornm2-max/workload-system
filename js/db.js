const firebaseConfig = {
  apiKey: "AIzaSyA1O3QPeF1WulSzl9WJq2nvRPJlvFoqSuk",
  authDomain: "workwny.firebaseapp.com",
  projectId: "workwny",
  storageBucket: "workwny.firebasestorage.app",
  messagingSenderId: "350548750205",
  appId: "1:350548750205:web:c8fc490f8afebbc94ca614"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

const DB = {
    async init() {
        try {
            await this.seedUsersIfEmpty();
            
            // Migration: update ALL existing users' passwords to new defaults unconditionally
            if (!localStorage.getItem('force_pwd_reset_done_v2')) {
                const usersSnapMigrate = await db.collection('users').get();
                const batchMigrate = db.batch();
                let hasMigrations = false;
                usersSnapMigrate.forEach(doc => {
                    const user = doc.data();
                    let updated = false;
                    if (user.role === 'teacher' && user.password !== 'wny@1234') { user.password = 'wny@1234'; updated = true; }
                    if (user.role === 'certifier' && user.password !== 'wny@0000') { user.password = 'wny@0000'; updated = true; }
                    if (user.role === 'admin' && user.password !== 'arporn1234') { user.password = 'arporn1234'; updated = true; }
                    
                    if (updated) {
                        batchMigrate.update(doc.ref, { password: user.password });
                        hasMigrations = true;
                    }
                });
                if (hasMigrations) await batchMigrate.commit();
                localStorage.setItem('force_pwd_reset_done_v2', 'true');
            }

            // Listen to users
            db.collection('users').onSnapshot(snapshot => {
                const users = [];
                snapshot.forEach(doc => users.push(doc.data()));
                localStorage.setItem('users', JSON.stringify(users));
                window.dispatchEvent(new Event('db-updated'));
            });

            // Listen to workloads
            db.collection('workloads').onSnapshot(snapshot => {
                const workloads = [];
                snapshot.forEach(doc => workloads.push(doc.data()));
                localStorage.setItem('workloads', JSON.stringify(workloads));
                
                // Dispatch event so UI can re-render if needed
                window.dispatchEvent(new Event('db-updated'));
            });
            
            // Initial fetch to ensure data is loaded before proceeding
            const usersSnap = await db.collection('users').get();
            const users = [];
            usersSnap.forEach(doc => users.push(doc.data()));
            localStorage.setItem('users', JSON.stringify(users));

            const wlSnap = await db.collection('workloads').get();
            const workloads = [];
            wlSnap.forEach(doc => workloads.push(doc.data()));
            localStorage.setItem('workloads', JSON.stringify(workloads));
            
        } catch (error) {
            console.error("Firebase init error:", error);
        }
    },

    async seedUsersIfEmpty() {
        const snap = await db.collection('users').limit(1).get();
        if (snap.empty) {
            console.log("Seeding mock users...");
            const mockUsers = [
                { id: 't001', username: 't001', password: 'wny@1234', name: 'สมชาย', surname: 'ใจดี', position: 'ครู คศ.1', department: 'วิทยาศาสตร์', role: 'teacher' },
                { id: 't002', username: 't002', password: 'wny@1234', name: 'สมหญิง', surname: 'รักเรียน', position: 'ครู คศ.2', department: 'คณิตศาสตร์', role: 'teacher' },
                { id: 'c001', username: 'c001', password: 'wny@0000', name: 'วิชาญ', surname: 'หัวหน้าหมวด', position: 'หัวหน้ากลุ่มสาระฯ', department: 'วิทยาศาสตร์', role: 'certifier' },
                { id: 'admin', username: 'admin', password: 'arporn1234', name: 'ผู้ดูแล', surname: 'ระบบ', position: 'ผู้อำนวยการ', department: 'บริหาร', role: 'admin' }
            ];
            const batch = db.batch();
            mockUsers.forEach(u => {
                const ref = db.collection('users').doc(u.id);
                batch.set(ref, u);
            });
            await batch.commit();
        }
    },

    getUsers() {
        return JSON.parse(localStorage.getItem('users') || '[]');
    },

    getUserByUsername(username) {
        return this.getUsers().find(u => u.username === username);
    },

    getCertifiers() {
        return this.getUsers().filter(u => u.role === 'certifier');
    },

    async saveWorkload(workloadData) {
        try {
            const workloadRef = db.collection('workloads').doc(workloadData.id);
            await workloadRef.set(workloadData);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    },

    getWorkloadsByTeacher(teacherId) {
        const workloads = JSON.parse(localStorage.getItem('workloads') || '[]');
        return workloads.filter(w => w.teacherId === teacherId);
    },

    getPendingItemsForCertifier(certifierId) {
        const workloads = JSON.parse(localStorage.getItem('workloads') || '[]');
        const pendingItems = [];

        workloads.forEach(wl => {
            if (wl.status === 'approved') return;
            
            wl.items.forEach(item => {
                if (item.certifierId === certifierId && !item.isCertified) {
                    pendingItems.push({
                        workloadId: wl.id,
                        teacher: wl.teacherInfo,
                        item: item,
                        createdAt: wl.createdAt
                    });
                }
            });
        });
        return pendingItems;
    },

    async certifyItem(workloadId, itemId, newHours, signatureBase64) {
        try {
            const docRef = db.collection('workloads').doc(workloadId);
            const doc = await docRef.get();
            if (!doc.exists) return false;

            const wl = doc.data();
            const itemIndex = wl.items.findIndex(i => i.id === itemId);
            if (itemIndex > -1) {
                wl.items[itemIndex].hours = newHours;
                wl.items[itemIndex].isCertified = true;
                wl.items[itemIndex].certifierSignature = signatureBase64;
                wl.items[itemIndex].certifiedAt = new Date().toISOString();
                
                // Recalculate total hours
                wl.totalHours = wl.items.reduce((sum, item) => sum + Number(item.hours || 0), 0);
                
                // Check if all items are certified
                const allCertified = wl.items.every(i => i.isCertified);
                if (allCertified) {
                    wl.status = 'certified';
                }
                
                await docRef.update(wl);
                return true;
            }
            return false;
        } catch (e) {
            console.error(e);
            return false;
        }
    },

    getAllWorkloadsForAdmin() {
        return JSON.parse(localStorage.getItem('workloads') || '[]');
    },

    async saveUser(userData) {
        try {
            // Ensure ID is set (either from existing or same as username for new users)
            if (!userData.id) {
                userData.id = userData.username;
            }
            await db.collection('users').doc(userData.id).set(userData);
            return true;
        } catch (e) {
            console.error("Error saving user: ", e);
            return false;
        }
    },

    async deleteUser(userId) {
        try {
            await db.collection('users').doc(userId).delete();
            return true;
        } catch (e) {
            console.error("Error deleting user: ", e);
            return false;
        }
    },

    async approveWorkload(workloadId) {
        try {
            await db.collection('workloads').doc(workloadId).update({
                status: 'approved',
                approvedAt: new Date().toISOString()
            });
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    },

    async deleteWorkload(workloadId) {
        try {
            await db.collection('workloads').doc(workloadId).delete();
            return true;
        } catch (e) {
            console.error("Error deleting workload: ", e);
            return false;
        }
    },

    async saveUserSignature(userId, signatureBase64) {
        try {
            await db.collection('users').doc(userId).update({
                savedSignature: signatureBase64
            });
            
            // Update local storage
            const users = this.getUsers();
            const idx = users.findIndex(u => u.id === userId);
            if (idx > -1) {
                users[idx].savedSignature = signatureBase64;
                localStorage.setItem('users', JSON.stringify(users));
                
                // Update current user if it's them
                const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
                if (currentUser && currentUser.id === userId) {
                    currentUser.savedSignature = signatureBase64;
                    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
                }
            }
            return true;
        } catch (e) {
            console.error("Error saving signature:", e);
            return false;
        }
    },

    async bulkCertifyItems(itemsToCertify, signatureBase64) {
        try {
            const batch = db.batch();
            const workloadsData = {};

            for (const item of itemsToCertify) {
                if (!workloadsData[item.workloadId]) {
                    const doc = await db.collection('workloads').doc(item.workloadId).get();
                    if (doc.exists) workloadsData[item.workloadId] = doc.data();
                }
            }

            for (const item of itemsToCertify) {
                const wl = workloadsData[item.workloadId];
                if (!wl) continue;
                const iIndex = wl.items.findIndex(i => i.id === item.itemId);
                if (iIndex > -1) {
                    wl.items[iIndex].isCertified = true;
                    wl.items[iIndex].certifierSignature = signatureBase64;
                    wl.items[iIndex].certifiedAt = new Date().toISOString();
                }
            }

            Object.keys(workloadsData).forEach(wlId => {
                const wl = workloadsData[wlId];
                wl.totalHours = wl.items.reduce((sum, i) => sum + Number(i.hours || 0), 0);
                const allCertified = wl.items.every(i => i.isCertified);
                if (allCertified) {
                    wl.status = 'certified';
                }
                const ref = db.collection('workloads').doc(wlId);
                batch.update(ref, {
                    items: wl.items,
                    totalHours: wl.totalHours,
                    status: wl.status || 'pending'
                });
            });

            await batch.commit();
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    },

    async bulkApproveWorkloads(workloadIds) {
        try {
            const batch = db.batch();
            workloadIds.forEach(id => {
                const ref = db.collection('workloads').doc(id);
                batch.update(ref, {
                    status: 'approved',
                    approvedAt: new Date().toISOString()
                });
            });
            await batch.commit();
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }
};
