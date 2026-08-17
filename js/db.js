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

const mockUsers = [
    {
        "id": "t225",
        "username": "t225",
        "password": "wny@1234",
        "name": "นายณัฐนนท์",
        "surname": "พงษ์ประเสริฐ",
        "position": "ครู คศ.1",
        "department": "การงานอาชีพ",
        "role": "teacher"
    },
    {
        "id": "t638",
        "username": "t638",
        "password": "wny@1234",
        "name": "นางสาวขวัญจิรา",
        "surname": "วิไลฤทธิ์",
        "position": "ครูผูู้ช่วย",
        "department": "การงานอาชีพ",
        "role": "teacher"
    },
    {
        "id": "t214",
        "username": "t214",
        "password": "wny@1234",
        "name": "นางสาวไพบูรณ์",
        "surname": "โนนหัวรอ",
        "position": "ครู คศ.2",
        "department": "การงานอาชีพ",
        "role": "teacher"
    },
    {
        "id": "t607",
        "username": "t607",
        "password": "wny@1234",
        "name": "นางธนนันท์",
        "surname": "ภักดีพงษ์",
        "position": "ครู คศ.3",
        "department": "การงานอาชีพ",
        "role": "teacher"
    },
    {
        "id": "t608",
        "username": "t608",
        "password": "wny@1234",
        "name": "นายสุชาติ",
        "surname": "สินทร",
        "position": "ครู คศ.2",
        "department": "การงานอาชีพ",
        "role": "teacher"
    },
    {
        "id": "t644",
        "username": "t644",
        "password": "wny@1234",
        "name": "นายณัฐนนท์",
        "surname": "ทวีคูณ",
        "position": "ครูผู้ช่วย",
        "department": "คณิตศาสตร์",
        "role": "teacher"
    },
    {
        "id": "t621",
        "username": "t621",
        "password": "wny@1234",
        "name": "นายปิยะ",
        "surname": "คำสองสี",
        "position": "ครูผู้ช่วย",
        "department": "คณิตศาสตร์",
        "role": "teacher"
    },
    {
        "id": "t647",
        "username": "t647",
        "password": "wny@1234",
        "name": "นายลัญจกร",
        "surname": "เลิศสีดา",
        "position": "ครูผู้ช่วย",
        "department": "คณิตศาสตร์",
        "role": "teacher"
    },
    {
        "id": "t660",
        "username": "t660",
        "password": "wny@1234",
        "name": "นางสาวพุทธิดา",
        "surname": "โอภาส",
        "position": "ครูผู้ช่วย",
        "department": "คณิตศาสตร์",
        "role": "teacher"
    },
    {
        "id": "t103",
        "username": "t103",
        "password": "wny@1234",
        "name": "นางสาวอนงค์",
        "surname": "สายทอง",
        "position": "ครู คศ.2",
        "department": "คณิตศาสตร์",
        "role": "teacher"
    },
    {
        "id": "t104",
        "username": "t104",
        "password": "wny@1234",
        "name": "นายรัตนพล",
        "surname": "มั่งเมืองชาวนา",
        "position": "ครู คศ.2",
        "department": "คณิตศาสตร์",
        "role": "teacher"
    },
    {
        "id": "t111",
        "username": "t111",
        "password": "wny@1234",
        "name": "นางสาวสุภาภรณ์",
        "surname": "จันทร์แสง",
        "position": "ครู คศ.2",
        "department": "คณิตศาสตร์",
        "role": "teacher"
    },
    {
        "id": "t116",
        "username": "t116",
        "password": "wny@1234",
        "name": "นางสาวโชติกา",
        "surname": "ฤทธิ์เทพ",
        "position": "ครู คศ.3",
        "department": "คณิตศาสตร์",
        "role": "teacher"
    },
    {
        "id": "t117",
        "username": "t117",
        "password": "wny@1234",
        "name": "นางสาวจินตนันท์",
        "surname": "พลูโต",
        "position": "ครู คศ.2",
        "department": "คณิตศาสตร์",
        "role": "teacher"
    },
    {
        "id": "t123",
        "username": "t123",
        "password": "wny@1234",
        "name": "นายนิพนธ์",
        "surname": "บุญสุข",
        "position": "ครูผู้ช่วย",
        "department": "คณิตศาสตร์",
        "role": "teacher"
    },
    {
        "id": "t220",
        "username": "t220",
        "password": "wny@1234",
        "name": "นางสาวกนกวรรณ",
        "surname": "นิยมรัตน์",
        "position": "ครู คศ.1",
        "department": "คณิตศาสตร์",
        "role": "teacher"
    },
    {
        "id": "t224",
        "username": "t224",
        "password": "wny@1234",
        "name": "นายรังสิมันต์",
        "surname": "เตชะอมรกุล",
        "position": "ครู คศ.2",
        "department": "คณิตศาสตร์",
        "role": "teacher"
    },
    {
        "id": "t316",
        "username": "t316",
        "password": "wny@1234",
        "name": "นายนิกร",
        "surname": "ลาดนอก",
        "position": "ครู คศ.2",
        "department": "คณิตศาสตร์",
        "role": "teacher"
    },
    {
        "id": "t318",
        "username": "t318",
        "password": "wny@1234",
        "name": "นายสมฤทธิ์",
        "surname": "ชาญสมร",
        "position": "ครู คศ.2",
        "department": "คณิตศาสตร์",
        "role": "teacher"
    },
    {
        "id": "t411",
        "username": "t411",
        "password": "wny@1234",
        "name": "นายจักรวรรดิ",
        "surname": "ไชยโคตร",
        "position": "ครู คศ.2",
        "department": "คณิตศาสตร์",
        "role": "teacher"
    },
    {
        "id": "t414",
        "username": "t414",
        "password": "wny@1234",
        "name": "นางสาวธิตาพร",
        "surname": "สุรวิทย์",
        "position": "ครู คศ.3",
        "department": "คณิตศาสตร์",
        "role": "teacher"
    },
    {
        "id": "t506",
        "username": "t506",
        "password": "wny@1234",
        "name": "นางสาวศิริวรรณ",
        "surname": "ปัญหา",
        "position": "ครู คศ.3",
        "department": "คณิตศาสตร์",
        "role": "teacher"
    },
    {
        "id": "t604",
        "username": "t604",
        "password": "wny@1234",
        "name": "นางสาวสาวิทตรี",
        "surname": "อุ่นทองศิริ",
        "position": "ครู คศ.1",
        "department": "คณิตศาสตร์",
        "role": "teacher"
    },
    {
        "id": "t609",
        "username": "t609",
        "password": "wny@1234",
        "name": "นางสาวสุชาดา",
        "surname": "กะจะเดิม",
        "position": "ครู คศ.2",
        "department": "คณิตศาสตร์",
        "role": "teacher"
    },
    {
        "id": "t613",
        "username": "t613",
        "password": "wny@1234",
        "name": "นายนิคม",
        "surname": "พรมณี",
        "position": "ครู คศ.3",
        "department": "คณิตศาสตร์",
        "role": "teacher"
    },
    {
        "id": "t603",
        "username": "t603",
        "password": "wny@1234",
        "name": "นายเริงศักดิ์",
        "surname": "จันทร์นวล",
        "position": "ครู คศ.2",
        "department": "แนะแนว",
        "role": "teacher"
    },
    {
        "id": "t663",
        "username": "t663",
        "password": "wny@1234",
        "name": "นางสาวจุฑามาศ",
        "surname": "ศรีคิรินทร์",
        "position": "ครูผู้ช่วย",
        "department": "ภาษาต่างประเทศ",
        "role": "teacher"
    },
    {
        "id": "t631",
        "username": "t631",
        "password": "wny@1234",
        "name": "นางสาวพัทธ์ธีรา",
        "surname": "โพธิ์แก้ว",
        "position": "ครููอัตราจ้าง",
        "department": "ภาษาต่างประเทศ",
        "role": "teacher"
    },
    {
        "id": "t635",
        "username": "t635",
        "password": "wny@1234",
        "name": "นางสาวจิราพร",
        "surname": "จันทร์โสภา",
        "position": "ครู คศ.1",
        "department": "ภาษาต่างประเทศ",
        "role": "teacher"
    },
    {
        "id": "t645",
        "username": "t645",
        "password": "wny@1234",
        "name": "นายธนาธิวัฒน์",
        "surname": "วงษ์สุวรรณ",
        "position": "ครูผู้ช่วย",
        "department": "ภาษาต่างประเทศ",
        "role": "teacher"
    },
    {
        "id": "t651",
        "username": "t651",
        "password": "wny@1234",
        "name": "นางสาวพรพิมล",
        "surname": "พิมพ์พา",
        "position": "ครูผู้ช่วย",
        "department": "ภาษาต่างประเทศ",
        "role": "teacher"
    },
    {
        "id": "t657",
        "username": "t657",
        "password": "wny@1234",
        "name": "นางสาวพัชรินทร์",
        "surname": "วงค์ประคำ",
        "position": "ครูผู้ช่วย",
        "department": "ภาษาต่างประเทศ",
        "role": "teacher"
    },
    {
        "id": "t664",
        "username": "t664",
        "password": "wny@1234",
        "name": "นางสาวฐานิตา",
        "surname": "บัวระบัดทอง",
        "position": "ครูผู้ช่วย",
        "department": "ภาษาต่างประเทศ",
        "role": "teacher"
    },
    {
        "id": "t121",
        "username": "t121",
        "password": "wny@1234",
        "name": "นางสาวอำภา",
        "surname": "บุญมาก",
        "position": "ครู คศ.3",
        "department": "ภาษาต่างประเทศ",
        "role": "teacher"
    },
    {
        "id": "t201",
        "username": "t201",
        "password": "wny@1234",
        "name": "นางอัญชลี",
        "surname": "งามขำ",
        "position": "ครู คศ.3",
        "department": "ภาษาต่างประเทศ",
        "role": "teacher"
    },
    {
        "id": "t202",
        "username": "t202",
        "password": "wny@1234",
        "name": "นายกีรติ",
        "surname": "ประสพพรรังสี",
        "position": "ครู คศ.2",
        "department": "ภาษาต่างประเทศ",
        "role": "teacher"
    },
    {
        "id": "t208",
        "username": "t208",
        "password": "wny@1234",
        "name": "Mr.Xiaochun",
        "surname": "Luo",
        "position": "ครูต่างชาติ",
        "department": "ภาษาต่างประเทศ",
        "role": "teacher"
    },
    {
        "id": "t209",
        "username": "t209",
        "password": "wny@1234",
        "name": "นางจินดาศรี",
        "surname": "แหลมทอง",
        "position": "ครู คศ.3",
        "department": "ภาษาต่างประเทศ",
        "role": "teacher"
    },
    {
        "id": "t218",
        "username": "t218",
        "password": "wny@1234",
        "name": "Mr.Alireza",
        "surname": "Asgharzaden",
        "position": "ครูต่างชาติ",
        "department": "ภาษาต่างประเทศ",
        "role": "teacher"
    },
    {
        "id": "t222",
        "username": "t222",
        "password": "wny@1234",
        "name": "Mr.Cosmas",
        "surname": "Matthewe",
        "position": "ครูต่างชาติ",
        "department": "ภาษาต่างประเทศ",
        "role": "teacher"
    },
    {
        "id": "t312",
        "username": "t312",
        "password": "wny@1234",
        "name": "นางสาวปิยนุช",
        "surname": "มีจันทร์ตระกูล",
        "position": "พนักงานราชการ",
        "department": "ภาษาต่างประเทศ",
        "role": "teacher"
    },
    {
        "id": "t314",
        "username": "t314",
        "password": "wny@1234",
        "name": "นางสาวทัศนีย์",
        "surname": "โพธินา",
        "position": "พนักงานราชการ",
        "department": "ภาษาต่างประเทศ",
        "role": "teacher"
    },
    {
        "id": "t319",
        "username": "t319",
        "password": "wny@1234",
        "name": "นางสาวธวัลยา",
        "surname": "สุขมหาหลวง",
        "position": "ครู คศ.1",
        "department": "ภาษาต่างประเทศ",
        "role": "teacher"
    },
    {
        "id": "t320",
        "username": "t320",
        "password": "wny@1234",
        "name": "นางสาวธิยานันท์",
        "surname": "เมธีสิริพงศ์",
        "position": "ครู คศ.1",
        "department": "ภาษาต่างประเทศ",
        "role": "teacher"
    },
    {
        "id": "t322",
        "username": "t322",
        "password": "wny@1234",
        "name": "MissMarlene",
        "surname": "Galupe",
        "position": "ครูต่างชาติ",
        "department": "ภาษาต่างประเทศ",
        "role": "teacher"
    },
    {
        "id": "t401",
        "username": "t401",
        "password": "wny@1234",
        "name": "นายธีรพงษ์",
        "surname": "แปงอุต",
        "position": "ครู คศ.2",
        "department": "ภาษาต่างประเทศ",
        "role": "teacher"
    },
    {
        "id": "t502",
        "username": "t502",
        "password": "wny@1234",
        "name": "นางธรรมรักษ์",
        "surname": "วัฒนพลาชัยกูร",
        "position": "ครู คศ.3",
        "department": "ภาษาต่างประเทศ",
        "role": "teacher"
    },
    {
        "id": "t503",
        "username": "t503",
        "password": "wny@1234",
        "name": "MissYhesa",
        "surname": "Arsenio",
        "position": "ครูต่างชาติ",
        "department": "ภาษาต่างประเทศ",
        "role": "teacher"
    },
    {
        "id": "t510",
        "username": "t510",
        "password": "wny@1234",
        "name": "Mr.Nash",
        "surname": "Gene. L.Sundongan",
        "position": "ครูต่างชาติ",
        "department": "ภาษาต่างประเทศ",
        "role": "teacher"
    },
    {
        "id": "t511",
        "username": "t511",
        "password": "wny@1234",
        "name": "นายปกรณ์",
        "surname": "หงษ์ทอง",
        "position": "ครู คศ.2",
        "department": "ภาษาต่างประเทศ",
        "role": "teacher"
    },
    {
        "id": "t512",
        "username": "t512",
        "password": "wny@1234",
        "name": "Miss Joan",
        "surname": "Njoki",
        "position": "ครูต่างชาติ",
        "department": "ภาษาต่างประเทศ",
        "role": "teacher"
    },
    {
        "id": "t601",
        "username": "t601",
        "password": "wny@1234",
        "name": "นางสาวญาศิกานต์",
        "surname": "บุดสา",
        "position": "ครู คศ.3",
        "department": "ภาษาต่างประเทศ",
        "role": "teacher"
    },
    {
        "id": "t602",
        "username": "t602",
        "password": "wny@1234",
        "name": "Mr.Tamika Kungu",
        "surname": "Langat",
        "position": "ครูต่างชาติ",
        "department": "ภาษาต่างประเทศ",
        "role": "teacher"
    },
    {
        "id": "t611",
        "username": "t611",
        "password": "wny@1234",
        "name": "นางสาววัลลภา",
        "surname": "เจริญศิริ",
        "position": "ครู คศ.3",
        "department": "ภาษาต่างประเทศ",
        "role": "teacher"
    },
    {
        "id": "t614",
        "username": "t614",
        "password": "wny@1234",
        "name": "นางสาวเรณู",
        "surname": "ฤาชา",
        "position": "ครู คศ.3",
        "department": "ภาษาต่างประเทศ",
        "role": "teacher"
    },
    {
        "id": "t624",
        "username": "t624",
        "password": "wny@1234",
        "name": "นางสาวขวัญจิรา",
        "surname": "ชัยพัฒน์ปรีชา",
        "position": "ครู คศ.1",
        "department": "ภาษาไทย",
        "role": "teacher"
    },
    {
        "id": "t620",
        "username": "t620",
        "password": "wny@1234",
        "name": "นายสาธิต",
        "surname": "ธูปมงคล",
        "position": "ครู คศ.1",
        "department": "ภาษาไทย",
        "role": "teacher"
    },
    {
        "id": "t636",
        "username": "t636",
        "password": "wny@1234",
        "name": "นางสาวนรินทร์",
        "surname": "สอาดรัมย์",
        "position": "ครู คศ.2",
        "department": "ภาษาไทย",
        "role": "teacher"
    },
    {
        "id": "t637",
        "username": "t637",
        "password": "wny@1234",
        "name": "นางสาวดวงใจ",
        "surname": "มังคละ",
        "position": "ครู คศ.1",
        "department": "ภาษาไทย",
        "role": "teacher"
    },
    {
        "id": "t661",
        "username": "t661",
        "password": "wny@1234",
        "name": "ว่าที่ ร.ต.หญิงกนกวรรณ",
        "surname": "เส็มหมาด",
        "position": "ครูผู้ช่วย",
        "department": "ภาษาไทย",
        "role": "teacher"
    },
    {
        "id": "t650",
        "username": "t650",
        "password": "wny@1234",
        "name": "นางสาวประภัสสร",
        "surname": "พรมศรี",
        "position": "ครู คศ.1",
        "department": "ภาษาไทย",
        "role": "teacher"
    },
    {
        "id": "t114",
        "username": "t114",
        "password": "wny@1234",
        "name": "นายอานนท์",
        "surname": "วรวงค์",
        "position": "ครู คศ.2",
        "department": "ภาษาไทย",
        "role": "teacher"
    },
    {
        "id": "t205",
        "username": "t205",
        "password": "wny@1234",
        "name": "นางสาววิลินดา",
        "surname": "แก้วหนองสังข์",
        "position": "ครู คศ.2",
        "department": "ภาษาไทย",
        "role": "teacher"
    },
    {
        "id": "t216",
        "username": "t216",
        "password": "wny@1234",
        "name": "นางสาวจิรภา",
        "surname": "กันยาน้อย",
        "position": "ครู คศ.2",
        "department": "ภาษาไทย",
        "role": "teacher"
    },
    {
        "id": "t217",
        "username": "t217",
        "password": "wny@1234",
        "name": "นางสาวกาญติมา",
        "surname": "เกิดกล้า",
        "position": "ครู คศ.1",
        "department": "ภาษาไทย",
        "role": "teacher"
    },
    {
        "id": "t302",
        "username": "t302",
        "password": "wny@1234",
        "name": "นางสาวภานุมาส",
        "surname": "ศรีสุวอ",
        "position": "ครู คศ.2",
        "department": "ภาษาไทย",
        "role": "teacher"
    },
    {
        "id": "t307",
        "username": "t307",
        "password": "wny@1234",
        "name": "นางสอางค์ศรี",
        "surname": "บุญสติ",
        "position": "ครู คศ.3",
        "department": "ภาษาไทย",
        "role": "teacher"
    },
    {
        "id": "t308",
        "username": "t308",
        "password": "wny@1234",
        "name": "นางสาวอรปรียา",
        "surname": "เหลือนับ",
        "position": "ครู คศ.2",
        "department": "ภาษาไทย",
        "role": "teacher"
    },
    {
        "id": "t321",
        "username": "t321",
        "password": "wny@1234",
        "name": "นางสาวกรรณณภรรทร์",
        "surname": "ปัถพี",
        "position": "ครู คศ.1",
        "department": "ภาษาไทย",
        "role": "teacher"
    },
    {
        "id": "t662",
        "username": "t662",
        "password": "wny@1234",
        "name": "นางสาวขวัญหทัย",
        "surname": "สว่างกุล",
        "position": "ครูผู้ช่วย",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t658",
        "username": "t658",
        "password": "wny@1234",
        "name": "นางสาวมนัสวี",
        "surname": "กุยลอยทาม",
        "position": "พนักงานราชการ",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t641",
        "username": "t641",
        "password": "wny@1234",
        "name": "นางสาวสุดา",
        "surname": "สอนดี",
        "position": "ครูผู้ช่วย",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t626",
        "username": "t626",
        "password": "wny@1234",
        "name": "นายวัชรพงษ์",
        "surname": "ผลาผล",
        "position": "ครู คศ.1",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t632",
        "username": "t632",
        "password": "wny@1234",
        "name": "นางสาวสิริมาศ",
        "surname": "สุภาพ",
        "position": "ครู คศ.1",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t618",
        "username": "t618",
        "password": "wny@1234",
        "name": "นางสาวณัฏฐา",
        "surname": "มูลปา",
        "position": "ครู คศ.2",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t622",
        "username": "t622",
        "password": "wny@1234",
        "name": "นางสาวจิราพร",
        "surname": "อ่อนนนท์",
        "position": "ครู คศ.2",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t623",
        "username": "t623",
        "password": "wny@1234",
        "name": "นายณัฐพล",
        "surname": "เหลืองสอาด",
        "position": "ครู คศ.2",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t625",
        "username": "t625",
        "password": "wny@1234",
        "name": "นางสาวปณิฏฐา",
        "surname": "บุญยงค์",
        "position": "ครู คศ.1",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t628",
        "username": "t628",
        "password": "wny@1234",
        "name": "นายสิทธิชัย",
        "surname": "โพธิ์",
        "position": "ครู คศ.2",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t634",
        "username": "t634",
        "password": "wny@1234",
        "name": "นายณัฐพงศ์",
        "surname": "ระทะนาม",
        "position": "ครู คศ.1",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t652",
        "username": "t652",
        "password": "wny@1234",
        "name": "นายนราธร",
        "surname": "มาวรรณ",
        "position": "ครู คศ.2",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t654",
        "username": "t654",
        "password": "wny@1234",
        "name": "นางสาวอาภรณ์",
        "surname": "ม่านทอง",
        "position": "ครูผู้ช่วย",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t655",
        "username": "t655",
        "password": "wny@1234",
        "name": "นางสาวภัทรธีรา",
        "surname": "แปงสี",
        "position": "ครูผู้ช่วย",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t659",
        "username": "t659",
        "password": "wny@1234",
        "name": "นายธนาพิสิษฐ์",
        "surname": "เมืองโคตร์",
        "position": "ครู คศ.1",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t665",
        "username": "t665",
        "password": "wny@1234",
        "name": "นายศราวุธ",
        "surname": "ชื่นตา",
        "position": "ครูผู้ช่วย",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t106",
        "username": "t106",
        "password": "wny@1234",
        "name": "นายอำนาจ",
        "surname": "ทัศนา",
        "position": "ครู คศ.2",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t109",
        "username": "t109",
        "password": "wny@1234",
        "name": "นายพงษ์ศักดิ์",
        "surname": "ทองโพธิกุล",
        "position": "ครู คศ.3",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t118",
        "username": "t118",
        "password": "wny@1234",
        "name": "นางสาวมลฤดี",
        "surname": "ปัญญางาม",
        "position": "ครู คศ.3",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t120",
        "username": "t120",
        "password": "wny@1234",
        "name": "นางสาวสุธิรัตน์",
        "surname": "บรรดาล",
        "position": "ครู คศ.3",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t206",
        "username": "t206",
        "password": "wny@1234",
        "name": "นางสาวธนัชพร",
        "surname": "บุตรดี",
        "position": "ครู คศ.2",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t215",
        "username": "t215",
        "password": "wny@1234",
        "name": "นายณพดล",
        "surname": "กองทอง",
        "position": "ครู คศ.3",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t311",
        "username": "t311",
        "password": "wny@1234",
        "name": "นางสาวนุชนาฎ",
        "surname": "อำพันเสน",
        "position": "ครู คศ.3",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t317",
        "username": "t317",
        "password": "wny@1234",
        "name": "นางสาวสุธิดา",
        "surname": "เที่ยงทิศ",
        "position": "ครู คศ.3",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t407",
        "username": "t407",
        "password": "wny@1234",
        "name": "นางคันธรส",
        "surname": "คำพิพจน์",
        "position": "ครู คศ.3",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t409",
        "username": "t409",
        "password": "wny@1234",
        "name": "นางสาวกาญจนา",
        "surname": "จันทรทวี",
        "position": "ครู คศ.3",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t410",
        "username": "t410",
        "password": "wny@1234",
        "name": "นางสาวสมพงษ์",
        "surname": "จันทร์มา",
        "position": "ครู คศ.2",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t504",
        "username": "t504",
        "password": "wny@1234",
        "name": "นางสาวยุวะธิดา",
        "surname": "กิ่งทอง",
        "position": "ครู คศ.3",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t505",
        "username": "t505",
        "password": "wny@1234",
        "name": "นายพิชิต",
        "surname": "แตงอ่อน",
        "position": "ครู คศ.1",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t507",
        "username": "t507",
        "password": "wny@1234",
        "name": "นายอรรถพร",
        "surname": "วงษ์ลา",
        "position": "ครู คศ.1",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t509",
        "username": "t509",
        "password": "wny@1234",
        "name": "นายพิทยา",
        "surname": "แห้วสุโน",
        "position": "ครู คศ.2",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t514",
        "username": "t514",
        "password": "wny@1234",
        "name": "นางสาวจอมใจ",
        "surname": "คำวิเศษ",
        "position": "ครู คศ.3",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t516",
        "username": "t516",
        "password": "wny@1234",
        "name": "นางกาญจนา",
        "surname": "เกตุมณี",
        "position": "ครู คศ.3",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t605",
        "username": "t605",
        "password": "wny@1234",
        "name": "นางสาวปิยราช",
        "surname": "พันธ์กมลศิลป์",
        "position": "ครู คศ.3",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t606",
        "username": "t606",
        "password": "wny@1234",
        "name": "นางภุมริน",
        "surname": "พุกสอน",
        "position": "ครู คศ.3",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t616",
        "username": "t616",
        "password": "wny@1234",
        "name": "นางสาวปิติพร",
        "surname": "ขจรโมทย์",
        "position": "ครู คศ.2",
        "department": "วิทยาศาสตร์และเทคโนโลยี",
        "role": "teacher"
    },
    {
        "id": "t629",
        "username": "t629",
        "password": "wny@1234",
        "name": "นางสุวรรณี",
        "surname": "เกตุดี",
        "position": "ครู คศ.2",
        "department": "ศิลปะ",
        "role": "teacher"
    },
    {
        "id": "t633",
        "username": "t633",
        "password": "wny@1234",
        "name": "นางสาวปัทมาวรรณ",
        "surname": "วันยานาม",
        "position": "ครูผู้ช่วย",
        "department": "ศิลปะ",
        "role": "teacher"
    },
    {
        "id": "t646",
        "username": "t646",
        "password": "wny@1234",
        "name": "นายพนชาติ",
        "surname": "ปราณีตพลกรัง",
        "position": "ครู คศ.1",
        "department": "ศิลปะ",
        "role": "teacher"
    },
    {
        "id": "t653",
        "username": "t653",
        "password": "wny@1234",
        "name": "นายชิษณุพงศ์",
        "surname": "วิธานติรวัฒน์",
        "position": "ครู คศ.1",
        "department": "ศิลปะ",
        "role": "teacher"
    },
    {
        "id": "t112",
        "username": "t112",
        "password": "wny@1234",
        "name": "นางสาวณัฐพร",
        "surname": "ใจผ่อง",
        "position": "ครู คศ.2",
        "department": "ศิลปะ",
        "role": "teacher"
    },
    {
        "id": "t405",
        "username": "t405",
        "password": "wny@1234",
        "name": "นางสาวพรสวรรค์",
        "surname": "จันดาหงษ์",
        "position": "ครู คศ.2",
        "department": "ศิลปะ",
        "role": "teacher"
    },
    {
        "id": "t408",
        "username": "t408",
        "password": "wny@1234",
        "name": "นางสาวปิยลักษณ์",
        "surname": "ขันทา",
        "position": "ครู คศ.3",
        "department": "ศิลปะ",
        "role": "teacher"
    },
    {
        "id": "t656",
        "username": "t656",
        "password": "wny@1234",
        "name": "นายเพิ่มพูล",
        "surname": "ทองล้วน",
        "position": "ครูผู้ช่วย",
        "department": "สังคมศึกษาศาสนาและวัฒนธรรม",
        "role": "teacher"
    },
    {
        "id": "t415",
        "username": "t415",
        "password": "wny@1234",
        "name": "นายกรภัทร์",
        "surname": "อาสากิจ",
        "position": "ครู คศ.2",
        "department": "สังคมศึกษาศาสนาและวัฒนธรรม",
        "role": "teacher"
    },
    {
        "id": "t649",
        "username": "t649",
        "password": "wny@1234",
        "name": "นายศิวพงษ์",
        "surname": "แสงนอก",
        "position": "ครู คศ.2",
        "department": "สังคมศึกษาศาสนาและวัฒนธรรม",
        "role": "teacher"
    },
    {
        "id": "t101",
        "username": "t101",
        "password": "wny@1234",
        "name": "นายพิชิต",
        "surname": "คำพลงาม",
        "position": "ครู คศ.3",
        "department": "สังคมศึกษาศาสนาและวัฒนธรรม",
        "role": "teacher"
    },
    {
        "id": "t105",
        "username": "t105",
        "password": "wny@1234",
        "name": "นางสาวศิริวรรณ",
        "surname": "ตุ้มมี",
        "position": "ครู คศ.3",
        "department": "สังคมศึกษาศาสนาและวัฒนธรรม",
        "role": "teacher"
    },
    {
        "id": "t110",
        "username": "t110",
        "password": "wny@1234",
        "name": "นางสาวรินนรัชญ์",
        "surname": "จันคณาลักษณ์",
        "position": "ครู คศ.3",
        "department": "สังคมศึกษาศาสนาและวัฒนธรรม",
        "role": "teacher"
    },
    {
        "id": "t124",
        "username": "t124",
        "password": "wny@1234",
        "name": "นางปฐวีกานต์",
        "surname": "ปริธรรมมัง",
        "position": "ครู คศ.3",
        "department": "สังคมศึกษาศาสนาและวัฒนธรรม",
        "role": "teacher"
    },
    {
        "id": "t207",
        "username": "t207",
        "password": "wny@1234",
        "name": "นางสาวคมศรีจรัส",
        "surname": "วงจันทร์",
        "position": "ครู คศ.3",
        "department": "สังคมศึกษาศาสนาและวัฒนธรรม",
        "role": "teacher"
    },
    {
        "id": "t211",
        "username": "t211",
        "password": "wny@1234",
        "name": "นายธนิกกุล",
        "surname": "บุญอาจ",
        "position": "ครู คศ.1",
        "department": "สังคมศึกษาศาสนาและวัฒนธรรม",
        "role": "teacher"
    },
    {
        "id": "t212",
        "username": "t212",
        "password": "wny@1234",
        "name": "นายอำนาจ",
        "surname": "เพลาะกระโทก",
        "position": "ครู คศ.3",
        "department": "สังคมศึกษาศาสนาและวัฒนธรรม",
        "role": "teacher"
    },
    {
        "id": "t213",
        "username": "t213",
        "password": "wny@1234",
        "name": "นางสาวแสงเทียน",
        "surname": "กุ่มเดช",
        "position": "ครู คศ.1",
        "department": "สังคมศึกษาศาสนาและวัฒนธรรม",
        "role": "teacher"
    },
    {
        "id": "t403",
        "username": "t403",
        "password": "wny@1234",
        "name": "นางสาววิลาสิณี",
        "surname": "พูลประเสริฐ",
        "position": "ครู คศ.2",
        "department": "สังคมศึกษาศาสนาและวัฒนธรรม",
        "role": "teacher"
    },
    {
        "id": "t615",
        "username": "t615",
        "password": "wny@1234",
        "name": "นางสาวสนธินี",
        "surname": "ผิวแก้ว",
        "position": "ครู คศ.3",
        "department": "สังคมศึกษาศาสนาและวัฒนธรรม",
        "role": "teacher"
    },
    {
        "id": "t640",
        "username": "t640",
        "password": "wny@1234",
        "name": "นายวุฒิพันธ์",
        "surname": "คันทา",
        "position": "ครู คศ.1",
        "department": "สุขศึกษาและพลศึกษา",
        "role": "teacher"
    },
    {
        "id": "t119",
        "username": "t119",
        "password": "wny@1234",
        "name": "นางแววดาว",
        "surname": "สงวนกุล",
        "position": "ครู คศ.3",
        "department": "สุขศึกษาและพลศึกษา",
        "role": "teacher"
    },
    {
        "id": "t305",
        "username": "t305",
        "password": "wny@1234",
        "name": "นางสาวเกษร",
        "surname": "เขจรลาภ",
        "position": "ครู คศ.2",
        "department": "สุขศึกษาและพลศึกษา",
        "role": "teacher"
    },
    {
        "id": "t416",
        "username": "t416",
        "password": "wny@1234",
        "name": "นางสาววิไลพร",
        "surname": "จิตรสวัสดิ์",
        "position": "ครู คศ.2",
        "department": "สุขศึกษาและพลศึกษา",
        "role": "teacher"
    },
    {
        "id": "t417",
        "username": "t417",
        "password": "wny@1234",
        "name": "นายสิทธิชัย",
        "surname": "เทศจันทึก",
        "position": "ครู คศ.1",
        "department": "สุขศึกษาและพลศึกษา",
        "role": "teacher"
    },
    {
        "id": "t610",
        "username": "t610",
        "password": "wny@1234",
        "name": "นายพลวัต",
        "surname": "คำสอน",
        "position": "ครู คศ.1",
        "department": "สุขศึกษาและพลศึกษา",
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

            // Migration: Bulk update teachers and remove leftovers v3
            if (!localStorage.getItem('force_teacher_update_v3')) {
                console.log("Running teacher bulk update v3...");
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
                localStorage.setItem('force_teacher_update_v3', 'true');
                console.log("Teacher bulk update v3 completed.");
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
