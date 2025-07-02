// line 1
import React from 'react'; // line 2
import useEmblaCarousel from 'embla-carousel-react'; // line 3

const Carousel = () => { // line 4
  const [emblaRef] = useEmblaCarousel(); // line 5

  return ( // line 6
    <div className="overflow-hidden" ref={emblaRef}> {/* line 7 */}
      <div className="flex"> {/* line 8 */}
        <div className="min-w-full h-64 bg-red-400 flex items-center justify-center text-white text-2xl font-bold">Slide 1</div> {/* line 9 */}
        <div className="min-w-full h-64 bg-green-400 flex items-center justify-center text-white text-2xl font-bold">Slide 2</div> {/* line 10 */}
        <div className="min-w-full h-64 bg-blue-400 flex items-center justify-center text-white text-2xl font-bold">Slide 3</div> {/* line 11 */}
      </div> {/* line 12 */}
    </div> // line 13
  ); // line 14
}; // line 15

export default Carousel; // line 16
