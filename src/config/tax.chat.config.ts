// This is simulation of getting config from https://docs.google.com/spreadsheets/d/1FXn5lJXCPIiYXlstZ3apV2wN0umaRIbBR1zCh337xSw/edit?usp=sharing

function getConfig() {
  return {
    fundQuote: {
      baseUrl: 'https://www.finnomena.com/fund/',
    },
    fundApi: {
      baseUrl: 'https://api-int.finnomena.com/fund-service/public/api/v2/funds',
    },
    tsf: {
      portfolio: [
        {
          type: 'rmf',
          risk: 'high',
          fund: 'KKP GNP RMF-H',
          proportion: 40,
        },
        {
          type: 'rmf',
          risk: 'high',
          fund: 'PRINCIPAL VNEQRMF',
          proportion: 30,
        },
        {
          type: 'rmf',
          risk: 'high',
          fund: 'B-INNOTECHRMG',
          proportion: 30,
        },
        {
          type: 'rmf',
          risk: 'medium',
          fund: 'KKP GNP RMF-H',
          proportion: 30,
        },
        {
          type: 'rmf',
          risk: 'medium',
          fund: 'B-IR-FOFRMG',
          proportion: 30,
        },
        {
          type: 'rmf',
          risk: 'medium',
          fund: 'KGARMF',
          proportion: 40,
        },
        {
          type: 'rmf',
          risk: 'low',
          fund: 'UGISRMF',
          proportion: 30,
        },
        {
          type: 'rmf',
          risk: 'low',
          fund: 'KKP INRMF',
          proportion: 30,
        },
        {
          type: 'rmf',
          risk: 'low',
          fund: 'B-IR-FOFRMF',
          proportion: 40,
        },
        {
          type: 'rmf',
          risk: 'safe',
          fund: 'UGISRMF',
          proportion: 50,
        },
        {
          type: 'rmf',
          risk: 'safe',
          fund: 'KKP INRMF',
          proportion: 50,
        },
        {
          type: 'ssf',
          risk: 'high',
          fund: 'KKP GNP-H-SSF',
          proportion: 40,
        },
        {
          type: 'ssf',
          risk: 'high',
          fund: 'K-VIETNAM-SSF',
          proportion: 30,
        },
        {
          type: 'ssf',
          risk: 'high',
          fund: 'B-INNOTECHSSF',
          proportion: 30,
        },
        {
          type: 'ssf',
          risk: 'medium',
          fund: 'KKP GNP-H-SSF',
          proportion: 30,
        },
        {
          type: 'ssf',
          risk: 'medium',
          fund: 'PRINCIPAL iPROPEN-SSF',
          proportion: 30,
        },
        {
          type: 'ssf',
          risk: 'medium',
          fund: 'KKP INCOME-H-SSF',
          proportion: 40,
        },
        {
          type: 'ssf',
          risk: 'low',
          fund: 'UGIS-SSF',
          proportion: 30,
        },
        {
          type: 'ssf',
          risk: 'low',
          fund: 'KKP ACT FIXED-SSF',
          proportion: 30,
        },
        {
          type: 'ssf',
          risk: 'low',
          fund: 'PRINCIPAL iPROPEN-SSF',
          proportion: 40,
        },
        {
          type: 'ssf',
          risk: 'safe',
          fund: 'UGIS-SSF',
          proportion: 50,
        },
        {
          type: 'ssf',
          risk: 'safe',
          fund: 'KKP ACT FIXED-SSF',
          proportion: 50,
        },
        {
          type: 'tesg',
          risk: 'high',
          fund: 'KTAG-ThaiESG',
          proportion: 100,
        },
        {
          type: 'tesg',
          risk: 'medium',
          fund: 'KTAG70/30-ThaiESG',
          proportion: 100,
        },
        {
          type: 'tesg',
          risk: 'low',
          fund: 'KKP GB THAI ESG',
          proportion: 100,
        },
        {
          type: 'tesg',
          risk: 'safe',
          fund: 'KKP GB THAI ESG',
          proportion: 100,
        },
      ],
      recommendedFund: [
        {
          type: 'ssf',
          risk: 'high',
          fund: 'KKP GNP-H-SSF',
          category: 'หุ้นโลก',
          fund_comment:
            'ลงทุนในหุ้นสามัญทั่วโลกของบริษัทที่มีส่วนร่วมกับการเปลี่ยนแปลงด้านการค้าและเศรษฐกิจระหว่างประเทศของโลกในอนาคต จุดเด่น กองทุนมี Correlation กับหุ้นโลก ACWI ในระยะยาว มีสไตล์การลงทุน ที่สร้าง Alpha ในระยะยาวได้เหนือดัชนีชี้วัดต่อเนื่อง โดยที่มีความผันผวนต่ำกว่า Active Fund หลายกองทุน มีมุมมองการลงทุนในระยะยาว Turnover เฉลี่ยของกองเพียง 25% ถือครองหุ้นมากกว่า 5 ปีกว่า 60% พอร์ตกองทุนมีการเลือกหุ้นแบบ Bottom-up ในแต่ละอุตสาหกรรม ไม่ได้มี High Conviction มากเกินไปจนทำให้กองทุนมีการลงทุนในแต่ละอุตสาหกรรมผิดเพี้ยนไปจาก Index ทำให้ได้ Alpha มาจากการเลือกหุ้นที่เป็นผู้ชนะในตลาดจริง ๆ',
        },
        {
          type: 'ssf',
          risk: 'high',
          fund: 'K-VIETNAM-SSF',
          category: 'หุ้นเวียดนาม',
          fund_comment:
            'ลงทุนในหุ้นที่จดทะเบียนในตลาดหลักทรัพย์ในประเทศเวียดนาม ที่ดำเนินธุรกิจหรือได้รับผลประโยชน์จากการเติบโตทางเศรษฐกิจ หรือมีทรัพย์สินส่วนใหญ่มาจากการเติบโตทางเศรษฐกิจของประเทศเวียดนาม จุดเด่น กองทุนหุ้นเวียดนามที่เน้นลงทุนตรงในตลาดหุ้นเวียดนาม โดยทีมผู้จัดการกองทุนคนไทยที่มีประสบการณ์ ลดการเสียค่าธรรมเนียมหลายต่อจากการลงทุนผ่าน Feeder Fund สามารถสร้างผลตอบแทนได้เป็นลำดับต้น ๆ ของกองทุนเวียดนามในไทย ช่วง 3 ปีที่ผ่านมากองทุนมี Track Record ที่ยาวนาน โดยที่ยังสามารถทำผลตอบแทนในระยะยาวได้ดี และมีค่าธรรมเนียมไม่แพง',
        },
        {
          type: 'ssf',
          risk: 'medium',
          fund: 'KKP INCOME-H-SSF',
          category: 'สินทรัพย์ผสม',
          fund_comment:
            'กองทุนผสม มีในสัดส่วนลงทุนในหุ้น 35% ตราสารหนี้ 50% อื่น ๆ 15% โดยประมาณ จุดเด่น มีนโยบายการลงทุนให้ได้ Income มากกว่าค่าเฉลี่ย โดยที่ยังคงได้รับผลเชิงบวกจากการเติบโตของเงินต้นในระยะยาว กองทุนมี Track Record ที่ยาวและมีผลตอบแทนที่ดีในระยะยาว ในขณะที่บริหารความเสี่ยงได้อย่างดี มีความ Dynamic ในการลงทุนทั้งการลงทุนในสไตล์ Growth และ Value ตามสถานการณ์ทางเศรษฐกิจ',
        },
        {
          type: 'ssf',
          risk: 'low',
          fund: 'UGIS-SSF',
          category: 'ตราสารหนี้',
          fund_comment:
            'กองทุนรวมตราสารหนี้ทั่วโลก ลงทุนแบบเชิงรุก เพื่อสร้างผลตอบแทนเป็นรายได้ที่สม่ำเสมอ จุดเด่น บริหารแบบ Active ปรับสัดส่วนให้เหมาะสมกับสถานการณ์ ผลตอบแทนย้อนหลังเอาชนะดัชนีเปรียบเทียบได้สม่ำเสมอ ภายใต้ความผันผวนที่ต่ำ บริหารโดย PIMCO บลจ. เฉพาะด้านตราสารหนี้ทั่วโลก',
        },
        {
          type: 'rmf',
          risk: 'high',
          fund: 'PRINCIPAL VNEQRMF',
          category: 'หุ้นเวียดนาม',
          fund_comment:
            'ลงทุนในหุ้นที่จดทะเบียนในตลาดหลักทรัพย์ในประเทศเวียดนาม ดำเนินธุรกิจหรือได้รับผลประโยชน์จากการเติบโตทางเศรษฐกิจ หรือมีทรัพย์สินส่วนใหญ่มาจากการเติบโตทางเศรษฐกิจของประเทศเวียดนาม จุดเด่น กองทุนหุ้นเวียดนามกองทุนแรกที่เข้าไปลงทุนตรงในตลาดหุ้นเวียดนามตั้งแต่ปี 2017 และจากประสบการณ์การลงทุนของผู้จัดการกองทุนที่บริหารมาอย่างยาวนาน ทำให้กองทุนเติบโตไปพร้อมกับเศรษฐกิจเวียดนาม เน้นการลงทุนแบบ Bottom-up เลือกหุ้นที่มีศักยภาพการเติบโตเหนือดัชนี และได้ประโยชน์จากการเติบโตของเศรษฐกิจบริหารพอร์ตการลงทุนอย่างสมดุล โดยให้น้ำหนักมุมมองทั้งระยะกลางและระยะยาว',
        },
        {
          type: 'rmf',
          risk: 'medium',
          fund: 'B-IR-FOFRMF',
          category: 'อสังหาริมทรัพย์',
          fund_comment:
            'กองทุนรวมอสังหาริมทรัพย์ไทยและต่างประเทศ บริหารแบบ Active เพื่อเป้าหมายการสร้างผลตอบแทนทั้งปันผล และส่วนต่างราคา (Capital Gain) ที่ดีในระยะยาว จุดเด่นมีความผันผวนต่ำกว่ากองทุนในประเภทเดียวกัน แต่ให้ผลตอบแทนที่ดีกว่า (ระยะเวลาตั้งแต่ปี 2020) ซึ่งนับว่าเป็นคุณสมบัติที่ดีของกองทุนสินทรัพย์ทางเลือก อสังหาฯ ไทยและสิงคโปร์ ยังมีราคาต่ำกว่ามูลค่าที่แท้จริง แต่กลับมาเปิดเมืองอย่างเต็มที่แล้ว ดังนั้นจึงมีแนวโน้มฟื้นตัวต่อจากนี้ ผู้จัดการกองทุนมีระบบและจุดชี้วัดที่ใช้ในการกำหนดกลยุทธ์การลงทุนที่ชัดเจน',
        },
        {
          type: 'rmf',
          risk: 'low',
          fund: 'KKP INRMF',
          category: 'ตราสารหนี้',
          fund_comment:
            'ลงทุนในพันธบัตรรัฐบาลหรือหุ้นกู้เอกชนที่มีแนวโน้มเติบโตสูง และมีเสถียรภาพทางการเงินที่ดี จุดเด่น กองทุนสร้างผลตอบแทนได้ดีในระยะยาว เทียบกับกองที่มี Duration ใกล้เคียงกัน ผลตอบแทนในช่วง 3 ปีที่ผ่านมา ทำได้ดีกว่ากองอื่นโดยเปรียบเทียบมาก เป็นช่วงที่ผู้จัดการกองทุนคนปัจจุบันเข้ามา ลงทุนในหุ้นกู้เอกชนไม่มากเท่ากับกองทุนอื่น ทำให้มี Credit Risk ที่ต่ำกว่า กองมี Turnover ต่ำ แต่ยังสามารถสร้างผลตอบแทนได้เหนือกว่ากองอื่น',
        },
        {
          type: 'tesg',
          risk: 'high',
          fund: 'KTAG-ThaiESG',
          category: 'หุ้นไทย',
          fund_comment:
            'ลงทุนในหุ้นที่จดทะเบียนในตลาดหลักทรัพย์แห่งประเทศไทย (SET) และ/หรือ ตลาดหลักทรัพย์ เอ็ม เอ ไอ (mai) โดยจะเน้นลงทุนในบริษัทที่มีความโดดเด่นด้าน ESG ผ่านกระบวนการวิเคราะห์การลงทุนแบบ ESG Integration ซึ่งจะคัดเลือกจากผลประเมินหุ้นยั่งยืน SET ESG Ratings ในระดับ A ขึ้นไป โดยเฉลี่ยในรอบปีบัญชีไม่น้อยกว่า 80% ของ NAV',
        },
        {
          type: 'tesg',
          risk: 'medium',
          fund: 'KTAG70/30-ThaiESG',
          category: 'สินทรัพย์ผสม',
          fund_comment:
            'กองทุนมีนโยบายกระจายการลงทุนใน (1) หุ้นที่จดทะเบียนในตลาดหลักทรัพย์แห่งประเทศไทย (SET) และ/หรือ ตลาดหลักทรัพย์ เอ็ม เอ ไอ (mai) ที่มีความโดดเด่นด้าน ESG โดยมี SET ESG Ratings ในระดับ A ขึ้นไป ที่สัดส่วนไม่น้อยกว่า 70% ของ NAV และ (2) ลงทุนในตราสารหนี้ ประเภท Green bond, Sustainability Bond และ Sustainability – Linked Bond สัดส่วนไม่เกินกว่า 30% ของ NAV',
        },
        {
          type: 'tesg',
          risk: 'low',
          fund: 'KKKP GB THAI ESG',
          category: 'ตราสารหนี้',
          fund_comment:
            'ลงทุนในตราสารหนี้กลุ่มความยั่งยืน เช่น ตราสารเพื่ออนุรักษ์สิ่งแวดล้อม (Green bond) ตราสารเพื่อความยั่งยืน (Sustainability bond) ตราสารส่งเสริมความยั่งยืน (Sustainability-linked bond) โดยเฉลี่ยในรอบปีบัญชีไม่น้อยกว่า 80% ของ NAV',
        },
      ],
      meta: [
        {
          key: 'combo_minimum_investment',
          value: 10000,
        },
        {
          key: 'ssf_below_minimum_fund',
          value: 'UGIS-SSF',
        },
        {
          key: 'rmf_below_minimum_fund',
          value: 'KKP INRMF',
        },
        {
          key: 'tesg_below_minimum_fund',
          value: 'KKKP GB THAI ESG',
        },
        {
          key: 'ssf_high_combo_description',
          value:
            'เสี่ยงสูง กระจายในหุ้นทั่วโลก สอดคล้องไปกับเทรนด์ลงทุนในอนาคต',
        },
        {
          key: 'ssf_medium_combo_description',
          value:
            'เสี่ยงกลาง กระจายสินทรัพย์ เพื่อสร้างผลตอบแทนควบคู่การคุมความผันผวน',
        },
        {
          key: 'ssf_low_combo_description',
          value:
            'เสี่ยงต่ำ สร้างผลตอบแทนในระยะยาวเอาชนะเงินฝากและเงินเฟ้ออย่างมั่นคง',
        },
        {
          key: 'ssf_safe_combo_description',
          value: 'เสี่ยงต่ำมาก เน้นรักษาเงินต้น',
        },
        {
          key: 'rmf_high_combo_description',
          value:
            'เสี่ยงสูง กระจายในหุ้นทั่วโลก สอดคล้องไปกับเทรนด์ลงทุนในอนาคต',
        },
        {
          key: 'rmf_medium_combo_description',
          value:
            'เสี่ยงกลาง กระจายสินทรัพย์ เพื่อสร้างผลตอบแทนควบคู่การคุมความผันผวน',
        },
        {
          key: 'rmf_low_combo_description',
          value:
            'เสี่ยงต่ำ สร้างผลตอบแทนในระยะยาวเอาชนะเงินฝากและเงินเฟ้ออย่างมั่นคง',
        },
        {
          key: 'rmf_safe_combo_description',
          value: 'เสี่ยงต่ำมาก เน้นรักษาเงินต้น',
        },
        {
          key: 'tesg_high_combo_description',
          value:
            'เสี่ยงสูง กระจายในหุ้นทั่วโลก สอดคล้องไปกับเทรนด์ลงทุนในอนาคต',
        },
        {
          key: 'tesg_medium_combo_description',
          value:
            'เสี่ยงกลาง กระจายสินทรัพย์ เพื่อสร้างผลตอบแทนควบคู่การคุมความผันผวน',
        },
        {
          key: 'tesg_low_combo_description',
          value:
            'เสี่ยงต่ำ สร้างผลตอบแทนในระยะยาวเอาชนะเงินฝากและเงินเฟ้ออย่างมั่นคง',
        },
        {
          key: 'tesg_safe_combo_description',
          value: 'เสี่ยงต่ำมาก เน้นรักษาเงินต้น',
        },
        {
          key: 'db_version',
          value: 2023,
        },
      ],
    },
  };
}

export default getConfig();
