import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import Dropdown from "./Dropdown";

function App() {
  const [tickers, setTickers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dropdownOptions, setDropdownOptions] = useState([]);

  // states
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  // states

  useEffect(() => {
    setMounted(true);
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get("http://localhost:3000/api/tickers"); // Replace with your actual API endpoint
        setTickers(response.data);

        const uniqueFirstParts = new Set();

        response.data.forEach((ticker) => {
          const firstPart = ticker.name.split('/')[0];
          uniqueFirstParts.add(firstPart);
        });

        const options = Array.from(uniqueFirstParts).map(part => ({
          value: part,
          label: part
        }));
     
        setDropdownOptions(options);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="w-full">
        <Navbar toggleTheme={toggleTheme} dropdownOptions={dropdownOptions} mounted={mounted} theme={theme} />

        {/* Main Page  */}
        <div className="w-full md:px-8 px-3 ">
          <div className="text-center  ">
            <h2 className="md:text-2xl text-[14px] font-thin text-gray-400">
              Best Price to Trade
            </h2>
          </div>

          <div className=" md:mx-16 md:text-4xl text-[14px] flex justify-between items-center ">
            <div className="text-center">
              <p className="text-[#5DC7C2] mb-1 ">0.64 %</p>
              <p className="  font-thin md:text-[20px] text-[14px] text-gray-400">
                5 Mins
              </p>
            </div>

            <div className="text-center">
              <p className="text-[#5DC7C2] mb-1 ">1.22 %</p>
              <p className="text-gray-400 md:text-[20px] text-[14px] font-thin">
                1 Hour
              </p>
            </div>
            {/* center  */}
            <div className="text-center ">
              <p className="md:text-7xl sm:xl mb-4  dark:text-white  ">
                ₹54,60,756
              </p>
              <p className="text-gray-400 md:text-[20px] text-[14px] font-thin">
                Average BTC/INR net price including commission
              </p>
            </div>

            <div className="text-center">
              <p className="text-[#5DC7C2] mb-1 ">5.73 %</p>
              <p className="text-gray-400 md:text-[20px] text-[14px] font-thin">
                1 Day
              </p>
            </div>

            <div className="text-center">
              <p className="text-[#5DC7C2] mb-1 ">19.08 %</p>
              <p className="text-gray-400 md:text-[20px] text-[14px] font-thin">
                7 Days
              </p>
            </div>
          </div>
        </div>

        {/* Table ====================================================================================================  */}
        {isLoading ? (
          <p className="text-center">Loading data...</p>
        ) : error ? (
          <p>Error fetching data: {error.message}</p>
        ) : (
          <div className="max-w-[100rem] mx-auto my-6 px-6">
            <Table tickers={tickers} />
          </div>
        )}
      </div>
    </>
  );
}

export default App;

const Navbar = ({ toggleTheme, mounted, theme, dropdownOptions }) => {
  const [SELECTED, setSELECTED] = useState("BTC")
  const handleItemSelect = (item) => {
   setSELECTED(item)
    // Handle the selection (e.g., navigate to a new page, update state, etc.)
  };

  const simpleItems = ['INR', ];


  return (
    <div className="grid grid-cols-1 gap-4 md:flex justify-between md:py-6 md:px-8">
      {/* logo  */}
      <div className="flex justify-center items-center ">
        <img src="logo.png" alt="logo" className="md:w-64 w-32" />
      </div>

      {/* middle buttons  */}
      <div className="grid grid-cols-3  md:flex justify-between items-center md:max-w-[320px] w-full">
                           
  <Dropdown title="INR" items={simpleItems} onItemSelect={handleItemSelect} />
      <Dropdown title={SELECTED} items={dropdownOptions} onItemSelect={handleItemSelect} />
   

      <div>
      <a
          href="https://wazirx.com/signup"
          target="_blank"
          className="uppercas dark:bg-white/10 bg-gray-100  text-xs  md:text-base  flex items-center  md:py-1 md:px-4 rounded-lg "
        >
          BUY ETH</a>
      </div>
     
      </div>

      {/* end buttons */}
      <div className="grid grid-cols-3  md:flex justify-between md:max-w-[280px] items-center w-full text-white ">
        <CountdownCircleTimer
          isPlaying
          duration={60}
          colors={["#5DC7C2"]}
          colorsTime={[60]}
          onComplete={() => ({ shouldRepeat: true })}
          size={36}
          strokeWidth={3}
        >
          {({ remainingTime }) => (
            <div className="text-[14px] text-[#5DC7C2] font-bold">
              {remainingTime}
            </div>
          )}
        </CountdownCircleTimer>
       <div className="">
       <a
          href="https://hodlinfo.com/connect/telegram"
          className="bg-[#5DC7C2] rounded-xl md:px-4 md:py-2 text-xs p-1 md:text-base"
        >
          Contact Telegram
        </a>
       </div>

        <div className="ml-auto flex items-center gap-4">
          <button
            aria-label="Toggle Dark Mode"
            type="button"
            className="md:w-9 md:h-9 h-6 w-6 bg-zinc-200 rounded-lg dark:bg-zinc-600 flex items-center justify-center hover:ring-2 ring-gray-300 transition-all"
            onClick={toggleTheme}
          >
            {mounted &&
              (theme === "dark" ? (
                <MoonIcon className="md:w-5 md:h-5 w-2 h-2" />
              ) : (
                <SunIcon className="md:w-5 md:h-5 w-2 h-2" />
              ))}
          </button>
        </div>
      </div>
    </div>
  );
};

const Table = ({ tickers }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto border-separate border-spacing-y-3  ">
        {/* head */}
        <thead>
          <tr className="dark:md:text-xl text-[14px] text-center dark:text-[14px]    ">
            <th>#</th>
            <th>Platform</th>
            <th>Last Traded Price</th>
            <th>Buy / Sell Price</th>
            <th>Difference</th>
            <th>Savings</th>
          </tr>
        </thead>
        <tbody className="dark:md:text-xl dark:text-[14px] font-semibold text-[14px]   text-center  border-spacing-2 ">
          {/* row 1 */}

          {tickers.length > 0 && // Check if data exists before mapping
            tickers.map((ticker, index) => (
              <tr
                key={index}
                className=" bg-gray-100  dark:bg-white/10    rounded-md   "
              >
                <th className="py-3 rounded-l-md">{index + 1}</th>
                <td>{ticker.name || "N/A"}</td>{" "}
                {/* Handle missing 'name' property */}
                <td>₹ {ticker.last?.toLocaleString("en-IN") || "N/A"}</td>{" "}
                {/* Handle missing 'last' property */}
                <td>
                  ₹ {ticker.buy?.toLocaleString("en-IN") || "N/A"} / ₹{" "}
                  {ticker.sell?.toLocaleString("en-IN") || "N/A"}
                </td>
                <td>{ticker.difference?.toFixed(2) || "N/A"}%</td>{" "}
                {/* Handle missing 'difference' property, format to 2 decimals */}
                <td className="rounded-r-md">
                  ₹ {ticker.savings?.toLocaleString("en-IN") || "N/A"}
                </td>{" "}
                {/* Handle missing 'savings' property */}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
