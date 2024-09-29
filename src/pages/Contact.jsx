import React from "react";

const Contact = () => {
  return (
    <section className="text-gray-600 body-font relative">
      <div className="my-2 flex items-center justify-between  container px-5 mx-auto">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold text-gray-500 lg:text-3xl mt-10 mb-4">
            Contact Us
          </h2>
        </div>
      </div>
      <div className="container px-5 py-2 mx-auto flex sm:flex-nowrap flex-wrap">
        <div className="lg:w-2/3 md:w-1/2 bg-gray-300 rounded-lg overflow-hidden sm:mr-10 p-5 flex items-end justify-start relative">
          <iframe
            width="100%"
            height="100%"
            className="absolute inset-0"
            style={{
              filter: "grayscale(1) contrast(1.2) opacity(0.4)",
              border: "none",
              margin: "0",
              padding: "0",
            }}
            frameBorder="0" // Can be omitted if using CSS
            title="map"
            scrolling="no"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345087185!2d144.9537363153186!3d-37.817209979751954!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf5778e8cdbb14433!2sFederation+Square!5e0!3m2!1sen!2sau!4v1617094017638!5m2!1sen!2sau"
          />

          <div className="bg-white w-fit relative flex flex-wrap py-6 rounded shadow-md">
            <div className="lg:w-1/2  px-5">
              <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">
                ADDRESS
              </h2>
              <p className="mt-1 text-xs md:text-sm">
                456 Anna Salai, Guindy , Chennai, Tamil Nadu - 600032.
              </p>
            </div>
            <div className="lg:w-1/2 px-6 mt-4 lg:mt-0 ">
              <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">
                EMAIL
              </h2>
              <a className=" leading-relaxed text-xs md:text-sm"> furniture.nooks@gmail.com</a>
              <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs mt-4">
                PHONE
              </h2>
              <p className="leading-relaxed text-xs md:text-sm">
                84899 11110 / 9442119121 / 9442115121
              </p>
            </div>
          </div>
        </div>
        <div className="lg:w-1/3 md:w-1/2 bg-white flex flex-col md:ml-auto w-full md:py-8 mt-8 md:mt-0">
          <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">
            Contact
          </h2>
          <p className="leading-relaxed mb-5 text-gray-600">
            Explore our collection at Nooks and find the piece that best suit
            you
          </p>
          <div className="relative mb-4">
            <label for="name" className="leading-7 text-sm text-gray-600">
              Company/Organization
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          <div className="relative mb-4">
            <label for="name" className="leading-7 text-sm text-gray-600">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          <div className="relative mb-4">
            <label for="email" className="leading-7 text-sm text-gray-600">
              Phone Number
            </label>
            <input
              type="number"
              id="email"
              name="phone"
              className="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          <div className="relative mb-4">
            <label for="email" className="leading-7 text-sm text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          <div className="relative mb-4">
            <label for="message" className="leading-7 text-sm text-gray-600">
              Description
            </label>
            <textarea
              id="message"
              name="message"
              className="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
            ></textarea>
          </div>
          <button className="text-white bg-gray-500 border-0 py-2 px-6 focus:outline-none hover:bg-gray-800 rounded text-lg">
            Button
          </button>
          <p className="text-xs text-gray-500 mt-3">
            Chicharrones blog helvetica normcore iceland tousled brook viral
            artisan.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
