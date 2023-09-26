// import React, { useEffect, useState } from "react";
// import Lottie from "lottie-react";
// // import SwiperCore, { Navigation } from "swiper";
// import { Swiper, SwiperSlide } from "swiper/react";
// import {Pagination} from "swiper/modules"
// // import "swiper/swiper-bundle.min.css";
// import 'swiper/css'
// import 'swiper/css/pagination'

// // SwiperCore.use([Navigation]);

// const Specials = ({ setState }) => {
//   const [data, setData] = useState([]);
//   const viewStyle = () => {
//     return {
//       //   flex: 1,
//       //   justifyContent: "center",
//       alignItems: "center",
//     };
//   };

//   useEffect(() => {
//     // Mocked data for testing purposes
//     const tempData = [
//       {
//         fileURL:
//           "https://firebasestorage.googleapis.com/v0/b/blazing-grills.appspot.com/o/files%2FTestingSpecial1.jpeg?alt=media&token=450f2520-9079-4058-96c7-40491b944e39",
//       },
//       {
//         fileURL:
//           "https://firebasestorage.googleapis.com/v0/b/blazing-grills.appspot.com/o/files%2FTestingSpecial2.jpeg?alt=media&token=03101560-de59-4437-b8d6-7f8f85a46103",
//       },
//       {
//         fileURL:
//           "https://firebasestorage.googleapis.com/v0/b/blazing-grills.appspot.com/o/files%2FDogg%20Burger%20Double?alt=media&token=2d37ef95-04b7-4119-98de-a121ae5ff300",
//       },
//     ];
//     setData(tempData);
//   }, []);

//   return (
//     <div style={styles.div}>
//       {data.length > 1 ? (
//         <Swiper
//           direction={"vertical"}
//         //   navigation
//         //   slidesPerView={1}
//         //   initialSlide={0}
//         pagination={{clickable: true}}
//         className="mySwiper"
//           modules={[Pagination]}
//         >
//           {/* {data.slice(0, 3).map((specialsData, i) => (
//             <SwiperSlide key={i}>
//               <div>
//                 <img
//                   style={{
//                     width: "98%",
//                     height: "80%",
//                     marginTop: 30,
//                     marginBottom: "auto",
//                     borderRadius: 20,
//                     marginLeft: "auto",
//                     marginRight: "auto",
//                   }}
//                   src={data[i].fileURL}
//                   alt=""
//                 />
//                 {i < 2 && (
//                   <div
//                     style={{
//                       width: 200,
//                       height: 200,
//                       position: "absolute",
//                       bottom: -20,
//                       color: "white",
//                     }}
//                   >
//                     <Lottie
//                       autoPlay={true}
//                       loop={true}
//                       source={require("../assets/swipe-up-arrows.json")}
//                     />
//                   </div>
//                 )}
//                 {i >= 2 && (
//                   <button
//                     style={styles.getStarted}
//                     onClick={() => setState("Main")}
//                   >
//                     <span style={styles.text2}>Main Menu</span>
//                   </button>
//                 )}
//               </div>
//             </SwiperSlide>
//           ))} */}
//           <SwiperSlide>
//           1
//           </SwiperSlide>
//           <SwiperSlide>
//            2
//           </SwiperSlide>
//           <SwiperSlide>
//            3
//           </SwiperSlide>
//         </Swiper>
//       ) : (
//         <Lottie
//           autoPlay={true}
//           loop={true}
//           source={require("../assets/99109-loading.json")}
//         />
//       )}
//     </div>
//   );
// };

// const widthImage = "100%";
// const styles = {
//   text: {
//     textAlign: "center",
//     margin: "auto",
//     justifyContent: "center",
//     color: "white",
//     fontSize: 20,
//     marginTop: 30,
//   },
//   text2: {
//     textAlign: "center",
//     margin: "auto",
//     justifyContent: "center",
//     color: "white",
//     fontSize: 20,
//     marginTop: 10,
//   },
//   div: {
//     width: "100%",
//     height: "100%",
//     marginLeft: "auto",
//     marginRight: "auto",
//     backgroundColor: "white",
//   },
//   imageDiv: {
//     // width: widthImage,
//     height: 600,
//     margin: "auto",
//   },
//   image: {
//     width: 100,
//     height: 100,
//   },
//   getStarted: {
//     bottom: 10,
//     marginLeft: "auto",
//     marginRight: "auto",
//     width: "80%",
//     height: 50,
//     position: "absolute",
//     // paddingTop: 10,
//     backgroundColor: "#F0941E",
//     borderRadius: 25,
//   },
// };

// export default Specials;

import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import './styles.css';

// import required modules
import { Pagination } from 'swiper/modules';

export default function Specials() {
  return (
    <>
      <Swiper
        direction={'vertical'}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
        className="mySwiper"
      >
        <SwiperSlide>Slide 1</SwiperSlide>
        <SwiperSlide>Slide 2</SwiperSlide>
        <SwiperSlide>Slide 3</SwiperSlide>
        <SwiperSlide>Slide 4</SwiperSlide>
        <SwiperSlide>Slide 5</SwiperSlide>
        <SwiperSlide>Slide 6</SwiperSlide>
        <SwiperSlide>Slide 7</SwiperSlide>
        <SwiperSlide>Slide 8</SwiperSlide>
        <SwiperSlide>Slide 9</SwiperSlide>
      </Swiper>
    </>
  );
}

