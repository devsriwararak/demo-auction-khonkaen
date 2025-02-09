# ใช้ Node.js เวอร์ชันล่าสุด
FROM node:18

# ตั้งค่าทำงานภายใน /app
WORKDIR /app

# คัดลอกไฟล์ package.json และติดตั้ง dependencies
COPY package.json ./
RUN npm install --production

# คัดลอกไฟล์ทั้งหมดเข้า container
COPY . .

RUN npm run build

# เปิดพอร์ต 3000
EXPOSE 3000

# รัน Next.js
CMD ["npm", "start"]