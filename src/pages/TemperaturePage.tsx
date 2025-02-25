import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { Link } from "react-router-dom";

type Widget = "bedroom" | "living_room" | "bathroom" | "terrace" | "kitchen" | "balcony" | "laundry" | "guest_room";

const widgetOrder: Widget[] = [
  "bedroom",
  "living_room",
  "bathroom",
  "terrace",
  "kitchen",
  "balcony",
  "laundry",
  "guest_room",
];

type TemperatureState = {
  [key in Widget]: {
    temp1: string;
    temp2?: string;
  };
};

export default function TemperaturePage() {
  const [isOn, setIsOn] = useState(true);
  const [temperatures, setTemperatures] = useState<TemperatureState>({
    bedroom: { temp1: "22" },
    living_room: { temp1: "22" },
    bathroom: { temp1: "22", temp2: "22" },
    terrace: { temp1: "22", temp2: "22" },
    kitchen: { temp1: "22" },
    balcony: { temp1: "22" },
    laundry: { temp1: "22" },
    guest_room: { temp1: "22" },
  });
  const [activeWidget, setActiveWidget] = useState<Widget>("bedroom");
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  const getAdjacentWidgets = (widget: Widget) => {
    const currentIndex = widgetOrder.indexOf(widget);
    const leftIndex = (currentIndex - 1 + widgetOrder.length) % widgetOrder.length;
    const rightIndex = (currentIndex + 1) % widgetOrder.length;
    return {
      left: widgetOrder[leftIndex],
      right: widgetOrder[rightIndex],
    };
  };

  const handleWidgetClick = (widget: Widget) => {
    setActiveWidget(widget);
    if (swiperInstance) {
      const newIndex = widgetOrder.indexOf(widget);
      swiperInstance.slideTo(newIndex + 1);
    }
  };

  const handleTemperatureChange = (widget: Widget, tempKey: "temp1" | "temp2", value: string) => {
    setTemperatures((prev) => ({
      ...prev,
      [widget]: {
        ...prev[widget],
        [tempKey]: value,
      },
    }));
  };

  const renderWidget = (widget: Widget) => {
    const isActive = widget === activeWidget;
    const { left, right } = getAdjacentWidgets(activeWidget);
    const isVisible = widget === activeWidget || widget === left || widget === right;
    const hasTwoInputs = widget === "bathroom" || widget === "terrace";

    if (!isVisible) return null;

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
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOn(!isOn);
          }}
          className="absolute rounded-full transition-all duration-450 cursor-pointer"
          style={{
            right: isActive ? "15px" : "10px",
            top: isActive ? "15px" : "10px",
            width: isActive ? "40px" : "30px",
            height: isActive ? "24px" : "18px",
            backgroundColor: isOn ? "#AB7743" : "#57493C",
            opacity: isActive ? 1 : 0,
            pointerEvents: isActive ? "auto" : "none",
          }}
        >
          <div
            className="absolute rounded-full bg-white transition-all duration-300"
            style={{
              width: isActive ? "20px" : "15px",
              height: isActive ? "20px" : "15px",
              left: isOn ? (isActive ? "17px" : "12px") : "3px",
              top: "2px",
            }}
          />
        </button>

        {isActive && (
          <>
            <input
              type="text"
              value={temperatures[widget].temp1}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                if (value.length <= 2) {
                  handleTemperatureChange(widget, "temp1", value);
                }
              }}
              className={`absolute bg-transparent text-center text-white outline-none`}
              style={{
                left: "-13px",
                bottom: "140px",
                fontSize: "25px",
                color: "#604A3E",
              }}
            />
            {hasTwoInputs && (
              <input
                type="text"
                value={temperatures[widget].temp2}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  if (value.length <= 2) {
                    handleTemperatureChange(widget, "temp2", value);
                  }
                }}
                className={`absolute bg-transparent text-center text-white outline-none`}
                style={{
                  left: "-13px",
                  bottom: "93px",
                  fontSize: "25px",
                  color: "#604A3E",
                }}
              />
            )}
          </>
        )}
      </div>
    );
  };

  const getWidgetImage = (widget: Widget, isActive: boolean) => {
    switch (widget) {
      case "bedroom":
        return isActive
          ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bedroom_big_no_button-UmxhbciusCLkk2o2FcPY9pMrIuBwSU.png"
          : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bedroom_small-txnrJx7VOv97IFkg7ev59UVVBX5yVp.png";
      case "living_room":
        return isActive
          ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/living_room_big_no_button-MpurZNnE4dgBy1JZTxNRwk9IYub7YD.png"
          : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/living_room_small-JVyzGM5KURACYvQeE94vKZQuBw2CBD.png";
      case "bathroom":
        return isActive
          ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bathroom_big_no_button-kZbxlRKBpmNksIa4A3vhjqvN6dmips.png"
          : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bath_small-tm8L7COTZBbrd3pn7YeZ7PHtItouxG.png";
      case "terrace":
        return isActive
          ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/terrace_big_no_button-IF8jrIOvDAC0sua6cJ7rAtlzWYE2IE.png"
          : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/terrace_small-ClbGK7zdZZEVQQPyMW3yBmO6lOp2VF.png";
      case "kitchen":
        return isActive
          ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kitchen_big_no_button-Zu6ScmcEChkVkz6yzwYFsGZrAoWOb6.png"
          : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kitchen_small-PVcA8Dh1BvlWyW2BckJXgHrr1LOF9X.png";
      case "balcony":
        return isActive
          ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/balcon_big_no_button-w6Y5EoerdPICzlxbHWLymeGn4LVs46.png"
          : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/balcon_small-TyovYrmcI0YXDz8fWlCJfSOCY15nc2.png";
      case "laundry":
        return isActive
          ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/laundry_big_no_button-dMAsDUfzSY3FXRD9b4jqSZyk75mz0c.png"
          : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/laundry_small-83Ya7zx5D0AnCP2fmuhKGErLZ03AKH.png";
      case "guest_room":
        return isActive
          ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/guest_room_big_no_button-R4fQLH9p5R4pkrDMsPuBbr68U0VX1s.png"
          : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/guest_room_small-PLiZlkcuvQ36eQ97WYnQukEFZxcFKD.png";
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
          Где хотите изменить температуру?
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
            initialSlide={1}
            loop={true}
            onSwiper={(swiper) => setSwiperInstance(swiper)}
          >
            {widgetOrder.map((widget) => (
              <SwiperSlide key={widget}>{renderWidget(widget)}</SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </main>
  );
}
