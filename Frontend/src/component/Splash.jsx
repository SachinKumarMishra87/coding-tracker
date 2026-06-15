import { useEffect, useState, useRef } from "react";

export default function Splash() {
    const [isVisible, setIsVisible] = useState(true);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let animationFrameId;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = 20;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.2;
                this.speedY = (Math.random() - 0.5) * 0.2;
                this.alpha = Math.random() * 0.3 + 0.1;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }
            draw() {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = "#00f2fe";
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                p.update();
                p.draw();
            });
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        const handleResize = () => {
            if (canvas) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
        };
        window.addEventListener("resize", handleResize);

        const fadeTimeout = setTimeout(() => setIsFadingOut(true), 3400);
        const removeTimeout = setTimeout(() => setIsVisible(false), 3800);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", handleResize);
            clearTimeout(fadeTimeout);
            clearTimeout(removeTimeout);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div
            style={{
                ...styles.splashWrapper,
                opacity: isFadingOut ? 0 : 1,
                transform: isFadingOut ? "scale(0.98) translateY(-6px)" : "scale(1) translateY(0)",
            }}
        >
            <canvas ref={canvasRef} style={styles.canvas} />
            <div style={styles.backlightAura}></div>

            <div style={styles.container}>
                {/* Perspective wrapper for 3D rotations */}
                <h1 style={styles.mainTitle} className="responsive-title">
                    {/* LEETPAT - First Group */}
                    <div style={styles.leftGroup}>
                        {/* LEET */}
                        <span style={{ ...styles.blockDrop, animationDelay: "0.10s" }} className="drop-block">L</span>
                        <span style={{ ...styles.blockDrop, animationDelay: "0.15s" }} className="drop-block">E</span>
                        <span style={{ ...styles.blockDrop, animationDelay: "0.20s" }} className="drop-block">E</span>
                        <span style={{ ...styles.blockDrop, animationDelay: "0.25s" }} className="drop-block">T</span>

                        {/* PAT */}
                        <span style={{ ...styles.blockDrop, animationDelay: "0.35s" }} className="drop-block">P</span>
                        <span style={{ ...styles.blockDrop, animationDelay: "0.40s" }} className="drop-block">A</span>
                        <span style={{ ...styles.blockDrop, animationDelay: "0.45s" }} className="drop-block">T</span>
                    </div>

                    {/* TRACKER - Second Group */}
                    <div style={styles.rightGroup} className="tracker-group">
                        <span style={{ ...styles.trackerBlock, animationDelay: "0.55s" }} className="drop-block-tracker">T</span>
                        <span style={{ ...styles.trackerBlock, animationDelay: "0.60s" }} className="drop-block-tracker">R</span>
                        <span style={{ ...styles.trackerBlock, animationDelay: "0.65s" }} className="drop-block-tracker">A</span>
                        <span style={{ ...styles.trackerBlock, animationDelay: "0.70s" }} className="drop-block-tracker">C</span>
                        <span style={{ ...styles.trackerBlock, animationDelay: "0.75s" }} className="drop-block-tracker">K</span>
                        <span style={{ ...styles.trackerBlock, animationDelay: "0.80s" }} className="drop-block-tracker">E</span>
                        <span style={{ ...styles.trackerBlock, animationDelay: "0.85s" }} className="drop-block-tracker">R</span>
                    </div>
                </h1>

                {/* Responsive Laser Loader */}
                <div style={styles.laserContainer} className="responsive-loader">
                    <div style={styles.laserBar}>
                        <div style={styles.laserTip}></div>
                    </div>
                </div>

                {/* Responsive Mantra Footer */}
                <div style={styles.mantraContainer} className="responsive-mantra">
                    <div style={{ ...styles.mantraItem, animationDelay: "1.3s" }} className="mantra-fade">
                        <span style={styles.iconStyle}>🎯</span> TRACK
                    </div>
                    <div style={{ ...styles.mantraItem, animationDelay: "1.7s" }} className="mantra-fade">
                        <span style={styles.iconStyle}>⚙️</span> PRACTICE
                    </div>
                    <div style={{ ...styles.mantraItem, animationDelay: "2.1s" }} className="mantra-fade">
                        <span style={styles.iconStyle}>👑</span> WIN
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    splashWrapper: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#060608",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 99999,
        overflow: "hidden",
        transition: "all 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
        fontFamily: "'Arial Black', 'Impact', 'Inter', system-ui, sans-serif",
        padding: "20px",
        boxSizing: "border-box",
        perspective: "1000px", // Enables 3D space depth for letters
    },
    canvas: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
    },
    backlightAura: {
        position: "absolute",
        width: "min(480px, 90vw)",
        height: "min(480px, 90vw)",
        background: "radial-gradient(circle, rgba(0, 242, 254, 0.07) 0%, transparent 65%)",
        zIndex: 2,
        pointerEvents: "none",
    },
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: 10,
        textAlign: "center",
        width: "100%",
    },
    mainTitle: {
        fontSize: "clamp(32px, 6vw, 56px)",
        fontWeight: "900",
        letterSpacing: "-0.02em",
        margin: "0 0 40px 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#f4f4f6",
    },
    leftGroup: {
        display: "flex",
        gap: "4px",
    },
    rightGroup: {
        display: "flex",
        gap: "4px",
        marginLeft: "14px",
    },
    blockDrop: {
        display: "inline-block",
        opacity: 0,
        transformStyle: "preserve-3d",
    },
    trackerBlock: {
        display: "inline-block",
        opacity: 0,
        transformStyle: "preserve-3d",
        background: "linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        filter: "drop-shadow(0 0 20px rgba(0, 242, 254, 0.3))",
    },
    laserContainer: {
        height: "3px",
        background: "rgba(255, 255, 255, 0.02)",
        borderRadius: "10px",
        position: "relative",
        marginBottom: "35px",
    },
    laserBar: {
        height: "100%",
        background: "linear-gradient(90deg, transparent, #00f2fe)",
        width: "100%",
        transformOrigin: "left",
        animation: "laserCharge 2.8s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        position: "relative",
    },
    laserTip: {
        position: "absolute",
        right: 0,
        top: "-3px",
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        background: "#ffffff",
        boxShadow: "0 0 12px 4px #00f2fe, 0 0 4px 1px #fff",
    },
    mantraContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "ui-monospace, SFMono-Regular, monospace",
    },
    mantraItem: {
        fontSize: "clamp(10px, 2vw, 12px)",
        fontWeight: "700",
        color: "#e4e4e7",
        letterSpacing: "0.1em",
        opacity: 0,
        display: "flex",
        alignItems: "center",
        gap: "6px",
        whiteSpace: "nowrap",
    },
    iconStyle: {
        fontSize: "14px",
    },
};

// CSS Injection with New Style Core Transitions
if (typeof document !== "undefined") {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
    /* New Style: 3D Kinetic Spin + Elastic Impact */
    @keyframes futuristic3DReveal {
      0% {
        opacity: 0;
        filter: blur(12px);
        transform: translateY(-80px) scale(0.4) rotateX(-90deg) rotateY(45deg);
      }
      50% {
        opacity: 0.8;
        filter: blur(3px);
      }
      80% {
        transform: translateY(4px) scale(1.05) rotateX(10deg) rotateY(-5deg);
        filter: blur(0px);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1) rotateX(0deg) rotateY(0deg);
        filter: blur(0px);
      }
    }
    
    .drop-block, .drop-block-tracker {
      animation: futuristic3DReveal 0.7s cubic-bezier(0.215, 0.610, 0.355, 1) forwards;
    }

    @keyframes laserCharge {
      0% { transform: scaleX(0); }
      100% { transform: scaleX(1); }
    }

    @keyframes mantraStepReveal {
      0% { opacity: 0; transform: scale(0.9) translateY(4px); filter: blur(2px); }
      100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
    }
    
    .mantra-fade {
      animation: mantraStepReveal 0.4s ease-out forwards;
    }

    /* --- RESPONSIVE BREAKPOINTS --- */
    @media (min-width: 769px) {
      .responsive-title { flex-direction: row; }
      .responsive-loader { width: 320px; }
      .responsive-mantra { flex-direction: row; gap: 24px; }
    }

    @media (max-width: 768px) {
      .responsive-title { 
        flex-direction: column; 
        gap: 6px; 
        line-height: 1.1;
      }
      .responsive-loader { width: 70%; max-width: 260px; }
      .responsive-mantra { flex-direction: row; gap: 16px; }
      .tracker-group { margin-left: 0 !important; }
    }

    @media (max-width: 480px) {
      .responsive-mantra { 
        flex-direction: column; 
        gap: 12px; 
        align-items: flex-start;
      }
      .responsive-title { margin-bottom: 30px; }
    }
  `;
    document.head.appendChild(styleSheet);
}