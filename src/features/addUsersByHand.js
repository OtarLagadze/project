import { db } from '../firebase'
import { collection, addDoc } from '../firebase/firestore'

const users = [
    {"სახელი": "ანასტასია", "გვარი": "ბენიძე", "username": "anastasia1", "password": "cocbxx9", "# მაგიდა": 1},
    {"სახელი": "ალექსანდრე", "გვარი": "ურდია", "username": "aleqsandre2", "password": "bf2idl8", "# მაგიდა": 2},
    {"სახელი": "იესე", "გვარი": "ჯანგავაძე", "username": "iese3", "password": "znmdp6i", "# მაგიდა": 3},
    {"სახელი": "ელენე", "გვარი": "მოსეშვილი", "username": "elene4", "password": "py48os3", "# მაგიდა": 4},
    {"სახელი": "ნია", "გვარი": "ცერცვაძე", "username": "nia5", "password": "sf9pt6h", "# მაგიდა": 5},
    {"სახელი": "მარიამ", "გვარი": "მურადოვი", "username": "mariam6", "password": "38ibmaz", "# მაგიდა": 6},
    {"სახელი": "მარიამ", "გვარი": "ხუციშვილი", "username": "mariam7", "password": "94knq9i", "# მაგიდა": 7},
    {"სახელი": "დალი", "გვარი": "გიგაშვილი", "username": "dali8", "password": "dygda6k", "# მაგიდა": 8},
    {"სახელი": "მიაქელი", "გვარი": "ტურაბელიძე", "username": "miqaeli9", "password": "6iie1b1", "# მაგიდა": 9},
    {"სახელი": "მარიამ", "გვარი": "ყაზაიშვილი", "username": "mariam10", "password": "k5nr432", "# მაგიდა": 10},
    {"სახელი": "ლუკა", "გვარი": "ფრუიძე", "username": "luka11", "password": "qrnn25v", "# მაგიდა": 11},
    {"სახელი": "შოთა", "გვარი": "გოგატიშვილი", "username": "shota12", "password": "r7e8dy5", "# მაგიდა": 12},
    {"სახელი": "ანა", "გვარი": "ხურციძე", "username": "ana13", "password": "3guzt34", "# მაგიდა": 13},
    {"სახელი": "თამარი", "გვარი": "შალამბერიძე", "username": "tamari14", "password": "avf0pcj", "# მაგიდა": 14},
    {"სახელი": "ანა", "გვარი": "ჩიქოვანი", "username": "ana15", "password": "r2loqk8", "# მაგიდა": 15},
    {"სახელი": "მარიამ", "გვარი": "ქათამაძე", "username": "mariam16", "password": "hq8tr66", "# მაგიდა": 16},
    {"სახელი": "ინა", "გვარი": "მაღლაკელიძე", "username": "ina17", "password": "gtoox1y", "# მაგიდა": 17},
    {"სახელი": "მათე", "გვარი": "კანდელაკი", "username": "mate18", "password": "rr63jr8", "# მაგიდა": 18},
    {"სახელი": "კახა", "გვარი": "ჩიხლაძე", "username": "kaxa19", "password": "5m3smdy", "# მაგიდა": 19},
    {"სახელი": "ქეთევან", "გვარი": "კინწურაშვილი", "username": "qetevan20", "password": "2mpbpcg", "# მაგიდა": 20},
    {"სახელი": "გიორგი", "გვარი": "ვარდანიძე", "username": "giorgi21", "password": "29goo25", "# მაგიდა": 21},
    {"სახელი": "ლევან", "გვარი": "ბარდაველიძე", "username": "levan22", "password": "esfwand", "# მაგიდა": 22},
    {"სახელი": "გიორგი", "გვარი": "ზამბახიძე", "username": "giorgi23", "password": "0ep95yv", "# მაგიდა": 23},
    {"სახელი": "ლაზარე", "გვარი": "მხეიძე", "username": "lazare24", "password": "jx7jq40", "# მაგიდა": 24},
    {"სახელი": "ნინი", "გვარი": "შვანგირაძე", "username": "nini25", "password": "enap034", "# მაგიდა": 25},
    {"სახელი": "ლილე", "გვარი": "იარღანაშვილი", "username": "lile26", "password": "f9okgza", "# მაგიდა": 26},
    {"სახელი": "მარიამ", "გვარი": "ბენიძე", "username": "mariam27", "password": "ooqxzz2", "# მაგიდა": 27},
    {"სახელი": "ანა-მარია", "გვარი": "დალაქიშვილი", "username": "Ana-maria28", "password": "yy9vkc4", "# მაგიდა": 28},
    {"სახელი": "ელგუჯა", "გვარი": "გაბუნია", "username": "elguja29", "password": "vsjxsm9", "# მაგიდა": 29}
]


const addUsersToFirestore = async () => {
    try {
        for (const user of users) {
            await addDoc(collection(db, 'testUsers'), user);
            console.log(`User ${user.username} added successfully`);
        }
        console.log('All users added to Firestore');
    } catch (error) {
        console.error('Error adding users to Firestore:', error);
    }
};

addUsersToFirestore();
