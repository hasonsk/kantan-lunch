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

### Chạy ứng dụng

1. Chạy MongoDB bằng Docker Compose:
    ```bash
    docker-compose up -d
    ```

2. Chạy ứng dụng
    - Chạy ứng dụng ở chế độ development
        ```bash
        npm run dev
        ```
    - Chạy ứng dụng ở chế độ production
        ```bash
        npm start
        ```
        