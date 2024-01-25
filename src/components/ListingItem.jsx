import React from "react";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { MdOutlineMyLocation } from "react-icons/md";
import { AiFillEdit } from "react-icons/ai";
import { AiFillDelete } from "react-icons/ai";

export default function ListingItem({ listing, id, onDelete, onEdit }) {
  return (
    <li className="relative bg-purple-50 flex flex-col justify-between items-center shadow-md hover:shadow-xl rounded-md over-flow-hidden transition-shadow duration-150 m-[10px]">
      <Link className="contents" to={`/category/${listing.type}/${id}`}>
        <img
          src={listing.imgUrls[0]}
          alt=""
          className="h-[170px] w-full object-cover hover:scale-105 transition-scale duration-200 ease-in"
          loading="lazy"
        ></img>
        <Moment
          className="absolute top-2 left-2 bg-[#ba43f6] text-white uppercase text-xs font-semibold rounded-md px-2 py-1 shadow-lg"
          fromNow
        >
          {listing.timestamp?.toDate()}
        </Moment>
        <div className="w-full p-[10px] ">
          <div className="flex items-center space-x-1">
            <MdOutlineMyLocation className="h-4 w-4 text-purple-950" />
            <p className="text-sm font-semibold text-purple-600 truncate mb-[2px]">
              {listing.address}
            </p>
          </div>
          <p className="font-bold text-xl truncate m-0 text-[#853ab4]">
            {listing.name}
          </p>
          <p className="text-[#853ab6] mt-2 font-semibold">
            $
            {listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" && " / month"}
          </p>
          <div className="flex items-center mt-[10px] space-x-3 ">
            <div className="flex items-center space-x-1">
              <p className="font-bold text-xs">
                {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <p className="font-bold text-xs">
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} Baths`
                  : "1 Bath"}
              </p>
            </div>
          </div>
        </div>
      </Link>
      {onEdit && (
        <AiFillEdit
          className="absolute bottom-2 right-10 h-8 w-8 cursor-pointer text-black"
          onClick={() => onEdit(listing.id)}
        />
      )}
      {onDelete && (
        <AiFillDelete
          className="absolute bottom-2 right-2 h-8 w-8 cursor-pointer text-red-500 "
          onClick={() => onDelete(listing.id)}
        />
      )}
    </li>
  );
}
