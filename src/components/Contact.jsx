import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { toast } from "react-toastify";

export default function Contact({ userRef, listing }) {
  const [message, setMessage] = useState("");
  const [landlord, setLandlord] = useState(null);

  useEffect(() => {
    async function getLandlord() {
      const docRef = doc(db, "users", userRef);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLandlord(docSnap.data());
      } else {
        toast.error("could not get landlord data ");
      }
    }
    getLandlord();
  }, [userRef]);
  function onChange(e) {
    setMessage(e.target.value);
  }
  return (
    <>
      {landlord !== null && (
        <div className="flex flex-col w-full">
          <p className="mt-6">
            Contact {landlord.name} for the {listing.name.toLowerCase()}
          </p>
          <div>
            <textarea
              name="message"
              id="message"
              cols="30"
              rows="2"
              onChange={onChange}
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-purple-900 rounded transition duration-150 ease-in-out focus:text-purple-950 focus:bg-white focus:border-purple-950"
            >
              {message}
            </textarea>
          </div>
          <a
            href={`mailto:${landlord.email}?Subject=${listing.name}&body=${message}`}
          >
            <button
              className="px-7 py-3 bg-purple-600 text-white rounded text-sm uppercase shadow-md hover:bg-purple-800 hover:shadow-lg focus:bg-purple-800 focus:shadow-lg transition duration-150 ease-in-out w-full text-center mb-6"
              type="button"
            >
              Send Message
            </button>
          </a>
        </div>
      )}
    </>
  );
}
