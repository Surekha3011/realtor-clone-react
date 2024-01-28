import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import { RiShareBoxFill } from "react-icons/ri";
import { FaBath } from "react-icons/fa";
import { FaBed } from "react-icons/fa";
import { FaParking } from "react-icons/fa";
import { MdChair } from "react-icons/md";
import { MdMyLocation } from "react-icons/md";
import { Swiper, SwiperSlide } from "swiper/react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import SwiperCore, {
  EffectFade,
  Autoplay,
  Navigation,
  Pagination,
} from "swiper";
import "swiper/css/bundle";
import { getAuth } from "firebase/auth";
import Contact from "../components/Contact";
export default function Listing() {
  const params = useParams();
  const auth = getAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [contactLandlord, setContactLandlord] = useState(false);
  const position = [51.505, -0.09];
  SwiperCore.use([Autoplay, Navigation, Pagination]);
  useEffect(() => {
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    }
    fetchListing();
  }, [params.listingId]);
  if (loading) {
    return <Spinner></Spinner>;
  }
  return (
    <main>
      <Swiper
        slidesPerView={1}
        navigation
        pagination={{ type: "progressbar" }}
        effect="fade"
        modules={[EffectFade]}
        autoplay={{ delay: 3000 }}
      >
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative w-full overflow-hidden h-[400px]"
              style={{
                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                backgroundSize: "cover",
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
        className="fixed top-[13%] right-[3%] z-10 bg-white cursor-pointer border-2 border-gray-400 rounded-full w-12 h-12 flex justify-center items-center"
      >
        <RiShareBoxFill className="text-xl font-semibold text-slate-500" />
      </div>
      {shareLinkCopied && (
        <p className="fixed top-[25%] right-[5%] font-semibold border-2 border-gray-400 rounded-md bg-white z-10 px-3 py-2">
          LINK COPIED
        </p>
      )}
      <div className="flex flex-col md:flex-row max-6xl lg:mx-auto p-4 rounded lg border-3 shadow-lg bg-white lg:space-x-5 ">
        <div className="bg-purple-100 w-full p-2">
          <p className="text-2xl font-bold mb-3 text-purple-950">
            {listing.name} - $
            {listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" ? " /month" : ""}
          </p>
          <p className="flex items-center mt-3 mb-3 font-semibold ">
            <MdMyLocation className="text-green-800 mr-1" />
            {listing.address}
          </p>
          <div className="flex justify-start items-center space-x-4 w-[75%]">
            <p className="bg-red-700 w-full max-[200px] rounded-md text-white p-1 font-semibold shadow-md text-center ">
              {listing.type === "rent" ? "RENT" : "SALE"}
            </p>
            {listing.offer && (
              <p className="bg-green-700 w-full max-[200px] rounded-md text-white p-1 font-semibold shadow-md text-center">
                ${+listing.regularPrice - +listing.discountedPrice}discount
              </p>
            )}
          </div>
          <p className="mt-3 mb-3">
            <span className=" font-semibold">Description - </span>
            {listing.description}
          </p>
          <ul className="flex items-center space-x-2 sm:space-x-10 text-sm font-semibold">
            <li className="uppercase flex items-center whitespace-nowrap">
              <FaBed className="text-lg mr-1" />
              {+listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
            </li>
            <li className="uppercase  flex items-center whitespace-nowrap">
              <FaBath className="text-lg mr-1" />
              {+listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : "1 Bath"}
            </li>
            <li className="uppercase flex items-center whitespace-nowrap">
              <FaParking className="text-lg mr-1" />
              {listing.parking ? "Parking-Spot" : "No-Parking"}
            </li>
            <li className="uppercase flex items-center whitespace-nowrap">
              <MdChair className="text-lg mr-1" />
              {listing.furnished ? "Furnished" : "not-furnished"}
            </li>
          </ul>
          {listing.userRef !== auth.currentUser?.uid && !contactLandlord && (
            <div className="mt-6">
              <button
                onClick={() => {
                  setContactLandlord(true);
                }}
                className="px-6 py-2 mt-6 bg-purple-500 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-purple-600 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg w-full text-center transition duration-150 ease-in-out"
              >
                Contact LandLord
              </button>
            </div>
          )}
          {contactLandlord && (
            <Contact userRef={listing.userRef} listing={listing}></Contact>
          )}
        </div>
        <div className="bg-blue-300 h-[300px] lg:h-[300px] :mt-2 w-full z-10 overflow-x-hidden md:ml-0 ">
          <MapContainer
            center={[listing.geolocation.lat, listing.geolocation.lng]}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[listing.geolocation.lat, listing.geolocation.lng]}
            >
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </main>
  );
}
