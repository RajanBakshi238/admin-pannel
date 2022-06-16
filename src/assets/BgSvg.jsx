const BgSvg = () => {
  return (
    <>
      <svg
        viewBox="0 0 960 540"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMax slice"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 pointer-events-none ng-tns-c192-32"
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="100"
          className="text-gray-700 opacity-25 ng-tns-c192-32"
        >
          <circle r="234" cx="196" cy="23" className="ng-tns-c192-32"></circle>
          <circle r="234" cx="790" cy="491" className="ng-tns-c192-32"></circle>
        </g>
      </svg>

      <svg
        viewBox="0 0 220 192"
        width="220"
        height="192"
        fill="none"
        className="absolute -top-16 -right-16 text-gray-700 ng-tns-c192-32"
      >
        <defs className="ng-tns-c192-32">
          <pattern
            id="837c3e70-6c3a-44e6-8854-cc48c737b659"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
            className="ng-tns-c192-32"
          >
            <rect
              x="0"
              y="0"
              width="4"
              height="4"
              fill="currentColor"
              className="ng-tns-c192-32"
            ></rect>
          </pattern>
        </defs>
        <rect
          width="220"
          height="192"
          fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)"
          className="ng-tns-c192-32"
        ></rect>
      </svg>
    </>
  );
};

export default BgSvg;
