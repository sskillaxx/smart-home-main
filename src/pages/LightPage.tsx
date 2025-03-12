import { ArrowLeft } from "lucide-react";
import type React from "react";
import { useState, useRef, useCallback, useEffect } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useDebouncedMutation } from "../hooks/useDebounce";
import { useLight } from "../hooks/useSensors";
import { useSetLight } from "../hooks/useSettings";
import { Link } from "react-router-dom";

type Widget = "bedroom";

type LightState = {
  [key in Widget]: {
    isOn: boolean;
    isAutoMode: boolean; // Новое состояние
    autoDuration: number;
  };
};

export default function LightPage() {
  const [light, setLight] = useState<LightState>({
    bedroom: { isOn: false, isAutoMode: false, autoDuration: 0 },
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

  const { data: lightData } = useLight();
  const mutateLightState = useSetLight();

  const debouncedMutation = useDebouncedMutation(mutateLightState);

  useEffect(() => {
    setLight({
      bedroom: {
        isOn: lightData?.state === "on",
        autoDuration: lightData?.duration,
        isAutoMode: lightData?.mode === "auto",
      },
    });
  }, [lightData]);

  const handleLightToggle = (widget: Widget) => {
    setLight((prev) => ({
      ...prev,
      [widget]: {
        ...prev[widget],
        isOn: !prev[widget].isOn,
      },
    }));

    mutateLightState.mutate({ state: light.bedroom.isOn ? "on" : "false" });
  };

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

    const handleAutoModeToggle = (checked: boolean) => {
      setLight((prev) => ({
        ...prev,
        [widget]: {
          ...prev[widget],
          isAutoMode: checked,
        },
      }));

      mutateLightState.mutate({ state: "on", mode: checked ? "auto" : "manual" });
    };

    const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value) || 0;
      setLight((prev) => ({
        ...prev,
        [widget]: {
          ...prev[widget],
          autoDuration: value * 1000,
        },
      }));

      debouncedMutation({ state: "on", mode: "auto", duration: value * 1000 });
    };

    return (
      <div className="rounded-[30px]" style={widgetStyle} onClick={() => handleWidgetClick(widget)}>
        {isActive && (
          <>
            {/* Переключатель режима */}
            <div
              className="absolute"
              style={{
                width: "70%",
                right: "25px",
                top: "250px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#70594a",
                }}
              >
                Автоматический <br /> режим
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAutoModeToggle(!light.bedroom.isAutoMode);
                }}
                className="rounded-full transition-all duration-450 cursor-pointer"
                style={{
                  position: "relative",
                  width: 40,
                  height: "24px",
                  backgroundColor: light[widget].isAutoMode ? "#AB7743" : "#57493C",
                }}
              >
                <div
                  className="absolute rounded-full bg-white transition-all duration-300"
                  style={{
                    width: "20px",
                    height: "20px",
                    left: light[widget].isAutoMode ? "17px" : "3px",
                    top: "2px",
                  }}
                />
              </button>
            </div>

            {/* Поле ввода времени */}
            {light[widget].isAutoMode && (
              <div
                className="absolute flex items-center space-x-2"
                style={{
                  bottom: 50,
                  left: 60,
                }}
              >
                <span
                  className="text-white text-xs"
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    color: "#70594a",
                  }}
                >
                  Время (сек):
                </span>
                <input
                  type="number"
                  min="1"
                  max="300"
                  value={light[widget].autoDuration / 1000 || ""}
                  onChange={handleDurationChange}
                  className="bg-gray-800 text-white rounded px-1 w-16"
                  style={{
                    backgroundColor: "#c7ac90",
                    color: "#70594a",
                    fontSize: 16,
                    fontWeight: 600,
                    border: 0,
                    outline: 0,
                    textAlign: "center",
                  }}
                />
              </div>
            )}

            {/* Кнопка включения/выключения */}
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
          </>
        )}
      </div>
    );
  };

  const getWidgetImage = (widget: Widget, isActive: boolean) => {
    if (!isActive) {
      switch (widget) {
        // case "kitchen":
        //   return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kitchen_small-KLJUewkpZXsAHdxkulEJjzU2Kefmot.png";
        case "bedroom":
          return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bedroom_small-gEUawHrNAt6eryvpnn0WUCL8XIUT0J.png";
        // case "bathroom":
        //   return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bath_small-gU55AXr0wOwqNxnXhbGdQ7GCqu9xDm.png";
        // case "living_room":
        //   return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/living_room_small-JHOksloSYaNEya2YV4wajEeyUNCLFC.png";
        // case "guest_room":
        //   return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/guest_room_small-Q6KfReEU6tb99hZruGkkRDPNAJch6g.png";
        // case "terrace":
        //   return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/terrace_small-orMXtxxiwr3ZE5P4elTUvDvDGi1BGb.png";
        // case "laundry":
        //   return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/laundry_small-OKXIbfXAHBmmjDljPbnFtHPiyhAzIz.png";
        // case "balcony":
        //   return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/balcon_small-a5hRorPMOBFWxpcBbetOtPkvSaaa5w.png";
      }
    }

    switch (widget) {
      // case "laundry":
      //   return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/laundry_big-Yq44eP2PAzhzry9W5tOJ2LJdYqnwjE.png";
      // case "guest_room":
      //   return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/guest_room_big-FsHOENl4eB7gkeqWyNqNWfryyhOVou.png";
      // case "bathroom":
      //   return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bathroom_big-syUKzxXSjcxiWwSTtTLi2K5r8CNv7c.png";
      // case "living_room":
      //   return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/living_room_big-NGSP4CVOdGQb887UibvuqBX2gBKSbF.png";
      case "bedroom":
        return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bedroom_big-Mee8lvfps61RFfPv0pgAH6Y4HnuNnh.png";
      // case "kitchen":
      //   return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kitchen_big-xfUgwWjg2HXXoXcqU6ZOxzx2r4hDav.png";
      // case "terrace":
      //   return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/terrace_big-3htZoEXbTbEg9PyIAB9ce3hZmDLP1M.png";
      // case "balcony":
      //   return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/balcon_big-qO8MTTAOWcAqkjZwU3YAB1Ctp7GWA3.png";
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
            <SwiperSlide>{renderWidget("bedroom")}</SwiperSlide>
            {/* <SwiperSlide>{renderWidget("guest_room")}</SwiperSlide> */}
            {/* <SwiperSlide>{renderWidget("living_room")}</SwiperSlide> */}
            {/* <SwiperSlide>{renderWidget("bathroom")}</SwiperSlide> */}
            {/* <SwiperSlide>{renderWidget("terrace")}</SwiperSlide> */}
            {/* <SwiperSlide>{renderWidget("kitchen")}</SwiperSlide> */}
            {/* <SwiperSlide>{renderWidget("balcony")}</SwiperSlide> */}
            {/* <SwiperSlide>{renderWidget("laundry")}</SwiperSlide> */}
          </Swiper>
        </div>
      </div>
    </main>
  );
}
