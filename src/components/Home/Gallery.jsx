import React from 'react'

const Gallery = () => {
  return (
    <div>
      <div className="bg-black  h-full py-6 sm:py-8 lg:py-12">
    <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <div className="mb-4 flex items-center justify-between  sm:mb-8 md:mb-12">
            <div className="flex items-center gap-12">
                <h2 className="text-2xl font-bold text-gray-400 lg:text-3xl ">Our Products</h2>
            </div>

            <div className=" flex items-center justify-center ">
                <a className="isomorphic-link isomorphic-link--internal inline-flex items-center justify-center gap-2 rounded-xl  bg-gray-500 hover:bg-gray-800 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-150 "
                    href="/institutional">View More
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                            clip-rule="evenodd"></path>
                    </svg>
                </a>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 xl:gap-8">
            <a href="/Class-Room"
                className="group relative flex h-48 items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-80">
                <img src="https://img.freepik.com/free-photo/international-day-education-dark-style_23-2151013384.jpg?t=st=1719468459~exp=1719472059~hmac=5d9c0d2f3e887683e4aeb867fcf0952099b1cc8df1eab4524a5f8f887b1c75be&w=740" loading="lazy" alt="Photo by Minh Pham" className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />

                <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50">
                </div>

                <span className="relative ml-4 mb-3 inline-block text-sm text-white md:ml-5 md:text-lg underline">Classroom Furnitures</span>
            </a>
            <a href="/Hostel"
                className="group relative flex h-48 items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg md:col-span-2 md:h-80">
                <img src="https://img.freepik.com/free-vector/realistic-dark-supermarket-with-empty-shelves_107791-18624.jpg?t=st=1719469102~exp=1719472702~hmac=da8610d2c2099e6b592654d84251a126d1c383de36f66413c99de04b44141ec2&w=1380" loading="lazy" alt="Photo by Martin Sanchez" className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />

                <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50">
                </div>

                <span className="relative ml-4 mb-3 inline-block text-sm text-white md:ml-5 md:text-lg underline">Hostel Furniture</span>
            </a>
            <a href="/Cafeteria-&-Dining"
                className="group relative flex h-48 items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg md:col-span-2 md:h-80">
                <img src="https://firebasestorage.googleapis.com/v0/b/nooks-65355.appspot.com/o/institutional%2FC%26D.png?alt=media&token=09a0c6f5-17dd-4249-89f0-75b3b652e985" loading="lazy" alt="Photo by Magicle" className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />

                <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50">
                </div>

                <span className="relative ml-4 mb-3 inline-block text-sm text-white md:ml-5 md:text-lg underline">Cafeteria & Dining </span>
            </a>
           
            <a href="/Office"
                className="group relative flex h-48 items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-80">
                <img src="https://img.freepik.com/free-photo/office-chair-still-life_23-2151149124.jpg?t=st=1719469167~exp=1719472767~hmac=e707ee2abb5b748cfae42b418a08fd1d709872b68bc37a7249800b88bd3fbee7&w=900" loading="lazy" alt="Photo by Lorenzo Herrera" className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />

                <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50">
                </div>

                <span className="relative ml-4 mb-3 inline-block text-sm text-white md:ml-5 md:text-lg underline">Office Furnitures</span>
            </a>
        </div>
    </div>
</div>
    </div>
  )
}

export default Gallery