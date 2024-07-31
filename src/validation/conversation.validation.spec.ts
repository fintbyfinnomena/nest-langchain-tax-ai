import { Test, TestingModule } from "@nestjs/testing";
import axios , { AxiosRequestConfig,AxiosResponse }  from 'axios';

const chatUrl = "/api/v1/langchain-chat/question"

const client = axios.create({
  baseURL: 'http://localhost:8080',
});

const conversations = [
  "แนะนำพอร์ตกองทุนให้หน่อย",
  "จัดพอร์ตกองทุนให้หน่อย",
  "อายุ 29 ปี มีรายได้ สามแสนสามพันสามร้อยสามสิบบาทสามสิบสามสตางค์",
  "ก่อนหน้านี้ได้แจ้งรายได้ต่อปีไปเท่าไหร่นะ",
] 

describe('conversation tesitng', () => {
  async function doing (){

    await Promise.all(conversations.map(async (message) => {
      it(`sending ${message} successfully`, done => {

        const requestConfig: AxiosRequestConfig = {
          headers: {
            'Content-Type': 'application/json',
            'session-id': '1',
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

      },20000);

    }));

  }

  doing()

});