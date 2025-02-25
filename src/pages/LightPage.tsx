import type React from "react";

import { ArrowLeft } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { Link } from "react-router-dom";

type Widget = "bedroom" | "living_room" | "guest_room" | "bathroom" | "terrace" | "kitchen" | "balcony" | "laundry";

type LightState = {
  [key in Widget]: {
    isOn: boolean;
    brightness: number[];
  };
};

export default function LightPage() {
  const [light, setLight] = useState<LightState>({
    bedroom: { isOn: false, brightness: [50] },
    living_room: { isOn: false, brightness: [50] },
    guest_room: { isOn: false, brightness: [50] },
    bathroom: { isOn: false, brightness: [50, 50] },
    terrace: { isOn: false, brightness: [50, 50] },
    kitchen: { isOn: false, brightness: [50] },
    balcony: { isOn: false, brightness: [50] },
    laundry: { isOn: false, brightness: [50] },
  });
  const [activeWidget, setActiveWidget] = useState<Widget>("bedroom");
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  const handleWidgetClick = (widget: Widget) => {
    setActiveWidget(widget);
    if (swiperInstance) {
      const widgetOrder = [
        "living_room",
        "bathroom",
        "terrace",
        "kitchen",
        "balcony",
        "laundry",
        "guest_room",
        "bedroom",
      ];
      const currentIndex = widgetOrder.indexOf(widget);
      if (currentIndex !== -1) {
        swiperInstance.slideTo(currentIndex + 2);
      }
    }
  };

  const handleLightToggle = (widget: Widget) => {
    setLight((prev) => ({
      ...prev,
      [widget]: {
        ...prev[widget],
        isOn: !prev[widget].isOn,
      },
    }));
  };

  const handleBrightnessChange = (widget: Widget, index: number, value: number) => {
    setLight((prev) => ({
      ...prev,
      [widget]: {
        ...prev[widget],
        brightness: prev[widget].brightness.map((b, i) => (i === index ? value : b)),
      },
    }));
  };

  const VerticalSlider = ({
    value,
    onChange,
    className = "",
    style = {},
  }: {
    value: number;
    onChange: (value: number) => void;
    className?: string;
    style?: React.CSSProperties;
  }) => {
    const sliderRef = useRef<HTMLDivElement>(null);
    const isDraggingRef = useRef(false);

    const calculateValue = useCallback((clientY: number) => {
      if (sliderRef.current) {
        const rect = sliderRef.current.getBoundingClientRect();
        const y = Math.max(0, Math.min(1, (rect.bottom - clientY) / rect.height));
        return Math.round(y * 100);
      }
      return 0;
    }, []);

    const handleMouseDown = (e: React.MouseEvent) => {
      e.stopPropagation();
      isDraggingRef.current = true;
      onChange(calculateValue(e.clientY));

      const handleMouseMove = (e: MouseEvent) => {
        if (isDraggingRef.current) {
          requestAnimationFrame(() => {
            onChange(calculateValue(e.clientY));
          });
          e.preventDefault();
        }
      };

      const handleMouseUp = () => {
        isDraggingRef.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    return (
      <div
        ref={sliderRef}
        className={`absolute w-[69px] h-[135px] cursor-pointer ${className}`}
        style={style}
        onMouseDown={handleMouseDown}
        onClick={(e) => {
          e.stopPropagation();
          onChange(calculateValue(e.clientY));
        }}
      >
        <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: "12px" }}>
          <div className="absolute inset-0" style={{ backgroundColor: "#DEC6A6" }} />
          <div
            className="absolute left-0 right-0 bottom-0"
            style={{
              backgroundColor: "#7A6152",
              height: `${value}%`,
            }}
          />
        </div>
      </div>
    );
  };

  const renderWidget = (widget: Widget) => {
    const isActive = widget === activeWidget;
    const hasDoubleSlider = widget === "bathroom" || widget === "terrace";

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
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLightToggle(widget);
              }}
              className="absolute rounded-full transition-all duration-450 cursor-pointer"
              style={{
                right: "25px",
                top: "20px",
                width: "40px",
                height: "24px",
                backgroundColor: light[widget].isOn ? "#AB7743" : "#57493C",
              }}
            >
              <div
                className="absolute rounded-full bg-white transition-all duration-300"
                style={{
                  width: "20px",
                  height: "20px",
                  left: light[widget].isOn ? "17px" : "3px",
                  top: "2px",
                }}
              />
            </button>

            {hasDoubleSlider ? (
              <>
                <VerticalSlider
                  value={light[widget].brightness[0]}
                  onChange={(value) => handleBrightnessChange(widget, 0, value)}
                  style={{ left: "60px", bottom: "20px" }}
                />
                <VerticalSlider
                  value={light[widget].brightness[1]}
                  onChange={(value) => handleBrightnessChange(widget, 1, value)}
                  style={{ right: "58px", bottom: "20px" }}
                />
              </>
            ) : (
              <VerticalSlider
                value={light[widget].brightness[0]}
                onChange={(value) => handleBrightnessChange(widget, 0, value)}
                style={{ left: "105px", bottom: "35px" }}
              />
            )}
          </>
        )}
      </div>
    );
  };

  const getWidgetImage = (widget: Widget, isActive: boolean) => {
    if (!isActive) {
      switch (widget) {
        case "kitchen":
          return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kitchen_small-KLJUewkpZXsAHdxkulEJjzU2Kefmot.png";
        case "bedroom":
          return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bedroom_small-gEUawHrNAt6eryvpnn0WUCL8XIUT0J.png";
        case "bathroom":
          return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bath_small-gU55AXr0wOwqNxnXhbGdQ7GCqu9xDm.png";
        case "living_room":
          return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/living_room_small-JHOksloSYaNEya2YV4wajEeyUNCLFC.png";
        case "guest_room":
          return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/guest_room_small-Q6KfReEU6tb99hZruGkkRDPNAJch6g.png";
        case "terrace":
          return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/terrace_small-orMXtxxiwr3ZE5P4elTUvDvDGi1BGb.png";
        case "laundry":
          return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/laundry_small-OKXIbfXAHBmmjDljPbnFtHPiyhAzIz.png";
        case "balcony":
          return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/balcon_small-a5hRorPMOBFWxpcBbetOtPkvSaaa5w.png";
      }
    }

    switch (widget) {
      case "laundry":
        return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/laundry_big-Yq44eP2PAzhzry9W5tOJ2LJdYqnwjE.png";
      case "guest_room":
        return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/guest_room_big-FsHOENl4eB7gkeqWyNqNWfryyhOVou.png";
      case "bathroom":
        return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bathroom_big-syUKzxXSjcxiWwSTtTLi2K5r8CNv7c.png";
      case "living_room":
        return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/living_room_big-NGSP4CVOdGQb887UibvuqBX2gBKSbF.png";
      case "bedroom":
        return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bedroom_big-Mee8lvfps61RFfPv0pgAH6Y4HnuNnh.png";
      case "kitchen":
        return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kitchen_big-xfUgwWjg2HXXoXcqU6ZOxzx2r4hDav.png";
      case "terrace":
        return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/terrace_big-3htZoEXbTbEg9PyIAB9ce3hZmDLP1M.png";
      case "balcony":
        return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/balcon_big-qO8MTTAOWcAqkjZwU3YAB1Ctp7GWA3.png";
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
          Настроить свет
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
            initialSlide={3}
            loop={true}
            onSwiper={(swiper) => setSwiperInstance(swiper)}
          >
            <SwiperSlide>{renderWidget("guest_room")}</SwiperSlide>
            <SwiperSlide>{renderWidget("bedroom")}</SwiperSlide>
            <SwiperSlide>{renderWidget("living_room")}</SwiperSlide>
            <SwiperSlide>{renderWidget("bathroom")}</SwiperSlide>
            <SwiperSlide>{renderWidget("terrace")}</SwiperSlide>
            <SwiperSlide>{renderWidget("kitchen")}</SwiperSlide>
            <SwiperSlide>{renderWidget("balcony")}</SwiperSlide>
            <SwiperSlide>{renderWidget("laundry")}</SwiperSlide>
          </Swiper>
        </div>
      </div>
    </main>
  );
}
