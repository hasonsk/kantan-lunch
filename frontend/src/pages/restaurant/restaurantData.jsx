const restaurantData = [
  {
    id: 1,
    name: "サニー・ビストロ",
    media: ["https://images2.thanhnien.vn/528068263637045248/2023/2/28/9afcb59ff8f622a87be7-16760314638681857498218-16775749875331071087079.jpeg", "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2023/6/11/1203369/IMG_1612.JPG"],
    address: "ハッピータウン、サンシャインアベニュー123",
    phone_number: "+81-123-456-7890",
    open_time: "08:00 AM",
    close_time: "10:00 PM",
    average_rating: 4.5,
    dishes: [
      {
        id: 1,
        name: "グリルチキン",
        media: ["https://via.placeholder.com/150"],
        price: 12.99
      },
      {
        id: 2,
        name: "ビーガンサラダ",
        media: ["https://via.placeholder.com/150"],
        price: 9.99
      },
      {
        id: 3,
        name: "グリルチキン",
        media: ["https://via.placeholder.com/150"],
        price: 12.99
      },
      {
        id: 4,
        name: "ビーガンサラダ",
        media: ["https://via.placeholder.com/150"],
        price: 9.99
      },
    ],
    posts: [
      {
        id: 1,
        caption: "素晴らしい料理と素敵な雰囲気！",
        media: ["https://via.placeholder.com/150"],
        like_list: [201, 202, 203],
        user_id: 301,
        reviewed: true
      },
      {
        id: 2,
        caption: "グリルチキンが大好き！",
        media: ["https://via.placeholder.com/150"],
        like_list: [202, 204],
        user_id: 302,
        reviewed: true
      }
    ]
  },
  {
    id: 2,
    name: "オーシャン・デライト",
    media: ["https://r2.nucuoimekong.com/wp-content/uploads/cac-quan-an-ngon-o-sai-gon.jpg", "https://via.placeholder.com/150"],
    address: "コースタルシティ、シーサイドレーン456",
    phone_number: "+81-987-654-3210",
    open_time: "10:00 AM",
    close_time: "11:00 PM",
    average_rating: 4.7,
    dishes: [
      {
        id: 3,
        name: "シーフードプラッター",
        media: ["https://via.placeholder.com/150"],
        price: 19.99
      },
      {
        id: 4,
        name: "ロブスタービスク",
        media: ["https://via.placeholder.com/150"],
        price: 14.99
      }
    ],
    posts: [
      {
        id: 3,
        caption: "新鮮なシーフードと海の景色。",
        media: ["https://via.placeholder.com/150"],
        like_list: [205, 206],
        user_id: 303,
        reviewed: true
      },
      {
        id: 4,
        caption: "少し高いけど価値がある！",
        media: ["https://via.placeholder.com/150"],
        like_list: [207, 208],
        user_id: 304,
        reviewed: true
      }
    ]
  }
];

export default restaurantData;
