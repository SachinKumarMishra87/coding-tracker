import React, { useEffect, useState } from 'react';
import Approutes from './routes/Approutes';
import API from './services/api';
import { useNavigate } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import ScrollToTop from './component/ScrollToTop';

const App = () => {

  const [dueCount, setDueCount] = useState(0);
  const [showRevisionBanner, setShowRevisionBanner] = useState(true);

  const navigate = useNavigate();

  // =========================
  // FETCH + CHECK LOGIC
  // =========================
  useEffect(() => {

    const fetchRevisions = async () => {
      try {

        const res = await API.get("/questions/revision/due");
        const count = res.data.totalDue;

        setDueCount(count);

      } catch (error) {
        console.log(error);
      }
    };

    fetchRevisions();

    const interval = setInterval(fetchRevisions, 30000); // 30 sec

    return () => clearInterval(interval);

  }, []);

  // =========================
  // HANDLE SNOOZE + VISIBILITY
  // =========================
  useEffect(() => {

    const hiddenUntil = sessionStorage.getItem("hideRevisionBannerUntil");

    // 🔥 if snoozed and still in time → hide
    if (hiddenUntil && Date.now() < Number(hiddenUntil)) {
      setShowRevisionBanner(false);
    }

    // 🔥 if snooze expired → allow banner again
    if (!hiddenUntil || Date.now() >= Number(hiddenUntil)) {
      setShowRevisionBanner(true);
    }

  }, [dueCount]);

  // =========================
  // FINAL UI STATE
  // =========================
  const shouldShowBanner =
    dueCount > 0 && showRevisionBanner;

  return (
    <>
      {shouldShowBanner && (
        <div
          className="
          animate-[slideDown_0.6s_cubic-bezier(0.22,1,0.36,1)]
      fixed 
      top-2
      left-1/2 
      -translate-x-1/2 
      z-100
      w-[92%] sm:w-auto 
      max-w-[95%] sm:max-w-none

      bg-[#18181b] 
      border border-orange-500 

      px-4 sm:px-5 
      py-3 

      rounded-xl sm:rounded-2xl 
      shadow-2xl 

      flex flex-col sm:flex-row 
      items-center 
      gap-3 sm:gap-4 
      text-center sm:text-left
    "
        >

          {/* TEXT */}
          <p className="text-sm text-white leading-snug">
            🔥 You have {dueCount} pending revisions
          </p>

          {/* BUTTONS WRAPPER */}
          <div className="flex items-center gap-3">

            {/* Revise Now */}
            <button
              onClick={() => {
                navigate("/revision/due");
                setShowRevisionBanner(false);
              }}
              className="
          bg-orange-500 hover:bg-orange-600 
          px-3 sm:px-4 
          py-1 
          rounded-lg 
          text-xs sm:text-sm 
          font-medium
          whitespace-nowrap
        "
            >
              Revise Now
            </button>

            {/* CROSS */}
            <button
              onClick={() => {
                const oneHourLater = Date.now() + 60 * 60 * 1000;

                sessionStorage.setItem(
                  "hideRevisionBannerUntil",
                  oneHourLater
                );

                setShowRevisionBanner(false);
              }}
              className="text-gray-400 hover:text-white text-lg"
            >
              ✕
            </button>

          </div>
        </div>
      )}
      <Toaster position="top-right" />
       <ScrollToTop />
      <Approutes />
    </>
  );
};

export default App;