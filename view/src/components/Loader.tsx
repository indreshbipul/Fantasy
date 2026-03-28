const Spinner = ({ color = '#000000', size = 9 }) => {
  const bars = [
    { delay: 0.1, rotation: 36 },
    { delay: 0.2, rotation: 72 },
    { delay: 0.3, rotation: 108 },
    { delay: 0.4, rotation: 144 },
    { delay: 0.5, rotation: 180 },
    { delay: 0.6, rotation: 216 },
    { delay: 0.7, rotation: 252 },
    { delay: 0.8, rotation: 288 },
    { delay: 0.9, rotation: 324 },
    { delay: 1.0, rotation: 360 },
  ];

  return (
    <div className="absolute left-1/2 top-1/2 flex items-center justify-center " style={{ width: `${size}px`, height: `${size}px` }}>
      {/* Injecting the custom keyframes for the pulse effect */}
      <style>
        {`
          @keyframes spinner-fzua35 {
            0%, 10%, 20%, 30%, 50%, 60%, 70%, 80%, 90%, 100% {
              transform: rotate(calc(var(--rotation) * 1deg)) translate(0, calc(var(--translation) * 1%));
            }
            50% {
              transform: rotate(calc(var(--rotation) * 1deg)) translate(0, calc(var(--translation) * 1.5%));
            }
          }
        `}
      </style>
      
      <div className="relative w-full h-full">
        {bars.map((bar, index) => (
          <div
            key={index}
            className="absolute left-1/4 w-[50%] h-[150%]"
            style={{
              backgroundColor: color,
              '--delay': bar.delay,
              '--rotation': bar.rotation,
              '--translation': 150,
              transform: `rotate(${bar.rotation}deg) translate(0, 150%)`,
              animation: `spinner-fzua35 1s calc(${bar.delay}s) infinite ease`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Spinner;