import React from "react";

const NotFound = () => {
  return (
    <div className="min-h-[65vh] pb-[30px]">
      <div className="py-[40px]">
        <div className="w-full px-[15px] flex flex-col items-center justify-center">
          <h1 className="text-[40px] font-bold text-center text-redichi mb-[13px] text-[--purple-primary]">
            <span
              className="block text-[#fff] text-[170px] font-bold text-center "
              style={{
                textShadow:
                  "0 1px 0 #ccc, 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9, 0 5px 0 #aaa, 0 6px 1px rgba(0, 0, 0, 0.1), 0 0 5px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.3), 0 3px 5px rgba(0, 0, 0, 0.2), 0 5px 10px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.2), 0 20px 20px rgba(0, 0, 0, 0.15)",
              }}
            >
              404
            </span>
            Không tìm thấy trang
          </h1>
          <p className="mx-auto block mb-[30px] text-[16px] font-normal max-w-[520px] text-center">
            Trang bạn đang tìm kiếm có thể đã bị xóa, chuyển đi, thay đổi link
            hoặc chưa bao giờ tồn tại.
          </p>
          <div className="flex items-center justify-center">
            <a
              href="/"
              className="py-2 px-8 bg-redichi  text-center border rounded-sm  btn-hover-effect"
            >
              Trở về trang chủ
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
