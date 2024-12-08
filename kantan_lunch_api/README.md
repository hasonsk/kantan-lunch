# Kantan Lunch

## Hướng dẫn cài đặt và chạy backend

### Các bước cài đặt

1. Đảm bào Node.js đã được cài đặt: [Node.js](https://nodejs.org/en/)

2. Đảm bảo Docker và Docker Compose đã được cài đặt: [Docker](https://www.docker.com/)

3. Truy cập vào `kantan_lunch_api`
    ```bash
    cd kantan_lunch_api
    ```

4. Tải dependency
    ```bash
    npm install
    ```

5. Tạo file `.env` trong thư mục `kantan_lunch_api` với nội dung tương tự như file `.env.example`

### Chạy ứng dụng

1. Chạy MongoDB bằng Docker Compose:
    ```bash
    docker-compose up -d
    ```
    
    - Nếu muốn sử dụng MongoDB trên máy, chỉ cần thay đổi `MONGO_URI` trong file `.env` thành địa chỉ MongoDB trên máy.

2. Chạy ứng dụng
    - Chạy ứng dụng ở chế độ development
        ```bash
        npm run dev
        ```
    - Chạy ứng dụng ở chế độ production
        ```bash
        npm start
        ```
        