import { Test, TestingModule } from "@nestjs/testing";
import axios , { AxiosRequestConfig,AxiosResponse }  from 'axios';

const chatUrl = "/api/v1/langchain-chat/question"
const sessionId = "test"
const client = axios.create({
  baseURL: 'http://localhost:8080',
});

const deleteConversations: any = async () => {
  it(`delete conversations of ${sessionId} successfully`, done => {
    client.delete(`/api/v1/chat/${sessionId}`)
    .then((response: AxiosResponse) => {
      expect(true).toEqual(true);
      done();
    }).catch((error: any) => { 
      alert(error)
      expect(true).toEqual(false);
      done();
    });
  })
}

const getConversations: any = async () => {
  let conversations = []
  it(`get conversations of ${sessionId} successfully`, done => {
    client.get(`/api/v1/chat/${sessionId}`)
    .then((response: AxiosResponse) => {
      expect(response.status).toEqual(200);
      conversations = response.data.data
      expect(true).toEqual(true);
      done();
    }).catch((error: any) => { 
      alert(error)
      expect(true).toEqual(false);
      done();
    });
  })

  it(`validate conversations successfully`, done => {
    for ( const message of conversations ) {
      if (message["ai"]) {
        console.debug("ai",message["ai"])
      }else if (message["human"]) {
        console.debug("human",message["human"])
      }
    }
    
    expect(true).toEqual(true);
    done();
  });
}

function conversationGenerate(conversations) {

  describe('delete - conversation before start', () => {
    deleteConversations()
  });

  describe('generate - conversation', () => {
    async function doing (){

      await Promise.all(
        conversations.map(async (message) => {
          it(`sending ${message} successfully`, done => {

            const requestConfig: AxiosRequestConfig = {
              headers: {
                'Content-Type': 'application/json',
                'session-id': sessionId,
              },
              responseType: 'arraybuffer',
            };

            const data = {'question': message};

            client.post(chatUrl, data , requestConfig)
            .then((response: AxiosResponse) => {
              expect(true).toEqual(true);
              done();
            }).catch((error: any) => { 
              alert(error)
              expect(true).toEqual(false);
              done();
            });

          },200000);

        })
      );

    }

    doing()

  });

  describe('validation - conversation', () => {
    getConversations()
  });

}

// conversationGenerate([
//   // "แนะนำพอร์ตกองทุนให้หน่อย",
//   "จัดพอร์ตกองทุนให้หน่อย",
//   "อายุสองเก้าปี มีรายได้ สามแสนห้าหมื่นสี่พันสามร้อยสามสิบบาทสามสิบสามสตางค์",
//   // "ก่อนหน้านี้ได้แจ้งรายได้ต่อปีไปเท่าไหร่นะ",
// ])

// conversationGenerate([
//   "จัดพอร์ตกองทุนให้หน่อย",
//   "อายุสองเก้าปี มีรายได้ 300,000 ต่อปี",
// ])

// conversationGenerate([
//   "จัดพอร์ตภาษีให้หน่อย เงินเดือน 15,000 ไม่เคยลงทุนอะไรเลย",
// ])

// conversationGenerate([
//   "จัดพอร์ตภาษีให้หน่อย",
//   "29",
//   "รายได้ปีละ 1,000,000",
//   "0",
//   "0",
//   "0",
//   "0",
//   "low",
//   "ไม่แน่ใจ"
// ])

// conversationGenerate([
//   "จัดพอร์ตภาษีให้หน่อย",
//   "สองเก้า",
//   "ช่าย",
//   "เงินเดือน หนึ่งหมื่นห้าพันบาท",
//   "ไม่ใช่ๆนั่นรายเดือน",
//   "0",
//   "0",
//   "0",
//   "0",
//   "low",
//   "เดือนละsixthousandbath",
// ])

// conversationGenerate([
//   "จัดพอร์ตภาษีให้หน่อย",
//   "29",
//   "รายได้ปีละ 10,000,000",
//   "0",
//   "0",
//   "0",
//   "0",
//   "low",
//   "ไม่แน่ใจ",
//   "อยากลงกอง SSF ซัก 1 ล้านไปเลยต้องจัดกองละกี่บาทดี"
// ])


conversationGenerate([
  "จัดพอร์ตภาษีให้หน่อย",
  "29",
  "รายได้ปีละ 50,000",
  "0",
  "0",
  "0",
  "0",
  "low",
  "30000",
  "ปรับเป็นลงทุนแค่กอง RMF ได้ไหม"
])

conversationGenerate([
  "จัดพอร์ตภาษีให้หน่อย",
  "29",
  "รายได้ปีละ 333,333.33",
  "0",
  "0",
  "0",
  "0",
  "low",
  "ทั้งหมด",
])