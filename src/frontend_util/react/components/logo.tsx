const SvgComponent = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-40 -40 80 80"
    fill="#000"
    {...props}
  >
    <circle r={39} />
    <path
      fill="white"
      d="M0 38a38 38 0 0 1 0-76A19 19 0 0 1 0 0a19 19 0 0 0 0 38"
    />
    <circle r={5} cy={19} fill="white" />
    <circle r={5} cy={-19} />
  </svg>
);

export default SvgComponent;
