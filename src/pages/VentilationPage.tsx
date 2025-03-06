import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { Link } from "react-router-dom";
import { useHumidity, useVentilation } from "../hooks/useSensors";

type Widget = "guest_room";

type VentilationState = {
  [key in Widget]: {
    isOn: boolean;
    co2: number;
    humidity: number;
  };
};

export default function VentilationPage() {
  const [ventilation, setVentilation] = useState<VentilationState>({
    guest_room: { isOn: false, co2: 0, humidity: 0 },
  });
  const [activeWidget, setActiveWidget] = useState<Widget>("guest_room");
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  const handleWidgetClick = (widget: Widget) => {
    setActiveWidget(widget);
    if (swiperInstance) {
      if (widget === "guest_room") {
        swiperInstance.slideTo(2); // Guest room center, bedroom right, plus left
      } else if (widget === "living_room") {
        swiperInstance.slideTo(4); // Living room center, bedroom left, plus right
      } else {
        swiperInstance.slideTo(3); // Bedroom center, guest room left, living room right
      }
    }
  };

  const { data: humidityData } = useHumidity();
  const { data: ventilationData } = useVentilation();

  useEffect(() => {
    if (ventilationData && humidityData) {
      setVentilation({
        guest_room: {
          co2: ventilationData.co2 || 0,
          humidity: humidityData.humidity || 0,
          isOn: ventilationData.state === "on",
        },
      });
    }
  }, [ventilationData, humidityData]);

  const handleVentilationChange = (widget: Widget, field: keyof VentilationState[Widget], value: any) => {
    setVentilation((prev) => ({
      ...prev,
      [widget]: {
        ...prev[widget],
        [field]: value,
      },
    }));

    if (field === "isOn" && value === true) {
      updateRandomValues(widget);
    }
  };

  const renderPlaceholderWidget = () => (
    <div
      className="rounded-[30px] flex items-center justify-center"
      style={{
        width: "184px",
        height: "293px",
        backgroundImage: `url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/add_new-J5HyLJKMu1LO8lgU1rPfJGVnDdpeJb.png)`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    />
  );

  const updateRandomValues = (widget: Widget) => {
    let intervalId: NodeJS.Timeout | null = null;

    intervalId = setInterval(() => {
      if (ventilation[widget].isOn) {
        setVentilation((prev) => ({
          ...prev,
          [widget]: {
            ...prev[widget],
            co2: Math.floor(Math.random() * 1000),
            humidity: Math.floor(Math.random() * 100),
          },
        }));
      } else {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      }
    }, 2000); // Update every 2 seconds

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
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

    return (
      <div className="rounded-[30px]" style={widgetStyle} onClick={() => handleWidgetClick(widget)}>
        {isActive && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const newIsOn = !ventilation[widget].isOn;
                handleVentilationChange(widget, "isOn", newIsOn);
                if (newIsOn) {
                  updateRandomValues(widget);
                }
              }}
              className="absolute rounded-full transition-all duration-450 cursor-pointer"
              style={{
                right: "50px",
                bottom: "195px",
                width: "40px",
                height: "24px",
                backgroundColor: ventilation[widget].isOn ? "#AB7743" : "#57493C",
              }}
            >
              <div
                className="absolute rounded-full bg-white transition-all duration-300"
                style={{
                  width: "20px",
                  height: "20px",
                  left: ventilation[widget].isOn ? "17px" : "3px",
                  top: "2px",
                }}
              />
            </button>
            {ventilation[widget].isOn && (
              <>
                <span
                  className={`absolute bg-transparent text-center transition-opacity duration-300`}
                  style={{
                    left: "39.5px",
                    bottom: "47px",
                    width: "80px",
                    fontSize: "25px",
                    color: "#604A3E",
                    opacity: 1,
                  }}
                >
                  {ventilation[widget].co2 || "0"}
                </span>
                <span
                  className={`absolute bg-transparent text-center transition-opacity duration-300`}
                  style={{
                    right: "38px",
                    bottom: "47px",
                    width: "80px",
                    fontSize: "25px",
                    color: "#604A3E",
                    opacity: 1,
                  }}
                >
                  {ventilation[widget].humidity || "0"}
                </span>
              </>
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
          ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bedroom_big-RndF2MMQ5qWpLFlJotX8vBLX3zdnUL.png"
          : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bedroom_small-H2v5dD4iK06hRVdnfvxNgu3f9XQXOm.png";
      case "living_room":
        return isActive
          ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/living_room_big-xEIOYVFK1qx3XPld1qeLRaNKidVC1m.png"
          : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/living_room_small-nauPBDC1abCTEqk9uDP83ejCqMM4Kv.png";
      case "guest_room":
        return isActive
          ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/guest_room_big-0IhR5I1zott30skZ86VPpGyriIlSFd.png"
          : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/guest_room_small-eCMKGzzGmHLM2HZzOyeXTSv6gmeOPC.png";
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
          Где настроить вентиляцию?
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
            <SwiperSlide>{renderPlaceholderWidget()}</SwiperSlide>
            <SwiperSlide>{renderPlaceholderWidget()}</SwiperSlide>
            <SwiperSlide>{renderWidget("guest_room")}</SwiperSlide>
            <SwiperSlide>{renderPlaceholderWidget()}</SwiperSlide>
            <SwiperSlide>{renderPlaceholderWidget()}</SwiperSlide>
          </Swiper>
        </div>
      </div>
    </main>
  );
}
