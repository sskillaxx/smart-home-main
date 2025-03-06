import { useEffect, useRef } from "react";
import SimplePeer from "simple-peer";

const WebRTCVideo = () => {
  const videoRef = useRef(null);
  const peerRef = useRef(null); // Ссылка для хранения peer

  useEffect(() => {
    const startPeer = async () => {
      const peer = new SimplePeer({
        initiator: true,
        trickle: false,
        offerOptions: { offerToReceiveVideo: true },
      });

      peerRef.current = peer; // Сохраняем ссылку

      peer.on("signal", async (data) => {
        try {
          const response = await fetch("http://localhost:8080/offer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          const answer = await response.json();
          peer.signal(answer);
        } catch (err) {
          console.error("Ошибка при обмене SDP:", err);
        }
      });

      peer.on("stream", (stream) => {
        console.log("Поток получен:", stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch((err) => console.error("Ошибка воспроизведения:", err));
        }
      });

      peer.on("error", (err) => {
        console.error("Ошибка WebRTC:", err);
      });
    };

    startPeer();

    // Очистка при размонтировании компонента
    return () => {
      if (peerRef.current) {
        peerRef.current.destroy();
        peerRef.current = null;
      }
    };
  }, []);

  // Обработчик закрытия вкладки/окна
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", maxWidth: "600px" }} />
    </div>
  );
};

export default WebRTCVideo;
