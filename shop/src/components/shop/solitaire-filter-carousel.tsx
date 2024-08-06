import React, { useState } from 'react'
import { useKeenSlider } from 'keen-slider/react'
import "keen-slider/keen-slider.min.css"

function SolitaireFilterCarousel() {

    const [currentSlide, setCurrentSlide] = useState(0)
	const [loaded, setLoaded] = useState(false)
	const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
		initial: 0,
		slideChanged(slider) {
		  setCurrentSlide(slider.track.details.rel)
		},
		created() {
		  setLoaded(true)
		},
		loop: true,	
	  },
	  [
		(slider) => {
		  let timeout: ReturnType<typeof setTimeout>
		  let mouseOver = false
		  function clearNextTimeout() { clearTimeout(timeout) }
		  function nextTimeout() {
			clearTimeout(timeout)
			if (mouseOver) return
			timeout = setTimeout(() => {
			  slider.next()
			}, 2000)
		  }
		  slider.on("created", () => {
			slider.container.addEventListener("mouseover", () => {
			  mouseOver = true
			  clearNextTimeout()
			})
			slider.container.addEventListener("mouseout", () => {
			  mouseOver = false
			  nextTimeout()
			})
			nextTimeout()
		  })
		  slider.on("dragStarted", clearNextTimeout)
		  slider.on("animationEnded", nextTimeout)
		  slider.on("updated", nextTimeout)
		},
	  ]
	)
  return (
    <div className="navigation-wrapper relative">
        <style>
            {`
                .dots { display: flex; padding: 10px 0; justify-content: center; }
                .dot { border: none; width: 10px; height: 10px; background: #24182e2e; border-radius: 50%; margin: 0 5px; padding: 5px; cursor: pointer; }
                .dot:focus { outline: none; }
                .dot.active { background: #24182eb3; }
            `}
        </style>
        <div ref={sliderRef} className="keen-slider">
            <div className="keen-slider__slide number-slide1"><img className="object-cover h-[300px] w-full" src="https://images.wallpaperscraft.com/image/single/ring_diamond_jewelry_113693_1920x1080.jpg" alt="" /></div>
            <div className="keen-slider__slide number-slide2"><img className="object-cover h-[300px] w-full" src="https://r4.wallpaperflare.com/wallpaper/870/702/430/macro-simple-background-diamonds-jewels-wallpaper-50908589aff60e73484ff756abe6e428.jpg" alt="" /></div>
            <div className="keen-slider__slide number-slide3"><img className="object-cover h-[300px] w-full" src="https://c1.wallpaperflare.com/path/386/546/528/jewelry-engagement-wedding-jewelry-band-romance-luxury-f27735fb4ec80b4e2a9ffa95c68ac307.jpg" alt="" /></div>
            <div className="keen-slider__slide number-slide4"><img className="object-cover h-[300px] w-full" src="https://r4.wallpaperflare.com/wallpaper/137/713/93/engagement-diamond-ring-silver-and-white-diamond-embellished-black-gemstone-wedding-ring-wallpaper-727162401d36ce0bca1872e550d83982.jpg" alt="" /></div>
            <div className="keen-slider__slide number-slide5"><img className="object-cover h-[300px] w-full" src="https://r4.wallpaperflare.com/wallpaper/914/606/493/ring-gold-diamond-visa-wallpaper-27df2a8123e4654c4198a3b04c12109a.jpg" alt="" /></div>
        </div>
        {loaded && instanceRef.current && (
            <div className="dots">
                {[ ...Array(instanceRef.current.track.details.slides.length).keys(), ].map((idx) => {
                    return (
                        <button key={idx} onClick={() => { instanceRef.current?.moveToIdx(idx) }} className={"dot" + (currentSlide === idx ? " active" : "" )} ></button>
                    )
                })}
            </div>
        )}
        
    </div>
  )
}

export default SolitaireFilterCarousel;