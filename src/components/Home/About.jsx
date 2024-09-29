import { FaIndustry, FaClock, FaWarehouse, FaUsers } from 'react-icons/fa';

const About = () => {
  const stats = [
    {
      data: "1985",
      title: "Established",
      icon: <FaIndustry className="text-white text-3xl" />,
    },
    {
      data: "30+",
      title: "Years of Experience",
      icon: <FaClock className="text-white text-3xl" />,
    },
    {
      data: "30,000 sq ft",
      title: "Factory Space",
      icon: <FaWarehouse className="text-white text-3xl" />,
    },
    {
      data: "100+",
      title: "Employees",
      icon: <FaUsers className="text-white text-3xl" />,
    },
  ];

  return (
    <section className="py-28 bg-black  relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url(/path-to-background-image.jpg)" }}
      ></div>
      <div className="relative max-w-screen-xl mx-auto px-4 md:px-8">
      <div className="max-w-4xl mx-auto text-center mb-12">
  <h3 className="text-gray-400 text-4xl font-semibold sm:text-4xl">
    About Us
  </h3>
  <p className="mt-3 text-lg text-gray-300 max-w-5xl mx-auto text-justify">
    Established in 1985, we have over 30 years of manufacturing experience. Our in-house
    facility spans 30,000 Square Feet and employs over 100 workers, equipped with
    state-of-the-art machinery to ensure product quality and timely delivery. We provide
    comprehensive furniture solutions to Institutions and Offices. In a competitive market, our
    focus on quality sets us apart.
  </p>
</div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item, idx) => (
            <div
              key={idx}
              className="relative flex flex-col items-center justify-center bg-gray-950 p-8 rounded-lg shadow-lg transform transition-transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-gray-600 to-transparent opacity-50 rounded-lg"></div>
              <div className="relative z-10">
                <div className="gap-4 flex items-center ">
                  {item.icon}
                  <h4 className=" text-2xl text-white font-semibold">
                    {item.data}
                  </h4>
                </div>
                <p className="mt-5  text-center text-gray-400 font-medium">
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;