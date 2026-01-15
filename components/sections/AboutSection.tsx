"use client";

import React from "react";

export default function WhiteReview() {
  const videoGrid = [
    { id: 1, video: "pokestorevidone.mp4" },
    { id: 2, video: "pokestorevidtwo.mp4" },
    { id: 3, video: "pokestorevidthree.mp4" },
  ];

  return (
    <section className="relative bg-[#212121] py-8  overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-center px-4">
        {videoGrid.map((item) => (
          <div
            key={item.id}
            className="flex flex-col items-center "
          >
            <video
              src={item.video}
              autoPlay
              loop
              muted
              className="w-full h-auto"
            />
          </div>
        ))}
      </div>
    </section>
  );
}