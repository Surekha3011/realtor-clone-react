import { getAuth, updateProfile } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { FcHome } from "react-icons/fc";
import ListingItem from "../components/ListingItem";

export default function Profile() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const navigate = useNavigate();
  const [changeDetail, setChangeDetail] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = formData;
  function onLogout() {
    auth.signOut();
    navigate("/");
  }
  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }
  async function onSubmit() {
    try {
      if (auth.currentUser.displayName !== name) {
        //update displayname in firebase auth
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        //update nam ein the firestore

        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
          name,
        });
      }
      toast.success("profile updated successfully");
    } catch (error) {
      toast.error("could not updated the profile credentials");
    }
  }
  useEffect(() => {
    async function fetchUserListings() {
      setLoading(true);
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    }
    fetchUserListings();
  }, [auth.currentUser.uid]);
  return (
    <>
      <section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
        <h1 className="text-3xl text-center mt-6 font-bold">My-Profile</h1>
        <div className="w-full md:w-[50%] mt-6 px-3">
          <form>
            <input
              type="text"
              id="name"
              value={name}
              disabled={!changeDetail}
              onChange={onChange}
              className={`mb-5 w-full px-15 py-2 text-xl text-gray-600 bg-white border border-gray-300 rounded transition ease-in-out ${
                changeDetail && "bg-red-300 focus:bg-red-400"
              } `}
            ></input>
            <input
              type="email"
              id="email"
              value={email}
              disabled
              className="mb-5 w-full px-15 py-2 text-xl text-gray-600 bg-white border border-gray-300 rounded transition ease-in-out "
            ></input>
            <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg">
              <p className="flex items-center mb-6">
                Do you want to change or edit the name?
                <span
                  onClick={() => {
                    changeDetail && onSubmit();
                    setChangeDetail((prevState) => !prevState);
                  }}
                  className="text-red-500 hover:text-red-700 transition ease-in-out duration-150 ml-1 cursor-pointer"
                >
                  {changeDetail ? "Apply change" : "Edit"}
                </span>
              </p>
              <p
                onClick={onLogout}
                className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out cursor-pointer"
              >
                Sign out
              </p>
            </div>
          </form>
          <button
            type="submit"
            className="w-full bg-purple-500 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-purple-600 transition duration-50 ease-in-out hover:shadow-lg active:bg-purple-700"
          >
            <Link
              to="/create-listing"
              className="flex justify-center items-center"
            >
              <FcHome
                className="mr-2 text-3xl bg-red-200 rounded-full
              "
              />
              Sell or Rent House
            </Link>
          </button>
        </div>
      </section>
      <div className="max-w-6xl px-3 mt-6 mx-auto">
        {!loading && listings.length > 0 && (
          <>
            <h2 className="text-2xl text-center font-semibold ">MY LISTINGS</h2>
            <ul>
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                ></ListingItem>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}
