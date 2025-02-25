import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { Link } from "react-router-dom";

type Widget = "living_room" | "guest_room" | "balcony" | "kitchen";

type TimeState = {
  [key in Widget]: {
    isOn: boolean;
    openTime: string;
    closeTime: string;
  };
};

export default function RollersPage() {
  const [times, setTimes] = useState<TimeState>({
    living_room: { isOn: false, openTime: "00:00", closeTime: "00:00" },
    guest_room: { isOn: false, openTime: "00:00", closeTime: "00:00" },
    balcony: { isOn: false, openTime: "00:00", closeTime: "00:00" },
    kitchen: { isOn: false, openTime: "00:00", closeTime: "00:00" },
  });
  const [activeWidget, setActiveWidget] = useState<Widget>("living_room");
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  const handleWidgetClick = (widget: Widget) => {
    setActiveWidget(widget);
    if (swiperInstance) {
      if (widget === "guest_room") {
        swiperInstance.slideTo(2);
      } else if (widget === "balcony") {
        swiperInstance.slideTo(4);
      } else if (widget === "kitchen") {
        swiperInstance.slideTo(5); // Kitchen center, balcony left, plus right
      } else {
        swiperInstance.slideTo(3);
      }
    }
  };

  const handleTimeChange = (widget: Widget, field: "openTime" | "closeTime", value: string) => {
    if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value) || value === "") {
      setTimes((prev) => ({
        ...prev,
        [widget]: {
          ...prev[widget],
          [field]: value,
        },
      }));
    }
  };

  const renderPlaceholderWidget = () => (
    <div
      className="rounded-[30px] flex items-center justify-center"
      style={{
        width: "184px",
        height: "293px",
        backgroundImage: `url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/add_new-kc5GkMYdI6D4IYq13s4zT0HprNgOHa.png)`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    />
  );

  const renderWidget = (widget: Widget) => {
    const isActive = widget === activeWidget;

    const widgetStyle = {
      width: isActive ? "276px" : "184px",
      height: isActive ? "439.5px" : "293px",
      backgroundColor: "rgba(180, 156, 130, 0.7)",
      backgroundImage: `url(${getWidgetImage(widget, isActive)})`,
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      transition: "all 0.3s ease-in-out",
      cursor: "pointer",
      position: "relative" as const,
    };

    return (
      <div className="rounded-[30px]" style={widgetStyle} onClick={() => handleWidgetClick(widget)}>
        {isActive && (
          <>
            {/* Toggle button at top */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setTimes((prev) => ({
                  ...prev,
                  [widget]: {
                    ...prev[widget],
                    isOn: !prev[widget].isOn,
                  },
                }));
              }}
              className="absolute rounded-full transition-all duration-450 cursor-pointer"
              style={{
                right: "25px",
                top: "20px",
                width: "40px",
                height: "24px",
                backgroundColor: times[widget].isOn ? "#AB7743" : "#57493C",
              }}
            >
              <div
                className="absolute rounded-full bg-white transition-all duration-300"
                style={{
                  width: "20px",
                  height: "20px",
                  left: times[widget].isOn ? "17px" : "3px",
                  top: "2px",
                }}
              />
            </button>

            {/* Open time input */}
            <input
              type="time"
              value={times[widget].openTime}
              onChange={(e) => handleTimeChange(widget, "openTime", e.target.value)}
              className="absolute bg-transparent text-[#604A3E]"
              style={{
                left: "156px",
                top: "287px",
                border: "none",
                outline: "none",
              }}
            />

            {/* Close time input */}
            <input
              type="time"
              value={times[widget].closeTime}
              onChange={(e) => handleTimeChange(widget, "closeTime", e.target.value)}
              className="absolute bg-transparent text-[#604A3E]"
              style={{
                left: "157px",
                top: "335px",
                border: "none",
                outline: "none",
              }}
            />
          </>
        )}
      </div>
    );
  };

  const getWidgetImage = (widget: Widget, isActive: boolean) => {
    if (!isActive) {
      switch (widget) {
        case "living_room":
          return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/living_room_small-4xyaEYMAQ9XshK1XRSNWLEjmkc6J7e.png";
        case "guest_room":
          return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/guest_room_small-WKADPKjxH2p6lfLwjlJ5q2QzgsmjZi.png";
        case "balcony":
          return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/balcon_small-Tiafzw9XhzV7cAC936wC4OlDpejVyk.png";
        case "kitchen":
          return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kitchen_small-wD43fSo1Y684jh8rrV9NBMYcVdcieH.png";
      }
    }

    switch (widget) {
      case "living_room":
        return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/living_room_big-zlQhGtNeBjZvn3ec3RXUltdqfkC1OC.png";
      case "guest_room":
        return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/guest_room_big-jFLz5cCMcnUEsZrNQ3s145DLe6m2Wn.png";
      case "balcony":
        return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/balcon_big-SIQzAxvEzd17neRgxMu8Tr23JjfoHj.png";
      case "kitchen":
        return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kitchen_big-6JcoYI4i91yPye2rrJqQRNAKX8T4TN.png";
    }
  };

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <div
        className="absolute h-full w-full"
        style={{
          backgroundImage:
            "url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/background-HYN69Bwx8xFFbArjPnAGFT63GPS6Xo.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Back Button */}
        <Link
          to={"/dashboard"}
          className="absolute flex items-center justify-center"
          style={{
            left: "105px",
            top: "54px",
            zIndex: 10,
            width: "78px",
            height: "70px",
            borderRadius: "30px",
            backgroundColor: "rgba(180, 156, 130, 0.9)",
          }}
        >
          <ArrowLeft size={32} className="text-black" />
        </Link>

        {/* Header */}
        <h1
          className={`absolute text-center w-full`}
          style={{
            left: "50%",
            top: "53px",
            transform: "translateX(-50%)",
            fontSize: "50px",
            fontWeight: 900,
            color: "#BB9B7C",
          }}
        >
          Настроить шторы
        </h1>

        {/* Widgets Container */}
        <div
          className="absolute"
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: "1120px",
            height: "350px",
          }}
        >
          <Swiper
            spaceBetween={50}
            slidesPerView={3}
            centeredSlides={true}
            allowTouchMove={false}
            initialSlide={2}
            loop={true}
            onSwiper={(swiper) => setSwiperInstance(swiper)}
          >
            <SwiperSlide>{renderPlaceholderWidget()}</SwiperSlide>
            <SwiperSlide>{renderPlaceholderWidget()}</SwiperSlide>
            <SwiperSlide>{renderWidget("guest_room")}</SwiperSlide>
            <SwiperSlide>{renderWidget("living_room")}</SwiperSlide>
            <SwiperSlide>{renderWidget("balcony")}</SwiperSlide>
            <SwiperSlide>{renderWidget("kitchen")}</SwiperSlide>
            <SwiperSlide>{renderPlaceholderWidget()}</SwiperSlide>
          </Swiper>
        </div>
      </div>
    </main>
  );
}
