// import React from "react";

// const MainButton: React.FC<{
//   borderDashed?: boolean;
//   alignImageLeftTop?: boolean;
// }> = ({
//   borderDashed = false,
//   alignImageLeftTop = false,
// }) => {
//   return (
//     <section className="bg-[#fff1f1] border-b-2 border-dashed border-primary-red !overflow-hidden">
//       <div className="relative flex justify-center items-center px-4 md:px-16 h-[150px] md:h-[200px] lg:h-[300px]">
//         {/* Left Image */}
//         {imageLeft && (
//           <img
//             src={imageLeft}
//             alt="House Left"
//             style={{ width: imageLeftWidth }}
//             className={`absolute left-0 ${alignImageLeftTop ? 'top-0': 'bottom-0' }`}
//           />
//         )}

//         {/* Center Text */}
//         <div className="text-center flex flex-col justify-center z-10">
//           <h2 className="text-3xl md:text-4xl font-bold text-primary-red">
//             {heading}
//           </h2>
//           <p className="text-sm md:text-base text-gray-700 mt-1">
//             {subHeading}
//           </p>
//         </div>

//         {imageRight && (
//           <img
//             src={imageRight}
//             alt="House Right"
//             style={{ width: imageRightWidth }}
//             className={`absolute right-0 ${alignImageRightTop ? 'top-0': 'bottom-0' }`}
//           />
//         )}
//       </div>
//     </section>
//   );
// };

// export default MainButton;
