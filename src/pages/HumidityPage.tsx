import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { Link } from "react-router-dom";
import { useHumidity } from "../hooks/useSensors";
import { useSetHumidity } from "../hooks/useSettings";

type Widget = "bedroom";

type HumidityState = {
  [key in Widget]: {
    isOutputVisible: boolean;
    isFixedOutputVisible: boolean;
    currentHumidity: number;
    fixedHumidity: number;
  };
};

export default function HumidityPage() {
  const [humidity, setHumidity] = useState<HumidityState>({
    bedroom: { isOutputVisible: false, isFixedOutputVisible: true, currentHumidity: 0, fixedHumidity: 50 },
  });
  const [activeWidget, setActiveWidget] = useState<Widget>("bedroom");
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  const handleWidgetClick = (widget: Widget) => {
    setActiveWidget(widget);
    if (swiperInstance) {
      swiperInstance.slideTo(3); // Bedroom center, guest room left, living room right
    }
  };

  const mutateHumidityState = useSetHumidity();

  const { data: humidityData } = useHumidity();

  useEffect(() => {
    handleHumidityChange("bedroom", "currentHumidity", humidityData?.humidity || 0);
    handleHumidityChange("bedroom", "isOutputVisible", humidityData?.state === "on");
    handleHumidityChange("bedroom", "fixedHumidity", humidityData?.target || 0);
  }, [humidityData]);

  const handleHumidityChange = (widget: Widget, field: keyof HumidityState[Widget], value: any) => {
    setHumidity((prev) => ({
      ...prev,
      [widget]: {
        ...prev[widget],
        [field]: value,
      },
    }));

    if (field === "isOutputVisible" && value === true) {
      updateRandomValues(widget);
    }
  };

  const adjustFixedHumidity = (widget: Widget, increment: boolean) => {
    setHumidity((prev) => ({
      ...prev,
      [widget]: {
        ...prev[widget],
        fixedHumidity: Math.min(99, Math.max(0, prev[widget].fixedHumidity + (increment ? 1 : -1))),
      },
    }));

    mutateHumidityState.mutate({ target: humidity.bedroom.fixedHumidity, state: "on" });
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
      if (humidity[widget].isOutputVisible) {
        setHumidity((prev) => ({
          ...prev,
          [widget]: {
            ...prev[widget],
            currentHumidity: Math.floor(Math.random() * 100),
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
            {/* Toggle button for output visibility */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                const newIsOutputVisible = !humidity[widget].isOutputVisible;
                handleHumidityChange(widget, "isOutputVisible", newIsOutputVisible);
              }}
              className="absolute rounded-full transition-all duration-450 cursor-pointer"
              style={{
                right: "25px",
                bottom: "380px",
                width: "40px",
                height: "24px",
                backgroundColor: humidity[widget].isOutputVisible ? "#AB7743" : "#57493C",
              }}
            >
              <div
                className="absolute rounded-full bg-white transition-all duration-300"
                style={{
                  width: "20px",
                  height: "20px",
                  left: humidity[widget].isOutputVisible ? "17px" : "3px",
                  top: "2px",
                }}
              />
            </button>

            {/* Independent toggle button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                const newIsFixedOutputVisible = !humidity[widget].isFixedOutputVisible;
                handleHumidityChange(widget, "isFixedOutputVisible", newIsFixedOutputVisible);
              }}
              className="absolute rounded-full transition-all duration-450 cursor-pointer"
              style={{
                right: "50px",
                bottom: "51px",
                width: "40px",
                height: "24px",
                backgroundColor: humidity[widget].isFixedOutputVisible ? "#AB7743" : "#57493C",
              }}
            >
              <div
                className="absolute rounded-full bg-white transition-all duration-300"
                style={{
                  width: "20px",
                  height: "20px",
                  left: humidity[widget].isFixedOutputVisible ? "17px" : "3px",
                  top: "2px",
                }}
              />
            </button>

            {/* Toggleable output */}
            {humidity[widget].isOutputVisible && (
              <span
                className={`absolute bg-transparent text-center transition-opacity duration-300`}
                style={{
                  left: "142px",
                  top: "265px",
                  transform: "translate(-50%, -50%)",
                  width: "80px",
                  fontSize: "25px",
                  color: "#604A3E",
                  opacity: 1,
                }}
              >
                {humidity[widget].currentHumidity}
              </span>
            )}

            {humidity[widget].isFixedOutputVisible && (
              <>
                {/* Minus button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    adjustFixedHumidity(widget, false);
                  }}
                  className="absolute cursor-pointer"
                  style={{ right: "215px", bottom: "50px", filter: "brightness(0.1)" }}
                >
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/minus-FmWdmc1W0sqJyayOrYea7NQ79488FO.png"
                    alt="minus"
                    width={20}
                    height={20}
                  />
                </button>

                {/* Fixed humidity output */}
                <span
                  className={`absolute bg-transparent text-center`}
                  style={{
                    right: "159px",
                    bottom: "43px",
                    width: "40px",
                    fontSize: "25px",
                    color: "#604A3E",
                  }}
                >
                  {humidity[widget].fixedHumidity}
                </span>

                {/* Plus button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    adjustFixedHumidity(widget, true);
                  }}
                  className="absolute cursor-pointer"
                  style={{ right: "120px", bottom: "50px", filter: "brightness(0.5)" }}
                >
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/plus-w6J1Y11mYszUKvF1Hy7cfxH9c7JlNc.png"
                    alt="plus"
                    width={20}
                    height={20}
                  />
                </button>
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
          ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bedroom_big-YIVZWSTBWfjU2VH5KBNdcCGMRHXm2Y.png"
          : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bedroom_small-H2v5dD4iK06hRVdnfvxNgu3f9XQXOm.png";
      // case "living_room":
      //   return isActive
      //     ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/living_room_big-GNCKJp3suOdoNToFldMEKueTCJ4Pui.png"
      //     : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/living_room_small-nauPBDC1abCTEqk9uDP83ejCqMM4Kv.png";
      // case "guest_room":
      //   return isActive
      //     ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/guest_room_big-YhS9tduoOlEyu8X6T4e56w2WlALdAJ.png"
      //     : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/guest_room_small-eCMKGzzGmHLM2HZzOyeXTSv6gmeOPC.png";
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
          Где настроить влажность?
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
            <SwiperSlide>{renderWidget("bedroom")}</SwiperSlide>
            <SwiperSlide>{renderPlaceholderWidget()}</SwiperSlide>
            <SwiperSlide>{renderPlaceholderWidget()}</SwiperSlide>
          </Swiper>
        </div>
      </div>
    </main>
  );
}
