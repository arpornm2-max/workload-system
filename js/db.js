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
            
            // Listen to users
            db.collection('users').onSnapshot(snapshot => {
                const users = [];
                snapshot.forEach(doc => users.push(doc.data()));
                localStorage.setItem('users', JSON.stringify(users));
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
                { id: 't001', username: 't001', password: '123', name: 'สมชาย', surname: 'ใจดี', position: 'ครู คศ.1', department: 'วิทยาศาสตร์', role: 'teacher' },
                { id: 't002', username: 't002', password: '123', name: 'สมหญิง', surname: 'รักเรียน', position: 'ครู คศ.2', department: 'คณิตศาสตร์', role: 'teacher' },
                { id: 'c001', username: 'c001', password: '123', name: 'วิชาญ', surname: 'หัวหน้าหมวด', position: 'หัวหน้ากลุ่มสาระฯ', department: 'วิทยาศาสตร์', role: 'certifier' },
                { id: 'admin', username: 'admin', password: '123', name: 'ผู้ดูแล', surname: 'ระบบ', position: 'ผู้อำนวยการ', department: 'บริหาร', role: 'admin' }
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
                    wl.status = 'pending_admin';
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
    }
};
