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

            // Migration: Bulk update teachers and remove leftovers
            if (!localStorage.getItem('force_teacher_update_v2')) {
                console.log("Running teacher bulk update v2 (cleanup leftovers)...");
                const allTeachers = mockUsers; // Use the mockUsers array defined above
                const batchTeachers = db.batch();
                
                // 1. Get all current users
                const currentUsersSnap = await db.collection('users').get();
                
                // 2. Identify all valid IDs
                const validIds = new Set(allTeachers.map(u => u.id));
                
                // 3. Delete any teacher that is not in the valid IDs
                currentUsersSnap.forEach(doc => {
                    const user = doc.data();
                    if (user.role === 'teacher' && !validIds.has(user.id)) {
                        batchTeachers.delete(doc.ref);
                    }
                });
                
                // 4. Update or create the valid teachers
                allTeachers.forEach(u => {
                    const docRef = db.collection('users').doc(u.id);
                    batchTeachers.set(docRef, u, { merge: true });
                });
                
                await batchTeachers.commit();
                localStorage.setItem('force_teacher_update_v2', 'true');
                console.log("Teacher bulk update v2 completed.");
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
    {
        "id": "t001",
        "username": "t001",
        "password": "wny@1234",
        "name": "นางสาวนุชนาฎ",
        "surname": "อำพันเสน",
        "position": "ครู/คศ.3",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t002",
        "username": "t002",
        "password": "wny@1234",
        "name": "นายพงษ์ศักดิ์",
        "surname": "ทองโพธิกุล",
        "position": "ครู/คศ.3",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t003",
        "username": "t003",
        "password": "wny@1234",
        "name": "นายสุชาติ",
        "surname": "สินทร",
        "position": "ครู/คศ.2",
        "department": "การงานอาชีพ",
        "role": "teacher"
    },
    {
        "id": "t004",
        "username": "t004",
        "password": "wny@1234",
        "name": "นางสาวสาวิทตรี",
        "surname": "อุ่นทองศิริ",
        "position": "ครู/คศ.1",
        "department": "คณิตศาสตร์",
        "role": "teacher"
    },
    {
        "id": "t005",
        "username": "t005",
        "password": "wny@1234",
        "name": "นายอานนท์",
        "surname": "วรวงค์",
        "position": "ครู/คศ.2",
        "department": "ภาษาไทย",
        "role": "teacher"
    },
    {
        "id": "t006",
        "username": "t006",
        "password": "wny@1234",
        "name": "นางสอางค์ศรี",
        "surname": "บุญสติ",
        "position": "ครู/คศ.3",
        "department": "ภาษาไทย",
        "role": "teacher"
    },
    {
        "id": "t007",
        "username": "t007",
        "password": "wny@1234",
        "name": "นางสาวนรินทร์",
        "surname": "สอาดรัมย์",
        "position": "ครู/คศ.2",
        "department": "ภาษาไทย",
        "role": "teacher"
    },
    {
        "id": "t008",
        "username": "t008",
        "password": "wny@1234",
        "name": "นางสาวจิรภา",
        "surname": "กันยาน้อย",
        "position": "ครู/คศ.2",
        "department": "ภาษาไทย",
        "role": "teacher"
    },
    {
        "id": "t009",
        "username": "t009",
        "password": "wny@1234",
        "name": "นางสาวภานุมาส",
        "surname": "ศรีสุวอ",
        "position": "ครู/คศ.2",
        "department": "ภาษาไทย",
        "role": "teacher"
    },
    {
        "id": "t010",
        "username": "t010",
        "password": "wny@1234",
        "name": "นางสาววิลินดา",
        "surname": "แก้วหนองสังข์",
        "position": "ครู/คศ.2",
        "department": "ภาษาไทย",
        "role": "teacher"
    },
    {
        "id": "t011",
        "username": "t011",
        "password": "wny@1234",
        "name": "นางสาวอรปรียา",
        "surname": "เหลือนับ",
        "position": "ครู/คศ.2",
        "department": "ภาษาไทย",
        "role": "teacher"
    },
    {
        "id": "t012",
        "username": "t012",
        "password": "wny@1234",
        "name": "นางสาวกรรณณภรรทร์",
        "surname": "ปัถพี",
        "position": "ครู/คศ.1",
        "department": "ภาษาไทย",
        "role": "teacher"
    },
    {
        "id": "t013",
        "username": "t013",
        "password": "wny@1234",
        "name": "นางสาวดวงใจ",
        "surname": "มังคละ",
        "position": "ครู/คศ.1",
        "department": "ภาษาไทย",
        "role": "teacher"
    },
    {
        "id": "t014",
        "username": "t014",
        "password": "wny@1234",
        "name": "นางสาวกาญติมา",
        "surname": "เกิดกล้า",
        "position": "ครู/คศ.1",
        "department": "ภาษาไทย",
        "role": "teacher"
    },
    {
        "id": "t015",
        "username": "t015",
        "password": "wny@1234",
        "name": "นางสาวประภัสสร",
        "surname": "พรมศรี",
        "position": "ครู/คศ.1",
        "department": "ภาษาไทย",
        "role": "teacher"
    },
    {
        "id": "t016",
        "username": "t016",
        "password": "wny@1234",
        "name": "นายสาธิต",
        "surname": "ธูปมงคล",
        "position": "ครู/คศ.1",
        "department": "ภาษาไทย",
        "role": "teacher"
    },
    {
        "id": "t017",
        "username": "t017",
        "password": "wny@1234",
        "name": "นางสาวขวัญจิรา",
        "surname": "ชัยพัฒน์ปรีชา",
        "position": "ครู/คศ.1",
        "department": "ภาษาไทย",
        "role": "teacher"
    },
    {
        "id": "t018",
        "username": "t018",
        "password": "wny@1234",
        "name": "นางธรรมรักษ์",
        "surname": "วัฒนพลาชัยกูร",
        "position": "ครู/คศ.3",
        "department": "ภาษาต่างประเทศ",
        "role": "teacher"
    },
    {
        "id": "t019",
        "username": "t019",
        "password": "wny@1234",
        "name": "นางอัญชลี",
        "surname": "งามขำ",
        "position": "ครู/คศ.3",
        "department": "ภาษาต่างประเทศ",
        "role": "teacher"
    },
    {
        "id": "t020",
        "username": "t020",
        "password": "wny@1234",
        "name": "นางสาวญาศิกานต์",
        "surname": "บุดสา",
        "position": "ครู/คศ.3",
        "department": "ภาษาต่างประเทศ",
        "role": "teacher"
    },
    {
        "id": "t021",
        "username": "t021",
        "password": "wny@1234",
        "name": "นางจินดาศรี",
        "surname": "แหลมทอง",
        "position": "ครู/คศ.3",
        "department": "ภาษาต่างประเทศ",
        "role": "teacher"
    },
    {
        "id": "t022",
        "username": "t022",
        "password": "wny@1234",
        "name": "นางสาวเรณู",
        "surname": "ฤาชา",
        "position": "ครู/คศ.3",
        "department": "ภาษาต่างประเทศ",
        "role": "teacher"
    },
    {
        "id": "t023",
        "username": "t023",
        "password": "wny@1234",
        "name": "นางสาววัลลภา",
        "surname": "เจริญศิริ",
        "position": "ครู/คศ.3",
        "department": "ภาษาต่างประเทศ",
        "role": "teacher"
    },
    {
        "id": "t024",
        "username": "t024",
        "password": "wny@1234",
        "name": "นางสาวอำภา",
        "surname": "บุญมาก",
        "position": "ครู/คศ.2",
        "department": "ภาษาต่างประเทศ",
        "role": "teacher"
    },
    {
        "id": "t025",
        "username": "t025",
        "password": "wny@1234",
        "name": "นายปกรณ์",
        "surname": "หงษ์ทอง",
        "position": "ครู/คศ.2",
        "department": "ภาษาต่างประเทศ",
        "role": "teacher"
    },
    {
        "id": "t026",
        "username": "t026",
        "password": "wny@1234",
        "name": "นางสาวธิยานันท์",
        "surname": "เมธีสิริพงศ์",
        "position": "ครู/คศ.1",
        "department": "ภาษาต่างประเทศ",
        "role": "teacher"
    },
    {
        "id": "t027",
        "username": "t027",
        "password": "wny@1234",
        "name": "นางสาวจิราพร",
        "surname": "จันทร์โสภา",
        "position": "ครู/คศ.1",
        "department": "ภาษาต่างประเทศ",
        "role": "teacher"
    },
    {
        "id": "t028",
        "username": "t028",
        "password": "wny@1234",
        "name": "นางสาวธวัลยา",
        "surname": "สุขมหาหลวง",
        "position": "ครู/คศ.1",
        "department": "ภาษาต่างประเทศ",
        "role": "teacher"
    },
    {
        "id": "t029",
        "username": "t029",
        "password": "wny@1234",
        "name": "นายธีรพงษ์",
        "surname": "แปงอุต",
        "position": "ครู/คศ.2",
        "department": "ภาษาต่างประเทศ",
        "role": "teacher"
    },
    {
        "id": "t030",
        "username": "t030",
        "password": "wny@1234",
        "name": "นายกีรติ",
        "surname": "ประสพพรรังสี",
        "position": "ครู/คศ.2",
        "department": "ภาษาต่างประเทศ",
        "role": "teacher"
    },
    {
        "id": "t031",
        "username": "t031",
        "password": "wny@1234",
        "name": "นายธนาธิวัฒน์",
        "surname": "วงษ์สุวรรณ",
        "position": "ครูผู้ช่วย",
        "department": "ภาษาต่างประเทศ",
        "role": "teacher"
    },
    {
        "id": "t032",
        "username": "t032",
        "password": "wny@1234",
        "name": "นางสาวพรพิมล",
        "surname": "พิมพ์พา",
        "position": "ครูผู้ช่วย",
        "department": "ภาษาต่างประเทศ",
        "role": "teacher"
    },
    {
        "id": "t033",
        "username": "t033",
        "password": "wny@1234",
        "name": "นางสาวพัชรินทร์",
        "surname": "วงค์ประคำ",
        "position": "ครูผู้ช่วย",
        "department": "ภาษาต่างประเทศ",
        "role": "teacher"
    },
    {
        "id": "t034",
        "username": "t034",
        "password": "wny@1234",
        "name": "นางสาวปิยราช",
        "surname": "พันธุ์กมลศิลป์",
        "position": "ครู/คศ.3",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t035",
        "username": "t035",
        "password": "wny@1234",
        "name": "นางสาวจอมใจ",
        "surname": "คำวิเศษ",
        "position": "ครู/คศ.3",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t036",
        "username": "t036",
        "password": "wny@1234",
        "name": "นางคันธรส",
        "surname": "คำพิพจน์",
        "position": "ครู/คศ.3",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t037",
        "username": "t037",
        "password": "wny@1234",
        "name": "นายณพดล",
        "surname": "กองทอง",
        "position": "ครู/คศ.3",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t038",
        "username": "t038",
        "password": "wny@1234",
        "name": "นางสาวสุธิรัตน์",
        "surname": "บรรดาล",
        "position": "ครู/คศ.3",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t039",
        "username": "t039",
        "password": "wny@1234",
        "name": "นางสาวกาญจนา",
        "surname": "จันทรทวี",
        "position": "ครู/คศ.3",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t040",
        "username": "t040",
        "password": "wny@1234",
        "name": "นางสาวมลฤดี",
        "surname": "ปัญญางาม",
        "position": "ครู/คศ.3",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t041",
        "username": "t041",
        "password": "wny@1234",
        "name": "นางสาวยุวะธิดา",
        "surname": "กิ่งทอง",
        "position": "ครู/คศ.3",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t042",
        "username": "t042",
        "password": "wny@1234",
        "name": "นางกาญจนา",
        "surname": "เกตมณี",
        "position": "ครู/คศ.3",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t043",
        "username": "t043",
        "password": "wny@1234",
        "name": "นางสาวสุธิดา",
        "surname": "เที่ยงทิศ",
        "position": "ครู/คศ.3",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t044",
        "username": "t044",
        "password": "wny@1234",
        "name": "นางภุมริน",
        "surname": "พุกสอน",
        "position": "ครู/คศ.3",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t045",
        "username": "t045",
        "password": "wny@1234",
        "name": "นางสาวสมพงษ์",
        "surname": "จันทร์มา",
        "position": "ครู/คศ.2",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t046",
        "username": "t046",
        "password": "wny@1234",
        "name": "นางสาวจิราพร",
        "surname": "อ่อนนนท์",
        "position": "ครู/คศ.2",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t047",
        "username": "t047",
        "password": "wny@1234",
        "name": "นางสาวณัฎฐา",
        "surname": "มูลปา",
        "position": "ครู/คศ.2",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t048",
        "username": "t048",
        "password": "wny@1234",
        "name": "นางปนิดา",
        "surname": "แสนเวียงจันทร์",
        "position": "ครู/คศ.2",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t049",
        "username": "t049",
        "password": "wny@1234",
        "name": "นางสาวปิติพร",
        "surname": "ขจรโมทย์",
        "position": "ครู/คศ.2",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t050",
        "username": "t050",
        "password": "wny@1234",
        "name": "นายอำนาจ",
        "surname": "ทัศนา",
        "position": "ครู/คศ.2",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t051",
        "username": "t051",
        "password": "wny@1234",
        "name": "นายสิทธิชัย",
        "surname": "โพธิ์",
        "position": "ครู/คศ.2",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t052",
        "username": "t052",
        "password": "wny@1234",
        "name": "นายพิทยา",
        "surname": "แห้วสุโน",
        "position": "ครู/คศ.2",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t053",
        "username": "t053",
        "password": "wny@1234",
        "name": "นายนราธร",
        "surname": "มาวรรณ",
        "position": "ครู/คศ.2",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t054",
        "username": "t054",
        "password": "wny@1234",
        "name": "นางสาวธนัชพร",
        "surname": "บุตรดี",
        "position": "ครู/คศ.1",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t055",
        "username": "t055",
        "password": "wny@1234",
        "name": "นายณัฐพล",
        "surname": "เหลืองสอาด",
        "position": "ครู/คศ.1",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t056",
        "username": "t056",
        "password": "wny@1234",
        "name": "นายพิชิต",
        "surname": "แตงอ่อน",
        "position": "ครู/คศ.1",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t057",
        "username": "t057",
        "password": "wny@1234",
        "name": "นายอรรถพร",
        "surname": "วงษ์ลา",
        "position": "ครู/คศ.1",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t058",
        "username": "t058",
        "password": "wny@1234",
        "name": "นางสาวปณิฏฐา",
        "surname": "บุญยงค์",
        "position": "ครู/คศ.1",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t059",
        "username": "t059",
        "password": "wny@1234",
        "name": "นายวัชรพงษ์",
        "surname": "ผลาผล",
        "position": "ครู/คศ.1",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t060",
        "username": "t060",
        "password": "wny@1234",
        "name": "นางสาวสิริมาศ",
        "surname": "สุภาพ",
        "position": "ครูผู้ช่วย",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t061",
        "username": "t061",
        "password": "wny@1234",
        "name": "นายณัฐพงศ์",
        "surname": "ระทะนาม",
        "position": "ครูผู้ช่วย",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t062",
        "username": "t062",
        "password": "wny@1234",
        "name": "นางสาวสุดา",
        "surname": "สอนดี",
        "position": "ครูผู้ช่วย",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t063",
        "username": "t063",
        "password": "wny@1234",
        "name": "นางสาวอาภรณ์",
        "surname": "ม่านทอง",
        "position": "ครูผู้ช่วย",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t064",
        "username": "t064",
        "password": "wny@1234",
        "name": "นางสาวภัทรธีรา",
        "surname": "แปงสี",
        "position": "ครูผู้ช่วย",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t065",
        "username": "t065",
        "password": "wny@1234",
        "name": "นางสาวปิยลักษณ์",
        "surname": "ขันทา",
        "position": "ครู/คศ.3",
        "department": "ศิลปะ",
        "role": "teacher"
    },
    {
        "id": "t066",
        "username": "t066",
        "password": "wny@1234",
        "name": "นางสาวณัฐพร",
        "surname": "ใจผ่อง",
        "position": "ครู/คศ.2",
        "department": "ศิลปะ",
        "role": "teacher"
    },
    {
        "id": "t067",
        "username": "t067",
        "password": "wny@1234",
        "name": "นางสาวพรสวรรค์",
        "surname": "จันดาหงษ์",
        "position": "ครู/คศ.2",
        "department": "ศิลปะ",
        "role": "teacher"
    },
    {
        "id": "t068",
        "username": "t068",
        "password": "wny@1234",
        "name": "นางสุวรรณี",
        "surname": "เกตุดี",
        "position": "ครู/คศ.2",
        "department": "ศิลปะ",
        "role": "teacher"
    },
    {
        "id": "t069",
        "username": "t069",
        "password": "wny@1234",
        "name": "นายชิษณุพงศ์",
        "surname": "วิธานติรวัฒน์",
        "position": "ครู/คศ.1",
        "department": "ศิลปะ",
        "role": "teacher"
    },
    {
        "id": "t070",
        "username": "t070",
        "password": "wny@1234",
        "name": "นายพนชาติ",
        "surname": "ปราณีตพลกรัง",
        "position": "ครู/คศ.1",
        "department": "ศิลปะ",
        "role": "teacher"
    },
    {
        "id": "t071",
        "username": "t071",
        "password": "wny@1234",
        "name": "นางสาวปัทมาวรรณ",
        "surname": "วันยานาม",
        "position": "ครูผู้ช่วย",
        "department": "ศิลปะ",
        "role": "teacher"
    },
    {
        "id": "t072",
        "username": "t072",
        "password": "wny@1234",
        "name": "นางเกศริน",
        "surname": "ทองโพธิกุล",
        "position": "ครู/คศ.2",
        "department": "สังคมศึกษาศาสนาและวัฒนธรรม",
        "role": "teacher"
    },
    {
        "id": "t073",
        "username": "t073",
        "password": "wny@1234",
        "name": "นางสาวศิริวรรณ",
        "surname": "ตุ้มมี",
        "position": "ครู/คศ.3",
        "department": "สังคมศึกษาศาสนาและวัฒนธรรม",
        "role": "teacher"
    },
    {
        "id": "t074",
        "username": "t074",
        "password": "wny@1234",
        "name": "นายพิชิต",
        "surname": "คำพลงาม",
        "position": "ครู/คศ.3",
        "department": "สังคมศึกษาศาสนาและวัฒนธรรม",
        "role": "teacher"
    },
    {
        "id": "t075",
        "username": "t075",
        "password": "wny@1234",
        "name": "นางสาวคมศรีจรัส",
        "surname": "วงจันทร์",
        "position": "ครู/คศ.3",
        "department": "สังคมศึกษาศาสนาและวัฒนธรรม",
        "role": "teacher"
    },
    {
        "id": "t076",
        "username": "t076",
        "password": "wny@1234",
        "name": "นางปฐวีกานต์",
        "surname": "ปริธรรมมัง",
        "position": "ครู/คศ.3",
        "department": "สังคมศึกษาศาสนาและวัฒนธรรม",
        "role": "teacher"
    },
    {
        "id": "t077",
        "username": "t077",
        "password": "wny@1234",
        "name": "นางสาวสนธินี",
        "surname": "ผิวแก้ว",
        "position": "ครู/คศ.3",
        "department": "สังคมศึกษาศาสนาและวัฒนธรรม",
        "role": "teacher"
    },
    {
        "id": "t078",
        "username": "t078",
        "password": "wny@1234",
        "name": "นางสาวรินนรัชญ์",
        "surname": "จันคณาลักษณ์",
        "position": "ครู/คศ.3",
        "department": "สังคมศึกษาศาสนาและวัฒนธรรม",
        "role": "teacher"
    },
    {
        "id": "t079",
        "username": "t079",
        "password": "wny@1234",
        "name": "นายอำนาจ",
        "surname": "เพลาะกระโทก",
        "position": "ครู/คศ.2",
        "department": "สังคมศึกษาศาสนาและวัฒนธรรม",
        "role": "teacher"
    },
    {
        "id": "t080",
        "username": "t080",
        "password": "wny@1234",
        "name": "นางสาววิลาสิณี",
        "surname": "พูลประเสริฐ",
        "position": "ครู/คศ.2",
        "department": "สังคมศึกษาศาสนาและวัฒนธรรม",
        "role": "teacher"
    },
    {
        "id": "t081",
        "username": "t081",
        "password": "wny@1234",
        "name": "นายศิวพงษ์",
        "surname": "แสงนอก",
        "position": "ครู/คศ.2",
        "department": "สังคมศึกษาศาสนาและวัฒนธรรม",
        "role": "teacher"
    },
    {
        "id": "t082",
        "username": "t082",
        "password": "wny@1234",
        "name": "นายธนิกกุล",
        "surname": "บุญอาจ",
        "position": "ครู/คศ.1",
        "department": "สังคมศึกษาศาสนาและวัฒนธรรม",
        "role": "teacher"
    },
    {
        "id": "t083",
        "username": "t083",
        "password": "wny@1234",
        "name": "นางสาวแสงเทียน",
        "surname": "กุ่มเดช",
        "position": "ครู/คศ.1",
        "department": "สังคมศึกษาศาสนาและวัฒนธรรม",
        "role": "teacher"
    },
    {
        "id": "t084",
        "username": "t084",
        "password": "wny@1234",
        "name": "นายเพิ่มพูล",
        "surname": "ทองล้วน",
        "position": "ครูผู้ช่วย",
        "department": "สังคมศึกษาศาสนาและวัฒนธรรม",
        "role": "teacher"
    },
    {
        "id": "t085",
        "username": "t085",
        "password": "wny@1234",
        "name": "นางสาวเกษร",
        "surname": "เขจรลาภ",
        "position": "ครู/คศ.2",
        "department": "สุขศึกษาและพลศึกษา",
        "role": "teacher"
    },
    {
        "id": "t086",
        "username": "t086",
        "password": "wny@1234",
        "name": "นางแววดาว",
        "surname": "สงวนกุล",
        "position": "ครู/คศ.3",
        "department": "สุขศึกษาและพลศึกษา",
        "role": "teacher"
    },
    {
        "id": "t087",
        "username": "t087",
        "password": "wny@1234",
        "name": "นางสาววิไลพร",
        "surname": "จิตรสวัสดิ์",
        "position": "ครู/คศ.2",
        "department": "สุขศึกษาและพลศึกษา",
        "role": "teacher"
    },
    {
        "id": "t088",
        "username": "t088",
        "password": "wny@1234",
        "name": "นายสิทธิชัย",
        "surname": "เทศจันทึก",
        "position": "ครู/คศ.1",
        "department": "สุขศึกษาและพลศึกษา",
        "role": "teacher"
    },
    {
        "id": "t089",
        "username": "t089",
        "password": "wny@1234",
        "name": "นายพลวัต",
        "surname": "คำสอน",
        "position": "ครู/คศ.1",
        "department": "สุขศึกษาและพลศึกษา",
        "role": "teacher"
    },
    {
        "id": "t090",
        "username": "t090",
        "password": "wny@1234",
        "name": "นายวุฒิพันธ์",
        "surname": "คันทา",
        "position": "ครูผู้ช่วย",
        "department": "สุขศึกษาและพลศึกษา",
        "role": "teacher"
    },
    {
        "id": "t091",
        "username": "t091",
        "password": "wny@1234",
        "name": "นางธนนันท์",
        "surname": "ภักดีพงษ์",
        "position": "ครู/คศ.3",
        "department": "การงานอาชีพ",
        "role": "teacher"
    },
    {
        "id": "t092",
        "username": "t092",
        "password": "wny@1234",
        "name": "นางสาวไพบูรณ์",
        "surname": "โนนหัวรอ",
        "position": "ครู/คศ.2",
        "department": "การงานอาชีพ",
        "role": "teacher"
    },
    {
        "id": "t093",
        "username": "t093",
        "password": "wny@1234",
        "name": "นายณัฐนนท์",
        "surname": "พงษ์ประเสริฐ",
        "position": "ครู/คศ.1",
        "department": "การงานอาชีพ",
        "role": "teacher"
    },
    {
        "id": "t094",
        "username": "t094",
        "password": "wny@1234",
        "name": "นางสาวขวัญจิรา",
        "surname": "วิไลฤทธิ์",
        "position": "ครูผู้ช่วย",
        "department": "การงานอาชีพ",
        "role": "teacher"
    },
    {
        "id": "t095",
        "username": "t095",
        "password": "wny@1234",
        "name": "นายสมฤทธิ์",
        "surname": "ชาญสมร",
        "position": "ครู/คศ.2",
        "department": "คณิตศาสตร์",
        "role": "teacher"
    },
    {
        "id": "t096",
        "username": "t096",
        "password": "wny@1234",
        "name": "นางสาวโชติกา",
        "surname": "ฤทธิ์เทพ",
        "position": "ครู/คศ.3",
        "department": "คณิตศาสตร์",
        "role": "teacher"
    },
    {
        "id": "t097",
        "username": "t097",
        "password": "wny@1234",
        "name": "นางสาวศิริวรรณ",
        "surname": "ปัญหา",
        "position": "ครู/คศ.3",
        "department": "คณิตศาสตร์",
        "role": "teacher"
    },
    {
        "id": "t098",
        "username": "t098",
        "password": "wny@1234",
        "name": "นางสาวธิตาพร",
        "surname": "สุรวิทย์",
        "position": "ครู/คศ.3",
        "department": "คณิตศาสตร์",
        "role": "teacher"
    },
    {
        "id": "t099",
        "username": "t099",
        "password": "wny@1234",
        "name": "นายนิคม",
        "surname": "พรมณี",
        "position": "ครู/คศ.3",
        "department": "คณิตศาสตร์",
        "role": "teacher"
    },
    {
        "id": "t100",
        "username": "t100",
        "password": "wny@1234",
        "name": "นางสาวอนงค์",
        "surname": "สายทอง",
        "position": "ครู/คศ.2",
        "department": "คณิตศาสตร์",
        "role": "teacher"
    },
    {
        "id": "t101",
        "username": "t101",
        "password": "wny@1234",
        "name": "นายจักรวรรดิ",
        "surname": "ไชยโคตร",
        "position": "ครู/คศ.2",
        "department": "คณิตศาสตร์",
        "role": "teacher"
    },
    {
        "id": "t102",
        "username": "t102",
        "password": "wny@1234",
        "name": "นางสาวสุภาภรณ์",
        "surname": "จันทร์แสง",
        "position": "ครู/คศ.2",
        "department": "คณิตศาสตร์",
        "role": "teacher"
    },
    {
        "id": "t103",
        "username": "t103",
        "password": "wny@1234",
        "name": "นางสาวจินตนันท์",
        "surname": "พลูโต",
        "position": "ครู/คศ.2",
        "department": "คณิตศาสตร์",
        "role": "teacher"
    },
    {
        "id": "t104",
        "username": "t104",
        "password": "wny@1234",
        "name": "นายรังสิมันตุ์",
        "surname": "เตชะอมรกุล",
        "position": "ครู/คศ.2",
        "department": "คณิตศาสตร์",
        "role": "teacher"
    },
    {
        "id": "t105",
        "username": "t105",
        "password": "wny@1234",
        "name": "นายนิกร",
        "surname": "ลาดนอก",
        "position": "ครู/คศ.2",
        "department": "คณิตศาสตร์",
        "role": "teacher"
    },
    {
        "id": "t106",
        "username": "t106",
        "password": "wny@1234",
        "name": "นางสาวสุชาดา",
        "surname": "กะจะเดิม",
        "position": "ครู/คศ.2",
        "department": "คณิตศาสตร์",
        "role": "teacher"
    },
    {
        "id": "t107",
        "username": "t107",
        "password": "wny@1234",
        "name": "นายรัตนพล",
        "surname": "มั่งเมืองชาวนา",
        "position": "ครู/คศ.2",
        "department": "คณิตศาสตร์",
        "role": "teacher"
    },
    {
        "id": "t108",
        "username": "t108",
        "password": "wny@1234",
        "name": "นางสาวกนกวรรณ",
        "surname": "นิยมรัตน์",
        "position": "ครู/คศ.1",
        "department": "คณิตศาสตร์",
        "role": "teacher"
    },
    {
        "id": "t109",
        "username": "t109",
        "password": "wny@1234",
        "name": "นายปิยะ",
        "surname": "คำสองสี",
        "position": "ครู/คศ.1",
        "department": "คณิตศาสตร์",
        "role": "teacher"
    },
    {
        "id": "t110",
        "username": "t110",
        "password": "wny@1234",
        "name": "นายณัฐนนท์",
        "surname": "ทวีคูณ",
        "position": "ครูผู้ช่วย",
        "department": "คณิตศาสตร์",
        "role": "teacher"
    },
    {
        "id": "t111",
        "username": "t111",
        "password": "wny@1234",
        "name": "นายลัญจกร",
        "surname": "เลิศสีดา",
        "position": "ครูผู้ช่วย",
        "department": "คณิตศาสตร์",
        "role": "teacher"
    },
    {
        "id": "t112",
        "username": "t112",
        "password": "wny@1234",
        "name": "นายนิพนธ์",
        "surname": "บุญสุข",
        "position": "ครูผู้ช่วย",
        "department": "คณิตศาสตร์",
        "role": "teacher"
    },
    {
        "id": "t113",
        "username": "t113",
        "password": "wny@1234",
        "name": "นายเริงศักดิ์",
        "surname": "จันทร์นวล",
        "position": "ครู/คศ.2",
        "department": "",
        "role": "teacher"
    },
    {
        "id": "c001",
        "username": "c001",
        "password": "wny@0000",
        "name": "วิชาญ",
        "surname": "หัวหน้าหมวด",
        "position": "หัวหน้ากลุ่มสาระฯ",
        "department": "วิทยาศาสตร์",
        "role": "certifier"
    },
    {
        "id": "admin",
        "username": "admin",
        "password": "arporn1234",
        "name": "ผู้ดูแล",
        "surname": "ระบบ",
        "position": "ผู้อำนวยการ",
        "department": "บริหาร",
        "role": "admin"
    }
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
