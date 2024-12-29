import React, { useState, useCallback } from "react";
import "./CommunityPage.css";

const CommunityPage = () => {
  const communityData = [
    {
      "user-name": "田中 一郎 (Ichiro Tanaka)",
      "like-number": 120,
      image: [
        "https://cdn.buffetposeidon.com/app/media/uploaded-files/060824-lam-bun-ca-cham-buffet-poseidon-1.jpg",
        "https://cdn.buffetposeidon.com/app/media/uploaded-files/060824-lam-bun-ca-cham-buffet-poseidon-2.jpg",
        "https://cdn.buffetposeidon.com/app/media/uploaded-files/060824-lam-bun-ca-cham-buffet-poseidon-3.jpg"
      ],
      content: `
        今日は小さな路地にある食堂でブンカー・チャム（Bún cá chấm）というベトナム料理を試してみました。
        特に、タレは絶妙なバランスで作られていて、ライムの酸味、砂糖の甘み、そして新鮮な唐辛子のピリ辛さが調和していました。
        ぜひ試してみてください！
      `,
    },
    {
      "user-name": "鈴木 智子 (Tomoko Suzuki)",
      "like-number": 250,
      image: [
        "https://cdn.tuoitre.vn/zoom/700_525/471584752817336320/2023/10/4/z47540237686013c7a28c9b57f6bc60fa68ce18fbc1633-16964370789681995191904-332-0-1379-2000-crop-1696437207372675712755.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/9/99/Ph%E1%BB%9F_b%C3%B2%2C_C%E1%BA%A7u_Gi%E1%BA%A5y%2C_H%C3%A0_N%E1%BB%99i.jpg",
        "https://i-giadinh.vnecdn.net/2021/03/07/nhngang1-1615086549-6552-1615087048.jpg"
      ],
      content: `
        ベトナム旅行中に出会った「フォー」が忘れられません。
        温かいスープと新鮮なハーブの組み合わせは本当に最高でした。
        また行きたいと思います！<br>
      `,
    },
    {
      "user-name": "佐藤 健一 (Kenichi Sato)",
      "like-number": 75,
      image: [
        "https://thanhnien.mediacdn.vn/Uploaded/congthang/2022_10_07/banhmioven-1403.jpg",
        "https://cdn.tuoitre.vn/zoom/700_390/471584752817336320/2023/2/20/viet-populaire-copy-e1659353432539-1024x681-16594235658881650374369-1676888750526893807756-41-0-423-730-crop-16768887676751617090180.jpg",
        "https://image.tinnhanhchungkhoan.vn/1200x630/Uploaded/2024/wpxlcdjwi/2024_03_16/top-1-mon-sandwich-ngon-nhat-the-gioi-goi-ten-banh-my-viet-nam1710498007-1824.jpg"
      ],
      content: `
        地元の市場で見つけた「バインミー」はとても美味しかったです。
        サクサクのフランスパンと具材のバランスが絶妙でした。
        次回の訪問が待ち遠しいです！<br>
      `,
    },
  ];

  const [currentImages, setCurrentImages] = useState(
    communityData.map(() => 0) // Mặc định tất cả các record sẽ hiển thị ảnh đầu tiên
  );

  const handleNext = useCallback((index) => {
    setCurrentImages((prev) => {
      const newState = [...prev];
      const currentIndex = newState[index];
      const nextIndex = (currentIndex + 1) % communityData[index].image.length;
      newState[index] = nextIndex;
      return newState;
    });
  }, [communityData]);

  const handlePrev = useCallback((index) => {
    setCurrentImages((prev) => {
      const newState = [...prev];
      const currentIndex = newState[index];
      const prevIndex = (currentIndex - 1 + communityData[index].image.length) % communityData[index].image.length;
      newState[index] = prevIndex;
      return newState;
    });
  }, [communityData]);

  return (
    <div className="community-wrapper">
      <button className="contribute-button">貢献したいですか</button>
      {communityData.map((item, index) => (
        <div key={index} className="community-content-wrapper">
          <div className="content-header">
            <div className="profile">
              <div className="profile-picture">
                <img src="https://cafebiz.cafebizcdn.vn/162123310254002176/2023/10/25/z4813277681529-bd965f8ec0d57a2f9cbfc32cc5c0ca99-7819-1698218518898-16982185191991540570444.jpg" alt="" />
              </div>
              <span className="profile-name">{item["user-name"]}</span>
            </div>
            <div className="likes">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="heart-icon"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill="none"
                  stroke="black"
                  strokeWidth="0.5"
                />
              </svg>
              <span className="likes-count">{item["like-number"]}</span>
            </div>
          </div>

          {/* Slider phần ảnh */}
          <div className="main-content">
            <div className="slider-container">
              <button
                className="slider-button prev"
                onClick={() => handlePrev(index)}
              >
                &#10094;
              </button>
              <div className="image-wrapper">
                <img
                  src={item.image[currentImages[index]]}
                  alt="content"
                  className="image-placeholder"
                  loading="lazy" // Thêm lazy loading cho ảnh
                />
              </div>
              <button
                className="slider-button next"
                onClick={() => handleNext(index)}
              >
                &#10095;
              </button>
            </div>
          </div>

          <div className="footer">
            <p
              className="text-placeholder"
              dangerouslySetInnerHTML={{ __html: item.content }}
            ></p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommunityPage;
