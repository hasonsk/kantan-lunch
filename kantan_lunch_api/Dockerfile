# Sử dụng image Node.js chính thức
FROM node:18

# Tạo thư mục làm việc
WORKDIR /usr/src/app

# Cài đặt các phụ thuộc
COPY package*.json ./
RUN npm install

# Copy toàn bộ mã nguồn
COPY . .

# Mở cổng ứng dụng và cổng debug
EXPOSE 3000 9229

# Chạy ứng dụng với chế độ inspect
CMD ["node", "--inspect=0.0.0.0:9229", "src/app.js"]
